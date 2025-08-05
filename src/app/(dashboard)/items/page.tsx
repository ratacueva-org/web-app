"use client";

import React, { useState, useEffect } from "react";
import Button from "@/components/atoms/Button";
import { Body, Heading } from "@/components/atoms/Typography";
import Input from "@/components/atoms/Input";
import StatusTag, { getStockStatus } from "@/components/features/dashboard/atoms/StatusTag";
import {
    PencilSquareIcon,
    TrashIcon,
    MagnifyingGlassIcon,
} from "@heroicons/react/24/solid";
import DashboardContentLayout from "@/components/features/dashboard/templates/DashboardContentLayout";
import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";
import { useProducts } from "@/hook/dashboard/UseProduct";
import { BaseTable } from "@/components/features/dashboard/atoms/BaseTable";
import Dropdown from "@/components/atoms/Dropdown";

export default function Items() {
    const { data: products, isLoading, error } = useProducts();

    const handlePrev = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    useEffect(() => {
        setCurrentPage(1); // resetear página al filtrar
    }, [searchTerm, itemsPerPage]);

    const filteredProducts = products?.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) ?? [];

    const totalRecords = filteredProducts.length;
    const totalPages = Math.ceil(totalRecords / itemsPerPage);
    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalRecords);

    const paginatedProducts = filteredProducts.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const columns: ColumnDef<any>[] = [
        {
            accessorKey: "name",
            header: "PRODUCT NAME",
            cell: info => (
                <Link
                    href={`/items/${info.row.original.id || info.row.index}`}
                    className="text-text underline hover:no-underline transition-all"
                >
                    <Body className="text-current">{String(info.getValue())}</Body>
                </Link>
            ),
        },
        {
            accessorKey: "category",
            header: "CATEGORY",
            cell: info => <Body className="text-text">{String(info.getValue())}</Body>,
        },
        {
            accessorKey: "stock",
            header: "STOCK/KEYS",
            cell: info => {
                const stock = info.getValue() as number;
                const status = getStockStatus(stock);
                return <StatusTag status={status}>{stock}</StatusTag>;
            },
        },
        {
            accessorKey: "price",
            header: "PRICE",
            cell: info => <Body className="text-text">{String(info.getValue())}</Body>,
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
    ];

    return (
        <DashboardContentLayout>
            <div className="flex justify-between items-center pb-3">
                <Heading>Administrar productos</Heading>
                <Link href="/items/add">
                    <Button
                        variant="success"
                        className="px-4 py-2.5 rounded-full font-bold text-body flex items-center gap-2"
                    >
                        Agregar producto
                    </Button>
                </Link>
            </div>

            <div className="flex flex-col gap-6">
                <div className="flex justify-between items-center">
                    {/* Entradas por página */}
                    <div className="flex items-center py-1">
                        <Dropdown
                            value={itemsPerPage}
                            onChange={(val) => setItemsPerPage(val)}
                            className="w-[100px]"/>
                        <Body className="text-text p-2">entradas por página</Body>
                    </div>

                    {/* Buscador */}
                    <div className="w-[341px] relative">
                        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-placeholder pointer-events-none" />
                        <Input
                            variant="searchbar"
                            type="text"
                            placeholder="Buscar producto..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </div>

                {/* Tabla */}
                {isLoading ? (
                    <p className="text-placeholder">Cargando productos...</p>
                ) : error ? (
                    <p className="text-danger">Error al cargar productos</p>
                ) : (
                    <BaseTable data={paginatedProducts} columns={columns} />
                )}

                {/* Footer de paginación */}
                <div className="flex justify-between items-center flex-wrap gap-6">
                    <Body className="text-text">
                        Mostrando {startItem} - {endItem} de {totalRecords} registros
                    </Body>

                    <div className="flex items-center gap-1">
                        {["«", "‹", ...Array.from({ length: totalPages }, (_, i) => i + 1), "›", "»"].map(
                            (label, i) => (
                                <Button
                                    key={i}
                                    variant="pagination"
                                    onClick={() => {
                                        if (label === "«") setCurrentPage(1);
                                        else if (label === "‹") handlePrev();
                                        else if (label === "›") handleNext();
                                        else if (label === "»") setCurrentPage(totalPages);
                                        else if (typeof label === "number") setCurrentPage(label);
                                    }}
                                    className={currentPage === label ? "bg-gray" : ""}
                                >
                                    {label}
                                </Button>
                            )
                        )}
                    </div>
                </div>
            </div>
        </DashboardContentLayout>
    );
}
