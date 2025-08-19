// components/features/dashboard/molecules/DataLoader.tsx
import Loader from "@/components/atoms/Loader";
import { Body } from "@/components/atoms/Typography";

interface DataLoaderProps {
    isLoading?: boolean;
    error?: unknown;
    children: React.ReactNode;
}

export default function DataLoader({ isLoading, error, children }: DataLoaderProps) {
    if (isLoading) return <Loader />;
    if (error) return <Body>Error al cargar los datos</Body>;
    return <>{children}</>;
}
