import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiUser, FiArrowRight, FiUserPlus, FiLogIn, FiEye, FiEyeOff } from 'react-icons/fi';
import { getStoredUser, createUser, verifyUser } from '../services/userService';
import toast from 'react-hot-toast';

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
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiUser className="w-8 h-8 text-blue-500" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Welcome to Nokonice
              </h1>
              <p className="text-gray-600">
                Do you already have an account?
              </p>
            </div>

            <div className="space-y-4">
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
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              {hasAccount ? (
                <FiLogIn className="w-8 h-8 text-blue-500" />
              ) : (
                <FiUserPlus className="w-8 h-8 text-green-500" />
              )}
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
        </div>
      </motion.div>
    </div>
  );
} 