import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { getUsername } from '../services/wishlistService';
import { FiUser, FiUserPlus } from 'react-icons/fi';
import { FaInstagram, FaTiktok } from 'react-icons/fa';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXTwitter } from '@fortawesome/free-brands-svg-icons';
import BusinessSection from './BusinessSection';

const HeroSection = () => {
  const navigate = useNavigate();
  const username = getUsername();
  
  const handleGetStarted = () => {
    navigate('/auth');
  };

  // Images for each column (using Unsplash placeholders)
  const columns = [
    [
      'https://images.unsplash.com/photo-1520854221256-17451cc331bf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
      'https://images.unsplash.com/photo-1523438885200-e635ba2c371e?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    ],
    [
      'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
      'https://images.unsplash.com/photo-1543269865-cbf427effbad?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
      'https://images.unsplash.com/photo-1590012314607-cda9d9b699ae?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    ],
    [
      'https://images.unsplash.com/photo-1438962136829-452260720431?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1469&q=80',
      'https://images.unsplash.com/photo-1610478370948-d0b94793b5ec?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    ]
  ];

  return (
    <>
      <div className="relative min-h-screen">
        <div className="fixed inset-0 bg-black">
          {/* Animated columns container */}
          <div className="absolute inset-0 flex px-4 sm:px-6">
            {columns.map((column, index) => (
              <div key={index} className="flex-1 min-w-0 px-2 sm:px-4">
                <motion.div
                  initial={{ y: index % 2 === 0 ? '0%' : '-100%' }}
                  animate={{ y: index % 2 === 0 ? '-100%' : '0%' }}
                  transition={{
                    duration: 20 + index * 2,
                    repeat: Infinity,
                    repeatType: 'reverse',
                    ease: 'linear',
                  }}
                  className="space-y-4 sm:space-y-6"
                >
                  {[...column, ...column, ...column].map((img, imgIndex) => (
                    <div
                      key={imgIndex}
                      className="h-[30vh] sm:h-[40vh] rounded-xl sm:rounded-2xl overflow-hidden shadow-lg"
                    >
                      <img
                        src={img}
                        alt=""
                        className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  ))}
                </motion.div>
              </div>
            ))}
          </div>

          {/* Overlay with content */}
          <div className="fixed inset-0 z-10 bg-gradient-to-b from-black/70 via-black/50 to-black/70 
                        flex items-center justify-center text-white">
            
            {/* Username status indicator */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute top-4 right-4 flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full"
            >
              {username ? (
                <>
                  <FiUser className="text-green-400" />
                  <span className="text-sm text-green-400">@{username}</span>
                </>
              ) : (
                <>
                  <FiUserPlus className="text-yellow-400" />
                  <span className="text-sm text-yellow-400">No Account Set</span>
                </>
              )}
            </motion.div>

            {/* Main content container */}
            <div className="max-w-3xl w-full mx-auto px-4 flex flex-col items-center justify-center space-y-12">
              {/* Brand Logo and Text Animation */}
              <motion.div
                initial={{ opacity: 0, y: -100 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  type: "spring",
                  damping: 12,
                  stiffness: 100,
                  duration: 1.5
                }}
                className="flex flex-col items-center gap-6"
              >
                <img 
                  src="/images/LockUp_White.png" 
                  alt="Nokonice Logo"
                  className="w-full max-w-[300px] md:max-w-[400px] h-auto"
                />
              </motion.div>

              {/* Description Animation */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.8,
                  delay: 1
                }}
                className="text-xl sm:text-2xl md:text-3xl text-blue-100 text-center leading-relaxed"
              >
                Get the gifts you actually want—create a wishlist, share it, and let others buy them for you!
              </motion.p>

              {/* Button Animation */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 1.5 }}
                className="w-full flex justify-center"
              >
                <button
                  onClick={handleGetStarted}
                  className="bg-white/10 border-2 border-white/20 text-white 
                         px-8 sm:px-10 py-4 sm:py-5 rounded-full text-lg sm:text-xl font-semibold
                         hover:bg-white hover:text-black transition-all duration-300
                         hover:border-transparent hover:scale-105 transform
                         active:scale-95 shadow-lg shadow-black/20
                         flex items-center gap-2"
                >
                  {username ? (
                    <>
                      <FiUser className="w-5 h-5" />
                      Sign In to Continue
                    </>
                  ) : (
                    <>
                      <FiUserPlus className="w-5 h-5" />
                      Get Started
                    </>
                  )}
                </button>
              </motion.div>

              {/* Follow Us Section */}
              <div className="flex flex-col items-center bg-white/10 p-6 rounded-lg shadow-lg mt-8">
                <p className="text-sm text-white mb-6">Follow us on:</p>
                <div className="flex space-x-6">
                  <a href="https://www.tiktok.com/@usenokonice" target="_blank" rel="noopener noreferrer">
                    <FaTiktok className="text-3xl text-white hover:text-blue-400 transition duration-300 transform hover:scale-110" />
                  </a>
                  <a href="https://www.instagram.com/usenokonice/" target="_blank" rel="noopener noreferrer">
                    <FaInstagram className="text-3xl text-white hover:text-blue-400 transition duration-300 transform hover:scale-110" />
                  </a>
                  <a href="https://x.com/usenokonice" target="_blank" rel="noopener noreferrer">
                    <FontAwesomeIcon icon={faXTwitter} className="text-3xl text-white hover:text-blue-400 transition duration-300 transform hover:scale-110" />
                  </a>
                </div>
                <p className="text-xs text-white mt-4">Stay updated with our latest news and offers!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Business Section */}
      <BusinessSection />
    </>
  );
}

export default HeroSection;