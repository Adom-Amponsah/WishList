import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { X, Upload, Plus, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';

const AddCustomItemModal = ({ onClose, onAddItem }) => {
  const [itemData, setItemData] = useState({
    title: '',
    price: '',
    image_url: '',
    product_url: '',
    details: '',
    quantity: 1,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!itemData.title || !itemData.price) {
        throw new Error('Title and price are required');
      }

      // Validate and clean up the data before submission
      const customItem = {
        title: itemData.title.trim(),
        price: parseFloat(itemData.price),
        image_url: itemData.image_url || '', // Ensure it's not undefined
        product_url: itemData.product_url || '', // Ensure it's not undefined
        details: itemData.details?.trim() || '', // Ensure it's not undefined
        quantity: parseInt(itemData.quantity) || 1,
        id: `custom-${Date.now()}`,
        category: 'Custom',
        isCustomItem: true // Add a flag to identify custom items
      };

      // Log the item being added
      console.log('Adding custom item:', customItem);

      await onAddItem(customItem);
      toast.success('Item added successfully!');
      onClose();
    } catch (error) {
      console.error('Error adding custom item:', error);
      toast.error(error.message || 'Failed to add item');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5000000) { // 5MB limit
        toast.error('Image size should be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target.result;
        setImagePreview(dataUrl);
        setItemData(prev => ({ ...prev, image_url: dataUrl }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageBoxClick = () => {
    fileInputRef.current?.click();
  };

  const handlePaste = (e) => {
    const items = e.clipboardData?.items;
    if (items) {
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();
          const reader = new FileReader();
          reader.onload = (e) => {
            const dataUrl = e.target.result;
            setImagePreview(dataUrl);
            setItemData(prev => ({ ...prev, image_url: dataUrl }));
          };
          reader.readAsDataURL(file);
          break;
        }
      }
    }
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end md:items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white w-full md:rounded-2xl md:w-full md:max-w-md overflow-hidden
                   rounded-t-2xl max-h-[90vh] overflow-y-auto"
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 500 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#970058] to-[#C21878] p-6 text-white">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Add Item to Wishlist</h2>
            <button 
              onClick={onClose} 
              className="p-1 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6" onPaste={handlePaste}>
          {/* Hidden file input */}
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleFileSelect}
          />

          {/* Image Upload Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Item Image
            </label>
            <div
              onClick={handleImageBoxClick}
              className={`
                w-full h-48 rounded-xl border-2 border-dashed
                ${imagePreview ? 'border-[#970058]/20' : 'border-gray-200'}
                flex items-center justify-center relative group
                transition-all duration-300 hover:border-[#970058]/50
                cursor-pointer
              `}
            >
              {imagePreview ? (
                <>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-contain rounded-xl p-2"
                  />
                  <div className="absolute inset-0 bg-black/50 rounded-xl opacity-0 group-hover:opacity-100 
                                transition-opacity flex items-center justify-center">
                    <p className="text-white text-sm">Click to change image</p>
                  </div>
                </>
              ) : (
                <div className="text-center p-4">
                  <ImageIcon className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-500 font-medium">
                    Click to upload an image
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    or paste an image/URL below
                  </p>
                </div>
              )}
            </div>
            {/* <div className="mt-2 space-y-2">
              <input
                type="url"
                value={itemData.image_url}
                onChange={(e) => {
                  setItemData({ ...itemData, image_url: e.target.value });
                  setImagePreview(e.target.value);
                }}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm
                         focus:ring-2 focus:ring-[#970058] focus:border-transparent"
                placeholder="Or paste image URL here"
              />
              <p className="text-xs text-gray-500">
                Tip: You can also paste (Ctrl+V) an image directly into this form
              </p>
            </div> */}
          </div>

          {/* Item Details */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Item Name *
              </label>
              <input
                type="text"
                value={itemData.title}
                onChange={(e) => setItemData({ ...itemData, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg
                         focus:ring-2 focus:ring-[#970058] focus:border-transparent"
                placeholder="What would you like to receive?"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price (GHS) *
                </label>
                <input
                  type="number"
                  value={itemData.price}
                  onChange={(e) => setItemData({ ...itemData, price: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg
                           focus:ring-2 focus:ring-[#970058] focus:border-transparent"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity
                </label>
                <input
                  type="number"
                  value={itemData.quantity}
                  onChange={(e) => setItemData({ ...itemData, quantity: parseInt(e.target.value) || 1 })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg
                           focus:ring-2 focus:ring-[#970058] focus:border-transparent"
                  min="1"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product URL (Optional)
              </label>
              <input
                type="url"
                value={itemData.product_url}
                onChange={(e) => setItemData({ ...itemData, product_url: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg
                         focus:ring-2 focus:ring-[#970058] focus:border-transparent"
                placeholder="Where can this item be found?"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={itemData.details}
                onChange={(e) => setItemData({ ...itemData, details: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg
                         focus:ring-2 focus:ring-[#970058] focus:border-transparent"
                placeholder="Add any specific details about the item..."
                rows="3"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 bg-[#970058] text-white rounded-xl 
                       hover:bg-[#C21878] transition-all flex items-center justify-center gap-2
                       disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5" />
                  Add to Wishlist
                </>
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-200 text-gray-600 rounded-xl 
                       hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default AddCustomItemModal; 