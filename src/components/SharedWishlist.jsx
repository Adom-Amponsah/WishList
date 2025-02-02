import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getSharedWishlist } from '../services/wishlistService';
import { FiMail, FiPhone, FiHome } from 'react-icons/fi';

export default function SharedWishlist() {
  const { shareId } = useParams();
  const [wishlist, setWishlist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadSharedWishlist = async () => {
      try {
        const data = await getSharedWishlist(shareId);
        if (!data) {
          throw new Error('Wishlist not found');
        }
        setWishlist(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadSharedWishlist();
  }, [shareId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Oops!</h2>
          <p className="text-gray-600">{error}</p>
          <Link to="/" className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-700">
            <FiHome className="mr-2" /> Go to Homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-sm p-6 mb-6 text-white">
          <h1 className="text-3xl font-bold mb-2">{wishlist.name}</h1>
          <p className="opacity-90">
            Shared by {wishlist.userData.name} • {new Date(wishlist.sharedAt).toLocaleDateString()}
          </p>
          
          {/* Contact Information */}
          <div className="mt-4 space-y-2">
            {wishlist.userData.email && (
              <div className="flex items-center">
                <FiMail className="mr-2" />
                <a href={`mailto:${wishlist.userData.email}`} className="hover:underline">
                  {wishlist.userData.email}
                </a>
              </div>
            )}
            {wishlist.userData.phone && (
              <div className="flex items-center">
                <FiPhone className="mr-2" />
                <a href={`tel:${wishlist.userData.phone}`} className="hover:underline">
                  {wishlist.userData.phone}
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.items.map((item) => (
            <div 
              key={item.id} 
              className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
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
                    ₵{item.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                  {item.quantity > 1 && (
                    <span className="text-sm text-gray-500">
                      Qty: {item.quantity}
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

        {/* Back to Homepage */}
        <div className="mt-8 text-center">
          <Link 
            to="/" 
            className="inline-flex items-center text-blue-600 hover:text-blue-700"
          >
            <FiHome className="mr-2" /> Back to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
} 