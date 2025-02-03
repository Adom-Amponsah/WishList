// Wishlist management service

import { db } from '../firebase';
import { 
  collection, 
  addDoc, 
  getDoc, 
  doc,
  query,
  where,
  getDocs
} from 'firebase/firestore';
import { encodeWishlistToURL } from '../utils/wishlistUrlUtils';

const WISHLISTS_STORAGE_KEY = 'wishlists'
const SHARED_WISHLISTS_KEY = 'shared_wishlists'

// Simple function to generate a unique ID
const generateId = () => {
  const timestamp = Date.now().toString(36)
  const randomStr = Math.random().toString(36).substring(2, 8)
  return `${timestamp}-${randomStr}`
}

// Helper function to get all wishlists from localStorage
export const getAllWishlists = () => {
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
    quantity: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
  
  wishlist.items.push(processedItem)
  
  // Update total price
  wishlist.totalPrice = wishlist.items.reduce((sum, item) => {
    return sum + (item.price * (item.quantity || 1))
  }, 0)
  
  saveWishlists(wishlists)
  return true
}

export const updateItemQuantity = (wishlistId, itemId, quantity) => {
  try {
    const wishlists = getAllWishlists()
    const wishlist = wishlists.find(list => list.id === wishlistId)
    
    if (!wishlist) return false

    const item = wishlist.items.find(item => item.id === itemId)
    if (!item) return false

    // Ensure quantity is at least 1
    item.quantity = Math.max(1, quantity)
    
    // Update total price
    wishlist.totalPrice = wishlist.items.reduce((sum, item) => {
      return sum + (item.price * (item.quantity || 1))
    }, 0)
    
    // Save changes
    saveWishlists(wishlists)
    return true
  } catch (error) {
    console.error('Error updating item quantity:', error)
    return false
  }
}

export const removeItemFromWishlist = (wishlistId, itemId) => {
  const wishlists = getAllWishlists()
  const wishlist = wishlists.find(list => list.id === wishlistId)
  
  if (!wishlist) return false

  wishlist.items = wishlist.items.filter(item => item.id !== itemId)
  wishlist.totalPrice = wishlist.items.reduce((sum, item) => 
    sum + (item.price * (item.quantity || 1)), 0)
  
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

export const updateWishlistUser = (wishlistId, userData) => {
  try {
    if (!wishlistId || !userData) {
      console.error('Missing wishlistId or userData');
      return false;
    }

    const wishlists = getAllWishlists();
    const wishlist = wishlists.find(list => list.id === wishlistId);
    
    if (!wishlist) {
      console.error('Wishlist not found:', wishlistId);
      return false;
    }

    // Add user data to wishlist
    wishlist.userData = {
      ...userData,
      updatedAt: new Date().toISOString()
    };

    // Update the wishlist in localStorage
    const updatedWishlists = wishlists.map(list => 
      list.id === wishlistId ? wishlist : list
    );
    
    return saveWishlists(updatedWishlists);
  } catch (error) {
    console.error('Error updating wishlist user:', error);
    return false;
  }
};

export const generateShareableLink = (wishlistId) => {
  try {
    const wishlist = getWishlistById(wishlistId);
    if (!wishlist || !wishlist.shareId) return null;

    const shareableLink = `${window.location.origin}/share/${wishlist.shareId}`;
    console.log('Retrieving shareable link:', shareableLink);
    return shareableLink;
  } catch (error) {
    console.error('Error generating shareable link:', error);
    return null;
  }
};

export const getSharedWishlist = async (shareId) => {
  try {
    console.log('Fetching wishlist from Firebase with ID:', shareId);
    const docRef = doc(db, 'shared_wishlists', shareId);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      console.log('No wishlist found in Firebase with ID:', shareId);
      return null;
    }

    const wishlistData = docSnap.data();
    console.log('Retrieved wishlist from Firebase:', wishlistData);
    return {
      ...wishlistData,
      id: docSnap.id
    };
  } catch (error) {
    console.error('Error getting shared wishlist from Firebase:', error);
    throw error;
  }
}; 