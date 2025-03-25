import { scrapeMelcomProducts } from '../src/utils/scraper.js'

console.log('Starting Melcom product scraper...')

scrapeMelcomProducts()
  .then(products => {
    console.log('Scraping completed')
    process.exit(0)
  })
  .catch(error => {
    console.error('Error running scraper:', error)
    process.exit(1)
  }) 