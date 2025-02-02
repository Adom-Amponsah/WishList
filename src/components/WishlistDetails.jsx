import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getWishlistById, removeItemFromWishlist, deleteWishlist } from '../services/wishlistService'
import toast from 'react-hot-toast'
import { FiCalendar, FiGift, FiPlus, FiExternalLink, FiTrash2, FiX } from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'

export default function WishlistDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [wishlist, setWishlist] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

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
            <Link
              to={`/wishlist/${id}/add-items`}
              className="w-full md:w-auto px-6 py-3 bg-blue-500 text-white rounded-xl 
                     hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
            >
              <FiPlus className="w-5 h-5" />
              Add More Items
            </Link>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 pb-16">
            {wishlist.items.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-xl md:rounded-2xl shadow-md hover:shadow-lg transition-shadow overflow-hidden
                         border border-gray-100"
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="w-full h-full object-contain transform hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4 md:p-6">
                  <h3 className="font-semibold text-base md:text-lg mb-2 line-clamp-2 text-gray-900">{item.title}</h3>
                  <p className="text-sm text-gray-500 mb-2">{item.category}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg md:text-xl font-bold text-blue-500">₵{item.price.toFixed(2)}</span>
                    <div className="flex gap-2">
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
                        title="View on Melcom"
                      >
                        <FiExternalLink className="w-4 h-4 md:w-5 md:h-5" />
                      </a>
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                        title="Remove from wishlist"
                      >
                        <FiTrash2 className="w-4 h-4 md:w-5 md:h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
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
    </div>
  )
} 