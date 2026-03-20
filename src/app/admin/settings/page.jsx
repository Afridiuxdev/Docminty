"use client";
import { useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import { Save, Eye, EyeOff } from "lucide-react";

const T = "#0D9488";

function Section({ title, children }) {
    return (
        <div style={{
            background: "#fff", border: "1px solid #E5E7EB",
            borderRadius: "12px", overflow: "hidden",
            marginBottom: "20px",
        }}>
            <div style={{
                padding: "14px 20px", borderBottom: "1px solid #F3F4F6",
                background: "#F8F9FA",
            }}>
                <p style={{
                    fontFamily: "Space Grotesk, sans-serif",
                    fontWeight: 700, fontSize: "13px",
                    color: "#111827", margin: 0,
                    textTransform: "uppercase", letterSpacing: "0.05em",
                }}>{title}</p>
            </div>
            <div style={{ padding: "20px" }}>{children}</div>
        </div>
    );
}

function Field({ label, children, hint }) {
    return (
        <div style={{ marginBottom: "16px" }}>
            <label style={{
                fontSize: "12px", fontWeight: 600,
                color: "#374151", fontFamily: "Inter, sans-serif",
                display: "block", marginBottom: "6px",
            }}>{label}</label>
            {children}
            {hint && (
                <p style={{
                    fontSize: "11px", color: "#9CA3AF",
                    margin: "4px 0 0", fontFamily: "Inter, sans-serif",
                }}>{hint}</p>
            )}
        </div>
    );
}

function Input({ value, onChange, type = "text", placeholder = "" }) {
    return (
        <input
            type={type} value={value}
            onChange={e => onChange(e.target.value)}
            placeholder={placeholder}
            style={{
                width: "100%", height: "38px",
                padding: "0 12px", border: "1px solid #E5E7EB",
                borderRadius: "8px", fontSize: "13px",
                color: "#374151", fontFamily: "Inter, sans-serif",
                outline: "none", boxSizing: "border-box",
                background: "#fff",
            }}
        />
    );
}

function Toggle({ value, onChange, label }) {
    return (
        <div style={{
            display: "flex", justifyContent: "space-between",
            alignItems: "center", padding: "10px 0",
            borderBottom: "1px solid #F3F4F6",
        }}>
            <span style={{
                fontSize: "13px", color: "#374151",
                fontFamily: "Inter, sans-serif",
            }}>{label}</span>
            <button onClick={() => onChange(!value)} style={{
                width: "44px", height: "24px",
                background: value ? T : "#D1D5DB",
                borderRadius: "12px", border: "none",
                cursor: "pointer", position: "relative",
                transition: "background 200ms",
                flexShrink: 0,
            }}>
                <div style={{
                    position: "absolute",
                    top: "2px", left: value ? "22px" : "2px",
                    width: "20px", height: "20px",
                    background: "#fff", borderRadius: "50%",
                    transition: "left 200ms",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                }} />
            </button>
        </div>
    );
}

export default function AdminSettingsPage() {
    const [settings, setSettings] = useState({
        siteName: "DocMinty",
        tagline: "Free GST Invoice Generator for India",
        domain: "https://docminty.com",
        supportEmail: "support@docminty.com",
        adsenseId: "ca-pub-XXXXXXXXXXXXXXXX",
        razorpayKey: "rzp_live_XXXXXXXXXXXXXX",
        razorpaySecret: "",
        proPrice: "199",
        annualPrice: "1990",
        apiUrl: "http://localhost:8080/api",
        jwtSecret: "",
        // Feature toggles
        adsEnabled: true,
        batchEnabled: true,
        signupEnabled: true,
        maintenanceMode: false,
        emailVerification: false,
        analyticsEnabled: true,
        // Email settings
        smtpHost: "smtp.gmail.com",
        smtpPort: "587",
        smtpUser: "noreply@docminty.com",
        smtpPass: "",
    });

    const [showSecrets, setShowSecrets] = useState({});
    const [saved, setSaved] = useState(false);

    const update = (key, val) =>
        setSettings(prev => ({ ...prev, [key]: val }));

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
    };

    const toggleShow = (key) =>
        setShowSecrets(prev => ({ ...prev, [key]: !prev[key] }));

    return (
        <>
            <AdminHeader title="Settings" subtitle="Platform configuration and API keys" />
            <div style={{ padding: "24px 28px" }}>

                {/* General */}
                <Section title="General Settings">
                    <div style={{
                        display: "grid", gridTemplateColumns: "1fr 1fr",
                        gap: "16px",
                    }}>
                        <Field label="Site Name">
                            <Input value={settings.siteName} onChange={v => update("siteName", v)} />
                        </Field>
                        <Field label="Domain">
                            <Input value={settings.domain} onChange={v => update("domain", v)} />
                        </Field>
                        <Field label="Tagline">
                            <Input value={settings.tagline} onChange={v => update("tagline", v)} />
                        </Field>
                        <Field label="Support Email">
                            <Input value={settings.supportEmail} type="email" onChange={v => update("supportEmail", v)} />
                        </Field>
                    </div>
                </Section>

                {/* Pricing */}
                <Section title="Pricing">
                    <div style={{
                        display: "grid", gridTemplateColumns: "1fr 1fr",
                        gap: "16px",
                    }}>
                        <Field label="Monthly Pro Price (Rs.)" hint="Current: Rs. 199/month">
                            <Input value={settings.proPrice} type="number" onChange={v => update("proPrice", v)} />
                        </Field>
                        <Field label="Annual Pro Price (Rs.)" hint="Current: Rs. 1,990/year">
                            <Input value={settings.annualPrice} type="number" onChange={v => update("annualPrice", v)} />
                        </Field>
                    </div>
                </Section>

                {/* API Keys */}
                <Section title="API Keys & Integrations">
                    <div style={{
                        display: "grid", gridTemplateColumns: "1fr 1fr",
                        gap: "16px",
                    }}>
                        <Field label="Google AdSense Publisher ID" hint="Format: ca-pub-XXXXXXXXXXXXXXXX">
                            <Input value={settings.adsenseId} onChange={v => update("adsenseId", v)} placeholder="ca-pub-XXXXXXXXXXXXXXXX" />
                        </Field>
                        <Field label="Spring Boot API URL">
                            <Input value={settings.apiUrl} onChange={v => update("apiUrl", v)} />
                        </Field>
                        <Field label="Razorpay Key ID">
                            <Input value={settings.razorpayKey} onChange={v => update("razorpayKey", v)} placeholder="rzp_live_..." />
                        </Field>
                        <Field label="Razorpay Key Secret">
                            <div style={{ position: "relative" }}>
                                <input
                                    type={showSecrets.razorpay ? "text" : "password"}
                                    value={settings.razorpaySecret}
                                    onChange={e => update("razorpaySecret", e.target.value)}
                                    placeholder="Enter Razorpay secret"
                                    style={{
                                        width: "100%", height: "38px",
                                        padding: "0 40px 0 12px",
                                        border: "1px solid #E5E7EB", borderRadius: "8px",
                                        fontSize: "13px", color: "#374151",
                                        fontFamily: "Inter, sans-serif",
                                        outline: "none", boxSizing: "border-box",
                                    }}
                                />
                                <button onClick={() => toggleShow("razorpay")} style={{
                                    position: "absolute", right: "10px", top: "50%",
                                    transform: "translateY(-50%)",
                                    background: "none", border: "none",
                                    cursor: "pointer", color: "#9CA3AF",
                                    display: "flex",
                                }}>
                                    {showSecrets.razorpay ? <EyeOff size={15} /> : <Eye size={15} />}
                                </button>
                            </div>
                        </Field>
                        <Field label="JWT Secret">
                            <div style={{ position: "relative" }}>
                                <input
                                    type={showSecrets.jwt ? "text" : "password"}
                                    value={settings.jwtSecret}
                                    onChange={e => update("jwtSecret", e.target.value)}
                                    placeholder="Enter JWT secret"
                                    style={{
                                        width: "100%", height: "38px",
                                        padding: "0 40px 0 12px",
                                        border: "1px solid #E5E7EB", borderRadius: "8px",
                                        fontSize: "13px", color: "#374151",
                                        fontFamily: "Inter, sans-serif",
                                        outline: "none", boxSizing: "border-box",
                                    }}
                                />
                                <button onClick={() => toggleShow("jwt")} style={{
                                    position: "absolute", right: "10px", top: "50%",
                                    transform: "translateY(-50%)",
                                    background: "none", border: "none",
                                    cursor: "pointer", color: "#9CA3AF",
                                    display: "flex",
                                }}>
                                    {showSecrets.jwt ? <EyeOff size={15} /> : <Eye size={15} />}
                                </button>
                            </div>
                        </Field>
                    </div>
                </Section>

                {/* SMTP */}
                <Section title="Email / SMTP Settings">
                    <div style={{
                        display: "grid", gridTemplateColumns: "1fr 1fr",
                        gap: "16px",
                    }}>
                        <Field label="SMTP Host">
                            <Input value={settings.smtpHost} onChange={v => update("smtpHost", v)} />
                        </Field>
                        <Field label="SMTP Port">
                            <Input value={settings.smtpPort} onChange={v => update("smtpPort", v)} />
                        </Field>
                        <Field label="SMTP Username">
                            <Input value={settings.smtpUser} onChange={v => update("smtpUser", v)} />
                        </Field>
                        <Field label="SMTP Password">
                            <div style={{ position: "relative" }}>
                                <input
                                    type={showSecrets.smtp ? "text" : "password"}
                                    value={settings.smtpPass}
                                    onChange={e => update("smtpPass", e.target.value)}
                                    placeholder="Enter SMTP password"
                                    style={{
                                        width: "100%", height: "38px",
                                        padding: "0 40px 0 12px",
                                        border: "1px solid #E5E7EB", borderRadius: "8px",
                                        fontSize: "13px", color: "#374151",
                                        fontFamily: "Inter, sans-serif",
                                        outline: "none", boxSizing: "border-box",
                                    }}
                                />
                                <button onClick={() => toggleShow("smtp")} style={{
                                    position: "absolute", right: "10px", top: "50%",
                                    transform: "translateY(-50%)",
                                    background: "none", border: "none",
                                    cursor: "pointer", color: "#9CA3AF",
                                    display: "flex",
                                }}>
                                    {showSecrets.smtp ? <EyeOff size={15} /> : <Eye size={15} />}
                                </button>
                            </div>
                        </Field>
                    </div>
                </Section>

                {/* Feature Toggles */}
                <Section title="Feature Toggles">
                    <div style={{ maxWidth: "480px" }}>
                        {[
                            { key: "adsEnabled", label: "AdSense Ads Enabled" },
                            { key: "batchEnabled", label: "Batch Processing (Pro Feature)" },
                            { key: "signupEnabled", label: "New User Signups" },
                            { key: "emailVerification", label: "Email Verification on Signup" },
                            { key: "analyticsEnabled", label: "Analytics Tracking" },
                            { key: "maintenanceMode", label: "Maintenance Mode" },
                        ].map(f => (
                            <Toggle
                                key={f.key}
                                label={f.label}
                                value={settings[f.key]}
                                onChange={v => update(f.key, v)}
                            />
                        ))}
                    </div>
                </Section>

                {/* Save button */}
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <button onClick={handleSave} style={{
                        display: "flex", alignItems: "center", gap: "8px",
                        padding: "10px 24px", background: saved ? "#10B981" : T,
                        color: "#fff", border: "none", borderRadius: "8px",
                        fontSize: "14px", fontWeight: 700,
                        cursor: "pointer", fontFamily: "Space Grotesk, sans-serif",
                        transition: "background 300ms",
                    }}>
                        <Save size={16} />
                        {saved ? "Saved!" : "Save Settings"}
                    </button>
                </div>
            </div>
        </>
    );
}