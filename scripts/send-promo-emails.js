const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs } = require('firebase/firestore');
const emailjs = require('@emailjs/nodejs');

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD1W4576lu29YmSYD46WBH5aJu0XFlOv6o",
  authDomain: "nokonice-5a480.firebaseapp.com",
  projectId: "nokonice-5a480",
  storageBucket: "nokonice-5a480.firebasestorage.app",
  messagingSenderId: "909955408970",
  appId: "1:909955408970:web:598b3720c64d6d8b43f2b3",
  measurementId: "G-756QGTREY3"
};

// EmailJS configuration
const EMAIL_SERVICE_ID = 'service_4kr1qg2';
const EMAIL_TEMPLATE_ID = 'template_z2burys';
const EMAIL_PUBLIC_KEY = 'EY75OurAPO7mLMPce';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Initialize EmailJS
emailjs.init({
  publicKey: EMAIL_PUBLIC_KEY,
  // Add your private key here (from EmailJS dashboard)
  privateKey: "InCnKWd1JSjTHICOqPCUZ" // TODO: Replace with your private key
});

async function sendPromoEmail(user) {
  try {
    const templateParams = {
      to_name: user.displayName || user.name || user.username,
      to_email: user.email,
      reply_to: 'support@nokonice.com',
      app_name: 'Nokonice',
      create_wishlist_link: 'https://www.nokonice.com/',
      logo_url: 'https://res.cloudinary.com/daonkxbfz/image/upload/v1741894255/gllhbwth5roamqjhcbqs.png'
    };

    const response = await emailjs.send(
      EMAIL_SERVICE_ID,
      EMAIL_TEMPLATE_ID,
      templateParams
    );

    console.log(`✅ Email sent successfully to ${user.email}`);
    return response;
  } catch (error) {
    console.error(`❌ Failed to send email to ${user.email}:`, error);
    return null;
  }
}

async function sendEmailsToAllUsers() {
  try {
    console.log('🔍 Fetching users from database...');
    const usersRef = collection(db, 'users');
    const querySnapshot = await getDocs(usersRef);
    
    console.log(`📊 Found ${querySnapshot.size} users`);
    
    let successCount = 0;
    let failureCount = 0;
    
    // Add a small delay between emails to avoid rate limits
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    
    for (const doc of querySnapshot.docs) {
      const user = doc.data();
      
      // Skip users without email
      if (!user.email) {
        console.log(`⚠️ Skipping user ${user.username} - no email address`);
        continue;
      }
      
      // Send email
      const result = await sendPromoEmail(user);
      
      if (result) {
        successCount++;
      } else {
        failureCount++;
      }
      
      // Wait 1 second between emails to avoid overwhelming the service
      await delay(1000);
    }
    
    console.log('\n📈 Email Campaign Summary:');
    console.log(`✅ Successfully sent: ${successCount}`);
    console.log(`❌ Failed to send: ${failureCount}`);
    console.log(`📧 Total processed: ${successCount + failureCount}`);
    
  } catch (error) {
    console.error('Failed to process users:', error);
  } finally {
    process.exit();
  }
}

// Run the script
console.log('🚀 Starting promotional email campaign...');
sendEmailsToAllUsers(); 