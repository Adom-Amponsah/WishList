import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import HeroSection from './components/HeroSection'
import EventSelection from './components/EventSelection'
import WishlistCreator from './components/WishlistCreator'
import WishlistsOverview from './components/WishlistsOverview'
import WishlistDetails from './components/WishlistDetails'
import { useState } from 'react'
import './App.css'

function App() {
  return (
    <Router>
      <div className="min-h-screen">
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

        {/* Navigation only shows on pages other than HeroSection */}
        <Routes>
          <Route path="/" element={<HeroSection />} />
          <Route 
            path="*" 
            element={
              <nav className="bg-white shadow-sm">
                <div className="container mx-auto px-4 py-4">
                  <div className="flex justify-between items-center">
                    <Link to="/" className="text-2xl font-bold text-blue-600">
                      WishList
                    </Link>
                    <div className="flex gap-4">
                      <Link
                        to="/my-wishlists"
                        className="px-4 py-2 text-gray-600 hover:text-gray-900"
                      >
                        My Wishlists
                      </Link>
                    </div>
                  </div>
                </div>
              </nav>
            }
          />
        </Routes>

        <Routes>
          <Route path="/" element={<HeroSection />} />
          <Route 
            path="/events" 
            element={
              <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black">
                <EventSelection />
              </div>
            } 
          />
          <Route 
            path="/create/:eventType" 
            element={
              <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black">
                <WishlistCreator />
              </div>
            } 
          />
          <Route path="/my-wishlists" element={<WishlistsOverview />} />
          <Route path="/wishlist/:id" element={<WishlistDetails />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
