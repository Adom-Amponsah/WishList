import emailjs from '@emailjs/browser';

const EMAIL_SERVICE_ID = 'service_28ijigs';  // Get this from EmailJS dashboard
const EMAIL_TEMPLATE_ID = 'template_y3g0325'; // Get this from EmailJS dashboard
const EMAIL_PUBLIC_KEY = '2ysBgXe8LQU8wJzz_';   // Get this from EmailJS dashboard

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