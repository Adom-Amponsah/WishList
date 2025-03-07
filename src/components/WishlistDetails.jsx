import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getWishlistById, removeItemFromWishlist, deleteWishlist, updateWishlistUser, updateItemQuantity } from '../services/wishlistService'
import { getUserDetails, updateUserDetails, getStoredUser, logoutUser } from '../services/userService'
import { encodeWishlistToURL } from '../utils/wishlistUrlUtils'
import toast from 'react-hot-toast'
import { FiCalendar, FiGift, FiShare2, FiExternalLink, FiTrash2, FiX, FiLink, FiEdit2, FiPlus, FiMinus, FiCheck, FiLogOut, FiMail, FiPhone, FiHome, FiArrowRight, FiList, FiCopy, FiInstagram } from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { 
  WhatsappShareButton, WhatsappIcon,
  TelegramShareButton, TelegramIcon,
  TwitterShareButton, TwitterIcon,
  FacebookShareButton, FacebookIcon
} from 'react-share'

export default function WishlistDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  
  // Add refs for form inputs
  const nameRef = useRef(null)
  const emailRef = useRef(null)
  const phoneRef = useRef(null)
  const dobRef = useRef(null)
  const locationRef = useRef(null)
  
  const [wishlist, setWishlist] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showUserForm, setShowUserForm] = useState(false)
  const [showDataForm, setShowDataForm] = useState(false)
  const [userDetails, setUserDetails] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [shareableLink, setShareableLink] = useState('')
  const [isSharing, setIsSharing] = useState(false)
  const [shareSuccess, setShareSuccess] = useState('')
  const [shareError, setShareError] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo({ top: 0, behavior: 'smooth' })
    loadWishlist()
    checkUserDetails()
  }, [id])

  const checkUserDetails = async () => {
    try {
      const user = getStoredUser()
      if (!user?.id) return

      const details = await getUserDetails(user.id)
      if (details?.hasCompletedDetails) {
        setUserDetails(details)
      }
    } catch (error) {
      console.error('Error checking user details:', error)
    }
  }

  const loadWishlist = async () => {
    try {
      setIsLoading(true)
      const foundWishlist = await getWishlistById(id)
      if (foundWishlist) {
        setWishlist(foundWishlist)
      } else {
        toast.error('Wishlist not found')
        navigate('/my-wishlists')
      }
    } catch (error) {
      console.error('Error loading wishlist:', error)
      toast.error('Failed to load wishlist')
      navigate('/my-wishlists')
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemoveItem = async (itemId) => {
    try {
      const success = await removeItemFromWishlist(id, itemId)
      if (success) {
        // Refresh wishlist data
        await loadWishlist()
        const toastId = toast.success('Item removed from wishlist')

        // Dismiss the toast after 2 seconds
        setTimeout(() => {
          toast.dismiss(toastId)
        }, 2000)
      }
    } catch (error) {
      console.error('Error removing item:', error)
      toast.error('Failed to remove item')
    }
  }

  const handleDeleteWishlist = async () => {
    try {
      const success = await deleteWishlist(id)
      if (success) {
        toast.success('Wishlist deleted successfully')
        navigate('/my-wishlists')
      } else {
        toast.error('Failed to delete wishlist')
      }
    } catch (error) {
      console.error('Error deleting wishlist:', error)
      toast.error('Failed to delete wishlist')
    } finally {
      setShowDeleteModal(false)
    }
  }

  const handleUserDataSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const userData = {
        name: nameRef.current.value,
        email: emailRef.current.value,
        phone: phoneRef.current.value,
        dateOfBirth: dobRef.current.value,
        location: locationRef.current.value
      }

      // Validate required fields
      if (!userData.name || !userData.email || !userData.phone || !userData.dateOfBirth || !userData.location) {
        toast.error('Please fill in all fields')
        return
      }

      // Update user details in users collection
      const user = getStoredUser()
      if (user?.id) {
        await updateUserDetails(user.id, userData)
      }

      // Update wishlist with user data
      const shareableUrl = await updateWishlistUser(id, userData)
      if (shareableUrl) {
        setUserDetails(userData)
        setShareableLink(shareableUrl)
        toast.success('Wishlist updated successfully!')
      } else {
        toast.error('Failed to update wishlist')
      }
    } catch (error) {
      console.error('Error updating wishlist:', error)
      toast.error(error.message || 'Failed to update wishlist')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleShare = async () => {
    if (shareableLink) {
      // If we already have a shareable link, copy it
      try {
        await navigator.clipboard.writeText(shareableLink);
        toast.success('Link copied to clipboard!');
      } catch (error) {
        console.error('Share error:', error);
        toast.error('Failed to copy link');
      }
      return;
    }

    // If we don't have a link yet, check user details and generate one
    try {
      setIsSharing(true);
      const user = getStoredUser();
      if (!user?.id) {
        toast.error('Please sign in to share your wishlist');
        return;
      }

      // Check if user has completed details
      const details = await getUserDetails(user.id);
      if (details?.hasCompletedDetails) {
        // User has details, directly generate and show link
        const shareableUrl = await updateWishlistUser(id, details);
        if (shareableUrl) {
          setShareableLink(shareableUrl);
          setShowUserForm(true); // Show modal with just the link
          toast.success('Your wishlist is ready to share!');
        } else {
          toast.error('Failed to generate shareable link');
        }
      } else {
        // User needs to fill in details
        setShowUserForm(true); // Show form to collect details
      }
    } catch (error) {
      console.error('Error sharing wishlist:', error);
      toast.error('Failed to share wishlist');
    } finally {
      setIsSharing(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      toast.success('Logged out successfully');
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to logout');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!wishlist) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Wishlist Not Found</h2>
          <p className="text-gray-600 mb-8">The wishlist you're looking for doesn't exist or has been deleted.</p>
          <Link
            to="/my-wishlists"
            className="inline-flex items-center justify-center gap-2 px-6 py-3
                     bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
          >
            Return to My Wishlists
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
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

        {/* Content Overlay */}
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/30 via-black/20 to-black/30">
          {/* Add My Wishlists button to top-left */}
          <div className="absolute top-4 left-4 z-20">
            <button
              onClick={() => navigate('/my-wishlists')}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl 
                       transition-colors flex items-center justify-center gap-2 backdrop-blur-sm"
            >
              <FiList className="w-5 h-5" />
              <span className="text-sm">My Wishlists</span>
            </button>
          </div>

          {/* Add logout button to top-right */}
          <div className="absolute top-4 right-4 z-20">
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl 
                       transition-colors flex items-center justify-center gap-2 backdrop-blur-sm"
            >
              <FiLogOut className="w-5 h-5" />
              <span className="text-sm">Logout</span>
            </button>
          </div>
          
          <div className="h-full flex items-center">
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
                <p className="text-xl md:text-2xl font-bold text-[#970058]">
                  ₵{wishlist.totalPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </p>
              </motion.div>
            </div>
            <button
              onClick={handleShare}
              disabled={isSharing}
              className="w-full md:w-auto px-6 py-3 bg-[#970058] text-white rounded-xl 
                       hover:bg-[#C21878] transition-colors flex items-center justify-center gap-2
                       disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {isSharing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span className="text-sm sm:text-base">Generating Link...</span>
                </>
              ) : (
                <>
                  <FiShare2 className="w-5 h-5" />
                  <span className="text-sm sm:text-base">Share Wishlist</span>
                </>
              )}
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
              className="px-6 py-3 bg-[#970058] text-white rounded-xl hover:bg-[#C21878] transition-colors"
            >
              Start Adding Items
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-6">
            {wishlist?.items.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg md:rounded-xl shadow-sm overflow-hidden"
              >
                <div className="aspect-square bg-gray-50">
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="w-full h-full object-contain p-2 md:p-4"
                  />
                </div>
                <div className="p-2 md:p-4">
                  <h3 className="font-medium text-gray-900 mb-1 md:mb-2 text-sm md:text-base line-clamp-2">
                    {item.title}
                  </h3>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 md:gap-2">
                      <span className="text-base md:text-lg font-semibold text-[#970058]">
                        ₵{(item.price * (item.quantity || 1)).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </span>
                      {item.quantity > 1 && (
                        <span className="text-xs md:text-sm text-gray-500">
                          (Qty: {item.quantity})
                        </span>
                      )}
                    </div>
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
      {showUserForm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => !shareableLink && setShowUserForm(false)}
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
                <AnimatePresence mode="wait">
                  {!showDataForm ? (
                    <motion.div
                      key="info-screen"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold text-gray-900">Before We Share Your Wishlist</h3>
                        <button
                          onClick={() => setShowUserForm(false)}
                          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                          <FiX className="w-5 h-5" />
                        </button>
                      </div>

                      <motion.div 
                        className="bg-blue-50 border border-blue-100 rounded-xl p-6 mb-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <motion.h4 
                          className="text-lg font-semibold text-blue-800 mb-4"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.3 }}
                        >
                          We Will Need Your Information
                        </motion.h4>
                        <motion.ul 
                          className="text-base text-blue-700 space-y-4"
                          initial="hidden"
                          animate="visible"
                          variants={{
                            visible: {
                              transition: {
                                staggerChildren: 0.1
                              }
                            }
                          }}
                        >
                          <motion.li 
                            className="flex items-start gap-3"
                            variants={{
                              hidden: { opacity: 0, x: -20 },
                              visible: { opacity: 1, x: 0 }
                            }}
                          >
                            <span className="text-blue-500 mt-1">•</span>
                            To help gift-givers identify who they're buying for
                          </motion.li>
                          <motion.li 
                            className="flex items-start gap-3"
                            variants={{
                              hidden: { opacity: 0, x: -20 },
                              visible: { opacity: 1, x: 0 }
                            }}
                          >
                            <span className="text-blue-500 mt-1">•</span>
                            To ensure gifts are delivered to the correct address
                          </motion.li>
                          <motion.li 
                            className="flex items-start gap-3"
                            variants={{
                              hidden: { opacity: 0, x: -20 },
                              visible: { opacity: 1, x: 0 }
                            }}
                          >
                            <span className="text-blue-500 mt-1">•</span>
                            To notify you when someone contributes to your wishlist
                          </motion.li>
                        </motion.ul>
                        <motion.p 
                          className="text-sm text-blue-600 mt-6 border-t border-blue-100 pt-4"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.6 }}
                        >
                          Your information is secure and will only be shared with confirmed gift-givers.
                        </motion.p>
                      </motion.div>

                      <motion.button
                        onClick={() => setShowDataForm(true)}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.7 }}
                        className="w-full px-6 py-3 bg-[#970058] text-white rounded-xl font-medium
                                 hover:bg-[#C21878] transition-colors flex items-center justify-center gap-2"
                      >
                        Continue to Details
                        <FiArrowRight className="w-5 h-5" />
                      </motion.button>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="form-screen"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                    >
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-gray-900">Enter Your Details</h3>
                        <button
                          onClick={() => setShowUserForm(false)}
                          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                          <FiX className="w-5 h-5" />
                        </button>
                      </div>
                
                      <form onSubmit={handleUserDataSubmit} className="space-y-4">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                            Full Name
                          </label>
                          <input
                            id="name"
                            ref={nameRef}
                            type="text"
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter your full name"
                          />
                        </div>

                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            Email Address
                          </label>
                          <div className="relative">
                            <input
                              id="email"
                              ref={emailRef}
                              type="email"
                              required
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Enter your email"
                            />
                            <FiMail className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                          </div>
                        </div>

                        <div>
                          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                            Phone Number
                          </label>
                          <div className="relative">
                            <input
                              id="phone"
                              ref={phoneRef}
                              type="tel"
                              required
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Enter your phone number"
                            />
                            <FiPhone className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                          </div>
                        </div>

                        <div>
                          <label htmlFor="dob" className="block text-sm font-medium text-gray-700 mb-1">
                            Date of Birth
                          </label>
                          <input
                            id="dob"
                            ref={dobRef}
                            type="date"
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>

                        <div>
                          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                            Delivery Address
                          </label>
                          <div className="relative">
                            <textarea
                              id="location"
                              ref={locationRef}
                              required
                              rows="2"
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Enter your full delivery address"
                            ></textarea>
                            <FiHome className="absolute right-3 top-3 text-gray-400 w-5 h-5" />
                          </div>
                        </div>

                        <div className="flex gap-3 pt-4">
                          <button
                            type="button"
                            onClick={() => setShowDataForm(false)}
                            className="flex-1 px-4 py-3 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition-colors"
                          >
                            Back
                          </button>
                          <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 px-6 py-3 bg-[#970058] text-white rounded-xl font-medium
                                     hover:bg-[#C21878] transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                                     flex items-center justify-center gap-2"
                          >
                            {isSubmitting ? (
                              <>
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                <span>Updating...</span>
                              </>
                            ) : (
                              <>
                                <FiShare2 className="w-5 h-5" />
                                <span>Share Wishlist</span>
                              </>
                            )}
                          </button>
                        </div>
                      </form>
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            ) : (
              <>
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FiLink className="w-8 h-8 text-green-500" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Your Wishlist is Ready to Share!</h3>
                  <p className="text-gray-600">Share your wishlist on your favorite platform</p>
                </div>

                {/* Social Share Buttons */}
                <div className="flex justify-center gap-4 mb-6">
                  <button 
                    onClick={() => {
                      const whatsappUrl = `https://wa.me/?text=Check out my wishlist! ${shareableLink}`;
                      window.open(whatsappUrl, '_blank');
                    }}
                    className="flex flex-col items-center gap-1"
                  >
                    <div className="w-10 h-10 rounded-full bg-[#25D366] flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                    </div>
                    <span className="text-xs text-gray-600">WhatsApp</span>
                  </button>

                  <button 
                    onClick={() => {
                      const telegramUrl = `https://t.me/share/url?url=${shareableLink}&text=Check out my wishlist!`;
                      window.open(telegramUrl, '_blank');
                    }}
                    className="flex flex-col items-center gap-1"
                  >
                    <div className="w-10 h-10 rounded-full bg-[#0088cc] flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18 1.897-.962 6.502-1.359 8.627-.168.9-.5 1.201-.82 1.23-.697.064-1.226-.461-1.901-.903-1.056-.692-1.653-1.123-2.678-1.799-1.185-.781-.417-1.21.258-1.911.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.139-5.062 3.345-.479.329-.913.489-1.302.481-.428-.008-1.252-.241-1.865-.44-.752-.244-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.831-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635.099-.002.321.023.465.178.119.13.154.305.164.383.005.038.012.188-.013.294z"/>
                      </svg>
                    </div>
                    <span className="text-xs text-gray-600">Telegram</span>
                  </button>

                  <button 
                    onClick={() => {
                      const twitterUrl = `https://twitter.com/intent/tweet?text=Check out my wishlist!&url=${shareableLink}`;
                      window.open(twitterUrl, '_blank');
                    }}
                    className="flex flex-col items-center gap-1"
                  >
                    <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center">
                      <FiX className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xs text-gray-600">X</span>
                  </button>

                  <button 
                    onClick={() => {
                      const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${shareableLink}`;
                      window.open(facebookUrl, '_blank');
                    }}
                    className="flex flex-col items-center gap-1"
                  >
                    <div className="w-10 h-10 rounded-full bg-[#1877f2] flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                    </div>
                    <span className="text-xs text-gray-600">Facebook</span>
                  </button>

                  <button 
                    onClick={() => {
                      const instagramUrl = `instagram://library?AssetPath=null&text=Check out my wishlist! ${shareableLink}`;
                      window.location.href = instagramUrl;
                      setTimeout(() => {
                        window.open('https://www.instagram.com', '_blank');
                      }, 1000);
                    }}
                    className="flex flex-col items-center gap-1"
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 
                                    flex items-center justify-center">
                      <FiInstagram className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xs text-gray-600">Instagram</span>
                  </button>
                </div>

                {/* Copy Link Section */}
                <div className="bg-gray-50 p-4 rounded-xl mb-6">
                  <p className="text-sm text-gray-600 mb-2">Or copy the link manually:</p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      readOnly
                      value={shareableLink}
                      className="flex-1 px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-600 text-sm"
                      onClick={(e) => e.target.select()}
                    />
                    <button
                      onClick={handleShare}
                      className="px-4 py-2 bg-[#970058] text-white rounded-lg hover:bg-[#C21878] transition-colors
                               flex items-center gap-2 text-sm"
                    >
                      <FiCopy className="w-4 h-4" />
                      Copy
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setShowUserForm(false)
                    setShareableLink('')
                  }}
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