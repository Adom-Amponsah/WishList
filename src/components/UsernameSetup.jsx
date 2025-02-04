import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiUser, FiArrowRight, FiUserPlus, FiLogIn } from 'react-icons/fi';
import { getUsername, setUsername, checkUsernameExists } from '../services/wishlistService';
import toast from 'react-hot-toast';

export default function UsernameSetup() {
  const navigate = useNavigate();
  const [username, setUsernameState] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasUsername, setHasUsername] = useState(null);

  useEffect(() => {
    // Check if username already exists in localStorage
    const existingUsername = getUsername();
    if (existingUsername) {
      navigate('/events');
    }
  }, [navigate]);

  const handleInitialChoice = (choice) => {
    setHasUsername(choice);
  };

  const handleExistingUser = async (e) => {
    e.preventDefault();
    
    if (!username.trim()) {
      toast.error('Please enter your username');
      return;
    }

    setIsSubmitting(true);
    try {
      // Check if username exists
      const exists = await checkUsernameExists(username.trim());
      if (!exists) {
        toast.error('Username not found. Please check your username or create a new one.');
        setIsSubmitting(false);
        return;
      }

      setUsername(username.trim());
      toast.success('Welcome back to WishList!');
      navigate('/events');
    } catch (error) {
      console.error('Error checking username:', error);
      toast.error('Failed to verify username');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNewUser = async (e) => {
    e.preventDefault();
    
    if (!username.trim()) {
      toast.error('Please enter a username');
      return;
    }

    setIsSubmitting(true);
    try {
      // Check if username already exists
      const exists = await checkUsernameExists(username.trim());
      if (exists) {
        toast.error('This username is already taken. Please choose another one.');
        setIsSubmitting(false);
        return;
      }

      setUsername(username.trim());
      toast.success('Welcome to WishList!');
      navigate('/events');
    } catch (error) {
      console.error('Error setting username:', error);
      toast.error('Failed to set username');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Initial choice screen
  if (hasUsername === null) {
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
                Welcome to WishList
              </h1>
              <p className="text-gray-600">
                Do you already have a username?
              </p>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => handleInitialChoice(true)}
                className="w-full px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 
                         transition-colors flex items-center justify-center gap-2"
              >
                <FiLogIn className="w-5 h-5" />
                Yes, I have a username
              </button>
              <button
                onClick={() => handleInitialChoice(false)}
                className="w-full px-6 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 
                         transition-colors flex items-center justify-center gap-2"
              >
                <FiUserPlus className="w-5 h-5" />
                No, create new username
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
              {hasUsername ? (
                <FiLogIn className="w-8 h-8 text-blue-500" />
              ) : (
                <FiUserPlus className="w-8 h-8 text-green-500" />
              )}
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {hasUsername ? 'Enter Your Username' : 'Create New Username'}
            </h1>
            <p className="text-gray-600">
              {hasUsername 
                ? 'Please enter your existing username to continue'
                : 'Choose a username to get started with creating your wishlists'}
            </p>
          </div>

          <form onSubmit={hasUsername ? handleExistingUser : handleNewUser} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                id="username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsernameState(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={hasUsername ? 'Enter your username' : 'Choose a username'}
              />
            </div>

            <div className="space-y-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full px-6 py-3 text-white rounded-xl
                         transition-colors flex items-center justify-center gap-2 disabled:opacity-50
                         ${hasUsername ? 'bg-blue-500 hover:bg-blue-600' : 'bg-green-500 hover:bg-green-600'}`}
              >
                {isSubmitting ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    {hasUsername ? 'Continue' : 'Create Username'}
                    <FiArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
              
              <button
                type="button"
                onClick={() => setHasUsername(null)}
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