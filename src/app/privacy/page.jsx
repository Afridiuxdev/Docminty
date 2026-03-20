"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function PrivacyPage() {
    return (
        <>
            <Navbar />
            <main style={{
                maxWidth: "720px", margin: "0 auto",
                padding: "64px 24px"
            }}>
                <h1 style={{
                    fontFamily: "Space Grotesk, sans-serif",
                    fontSize: "32px", fontWeight: 700,
                    color: "#111827", margin: "0 0 8px"
                }}>
                    Privacy Policy
                </h1>
                <p style={{
                    fontSize: "13px", color: "#9CA3AF",
                    fontFamily: "Inter, sans-serif",
                    margin: "0 0 32px"
                }}>
                    Last updated: March 2026
                </p>
                {[
                    ["Data We Collect",
                        "We collect only the information you provide when creating documents — business names, addresses, and document data. We do not store free-tier documents on our servers."],
                    ["How We Use Your Data",
                        "Your data is used solely to generate the documents you request. We do not sell, share, or use your data for advertising purposes."],
                    ["Cookies",
                        "We use minimal cookies for session management and analytics. We do not use tracking cookies."],
                    ["Data Security",
                        "All data is transmitted over HTTPS. Pro plan document storage is encrypted at rest."],
                    ["Contact",
                        "For privacy concerns, contact us at privacy@docminty.com"],
                ].map(([title, body]) => (
                    <div key={title} style={{ marginBottom: "28px" }}>
                        <h2 style={{
                            fontFamily: "Space Grotesk, sans-serif",
                            fontSize: "18px", fontWeight: 700,
                            color: "#111827", margin: "0 0 8px"
                        }}>{title}</h2>
                        <p style={{
                            fontSize: "15px", color: "#374151",
                            fontFamily: "Inter, sans-serif",
                            lineHeight: 1.8, margin: 0
                        }}>{body}</p>
                    </div>
                ))}
            </main>
            <Footer />
        </>
    );
}