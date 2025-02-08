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
  serverTimestamp,
  limit
} from 'firebase/firestore';

// Collection name constant
const USERS_COLLECTION = 'users';

// Get user from localStorage
export const getStoredUser = () => {
  const userStr = localStorage.getItem('wishlist_user');
  return userStr ? JSON.parse(userStr) : null;
};

// Save user to localStorage
export const setStoredUser = (user) => {
  localStorage.setItem('wishlist_user', JSON.stringify(user));
};

// Clear user from localStorage
export const clearStoredUser = () => {
  localStorage.removeItem('wishlist_user');
};

// Create a new user
export const createUser = async (userData) => {
  try {
    // Check if username already exists
    const exists = await checkUsernameExists(userData.username);
    if (exists) {
      throw new Error('Username already taken');
    }

    // Create user document based on auth type
    const userDoc = {
      username: userData.username.toLowerCase(),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    // If it's a Google auth user, add Google-specific fields
    if (userData.authProvider === 'google') {
      userDoc.email = userData.email;
      userDoc.displayName = userData.displayName;
      userDoc.photoURL = userData.photoURL;
      userDoc.authProvider = 'google';
      userDoc.uid = userData.uid;
    } else {
      // For regular username/password auth
      userDoc.password = userData.password; // In a real app, this should be hashed
    }

    const docRef = await addDoc(collection(db, USERS_COLLECTION), userDoc);
    const newUser = {
      id: docRef.id,
      ...userDoc,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Store user in localStorage (excluding password)
    const { password, ...userWithoutPassword } = newUser;
    setStoredUser(userWithoutPassword);

    return userWithoutPassword;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

// Verify user credentials
export const verifyUser = async (username, password) => {
  try {
    const usersRef = collection(db, USERS_COLLECTION);
    const q = query(
      usersRef,
      where('username', '==', username.toLowerCase()),
      where('password', '==', password), // In real app, compare hashed passwords
      limit(1)
    );

    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      return null;
    }

    const userDoc = querySnapshot.docs[0];
    const userData = {
      id: userDoc.id,
      ...userDoc.data(),
      createdAt: userDoc.data().createdAt?.toDate().toISOString(),
      updatedAt: userDoc.data().updatedAt?.toDate().toISOString()
    };

    // Store user in localStorage (excluding password)
    const { password: _, ...userWithoutPassword } = userData;
    setStoredUser(userWithoutPassword);

    return userWithoutPassword;
  } catch (error) {
    console.error('Error verifying user:', error);
    throw error;
  }
};

// Check if username exists
export const checkUsernameExists = async (username) => {
  try {
    const usersRef = collection(db, USERS_COLLECTION);
    const q = query(
      usersRef,
      where('username', '==', username.toLowerCase()),
      limit(1)
    );
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  } catch (error) {
    console.error('Error checking username:', error);
    return false;
  }
};

// Update user profile
export const updateUserProfile = async (userId, updates) => {
  try {
    const userRef = doc(db, USERS_COLLECTION, userId);
    const updateData = {
      ...updates,
      updatedAt: serverTimestamp()
    };

    await updateDoc(userRef, updateData);

    // Update stored user data
    const storedUser = getStoredUser();
    if (storedUser && storedUser.id === userId) {
      setStoredUser({
        ...storedUser,
        ...updates,
        updatedAt: new Date().toISOString()
      });
    }

    return true;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

// Get user by ID
export const getUserById = async (userId) => {
  try {
    const userRef = doc(db, USERS_COLLECTION, userId);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      return null;
    }

    const userData = {
      id: userSnap.id,
      ...userSnap.data(),
      createdAt: userSnap.data().createdAt?.toDate().toISOString(),
      updatedAt: userSnap.data().updatedAt?.toDate().toISOString()
    };

    // Exclude password from returned data
    const { password, ...userWithoutPassword } = userData;
    return userWithoutPassword;
  } catch (error) {
    console.error('Error getting user:', error);
    throw error;
  }
};

// Update user details
export const updateUserDetails = async (userId, userDetails) => {
  try {
    const userRef = doc(db, USERS_COLLECTION, userId);
    const updateData = {
      name: userDetails.name,
      email: userDetails.email,
      phone: userDetails.phone,
      dateOfBirth: userDetails.dateOfBirth,
      location: userDetails.location,
      hasCompletedDetails: true,
      updatedAt: serverTimestamp()
    };

    await updateDoc(userRef, updateData);

    // Update stored user data
    const storedUser = getStoredUser();
    if (storedUser && storedUser.id === userId) {
      setStoredUser({
        ...storedUser,
        ...updateData,
        updatedAt: new Date().toISOString()
      });
    }

    return true;
  } catch (error) {
    console.error('Error updating user details:', error);
    throw error;
  }
};

// Get user details
export const getUserDetails = async (userId) => {
  try {
    const userRef = doc(db, USERS_COLLECTION, userId);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      return null;
    }

    const userData = userSnap.data();
    return {
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      dateOfBirth: userData.dateOfBirth,
      location: userData.location,
      hasCompletedDetails: userData.hasCompletedDetails || false
    };
  } catch (error) {
    console.error('Error getting user details:', error);
    throw error;
  }
};

// Check if user has completed their details
export const hasUserCompletedDetails = async (userId) => {
  try {
    const userDetails = await getUserDetails(userId);
    return userDetails?.hasCompletedDetails || false;
  } catch (error) {
    console.error('Error checking user details completion:', error);
    return false;
  }
}; 