import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HeroSection from './components/HeroSection'
import EventSelection from './components/EventSelection'
import WishlistCreator from './components/WishlistCreator'
import './App.css'

function App() {
  return (
    <Router>
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
      </Routes>
    </Router>
  )
}

export default App
