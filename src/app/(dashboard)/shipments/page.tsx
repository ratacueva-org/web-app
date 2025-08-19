"use client";

import React, { useState, useEffect, useMemo } from "react";
import Button from "@/components/atoms/Button";
import { Body, Heading } from "@/components/atoms/Typography";
import Input from "@/components/atoms/Input";
import { BaseTable } from "@/components/features/dashboard/atoms/BaseTable";
import StatusTag from "@/components/features/dashboard/atoms/StatusTag";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import DashboardContentLayout from "@/components/features/dashboard/templates/DashboardContentLayout";
import { ColumnDef } from "@tanstack/react-table";
import { Shipment, useShipments } from "@/hook/dashboard/shipments/useShipments";
import Link from "next/link";
import Dropdown from "@/components/atoms/Dropdown";
import DataLoader from "@/components/features/dashboard/molecules/DataLoader";

export default function Shipments() {
    const { data: shipments = [], isLoading, error } = useShipments();

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => setCurrentPage(1), [searchTerm, itemsPerPage]);

    const filteredShipments = useMemo(() => {
        const term = searchTerm.toLowerCase();
        return shipments.filter((shipment) =>
            shipment.id.toLowerCase().includes(term) ||
            shipment.trackingNumber.toLowerCase().includes(term) ||
            shipment.carrier.toLowerCase().includes(term) ||
            shipment.destination.toLowerCase().includes(term)
        );
    }, [shipments, searchTerm]);

    const totalRecords = filteredShipments.length;
    const totalPages = Math.ceil(totalRecords / itemsPerPage);
    const shipmentsData = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredShipments.slice(start, start + itemsPerPage);
    }, [filteredShipments, currentPage, itemsPerPage]);
    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalRecords);

    const columns: ColumnDef<Shipment>[] = useMemo(() => [
        {
            accessorKey: "id",
            header: "SHIPMENT ID",
            cell: info => (
                <Link href={`/shipments/${info.getValue()}`} className="text-text underline hover:no-underline transition-all">
                    <Body className="text-current truncate max-w-[120px]">{String(info.getValue())}</Body>
                </Link>
            ),
        },
        {
            accessorKey: "trackingNumber",
            header: "TRACK NO.",
            cell: info => <Body className="text-text truncate max-w-[120px]">{String(info.getValue())}</Body>,
        },
        {
            accessorKey: "carrier",
            header: "CARRIER",
            cell: info => <Body className="text-text truncate max-w-[120px]">{String(info.getValue())}</Body>,
        },
        {
            accessorKey: "destination",
            header: "DESTINATION",
            cell: info => <Body className="text-text">{String(info.getValue())}</Body>,
        },
        {
            accessorKey: "status",
            header: "STATUS",
            cell: info => <StatusTag status={info.getValue() as Shipment["status"]} />,
        },
        {
            accessorKey: "createdAt",
            header: "CREATED AT",
            cell: info => <Body className="text-text">{String(info.getValue())}</Body>,
        },
    ], []);

    const handlePrev = () => setCurrentPage((p) => Math.max(p - 1, 1));
    const handleNext = () => setCurrentPage((p) => Math.min(p + 1, totalPages));

    return (
        <DashboardContentLayout>
            <div className="flex justify-between items-center pb-3">
                <Heading>Administrar envíos</Heading>
            </div>

            <div className="flex flex-col gap-6">
                {/* Controles superiores */}
                <div className="flex justify-between items-center flex-wrap gap-6">
                    <div className="flex items-center py-1">
                        <Dropdown value={itemsPerPage} onChange={setItemsPerPage} className="w-[100px]" />
                        <Body className="text-text p-2">entradas por página</Body>
                    </div>

                    <div className="w-[341px] min-w-[240px] relative">
                        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-placeholder pointer-events-none" />
                        <Input
                            variant="searchbar"
                            placeholder="Buscar envío..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </div>

                {/* Tabla o estados */}
                <DataLoader isLoading={isLoading} error={error}>
                    <BaseTable
                        data={shipmentsData}
                        columns={columns}
                        isLoading={isLoading}
                        maxHeight="h-[500px]" />
                </DataLoader>
                {/* Footer de paginación */}
                <div className="flex justify-between items-center flex-wrap gap-6">
                    <Body className="text-text">
                        Mostrando {startItem} - {endItem} de {totalRecords} registros
                    </Body>

                    <div className="flex items-center gap-1">
                        <Button variant="pagination" onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>«</Button>
                        <Button variant="pagination" onClick={handlePrev} disabled={currentPage === 1}>‹</Button>
                        {Array.from({ length: Math.min(totalPages, 6) }, (_, i) => i + 1).map((num) => (
                            <Button key={num} variant="pagination" isActive={num === currentPage} onClick={() => setCurrentPage(num)}>
                                {num}
                            </Button>
                        ))}
                        <Button variant="pagination" onClick={handleNext} disabled={currentPage === totalPages}>›</Button>
                        <Button variant="pagination" onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages}>»</Button>
                    </div>
                </div>
            </div>
        </DashboardContentLayout>
    );
}
