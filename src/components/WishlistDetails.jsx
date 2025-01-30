import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getWishlistById, removeItemFromWishlist } from '../services/wishlistService'
import toast from 'react-hot-toast'

export default function WishlistDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [wishlist, setWishlist] = useState(null)

  useEffect(() => {
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
      toast.success('Item removed from wishlist')
    }
  }

  if (!wishlist) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading wishlist...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">{wishlist.name}</h1>
          <p className="text-gray-600">Event: {wishlist.eventType}</p>
        </div>
        <button
          onClick={() => navigate('/my-wishlists')}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
        >
          Back to Wishlists
        </button>
      </div>

      <div className="bg-blue-50 rounded-lg p-4 mb-8">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-600">
              Created: {new Date(wishlist.createdAt).toLocaleDateString()}
            </p>
            <p className="text-sm text-gray-600">
              Total Items: {wishlist.items.length}
            </p>
          </div>
          <p className="text-2xl font-bold text-blue-600">
            Total: ₵{wishlist.totalPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      {wishlist.items.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-xl text-gray-600 mb-4">No items in this wishlist yet</p>
          <button
            onClick={() => navigate('/my-wishlists')}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Add Some Items
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.items.map((item) => (
            <div key={item.sku} className="border rounded-lg p-6 hover:shadow-lg transition-shadow bg-white">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-48 object-contain mb-4"
              />
              <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
              <p className="text-xl text-blue-600 mb-2">{item.price}</p>
              <p className="text-sm text-gray-600 mb-4">Category: {item.category}</p>
              
              <div className="flex gap-2">
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 px-4 py-2 bg-blue-500 text-white text-center rounded hover:bg-blue-600"
                >
                  View on Melcom
                </a>
                <button
                  onClick={() => handleRemoveItem(item.sku)}
                  className="px-4 py-2 bg-red-100 text-red-600 rounded hover:bg-red-200"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
} 