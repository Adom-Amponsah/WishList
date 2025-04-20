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
  limit,
  orderBy
} from 'firebase/firestore';
import { getAuth, signOut } from 'firebase/auth';

// Collection name constant
const USERS_COLLECTION = 'users';
const REFERRALS_COLLECTION = 'referrals';

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
      email: userData.email,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    // If we have a referrer ID, add it to the user document
    if (userData.referrerId) {
      userDoc.referrerId = userData.referrerId;
      userDoc.referredAt = serverTimestamp();
    }

    // If it's a Google auth user, add Google-specific fields
    if (userData.authProvider === 'google') {
      userDoc.displayName = userData.displayName;
      userDoc.photoURL = userData.photoURL;
      userDoc.authProvider = 'google';
      userDoc.uid = userData.uid;
    } else {
      // For regular username/password auth
      userDoc.password = userData.password; // In a real app, this should be hashed
      userDoc.authProvider = 'email';
    }

    const docRef = await addDoc(collection(db, USERS_COLLECTION), userDoc);
    const newUser = {
      id: docRef.id,
      ...userDoc,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // If there's a referrer, track the referral in a separate collection
    if (userData.referrerId) {
      await trackReferral(userData.referrerId, docRef.id);
    }

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

// Logout user
export const logoutUser = async () => {
  try {
    const auth = getAuth();
    // Sign out from Firebase Auth (for Google auth)
    await signOut(auth);
    // Clear local storage
    clearStoredUser();
    return true;
  } catch (error) {
    console.error('Error logging out:', error);
    throw error;
  }
};

// Track a referral in the database
export const trackReferral = async (referrerId, newUserId) => {
  try {
    // Create a record in the referrals collection
    await addDoc(collection(db, REFERRALS_COLLECTION), {
      referrerId,
      referredUserId: newUserId,
      createdAt: serverTimestamp()
    });
    
    return true;
  } catch (error) {
    console.error('Error tracking referral:', error);
    return false;
  }
};

// Get all users referred by a specific user
export const getReferredUsers = async (userId) => {
  try {
    const referralsRef = collection(db, REFERRALS_COLLECTION);
    const q = query(
      referralsRef,
      where('referrerId', '==', userId)
    );
    
    const querySnapshot = await getDocs(q);
    
    // Return basic referral data
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.().toISOString() || null
    }));
  } catch (error) {
    console.error('Error getting referred users:', error);
    return [];
  }
};

// Get detailed information about users referred by a specific user
export const getReferredUsersDetails = async (userId) => {
  try {
    // First get all referrals
    const referrals = await getReferredUsers(userId);
    
    // Then get details for each referred user
    const referredUsersDetails = await Promise.all(
      referrals.map(async (referral) => {
        try {
          const userRef = doc(db, USERS_COLLECTION, referral.referredUserId);
          const userSnap = await getDoc(userRef);
          
          if (userSnap.exists()) {
            const userData = userSnap.data();
            // Don't include sensitive information like password
            const { password, ...safeUserData } = userData;
            
            return {
              referralId: referral.id,
              referredAt: referral.createdAt,
              userId: referral.referredUserId,
              username: userData.username,
              email: userData.email,
              authProvider: userData.authProvider,
              createdAt: userData.createdAt?.toDate?.().toISOString() || null
            };
          }
          return null;
        } catch (error) {
          console.error(`Error getting user ${referral.referredUserId}:`, error);
          return null;
        }
      })
    );
    
    // Filter out any nulls from failed lookups
    return referredUsersDetails.filter(Boolean);
  } catch (error) {
    console.error('Error getting referred users details:', error);
    return [];
  }
};

// Get count of users referred by a specific user
export const getReferralCount = async (userId) => {
  try {
    const referrals = await getReferredUsers(userId);
    return referrals.length;
  } catch (error) {
    console.error('Error getting referral count:', error);
    return 0;
  }
};

// Get all contributions for wishlists owned by a specific user
export const getUserContributions = async (userId) => {
  try {
    // First get the user's data to get their username
    const userData = await getUserById(userId);
    if (!userData || !userData.username) {
      return [];
    }

    // Query contributions by wishlist owner ID
    const contributionsRef = collection(db, 'contributions');
    const q = query(
      contributionsRef,
      where('wishlistOwnerId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.().toISOString() || null
    }));
  } catch (error) {
    console.error('Error getting user contributions:', error);
    return [];
  }
};

// Get all contributions made to wishlists owned by users referred by a specific user
export const getReferralContributions = async (userId) => {
  try {
    // Query for contributions where referrerId matches the userId
    const contributionsRef = collection(db, 'contributions');
    const q = query(
      contributionsRef,
      where('referrerId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.().toISOString() || null
    }));
  } catch (error) {
    console.error('Error getting referral contributions:', error);
    return [];
  }
};

// Get total contribution amount for a specific user (both direct and from referrals)
export const getUserTotalContributions = async (userId) => {
  try {
    // Get direct contributions
    const directContribs = await getUserContributions(userId);
    const directTotal = directContribs.reduce((sum, contrib) => 
      sum + (Number(contrib.amount) || 0), 0);
      
    // Get referral contributions
    const referralContribs = await getReferralContributions(userId);
    const referralTotal = referralContribs.reduce((sum, contrib) => 
      sum + (Number(contrib.amount) || 0), 0);
      
    return {
      directTotal,
      referralTotal,
      grandTotal: directTotal + referralTotal,
      directCount: directContribs.length,
      referralCount: referralContribs.length
    };
  } catch (error) {
    console.error('Error calculating total contributions:', error);
    return {
      directTotal: 0,
      referralTotal: 0,
      grandTotal: 0,
      directCount: 0,
      referralCount: 0
    };
  }
}; 