"use client"

import Image from "next/image"
import { MapPinIcon } from "@heroicons/react/24/outline"
import { PageLayout } from "@/components/templates/PageLayout"
import { SettingsBreadcrumb } from "@/components/organisms/SettingsBreadcrumb"
import { Body, Subheading, BodySmall } from "@/components/atoms/Typography"
import Button from "@/components/atoms/Button"
import { useCart } from "@/contexts/CartContext"

export default function OrderDetailsPage() {
  const { getCartTotal } = useCart()
  
  const subtotal = getCartTotal()
  const shipping = 0
  const total = subtotal + shipping

  return (
    <PageLayout>
      <div className="pt-8 pb-4">
        <SettingsBreadcrumb
          items={[
            { label: "Carrito", href: "/cart" },
            { label: "Envío", href: "/cart/form-page" },
            { label: "Día de entrega", href: "/cart/delivery-day" },
            { label: "Método de pago", href: "/cart/payment-card-options" },
            { label: "Mensualidades", href: "/cart/payment-options" },
            { label: "Detalles" },
          ]}
          title="Confirma tu pedido"
          color="text-white"
          className="mb-8"
        />
        
        <div className="flex flex-col lg:flex-row justify-start items-start gap-8">
          {/* Left Column: Order Details */}
          <div className="w-full lg:w-[847px] space-y-8">
            
            {/* Delivery Details */}
            <div className="space-y-4">
              <Subheading className="text-white">Detalle de la entrega</Subheading>
              
              <div className="p-6 bg-gray rounded-lg space-y-6">
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 flex items-center justify-center">
                    <MapPinIcon className="w-7 h-8 text-white" />
                  </div>
                  <div className="space-y-2">
                    <Body className="text-white">
                      Prolongación De La Calle 1 Av. 10 Y Av. Hortencia 268
                    </Body>
                    <div className="flex items-center gap-4">
                      <BodySmall className="text-white text-base">Envío a domicilio</BodySmall>
                      <BodySmall className="text-white text-base">|</BodySmall>
                      <button className="text-cyan-400 text-base hover:underline">
                        Modificar forma de entrega
                      </button>
                    </div>
                  </div>
                </div>
                <button className="text-cyan-400 text-base font-bold hover:underline">
                  Modificar domicilio o elegir otro
                </button>
              </div>
            </div>

            {/* Product Details */}
            <div className="p-6 bg-gray rounded-lg space-y-6">
              <div className="flex gap-6">
                <Image
                  src="/placeholder.svg"
                  alt="Product"
                  width={48}
                  height={48}
                  className="w-12 h-12 object-contain"
                />
                <div className="flex-1">
                  <div className="flex items-start gap-4 mb-4">
                    <BodySmall className="text-white text-base">Envío 1</BodySmall>
                    <BodySmall className="text-white text-base">|</BodySmall>
                    <BodySmall className="text-emerald-400 text-base">Gratis</BodySmall>
                  </div>
                  <Body className="text-white">
                    Monitor Samsung 47&quot; Ofrece una buena calidad de imagen y sonido. 
                    Su funcionamiento es excelente y es recomendada por su relación calidad-precio. 
                    Además, su diseño es atractivo y cumple con las expectativas de un Smart TV 4K.
                  </Body>
                </div>
              </div>
              <button className="text-cyan-400 text-base font-bold hover:underline">
                Modificar día de entrega
              </button>
            </div>

            {/* Payment Details */}
            <div className="space-y-4">
              <Subheading className="text-white">Detalles del pago</Subheading>
              
              <div className="p-6 bg-gray rounded-lg space-y-6">
                <div className="flex items-start gap-6">
                  <div className="w-12 h-12 bg-dark rounded-full flex items-center justify-center">
                    <BodySmall className="text-white text-xs">VISA</BodySmall>
                  </div>
                  <div className="space-y-2">
                    <Subheading className="text-white">
                      Visa Débito ******4180
                    </Subheading>
                    <Body className="text-white">${total.toLocaleString()}</Body>
                  </div>
                </div>
                <button className="text-cyan-400 text-base font-bold hover:underline">
                  Modificar forma de pago
                </button>
              </div>
            </div>

            {/* Confirm Button */}
            <div className="flex justify-end">
              <Button className="bg-primary-600 hover:bg-primary-700">
                Confirmar pedido
              </Button>
            </div>
          </div>
          
          {/* Right Column: Purchase Summary */}
          <div className="flex-1 w-full lg:w-auto">
            <div className="p-6 bg-gray rounded-lg space-y-6">
              <Subheading className="text-white">Resumen de la compra</Subheading>
              <div className="h-px bg-white/20"></div>
              <div className="flex justify-between items-center">
                <Body className="text-white">Producto</Body>
                <Body className="text-white">${subtotal.toLocaleString()}</Body>
              </div>
              <div className="flex justify-between items-center">
                <Body className="text-white">Envío</Body>
                <Body className="text-emerald-400">Gratis</Body>
              </div>
              <div className="h-px bg-white/20"></div>
              <div className="flex justify-between items-center">
                <Body className="text-white">Total</Body>
                <Subheading className="text-white">${total.toLocaleString()}</Subheading>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}