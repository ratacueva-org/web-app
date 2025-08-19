import { useQuery } from "@tanstack/react-query";
import { mapStatusToStatusType } from "@/components/features/dashboard/atoms/StatusTag";
import {
    formatCurrency,
    formatDimensions,
    formatFullDate,
    formatWeight,
} from "@/utils/formatters";

const API_URL = "https://ratacueva-api.onrender.com/api/shipping";

interface ShipmentDetailApiResponse {
    success: boolean;
    // Permitimos que data sea null o undefined
    data: {
        _id: string;
        orderId: string;
        trackingNumber: string;
        carrier: string;
        serviceType: string;
        weight: number;
        dimensions: { length: number; width: number; height: number };
        shippingAddress: {
            street: string;
            city: string;
            state: string;
            postalCode: string;
            country: string;
        };
        currentStatus: string;
        estimatedDelivery: string;
        actualDelivery: string;
        trackingEvents: Array<{
            status: string;
            description: string;
            location: string;
            timestamp: string;
            estimatedDelivery?: string;
        }>;
        shippingCost: number;
        createdAt: string;
        updatedAt: string;
    } | null;
}

export interface Shipment {
    id: string;
    orderId: string;
    trackingNumber: string;
    carrier: string;
    serviceType: string;
    weight: string;
    dimensions: string;
    destination: string;
    status: string;
    estimatedDelivery: string;
    actualDelivery: string;
    cost: string;
    createdAt: string;
    updatedAt: string;
    events: Array<{
        status: string;
        description: string;
        location: string;
        timestamp: string;
    }>;
}

export const useShipment = (shipmentID: string) => {
    // Evitamos error en SSR
    const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;

    return useQuery<Shipment>({
        queryKey: ["shipment", shipmentID],
        queryFn: async () => {
            if (!token) {
                throw new Error("No hay token disponible");
            }

            const res = await fetch(`${API_URL}/${shipmentID}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) {
                throw new Error("Error al cargar los detalles del envío");
            }

            const response: ShipmentDetailApiResponse = await res.json();
            const item = response.data;
            if (!item) {
                throw new Error("No se encontró el envío");
            }

            // Destructuramos dimensiones con defaults
            const { length = 0, width = 0, height = 0 } = item.dimensions ?? {};

            return {
                id: item._id,
                orderId: item.orderId,
                trackingNumber: item.trackingNumber,
                carrier: item.carrier,
                serviceType: item.serviceType,
                weight: formatWeight(item.weight),
                dimensions: formatDimensions(length, width, height),
                destination: [
                    item.shippingAddress.street,
                    item.shippingAddress.city,
                    item.shippingAddress.state,
                    item.shippingAddress.country,
                ].join(", "),
                status: mapStatusToStatusType(item.currentStatus),
                estimatedDelivery: formatFullDate(item.estimatedDelivery),
                actualDelivery: item.actualDelivery
                    ? formatFullDate(item.actualDelivery)
                    : "Pendiente",
                cost: formatCurrency(item.shippingCost),
                createdAt: formatFullDate(item.createdAt),
                updatedAt: formatFullDate(item.updatedAt),
                events:
                    item.trackingEvents?.map((e) => ({
                        status: mapStatusToStatusType(e.status),
                        description: e.description,
                        location: e.location,
                        timestamp: formatFullDate(e.timestamp),
                    })) ?? [],
            };
        },
        enabled: Boolean(shipmentID && token),
        staleTime: 1000 * 60 * 5, // 5 minutos
    });
};
