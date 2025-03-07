import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Package } from 'lucide-react';

const OnboardingTutorial = ({ isVisible, onClose }) => {
  console.log('OnboardingTutorial rendered with isVisible:', isVisible);

  if (!isVisible) {
    console.log('Tutorial not visible, returning null');
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        onClick={onClose}
      >
        <div className="h-full flex items-center justify-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-8 p-4"
          >
            {/* Search Tutorial */}
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex items-center gap-4"
            >
              <div className="bg-white/10 backdrop-blur-md p-4 rounded-full">
                <Search className="w-8 h-8 text-white" />
              </div>
              <p className="text-white text-lg max-w-xs">
                Browse through categories or search for items
              </p>
            </motion.div>

            {/* Custom Add Tutorial */}
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex items-center gap-4"
            >
              <div className="bg-white/10 backdrop-blur-md p-4 rounded-full">
                <Plus className="w-8 h-8 text-white" />
              </div>
              <p className="text-white text-lg max-w-xs">
                Can't find what you're looking for? Add your own custom item
              </p>
            </motion.div>

            {/* Start Button */}
            <motion.button
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
              onClick={onClose}
              className="mx-auto block px-8 py-3 bg-white rounded-full text-[#970058] font-medium
                       hover:bg-opacity-90 transition-all transform hover:scale-105"
            >
              Got it, let's start!
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default OnboardingTutorial;