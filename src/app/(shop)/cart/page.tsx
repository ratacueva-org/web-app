"use client"

import Image from "next/image"
import { HeartIcon, MinusIcon, PlusIcon, TrashIcon, ShoppingCartIcon } from "@heroicons/react/24/outline"
import { PageLayout } from "@/components/templates/PageLayout"
import { SettingsBreadcrumb } from "@/components/organisms/SettingsBreadcrumb"
import { Body, Subheading, BodySmall } from "@/components/atoms/Typography"
import Button from "@/components/atoms/Button"
import { useCart } from "@/contexts/CartContext"
import { useFavorites } from "@/contexts/FavoritesContext"
import { useState } from "react"
import Toast from "@/components/atoms/Toast"
import { useRouter } from "next/navigation"

export default function CartPage() {
  const { items: cartItems, updateQuantity, removeFromCart, getCartTotal } = useCart()
  const { addToFavorites, isInFavorites } = useFavorites()
  const [toast, setToast] = useState({ isVisible: false, message: '', type: 'info' as 'info' | 'success' | 'warning' })
  const router = useRouter()

  // Function to check if user is authenticated
  const isAuthenticated = () => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token')
      return !!token
    }
    return false
  }

  const handleQuantityChange = (productId: string, delta: number) => {
    const currentItem = cartItems.find(item => item.id === productId)
    if (currentItem) {
      const newQuantity = Math.max(1, currentItem.quantity + delta)
      updateQuantity(productId, newQuantity)
    }
  }

  const handleRemoveItem = (productId: string) => {
    const item = cartItems.find(item => item.id === productId)
    removeFromCart(productId)
    if (item) {
      setToast({ 
        isVisible: true, 
        message: `"${item.name}" eliminado del carrito`, 
        type: 'info' 
      })
    }
  }

  const handleToggleFavorite = (item: { id: string; name: string; price: number; image: string; brand: string; category: string }) => {
    addToFavorites({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      brand: item.brand,
      category: item.category,
    })
  }

  const handlePurchase = () => {
    if (cartItems.length === 0) {
      setToast({ 
        isVisible: true, 
        message: 'No puedes realizar una compra con el carrito vacío', 
        type: 'warning' 
      })
      return
    }

    // Check if user is authenticated
    if (!isAuthenticated()) {
      setToast({ 
        isVisible: true, 
        message: 'Debes iniciar sesión para realizar una compra', 
        type: 'warning' 
      })
      // Redirect to login after showing toast
      setTimeout(() => {
        router.push('/login')
      }, 1500)
      return
    }

    // Guardar datos iniciales del carrito en localStorage para el flujo de checkout
    const checkoutData = {
      cartItems: cartItems,
      subtotal: getCartTotal(),
      timestamp: Date.now()
    }
    localStorage.setItem('checkoutData', JSON.stringify(checkoutData))

    // Proceder con la compra
    router.push('/cart/form-page')
  }

  const subtotal = getCartTotal()

  return (
    <PageLayout>
      <div className="pt-8 pb-4">
        <SettingsBreadcrumb
          items={[
            { label: "Carrito" },
          ]}
          title="Productos en tu carrito"
          color="text-white"
          className="mb-8"
        />
        
        <div className="flex flex-col lg:flex-row justify-start items-start gap-8">
          {/* Left Column: Cart Items */}
          <div className="w-full lg:w-[847px] space-y-6">
            {cartItems.length === 0 ? (
              <div className="p-6 bg-gray rounded-lg">
                <Body className="text-white text-center">
                  Tu carrito está vacío. ¡Añade algunos productos!
                </Body>
              </div>
            ) : (
              <div className="space-y-6">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-6 bg-gray rounded-lg grid grid-cols-1 sm:grid-cols-[auto_1fr_auto] gap-6 items-center"
                  >
                    {/* Imagen */}
                    <Image
                      className="w-24 h-24 object-contain justify-self-center sm:justify-self-start"
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      width={96}
                      height={96}
                    />
                    
                    {/* Información del producto */}
                    <div className="flex flex-col justify-center gap-4">
                      <Subheading className="text-white text-center sm:text-left">
                        {item.name}
                      </Subheading>
                      <div className="flex justify-center sm:justify-start items-center gap-3">
                         <Button 
                           onClick={() => handleToggleFavorite(item)}
                           className={isInFavorites(item.id) ? 'bg-red-500 hover:bg-red-600' : ''}
                         >
                           <HeartIcon className="w-4 h-4 mr-2" />
                           {isInFavorites(item.id) ? 'En favoritos' : 'Favoritos'}
                         </Button>
                         <Button 
                           onClick={() => handleRemoveItem(item.id)}
                         >
                           <TrashIcon className="w-4 h-4 mr-2" />
                           Eliminar
                         </Button>
                       </div>
                    </div>
                    
                    {/* Precio y cantidad */}
                    <div className="flex flex-col items-center sm:items-end gap-4">
                      <Body className="text-white font-medium">
                        ${(item.price * item.quantity).toLocaleString()}
                      </Body>
                      <div className="rounded-[999px] outline-2 outline-offset-[-2px] outline-cyan-400 inline-flex justify-start items-start">
                        <button
                          onClick={() => handleQuantityChange(item.id, -1)}
                          className="h-11 min-h-11 p-2.5 rounded-tl-[99px] rounded-bl-[99px] flex justify-center items-center gap-3 text-cyan-400 hover:bg-cyan-400 hover:text-white transition-colors"
                          aria-label="Disminuir cantidad"
                        >
                          <MinusIcon className="w-4 h-4" />
                        </button>
                        <div className="h-11 min-h-11 p-2.5 flex justify-center items-center gap-3">
                          <BodySmall className="justify-start text-cyan-400 text-base font-bold">
                            {item.quantity}
                          </BodySmall>
                        </div>
                        <button
                          onClick={() => handleQuantityChange(item.id, 1)}
                          className="h-11 min-h-11 p-2.5 rounded-tr-[99px] rounded-br-[99px] flex justify-center items-center gap-3 text-cyan-400 hover:bg-cyan-400 hover:text-white transition-colors"
                          aria-label="Aumentar cantidad"
                        >
                          <PlusIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Right Column: Purchase Summary */}
          <div className="flex-1 w-full lg:w-auto">
            <div className="p-6 bg-gray rounded-lg space-y-6">
              <Subheading className="text-white">Resumen de la compra</Subheading>
              <div className="h-px bg-white/20"></div>
              <div className="flex justify-between items-center">
                <Body className="text-white">Subtotal</Body>
                <Body className="text-white">${subtotal.toLocaleString()}</Body>
              </div>
              <div className="h-px bg-white/20"></div>
              <div className="flex justify-between items-center">
                <Body className="text-white">Total</Body>
                <Subheading className="text-white">${subtotal.toLocaleString()}</Subheading>
              </div>
              <Button className="w-full" onClick={handlePurchase}>
                <ShoppingCartIcon className="w-4 h-4 mr-2" />
                Comprar ahora
              </Button>
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