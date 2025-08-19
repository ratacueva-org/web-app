// components/atoms/Loader.tsx
import { ArrowPathIcon } from "@heroicons/react/24/outline";

export default function Loader({ className = "h-40" }) {
    return (
        <div className={`flex justify-center items-center ${className}`}>
            <ArrowPathIcon className="animate-spin h-6 w-6 text-placeholder" />
        </div>
    );
}
