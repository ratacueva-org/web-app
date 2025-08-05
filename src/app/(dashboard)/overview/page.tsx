"use client";

import React from "react";
import Button from "@/components/atoms/Button";
import DashboardContentLayout from "@/components/features/dashboard/templates/DashboardContentLayout";
import { BaseTable } from "@/components/features/dashboard/atoms/BaseTable";
import StatusTag from "@/components/features/dashboard/atoms/StatusTag";
import {
  PlusCircleIcon,
  TruckIcon,
  DocumentChartBarIcon,
  PercentBadgeIcon,
} from "@heroicons/react/24/solid";
import { Body, Heading } from "@/components/atoms/Typography";

const metricsData = [
  {
    title: "Ventas totales",
    value: "$98,450",
    change: "↑ 8.2% vs mes anterior",
    isPositive: true,
  },
  {
    title: "Órdenes este mes",
    value: "1,245",
    change: "↑ 5.6% vs mes anterior",
    isPositive: true,
  },
  {
    title: "Clientes activos",
    value: "3,210",
    change: "↑ 2.1% vs mes anterior",
    isPositive: true,
  },
  {
    title: "Envíos pendientes",
    value: "32",
    change: "↓ 4.7% vs mes anterior",
    isPositive: false,
  },
  {
    title: "Solicitudes de reembolso",
    value: "7",
    change: "↓ 1.3% vs mes anterior",
    isPositive: false,
  },
];

// --- RecentOrders ---
interface Order {
  id: string;
  customer: string;
  products: string;
  total: string;
  status: "completed" | "pending" | "processing" | "cancelled";
  date: string;
}

const ordersData: Order[] = [
  {
    id: "#GM10234",
    customer: "Carlos Méndez",
    products: "RTX 4090, Corsair 32GB RAM",
    total: "$2,350.00",
    status: "completed",
    date: "2025-08-01",
  },
  {
    id: "#GM10235",
    customer: "Lucía Torres",
    products: "Teclado Logitech G Pro X",
    total: "$129.99",
    status: "pending",
    date: "2025-08-02",
  },
  {
    id: "#GM10236",
    customer: "Miguel Ángel",
    products: "PlayStation 5, Elden Ring",
    total: "$699.00",
    status: "processing",
    date: "2025-08-03",
  },
  {
    id: "#GM10237",
    customer: "Sofía Rivas",
    products: "Audífonos HyperX Cloud II",
    total: "$89.99",
    status: "cancelled",
    date: "2025-08-03",
  },
];

// --- TopSellingProducts ---
interface Product {
  name: string;
  description: string;
  unitsSold: string;
}

const topProducts: Product[] = [
  {
    name: "NVIDIA RTX 4090",
    description: "Tarjeta gráfica insignia para gaming extremo.",
    unitsSold: "42 unidades vendidas",
  },
  {
    name: "PlayStation 5",
    description: "Consola de nueva generación de Sony, edición con disco.",
    unitsSold: "67 unidades vendidas",
  },
  {
    name: "Teclado Logitech G Pro X",
    description: "Teclado mecánico para esports.",
    unitsSold: "120 unidades vendidas",
  },
  {
    name: "Elden Ring (PC)",
    description: "RPG de acción galardonado.",
    unitsSold: "180 claves vendidas",
  },
  {
    name: "Audífonos HyperX Cloud II",
    description: "Audífonos gamer populares con sonido envolvente.",
    unitsSold: "95 unidades vendidas",
  },
];

export default function Overview() {
  const getMetricIcon = (index: number) => {
    const icons = [
      DocumentChartBarIcon,
      PlusCircleIcon,
      PercentBadgeIcon,
      TruckIcon,
      PercentBadgeIcon,
    ];
    return icons[index];
  };

  return (
    <DashboardContentLayout>
      <Heading>Vista general</Heading>

      {/* Sales Metrics Grid - Row 1: 3 cards */}
      <div className="grid grid-cols-3 gap-8">
        {metricsData.slice(0, 3).map((metric, index) => {
          const IconComponent = getMetricIcon(index);
          return (
            <div
              key={index}
              className="flex flex-col gap-6 p-6 rounded-lg bg-gray"
            >
              <div className="flex items-center gap-2">
                <IconComponent className="w-5 h-5" />
                <Body>{metric.title}</Body>
              </div>
              <Heading>{metric.value}</Heading>
              <Body
                className={metric.isPositive ? "text-success" : "text-danger"}
              >
                {metric.change}
              </Body>
            </div>
          );
        })}
      </div>

      {/* Sales Metrics Grid - Row 2: 2 cards */}
      <div className="grid grid-cols-2 gap-8">
        {metricsData.slice(3, 5).map((metric, index) => {
          const IconComponent = getMetricIcon(index + 3);
          return (
            <div
              key={index + 3}
              className="flex flex-col gap-6 p-6 rounded-lg bg-gray"
            >
              <div className="flex items-center gap-2">
                <IconComponent className="w-5 h-5" />
                <Body>{metric.title}</Body>
              </div>
              <Heading>{metric.value}</Heading>
              <Body
                className={metric.isPositive ? "text-success" : "text-danger"}
              >
                {metric.change}
              </Body>
            </div>
          );
        })}
      </div>

      {/* Pedidos recientes */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <Heading>Pedidos recientes</Heading>
          <Button
            variant="outlineSecondary"
            className="min-h-11 rounded-[99px]"
          >
            Ver todo
          </Button>
        </div>
        <BaseTable
          data={ordersData}
          columns={[
            {
              accessorKey: "id",
              header: "ORDER ID",
              cell: (info) => (
                <div className="text-text text-base font-normal">
                  {String(info.getValue())}
                </div>
              ),
            },
            {
              accessorKey: "customer",
              header: "CUSTOMER",
              cell: (info) => (
                <div className="text-text text-base font-normal">
                  {String(info.getValue())}
                </div>
              ),
            },
            {
              accessorKey: "products",
              header: "PRODUCTS",
              cell: (info) => (
                <div className="text-text text-base font-normal">
                  {String(info.getValue())}
                </div>
              ),
            },
            {
              accessorKey: "total",
              header: "TOTAL",
              cell: (info) => (
                <div className="text-text text-base font-normal">
                  {String(info.getValue())}
                </div>
              ),
            },
            {
              accessorKey: "status",
              header: "STATUS",
              cell: (info) => (
                <StatusTag
                  status={
                    info.getValue() as
                      | "completed"
                      | "pending"
                      | "processing"
                      | "cancelled"
                  }
                />
              ),
            },
            {
              accessorKey: "date",
              header: "DATE",
              cell: (info) => (
                <div className="text-text text-base font-normal">
                  {String(info.getValue())}
                </div>
              ),
            },
          ]}
        />
      </div>

      {/* Chart Section */}
      <div>
        <Heading>Rendimiento de ventas a lo largo del tiempo</Heading>
        <div className="h-[331px] p-6 rounded-lg bg-gray mt-6"></div>
      </div>

      {/* Top Selling Products - Full Width */}
      <div className="p-6 rounded-lg bg-gray">
        <Heading className="mb-6">Productos más vendidos</Heading>
        <div className="flex flex-col">
          {topProducts.map((product, index) => (
            <div
              key={index}
              className="flex gap-4 p-4 border-t border-dark first:border-t-0"
            >
              <div className="flex flex-col gap-2 flex-1">
                <h4 className="text-text text-base font-bold">
                  {product.name}
                </h4>
                <p className="text-text text-base">{product.description}</p>
              </div>
              <div className="text-text text-right text-base font-bold min-w-fit">
                {product.unitsSold}
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardContentLayout>
  );
}
