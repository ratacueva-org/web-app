// hooks/useProducts.ts
import { useQuery } from "@tanstack/react-query";

const API_URL = "https://ratacueva-api.onrender.com/api/products";

export type Item = {
    _id: string;
    name: string;
    category: string;
    stock: number;
    price: number;
};

export type { Product };

export const useProducts = () => {
    return useQuery<Item[]>({
        queryKey: ["products"],
        queryFn: async () => {
            const res = await fetch(API_URL);
            if (!res.ok) throw new Error("Error al obtener productos");
            return res.json(); // aquí retorna arreglo de productos
        },
        staleTime: 1000 * 60 * 5,
    });
};
