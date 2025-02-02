import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { getWishlistById, addItemToWishlist, removeItemFromWishlist, getAllWishlists, updateItemQuantity } from '../services/wishlistService'
import { getAllCategories, getProductsByCategory, searchProducts } from '../services/supabase'
import toast from 'react-hot-toast'
import { FiSearch, FiShoppingBag, FiX, FiChevronLeft, FiChevronRight, FiTrash2, FiPlus, FiCheck, FiMinus } from 'react-icons/fi'

export default function AddItemsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [wishlist, setWishlist] = useState(null)
  const [showCart, setShowCart] = useState(false)
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [hasNextPage, setHasNextPage] = useState(false)
  const [totalItems, setTotalItems] = useState(0)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  // Fetch wishlist data
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

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await getAllCategories()
        setCategories(categoriesData)
      } catch (error) {
        toast.error('Failed to load categories')
        console.error('Error loading categories:', error)
      }
    }
    fetchCategories()
  }, [])

  // Fetch products when category changes
  const fetchProducts = async (category, page = 1) => {
    setLoading(true)
    try {
      let result
      if (searchQuery.trim()) {
        result = await searchProducts(searchQuery, page, itemsPerPage)
      } else if (category) {
        result = await getProductsByCategory(category, page, itemsPerPage)
      } else {
        result = { products: [], totalCount: 0, hasNextPage: false, currentPage: 1 }
      }

      setProducts(result.products)
      setHasNextPage(result.hasNextPage)
      setCurrentPage(result.currentPage)
      setTotalItems(result.totalCount)

      if (result.products.length === 0) {
        toast.info('No products found')
      }
    } catch (error) {
      toast.error('Failed to load products')
      console.error('Error loading products:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCategorySelect = async (category) => {
    setSelectedCategory(category)
    setSearchQuery('') // Clear search when category changes
    setCurrentPage(1)
    await fetchProducts(category, 1)
  }

  const handleSearch = async (e) => {
    e?.preventDefault()
    if (!searchQuery.trim()) {
      toast.error('Please enter a search term')
      return
    }

    setLoading(true)
    try {
      const result = await searchProducts(searchQuery, 1, itemsPerPage)
      setProducts(result.products)
      setHasNextPage(result.hasNextPage)
      setCurrentPage(1)
      setTotalItems(result.totalCount)

      if (result.products.length === 0) {
        toast.info('No products found for your search')
      } else {
        toast.success(`Found ${result.totalCount} items`)
      }
    } catch (error) {
      console.error('Search error:', error)
      toast.error('Failed to search products')
    } finally {
      setLoading(false)
    }
  }

  const handlePageChange = async (newPage) => {
    setCurrentPage(newPage)
    if (selectedCategory) {
      await fetchProducts(selectedCategory, newPage)
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const isItemInWishlist = (id) => {
    return wishlist?.items.some(item => item.id === id) || false
  }

  const handleAddItem = async (product) => {
    const success = addItemToWishlist(id, product)
    if (success) {
      const updatedWishlist = getWishlistById(id)
      setWishlist(updatedWishlist)
      const toastId = toast.success('Item added to wishlist!', { icon: '🎉' })

      // Dismiss the toast after 2 seconds
      setTimeout(() => {
        toast.dismiss(toastId)
      }, 2000)
    } else {
      toast.error('This item is already in your wishlist!', { icon: '⚠️' })
    }
  }

  const handleRemoveItem = (itemId) => {
    const success = removeItemFromWishlist(id, itemId)
    if (success) {
      setWishlist(getWishlistById(id))
      toast.success('Item removed from wishlist')
    } else {
      toast.error('Failed to remove item')
    }
  }

  const handleQuantityChange = (itemId, change) => {
    const success = updateItemQuantity(id, itemId, Math.max(1, (wishlist?.items.find(item => item.id === itemId)?.quantity || 1) + change))
    if (success) {
      setWishlist(getWishlistById(id))
    }
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      {/* Mobile Header */}
      <div className="md:hidden sticky top-0 z-30 bg-white shadow-sm p-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(`/wishlist/${id}`)}
            className="flex items-center gap-2 text-gray-600"
          >
            <FiChevronLeft className="w-5 h-5" />
            Back
          </button>
          <button
            onClick={() => setShowCart(!showCart)}
            className="relative p-2 text-gray-600"
          >
            <FiShoppingBag className="w-6 h-6" />
            {wishlist?.items.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {wishlist.items.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Left Side - Categories and Search Results */}
      <div className={`w-full md:w-[70%] bg-white ${showCart ? 'hidden md:block' : 'block'}`}>
        <div className="p-4 md:p-8">
          <div className="mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl font-bold">Add Items to {wishlist?.name}</h1>
          </div>

          {/* Categories Section - Grid layout on mobile */}
          <div className="mb-6 md:mb-8">
            <h2 className="text-xl font-semibold mb-4">Categories</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:flex md:flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategorySelect(category.name)}
                  className={`w-full md:w-auto px-4 py-2 rounded-full transition-all text-center ${selectedCategory === category.name
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* Search Section */}
          <div className="mb-6 md:mb-8">
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="flex-1 relative">
                <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for items..."
                  className="w-full pl-12 pr-4 py-3 md:py-4 border-2 border-gray-200 rounded-xl 
                           focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button
                type="submit"
                className="px-6 md:px-8 py-3 md:py-4 bg-blue-500 text-white rounded-xl hover:bg-blue-600
                         whitespace-nowrap"
              >
                Search
              </button>
            </form>
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-4 w-full"
                  >
                    <div className="aspect-square mb-3">
                      <img
                        src={product.image_url}
                        alt={product.title}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <h3 className="text-sm md:text-lg font-semibold mb-2 line-clamp-2">{product.title}</h3>
                    <div className="flex flex-col gap-1 mb-3">
                      <span className="text-base md:text-lg font-bold text-blue-600">₵{product.price.toFixed(2)}</span>
                      <span className="text-xs md:text-sm text-gray-600">{product.category}</span>
                    </div>
                    <button
                      onClick={() => handleAddItem(product)}
                      disabled={isItemInWishlist(product.id)}
                      className={`w-full py-2 rounded transition-colors flex items-center justify-center gap-2
                        ${isItemInWishlist(product.id)
                          ? 'bg-green-500 text-white cursor-not-allowed'
                          : 'bg-blue-500 text-white hover:bg-blue-600'
                        }`}
                    >
                      {isItemInWishlist(product.id) ? (
                        <>
                          <FiCheck /> Added to Wishlist
                        </>
                      ) : (
                        <>
                          <FiPlus /> Add to Wishlist
                        </>
                      )}
                    </button>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {products.length > 0 && (
                <div className="flex justify-between items-center mt-6 md:mt-8">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 rounded-lg text-sm ${currentPage === 1
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-blue-500 hover:bg-gray-50'
                      }`}
                  >
                    Previous
                  </button>
                  <span className="text-sm text-gray-600">
                    {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems}
                  </span>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={!hasNextPage}
                    className={`px-4 py-2 rounded-lg text-sm ${!hasNextPage
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-blue-500 hover:bg-gray-50'
                      }`}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Right Side - Added Items */}
      <div id="cart-section" className={`w-full md:w-[30%] bg-gray-50 p-4 md:p-6 overflow-y-auto ${!showCart ? 'hidden md:block' : 'block'}`}>
        <div className="sticky top-0 bg-gray-50 pb-4 mb-4">
          <h2 className="text-xl font-semibold mb-2">Added Items</h2>
          <p className="text-sm text-gray-600">
            {wishlist?.items.length || 0} items • Total: ₵
            {wishlist?.totalPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
        </div>

        <div className="space-y-3 md:space-y-4">
          <AnimatePresence>
            {wishlist?.items.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex gap-3 md:gap-4 bg-white p-3 md:p-4 rounded-lg shadow-sm relative"
              >
                <img src={item.image_url} alt={item.title} className="w-16 md:w-20 h-16 md:h-20 object-contain" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm mb-1 line-clamp-2">{item.title}</h3>
                  <span className="text-blue-600 font-semibold">₵{(item.price * (item.quantity || 1)).toFixed(2)}</span>
                  
                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => handleQuantityChange(item.id, -1)}
                      className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                      disabled={item.quantity <= 1}
                    >
                      <FiMinus className={`w-4 h-4 ${item.quantity <= 1 ? 'text-gray-300' : 'text-gray-600'}`} />
                    </button>
                    <span className="text-sm font-medium w-6 text-center">{item.quantity || 1}</span>
                    <button
                      onClick={() => handleQuantityChange(item.id, 1)}
                      className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <FiPlus className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveItem(item.id)}
                  className="absolute bottom-3 right-3 p-2 text-red-500 hover:bg-red-50 rounded-full"
                >
                  <FiTrash2 className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>

          {(!wishlist?.items || wishlist.items.length === 0) && (
            <div className="text-center text-gray-500 py-8">
              <FiShoppingBag className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No items added yet</p>
            </div>
          )}
        </div>

        {/* Done Button */}
        <div className="sticky bottom-0 pt-4 mt-4 bg-gray-50">
          <button
            onClick={() => navigate('/my-wishlists')}
            className="w-full py-4 bg-blue-500 text-white rounded-xl font-medium
                     hover:bg-blue-600 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  )
} 