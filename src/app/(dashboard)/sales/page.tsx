"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Body, Heading } from "@/components/atoms/Typography";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import { BaseTable } from "@/components/features/dashboard/atoms/BaseTable";
import StatusTag, { mapOrderStatusToStatusType } from "@/components/features/dashboard/atoms/StatusTag";
import {
    MagnifyingGlassIcon,
} from "@heroicons/react/24/solid";
import DashboardContentLayout from "@/components/features/dashboard/templates/DashboardContentLayout";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { Sale, useSales } from "@/hook/dashboard/useSales";
import Dropdown from "@/components/atoms/Dropdown";

export default function Sales() {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState("");

    const { data: sales, isLoading, error } = useSales();

    // Resetear página cuando cambian filtros o itemsPerPage
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, itemsPerPage]);

  const filteredSales = useMemo(() => {
    if (!sales) return [];

    const term = searchTerm.toLowerCase();

    return sales.filter((sale) => {
      const id = sale._id ?? "";
      const customerName = `${sale.userId?.name ?? ""} ${
        sale.userId?.lastName ?? ""
      }`;
      const shippingCity = sale.shippingAddress?.city ?? "";
      const totalPrice = String(sale.totalAmount ?? "");
      const payMethod = sale.paymentDetails?.type ?? "";

            return (
                id.toLowerCase().includes(term) ||
                customerName.toLowerCase().includes(term) ||
                shippingCity.toLowerCase().includes(term) ||
                totalPrice.toLowerCase().includes(term) ||
                payMethod.toLowerCase().includes(term)
            );
        });
    }, [sales, searchTerm]);

    const totalRecords = filteredSales.length;
    const totalPages = Math.ceil(totalRecords / itemsPerPage);
    const startItem = totalRecords === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalRecords);

    const paginatedSales = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredSales.slice(startIndex, endIndex);
    }, [filteredSales, currentPage, itemsPerPage]);

    const paymentMethodLabels: Record<string, string> = {
        credit_card: "Tarjeta de crédito o débito",
        debit_card: "Tarjeta de crédito o débito",
        paypal: "Paypal",
        oxxo_cash: "Oxxo",
        cash: "Efectivo",
    };

    const columns: ColumnDef<Sale>[] = [
        {
            accessorKey: "_id",
            header: "SALE ID",
            size: 122,
            cell: info => (
                <Link href={`/sales/${info.getValue()}`} className="text-text underline hover:no-underline transition-all">
                    <Body className="text-current truncate max-w-[120px]">{String(info.getValue())}</Body>
                </Link>
            ),
        },
        {
            id: "customerName",
            header: "CUSTOMER NAME",
            size: 122,
            cell: info => {
                const sale = info.row.original;
                return (
                    <Body className="text-text truncate max-w-[120px]">
                        {sale.userId ? `${sale.userId.name} ${sale.userId.lastName}` : ""}
                    </Body>
                );
            }
        },
        {
            accessorKey: "shippingAddress.city",
            header: "SHIPPING CITY",
            size: 122,
            cell: info => (
                <Body className="text-text truncate max-w-[120px]">{String(info.getValue() || "")}</Body>
            ),
        },
        {
            accessorKey: "totalAmount",
            header: "TOTAL PRICE",
            size: 122,
            cell: info => (
                <Body className="text-text truncate max-w-[120px]">{String(info.getValue())}</Body>
            ),
        },
        {
            accessorKey: "orderStatus",
            header: "STATUS",
            size: 122,
            cell: info => {
                const rawStatus = info.getValue() as string;
                const status = mapOrderStatusToStatusType(rawStatus);
                return <StatusTag status={status} />;
            }
        },
        {
            accessorKey: "paymentDetails.type",
            header: "PAY METHOD",
            size: 122,
            cell: (info) => {
                const method = info.getValue() as string;
                const label = paymentMethodLabels[method] ?? method;
                return <Body className="text-text truncate max-w-[120px]">{label}</Body>;
            },
        },
    ];

    const generatePaginationItems = () => {
        const items: (string | number)[] = ["«", "‹"];

        if (totalPages <= 6) {
            for (let i = 1; i <= totalPages; i++) {
                items.push(i);
            }
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) items.push(i);
                items.push("...");
                items.push(totalPages);
            } else if (currentPage >= totalPages - 2) {
                items.push(1);
                items.push("...");
                for (let i = totalPages - 3; i <= totalPages; i++) items.push(i);
            } else {
                items.push(1);
                items.push("...");
                for (let i = currentPage - 1; i <= currentPage + 1; i++) items.push(i);
                items.push("...");
                items.push(totalPages);
            }
        }

        items.push("›", "»");
        return items;
    };

    // Opciones para dropdown entradas por página
    const pageSizeOptions = [
        { label: "5", value: 5 },
        { label: "10", value: 10 },
        { label: "20", value: 20 },
        { label: "50", value: 50 },
    ];

  return (
    <DashboardContentLayout>
      <div className="flex justify-between items-center pb-3">
        <Heading>Administrar ventas</Heading>
      </div>

            <div className="flex flex-col gap-6">
                <div className="flex justify-between items-center flex-wrap gap-6">
                    {/* Entradas por página */}
                    <div className="flex items-center gap-4">
                        <Dropdown
                            value={itemsPerPage}
                            onChange={setItemsPerPage}
                            options={pageSizeOptions}
                            className="w-[100px]"
                        />
                        <Body className="text-text whitespace-nowrap">entradas por página</Body>
                    </div>

                    {/* Buscador */}
                    <div className="w-[341px] relative min-w-[240px]">
                        <MagnifyingGlassIcon
                            className="absolute left-3 top-1/2 -translate-y-1/2 w-6 h-6 text-placeholder pointer-events-none"
                        />
                        <Input
                            variant="searchbar"
                            type="text"
                            placeholder="Buscar venta..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-12"
                        />
                    </div>
                </div>

                {/* Tabla o estados */}
                {isLoading ? (
                    <p className="text-placeholder">Cargando ventas...</p>
                ) : error ? (
                    <p className="text-danger">Error al cargar las ventas</p>
                ) : (
                    <BaseTable data={paginatedSales} columns={columns} />
                )}

                {/* Footer paginación */}
                <div className="flex justify-between items-center flex-wrap gap-6">
                    <Body className="text-text">
                        Mostrando {startItem} - {endItem} de {totalRecords} registros
                    </Body>

          <div className="flex items-center gap-1">
            {generatePaginationItems().map((label, i) => (
              <Button
                key={i}
                variant="pagination"
                onClick={() => {
                  if (label === "«") setCurrentPage(1);
                  else if (label === "‹" && currentPage > 1)
                    setCurrentPage(currentPage - 1);
                  else if (label === "›" && currentPage < totalPages)
                    setCurrentPage(currentPage + 1);
                  else if (label === "»") setCurrentPage(totalPages);
                  else if (typeof label === "number") setCurrentPage(label);
                }}
                disabled={
                  (label === "«" && currentPage === 1) ||
                  (label === "‹" && currentPage === 1) ||
                  (label === "›" && currentPage === totalPages) ||
                  (label === "»" && currentPage === totalPages) ||
                  label === "..."
                }
                className={`${currentPage === label ? "bg-gray" : ""} ${
                  label === "..." ? "cursor-default" : ""
                }`}
              >
                {label}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </DashboardContentLayout>
  );
}
