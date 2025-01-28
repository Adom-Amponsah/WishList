import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MELCOM_CATEGORIES, scrapeCategory } from '../services/melcomScraper'

const AddItemModal = ({ isOpen, onClose, theme, type, onAdd }) => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchProducts = async () => {
      if (!selectedCategory) return
      setLoading(true)
      setError(null)
      try {
        const items = await scrapeCategory(selectedCategory)
        setProducts(items)
      } catch (error) {
        setError('Failed to fetch products. Please try again.')
        console.error('Error:', error)
      }
      setLoading(false)
    }

    if (selectedCategory) {
      fetchProducts()
    }
  }, [selectedCategory])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative max-h-[90vh] w-[90vw] max-w-4xl overflow-hidden rounded-3xl bg-white p-6 shadow-2xl"
          >
            <h2 className="mb-6 text-2xl font-bold">
              Add {type === 'gift' ? 'Gift Item' : 'Cash Fund'}
            </h2>

            {/* Category Selection */}
            {!selectedCategory && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {MELCOM_CATEGORIES.map((category) => (
                  <motion.button
                    key={category.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="p-4 rounded-xl border hover:border-blue-500 text-left"
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    <h3 className="font-semibold">{category.name}</h3>
                    <p className="text-sm text-gray-500">{category.count} items</p>
                  </motion.button>
                ))}
              </div>
            )}

            {/* Products Grid */}
            {selectedCategory && (
              <>
                <div className="mb-6 flex items-center justify-between">
                  <button
                    className="text-blue-500 hover:text-blue-700"
                    onClick={() => setSelectedCategory(null)}
                  >
                    ← Back to Categories
                  </button>
                  <h3 className="font-semibold">
                    {MELCOM_CATEGORIES.find(c => c.id === selectedCategory)?.name}
                  </h3>
                </div>

                {loading ? (
                  <div className="flex h-64 items-center justify-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-500" />
                  </div>
                ) : error ? (
                  <div className="text-center text-red-500 p-8">{error}</div>
                ) : (
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 overflow-y-auto max-h-[60vh]">
                    {products.map((product) => (
                      <motion.div
                        key={product.sku}
                        whileHover={{ scale: 1.02 }}
                        className="cursor-pointer rounded-xl border p-4 hover:shadow-lg"
                        onClick={() => {
                          onAdd({
                            name: product.title,
                            price: product.price,
                            image: product.image,
                            url: product.url
                          })
                        }}
                      >
                        <img
                          src={product.image}
                          alt={product.title}
                          className="mb-4 h-48 w-full rounded-lg object-cover"
                        />
                        <h3 className="mb-2 font-semibold">{product.title}</h3>
                        <p className="text-lg font-bold text-blue-600">
                          {product.price}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                )}
              </>
            )}

            <button
              className="absolute right-6 top-6 text-2xl text-gray-500 hover:text-gray-700"
              onClick={onClose}
            >
              ×
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default AddItemModal 