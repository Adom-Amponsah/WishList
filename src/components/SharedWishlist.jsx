import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getWishlistByShareId } from '../services/wishlistService'
import { FiGift, FiExternalLink, FiShoppingBag, FiMail, FiPhone } from 'react-icons/fi'
import toast from 'react-hot-toast'

export default function SharedWishlist() {
  const { shareId } = useParams()
  const [wishlist, setWishlist] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadWishlist = () => {
      try {
        const foundWishlist = getWishlistByShareId(shareId)
        if (foundWishlist) {
          setWishlist(foundWishlist)
        } else {
          toast.error('Wishlist not found')
        }
      } catch (error) {
        console.error('Error loading wishlist:', error)
        toast.error('Failed to load wishlist')
      } finally {
        setLoading(false)
      }
    }
    loadWishlist()
  }, [shareId])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!wishlist) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <FiGift className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Wishlist Not Found</h1>
          <p className="text-gray-600 mb-4">This wishlist may have been deleted or the link is invalid.</p>
          <a 
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
          >
            Go to Homepage
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-b from-blue-500 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">
                {wishlist.userData?.name}'s Wishlist
              </h1>
              <p className="text-blue-100">
                {wishlist.name} • {wishlist.eventType}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 text-sm md:text-base">
              <div className="px-4 py-2 bg-white/10 rounded-lg backdrop-blur-sm">
                <span>{wishlist.items.reduce((total, item) => total + (item.quantity || 1), 0)} items</span>
              </div>
              <div className="px-4 py-2 bg-white/10 rounded-lg backdrop-blur-sm">
                <span>Total: ₵{wishlist.totalPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Contact Information */}
        {wishlist.userData && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <FiGift className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium">{wishlist.userData.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <FiMail className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <a href={`mailto:${wishlist.userData.email}`} className="font-medium hover:text-blue-500">
                    {wishlist.userData.email}
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <FiPhone className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <a href={`tel:${wishlist.userData.phone}`} className="font-medium hover:text-blue-500">
                    {wishlist.userData.phone}
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Items Grid */}
        {wishlist.items.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm">
            <FiShoppingBag className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600">No items in this wishlist yet</h3>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlist.items.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-sm overflow-hidden group"
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
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-sm text-blue-500 hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      Buy Now
                      <FiExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
} 