import axios from 'axios'
import * as cheerio from 'cheerio'

export const MELCOM_CATEGORIES = [
  { id: '1289', name: 'ELECTRICAL APPLIANCES', count: 511 },
  { id: '1326', name: 'FURNITURE', count: 105 },
  { id: '1352', name: 'SUPERMARKET', count: 3585 },
  { id: '1435', name: 'LIGHTING & HARDWARE', count: 207 },
  { id: '1277', name: 'MOBILES & COMPUTERS', count: 49 },
  { id: '1337', name: 'HOME & KITCHEN ESSENTIALS', count: 1448 },
  { id: '1383', name: 'SPORTS & FITNESS', count: 169 },
  { id: '3159', name: 'BOOKS & STATIONERY', count: 320 },
  { id: '3208', name: 'FASHION & LUGGAGE', count: 66 },
  { id: '3570', name: 'BABY SUPPLIES', count: 82 },
  { id: '1387', name: 'TOYS & ENTERTAINMENT', count: 229 }
]

// Using ScraperOps proxy service with additional parameters
const PROXY_URL = 'https://proxy.scrapeops.io/v1/?api_key=b6e80457-1da0-4df5-a7ca-ff210232b69c&render_js=true&country=gh&url='

const ITEMS_PER_PAGE = 12
const MAX_PAGES = 3  // Maximum number of pages to fetch

export const scrapeCategory = async (categoryId = '', page = 1, searchUrl = '') => {
  try {
    // Use search URL if provided, otherwise use category URL
    const url = searchUrl || `https://melcom.com/categories/${categoryId}?p=${page}`
    console.log('Fetching URL:', url)
    
    const encodedUrl = encodeURIComponent(url)
    console.log('Making request to:', `${PROXY_URL}${encodedUrl}`)
    
    const response = await axios.get(`${PROXY_URL}${encodedUrl}`, {
      headers: {
        'accept': 'application/json'
      }
    })

    if (!response.data) {
      throw new Error('No data received from proxy')
    }

    const $ = cheerio.load(response.data)

    // Get total items count
    const totalItemsText = $('.toolbar-amount .toolbar-number').first().text()
    const totalItems = parseInt(totalItemsText) || 0

    // Get products
    const products = []
    $('.product-item').each((i, el) => {
      const $el = $(el)
      
      // Get product details
      const title = $el.find('.product-item-link').text().trim()
      const link = $el.find('.product-item-link').attr('href')
      const image = $el.find('.product-image-photo').first().attr('src')
      const category = $el.find('.product-category a').text().trim()
      const sku = $el.find('[data-product-sku]').attr('data-product-sku')

      // Get prices
      const specialPrice = $el.find('.special-price .price').text().trim()
      const oldPrice = $el.find('.old-price .price').text().trim()
      
      // Format price display
      let price = specialPrice || oldPrice
      let originalPrice = specialPrice ? oldPrice : null

      // Only add if we have the minimum required data
      if (title && (specialPrice || oldPrice)) {
        products.push({
          title,
          link,
          image,
          category,
          sku,
          price,
          originalPrice
        })
      }
    })

    // Get pagination info
    const hasNextPage = products.length === 32 // Based on default items per page
    
    return {
      products,
      pagination: {
        currentPage: page,
        hasNextPage,
        totalItems
      }
    }
  } catch (error) {
    console.error('Error scraping category:', error)
    throw error
  }
}

export const scrapeProduct = async (url) => {
  try {
    console.log('Fetching product URL:', url)
    
    const encodedUrl = encodeURIComponent(url)
    console.log('Encoded product URL:', `${PROXY_URL}${encodedUrl}`)
    
    const response = await axios.get(`${PROXY_URL}${encodedUrl}`)
    console.log('Product response status:', response.status)
    
    const $ = cheerio.load(response.data)
    console.log('Product HTML loaded')
    
    const title = $('.page-title').text().trim()
    const price = $('.price').first().text().trim()
    const image = $('.gallery-placeholder__image').attr('src')
    
    console.log('Product details found:', { title, price, image })
    
    if (!title || !price || !image) {
      console.log('Missing required product fields:', {
        hasTitle: !!title,
        hasPrice: !!price,
        hasImage: !!image
      })
      throw new Error('Invalid product data')
    }
    
    const details = $('.product.info.detailed').text().trim()
    const type = $('.product.attribute.overview').text().trim()
    const productSku = $('.product.attribute.sku .value').text().trim()
    const availability = $('.stock.available').text().trim()
    
    console.log('Additional product details:', {
      detailsLength: details.length,
      type,
      sku: productSku,
      availability
    })
    
    return {
      title,
      price,
      image,
      details,
      specifications: {
        type,
        sku: productSku,
        availability
      }
    }
  } catch (error) {
    console.error('Product scraping error:', {
      message: error.message,
      response: error.response?.status,
      data: error.response?.data,
      config: error.config
    })
    throw new Error('Failed to fetch product details')
  }
} 

