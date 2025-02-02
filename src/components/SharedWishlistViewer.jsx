import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiGift, FiUser, FiMail, FiPhone, FiHome } from 'react-icons/fi';
import { decodeWishlistFromURL } from '../utils/wishlistUrlUtils';

export default function SharedWishlistViewer() {
  const [wishlist, setWishlist] = useState(null);
  const [error, setError] = useState(null);
  const { encodedData } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    try {
      if (!encodedData) {
        throw new Error('Invalid wishlist link');
      }

      // Decode the wishlist data
      const decodedWishlist = decodeWishlistFromURL(encodedData);
      
      if (!decodedWishlist) {
        throw new Error('Unable to load wishlist data');
      }

      setWishlist(decodedWishlist);
    } catch (err) {
      setError(err.message);
    }
  }, [encodedData]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            Go to Homepage
          </button>
        </div>
      </div>
    );
  }

  if (!wishlist) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading wishlist...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold mb-2">{wishlist.name}</h1>
          <p className="text-gray-600 mb-4">{wishlist.eventType} • Shared {new Date(wishlist.sharedAt).toLocaleDateString()}</p>
          
          <div className="border-t pt-4 mt-4">
            <h2 className="text-xl font-semibold mb-2">Wishlist Owner</h2>
            <p className="text-gray-700">{wishlist.userData.name}</p>
            {wishlist.userData.email && (
              <p><a href={`mailto:${wishlist.userData.email}`} className="text-blue-600 hover:underline">{wishlist.userData.email}</a></p>
            )}
            {wishlist.userData.phone && (
              <p><a href={`tel:${wishlist.userData.phone}`} className="text-blue-600 hover:underline">{wishlist.userData.phone}</a></p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.items.map((item, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
              {item.image_url && (
                <div className="aspect-w-1 aspect-h-1">
                  <img src={item.image_url} alt={item.title} className="w-full h-full object-contain" />
                </div>
              )}
              <div className="p-4">
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <div className="flex justify-between items-center">
                  <span className="text-blue-600 font-bold">₵{(item.price * item.quantity).toLocaleString()}</span>
                  {item.quantity > 1 && <span className="text-gray-500">Quantity: {item.quantity}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center">
            <span className="text-xl font-semibold">Total</span>
            <span className="text-2xl font-bold text-blue-600">₵{wishlist.totalPrice.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
} 