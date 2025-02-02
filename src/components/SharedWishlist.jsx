import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getWishlistByShareId } from '../services/wishlistService'
import { FiGift, FiExternalLink, FiShoppingBag } from 'react-icons/fi'
import toast from 'react-hot-toast'

export default function SharedWishlist() {
  const { shareId } = useParams()
  const [wishlist, setWishlist] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadWishlist = () => {
      const foundWishlist = getWishlistByShareId(shareId)
      if (foundWishlist) {
        setWishlist(foundWishlist)
      } else {
        toast.error('Wishlist not found')
      }
      setLoading(false)
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
          <p className="text-gray-600">This wishlist may have been deleted or the link is invalid.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                {wishlist.userData?.name}'s Wishlist
              </h1>
              <p className="text-gray-600">
                {wishlist.name} • {wishlist.eventType}
              </p>
            </div>
            <div className="flex items-center gap-4 text-sm md:text-base">
              <div className="px-4 py-2 bg-gray-50 rounded-lg">
                <span className="text-gray-600">{wishlist.items.length} items</span>
              </div>
              <div className="px-4 py-2 bg-blue-50 rounded-lg">
                <span className="text-blue-600 font-medium">
                  Total: ₵{wishlist.totalPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
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
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-sm text-blue-500 hover:text-blue-600"
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

        {/* Contact Information */}
        {wishlist.userData && (
          <div className="mt-8 bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Name</p>
                <p className="font-medium">{wishlist.userData.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Email</p>
                <p className="font-medium">{wishlist.userData.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Phone</p>
                <p className="font-medium">{wishlist.userData.phone}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 