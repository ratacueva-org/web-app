"use client";

import Image from "next/image";
import Link from "next/link";
import { PageLayout } from "@/components/templates/PageLayout";
import Button from "@/components/atoms/Button";
import { useCart } from "@/contexts/CartContext";
import { useOrder } from "@/contexts/OrderContext";
import { useAuth } from "@/contexts/AuthContext";
import { useOrders } from "@/hook/useOrders";
import { useEffect, useState, useCallback, useRef } from "react";
import { ClipboardDocumentListIcon } from "@heroicons/react/24/outline";
import { Body, Subheading, Heading } from "@/components/atoms/Typography";
import { type Order } from "@/services/settings/purchases";
import { type CartItem } from "@/contexts/CartContext";

interface PurchaseData {
  items: CartItem[];
  total: number;
  deliveryDate: string;
  orderNumber: string;
  order?: Order;
}

interface Toast {
  isVisible: boolean;
  message: string;
}

export default function SuccessfulPurchasePage() {
  const { items, clearCart } = useCart();
  const { createNewOrder, isLoading } = useOrder();
  const { user } = useAuth();
  const { addOrder } = useOrders();
  const [purchaseData, setPurchaseData] = useState<PurchaseData | null>(null);
  const [orderCreated, setOrderCreated] = useState(false);
  const [toast, setToast] = useState<Toast>({ isVisible: false, message: "" });
  const [processingOrder, setProcessingOrder] = useState(false);

  // Refs para controlar ejecución única
  const hasProcessedRef = useRef(false);
  const isProcessingRef = useRef(false);
  const mountedRef = useRef(false);

  // Función para mostrar toast
  const showSuccessToast = useCallback((message: string) => {
    setToast({ isVisible: true, message });

    setTimeout(() => {
      setToast({ isVisible: false, message: "" });
    }, 3000);
  }, []);

  // Verificar compra previa SOLO si no hay items en el carrito
  useEffect(() => {
    mountedRef.current = true;

    // SOLO buscar compra previa si no hay items en el carrito actual
    if (!items || items.length === 0) {
      const savedPurchase = localStorage.getItem("lastPurchase");
      if (savedPurchase && !hasProcessedRef.current) {
        try {
          const purchaseData = JSON.parse(savedPurchase);
          setPurchaseData(purchaseData);
          setOrderCreated(true);
          hasProcessedRef.current = true;
          console.log(
            "Compra previa encontrada (sin items en carrito):",
            purchaseData
          );
        } catch (error) {
          console.error("Error al cargar compra previa:", error);
          localStorage.removeItem("lastPurchase");
        }
      }
    }

    return () => {
      mountedRef.current = false;
    };
  }, [items]);

  // Función para procesar la compra
  const processPurchase = useCallback(async () => {
    // Verificaciones de seguridad
    if (
      !mountedRef.current ||
      hasProcessedRef.current ||
      isProcessingRef.current
    ) {
      console.log("Proceso bloqueado:", {
        mounted: mountedRef.current,
        processed: hasProcessedRef.current,
        processing: isProcessingRef.current,
      });
      return;
    }

    // Verificar condiciones básicas
    if (!items || items.length === 0 || !user) {
      console.log("Condiciones no cumplidas:", {
        items: items?.length,
        user: !!user,
      });
      return;
    }

    // Marcar como procesando
    hasProcessedRef.current = true;
    isProcessingRef.current = true;

    if (!mountedRef.current) return;
    setProcessingOrder(true);

    try {
      // Limpiar cualquier compra previa antes de procesar nueva
      localStorage.removeItem("lastPurchase");

      // Obtener datos del checkout
      const checkoutDataString = localStorage.getItem("checkoutData");

      if (!checkoutDataString) {
        console.error("No se encontraron datos del checkout");
        if (mountedRef.current) {
          showSuccessToast("Error: No se encontraron datos del checkout");
        }
        return;
      }

      const checkoutData = JSON.parse(checkoutDataString);

      // Validar datos necesarios
      if (!checkoutData.shippingAddress || !checkoutData.paymentMethod) {
        console.error("Faltan datos del checkout");
        if (mountedRef.current) {
          showSuccessToast("Error: Faltan datos del checkout");
        }
        return;
      }

      // Calcular totales
      const subtotal = items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      const shippingCost = checkoutData.shippingCost || 0;
      const taxAmount = Math.round(subtotal * 0.16);
      const discountAmount = 0;

      // Preparar datos de la orden
      const orderData = {
        items: items.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
          // selectedVariation removed as it doesn't exist on CartItem
        })),
        shippingAddress: {
          postalCode: checkoutData.shippingAddress.postalCode || "",
          street: checkoutData.shippingAddress.street || "",
          externalNumber: checkoutData.shippingAddress.externalNumber || "",
          internalNumber:
            checkoutData.shippingAddress.internalNumber || undefined,
          neighborhood: checkoutData.shippingAddress.neighborhood || "",
          city: checkoutData.shippingAddress.city || "",
          state: checkoutData.shippingAddress.state || "",
          country: checkoutData.shippingAddress.country || "México",
        },
        billingAddress: {
          postalCode: checkoutData.shippingAddress.postalCode || "",
          street: checkoutData.shippingAddress.street || "",
          externalNumber: checkoutData.shippingAddress.externalNumber || "",
          internalNumber:
            checkoutData.shippingAddress.internalNumber || undefined,
          neighborhood: checkoutData.shippingAddress.neighborhood || "",
          city: checkoutData.shippingAddress.city || "",
          state: checkoutData.shippingAddress.state || "",
          country: checkoutData.shippingAddress.country || "México",
        },
        paymentMethod: {
          type: checkoutData.paymentMethod.type || "debit_card",
          paymentGatewayToken:
            checkoutData.paymentMethod.type === "oxxo_cash"
              ? checkoutData.cashPayment?.paymentCode || "cash_payment"
              : checkoutData.paymentMethod.methodId ||
                checkoutData.paymentMethod.last4 ||
                "tok_test",
        },
        shippingCost: shippingCost,
        taxAmount: taxAmount,
        discountAmount: discountAmount,
      };

      console.log(
        "Creando orden con datos:",
        JSON.stringify(orderData, null, 2)
      );

      // Crear la orden
      const newOrder = await createNewOrder(orderData);

      console.log("Orden creada exitosamente:", newOrder);

      if (!mountedRef.current) return;

      // Agregar la nueva orden a la lista
      addOrder(newOrder);

      // Calcular fecha de entrega
      const deliveryDate = new Date();
      const estimatedDays = checkoutData.deliveryOption?.estimatedDays || 14;
      deliveryDate.setDate(deliveryDate.getDate() + estimatedDays);
      const formattedDate = deliveryDate.toLocaleDateString("es-ES", {
        day: "numeric",
        month: "long",
      });

      // Calcular total final
      const total = subtotal + shippingCost + taxAmount - discountAmount;

      // Establecer datos de compra
      const finalPurchaseData = {
        items: items,
        total: total,
        deliveryDate: formattedDate,
        orderNumber: newOrder._id || "N/A",
        order: newOrder,
      };

      if (mountedRef.current) {
        setPurchaseData(finalPurchaseData);
        setOrderCreated(true);

        // Guardar en localStorage
        localStorage.setItem("lastPurchase", JSON.stringify(finalPurchaseData));

        // Mostrar mensaje de éxito
        showSuccessToast("¡Compra exitosa! Tu orden ha sido creada.");

        // Limpiar datos del checkout
        localStorage.removeItem("checkoutData");

        // Limpiar carrito al final
        clearCart();
      }
    } catch (error: unknown) {
      console.error("Error al crear la orden:", error);

      // Solo resetear si hay error de red o servidor para permitir reintento
      const errorMessage = error instanceof Error ? error.message : "";
      if (
        errorMessage.includes("Network") ||
        errorMessage.includes("Backend no disponible")
      ) {
        hasProcessedRef.current = false;
      }

      if (!mountedRef.current) return;

      if (typeof error === "object" && error !== null && "response" in error) {
        const err = error as {
          response?: { status?: number; data?: { message?: string } };
        };

        if (err.response?.status === 400) {
          showSuccessToast(
            `Error: ${
              err.response?.data?.message || "Datos de compra inválidos"
            }`
          );
        } else if (err.response?.status === 401) {
          showSuccessToast("Error: Sesión expirada. Inicia sesión nuevamente.");
        } else if (err.response?.status === 409) {
          const errorMessage =
            err.response?.data?.message ||
            "Stock insuficiente o problema con el pago.";
          showSuccessToast(`Error: ${errorMessage}`);

          setTimeout(() => {
            if (mountedRef.current) {
              window.location.href = "/cart";
            }
          }, 3000);
        } else {
          showSuccessToast("Error al procesar la compra. Inténtalo de nuevo.");
        }
      } else if (errorMessage.includes("Network")) {
        showSuccessToast(
          "Error de conexión. Verifica que el servidor esté ejecutándose."
        );
      } else if (errorMessage.includes("Backend no disponible")) {
        showSuccessToast("Servidor no disponible. Contacta al administrador.");
      } else {
        showSuccessToast("Error al procesar la compra. Inténtalo de nuevo.");
      }
    } finally {
      if (mountedRef.current) {
        setProcessingOrder(false);
      }
      isProcessingRef.current = false;
    }
  }, [items, user, addOrder, clearCart, createNewOrder, showSuccessToast]); // Include all dependencies

  // Effect para procesar la compra SOLO una vez
  useEffect(() => {
    // Solo procesar si hay items y usuario, y no se ha procesado antes
    if (
      items &&
      items.length > 0 &&
      user &&
      !hasProcessedRef.current &&
      !orderCreated
    ) {
      console.log("Iniciando procesamiento de nueva compra...");
      const timer = setTimeout(() => {
        processPurchase();
      }, 1000); // Delay para asegurar que todo esté listo

      return () => clearTimeout(timer);
    }
  }, [items, user, orderCreated, processPurchase]);

  // Estados de carga y error
  if (isLoading || processingOrder) {
    return (
      <PageLayout>
        <div className="px-4 lg:px-60 py-8 flex flex-col justify-center items-center gap-8">
          <div className="w-full flex flex-col justify-start items-center gap-12">
            <Heading className="text-white">Procesando tu compra...</Heading>
            <Body className="text-white">Creando tu orden...</Body>
            <div className="w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (!purchaseData && hasProcessedRef.current && !processingOrder) {
    return (
      <PageLayout>
        <div className="px-4 lg:px-60 py-8 flex flex-col justify-center items-center gap-8">
          <div className="w-full flex flex-col justify-start items-center gap-12">
            <Heading className="text-white">Problema con la compra</Heading>
            <Body className="text-white text-center">
              Hubo un problema al procesar tu compra. Verifica que el servidor
              esté ejecutándose y que los productos tengan stock disponible.
            </Body>
            <div className="flex gap-4">
              <Link href="/cart" className="w-full max-w-xs">
                <Button className="w-full h-11 px-4 py-2.5">
                  Volver al carrito
                </Button>
              </Link>
              <Link href="/shop" className="w-full max-w-xs">
                <Button className="w-full h-11 px-4 py-2.5">
                  Continuar comprando
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </PageLayout>
    );
  }

  // Si no hay datos de compra, mostrar un mensaje de carga o error
  if (!purchaseData) {
    return (
      <PageLayout>
        <div className="px-4 lg:px-60 py-8 flex flex-col justify-center items-center gap-8">
          <div className="text-center">
            <Body className="text-white">
              Cargando información de la compra...
            </Body>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      {/* Notificación Toast */}
      {toast.isVisible && (
        <div className="fixed top-4 right-4 z-50 p-4 bg-emerald-500 text-white rounded-lg shadow-lg transition-all duration-300 ease-in-out">
          <Body className="text-white font-medium">{toast.message}</Body>
        </div>
      )}

      <div className="px-4 lg:px-60 py-8 flex flex-col justify-center items-center gap-8">
        <div className="w-full flex flex-col justify-start items-center gap-12">
          <div className="w-full flex flex-col justify-start items-start gap-8">
            {/* Card del producto comprado */}
            <div className="w-full p-6 bg-dark rounded-lg flex justify-start items-center gap-6">
              <div className="flex-1 flex flex-col justify-start items-start gap-4">
                {/* Fecha de llegada */}
                <div className="w-full flex justify-start items-center gap-2.5">
                  <Body className="text-emerald-400 text-xl font-bold">
                    Llega el {purchaseData.deliveryDate}
                  </Body>
                </div>

                {/* Lista de productos */}
                <div className="w-full space-y-4">
                  <Subheading className="text-white">
                    Productos comprados:
                  </Subheading>
                  {purchaseData.items.map((item: CartItem, index: number) => (
                    <div
                      key={`${item.id}-${index}`}
                      className="w-full p-6 bg-zinc-800 rounded-lg flex justify-start items-center gap-6"
                    >
                      <Image
                        className="w-24 h-24 object-cover rounded-lg"
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        width={96}
                        height={96}
                      />
                      <div className="flex-1 flex flex-col justify-start items-start gap-2">
                        <Subheading className="text-white">
                          {item.name}
                        </Subheading>
                        <Body className="text-white">
                          Cantidad: {item.quantity}
                        </Body>
                        <Body className="text-emerald-400 font-bold">
                          ${(item.price * item.quantity).toLocaleString()}
                        </Body>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Total */}
                <div className="w-full p-6 bg-zinc-800 rounded-lg">
                  <div className="flex justify-between items-center">
                    <Subheading className="text-white">
                      Total de la compra:
                    </Subheading>
                    <Subheading className="text-emerald-400">
                      ${purchaseData.total.toLocaleString()}
                    </Subheading>
                  </div>
                </div>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="w-full flex justify-center items-center">
              <Link href="/settings/purchases" className="w-full max-w-xs">
                <Button className="w-full h-11 px-4 py-2.5">
                  <ClipboardDocumentListIcon className="w-5 h-5 mr-2" />
                  Ir a mis compras
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
