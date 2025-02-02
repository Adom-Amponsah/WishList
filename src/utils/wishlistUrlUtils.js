// Function to create standalone HTML page
function createStandaloneHTML(wishlist, userData) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${wishlist.name} - Wishlist</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 0; background: #f9fafb; }
    .header { background: linear-gradient(to right, #2563eb, #7c3aed); color: white; padding: 20px; }
    .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
    .user-info { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    .items-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; }
    .item-card { background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    .item-image { aspect-ratio: 1; background: #f3f4f6; }
    .item-image img { width: 100%; height: 100%; object-fit: contain; }
    .item-details { padding: 15px; }
    .price { color: #2563eb; font-weight: bold; font-size: 1.1em; }
    .contact { color: #2563eb; text-decoration: none; }
    .contact:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <div class="header">
    <div class="container">
      <h1>${wishlist.name}</h1>
      <p>${wishlist.eventType} • Created ${new Date().toLocaleDateString()}</p>
    </div>
  </div>

  <div class="container">
    <div class="user-info">
      <h2>Wishlist Owner</h2>
      <p>${userData.name}</p>
      ${userData.email ? `<p><a href="mailto:${userData.email}" class="contact">${userData.email}</a></p>` : ''}
      ${userData.phone ? `<p><a href="tel:${userData.phone}" class="contact">${userData.phone}</a></p>` : ''}
    </div>

    <div class="items-grid">
      ${wishlist.items.map(item => `
        <div class="item-card">
          ${item.image_url ? `
            <div class="item-image">
              <img src="${item.image_url}" alt="${item.title}">
            </div>
          ` : ''}
          <div class="item-details">
            <h3>${item.title}</h3>
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span class="price">₵${(item.price * (item.quantity || 1)).toLocaleString()}</span>
              ${item.quantity > 1 ? `<span>Quantity: ${item.quantity}</span>` : ''}
            </div>
          </div>
        </div>
      `).join('')}
    </div>
  </div>
</body>
</html>
`;}

// Function to encode wishlist data into URL-safe string
export function encodeWishlistToURL(wishlist, userData) {
  // Create minimal data structure to reduce URL size
  const data = {
    n: wishlist.name,
    e: wishlist.eventType,
    i: wishlist.items.map(item => ({
      t: item.title,
      p: item.price,
      q: item.quantity || 1,
      img: item.image_url
    })),
    u: {
      n: userData.name,
      e: userData.email,
      p: userData.phone
    },
    d: new Date().toISOString()
  };
  
  // Convert to JSON string then to base64
  const jsonString = JSON.stringify(data);
  const base64 = btoa(encodeURIComponent(jsonString));
  
  // Make it URL-safe
  const urlSafeString = base64
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
    
  // Return just the encoded data part
  return urlSafeString;
}

// Function to decode wishlist data from URL
export function decodeWishlistFromURL(encodedData) {
  try {
    if (!encodedData) {
      throw new Error('No wishlist data found');
    }
    
    // Convert URL-safe string back to regular base64
    const base64 = encodedData
      .replace(/-/g, '+')
      .replace(/_/g, '/');
      
    // Decode base64 to JSON string
    const jsonString = decodeURIComponent(atob(base64));
    
    // Parse JSON string to object
    const data = JSON.parse(jsonString);
    
    // Convert back to full wishlist format
    return {
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
      sharedAt: data.d,
      totalPrice: data.i.reduce((sum, item) => sum + (item.p * item.q), 0)
    };
  } catch (error) {
    console.error('Error decoding wishlist:', error);
    return null;
  }
} 