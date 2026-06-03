"use client";

import { PageLayout } from "@/components/templates/PageLayout";
import { HomeIcon, PlusIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { SettingsBreadcrumb } from "@/components/organisms/SettingsBreadcrumb";
import { Body, BodySmall } from "@/components/atoms/Typography";
import { useState, useEffect, useCallback } from "react";

import { getAddresses, Address } from "@/services/settings/address/addresses";

export default function AddressesPage() {
  const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    } else {
      setIsLoading(false);
      setError("No estás autenticado. Por favor, inicia sesión.");
    }
  }, []);

  const fetchAddresses = useCallback(async () => {
    if (!token) {
      return;
    }
    try {
      const data = await getAddresses(token);
      setSavedAddresses(data);
      setIsLoading(false);
    } catch (err) {
      console.error("Error al obtener las direcciones:", err);
      setError("No se pudieron cargar las direcciones. Inténtalo de nuevo.");
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchAddresses();
    }
  }, [token, fetchAddresses]); // Se ejecuta cuando el token cambia

  // Mostrar estado de carga o error
  if (isLoading) {
    return (
      <PageLayout>
        <div className="pt-8 pb-4 text-center text-white">
          Cargando direcciones...
        </div>
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout>
        <div className="pt-8 pb-4 text-center text-red-500">{error}</div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="pt-8 pb-4">
        <SettingsBreadcrumb
          items={[
            { label: "Configuración", href: "/settings" },
            { label: "Direcciones" },
          ]}
          title="Direcciones"
          color="text-white"
          className="mb-8"
        />
        <div className="overflow-hidden rounded-lg bg-gray p-6">
          {savedAddresses.length === 0 ? (
            <div className="text-white text-center py-4">
              No tienes direcciones guardadas.
            </div>
          ) : (
            savedAddresses.map((address) => (
              <div
                key={address._id}
                className="mb-6 flex flex-col items-end gap-6 self-stretch"
              >
                <div className="inline-flex w-full items-start justify-between">
                  <div className="flex items-start gap-6">
                    <div className="relative h-12 w-12 overflow-hidden">
                      <HomeIcon className="absolute left-[10px] top-[9.23px] h-8 w-7 text-white" />
                    </div>
                    <div className="inline-flex flex-col items-start justify-center gap-2">
                                            <Body className="font-normal text-white">
                        {address.street} {address.externalNumber} {" "}
                        {address.internalNumber
                          ? `- Int. ${address.internalNumber}`
                          : ""}
                      </Body>
                      <BodySmall className="text-base font-normal text-white">
                        {address.neighborhood}, {address.city}, {address.state},{" "}
                        {address.country} - C.P. {address.postalCode}
                      </BodySmall>
                    </div>
                  </div>
                </div>
                <div className="h-px w-full bg-white/50" />{" "}
                {/* Horizontal line */}
              </div>
            ))
          )}
          <Link href="/settings/addresses/new-address">
            <button className="inline-flex h-11 min-h-11 items-center justify-center gap-2 rounded-[99px] bg-transparent px-4 py-2.5 text-cyan-400 hover:bg-transparent hover:text-cyan-300">
              <PlusIcon className="h-5 w-5" />
              <span className="text-base font-bold">Agregar dirección</span>
            </button>
          </Link>
        </div>
      </div>
    </PageLayout>
  );
}
