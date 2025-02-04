import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Base64 } from 'js-base64';

export default function WishlistLink() {
  const { encodedData } = useParams();

  useEffect(() => {
    try {
      // Decode the HTML content
      const htmlContent = Base64.decode(encodedData);
      
      // Replace the entire document content with the decoded HTML
      document.open();
      document.write(htmlContent);
      document.close();
    } catch (error) {
      console.error('Error rendering wishlist:', error);
      document.body.innerHTML = `
        <div class="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div class="text-center">
            <h2 class="text-2xl font-bold text-gray-900 mb-2">Oops!</h2>
            <p class="text-gray-600 mb-4">Failed to load wishlist. The link might be invalid or corrupted.</p>
            <a href="/" class="text-blue-500 hover:text-blue-600">Return to Home</a>
          </div>
        </div>
      `;
    }
  }, [encodedData]);

  // Return null since we're replacing the entire document content
  return null;
} 