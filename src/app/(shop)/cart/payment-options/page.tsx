"use client"

import { PageLayout } from "@/components/templates/PageLayout"
import { SettingsBreadcrumb } from "@/components/organisms/SettingsBreadcrumb"
import { Body, Subheading, BodySmall } from "@/components/atoms/Typography"
import Button from "@/components/atoms/Button"
import { useCart } from "@/contexts/CartContext"
import { useAuth } from "@/contexts/AuthContext"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowRightIcon, CreditCardIcon } from "@heroicons/react/24/outline"
import { MSIService, MSIOption } from "@/services/settings/orders"
import { getPaymentMethods, PaymentMethod } from "@/services/settings/card"

export default function PaymentOptionsPage() {
  const { getCartTotal } = useCart()
  const { user } = useAuth()
  const [selectedPlan, setSelectedPlan] = useState<string>("")
  const [msiOptions, setMsiOptions] = useState<MSIOption[]>([])
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null)
  const [error, setError] = useState("")
  const router = useRouter()
  
  const subtotal = getCartTotal()
  const shipping = 0
  const total = subtotal + shipping

  // Verificar datos del checkout y obtener opciones MSI
  useEffect(() => {
    const fetchData = async () => {
      // Verificar que existan datos del checkout
      const checkoutData = localStorage.getItem('checkoutData')
      if (!checkoutData) {
        router.push('/cart')
        return
      }

      const parsedCheckoutData = JSON.parse(checkoutData)
      
      // Verificar que haya un método de pago seleccionado
      if (!parsedCheckoutData.paymentMethod) {
        router.push('/cart/payment-card-options')
        return
      }

      if (!user) return
      
      try {
        setError("")
        
        // Obtener todos los métodos de pago del usuario
        const paymentMethods = await getPaymentMethods()
        
        // Encontrar el método de pago seleccionado
        let selectedMethod = null
        
        if (parsedCheckoutData.paymentMethod.type === "oxxo_cash") {
          // Si es pago en efectivo, redirigir directamente a payment-points
          router.push('/cart/payment-points')
          return
        } else {
          // Buscar la tarjeta seleccionada por ID
          selectedMethod = paymentMethods.find(
            method => method._id === parsedCheckoutData.paymentMethod.methodId
          )
          
          if (!selectedMethod) {
            setError("No se pudo encontrar el método de pago seleccionado")
            return
          }
        }
        
        setSelectedPaymentMethod(selectedMethod)
        
        // Obtener opciones de MSI basadas en el método de pago
        const cardType = selectedMethod.type === "credit_card" || selectedMethod.type === "debit_card" 
          ? selectedMethod.type 
          : "credit_card"
        
        const options = await MSIService.getMSIOptions(
          total,
          cardType,
          selectedMethod.provider
        )
        
        setMsiOptions(options)
        
        // Seleccionar la primera opción por defecto
        if (options.length > 0) {
          setSelectedPlan(options[0].id)
        }
      } catch (error: unknown) {
        console.error('Error fetching MSI options:', error)
        setError("Error al cargar las opciones de mensualidades")
      }
    }

    fetchData()
  }, [user, total, router])

  const handleContinue = async () => {
    // Validar que se haya seleccionado un plan
    if (!selectedPlan) {
      alert("Debes seleccionar un plan de mensualidades")
      return
    }

    // Obtener datos existentes del checkout
    const existingCheckoutData = localStorage.getItem('checkoutData')
    if (!existingCheckoutData) {
      alert("Error: No se encontraron datos del carrito")
      router.push('/cart')
      return
    }

    const checkoutData = JSON.parse(existingCheckoutData)
    const selectedMSIOption = msiOptions.find(option => option.id === selectedPlan)

    if (!selectedMSIOption) {
      alert("Error: Plan de mensualidades no válido")
      return
    }

    // Agregar datos de la opción MSI al checkoutData
    const updatedCheckoutData = {
      ...checkoutData,
      msiOption: {
        id: selectedMSIOption.id,
        months: selectedMSIOption.months,
        monthlyPayment: selectedMSIOption.monthlyPayment,
        totalAmount: selectedMSIOption.totalAmount,
        interestRate: selectedMSIOption.interestRate,
        description: selectedMSIOption.description
      },
      timestamp: Date.now()
    }

    // Guardar datos actualizados en localStorage
    localStorage.setItem('checkoutData', JSON.stringify(updatedCheckoutData))

    // Verificar si es pago en efectivo para ir a payment-points
    if (checkoutData.paymentMethod?.type === "oxxo_cash") {
      router.push('/cart/payment-points')
    } else {
      // Para pagos con tarjeta, ir al siguiente paso (confirmación o finalización)
      router.push('/cart/success')
    }
  }

  const getCardDisplayName = (method: PaymentMethod) => {
    const type = method.type === "credit_card" ? "Crédito" : "Débito"
    const provider = method.provider || "Banco"
    const last4 = method.last4 || "****"
    return `${provider} ${type} **** ${last4}`
  }

  const getCardIcon = (type: string) => {
    switch (type) {
      case "credit_card":
      case "debit_card":
        return <CreditCardIcon className="w-4 h-4 text-gray-800" />
      case "paypal":
        return <div className="w-4 h-4 bg-blue-500 rounded flex items-center justify-center">
          <span className="text-white text-xs font-bold">PP</span>
        </div>
      case "oxxo_cash":
        return <div className="w-4 h-4 bg-orange-500 rounded flex items-center justify-center">
          <span className="text-white text-xs font-bold">OX</span>
        </div>
      default:
        return <CreditCardIcon className="w-4 h-4 text-gray-800" />
    }
  }

  return (
    <PageLayout>
      <div className="pt-8 pb-4">
        <SettingsBreadcrumb
          items={[
            { label: "Carrito", href: "/cart" },
            { label: "Envío", href: "/cart/form-page" },
            { label: "Día de entrega", href: "/cart/delivery-day" },
            { label: "Método de pago", href: "/cart/payment-card-options" },
            { label: "Mensualidades" },
          ]}
          title="Elige las mensualidades"
          color="text-white"
          className="mb-8"
        />
        
        <div className="flex flex-col lg:flex-row justify-start items-start gap-8">
          {/* Left Column: Payment Options */}
          <div className="w-full lg:w-[847px] space-y-8">
            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-500/20 border border-red-500 rounded-lg">
                <Body className="text-red-400">{error}</Body>
              </div>
            )}

            {!selectedPaymentMethod ? (
              <div className="text-center py-8">
                <Body className="text-white">No se encontró el método de pago seleccionado</Body>
              </div>
            ) : (
              <>
                {/* Selected Card */}
                <div className="p-6 bg-gray rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-7 h-7 bg-white rounded-full flex items-center justify-center">
                      {getCardIcon(selectedPaymentMethod.type)}
                    </div>
                    <Body className="text-white text-xl">{getCardDisplayName(selectedPaymentMethod)}</Body>
                  </div>
                </div>
                
                {/* Payment Plans */}
                <div className="p-6 bg-gray rounded-lg space-y-6">
                  {msiOptions.map((option, index) => (
                    <div key={option.id}>
                      <div 
                        className="flex items-center gap-4 cursor-pointer hover:bg-zinc-800/50 p-4 rounded-lg transition-colors"
                        onClick={() => setSelectedPlan(option.id)}
                      >
                        <div className={`w-5 h-5 p-2.5 rounded-[99px] border border-cyan-400 flex justify-center items-center ${
                          selectedPlan === option.id ? "bg-cyan-400" : ""
                        }`}>
                          {selectedPlan === option.id && (
                            <div className="w-3.5 h-3.5 bg-cyan-400 rounded-full" />
                          )}
                        </div>
                        <div className="flex-1 flex justify-between items-center">
                          <div className="flex flex-col gap-1">
                            <Body className="text-white text-xl">
                              {MSIService.formatPlanDescription(option)}
                            </Body>
                            <Body className="text-zinc-400 text-sm">
                              {option.description}
                            </Body>
                          </div>
                          {option.interestRate === 0 && option.months > 1 && (
                            <BodySmall className="text-emerald-400 text-xl font-bold">MSI</BodySmall>
                          )}
                        </div>
                      </div>
                      {index < msiOptions.length - 1 && (
                        <div className="h-px bg-white/20 my-6" />
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}
            
            {/* Continue Button */}
            {selectedPaymentMethod && msiOptions.length > 0 && (
              <div className="flex justify-end">
                <Button 
                  onClick={handleContinue}
                  className="bg-primary-600 hover:bg-primary-700"
                  disabled={!selectedPlan}
                >
                  Continuar
                  <ArrowRightIcon className="w-5 h-5 ml-2" />
                </Button>
              </div>
            )}
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
              
              {/* Plan seleccionado */}
              {selectedPlan && msiOptions.length > 0 && (
                <>
                  <div className="h-px bg-white/20"></div>
                  <div className="flex justify-between items-center">
                    <Body className="text-white text-sm">Plan seleccionado</Body>
                    <Body className="text-cyan-400 text-sm">
                      {msiOptions.find(opt => opt.id === selectedPlan)?.description}
                    </Body>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}