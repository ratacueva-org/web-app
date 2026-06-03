"use client";

import React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { PageLayout } from "@/components/templates/PageLayout";
import { SettingsBreadcrumb } from "@/components/organisms/SettingsBreadcrumb";
import { BodySmall } from "@/components/atoms/Typography";
import Button from "@/components/atoms/Button";
import { useCart } from "@/contexts/CartContext";
import Toast from "@/components/atoms/Toast";
import PurchaseSummary from "@/components/organisms/PurchaseSummary";

export default function AddCardPage() {
  const { getCartTotal } = useCart();
  const router = useRouter();

  const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

  const [type, setType] = useState<
    "credit_card" | "debit_card" | "paypal" | "oxxo_cash"
  >("credit_card");
  const [last4, setLast4] = useState("");
  const [provider, setProvider] = useState("BANCO");
  const [expiration, setExpiration] = useState("");
  const [proprietaryName, setProprietaryName] = useState("");
  const [cvv, setCvv] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [isToastVisible, setIsToastVisible] = useState(false);
  const [toastType, setToastType] = useState<"success" | "info" | "warning">(
    "success"
  );
  const [token, setToken] = useState<string | null>(null);

  const subtotal = getCartTotal();
  const shipping = 0;
  const total = subtotal + shipping;

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) setToken(storedToken);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    if (!validateForm()) {
      setIsLoading(false);
      return;
    }

    const digitsOnly = last4.replace(/\D/g, ""); // Elimina todo lo que no sea número
    const last4Digits = digitsOnly.slice(-4);

    if (last4Digits.length !== 4) {
      setToastMessage(
        "Los últimos 4 dígitos deben tener exactamente 4 números."
      );
      setToastType("warning");
      setIsToastVisible(true);
      setIsLoading(false);
      return;
    }

    try {
      await axios.post(
        `${API_URL}/users/payment-methods`,
        {
          type,
          last4: last4Digits,
          provider,
          expiration,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setToastMessage("Método de pago añadido exitosamente.");
      setToastType("success");
      setIsToastVisible(true);
      resetForm();

      setTimeout(() => router.push("/payment-options"), 2000);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : (error as { response?: { data?: { message?: string } } })?.response
              ?.data?.message;
      setToastMessage(
        errorMessage || "Ocurrió un error al añadir el método de pago."
      );
      setToastType("warning");
      setIsToastVisible(true);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = () => {
    if (
      !last4.trim() ||
      !proprietaryName.trim() ||
      !expiration.trim() ||
      !cvv.trim()
    ) {
      setToastMessage("Por favor, completa todos los campos obligatorios.");
      setToastType("warning");
      setIsToastVisible(true);
      return false;
    }
    return true;
  };

  const resetForm = () => {
    setType("credit_card");
    setLast4("");
    setProvider("");
    setExpiration("");
    setProprietaryName("");
    setCvv("");
    setIsLoading(false);
  };

  return (
    <PageLayout>
      <div className="pt-8 pb-4">
        <SettingsBreadcrumb
          items={[
            { label: "Carrito", href: "/cart" },
            { label: "Envío", href: "/shipping" },
            { label: "Nueva Tarjeta" },
          ]}
          title="Ingresa una nueva tarjeta"
          color="text-white"
          className="mb-8"
        />

        <form onSubmit={handleSubmit}>
          <div className="flex flex-col lg:flex-row justify-start items-start gap-8">
            {/* Left Column */}
            <div className="w-full lg:w-[847px] space-y-8">
              <div className="p-6 bg-gray rounded-lg">
                <div className="flex gap-8">
                  <div className="flex-1 space-y-6">
                    {/* Card Number */}
                    <div className="space-y-4">
                      <BodySmall
                        as="label"
                        htmlFor="cardNumber"
                        className="text-white text-base font-medium block"
                      >
                        Número de tarjeta
                      </BodySmall>
                      <input
                        id="cardNumber"
                        type="text"
                        inputMode="numeric"
                        className="w-full h-11 px-4 py-3 bg-gray rounded-lg border border-neutral-600 text-white focus:outline-none focus:border-cyan-400"
                        placeholder="1234 5678 9012 3456"
                        value={last4}
                        onChange={(e) => {
                          const onlyNums = e.target.value.replace(/\D/g, "");
                          setLast4(onlyNums);
                        }}
                        minLength={16}
                        maxLength={16}
                      />
                    </div>

                    {/* Nombre */}
                    <div className="space-y-4">
                      <BodySmall
                        as="label"
                        htmlFor="cardName"
                        className="text-white text-base font-medium block"
                      >
                        Nombre y apellido
                      </BodySmall>
                      <div className="space-y-1">
                        <input
                          id="cardName"
                          type="text"
                          className="w-full h-11 px-4 py-3 bg-gray rounded-lg border border-neutral-600 text-white focus:outline-none focus:border-cyan-400"
                          placeholder="Juan Pérez"
                          value={proprietaryName}
                          onChange={(e) => setProprietaryName(e.target.value)}
                          minLength={3}
                          maxLength={30}
                        />
                        <BodySmall className="text-white text-xs">
                          Como figura en la tarjeta.
                        </BodySmall>
                      </div>
                    </div>

                    {/* Fecha y CVV */}
                    <div className="flex gap-6">
                      <div className="flex-1 space-y-4">
                        <BodySmall
                          as="label"
                          htmlFor="expiryDate"
                          className="text-white text-base font-medium block"
                        >
                          Fecha de vencimiento
                        </BodySmall>
                        <div className="space-y-1">
                          <input
                            id="expiryDate"
                            type="text"
                            inputMode="numeric"
                            className="w-full h-11 px-4 py-3 bg-gray rounded-lg border border-neutral-600 text-white focus:outline-none focus:border-cyan-400"
                            placeholder="MM/AA"
                            value={expiration}
                            onChange={(e) => {
                              let value = e.target.value.replace(/\D/g, "");
                              if (value.length > 2) {
                                value =
                                  value.slice(0, 2) + "/" + value.slice(2);
                              }
                              if (value.length > 5) value = value.slice(0, 5);
                              setExpiration(value);
                            }}
                            minLength={5}
                            maxLength={5}
                          />
                          <BodySmall className="text-white text-xs">
                            Mes / Año
                          </BodySmall>
                        </div>
                      </div>

                      <div className="flex-1 space-y-4">
                        <BodySmall
                          as="label"
                          htmlFor="cvv"
                          className="text-white text-base font-medium block"
                        >
                          Código de seguridad
                        </BodySmall>
                        <div className="space-y-1">
                          <input
                            id="cvv"
                            type="text"
                            inputMode="numeric"
                            maxLength={3}
                            className="w-full h-11 px-4 py-3 bg-gray rounded-lg border border-neutral-600 text-white focus:outline-none focus:border-cyan-400"
                            placeholder="123"
                            value={cvv}
                            onChange={(e) => {
                              const onlyNums = e.target.value.replace(
                                /\D/g,
                                ""
                              );
                              setCvv(onlyNums);
                            }}
                          />
                          <BodySmall className="text-white text-xs">
                            CVV
                          </BodySmall>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Vista previa */}
                  <div className="w-80 h-48 bg-gradient-to-r from-purple-800 to-indigo-600 rounded-2xl p-6 text-white shadow-lg flex flex-col justify-between">
                    <div className="flex justify-between items-center">
                      <span className="text-sm uppercase tracking-widest">
                        {provider || "Proveedor"}
                      </span>
                      <span className="text-xs">
                        {type === "credit_card" ? "Crédito" : "Débito"}
                      </span>
                    </div>

                    <div className="text-lg tracking-widest mt-4">
                      {last4
                        .replace(/\D/g, "")
                        .padStart(4, "*")
                        .padStart(19, "* ")}
                    </div>

                    <div className="flex justify-between text-xs mt-4">
                      <div>
                        <div className="uppercase">Titular</div>
                        <div className="font-medium">{proprietaryName}</div>
                      </div>
                      <div>
                        <div className="uppercase">Vence</div>
                        <div className="font-medium">
                          {expiration || "MM/AA"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Botón */}
              <div className="flex justify-end">
                <Button
                  type="submit"
                  className="bg-pink-600 hover:bg-pink-700"
                  disabled={isLoading}
                >
                  Guardar y continuar
                </Button>
              </div>
            </div>

            {/* Right Column: Purchase Summary */}
            <PurchaseSummary subtotal={subtotal} total={total} />
          </div>
        </form>
      </div>

      {/* TOAST */}
      <Toast
        message={toastMessage}
        isVisible={isToastVisible}
        onClose={() => setIsToastVisible(false)}
        type={toastType}
      />
    </PageLayout>
  );
}
