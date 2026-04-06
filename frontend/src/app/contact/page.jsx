"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Mail, MapPin, Send, Loader2 } from "lucide-react";
import { submitContactForm } from "@/api/public";
import toast, { Toaster } from "react-hot-toast";

const T = "#0D9488";

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        message: "",
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await submitContactForm(formData);
            toast.success("Message sent successfully! We'll get back to you soon.");
            setFormData({ name: "", email: "", phone: "", message: "" });
        } catch (error) {
            toast.error(error?.response?.data?.message || "Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#f8fafc" }}>
            <Toaster position="top-center" />
            <Navbar />

            <style dangerouslySetInnerHTML={{
                __html: `
                .spin { animation: spin 1s linear infinite; }
                @keyframes spin { 100% { transform: rotate(360deg); } }
                @media (max-width: 768px) {
                    .contact-grid { grid-template-columns: 1fr !important; padding: 24px !important; gap: 40px !important; }
                }
            `}} />

            <main style={{ flex: 1, padding: "64px 24px" }}>
                <div style={{ maxWidth: "1000px", margin: "0 auto", background: "#fff", borderRadius: "20px", padding: "48px", boxShadow: "0 10px 40px rgba(0,0,0,0.03)", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "64px" }} className="contact-grid">

                    {/* Left: Info */}
                    <div>
                        <h1 style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: "40px", fontWeight: 800, color: "#111827", margin: "0 0 16px" }}>Get in <span style={{ color: T }}>touch</span></h1>
                        <p style={{ fontSize: "16px", color: "#64748B", margin: "0 0 48px", lineHeight: "1.6" }}>
                            Have questions about our tools, pricing, or need custom solutions? We're here to help. Reach out to the DocMinty team.
                        </p>

                        <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
                            <div style={{ display: "flex", alignItems: "flex-start", gap: "16px" }}>
                                <div style={{ width: "56px", height: "56px", borderRadius: "16px", background: "#F0FDFA", color: T, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                    <Mail size={24} />
                                </div>
                                <div style={{ marginTop: "4px" }}>
                                    <p style={{ fontSize: "14px", fontWeight: 700, color: "#111827", margin: "0 0 6px" }}>Email</p>
                                    <p style={{ fontSize: "16px", color: "#64748B", margin: 0 }}>docmintyofficial@gmail.com</p>
                                </div>
                            </div>

                            <div style={{ display: "flex", alignItems: "flex-start", gap: "16px" }}>
                                <div style={{ width: "56px", height: "56px", borderRadius: "16px", background: "#F0FDFA", color: T, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                    <MapPin size={24} />
                                </div>
                                <div style={{ marginTop: "4px" }}>
                                    <p style={{ fontSize: "14px", fontWeight: 700, color: "#111827", margin: "0 0 6px" }}>Office</p>
                                    <p style={{ fontSize: "16px", color: "#64748B", margin: 0, lineHeight: "1.5" }}>Anna Nagar, Chennai, India</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Form */}
                    <div style={{ background: "#F8FAFC", padding: "36px", borderRadius: "16px", border: "1px solid #E2E8F0" }}>
                        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                            <div>
                                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#334155", marginBottom: "8px" }}>Full Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    placeholder="John Doe"
                                    style={{ width: "100%", padding: "14px 16px", borderRadius: "10px", border: "1px solid #CBD5E1", fontSize: "15px", outline: "none", transition: "border 0.2s" }}
                                    onFocus={(e) => e.target.style.borderColor = T}
                                    onBlur={(e) => e.target.style.borderColor = "#CBD5E1"}
                                />
                            </div>

                            <div>
                                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#334155", marginBottom: "8px" }}>Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    placeholder="john@example.com"
                                    style={{ width: "100%", padding: "14px 16px", borderRadius: "10px", border: "1px solid #CBD5E1", fontSize: "15px", outline: "none", transition: "border 0.2s" }}
                                    onFocus={(e) => e.target.style.borderColor = T}
                                    onBlur={(e) => e.target.style.borderColor = "#CBD5E1"}
                                />
                            </div>

                            <div>
                                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#334155", marginBottom: "8px" }}>Phone Number</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                    placeholder="+91 98765 43210"
                                    style={{ width: "100%", padding: "14px 16px", borderRadius: "10px", border: "1px solid #CBD5E1", fontSize: "15px", outline: "none", transition: "border 0.2s" }}
                                    onFocus={(e) => e.target.style.borderColor = T}
                                    onBlur={(e) => e.target.style.borderColor = "#CBD5E1"}
                                />
                            </div>

                            <div>
                                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#334155", marginBottom: "8px" }}>Message</label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    placeholder="How can we help you?"
                                    rows={4}
                                    style={{ width: "100%", padding: "14px 16px", borderRadius: "10px", border: "1px solid #CBD5E1", fontSize: "15px", outline: "none", transition: "border 0.2s", resize: "vertical" }}
                                    onFocus={(e) => e.target.style.borderColor = T}
                                    onBlur={(e) => e.target.style.borderColor = "#CBD5E1"}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                style={{
                                    marginTop: "12px",
                                    width: "100%",
                                    padding: "16px",
                                    background: T,
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: "10px",
                                    fontSize: "15px",
                                    fontWeight: 700,
                                    cursor: loading ? "not-allowed" : "pointer",
                                    opacity: loading ? 0.7 : 1,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: "10px",
                                    transition: "background 0.2s"
                                }}
                            >
                                {loading ? <Loader2 size={18} className="spin" /> : <Send size={18} />}
                                {loading ? "Sending..." : "Send Message"}
                            </button>
                        </form>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
