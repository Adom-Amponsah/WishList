rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    // Allow public read access to wishlists
    match /wishlists/{wishlistId} {
      // Anyone can read wishlists
      allow read: if true;
      
      // Anyone can create wishlists with proper structure
      allow create: if request.resource.data.keys().hasAll(['name', 'eventType', 'items', 'totalPrice', 'createdAt']) 
                   && request.resource.data.items is list;
      
      // Allow updates with proper validation
      allow update: if request.resource.data.keys().hasAll(['items', 'totalPrice', 'updatedAt']) 
                   && request.resource.data.items is list;
      
      // Anyone can delete wishlists
      allow delete: if true;
    }
    
    // Deny access to all other collections by default
    match /{document=**} {
      allow read, write: if false;
    }
  }
}