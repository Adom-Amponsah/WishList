import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  const scrollToSection = (sectionId) => {
    // Close the mobile menu first
    setIsOpen(false);
    
    // Add a small delay for mobile to allow the menu to close
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        const offset = 80; // Offset for the fixed header
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }, 300); // 300ms delay matches the mobile menu animation duration
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/80 backdrop-blur-lg shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img 
              src="/images/LockUp_White.png" 
              alt="Nokonice Logo"
              className={`h-8 w-auto transition-all duration-300 ${
                scrolled ? 'brightness-0' : 'brightness-100'
              }`}
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
          <button
              onClick={() => scrollToSection('how-it-works')}
              className={`hover:text-black px-3 py-2 text-sm font-medium transition-colors duration-300 ${
                scrolled ? 'text-gray-900' : 'text-gray-300 hover:text-white'
              }`}
            >
              How it Works
            </button>
            <button
              onClick={() => scrollToSection('features')}
              className={`hover:text-black px-3 py-2 text-sm font-medium transition-colors duration-300 ${
                scrolled ? 'text-gray-900' : 'text-gray-300 hover:text-white'
              }`}
            >
              Features
            </button>
            
            <button
              onClick={() => scrollToSection('testimonials')}
              className={`hover:text-black px-3 py-2 text-sm font-medium transition-colors duration-300 ${
                scrolled ? 'text-gray-900' : 'text-gray-300 hover:text-white'
              }`}
            >
              Testimonials
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className={`hover:text-black px-3 py-2 text-sm font-medium transition-colors duration-300 ${
                scrolled ? 'text-gray-900' : 'text-gray-300 hover:text-white'
              }`}
            >
              Contact
            </button>
            <Link
              to="/auth"
              className={`border px-4 py-2 rounded-full text-sm font-medium
                      transition-all duration-300 ${
                        scrolled 
                        ? 'bg-black text-white hover:bg-gray-800' 
                        : 'bg-white/10 border-white/20 text-white hover:bg-white hover:text-black'
                      }`}
            >
              Sign In
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`p-2 transition-colors duration-300 ${
                scrolled ? 'text-gray-900 hover:text-black' : 'text-gray-300 hover:text-white'
              }`}
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <motion.div
        initial={false}
        animate={{ height: isOpen ? 'auto' : 0 }}
        transition={{ duration: 0.3 }}
        className={`md:hidden overflow-hidden ${
          scrolled ? 'bg-white/90 backdrop-blur-lg' : 'bg-black/50 backdrop-blur-lg'
        }`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1">
        <button
            onClick={() => scrollToSection('how-it-works')}
            className={`block px-3 py-2 text-base font-medium w-full text-left ${
              scrolled ? 'text-gray-900 hover:text-black' : 'text-gray-300 hover:text-white'
            }`}
          >
            How it Works
          </button>
          <button
            onClick={() => scrollToSection('features')}
            className={`block px-3 py-2 text-base font-medium w-full text-left ${
              scrolled ? 'text-gray-900 hover:text-black' : 'text-gray-300 hover:text-white'
            }`}
          >
            Features
          </button>
        
          <button
            onClick={() => scrollToSection('testimonials')}
            className={`block px-3 py-2 text-base font-medium w-full text-left ${
              scrolled ? 'text-gray-900 hover:text-black' : 'text-gray-300 hover:text-white'
            }`}
          >
            Testimonials
          </button>
          <button
            onClick={() => scrollToSection('contact')}
            className={`block px-3 py-2 text-base font-medium w-full text-left ${
              scrolled ? 'text-gray-900 hover:text-black' : 'text-gray-300 hover:text-white'
            }`}
          >
            Contact
          </button>
          <Link
            to="/auth"
            className={`block px-3 py-2 text-base font-medium ${
              scrolled ? 'text-gray-900 hover:text-black' : 'text-gray-300 hover:text-white'
            }`}
          >
            Sign In
          </Link>
        </div>
      </motion.div>
    </motion.nav>
  );
};

export default Navbar; 