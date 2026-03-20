"use client";
import { useState } from "react";
import DashHeader from "@/components/dashboard/DashHeader";
import { Save, Eye, EyeOff, Trash2 } from "lucide-react";

const T = "#0D9488";

function Section({ title, subtitle, children }) {
    return (
        <div style={{
            background: "#fff", border: "1px solid #E5E7EB",
            borderRadius: "12px", overflow: "hidden",
            marginBottom: "20px",
        }}>
            <div style={{
                padding: "16px 20px",
                borderBottom: "1px solid #F3F4F6",
            }}>
                <p style={{
                    fontFamily: "Space Grotesk, sans-serif",
                    fontWeight: 700, fontSize: "14px",
                    color: "#111827", margin: 0,
                }}>{title}</p>
                {subtitle && (
                    <p style={{
                        fontSize: "12px", color: "#9CA3AF",
                        fontFamily: "Inter, sans-serif",
                        margin: "2px 0 0",
                    }}>{subtitle}</p>
                )}
            </div>
            <div style={{ padding: "20px" }}>{children}</div>
        </div>
    );
}

function Toggle({ label, desc, value, onChange }) {
    return (
        <div style={{
            display: "flex", justifyContent: "space-between",
            alignItems: "center", padding: "12px 0",
            borderBottom: "1px solid #F3F4F6",
        }}>
            <div>
                <p style={{
                    fontSize: "13px", fontWeight: 600,
                    color: "#374151", fontFamily: "Inter, sans-serif",
                    margin: "0 0 2px",
                }}>{label}</p>
                {desc && (
                    <p style={{
                        fontSize: "11px", color: "#9CA3AF",
                        fontFamily: "Inter, sans-serif", margin: 0,
                    }}>{desc}</p>
                )}
            </div>
            <button onClick={() => onChange(!value)} style={{
                width: "42px", height: "22px",
                background: value ? T : "#D1D5DB",
                borderRadius: "11px", border: "none",
                cursor: "pointer", position: "relative",
                transition: "background 200ms", flexShrink: 0,
            }}>
                <div style={{
                    position: "absolute",
                    top: "2px", left: value ? "21px" : "2px",
                    width: "18px", height: "18px",
                    background: "#fff", borderRadius: "50%",
                    transition: "left 200ms",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                }} />
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

    const [passwords, setPasswords] = useState({
        current: "", new_: "", confirm: "",
    });
    const [showPw, setShowPw] = useState({});
    const [saved, setSaved] = useState(false);

    const update = (k, v) => setPrefs(p => ({ ...p, [k]: v }));
    const updatePw = (k, v) => setPasswords(p => ({ ...p, [k]: v }));
    const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };
    const togglePw = (k) => setShowPw(p => ({ ...p, [k]: !p[k] }));

    return (
        <>
            <DashHeader title="Settings" subtitle="Preferences and account security" />
            <div style={{ padding: "24px", maxWidth: "680px" }}>

                {/* Notifications */}
                <Section title="Email Notifications" subtitle="Choose which emails you receive">
                    <Toggle label="Document Created" desc="Email when a document is generated" value={prefs.emailOnCreate} onChange={v => update("emailOnCreate", v)} />
                    <Toggle label="PDF Downloaded" desc="Email when a PDF is downloaded" value={prefs.emailOnDownload} onChange={v => update("emailOnDownload", v)} />
                    <Toggle label="Marketing Emails" desc="Tips, product updates and offers from DocMinty" value={prefs.marketingEmails} onChange={v => update("marketingEmails", v)} />
                </Section>

                {/* Document defaults */}
                <Section title="Document Defaults" subtitle="Pre-fill settings for new documents">
                    <div style={{
                        display: "grid", gridTemplateColumns: "1fr 1fr",
                        gap: "14px",
                    }}>
                        {[
                            {
                                label: "Default GST Rate", field: "defaultGST",
                                options: [{ v: "0", l: "0%" }, { v: "5", l: "5%" }, { v: "12", l: "12%" }, { v: "18", l: "18%" }, { v: "28", l: "28%" }]
                            },
                            {
                                label: "Default Tax Type", field: "defaultTaxType",
                                options: [{ v: "cgst_sgst", l: "CGST + SGST" }, { v: "igst", l: "IGST" }, { v: "none", l: "No Tax" }]
                            },
                            {
                                label: "Date Format", field: "dateFormat",
                                options: [{ v: "DD/MM/YYYY", l: "DD/MM/YYYY" }, { v: "MM/DD/YYYY", l: "MM/DD/YYYY" }, { v: "YYYY-MM-DD", l: "YYYY-MM-DD" }]
                            },
                            {
                                label: "Language", field: "language",
                                options: [{ v: "en", l: "English" }, { v: "hi", l: "Hindi" }]
                            },
                        ].map(f => (
                            <div key={f.field}>
                                <label style={{
                                    fontSize: "12px", fontWeight: 600,
                                    color: "#374151", display: "block",
                                    marginBottom: "5px", fontFamily: "Inter, sans-serif",
                                }}>{f.label}</label>
                                <select
                                    value={prefs[f.field]}
                                    onChange={e => update(f.field, e.target.value)}
                                    style={{
                                        width: "100%", height: "38px", padding: "0 10px",
                                        border: "1px solid #E5E7EB", borderRadius: "8px",
                                        fontSize: "13px", color: "#374151",
                                        fontFamily: "Inter, sans-serif",
                                        outline: "none", cursor: "pointer",
                                        background: "#fff",
                                    }}>
                                    {f.options.map(o => (
                                        <option key={o.v} value={o.v}>{o.l}</option>
                                    ))}
                                </select>
                            </div>
                        ))}
                    </div>

                    <div style={{ marginTop: "14px" }}>
                        <Toggle
                            label="Auto-save Documents"
                            desc="Automatically save documents to cloud"
                            value={prefs.autoSave}
                            onChange={v => update("autoSave", v)}
                        />
                        <Toggle
                            label="Show DocMinty Footer"
                            desc="Show generated by DocMinty.com in PDFs"
                            value={prefs.showWatermark}
                            onChange={v => update("showWatermark", v)}
                        />
                    </div>
                </Section>

                {/* Security */}
                <Section title="Security" subtitle="Password and two-factor authentication">
                    <div style={{ marginBottom: "16px" }}>
                        <Toggle
                            label="Two-Factor Authentication"
                            desc="Require OTP on login for extra security"
                            value={prefs.twoFactor}
                            onChange={v => update("twoFactor", v)}
                        />
                    </div>

                    <p style={{
                        fontSize: "12px", fontWeight: 600,
                        color: "#374151", fontFamily: "Inter, sans-serif",
                        margin: "0 0 12px",
                    }}>Change Password</p>
                    <div style={{
                        display: "flex", flexDirection: "column", gap: "10px",
                    }}>
                        {[
                            { key: "current", label: "Current Password" },
                            { key: "new_", label: "New Password" },
                            { key: "confirm", label: "Confirm Password" },
                        ].map(f => (
                            <div key={f.key}>
                                <label style={{
                                    fontSize: "11px", color: "#9CA3AF",
                                    display: "block", marginBottom: "4px",
                                    fontFamily: "Inter, sans-serif",
                                }}>{f.label}</label>
                                <div style={{ position: "relative" }}>
                                    <input
                                        type={showPw[f.key] ? "text" : "password"}
                                        value={passwords[f.key]}
                                        onChange={e => updatePw(f.key, e.target.value)}
                                        placeholder="••••••••"
                                        style={{
                                            width: "100%", height: "38px",
                                            padding: "0 40px 0 12px",
                                            border: "1px solid #E5E7EB",
                                            borderRadius: "8px", fontSize: "13px",
                                            color: "#374151", outline: "none",
                                            fontFamily: "Inter, sans-serif",
                                            boxSizing: "border-box",
                                        }}
                                    />
                                    <button onClick={() => togglePw(f.key)} style={{
                                        position: "absolute", right: "10px",
                                        top: "50%", transform: "translateY(-50%)",
                                        background: "none", border: "none",
                                        cursor: "pointer", color: "#9CA3AF",
                                        display: "flex",
                                    }}>
                                        {showPw[f.key] ? <EyeOff size={14} /> : <Eye size={14} />}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </Section>

                {/* Danger zone */}
                <Section title="Danger Zone" subtitle="Irreversible account actions">
                    <div style={{
                        display: "flex", justifyContent: "space-between",
                        alignItems: "center", padding: "14px",
                        border: "1px solid #FCA5A5",
                        borderRadius: "10px", background: "#FEF2F2",
                    }}>
                        <div>
                            <p style={{
                                fontSize: "13px", fontWeight: 600,
                                color: "#DC2626", fontFamily: "Inter, sans-serif",
                                margin: "0 0 2px",
                            }}>Delete Account</p>
                            <p style={{
                                fontSize: "12px", color: "#9CA3AF",
                                fontFamily: "Inter, sans-serif", margin: 0,
                            }}>
                                Permanently delete your account and all documents
                            </p>
                        </div>
                        <button style={{
                            display: "flex", alignItems: "center", gap: "6px",
                            padding: "8px 14px",
                            border: "1px solid #FCA5A5",
                            borderRadius: "8px", background: "#fff",
                            color: "#EF4444", fontSize: "12px",
                            fontWeight: 600, cursor: "pointer",
                            fontFamily: "Inter, sans-serif",
                        }}>
                            <Trash2 size={13} /> Delete Account
                        </button>
                    </div>
                </Section>

                {/* Save */}
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <button onClick={save} style={{
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
                        {saved ? "Saved!" : "Save Settings"}
                    </button>
                </div>
            </div>
        </>
    );
}