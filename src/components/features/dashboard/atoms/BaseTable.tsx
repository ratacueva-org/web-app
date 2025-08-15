"use client";

import React, { useMemo } from "react";
import {
    useReactTable,
    getCoreRowModel,
    flexRender,
    ColumnDef,
    RowData,
} from "@tanstack/react-table";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { Body } from "@/components/atoms/Typography";

interface BaseTableProps<TData extends RowData> {
    data: TData[];
    columns: ColumnDef<TData, any>[];
    isLoading?: boolean;
    className?: string;
    /** Altura máxima de la tabla para scroll vertical */
    maxHeight?: string; // Ej: "h-96", "h-[400px]"
}

export function BaseTable<TData extends RowData>({
    data,
    columns,
    isLoading = false,
    className = "",
    maxHeight = "h-96", // valor por defecto
}: BaseTableProps<TData>) {
    const memoColumns = useMemo(() => columns, [columns]);
    const memoData = useMemo(() => data, [data]);

    const table = useReactTable({
        data: memoData,
        columns: memoColumns,
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
        <div
            className={`bg-gray rounded-lg overflow-hidden ${className} ${maxHeight} overflow-y-auto`}
        >
            <table className="w-full">
                <thead>
                    {table.getHeaderGroups().map(hg => (
                        <tr key={hg.id} className="flex gap-4 px-6 py-5 border-b-2 border-dark">
                            {hg.headers.map(header => (
                                <th key={header.id} className="flex-1 text-left">
                                    {!header.isPlaceholder && (
                                        <Body className="text-text font-bold uppercase">
                                            {flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                        </Body>
                                    )}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>

                <tbody>
                    {table.getRowModel().rows.length === 0 ? (
                        <tr>
                            <td
                                colSpan={memoColumns.length}
                                className="text-center py-8 text-placeholder"
                            >
                                No hay registros para mostrar.
                            </td>
                        </tr>
                    ) : (
                        table.getRowModel().rows.map(row => (
                            <tr
                                key={row.id}
                                className="flex gap-4 px-6 py-4 border-b border-dark last:border-b-0"
                            >
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
