// src/app/dashboard/employees/page.tsx
"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import Button from "@/components/atoms/Button";
import Dropdown from "@/components/atoms/Dropdown";
import Input from "@/components/atoms/Input";
import Pagination from "@/components/atoms/Pagination";
import { Body, Heading } from "@/components/atoms/Typography";

import DashboardContentLayout from "@/components/features/dashboard/templates/DashboardContentLayout";
import { BaseTable } from "@/components/features/dashboard/atoms/BaseTable";

import { useEmployees, useDeleteEmployee, type Address, Employee } from "@/hook/dashboard/useEmployees";
import { TrashIcon, MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { ColumnDef } from "@tanstack/react-table";

export default function Employees() {
    const router = useRouter();
    const { data: employees = [], isLoading, error } = useEmployees();
    const { mutate: deleteEmployee } = useDeleteEmployee();

    const [loadingAuth, setLoadingAuth] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    useEffect(() => {
        const stored = typeof window !== "undefined" ? localStorage.getItem("user") : null;
        if (!stored) return router.push("/login");

        const user = JSON.parse(stored);
        if (user.role !== "admin") return router.push("/overview");

        setLoadingAuth(false);
    }, [router]);

    useEffect(() => setCurrentPage(1), [searchTerm, itemsPerPage]);

    const filtered = useMemo(() => {
        const term = searchTerm.toLowerCase().trim();
        return employees.filter(emp =>
            [emp.name, emp.lastName, emp.email, emp.phone, emp._id]
                .some(field => field.toLowerCase().includes(term))
        );
    }, [employees, searchTerm]);

    const totalRecords = filtered.length;
    const totalPages = Math.ceil(totalRecords / itemsPerPage);

    const currentData = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filtered.slice(start, start + itemsPerPage);
    }, [filtered, currentPage, itemsPerPage]);

    const startItem = totalRecords === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalRecords);

    const handleDeleteEmployee = useCallback((id: string) => {
        if (confirm("¿Seguro que quieres eliminar este empleado?")) {
            deleteEmployee(id);
        }
    }, [deleteEmployee]);

    const columns: ColumnDef<Employee>[] = useMemo(() => [
        {
            accessorKey: "_id",
            header: "EMPLOYEE ID",
            cell: info => (
                <Link
                    href={`/employees/${info.getValue()}`}
                    className="text-text underline hover:no-underline transition-all"
                >
                    <Body className="text-current truncate max-w-[120px]">{String(info.getValue())}</Body>
                </Link>
            ),
        },
        {
            header: "NAME",
            cell: info => {
                const { name, lastName } = info.row.original;
                return <Body className="text-text truncate max-w-[120px]">{name} {lastName}</Body>;
            },
        },
        {
            accessorKey: "phone",
            header: "PHONE NUMBER",
            cell: info => <Body className="text-text truncate max-w-[120px]">{String(info.getValue())}</Body>,
        },
        {
            accessorKey: "email",
            header: "EMAIL",
            cell: info => <Body className="text-text truncate max-w-[120px]">{String(info.getValue())}</Body>,
        },
        {
            accessorKey: "addresses",
            header: "CITY",
            cell: info => {
                const addresses: Address[] = info.row.original.addresses || [];
                const defaultAddress = addresses.find(addr => addr.isDefault);
                return <Body className="text-text truncate max-w-[120px]">{defaultAddress?.city || "—"}</Body>;
            },
        },
        {
            id: "actions",
            header: "ACTIONS",
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <Button variant="icon" onClick={() => handleDeleteEmployee(row.original._id)}>
                        <TrashIcon className="w-6 h-6 text-danger" />
                    </Button>
                </div>
            ),
        },
    ], [handleDeleteEmployee]);

    if (loadingAuth) return null;

    return (
        <DashboardContentLayout>
            {/* Header */}
            <div className="flex justify-between items-center pb-3">
                <Heading>Administrar empleados</Heading>
                <Link href="/employees/add">
                    <Button
                        variant="success"
                        className="px-4 py-2.5 rounded-full font-bold text-body flex items-center gap-2"
                    >
                        Agregar empleado
                    </Button>
                </Link>
            </div>

            <div className="flex flex-col gap-6">
                {/* Top Controls */}
                <div className="flex justify-between items-center flex-wrap gap-4">
                    <div className="flex items-center py-1">
                        <Dropdown
                            value={itemsPerPage}
                            onChange={setItemsPerPage}
                            className="w-[100px]"
                        />
                        <Body className="p-2">entradas por página</Body>
                    </div>
                    <div className="relative w-[300px]">
                        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-placeholder" />
                        <Input
                            variant="searchbar"
                            placeholder="Buscar empleado..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </div>

                {/* Table */}
                <BaseTable
                    data={currentData}
                    columns={columns}
                    isLoading={isLoading}
                    maxHeight="h-[500px]"
                />

                {/* Pagination Footer */}
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
