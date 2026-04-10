"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { documentsApi } from "@/api/documents";
import { getAccessToken } from "@/api/auth";
import toast, { Toaster } from "react-hot-toast";
import { Mic, MicOff, Copy, Trash2, Cloud, History, ChevronDown, CheckCircle, Smartphone, Download, Volume2 } from "lucide-react";
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

    const handleDownload = () => {
        if (!transcription) return;
        const element = document.createElement("a");
        const file = new Blob([transcription], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = `transcription-${new Date().getTime()}.txt`;
        document.body.appendChild(element);
        element.click();
        toast.success("Downloading text file...");
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
        <div style={{ background: "#F8FAFC", minHeight: "100vh" }}>
            <Toaster position="top-right" />
            <Navbar />

            {/* Premium Hero Header */}
            <div className="hero-section">
                <div className="hero-content">
                    <div className="badge">
                        <Volume2 size={14} /> AI POWERED TRANSCRIPTION
                    </div>
                    <h1 className="hero-title">
                        Capture Every <span className="text-gradient">Word</span>
                    </h1>
                    <p className="hero-subtitle">
                        High-accuracy real-time speech-to-text for professional Indian workflows. 
                        Works seamlessly in browser with no extra software.
                    </p>
                </div>
                
                {/* Background Decoration */}
                <div className="hero-bg-shapes">
                    <div className="shape shape-1"></div>
                    <div className="shape shape-2"></div>
                </div>
            </div>

            <main className="main-container">
                {/* Language Pill Selector */}
                <div className="language-selector-container">
                    <div className="selector-label">Target Language</div>
                    <div className="language-scroll">
                        {LANGUAGES.map(lang => (
                            <button
                                key={lang.code}
                                onClick={() => changeLanguage(lang)}
                                className={`lang-pill ${selectedLang.code === lang.code ? 'active' : ''}`}
                            >
                                <span className="flag">{lang.flag}</span>
                                <span className="label">{lang.label}</span>
                                {lang.code !== "en-IN" && !isUserPro && <span className="pro-tag">PRO</span>}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Glassmorphic Editor Panel */}
                <div className="editor-card">
                    {/* Floating Toolbar */}
                    <div className="editor-toolbar">
                        <div className="status-indicator">
                            <div className={`status-dot ${isRecording ? 'pulse' : ''}`} />
                            <span className="status-text">{isRecording ? "Transcribing Live" : "Microphone Locked"}</span>
                        </div>
                        
                        <div className="toolbar-actions">
                            <button className="text-btn" onClick={handleCopy} disabled={!transcription}>
                                <Copy size={16} /> <span className="btn-label">Copy</span>
                            </button>
                            <button className="text-btn" onClick={handleDownload} disabled={!transcription}>
                                <Download size={16} /> <span className="btn-label">Save TXT</span>
                            </button>
                            <button className="text-btn danger" onClick={handleClear} disabled={!transcription}>
                                <Trash2 size={16} /> <span className="btn-label">Clear</span>
                            </button>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="editor-body">
                        {isRecording && (
                            <div className="voice-waves">
                                {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                                    <div key={i} className="wave" />
                                ))}
                            </div>
                        )}
                        
                        <textarea
                            value={transcription}
                            onChange={(e) => setTranscription(e.target.value)}
                            placeholder={isRecording ? "Listening to your voice..." : "Press record to start transcribing..."}
                            className="transcription-textarea"
                        />
                        
                        {!transcription && !isRecording && (
                            <div className="empty-state">
                                <h3>Ready to capture your thoughts?</h3>
                                <p>Select a language and tap the button below to begin</p>
                            </div>
                        )}
                    </div>

                    {/* Footer docked controls */}
                    <div className="editor-footer">
                        <div className="footer-content">
                                <div className="lang-summary">
                                    <span className="lang-label">Transcribing in:</span>
                                    <span className="lang-name">{selectedLang.flag} {selectedLang.label}</span>
                                </div>

                                <div className="main-actions">
                                    <button 
                                        className={`record-btn ${isRecording ? 'recording' : ''}`}
                                        onClick={toggleRecording}
                                        title={isRecording ? "Stop Recording" : "Start Recording"}
                                    >
                                        {isRecording ? <MicOff size={24} /> : <Mic size={24} />}
                                    </button>
                                    
                                    <button className="cloud-save-btn" onClick={handleSave} disabled={isSaving || !transcription}>
                                        <Cloud size={18} />
                                        <span>{isSaving ? "Saving..." : "Save to Dashboard"}</span>
                                        {isUserPro && <div className="pro-badge">PRO</div>}
                                    </button>
                                </div>
                                
                                <div className="stats">
                                    <span className="stat">{transcription.split(/\s+/).filter(Boolean).length} words</span>
                                    <span className="stat-sep">•</span>
                                    <span className="stat">{transcription.length} characters</span>
                                </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />

            <style jsx>{`
                .hero-section {
                    background: #fff;
                    padding: 80px 24px 80px;
                    border-bottom: 1px solid #E5E7EB;
                    text-align: center;
                    position: relative;
                    overflow: hidden;
                    transition: all 0.4s ease;
                }
                .hero-content {
                    max-width: 800px;
                    margin: 0 auto;
                    position: relative;
                    z-index: 2;
                }
                .badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    background: ${T}15;
                    color: ${T};
                    padding: 8px 16px;
                    border-radius: 100px;
                    font-size: 12px;
                    font-weight: 800;
                    letter-spacing: 0.05em;
                    margin-bottom: 24px;
                }
                .hero-title {
                    font-family: 'Space Grotesk', sans-serif;
                    font-size: clamp(32px, 5vw, 52px);
                    font-weight: 800;
                    color: #0F172A;
                    margin-bottom: 20px;
                    line-height: 1.1;
                }
                .text-gradient {
                    color: ${T};
                }
                .hero-subtitle {
                    font-family: 'Inter', sans-serif;
                    font-size: 18px;
                    color: #64748B;
                    line-height: 1.6;
                    max-width: 600px;
                    margin: 0 auto;
                }
                
                .hero-bg-shapes {
                    position: absolute;
                    inset: 0;
                    z-index: 1;
                    pointer-events: none;
                }
                .shape {
                    position: absolute;
                    filter: blur(80px);
                    opacity: 0.15;
                    border-radius: 50%;
                }
                .shape-1 {
                    width: 300px;
                    height: 300px;
                    background: ${T};
                    top: -100px;
                    left: -100px;
                }
                .shape-2 {
                    width: 400px;
                    height: 400px;
                    background: #6366F1;
                    bottom: -150px;
                    right: -100px;
                }

                .main-container {
                    max-width: 1100px;
                    margin: 40px auto 80px;
                    padding: 0 24px;
                    position: relative;
                    z-index: 10;
                }

                /* Language Selector */
                .language-selector-container {
                    margin-bottom: 24px;
                }
                .selector-label {
                    font-size: 11px;
                    font-weight: 800;
                    color: #64748B;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    margin-bottom: 12px;
                    padding-left: 4px;
                }
                .language-scroll {
                    display: flex;
                    gap: 10px;
                    overflow-x: auto;
                    padding-bottom: 8px;
                    scrollbar-width: none;
                }
                .language-scroll::-webkit-scrollbar { display: none; }
                
                .lang-pill {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    padding: 10px 18px;
                    background: #fff;
                    border: 1px solid #E2E8F0;
                    border-radius: 8px;
                    white-space: nowrap;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .lang-pill.active {
                    background: ${T};
                    border-color: ${T};
                    color: #fff;
                }
                .lang-pill .label {
                    font-size: 14px;
                    font-weight: 700;
                }
                .lang-pill.active .label { color: #fff; }
                .lang-pill:not(.active):hover {
                    border-color: ${T};
                    background: ${T}05;
                    transform: translateY(-2px);
                }
                .pro-tag {
                    font-size: 9px;
                    font-weight: 900;
                    background: #F1F5F9;
                    color: #64748B;
                    padding: 2px 6px;
                    border-radius: 4px;
                    margin-left: 4px;
                }

                /* Editor Card */
                .editor-card {
                    background: #fff;
                    border: 1px solid #E2E8F0;
                    border-radius: 12px;
                    display: flex;
                    flex-direction: column;
                    min-height: 600px;
                    overflow: hidden;
                    transition: all 0.4s ease;
                }
                
                .editor-toolbar {
                    padding: 20px 28px;
                    border-bottom: 1px solid #F1F5F9;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    flex-wrap: wrap;
                    gap: 16px;
                }
                .status-indicator {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                .status-dot {
                    width: 10px;
                    height: 10px;
                    border-radius: 50%;
                    background: ${isRecording ? '#EF4444' : '#94A3B8'};
                }
                .status-dot.pulse {
                    animation: dot-pulse 1.5s infinite;
                    box-shadow: 0 0 12px #EF4444;
                }
                .status-text {
                    font-size: 13px;
                    font-weight: 700;
                    color: ${isRecording ? '#EF4444' : '#64748B'};
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }

                .toolbar-actions {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }
                .icon-btn {
                    width: 40px;
                    height: 40px;
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: #F1F5F9;
                    border: none;
                    color: #64748B;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .icon-btn:hover { background: ${T}; color: #fff; }
                
                .divider {
                    width: 1px;
                    height: 24px;
                    background: #E2E8F0;
                }

                .text-btn {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 10px 16px;
                    background: #F1F5F9;
                    border: 1px solid transparent;
                    border-radius: 8px;
                    color: #475569;
                    font-size: 13px;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .text-btn:disabled { opacity: 0.5; cursor: not-allowed; }
                .text-btn:not(:disabled):hover {
                    background: #E2E8F0;
                    transform: translateY(-1px);
                }
                .text-btn.danger { color: #EF4444; background: #FEF2F2; }
                .text-btn.danger:hover { background: #FEE2E2; }
                
                .editor-body {
                    flex: 1;
                    padding: 40px 32px;
                    display: flex;
                    flex-direction: column;
                    position: relative;
                    min-height: 400px;
                }
                
                .transcription-textarea {
                    flex: 1;
                    background: transparent;
                    border: none;
                    outline: none;
                    width: 100%;
                    font-size: 18px;
                    line-height: 1.8;
                    font-family: 'Inter', sans-serif;
                    color: #1E293B;
                    resize: none;
                    z-index: 2;
                }
                .transcription-textarea::placeholder {
                    color: #94A3B8;
                }

                .empty-state {
                    position: absolute;
                    inset: 0;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    pointer-events: none;
                    z-index: 1;
                    padding: 20px;
                    text-align: center;
                }
                .empty-state h3 {
                    font-family: 'Space Grotesk', sans-serif;
                    font-size: 24px;
                    font-weight: 800;
                    color: #1E293B;
                    margin-bottom: 12px;
                }
                .empty-state p {
                    color: #64748B;
                    font-size: 16px;
                    max-width: 300px;
                }

                .voice-waves {
                    display: flex;
                    align-items: center;
                    gap: 3px;
                    height: 30px;
                    margin-bottom: 24px;
                }
                .wave {
                    width: 3px;
                    background: ${T};
                    border-radius: 10px;
                    animation: wave-bounce 1s ease-in-out infinite;
                }
                .wave:nth-child(1) { height: 10px; animation-delay: 0.1s; }
                .wave:nth-child(2) { height: 20px; animation-delay: 0.2s; }
                .wave:nth-child(3) { height: 15px; animation-delay: 0.3s; }
                .wave:nth-child(4) { height: 25px; animation-delay: 0.4s; }
                .wave:nth-child(5) { height: 18px; animation-delay: 0.1s; }
                .wave:nth-child(6) { height: 12px; animation-delay: 0.5s; }
                .wave:nth-child(7) { height: 22px; animation-delay: 0.2s; }
                .wave:nth-child(8) { height: 14px; animation-delay: 0.3s; }

                /* Editor Footer */
                .editor-footer {
                    padding: 24px 32px;
                    background: #F8FAFC;
                    border-top: 1px solid #F1F5F9;
                }
                .footer-content {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    gap: 32px;
                }
                
                .lang-summary {
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                    flex: 1;
                }
                .lang-label {
                    font-size: 10px;
                    font-weight: 800;
                    color: #94A3B8;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                }
                .lang-name {
                    font-size: 14px;
                    font-weight: 700;
                    color: #475569;
                }

                .main-actions {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                }
                .record-btn {
                    width: 48px;
                    height: 48px;
                    border-radius: 8px;
                    background: ${isRecording ? '#EF4444' : T};
                    border: none;
                    color: #fff;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    position: relative;
                    transition: all 0.3s;
                    z-index: 5;
                }
                .record-btn:hover {
                    transform: scale(1.05);
                }
                .record-btn.recording {
                    animation: recording-jiggle 0.3s linear infinite;
                }

                .cloud-save-btn {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    height: 48px;
                    padding: 0 24px;
                    background: #0F172A;
                    color: #fff;
                    border: none;
                    border-radius: 8px;
                    font-size: 14px;
                    font-weight: 700;
                    font-family: 'Space Grotesk', sans-serif;
                    cursor: pointer;
                    transition: all 200ms;
                    position: relative;
                    text-decoration: none;
                }
                .cloud-save-btn:disabled { opacity: 0.5; cursor: not-allowed; }
                .cloud-save-btn:not(:disabled):hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 20px rgba(0,0,0,0.15);
                }
                
                .pro-badge {
                    position: absolute;
                    top: -10px;
                    right: -10px;
                    background: ${T};
                    color: #fff;
                    font-size: 9px;
                    font-weight: 950;
                    padding: 3px 8px;
                    border-radius: 100px;
                    box-shadow: 0 4px 6px -1px rgba(13, 148, 136, 0.4);
                }

                .stats {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    font-size: 13px;
                    font-weight: 600;
                    color: #94A3B8;
                    justify-content: flex-end;
                    flex: 1;
                }

                @keyframes dot-pulse {
                    0% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.5); opacity: 0.5; }
                    100% { transform: scale(1); opacity: 1; }
                }
                @keyframes recording-jiggle {
                    0% { transform: rotate(0deg); }
                    25% { transform: rotate(1deg); }
                    75% { transform: rotate(-1deg); }
                    100% { transform: rotate(0deg); }
                }
                @keyframes wave-bounce {
                    0%, 100% { transform: scaleY(1); }
                    50% { transform: scaleY(1.5); }
                }

                @media (max-width: 768px) {
                    .hero-section { padding: 60px 20px 100px; }
                    .hero-title { font-size: 32px; }
                    .main-container { margin-top: 24px; padding: 0 16px; }
                    
                    .editor-toolbar { padding: 16px; }
                    .btn-label { display: none; }
                    .editor-body { padding: 24px; }
                    
                    .editor-footer { padding: 16px; }
                    .footer-content { flex-direction: column; gap: 16px; }
                    .stats { order: 3; justify-content: center; }
                    .main-actions { order: 1; width: 100%; flex-direction: row; justify-content: center; gap: 16px; }
                    .cloud-save-btn { padding: 12px 20px; font-size: 13px; }
                    .record-btn { width: 48px; height: 48px; border-radius: 8px; }
                    .lang-summary { order: 2; text-align: center; }
                }
            `}</style>
        </div>
    );
}
