"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { documentsApi } from "@/api/documents";
import { getAccessToken } from "@/api/auth";
import toast, { Toaster } from "react-hot-toast";
import { Mic, MicOff, Copy, Trash2, Cloud, History, ChevronDown, CheckCircle, Smartphone } from "lucide-react";
import { useRouter } from "next/navigation";

const T = "#0D9488";

const LANGUAGES = [
    { label: "English (India)", code: "en-IN", flag: "🇮🇳" },
    { label: "Hindi (हिन्दी)", code: "hi-IN", flag: "🇮🇳" },
    { label: "Tamil (தமிழ்)", code: "ta-IN", flag: "🇮🇳" },
    { label: "Telugu (తెలుగు)", code: "te-IN", flag: "🇮🇳" },
    { label: "Kannada (ಕನ್ನಡ)", code: "kn-IN", flag: "🇮🇳" },
    { label: "Malayalam (മലയാളം)", code: "ml-IN", flag: "🇮🇳" },
    { label: "Marathi (मराठी)", code: "mr-IN", flag: "🇮🇳" },
    { label: "Gujarati (ગુજરાતી)", code: "gu-IN", flag: "🇮🇳" },
    { label: "Bengali (বাংলা)", code: "bn-IN", flag: "🇮🇳" },
];

export default function AudioToTextPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [isRecording, setIsRecording] = useState(false);
    const [transcription, setTranscription] = useState("");
    const [selectedLang, setSelectedLang] = useState(LANGUAGES[0]);
    const [isSaving, setIsSaving] = useState(false);
    const recognitionRef = useRef(null);
    const plan = user?.plan?.toUpperCase() || "FREE";
    const isUserPro = plan === "PRO" || plan === "ENTERPRISE" || plan === "BUSINESS PRO";

    // Initialize Recognition
    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            toast.error("Your browser does not support Speech Recognition. Use Chrome or Edge.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = selectedLang.code;

        recognition.onresult = (event) => {
            let interimTranscript = "";
            let finalTranscript = "";

            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    finalTranscript += event.results[i][0].transcript;
                } else {
                    interimTranscript += event.results[i][0].transcript;
                }
            }
            setTranscription(prev => prev + finalTranscript);
        };

        recognition.onend = () => {
            if (isRecording) {
                recognition.start(); // Auto-restart if we're still recording
            }
        };

        recognition.onerror = (event) => {
            console.error("Speech recognition error:", event.error);
            if (event.error === "not-allowed") {
                toast.error("Microphone access denied.");
                setIsRecording(false);
            }
        };

        recognitionRef.current = recognition;
    }, [selectedLang]);

    const toggleRecording = () => {
        if (!recognitionRef.current) return;

        if (isRecording) {
            recognitionRef.current.stop();
            setIsRecording(false);
            toast.success("Recording stopped");
        } else {
            setTranscription("");
            recognitionRef.current.start();
            setIsRecording(true);
            toast.success("Listening...");
        }
    };

    const handleCopy = () => {
        if (!transcription) return;
        navigator.clipboard.writeText(transcription);
        toast.success("Copied to clipboard");
    };

    const handleClear = () => {
        if (confirm("Clear transcription?")) {
            setTranscription("");
        }
    };

    const handleSave = async () => {
        if (!getAccessToken()) { toast.error("Please sign in to save"); router.push("/login"); return; }
        if (!isUserPro) {
            toast.error("Cloud saving is a PRO feature.");
            router.push("/pricing");
            return;
        }
        if (!transcription) {
            toast.error("No transcription to save.");
            return;
        }

        setIsSaving(true);
        const pendingToast = toast.loading("Saving to cloud...");
        try {
            const payload = {
                docType: "audio-to-text",
                title: "Transcription: " + new Date().toLocaleString(),
                referenceNumber: "AT-" + Date.now().toString().slice(-6),
                templateName: "audioTranscription",
                partyName: selectedLang.label,
                amount: "0.00",
                formData: JSON.stringify({
                    text: transcription,
                    language: selectedLang.label,
                    date: new Date().toISOString()
                }),
                file: new Blob([transcription], { type: "text/plain" })
            };
            await documentsApi.save(payload);
            toast.dismiss(pendingToast);
            toast.success("Saved to your dashboard!");
        } catch (err) {
            toast.dismiss(pendingToast);
            if (err.message !== "PLAN_LIMIT_REACHED") toast.error("Save failed");
        } finally {
            setIsSaving(false);
        }
    };

    const changeLanguage = (lang) => {
        if (lang.code !== "en-IN" && !isUserPro) {
            toast.error(`${lang.label} is a PRO feature.`);
            router.push("/pricing");
            return;
        }
        setSelectedLang(lang);
        if (isRecording) {
            recognitionRef.current.stop();
            setIsRecording(false);
        }
    };

    return (
        <div style={{ background: "#F9FAFB", minHeight: "100vh" }}>
            <Toaster position="top-right" />
            <Navbar />

            {/* Header section */}
            <div style={{ background: "#fff", borderBottom: "1px solid #E5E7EB", padding: "64px 24px 100px", minHeight: "320px", display: "flex", alignItems: "center" }}>
                <div style={{ maxWidth: "1000px", margin: "0 auto", textAlign: "center", width: "100%" }}>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: T + "10", color: T, padding: "8px 16px", borderRadius: "100px", marginBottom: "16px", fontSize: "13px", fontWeight: 700 }}>
                        <Mic size={14} /> NEW FEATURE
                    </div>
                    <h1 style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 800, color: "#111827", margin: "0 0 12px" }}>
                        Audio to <span style={{ color: T }}>Text</span> Tool
                    </h1>
                    <p style={{ fontSize: "16px", color: "#6B7280", maxWidth: "600px", margin: "0 auto", lineHeight: 1.6, fontFamily: "Inter, sans-serif" }}>
                        Transcribe your speech in real-time. Supports multiple Indian languages for professional documentation.
                    </p>
                </div>
            </div>

            <main style={{ maxWidth: "1000px", margin: "-40px auto 60px", padding: "0 24px", position: "relative", zIndex: 10 }}>
                <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: "32px" }} className="audio-grid">

                    {/* Controls Panel */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                        <div style={{ background: "#fff", padding: "20px", borderRadius: "20px", boxShadow: "0 10px 25px -5px rgba(0,0,0,0.05)", border: "1px solid #E5E7EB" }}>
                            <label style={{ fontSize: "11px", fontWeight: 800, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.1em", display: "block", marginBottom: "16px", paddingLeft: "4px" }}>Transcription Language</label>
                            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                                {LANGUAGES.map(lang => (
                                    <button
                                        key={lang.code}
                                        onClick={() => changeLanguage(lang)}
                                        style={{
                                            display: "flex", alignItems: "center", gap: "12px",
                                            width: "100%", padding: "12px 14px", borderRadius: "12px",
                                            border: selectedLang.code === lang.code ? `2px solid ${T}` : "1px solid #F3F4F6",
                                            background: selectedLang.code === lang.code ? T + "08" : "transparent",
                                            fontSize: "14px", fontWeight: 700, color: selectedLang.code === lang.code ? T : "#4B5563",
                                            cursor: "pointer", transition: "all 200ms",
                                            position: "relative",
                                            textAlign: "left",
                                            minHeight: "48px"
                                        }}
                                    >
                                        <span style={{ fontSize: "18px", flexShrink: 0 }}>{lang.flag}</span>
                                        <span style={{ flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{lang.label}</span>
                                        {selectedLang.code === lang.code && <CheckCircle size={16} color={T} style={{ flexShrink: 0 }} />}
                                        {lang.code !== "en-IN" && !isUserPro && (
                                            <span style={{
                                                fontSize: "9px", fontWeight: 900, background: "#F1F5F9",
                                                color: "#64748B", padding: "2px 6px", borderRadius: "6px",
                                                marginLeft: "auto", flexShrink: 0
                                            }}>PRO</span>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                    </div>

                    {/* Editor Panel */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                        <div style={{
                            background: "#fff",
                            borderRadius: "20px",
                            boxShadow: "0 10px 40px -10px rgba(0,0,0,0.08)",
                            border: "1px solid #E5E7EB",
                            overflow: "hidden",
                            overflow: "hidden",
                            display: "flex",
                            flexDirection: "column",
                            minHeight: "550px"
                        }}>
                            {/* Toolbar */}
                            <div style={{ padding: "14px 20px", borderBottom: "1px solid #F3F4F6", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#FCFDFD" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                    <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: isRecording ? "#EF4444" : "#D1D5DB", boxShadow: isRecording ? "0 0 10px #EF4444" : "none" }} />
                                    <span style={{ fontSize: "12px", fontWeight: 700, color: isRecording ? "#EF4444" : "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                                        {isRecording ? "Listening" : "Microphone Idle"}
                                    </span>
                                </div>
                                <div style={{ display: "flex", gap: "10px" }}>
                                    <button onClick={handleCopy} disabled={!transcription} style={{ height: "34px", padding: "0 14px", borderRadius: "8px", border: "1px solid #E5E7EB", background: "#fff", color: "#4B5563", fontSize: "13px", fontWeight: 600, display: "flex", alignItems: "center", gap: "6px", cursor: transcription ? "pointer" : "not-allowed", transition: "all 150ms" }}>
                                        <Copy size={13} /> Copy
                                    </button>
                                    <button onClick={handleClear} disabled={!transcription} style={{ height: "34px", padding: "0 14px", borderRadius: "8px", border: "1px solid #FEE2E2", background: "#FFF", color: "#EF4444", fontSize: "13px", fontWeight: 600, display: "flex", alignItems: "center", gap: "6px", cursor: transcription ? "pointer" : "not-allowed", transition: "all 150ms" }}>
                                        <Trash2 size={13} /> Clear
                                    </button>
                                </div>
                            </div>

                            {/* Text Area */}
                            <div style={{ flex: 1, position: "relative" }}>
                                <textarea
                                    value={transcription}
                                    onChange={(e) => setTranscription(e.target.value)}
                                    placeholder="Start speaking and your transcription will appear here..."
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        padding: "24px",
                                        border: "none",
                                        outline: "none",
                                        fontSize: "18px",
                                        lineHeight: 1.6,
                                        color: "#1F2937",
                                        fontFamily: "Inter, sans-serif",
                                        resize: "none"
                                    }}
                                />
                                {!transcription && !isRecording && (
                                    <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", textAlign: "center", pointerEvents: "none" }}>
                                        <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: T + "10", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                                            <Mic size={32} color={T} />
                                        </div>
                                        <p style={{ color: "#9CA3AF", fontSize: "14px", fontWeight: 500 }}>Click the button below to start</p>
                                    </div>
                                )}
                            </div>

                            {/* Footer Controls */}
                            <div style={{ padding: "24px", borderTop: "1px solid #F3F4F6", background: "#F9FAFB", display: "flex", justifyContent: "center", alignItems: "center", gap: "24px" }}>
                                <button
                                    onClick={toggleRecording}
                                    style={{
                                        width: "80px", height: "80px", borderRadius: "50%",
                                        border: "none", background: isRecording ? "#EF4444" : T,
                                        color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
                                        cursor: "pointer", transition: "all 300ms",
                                        boxShadow: isRecording ? "0 0 25px rgba(239, 68, 68, 0.4)" : "0 8px 16px rgba(13, 148, 136, 0.3)",
                                        animation: isRecording ? "pulse 1.5s infinite" : "none"
                                    }}
                                >
                                    {isRecording ? <MicOff size={32} /> : <Mic size={32} />}
                                </button>

                                <button
                                    onClick={handleSave}
                                    style={{
                                        height: "50px", padding: "0 24px", borderRadius: "12px",
                                        border: "none", background: "#111827", color: "#fff",
                                        fontSize: "15px", fontWeight: 700, display: "flex", alignItems: "center", gap: "10px",
                                        cursor: "pointer", transition: "all 150ms",
                                        boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)"
                                    }}
                                >
                                    <Cloud size={18} /> Save to Cloud
                                    {isUserPro ? <span style={{ fontSize: "10px", background: T, color: "#fff", padding: "2px 6px", borderRadius: "100px" }}>PRO</span> : null}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>


            </main>

            <style jsx>{`
                @keyframes pulse {
                    0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
                    70% { transform: scale(1.05); box-shadow: 0 0 0 20px rgba(239, 68, 68, 0); }
                    100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
                }
                @media (max-width: 768px) {
                    .audio-grid {
                        grid-template-columns: 1fr !important;
                    }
                    .mobile-only {
                        display: flex !important;
                    }
                }
                .mobile-only {
                    display: none;
                }
            `}</style>

            <Footer />
        </div>
    );
}
