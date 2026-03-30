"use client";
import { useState, useEffect } from "react";
import DashHeader from "@/components/dashboard/DashHeader";
import { Camera, Save } from "lucide-react";
import { authApi } from "@/api/auth";

const T = "#0D9488";

function Field({ label, children }) {
    return (
        <div>
            <label style={{
                fontSize: "12px", fontWeight: 600,
                color: "#374151", display: "block",
                marginBottom: "5px",
                fontFamily: "Inter, sans-serif",
            }}>{label}</label>
            {children}
        </div>
    );
}

function Input({ value, onChange, type = "text", placeholder = "", disabled = false }) {
    return (
        <input
            type={type}
            value={value}
            placeholder={placeholder}
            disabled={disabled}
            onChange={e => !disabled && onChange(e.target.value)}
            style={{
                width: "100%", height: "38px",
                padding: "0 12px",
                border: "1px solid #E5E7EB",
                borderRadius: "8px", fontSize: "13px",
                color: disabled ? "#9CA3AF" : "#374151",
                background: disabled ? "#F9FAFB" : "#fff",
                outline: "none",
                fontFamily: "Inter, sans-serif",
                boxSizing: "border-box",
                cursor: disabled ? "not-allowed" : "text",
            }}
        />
    );
}

export default function DashProfilePage() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "+91 98765 43210",
        company: "Ali Enterprises",
        gstin: "27AABCU9603R1ZM",
        address: "123 MG Road, Mumbai",
        city: "Mumbai",
        state: "Maharashtra",
        pincode: "400001",
        website: "www.alienterprises.com",
        signature: "",
    });
    const [saved, setSaved] = useState(false);
    const update = (k, v) => setForm(p => ({ ...p, [k]: v }));

    useEffect(() => {
        authApi.me()
            .then(res => {
                const u = res.data.data;
                setForm(p => ({
                    ...p,
                    name: u.name || "",
                    email: u.email || "",
                    phone: u.phone || p.phone,
                    company: u.company || p.company,
                    gstin: u.gstin || p.gstin,
                    address: u.address || p.address,
                    city: u.city || p.city,
                    state: u.state || p.state,
                    pincode: u.pincode || p.pincode,
                    website: u.website || p.website,
                }));
            })
            .catch(err => console.error("Failed to fetch user:", err));
    }, []);

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    return (
        <>
            <DashHeader title="Profile" subtitle="Your account and business information" />
            <div style={{ padding: "24px", maxWidth: "720px" }}>

                {/* Avatar */}
                <div style={{
                    background: "#fff",
                    border: "1px solid #E5E7EB",
                    borderRadius: "12px", padding: "24px",
                    marginBottom: "20px",
                    display: "flex", alignItems: "center", gap: "20px",
                }}>
                    <div style={{ position: "relative" }}>
                        <div style={{
                            width: "72px", height: "72px",
                            borderRadius: "50%", background: T,
                            display: "flex", alignItems: "center",
                            justifyContent: "center",
                            fontSize: "26px", fontWeight: 700,
                            color: "#fff",
                            fontFamily: "Space Grotesk, sans-serif",
                        }}>
                            {(form.name || "U").charAt(0).toUpperCase()}
                        </div>
                        <button style={{
                            position: "absolute", bottom: 0, right: 0,
                            width: "24px", height: "24px",
                            background: "#fff", border: `2px solid ${T}`,
                            borderRadius: "50%", cursor: "pointer",
                            display: "flex", alignItems: "center",
                            justifyContent: "center",
                        }}>
                            <Camera size={11} color={T} />
                        </button>
                    </div>
                    <div>
                        <p style={{
                            fontFamily: "Space Grotesk, sans-serif",
                            fontWeight: 700, fontSize: "18px",
                            color: "#111827", margin: "0 0 3px",
                        }}>{form.name}</p>
                        <p style={{
                            fontSize: "13px", color: "#9CA3AF",
                            fontFamily: "Inter, sans-serif", margin: "0 0 6px",
                        }}>{form.email}</p>
                        <span style={{
                            background: "#F8F9FA", color: "#6B7280",
                            padding: "3px 10px", borderRadius: "12px",
                            fontSize: "11px", fontWeight: 600,
                            fontFamily: "Inter, sans-serif",
                        }}>Free Plan</span>
                    </div>
                </div>

                {/* Personal info */}
                <div style={{
                    background: "#fff", border: "1px solid #E5E7EB",
                    borderRadius: "12px", padding: "24px",
                    marginBottom: "20px",
                }}>
                    <p style={{
                        fontFamily: "Space Grotesk, sans-serif",
                        fontWeight: 700, fontSize: "14px",
                        color: "#111827", margin: "0 0 16px",
                        paddingBottom: "12px",
                        borderBottom: "1px solid #F3F4F6",
                    }}>Personal Information</p>
                    <div style={{
                        display: "grid", gridTemplateColumns: "1fr 1fr",
                        gap: "14px",
                    }}>
                        <Field label="Full Name"><Input value={form.name} onChange={v => update("name", v)} /></Field>
                        <Field label="Email Address"><Input value={form.email} onChange={v => update("email", v)} type="email" disabled /></Field>
                        <Field label="Phone Number"><Input value={form.phone} onChange={v => update("phone", v)} /></Field>
                        <Field label="Website"><Input value={form.website} onChange={v => update("website", v)} placeholder="www.yoursite.com" /></Field>
                    </div>
                </div>

                {/* Business info */}
                <div style={{
                    background: "#fff", border: "1px solid #E5E7EB",
                    borderRadius: "12px", padding: "24px",
                    marginBottom: "20px",
                }}>
                    <p style={{
                        fontFamily: "Space Grotesk, sans-serif",
                        fontWeight: 700, fontSize: "14px",
                        color: "#111827", margin: "0 0 16px",
                        paddingBottom: "12px",
                        borderBottom: "1px solid #F3F4F6",
                    }}>Business Information</p>
                    <div style={{
                        display: "grid", gridTemplateColumns: "1fr 1fr",
                        gap: "14px",
                    }}>
                        <Field label="Company / Business Name"><Input value={form.company} onChange={v => update("company", v)} /></Field>
                        <Field label="GSTIN">
                            <input
                                value={form.gstin}
                                onChange={e => update("gstin", e.target.value.toUpperCase())}
                                placeholder="22AAAAA0000A1Z5"
                                style={{
                                    width: "100%", height: "38px",
                                    padding: "0 12px",
                                    border: "1px solid #E5E7EB",
                                    borderRadius: "8px", fontSize: "13px",
                                    color: "#374151", outline: "none",
                                    fontFamily: "monospace",
                                    boxSizing: "border-box",
                                }}
                            />
                        </Field>
                        <Field label="Address">
                            <Input value={form.address} onChange={v => update("address", v)} placeholder="Street address" />
                        </Field>
                        <Field label="City"><Input value={form.city} onChange={v => update("city", v)} /></Field>
                        <Field label="State"><Input value={form.state} onChange={v => update("state", v)} /></Field>
                        <Field label="PIN Code"><Input value={form.pincode} onChange={v => update("pincode", v)} /></Field>
                    </div>
                </div>

                {/* Save */}
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <button onClick={handleSave} style={{
                        display: "flex", alignItems: "center", gap: "8px",
                        padding: "10px 24px",
                        background: saved ? "#10B981" : T,
                        color: "#fff", border: "none",
                        borderRadius: "8px", fontSize: "14px",
                        fontWeight: 700, cursor: "pointer",
                        fontFamily: "Space Grotesk, sans-serif",
                        transition: "background 300ms",
                    }}>
                        <Save size={16} />
                        {saved ? "Saved!" : "Save Profile"}
                    </button>
                </div>
            </div>
        </>
    );
}