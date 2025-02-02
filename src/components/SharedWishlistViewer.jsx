import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiGift, FiUser, FiMail, FiPhone, FiHome } from 'react-icons/fi';

const SharedWishlistViewer = () => {
  const { shareId } = useParams();
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!shareId) {
      setError('Invalid wishlist link');
      return;
    }

    try {
      // Decode the wishlist data from the URL
      const decodedData = JSON.parse(decodeURIComponent(atob(shareId)));
      console.log('Decoded wishlist data:', decodedData);
      setWishlist(decodedData);
    } catch (err) {
      console.error('Error decoding wishlist data:', err);
      setError('Invalid wishlist link. The data might be corrupted.');
    }
  }, [shareId]);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <FiGift className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Oops!</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <FiHome className="mr-2" /> Go to Homepage
          </button>
        </div>
      </div>
    );
  }

  if (!wishlist) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading wishlist...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-2">{wishlist.name}</h1>
          <p className="opacity-90">
            {wishlist.eventType} • Created {new Date(wishlist.sharedAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* User Info */}
      {wishlist.userData && (
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Wishlist Owner</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <FiUser className="text-gray-400" />
                <span>{wishlist.userData.name}</span>
              </div>
              {wishlist.userData.email && (
                <div className="flex items-center gap-2">
                  <FiMail className="text-gray-400" />
                  <a 
                    href={`mailto:${wishlist.userData.email}`}
                    className="text-blue-600 hover:underline"
                  >
                    {wishlist.userData.email}
                  </a>
                </div>
              )}
              {wishlist.userData.phone && (
                <div className="flex items-center gap-2">
                  <FiPhone className="text-gray-400" />
                  <a 
                    href={`tel:${wishlist.userData.phone}`}
                    className="text-blue-600 hover:underline"
                  >
                    {wishlist.userData.phone}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Items Grid */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.items.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
              {item.image_url && (
                <div className="aspect-square bg-gray-50">
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="w-full h-full object-contain"
                  />
                </div>
              )}
              <div className="p-4">
                <h3 className="font-medium text-gray-900 mb-2">{item.title}</h3>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-blue-600">
                    ₵{(item.price * (item.quantity || 1)).toLocaleString()}
                  </span>
                  {item.quantity > 1 && (
                    <span className="text-sm text-gray-500">
                      Quantity: {item.quantity}
                    </span>
                  )}
                </div>
                {item.notes && (
                  <p className="mt-2 text-sm text-gray-600">{item.notes}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Back to Homepage */}
      <div className="max-w-7xl mx-auto px-4 py-6 text-center">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center px-4 py-2 text-blue-600 hover:text-blue-700"
        >
          <FiHome className="mr-2" /> Back to Homepage
        </button>
      </div>
    </div>
  );
};

export default SharedWishlistViewer; 