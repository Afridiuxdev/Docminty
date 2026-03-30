"use client";
import { useState, useEffect } from "react";
import DashSidebar from "@/components/dashboard/DashSidebar";
import { authApi } from "@/api/auth";

export default function DashboardLayout({ children }) {
    const [user, setUser] = useState({
        name: "Loading...",
        email: "...",
        plan: "free",
    });

    useEffect(() => {
        authApi.me()
            .then(res => {
                const u = res.data.data;
                setUser({
                    name: u.name,
                    email: u.email,
                    plan: u.role === "ADMIN" ? "pro" : "free",
                });
            })
            .catch(err => console.error("Failed to fetch user:", err));
    }, []);

    return (
        <div style={{
            display: "flex",
            minHeight: "100vh",
            background: "#F8F9FA",
        }}>
            <DashSidebar user={user} />
            <main style={{ flex: 1, minWidth: 0, overflowX: "hidden" }}>
                {children}
            </main>
        </div>
    );
}