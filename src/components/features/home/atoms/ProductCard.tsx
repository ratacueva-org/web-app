"use client"

import Image from "next/image"
import { StarIcon } from "@heroicons/react/24/solid"
import { ShoppingCartIcon, HeartIcon } from "@heroicons/react/24/outline"
import { Subheading, BodySmall, Caption } from "@/components/atoms/Typography"
import Link from "next/link"
import { useCart } from "@/contexts/CartContext"
import { useFavorites } from "@/contexts/FavoritesContext"

interface ProductCardProps {
  product: {
    id: string
    name: string
    rating: number
    reviews: number
    price: number
    image: string
    brand?: string
    category?: string
  }
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart()
  const { addToFavorites, isInFavorites } = useFavorites()

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      brand: product.brand || '',
      category: product.category || '',
    })
  }

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addToFavorites({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      brand: product.brand || '',
      category: product.category || '',
    })
  }
  return (
    <Link href={`/product/${product.id}`} className="block">
      <div className="bg-gray hover:bg-dark transition-colors rounded-lg overflow-hidden group cursor-pointer">
      {/* Image Container */}
      <div className="relative bg-white h-56 lg:h-64 p-4 flex items-center justify-center overflow-hidden">
        <Image
          className="object-contain group-hover:scale-105 transition-transform duration-300"
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          width={300}
          height={300}
        />
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

      {/* Product Info */}
      <div className="p-4 lg:p-6">
        <Subheading className="text-white mb-2 truncate-multiline w-[230px] group-hover:text-cyan-400 transition-colors">
          {product.name}
        </Subheading>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-1">
            <div className="flex">
              {[...Array(5)].map((_, index) => (
                <StarIcon
                  key={index}
                  className={`w-4 h-4 ${
                    index < Math.floor(product.rating)
                      ? "text-yellow-400"
                      : "text-white"
                  }`}
                />
              ))}
            </div>
            <BodySmall className="text-white font-medium">{product.rating}</BodySmall>
          </div>
          <Caption className="text-placeholder">({product.reviews} reseñas)</Caption>
        </div>

        {/* Price and Actions */}
        <div className="flex items-center justify-between">
          <div className="text-white text-xl lg:text-2xl font-bold">${product.price.toLocaleString()}</div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleFavorite}
              className={`p-2 transition-colors rounded-full ${
                isInFavorites(product.id)
                  ? 'bg-red-500 text-white'
                  : 'bg-primary hover:bg-primary/80 transition-colors rounded-full text-white'
              }`}
              title={isInFavorites(product.id) ? "Remover de favoritos" : "Agregar a favoritos"}
            >
              <HeartIcon className="w-5 h-5" />
            </button>
            <button
              onClick={handleAddToCart}
              className="p-2 bg-primary hover:bg-primary/80 transition-colors rounded-full text-white"
              title="Agregar al carrito"
            >
              <ShoppingCartIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
    </Link>
  )
}
