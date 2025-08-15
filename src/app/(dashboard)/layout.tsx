import Sidebar from "@/components/features/dashboard/organisms/Sidebar";
import { AuthGuard } from "@/guards/AuthGuard";
import React from "react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
/*         <AuthGuard allowedRoles={["admin", "employee"]}>
 */            <div className="flex h-screen overflow-hidden">
                <Sidebar />
                <main className="flex-1 overflow-y-auto">
                    {children}
                </main>
            </div>
/*         </AuthGuard>
 */    );
}
