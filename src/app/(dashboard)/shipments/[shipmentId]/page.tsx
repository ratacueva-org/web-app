"use client";

import React, { use } from "react";
import { Heading, Body } from "@/components/atoms/Typography";
import DashboardContentLayout from "@/components/features/dashboard/templates/DashboardContentLayout";
import { useParams } from "next/navigation";
import { useShipmentDetails } from "@/hook/dashboard/shipments/useShipments";

export default function ShipmentDetails() {
    const params = useParams();
    const shipmentId = params.shipmentId as string;

    const { data: shipmentData, isLoading, error } = useShipmentDetails(shipmentId);

    return (
        <DashboardContentLayout>
            <div className="flex flex-col gap-8 overflow-hidden items-stretch justify-start text-text">
                <Heading>Visualizar envío</Heading>

                {isLoading ? (
                    <Body>Cargando...</Body>
                ) : error ? (
                    <Body className="text-danger">Error al cargar el envío</Body>
                ) : !shipmentData ? (
                    <Body>No se encontró el envío</Body>
                ) : (
                    <div className="rounded-lg bg-gray flex flex-col min-h-[456px] w-full px-8 pt-9 pb-8 overflow-hidden items-stretch justify-center">
                        <div className="flex flex-col w-full items-stretch justify-start">

                            {/* First Row */}
                            <div className="flex w-full items-start gap-6 justify-start flex-wrap">
                                <InfoBox label="Id del envío" value={shipmentData.id} />
                                <InfoBox label="Número de rastreo" value={shipmentData.trackingNumber} />
                            </div>

                            {/* Second Row */}
                            <div className="flex mt-6 w-full items-start gap-6 justify-start flex-wrap">
                                <InfoBox label="Transportista" value={shipmentData.carrier} />
                                <InfoBox label="Destino" value={shipmentData.destination} />
                            </div>

                            {/* Third Row */}
                            <div className="flex mt-6 w-full items-start gap-6 justify-start flex-wrap">
                                <InfoBox label="Estatus" value={shipmentData.status} />
                                <InfoBox label="Fecha de creación" value={shipmentData.createdAt} />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </DashboardContentLayout>
    );
}

function InfoBox({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex min-w-[240px] min-h-[79px] flex-col items-stretch justify-start flex-1">
            <Body className="font-medium text-text mb-4">{label}</Body>
            <div className="rounded-lg bg-gray border border-border flex min-h-11 w-full px-4 py-3 items-center overflow-hidden justify-start">
                <Body className="text-text font-normal whitespace-nowrap">{value}</Body>
            </div>
        </div>
    );
}
