"use client";

import React, { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowRight, FileText, QrCode, FileSearch, Home } from "lucide-react";

const QuickLinkCard = ({ link, T }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <Link 
            href={link.href} 
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{ 
                background: isHovered ? "#fff" : "#F8FAFC", 
                border: `1px solid ${isHovered ? T : "#E2E8F0"}`, 
                borderRadius: "16px", 
                padding: "32px 24px", 
                textDecoration: "none",
                textAlign: "left",
                transition: "all 300ms ease",
                display: "block",
                transform: isHovered ? "translateY(-8px)" : "translateY(0)",
                boxShadow: isHovered ? "0 20px 40px rgba(13, 148, 136, 0.08)" : "none"
            }}
        >
            <div style={{ 
                width: "54px", height: "54px", borderRadius: "14px", 
                backgroundColor: isHovered ? T : "#fff", 
                color: isHovered ? "#fff" : T, 
                display: "flex", alignItems: "center", justifyContent: "center",
                marginBottom: "20px", 
                boxShadow: "0 4px 10px rgba(0,0,0,0.03)",
                transition: "all 300ms ease"
            }}>
                {link.icon}
            </div>
            <h4 style={{ 
                fontFamily: "Space Grotesk, sans-serif", 
                fontSize: "18px", 
                fontWeight: 700, 
                color: "#1E293B", 
                margin: "0 0 8px" 
            }}>{link.title}</h4>
            <p style={{ 
                fontFamily: "Inter, sans-serif", 
                fontSize: "14px", 
                color: "#64748B", 
                lineHeight: 1.5,
                margin: "0 0 16px" 
            }}>{link.description}</p>
            <div style={{ 
                display: "flex", alignItems: "center", gap: "6px", 
                fontSize: "14px", fontWeight: 700, color: T,
                fontFamily: "Space Grotesk, sans-serif" 
            }}>
                Get Started <ArrowRight size={14} />
            </div>
        </Link>
    );
};

export default function NotFound() {
    const T = "#0D9488"; // Primary Teal
    const DT = "#134E4A"; // Dark Teal

    const quickLinks = [
        { 
            title: "GST Invoice", 
            description: "Create professional GST-compliant invoices in seconds.", 
            icon: <FileText size={24} />, 
            href: "/invoice" 
        },
        { 
            title: "QR Generator", 
            description: "Design high-resolution, scanable QR codes for free.", 
            icon: <QrCode size={24} />, 
            href: "/qr-code" 
        },
        { 
            title: "PDF Tools", 
            description: "Merge, split, and compress your PDF documents easily.", 
            icon: <FileSearch size={24} />, 
            href: "/pdf-tools" 
        }
    ];

    return (
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: "#fff" }}>
            <Navbar />

            <main style={{ flexGrow: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "80px 24px" }}>
                <div style={{ maxWidth: "1000px", width: "100%", textAlign: "center" }}>
                    
                    {/* Hero Section */}
                    <div style={{ marginBottom: "64px" }}>
                        <h1 style={{ 
                            fontFamily: "Space Grotesk, sans-serif", 
                            fontSize: "clamp(80px, 15vw, 180px)", 
                            fontWeight: 800, 
                            background: `linear-gradient(to bottom, ${T}, ${DT})`,
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            lineHeight: 1,
                            margin: 0,
                            letterSpacing: "-0.05em"
                        }}>404</h1>
                        
                        <h2 style={{ 
                            fontFamily: "Space Grotesk, sans-serif", 
                            fontSize: "clamp(24px, 4vw, 36px)", 
                            fontWeight: 800, 
                            color: "#1E293B", 
                            marginTop: "12px",
                            marginBottom: "16px" 
                        }}>Oops! This document is missing.</h2>
                        
                        <p style={{ 
                            fontFamily: "Inter, sans-serif", 
                            fontSize: "18px", 
                            color: "#64748B", 
                            maxWidth: "600px", 
                            margin: "0 auto 40px",
                            lineHeight: 1.6
                        }}>
                            Error 404: The page you're looking for got lost in the paperwork. 
                            Let's get you back to being productive.
                        </p>

                        <Link href="/" style={{ 
                            display: "inline-flex", 
                            alignItems: "center", 
                            gap: "8px",
                            padding: "16px 36px", 
                            background: T, 
                            color: "#fff", 
                            fontWeight: 700, 
                            borderRadius: "12px", 
                            textDecoration: "none", 
                            fontFamily: "Space Grotesk, sans-serif",
                            boxShadow: "0 10px 25px rgba(13, 148, 136, 0.2)",
                            transition: "all 300ms ease"
                        }}>
                            <Home size={20} /> Back to Homepage
                        </Link>
                    </div>

                    {/* Quick Access Grid */}
                    <div style={{ marginTop: "80px" }}>
                        <h3 style={{ 
                            fontFamily: "Space Grotesk, sans-serif", 
                            fontSize: "18px", 
                            fontWeight: 700, 
                            color: "#1E293B", 
                            textTransform: "uppercase",
                            letterSpacing: "0.1em",
                            marginBottom: "32px"
                        }}>Or start with our popular tools</h3>
                        
                        <div style={{ 
                            display: "grid", 
                            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", 
                            gap: "24px" 
                        }}>
                            {quickLinks.map((link, i) => (
                                <QuickLinkCard key={i} link={link} T={T} />
                            ))}
                        </div>
                    </div>

                </div>
            </main>

            <Footer />
        </div>
    );
}
