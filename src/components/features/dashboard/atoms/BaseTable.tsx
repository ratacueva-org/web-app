// src/components/table/BaseTable.tsx
import React from "react";
import {
    useReactTable,
    getCoreRowModel,
    flexRender,
    ColumnDef,
} from "@tanstack/react-table";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { Body } from "@/components/atoms/Typography";

interface BaseTableProps<TData> {
    data: TData[];
    columns: ColumnDef<TData, any>[];
    isLoading?: boolean;
    className?: string;
}

export function BaseTable<TData>({
    data,
    columns,
    isLoading = false,
    className = "",
}: BaseTableProps<TData>) {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-40">
                <ArrowPathIcon className="animate-spin h-6 w-6 text-placeholder" />
            </div>
        );
    }

    return (
        <div className={`bg-gray rounded-lg overflow-hidden ${className}`}>
            <table className="w-full">
                <thead>
                    {table.getHeaderGroups().map(headerGroup => (
                        <tr key={headerGroup.id} className="flex gap-4 px-6 py-5 border-b-2 border-dark">
                            {headerGroup.headers.map(header => (
                                <th key={header.id} className="flex-1 text-left">
                                    {header.isPlaceholder ? null : (
                                        <Body className="text-text font-bold uppercase">
                                            {flexRender(header.column.columnDef.header, header.getContext())}
                                        </Body>
                                    )}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {data.length === 0 ? (
                        <tr className="px-6 py-4">
                            <td colSpan={columns.length} className="text-center py-8 text-placeholder w-full">
                                No hay registros para mostrar.
                            </td>
                        </tr>
                    ) : (
                        table.getRowModel().rows.map(row => (
                            <tr key={row.id} className="flex gap-4 px-6 py-4 border-b border-dark last:border-b-0">
                                {row.getVisibleCells().map(cell => (
                                    <td key={cell.id} className="flex-1">
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>
                                ))}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}
