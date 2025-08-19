// hooks/useShipments.ts
import { useQuery } from "@tanstack/react-query";
import { mapStatusToStatusType } from "@/components/features/dashboard/atoms/StatusTag";

const API_URL = "https://ratacueva-api.onrender.com/api/shipping";

export interface Shipment {
    id: string;
    trackingNumber: string;
    carrier: string;
    destination: string;
    status: "completed" | "pending" | "processing" | "cancelled";
    createdAt: string;
}

interface ShipmentApiResponse {
    message: string;
    data: Array<{
        _id: string;
        trackingNumber: string;
        shippingProvider: string;
        shippingAddress: {
            city: string;
            state: string;
            country?: string;
        };
        currentStatus: string;
        createdAt: string;
    }>;
    meta: unknown;
}

export const useShipments = () => {
    return useQuery<Shipment[]>({
        queryKey: ["shipments"],
        queryFn: async () => {
            const token = localStorage.getItem("token");
            const res = await fetch(API_URL, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!res.ok) throw new Error("Error al cargar envíos");

            const response: ShipmentApiResponse = await res.json();

            return response.data.map((item) => ({
                id: item._id,
                trackingNumber: item.trackingNumber,
                carrier: item.shippingProvider,
                destination:
                    item.shippingAddress?.city && item.shippingAddress?.state
                        ? `${item.shippingAddress.city}, ${item.shippingAddress.state}`
                        : "Desconocido",
                status: mapStatusToStatusType(item.currentStatus),
                createdAt: new Date(item.createdAt).toLocaleDateString("es-MX"),
            }));
        },
    });
};
