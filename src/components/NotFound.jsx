import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiGift } from 'react-icons/fi';

const NotFound = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check if the current path matches a shared wishlist pattern
    const shareIdMatch = location.pathname.match(/\/share\/([^\/]+)/);
    if (shareIdMatch) {
      // If it's a shared wishlist URL, redirect to the SharedWishlistViewer
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <FiGift className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Page Not Found</h1>
        <p className="text-gray-600 mb-4">
          The page you're looking for doesn't exist or you may not have permission to view it.
        </p>
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Go to Homepage
        </button>
      </div>
    </div>
  );
};

export default NotFound; 