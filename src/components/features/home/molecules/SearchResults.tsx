"use client"
import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { HeartIcon, ShoppingCartIcon, ChevronDownIcon } from "@heroicons/react/24/outline"
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid"
import { Subheading, Body, BodySmall, Caption } from "@/components/atoms/Typography"
import type { Product } from "@/app/lib/data"
import { useCart } from "@/contexts/CartContext"
import { useFavorites } from "@/contexts/FavoritesContext"

interface SearchResultsProps {
  products: Product[]
  sortBy: string
  onSortChange: (sort: string) => void
  query: string
}

const sortOptions = [
  { value: "relevance", label: "Más relevantes" },
  { value: "price-low", label: "Menor precio" },
  { value: "price-high", label: "Mayor precio" },
  { value: "rating", label: "Mejor calificados" },
  { value: "reviews", label: "Más vendidos" },
]

export default function SearchResults({ products, sortBy, onSortChange, query }: SearchResultsProps) {
  const [showSortDropdown, setShowSortDropdown] = useState(false)
  const { addToCart } = useCart()
  const { addToFavorites, isInFavorites } = useFavorites()

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.preventDefault()
    e.stopPropagation()
    addToCart({
      id: String(product.id),
      name: product.name,
      price: product.price,
      image: product.image,
      brand: product.brand || '',
      category: product.category || '',
    })
  }

  const handleToggleFavorite = (e: React.MouseEvent, product: Product) => {
    e.preventDefault()
    e.stopPropagation()
    addToFavorites({
      id: String(product.id),
      name: product.name,
      price: product.price,
      image: product.image,
      brand: product.brand || '',
      category: product.category || '',
    })
  }

  const ProductCard = ({ product }: { product: Product }) => (
    <Link 
      href={`/product/${product.id}`}
      className="block bg-gray hover:bg-dark border border-2 border-transparent hover:border-gray transition-colors transition-border rounded-lg overflow-hidden group cursor-pointer"
    >
      {/* Image Container */}
      <div className="relative bg-white h-56 lg:h-64 p-4 flex flex-col justify-center items-center">
        <Image
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          width={300}
          height={300}
        />
        {/* Action Buttons */}
        <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={(e) => handleToggleFavorite(e, product)}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
              isInFavorites(String(product.id))
                ? 'bg-red-500 hover:bg-red-600'
                : 'bg-primary hover:bg-primary/80'
            }`}
            title={isInFavorites(String(product.id)) ? "Remover de favoritos" : "Agregar a favoritos"}
          >
            <HeartIcon className="w-4 h-4 text-white" />
          </button>
          <button 
            onClick={(e) => handleAddToCart(e, product)}
            className="w-8 h-8 bg-primary hover:bg-primary/80 rounded-full flex items-center justify-center"
            title="Agregar al carrito"
          >
            <ShoppingCartIcon className="w-4 h-4 text-white" />
          </button>
        </div>
        {/* Discount Badge */}
        {product.discount && (
          <div className="absolute top-2 left-2 bg-primary text-white text-xs font-bold px-2 py-1 rounded-full">
            -{product.discount}%
          </div>
        )}
        {/* Free Shipping Badge */}
        {product.shipping && product.shipping.includes('gratis') && (
          <div className="absolute bottom-2 left-2 bg-primary text-white text-xs font-bold px-2 py-1 rounded-full">
            Envío gratis
          </div>
        )}
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

      {/* Product Info */}
      <div className="p-4 lg:p-6">
        <Subheading className="text-white mb-2 line-clamp-2 group-hover:text-cyan-400 transition-colors">
          {product.name}
        </Subheading>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-1">
            <div className="flex">
              {[...Array(5)].map((_, index) => (
                <StarIconSolid
                  key={index}
                  className={`w-4 h-4 ${
                    index < Math.floor(product.rating)
                      ? "text-yellow-400"
                      : "text-dark"
                  }`}
                />
              ))}
            </div>
            <BodySmall className="text-white font-medium">{product.rating}</BodySmall>
          </div>
          <Caption className="text-placeholder">({product.reviews} reseñas)</Caption>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between mb-3">
          <div className="space-y-1">
            {product.originalPrice && (
              <div className="text-placeholder text-sm line-through">${product.originalPrice.toLocaleString()}</div>
            )}
            <div className="text-white text-xl lg:text-2xl font-bold">${product.price.toLocaleString()}</div>
          </div>
        </div>
        
        {/* Filter Badges */}
        <div className="flex flex-wrap gap-1.5 mb-2">
          {/* Category Badge */}
          {product.category && (
            <span className="bg-dark-100 text-white text-xs px-2 py-1 rounded-full border border-gray">
              {product.category}
            </span>
          )}
          {/* Brand Badge */}
          {product.brand && (
            <span className="bg-cyan-500/10 text-cyan-400 text-xs px-2 py-1 rounded-full border border-cyan-500/30">
              {product.brand}
            </span>
          )}
          {/* Location Badge */}
          {product.location && (
            <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full border border-primary/30">
              {product.location}
            </span>
          )}
        </div>
        
       
      </div>
    </Link>
  )

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🔍</div>
        <Subheading className="text-white mb-2">No encontramos productos</Subheading>
        <Body className="text-placeholder">
          {query ? `No hay resultados para "${query}"` : "Intenta con otros términos de búsqueda"}
        </Body>
      </div>
    )
  }

  return (
    <div>
      {/* Sort Controls */}
      <div className="flex justify-between items-center mb-6">
        <Body className="text-placeholder">
          {products.length} {products.length === 1 ? "resultado" : "resultados"}
        </Body>
        <div className="relative">
          <button
            onClick={() => setShowSortDropdown(!showSortDropdown)}
            className="flex items-center gap-2 px-4 py-2 bg-dark hover:bg-gray border border-2 border-gray rounded-lg text-white text-sm transition-colors"
          >
            <span>Ordenar: {sortOptions.find((opt) => opt.value === sortBy)?.label}</span>
            <ChevronDownIcon className="w-4 h-4" />
          </button>
          {showSortDropdown && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowSortDropdown(false)} />
              <div className="absolute top-full right-0 mt-2 w-48 bg-gray border border-placeholder rounded-lg shadow-xl z-50">
                {sortOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      onSortChange(option.value)
                      setShowSortDropdown(false)
                    }}
                    className={`w-full px-4 py-3 text-left text-sm hover:bg-dark transition-colors ${
                      sortBy === option.value ? "text-secondary" : "text-white"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}