export interface Product {
  id: number | string
  name: string
  price: number
  originalPrice?: number
  image: string
  rating: number
  reviews: number
  shipping?: string
  discount?: number
  category: string
  brand: string
  location: string
  description?: string
  specs?: { label: string; value: string }[]
  images?: string[]
}

export interface Filters {
  priceRange: [number, number]
  categories: string[]
  brands: string[]
  locations: string[]
  freeShipping: boolean
  withDiscount: boolean
}

export interface Review {
  id: number
  author: string
  date: string
  content: string
  rating: number
  upvotes: number
  downvotes: number
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface FavoriteItem {
  product: Product
}
