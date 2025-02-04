import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence, useTransform } from 'framer-motion'
import AddItemModal from './AddItemModal'
import { createWishlist, getUsername } from '../services/wishlistService'
import toast from 'react-hot-toast'
import { FiPlus, FiChevronLeft } from 'react-icons/fi'

// Import the same event types data
const eventTypes = [
  {
    name: 'Birthday',
    image: 'https://images.unsplash.com/photo-1558636508-e0db3814bd1d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
    properties: 'Celebrate special days'
  },
  {
    name: 'Wedding',
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1469&q=80',
    properties: 'Plan your perfect day'
  },
  {
    name: 'Baby Shower',
    image: 'https://images.unsplash.com/photo-1438962136829-452260720431?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    properties: 'Welcome new arrivals'
  },
  {
    name: 'House Warming',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1473&q=80',
    properties: 'Make a house a home'
  },
  {
    name: 'Graduation',
    image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    properties: 'Celebrate achievements'
  },
  {
    name: 'Christmas',
    image: 'https://images.unsplash.com/photo-1543589923-78e35f728335?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
    properties: 'Spread holiday cheer'
  },
  {
    name: 'Anniversary',
    image: 'https://images.unsplash.com/photo-1523438885200-e635ba2c371e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    properties: 'Celebrate your love'
  },
  {
    name: 'Other',
    image: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
    properties: 'Create custom events'
  }
]

const WishlistCreator = () => {
  const { eventType } = useParams()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [showAddItems, setShowAddItems] = useState(false)
  const [wishlistId, setWishlistId] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [createdWishlistId, setCreatedWishlistId] = useState(null)
  const [wishlistName, setWishlistName] = useState('')

  // Find the event data based on the URL parameter
  const selectedEvent = eventTypes.find(
    event => event.name.toLowerCase().replace(/\s+/g, '-') === eventType
  )

  const handleCreateWishlist = async (e) => {
    e.preventDefault()
    if (!name.trim()) {
      toast.error('Please enter a wishlist name')
      return
    }

    setIsSubmitting(true)
    try {
      const username = getUsername() // Get the username
      if (!username) {
        throw new Error('Please set up your username first')
      }

      const newWishlist = await createWishlist(name.trim(), selectedEvent.name, username)
      setCreatedWishlistId(newWishlist.id)
      setWishlistName(name.trim())
      toast.success('Wishlist created! Now add some items.')
      navigate(`/wishlist/${newWishlist.id}/add-items`)
    } catch (error) {
      console.error('Error creating wishlist:', error)
      toast.error(error.message || 'Failed to create wishlist')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!selectedEvent) {
    navigate('/events')
    return null
  }

  const renderSuccessScreen = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto text-center py-16"
    >
      <div className="mb-8 relative">
        <div className="w-24 h-24 mx-auto bg-green-100 rounded-full flex items-center justify-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <svg
              className="w-12 h-12 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <motion.path
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </motion.div>
        </div>
        
        <motion.div
          initial={{ scale: 1.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.1 }}
          transition={{ duration: 0.5 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-green-500 rounded-full"
        />
      </div>

      <h2 className="text-3xl font-bold text-gray-900 mb-4">
        Wishlist Created Successfully!
      </h2>
      
      <p className="text-gray-600 mb-8 text-lg">
        Your wishlist "{wishlistName}" has been created. Would you like to start adding items to it?
      </p>

      <div className="flex flex-col gap-4 items-center">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate(`/add-items/${createdWishlistId}`)}
          className="w-64 px-8 py-4 bg-blue-500 text-white rounded-xl hover:bg-blue-600 
                   transition-colors shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2"
        >
          <FiPlus className="w-5 h-5" />
          Continue to Add Items
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/my-wishlists')}
          className="text-gray-600 hover:text-gray-800 transition-colors"
        >
          Return to My Wishlists
        </motion.button>
      </div>
    </motion.div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Event Image */}
      <div className="relative h-[400px] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={selectedEvent.image}
            alt={selectedEvent.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        </div>

        {/* Content Overlay */}
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <div className="w-full max-w-md px-6">
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="backdrop-blur-xl bg-white/10 rounded-3xl p-8 shadow-2xl"
            >
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">
                  Create {selectedEvent.name} Wishlist
                </h2>
                <p className="text-white/80">
                  {selectedEvent.properties}
                </p>
              </div>

              <form onSubmit={handleCreateWishlist} className="space-y-6">
                <div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter wishlist name"
                    className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-xl
                             text-white placeholder-white/50 focus:ring-2 focus:ring-white/50
                             focus:border-transparent backdrop-blur-sm"
                    required
                  />
                </div>

                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full px-6 py-4 bg-white text-gray-900 rounded-xl font-semibold
                           hover:bg-white/90 transition-colors flex items-center justify-center gap-2
                           disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FiPlus className="w-5 h-5" />
                  Create Wishlist
                </motion.button>
              </form>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Full-screen Background Image */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: `url(${selectedEvent.image})`,
        }}
      />
      <div className="fixed inset-0 bg-black/40" />

      Navbar
      {/* <div className="relative z-10">
        <nav className="px-8 py-6">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <button
              onClick={() => navigate('/events')}
              className="text-white hover:text-white/80 transition-colors text-lg font-medium
                       flex items-center gap-2"
            >
              <FiChevronLeft className="w-5 h-5" />
              Back to Events
            </button>
            <h1 className="text-2xl font-bold text-white">
              {selectedEvent.name} Wishlist
            </h1>
            <div className="w-[100px]" /> 
          </div>
        </nav>
      </div> */}

      {/* Main Content */}
      {/* <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-100px)] px-4">
        <div className="w-full max-w-xl">
          {!showAddItems ? (
            renderSuccessScreen()
          ) : (
            renderSuccessScreen()
          )}

          <div className="absolute top-[-100px] left-[-100px] w-64 h-64 bg-gradient-to-br from-pink-500/20 to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-[-100px] right-[-100px] w-64 h-64 bg-gradient-to-br from-blue-500/20 to-transparent rounded-full blur-3xl" />
        </div>
      </div> */}
    </div>
  )
}

export default WishlistCreator