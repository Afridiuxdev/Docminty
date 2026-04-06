"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAccessToken, authApi } from "@/api/auth";
import { adminApi } from "@/api/admin";
import AdminHeader from "@/components/admin/AdminHeader";
import { Save, Eye, EyeOff, RefreshCw, AlertCircle, Check, Mail, Lock, Shield, ChevronRight } from "lucide-react";

const T = "#0D9488";

function Section({ title, subtitle, children }) {
    return (
        <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: "12px", overflow: "hidden", marginBottom: "20px" }}>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid #F3F4F6", background: "#F8F9FA" }}>
                <p style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: "13px", color: "#111827", margin: 0, textTransform: "uppercase", letterSpacing: "0.05em" }}>{title}</p>
                {subtitle && <p style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", color: "#9CA3AF", margin: "2px 0 0" }}>{subtitle}</p>}
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

function PasswordInput({ value, onChange, placeholder }) {
    const [show, setShow] = useState(false);
    return (
        <div style={{ position: "relative" }}>
            <input
                type={show ? "text" : "password"}
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
            <button onClick={() => setShow(s => !s)} type="button" style={{
                position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)",
                background: "none", border: "none", cursor: "pointer", color: "#9CA3AF", display: "flex",
            }}>
                {show ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
        </div>
    );
}

function SaveBtn({ saving, saved, onClick, label = "Save Changes" }) {
    return (
        <button onClick={onClick} disabled={saving} style={{
            display: "flex", alignItems: "center", gap: "7px",
            padding: "9px 18px",
            background: saved ? "#10B981" : saving ? "#6B7280" : T,
            color: "#fff", border: "none", borderRadius: "8px",
            fontSize: "13px", fontWeight: 700,
            cursor: saving ? "not-allowed" : "pointer",
            fontFamily: "Space Grotesk, sans-serif",
            transition: "background 300ms",
        }}>
            {saving
                ? <><RefreshCw size={14} style={{ animation: "spin 1s linear infinite" }} />Saving…</>
                : saved
                    ? <><Check size={14} />Saved!</>
                    : <><Save size={14} />{label}</>
            }
        </button>
    );
}

function Toggle({ value, onChange, label, description }) {
    return (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderBottom: "1px solid #F3F4F6" }}>
            <div>
                <p style={{ margin: 0, fontSize: "13px", fontWeight: 600, color: "#374151", fontFamily: "Inter, sans-serif" }}>{label}</p>
                {description && <p style={{ margin: "2px 0 0", fontSize: "12px", color: "#9CA3AF", fontFamily: "Inter, sans-serif" }}>{description}</p>}
            </div>
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

const DEFAULT_SETTINGS = {
    siteName: "", tagline: "", domain: "", supportEmail: "",
    proPrice: "", proOriginalPrice: "",
    enterprisePrice: "", enterpriseOriginalPrice: "",
    annualDiscountPct: "25",
};

export default function AdminSettingsPage() {
    const router = useRouter();
    useEffect(() => { if (!getAccessToken()) router.push("/login"); }, []);

    // Platform settings
    const [settings, setSettings] = useState(DEFAULT_SETTINGS);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState(null);

    // Account — Email
    const [adminProfile, setAdminProfile] = useState(null);
    const [newEmail, setNewEmail] = useState("");
    const [emailSaving, setEmailSaving] = useState(false);
    const [emailSaved, setEmailSaved] = useState(false);

    // Account — Password
    const [curPass, setCurPass] = useState("");
    const [newPass, setNewPass] = useState("");
    const [confPass, setConfPass] = useState("");
    const [passSaving, setPassSaving] = useState(false);
    const [passSaved, setPassSaved] = useState(false);
    const [passError, setPassError] = useState("");

    // Account — 2FA
    const [twoFa, setTwoFa] = useState(false);
    const [twoFaSaving, setTwoFaSaving] = useState(false);
    const [twoFaSaved, setTwoFaSaved] = useState(false);

    useEffect(() => {
        setLoading(true);
        Promise.all([adminApi.getSettings(), authApi.me()])
            .then(([sRes, mRes]) => {
                const data = sRes.data?.data || {};
                setSettings(prev => ({ ...prev, ...data }));
                const profile = mRes.data?.data || mRes.data;
                setAdminProfile(profile);
                setNewEmail(profile?.email || "");
                setTwoFa(!!profile?.twoFactorEnabled);
            })
            .catch(() => setError("Failed to load settings from server."))
            .finally(() => setLoading(false));
    }, []);

    const update = (key, val) => setSettings(prev => ({ ...prev, [key]: val }));

    // Save platform settings
    const handleSave = async () => {
        setSaving(true); setError(null);
        try {
            const payload = {};
            Object.entries(settings).forEach(([k, v]) => { payload[k] = String(v); });
            await adminApi.saveSettings(payload);
            setSaved(true); setTimeout(() => setSaved(false), 2500);
        } catch { setError("Failed to save settings."); }
        finally { setSaving(false); }
    };

    // Update Email
    const handleEmailUpdate = async () => {
        if (!newEmail || newEmail === adminProfile?.email) return;
        setEmailSaving(true);
        try {
            await authApi.updateProfile({ email: newEmail });
            setAdminProfile(p => ({ ...p, email: newEmail }));
            setEmailSaved(true); setTimeout(() => setEmailSaved(false), 2500);
        } catch { setError("Failed to update email."); }
        finally { setEmailSaving(false); }
    };

    // Update Password
    const handlePasswordUpdate = async () => {
        setPassError("");
        if (!curPass || !newPass || !confPass) { setPassError("All fields are required."); return; }
        if (newPass !== confPass) { setPassError("New passwords do not match."); return; }
        if (newPass.length < 8) { setPassError("Password must be at least 8 characters."); return; }
        setPassSaving(true);
        try {
            await authApi.updateProfile({ currentPassword: curPass, newPassword: newPass });
            setCurPass(""); setNewPass(""); setConfPass("");
            setPassSaved(true); setTimeout(() => setPassSaved(false), 2500);
        } catch (e) {
            setPassError(e.response?.data?.message || "Failed to update password. Check current password.");
        }
        finally { setPassSaving(false); }
    };

    // Toggle 2FA
    const handleTwoFaToggle = async (val) => {
        setTwoFa(val);
        setTwoFaSaving(true);
        try {
            await authApi.updateProfile({ twoFactorEnabled: val });
            setTwoFaSaved(true); setTimeout(() => setTwoFaSaved(false), 2500);
        } catch { setTwoFa(!val); setError("Failed to update 2FA setting."); }
        finally { setTwoFaSaving(false); }
    };

    if (loading) {
        return (
            <>
                <AdminHeader title="Settings" subtitle="Platform configuration" />
                <div style={{ padding: "60px", textAlign: "center", color: "#9CA3AF", fontFamily: "Inter, sans-serif" }}>
                    <RefreshCw size={24} style={{ marginBottom: "12px", opacity: 0.4 }} />
                    <p>Loading settings…</p>
                </div>
            </>
        );
    }

    const disc = parseInt(settings.annualDiscountPct) || 25;

    return (
        <>
            <AdminHeader title="Settings" subtitle="Platform configuration and account management" />
            <div style={{ padding: "24px 28px" }}>
                <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>

                {error && (
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", background: "#FEF2F2", border: "1px solid #FCA5A5", borderRadius: "10px", padding: "12px 16px", marginBottom: "20px" }}>
                        <AlertCircle size={16} color="#EF4444" />
                        <span style={{ fontSize: "13px", color: "#991B1B", fontFamily: "Inter, sans-serif" }}>{error}</span>
                    </div>
                )}

                {/* ── Account Settings ── */}
                <Section title="Account Settings" subtitle="Manage your admin account credentials and security">

                    {/* Email Update */}
                    <div style={{ padding: "16px", background: "#F9FAFB", borderRadius: "10px", border: "1px solid #F3F4F6", marginBottom: "16px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                            <div style={{ padding: "6px", background: "#F0FDFA", borderRadius: "8px" }}>
                                <Mail size={15} color={T} />
                            </div>
                            <div>
                                <p style={{ margin: 0, fontWeight: 700, fontSize: "13px", color: "#111827", fontFamily: "Space Grotesk, sans-serif" }}>Email Address</p>
                                <p style={{ margin: 0, fontSize: "11px", color: "#9CA3AF", fontFamily: "Inter, sans-serif" }}>Current: {adminProfile?.email || "—"}</p>
                            </div>
                        </div>
                        <div style={{ display: "flex", gap: "10px", alignItems: "flex-end" }}>
                            <div style={{ flex: 1 }}>
                                <Input value={newEmail} type="email" onChange={setNewEmail} placeholder="Enter new email address" />
                            </div>
                            <SaveBtn saving={emailSaving} saved={emailSaved} onClick={handleEmailUpdate} label="Update Email" />
                        </div>
                    </div>

                    {/* Password Update */}
                    <div style={{ padding: "16px", background: "#F9FAFB", borderRadius: "10px", border: "1px solid #F3F4F6", marginBottom: "16px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                            <div style={{ padding: "6px", background: "#FEF9C3", borderRadius: "8px" }}>
                                <Lock size={15} color="#D97706" />
                            </div>
                            <div>
                                <p style={{ margin: 0, fontWeight: 700, fontSize: "13px", color: "#111827", fontFamily: "Space Grotesk, sans-serif" }}>Change Password</p>
                                <p style={{ margin: 0, fontSize: "11px", color: "#9CA3AF", fontFamily: "Inter, sans-serif" }}>Minimum 8 characters</p>
                            </div>
                        </div>
                        {passError && (
                            <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "#FEF2F2", border: "1px solid #FCA5A5", borderRadius: "8px", padding: "8px 12px", marginBottom: "12px" }}>
                                <AlertCircle size={13} color="#EF4444" />
                                <span style={{ fontSize: "12px", color: "#991B1B", fontFamily: "Inter, sans-serif" }}>{passError}</span>
                            </div>
                        )}
                        <div className="admin-grid-cols-3" style={{ marginBottom: "12px" }}>
                            <Field label="Current Password">
                                <PasswordInput value={curPass} onChange={setCurPass} placeholder="Current password" />
                            </Field>
                            <Field label="New Password">
                                <PasswordInput value={newPass} onChange={setNewPass} placeholder="New password" />
                            </Field>
                            <Field label="Confirm New Password">
                                <PasswordInput value={confPass} onChange={setConfPass} placeholder="Confirm password" />
                            </Field>
                        </div>
                        <div style={{ display: "flex", justifyContent: "flex-end" }}>
                            <SaveBtn saving={passSaving} saved={passSaved} onClick={handlePasswordUpdate} label="Update Password" />
                        </div>
                    </div>

                    {/* 2FA Toggle */}
                    <div style={{ padding: "16px", background: "#F9FAFB", borderRadius: "10px", border: "1px solid #F3F4F6" }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                <div style={{ padding: "6px", background: twoFa ? "#F0FDFA" : "#F3F4F6", borderRadius: "8px", transition: "background 200ms" }}>
                                    <Shield size={15} color={twoFa ? T : "#9CA3AF"} />
                                </div>
                                <div>
                                    <p style={{ margin: 0, fontWeight: 700, fontSize: "13px", color: "#111827", fontFamily: "Space Grotesk, sans-serif" }}>Two-Factor Authentication (2FA)</p>
                                    <p style={{ margin: 0, fontSize: "11px", color: "#9CA3AF", fontFamily: "Inter, sans-serif" }}>
                                        {twoFa ? "✓ Active — Extra OTP required on login" : "Disabled — Enable for extra login security"}
                                    </p>
                                </div>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                {twoFaSaved && <span style={{ fontSize: "11px", fontWeight: 600, color: "#10B981", fontFamily: "Inter, sans-serif" }}>Saved!</span>}
                                {twoFaSaving && <RefreshCw size={13} color="#9CA3AF" style={{ animation: "spin 1s linear infinite" }} />}
                                <button onClick={() => handleTwoFaToggle(!twoFa)} disabled={twoFaSaving} style={{
                                    width: "48px", height: "26px", background: twoFa ? T : "#D1D5DB",
                                    borderRadius: "13px", border: "none", cursor: twoFaSaving ? "not-allowed" : "pointer",
                                    position: "relative", transition: "background 200ms", flexShrink: 0,
                                    opacity: twoFaSaving ? 0.6 : 1,
                                }}>
                                    <div style={{
                                        position: "absolute", top: "3px", left: twoFa ? "24px" : "3px",
                                        width: "20px", height: "20px", background: "#fff",
                                        borderRadius: "50%", transition: "left 200ms",
                                        boxShadow: "0 1px 3px rgba(0,0,0,0.25)",
                                    }} />
                                </button>
                            </div>
                        </div>
                    </div>
                </Section>

                {/* ── Pricing ── */}
                <Section title="Pricing" subtitle="Control plan prices shown on the public pricing page">

                    {/* Info Banner */}
                    <div style={{ background: "#F0FDFA", border: "1px solid #CCFBF1", borderRadius: "10px", padding: "12px 16px", marginBottom: "20px", display: "flex", alignItems: "flex-start", gap: "10px" }}>
                        <span style={{ fontSize: "18px", flexShrink: 0 }}>💡</span>
                        <div>
                            <p style={{ margin: 0, fontWeight: 700, fontSize: "13px", color: T, fontFamily: "Space Grotesk, sans-serif" }}>Annual Discount is Applied Automatically</p>
                            <p style={{ margin: "2px 0 0", fontSize: "12px", color: "#374151", fontFamily: "Inter, sans-serif" }}>Set monthly prices below. Annual per-month = Monthly × (1 − Discount%).</p>
                        </div>
                    </div>

                    {/* Discount % row */}
                    <div className="admin-grid-cols-2" style={{ alignItems: "start", marginBottom: "20px" }}>
                        <Field label="Annual Discount %" hint={`Annual = Monthly × ${100 - disc}%`}>
                            <div style={{ position: "relative" }}>
                                <Input
                                    value={settings.annualDiscountPct}
                                    type="number"
                                    onChange={v => update("annualDiscountPct", Math.min(90, Math.max(0, parseInt(v) || 0)).toString())}
                                />
                                <span style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", fontSize: "13px", fontWeight: 700, color: "#9CA3AF", pointerEvents: "none" }}>%</span>
                            </div>
                        </Field>

                        {/* Live preview cards */}
                        <div className="admin-grid-cols-2" style={{ paddingTop: "22px" }}>
                            {[
                                { label: "Business Pro – Annual", price: settings.proPrice },
                                { label: "Enterprise – Annual", price: settings.enterprisePrice },
                            ].map(({ label, price }) => {
                                const m = parseInt(price) || 0;
                                const apm = Math.round(m * (1 - disc / 100));
                                if (!m) return null;
                                return (
                                    <div key={label} style={{ background: "#F0FDFA", border: "1px solid #CCFBF1", borderRadius: "8px", padding: "10px 14px" }}>
                                        <p style={{ margin: 0, fontSize: "11px", color: "#6B7280", fontFamily: "Inter, sans-serif" }}>{label}</p>
                                        <p style={{ margin: "2px 0 0", fontSize: "15px", fontWeight: 800, color: T, fontFamily: "Space Grotesk, sans-serif" }}>
                                            Rs.{apm}<span style={{ fontSize: "11px", fontWeight: 500, color: "#9CA3AF" }}>/mo</span>
                                            <span style={{ fontSize: "12px", fontWeight: 600, color: "#374151", marginLeft: "6px" }}>= Rs.{apm * 12}/yr</span>
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div style={{ borderTop: "1px solid #F3F4F6", margin: "4px 0 20px" }} />

                    {/* Business Pro */}
                    <p style={{ margin: "0 0 10px", fontWeight: 700, fontSize: "12px", color: "#374151", fontFamily: "Space Grotesk, sans-serif", textTransform: "uppercase", letterSpacing: "0.05em" }}>Business Pro</p>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "16px", marginBottom: "20px" }}>
                        <Field label="Monthly Price (Rs.)">
                            <Input value={settings.proPrice} type="number" onChange={v => update("proPrice", v)} placeholder="199" />
                        </Field>
                    </div>

                    {/* Enterprise */}
                    <p style={{ margin: "0 0 10px", fontWeight: 700, fontSize: "12px", color: "#374151", fontFamily: "Space Grotesk, sans-serif", textTransform: "uppercase", letterSpacing: "0.05em" }}>Enterprise</p>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "16px", marginBottom: "4px" }}>
                        <Field label="Monthly Price (Rs.)">
                            <Input value={settings.enterprisePrice} type="number" onChange={v => update("enterprisePrice", v)} placeholder="399" />
                        </Field>
                    </div>

                    <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "8px" }}>
                        <SaveBtn saving={saving} saved={saved} onClick={handleSave} label="Save Pricing" />
                    </div>
                </Section>
            </div>
        </>
    );
}
