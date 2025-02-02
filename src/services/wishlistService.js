// Wishlist management service

const WISHLISTS_STORAGE_KEY = 'wishlists'

// Helper function to get all wishlists from localStorage
const getAllWishlists = () => {
  try {
    const wishlists = localStorage.getItem(WISHLISTS_STORAGE_KEY)
    if (!wishlists) return []
    
    const parsedWishlists = JSON.parse(wishlists)
    return Array.isArray(parsedWishlists) ? parsedWishlists : []
  } catch (error) {
    console.error('Error parsing wishlists from localStorage:', error)
    return []
  }
}

// Helper function to save all wishlists to localStorage
const saveWishlists = (wishlists) => {
  if (!Array.isArray(wishlists)) {
    console.error('Attempted to save non-array wishlists')
    return false
  }
  localStorage.setItem(WISHLISTS_STORAGE_KEY, JSON.stringify(wishlists))
  return true
}

export const createWishlist = (name, eventType) => {
  try {
    const wishlists = getAllWishlists()
    const newWishlist = {
      id: Date.now().toString(),
      name,
      eventType,
      createdAt: new Date().toISOString(),
      items: [],
      totalPrice: 0
    }
    
    const updatedWishlists = [...wishlists, newWishlist]
    const saved = saveWishlists(updatedWishlists)
    if (!saved) {
      throw new Error('Failed to save wishlist')
    }
    return newWishlist
  } catch (error) {
    console.error('Error creating wishlist:', error)
    throw error
  }
}

export const getAllWishlistsForUser = () => {
  try {
    return getAllWishlists()
  } catch (error) {
    console.error('Error getting all wishlists:', error)
    return []
  }
}

export const getWishlistById = (id) => {
  const wishlists = getAllWishlists()
  return wishlists.find(list => list.id === id)
}

export const addItemToWishlist = (wishlistId, item) => {
  const wishlists = getAllWishlists()
  const wishlist = wishlists.find(list => list.id === wishlistId)
  
  if (!wishlist) return false
  
  // Check if item already exists in this wishlist
  if (wishlist.items.some(existingItem => existingItem.id === item.id)) {
    return false
  }
  
  // Process the item from Supabase format
  const processedItem = {
    id: item.id,
    title: item.title,
    price: item.price,
    image_url: item.image_url,
    url: item.product_url,
    category: item.category,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
  
  wishlist.items.push(processedItem)
  wishlist.totalPrice = wishlist.items.reduce((sum, currentItem) => {
    return sum + currentItem.price
  }, 0)
  
  saveWishlists(wishlists)
  return true
}

export const removeItemFromWishlist = (wishlistId, itemId) => {
  const wishlists = getAllWishlists()
  const wishlist = wishlists.find(list => list.id === wishlistId)
  
  if (!wishlist) return false

  wishlist.items = wishlist.items.filter(item => item.id !== itemId)
  wishlist.totalPrice = wishlist.items.reduce((sum, item) => sum + Number(item.price), 0)
  
  saveWishlists(wishlists)
  return true
}

export const deleteWishlist = (id) => {
  try {
    const wishlists = getAllWishlists()
    const updatedWishlists = wishlists.filter(wishlist => wishlist.id !== id)
    saveWishlists(updatedWishlists)
    return true
  } catch (error) {
    console.error('Error deleting wishlist:', error)
    return false
  }
}

export const updateWishlistName = (wishlistId, newName) => {
  const wishlists = getAllWishlists()
  const wishlist = wishlists.find(list => list.id === wishlistId)
  
  if (!wishlist) return false
  
  wishlist.name = newName
  saveWishlists(wishlists)
  return true
} 