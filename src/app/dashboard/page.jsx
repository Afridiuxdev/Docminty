"use client";
import { useState } from "react";
import Link from "next/link";
import DashHeader from "@/components/dashboard/DashHeader";
import UsageBar from "@/components/dashboard/UsageBar";
import DocCard from "@/components/dashboard/DocCard";
import {
    FileText, Receipt, Award, FileCheck,
    ArrowRight, TrendingUp, Clock, Star,
} from "lucide-react";

const T = "#0D9488";

const QUICK_CREATE = [
    { label: "GST Invoice", href: "/invoice", icon: "📄", color: T },
    { label: "Quotation", href: "/quotation", icon: "💬", color: "#F59E0B" },
    { label: "Salary Slip", href: "/salary-slip", icon: "💰", color: "#7C3AED" },
    { label: "Receipt", href: "/receipt", icon: "🧾", color: "#3B82F6" },
    { label: "Rent Receipt", href: "/rent-receipt", icon: "🏠", color: "#10B981" },
    { label: "Certificate", href: "/certificate", icon: "🏆", color: "#EC4899" },
    { label: "Experience Letter", href: "/experience-letter", icon: "📋", color: "#6366F1" },
    { label: "Purchase Order", href: "/purchase-order", icon: "🛒", color: "#D97706" },
];

const RECENT_DOCS = [
    { id: 1, type: "GST Invoice", name: "Invoice #INV-2026-014", amount: "Rs. 24,500", date: "Today, 2:30 PM" },
    { id: 2, type: "Quotation", name: "Quote for Mehta Ltd", amount: "Rs. 48,000", date: "Yesterday, 11:00 AM" },
    { id: 3, type: "Salary Slip", name: "March Salary - Ravi Kumar", amount: "Rs. 42,800", date: "21 Mar 2026" },
    { id: 4, type: "Rent Receipt", name: "March Rent Receipt", amount: "Rs. 18,000", date: "19 Mar 2026" },
];

const STATS = [
    { label: "Docs This Month", value: 14, icon: <TrendingUp size={18} color={T} />, bg: "#F0FDFA" },
    { label: "Total Downloads", value: 142, icon: <FileText size={18} color="#7C3AED" />, bg: "#F5F3FF" },
    { label: "Last Created", value: "2h", icon: <Clock size={18} color="#F59E0B" />, bg: "#FFFBEB" },
    { label: "Plan", value: "Free", icon: <Star size={18} color="#9CA3AF" />, bg: "#F8F9FA" },
];

export default function DashboardPage() {
    const [docs, setDocs] = useState(RECENT_DOCS);
    const deleteDoc = (id) => setDocs(prev => prev.filter(d => d.id !== id));

    return (
        <>
            <DashHeader
                title="Dashboard"
                subtitle="Welcome back, Mohamed!"
            />

            <div style={{ padding: "24px" }}>

                {/* Stats row */}
                <div style={{
                    display: "grid", gridTemplateColumns: "repeat(4, 1fr)",
                    gap: "12px", marginBottom: "24px",
                }}>
                    {STATS.map((s, i) => (
                        <div key={i} style={{
                            background: "#fff",
                            border: "1px solid #E5E7EB",
                            borderRadius: "10px",
                            padding: "16px",
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                        }}>
                            <div style={{
                                width: "40px", height: "40px",
                                background: s.bg, borderRadius: "10px",
                                display: "flex", alignItems: "center",
                                justifyContent: "center", flexShrink: 0,
                            }}>
                                {s.icon}
                            </div>
                            <div>
                                <p style={{
                                    fontFamily: "Space Grotesk, sans-serif",
                                    fontWeight: 800, fontSize: "20px",
                                    color: "#111827", margin: 0,
                                }}>{s.value}</p>
                                <p style={{
                                    fontSize: "11px", color: "#9CA3AF",
                                    margin: 0, fontFamily: "Inter, sans-serif",
                                }}>{s.label}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Main grid */}
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 280px",
                    gap: "20px",
                }}>
                    {/* Left column */}
                    <div>
                        {/* Quick create */}
                        <div style={{
                            background: "#fff",
                            border: "1px solid #E5E7EB",
                            borderRadius: "12px",
                            padding: "20px",
                            marginBottom: "20px",
                        }}>
                            <div style={{
                                display: "flex", justifyContent: "space-between",
                                alignItems: "center", marginBottom: "16px",
                            }}>
                                <p style={{
                                    fontFamily: "Space Grotesk, sans-serif",
                                    fontWeight: 700, fontSize: "14px",
                                    color: "#111827", margin: 0,
                                }}>Quick Create</p>
                                <Link href="/dashboard/create" style={{
                                    fontSize: "12px", color: T,
                                    fontFamily: "Inter, sans-serif",
                                    fontWeight: 600, textDecoration: "none",
                                    display: "flex", alignItems: "center", gap: "3px",
                                }}>
                                    See all <ArrowRight size={12} />
                                </Link>
                            </div>
                            <div style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(4, 1fr)",
                                gap: "8px",
                            }}>
                                {QUICK_CREATE.map((item, i) => (
                                    <Link key={i} href={item.href} style={{
                                        display: "flex", flexDirection: "column",
                                        alignItems: "center", gap: "8px",
                                        padding: "14px 8px",
                                        border: "1px solid #E5E7EB",
                                        borderRadius: "10px",
                                        textDecoration: "none",
                                        transition: "all 150ms",
                                        background: "#FAFAFA",
                                    }}
                                        onMouseEnter={e => {
                                            e.currentTarget.style.borderColor = item.color;
                                            e.currentTarget.style.background = "#fff";
                                            e.currentTarget.style.transform = "translateY(-2px)";
                                            e.currentTarget.style.boxShadow = `0 4px 12px ${item.color}20`;
                                        }}
                                        onMouseLeave={e => {
                                            e.currentTarget.style.borderColor = "#E5E7EB";
                                            e.currentTarget.style.background = "#FAFAFA";
                                            e.currentTarget.style.transform = "translateY(0)";
                                            e.currentTarget.style.boxShadow = "none";
                                        }}
                                    >
                                        <span style={{ fontSize: "22px" }}>{item.icon}</span>
                                        <span style={{
                                            fontSize: "11px", fontWeight: 600,
                                            color: "#374151", textAlign: "center",
                                            fontFamily: "Inter, sans-serif",
                                            lineHeight: 1.3,
                                        }}>{item.label}</span>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Recent docs */}
                        <div style={{
                            background: "#fff",
                            border: "1px solid #E5E7EB",
                            borderRadius: "12px",
                            padding: "20px",
                        }}>
                            <div style={{
                                display: "flex", justifyContent: "space-between",
                                alignItems: "center", marginBottom: "16px",
                            }}>
                                <p style={{
                                    fontFamily: "Space Grotesk, sans-serif",
                                    fontWeight: 700, fontSize: "14px",
                                    color: "#111827", margin: 0,
                                }}>Recent Documents</p>
                                <Link href="/dashboard/documents" style={{
                                    fontSize: "12px", color: T,
                                    fontFamily: "Inter, sans-serif",
                                    fontWeight: 600, textDecoration: "none",
                                    display: "flex", alignItems: "center", gap: "3px",
                                }}>
                                    View all <ArrowRight size={12} />
                                </Link>
                            </div>
                            <div style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(2, 1fr)",
                                gap: "12px",
                            }}>
                                {docs.map(doc => (
                                    <DocCard key={doc.id} doc={doc} onDelete={deleteDoc} />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right sidebar */}
                    <div style={{
                        display: "flex", flexDirection: "column", gap: "16px",
                    }}>
                        {/* Usage */}
                        <div style={{
                            background: "#fff",
                            border: "1px solid #E5E7EB",
                            borderRadius: "12px",
                            padding: "18px",
                        }}>
                            <p style={{
                                fontFamily: "Space Grotesk, sans-serif",
                                fontWeight: 700, fontSize: "13px",
                                color: "#111827", margin: "0 0 14px",
                            }}>Usage This Month</p>
                            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                                <UsageBar label="Documents" used={14} total={50} />
                                <UsageBar label="PDF Downloads" used={142} total={200} color="#7C3AED" />
                                <UsageBar label="Storage" used={12} total={100} unit=" MB" color="#F59E0B" />
                            </div>

                            <div style={{
                                marginTop: "14px", padding: "10px 12px",
                                background: "#F0FDFA",
                                border: `1px solid ${T}`,
                                borderRadius: "8px",
                            }}>
                                <p style={{
                                    fontSize: "11px", color: "#065F46",
                                    fontFamily: "Inter, sans-serif",
                                    margin: "0 0 6px", fontWeight: 600,
                                }}>Upgrade to Pro</p>
                                <p style={{
                                    fontSize: "11px", color: "#6B7280",
                                    fontFamily: "Inter, sans-serif",
                                    margin: "0 0 8px", lineHeight: 1.5,
                                }}>
                                    Unlimited docs, batch processing, cloud storage
                                </p>
                                <Link href="/dashboard/billing" style={{
                                    display: "block", textAlign: "center",
                                    padding: "7px", background: T,
                                    color: "#fff", borderRadius: "6px",
                                    fontSize: "12px", fontWeight: 700,
                                    textDecoration: "none",
                                    fontFamily: "Space Grotesk, sans-serif",
                                }}>
                                    Upgrade — Rs. 199/mo
                                </Link>
                            </div>
                        </div>

                        {/* Activity timeline */}
                        <div style={{
                            background: "#fff",
                            border: "1px solid #E5E7EB",
                            borderRadius: "12px",
                            padding: "18px",
                        }}>
                            <p style={{
                                fontFamily: "Space Grotesk, sans-serif",
                                fontWeight: 700, fontSize: "13px",
                                color: "#111827", margin: "0 0 14px",
                            }}>Recent Activity</p>
                            <div style={{ display: "flex", flexDirection: "column" }}>
                                {[
                                    { action: "Created GST Invoice #014", time: "2h ago", color: T },
                                    { action: "Downloaded Quotation PDF", time: "1d ago", color: "#F59E0B" },
                                    { action: "Created Salary Slip", time: "2d ago", color: "#7C3AED" },
                                    { action: "Account created", time: "7d ago", color: "#10B981" },
                                ].map((a, i) => (
                                    <div key={i} style={{
                                        display: "flex", gap: "10px",
                                        alignItems: "flex-start",
                                        paddingBottom: "12px",
                                        marginBottom: "12px",
                                        borderBottom: i < 3 ? "1px solid #F3F4F6" : "none",
                                    }}>
                                        <div style={{
                                            width: "7px", height: "7px",
                                            borderRadius: "50%",
                                            background: a.color,
                                            flexShrink: 0,
                                            marginTop: "4px",
                                        }} />
                                        <div>
                                            <p style={{
                                                fontSize: "12px", color: "#374151",
                                                fontFamily: "Inter, sans-serif",
                                                margin: "0 0 2px", fontWeight: 500,
                                            }}>{a.action}</p>
                                            <p style={{
                                                fontSize: "11px", color: "#D1D5DB",
                                                fontFamily: "Inter, sans-serif", margin: 0,
                                            }}>{a.time}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Quick links */}
                        <div style={{
                            background: "#fff",
                            border: "1px solid #E5E7EB",
                            borderRadius: "12px",
                            padding: "18px",
                        }}>
                            <p style={{
                                fontFamily: "Space Grotesk, sans-serif",
                                fontWeight: 700, fontSize: "13px",
                                color: "#111827", margin: "0 0 12px",
                            }}>Quick Tools</p>
                            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                                {[
                                    { label: "GST Calculator", href: "/calculators/gst-calculator", icon: "🇮🇳" },
                                    { label: "EMI Calculator", href: "/calculators/emi-calculator", icon: "🏦" },
                                    { label: "Merge PDF", href: "/tools/merge-pdf", icon: "🔗" },
                                    { label: "Compress PDF", href: "/tools/compress-pdf", icon: "🗜️" },
                                ].map((t, i) => (
                                    <Link key={i} href={t.href} style={{
                                        display: "flex", alignItems: "center",
                                        gap: "8px", padding: "8px 10px",
                                        borderRadius: "8px",
                                        textDecoration: "none",
                                        transition: "background 150ms",
                                    }}
                                        onMouseEnter={e => e.currentTarget.style.background = "#F8F9FA"}
                                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                                    >
                                        <span style={{ fontSize: "15px" }}>{t.icon}</span>
                                        <span style={{
                                            fontSize: "12px", color: "#374151",
                                            fontFamily: "Inter, sans-serif", fontWeight: 500,
                                        }}>{t.label}</span>
                                        <ArrowRight size={11} color="#D1D5DB" style={{ marginLeft: "auto" }} />
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}