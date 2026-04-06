"use client";
import { useState, useEffect } from "react";
import DashHeader from "@/components/dashboard/DashHeader";
import { Save, Eye, EyeOff, Trash2 } from "lucide-react";
import { authApi } from "@/api/auth";

const T = "#0D9488";

function Section({ title, subtitle, children }) {
    return (
        <div style={{
            background: "#fff", border: "1px solid #E5E7EB",
            borderRadius: "12px", overflow: "hidden",
            marginBottom: "20px",
        }}>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid #F3F4F6" }}>
                <p style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: "14px", color: "#111827", margin: 0 }}>{title}</p>
                {subtitle && <p style={{ fontSize: "12px", color: "#9CA3AF", fontFamily: "Inter, sans-serif", margin: "2px 0 0" }}>{subtitle}</p>}
            </div>
            <div style={{ padding: "20px" }}>{children}</div>
        </div>
    );
}

function Toggle({ label, desc, value, onChange, disabled }) {
    return (
        <div style={{
            display: "flex", justifyContent: "space-between",
            alignItems: "center", padding: "12px 0",
            borderBottom: "1px solid #F3F4F6",
            opacity: disabled ? 0.6 : 1,
            pointerEvents: disabled ? "none" : "auto",
        }}>
            <div style={{ flex: 1, marginRight: "12px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                    <p style={{ fontSize: "13px", fontWeight: 600, color: "#374151", fontFamily: "Inter, sans-serif", margin: "0" }}>{label}</p>
                    {disabled && <span style={{ background: "#F0FDFA", color: "#0D9488", fontSize: "10px", fontWeight: 800, padding: "1px 6px", borderRadius: "4px", border: "1px solid #0D9488", fontFamily: "Space Grotesk, sans-serif" }}>PRO</span>}
                </div>
                {desc && <p style={{ fontSize: "11px", color: "#9CA3AF", fontFamily: "Inter, sans-serif", margin: "2px 0 0" }}>{desc}</p>}
            </div>
            <button onClick={() => !disabled && onChange(!value)} style={{ width: "42px", height: "22px", background: value ? T : "#D1D5DB", borderRadius: "11px", border: "none", cursor: disabled ? "not-allowed" : "pointer", position: "relative", transition: "background 200ms", flexShrink: 0 }}>
                <div style={{ position: "absolute", top: "2px", left: value ? "21px" : "2px", width: "18px", height: "18px", background: "#fff", borderRadius: "50%", transition: "left 200ms", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }} />
            </button>
        </div>
    );
}

export default function DashSettingsPage() {
    const [prefs, setPrefs] = useState({
        emailOnCreate: true,
        emailOnDownload: false,
        marketingEmails: false,
        defaultGST: "18",
        defaultState: "27",
        defaultCurrency: "INR",
        language: "en",
        dateFormat: "DD/MM/YYYY",
        autoSave: true,
        showWatermark: true,
        defaultTaxType: "cgst_sgst",
        twoFactor: false,
        sessionTimeout: "30",
    });

    const [user, setUser] = useState(null);
    useEffect(() => {
        authApi.me().then(res => {
            const u = res.data.data;
            setUser(u);
            if (u) {
                setPrefs(prev => ({
                    ...prev,
                    twoFactor: u.twoFactorEnabled || false,
                    emailOnCreate: u.emailOnCreate ?? true,
                    emailOnDownload: u.emailOnDownload ?? false,
                    marketingEmails: u.marketingEmails ?? true
                }));
            }
        }).catch(() => {});
    }, []);

    const plan = user?.plan?.toUpperCase() || "FREE";
    const isPro = plan === "PRO" || plan === "ENTERPRISE" || plan === "BUSINESS PRO";
    const [passwords, setPasswords] = useState({ current: "", new_: "", confirm: "" });
    const [showPw, setShowPw] = useState({});
    const [saved, setSaved] = useState(false);
    const [saving, setSaving] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deletePassword, setDeletePassword] = useState("");
    const [deleting, setDeleting] = useState(false);

    const update = (k, v) => setPrefs(p => ({ ...p, [k]: v }));
    const updatePw = (k, v) => setPasswords(p => ({ ...p, [k]: v }));

    const handleSave = async () => {
        setSaving(true);
        try {
            const data = { 
                twoFactorEnabled: prefs.twoFactor,
                emailOnCreate: prefs.emailOnCreate,
                emailOnDownload: prefs.emailOnDownload,
                marketingEmails: prefs.marketingEmails
            };
            if (passwords.current && passwords.new_) {
                if (passwords.new_ !== passwords.confirm) throw new Error("Passwords do not match");
                data.currentPassword = passwords.current;
                data.newPassword     = passwords.new_;
            }
            await authApi.updateProfile(data);
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
            setPasswords({ current: "", new_: "", confirm: "" });
        } catch (err) {
            alert(err.response?.data?.message || err.message || "Failed to save settings");
        } finally {
            setSaving(false);
        }
    };

    const confirmDelete = async () => {
        if (!deletePassword) return alert("Please enter your password to confirm");
        setDeleting(true);
        try {
            await authApi.deleteAccount({ password: deletePassword });
            // Logout and Redirect
            localStorage.clear();
            window.location.href = "/";
        } catch (err) {
            alert(err.response?.data?.message || "Failed to delete account. Incorrect password?");
        } finally {
            setDeleting(false);
        }
    };

    const togglePw = (k) => setShowPw(p => ({ ...p, [k]: !p[k] }));

    return (
        <>
            <style>{`
                .settings-container { padding: 24px; max-width: 680px; }
                .settings-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
                .danger-box { display: flex; justify-content: space-between; align-items: center; padding: 14px; border: 1px solid #FCA5A5; border-radius: 10px; background: #FEF2F2; gap: 16px; }
                .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 20px; }
                .modal-content { background: #fff; border-radius: 16px; padding: 32px; max-width: 440px; width: 100%; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1); }
                
                @media (max-width: 640px) {
                    .settings-container { padding: 16px; }
                    .settings-grid { grid-template-columns: 1fr; }
                    .danger-box { flex-direction: column; text-align: center; }
                    .danger-box button { width: 100%; justify-content: center; }
                }
            `}</style>

            {showDeleteModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div style={{ textAlign: "center", marginBottom: "24px" }}>
                            <div style={{ width: "56px", height: "56px", background: "#FEE2E2", borderRadius: "50%", display: "flex", alignItems: "center", justifyCenter: "center", margin: "0 auto 16px", color: "#EF4444" }}>
                                <Trash2 size={28} style={{ margin: "auto" }} />
                            </div>
                            <h3 style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: "20px", fontWeight: 700, color: "#111827", margin: "0 0 8px" }}>Delete Account</h3>
                            <p style={{ fontSize: "14px", color: "#6B7280", fontFamily: "Inter, sans-serif", lineHeight: 1.5 }}>
                                This action is permanent. All your documents and information will be erased immediately. <strong>There is no chance of getting it back.</strong>
                            </p>
                        </div>

                        <div style={{ marginBottom: "24px" }}>
                            <label style={{ fontSize: "12px", fontWeight: 600, color: "#374151", display: "block", marginBottom: "6px", fontFamily: "Inter, sans-serif" }}>Verify Password</label>
                            <input 
                                type="password" 
                                value={deletePassword} 
                                onChange={e => setDeletePassword(e.target.value)} 
                                placeholder="Enter your password" 
                                style={{ width: "100%", height: "42px", padding: "0 12px", border: "1px solid #E5E7EB", borderRadius: "8px", fontSize: "14px", outline: "none", fontFamily: "Inter, sans-serif" }} 
                            />
                        </div>

                        <div style={{ display: "flex", gap: "12px" }}>
                            <button onClick={() => setShowDeleteModal(false)} style={{ flex: 1, height: "42px", border: "1px solid #E5E7EB", borderRadius: "10px", background: "#fff", color: "#374151", fontSize: "14px", fontWeight: 600, cursor: "pointer", fontFamily: "Inter, sans-serif" }}>Cancel</button>
                            <button onClick={confirmDelete} disabled={deleting} style={{ flex: 1, height: "42px", border: "none", borderRadius: "10px", background: "#EF4444", color: "#fff", fontSize: "14px", fontWeight: 600, cursor: deleting ? "not-allowed" : "pointer", fontFamily: "Inter, sans-serif" }}>
                                {deleting ? "Deleting..." : "Permanently Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <DashHeader title="Settings" subtitle="Preferences and account security" />
            
            <div className="settings-container">
                {/* Notifications */}
                <Section title="Email Notifications" subtitle="Choose which emails you receive">
                    <Toggle label="Document Created" desc="Email when a document is generated" value={prefs.emailOnCreate} onChange={v => update("emailOnCreate", v)} disabled={!isPro} />
                    <Toggle label="PDF Downloaded" desc="Email when a PDF is downloaded" value={prefs.emailOnDownload} onChange={v => update("emailOnDownload", v)} disabled={!isPro} />
                    <Toggle label="Marketing Emails" desc="Tips and product updates" value={prefs.marketingEmails} onChange={v => update("marketingEmails", v)} />
                </Section>

                {/* Security */}
                <Section title="Security" subtitle="Password and account safety">
                    <Toggle label="2FA Authentication" desc="Require OTP on login" value={prefs.twoFactor} onChange={v => update("twoFactor", v)} />
                    
                    <p style={{ fontSize: "12px", fontWeight: 600, color: "#374151", fontFamily: "Inter, sans-serif", margin: "16px 0 12px" }}>Change Password</p>
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                        {["Current Password", "New Password", "Confirm Password"].map((l, i) => {
                            const key = i === 0 ? "current" : (i === 1 ? "new_" : "confirm");
                            return (
                                <div key={key}>
                                    <label style={{ fontSize: "11px", color: "#9CA3AF", display: "block", marginBottom: "4px", fontFamily: "Inter, sans-serif" }}>{l}</label>
                                    <div style={{ position: "relative" }}>
                                        <input type={showPw[key] ? "text" : "password"} value={passwords[key]} onChange={e => updatePw(key, e.target.value)} placeholder="••••••••" style={{ width: "100%", height: "38px", padding: "0 40px 0 12px", border: "1px solid #E5E7EB", borderRadius: "8px", fontSize: "13px", color: "#374151", outline: "none", fontFamily: "Inter, sans-serif", boxSizing: "border-box" }} />
                                        <button onClick={() => togglePw(key)} style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#9CA3AF", display: "flex" }}>
                                            {showPw[key] ? <EyeOff size={14} /> : <Eye size={14} />}
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </Section>

                {/* Danger zone */}
                <Section title="Danger Zone" subtitle="Irreversible account actions">
                    <div className="danger-box">
                        <div>
                            <p style={{ fontSize: "13px", fontWeight: 600, color: "#DC2626", fontFamily: "Inter, sans-serif", margin: "0 0 2px" }}>Delete Account</p>
                            <p style={{ fontSize: "12px", color: "#9CA3AF", fontFamily: "Inter, sans-serif", margin: 0 }}>Permanently delete your account and all data</p>
                        </div>
                        <button onClick={() => setShowDeleteModal(true)} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 14px", border: "1px solid #FCA5A5", borderRadius: "8px", background: "#fff", color: "#EF4444", fontSize: "12px", fontWeight: 600, cursor: "pointer", fontFamily: "Inter, sans-serif" }}>
                            <Trash2 size={13} /> Delete Account
                        </button>
                    </div>
                </Section>

                {/* Save */}
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <button onClick={handleSave} disabled={saving} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 24px", background: saved ? "#10B981" : (saving ? "#9CA3AF" : T), color: "#fff", border: "none", borderRadius: "8px", fontSize: "14px", fontWeight: 700, cursor: saving ? "not-allowed" : "pointer", fontFamily: "Space Grotesk, sans-serif", transition: "background 300ms" }}>
                        <Save size={16} /> {saved ? "Saved!" : (saving ? "Saving..." : "Save Settings")}
                    </button>
                </div>
            </div>
        </>
    );
}