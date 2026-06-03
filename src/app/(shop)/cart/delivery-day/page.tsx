"use client";

import Link from "next/link";
import { PageLayout } from "@/components/templates/PageLayout";
import { SettingsBreadcrumb } from "@/components/organisms/SettingsBreadcrumb";
import { Body, Subheading } from "@/components/atoms/Typography";
import Button from "@/components/atoms/Button";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import {
  DeliveryDatesService,
  DeliveryOption,
} from "@/services/settings/orders";
import { getAddresses } from "@/services/settings/address/addresses";

export default function DeliveryDayPage() {
  const { getCartTotal } = useCart();
  const { user } = useAuth();
  const [selectedDeliveryOption, setSelectedDeliveryOption] =
    useState<string>("");
  const [deliveryOptions, setDeliveryOptions] = useState<DeliveryOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  const subtotal = getCartTotal();
  const selectedOption = deliveryOptions.find(
    (option) => option.id === selectedDeliveryOption
  );
  const shippingCost = selectedOption?.cost || 0;
  const total = subtotal + shippingCost;

  // Obtener token del localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  // Obtener direcciones del usuario y opciones de entrega
  useEffect(() => {
    const fetchData = async () => {
      if (!user || !token) return;

      try {
        setLoading(true);

        // Obtener direcciones del usuario
        const addresses = await getAddresses(token);
        const defaultAddress =
          addresses.find((addr) => addr.isDefault) || addresses[0];

        if (defaultAddress) {
          // Obtener opciones de entrega
          const options = await DeliveryDatesService.getDeliveryOptions(
            defaultAddress
          );
          setDeliveryOptions(options);

          // Seleccionar la primera opción por defecto
          if (options.length > 0) {
            setSelectedDeliveryOption(options[0].id);
          }
        }
      } catch (error) {
        console.error("Error fetching delivery options:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, token]);

  return (
    <PageLayout>
      <div className="pt-8 pb-4">
        <SettingsBreadcrumb
          items={[
            { label: "Carrito", href: "/cart" },
            { label: "Envío", href: "/cart/form-page" },
            { label: "Día de entrega" },
          ]}
          title="Elige el día de entrega"
          color="text-white"
          className="mb-8"
        />

        <div className="flex flex-col lg:flex-row justify-start items-start gap-8">
          {/* Left Column: Shipping Options */}
          <div className="w-full lg:w-[847px] space-y-8">
            {/* Shipping Options */}
            <div className="p-6 bg-gray rounded-lg space-y-6">
              <Subheading className="text-white">
                Opciones de entrega
              </Subheading>
              <div className="h-px bg-white/20"></div>

              {loading ? (
                <div className="text-center py-8">
                  <Body className="text-white">
                    Cargando opciones de entrega...
                  </Body>
                </div>
              ) : deliveryOptions.length === 0 ? (
                <div className="text-center py-8">
                  <Body className="text-white">
                    No hay opciones de entrega disponibles
                  </Body>
                </div>
              ) : (
                <div className="space-y-8">
                  {deliveryOptions.map((option) => (
                    <div
                      key={option.id}
                      className="flex items-center gap-4 cursor-pointer"
                      onClick={() => setSelectedDeliveryOption(option.id)}
                    >
                      <div
                        className={`w-5 h-5 p-2.5 rounded-[99px] border border-cyan-400 flex justify-center items-center ${
                          selectedDeliveryOption === option.id
                            ? "bg-cyan-400"
                            : ""
                        }`}
                      >
                        {selectedDeliveryOption === option.id && (
                          <div className="w-3.5 h-3.5 bg-cyan-400 rounded-full" />
                        )}
                      </div>
                      <div className="flex-1 flex justify-between items-center">
                        <div className="flex flex-col gap-1">
                          <Body className="text-white text-xl">
                            {option.name}
                          </Body>
                          <Body className="text-zinc-400 text-sm">
                            {option.description}
                          </Body>
                        </div>
                        <Body
                          className={`text-xl ${
                            option.cost === 0
                              ? "text-emerald-400"
                              : "text-white"
                          }`}
                        >
                          {option.cost === 0
                            ? "Gratis"
                            : `$${option.cost.toLocaleString()}`}
                        </Body>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Continue Button */}
            <div className="flex justify-end">
              <Link href="/cart/payment-card-options">
                <Button className="bg-primary-600 hover:bg-primary-700">
                  Continuar
                  <ArrowRightIcon className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Column: Purchase Summary */}
          <div className="flex-1 w-full lg:w-auto">
            <div className="p-6 bg-gray rounded-lg space-y-6">
              <Subheading className="text-white">
                Resumen de la compra
              </Subheading>
              <div className="h-px bg-white/20"></div>
              <div className="flex justify-between items-center">
                <Body className="text-white">Producto</Body>
                <Body className="text-white">
                  ${subtotal.toLocaleString()}
                </Body>
              </div>
              <div className="flex justify-between items-center">
                <Body className="text-white">Envío</Body>
                <Body className="text-white">
                  ${shippingCost.toLocaleString()}
                </Body>
              </div>
              <div className="h-px bg-white/20"></div>
              <div className="flex justify-between items-center">
                <Body className="text-white">Total</Body>
                <Subheading className="text-white">
                  ${total.toLocaleString()}
                </Subheading>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
