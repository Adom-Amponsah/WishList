import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://rhhcxjijveqtldxjecme.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJoaGN4amlqdmVxdGxkeGplY21lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg0MzQxOTIsImV4cCI6MjA1NDAxMDE5Mn0.7pLGIoYPMhFDpcCmFBNJ2lqL0YMoXpv12z0MxsOj-V0'

export const supabase = createClient(supabaseUrl, supabaseKey)

export async function getAllCategories() {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name')
  
  if (error) {
    console.error('Error fetching categories:', error)
    throw error
  }
  
  return data
}

export async function getProductsByCategory(category, page = 1, itemsPerPage = 30) {
  const start = (page - 1) * itemsPerPage
  const end = start + itemsPerPage - 1

  const { data, error, count } = await supabase
    .from('products')
    .select('*', { count: 'exact' })
    .eq('category', category)
    .order('price', { ascending: false })
    .range(start, end)
  
  if (error) {
    console.error(`Error fetching products for ${category}:`, error)
    throw error
  }
  
  return {
    products: data,
    totalCount: count,
    hasNextPage: count > (page * itemsPerPage),
    currentPage: page
  }
}

export async function searchProducts(query, page = 1, itemsPerPage = 30) {
  const start = (page - 1) * itemsPerPage
  const end = start + itemsPerPage - 1

  const { data, error, count } = await supabase
    .from('products')
    .select('*', { count: 'exact' })
    .ilike('title', `%${query}%`)
    .order('price', { ascending: false })
    .range(start, end)
  
  if (error) {
    console.error('Error searching products:', error)
    throw error
  }
  
  return {
    products: data,
    totalCount: count,
    hasNextPage: count > (page * itemsPerPage),
    currentPage: page
  }
} 