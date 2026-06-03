"use client"

import Image from "next/image"
import { useState, useEffect } from "react"  
import { ChevronRightIcon, StarIcon, MinusIcon, PlusIcon, HandThumbUpIcon, HandThumbDownIcon, HeartIcon, ShoppingCartIcon } from "@heroicons/react/24/outline"
import type { Product, Review } from "@/app/lib/data"
import Link from "next/link"
import Button from "@/components/atoms/Button"
import { PageLayout } from "@/components/templates/PageLayout"
import { useCart } from "@/contexts/CartContext"
import { useFavorites } from "@/contexts/FavoritesContext"
import { useRouter } from "next/navigation"
import Toast from "@/components/atoms/Toast"

interface ProductDetailPageProps {
  product: Product
  relatedProducts?: Product[] 
  reviews: Review[]
}

export default function ProductDetailPage({ product, relatedProducts = [], reviews }: ProductDetailPageProps) {
  console.log('ProductDetailPage Props:', { product, relatedProducts, reviews })
  
  const [quantity, setQuantity] = useState(1)
  const [apiRelatedProducts, setApiRelatedProducts] = useState<Product[]>(relatedProducts)
  const [loadingRelated, setLoadingRelated] = useState(false)
  const [isHydrated, setIsHydrated] = useState(false)
  const [toast, setToast] = useState({ isVisible: false, message: '', type: 'info' as 'info' | 'success' | 'warning' })
  
  const { addToCart } = useCart()
  const { addToFavorites, isInFavorites } = useFavorites()
  const router = useRouter()

  // Function to check if user is authenticated
  const isAuthenticated = () => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token')
      return !!token
    }
    return false
  }

  // Medios de pago con enlaces públicos
  const paymentMethods = [
    {
      name: 'Visa',
      image: 'https://cdn.jsdelivr.net/gh/aaronfagan/svg-credit-card-payment-icons/flat/visa.svg'
    },
    {
      name: 'Mastercard', 
      image: 'https://cdn.jsdelivr.net/gh/aaronfagan/svg-credit-card-payment-icons/flat/mastercard.svg'
    },
    {
      name: 'American Express',
      image: 'https://cdn.jsdelivr.net/gh/aaronfagan/svg-credit-card-payment-icons/flat/amex.svg'
    },
    {
      name: 'PayPal',
      image: 'https://cdn.jsdelivr.net/gh/aaronfagan/svg-credit-card-payment-icons/flat/paypal.svg'
    },
    {
      name: 'Mercado Pago',
      image: '/cards/mercado-pago.avif'
    },
    {
      name: 'OXXO',
      image: '/cards/oxo.png'
    },
    {
      name: 'BBVA',
      image: '/cards/bbva.png'
    },
    {
      name: 'Santander',
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Banco_Santander_Logotipo.svg/1200px-Banco_Santander_Logotipo.svg.png'
    }
  ]

  // Manejar hidratación
  useEffect(() => {
    setIsHydrated(true)
  }, [])

  // Obtener productos relacionados de la API
  useEffect(() => {
    const fetchRelatedProducts = async () => {
      if (apiRelatedProducts.length > 0) return
      
      try {
        setLoadingRelated(true)
        const response = await fetch(`/api/product/related?category=${product.category}&exclude=${product.id}&limit=8`)
        if (response.ok) {
          const related = await response.json()
          console.log('API Response - Related Products:', related)
          console.log('Product category:', product.category)
          console.log('Product ID:', product.id)
          console.log('API URL:', `/api/product/related?category=${product.category}&exclude=${product.id}&limit=8`)
          setApiRelatedProducts(related)
        } else {
          console.error('API Response Error:', response.status, response.statusText)
        }
      } catch (error) {
        console.error('Error fetching related products:', error)
      } finally {
        setLoadingRelated(false)
      }
    }

    if (isHydrated) {
      fetchRelatedProducts()
    }
  }, [product.id, product.category, apiRelatedProducts.length, isHydrated])

  const displayDescription = product.description

  const handleQuantityChange = (delta: number) => {
    setQuantity((prev) => Math.max(1, prev + delta))
  }

  const handleAddToCart = () => {
    addToCart({
      id: product.id.toString(),
      name: product.name,
      price: product.price,
      image: product.image,
      brand: product.brand || '',
      category: product.category || '',
    })
  }

  const handleToggleFavorite = () => {
    addToFavorites({
      id: product.id.toString(),
      name: product.name,
      price: product.price,
      image: product.image,
      brand: product.brand || '',
      category: product.category || '',
    })
  }

  const handleBuyNow = () => {
    // Check if user is authenticated
    if (!isAuthenticated()) {
      setToast({ 
        isVisible: true, 
        message: 'Debes iniciar sesión para realizar una compra', 
        type: 'warning' 
      })
      // No redirect immediately, just show the toast
      return
    }

    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: product.id.toString(),
        name: product.name,
        price: product.price,
        image: product.image,
        brand: product.brand || '',
        category: product.category || '',
      })
    }
    router.push('/cart/form-page')
  }

  const ProductCard = ({ product }: { product: Product }) => (
    <Link
      href={`/product/${product.id}`}
      className="flex-1 bg-gray rounded-lg inline-flex flex-col justify-center items-center overflow-hidden group cursor-pointer"
    >
      <div className="self-stretch bg-white h-56 p-4 flex flex-col justify-center items-center gap-2.5">
        <Image
          className="w-48 flex-1 object-contain group-hover:scale-105 transition-transform duration-300"
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          width={189}
          height={189}
        />
      </div>
      <div className="self-stretch h-0 outline-1 outline-offset-[-0.50px] outline-white"></div>
      <div className="self-stretch p-6 flex flex-col justify-start items-start gap-2">
        <div className="self-stretch justify-start text-white text-xl font-semibold line-clamp-2">
          {product.name}
        </div>
        <div className="self-stretch inline-flex justify-start items-center gap-2">
          <div className="text-center justify-start text-white text-base font-normal">
            {product.rating || 0}
          </div>
          <div className="text-center justify-start text-white text-base font-normal">
            ({product.reviews || 0})
          </div>
        </div>
        <div className="self-stretch justify-start text-white text-xl font-semibold">
          ${(product.price || 0).toLocaleString()}
        </div>
      </div>
    </Link>
  )

  // Mostrar productos relacionados solo después de hidratación
  const shouldShowRelatedProducts = isHydrated && apiRelatedProducts.length > 0

  return (
    <PageLayout className="py-6">
      <div className="self-stretch py-8 inline-flex flex-col justify-start items-start gap-8">
        {/* Breadcrumbs */}
        <div className="self-stretch inline-flex justify-start items-center gap-4">
          <Link href="/search" className="justify-start text-white text-sm font-normal  hover:underline">
            Tecnología
          </Link>
          <ChevronRightIcon className="w-4 h-4 text-white" />
          <div className="justify-start text-white text-sm font-bold ">{product.category}</div>
        </div>

        {/* Product Title */}
        <div className="justify-start text-white text-2xl font-bold ">{product.name}</div>

        <div className="self-stretch flex flex-col lg:flex-row justify-start items-start gap-8">
          {/* Left Column: Images & Description */}
          <div className="w-full lg:w-[847px] self-stretch inline-flex flex-col justify-start items-start gap-8 overflow-hidden">
            {/* Main Image & Thumbnails */}
            <div className="self-stretch inline-flex flex-col sm:flex-row justify-start items-start gap-8">
              <div className="self-stretch p-6 bg-white hover:bg-gray-100 border border-gray-200/10 rounded-lg flex justify-center items-center flex-grow overflow-hidden">
                <Image
                  className="w-full h-auto max-w-96 max-h-96 object-contain"
                  src={product.images?.[0] || product.image}
                  alt={product.name}
                  width={400}
                  height={400}
                />
              </div>
              <div className="inline-flex flex-row sm:flex-col justify-start items-start gap-4 sm:gap-8 flex-wrap">
                {product.images?.slice(1, 4).map((img, index) => (
                  <div
                    key={index}
                    className="p-3 sm:p-6 bg-white hover:bg-gray-100 border border-gray-200/10 rounded-lg flex justify-center items-center overflow-hidden"
                  >
                    <Image
                      className="w-24 h-24 sm:w-36 sm:h-36 object-contain"
                      src={img || "/placeholder.svg"}
                      alt={`${product.name} thumbnail ${index + 1}`}
                      width={150}
                      height={150}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Product Description */}
            <div className="justify-start text-white text-2xl font-bold ">Descripción del producto</div>
            <div className="self-stretch flex-1 p-6 bg-gray rounded-lg flex flex-col justify-start items-start gap-6 overflow-hidden">
              <div className="self-stretch justify-start text-white font-normal ">
                {displayDescription}
              </div>

              {product.specs && product.specs.length > 0 && (
                <>
                  <div className="text-center justify-start text-white text-xl font-semibold  mt-4">
                    Especificaciones
                  </div>
                  <ul className="self-stretch text-white font-normal list-disc pl-5">
                    {product.specs.map((spec, index) => (
                      <li key={index}>
                        <strong>{spec.label}:</strong> {spec.value}
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </div>

          {/* Right Column: Price, Actions, Payment */}
          <div className="flex-1 inline-flex flex-col justify-start items-center gap-8 w-full">
            <div className="self-stretch p-6 bg-gray rounded-lg flex flex-col justify-start items-center gap-12 overflow-hidden">
              <div className="self-stretch flex flex-col justify-start items-start gap-6">
                <div className="justify-start text-white text-3xl font-bold ">
                  ${product.price.toLocaleString()}
                </div>
                {product.shipping && (
                  <div className="justify-start">
                    <span className="text-emerald-400 font-bold ">{product.shipping}</span>
                    <span className="text-white font-bold "> el lunes</span>
                  </div>
                )}
                <div className="self-stretch h-px bg-white/20"></div> {/* Divider */}
                <div className="self-stretch inline-flex justify-between items-center">
                  <div className="justify-start">
                    <span className="text-white font-normal ">Cantidad: </span>
                    <span className="text-white font-bold ">{quantity} unidad</span>
                  </div>
                  <div className="flex justify-start items-center gap-2">
                    <button
                      onClick={() => handleQuantityChange(-1)}
                      className="w-6 h-6 flex items-center justify-center rounded-full border border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-white transition-colors"
                      aria-label="Disminuir cantidad"
                    >
                      <MinusIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleQuantityChange(1)}
                      className="w-6 h-6 flex items-center justify-center rounded-full border border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-white transition-colors"
                      aria-label="Aumentar cantidad"
                    >
                      <PlusIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="self-stretch h-px bg-white/20"></div> {/* Divider */}
              </div>
              <div className="self-stretch flex flex-col justify-start items-start gap-4">
                <button 
                  onClick={handleBuyNow}
                  className="self-stretch h-11 min-h-11 px-4 py-2.5 bg-primary hover:bg-primary/80 transition-colors rounded-[99px] inline-flex justify-center items-center gap-3"
                >
                  <ShoppingCartIcon className="w-5 h-5 text-white" />
                  <div className="justify-start text-white text-base font-bold ">Comprar ahora</div>
                </button>
                <button 
                  onClick={handleAddToCart}
                  className="self-stretch h-11 min-h-11 px-4 py-2.5 rounded-[99px] outline outline-1 outline-offset-[-1px] outline-primary inline-flex justify-center items-center gap-3 text-primary hover:bg-primary hover:text-white transition-colors"
                >
                  <ShoppingCartIcon className="w-5 h-5" />
                  <div className="justify-start text-base font-bold ">Agregar al carrito</div>
                </button>
                <button 
                  onClick={handleToggleFavorite}
                  className={`self-stretch h-11 min-h-11 px-4 py-2.5 rounded-[99px] outline outline-1 outline-offset-[-1px] inline-flex justify-center items-center gap-3 transition-colors ${
                    isInFavorites(product.id.toString())
                      ? 'outline-red-500 text-red-500 hover:bg-red-500 hover:text-white'
                      : 'outline-gray-400 text-gray-400 hover:bg-gray-400 hover:text-white'
                  }`}
                >
                  <HeartIcon className="w-5 h-5" />
                  <div className="justify-start text-base font-bold">
                    {isInFavorites(product.id.toString()) ? "Remover de favoritos" : "Agregar a favoritos"}
                  </div>
                </button>
              </div>
            </div>

            {/* Payment Methods Section - ACTUALIZADA */}
            <div className="self-stretch p-6 bg-gray rounded-lg flex flex-col justify-start items-start gap-6 overflow-hidden">
              <div className="justify-start text-white text-xl font-bold ">Medios de pago</div>
              <div className="self-stretch h-px bg-white/20"></div> {/* Divider */}
              
              {/* Grid de medios de pago con imágenes públicas */}
              <div className="self-stretch grid grid-cols-4 gap-3">
                {paymentMethods.map((method, i) => (
                  <div 
                    key={i} 
                    className="w-full h-12 relative bg-white rounded-lg p-2 flex items-center justify-center overflow-hidden hover:shadow-lg transition-shadow duration-200 group"
                  >
                    <Image
                      src={method.image}
                      alt={method.name}
                      width={48}
                      height={32}
                      className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-200"
                    />
                  </div>
                ))}
              </div>

              <div className="self-stretch h-px bg-white/20"></div> {/* Divider */}
              <div className="self-stretch justify-start">
                <span className="text-emerald-400 font-bold ">Devolución gratis. </span>
                <span className="text-white font-normal ">
                  Tienes 30 días desde que lo recibes.
                </span>
              </div>
              <div className="self-stretch justify-start">
                <span className="text-emerald-400 font-bold ">Compra protegida. </span>
                <span className="text-white font-normal ">
                  Recibe el producto que esperabas o te devolvemos tu dinero.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <div className="justify-start text-white text-2xl font-bold">Productos relacionados</div>
        
        {loadingRelated ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : shouldShowRelatedProducts ? (
          <>
            <div className="self-stretch grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-8">
              {apiRelatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
            {apiRelatedProducts.length > 4 && (
              <Button>
                <div className="justify-start text-white text-base font-bold">Cargar más</div>
              </Button>
            )}
          </>
        ) : (
          <div className="text-white text-center py-8">No hay productos relacionados disponibles</div>
        )}

        {/* Product Reviews */}
        <div className="justify-start text-white text-2xl font-bold ">Reseñas del producto</div>
        <div className="self-stretch flex flex-col lg:flex-row justify-start items-start gap-8">
          <div className="w-full lg:w-[847px] self-stretch inline-flex flex-col justify-start items-start gap-8 overflow-hidden">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="self-stretch p-6 bg-gray rounded-lg flex flex-col justify-center items-start gap-6 overflow-hidden"
              >
                <div className="self-stretch inline-flex justify-between items-center">
                  <div className="flex justify-start items-center gap-4">
                    <div className="flex justify-center items-center gap-2">
                      <div className="w-4 h-4 relative bg-white rounded-[99px]" /> {/* Avatar placeholder */}
                      <div className="text-center justify-start text-white text-base font-bold ">
                        {review.author}
                      </div>
                    </div>
                    <div className="text-center justify-center text-white text-xs font-normal ">
                      {review.date}
                    </div>
                  </div>
                  <div className="flex justify-start items-center gap-4">
                    <button className="flex items-center gap-1 text-white hover:text-white transition-colors">
                      <HandThumbUpIcon className="w-5 h-5" />
                      <span className="text-sm">{review.upvotes}</span>
                    </button>
                    <button className="flex items-center gap-1 text-white hover:text-white transition-colors">
                      <HandThumbDownIcon className="w-5 h-5" />
                      <span className="text-sm">{review.downvotes}</span>
                    </button>
                  </div>
                </div>
                <div className="justify-start text-white font-normal ">
                  {review.content}
                  {review.content.length > 100 && ( 
                    <span className="text-cyan-400 font-bold cursor-pointer hover:underline">
                      {" "}
                      Leer más
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="flex-1 self-stretch p-6 bg-gray rounded-lg inline-flex flex-col justify-start items-start gap-6 overflow-hidden w-full">
            <div className="inline-flex justify-center items-center gap-2.5">
              <div className="text-center justify-center text-white text-4xl font-bold ">
                {product.rating}
              </div>
              <div className="inline-flex flex-col justify-center items-start gap-0.5">
                <div className="inline-flex justify-start items-start gap-[1.61px]">
                  {/* Star rating visual */}
                  {Array.from({ length: 5 }).map((_, i) => (
                    <StarIcon
                      key={i}
                      className={`w-4 h-4 ${i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-placeholder"}`}
                    />
                  ))}
                </div>
                <div className="text-center justify-center text-white text-xs font-normal ">
                  {product.reviews} opiniones
                </div>
              </div>
            </div>
            <div className="self-stretch h-px bg-white/20"></div> {/* Divider */}
            <div className="self-stretch flex flex-col justify-start items-start gap-1">
              {[5, 4, 3, 2, 1].map((star) => {
                const percentage =
                  (star === 5 ? 0.8 : star === 4 ? 0.2 : star === 3 ? 0.05 : star === 2 ? 0.02 : 0.01) * 100 // Mock percentages
                return (
                  <div key={star} className="self-stretch inline-flex justify-start items-center gap-4">
                    <div className="flex-1 flex justify-start items-start h-2 bg-dark rounded-full overflow-hidden">
                      <div className="h-full bg-white" style={{ width: `${percentage}%` }}></div>
                    </div>
                    <div className="flex justify-center items-center gap-2.5">
                      <div className="justify-start text-white text-xs font-normal ">{star}</div>
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="self-stretch h-px bg-white/20"></div> {/* Divider */}
            <div className="justify-start text-white text-xl font-bold ">
              Calificación de características
            </div>
            <div className="self-stretch inline-flex justify-start items-start gap-4 flex-wrap">
              {/* Feature ratings placeholders */}
              <div className="flex-1 inline-flex flex-col justify-center items-start gap-1">
                <div className="text-center justify-start text-white text-xs font-normal ">
                  Relación precio-calidad
                </div>
                {/* Add stars or bar here */}
              </div>
              <div className="flex-1 inline-flex flex-col justify-center items-start gap-1">
                <div className="text-center justify-start text-white text-xs font-normal ">Comodidad</div>
                {/* Add stars or bar here */}
              </div>
              <div className="flex-1 inline-flex flex-col justify-center items-start gap-1">
                <div className="text-center justify-start text-white text-xs font-normal ">
                  Calidad de los materiales
                </div>
                {/* Add stars or bar here */}
              </div>
              <div className="flex-1 inline-flex flex-col justify-center items-start gap-1">
                <div className="text-center justify-start text-white text-xs font-normal ">
                  Duración de la batería
                </div>
                {/* Add stars or bar here */}
              </div>
            </div>
          </div>
        </div>
      </div>
      {toast.isVisible && (
        <Toast 
          message={toast.message} 
          isVisible={toast.isVisible}
          type={toast.type} 
          onClose={() => setToast({ ...toast, isVisible: false })}
        />
      )}
    </PageLayout>
  )
}