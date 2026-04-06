"use client";
import Navbar from "./Navbar";
import Footer from "./Footer";
import AdSense from "./AdSense";
// ... rest stays the same

export default function DocLayout({
    title,
    description,
    leftPanel,
    rightPanel,
}) {
    return (
        <>
            <Navbar />
            <main style={{ minHeight: "100vh", background: "#F8F7F4" }}>

                {/* Page header */}
                <div style={{
                    background: "#fff",
                    borderBottom: "1px solid #E5E7EB",
                    padding: "16px 24px",
                }}>
                    <div style={{
                        maxWidth: "1300px",
                        margin: "0 auto",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}>
                        <div>
                            <h1 style={{
                                fontFamily: "Plus Jakarta Sans, sans-serif",
                                fontSize: "20px", fontWeight: 700,
                                margin: 0, color: "#111827",
                            }}>
                                {title}
                            </h1>
                            {description && (
                                <p style={{
                                    fontSize: "13px", color: "#6B7280",
                                    margin: "2px 0 0",
                                    fontFamily: "Inter, sans-serif",
                                }}>
                                    {description}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Two panel layout */}
                <div className="doc-grid" style={{
                    maxWidth: "1300px",
                    margin: "0 auto",
                    padding: "24px",
                    display: "grid",
                    gridTemplateColumns: "480px 1fr",
                    gap: "24px",
                    alignItems: "start",
                }}>

                    {/* Left: Form panel */}
                    <div style={{
                        background: "#fff",
                        border: "1px solid #E5E7EB",
                        borderRadius: "12px",
                        padding: "24px",
                        position: "sticky",
                        top: "80px",
                        maxHeight: "calc(100vh - 100px)",
                        overflowY: "auto",
                    }}>
                        {leftPanel}
                    </div>

                    {/* Right: Preview panel */}
                    <div style={{
                        background: "#fff",
                        border: "1px solid #E5E7EB",
                        borderRadius: "12px",
                        padding: "24px",
                        minHeight: "600px",
                    }}>
                        {rightPanel}
                    </div>
                </div>

                {/* Ad below tool */}
                <div style={{
                    maxWidth: "1300px",
                    margin: "0 auto",
                    padding: "0 24px 40px",
                }}>
                    <AdSense adSlot="SLOT_ID_2" />
                </div>
            </main>

            {/* Sticky sidebar ad */}
            <AdSense adSlot="SLOT_ID_3" sidebarFixed />

            <Footer />
        </>
    );
}