import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FiCalendar, FiGift, FiPlus, FiEye, FiTrash2, FiX, FiShoppingBag } from 'react-icons/fi'
import { FaBirthdayCake, FaRing, FaBaby, FaHome, FaGraduationCap, FaTree, FaHeart } from 'react-icons/fa'
import { getAllWishlistsForUser, deleteWishlist } from '../services/wishlistService'
import toast from 'react-hot-toast'

export default function MyWishlists() {
  const [wishlists, setWishlists] = useState([])
  const [deleteModal, setDeleteModal] = useState(null)

  useEffect(() => {
    const lists = getAllWishlistsForUser()
    setWishlists(lists)
  }, [])

  const getEventIcon = (eventType) => {
    switch(eventType.toLowerCase()) {
      case 'birthday':
        return <FaBirthdayCake className="w-6 h-6 text-pink-500" />
      case 'wedding':
        return <FaRing className="w-6 h-6 text-yellow-500" />
      case 'baby shower':
        return <FaBaby className="w-6 h-6 text-blue-500" />
      case 'house warming':
        return <FaHome className="w-6 h-6 text-green-500" />
      case 'graduation':
        return <FaGraduationCap className="w-6 h-6 text-purple-500" />
      case 'christmas':
        return <FaTree className="w-6 h-6 text-red-500" />
      case 'anniversary':
        return <FaHeart className="w-6 h-6 text-red-500" />
      default:
        return <FiGift className="w-6 h-6 text-blue-500" />
    }
  }

  const handleDelete = (id) => {
    const success = deleteWishlist(id)
    if (success) {
      const updatedWishlists = getAllWishlistsForUser()
      setWishlists(updatedWishlists)
      toast.success('Wishlist deleted successfully')
      setDeleteModal(null)
    } else {
      toast.error('Failed to delete wishlist')
    }
  }

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
    ],
    [
      'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1469&q=80',
      'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1469&q=80',
      'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1469&q=80',
    ],
    [
      'https://images.unsplash.com/photo-1523438885200-e635ba2c371e?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      'https://images.unsplash.com/photo-1543269865-cbf427effbad?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
      'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1469&q=80',
    ],
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header with moving images - Adjusted for mobile */}
      <div className="relative h-[300px] md:h-[400px] bg-black overflow-hidden">
        <div className="absolute inset-0 grid grid-cols-3 gap-4 md:flex">
          {columns.map((column, index) => (
            <div key={index} className="flex-1 min-w-0">
              <motion.div
                initial={{ y: index % 2 === 0 ? '0%' : '-100%' }}
                animate={{ y: index % 2 === 0 ? '-100%' : '0%' }}
                transition={{
                  duration: 20 + index * 2,
                  repeat: Infinity,
                  repeatType: 'reverse',
                  ease: 'linear',
                }}
                className="space-y-1 md:space-y-2"
              >
                {[...column, ...column, ...column].map((img, imgIndex) => (
                  <div key={imgIndex} className="h-[200px] md:h-[400px] rounded-lg overflow-hidden">
                    <img src={img} alt="" className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500" />
                  </div>
                ))}
              </motion.div>
            </div>
          ))}
        </div>

        {/* Overlay with content - Adjusted for mobile */}
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/70 via-black/50 to-black/70 flex items-center">
          <div className="w-full px-4 md:px-6">
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2 text-center">My Wishlists</h1>
            <p className="text-base md:text-xl text-white/90 max-w-3xl mx-auto text-center">
              Manage your wishlists for different occasions and keep track of your desired items.
            </p>
          </div>
        </div>
      </div>

      {/* Content Section - Adjusted for mobile */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Create New Wishlist Button */}
        <div className="mb-8 text-center">
          <Link
            to="/events"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 
                     bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors
                     shadow-lg shadow-blue-500/20"
          >
            <FiPlus className="w-5 h-5" />
            Create New Wishlist
          </Link>
        </div>

        {/* Empty State */}
        {wishlists.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm">
            <FiGift className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-4">No wishlists yet</h3>
            <Link
              to="/events"
              className="inline-flex items-center justify-center gap-2 px-6 py-3
                       bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
            >
              <FiPlus className="w-5 h-5" />
              Create Your First Wishlist
            </Link>
          </div>
        )}

        {/* Wishlists Grid - Adjusted for mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {wishlists.map((wishlist) => (
            <motion.div
              key={wishlist.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="group relative"
            >
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-4 md:p-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 md:p-3 bg-gray-50 rounded-xl">
                      {getEventIcon(wishlist.eventType)}
                    </div>
                    <div>
                      <h2 className="text-lg md:text-2xl font-bold text-gray-900 line-clamp-1">{wishlist.name}</h2>
                      <p className="text-sm text-gray-500">{wishlist.eventType}</p>
                    </div>
                    {/* Delete Button - Always Visible */}
                    <button
                      onClick={() => setDeleteModal(wishlist)}
                      className="ml-auto p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                    >
                      <FiTrash2 className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between text-gray-500 text-xs md:text-sm mt-4">
                    <div className="flex items-center gap-1.5 md:gap-2">
                      <FiCalendar className="opacity-75" />
                      <span>{new Date(wishlist.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FiShoppingBag className="w-4 h-4" />
                      <span>{wishlist.items?.length || 0} items</span>
                      <span>•</span>
                      <span>₵{(wishlist.totalPrice || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                    </div>
                  </div>

                  <div className="pt-3 md:pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between mb-3 md:mb-4">
                      <span className="text-sm text-gray-500">Total Value</span>
                      <span className="text-lg md:text-2xl font-bold text-blue-600">
                        ₵{(wishlist.totalPrice || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </span>
                    </div>

                    <div className="flex gap-2 md:gap-3">
                      <Link
                        to={`/wishlist/${wishlist.id}`}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 md:gap-2 px-3 md:px-4 py-2 md:py-2.5
                                 bg-gray-50 text-gray-700 rounded-xl hover:bg-gray-100 transition-colors
                                 border border-gray-200 text-sm md:text-base"
                      >
                        <FiEye className="w-4 h-4" />
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Delete Modal - Adjusted for mobile */}
      <AnimatePresence>
        {deleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setDeleteModal(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl md:rounded-2xl p-5 md:p-6 w-full max-w-sm shadow-xl"
              onClick={e => e.stopPropagation()}
            >
              <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">Delete Wishlist</h3>
              <p className="text-sm md:text-base text-gray-600 mb-6">
                Are you sure you want to delete "{deleteModal.name}"? This action cannot be undone.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteModal(null)}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 text-sm md:text-base"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteModal.id)}
                  className="flex-1 px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 text-sm md:text-base"
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