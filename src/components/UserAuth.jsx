import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiUser, FiArrowRight, FiUserPlus, FiLogIn, FiEye, FiEyeOff } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { getStoredUser, createUser, verifyUser, checkUsernameExists, setStoredUser } from '../services/userService';
import toast from 'react-hot-toast';
import { 
  getAuth, 
  signInWithPopup, 
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider, 
  browserLocalPersistence,
  setPersistence,
  inMemoryPersistence
} from 'firebase/auth';
import { serverTimestamp, collection, query, where, limit, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';

export default function UserAuth() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasAccount, setHasAccount] = useState(null);

  useEffect(() => {
    // Check if user is already logged in
    const user = getStoredUser();
    if (user) {
      navigate('/events');
    }

    // Check for redirect result
    const auth = getAuth();
    getRedirectResult(auth)
      .then((result) => {
        if (result?.user) {
          handleGoogleUserData(result.user);
        }
      })
      .catch((error) => {
        console.error('Redirect error:', error);
        toast.error('Failed to sign in with Google');
      });
  }, [navigate]);

  const handleInitialChoice = (choice) => {
    setHasAccount(choice);
  };

  const handleExistingUser = async (e) => {
    e.preventDefault();
    
    if (!username.trim() || !password.trim()) {
      toast.error('Please enter both username and password');
      return;
    }

    setIsSubmitting(true);
    try {
      const user = await verifyUser(username.trim(), password);
      if (!user) {
        toast.error('Invalid credentials. Please check your username and password.');
        return;
      }

      toast.success('Welcome back to Nokonice!');
      navigate('/events');
    } catch (error) {
      console.error('Error signing in:', error);
      toast.error('Failed to sign in');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNewUser = async (e) => {
    e.preventDefault();
    
    if (!username.trim() || !password.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);
    try {
      await createUser({
        username: username.trim(),
        password: password.trim()
      });

      toast.success('Welcome to Nokonice!');
      navigate('/events');
    } catch (error) {
      console.error('Error creating account:', error);
      if (error.message === 'Username already taken') {
        toast.error('This username is already taken. Please choose another one.');
      } else {
        toast.error('Failed to create account');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper function to handle Google user data
  const handleGoogleUserData = async (googleUser) => {
    try {
      setIsSubmitting(true);
      // First, check if user exists by uid
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('uid', '==', googleUser.uid), limit(1));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // User exists, get their data and log them in
        const userDoc = querySnapshot.docs[0];
        const userData = {
          id: userDoc.id,
          ...userDoc.data(),
          createdAt: userDoc.data().createdAt?.toDate().toISOString(),
          updatedAt: userDoc.data().updatedAt?.toDate().toISOString()
        };
        setStoredUser(userData);
        toast.success('Welcome back to Nokonice!', { duration: 2000 });
        navigate('/events');
        return;
      }

      // If we get here, user doesn't exist, so create new account
      toast.loading('Creating your account...', { id: 'creating-account', duration: 0 });

      // Create a username from the email (remove @domain.com and special characters)
      const baseUsername = googleUser.email.split('@')[0].replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
      
      // Check if the base username exists
      let username = baseUsername;
      let counter = 1;
      let exists = false;
      
      try {
        exists = await checkUsernameExists(username);
      } catch (error) {
        if (error.message?.includes('ERR_BLOCKED_BY_CLIENT') || error.name === 'FirebaseError') {
          toast.error(
            'It seems your ad blocker is preventing the app from working. Please disable it for this site and try again.',
            { duration: 6000 }
          );
          return;
        }
        throw error;
      }
      
      // If username exists, append numbers until we find a unique one
      while (exists) {
        username = `${baseUsername}${counter}`;
        exists = await checkUsernameExists(username);
        counter++;
      }

      // Create user document with Google info
      const userData = {
        username: username,
        email: googleUser.email,
        displayName: googleUser.displayName,
        photoURL: googleUser.photoURL,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        authProvider: 'google',
        uid: googleUser.uid,
        hasCompletedDetails: false
      };

      let userDoc;
      try {
        userDoc = await createUser(userData);
        toast.dismiss('creating-account');
      } catch (error) {
        toast.dismiss('creating-account');
        if (error.message?.includes('ERR_BLOCKED_BY_CLIENT') || error.name === 'FirebaseError') {
          toast.error(
            'It seems your ad blocker is preventing the app from working. Please disable it for this site and try again.',
            { duration: 6000 }
          );
          return;
        }
        throw error;
      }
      
      if (userDoc) {
        toast.success('Account created successfully! Welcome to Nokonice!', { duration: 3000 });
        navigate('/events');
      } else {
        toast.error('Failed to create user account', { duration: 3000 });
      }
    } catch (error) {
      toast.dismiss('creating-account');
      console.error('Error processing Google sign-in:', error);
      if (error.message?.includes('ERR_BLOCKED_BY_CLIENT') || error.name === 'FirebaseError') {
        toast.error(
          'It seems your ad blocker is preventing the app from working. Please disable it for this site and try again.',
          { duration: 4000 }
        );
      } else {
        toast.error(error.message || 'Failed to process Google sign-in', { duration: 3000 });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    
    try {
      setIsSubmitting(true);
      
      // Try popup first
      try {
        const result = await signInWithPopup(auth, provider);
        await handleGoogleUserData(result.user);
      } catch (popupError) {
        console.log('Popup error:', popupError);
        
        // Check specific error cases
        if (popupError.code === 'auth/popup-blocked') {
          toast.error('Popup was blocked. Trying redirect sign-in instead...', { duration: 3000 });
          await signInWithRedirect(auth, provider);
        } else if (popupError.code === 'auth/unauthorized-domain') {
          toast.error(
            'This domain is not authorized for authentication. Please contact support.',
            { duration: 6000 }
          );
          return;
        } else {
          // For other errors, try redirect
          console.log('Trying redirect sign-in...');
          await signInWithRedirect(auth, provider);
        }
      }
    } catch (error) {
      console.error('Error signing in with Google:', error);
      
      if (error.code === 'auth/cancelled-popup-request') {
        toast.error('Sign-in was cancelled. Please try again.');
      } else {
        toast.error('Failed to sign in. Please try again later.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Initial choice screen
  if (hasAccount === null) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <div className="w-24 h-24 mx-auto mb-4">
                <img 
                  src="/images/Logo_Purple.png" 
                  alt="Nokonice Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Welcome to Nokonice
              </h1>
              {/* <p className="text-gray-600">
                Do you already have an account?
              </p> */}
            </div>

            <div className="space-y-4">
              <button
                onClick={handleGoogleSignIn}
                disabled={isSubmitting}
                className="w-full px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-xl 
                         hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-t-2 border-blue-500 border-solid rounded-full animate-spin"></div>
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <FcGoogle className="w-5 h-5" />
                    Continue with Google
                  </>
                )}
              </button>
              
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or</span>
                </div>
              </div>

              <button
                onClick={() => handleInitialChoice(true)}
                className="w-full px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 
                         transition-colors flex items-center justify-center gap-2"
              >
                <FiLogIn className="w-5 h-5" />
                Yes, I have an account
              </button>
              <button
                onClick={() => handleInitialChoice(false)}
                className="w-full px-6 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 
                         transition-colors flex items-center justify-center gap-2"
              >
                <FiUserPlus className="w-5 h-5" />
                No, create new account
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="w-24 h-24 mx-auto mb-4">
              <img 
                src="/images/Logo_Purple.png" 
                alt="Nokonice Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {hasAccount ? 'Sign In' : 'Create Account'}
            </h1>
            <p className="text-gray-600">
              {hasAccount 
                ? 'Please enter your credentials to continue'
                : 'Create an account to get started with your wishlists'}
            </p>
          </div>

          <form onSubmit={hasAccount ? handleExistingUser : handleNewUser} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                id="username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={hasAccount ? 'Enter your username' : 'Choose a username'}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
                  placeholder={hasAccount ? 'Enter your password' : 'Create a password'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  {showPassword ? (
                    <FiEyeOff className="w-5 h-5" />
                  ) : (
                    <FiEye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full px-6 py-3 text-white rounded-xl
                         transition-colors flex items-center justify-center gap-2 disabled:opacity-50
                         ${hasAccount ? 'bg-blue-500 hover:bg-blue-600' : 'bg-green-500 hover:bg-green-600'}`}
              >
                {isSubmitting ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    {hasAccount ? (
                      <>
                        <FiLogIn className="w-5 h-5" />
                        Sign In
                      </>
                    ) : (
                      <>
                        <FiUserPlus className="w-5 h-5" />
                        Create Account
                      </>
                    )}
                    <FiArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
              
              <button
                type="button"
                onClick={() => setHasAccount(null)}
                className="w-full px-6 py-3 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 
                         transition-colors flex items-center justify-center gap-2"
              >
                Go Back
              </button>
            </div>
          </form>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isSubmitting}
            className="w-full px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-xl 
                     hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-t-2 border-blue-500 border-solid rounded-full animate-spin"></div>
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <FcGoogle className="w-5 h-5" />
                Continue with Google
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
} 