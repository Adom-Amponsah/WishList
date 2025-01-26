import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import AddItemModal from './AddItemModal'

const WishlistCreator = () => {
  const { eventType } = useParams()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [items, setItems] = useState([])

  const themes = {
    wedding: {
      primary: 'bg-rose-500',
      secondary: 'bg-pink-100',
      text: 'text-rose-500'
    },
    'baby-shower': {
      primary: 'bg-sky-500',
      secondary: 'bg-blue-100',
      text: 'text-sky-500'
    },
    // Add more themes for other event types
  }

  const currentTheme = themes[eventType] || themes.wedding

  return (
    <div className="container mx-auto px-4 py-8">
      <div className={`${currentTheme.secondary} rounded-lg p-8 mb-8`}>
        <h1 className={`text-3xl font-bold ${currentTheme.text} mb-4`}>
          Create Your {eventType.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
          ).join(' ')} Wishlist
        </h1>
        
        <div className="flex gap-4 mb-8">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`${currentTheme.primary} text-white px-6 py-3 rounded-lg`}
            onClick={() => setIsModalOpen(true)}
          >
            Add Gift Item
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`${currentTheme.primary} text-white px-6 py-3 rounded-lg`}
          >
            Add Cash Fund
          </motion.button>
        </div>

        {items.length === 0 ? (
          <div className="text-center text-gray-500 py-12">
            Start by adding items to your wishlist
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Item cards will go here */}
          </div>
        )}
      </div>

      <AddItemModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        theme={currentTheme}
        onAdd={(item) => setItems([...items, item])}
      />
    </div>
  )
}

export default WishlistCreator 