"use client"

import { useState } from "react"
import { PageLayout } from "@/components/templates/PageLayout"
import { SettingsBreadcrumb } from "@/components/organisms/SettingsBreadcrumb"
import { Body, Subheading, BodySmall } from "@/components/atoms/Typography"
import Button from "@/components/atoms/Button"
import { useCart } from "@/contexts/CartContext"
import { useRouter } from "next/navigation"
import { ArrowRightIcon } from "@heroicons/react/24/outline"

export default function PaymentSecurityPage() {
  const { getCartTotal } = useCart()
  const [securityCode, setSecurityCode] = useState("")
  const router = useRouter()
  
  const subtotal = getCartTotal()
  const shipping = 0
  const total = subtotal + shipping

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // Handle payment processing
    console.log("Processing payment with security code:", securityCode)
    // Redirect to payment points page
    router.push('/cart/payment-points')
  }

  return (
    <PageLayout>
      <div className="pt-8 pb-4">
        <SettingsBreadcrumb
          items={[
            { label: "Carrito", href: "/cart" },
            { label: "Envío", href: "/cart/form-page" },
            { label: "Día de entrega", href: "/cart/delivery-day" },
            { label: "Mensualidades", href: "/cart/payment-options" },
            { label: "Método de pago", href: "/cart/payment-card-options" },
            { label: "Seguridad" },
          ]}
          title="Completa tu código de seguridad"
          color="text-white"
          className="mb-8"
        />
        
        <div className="flex flex-col lg:flex-row justify-start items-start gap-8">
          {/* Left Column: Security Form */}
          <div className="w-full lg:w-[847px] space-y-8">
            {/* Selected Card */}
            <div className="p-6 bg-gray rounded-lg">
              <div className="flex items-center gap-4">
                <div className="w-7 h-7 bg-white rounded-full" />
                <Body className="text-white text-xl">Bancoppel Débito **** 3832</Body>
              </div>
            </div>
            
            {/* Security Code Form */}
            <div className="p-6 bg-gray rounded-lg">
              <div className="flex gap-8">
                {/* Form Section */}
                <div className="flex-1 space-y-6">
                  <div className="space-y-4">
                    <BodySmall as="label" htmlFor="securityCode" className="text-white text-base font-medium block">
                      Código de seguridad
                    </BodySmall>
                    <input
                      id="securityCode"
                      type="text"
                      value={securityCode}
                      onChange={(e) => setSecurityCode(e.target.value)}
                      className="w-full h-11 px-4 py-3 bg-gray rounded-lg border border-neutral-600 text-white focus:outline-none focus:border-cyan-400"
                      placeholder="***"
                      maxLength={4}
                    />
                  </div>
                </div>
                
                {/* Card Visual */}
                <div className="w-96 h-48 bg-dark rounded-2xl flex items-center justify-center">
                  <Body className="text-white/50">Tarjeta Visual</Body>
                </div>
              </div>
            </div>
            
            {/* Continue Button */}
            <div className="flex justify-end">
              <Button 
                onClick={() => handleSubmit(new Event("submit") as unknown as React.FormEvent<HTMLFormElement>)}
                className="bg-pink-600 hover:bg-pink-700"
                disabled={securityCode.length < 3}
              >
                Continuar
                <ArrowRightIcon className="w-5 h-5 ml-2" />
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
                <Body className="text-white">₡{subtotal.toLocaleString()}</Body>
              </div>
              <div className="flex justify-between items-center">
                <Body className="text-white">Envío</Body>
                <Body className="text-emerald-400">Gratis</Body>
              </div>
              <div className="h-px bg-white/20"></div>
              <div className="flex justify-between items-center">
                <Body className="text-white">Total</Body>
                <Subheading className="text-white">₡{total.toLocaleString()}</Subheading>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}