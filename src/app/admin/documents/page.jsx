"use client";
import AdminHeader from "@/components/admin/AdminHeader";
import DataTable from "@/components/admin/DataTable";
import StatCard from "@/components/admin/StatCard";
import ChartCard from "@/components/admin/ChartCard";

const T = "#0D9488";

const DOC_TYPES = [
    { name: "GST Invoice", count: 12840, today: 428, color: T, pct: 38 },
    { name: "Salary Slip", count: 7210, today: 240, color: "#7C3AED", pct: 21 },
    { name: "Quotation", count: 5430, today: 181, color: "#F59E0B", pct: 16 },
    { name: "Rent Receipt", count: 3890, today: 130, color: "#3B82F6", pct: 11 },
    { name: "Certificate", count: 2340, today: 78, color: "#EC4899", pct: 7 },
    { name: "Experience Letter", count: 1240, today: 41, color: "#10B981", pct: 4 },
    { name: "Purchase Order", count: 820, today: 27, color: "#6366F1", pct: 2 },
    { name: "Other", count: 430, today: 14, color: "#9CA3AF", pct: 1 },
];

const RECENT_DOCS = Array.from({ length: 30 }, (_, i) => ({
    id: `DOC-${String(i + 1).padStart(5, "0")}`,
    user: ["Arjun Sharma", "Priya Nair", "Ravi Kumar", "Ananya Singh", "Mohamed Ali"][i % 5],
    type: ["GST Invoice", "Salary Slip", "Quotation", "Rent Receipt", "Certificate"][i % 5],
    amount: i % 3 === 0 ? `Rs. ${(Math.random() * 50000 + 1000).toFixed(0)}` : "—",
    date: `${Math.floor(Math.random() * 28) + 1} Mar 2026`,
    time: `${Math.floor(Math.random() * 12) + 1}:${String(Math.floor(Math.random() * 60)).padStart(2, "0")} ${i % 2 === 0 ? "AM" : "PM"}`,
    status: i % 12 === 0 ? "Failed" : "Success",
    size: `${(Math.random() * 400 + 80).toFixed(0)} KB`,
}));

const COLUMNS = [
    {
        key: "id", label: "Doc ID", sortable: false,
        render: v => <span style={{ fontFamily: "monospace", fontSize: "11px", color: "#9CA3AF" }}>{v}</span>
    },
    {
        key: "user", label: "User",
        render: (v, row) => (
            <div>
                <p style={{ fontSize: "13px", fontWeight: 600, color: "#111827", margin: 0 }}>{v}</p>
                <p style={{ fontSize: "11px", color: "#9CA3AF", margin: 0 }}>{row.date} {row.time}</p>
            </div>
        )
    },
    {
        key: "type", label: "Doc Type",
        render: v => {
            const found = DOC_TYPES.find(d => d.name === v) || { color: "#9CA3AF" };
            return (
                <span style={{
                    background: found.color + "18", color: found.color,
                    padding: "2px 10px", borderRadius: "20px",
                    fontSize: "11px", fontWeight: 700,
                    fontFamily: "Inter, sans-serif",
                }}>{v}</span>
            );
        }
    },
    { key: "amount", label: "Amount", align: "right" },
    { key: "size", label: "File Size", align: "right" },
    {
        key: "status", label: "Status",
        render: v => (
            <span style={{
                background: v === "Success" ? "#ECFDF5" : "#FEF2F2",
                color: v === "Success" ? "#10B981" : "#EF4444",
                padding: "2px 10px", borderRadius: "20px",
                fontSize: "11px", fontWeight: 700,
                fontFamily: "Inter, sans-serif",
            }}>{v}</span>
        )
    },
    {
        key: "id", label: "", sortable: false,
        render: () => (
            <button style={{
                padding: "4px 10px", border: `1px solid ${T}`,
                borderRadius: "6px", background: "#F0FDFA",
                color: T, fontSize: "11px", fontWeight: 600,
                cursor: "pointer", fontFamily: "Inter, sans-serif",
            }}>Download</button>
        )
    },
];

export default function AdminDocumentsPage() {
    return (
        <>
            <AdminHeader title="Documents" subtitle="All generated documents across the platform" />
            <div style={{ padding: "24px 28px" }}>

                <div style={{
                    display: "grid", gridTemplateColumns: "repeat(4,1fr)",
                    gap: "16px", marginBottom: "24px",
                }}>
                    <StatCard title="Total Docs" value={34200} change={18.2} icon="📄" bgColor="#F0FDFA" />
                    <StatCard title="Today" value={1139} change={5.4} icon="📅" bgColor="#F5F3FF" />
                    <StatCard title="Success Rate" value="98.2%" change={0.3} icon="✅" bgColor="#ECFDF5" />
                    <StatCard title="Failed" value={61} changeType="down" change={12.1} icon="❌" bgColor="#FEF2F2" />
                </div>

                {/* Doc type breakdown */}
                <div style={{ marginBottom: "24px" }}>
                    <ChartCard title="Documents by Type" subtitle="All-time breakdown">
                        <div style={{
                            display: "grid", gridTemplateColumns: "repeat(4,1fr)",
                            gap: "12px",
                        }}>
                            {DOC_TYPES.map((d, i) => (
                                <div key={i} style={{
                                    padding: "14px", border: "1px solid #E5E7EB",
                                    borderRadius: "10px", background: "#FAFAFA",
                                }}>
                                    <div style={{
                                        display: "flex", justifyContent: "space-between",
                                        alignItems: "center", marginBottom: "8px",
                                    }}>
                                        <span style={{
                                            fontSize: "12px", color: "#6B7280",
                                            fontFamily: "Inter, sans-serif",
                                        }}>{d.name}</span>
                                        <span style={{
                                            fontSize: "10px", fontWeight: 700,
                                            color: d.color, fontFamily: "Inter, sans-serif",
                                            background: d.color + "18",
                                            padding: "1px 6px", borderRadius: "8px",
                                        }}>{d.pct}%</span>
                                    </div>
                                    <p style={{
                                        fontFamily: "Space Grotesk, sans-serif",
                                        fontWeight: 800, fontSize: "18px",
                                        color: "#111827", margin: "0 0 2px",
                                    }}>
                                        {d.count.toLocaleString("en-IN")}
                                    </p>
                                    <p style={{
                                        fontSize: "11px", color: "#9CA3AF",
                                        fontFamily: "Inter, sans-serif", margin: 0,
                                    }}>+{d.today} today</p>
                                    <div style={{
                                        height: "3px", background: "#F3F4F6",
                                        borderRadius: "2px", marginTop: "8px",
                                    }}>
                                        <div style={{
                                            height: "100%", background: d.color,
                                            borderRadius: "2px", width: `${d.pct}%`,
                                        }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </ChartCard>
                </div>

                {/* Recent docs table */}
                <div style={{
                    background: "#fff", border: "1px solid #E5E7EB",
                    borderRadius: "12px",
                }}>
                    <div style={{
                        padding: "16px 20px", borderBottom: "1px solid #F3F4F6",
                        display: "flex", justifyContent: "space-between",
                        alignItems: "center",
                    }}>
                        <div>
                            <p style={{
                                fontFamily: "Space Grotesk, sans-serif", fontWeight: 700,
                                fontSize: "14px", color: "#111827", margin: 0,
                            }}>Recent Documents</p>
                            <p style={{
                                fontSize: "12px", color: "#9CA3AF",
                                margin: "2px 0 0", fontFamily: "Inter, sans-serif",
                            }}>Latest generated documents</p>
                        </div>
                        <button style={{
                            display: "flex", alignItems: "center", gap: "6px",
                            padding: "6px 14px", border: "1px solid #E5E7EB",
                            borderRadius: "8px", background: "#fff",
                            fontSize: "12px", fontWeight: 600, color: "#6B7280",
                            cursor: "pointer", fontFamily: "Inter, sans-serif",
                        }}>
                            Export All
                        </button>
                    </div>
                    <div style={{ padding: "16px 20px" }}>
                        <DataTable columns={COLUMNS} data={RECENT_DOCS} />
                    </div>
                </div>
            </div>
        </>
    );
}