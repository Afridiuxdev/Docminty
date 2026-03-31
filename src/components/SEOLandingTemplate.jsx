"use client";

import React, { useState, useEffect, useRef } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import AdSense from "./AdSense";
import { ArrowRight, ChevronDown, ChevronUp, Mail, Shield, Clock, Star, Zap, CheckCircle } from "lucide-react";
import Link from "next/link";

// ── Sub components ────────────────────────────────────────────

function AnimatedNumber({ end, suffix = "", decimals = 0, duration = 2000 }) {
    const [count, setCount] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setIsVisible(true);
                observer.disconnect();
            }
        }, { threshold: 0.1 });
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!isVisible) return;
        let start = 0;
        const endNum = parseFloat(end);
        if (start === endNum) return;

        const totalFrames = Math.round(duration / 16);
        const increment = (endNum - start) / totalFrames;
        let currentFrame = 0;

        const timer = setInterval(() => {
            currentFrame++;
            setCount((prev) => {
                const next = prev + increment;
                if (currentFrame >= totalFrames) {
                    clearInterval(timer);
                    return endNum;
                }
                return next;
            });
        }, 16);

        return () => clearInterval(timer);
    }, [isVisible, end, duration]);

    return (
        <span ref={ref}>
            {count.toFixed(decimals)}
            {suffix}
        </span>
    );
}

const FAQItem = ({ q, a }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div style={{ 
            background: "#fff", 
            borderRadius: "12px", 
            border: "1px solid #E2E8F0",
            marginBottom: "16px",
            overflow: "hidden",
            transition: "all 300ms ease",
            boxShadow: isOpen ? "0 4px 20px rgba(0,0,0,0.05)" : "none"
        }}>
            <button 
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "20px 24px",
                    background: "none",
                    border: "none",
                    textAlign: "left",
                    cursor: "pointer",
                    gap: "16px"
                }}
            >
                <span style={{ 
                    fontFamily: "Space Grotesk, sans-serif", 
                    fontSize: "16px", 
                    fontWeight: 700, 
                    color: "#1E293B",
                    lineHeight: 1.4
                }}>{q}</span>
                <div style={{
                    minWidth: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    background: isOpen ? "#0D9488" : "#F1F5F9",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 300ms ease",
                    transform: isOpen ? "rotate(180deg)" : "rotate(0deg)"
                }}>
                    {isOpen ? <ChevronUp size={18} color="#fff" /> : <ChevronDown size={18} color="#0D9488" />}
                </div>
            </button>
            <div style={{
                maxHeight: isOpen ? "400px" : "0",
                opacity: isOpen ? 1 : 0,
                overflow: "hidden",
                transition: "all 300ms cubic-bezier(0.4, 0, 0.2, 1)",
                padding: isOpen ? "0 24px 24px" : "0 24px"
            }}>
                <p style={{ 
                    fontFamily: "Inter, sans-serif", 
                    fontSize: "15px", 
                    color: "#64748B", 
                    lineHeight: 1.6,
                    margin: 0
                }}>{a}</p>
            </div>
        </div>
    );
};

const SEOLandingTemplate = ({ 
    title, 
    subtitle, 
    tools = [], 
    howItWorks = [], 
    stats = [], 
    faqs = [], 
    heroCta,
    finalCtaTitle,
    finalCtaSubtitle
}) => {
    const T = "#0D9488"; 
    const BG = "#F0F4F3"; 
    const TB = "#99F6E4"; 
    const DT = "#134E4A"; // Dark Teal

    return (
        <div style={{ minHeight: "100vh", backgroundColor: "#fff" }}>
            <style dangerouslySetInnerHTML={{ __html: `
                .section-wrap { max-width: 1100px; margin: 0 auto; padding: 64px 24px; }
                .section-title { font-family: 'Space Grotesk', sans-serif; font-size: clamp(28px, 4vw, 36px); font-weight: 800; color: #111827; text-align: center; margin-bottom: 12px; }
                .section-subtitle { font-family: 'Inter', sans-serif; font-size: 16px; color: #6B7280; text-align: center; margin-bottom: 48px; max-width: 600px; margin-left: auto; margin-right: auto; }
                
                .tool-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 24px; }
                .tool-card { 
                    background: #fff; border: 1px solid #E5E7EB; border-radius: 12px; padding: 24px; 
                    text-decoration: none; transition: all 300ms ease; position: relative;
                    display: flex; flex-direction: column; height: 100%;
                }
                .tool-card:hover { border-color: ${T}; transform: translateY(-4px); box-shadow: 0 12px 30px rgba(13, 148, 136, 0.1); }
                
                .tool-icon-box { 
                    width: 48px; height: 48px; border-radius: 10px; background: #F0FDFA; 
                    color: ${T}; display: flex; align-items: center; justify-content: center; 
                    margin-bottom: 16px; transition: transform 300ms ease;
                }
                .tool-card:hover .tool-icon-box { transform: scale(1.1) rotate(-5deg); }
                
                .tool-card h3 { font-family: 'Space Grotesk', sans-serif; font-size: 19px; font-weight: 700; color: #111827; margin: 0 0 10px; }
                .tool-card p { font-family: 'Inter', sans-serif; font-size: 14px; color: #6B7280; line-height: 1.6; margin: 0 0 20px; flex-grow: 1; }
                
                .tool-cta { font-family: 'Space Grotesk', sans-serif; font-size: 14px; font-weight: 700; color: ${T}; display: flex; align-items: center; gap: 6px; margin-top: auto; }
                
                .pop-badge { 
                    position: absolute; top: 20px; right: 20px; 
                    background: #FEF3C7; color: #92400E; font-size: 11px; font-weight: 700; 
                    padding: 4px 10px; border-radius: 20px; text-transform: uppercase; letter-spacing: 0.05em;
                }

                /* Modern Why Choose Styles */
                .feature-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 24px; margin-top: 40px; }
                .feature-card { 
                    background: #fff; border: 1px solid #E5E7EB; border-radius: 16px; padding: 32px 24px; 
                    text-align: left; transition: all 300ms ease; height: 100%;
                }
                .feature-card:hover { 
                    border-color: ${T}; transform: translateY(-8px); 
                    box-shadow: 0 20px 40px rgba(13, 148, 136, 0.08); 
                }
                .feature-icon { 
                    width: 54px; height: 54px; border-radius: 14px; background: #F0FDFA; 
                    display: flex; align-items: center; justify-content: center; 
                    margin-bottom: 24px; color: ${T}; transition: all 300ms ease;
                }
                .feature-card:hover .feature-icon { background: ${T}; color: #fff; transform: scale(1.1); }
                .feature-card h4 { font-family: 'Space Grotesk', sans-serif; font-size: 18px; font-weight: 700; color: #111827; margin: 0 0 12px; }
                .feature-card p { font-family: 'Inter', sans-serif; font-size: 14px; color: #6B7280; line-height: 1.6; margin: 0; }
                
                .step-circle { width: 48px; height: 48px; border-radius: 50%; background: ${T}; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 0 4px #F0F4F3, 0 0 0 6px #99F6E4; position: relative; z-index: 2; }
                .tip-box { background: #fff; border: 1px solid #99F6E4; border-radius: 12px; padding: 16px; display: flex; gap: 12px; align-items: flex-start; }
                
                @media (max-width: 768px) {
                    .tool-grid { grid-template-columns: 1fr; }
                    .step-row-3col { display: flex !important; flex-direction: column !important; text-align: center !important; gap: 20px !important; }
                    .step-row-3col .tip-box { text-align: left; }
                    .cta-split { flex-direction: column !important; text-align: center !important; gap: 40px !important; }
                }

                .hide-mobile { display: block; }
                @media (max-width: 768px) { .hide-mobile { display: none !important; } }
            `}} />

            <Navbar />

            {/* 1. HERO */}
            <section style={{ background: "#fff", padding: "80px 24px 64px" }}>
                <div style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
                    <h1 style={{ 
                        fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(32px, 5vw, 56px)", 
                        fontWeight: 800, color: "#111827", lineHeight: 1.1, margin: "0 0 24px" 
                    }}>{title}</h1>
                    <p style={{ 
                        fontFamily: "Inter, sans-serif", fontSize: "18px", color: "#6B7280", 
                        lineHeight: 1.6, margin: "0 auto 40px", maxWidth: "600px" 
                    }}>{subtitle}</p>
                    <Link href="#tools" style={{ 
                        display: "inline-block", padding: "16px 40px", background: T, color: "#fff", 
                        fontWeight: 700, borderRadius: "10px", textDecoration: "none", 
                        fontFamily: "'Space Grotesk', sans-serif",
                        boxShadow: "0 10px 20px rgba(13, 148, 136, 0.2)"
                    }}>{heroCta}</Link>
                </div>
            </section>

            {/* 2. TRUST LINE */}
            <div style={{ borderTop: "1px solid #F3F4F6", borderBottom: "1px solid #F3F4F6", background: "#fafafa", padding: "20px 0" }}>
                <div style={{ textAlign: "center", fontStyle: "italic", color: "#9CA3AF", fontSize: "14px" }}>
                    Trusted by 10,000+ businesses and professionals across India
                </div>
            </div>

            {/* AD 1 */}
            <div style={{ borderTop: "1px solid #E5E7EB", borderBottom: "1px solid #E5E7EB", background: "#fff" }}>
                <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 24px" }}>
                    <AdSense adSlot="SLOT_ID_1" />
                </div>
            </div>

            {/* 3. AVAILABLE TOOLS GRID */}
            <section id="tools" className="section-wrap">
                <h2 className="section-title">Available Tools</h2>
                <p className="section-subtitle">The most comprehensive suite of free digital tools for your category.</p>
                
                <div className="tool-grid">
                    {tools.map((tool, i) => (
                        <Link key={i} href={tool.href} className="tool-card">
                            {tool.badge && <span className="pop-badge">{tool.badge}</span>}
                            <div className="tool-icon-box">{tool.icon}</div>
                            <h3>{tool.title}</h3>
                            <p>{tool.description}</p>
                            <div className="tool-cta">Create Now <ArrowRight size={14} /></div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* 4. WHY CHOOSE - Modern Redesign */}
            <section style={{ backgroundColor: "#FAFAFA", padding: "80px 24px", borderTop: "1px solid #F3F4F6" }}>
                <div className="section-wrap">
                    <h2 className="section-title">Why choose DocMinty?</h2>
                    <p className="section-subtitle">We build tools that save you time and help you stay professional.</p>
                    <div className="feature-grid">
                        {[
                           { i: <Zap size={24} />, t: "100% Free Forever", d: "No hidden charges, no credits. All our SEO category tools are free to use anytime." },
                           { i: <Star size={24} />, t: "No Signup Required", d: "Start creating immediately. We don't force you to create an account to download your files." },
                           { i: <Clock size={24} />, t: "Mobile Ready", d: "Generate, preview, and download documents directly on your phone while on the go." },
                           { i: <Shield size={24} />, t: "Browser Secure", d: "Your data never leaves your browser. We prioritize your privacy and business security." }
                        ].map((feat, i) => (
                            <div key={i} className="feature-card">
                                <div className="feature-icon">{feat.i}</div>
                                <h4>{feat.t}</h4>
                                <p>{feat.d}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 5. HOW IT WORKS */}
            <section style={{ 
                backgroundColor: BG, 
                borderTop: "1px solid #D1D5DB",
                backgroundImage: "radial-gradient(circle, #C7D5D3 1px, transparent 1px)",
                backgroundSize: "24px 24px",
            }}>
                <div className="section-wrap">
                    <h2 className="section-title">How it works</h2>
                    <p className="section-subtitle">Everything you need to know about DocMinty.</p>
                    
                    <div style={{ position: "relative" }}>
                        <div style={{
                            position: "absolute", left: "50%", top: "24px", bottom: "24px",
                            width: "1px", background: "#D1D5DB", transform: "translateX(-50%)",
                            zIndex: 1
                        }} className="hide-mobile" />

                        {howItWorks.map((step, i) => (
                            <div key={i} className="step-row-3col" style={{
                                display: "grid", gridTemplateColumns: "1fr 80px 1fr",
                                gap: "24px", alignItems: "center",
                                marginBottom: i < howItWorks.length - 1 ? "48px" : "0",
                                position: "relative", zIndex: 2
                            }}>
                                <div style={{ textAlign: step.tipSide === "right" ? "right" : "left" }}>
                                    {step.tipSide === "right" ? (
                                        <>
                                            <h3 style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: "18px", fontWeight: 700, color: "#111827", margin: "0 0 10px", textAlign: "right" }}>{step.title}</h3>
                                            <p style={{ fontSize: "14px", color: "#6B7280", lineHeight: 1.7, margin: 0, fontFamily: "Inter, sans-serif", textAlign: "right" }}>{step.desc}</p>
                                        </>
                                    ) : (
                                        <div className="tip-box">
                                            <span style={{ fontSize: "16px", flexShrink: 0 }}>{step.tip.icon}</span>
                                            <p style={{ fontSize: "13px", color: "#374151", lineHeight: 1.6, margin: 0, fontFamily: "Inter, sans-serif" }}>
                                                <strong style={{ color: T }}>{step.tip.label}</strong> {step.tip.text}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <div className="step-circle">
                                        <span style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: "18px", color: "#fff" }}>{i + 1}</span>
                                    </div>
                                </div>

                                <div>
                                    {step.tipSide === "right" ? (
                                        <div className="tip-box">
                                            <span style={{ fontSize: "16px", flexShrink: 0 }}>{step.tip.icon}</span>
                                            <p style={{ fontSize: "13px", color: "#374151", lineHeight: 1.6, margin: 0, fontFamily: "Inter, sans-serif" }}>
                                                <strong style={{ color: T }}>{step.tip.label}</strong> {step.tip.text}
                                            </p>
                                        </div>
                                    ) : (
                                        <>
                                            <h3 style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: "18px", fontWeight: 700, color: "#111827", margin: "0 0 10px" }}>{step.title}</h3>
                                            <p style={{ fontSize: "14px", color: "#6B7280", lineHeight: 1.7, margin: 0, fontFamily: "Inter, sans-serif" }}>{step.desc}</p>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* AD 2 */}
            <div style={{ borderTop: "1px solid #D1D5DB", borderBottom: "1px solid #D1D5DB", background: "#fff" }}>
                <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 24px" }}>
                    <AdSense adSlot="SLOT_ID_2" />
                </div>
            </div>

            {/* 6. STATS */}
            <section style={{ background: DT }}>
                <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "64px 24px" }}>
                    <div style={{
                        display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                        gap: "32px", textAlign: "center",
                    }}>
                        {stats.map((s, i) => (
                            <div key={i}>
                                <p style={{
                                    fontFamily: "Space Grotesk, sans-serif",
                                    fontSize: "clamp(32px, 4vw, 44px)",
                                    fontWeight: 700, color: TB,
                                    margin: "0 0 8px", lineHeight: 1,
                                }}>
                                    <AnimatedNumber end={s.num} suffix={s.suffix} decimals={s.decimals} />
                                </p>
                                <p style={{ fontSize: "14px", color: "#99F6E4", margin: 0, fontFamily: "Inter, sans-serif", opacity: 0.9 }}>{s.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 7. FAQ */}
            <section id="faq" style={{ backgroundColor: "#F8FAFC", borderTop: "1px solid #E2E8F0" }}>
                <div className="section-wrap" style={{ maxWidth: "900px" }}>
                    <h2 className="section-title">Frequently Asked Questions</h2>
                    <p className="section-subtitle">Common questions about using DocMinty for your digital paperwork.</p>
                    
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "0 24px" }}>
                        {faqs.map((faq, i) => (
                            <FAQItem key={i} q={faq.q} a={faq.a} />
                        ))}
                    </div>

                    <div style={{ marginTop: "48px", textAlign: "center", padding: "24px", background: "#fff", borderRadius: "16px", border: "1px solid #E2E8F0" }}>
                        <p style={{ fontFamily: "Inter, sans-serif", color: "#64748B", margin: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                            <Mail size={18} color={T} />
                            Have more questions? <Link href="mailto:support@docminty.com" style={{ color: T, fontWeight: 700, textDecoration: "none" }}>Contact our support team</Link>
                        </p>
                    </div>
                </div>
            </section>

            {/* 8. FINAL CTA - Perfect UI Redesign */}
            <section style={{ backgroundColor: DT, padding: "40px 24px" }}>
                <div className="section-wrap cta-split" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "24px", padding: "0 24px" }}>
                    <div style={{ maxWidth: "650px" }}>
                        <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 800, color: "#fff", marginBottom: "12px", lineHeight: 1.2 }}>{finalCtaTitle}</h2>
                        <p style={{ fontFamily: "Inter, sans-serif", fontSize: "16px", color: "rgba(255,255,255,0.8)", margin: 0 }}>{finalCtaSubtitle}</p>
                    </div>
                    <div style={{ textAlign: "center" }}>
                        <Link href="#tools" style={{ 
                                display: "inline-block", padding: "18px 36px", background: TB, color: DT, 
                                fontWeight: 800, borderRadius: "10px", textDecoration: "none", 
                                fontFamily: "'Space Grotesk', sans-serif", fontSize: "16px",
                                boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                                marginBottom: "12px"
                            }}>Get Started for Free <ArrowRight size={18} style={{ verticalAlign: "middle", marginLeft: "4px" }} /></Link>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", fontSize: "12px", color: "rgba(255,255,255,0.6)", fontFamily: "Inter, sans-serif" }}>
                            <CheckCircle size={14} /> No credit card · GST-compliant
                        </div>
                    </div>
                </div>
            </section>

            <AdSense adSlot="SLOT_ID_3" sidebarFixed />

            <Footer />
        </div>
    );
};

export default SEOLandingTemplate;
