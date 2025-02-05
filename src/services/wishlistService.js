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
  orderBy,
  limit
} from 'firebase/firestore';
import { encodeWishlistToURL } from '../utils/wishlistUrlUtils';
import { getStoredUser } from './userService';

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

// Get username from localStorage
export const getUsername = () => {
  const user = getStoredUser();
  return user ? user.username : null;
};

// Get user data from localStorage
export const getUserData = () => {
  return getStoredUser();
};

export const createWishlist = async (name, eventType) => {
  try {
    const userData = getUserData();
    if (!userData) {
      throw new Error('User data is required to create a wishlist');
    }

    const wishlistData = {
      name,
      eventType,
      createdAt: serverTimestamp(),
      items: [],
      totalPrice: 0,
      username: userData.username.toLowerCase(),
      updatedAt: serverTimestamp()
    };
    
    const docRef = await addDoc(collection(db, WISHLISTS_COLLECTION), wishlistData);
    return {
      id: docRef.id,
      ...wishlistData,
      createdAt: new Date().toISOString()
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

    // Validate required fields
    if (!userData.name || !userData.email || !userData.phone || !userData.dateOfBirth || !userData.location) {
      console.error('Missing required user data fields');
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
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        dateOfBirth: userData.dateOfBirth,
        location: userData.location,
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

export const checkUsernameExists = async (username) => {
  try {
    const wishlistsRef = collection(db, WISHLISTS_COLLECTION);
    const q = query(wishlistsRef, where('username', '==', username.toLowerCase()), limit(1));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  } catch (error) {
    console.error('Error checking username:', error);
    return false;
  }
};

// Add new function to handle contributions
export const addContribution = async (wishlistId, itemId, contribution) => {
  try {
    const docRef = doc(db, WISHLISTS_COLLECTION, wishlistId);
    const wishlist = await getWishlistById(wishlistId);
    
    if (!wishlist) return false;

    // Find the item and update its contributions
    const updatedItems = wishlist.items.map(item => {
      if (item.id === itemId) {
        // Ensure contributions array exists
        const currentContributions = Array.isArray(item.contributions) ? item.contributions : [];
        
        // Format the new contribution
        const newContribution = {
          id: generateId(),
          amount: Number(contribution.amount) || 0,
          reference: String(contribution.reference || ''),
          isFullGift: Boolean(contribution.isFullGift),
          contributorEmail: String(contribution.contributorEmail || ''),
          contributorName: String(contribution.contributorName || ''),
          status: String(contribution.status || 'success'),
          transactionId: String(contribution.transactionId || ''),
          createdAt: new Date().toISOString(),
          paidAt: contribution.paidAt || new Date().toISOString(),
          paymentMethod: String(contribution.paymentMethod || 'paystack'),
          metadata: contribution.metadata || {}
        };

        // Calculate totals
        const currentTotal = currentContributions.reduce((sum, contrib) => sum + (Number(contrib.amount) || 0), 0);
        const newTotal = currentTotal + newContribution.amount;
        const itemTotal = Number(item.price) * (Number(item.quantity) || 1);
        
        // Check if this contribution completes the payment
        const isFullyFunded = newTotal >= itemTotal;

        return {
          ...item,
          contributions: [...currentContributions, newContribution],
          fullyFunded: isFullyFunded,
          fundedAt: isFullyFunded ? new Date().toISOString() : null,
          totalContributed: newTotal
        };
      }
      return item;
    });

    // Calculate new total contributions across all items
    const totalContributions = updatedItems.reduce((sum, item) => {
      const itemContributions = Array.isArray(item.contributions) 
        ? item.contributions.reduce((itemSum, contrib) => itemSum + (Number(contrib.amount) || 0), 0)
        : 0;
      return sum + itemContributions;
    }, 0);

    // Update the document with new data
    await updateDoc(docRef, {
      items: updatedItems,
      totalContributions: Number(totalContributions) || 0,
      updatedAt: serverTimestamp(),
      lastContributionAt: serverTimestamp()
    });

    return true;
  } catch (error) {
    console.error('Error adding contribution:', error);
    return false;
  }
};

// Function to get all contributions for an item
export const getItemContributions = async (wishlistId, itemId) => {
  try {
    const wishlist = await getWishlistById(wishlistId);
    if (!wishlist) return [];

    const item = wishlist.items.find(item => item.id === itemId);
    return item?.contributions || [];
  } catch (error) {
    console.error('Error getting item contributions:', error);
    return [];
  }
}; 