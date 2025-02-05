import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getSharedWishlist } from '../services/wishlistService';
import { FiMail, FiPhone, FiHome, FiCreditCard, FiGift, FiHeart } from 'react-icons/fi';
import { PaystackButton } from 'react-paystack';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';

export default function SharedWishlist() {
  const { shareId } = useParams();
  const [wishlist, setWishlist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadSharedWishlist = async () => {
      try {
        const data = await getSharedWishlist(shareId);
        if (!data) {
          throw new Error('Wishlist not found');
        }
        setWishlist(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadSharedWishlist();
  }, [shareId]);

  const getPaystackProps = (item) => ({
    email: wishlist?.userData?.email || 'customer@example.com',
    amount: Math.round(item.price * (item.quantity || 1) * 100),
    publicKey: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
    text: 'Pay for Item',
    currency: 'GHS',
    metadata: {
      wishlistId: shareId,
      itemId: item.id,
      custom_fields: [
        {
          display_name: "Item Name",
          variable_name: "item_name",
          value: item.title
        },
        {
          display_name: "For",
          variable_name: "recipient_name",
          value: wishlist?.userData?.name || 'Unknown'
        },
        {
          display_name: "Quantity",
          variable_name: "quantity",
          value: item.quantity || 1
        }
      ]
    },
    onSuccess: (reference) => {
      toast.success(`Payment successful for ${item.quantity || 1}x ${item.title}!`);
      // Here you can add logic to mark the specific item as purchased
    },
    onClose: () => {
      // Handle payment modal close
    }
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Oops!</h2>
          <p className="text-gray-600">{error}</p>
          <Link to="/" className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-700">
            <FiHome className="mr-2" /> Go to Homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 text-white overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute -top-1/2 -right-1/4 w-[400px] h-[400px] bg-white/10 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              rotate: [90, 0, 90],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute -bottom-1/2 -left-1/4 w-[400px] h-[400px] bg-white/10 rounded-full blur-3xl"
          />
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 pt-8 pb-16 md:pt-12 md:pb-20">
          <div className="flex flex-col items-center text-center">
            {/* Content with enhanced animations */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-6 mb-4"
            >
              {/* Animated gift box */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 260,
                  damping: 20
                }}
                className="relative w-16 h-16 md:w-20 md:h-20 shrink-0"
              >
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute inset-0 bg-gradient-to-tr from-white/30 to-white/5 
                           backdrop-blur-sm rounded-xl shadow-2xl transform"
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <FiGift className="w-8 h-8 md:w-10 md:h-10 text-white/90" />
                  </div>
                  <div className="absolute inset-0 bg-white/20 rounded-xl transform rotate-45 scale-50" />
                </motion.div>
              </motion.div>

              <div className="text-left">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="inline-block px-3 py-1 rounded-full 
                           bg-white/10 backdrop-blur-sm text-sm font-medium border border-white/10 mb-2"
                >
                  {wishlist.eventType} Wishlist
                </motion.div>

                <h1 className="text-2xl md:text-4xl font-bold bg-clip-text text-transparent 
                           bg-gradient-to-r from-white via-blue-100 to-white"
                >
                  {wishlist.name}
                </h1>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-sm md:text-base text-blue-100 mt-1"
                >
                  Created with{" "}
                  <motion.span
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="inline-block text-pink-300"
                  >
                    ❤️
                  </motion.span>
                  {" "}by{" "}
                  <span className="font-semibold">
                    {wishlist.userData.name}
                  </span>
                </motion.p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Enhanced decorative bottom curve */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 100"
            className="w-full h-auto fill-gray-50"
            preserveAspectRatio="none"
          >
            <motion.path
              initial={{ d: "M0,96L1440,96L1440,100L0,100Z" }}
              animate={{ 
                d: "M0,16L48,18.7C96,21,192,27,288,40C384,53,480,75,576,77.3C672,80,768,64,864,56C960,48,1056,48,1152,45.3C1248,43,1344,37,1392,34.7L1440,32L1440,100L1392,100C1344,100,1248,100,1152,100C1056,100,960,100,864,100C768,100,672,100,576,100C480,100,384,100,288,100C192,100,96,100,48,100L0,100Z"
              }}
              transition={{
                duration: 1,
                ease: "easeOut",
                delay: 0.2
              }}
            />
          </svg>
        </div>
      </div>

      {/* Items Grid */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.items.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-all"
            >
              {item.image_url && (
                <div className="aspect-square bg-gray-50 relative group">
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="w-full h-full object-contain p-4"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
                </div>
              )}
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                  {item.title}
                </h3>
                
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-2xl font-bold text-blue-600">
                      ₵{(item.price * (item.quantity || 1)).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                    {item.quantity > 1 && (
                      <span className="ml-2 text-sm text-gray-500">
                        (₵{item.price.toLocaleString('en-US', { minimumFractionDigits: 2 })} each × {item.quantity})
                      </span>
                    )}
                  </div>
                </div>

                {item.notes && (
                  <p className="text-gray-600 text-sm mb-4 italic">
                    "{item.notes}"
                  </p>
                )}

                <PaystackButton
                  {...getPaystackProps(item)}
                  className="w-full px-6 py-3 bg-green-500 text-white rounded-xl 
                           hover:bg-green-600 transition-all transform hover:scale-[1.02]
                           flex items-center justify-center gap-2 font-medium"
                >
                  <FiHeart className="w-5 h-5" />
                  Gift This Item
                </PaystackButton>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Total Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 bg-white rounded-xl shadow-sm p-8 text-center"
        >
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Total Wishlist Value</h3>
          <p className="text-4xl font-bold text-blue-600">
            ₵{wishlist.totalPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
        </motion.div>
      </div>
    </div>
  );
} 