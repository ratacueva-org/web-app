"use client";

import React, { useMemo } from "react";
import Button from "@/components/atoms/Button";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    siblings?: number;
    boundaries?: number;
}

export default function Pagination({
    currentPage,
    totalPages,
    onPageChange,
    siblings = 1,
    boundaries = 1,
}: PaginationProps) {
    const range = useMemo<(number | string)[]>(() => {
        if (totalPages <= 2 * boundaries + 2 * siblings + 1) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }

        const left = Math.max(currentPage - siblings, boundaries + 2);
        const right = Math.min(
            currentPage + siblings,
            totalPages - boundaries - 1
        );
        const pages: (number | string)[] = [];

        // bloque fijo inicial
        for (let i = 1; i <= boundaries; i++) pages.push(i);

        // primer “…”
        if (left > boundaries + 2) pages.push("…");
        else if (left === boundaries + 2) pages.push(boundaries + 1);

        // ventana central
        for (let i = left; i <= right; i++) pages.push(i);

        // segundo “…”
        if (right < totalPages - boundaries - 1) pages.push("…");
        else if (right === totalPages - boundaries - 1)
            pages.push(totalPages - boundaries);

        // bloque fijo final
        for (let i = totalPages - boundaries + 1; i <= totalPages; i++)
            pages.push(i);

        return pages;
    }, [currentPage, totalPages, siblings, boundaries]);

    return (
        <div className="flex items-center gap-1">
            {/* Flechas sin isActive */}
            <Button
                variant="pagination"
                onClick={() => onPageChange(1)}
                disabled={currentPage === 1}
            >
                «
            </Button>
            <Button
                variant="pagination"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
            >
                ‹
            </Button>

            {/* Botones numéricos SÍ reciben isActive */}
            {range.map((item, idx) =>
                typeof item === "number" ? (
                    <Button
                        key={idx}
                        variant="pagination"
                        isActive={item === currentPage}
                        onClick={() => onPageChange(item)}
                    >
                        {item}
                    </Button>
                ) : (
                    <span key={idx} className="px-2 select-none">
                        {item}
                    </span>
                )
            )}

            {/* Flechas sin isActive */}
            <Button
                variant="pagination"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
                ›
            </Button>
            <Button
                variant="pagination"
                onClick={() => onPageChange(totalPages)}
                disabled={currentPage === totalPages}
            >
                »
            </Button>
        </div>
    );
}
