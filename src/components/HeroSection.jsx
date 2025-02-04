import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { getUsername } from '../services/wishlistService';
import { FiUser, FiUserPlus } from 'react-icons/fi';

const HeroSection = () => {
  const navigate = useNavigate();
  const username = getUsername(); // Get username once when component mounts
  
  const handleGetStarted = () => {
    if (username) {
      navigate('/events');
    } else {
      navigate('/setup');
    }
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
        flex flex-col items-center justify-center text-white px-4">
        
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
              <span className="text-sm text-yellow-400">No Username Set</span>
            </>
          )}
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl sm:text-6xl md:text-8xl font-bold text-center mb-4 sm:mb-6 bg-clip-text text-transparent 
            bg-gradient-to-r from-white via-gray-200 to-white leading-tight"
        >
          Create Your
          <br className="md:hidden" />
          {" Perfect"}
          <br />
          Wishlist
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg sm:text-xl md:text-2xl text-gray-300 text-center mb-8 sm:mb-12 max-w-3xl px-4"
        >
          Whether it's a wedding, birthday, or any special occasion,
          make your dreams come true with our wishlist platform.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
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
                Continue as @{username}
              </>
            ) : (
              <>
                <FiUserPlus className="w-5 h-5" />
                Set Up Your Username
              </>
            )}
          </button>
        </motion.div>
      </div>
    </div>
  );
}

export default HeroSection;