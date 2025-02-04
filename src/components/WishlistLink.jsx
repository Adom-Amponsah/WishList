import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiCalendar, FiGift, FiHome } from 'react-icons/fi';
import { Base64 } from 'js-base64';

export default function WishlistLink() {
  const { encodedData } = useParams();
  const [wishlist, setWishlist] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadWishlist = () => {
      try {
        // Decode the URL data
        const jsonString = Base64.decode(encodedData);
        const data = JSON.parse(jsonString);

        // Convert the minimal data structure back to full wishlist format
        const wishlistData = {
          name: data.n,
          eventType: data.e,
          items: data.i.map(item => ({
            title: item.t,
            price: item.p,
            quantity: item.q,
            image_url: item.img
          })),
          userData: {
            name: data.u.n,
            email: data.u.e,
            phone: data.u.p
          },
          createdAt: data.d,
          totalPrice: data.i.reduce((sum, item) => sum + (item.p * item.q), 0)
        };

        setWishlist(wishlistData);
      } catch (error) {
        console.error('Error decoding wishlist:', error);
        setError('Failed to load wishlist. The link might be invalid or corrupted.');
      } finally {
        setLoading(false);
      }
    };

    loadWishlist();
  }, [encodedData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Oops!</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link to="/" className="text-blue-500 hover:text-blue-600 flex items-center justify-center gap-2">
            <FiHome className="w-5 h-5" />
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  if (!wishlist) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{wishlist.name}</h1>
          <div className="flex items-center gap-4 text-gray-600 mb-4">
            <div className="flex items-center gap-1">
              <FiCalendar className="w-4 h-4" />
              <span>{new Date(wishlist.createdAt).toLocaleDateString()}</span>
            </div>
            {wishlist.eventType && (
              <div className="flex items-center gap-1">
                <FiGift className="w-4 h-4" />
                <span>{wishlist.eventType}</span>
              </div>
            )}
          </div>
          
          <div className="border-t pt-4">
            <h2 className="font-semibold text-gray-900 mb-4">Created by {wishlist.userData.name}</h2>
            {wishlist.userData.email && (
              <p className="text-gray-600 mb-2">Email: {wishlist.userData.email}</p>
            )}
            {wishlist.userData.phone && (
              <p className="text-gray-600">Phone: {wishlist.userData.phone}</p>
            )}
          </div>
        </div>

        <div className="space-y-4">
          {wishlist.items.map((item, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm p-4 flex gap-4">
              {item.image_url && (
                <img 
                  src={item.image_url} 
                  alt={item.title}
                  className="w-24 h-24 object-cover rounded-lg"
                />
              )}
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{item.title}</h3>
                <p className="text-gray-600">Quantity: {item.quantity}</p>
                <p className="text-blue-600 font-semibold">₵{item.price}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Total Items: {wishlist.items.length}</span>
            <span className="text-xl font-bold text-gray-900">
              Total: ₵{wishlist.totalPrice}
            </span>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link to="/" className="text-blue-500 hover:text-blue-600 flex items-center justify-center gap-2">
            <FiHome className="w-5 h-5" />
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
} 