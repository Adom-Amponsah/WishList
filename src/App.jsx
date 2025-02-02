import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import HeroSection from './components/HeroSection'
import EventSelection from './components/EventSelection'
import WishlistCreator from './components/WishlistCreator'
import MyWishlists from './components/MyWishlists'
import WishlistDetails from './components/WishlistDetails'
import AddItemsPage from './components/AddItemsPage'
import SharedWishlist from './components/SharedWishlist'
import './App.css'

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
        <Route path="/events" element={<EventSelection />} />
        <Route path="/create/:eventType" element={<WishlistCreator />} />
        <Route path="/my-wishlists" element={<MyWishlists />} />
        <Route path="/wishlist/:id" element={<WishlistDetails />} />
        <Route path="/wishlist/:id/add-items" element={<AddItemsPage />} />
        <Route path="/share/:shareId" element={<SharedWishlist />} />
      </Routes>
    </BrowserRouter>
  )
}
