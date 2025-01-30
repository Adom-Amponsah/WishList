import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createWishlist } from '../services/wishlistService'
import toast from 'react-hot-toast'

const EVENT_TYPES = [
  'Birthday',
  'Wedding',
  'Baby Shower',
  'House Warming',
  'Graduation',
  'Anniversary',
  'Christmas',
  'Other'
]

export default function CreateWishlist() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [eventType, setEventType] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name.trim() || !eventType) {
      toast.error('Please fill in all fields')
      return
    }

    setIsSubmitting(true)
    try {
      const newWishlist = createWishlist(name.trim(), eventType)
      toast.success('Wishlist created successfully!')
      navigate(`/wishlist/${newWishlist.id}/add-items`)
    } catch (error) {
      toast.error('Failed to create wishlist')
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Create New Wishlist</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Wishlist Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter a name for your wishlist"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
              required
            />
          </div>

          <div>
            <label htmlFor="eventType" className="block text-sm font-medium text-gray-700 mb-2">
              Event Type
            </label>
            <select
              id="eventType"
              value={eventType}
              onChange={(e) => setEventType(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Select an event type</option>
              {EVENT_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
            >
              {isSubmitting ? 'Creating...' : 'Create Wishlist'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 