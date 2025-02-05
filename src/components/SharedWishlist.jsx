import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getSharedWishlist, addContribution } from '../services/wishlistService';
import { FiMail, FiPhone, FiHome, FiCreditCard, FiGift, FiHeart, FiDollarSign, FiUsers, FiCheck } from 'react-icons/fi';
import { PaystackButton } from 'react-paystack';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

export default function SharedWishlist() {
  const { shareId } = useParams();
  const [wishlist, setWishlist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showContributeModal, setShowContributeModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [contributionAmount, setContributionAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

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

  // Function to calculate remaining amount for an item
  const getRemainingAmount = (item) => {
    const totalContributed = (item.contributions || []).reduce((sum, contrib) => sum + contrib.amount, 0);
    return (item.price * (item.quantity || 1)) - totalContributed;
  };

  // Function to get contribution percentage
  const getContributionPercentage = (item) => {
    const totalPrice = item.price * (item.quantity || 1);
    const totalContributed = (item.contributions || []).reduce((sum, contrib) => sum + contrib.amount, 0);
    return (totalContributed / totalPrice) * 100;
  };

  const handleContribute = (item) => {
    setSelectedItem(item);
    setShowContributeModal(true);
  };

  const handlePaystackResponse = async (reference, amount, item, isFullGift = false) => {
    setIsProcessing(true);
    try {
      // Ensure we have all required data and it's properly formatted
      const contributionData = {
        amount: Number(amount),
        reference: reference.reference || '',
        isFullGift: Boolean(isFullGift),
        contributorEmail: reference.customer?.email || reference.email || '',
        contributorName: reference.customer?.name || '',
        status: reference.status || 'success',
        transactionId: reference.transaction || reference.trans || '',
        paidAt: new Date().toISOString(),
        paymentMethod: 'paystack',
        metadata: {
          ...reference,
          raw_response: JSON.stringify(reference)
        }
      };

      console.log('Saving contribution:', contributionData); // Debug log

      const success = await addContribution(shareId, item.id, contributionData);
      if (success) {
        // Refresh wishlist data to update UI
        const updatedWishlist = await getSharedWishlist(shareId);
        if (updatedWishlist) {
          setWishlist(updatedWishlist);
          toast.success(
            isFullGift 
              ? `Successfully gifted ${item.title}!` 
              : `Successfully contributed ₵${amount} towards ${item.title}!`
          );
        } else {
          throw new Error('Failed to refresh wishlist data');
        }
      } else {
        throw new Error('Failed to record contribution');
      }
    } catch (error) {
      console.error('Payment processing error:', error);
      toast.error('Failed to process payment. Please contact support.');
    } finally {
      setIsProcessing(false);
      setShowContributeModal(false);
    }
  };

  const getPaystackProps = (amount, item, isFullGift = false) => ({
    email: wishlist?.userData?.email || 'customer@example.com',
    amount: Math.round(amount * 100), // Convert to pesewas
    publicKey: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
    text: isProcessing ? 'Processing...' : (isFullGift ? 'Gift Entire Item' : 'Contribute'),
    currency: 'GHS',
    metadata: {
      wishlistId: shareId,
      itemId: item.id,
      isFullGift,
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
          display_name: "Contribution Type",
          variable_name: "contribution_type",
          value: isFullGift ? 'Full Gift' : 'Partial Contribution'
        },
        {
          display_name: "Amount",
          variable_name: "amount",
          value: amount
        }
      ]
    },
    onSuccess: (reference) => handlePaystackResponse(reference, amount, item, isFullGift),
    onClose: () => {
      setShowContributeModal(false);
      setIsProcessing(false);
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
                </div>
              )}
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                  {item.title}
                </h3>
                
                <div className="flex flex-col gap-2 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-blue-600">
                      ₵{(item.price * (item.quantity || 1)).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                    {item.quantity > 1 && (
                      <span className="text-sm text-gray-500">
                        (₵{item.price.toLocaleString('en-US', { minimumFractionDigits: 2 })} each × {item.quantity})
                      </span>
                    )}
                  </div>

                  {/* Contribution Progress */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-medium text-blue-600">
                        {getContributionPercentage(item).toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${getContributionPercentage(item)}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="h-full bg-blue-500 rounded-full"
                      />
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">
                        Raised: ₵{((item.contributions || []).reduce((sum, contrib) => sum + contrib.amount, 0)).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </span>
                      <span className="text-gray-600">
                        Left: ₵{getRemainingAmount(item).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {getRemainingAmount(item) === 0 ? (
                    <div className="text-center py-3 bg-green-50 text-green-600 rounded-xl font-medium flex items-center justify-center gap-2">
                      <FiCheck className="w-5 h-5" />
                      Fully Funded! 🎉
                    </div>
                  ) : (
                    <>
                      <button
                        onClick={() => handleContribute(item)}
                        className="w-full px-6 py-3 bg-blue-500 text-white rounded-xl 
                                 hover:bg-blue-600 transition-all transform hover:scale-[1.02]
                                 flex items-center justify-center gap-2 font-medium"
                      >
                        <FiDollarSign className="w-5 h-5" />
                        Contribute
                      </button>

                      <PaystackButton
                        {...getPaystackProps(getRemainingAmount(item), item, true)}
                        className="w-full px-6 py-3 bg-green-500 text-white rounded-xl 
                                 hover:bg-green-600 transition-all transform hover:scale-[1.02]
                                 flex items-center justify-center gap-2 font-medium
                                 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isProcessing}
                      >
                        <FiGift className="w-5 h-5" />
                        {isProcessing ? 'Processing...' : `Gift Remaining (₵${getRemainingAmount(item).toLocaleString('en-US', { minimumFractionDigits: 2 })})`}
                      </PaystackButton>
                    </>
                  )}
                </div>

                {/* Contributors count */}
                {(item.contributions || []).length > 0 && (
                  <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
                    <FiUsers className="w-4 h-4" />
                    <span>{item.contributions.length} contributor{item.contributions.length !== 1 ? 's' : ''}</span>
                  </div>
                )}
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

      {/* Contribute Modal */}
      <AnimatePresence>
        {showContributeModal && selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowContributeModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl p-6 w-full max-w-md"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Contribute to {selectedItem.title}
              </h3>

              <div className="space-y-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Total Price:</span>
                    <span className="font-medium">₵{(selectedItem.price * (selectedItem.quantity || 1)).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Amount Raised:</span>
                    <span className="font-medium text-green-600">
                      ₵{((selectedItem.contributions || []).reduce((sum, contrib) => sum + contrib.amount, 0)).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount Left:</span>
                    <span className="font-medium text-blue-600">
                      ₵{getRemainingAmount(selectedItem).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Your Contribution
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₵</span>
                    <input
                      type="number"
                      value={contributionAmount}
                      onChange={(e) => {
                        const amount = Number(e.target.value);
                        const maxAmount = getRemainingAmount(selectedItem);
                        if (amount > maxAmount) {
                          toast.error(`Maximum contribution amount is ₵${maxAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`);
                          setContributionAmount(maxAmount.toString());
                        } else {
                          setContributionAmount(e.target.value);
                        }
                      }}
                      min="1"
                      max={getRemainingAmount(selectedItem)}
                      step="0.01"
                      className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter amount"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {contributionAmount && Number(contributionAmount) > 0 && Number(contributionAmount) <= getRemainingAmount(selectedItem) && (
                  <PaystackButton
                    {...getPaystackProps(Number(contributionAmount), selectedItem, false)}
                    className="w-full px-6 py-3 bg-blue-500 text-white rounded-xl 
                             hover:bg-blue-600 transition-all flex items-center justify-center gap-2
                             disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isProcessing}
                  />
                )}
                <button
                  onClick={() => setShowContributeModal(false)}
                  className="w-full px-6 py-3 border border-gray-200 text-gray-600 rounded-xl 
                           hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 