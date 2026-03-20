"use client";
import AdminHeader from "@/components/admin/AdminHeader";
import StatCard from "@/components/admin/StatCard";
import ChartCard from "@/components/admin/ChartCard";
import { useState } from "react";

const T = "#0D9488";

// Mock data
const MONTHLY_DOCS = [
    { month: "Oct", count: 1840 },
    { month: "Nov", count: 2210 },
    { month: "Dec", count: 2890 },
    { month: "Jan", count: 3120 },
    { month: "Feb", count: 3540 },
    { month: "Mar", count: 4280 },
];

const DOC_TYPES = [
    { type: "GST Invoice", count: 12840, pct: 38, color: T },
    { type: "Salary Slip", count: 7210, pct: 21, color: "#7C3AED" },
    { type: "Quotation", count: 5430, pct: 16, color: "#F59E0B" },
    { type: "Rent Receipt", count: 3890, pct: 11, color: "#3B82F6" },
    { type: "Certificate", count: 2340, pct: 7, color: "#EC4899" },
    { type: "Other", count: 2290, pct: 7, color: "#9CA3AF" },
];

const RECENT_ACTIVITY = [
    { user: "Arjun Sharma", action: "Generated Invoice", time: "2 min ago", type: "invoice" },
    { user: "Priya Nair", action: "Downloaded Salary Slip", time: "5 min ago", type: "salary" },
    { user: "Ravi Kumar", action: "New Pro Subscription", time: "12 min ago", type: "subscription" },
    { user: "Ananya Singh", action: "Generated Certificate", time: "18 min ago", type: "certificate" },
    { user: "Mohamed Ali", action: "Generated Rent Receipt", time: "24 min ago", type: "receipt" },
    { user: "Sneha Patel", action: "New Free Account", time: "31 min ago", type: "signup" },
    { user: "Kiran Reddy", action: "Generated Quotation", time: "45 min ago", type: "quotation" },
    { user: "Deepa Menon", action: "Upgraded to Pro", time: "1 hr ago", type: "subscription" },
];

const TYPE_COLORS = {
    invoice: T, salary: "#7C3AED", subscription: "#F59E0B",
    certificate: "#EC4899", receipt: "#3B82F6",
    signup: "#10B981", quotation: "#6366F1",
};

const BAR_MAX = Math.max(...MONTHLY_DOCS.map(d => d.count));

export default function AdminOverviewPage() {
    const [period, setPeriod] = useState("30d");

    return (
        <>
            <AdminHeader
                title="Overview"
                subtitle="Welcome back, Admin. Here is what is happening today."
            />

            <div style={{ padding: "24px 28px" }}>

                {/* Period selector */}
                <div style={{
                    display: "flex", justifyContent: "flex-end",
                    marginBottom: "20px",
                }}>
                    <div style={{
                        display: "flex", gap: "4px",
                        background: "#fff", border: "1px solid #E5E7EB",
                        borderRadius: "8px", padding: "4px",
                    }}>
                        {["7d", "30d", "90d", "1y"].map(p => (
                            <button key={p} onClick={() => setPeriod(p)} style={{
                                padding: "5px 14px", borderRadius: "6px",
                                border: "none", fontSize: "12px", fontWeight: 600,
                                cursor: "pointer", fontFamily: "Inter, sans-serif",
                                background: period === p ? T : "transparent",
                                color: period === p ? "#fff" : "#6B7280",
                                transition: "all 150ms",
                            }}>{p}</button>
                        ))}
                    </div>
                </div>

                {/* Stat cards */}
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(4, 1fr)",
                    gap: "16px", marginBottom: "24px",
                }}>
                    <StatCard title="Total Users" value={14280} change={12.4} icon="👥" color={T} bgColor="#F0FDFA" />
                    <StatCard title="Docs Generated" value={34200} change={18.2} icon="📄" color="#7C3AED" bgColor="#F5F3FF" />
                    <StatCard title="Monthly Revenue" value="Rs. 28,400" change={9.1} icon="💰" color="#F59E0B" bgColor="#FFFBEB" />
                    <StatCard title="Pro Subscribers" value={892} change={21.3} icon="⭐" color="#3B82F6" bgColor="#EFF6FF" />
                </div>

                {/* Second row stats */}
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(4, 1fr)",
                    gap: "16px", marginBottom: "24px",
                }}>
                    <StatCard title="Today's Docs" value={428} change={5.2} icon="📊" color="#10B981" bgColor="#ECFDF5" />
                    <StatCard title="New Signups" value={64} change={8.7} icon="🆕" color="#EC4899" bgColor="#FDF2F8" />
                    <StatCard title="AdSense Today" value="Rs. 1,240" change={3.1} icon="📢" color="#6366F1" bgColor="#EEF2FF" />
                    <StatCard title="PDF Downloads" value={1840} change={14.6} icon="⬇" color="#EF4444" bgColor="#FEF2F2" />
                </div>

                {/* Charts row */}
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "2fr 1fr",
                    gap: "20px", marginBottom: "24px",
                }}>
                    {/* Bar chart */}
                    <ChartCard
                        title="Documents Generated"
                        subtitle="Monthly document generation trend"
                        action={
                            <span style={{
                                fontSize: "12px", color: T,
                                fontFamily: "Inter, sans-serif", fontWeight: 600,
                            }}>Last 6 months</span>
                        }
                    >
                        <div style={{
                            display: "flex", alignItems: "flex-end",
                            gap: "12px", height: "180px"
                        }}>
                            {MONTHLY_DOCS.map((d, i) => (
                                <div key={i} style={{
                                    flex: 1, display: "flex",
                                    flexDirection: "column", alignItems: "center", gap: "6px",
                                }}>
                                    <span style={{
                                        fontSize: "11px", fontWeight: 700,
                                        color: "#6B7280", fontFamily: "Inter, sans-serif",
                                    }}>
                                        {d.count.toLocaleString("en-IN")}
                                    </span>
                                    <div style={{
                                        width: "100%", borderRadius: "4px 4px 0 0",
                                        background: i === MONTHLY_DOCS.length - 1 ? T : "#E0F2FE",
                                        height: `${(d.count / BAR_MAX) * 140}px`,
                                        transition: "height 300ms ease",
                                        minHeight: "8px",
                                    }} />
                                    <span style={{
                                        fontSize: "11px", color: "#9CA3AF",
                                        fontFamily: "Inter, sans-serif",
                                    }}>{d.month}</span>
                                </div>
                            ))}
                        </div>
                    </ChartCard>

                    {/* Donut-style breakdown */}
                    <ChartCard title="Doc Type Breakdown" subtitle="By document category">
                        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                            {DOC_TYPES.map((d, i) => (
                                <div key={i}>
                                    <div style={{
                                        display: "flex", justifyContent: "space-between",
                                        marginBottom: "4px",
                                    }}>
                                        <span style={{
                                            fontSize: "12px", color: "#374151",
                                            fontFamily: "Inter, sans-serif",
                                        }}>{d.type}</span>
                                        <span style={{
                                            fontSize: "12px", fontWeight: 700,
                                            color: "#111827", fontFamily: "Space Grotesk, sans-serif",
                                        }}>{d.pct}%</span>
                                    </div>
                                    <div style={{
                                        height: "6px", background: "#F3F4F6",
                                        borderRadius: "3px", overflow: "hidden",
                                    }}>
                                        <div style={{
                                            height: "100%", borderRadius: "3px",
                                            background: d.color, width: `${d.pct}%`,
                                            transition: "width 500ms ease",
                                        }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </ChartCard>
                </div>

                {/* Bottom row */}
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "20px",
                }}>
                    {/* Recent Activity */}
                    <ChartCard title="Recent Activity" subtitle="Latest user actions">
                        <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
                            {RECENT_ACTIVITY.map((a, i) => (
                                <div key={i} style={{
                                    display: "flex", alignItems: "center",
                                    gap: "12px", padding: "10px 0",
                                    borderBottom: i < RECENT_ACTIVITY.length - 1
                                        ? "1px solid #F3F4F6" : "none",
                                }}>
                                    <div style={{
                                        width: "32px", height: "32px",
                                        borderRadius: "50%", flexShrink: 0,
                                        background: (TYPE_COLORS[a.type] || "#9CA3AF") + "20",
                                        display: "flex", alignItems: "center",
                                        justifyContent: "center", fontSize: "13px",
                                        fontWeight: 700, color: TYPE_COLORS[a.type] || "#9CA3AF",
                                        fontFamily: "Space Grotesk, sans-serif",
                                    }}>
                                        {a.user.charAt(0)}
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <p style={{
                                            fontSize: "13px", fontWeight: 600,
                                            color: "#111827", margin: 0,
                                            fontFamily: "Inter, sans-serif",
                                            overflow: "hidden", textOverflow: "ellipsis",
                                            whiteSpace: "nowrap",
                                        }}>{a.user}</p>
                                        <p style={{
                                            fontSize: "11px", color: "#9CA3AF",
                                            margin: "1px 0 0", fontFamily: "Inter, sans-serif",
                                        }}>{a.action}</p>
                                    </div>
                                    <span style={{
                                        fontSize: "11px", color: "#D1D5DB",
                                        fontFamily: "Inter, sans-serif", whiteSpace: "nowrap",
                                        flexShrink: 0,
                                    }}>{a.time}</span>
                                </div>
                            ))}
                        </div>
                    </ChartCard>

                    {/* Quick Stats */}
                    <ChartCard title="Platform Health" subtitle="System metrics">
                        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                            {[
                                { label: "Uptime", value: "99.9%", color: "#10B981", pct: 99 },
                                { label: "PDF Success Rate", value: "98.2%", color: T, pct: 98 },
                                { label: "Avg Load Time", value: "0.8s", color: "#6366F1", pct: 92 },
                                { label: "API Response", value: "124ms", color: "#F59E0B", pct: 85 },
                                { label: "Storage Used", value: "42%", color: "#EF4444", pct: 42 },
                            ].map((m, i) => (
                                <div key={i}>
                                    <div style={{
                                        display: "flex", justifyContent: "space-between",
                                        marginBottom: "5px",
                                    }}>
                                        <span style={{
                                            fontSize: "12px", color: "#6B7280",
                                            fontFamily: "Inter, sans-serif",
                                        }}>{m.label}</span>
                                        <span style={{
                                            fontSize: "12px", fontWeight: 700,
                                            color: m.color, fontFamily: "Space Grotesk, sans-serif",
                                        }}>{m.value}</span>
                                    </div>
                                    <div style={{
                                        height: "5px", background: "#F3F4F6",
                                        borderRadius: "3px", overflow: "hidden",
                                    }}>
                                        <div style={{
                                            height: "100%", background: m.color,
                                            borderRadius: "3px", width: `${m.pct}%`,
                                        }} />
                                    </div>
                                </div>
                            ))}

                            <div style={{
                                marginTop: "4px", padding: "12px",
                                background: "#F0FDFA", borderRadius: "8px",
                                display: "flex", justifyContent: "space-between",
                            }}>
                                <div style={{ textAlign: "center" }}>
                                    <p style={{
                                        fontSize: "11px", color: "#9CA3AF",
                                        fontFamily: "Inter, sans-serif", margin: "0 0 2px"
                                    }}>
                                        Free Users
                                    </p>
                                    <p style={{
                                        fontSize: "16px", fontWeight: 700,
                                        color: "#111827", margin: 0,
                                        fontFamily: "Space Grotesk, sans-serif"
                                    }}>13,388</p>
                                </div>
                                <div style={{ textAlign: "center" }}>
                                    <p style={{
                                        fontSize: "11px", color: "#9CA3AF",
                                        fontFamily: "Inter, sans-serif", margin: "0 0 2px"
                                    }}>
                                        Pro Users
                                    </p>
                                    <p style={{
                                        fontSize: "16px", fontWeight: 700,
                                        color: T, margin: 0,
                                        fontFamily: "Space Grotesk, sans-serif"
                                    }}>892</p>
                                </div>
                                <div style={{ textAlign: "center" }}>
                                    <p style={{
                                        fontSize: "11px", color: "#9CA3AF",
                                        fontFamily: "Inter, sans-serif", margin: "0 0 2px"
                                    }}>
                                        Conversion
                                    </p>
                                    <p style={{
                                        fontSize: "16px", fontWeight: 700,
                                        color: "#F59E0B", margin: 0,
                                        fontFamily: "Space Grotesk, sans-serif"
                                    }}>6.2%</p>
                                </div>
                            </div>
                        </div>
                    </ChartCard>
                </div>
            </div>
        </>
    );
}