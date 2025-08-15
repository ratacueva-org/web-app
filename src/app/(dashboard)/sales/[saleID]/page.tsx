"use client";

import React, { use } from "react";
import { useQuery } from "@tanstack/react-query";
import { Display, Body, Heading, Subheading } from "@/components/atoms/Typography";
import DashboardContentLayout from "@/components/features/dashboard/templates/DashboardContentLayout";
import { notFound } from "next/navigation";
import Input from "@/components/atoms/Input";
import { SaleDetail } from "@/hook/dashboard/sales/useSale";
import Textarea from "@/components/atoms/Textarea";

interface SaleDetailPageProps {
    params: Promise<{ saleID: string }>;
}

const paymentMethodLabels: Record<string, string> = {
    credit_card: "Tarjeta de crédito",
    debit_card: "Tarjeta de débito",
    paypal: "Paypal",
    oxxo_cash: "Oxxo",
    cash: "Efectivo",
};

export default function SaleDetailPage({ params }: SaleDetailPageProps) {
    const { saleID } = use(params);
    const token = localStorage.getItem("token");

    const { data: saleData, isLoading, error } = useQuery<{ message: string; order: SaleDetail }>({
        queryKey: ["sale", saleID],
        queryFn: async () => {
            if (!token) throw new Error("No hay token disponible");
            const res = await fetch(`https://ratacueva-api.onrender.com/api/orders/${saleID}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            if (!res.ok) throw new Error("Error al obtener venta");
            return res.json();
        },
        enabled: !!saleID && !!token,
    });

    const sale = saleData?.order;

    if (isLoading) return <Body>Cargando...</Body>;
    if (error || !sale) {
        console.log("Error o sale vacío:", sale, error);
        notFound();
    }

    // Función para mostrar estatus legible
    const getStatusText = (status: string) => {
        switch (status) {
            case "completed":
                return "Completado";
            case "pending":
                return "Pendiente";
            case "processing":
                return "En tránsito";
            case "in_transit":
                return "En camino";
            case "shipped":
                return "Enviado";
            case "cancelled":
                return "Cancelado";
            default:
                return status;
        }
    };

    // Formato de fecha largo con hora
    // Función para formatear fecha con hora
    const formatFullDate = (dateStr: string) => {
        const date = new Date(dateStr);
        const options: Intl.DateTimeFormatOptions = {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
        };
        return `${date.toLocaleDateString("es-MX", options)} a las ${date.toLocaleTimeString("es-MX", { hour12: false })} hrs`;
    };

    // Función para formatear notas
    const formatNote = (note: string) => {
        if (!note) return "";
        const datePart = note.slice(0, 24);
        const message = note.slice(25).trim();
        const date = new Date(datePart);
        if (isNaN(date.getTime())) return note;
        const formattedDate = date.toLocaleDateString("es-MX", { day: "numeric", month: "long", year: "numeric" });
        return `${formattedDate}: ${message}`;
    };



    // Campos mapeados
    const customerName = sale.userId ? `${sale.userId.name} ${sale.userId.lastName}` : "";
    const customerEmail = sale.userId?.email || "";
    const customerPhone = sale.userId?.phone || "";
    const payMethod = paymentMethodLabels[sale.paymentDetails?.type || ""] || sale.paymentDetails?.type || "";
    const totalPrice = sale.totalAmount;
    const totalProducts = sale.items?.length || 0;
    const shipping = sale.shippingAddress
        ? `${sale.shippingAddress.street} ${sale.shippingAddress.externalNumber}, ${sale.shippingAddress.neighborhood}, ${sale.shippingAddress.city}, ${sale.shippingAddress.state || sale.shippingAddress.country}, ${sale.shippingAddress.postalCode}`
        : "";
    const billing = sale.billingAddress
        ? `${sale.billingAddress.street} ${sale.billingAddress.externalNumber}, ${sale.billingAddress.neighborhood}, ${sale.billingAddress.city}, ${sale.billingAddress.state || sale.billingAddress.country}, ${sale.billingAddress.postalCode}`
        : "";
    const status = getStatusText(sale.orderStatus);
    const date = formatFullDate(sale.createdAt);

    console.log("Datos de la venta completos:", {
        sale,
        customerName,
        customerEmail,
        customerPhone,
        payMethod,
        totalPrice,
        totalProducts,
        shipping,
        billing,
        status,
        date,
    });

    return (
        <DashboardContentLayout>
            <div className="flex flex-col gap-6">
                <Heading>Visualizar venta</Heading>

                <div className="bg-gray rounded-lg px-8 py-8 flex flex-col gap-6">

                    {/* Datos del usuario */}
                    <div className="flex flex-col gap-4">
                        <Subheading>Datos del usuario</Subheading>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input label="Id de venta" value={sale._id} readOnly className="pointer-events-none" />
                            <Input label="Nombre" value={customerName} readOnly className="pointer-events-none" />
                            <Input label="Correo" value={customerEmail} readOnly className="pointer-events-none" />
                            <Input label="Teléfono" value={customerPhone} readOnly className="pointer-events-none" />
                        </div>
                    </div>

                    {/* Pago y estatus */}
                    <div className="flex flex-col gap-4">
                        <Subheading>Pago y estatus</Subheading>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input label="Método de pago" value={payMethod} readOnly className="pointer-events-none" />
                            <Input label="Estatus del pedido" value={status} readOnly className="pointer-events-none" />
                            <Input label="Fecha" value={formatFullDate(sale.createdAt)} readOnly className="pointer-events-none" />
                            <div></div> {/* Empty space for alignment */}
                        </div>
                    </div>

                    {/* Direcciones */}
                    <div className="flex flex-col gap-4">
                        <Subheading>Direcciones</Subheading>
                        <div className="overflow-x-auto">
                            <Textarea
                                readOnly
                                value={shipping}
                                className="pointer-events-none w-full whitespace-nowrap overflow-x-auto border rounded-lg px-3 py-2"
                            />
                        </div>

                        <div className="overflow-x-auto">
                            <Textarea
                                readOnly
                                value={billing}
                                className="pointer-events-none w-full whitespace-nowrap overflow-x-auto border rounded-lg px-3 py-2"
                            />
                        </div>


                    </div>

                    {/* Productos */}
                    <div className="flex flex-col gap-4">
                        <Subheading>Productos ({totalProducts})</Subheading>
                        {sale.items.map((item, index) => (
                            <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-5">
                                <Input label="Nombre" value={item.name} readOnly className="pointer-events-none" />
                                <Input label="Cantidad" value={`${item.quantity}`} readOnly className="pointer-events-none" />
                                <Input label="Precio unitario" value={`$${item.priceAtAddition.toFixed(2)} MXN`} readOnly className="pointer-events-none" />
                                {item.discountPercentageApplied > 0 && (
                                    <Input label="Descuento" value={`${item.discountPercentageApplied}%`} readOnly className="pointer-events-none" />
                                )}
                                <Input label="Subtotal" value={`$${(item.priceAtAddition * item.quantity).toFixed(2)} MXN`} readOnly className="pointer-events-none md:col-span-4" />
                            </div>
                        ))}
                    </div>

                    {/* Totales y notas */}
                    <div className="flex flex-col gap-4">
                        <Subheading>Totales y notas</Subheading>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input label="Subtotal" value={`$${sale.subtotal.toFixed(2)}`} readOnly className="pointer-events-none" />
                            <Input label="Impuestos" value={`$${sale.taxAmount.toFixed(2)}`} readOnly className="pointer-events-none" />
                            <Input label="Costo de envío" value={`$${sale.shippingCost.toFixed(2)}`} readOnly className="pointer-events-none" />
                            <Input label="Descuento" value={`$${sale.discountAmount.toFixed(2)}`} readOnly className="pointer-events-none" />
                            <Input label="Total" value={`$${totalPrice.toFixed(2)} MXN`} readOnly className="pointer-events-none" />
                            <Input label="ID de transacción" value={sale.paymentDetails?.transactionId || ""} readOnly className="pointer-events-none" />
                            {sale.notes && (
                                <div className="flex flex-col gap-2">
                                    <Subheading>Notas</Subheading>
                                    <Input value={formatNote(sale.notes)} readOnly className="pointer-events-none md:col-span-2" />
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </DashboardContentLayout>

    );
}
