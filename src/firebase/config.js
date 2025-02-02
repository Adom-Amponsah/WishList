import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAnalytics } from 'firebase/analytics'

const firebaseConfig = {
  apiKey: "AIzaSyD1W4576lu29YmSYD46WBH5aJu0XFlOv6o",
  authDomain: "nokonice-5a480.firebaseapp.com",
  projectId: "nokonice-5a480",
  storageBucket: "nokonice-5a480.firebasestorage.app",
  messagingSenderId: "909955408970",
  appId: "1:909955408970:web:598b3720c64d6d8b43f2b3",
  measurementId: "G-756QGTREY3"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
export const analytics = getAnalytics(app)
export const db = getFirestore(app) 