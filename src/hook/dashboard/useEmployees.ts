// hooks/useEmployees.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const API_URL = "https://ratacueva-api.onrender.com/api/users";

export type Address = {
  postalCode: string;
  street: string;
  externalNumber: string;
  internalNumber: string;
  neighborhood: string;
  city: string;
  state: string;
  country: string;
  isDefault: boolean;
};

export type Employee = {
    _id: string;
    name: string;
    lastName: string;
    secondLastName: string;
    email: string;
    phone: string;
    role: "employee";
    addresses: Address[];
};

export const useEmployees = () => {
  return useQuery<Employee[]>({
    queryKey: ["employees"],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const res = await fetch(
        "https://ratacueva-api.onrender.com/api/users/employees",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error("Error al cargar empleados");
      }

      return res.json();
    },
  });
};

export const useDeleteEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No autorizado");

      const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) throw new Error("Error al eliminar el empleado");
      return res.json();
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
  });
};
