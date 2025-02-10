import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { getWishlistById, addItemToWishlist, removeItemFromWishlist, getAllWishlists, updateItemQuantity } from '../services/wishlistService'
import { getAllCategories, getProductsByCategory, searchProducts } from '../services/supabase'
import toast from 'react-hot-toast'
import { 
  Search, 
  ShoppingBag, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Trash2, 
  Plus, 
  Check, 
  Minus,
  Package,
  LayoutGrid,
  Baby,
  BookOpen,
  Plug,
  Shirt,
  Sofa,
  Gamepad,
  Scissors,
  UtensilsCrossed,
  Wrench,
  Smartphone,
  Dumbbell,
  ShoppingCart,
  Joystick,
  Heart,
  HeartHandshake,
  HeartPulse
} from 'lucide-react'

// Add Valentine's Hearts Component
const ValentineHearts = () => {
  // Create an array of heart elements with different properties
  const hearts = Array.from({ length: 15 }).map((_, i) => ({
    id: i,
    icon: [Heart, HeartHandshake, HeartPulse][Math.floor(Math.random() * 3)],
    initialX: Math.random() * 100,
    initialY: 100 + Math.random() * 20, // Start slightly below the viewport
    scale: Math.random() * 0.5 + 0.5,
    duration: Math.random() * 20 + 10,
    delay: Math.random() * 10,
    rotate: Math.random() * 360
  }));

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {hearts.map((heart) => {
        const Icon = heart.icon;
        return (
          <motion.div
            key={heart.id}
            initial={{ 
              x: `${heart.initialX}vw`,
              y: `${heart.initialY}vh`,
              scale: heart.scale,
              opacity: 0,
              rotate: 0
            }}
            animate={{
              y: '-20vh',
              opacity: [0, 0.8, 0],
              scale: [heart.scale, heart.scale * 1.2, heart.scale],
              rotate: heart.rotate
            }}
            transition={{
              duration: heart.duration,
              repeat: Infinity,
              delay: heart.delay,
              ease: "linear"
            }}
            className="absolute text-pink-500"
            style={{
              filter: 'drop-shadow(0 0 8px rgba(236, 72, 153, 0.5))'
            }}
          >
            <Icon 
              className="w-8 h-8 md:w-12 md:h-12" 
              style={{ 
                strokeWidth: 1.5,
                fill: 'rgba(236, 72, 153, 0.2)'
              }} 
            />
          </motion.div>
        );
      })}
    </div>
  );
};

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
  const [addingItems, setAddingItems] = useState({})
  const [isValentinesDay, setIsValentinesDay] = useState(false)

  // Fetch wishlist data
  useEffect(() => {
    const loadWishlist = async () => {
      try {
        const foundWishlist = await getWishlistById(id)
        if (foundWishlist) {
          setWishlist(foundWishlist)
          // Check if it's a Valentine's Day wishlist
          setIsValentinesDay(foundWishlist.eventType === "Valentine's Day")
        } else {
          toast.error('Wishlist not found')
          navigate('/my-wishlists')
        }
      } catch (error) {
        console.error('Error loading wishlist:', error)
        toast.error('Failed to load wishlist')
        navigate('/my-wishlists')
      }
    }
    loadWishlist()
  }, [id, navigate])

  // Get icon for category
  const getCategoryIcon = (categoryName) => {
    const icons = {
      'BABY SUPPLIES': Baby,
      'BOOKS & STATIONERY': BookOpen,
      'ELECTRICAL APPLIANCES': Plug,
      'FASHION & LUGGAGE': Shirt,
      'FURNITURE': Sofa,
      'GAMING': Gamepad,
      'HAIR & COSMETICS': Scissors,
      'HOME & KITCHEN ESSENTIALS': UtensilsCrossed,
      'LIGHTING & HARDWARE': Wrench,
      'MOBILES & COMPUTERS': Smartphone,
      'SPORTS & FITNESS': Dumbbell,
      'SUPERMARKET': ShoppingCart,
      'TOYS & ENTERTAINMENT': Joystick
    }
    const Icon = icons[categoryName] || Package
    return Icon
  }

  // Fetch random products from different categories on mount
  useEffect(() => {
    const fetchRandomProducts = async () => {
      setLoading(true)
      try {
        // Get all categories first
        const categoriesData = await getAllCategories()
        if (!categoriesData?.length) return

        // Get 2-3 random products from each category
        const allProducts = []
        const shuffledCategories = [...categoriesData].sort(() => Math.random() - 0.5)
        
        // Take first 4 categories randomly
        for (const category of shuffledCategories.slice(0, 4)) {
          const result = await getProductsByCategory(category.name, 1, 3)
          if (result?.products?.length) {
            allProducts.push(...result.products)
          }
        }

        // Shuffle the combined products
        const shuffledProducts = allProducts.sort(() => Math.random() - 0.5)
        
        setProducts(shuffledProducts)
        setHasNextPage(false)
        setCurrentPage(1)
        setTotalItems(shuffledProducts.length)
      } catch (error) {
        console.error('Error loading random products:', error)
        toast.error('Failed to load products')
      } finally {
        setLoading(false)
      }
    }
    fetchRandomProducts()
  }, [])

  // Modified categories fetch - don't select default
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
  const fetchProducts = async (category) => {
    setLoading(true)
    try {
      let result
      if (searchQuery.trim()) {
        // Fetch all search results
        result = await searchProducts(searchQuery, 1, 1000)
      } else if (category) {
        // Fetch all products for the category
        result = await getProductsByCategory(category, 1, 1000)
      } else {
        // When returning to Discover Items, fetch random products from all categories
        const categoriesData = await getAllCategories()
        if (!categoriesData?.length) {
          result = { products: [], totalCount: 0 }
          return
        }

        const allProducts = []
        const shuffledCategories = [...categoriesData].sort(() => Math.random() - 0.5)
        
        // Get products from all categories
        for (const category of shuffledCategories) {
          const categoryResult = await getProductsByCategory(category.name, 1, 50)
          if (categoryResult?.products?.length) {
            allProducts.push(...categoryResult.products)
          }
        }

        const shuffledProducts = allProducts.sort(() => Math.random() - 0.5)
        result = {
          products: shuffledProducts,
          totalCount: shuffledProducts.length
        }
      }

      setProducts(result.products)

      if (result.products.length === 0 && !loading) {
        toast.info('No products found')
      } else if (searchQuery.trim()) {
        toast.success(`Found ${result.products.length} items`)
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
    await fetchProducts(category)
  }

  const handleSearch = async (e) => {
    e?.preventDefault()
    if (!searchQuery.trim()) {
      toast.error('Please enter a search term')
      return
    }

    setLoading(true)
    try {
      const result = await searchProducts(searchQuery, 1, 1000)
      setProducts(result.products)

      if (result.products.length === 0) {
        toast.info('No products found for your search')
      } else {
        toast.success(`Found ${result.products.length} items`)
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
      await fetchProducts(selectedCategory)
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const isItemInWishlist = (id) => {
    return wishlist?.items?.some(item => item.id === id) ?? false;
  }

  const handleAddItem = async (item) => {
    setAddingItems(prev => ({ ...prev, [item.id]: true }))
    try {
      const success = await addItemToWishlist(id, item)
      if (success) {
        const updatedWishlist = await getWishlistById(id)
        setWishlist(updatedWishlist)
        const toastId = toast.success('Item added to wishlist!', { icon: '🎉' })

        // Dismiss the toast after 2 seconds
        setTimeout(() => {
          toast.dismiss(toastId)
        }, 2000)
      } else {
        toast.error('This item is already in your wishlist!', { icon: '⚠️' })
      }
    } catch (error) {
      console.error('Error adding item:', error)
      toast.error(error.message || 'Failed to add item to wishlist')
    } finally {
      setAddingItems(prev => ({ ...prev, [item.id]: false }))
    }
  }

  const handleRemoveItem = async (itemId) => {
    try {
      const success = await removeItemFromWishlist(id, itemId)
      if (success) {
        const updatedWishlist = await getWishlistById(id)
        setWishlist(updatedWishlist)
        toast.success('Item removed from wishlist')
      } else {
        toast.error('Failed to remove item')
      }
    } catch (error) {
      console.error('Error removing item:', error)
      toast.error(error.message || 'Failed to remove item from wishlist')
    }
  }

  const handleQuantityChange = async (itemId, change) => {
    try {
      const success = await updateItemQuantity(id, itemId, Math.max(1, (wishlist?.items.find(item => item.id === itemId)?.quantity || 1) + change))
      if (success) {
        const updatedWishlist = await getWishlistById(id)
        setWishlist(updatedWishlist)
      }
    } catch (error) {
      console.error('Error updating quantity:', error)
      toast.error(error.message || 'Failed to update item quantity')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Add Valentine's Hearts if it's a Valentine's Day wishlist */}
      {isValentinesDay && <ValentineHearts />}

      {/* Even Wilder Search Bar Design */}
      <div className={`sticky top-0 z-30 ${
        isValentinesDay 
          ? 'bg-gradient-to-br from-pink-500 via-red-400 to-pink-500'
          : 'bg-gradient-to-br from-[#970058] via-[#C21878] to-[#970058]'
      }`}>
        <div className="absolute inset-0 overflow-hidden">
          {/* Enhanced animated background elements */}
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-gradient-to-br from-white/20 to-transparent backdrop-blur-sm"
              initial={{
                width: Math.random() * 150 + 50,
                height: Math.random() * 150 + 50,
                x: Math.random() * 100 + '%',
                y: Math.random() * 100,
                scale: 0,
                rotate: Math.random() * 360
              }}
              animate={{
                x: Math.random() * 100 + '%',
                y: Math.random() * 100,
                scale: [1, 1.2, 1],
                opacity: [0.1, 0.3, 0.1],
                rotate: [0, 180, 360]
              }}
              transition={{
                duration: Math.random() * 8 + 5,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut"
              }}
            />
          ))}
        </div>

        <div className="container mx-auto px-4 py-4 md:py-8 relative">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="relative"
          >
            <form onSubmit={handleSearch} className="relative flex flex-col gap-4">
              <div className="relative flex items-center">
                <div className="relative flex-1 group">
                  {/* Pulsing background effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-white/30 via-white/10 to-white/30 rounded-2xl blur-xl"
                    animate={{
                      scale: [1, 1.05, 1],
                      opacity: [0.5, 0.8, 0.5],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      repeatType: "reverse",
                      ease: "easeInOut"
                    }}
                  />
                  <input
                    type="text"
                    placeholder="What are you looking for today?"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 md:pl-14 pr-4 py-4 md:py-6 rounded-2xl border-2 border-white/30 bg-white/10 
                             text-white placeholder-white/70 focus:ring-4 focus:ring-white/30 focus:border-transparent
                             backdrop-blur-sm transition-all text-base md:text-lg shadow-lg"
                  />
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2"
                  >
                    <Search className="w-6 h-6 md:w-7 md:h-7 text-white/70" />
                  </motion.div>
                </div>
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.05, rotate: [0, -5, 5, 0] }}
                  whileTap={{ scale: 0.95 }}
                  className="ml-2 md:ml-4 px-4 md:px-8 py-4 md:py-6 bg-white text-[#970058] rounded-2xl font-semibold
                           hover:bg-white/90 transition-all flex items-center gap-2 shadow-lg
                           relative overflow-hidden group"
                >
                  <Search className="w-5 h-5 md:w-6 md:h-6" />
                  <span className="hidden md:inline">Search</span>
                </motion.button>
              </div>

              {/* Enhanced Popular Categories Pills */}
              <div className="flex flex-wrap items-center gap-3 text-white/70 text-sm">
                {/* <span className="font-medium">Trending:</span>
                <div className="flex flex-wrap gap-2">
                  {['iPhone', 'Samsung TV', 'Nike Shoes', 'PlayStation 5'].map((term, index) => (
                    <motion.button
                      key={term}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ 
                        scale: 1.05,
                        backgroundColor: 'rgba(255, 255, 255, 0.3)',
                      }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setSearchQuery(term)
                        handleSearch()
                      }}
                      className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-sm
                               border border-white/20 transition-all shadow-lg relative overflow-hidden group"
                    >
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                        initial={{ x: '-100%' }}
                        whileHover={{ x: '100%' }}
                        transition={{ duration: 0.5 }}
                      />
                      {term}
                    </motion.button>
                  ))}
                </div> */}
              </div>
            </form>
          </motion.div>
        </div>
      </div>

      {/* Enhanced Categories Design */}
      <div className="bg-white shadow-lg relative overflow-hidden">
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r from-[#970058]/5 via-[#C21878]/5 to-[#970058]/5"
          animate={{
            x: ['-100%', '100%'],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "linear"
          }}
        />
        
        <div className="container mx-auto px-4 py-4 md:py-6 relative">
          <div className="overflow-x-auto scrollbar-hide">
            <motion.div 
              className="flex gap-2 md:gap-4 pb-2"
              drag="x"
              dragConstraints={{ right: 0, left: -1200 }}
              dragElastic={0.2}
            >
              <motion.button
                onClick={() => {
                  setSelectedCategory(null)
                  setSearchQuery('')
                  setCurrentPage(1)
                  fetchProducts(null)
                }}
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 10px 30px -10px rgba(151, 0, 88, 0.4)"
                }}
                whileTap={{ scale: 0.95 }}
                className="flex-shrink-0"
              >
                <div className={`flex flex-col items-center gap-2 md:gap-3 w-24 md:w-32 p-3 md:p-4 rounded-xl md:rounded-2xl transition-all
                  relative overflow-hidden group
                  ${!selectedCategory
                    ? 'bg-gradient-to-br from-[#970058] to-[#C21878] text-white shadow-lg'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    initial={{ x: '-100%', opacity: 0 }}
                    animate={!selectedCategory ? {
                      x: ['100%'],
                      opacity: [0, 1, 0]
                    } : {}}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                  <div className={`p-2 md:p-3 rounded-xl ${
                    !selectedCategory
                      ? 'bg-white/20'
                      : 'bg-white'
                  }`}>
                    <motion.div
                      animate={!selectedCategory ? {
                        rotate: [0, 180],
                        scale: [1, 1.1, 1]
                      } : {}}
                      transition={{
                        duration: 5,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                    >
                      <LayoutGrid className="w-6 h-6 md:w-7 md:h-7" />
                    </motion.div>
                  </div>
                  <span className="text-xs md:text-sm font-medium">
                    Discover Items
                  </span>
                </div>
              </motion.button>

              {categories.map((category, index) => {
                const Icon = getCategoryIcon(category.name)
                return (
                  <motion.button
                    key={category.id}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => handleCategorySelect(category.name)}
                    whileHover={{ 
                      scale: 1.05,
                      boxShadow: "0 10px 30px -10px rgba(151, 0, 88, 0.4)"
                    }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-shrink-0"
                  >
                    <div className={`flex flex-col items-center gap-2 md:gap-3 w-24 md:w-32 p-3 md:p-4 rounded-xl md:rounded-2xl transition-all
                      relative overflow-hidden group
                      ${selectedCategory === category.name
                        ? 'bg-gradient-to-br from-[#970058] to-[#C21878] text-white shadow-lg'
                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                        initial={{ x: '-100%', opacity: 0 }}
                        animate={selectedCategory === category.name ? {
                          x: ['100%'],
                          opacity: [0, 1, 0]
                        } : {}}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      />
                      <div className={`p-2 md:p-3 rounded-xl ${
                        selectedCategory === category.name
                          ? 'bg-white/20'
                          : 'bg-white'
                      }`}>
                        <motion.div
                          animate={selectedCategory === category.name ? {
                            rotate: [0, 360],
                            scale: [1, 1.1, 1]
                          } : {}}
                          transition={{
                            duration: 5,
                            repeat: Infinity,
                            ease: "linear"
                          }}
                        >
                          <Icon className="w-6 h-6 md:w-7 md:h-7" />
                        </motion.div>
                      </div>
                      <span className="text-xs md:text-sm font-medium line-clamp-2 text-center">
                        {category.name}
                      </span>
                    </div>
                  </motion.button>
                )
              })}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Floating Cart Button for Mobile */}
      <AnimatePresence>
        {wishlist?.items?.length > 0 && (
          <motion.button
            initial={{ scale: 0, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0, y: 20 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowCart(true)}
            className="md:hidden fixed bottom-6 right-6 z-50 bg-gradient-to-r from-[#970058] to-[#C21878]
                     w-16 h-16 rounded-full shadow-lg flex items-center justify-center"
          >
            <div className="relative">
              <ShoppingBag className="w-7 h-7 text-white" />
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full
                         flex items-center justify-center text-sm font-bold text-[#970058]"
              >
                {wishlist?.items?.length}
              </motion.div>
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Mobile Cart Slide-in Panel */}
      <AnimatePresence>
        {showCart && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            className="fixed inset-0 z-50 md:hidden"
          >
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowCart(false)} />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="absolute right-0 top-0 bottom-0 w-full max-w-[350px] bg-white shadow-xl"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">Added Items</h2>
                  <button onClick={() => setShowCart(false)} className="p-2 hover:bg-gray-100 rounded-full">
                    <X className="w-6 h-6" />
                  </button>
                </div>
                
                {/* Cart Items Content */}
                {wishlist?.items?.length === 0 ? (
                  <div className="flex flex-col items-center justify-center text-center py-8">
                    <ShoppingBag className="w-12 h-12 text-gray-400 mb-4" />
                    <p className="text-gray-600">No items added yet</p>
                    <p className="text-sm text-gray-500 mt-2">Click the + button on items to add them</p>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
                    {wishlist?.items.map((item) => (
                      <div key={item.id} className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                        <img
                          src={item.image_url}
                          alt={item.title}
                          className="w-16 h-16 object-contain bg-white rounded-lg"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-medium text-gray-900 line-clamp-2">
                            {item.title}
                          </h3>
                          <p className="text-[#970058] text-sm font-semibold mt-1">
                            ₵{item.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <button
                              onClick={() => handleQuantityChange(item.id, -1)}
                              className="p-1 hover:bg-white rounded"
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-sm w-6 text-center">{item.quantity}</span>
                            <button
                              onClick={() => handleQuantityChange(item.id, 1)}
                              className="p-1 hover:bg-white rounded"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => handleRemoveItem(item.id)}
                              className="ml-auto p-1 text-red-500 hover:bg-white rounded"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <button
                  onClick={() => {
                    setShowCart(false)
                    navigate(`/wishlist/${id}`)
                  }}
                  className="w-full mt-6 px-6 py-3 bg-[#970058] text-white rounded-xl 
                           hover:bg-[#C21878] transition-colors flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-5 h-5" />
                  View Wishlist
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content with Added Items Side Panel */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Products Section */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                {isValentinesDay && <Heart className="w-6 h-6 text-pink-500" />}
                {selectedCategory || 'Discover Items'}
              </h2>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className={`animate-spin rounded-full h-12 w-12 border-b-2 ${
                  isValentinesDay ? 'border-pink-500' : 'border-[#970058]'
                }`}></div>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {products.map((product) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-xl shadow-sm overflow-hidden"
                  >
                    <div className="aspect-square bg-gray-50 relative overflow-hidden">
                      <img
                        src={product.image_url}
                        alt={product.title}
                        className="w-full h-full object-contain p-2"
                      />
                      <button
                        onClick={() => handleAddItem(product)}
                        disabled={isItemInWishlist(product.id) || addingItems[product.id]}
                        className={`absolute bottom-4 right-4 p-2 rounded-full shadow-lg
                          ${isItemInWishlist(product.id)
                            ? 'bg-green-500'
                            : 'bg-[#970058]'
                          }`}
                      >
                        {isItemInWishlist(product.id) ? (
                          <Check className="w-5 h-5 text-white" />
                        ) : addingItems[product.id] ? (
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Plus className="w-5 h-5 text-white" />
                        )}
                      </button>
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">
                        {product.title}
                      </h3>
                      <p className="text-[#970058] font-semibold">
                        ₵{product.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Added Items Section */}
          <div className="hidden md:block w-[350px] bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Added Items</h2>
              <div className="flex items-center gap-2 text-[#970058]">
                <ShoppingBag className="w-5 h-5" />
                <span className="font-medium">{wishlist?.items?.length || 0}</span>
              </div>
            </div>

            {wishlist?.items?.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center py-8">
                <ShoppingBag className="w-12 h-12 text-gray-400 mb-4" />
                <p className="text-gray-600">No items added yet</p>
                <p className="text-sm text-gray-500 mt-2">Click the + button on items to add them</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[600px] overflow-y-auto">
                {wishlist?.items.map((item) => (
                  <div key={item.id} className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="w-16 h-16 object-contain bg-white rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 line-clamp-2">
                        {item.title}
                      </h3>
                      <p className="text-[#970058] text-sm font-semibold mt-1">
                        ₵{item.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => handleQuantityChange(item.id, -1)}
                          className="p-1 hover:bg-white rounded"
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-sm w-6 text-center">{item.quantity}</span>
                        <button
                          onClick={() => handleQuantityChange(item.id, 1)}
                          className="p-1 hover:bg-white rounded"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="ml-auto p-1 text-red-500 hover:bg-white rounded"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={() => navigate(`/wishlist/${id}`)}
              className="w-full mt-6 px-6 py-3 bg-[#970058] text-white rounded-xl 
                       hover:bg-[#C21878] transition-colors flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-5 h-5" />
              View Wishlist
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 