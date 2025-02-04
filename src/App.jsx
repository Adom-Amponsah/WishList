import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import HeroSection from './components/HeroSection'
import EventSelection from './components/EventSelection'
import WishlistCreator from './components/WishlistCreator'
import MyWishlists from './components/MyWishlists'
import WishlistDetails from './components/WishlistDetails'
import AddItemsPage from './components/AddItemsPage'
import SharedWishlist from './components/SharedWishlist'
import SharedWishlistViewer from './components/SharedWishlistViewer'
import NotFound from './components/NotFound'
import UsernameSetup from './components/UsernameSetup'
import { getUsername } from './services/wishlistService'
import './App.css'

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const username = getUsername();
  
  if (!username) {
    return <Navigate to="/setup" replace />;
  }
  
  return children;
};

export default function App() {
  return (
    <BrowserRouter>
      <Toaster 
        position="top-right"
        toastOptions={{
          success: {
            duration: 3000,
            style: {
              background: '#10B981',
              color: 'white',
            },
          },
          error: {
            duration: 3000,
            style: {
              background: '#EF4444',
              color: 'white',
            },
          },
        }}
      />

      <Routes>
        <Route path="/" element={<HeroSection />} />
        <Route path="/setup" element={<UsernameSetup />} />
        <Route path="/events" element={
          <ProtectedRoute>
            <EventSelection />
          </ProtectedRoute>
        } />
        <Route path="/create/:eventType" element={
          <ProtectedRoute>
            <WishlistCreator />
          </ProtectedRoute>
        } />
        <Route path="/my-wishlists" element={
          <ProtectedRoute>
            <MyWishlists />
          </ProtectedRoute>
        } />
        <Route path="/wishlist/:id" element={
          <ProtectedRoute>
            <WishlistDetails />
          </ProtectedRoute>
        } />
        <Route path="/wishlist/:id/add-items" element={
          <ProtectedRoute>
            <AddItemsPage />
          </ProtectedRoute>
        } />
        <Route path="/share/:shareId" element={<SharedWishlist />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}
