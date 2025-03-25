import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import puppeteer from 'puppeteer';
import * as emailjs from '@emailjs/nodejs';

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

// Initialize EmailJS with both public and private keys
emailjs.init({
  publicKey: EMAIL_PUBLIC_KEY,
  privateKey: "InCnKWd1JSjTHICOqPCUZ"
});

async function sendPromoEmail(user, browser) {
  const page = await browser.newPage();
  
  try {
    // Create a promise that will resolve when the email is sent
    const emailSentPromise = new Promise((resolve, reject) => {
      page.exposeFunction('onEmailSuccess', resolve);
      page.exposeFunction('onEmailError', (errorMessage) => {
        reject(new Error(errorMessage));
      });
    });

    // Enable console log in the browser context
    page.on('console', msg => console.log('Browser console:', msg.text()));
    page.on('pageerror', err => console.error('Browser error:', err));

    await page.evaluate(async (user, serviceId, templateId, publicKey) => {
      // Load EmailJS in the browser context
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js';
      document.head.appendChild(script);
      
      await new Promise(resolve => script.onload = resolve);
      
      try {
        // Initialize EmailJS
        window.emailjs.init(publicKey);
        
        // Send email
        await window.emailjs.send(serviceId, templateId, {
          to_name: user.displayName || user.name || user.username,
          to_email: user.email,
          reply_to: 'support@nokonice.com',
          app_name: 'Nokonice',
          create_wishlist_link: 'https://www.nokonice.com/',
          logo_url: 'https://res.cloudinary.com/daonkxbfz/image/upload/v1741894255/gllhbwth5roamqjhcbqs.png'
        });
        
        // Signal success
        await window.onEmailSuccess();
      } catch (error) {
        // Convert error to string with all details
        const errorMessage = error.message || error.toString();
        console.error('Email sending failed:', errorMessage);
        await window.onEmailError(errorMessage);
      }
    }, user, EMAIL_SERVICE_ID, EMAIL_TEMPLATE_ID, EMAIL_PUBLIC_KEY);

    // Wait for the email to be sent
    await emailSentPromise;
    console.log(`✅ Email sent successfully to ${user.email}`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to send email to ${user.email}:`, error.message || error);
    return false;
  } finally {
    await page.close();
  }
}

async function sendEmailsToAllUsers() {
  let browser;
  try {
    console.log('🔍 Fetching users from database...');
    const usersRef = collection(db, 'users');
    const querySnapshot = await getDocs(usersRef);
    
    console.log(`📊 Found ${querySnapshot.size} total users`);
    
    // Create a Map to store unique users by email
    const uniqueUsers = new Map();
    
    // Keep only the most recently updated user for each email
    querySnapshot.docs.forEach(doc => {
      const user = doc.data();
      if (!user.email) return;
      
      const existingUser = uniqueUsers.get(user.email);
      if (!existingUser || (user.updatedAt && existingUser.updatedAt && 
          user.updatedAt.toDate() > existingUser.updatedAt.toDate())) {
        uniqueUsers.set(user.email, user);
      }
    });
    
    console.log(`📧 Found ${uniqueUsers.size} unique email addresses`);
    
    let successCount = 0;
    let failureCount = 0;
    let duplicateCount = querySnapshot.size - uniqueUsers.size;
    
    // Launch browser once for all emails
    browser = await puppeteer.launch({
      headless: "new" // Use new headless mode
    });
    
    // Add a small delay between emails to avoid rate limits
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    
    // Send emails to unique users
    for (const user of uniqueUsers.values()) {
      // Send email
      const result = await sendPromoEmail(user, browser);
      
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
    console.log(`🔄 Duplicate emails skipped: ${duplicateCount}`);
    console.log(`📧 Total unique emails processed: ${uniqueUsers.size}`);
    console.log(`👥 Total users in database: ${querySnapshot.size}`);
    
  } catch (error) {
    console.error('Failed to process users:', error);
  } finally {
    if (browser) {
      await browser.close();
    }
    process.exit();
  }
}

// Run the script
console.log('🚀 Starting promotional email campaign...');
sendEmailsToAllUsers(); 