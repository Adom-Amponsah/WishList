import { useState, useEffect } from 'react'
import { Dialog } from '@headlessui/react'
import { MELCOM_CATEGORIES, scrapeCategory } from '../services/melcomScraper'
import { addItemToWishlist } from '../services/wishlistService'
import toast from 'react-hot-toast'

export default function AddItemModal({ isOpen, onClose, wishlistId }) {
  const [selectedCategory, setSelectedCategory] = useState('')
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [hasNextPage, setHasNextPage] = useState(false)

  const fetchProducts = async (categoryId, page = 1) => {
    setLoading(true)
    setError(null)
    try {
      const result = await scrapeCategory(categoryId, page)
      setProducts(result.products)
      setHasNextPage(result.pagination.hasNextPage)
      setCurrentPage(page)
    } catch (err) {
      setError(err.message)
      setProducts([])
      setHasNextPage(false)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (selectedCategory) {
      setCurrentPage(1)
      fetchProducts(selectedCategory, 1)
    }
  }, [selectedCategory])

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value)
  }

  const handlePageChange = (newPage) => {
    fetchProducts(selectedCategory, newPage)
    // Scroll to top of modal when page changes
    const modalPanel = document.querySelector('.modal-panel')
    if (modalPanel) modalPanel.scrollTop = 0
  }

  const handleAddItem = (product) => {
    try {
      const success = addItemToWishlist(wishlistId, product)
      
      if (success) {
        toast.success('Item added to wishlist!', {
          icon: '🎉',
        })
      } else {
        toast.error('This item is already in your wishlist!', {
          icon: '⚠️',
        })
      }
    } catch (error) {
      toast.error('Failed to add item to wishlist', {
        icon: '❌',
      })
    }
  }

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="modal-panel mx-auto max-w-4xl w-full bg-white rounded-xl p-6 max-h-[90vh] overflow-y-auto">
          <Dialog.Title className="text-2xl font-bold mb-4">Add Item from Melcom</Dialog.Title>
          
          <div className="mb-6">
            <select
              value={selectedCategory}
              onChange={handleCategoryChange}
              className="w-full p-2 border rounded"
              disabled={loading}
            >
              <option value="">Select a category</option>
              {MELCOM_CATEGORIES.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name} ({category.count} items)
                </option>
              ))}
            </select>
          </div>

          {loading && (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              <p className="ml-4 text-lg">Loading products...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {!loading && !error && products.length > 0 && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                {products.map((product) => (
                  <div key={product.sku} className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
                    <img src={product.image} alt={product.title} className="w-full h-48 object-contain mb-2" />
                    <h3 className="font-semibold text-sm mb-1">{product.title}</h3>
                    <p className="text-gray-600">{product.price}</p>
                    <button
                      onClick={() => handleAddItem(product)}
                      className="mt-2 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                    >
                      Add to Wishlist
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center mt-4">
                {currentPage > 1 && (
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={loading}
                    className="px-4 py-2 bg-gray-100 rounded disabled:opacity-50 hover:bg-gray-200"
                  >
                    Previous
                  </button>
                )}
                <span className="text-sm">
                  Page {currentPage}
                </span>
                {hasNextPage && (
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={loading}
                    className="px-4 py-2 bg-gray-100 rounded disabled:opacity-50 hover:bg-gray-200"
                  >
                    Next
                  </button>
                )}
              </div>
            </>
          )}

          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Close
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  )
} 