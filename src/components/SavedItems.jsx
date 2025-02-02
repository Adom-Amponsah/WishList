import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'

export default function SavedItems() {
  const [savedItems, setSavedItems] = useState([])
  const [totalPrice, setTotalPrice] = useState(0)

  useEffect(() => {
    // Load saved items from localStorage
    const items = JSON.parse(localStorage.getItem('wishlistItems') || '[]')
    setSavedItems(items)

    // Calculate total price
    const total = items.reduce((sum, item) => {
      const price = parseFloat(item.price.replace('₵', '').replace(',', ''))
      return sum + price
    }, 0)
    setTotalPrice(total)
  }, [])

  const removeItem = (sku) => {
    const itemToRemove = savedItems.find(item => item.sku === sku)
    const updatedItems = savedItems.filter(item => item.sku !== sku)
    localStorage.setItem('wishlistItems', JSON.stringify(updatedItems))
    setSavedItems(updatedItems)

    // Update total price
    const total = updatedItems.reduce((sum, item) => {
      const price = parseFloat(item.price.replace('₵', '').replace(',', ''))
      return sum + price
    }, 0)
    setTotalPrice(total)

    // Show remove toast
    toast.success(`Removed ${itemToRemove.title}`, {
      icon: '🗑️',
    })
  }

  const clearAllItems = () => {
    localStorage.setItem('wishlistItems', '[]')
    setSavedItems([])
    setTotalPrice(0)
    
    // Show clear all toast
    toast.success('Wishlist cleared!', {
      icon: '🧹',
    })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Wishlist</h1>
        <div className="flex items-center gap-4">
          <p className="text-xl font-semibold">
            Total: ₵{totalPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
          {savedItems.length > 0 && (
            <button
              onClick={clearAllItems}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Clear All
            </button>
          )}
        </div>
      </div>

      {savedItems.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600 mb-4">Your wishlist is empty</p>
          <Link
            to="/"
            className="inline-block px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Start Adding Items
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedItems.map((item) => (
            <div key={item.sku} className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
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
                  View 
                </a>
                <button
                  onClick={() => removeItem(item.sku)}
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