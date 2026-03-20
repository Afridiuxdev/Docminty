"use client";
import { useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import DataTable from "@/components/admin/DataTable";
import StatCard from "@/components/admin/StatCard";
import { UserPlus, Download, Filter } from "lucide-react";

const T = "#0D9488";

const USERS = Array.from({ length: 48 }, (_, i) => ({
    id: `USR-${String(i + 1).padStart(4, "0")}`,
    name: ["Arjun Sharma", "Priya Nair", "Ravi Kumar", "Ananya Singh", "Mohamed Ali", "Sneha Patel", "Kiran Reddy", "Deepa Menon", "Vijay Das", "Lakshmi Iyer"][i % 10],
    email: `user${i + 1}@example.com`,
    plan: i % 7 === 0 ? "Pro" : "Free",
    docs: Math.floor(Math.random() * 200) + 1,
    joined: `${["Jan", "Feb", "Mar", "Apr", "May", "Jun"][i % 6]} ${2025 + Math.floor(i / 24)}`,
    lastActive: `${Math.floor(Math.random() * 29) + 1} days ago`,
    status: i % 15 === 0 ? "Banned" : i % 20 === 0 ? "Inactive" : "Active",
    state: ["Maharashtra", "Delhi", "Tamil Nadu", "Karnataka", "Gujarat", "Telangana"][i % 6],
}));

const STATUS_COLORS = {
    Active: { bg: "#ECFDF5", color: "#10B981" },
    Inactive: { bg: "#FEF9C3", color: "#D97706" },
    Banned: { bg: "#FEF2F2", color: "#EF4444" },
};

const PLAN_COLORS = {
    Pro: { bg: "#F0FDFA", color: T },
    Free: { bg: "#F8F9FA", color: "#9CA3AF" },
};

export default function AdminUsersPage() {
    const [selected, setSelected] = useState([]);
    const [filter, setFilter] = useState("All");

    const filtered = filter === "All"
        ? USERS
        : USERS.filter(u => u.status === filter || u.plan === filter);

    const COLUMNS = [
        {
            key: "id", label: "User ID", sortable: false,
            render: v => (
                <span style={{ fontFamily: "monospace", fontSize: "11px", color: "#9CA3AF" }}>{v}</span>
            ),
        },
        {
            key: "name", label: "Name",
            render: (v, row) => (
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div style={{
                        width: "28px", height: "28px", borderRadius: "50%",
                        background: T + "20", color: T,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "11px", fontWeight: 700,
                        fontFamily: "Space Grotesk, sans-serif", flexShrink: 0,
                    }}>
                        {v.charAt(0)}
                    </div>
                    <div>
                        <p style={{ fontSize: "13px", fontWeight: 600, color: "#111827", margin: 0 }}>{v}</p>
                        <p style={{ fontSize: "11px", color: "#9CA3AF", margin: 0 }}>{row.email}</p>
                    </div>
                </div>
            ),
        },
        {
            key: "plan", label: "Plan",
            render: v => {
                const c = PLAN_COLORS[v] || PLAN_COLORS.Free;
                return (
                    <span style={{
                        background: c.bg, color: c.color,
                        padding: "2px 10px", borderRadius: "20px",
                        fontSize: "11px", fontWeight: 700,
                        fontFamily: "Inter, sans-serif",
                    }}>{v}</span>
                );
            },
        },
        { key: "docs", label: "Docs", align: "right" },
        { key: "state", label: "State" },
        { key: "joined", label: "Joined" },
        { key: "lastActive", label: "Last Active" },
        {
            key: "status", label: "Status",
            render: v => {
                const c = STATUS_COLORS[v] || STATUS_COLORS.Active;
                return (
                    <span style={{
                        background: c.bg, color: c.color,
                        padding: "2px 10px", borderRadius: "20px",
                        fontSize: "11px", fontWeight: 700,
                        fontFamily: "Inter, sans-serif",
                    }}>{v}</span>
                );
            },
        },
        {
            key: "id", label: "Actions", sortable: false, align: "right",
            render: (_, row) => (
                <div style={{ display: "flex", gap: "6px", justifyContent: "flex-end" }}>
                    <button style={{
                        padding: "4px 10px", border: `1px solid ${T}`,
                        borderRadius: "6px", background: "#F0FDFA",
                        color: T, fontSize: "11px", fontWeight: 600,
                        cursor: "pointer", fontFamily: "Inter, sans-serif",
                    }}>View</button>
                    <button style={{
                        padding: "4px 10px", border: "1px solid #FCA5A5",
                        borderRadius: "6px", background: "#FEF2F2",
                        color: "#EF4444", fontSize: "11px", fontWeight: 600,
                        cursor: "pointer", fontFamily: "Inter, sans-serif",
                    }}>
                        {row.status === "Banned" ? "Unban" : "Ban"}
                    </button>
                </div>
            ),
        },
    ];

    return (
        <>
            <AdminHeader title="Users" subtitle="Manage all registered users" />
            <div style={{ padding: "24px 28px" }}>

                {/* Stats */}
                <div style={{
                    display: "grid", gridTemplateColumns: "repeat(4,1fr)",
                    gap: "16px", marginBottom: "24px",
                }}>
                    <StatCard title="Total Users" value={14280} change={12.4} icon="👥" bgColor="#F0FDFA" />
                    <StatCard title="Pro Users" value={892} change={21.3} icon="⭐" bgColor="#F5F3FF" />
                    <StatCard title="New This Month" value={640} change={8.7} icon="🆕" bgColor="#ECFDF5" />
                    <StatCard title="Banned" value={24} changeType="down" change={2.1} icon="🚫" bgColor="#FEF2F2" />
                </div>

                {/* Table */}
                <div style={{
                    background: "#fff", border: "1px solid #E5E7EB",
                    borderRadius: "12px", overflow: "hidden",
                }}>
                    <div style={{
                        padding: "16px 20px", borderBottom: "1px solid #F3F4F6",
                        display: "flex", justifyContent: "space-between",
                        alignItems: "center", flexWrap: "wrap", gap: "12px",
                    }}>
                        <div>
                            <p style={{
                                fontFamily: "Space Grotesk, sans-serif", fontWeight: 700,
                                fontSize: "14px", color: "#111827", margin: 0,
                            }}>All Users</p>
                            <p style={{
                                fontSize: "12px", color: "#9CA3AF",
                                margin: "2px 0 0", fontFamily: "Inter, sans-serif",
                            }}>{USERS.length} total users</p>
                        </div>
                        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                            {/* Filter buttons */}
                            <div style={{
                                display: "flex", gap: "4px",
                                background: "#F8F9FA", borderRadius: "8px", padding: "4px",
                            }}>
                                {["All", "Active", "Inactive", "Banned", "Pro", "Free"].map(f => (
                                    <button key={f} onClick={() => setFilter(f)} style={{
                                        padding: "4px 12px", borderRadius: "6px",
                                        border: "none", fontSize: "12px", fontWeight: 600,
                                        cursor: "pointer", fontFamily: "Inter, sans-serif",
                                        background: filter === f ? "#fff" : "transparent",
                                        color: filter === f ? T : "#6B7280",
                                        boxShadow: filter === f ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
                                        transition: "all 150ms",
                                    }}>{f}</button>
                                ))}
                            </div>
                            <button style={{
                                display: "flex", alignItems: "center", gap: "6px",
                                padding: "6px 14px", border: "1px solid #E5E7EB",
                                borderRadius: "8px", background: "#fff",
                                fontSize: "12px", fontWeight: 600, color: "#6B7280",
                                cursor: "pointer", fontFamily: "Inter, sans-serif",
                            }}>
                                <Download size={13} /> Export CSV
                            </button>
                            <button style={{
                                display: "flex", alignItems: "center", gap: "6px",
                                padding: "6px 14px", border: "none",
                                borderRadius: "8px", background: T,
                                fontSize: "12px", fontWeight: 600, color: "#fff",
                                cursor: "pointer", fontFamily: "Inter, sans-serif",
                            }}>
                                <UserPlus size={13} /> Add User
                            </button>
                        </div>
                    </div>
                    <div style={{ padding: "16px 20px" }}>
                        <DataTable columns={COLUMNS} data={filtered} />
                    </div>
                </div>
            </div>
        </>
    );
}