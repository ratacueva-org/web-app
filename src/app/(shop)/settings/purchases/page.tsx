"use client";

import { useState } from "react";
import Image from "next/image";
import { PageLayout } from "@/components/templates/PageLayout";
import {
  MagnifyingGlassIcon,
  EyeIcon,
  TruckIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import { Body } from "@/components/atoms/Typography";
import { SettingsBreadcrumb } from "@/components/organisms/SettingsBreadcrumb";
import { type Order } from "@/services/settings/purchases";
import { useOrders } from "@/hook/useOrders";
import Link from "next/link";

type PurchaseGroup = {
  date: string;
  orders: Order[];
};

export default function PurchasesPage() {
  const { orders, loading, error } = useOrders();
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const groupOrdersByDate = (orders: Order[]): PurchaseGroup[] => {
    const groups: { [key: string]: Order[] } = {};

    orders.forEach((order) => {
      const date = new Date(order.createdAt);
      const dateKey = date.toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(order);
    });

    return Object.entries(groups).map(([date, orders]) => ({
      date: `Comprado el ${date}`,
      orders,
    }));
  };

  // Group orders by date
  const purchaseGroups = groupOrdersByDate(orders);

  const formatCurrency = (amount: number, currency: string = "MXN") => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const filteredGroups = purchaseGroups.filter((group) => {
    const filteredOrders = group.orders.filter((order) => {
      const matchesSearch = order.items.some((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      const matchesStatus =
        statusFilter === "all" || order.orderStatus === statusFilter;
      return matchesSearch && matchesStatus;
    });
    return filteredOrders.length > 0;
  });

  if (loading) {
    return (
      <PageLayout>
        <div className="pt-8 pb-4">
          <SettingsBreadcrumb
            items={[
              { label: "Configuración", href: "/settings" },
              { label: "Compras" },
            ]}
            title="Compras"
            color="text-white"
            className="mb-8"
          />
          <div className="text-white text-center">Cargando compras...</div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="pt-8 pb-4">
        <SettingsBreadcrumb
          items={[
            { label: "Configuración", href: "/settings" },
            { label: "Compras" },
          ]}
          title="Compras"
          color="text-white"
          className="mb-8"
        />

        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg">
            <Body className="text-red-400">{error}</Body>
          </div>
        )}

        <div className="mb-8 flex items-center gap-6">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-placeholder z-10" />
            <Input
              type="text"
              placeholder="Buscar productos..."
              className="h-11 pl-12"
              variant="searchbar" // En este que me encontré por accidente también solo era poner "searchbar"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-11 min-h-11 rounded-[99px] border border-cyan-400 px-4 pr-10 py-2.5 font-bold text-cyan-400 hover:bg-cyan-400/10 bg-transparent appearance-none cursor-pointer [&>option]:bg-gray [&>option]:text-white"
            >
              <option value="all">Todas</option>
              <option value="pending">Pendientes</option>
              <option value="processing">Procesando</option>
              <option value="shipped">Enviadas</option>
              <option value="delivered">Entregadas</option>
              <option value="cancelled">Canceladas</option>
              <option value="refunded">Reembolsadas</option>
            </select>
            <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-cyan-400 pointer-events-none" />
          </div>
        </div>

        <div className="space-y-8">
          {filteredGroups.length === 0 ? (
            <div className="text-center py-12">
              <TruckIcon className="w-16 h-16 text-zinc-600 mx-auto mb-4" />
              <Body className="text-white mb-2">No tienes compras</Body>
              <Body className="text-zinc-400">
                Realiza tu primera compra para ver tu historial aquí
              </Body>
            </div>
          ) : (
            filteredGroups.map((group) => (
              <div
                key={group.date}
                className="overflow-hidden rounded-lg bg-gray p-6"
              >
                <Body className="mb-6 text-white font-bold">{group.date}</Body>
                <div className="h-px w-full bg-white" />
                <div className="mt-6 space-y-6">
                  {group.orders.map((order) => (
                    <div key={order._id} className="flex items-center gap-6">
                      <div className="flex flex-col gap-2">
                        {order.items.slice(0, 2).map((item, index) => (
                          <Image
                            key={index}
                            className="h-20 w-20 flex-shrink-0 rounded-md object-cover"
                            src={item.imageUrl || "/placeholder.svg"}
                            alt={item.name}
                            width={80}
                            height={80}
                          />
                        ))}
                        {order.items.length > 2 && (
                          <div className="h-20 w-20 flex-shrink-0 rounded-md bg-zinc-700 flex items-center justify-center">
                            <Body className="text-white text-xs">
                              +{order.items.length - 2}
                            </Body>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-1 items-center gap-12">
                        <div className="flex flex-1 flex-col items-start gap-4">
                          <div className="flex flex-col items-start gap-2">
                            <Body className="text-white font-bold">
                              {order.items.length}{" "}
                              {order.items.length === 1
                                ? "producto"
                                : "productos"}
                            </Body>
                            <Body className="text-white font-medium">
                              Subtotal:{" "}
                              {formatCurrency(order.subtotal, order.currency)}
                            </Body>
                            <Body className="text-zinc-400 text-sm">
                              Total:{" "}
                              {formatCurrency(
                                order.totalAmount,
                                order.currency
                              )}
                            </Body>
                            <Body className="text-zinc-400 text-sm">
                              Pedido #{order._id.slice(-8)}
                            </Body>
                            {order.estimatedDeliveryDate && (
                              <Body className="text-zinc-400 text-sm">
                                Entrega estimada:{" "}
                                {formatDate(
                                  order.estimatedDeliveryDate?.toString() || ""
                                )}
                              </Body>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-col items-start">
                          <Link href={`/settings/purchases/${order._id}`}>
                            <Button className="min-w-[160px]">
                              <EyeIcon className="w-5 h-5 mr-2" />
                              Ver compra
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </PageLayout>
  );
}
