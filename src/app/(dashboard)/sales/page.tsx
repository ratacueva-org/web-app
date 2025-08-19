"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Body, Heading } from "@/components/atoms/Typography";
import Input from "@/components/atoms/Input";
import Dropdown from "@/components/atoms/Dropdown";
import { BaseTable } from "@/components/features/dashboard/atoms/BaseTable";
import StatusTag, { mapOrderStatusToStatusType } from "@/components/features/dashboard/atoms/StatusTag";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import DashboardContentLayout from "@/components/features/dashboard/templates/DashboardContentLayout";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { Sale, useSales } from "@/hook/dashboard/sales/useSales";
import Pagination from "@/components/atoms/Pagination";
import DataLoader from "@/components/features/dashboard/molecules/DataLoader";

const paymentMethodLabels: Record<string, string> = {
    credit_card: "Tarjeta de crédito o débito",
    debit_card: "Tarjeta de crédito o débito",
    paypal: "Paypal",
    oxxo_cash: "Oxxo",
    cash: "Efectivo",
};

export default function Sales() {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState("");

    const { data: sales = [], isLoading, error } = useSales();

    // Resetear página al cambiar búsqueda o itemsPerPage
    useEffect(() => setCurrentPage(1), [searchTerm, itemsPerPage]);

    const normalizedTerm = searchTerm.trim().toLowerCase();

    const filteredSales = useMemo(() => {
        return sales.filter(({ _id = "", userId, shippingAddress, totalAmount, paymentDetails }) => {
            const customerName = `${userId?.name ?? ""} ${userId?.lastName ?? ""}`.toLowerCase();
            const city = shippingAddress?.city?.toLowerCase() ?? "";
            const price = String(totalAmount ?? "");
            const payMethod = paymentDetails?.type?.toLowerCase() ?? "";

            return (
                _id.toLowerCase().includes(normalizedTerm) ||
                customerName.includes(normalizedTerm) ||
                city.includes(normalizedTerm) ||
                price.includes(normalizedTerm) ||
                payMethod.includes(normalizedTerm)
            );
        });
    }, [sales, normalizedTerm]);

    const totalRecords = filteredSales.length;
    const totalPages = Math.ceil(totalRecords / itemsPerPage);
    const startItem = totalRecords === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalRecords);

    const salesData = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredSales.slice(start, start + itemsPerPage);
    }, [filteredSales, currentPage, itemsPerPage]);

    const columns: ColumnDef<Sale>[] = useMemo(() => [
        {
            accessorKey: "_id",
            header: "SALE ID",
            cell: info => (
                <Link href={`/sales/${info.getValue()}`} className="text-text underline hover:no-underline transition-all">
                    <Body className="truncate max-w-[120px]">{String(info.getValue() || "")}</Body>
                </Link>
            ),
        },
        {
            id: "customerName",
            header: "CUSTOMER NAME",
            cell: info => {
                const sale = info.row.original;
                return (
                    <Body className="truncate max-w-[120px]">
                        {sale.userId ? `${sale.userId.name} ${sale.userId.lastName}` : ""}
                    </Body>
                );
            },
        },
        {
            accessorKey: "shippingAddress.city",
            header: "SHIPPING CITY",
            cell: info => <Body className="truncate max-w-[120px]">{String(info.getValue() || "")}</Body>,

        },
        {
            accessorKey: "totalAmount",
            header: "TOTAL PRICE",
            cell: info => <Body className="truncate max-w-[120px]">$    {String(info.getValue() || "")} MXN</Body>,
        },
        {
            accessorKey: "orderStatus",
            header: "STATUS",
            cell: info => <StatusTag status={mapOrderStatusToStatusType(info.getValue() as string)} />,
        },
        {
            accessorKey: "paymentDetails.type",
            header: "PAY METHOD",
            cell: info => <Body className="truncate max-w-[120px]">{paymentMethodLabels[info.getValue() as string] ?? info.getValue()}</Body>,
        },
    ], []);

    return (
        <DashboardContentLayout>
            <div className="flex justify-between items-center pb-3">
                <Heading>Administrar ventas</Heading>
            </div>

            <div className="flex flex-col gap-6">
                {/* Top controls */}
                <div className="flex justify-between items-center flex-wrap gap-6">
                    <div className="flex items-center gap-4">
                        <Dropdown
                            value={itemsPerPage}
                            onChange={setItemsPerPage}
                            className="w-[100px]"
                        />                        <Body className="whitespace-nowrap">entradas por página</Body>
                    </div>
                    <div className="w-[341px] relative min-w-[240px]">
                        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-6 h-6 text-placeholder pointer-events-none" />
                        <Input
                            variant="searchbar"
                            type="text"
                            placeholder="Buscar venta..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="pl-12"
                        />
                    </div>
                </div>

                {/* Tabla */}
                <DataLoader isLoading={isLoading} error={error}>
                    <BaseTable
                        data={salesData}
                        columns={columns}
                        isLoading={isLoading}
                        maxHeight="h-[500px]"/>
                </DataLoader>
                {/* Footer paginación */}
                <div className="flex justify-between items-center flex-wrap gap-6">
                    <Body>
                        Mostrando {startItem} - {endItem} de {totalRecords} registros
                    </Body>
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                </div>
            </div>
        </DashboardContentLayout>
    );
}
