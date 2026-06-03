import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

export interface PaymentMethod {
  _id: string;
  type: string;
  last4: string;
  provider: string;
  expiration: string;
}

export const getPaymentMethods = async (token: string): Promise<PaymentMethod[]> => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };

    const response = await axios.get(`${API_URL}/users/payment-methods`, config);
    
    return response.data;

  } catch (error) {
    console.error("Error en paymentService.getPaymentMethods:", error);
    throw error;
  }
};