import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

// Function to sanitize the description
const sanitizeDescription = (description) => {
  if (!description) return '';
  
  // Define the unwanted phrases
  const unwantedPhrases = [
    "Fixing available on request post the delivery Only",
    "Kindly call for scheduling the same at",
    "0596911818",
    "write at order@melcomgroup.com",
    "order@melcomgroup.com",
    "melcomgroup.com",
    "CANT YOU DO THIS",
    "or write at"
  ];

  // Remove unwanted phrases from the description
  let sanitizedDescription = description;
  unwantedPhrases.forEach(phrase => {
    sanitizedDescription = sanitizedDescription.replace(new RegExp(phrase, 'gi'), '');
  });

  // Remove any additional unwanted text patterns
  sanitizedDescription = sanitizedDescription.replace(/DESCRIPTION\s+/gi, ''); // Remove the word "DESCRIPTION" if it appears
  sanitizedDescription = sanitizedDescription.replace(/\s+/g, ' ').trim(); // Normalize whitespace
  
  // Clean up any trailing punctuation or partial phrases that might remain
  sanitizedDescription = sanitizedDescription.replace(/,\s*$/g, ''); // Remove trailing commas
  sanitizedDescription = sanitizedDescription.replace(/\.\s*$/g, '.'); // Ensure proper period at the end if needed
  
  // Clean up any double spaces that might have been created during removal
  sanitizedDescription = sanitizedDescription.replace(/\s{2,}/g, ' ').trim();

  return sanitizedDescription; // Return the cleaned description
};

const ItemDetailModal = ({ item, onClose }) => {
  if (!item) return null;

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center bg-black/50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white rounded-lg p-4 max-w-md w-full mx-4 sm:mx-0"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.8 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-2 right-2">
          <X className="w-6 h-6 text-gray-600" />
        </button>
        <h2 className="text-lg font-semibold mb-2">{item.title}</h2>
        <div className="w-full h-32 relative mb-4">
          <img
            src={item.image_url}
            alt={item.title}
            className="w-full h-full object-contain rounded"
          />
        </div>
        <p className="text-gray-700 mb-1">Price: <span className="font-bold">₵{item.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span></p>
        <div className="mb-2">
          <span className="font-bold">Description:</span>
          <div className="max-h-32 overflow-y-auto text-gray-600 mt-1">
            {sanitizeDescription(item.details) || 'No description available.'}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ItemDetailModal;