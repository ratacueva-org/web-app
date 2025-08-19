"use client";

import React from "react";
import { Heading, Subheading, Body } from "@/components/atoms/Typography";
import DashboardContentLayout from "@/components/features/dashboard/templates/DashboardContentLayout";
import { useParams } from "next/navigation";
import Loader from "@/components/atoms/Loader";
import Input from "@/components/atoms/Input";
import { useShipment } from "@/hook/dashboard/shipments/useShipment";

export default function ShipmentDetailPage() {
    const params = useParams();
    const shipmentID = params.shipmentID as string;

    const { data: shipmentData, isLoading, error } = useShipment(shipmentID);

    console.log({ shipmentID, shipmentData, isLoading, error });

    if (isLoading) {
        return (
            <DashboardContentLayout>
                <Heading>Visualizar envío</Heading>
                <Loader className="h-40" />
            </DashboardContentLayout>
        );
    }

    if (error || !shipmentData) {
        return (
            <DashboardContentLayout>
                <Heading>Visualizar envío</Heading>
                <Body className="text-danger">
                    {error ? "Error al cargar el envío" : "No se encontró el envío"}
                </Body>
            </DashboardContentLayout>
        );
    }

    return (
        <DashboardContentLayout>
            <div className="flex flex-col gap-6">
                <Heading>Visualizar envío</Heading>

                <div className="bg-gray rounded-lg px-8 py-8 flex flex-col gap-6">

                    {/* Datos básicos del envío */}
                    <div className="flex flex-col gap-4">
                        <Subheading>Datos del envío</Subheading>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input label="Id del envío" value={shipmentData.id} readOnly />
                            <Input label="Número de rastreo" value={shipmentData.trackingNumber} readOnly />
                            <Input label="Transportista" value={shipmentData.carrier} readOnly />
                            <Input label="Tipo de servicio" value={shipmentData.serviceType} readOnly />
                            <Input label="Destino" value={shipmentData.destination} readOnly className="md:col-span-2" />
                        </div>
                    </div>

                    {/* Dimensiones y peso */}
                    <div className="flex flex-col gap-4">
                        <Subheading>Dimensiones y peso</Subheading>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input label="Peso (kg)" value={shipmentData.weight} readOnly />
                            <Input label="Dimensiones (LxAnxAl cm)" value={shipmentData.dimensions} readOnly />
                        </div>
                    </div>

                    {/* Estatus y fechas */}
                    <div className="flex flex-col gap-4">
                        <Subheading>Estatus y fechas</Subheading>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input label="Estatus" value={shipmentData.status} readOnly />
                            <Input label="Fecha de creación" value={shipmentData.createdAt} readOnly />
                            <Input label="Entrega estimada" value={shipmentData.estimatedDelivery} readOnly />
                            <Input label="Entrega real" value={shipmentData.actualDelivery} readOnly />
                        </div>
                    </div>

                    {/* Costo */}
                    <div className="flex flex-col gap-4">
                        <Subheading>Costo</Subheading>
                        <Input label="Costo del envío" value={shipmentData.cost} readOnly />
                    </div>

                    {/* Eventos de seguimiento */}
                    {shipmentData.events.length > 0 && (
                        <div className="flex flex-col gap-4">
                            <Subheading>Eventos de seguimiento ({shipmentData.events.length})</Subheading>
                            {shipmentData.events.map((event, index) => (
                                <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-5">
                                    <Input label="Estatus" value={event.status} readOnly />
                                    <Input label="Ubicación" value={event.location} readOnly />
                                    <Input label="Descripción" value={event.description} readOnly />
                                    <Input label="Fecha y hora" value={event.timestamp} readOnly />
                                </div>
                            ))}
                        </div>
                    )}

                </div>
            </div>
        </DashboardContentLayout>
    );
}
