"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PricingCard from "@/components/PricingCard";
import { Check, X, Star, Zap, Shield, Building2 } from "lucide-react";
import { initiatePayment } from "@/api/payment";
import { getAccessToken } from "@/api/auth";
import toast from "react-hot-toast";

const T = "#0D9488";
const BG = "#F0F4F3";

const COMPARE = [
  { feature: "Document Types", free: "14", pro: "14", ent: "14" },
  { feature: "PDF Downloads", free: "Unlimited", pro: "Unlimited", ent: "Unlimited" },
  { feature: "Logo Upload", free: false, pro: true, ent: true },
  { feature: "GST Auto-Calculation", free: true, pro: true, ent: true },
  { feature: "Batch CSV Processing", free: false, pro: true, ent: true },
  { feature: "Cloud Storage", free: false, pro: "20 Docs", ent: "50 Docs" },
  { feature: "Premium Templates", free: false, pro: true, ent: true },
  { feature: "No Watermark", free: true, pro: true, ent: true },
  { feature: "Priority Support", free: false, pro: true, ent: true },
  { feature: "Custom Branding", free: false, pro: true, ent: true },
  { feature: "Team Access", free: false, pro: false, ent: true },
];

const FAQS = [
  { q: "What is DocMinty and how does it work?", a: "DocMinty is a digital document platform that allows you to create, manage, and sign documents online. You can generate documents, download PDFs, and manage everything from a single dashboard." },
  { q: "Are my documents secure on DocMinty?", a: "Yes, we prioritize security. All your documents are securely stored and protected using industry-standard encryption to ensure your data remains safe and private." },
  { q: "Can I use DocMinty for free?", a: "Yes, DocMinty offers a free plan with essential features. You can upgrade anytime to access advanced features like cloud storage, branding, and batch processing." },
  { q: "What payment methods do you accept?", a: "We support secure online payments via UPI, credit cards, and other standard payment methods for a smooth and safe checkout experience." },
  { q: "Will my subscription renew automatically?", a: "Yes, subscriptions may renew automatically depending on the plan. You can manage or cancel your subscription anytime from your account settings." },
  { q: "Can I upgrade or downgrade my plan anytime?", a: "Absolutely. You can upgrade or change your plan at any time based on your needs, and the changes will reflect immediately." },
  { q: "Do you offer support if I face any issues?", a: "Yes, we provide support for all users. Pro and Enterprise users get priority and dedicated support for faster assistance." },
  { q: "Can multiple users access the same account?", a: "Yes, our Enterprise plan supports team access, allowing multiple users to collaborate and manage documents efficiently." },
];

const PRICING_PLANS = [
  {
    plan: "Free", price: "₹0", period: "forever",
    description: "For individuals & freelancers getting started",
    subNote: "No expiration date, use anytime.",
    includedFeatures: ["All document types access", "Unlimited PDF downloads", "GST auto-calculation", "2 Free templates"],
    notIncludedFeatures: ["Logo upload", "Batch CSV processing", "Cloud document storage"],
    ctaLabel: "Get Started Free", ctaHref: "/invoice",
    highlighted: false,
  },
  {
    plan: "Business Pro", price: "₹199", originalPrice: "₹399", period: "/month",
    description: "For individuals & growing businesses",
    badge: "Most Popular",
    includedFeatures: ["Everything in Free", "Logo upload & custom branding", "Batch document generation (CSV)", "Store up to 20 documents in cloud", "Premium templates", "Priority support"],
    notIncludedFeatures: [],
    ctaLabel: "Start Pro – ₹199/month", ctaHref: "/signup",
    extraLink: "/batch", extraLinkLabel: "See Batch Processing →",
    highlighted: true,
  },
  {
    plan: "Enterprise", price: "₹399", originalPrice: "₹799", period: "/month",
    description: "For teams & high-volume document workflows",
    badge: "Best for Teams",
    includedFeatures: ["Everything in Pro", "Store up to 50 documents in cloud", "Team access / multi-user login", "Priority processing & faster performance", "Dedicated support"],
    notIncludedFeatures: [],
    ctaLabel: "Upgrade to Enterprise", ctaHref: "/signup",
    highlighted: false,
  },
];

function Cell({ value, isFeatured }) {
  if (value === true) return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div style={{ padding: "4px", borderRadius: "6px", background: isFeatured ? "#F0FDFA" : "#F8FAFC", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Check size={14} color={isFeatured ? T : "#475569"} />
      </div>
    </div>
  );
  if (value === false) return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <X size={14} color="#D1D5DB" />
    </div>
  );
  return (
    <span style={{ 
      fontSize: "13.5px", 
      color: value === "Unlimited" ? T : "#334155", 
      fontFamily: "Inter, sans-serif",
      fontWeight: (isFeatured || value === "Unlimited") ? 700 : 500 
    }}>
      {value}
    </span>
  );
}

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ 
      transition: "all 0.3s ease", 
      background: "#fff",
      border: "1px solid #E2E8F0",
      borderRadius: "16px",
      padding: "0 20px",
      boxShadow: open ? "0 10px 15px -3px rgba(0,0,0,0.05)" : "none",
      height: "fit-content"
    }}>
      <button 
        onClick={() => setOpen(!open)} 
        style={{ 
          width: "100%", 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center", 
          padding: "20px 0", 
          background: "none", 
          border: "none", 
          cursor: "pointer", 
          textAlign: "left", 
          gap: "16px" 
        }}
      >
        <span style={{ 
          fontSize: "15px", 
          fontWeight: 600, 
          color: open ? T : "#0F172A", 
          fontFamily: "Space Grotesk, sans-serif", 
          transition: "color 0.2s",
          lineHeight: 1.4
        }}>{q}</span>
        <div style={{ 
          background: open ? T : "#F1F5F9", 
          width: "24px", 
          height: "24px", 
          borderRadius: "50%", 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center",
          flexShrink: 0,
          transform: open ? "rotate(180deg)" : "rotate(0deg)",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
        }}>
          <span style={{ 
            fontSize: "14px", 
            color: open ? "#fff" : "#94A3B8", 
            lineHeight: 1 
          }}>{open ? "−" : "+"}</span>
        </div>
      </button>
      <div style={{ 
        maxHeight: open ? "300px" : "0", 
        overflow: "hidden", 
        transition: "max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease",
        opacity: open ? 1 : 0
      }}>
        <p style={{ 
          fontSize: "14px", 
          color: "#64748B", 
          lineHeight: 1.6, 
          margin: "0 0 20px", 
          fontFamily: "Inter, sans-serif" 
        }}>{a}</p>
      </div>
    </div>
  );
}

export default function PricingPage() {
  const router = useRouter();
  const [billing, setBilling] = useState("monthly");
  const [loading, setLoading] = useState("");

  const handleUpgrade = async (planName, billingCycle) => {
    if (planName === "Free") return; // Free plan uses the default link

    const token = getAccessToken();
    if (!token) {
      toast.error("Please sign in to upgrade");
      router.push("/login?redirect=/pricing");
      return;
    }

    const type = planName === "Enterprise"
      ? (billingCycle === "monthly" ? "MONTHLY_ENTERPRISE" : "ANNUAL_ENTERPRISE")
      : (billingCycle === "monthly" ? "MONTHLY_PRO" : "ANNUAL_PRO");

    setLoading(type);
    await initiatePayment(
      type,
      () => {
        toast.success(`Payment successful! You are now on ${planName}.`);
        setLoading("");
        router.push("/dashboard");
      },
      (err) => {
        toast.error(err || "Payment failed. Please try again.");
        setLoading("");
      }
    );
  };

  const trustItems = [
    { icon: <Shield size={14} />, text: "Secure payments" },
    { icon: <Zap size={14} />, text: "Instant activation" },
    { icon: <Check size={14} />, text: "No hidden charges" }
  ];

  return (
    <>
      <Navbar />
      <style dangerouslySetInnerHTML={{ __html: `
        .avatar-trust-group { display: flex; align-items: center; gap: 10px; }
        @media (max-width: 768px) {
          .avatar-trust-group { flex-direction: column !important; text-align: center !important; gap: 12px !important; }
        }
      `}} />
      <main style={{ background: "#fff" }}>

        {/* Hero */}
        <section style={{ background: "#F9FAFB", borderBottom: "1px solid #E5E7EB", padding: "80px 24px 60px" }}>
          <div style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
            <h1 style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: "clamp(32px,5vw,52px)", fontWeight: 800, color: "#111827", margin: "0 0 16px", lineHeight: 1.1 }}>
              Scale your business with <span style={{ color: T }}>DocMinty.</span>
            </h1>
            <p style={{ fontSize: "18px", color: "#64748B", margin: "0 0 32px", fontFamily: "Inter, sans-serif", lineHeight: 1.6 }}>
              Choose the plan that's right for your business. Switch or cancel anytime.
            </p>

            {/* Billing toggle */}
            <div style={{ display: "inline-flex", background: "#F1F5F9", borderRadius: "12px", padding: "4px", gap: "4px" }}>
              {[["monthly", "Monthly"], ["annual", "Annual"]].map(([val, label]) => (
                <button key={val} onClick={() => setBilling(val)} style={{
                  padding: "10px 24px", borderRadius: "10px", border: "none",
                  fontSize: "14px", fontWeight: 700, cursor: "pointer",
                  fontFamily: "Space Grotesk, sans-serif",
                  background: billing === val ? "#fff" : "transparent",
                  color: billing === val ? "#0F172A" : "#64748B",
                  boxShadow: billing === val ? "0 2px 10px rgba(0,0,0,0.06)" : "none",
                  transition: "all 0.2s",
                }}>
                  {label}
                  {val === "annual" && (
                    <span style={{ marginLeft: "8px", background: T, color: "#fff", fontSize: "10px", fontWeight: 800, padding: "2px 8px", borderRadius: "99px" }}>25% OFF</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Plans */}
        <section style={{ background: "#fff", padding: "64px 24px 80px" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <div style={{ 
              display: "grid", 
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", 
              gap: "32px", 
              alignItems: "stretch",
              marginBottom: "48px"
            }} className="pricing-grid">
              {PRICING_PLANS.map((plan, i) => (
                <PricingCard
                  key={i}
                  {...plan}
                  billing={billing}
                  onClick={plan.plan !== "Free" ? () => handleUpgrade(plan.plan, billing) : undefined}
                />
              ))}
            </div>

            {/* Simple Trust Bar */}
            <div style={{ 
              display: "flex", 
              justifyContent: "center", 
              alignItems: "center", 
              gap: "24px", 
              flexWrap: "wrap",
              padding: "20px",
              background: "#F8FAFC",
              borderRadius: "16px",
              border: "1px solid #F1F5F9"
            }}>
              {trustItems.map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px", color: "#64748B", fontSize: "14px", fontWeight: 500, fontFamily: "Inter, sans-serif" }}>
                  <span style={{ color: T }}>{item.icon}</span>
                  {item.text}
                </div>
              ))}
            </div>

            {/* Full Trust bar */}
            <div style={{ marginTop: "48px", display: "flex", flexDirection: "column", alignItems: "center", gap: "14px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div style={{ display: "flex", gap: "2px" }}>
                  {[1, 2, 3, 4, 5].map(i => <Star key={i} size={16} fill="#F59E0B" color="#F59E0B" />)}
                </div>
                <span style={{ fontSize: "14px", fontWeight: 700, color: "#111827", fontFamily: "Space Grotesk, sans-serif" }}>100%</span>
                <span style={{ fontSize: "14px", color: "#6B7280", fontFamily: "Inter, sans-serif" }}>positive reviews</span>
              </div>

              {/* Trustpilot + Google */}
              <div style={{ display: "flex", gap: "12px" }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "5px 14px", border: "1px solid #E5E7EB", borderRadius: "8px" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2L14.09 8.26H21L15.45 12.1L17.54 18.36L12 14.52L6.46 18.36L8.55 12.1L3 8.26H9.91L12 2Z" fill="#00B67A" />
                  </svg>
                  <span style={{ fontSize: "13px", fontWeight: 600, color: "#374151", fontFamily: "Inter, sans-serif" }}>Trustpilot</span>
                </div>
                <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "5px 14px", border: "1px solid #E5E7EB", borderRadius: "8px" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  <span style={{ fontSize: "13px", fontWeight: 600, color: "#374151", fontFamily: "Inter, sans-serif" }}>Google</span>
                </div>
              </div>

              {/* Avatars */}
              <div className="avatar-trust-group">
                <div style={{ display: "flex" }}>
                  {[
                    { type: "img", src: "https://i.pravatar.cc/32?img=11", label: "Rahul" },
                    { type: "img", src: "https://i.pravatar.cc/32?img=47", label: "Priya" },
                    { type: "text", init: "AM", bg: "#0D9488", color: "#fff" },
                    { type: "img", src: "https://i.pravatar.cc/32?img=32", label: "Sunita" },
                    { type: "text", init: "VN", bg: "#6366F1", color: "#fff" },
                    { type: "img", src: "https://i.pravatar.cc/32?img=60", label: "Deepa" },
                    { type: "text", init: "RG", bg: "#D97706", color: "#fff" },
                    { type: "img", src: "https://i.pravatar.cc/32?img=25", label: "Arjun" },
                  ].map((av, i) => (
                    <div key={i} style={{
                      width: "32px", height: "32px", borderRadius: "50%",
                      border: "2px solid #fff", overflow: "hidden",
                      marginLeft: i === 0 ? "0" : "-8px",
                      zIndex: 8 - i, position: "relative", flexShrink: 0,
                      background: av.type === "text" ? av.bg : "#E5E7EB",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "11px", fontWeight: 700,
                      color: av.type === "text" ? av.color : "transparent",
                      fontFamily: "Inter, sans-serif",
                    }}>
                      {av.type === "img" ? (
                        <img src={av.src} alt={av.label} width={32} height={32}
                          style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }}
                          onError={(e) => { e.target.style.display = "none"; }}
                        />
                      ) : av.init}
                    </div>
                  ))}
                </div>
                <span style={{ fontSize: "14px", color: "#6B7280", fontFamily: "Inter, sans-serif" }}>
                  and <strong style={{ color: "#111827" }}>10,000+</strong> more happy users
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Compare table */}
        <section style={{ background: "#fff", borderBottom: "1px solid #D1D5DB" }}>
          <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "64px 24px 80px" }}>
            <h2 style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: "clamp(24px,3vw,32px)", fontWeight: 800, color: "#0F172A", margin: "0 0 8px", textAlign: "center" }}>Compare plans</h2>
            <p style={{ fontSize: "16px", color: "#64748B", textAlign: "center", margin: "0 auto 40px", fontFamily: "Inter, sans-serif" }}>Everything you need to know about each plan.</p>
            <div style={{ border: "1px solid #E2E8F0", borderRadius: "16px", overflow: "hidden", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr 1fr", background: "#F8FAFC", borderBottom: "1px solid #E2E8F0", padding: "16px 24px" }}>
                <span style={{ fontSize: "12px", fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.1em", fontFamily: "Space Grotesk, sans-serif" }}>Feature</span>
                {["Free", "Business Pro", "Enterprise"].map(p => (
                  <span key={p} style={{ fontSize: "14px", fontWeight: 800, color: p === "Business Pro" ? T : "#0F172A", textAlign: "center", fontFamily: "Space Grotesk, sans-serif" }}>{p}</span>
                ))}
              </div>
              {COMPARE.map((row, i) => (
                <div key={i} style={{ 
                  display: "grid", 
                  gridTemplateColumns: "1.5fr 1fr 1fr 1fr", 
                  padding: "16px 24px", 
                  borderBottom: i < COMPARE.length - 1 ? "1px solid #F1F5F9" : "none", 
                  background: i % 2 === 0 ? "#fff" : "#FBFDFF", 
                  alignItems: "center",
                  transition: "background 150ms"
                }}>
                  <span style={{ fontSize: "14px", color: "#475569", fontFamily: "Inter, sans-serif", fontWeight: 500 }}>{row.feature}</span>
                  {[row.free, row.pro, row.ent].map((val, j) => (
                    <div key={j} style={{ textAlign: "center" }}>
                      <Cell value={val} isFeatured={j > 0} />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section style={{ backgroundColor: "#F8FAFC", borderTop: "1px solid #E2E8F0" }}>
          <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "80px 24px" }}>
            <h2 style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: "clamp(24px,3vw,32px)", fontWeight: 800, color: "#0F172A", margin: "0 0 12px", textAlign: "center" }}>Frequently asked questions</h2>
            <p style={{ fontSize: "16px", color: "#64748B", textAlign: "center", margin: "0 auto 48px", fontFamily: "Inter, sans-serif" }}>Everything you need to know about DocMinty.</p>
            
            <div style={{ 
              display: "grid", 
              gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", 
              gap: "20px",
              alignItems: "start"
            }}>
              {FAQS.map((faq, i) => <FAQItem key={i} {...faq} />)}
            </div>

            <p style={{ 
              marginTop: "48px", 
              textAlign: "center", 
              fontSize: "15px", 
              color: "#64748B", 
              fontFamily: "Inter, sans-serif" 
            }}>
              Have more questions? <a href="mailto:support@docminty.com" style={{ color: T, fontWeight: 600, textDecoration: "none" }}>Contact our support team anytime.</a>
            </p>
          </div>
        </section>

        {/* CTA */}
        <section style={{ background: "#134E4A", padding: "64px 24px" }}>
          <div style={{ maxWidth: "600px", margin: "0 auto", textAlign: "center" }}>
            <h2 style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: "clamp(24px,3vw,36px)", fontWeight: 700, color: "#fff", margin: "0 0 12px", lineHeight: 1.2 }}>Start for free today</h2>
            <p style={{ fontSize: "15px", color: "#99F6E4", margin: "0 0 28px", fontFamily: "Inter, sans-serif" }}>No credit card required. Upgrade anytime.</p>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
              <a href="/invoice" style={{ padding: "12px 28px", background: T, color: "#fff", borderRadius: "8px", fontSize: "14px", fontWeight: 700, textDecoration: "none", fontFamily: "Space Grotesk, sans-serif" }}>Create Free Invoice</a>
              <button onClick={() => handleUpgrade(billing)} disabled={!!loading} style={{ padding: "12px 28px", background: "rgba(255,255,255,0.1)", color: "#fff", border: "1px solid rgba(255,255,255,0.3)", borderRadius: "8px", fontSize: "14px", fontWeight: 700, cursor: "pointer", fontFamily: "Space Grotesk, sans-serif" }}>
                {loading ? "Processing..." : "Upgrade to Pro"}
              </button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}