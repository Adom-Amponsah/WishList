import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getWishlistById, removeItemFromWishlist, deleteWishlist, updateWishlistUser } from '../services/wishlistService'
import toast from 'react-hot-toast'
import { FiCalendar, FiGift, FiShare2, FiExternalLink, FiTrash2, FiX, FiLink } from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'

export default function WishlistDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [wishlist, setWishlist] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phone: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [shareableLink, setShareableLink] = useState('')

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo({ top: 0, behavior: 'smooth' })
    
    const loadWishlist = () => {
      const foundWishlist = getWishlistById(id)
      if (foundWishlist) {
        setWishlist(foundWishlist)
      } else {
        toast.error('Wishlist not found')
        navigate('/my-wishlists')
      }
    }
    loadWishlist()
  }, [id, navigate])

  const handleRemoveItem = (itemSku) => {
    const success = removeItemFromWishlist(id, itemSku)
    if (success) {
      // Refresh wishlist data
      setWishlist(getWishlistById(id))
      const toastId = toast.success('Item removed from wishlist')

      // Dismiss the toast after 2 seconds
      setTimeout(() => {
        toast.dismiss(toastId)
      }, 2000)
    }
  }

  const handleDeleteWishlist = () => {
    const success = deleteWishlist(id)
    if (success) {
      toast.success('Wishlist deleted successfully')
      navigate('/my-wishlists')
    } else {
      toast.error('Failed to delete wishlist')
    }
    setShowDeleteModal(false)
  }

  const handleUserDataSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const shareableLink = updateWishlistUser(id, userData);
      if (!shareableLink) {
        throw new Error('Failed to generate share link');
      }

      setShareableLink(shareableLink);
      toast.success('Wishlist shared successfully!');
    } catch (error) {
      console.error('Share error:', error);
      toast.error('Failed to share wishlist');
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareableLink)
      toast.success('Link copied to clipboard!')
    } catch (err) {
      toast.error('Failed to copy link')
    }
  }

  if (!wishlist) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Dynamic Header */}
      <div className="relative h-[300px] md:h-[400px] overflow-hidden">
        {/* Animated background circles */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-white/20"
              initial={{
                width: Math.random() * 100 + 50,
                height: Math.random() * 100 + 50,
                x: Math.random() * 100 + '%',
                y: Math.random() * 300,
                scale: 0
              }}
              animate={{
                x: Math.random() * 100 + '%',
                y: Math.random() * 300,
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3]
              }}
              transition={{
                duration: Math.random() * 5 + 3,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut"
              }}
            />
          ))}
        </div>

        {/* Floating items preview - Adjusted for mobile */}
        <div className="absolute inset-0">
          {wishlist.items.slice(0, 6).map((item, index) => (
            <motion.div
              key={item.id}
              className="absolute"
              initial={{
                x: `${Math.random() * 80 + 10}%`,
                y: `${Math.random() * 80 + 10}%`,
                rotate: Math.random() * 30 - 15,
                scale: 0
              }}
              animate={{
                x: `${Math.random() * 80 + 10}%`,
                y: `${Math.random() * 80 + 10}%`,
                rotate: Math.random() * 30 - 15,
                scale: [0.3, 0.4, 0.3]
              }}
              transition={{
                duration: Math.random() * 5 + 5,
                delay: index * 0.2,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut"
              }}
            >
              <div className="w-16 md:w-24 h-16 md:h-24 rounded-lg overflow-hidden bg-white/80 backdrop-blur-sm shadow-lg hover:scale-150 transition-transform">
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="w-full h-full object-contain"
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Content Overlay */}
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/30 via-black/20 to-black/30 flex items-center">
          <div className="w-full px-4 md:px-6">
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <motion.h1 
                className="text-4xl md:text-6xl lg:text-8xl font-bold mb-4 md:mb-6 text-white"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {wishlist.name}
              </motion.h1>
              <div className="flex flex-col md:flex-row items-center justify-center gap-3 md:gap-6 text-white/90">
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="flex items-center gap-2"
                >
                  <FiCalendar className="text-lg md:text-xl" />
                  <span className="text-sm md:text-base">Created {new Date(wishlist.createdAt).toLocaleDateString()}</span>
                </motion.div>
                <motion.div
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="flex items-center gap-2"
                >
                  <FiGift className="text-lg md:text-xl" />
                  <span className="text-sm md:text-base">{wishlist.eventType}</span>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="container mx-auto px-4 md:px-6 -mt-16 md:-mt-20 relative z-20">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl md:rounded-2xl shadow-lg border border-white/20 mb-6 md:mb-8">
          <div className="flex flex-col md:flex-row justify-between items-center p-4 md:p-6 gap-4 md:gap-8">
            <div className="flex gap-6 md:gap-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5 }}
                className="text-center md:text-left"
              >
                <span className="text-sm text-gray-500">Total Items</span>
                <p className="text-xl md:text-2xl font-bold text-gray-900">{wishlist.items.length}</p>
              </motion.div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.7 }}
                className="text-center md:text-left"
              >
                <span className="text-sm text-gray-500">Total Value</span>
                <p className="text-xl md:text-2xl font-bold text-blue-500">
                  ₵{wishlist.totalPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </p>
              </motion.div>
            </div>
            <button
              onClick={() => setShowShareModal(true)}
              className="w-full md:w-auto px-6 py-3 bg-blue-500 text-white rounded-xl 
                     hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
            >
              <FiShare2 className="w-5 h-5" />
              Share Wishlist
            </button>
          </div>
        </div>

        {/* Items Grid */}
        {wishlist.items.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm">
            <FiGift className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-4">No items in your wishlist yet</h3>
            <button
              onClick={() => navigate(`/wishlist/${id}/add-items`)}
              className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
            >
              Start Adding Items
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {wishlist?.items.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-sm overflow-hidden"
              >
                <div className="aspect-square bg-gray-50">
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">
                    {item.title}
                  </h3>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-semibold text-blue-600">
                        ₵{(item.price * (item.quantity || 1)).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </span>
                      {item.quantity > 1 && (
                        <span className="text-sm text-gray-500">
                          (Qty: {item.quantity})
                        </span>
                      )}
                    </div>
                    {/* <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-500 hover:text-blue-600"
                    >
                      View Item
                    </a> */}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Stats Bar */}
        {/* <div className="mt-8 bg-white rounded-xl shadow-sm p-4 md:p-6">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-1">Total Items</p>
              <p className="text-2xl font-bold text-gray-900">
                {wishlist?.items.reduce((total, item) => total + (item.quantity || 1), 0) || 0}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-1">Unique Items</p>
              <p className="text-2xl font-bold text-gray-900">
                {wishlist?.items.length || 0}
              </p>
            </div>
            <div className="text-center col-span-2 md:col-span-1">
              <p className="text-sm text-gray-500 mb-1">Total Value</p>
              <p className="text-2xl font-bold text-blue-600">
                ₵{(wishlist?.totalPrice || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </div> */}
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
            onClick={() => setShowDeleteModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">Delete Wishlist</h3>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>
              
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete "{wishlist.name}"? This action cannot be undone.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteWishlist}
                  className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Share Modal */}
      <AnimatePresence>
        {showShareModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => !shareableLink && setShowShareModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl"
              onClick={e => e.stopPropagation()}
            >
              {!shareableLink ? (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900">Share Your Wishlist</h3>
                    <button
                      onClick={() => setShowShareModal(false)}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <FiX className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <p className="text-gray-600 mb-6">
                    Please provide your details to create a shareable wishlist link.
                  </p>

                  <form onSubmit={handleUserDataSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Your Name
                      </label>
                      <input
                        type="text"
                        required
                        value={userData.name}
                        onChange={(e) => setUserData(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        value={userData.email}
                        onChange={(e) => setUserData(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your email"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        required
                        value={userData.phone}
                        onChange={(e) => setUserData(prev => ({ ...prev, phone: e.target.value }))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your phone number"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 
                               transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      ) : (
                        <>
                          <FiShare2 className="w-5 h-5" />
                          Create Shareable Link
                        </>
                      )}
                    </button>
                  </form>
                </>
              ) : (
                <>
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FiLink className="w-8 h-8 text-green-500" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Your Wishlist is Ready to Share!</h3>
                    <p className="text-gray-600">Copy the link below to share your wishlist with friends and family.</p>
                  </div>

                  <div className="flex gap-2 mb-6">
                    <input
                      type="text"
                      readOnly
                      value={shareableLink}
                      className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-600"
                    />
                    <button
                      onClick={copyToClipboard}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      Copy
                    </button>
                  </div>

                  <button
                    onClick={() => setShowShareModal(false)}
                    className="w-full px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    Close
                  </button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
} 