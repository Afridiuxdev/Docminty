"use client";
import DashSidebar from "@/components/dashboard/DashSidebar";

const MOCK_USER = {
    name: "Mohamed Ali",
    email: "mohamed@example.com",
    plan: "free",
};

export default function DashboardLayout({ children }) {
    return (
        <div style={{
            display: "flex",
            minHeight: "100vh",
            background: "#F8F9FA",
        }}>
            <DashSidebar user={MOCK_USER} />
            <main style={{ flex: 1, minWidth: 0, overflowX: "hidden" }}>
                {children}
            </main>
        </div>
    );
}