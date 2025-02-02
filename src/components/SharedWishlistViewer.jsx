import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { FiGift, FiUser, FiMail, FiPhone } from 'react-icons/fi';

const SharedWishlistViewer = () => {
  const { shareId } = useParams();
  const [wishlist, setWishlist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        console.log('Fetching wishlist with ID:', shareId);
        const docRef = doc(db, 'shared_wishlists', shareId);
        const docSnap = await getDoc(docRef);
        
        if (!docSnap.exists()) {
          console.log('No wishlist found with ID:', shareId);
          setError('Wishlist not found');
          return;
        }

        const wishlistData = { id: docSnap.id, ...docSnap.data() };
        console.log('Retrieved wishlist:', wishlistData);
        setWishlist(wishlistData);
      } catch (err) {
        console.error('Error fetching wishlist:', err);
        setError('Failed to load wishlist');
      } finally {
        setLoading(false);
      }
    };

    if (shareId) {
      fetchWishlist();
    }
  }, [shareId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <FiGift className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Oops!</h2>
          <p className="text-gray-600 mb-4">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">{wishlist?.name}</h1>
          <p className="mt-2 text-gray-600">{wishlist?.eventType}</p>
        </div>
      </div>

      {/* User Info */}
      {wishlist?.userData && (
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="bg-white rounded-lg shadow p-6">
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
          {wishlist?.items?.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="aspect-square bg-gray-50">
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="w-full h-full object-contain"
                />
              </div>
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
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SharedWishlistViewer; 