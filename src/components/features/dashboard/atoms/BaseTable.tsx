// src/components/table/BaseTable.tsx
import React from "react";
import {
    useReactTable,
    getCoreRowModel,
    flexRender,
    ColumnDef,
} from "@tanstack/react-table";
import { ArrowPathIcon } from "@heroicons/react/24/outline";

interface BaseTableProps<TData> {
    data: TData[];
    columns: ColumnDef<TData, any>[];
    isLoading?: boolean;
}

export function BaseTable<TData>({
    data,
    columns,
    isLoading = false,
}: BaseTableProps<TData>) {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-40">
                <ArrowPathIcon className="animate-spin h-6 w-6 text-gray-500" />
            </div>
        );
    }

    return (
        <div className="overflow-x-auto border rounded-xl">
            <table className="min-w-full text-sm text-left">
                <thead className="bg-gray-100">
                    {table.getHeaderGroups().map(headerGroup => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map(header => (
                                <th key={header.id} className="px-4 py-2 font-medium">
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(header.column.columnDef.header, header.getContext())}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {data.length === 0 ? (
                        <tr>
                            <td colSpan={columns.length} className="text-center py-8 text-gray-500">
                                No hay registros para mostrar.
                            </td>
                        </tr>
                    ) : (
                        table.getRowModel().rows.map(row => (
                            <tr key={row.id} className="border-t hover:bg-gray-50">
                                {row.getVisibleCells().map(cell => (
                                    <td key={cell.id} className="px-4 py-2">
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
