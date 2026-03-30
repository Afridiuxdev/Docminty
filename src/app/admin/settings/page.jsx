"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAccessToken } from "@/api/auth";
import { adminApi } from "@/api/admin";
import AdminHeader from "@/components/admin/AdminHeader";
import { Save, Eye, EyeOff, RefreshCw, AlertCircle } from "lucide-react";

const T = "#0D9488";

function Section({ title, children }) {
    return (
        <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: "12px", overflow: "hidden", marginBottom: "20px" }}>
            <div style={{ padding: "14px 20px", borderBottom: "1px solid #F3F4F6", background: "#F8F9FA" }}>
                <p style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: "13px", color: "#111827", margin: 0, textTransform: "uppercase", letterSpacing: "0.05em" }}>{title}</p>
            </div>
            <div style={{ padding: "20px" }}>{children}</div>
        </div>
    );
}

function Field({ label, children, hint }) {
    return (
        <div style={{ marginBottom: "16px" }}>
            <label style={{ fontSize: "12px", fontWeight: 600, color: "#374151", fontFamily: "Inter, sans-serif", display: "block", marginBottom: "6px" }}>{label}</label>
            {children}
            {hint && <p style={{ fontSize: "11px", color: "#9CA3AF", margin: "4px 0 0", fontFamily: "Inter, sans-serif" }}>{hint}</p>}
        </div>
    );
}

function Input({ value, onChange, type = "text", placeholder = "", disabled = false }) {
    return (
        <input
            type={type} value={value}
            onChange={e => onChange(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            style={{
                width: "100%", height: "38px", padding: "0 12px",
                border: "1px solid #E5E7EB", borderRadius: "8px", fontSize: "13px",
                color: "#374151", fontFamily: "Inter, sans-serif",
                outline: "none", boxSizing: "border-box",
                background: disabled ? "#F9FAFB" : "#fff",
                opacity: disabled ? 0.7 : 1,
            }}
        />
    );
}

function Toggle({ value, onChange, label }) {
    return (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #F3F4F6" }}>
            <span style={{ fontSize: "13px", color: "#374151", fontFamily: "Inter, sans-serif" }}>{label}</span>
            <button onClick={() => onChange(!value)} style={{
                width: "44px", height: "24px", background: value ? T : "#D1D5DB",
                borderRadius: "12px", border: "none", cursor: "pointer",
                position: "relative", transition: "background 200ms", flexShrink: 0,
            }}>
                <div style={{
                    position: "absolute", top: "2px", left: value ? "22px" : "2px",
                    width: "20px", height: "20px", background: "#fff",
                    borderRadius: "50%", transition: "left 200ms",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                }} />
            </button>
        </div>
    );
}

function SecretInput({ value, onChange, placeholder, secretKey, showSecrets, toggleShow }) {
    return (
        <div style={{ position: "relative" }}>
            <input
                type={showSecrets[secretKey] ? "text" : "password"}
                value={value}
                onChange={e => onChange(e.target.value)}
                placeholder={placeholder}
                style={{
                    width: "100%", height: "38px", padding: "0 40px 0 12px",
                    border: "1px solid #E5E7EB", borderRadius: "8px", fontSize: "13px",
                    color: "#374151", fontFamily: "Inter, sans-serif",
                    outline: "none", boxSizing: "border-box",
                }}
            />
            <button onClick={() => toggleShow(secretKey)} style={{
                position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)",
                background: "none", border: "none", cursor: "pointer",
                color: "#9CA3AF", display: "flex",
            }}>
                {showSecrets[secretKey] ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
        </div>
    );
}

const DEFAULT_SETTINGS = {
    siteName: "", tagline: "", domain: "", supportEmail: "",
    adsenseId: "", razorpayKey: "", proPrice: "", annualPrice: "",
    apiUrl: "", smtpHost: "", smtpPort: "", smtpUser: "",
    adsEnabled: true, batchEnabled: true, signupEnabled: true,
    emailVerification: false, analyticsEnabled: true, maintenanceMode: false,
    // local-only secret fields (never fetched from backend)
    razorpaySecret: "", jwtSecret: "", smtpPass: "",
};

export default function AdminSettingsPage() {
    const router = useRouter();
    useEffect(() => { if (!getAccessToken()) router.push("/login"); }, []);

    const [settings, setSettings]   = useState(DEFAULT_SETTINGS);
    const [showSecrets, setShowSecrets] = useState({});
    const [loading, setLoading]     = useState(true);
    const [saving, setSaving]       = useState(false);
    const [saved, setSaved]         = useState(false);
    const [error, setError]         = useState(null);

    // Load real settings from backend
    useEffect(() => {
        setLoading(true);
        adminApi.getSettings()
            .then(res => {
                const data = res.data?.data || {};
                setSettings(prev => ({ ...prev, ...data }));
            })
            .catch(() => setError("Failed to load settings from server."))
            .finally(() => setLoading(false));
    }, []);

    const update = (key, val) => setSettings(prev => ({ ...prev, [key]: val }));

    const handleSave = async () => {
        setSaving(true);
        setError(null);
        try {
            // Convert all values to strings for the backend (booleans → "true"/"false")
            const payload = {};
            Object.entries(settings).forEach(([k, v]) => {
                // Don't send local-only secret fields if empty
                if (["razorpaySecret", "jwtSecret", "smtpPass"].includes(k) && !v) return;
                payload[k] = String(v);
            });
            await adminApi.saveSettings(payload);
            setSaved(true);
            setTimeout(() => setSaved(false), 2500);
        } catch (e) {
            setError("Failed to save settings. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    const toggleShow = (key) => setShowSecrets(prev => ({ ...prev, [key]: !prev[key] }));

    if (loading) {
        return (
            <>
                <AdminHeader title="Settings" subtitle="Platform configuration and API keys" />
                <div style={{ padding: "60px", textAlign: "center", color: "#9CA3AF", fontFamily: "Inter, sans-serif" }}>
                    <RefreshCw size={24} style={{ marginBottom: "12px", opacity: 0.4 }} />
                    <p>Loading settings…</p>
                </div>
            </>
        );
    }

    return (
        <>
            <AdminHeader title="Settings" subtitle="Platform configuration and API keys" />
            <div style={{ padding: "24px 28px" }}>

                {error && (
                    <div style={{
                        display: "flex", alignItems: "center", gap: "10px",
                        background: "#FEF2F2", border: "1px solid #FCA5A5",
                        borderRadius: "10px", padding: "12px 16px", marginBottom: "20px",
                    }}>
                        <AlertCircle size={16} color="#EF4444" />
                        <span style={{ fontSize: "13px", color: "#991B1B", fontFamily: "Inter, sans-serif" }}>{error}</span>
                    </div>
                )}

                {/* General */}
                <Section title="General Settings">
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
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
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                        <Field label="Monthly Pro Price (Rs.)" hint={`Current: Rs. ${settings.proPrice}/month`}>
                            <Input value={settings.proPrice} type="number" onChange={v => update("proPrice", v)} />
                        </Field>
                        <Field label="Annual Pro Price (Rs.)" hint={`Current: Rs. ${settings.annualPrice}/year`}>
                            <Input value={settings.annualPrice} type="number" onChange={v => update("annualPrice", v)} />
                        </Field>
                    </div>
                </Section>

                {/* API Keys */}
                <Section title="API Keys & Integrations">
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                        <Field label="Google AdSense Publisher ID" hint="Format: ca-pub-XXXXXXXXXXXXXXXX">
                            <Input value={settings.adsenseId} onChange={v => update("adsenseId", v)} placeholder="ca-pub-XXXXXXXXXXXXXXXX" />
                        </Field>
                        <Field label="Spring Boot API URL">
                            <Input value={settings.apiUrl} onChange={v => update("apiUrl", v)} />
                        </Field>
                        <Field label="Razorpay Key ID">
                            <Input value={settings.razorpayKey} onChange={v => update("razorpayKey", v)} placeholder="rzp_live_..." />
                        </Field>
                        <Field label="Razorpay Key Secret" hint="Leave blank to keep existing secret">
                            <SecretInput
                                value={settings.razorpaySecret} onChange={v => update("razorpaySecret", v)}
                                placeholder="Enter new secret to update"
                                secretKey="razorpay" showSecrets={showSecrets} toggleShow={toggleShow}
                            />
                        </Field>
                        <Field label="JWT Secret" hint="Leave blank to keep existing secret">
                            <SecretInput
                                value={settings.jwtSecret} onChange={v => update("jwtSecret", v)}
                                placeholder="Enter new secret to update"
                                secretKey="jwt" showSecrets={showSecrets} toggleShow={toggleShow}
                            />
                        </Field>
                    </div>
                </Section>

                {/* SMTP */}
                <Section title="Email / SMTP Settings">
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                        <Field label="SMTP Host">
                            <Input value={settings.smtpHost} onChange={v => update("smtpHost", v)} />
                        </Field>
                        <Field label="SMTP Port">
                            <Input value={settings.smtpPort} onChange={v => update("smtpPort", v)} />
                        </Field>
                        <Field label="SMTP Username">
                            <Input value={settings.smtpUser} onChange={v => update("smtpUser", v)} />
                        </Field>
                        <Field label="SMTP Password" hint="Leave blank to keep existing password">
                            <SecretInput
                                value={settings.smtpPass} onChange={v => update("smtpPass", v)}
                                placeholder="Enter new password to update"
                                secretKey="smtp" showSecrets={showSecrets} toggleShow={toggleShow}
                            />
                        </Field>
                    </div>
                </Section>

                {/* Feature Toggles */}
                <Section title="Feature Toggles">
                    <div style={{ maxWidth: "480px" }}>
                        {[
                            { key: "adsEnabled",        label: "AdSense Ads Enabled" },
                            { key: "batchEnabled",      label: "Batch Processing (Pro Feature)" },
                            { key: "signupEnabled",     label: "New User Signups" },
                            { key: "emailVerification", label: "Email Verification on Signup" },
                            { key: "analyticsEnabled",  label: "Analytics Tracking" },
                            { key: "maintenanceMode",   label: "Maintenance Mode" },
                        ].map(f => (
                            <Toggle
                                key={f.key}
                                label={f.label}
                                value={!!settings[f.key]}
                                onChange={v => update(f.key, v)}
                            />
                        ))}
                    </div>
                </Section>

                {/* Save button */}
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <button onClick={handleSave} disabled={saving} style={{
                        display: "flex", alignItems: "center", gap: "8px",
                        padding: "10px 24px",
                        background: saved ? "#10B981" : saving ? "#6B7280" : T,
                        color: "#fff", border: "none", borderRadius: "8px",
                        fontSize: "14px", fontWeight: 700,
                        cursor: saving ? "not-allowed" : "pointer",
                        fontFamily: "Space Grotesk, sans-serif",
                        transition: "background 300ms",
                    }}>
                        {saving
                            ? <><RefreshCw size={16} style={{ animation: "spin 1s linear infinite" }} />Saving…</>
                            : <><Save size={16} />{saved ? "Saved!" : "Save Settings"}</>
                        }
                    </button>
                </div>
            </div>
            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </>
    );
}
