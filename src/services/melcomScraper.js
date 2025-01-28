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
const PROXY_URL = 'https://proxy.scrapeops.io/v1/?api_key=a0a77055-fbff-4791-bb11-9cb771f81e98&render_js=true&country=gh&url='

export const scrapeCategory = async (categoryId) => {
  try {
    const url = `https://melcom.com/categories.html?cat=${categoryId}`
    console.log('Fetching URL:', url)
    
    const encodedUrl = encodeURIComponent(url)
    console.log('Encoded URL:', `${PROXY_URL}${encodedUrl}`)
    
    const response = await axios.get(`${PROXY_URL}${encodedUrl}`, {
      headers: {
        'accept': 'application/json'
      },
      timeout: 60000 // 60 second timeout since JS rendering might take longer
    })
    
    // Check if we got an actual HTML response
    if (!response.data.includes('container-products-switch')) {
      console.log('Did not receive expected product page HTML')
      console.log('Response data preview:', response.data.substring(0, 1000))
      throw new Error('Failed to get product page content')
    }
    
    console.log('Response status:', response.status)
    console.log('Raw HTML length:', response.data.length)
    console.log('First 500 characters of response:', response.data.substring(0, 500))
    
    const $ = cheerio.load(response.data)
    console.log('HTML loaded with Cheerio')
    
    // Log meta tags for debugging
    console.log('Meta Tags:')
    $('meta').each((i, elem) => {
      console.log({
        name: $(elem).attr('name'),
        property: $(elem).attr('property'),
        content: $(elem).attr('content')
      })
    })

    // Log title for debugging
    console.log('Page Title:', $('title').text())

    // Log some basic HTML structure
    console.log('Body classes:', $('body').attr('class'))
    console.log('Main content div exists:', $('#maincontent').length > 0)
    console.log('Product container exists:', $('.container-products-switch').length > 0)
    
    const products = []

    // Updated selector to match the actual HTML structure
    $('.container-products-switch.products.list.items.product-items li.item.product.product-item').each((index, element) => {
      const $el = $(element)
      
      // Get product link and details
      const productLink = $el.find('a.product.photo.product-item-photo')
      const url = productLink.attr('href')
      const title = $el.find('.product-item-link').text().trim()
      
      // Get product image - updated to handle the new image structure
      const image = $el.find('.product-image-photo').first().attr('src')
      
      // Get price - handle both special price and regular price
      const specialPrice = $el.find('.special-price .price').text().trim()
      const regularPrice = $el.find('.old-price .price').text().trim()
      const price = specialPrice || regularPrice
      
      // Get SKU from form data
      const sku = $el.find('[data-product-sku]').attr('data-product-sku')

      console.log(`Product ${index + 1}:`, {
        title,
        price,
        image,
        url,
        sku,
        specialPrice,
        regularPrice
      })

      if (title && price && image && url) {
        products.push({
          title,
          price,
          image,
          url,
          sku,
          originalPrice: regularPrice || price,
          category: MELCOM_CATEGORIES.find(cat => cat.id === categoryId)?.name
        })
      } else {
        console.log(`Product ${index + 1} missing required fields:`, {
          hasTitle: !!title,
          hasPrice: !!price,
          hasImage: !!image,
          hasUrl: !!url
        })
      }
    })

    console.log('Total valid products found:', products.length)

    if (products.length === 0) {
      throw new Error('No products found in this category')
    }

    return products
  } catch (error) {
    console.error('Scraping error:', {
      message: error.message,
      response: error.response?.status,
      data: error.response?.data?.substring(0, 200),
      url: error.config?.url
    })
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


