// Wishlist management service

export const createWishlist = (name, eventType) => {
  const wishlists = getAllWishlists()
  const newWishlist = {
    id: Date.now().toString(),
    name,
    eventType,
    createdAt: new Date().toISOString(),
    items: [],
    totalPrice: 0
  }
  
  wishlists.push(newWishlist)
  localStorage.setItem('wishlists', JSON.stringify(wishlists))
  return newWishlist
}

export const getAllWishlists = () => {
  return JSON.parse(localStorage.getItem('wishlists') || '[]')
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
  if (wishlist.items.some(existingItem => existingItem.sku === item.sku)) {
    return false
  }
  
  // Extract first price if multiple prices exist
  const priceStr = item.price.split('₵')[1].split('₵')[0].trim()
  const price = parseFloat(priceStr.replace(',', ''))
  
  // Add item with processed price
  const processedItem = {
    ...item,
    price: `₵${price.toFixed(2)}`
  }
  
  wishlist.items.push(processedItem)
  wishlist.totalPrice = wishlist.items.reduce((sum, currentItem) => {
    const itemPrice = parseFloat(currentItem.price.replace('₵', '').replace(',', ''))
    return sum + itemPrice
  }, 0)
  
  localStorage.setItem('wishlists', JSON.stringify(wishlists))
  return true
}

export const removeItemFromWishlist = (wishlistId, itemSku) => {
  const wishlists = getAllWishlists()
  const wishlist = wishlists.find(list => list.id === wishlistId)
  
  if (!wishlist) return false
  
  wishlist.items = wishlist.items.filter(item => item.sku !== itemSku)
  wishlist.totalPrice = wishlist.items.reduce((sum, item) => {
    const price = parseFloat(item.price.replace('₵', '').replace(',', ''))
    return sum + price
  }, 0)
  
  localStorage.setItem('wishlists', JSON.stringify(wishlists))
  return true
}

export const deleteWishlist = (wishlistId) => {
  const wishlists = getAllWishlists()
  const updatedWishlists = wishlists.filter(list => list.id !== wishlistId)
  localStorage.setItem('wishlists', JSON.stringify(updatedWishlists))
}

export const updateWishlistName = (wishlistId, newName) => {
  const wishlists = getAllWishlists()
  const wishlist = wishlists.find(list => list.id === wishlistId)
  
  if (!wishlist) return false
  
  wishlist.name = newName
  localStorage.setItem('wishlists', JSON.stringify(wishlists))
  return true
} 