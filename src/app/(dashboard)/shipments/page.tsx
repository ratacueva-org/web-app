"use client";

import React, { useState, useEffect } from "react";
import Button from "@/components/atoms/Button";
import { Body, Heading } from "@/components/atoms/Typography";
import Input from "@/components/atoms/Input";
import { BaseTable } from "@/components/features/dashboard/atoms/BaseTable";
import StatusTag from "@/components/features/dashboard/atoms/StatusTag";
import {
    MagnifyingGlassIcon,
} from "@heroicons/react/24/solid";
import DashboardContentLayout from "@/components/features/dashboard/templates/DashboardContentLayout";
import { ColumnDef } from "@tanstack/react-table";
import { useShipments } from "@/hook/dashboard/useShipments";
import Link from "next/link";
import Dropdown from "@/components/atoms/Dropdown";

interface Shipment {
  id: string;
  trackingNumber: string;
  carrier: string;
  destination: string;
  status: "completed" | "pending" | "processing" | "cancelled";
  createdAt: string;
}

export default function Shipments() {
    const { data: shipments = [], isLoading, error } = useShipments();

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        setCurrentPage(1); // resetear página cuando cambian filtros o paginación
    }, [searchTerm, itemsPerPage]);

  // Filtrado local (puedes hacerlo en backend luego)
  const filteredShipments = shipments.filter(
    (shipment) =>
      shipment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.trackingNumber
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      shipment.carrier.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.destination.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalRecords = filteredShipments.length;
  const totalPages = Math.ceil(totalRecords / itemsPerPage);
  const startItem =
    totalRecords === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalRecords);

  const paginatedShipments = filteredShipments.slice(startItem - 1, endItem);

    const columns: ColumnDef<Shipment>[] = [
        {
            accessorKey: "id",
            header: "SHIPMENT ID",
            size: 122,
            cell: (info) => (
                <Link href={`/shipments/${info.getValue()}`} className="text-text underline hover:no-underline transition-all">
                    <Body className="text-current truncate max-w-[120px]">{String(info.getValue())}</Body>
                </Link>
            ),
        },
        {
            accessorKey: "trackingNumber",
            header: "TRACK NO.",
            size: 122,
            cell: (info) => (
                <Body className="text-text truncate max-w-[120px]">
                    {String(info.getValue())}
                </Body>
            ),
        },
        {
            accessorKey: "carrier",
            header: "CARRIER",
            size: 122,
            cell: (info) => (
                <Body className="text-text truncate max-w-[120px]">
                    {String(info.getValue())}
                </Body>
            ),
        },
        {
            accessorKey: "destination",
            header: "DESTINATION",
            cell: (info) => <Body className="text-text">{String(info.getValue())}</Body>,
        },
        {
            accessorKey: "status",
            header: "STATUS",
            size: 122,
            cell: (info) => {
                const status = info.getValue() as "completed" | "pending" | "processing" | "cancelled";
                return <StatusTag status={status} />;
            },
        },
        {
            accessorKey: "createdAt",
            header: "CREATED AT",
            cell: (info) => <Body className="text-text">{String(info.getValue())}</Body>,
        },
    ];

    const handlePrev = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleNext = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const pageSizeOptions = [
        { label: "5", value: 5 },
        { label: "10", value: 10 },
        { label: "20", value: 20 },
        { label: "50", value: 50 },
    ];

    return (
        <DashboardContentLayout>
            <div className="flex justify-between items-center pb-3">
                <Heading>Administrar envíos</Heading>
                {/* Si quieres botón para añadir envío, descomenta y adapta: 
                <Link href="/shipments/add">
                    <Button variant="success" className="px-4 py-2.5 rounded-full font-bold text-body flex items-center gap-2">
                        Agregar envío
                    </Button>
                </Link>
                */}
            </div>

            <div className="flex flex-col gap-6">
                <div className="flex justify-between items-center flex-wrap gap-6">
                    {/* Entradas por página */}
                    <div className="flex items-center py-1">
                        <Dropdown
                            value={itemsPerPage}
                            onChange={setItemsPerPage}
                            options={pageSizeOptions}
                            className="w-[100px]"
                        />
                        <Body className="text-text p-2">entradas por página</Body>
                    </div>

                    {/* Buscador */}
                    <div className="w-[341px] min-w-[240px] relative">
                        <MagnifyingGlassIcon
                            className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-placeholder pointer-events-none"
                        />
                        <Input
                            variant="searchbar"
                            type="text"
                            placeholder="Buscar envío..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </div>

                {/* Tabla */}
                {isLoading ? (
                    <p className="text-placeholder">Cargando envíos...</p>
                ) : error ? (
                    <p className="text-danger">Error al cargar los envíos</p>
                ) : (
                    <BaseTable data={paginatedShipments} columns={columns} />
                )}

                {/* Footer de paginación */}
                <div className="flex justify-between items-center flex-wrap gap-6">
                    <Body className="text-text">
                        Mostrando {startItem} - {endItem} de {totalRecords} registros
                    </Body>

                    <div className="flex items-center gap-1">
                        {["«", "‹", ...Array.from({ length: Math.min(totalPages, 6) }, (_, i) => i + 1), "›", "»"].map(
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
