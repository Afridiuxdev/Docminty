"use client";
import { useState, useEffect } from "react";
import DashHeader from "@/components/dashboard/DashHeader";
import { Camera, Save } from "lucide-react";
import { authApi } from "@/api/auth";
import { INDIAN_STATES } from "@/constants/indianStates";
import LogoUpload from "@/components/LogoUpload";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";

const T = "#0D9488";

export default function DashProfilePage() {
    const router = useRouter();
    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        company: "",
        gstin: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
        website: "",
        logo: "",
        signature: "",
        plan: "free",
    });
    const [saved, setSaved] = useState(false);
    const [loading, setLoading] = useState(false);
    const update = (k, v) => setForm(p => ({ ...p, [k]: v }));

    useEffect(() => {
        authApi.me()
            .then(res => {
                const u = res.data.data;
                setForm(p => ({
                    ...p,
                    name: u.name || "",
                    email: u.email || "",
                    phone: u.phone || "",
                    company: u.company || "",
                    gstin: u.gstin || "",
                    address: u.address || "",
                    city: u.city || "",
                    state: u.state || "",
                    pincode: u.pincode || "",
                    website: u.website || "",
                    logo: u.logo || localStorage.getItem("docminty_logo") || "",
                    signature: u.signature || localStorage.getItem("docminty_signature") || "",
                    plan: u.plan || "free",
                }));
            })
            .catch(err => console.error("Failed to fetch user:", err));
    }, []);

    const plan = form.plan?.toUpperCase() || "FREE";
    const isPro = plan === "PRO" || plan === "ENTERPRISE";

    const handleSave = async () => {
        setLoading(true);
        try {
            await authApi.updateProfile(form);
            if (form.logo) localStorage.setItem("docminty_logo", form.logo);
            if (form.signature) localStorage.setItem("docminty_signature", form.signature);
            setSaved(true);
            toast.success("Profile updated successfully!");
            setTimeout(() => setSaved(false), 2000);
        } catch (err) {
            console.error("Save failed:", err);
            const msg = err.response?.data?.message || "Failed to update profile. The image might be too large.";
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Toaster position="top-right" />
            <style>{`
                .profile-container { padding: 24px; max-width: 800px; }
                .profile-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
                .profile-section { background: #fff; border: 1px solid #E5E7EB; border-radius: 12px; padding: 20px; margin-bottom: 20px; }
                
                @media (max-width: 640px) {
                    .profile-container { padding: 16px; }
                    .profile-grid { grid-template-columns: 1fr; gap: 16px; }
                    .field-full { grid-column: span 1 !important; }
                }
            `}</style>

            <DashHeader title="Profile Settings" subtitle="Manage your personal and business information" />
            
            <div className="profile-container">
                {/* Personal Info */}
                <div className="profile-section">
                    <h2 style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: "16px", fontWeight: 700, color: "#111827", marginBottom: "20px" }}>Personal Information</h2>
                    <div className="profile-grid">
                        <Field label="Full Name"><Input value={form.name} onChange={v => update("name", v)} /></Field>
                        <Field label="Email Address"><Input value={form.email} disabled /></Field>
                        <Field label="Phone Number"><Input value={form.phone} onChange={v => update("phone", v)} /></Field>
                    </div>
                </div>

                {/* Business Info */}
                <div className="profile-section">
                    <h2 style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: "16px", fontWeight: 700, color: "#111827", marginBottom: "20px" }}>Business Information</h2>
                    <div className="profile-grid">
                        <Field label="Business Name"><Input value={form.company} onChange={v => update("company", v)} /></Field>
                        <Field label="GSTIN"><Input value={form.gstin} onChange={v => update("gstin", v)} placeholder="22AAAAA0000A1Z5" /></Field>
                        <Field label="Website"><Input value={form.website} onChange={v => update("website", v)} placeholder="www.yourbusiness.com" /></Field>
                        <div className="hidden sm-block" />

                        <Field label="Address" full className="field-full">
                            <Input value={form.address} onChange={v => update("address", v)} placeholder="Street address" />
                        </Field>
                        <Field label="City"><Input value={form.city} onChange={v => update("city", v)} /></Field>
                        <Field label="State">
                            <select
                                value={form.state}
                                onChange={e => update("state", e.target.value)}
                                style={{
                                    width: "100%", height: "38px",
                                    padding: "0 12px",
                                    border: "1px solid #E5E7EB",
                                    borderRadius: "8px", fontSize: "13px",
                                    color: "#374151",
                                    background: "#fff",
                                    outline: "none",
                                    fontFamily: "Inter, sans-serif",
                                    boxSizing: "border-box",
                                }}
                            >
                                <option value="">Select State</option>
                                {INDIAN_STATES.map(s => (
                                    <option key={s.code} value={s.code}>{s.name}</option>
                                ))}
                            </select>
                        </Field>
                        <Field label="PIN Code"><Input value={form.pincode} onChange={v => update("pincode", v)} /></Field>
                    </div>
                </div>

                {/* Logo Section */}
                <div className="profile-section">
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
                        <div style={{ width: "24px", height: "24px", background: "#F0FDFA", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Camera size={14} color={T} />
                        </div>
                        <h2 style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: "14px", fontWeight: 700, color: "#111827", margin: 0 }}>Business Logo</h2>
                    </div>
                    <div style={{ maxWidth: "400px" }}>
                        {isPro ? (
                            <LogoUpload value={form.logo} onChange={v => update("logo", v)} />
                        ) : (
                            <div onClick={() => router.push("/#pricing")} style={{ padding: "14px 16px", border: "1px dashed #D1D5DB", borderRadius: "8px", background: "#F9FAFB", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}>
                                <span style={{ fontSize: "12px", color: "#9CA3AF", fontFamily: "Inter, sans-serif" }}>Logo upload — <strong style={{ color: "#6366F1" }}>Pro feature</strong></span>
                                <span style={{ fontSize: "11px", background: "#EDE9FE", color: "#6366F1", padding: "3px 10px", borderRadius: "20px", fontWeight: 600 }}>Upgrade</span>
                            </div>
                        )}
                        <p style={{ fontSize: "11px", color: "#9CA3AF", marginTop: "8px", fontFamily: "Inter, sans-serif" }}>
                            This logo will be automatically used in your generated documents.
                        </p>
                    </div>
                </div>

                {/* Save */}
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <button onClick={handleSave} style={{
                        padding: "10px 24px",
                        background: T, color: "#fff",
                        border: "none", borderRadius: "8px",
                        fontSize: "14px", fontWeight: 700,
                        cursor: loading ? "not-allowed" : "pointer",
                        display: "flex", alignItems: "center", gap: "8px",
                        boxShadow: "0 4px 6px -1px rgba(13,148,136,0.2)",
                        fontFamily: "Space Grotesk, sans-serif",
                        opacity: loading ? 0.7 : 1,
                    }}>
                        <Save size={16} />
                        {loading ? "Saving..." : (saved ? "Saved!" : "Save Profile")}
                    </button>
                </div>
            </div>
            
            <style>{`
                @media (max-width: 640px) {
                    .hidden.sm-block { display: none; }
                }
            `}</style>
        </>
    );
}

function Field({ label, children, full, className }) {
    return (
        <div className={className} style={{ gridColumn: full ? "span 2" : "span 1" }}>
            <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", marginBottom: "6px", letterSpacing: "0.05em", fontFamily: "Inter, sans-serif" }}>{label}</label>
            {children}
        </div>
    );
}

function Input({ value, onChange, disabled, placeholder }) {
    return (
        <input 
            value={value} 
            onChange={e => onChange?.(e.target.value)} 
            disabled={disabled}
            placeholder={placeholder}
            style={{
                width: "100%", height: "38px",
                padding: "0 12px",
                border: "1px solid #E5E7EB",
                borderRadius: "8px", fontSize: "13px",
                color: disabled ? "#9CA3AF" : "#111827",
                background: disabled ? "#F9FAFB" : "#fff",
                outline: "none",
                fontFamily: "Inter, sans-serif",
                boxSizing: "border-box",
                transition: "border-color 150ms",
            }}
            onFocus={e => { if(!disabled) e.target.style.borderColor = "#0D9488"; }}
            onBlur={e => { e.target.style.borderColor = "#E5E7EB"; }}
        />
    );
}