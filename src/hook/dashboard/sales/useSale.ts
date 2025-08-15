import { useQuery } from "@tanstack/react-query";

const API_URL = "https://ratacueva-api.onrender.com/api/orders";

export type SaleDetail = {
    _id: string;
    userId: {
        name: string;
        lastName: string;
        email: string;
        phone?: string;
        _id?: string;
    };
    shippingAddress: {
        postalCode: string;
        street: string;
        externalNumber: string;
        internalNumber?: string;
        neighborhood: string;
        city: string;
        state?: string;
        country?: string;
        isDefault?: boolean;
    };
    billingAddress: {
        postalCode: string;
        street: string;
        externalNumber: string;
        internalNumber?: string;
        neighborhood: string;
        city: string;
        state?: string;
        country?: string;
        isDefault?: boolean;
    };
    paymentDetails: {
        type: string;
        transactionId: string;
    };
    items: {
        productId: string;
        name: string;
        priceAtAddition: number;
        quantity: number;
        discountPercentageApplied: number;
        imageUrl: string;
        _id: string;
    }[];
    totalAmount: number;
    subtotal: number;
    taxAmount: number;
    discountAmount: number;
    shippingCost: number;
    notes?: string;
    orderStatus: string;
    paymentStatus: string;
    shippingStatus: string;
    createdAt: string;
    updatedAt: string;
    cancelledAt?: string;
};

export const useSale = (saleID: string) => {
    return useQuery<{ message: string; order: SaleDetail }>({
        queryKey: ["sale", saleID],
        queryFn: async () => {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("No hay token disponible");

            const res = await fetch(`${API_URL}/${saleID}`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) throw new Error("Error al obtener la venta");

            return res.json(); // API devuelve { message: string, order: SaleDetail }
        },
        enabled: !!saleID,
    });
};
