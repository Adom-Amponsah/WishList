// Wishlist management service

import { db } from '../firebase/config';
import { 
  collection, 
  addDoc, 
  getDoc, 
  doc,
  query,
  where,
  getDocs,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  orderBy
} from 'firebase/firestore';
import { encodeWishlistToURL } from '../utils/wishlistUrlUtils';

const WISHLISTS_STORAGE_KEY = 'wishlists'
const SHARED_WISHLISTS_KEY = 'shared_wishlists'

// Collection name constant
const WISHLISTS_COLLECTION = 'wishlists';

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

// Get username from localStorage or return null
export const getUsername = () => {
  return localStorage.getItem('wishlist_username');
};

// Save username to localStorage
export const setUsername = (username) => {
  localStorage.setItem('wishlist_username', username);
};

export const createWishlist = async (name, eventType, username) => {
  try {
    if (!username) {
      throw new Error('Username is required to create a wishlist');
    }

    const wishlistData = {
      name,
      eventType,
      createdAt: serverTimestamp(),
      items: [],
      totalPrice: 0,
      username
    };
    
    const docRef = await addDoc(collection(db, WISHLISTS_COLLECTION), wishlistData);
    return {
      id: docRef.id,
      ...wishlistData,
      createdAt: new Date().toISOString() // Convert timestamp for immediate use
    };
  } catch (error) {
    console.error('Error creating wishlist:', error);
    throw error;
  }
};

export const getAllWishlistsForUser = async (username) => {
  try {
    if (!username) {
      return [];
    }

    const wishlistsRef = collection(db, WISHLISTS_COLLECTION);
    const q = query(
      wishlistsRef, 
      where('username', '==', username),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate().toISOString()
    }));
  } catch (error) {
    console.error('Error getting all wishlists:', error);
    return [];
  }
};

export const getWishlistById = async (id) => {
  try {
    const docRef = doc(db, WISHLISTS_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      return null;
    }
    
    return {
      id: docSnap.id,
      ...docSnap.data(),
      createdAt: docSnap.data().createdAt?.toDate().toISOString()
    };
  } catch (error) {
    console.error('Error getting wishlist:', error);
    return null;
  }
};

export const addItemToWishlist = async (wishlistId, item) => {
  try {
    const docRef = doc(db, WISHLISTS_COLLECTION, wishlistId);
    const wishlist = await getWishlistById(wishlistId);
    
    if (!wishlist) return false;
    
    // Verify username matches
    const username = getUsername();
    if (wishlist.username !== username) {
      throw new Error('You can only modify your own wishlists');
    }
    
    // Check if item already exists
    if (wishlist.items.some(existingItem => existingItem.id === item.id)) {
      return false;
    }
    
    // Process the item
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
    };
    
    // Add item and update total price
    const updatedItems = [...wishlist.items, processedItem];
    const totalPrice = updatedItems.reduce((sum, item) => 
      sum + (item.price * (item.quantity || 1)), 0);
    
    await updateDoc(docRef, {
      items: updatedItems,
      totalPrice,
      updatedAt: serverTimestamp()
    });
    
    return true;
  } catch (error) {
    console.error('Error adding item to wishlist:', error);
    return false;
  }
};

export const updateItemQuantity = async (wishlistId, itemId, quantity) => {
  try {
    const docRef = doc(db, WISHLISTS_COLLECTION, wishlistId);
    const wishlist = await getWishlistById(wishlistId);
    
    if (!wishlist) return false;

    // Verify username matches
    const username = getUsername();
    if (wishlist.username !== username) {
      throw new Error('You can only modify your own wishlists');
    }
    
    const updatedItems = wishlist.items.map(item => 
      item.id === itemId 
        ? { ...item, quantity: Math.max(1, quantity), updatedAt: new Date().toISOString() }
        : item
    );
    
    const totalPrice = updatedItems.reduce((sum, item) => 
      sum + (item.price * (item.quantity || 1)), 0);
    
    await updateDoc(docRef, {
      items: updatedItems,
      totalPrice,
      updatedAt: serverTimestamp()
    });
    
    return true;
  } catch (error) {
    console.error('Error updating item quantity:', error);
    return false;
  }
};

export const removeItemFromWishlist = async (wishlistId, itemId) => {
  try {
    const docRef = doc(db, WISHLISTS_COLLECTION, wishlistId);
    const wishlist = await getWishlistById(wishlistId);
    
    if (!wishlist) return false;

    // Verify username matches
    const username = getUsername();
    if (wishlist.username !== username) {
      throw new Error('You can only modify your own wishlists');
    }
    
    const updatedItems = wishlist.items.filter(item => item.id !== itemId);
    const totalPrice = updatedItems.reduce((sum, item) => 
      sum + (item.price * (item.quantity || 1)), 0);
    
    await updateDoc(docRef, {
      items: updatedItems,
      totalPrice,
      updatedAt: serverTimestamp()
    });
    
    return true;
  } catch (error) {
    console.error('Error removing item from wishlist:', error);
    return false;
  }
};

export const deleteWishlist = async (id) => {
  try {
    const wishlist = await getWishlistById(id);
    if (!wishlist) return false;

    // Verify username matches
    const username = getUsername();
    if (wishlist.username !== username) {
      throw new Error('You can only delete your own wishlists');
    }

    await deleteDoc(doc(db, WISHLISTS_COLLECTION, id));
    return true;
  } catch (error) {
    console.error('Error deleting wishlist:', error);
    return false;
  }
};

export const updateWishlistName = async (wishlistId, newName) => {
  try {
    const wishlist = await getWishlistById(wishlistId);
    if (!wishlist) return false;

    // Verify username matches
    const username = getUsername();
    if (wishlist.username !== username) {
      throw new Error('You can only modify your own wishlists');
    }

    const docRef = doc(db, WISHLISTS_COLLECTION, wishlistId);
    await updateDoc(docRef, {
      name: newName,
      updatedAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error('Error updating wishlist name:', error);
    return false;
  }
};

export const updateWishlistUser = async (wishlistId, userData) => {
  try {
    if (!wishlistId || !userData) {
      console.error('Missing wishlistId or userData');
      return null;
    }

    const docRef = doc(db, WISHLISTS_COLLECTION, wishlistId);
    const wishlist = await getWishlistById(wishlistId);
    
    if (!wishlist) {
      console.error('Wishlist not found:', wishlistId);
      return null;
    }

    // Verify username matches
    const username = getUsername();
    if (wishlist.username !== username) {
      throw new Error('You can only modify your own wishlists');
    }

    // Add user data to wishlist
    await updateDoc(docRef, {
      userData: {
        ...userData,
        updatedAt: serverTimestamp()
      }
    });

    // Generate shareable URL
    const shareableUrl = `${window.location.origin}/share/${wishlistId}`;
    return shareableUrl;
  } catch (error) {
    console.error('Error updating wishlist user:', error);
    return null;
  }
};

export const generateShareableLink = async (wishlistId) => {
  try {
    const wishlist = await getWishlistById(wishlistId);
    if (!wishlist) return null;

    const shareableLink = `${window.location.origin}/share/${wishlistId}`;
    console.log('Generated shareable link:', shareableLink);
    return shareableLink;
  } catch (error) {
    console.error('Error generating shareable link:', error);
    return null;
  }
};

export const getSharedWishlist = async (shareId) => {
  try {
    return await getWishlistById(shareId);
  } catch (error) {
    console.error('Error getting shared wishlist:', error);
    throw error;
  }
}; 