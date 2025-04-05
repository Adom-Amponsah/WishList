#!/usr/bin/env node

const fs = require('fs');

// Configuration - EDIT THESE VALUES
const DOMAIN = 'www.nokonice.com';
const OUTPUT_FILE = 'affiliate-links.txt';

/**
 * Generate affiliate/referral links for specified user IDs
 * 
 * @param {Array<string>} userIds - Array of user IDs to generate links for
 * @returns {Object} - Object mapping user IDs to their affiliate links
 */
function generateAffiliateLinks(userIds) {
  const links = {};
  
  for (const userId of userIds) {
    links[userId] = `https://${DOMAIN}/auth?ref=${userId}`;
  }
  
  return links;
}

/**
 * Save affiliate links to a text file
 * 
 * @param {Object} links - Object mapping user IDs to their affiliate links
 * @param {string} outputFile - File path to save the links
 */
function saveLinksToFile(links, outputFile) {
  let content = `Nokonice Affiliate Links\n`;
  content += `Generated: ${new Date().toLocaleString()}\n\n`;
  
  for (const [userId, link] of Object.entries(links)) {
    content += `User ID: ${userId}\n`;
    content += `Affiliate Link: ${link}\n\n`;
  }
  
  fs.writeFileSync(outputFile, content);
  console.log(`✅ Affiliate links saved to ${outputFile}`);
}

// Get user IDs from command line arguments or use defaults
const userIds = process.argv.slice(2);

if (userIds.length === 0) {
  console.log('No user IDs provided. Using example IDs.');
  userIds.push('user123', 'admin456', 'manager789');
}

// Generate the affiliate links
const affiliateLinks = generateAffiliateLinks(userIds);

// Display the links in console
console.log('\n======= NOKONICE AFFILIATE LINKS =======\n');
for (const [userId, link] of Object.entries(affiliateLinks)) {
  console.log(`User: ${userId}`);
  console.log(`Link: ${link}`);
  console.log('');
}

// Save links to file
saveLinksToFile(affiliateLinks, OUTPUT_FILE);
console.log(`\nTo use this script with your own user IDs:`);
console.log(`node generate-affiliate-links.cjs userId1 userId2 userId3 ...`);

/*
HOW TO USE:
1. Make sure you have Node.js installed
2. Run the script: node generate-affiliate-links.cjs [userIds...]
3. Share the generated links with your affiliates
4. When users sign up through these links, they'll be tracked in your database
*/ 