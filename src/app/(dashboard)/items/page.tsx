// src/app/dashboard/items/page.tsx
"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Button from "@/components/atoms/Button";
import { Body, Heading } from "@/components/atoms/Typography";
import Input from "@/components/atoms/Input";
import Dropdown from "@/components/atoms/Dropdown";
import StatusTag, { getStockStatus } from "@/components/features/dashboard/atoms/StatusTag";
import { PencilSquareIcon, TrashIcon, MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import DashboardContentLayout from "@/components/features/dashboard/templates/DashboardContentLayout";
import { ColumnDef } from "@tanstack/react-table";
import { Item, useProducts } from "@/hook/dashboard/useProduct";
import { BaseTable } from "@/components/features/dashboard/atoms/BaseTable";
import Pagination from "@/components/atoms/Pagination";

export default function Items() {
    const { data: products = [], isLoading, error } = useProducts();
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const term = searchTerm.toLowerCase().trim();
    const filtered = useMemo(() => products.filter(p =>
        p.name.toLowerCase().includes(term)
    ), [products, term]);

    const itemData = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filtered.slice(start, start + itemsPerPage);
    }, [filtered, currentPage, itemsPerPage]);

    const totalRecords = filtered.length;
    const totalPages = Math.ceil(totalRecords / itemsPerPage);
    const startItem = totalRecords === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalRecords);

    // Cuando cambie búsqueda o itemsPerPage, resetear página
    useEffect(() => setCurrentPage(1), [searchTerm, itemsPerPage]);

    const columns: ColumnDef<Item>[] = useMemo(() => [
        {
            accessorKey: "name",
            header: "PRODUCT NAME",
            cell: info => (
                <Link
                    href={`/items/${info.row.original._id}`}
                    className="text-text underline hover:no-underline transition-all"
                >
                    <Body>{info.getValue<string>()}</Body>
                </Link>
            ),
        },
        {
            accessorKey: "category",
            header: "CATEGORY",
            cell: info => <Body>{info.getValue<string>()}</Body>,
        },
        {
            accessorKey: "stock",
            header: "STOCK/KEYS",
            cell: info => {
                const stock = info.getValue<number>();
                return <StatusTag status={getStockStatus(stock)}>{stock}</StatusTag>;
            },
        },
        {
            accessorKey: "price",
            header: "PRICE",
            cell: info => <Body>{info.getValue<number>()}</Body>,
        },
        {
            id: "actions",
            header: "ACTIONS",
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <Button variant="icon">
                        <PencilSquareIcon className="w-6 h-6 text-warning" />
                    </Button>
                    <Button variant="icon">
                        <TrashIcon className="w-6 h-6 text-danger" />
                    </Button>
                </div>
            ),
        },
    ], []);

    return (
        <DashboardContentLayout>
            <div className="flex justify-between items-center pb-3">
                <Heading>Administrar productos</Heading>
                <Link href="/items/add">
                    <Button
                        variant="success"
                        className="px-4 py-2.5 rounded-full font-bold text-body flex items-center gap-2">
                        Agregar producto
                    </Button>
                </Link>
            </div>

            <div className="flex flex-col gap-6">
                {/* Top controls */}
                <div className="flex justify-between items-center">
                    <div className="flex items-center py-1">
                        <Dropdown
                            value={itemsPerPage}
                            onChange={setItemsPerPage}
                            className="w-[100px]"
                        />
                        <Body className="text-text p-2">entradas por página</Body>
                    </div>
                    <div className="w-[341px] relative">
                        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-placeholder pointer-events-none" />
                        <Input
                            variant="searchbar"
                            type="text"
                            placeholder="Buscar producto..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </div>

                {/* Tabla */}
                    <BaseTable
                        data={itemData}
                        columns={columns}
                        isLoading={isLoading}/>

                {/* Footer de paginación */}
                <div className="flex justify-between items-center flex-wrap gap-6">
                    <Body className="text-text">
                        Mostrando {startItem} - {endItem} de {totalRecords} registros
                    </Body>
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage} />
                </div>
            </div>
        </DashboardContentLayout>
    );
}
