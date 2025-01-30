import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getAllWishlists, deleteWishlist } from '../services/wishlistService'
import AddItemModal from './AddItemModal'
import toast from 'react-hot-toast'

export default function WishlistsOverview() {
  const [wishlists, setWishlists] = useState([])
  const [selectedWishlist, setSelectedWishlist] = useState(null)
  const [showAddItems, setShowAddItems] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    setWishlists(getAllWishlists())
  }, [])

  const handleDeleteWishlist = (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      deleteWishlist(id)
      setWishlists(getAllWishlists())
      toast.success(`Deleted wishlist: ${name}`)
    }
  }

  const handleAddItems = (wishlistId) => {
    setSelectedWishlist(wishlistId)
    setShowAddItems(true)
  }

  const handleCloseAddItems = () => {
    setShowAddItems(false)
    setSelectedWishlist(null)
    // Refresh wishlists after adding items
    setWishlists(getAllWishlists())
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Wishlists</h1>
        <Link
          to="/events"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Create New Wishlist
        </Link>
      </div>

      {wishlists.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600 mb-4">You haven't created any wishlists yet</p>
          <Link
            to="/events"
            className="inline-block px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Create Your First Wishlist
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlists.map((wishlist) => (
            <div key={wishlist.id} className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-xl mb-1">{wishlist.name}</h3>
                  <p className="text-sm text-gray-600">Event: {wishlist.eventType}</p>
                </div>
                <button
                  onClick={() => handleDeleteWishlist(wishlist.id, wishlist.name)}
                  className="text-red-500 hover:text-red-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
              
              <div className="mb-4">
                <p className="text-sm text-gray-600">
                  Created: {new Date(wishlist.createdAt).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-600">
                  Items: {wishlist.items.length}
                </p>
                <p className="font-semibold text-lg text-blue-600">
                  Total: ₵{wishlist.totalPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => navigate(`/wishlist/${wishlist.id}`)}
                  className="flex-1 px-4 py-2 bg-blue-500 text-white text-center rounded hover:bg-blue-600"
                >
                  View Details
                </button>
                <button
                  onClick={() => handleAddItems(wishlist.id)}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Add Items
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Items Modal */}
      <AddItemModal
        isOpen={showAddItems}
        onClose={handleCloseAddItems}
        wishlistId={selectedWishlist}
      />
    </div>
  )
} 