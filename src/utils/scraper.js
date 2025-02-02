import axios from 'axios'
import cheerio from 'cheerio'
import { db } from '../firebase/config'
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore'

const PROXY_URL = 'https://proxy.scrapeops.io/v1/?api_key=2c578217-83a1-49bf-8937-90b009fefedc&render_js=true&country=gh&url='

// Function to scrape products from Melcom
export async function scrapeMelcomProducts() {
  try {
    // Array to store all products
    const products = []
    
    // Start with just one category for testing
    const categories = [
      'electronics'
    ]
    
    for (const category of categories) {
      console.log(`Starting to scrape category: ${category}`)
      
      // Use the proxy URL to fetch the page
      const url = `https://melcom.com/category/${category}`
      console.log(`Fetching URL: ${url}`)
      const response = await axios.get(PROXY_URL + encodeURIComponent(url))
      console.log('Got response from proxy')
      const html = response.data
      
      // Load HTML into cheerio
      const $ = cheerio.load(html)
      console.log('Loaded HTML into cheerio')
      
      // Get all products on the page
      $('.product-item').each((index, element) => {
        const product = {
          title: $(element).find('.product-title').text().trim(),
          price: $(element).find('.product-price').text().trim(),
          image: $(element).find('.product-image img').attr('src'),
          url: $(element).find('a').attr('href'),
          sku: $(element).attr('data-sku') || Math.random().toString(36).substring(7),
          category: $('.category-title').text().trim() || category,
          createdAt: new Date(),
          updatedAt: new Date()
        }
        
        if (product.title && product.price) {
          console.log(`Found product: ${product.title} - ${product.price}`)
          products.push(product)
        }
      })
      
      console.log(`Found ${products.length} products in ${category} category`)
    }
    
    // Save products to Firestore
    console.log('Starting to save products to Firestore...')
    const productsRef = collection(db, 'products')
    let savedCount = 0
    
    for (const product of products) {
      try {
        // Check if product already exists
        const q = query(productsRef, where('sku', '==', product.sku))
        const querySnapshot = await getDocs(q)
        
        if (querySnapshot.empty) {
          const docRef = await addDoc(productsRef, product)
          savedCount++
          console.log(`Saved product to Firestore with ID: ${docRef.id}`)
          console.log(`Product details: ${product.title} - ${product.price}`)
        } else {
          console.log(`Product already exists: ${product.title}`)
        }
      } catch (error) {
        console.error(`Error saving product ${product.title}:`, error)
      }
    }
    
    console.log(`Successfully scraped ${products.length} products and saved ${savedCount} new products to Firestore`)
    return products
    
  } catch (error) {
    console.error('Error scraping products:', error)
    throw error
  }
}

// Function to get products from Firestore
export async function getProductsFromDB(category = null) {
  try {
    const productsRef = collection(db, 'products')
    let q = productsRef
    
    if (category) {
      q = query(productsRef, where('category', '==', category))
    }
    
    const querySnapshot = await getDocs(q)
    const products = []
    
    querySnapshot.forEach((doc) => {
      products.push({ id: doc.id, ...doc.data() })
    })
    
    return products
  } catch (error) {
    console.error('Error getting products from DB:', error)
    throw error
  }
}

// Function to search products in Firestore
export async function searchProducts(searchTerm) {
  try {
    const products = await getProductsFromDB()
    return products.filter(product => 
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
    )
  } catch (error) {
    console.error('Error searching products:', error)
    throw error
  }
} 