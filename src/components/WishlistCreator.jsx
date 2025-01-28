import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { motion, AnimatePresence, useTransform } from 'framer-motion'
import AddItemModal from './AddItemModal'


const WishlistCreator = () => {
  const { eventType } = useParams()
  const [activeChoice, setActiveChoice] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [items, setItems] = useState([])

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
        <motion.h1
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-16 text-center text-4xl font-bold text-gray-800"
        >
          Create Your Perfect <br />
          <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            {eventType.split('-').join(' ').toUpperCase()} Wishlist
          </span>
        </motion.h1>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Gift Card */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="relative h-96 cursor-pointer overflow-hidden rounded-3xl shadow-2xl"
            onHoverStart={() => setActiveChoice('gift')}
            onHoverEnd={() => setActiveChoice(null)}
            onClick={() => {
              setActiveChoice('gift')
              setIsModalOpen(true)
            }}
          >
            <div className="absolute inset-0 bg-black/20" />
            <img
              src={currentTheme.images.gift}
              className="h-full w-full object-cover"
              alt="Gift items"
            />
            
            <motion.div
              className="absolute bottom-0 left-0 right-0 bg-white/80 p-6 backdrop-blur-sm"
              initial={{ y: 100 }}
              animate={{ y: activeChoice === 'gift' ? 0 : 100 }}
            >
              <h2 className="text-2xl font-bold text-gray-800">Add Gifts</h2>
              <p className="text-gray-600">Physical items you'd love to receive</p>
            </motion.div>
            
            <motion.div
              className="absolute left-6 top-6 rounded-full bg-white px-4 py-2 shadow-lg"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
            >
              🎁
            </motion.div>
          </motion.div>

          {/* Money Card */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="relative h-96 cursor-pointer overflow-hidden rounded-3xl shadow-2xl"
            onHoverStart={() => setActiveChoice('money')}
            onHoverEnd={() => setActiveChoice(null)}
            onClick={() => {
              setActiveChoice('money')
              setIsModalOpen(true)
            }}
          >
            <div className="absolute inset-0 bg-black/20" />
            <img
              src={currentTheme.images.money}
              className="h-full w-full object-cover"
              alt="Money envelope"
            />
            
            <motion.div
              className="absolute bottom-0 left-0 right-0 bg-white/80 p-6 backdrop-blur-sm"
              initial={{ y: 100 }}
              animate={{ y: activeChoice === 'money' ? 0 : 100 }}
            >
              <h2 className="text-2xl font-bold text-gray-800">Cash Funds</h2>
              <p className="text-gray-600">Collect contributions for special purposes</p>
            </motion.div>
            
            <motion.div
              className="absolute left-6 top-6 rounded-full bg-white px-4 py-2 shadow-lg"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
            >
              💸
            </motion.div>
          </motion.div>
        </div>

        {/* Floating Add Button */}
        <motion.button
          whileHover={{ scale: 1.1, rotate: 10 }}
          whileTap={{ scale: 0.9 }}
          className="fixed bottom-8 right-8 flex h-16 w-16 items-center justify-center rounded-full bg-pink-500 text-2xl text-white shadow-xl"
          onClick={() => setIsModalOpen(true)}
        >
          +
        </motion.button>

        {/* Items Grid */}
        {items.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-4"
          >
            {items.map((item, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="group relative overflow-hidden rounded-2xl bg-white shadow-lg"
              >
                <img
                  src={item.image}
                  className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  alt={item.name}
                />
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800">{item.name}</h3>
                  <p className="text-sm text-gray-600">${item.price}</p>
                </div>
                <div className="absolute right-2 top-2 rounded-full bg-white/80 p-2 backdrop-blur-sm">
                  {item.type === 'gift' ? '🎁' : '💵'}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      <AddItemModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setActiveChoice(null)
        }}
        theme={currentTheme}
        type={activeChoice}
        onAdd={(item) => {
          setItems([...items, { ...item, type: activeChoice }])
          setIsModalOpen(false)
          setActiveChoice(null)
        }}
      />
    </div>
  )
}

export default WishlistCreator