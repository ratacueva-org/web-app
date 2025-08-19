// utils/format.ts

// Moneda
export const formatCurrency = (value: number, currency: string = "MXN") => {
    return value.toLocaleString("es-MX", {
        style: "currency",
        currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
};

// Fecha completa: "lunes, 18 de agosto de 2025 a las 13:05 hrs"
export const formatFullDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const options: Intl.DateTimeFormatOptions = {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    };
    return `${date.toLocaleDateString("es-MX", options)} a las ${date.toLocaleTimeString("es-MX", { hour12: false })} hrs`;
};

// Fecha corta: "18/08/2025"
export const formatShortDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("es-MX");
};

// Peso: "2.5 kg"
export const formatWeight = (weight: number, unit: string = "kg") => {
    return `${weight} ${unit}`;
};

// Dimensiones: "30 x 20 x 15 cm"
export const formatDimensions = (length: number, width: number, height: number, unit: string = "cm") => {
    return `${length} x ${width} x ${height} ${unit}`;
};
