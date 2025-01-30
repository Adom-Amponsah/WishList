import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence, useTransform } from 'framer-motion'
import AddItemModal from './AddItemModal'
import { createWishlist } from '../services/wishlistService'
import toast from 'react-hot-toast'

const WishlistCreator = () => {
  const { eventType } = useParams()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [showAddItems, setShowAddItems] = useState(false)
  const [wishlistId, setWishlistId] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const eventTitles = {
    'birthday': 'Birthday Wishlist',
    'wedding': 'Wedding Registry',
    'baby-shower': 'Baby Shower Registry',
    'housewarming': 'Housewarming Wishlist',
    'graduation': 'Graduation Wishlist'
  }

  const handleCreateWishlist = (e) => {
    e.preventDefault()
    if (!name.trim()) {
      toast.error('Please enter a wishlist name')
      return
    }

    setIsSubmitting(true)
    try {
      const newWishlist = createWishlist(name.trim(), eventType)
      setWishlistId(newWishlist.id)
      toast.success('Wishlist created! Now add some items.')
      setShowAddItems(true)
    } catch (error) {
      toast.error('Failed to create wishlist')
    } finally {
      setIsSubmitting(false)
    }
  }

  const themes = {
    wedding: {
      primary: '#db2777',
      secondary: '#fbcfe8',
      images: {
        gift: 'https://images.unsplash.com/photo-1608755728617-aefab37d2edd?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        money: 'https://images.unsplash.com/photo-1579240637470-e029acf584a9?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
      }
    },
    'baby-shower': {
      primary: '#38bdf8',
      secondary: '#bae6fd',
      images: {
        gift: 'https://images.unsplash.com/photo-1608755728617-aefab37d2edd?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        money: 'https://images.unsplash.com/photo-1579240637470-e029acf584a9?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
      }
    }
  }

  const currentTheme = themes[eventType] || themes.wedding

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-100% via-[#f9f9f9] to-white">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold text-center text-white mb-2">
            {eventTitles[eventType] || 'Create Wishlist'}
          </h1>
          <p className="text-center text-gray-300 mb-8">
            Give your wishlist a name to get started
          </p>

          {!showAddItems ? (
            <form onSubmit={handleCreateWishlist} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                  Wishlist Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter a name for your wishlist"
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg 
                            placeholder-gray-400 focus:ring-2 focus:ring-blue-500 
                            focus:border-blue-500 backdrop-blur-sm "
                  style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                  required
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => navigate('/events')}
                  className="flex-1 px-4 py-2 bg-white/10 text-white rounded-lg 
                            hover:bg-white/20 transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg 
                            hover:bg-blue-600 disabled:opacity-50 transition-colors"
                >
                  {isSubmitting ? 'Creating...' : 'Continue to Add Items'}
                </button>
              </div>
            </form>
          ) : (
            <AddItemModal
              isOpen={true}
              onClose={() => navigate('/my-wishlists')}
              wishlistId={wishlistId}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default WishlistCreator