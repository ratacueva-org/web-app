import { useQuery } from "@tanstack/react-query";

const API_URL = "https://ratacueva-api.onrender.com/api/orders";

export type Sale = {
  _id: string;
  userId: {
    name: string;
    lastName: string;
    email: string;
    phone?: string;
    _id?: string;
  };
  totalAmount: number;
  orderStatus: string;
  paymentStatus: string;
  shippingStatus: string;
  createdAt: string;
  updatedAt: string;
  paymentDetails: {
    type: string;
    transactionId: string;
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
};

export const useSales = () => {
  return useQuery<Sale[]>({
    queryKey: ["sales"],
    queryFn: async (): Promise<Sale[]> => {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No hay token disponible");

      const res = await fetch(API_URL, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Error al obtener las ventas");

      const data = await res.json();
      return data.orders; // API devuelve { orders: Sale[] }
    },
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
};
