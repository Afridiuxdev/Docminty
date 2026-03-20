"use client";
import AdminHeader from "@/components/admin/AdminHeader";
import StatCard from "@/components/admin/StatCard";
import ChartCard from "@/components/admin/ChartCard";

const T = "#0D9488";

const DAILY = [
    { day: "Mon", users: 420, docs: 1240 },
    { day: "Tue", users: 380, docs: 1080 },
    { day: "Wed", users: 510, docs: 1520 },
    { day: "Thu", users: 490, docs: 1380 },
    { day: "Fri", users: 620, docs: 1840 },
    { day: "Sat", users: 340, docs: 980 },
    { day: "Sun", users: 280, docs: 820 },
];

const TOP_STATES = [
    { state: "Maharashtra", users: 3240, pct: 23 },
    { state: "Delhi", users: 2180, pct: 15 },
    { state: "Karnataka", users: 1980, pct: 14 },
    { state: "Tamil Nadu", users: 1740, pct: 12 },
    { state: "Gujarat", users: 1420, pct: 10 },
    { state: "Telangana", users: 1180, pct: 8 },
    { state: "Rajasthan", users: 980, pct: 7 },
    { state: "Others", users: 1560, pct: 11 },
];

const TRAFFIC = [
    { source: "Organic Search", visits: 8240, pct: 58, color: T },
    { source: "Direct", visits: 2840, pct: 20, color: "#6366F1" },
    { source: "Social Media", visits: 1420, pct: 10, color: "#F59E0B" },
    { source: "Referral", visits: 980, pct: 7, color: "#EC4899" },
    { source: "Paid Ads", visits: 720, pct: 5, color: "#9CA3AF" },
];

const MAX_D = Math.max(...DAILY.map(d => d.docs));

export default function AdminAnalyticsPage() {
    return (
        <>
            <AdminHeader title="Analytics" subtitle="User behaviour and traffic insights" />
            <div style={{ padding: "24px 28px" }}>

                <div style={{
                    display: "grid", gridTemplateColumns: "repeat(4,1fr)",
                    gap: "16px", marginBottom: "24px",
                }}>
                    <StatCard title="Page Views" value="1,42,800" change={22.4} icon="👁" bgColor="#F0FDFA" />
                    <StatCard title="Unique Users" value={14280} change={12.1} icon="👤" bgColor="#F5F3FF" />
                    <StatCard title="Avg Session" value="4m 12s" change={8.3} icon="⏱" bgColor="#ECFDF5" />
                    <StatCard title="Bounce Rate" value="32.4%" changeType="down" change={3.2} icon="↩" bgColor="#FEF9C3" />
                </div>

                <div style={{
                    display: "grid", gridTemplateColumns: "2fr 1fr",
                    gap: "20px", marginBottom: "24px",
                }}>
                    {/* Daily chart */}
                    <ChartCard title="Daily Activity" subtitle="Users and documents this week">
                        <div style={{
                            display: "flex", alignItems: "flex-end",
                            gap: "8px", height: "180px",
                        }}>
                            {DAILY.map((d, i) => (
                                <div key={i} style={{
                                    flex: 1, display: "flex",
                                    flexDirection: "column", alignItems: "center", gap: "6px",
                                }}>
                                    <div style={{
                                        display: "flex", alignItems: "flex-end",
                                        gap: "3px", height: "140px",
                                    }}>
                                        <div style={{
                                            width: "14px", background: "#E0F2FE",
                                            borderRadius: "3px 3px 0 0",
                                            height: `${(d.users / 620) * 100}%`,
                                        }} />
                                        <div style={{
                                            width: "14px", background: T,
                                            borderRadius: "3px 3px 0 0",
                                            height: `${(d.docs / MAX_D) * 100}%`,
                                        }} />
                                    </div>
                                    <span style={{ fontSize: "11px", color: "#9CA3AF", fontFamily: "Inter, sans-serif" }}>{d.day}</span>
                                </div>
                            ))}
                        </div>
                        <div style={{ display: "flex", gap: "16px", marginTop: "12px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                <div style={{ width: "10px", height: "10px", borderRadius: "2px", background: "#E0F2FE" }} />
                                <span style={{ fontSize: "11px", color: "#6B7280", fontFamily: "Inter, sans-serif" }}>Users</span>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                <div style={{ width: "10px", height: "10px", borderRadius: "2px", background: T }} />
                                <span style={{ fontSize: "11px", color: "#6B7280", fontFamily: "Inter, sans-serif" }}>Documents</span>
                            </div>
                        </div>
                    </ChartCard>

                    {/* Traffic sources */}
                    <ChartCard title="Traffic Sources">
                        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                            {TRAFFIC.map((t, i) => (
                                <div key={i}>
                                    <div style={{
                                        display: "flex", justifyContent: "space-between",
                                        marginBottom: "4px",
                                    }}>
                                        <span style={{ fontSize: "12px", color: "#374151", fontFamily: "Inter, sans-serif" }}>{t.source}</span>
                                        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                                            <span style={{ fontSize: "11px", color: "#9CA3AF", fontFamily: "Inter, sans-serif" }}>
                                                {t.visits.toLocaleString("en-IN")}
                                            </span>
                                            <span style={{
                                                fontSize: "11px", fontWeight: 700,
                                                color: t.color, fontFamily: "Inter, sans-serif",
                                            }}>{t.pct}%</span>
                                        </div>
                                    </div>
                                    <div style={{ height: "5px", background: "#F3F4F6", borderRadius: "3px" }}>
                                        <div style={{
                                            height: "100%", background: t.color,
                                            borderRadius: "3px", width: `${t.pct}%`,
                                        }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </ChartCard>
                </div>

                {/* Top states */}
                <ChartCard title="Top States by Users" subtitle="Geographic distribution across India">
                    <div style={{
                        display: "grid", gridTemplateColumns: "repeat(4,1fr)",
                        gap: "12px",
                    }}>
                        {TOP_STATES.map((s, i) => (
                            <div key={i} style={{
                                padding: "14px", border: "1px solid #E5E7EB",
                                borderRadius: "10px",
                            }}>
                                <div style={{
                                    display: "flex", justifyContent: "space-between",
                                    alignItems: "flex-start", marginBottom: "8px",
                                }}>
                                    <span style={{
                                        fontSize: "13px", fontWeight: 600,
                                        color: "#111827", fontFamily: "Inter, sans-serif",
                                    }}>{s.state}</span>
                                    <span style={{
                                        fontSize: "11px", fontWeight: 700, color: T,
                                        background: "#F0FDFA", padding: "1px 6px",
                                        borderRadius: "8px", fontFamily: "Inter, sans-serif",
                                    }}>{s.pct}%</span>
                                </div>
                                <p style={{
                                    fontFamily: "Space Grotesk, sans-serif",
                                    fontWeight: 800, fontSize: "20px",
                                    color: "#111827", margin: "0 0 6px",
                                }}>{s.users.toLocaleString("en-IN")}</p>
                                <div style={{ height: "3px", background: "#F3F4F6", borderRadius: "2px" }}>
                                    <div style={{ height: "100%", background: T, borderRadius: "2px", width: `${s.pct}%` }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </ChartCard>
            </div>
        </>
    );
}