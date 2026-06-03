"use client"
import { useState } from "react"
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline"
import { Heading, Subheading, Body } from "@/components/atoms/Typography"
import Image from "next/image"

const faqItems = [
  {
    question: "¿Qué es RataCueva?",
    answer: "RataCueva es una tienda especializada en productos de tecnología y gaming.",
  },
  {
    question: "¿Cómo puedo realizar un pedido?",
    answer: "Puedes realizar un pedido a través de nuestra página web o visitando nuestra tienda física.",
  },
  {
    question: "¿Cuáles son los métodos de pago disponibles?",
    answer: "Aceptamos tarjetas de crédito/débito, transferencias bancarias y efectivo en tienda.",
  },
  {
    question: "¿Cuánto tiempo tarda en llegar mi pedido?",
    answer: "El tiempo de entrega depende de tu ubicación, generalmente entre 3-5 días hábiles.",
  },
  {
    question: "¿Tienen garantía los productos?",
    answer: "Sí, todos nuestros productos cuentan con garantía del fabricante.",
  },
  {
    question: "¿Puedo devolver un producto?",
    answer: "Sí, tienes hasta 14 días para devolver un producto en su empaque original.",
  },
]

const paymentMethods = [
  {
    name: "Visa",
    image: "https://cdn.jsdelivr.net/gh/aaronfagan/svg-credit-card-payment-icons/flat/visa.svg",
  },
  {
    name: "Mastercard",
    image: "https://cdn.jsdelivr.net/gh/aaronfagan/svg-credit-card-payment-icons/flat/mastercard.svg",
  },
  {
    name: "American Express",
    image: "https://cdn.jsdelivr.net/gh/aaronfagan/svg-credit-card-payment-icons/flat/amex.svg",
  },
  {
    name: "PayPal",
    image: "https://cdn.jsdelivr.net/gh/aaronfagan/svg-credit-card-payment-icons/flat/paypal.svg",
  },
  {
    name: "Transferencia bancaria",
    image: "https://cdn-icons-png.flaticon.com/512/1077/1077976.png",
  },
  {
    name: "Efectivo",
    image: "https://cdn-icons-png.flaticon.com/512/2830/2830284.png",
  },
]

const shippingCompanies = [
  {
    name: "DHL",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/DHL_Logo.svg/1200px-DHL_Logo.svg.png",
  },
  {
    name: "FedEx",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/FedEx_Express.svg/1200px-FedEx_Express.svg.png",
  },
  {
    name: "Mensajería local",
    image: "https://cdn-icons-png.flaticon.com/512/411/411763.png",
  },
]

export default function FaqSection() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  const toggleFaq = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index)
  }

  return (
    <section className="py-12 lg:py-16">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 lg:gap-12 xl:gap-16">
        {/* Left Column - Payment & Shipping Info */}
        <div className="space-y-8 lg:space-y-12">
          <div>
            <Heading className="text-white mb-4 lg:mb-6">Preguntas frecuentes</Heading>
            <Body className="text-white">
              Encuentra respuestas a las preguntas más comunes sobre nuestros productos y servicios.
            </Body>
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

          <div>
            <Subheading className="text-white mb-4 lg:mb-6">Métodos de pago disponibles</Subheading>
            <Body className="text-white mb-6">
              Ofrecemos múltiples opciones para que puedas pagar de la forma que prefieras.
            </Body>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
              {paymentMethods.map((method, index) => (
                <div
                  key={index}
                  className="px-4 py-3 bg-gray hover:bg-dark hover:border-gray border border-transparent border-2 transition-border transition-colors rounded-lg text-center text-white text-sm lg:text-base flex flex-col items-center gap-2 group"
                >
                  <div className="w-12 h-8 relative bg-white rounded p-1 flex items-center justify-center overflow-hidden">
                    <Image
                      src={method.image}
                      alt={method.name}
                      width={40}
                      height={24}
                      className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-200"
                    />
                  </div>
                  <span className="text-xs lg:text-sm">{method.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

          <div>
            <Subheading className="text-white mb-4 lg:mb-6">Empresas de envío</Subheading>
            <Body className="text-white mb-6">
              Tu paquete en las mejores manos, trabajamos con las empresas más confiables.
            </Body>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
              {shippingCompanies.map((company, index) => (
                <div
                  key={index}
                  className="px-4 py-3 bg-gray hover:bg-dark hover:border-gray border border-transparent border-2 transition-border transition-colors rounded-lg text-center text-white text-sm lg:text-base flex flex-col items-center gap-2 group"
                >
                  <div className="w-14 h-8 relative bg-white rounded p-1 flex items-center justify-center overflow-hidden">
                    <Image
                      src={company.image}
                      alt={company.name}
                      width={48}
                      height={24}
                      className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-200"
                    />
                  </div>
                  <span className="text-xs lg:text-sm">{company.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - FAQ Items */}
        <div className="space-y-4">
          {faqItems.map((item, index) => (
            <div key={index} className="bg-gray hover:bg-dark hover:border-gray border border-transparent border-2 transition-border transition-colors rounded-lg overflow-hidden">
              <button
                className="w-full px-6 py-4 text-left flex justify-between items-center"
                onClick={() => toggleFaq(index)}
              >
                <span className="text-white text-base font-medium pr-4">{item.question}</span>
                {activeIndex === index ? (
                  <ChevronUpIcon className="w-5 h-5 text-cyan-400 flex-shrink-0" />
                ) : (
                  <ChevronDownIcon className="w-5 h-5 text-cyan-400 flex-shrink-0" />
                )}
              </button>
              {activeIndex === index && (
                <div className="px-6 pb-4">
                  <Body className="text-white text-sm lg:text-base leading-relaxed">{item.answer}</Body>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
