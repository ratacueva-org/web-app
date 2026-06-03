import axios from "axios";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

export interface Address {
  _id: string;
  postalCode: string;
  street: string;
  externalNumber: string;
  internalNumber?: string;
  neighborhood: string;
  city: string;
  state: string;
  country: string;
  isDefault: boolean;
}

export interface CreateAddressPayload {
  postalCode: string;
  street: string;
  externalNumber: string;
  internalNumber?: string;
  neighborhood: string;
  city: string;
  state: string;
  country: string;
  isDefault: boolean;
}

export interface UpdateAddressPayload {
  postalCode?: string;
  street?: string;
  externalNumber?: string;
  internalNumber?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  country?: string;
  isDefault?: boolean;
}

export const getAddresses = async (token: string): Promise<Address[]> => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await axios.get(`${API_URL}/users/addresses`, config);
    return response.data;
  } catch (error) {
    console.error("Error en addressService.getAddresses:", error);
    throw error;
  }
};

export const createAddress = async (
  token: string,
  addressData: CreateAddressPayload
): Promise<Address> => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };

    const response = await axios.post(
      `${API_URL}/users/addresses`,
      addressData,
      config
    );
    return response.data;
  } catch (error) {
    console.error("Error en addressService.createAddress:", error);
    throw error;
  }
};

export const updateAddress = async (
  token: string,
  addressId: string,
  addressData: UpdateAddressPayload
): Promise<Address> => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };

    const response = await axios.put(
      `${API_URL}/users/addresses/${addressId}`,
      addressData,
      config
    );
    return response.data;
  } catch (error) {
    console.error("Error en addressService.updateAddress:", error);
    throw error;
  }
};
