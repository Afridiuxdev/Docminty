"use client";
import AdminHeader from "@/components/admin/AdminHeader";
import StatCard from "@/components/admin/StatCard";
import ChartCard from "@/components/admin/ChartCard";

const T = "#0D9488";

const DAILY_EARN = [
    { day: "18 Mar", earn: 980, clicks: 142, imp: 12400 },
    { day: "19 Mar", earn: 1120, clicks: 164, imp: 14200 },
    { day: "20 Mar", earn: 1240, clicks: 182, imp: 15800 },
    { day: "21 Mar", earn: 1060, clicks: 156, imp: 13600 },
    { day: "22 Mar", earn: 1380, clicks: 198, imp: 17200 },
    { day: "23 Mar", earn: 1180, clicks: 172, imp: 14800 },
    { day: "24 Mar", earn: 1420, clicks: 208, imp: 18400 },
];
const MAX_E = Math.max(...DAILY_EARN.map(d => d.earn));

const AD_SLOTS = [
    { slot: "Invoice Page Sidebar", id: "SLOT_ID_INVOICE", earn: "Rs. 4,280", rpm: "Rs. 42", ctr: "1.8%", imp: 18400, status: "Active" },
    { slot: "Quotation Page Sidebar", id: "SLOT_ID_QUOTATION", earn: "Rs. 2,840", rpm: "Rs. 38", ctr: "1.6%", imp: 12200, status: "Active" },
    { slot: "Receipt Page Bottom", id: "SLOT_ID_RECEIPT", earn: "Rs. 1,920", rpm: "Rs. 28", ctr: "1.2%", imp: 9800, status: "Active" },
    { slot: "Salary Slip Sidebar", id: "SLOT_ID_SALARY", earn: "Rs. 3,640", rpm: "Rs. 44", ctr: "1.9%", imp: 14200, status: "Active" },
    { slot: "Certificate Page", id: "SLOT_ID_CERT", earn: "Rs. 1,240", rpm: "Rs. 22", ctr: "1.0%", imp: 6800, status: "Active" },
    { slot: "Calculators Banner", id: "SLOT_ID_CALC", earn: "Rs. 980", rpm: "Rs. 18", ctr: "0.9%", imp: 5400, status: "Inactive" },
    { slot: "Tools Page Top", id: "SLOT_ID_TOOLS", earn: "Rs. 820", rpm: "Rs. 16", ctr: "0.8%", imp: 4800, status: "Inactive" },
];

export default function AdminAdSensePage() {
    return (
        <>
            <AdminHeader title="AdSense" subtitle="Ad performance and earnings overview" />
            <div style={{ padding: "24px 28px" }}>

                <div style={{
                    display: "grid", gridTemplateColumns: "repeat(4,1fr)",
                    gap: "16px", marginBottom: "24px",
                }}>
                    <StatCard title="Today's Earnings" value="Rs. 1,240" change={4.2} icon="💰" bgColor="#F0FDFA" />
                    <StatCard title="This Month" value="Rs. 28,400" change={9.1} icon="📅" bgColor="#ECFDF5" />
                    <StatCard title="Total Impressions" value="1,84,200" change={14.6} icon="👁" bgColor="#F5F3FF" />
                    <StatCard title="Avg CTR" value="1.4%" change={0.2} icon="🖱" bgColor="#FEF9C3" />
                </div>

                <div style={{
                    display: "grid", gridTemplateColumns: "2fr 1fr",
                    gap: "20px", marginBottom: "24px",
                }}>
                    <ChartCard title="Daily Earnings" subtitle="Last 7 days AdSense revenue">
                        <div style={{
                            display: "flex", alignItems: "flex-end",
                            gap: "12px", height: "180px",
                        }}>
                            {DAILY_EARN.map((d, i) => (
                                <div key={i} style={{
                                    flex: 1, display: "flex",
                                    flexDirection: "column", alignItems: "center", gap: "6px",
                                }}>
                                    <span style={{
                                        fontSize: "10px", fontWeight: 700,
                                        color: "#6B7280", fontFamily: "Inter, sans-serif",
                                    }}>Rs.{d.earn}</span>
                                    <div style={{
                                        width: "100%", borderRadius: "4px 4px 0 0",
                                        background: i === DAILY_EARN.length - 1 ? "#F59E0B" : "#FEF9C3",
                                        height: `${(d.earn / MAX_E) * 140}px`,
                                        minHeight: "8px",
                                    }} />
                                    <span style={{
                                        fontSize: "10px", color: "#9CA3AF",
                                        fontFamily: "Inter, sans-serif",
                                        textAlign: "center",
                                        transform: "rotate(-20deg)",
                                        display: "block",
                                    }}>{d.day.split(" ")[0]}</span>
                                </div>
                            ))}
                        </div>
                    </ChartCard>

                    <ChartCard title="Revenue Metrics">
                        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                            {[
                                { label: "RPM (per 1000 imp)", value: "Rs. 154", color: "#F59E0B" },
                                { label: "CPC (avg)", value: "Rs. 6.80", color: T },
                                { label: "Fill Rate", value: "94.2%", color: "#10B981" },
                                { label: "Active Ad Units", value: "5/7", color: "#6366F1" },
                            ].map((m, i) => (
                                <div key={i} style={{
                                    display: "flex", justifyContent: "space-between",
                                    alignItems: "center", padding: "10px 12px",
                                    background: "#F8F9FA", borderRadius: "8px",
                                }}>
                                    <span style={{
                                        fontSize: "12px", color: "#6B7280",
                                        fontFamily: "Inter, sans-serif",
                                    }}>{m.label}</span>
                                    <span style={{
                                        fontSize: "14px", fontWeight: 700,
                                        color: m.color, fontFamily: "Space Grotesk, sans-serif",
                                    }}>{m.value}</span>
                                </div>
                            ))}
                            <div style={{
                                padding: "12px", background: "#FFFBEB",
                                border: "1px solid #F59E0B", borderRadius: "8px",
                                textAlign: "center", marginTop: "4px",
                            }}>
                                <p style={{
                                    fontSize: "11px", color: "#92400E",
                                    fontFamily: "Inter, sans-serif", margin: "0 0 3px",
                                }}>Publisher ID</p>
                                <p style={{
                                    fontFamily: "monospace", fontSize: "12px",
                                    fontWeight: 700, color: "#92400E", margin: 0,
                                }}>ca-pub-XXXXXXXX</p>
                            </div>
                        </div>
                    </ChartCard>
                </div>

                {/* Ad slots table */}
                <ChartCard title="Ad Slots Performance" subtitle="Performance breakdown by ad placement">
                    <div style={{ overflowX: "auto" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse" }}>
                            <thead>
                                <tr style={{ background: "#F8F9FA" }}>
                                    {["Ad Slot", "Slot ID", "Earnings", "RPM", "CTR", "Impressions", "Status"].map(h => (
                                        <th key={h} style={{
                                            padding: "10px 14px", textAlign: "left",
                                            fontSize: "11px", fontWeight: 700,
                                            color: "#6B7280", textTransform: "uppercase",
                                            letterSpacing: "0.06em", fontFamily: "Inter, sans-serif",
                                            borderBottom: "1px solid #E5E7EB", whiteSpace: "nowrap",
                                        }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {AD_SLOTS.map((s, i) => (
                                    <tr key={i} style={{ borderBottom: "1px solid #F3F4F6" }}
                                        onMouseEnter={e => e.currentTarget.style.background = "#FAFAFA"}
                                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                                    >
                                        <td style={{ padding: "12px 14px", fontSize: "13px", fontWeight: 600, color: "#111827", fontFamily: "Inter, sans-serif" }}>{s.slot}</td>
                                        <td style={{ padding: "12px 14px" }}><span style={{ fontFamily: "monospace", fontSize: "11px", color: "#9CA3AF" }}>{s.id}</span></td>
                                        <td style={{ padding: "12px 14px", fontSize: "13px", fontWeight: 700, color: T, fontFamily: "Space Grotesk, sans-serif" }}>{s.earn}</td>
                                        <td style={{ padding: "12px 14px", fontSize: "13px", color: "#374151", fontFamily: "Inter, sans-serif" }}>{s.rpm}</td>
                                        <td style={{ padding: "12px 14px", fontSize: "13px", color: "#374151", fontFamily: "Inter, sans-serif" }}>{s.ctr}</td>
                                        <td style={{ padding: "12px 14px", fontSize: "13px", color: "#374151", fontFamily: "Inter, sans-serif" }}>{s.imp.toLocaleString("en-IN")}</td>
                                        <td style={{ padding: "12px 14px" }}>
                                            <span style={{
                                                background: s.status === "Active" ? "#ECFDF5" : "#F3F4F6",
                                                color: s.status === "Active" ? "#10B981" : "#9CA3AF",
                                                padding: "2px 10px", borderRadius: "20px",
                                                fontSize: "11px", fontWeight: 700, fontFamily: "Inter, sans-serif",
                                            }}>{s.status}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </ChartCard>
            </div>
        </>
    );
}