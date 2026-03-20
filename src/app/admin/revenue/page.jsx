"use client";
import AdminHeader from "@/components/admin/AdminHeader";
import StatCard from "@/components/admin/StatCard";
import ChartCard from "@/components/admin/ChartCard";
import DataTable from "@/components/admin/DataTable";

const T = "#0D9488";

const MONTHLY_REV = [
    { month: "Oct", rev: 14200, subs: 62 },
    { month: "Nov", rev: 17800, subs: 78 },
    { month: "Dec", rev: 21400, subs: 96 },
    { month: "Jan", rev: 23800, subs: 108 },
    { month: "Feb", rev: 26200, subs: 122 },
    { month: "Mar", rev: 28400, subs: 142 },
];
const MAX_REV = Math.max(...MONTHLY_REV.map(r => r.rev));

const TRANSACTIONS = Array.from({ length: 25 }, (_, i) => ({
    id: `TXN-${String(i + 1).padStart(6, "0")}`,
    user: ["Arjun Sharma", "Priya Nair", "Ravi Kumar", "Ananya Singh", "Kiran Reddy"][i % 5],
    email: `user${i + 1}@example.com`,
    plan: i % 4 === 0 ? "Annual Pro" : "Monthly Pro",
    amount: i % 4 === 0 ? "Rs. 1,990" : "Rs. 199",
    date: `${Math.floor(Math.random() * 28) + 1} Mar 2026`,
    method: ["UPI", "Credit Card", "Net Banking", "Debit Card"][i % 4],
    status: i % 10 === 0 ? "Refunded" : i % 8 === 0 ? "Failed" : "Success",
}));

const STATUS_COLORS = {
    Success: { bg: "#ECFDF5", color: "#10B981" },
    Failed: { bg: "#FEF2F2", color: "#EF4444" },
    Refunded: { bg: "#FEF9C3", color: "#D97706" },
};

const COLUMNS = [
    {
        key: "id", label: "Transaction ID", sortable: false,
        render: v => <span style={{ fontFamily: "monospace", fontSize: "11px", color: "#9CA3AF" }}>{v}</span>
    },
    {
        key: "user", label: "Customer",
        render: (v, row) => (
            <div>
                <p style={{ fontSize: "13px", fontWeight: 600, color: "#111827", margin: 0 }}>{v}</p>
                <p style={{ fontSize: "11px", color: "#9CA3AF", margin: 0 }}>{row.email}</p>
            </div>
        )
    },
    {
        key: "plan", label: "Plan",
        render: v => (
            <span style={{
                background: "#F0FDFA", color: T,
                padding: "2px 10px", borderRadius: "20px",
                fontSize: "11px", fontWeight: 700,
            }}>{v}</span>
        )
    },
    {
        key: "amount", label: "Amount", align: "right",
        render: v => <span style={{ fontWeight: 700, color: "#111827" }}>{v}</span>
    },
    { key: "method", label: "Method" },
    { key: "date", label: "Date" },
    {
        key: "status", label: "Status",
        render: v => {
            const c = STATUS_COLORS[v] || STATUS_COLORS.Success;
            return (
                <span style={{
                    background: c.bg, color: c.color,
                    padding: "2px 10px", borderRadius: "20px",
                    fontSize: "11px", fontWeight: 700,
                }}>{v}</span>
            );
        }
    },
];

export default function AdminRevenuePage() {
    return (
        <>
            <AdminHeader title="Revenue" subtitle="Subscription and payment analytics" />
            <div style={{ padding: "24px 28px" }}>

                <div style={{
                    display: "grid", gridTemplateColumns: "repeat(4,1fr)",
                    gap: "16px", marginBottom: "24px",
                }}>
                    <StatCard title="MRR" value="Rs. 1,77,208" change={16.4} icon="💰" prefix="" bgColor="#F0FDFA" />
                    <StatCard title="ARR" value="Rs. 21.3L" change={19.2} icon="📈" bgColor="#ECFDF5" />
                    <StatCard title="Pro Subscribers" value={892} change={21.3} icon="⭐" bgColor="#F5F3FF" />
                    <StatCard title="Churn Rate" value="2.4%" changeType="down" change={0.8} icon="📉" bgColor="#FEF9C3" />
                </div>

                <div style={{
                    display: "grid", gridTemplateColumns: "2fr 1fr",
                    gap: "20px", marginBottom: "24px",
                }}>
                    <ChartCard title="Monthly Revenue" subtitle="Revenue trend last 6 months">
                        <div style={{
                            display: "flex", alignItems: "flex-end",
                            gap: "16px", height: "180px",
                        }}>
                            {MONTHLY_REV.map((d, i) => (
                                <div key={i} style={{
                                    flex: 1, display: "flex",
                                    flexDirection: "column", alignItems: "center", gap: "6px",
                                }}>
                                    <span style={{
                                        fontSize: "10px", fontWeight: 700,
                                        color: "#6B7280", fontFamily: "Inter, sans-serif",
                                    }}>
                                        Rs.{(d.rev / 1000).toFixed(0)}K
                                    </span>
                                    <div style={{
                                        width: "100%", borderRadius: "4px 4px 0 0",
                                        background: i === MONTHLY_REV.length - 1 ? T : "#D1FAE5",
                                        height: `${(d.rev / MAX_REV) * 140}px`,
                                        minHeight: "8px",
                                    }} />
                                    <span style={{ fontSize: "11px", color: "#9CA3AF", fontFamily: "Inter, sans-serif" }}>{d.month}</span>
                                </div>
                            ))}
                        </div>
                    </ChartCard>

                    <ChartCard title="Revenue Split" subtitle="By plan type">
                        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                            {[
                                { label: "Monthly Pro", value: "Rs. 1,06,865", pct: 60, color: T },
                                { label: "Annual Pro", value: "Rs. 70,343", pct: 40, color: "#7C3AED" },
                            ].map((d, i) => (
                                <div key={i} style={{
                                    padding: "14px", background: "#F8F9FA",
                                    borderRadius: "8px",
                                }}>
                                    <div style={{
                                        display: "flex", justifyContent: "space-between",
                                        marginBottom: "6px",
                                    }}>
                                        <span style={{ fontSize: "12px", color: "#374151", fontFamily: "Inter, sans-serif" }}>{d.label}</span>
                                        <span style={{ fontSize: "12px", fontWeight: 700, color: d.color, fontFamily: "Space Grotesk, sans-serif" }}>{d.pct}%</span>
                                    </div>
                                    <p style={{
                                        fontFamily: "Space Grotesk, sans-serif",
                                        fontWeight: 800, fontSize: "18px",
                                        color: "#111827", margin: "0 0 6px",
                                    }}>{d.value}</p>
                                    <div style={{ height: "4px", background: "#E5E7EB", borderRadius: "2px" }}>
                                        <div style={{ height: "100%", background: d.color, borderRadius: "2px", width: `${d.pct}%` }} />
                                    </div>
                                </div>
                            ))}
                            <div style={{
                                padding: "12px", background: "#F0FDFA",
                                border: `1px solid ${T}`, borderRadius: "8px",
                            }}>
                                <p style={{ fontSize: "11px", color: "#6B7280", fontFamily: "Inter, sans-serif", margin: "0 0 3px" }}>Total MRR</p>
                                <p style={{
                                    fontFamily: "Space Grotesk, sans-serif",
                                    fontWeight: 800, fontSize: "20px", color: T, margin: 0,
                                }}>Rs. 1,77,208</p>
                            </div>
                        </div>
                    </ChartCard>
                </div>

                {/* Transactions table */}
                <div style={{
                    background: "#fff", border: "1px solid #E5E7EB",
                    borderRadius: "12px",
                }}>
                    <div style={{
                        padding: "16px 20px", borderBottom: "1px solid #F3F4F6",
                        display: "flex", justifyContent: "space-between", alignItems: "center",
                    }}>
                        <div>
                            <p style={{
                                fontFamily: "Space Grotesk, sans-serif",
                                fontWeight: 700, fontSize: "14px", color: "#111827", margin: 0,
                            }}>Transactions</p>
                            <p style={{
                                fontSize: "12px", color: "#9CA3AF",
                                margin: "2px 0 0", fontFamily: "Inter, sans-serif",
                            }}>All subscription payments</p>
                        </div>
                        <button style={{
                            padding: "6px 14px", border: "1px solid #E5E7EB",
                            borderRadius: "8px", background: "#fff",
                            fontSize: "12px", fontWeight: 600, color: "#6B7280",
                            cursor: "pointer", fontFamily: "Inter, sans-serif",
                        }}>Export CSV</button>
                    </div>
                    <div style={{ padding: "16px 20px" }}>
                        <DataTable columns={COLUMNS} data={TRANSACTIONS} />
                    </div>
                </div>
            </div>
        </>
    );
}