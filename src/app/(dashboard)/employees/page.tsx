"use client";

import React, { useEffect, useState } from "react";
import Button from "@/components/atoms/Button";
import { Body, Heading } from "@/components/atoms/Typography";
import Input from "@/components/atoms/Input";
import { BaseTable } from "@/components/features/dashboard/atoms/BaseTable";
import {
    TrashIcon,
    MagnifyingGlassIcon,
} from "@heroicons/react/24/solid";
import DashboardContentLayout from "@/components/features/dashboard/templates/DashboardContentLayout";
import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { useDeleteEmployee, useEmployees, type Address } from "@/hook/dashboard/useEmployees";
import Dropdown from "@/components/atoms/Dropdown";

export default function Employees() {
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState("");

    const { data: employees, isLoading, error } = useEmployees();
    const { mutate: deleteEmployee } = useDeleteEmployee();
    const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.push("/login");
      return;
    }

        const user = JSON.parse(storedUser);
        if (user.role !== "admin") {
            router.push("/overview");
        } else {
            setLoading(false);
        }
    }, [router]);

    useEffect(() => {
        setCurrentPage(1); // reset page on search or items per page change
    }, [searchTerm, itemsPerPage]);

  if (loading) return null;

  const handleDeleteEmployee = (id: string) => {
    const confirmDelete = window.confirm("¿Eliminar empleado?");
    if (!confirmDelete) return;
    deleteEmployee(id);
  };

    const filteredEmployees = (employees ?? []).filter(
        (employee) =>
            employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            employee.phone.includes(searchTerm) ||
            employee._id.includes(searchTerm)
    );

    const totalRecords = filteredEmployees.length;
    const totalPages = Math.ceil(totalRecords / itemsPerPage);
    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalRecords);

  const currentData = filteredEmployees.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

    const columns: ColumnDef<any>[] = [
        {
            accessorKey: "_id",
            header: "EMPLOYEE ID",
            size: 122,
            cell: (info) => (
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
            size: 122,
            cell: (info) => {
                const { name, lastName } = info.row.original;
                return (
                    <Body className="text-text truncate max-w-[120px]">
                        {name} {lastName}
                    </Body>
                );
            },
        },
        {
            accessorKey: "phone",
            header: "PHONE NUMBER",
            size: 122,
            cell: (info) => <Body className="text-text truncate max-w-[120px]">{String(info.getValue())}</Body>,
        },
        {
            accessorKey: "email",
            header: "EMAIL",
            size: 122,
            cell: (info) => (
                <Body className="text-text truncate max-w-[120px]">{String(info.getValue())}</Body>
            ),
        },
        {
            accessorKey: "addresses",
            header: "CITY",
            size: 122,
            cell: (info) => {
                const addresses = info.row.original.addresses || [];
                const defaultAddress = addresses.find((addr: Address) => addr.isDefault);
                return (
                    <Body className="text-text truncate max-w-[120px]">
                        {defaultAddress?.city || "—"}
                    </Body>
                );
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
                        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-placeholder pointer-events-none" />
                        <Input
                            variant="searchbar"
                            type="text"
                            placeholder="Buscar empleado..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </div>

                {/* Tabla */}
                {isLoading ? (
                    <p className="text-placeholder">Cargando empleados...</p>
                ) : error ? (
                    <p className="text-danger">Error al cargar los empleados</p>
                ) : (
                    <BaseTable data={currentData} columns={columns} />
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
