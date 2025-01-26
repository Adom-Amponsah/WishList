import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const AddItemModal = ({ isOpen, onClose, theme, onAdd }) => {
  const [itemType, setItemType] = useState('manual') // 'manual' or 'link'
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    link: '',
    description: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onAdd(formData)
    onClose()
    setFormData({ name: '', price: '', link: '', description: '' })
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-xl p-6 w-full max-w-md"
          >
            <h2 className="text-2xl font-bold mb-4">Add Gift Item</h2>
            
            <div className="flex gap-4 mb-6">
              <button
                className={`flex-1 py-2 rounded ${
                  itemType === 'manual' ? theme.primary + ' text-white' : 'bg-gray-100'
                }`}
                onClick={() => setItemType('manual')}
              >
                Manual Entry
              </button>
              <button
                className={`flex-1 py-2 rounded ${
                  itemType === 'link' ? theme.primary + ' text-white' : 'bg-gray-100'
                }`}
                onClick={() => setItemType('link')}
              >
                Product Link
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              {itemType === 'link' ? (
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Product URL</label>
                  <input
                    type="url"
                    className="w-full p-2 border rounded"
                    placeholder="https://..."
                    value={formData.link}
                    onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                  />
                </div>
              ) : (
                <>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Item Name</label>
                    <input
                      type="text"
                      className="w-full p-2 border rounded"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Price</label>
                    <input
                      type="number"
                      className="w-full p-2 border rounded"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    />
                  </div>
                </>
              )}
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Description (Optional)</label>
                <textarea
                  className="w-full p-2 border rounded"
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  className="flex-1 py-2 bg-gray-100 rounded"
                  onClick={onClose}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`flex-1 py-2 ${theme.primary} text-white rounded`}
                >
                  Add Item
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default AddItemModal 