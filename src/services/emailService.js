import emailjs from '@emailjs/browser';

const EMAIL_SERVICE_ID = 'service_28ijigs';  // Get this from EmailJS dashboard
const EMAIL_TEMPLATE_ID = 'template_y3g0325'; // Get this from EmailJS dashboard
const EMAIL_PUBLIC_KEY = '2ysBgXe8LQU8wJzz_';   // Get this from EmailJS dashboard
const WELCOME_EMAIL_TEMPLATE_ID = 'template_w738wah'; // You'll need to create this template in EmailJS

export const sendContributionNotification = async (wishlistOwner, contribution, item) => {
  try {
    const templateParams = {
      to_name: wishlistOwner.name,
      to_email: wishlistOwner.email,
      reply_to: contribution.contributorEmail,
      contributor_name: contribution.contributorName || 'Someone',
      contributor_email: contribution.contributorEmail,
      item_name: item.title,
      contribution_amount: contribution.amount.toLocaleString('en-US', { 
        style: 'currency', 
        currency: 'GHS' 
      }),
      remaining_amount: ((item.price * (item.quantity || 1)) - 
        (item.contributions || []).reduce((sum, contrib) => sum + contrib.amount, 0))
        .toLocaleString('en-US', { style: 'currency', currency: 'GHS' }),
      wishlist_link: window.location.href
    };

    const response = await emailjs.send(
      EMAIL_SERVICE_ID,
      EMAIL_TEMPLATE_ID,
      templateParams,
      EMAIL_PUBLIC_KEY
    );

    return response;
  } catch (error) {
    console.error('Failed to send email notification:', error);
    throw error;
  }
};

export const sendWelcomeEmail = async (user) => {
  try {
    // console.log('Attempting to send welcome email to user:', user);
    // console.log('User email:', user.email);
    // console.log('User display name:', user.displayName);
    // console.log('User username:', user.username);

    const templateParams = {
      to_name: user.displayName || user.username,
      to_email: user.email,
      reply_to: 'support@nokonice.com',
      app_name: 'Nokonice',
      create_wishlist_link: `${window.location.origin}/events/new`,
      logo_url: 'https://res.cloudinary.com/daonkxbfz/image/upload/v1741894255/gllhbwth5roamqjhcbqs.png'
    };

    // console.log('Template params being sent to EmailJS:', templateParams);

    const response = await emailjs.send(
      EMAIL_SERVICE_ID,
      WELCOME_EMAIL_TEMPLATE_ID,
      templateParams,
      EMAIL_PUBLIC_KEY
    );

    // console.log('EmailJS response:', response);
    return response;
  } catch (error) {
    console.error('Failed to send welcome email:', error);
    console.error('Error details:', {
      status: error.status,
      text: error.text,
      stack: error.stack
    });
    throw error;
  }
}; 