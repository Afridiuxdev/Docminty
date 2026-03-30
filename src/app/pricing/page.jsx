"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Check, Star, Zap, Shield, Building2 } from "lucide-react";
import { initiatePayment } from "@/api/payment";
import { getAccessToken } from "@/api/auth";
import toast from "react-hot-toast";

const T = "#0D9488";

const COMPARE = [
  { feature: "Document Types",      free: "14",        pro: "14",        ent: "Custom" },
  { feature: "PDF Downloads",       free: "Unlimited", pro: "Unlimited", ent: "Unlimited" },
  { feature: "Logo Upload",         free: true,        pro: true,        ent: true },
  { feature: "GST Auto-Calculation",free: true,        pro: true,        ent: true },
  { feature: "Batch CSV Processing",free: false,       pro: true,        ent: true },
  { feature: "Cloud Storage",       free: false,       pro: true,        ent: true },
  { feature: "Premium Templates",   free: false,       pro: true,        ent: true },
  { feature: "No Watermark",        free: true,        pro: true,        ent: true },
  { feature: "Priority Support",    free: false,       pro: true,        ent: true },
  { feature: "API Access",          free: false,       pro: "Soon",      ent: true },
  { feature: "Custom Branding",     free: false,       pro: true,        ent: true },
  { feature: "Dedicated Manager",   free: false,       pro: false,       ent: true },
  { feature: "SLA Guarantee",       free: false,       pro: false,       ent: true },
];

const FAQS = [
  { q: "Can I cancel anytime?", a: "Yes. Cancel from account settings. Access continues until billing period ends." },
  { q: "What payment methods are accepted?", a: "All major credit/debit cards, UPI, Net Banking via Razorpay." },
  { q: "Is my data secure?", a: "Yes. Industry-standard encryption. Free plan documents are not stored on our servers." },
  { q: "Can I switch plans?", a: "Yes. Upgrade or downgrade anytime. Changes take effect from next billing cycle." },
  { q: "Do you offer refunds?", a: "7-day money-back guarantee on all paid plans. Contact support within 7 days." },
];

function Cell({ value }) {
  if (value === true)  return <span style={{ color: T, fontSize: "16px" }}>✓</span>;
  if (value === false) return <span style={{ color: "#D1D5DB", fontSize: "14px" }}>✗</span>;
  return <span style={{ fontSize: "13px", color: "#374151", fontFamily: "Inter, sans-serif" }}>{value}</span>;
}

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: "1px solid #E5E7EB" }}>
      <button onClick={() => setOpen(!open)} style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 0", background: "none", border: "none", cursor: "pointer", textAlign: "left", gap: "16px" }}>
        <span style={{ fontSize: "15px", fontWeight: 600, color: open ? T : "#111827", fontFamily: "Space Grotesk, sans-serif", transition: "color 150ms" }}>{q}</span>
        <span style={{ fontSize: "18px", color: open ? T : "#9CA3AF", transition: "all 200ms", transform: open ? "rotate(45deg)" : "rotate(0deg)", display: "inline-block", lineHeight: 1 }}>+</span>
      </button>
      {open && <p style={{ fontSize: "14px", color: "#6B7280", lineHeight: 1.7, margin: "0 0 16px", fontFamily: "Inter, sans-serif" }}>{a}</p>}
    </div>
  );
}

export default function PricingPage() {
  const router   = useRouter();
  const [billing, setBilling]   = useState("monthly"); // monthly | annual
  const [loading, setLoading]   = useState("");        // "monthly" | "annual" | ""

  const handleUpgrade = async (planType) => {
    const token = getAccessToken();
    if (!token) {
      toast.error("Please sign in to upgrade");
      router.push("/login");
      return;
    }
    setLoading(planType);
    await initiatePayment(
      planType === "monthly" ? "MONTHLY_PRO" : "ANNUAL_PRO",
      () => {
        toast.success("Payment successful! You are now on Business Pro.");
        setLoading("");
        router.push("/dashboard");
      },
      (err) => {
        toast.error(err || "Payment failed. Please try again.");
        setLoading("");
      }
    );
  };

  const monthlyPrice = 199;
  const annualPrice  = Math.round(199 * 12 * 0.6); // 40% off annual
  const annualMonthly = Math.round(annualPrice / 12);

  return (
    <>
      <Navbar />
      <main style={{ background: "#F0F4F3" }}>

        {/* Hero */}
        <section style={{ background: "#fff", borderBottom: "1px solid #E5E7EB", padding: "64px 24px 0" }}>
          <div style={{ maxWidth: "1100px", margin: "0 auto", textAlign: "center" }}>
            <p style={{ fontSize: "12px", fontWeight: 700, color: T, textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 12px", fontFamily: "Space Grotesk, sans-serif" }}>Pricing</p>
            <h1 style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: "clamp(28px,4vw,44px)", fontWeight: 700, color: "#111827", margin: "0 0 16px", lineHeight: 1.2 }}>Simple, transparent pricing</h1>
            <p style={{ fontSize: "16px", color: "#6B7280", margin: "0 auto 32px", maxWidth: "500px", fontFamily: "Inter, sans-serif", lineHeight: 1.6 }}>Free forever for individual use. Upgrade when your business needs more.</p>

            {/* Billing toggle */}
            <div style={{ display: "inline-flex", background: "#F3F4F6", borderRadius: "10px", padding: "4px", marginBottom: "40px", gap: "4px" }}>
              {[["monthly", "Monthly"], ["annual", "Annual"]].map(([val, label]) => (
                <button key={val} onClick={() => setBilling(val)} style={{ padding: "8px 20px", borderRadius: "8px", border: "none", fontSize: "13px", fontWeight: 700, cursor: "pointer", fontFamily: "Space Grotesk, sans-serif", background: billing === val ? "#fff" : "transparent", color: billing === val ? "#111827" : "#6B7280", boxShadow: billing === val ? "0 1px 4px rgba(0,0,0,0.1)" : "none", transition: "all 150ms", position: "relative" }}>
                  {label}
                  {val === "annual" && <span style={{ marginLeft: "6px", background: T, color: "#fff", fontSize: "10px", fontWeight: 700, padding: "1px 6px", borderRadius: "8px" }}>40% OFF</span>}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Plans */}
        <section style={{ background: "#fff", borderBottom: "1px solid #E5E7EB" }}>
          <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 24px 64px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px", alignItems: "start" }} className="pricing-grid">

              {/* Free Plan */}
              <div style={{ border: "1px solid #E5E7EB", borderRadius: "16px", padding: "28px", background: "#fff" }}>
                <div style={{ marginBottom: "20px" }}>
                  <div style={{ width: "36px", height: "36px", background: "#F3F4F6", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "12px" }}>
                    <Zap size={18} color="#6B7280" />
                  </div>
                  <h3 style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: "18px", fontWeight: 700, color: "#111827", margin: "0 0 4px" }}>Free</h3>
                  <p style={{ fontSize: "13px", color: "#6B7280", margin: "0 0 16px", fontFamily: "Inter, sans-serif" }}>For freelancers and occasional use.</p>
                  <div style={{ display: "flex", alignItems: "baseline", gap: "4px" }}>
                    <span style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: "36px", fontWeight: 800, color: "#111827" }}>Rs.0</span>
                    <span style={{ fontSize: "13px", color: "#9CA3AF", fontFamily: "Inter, sans-serif" }}>/forever</span>
                  </div>
                </div>
                <a href="/invoice" style={{ display: "block", width: "100%", padding: "10px", textAlign: "center", border: "1px solid #E5E7EB", borderRadius: "8px", fontSize: "14px", fontWeight: 600, color: "#374151", textDecoration: "none", fontFamily: "Space Grotesk, sans-serif", marginBottom: "20px" }}>Get Started Free</a>
                <div style={{ borderTop: "1px solid #F3F4F6", paddingTop: "16px" }}>
                  {["All 14 document types", "Unlimited PDF downloads", "Logo upload", "GST auto-calculation", "Basic templates"].map(f => (
                    <div key={f} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                      <Check size={14} color={T} />
                      <span style={{ fontSize: "13px", color: "#374151", fontFamily: "Inter, sans-serif" }}>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Business Pro Plan */}
              <div style={{ border: "2px solid " + T, borderRadius: "16px", padding: "28px", background: "#fff", position: "relative", boxShadow: "0 8px 32px rgba(13,148,136,0.12)" }}>
                <div style={{ position: "absolute", top: "-12px", left: "50%", transform: "translateX(-50%)", background: T, color: "#fff", fontSize: "11px", fontWeight: 700, padding: "3px 14px", borderRadius: "20px", fontFamily: "Space Grotesk, sans-serif", whiteSpace: "nowrap" }}>MOST POPULAR</div>
                <div style={{ marginBottom: "20px" }}>
                  <div style={{ width: "36px", height: "36px", background: "#F0FDFA", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "12px" }}>
                    <Shield size={18} color={T} />
                  </div>
                  <h3 style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: "18px", fontWeight: 700, color: "#111827", margin: "0 0 4px" }}>Business Pro</h3>
                  <p style={{ fontSize: "13px", color: "#6B7280", margin: "0 0 16px", fontFamily: "Inter, sans-serif" }}>For growing businesses with recurring needs.</p>
                  <div style={{ display: "flex", alignItems: "baseline", gap: "6px" }}>
                    <span style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: "36px", fontWeight: 800, color: T }}>
                      {billing === "monthly" ? "Rs." + monthlyPrice : "Rs." + annualMonthly}
                    </span>
                    <span style={{ fontSize: "13px", color: "#9CA3AF", fontFamily: "Inter, sans-serif" }}>/month</span>
                    {billing === "annual" && <span style={{ fontSize: "12px", color: "#9CA3AF", textDecoration: "line-through", fontFamily: "Inter, sans-serif" }}>Rs.{monthlyPrice}</span>}
                  </div>
                  {billing === "annual" && <p style={{ fontSize: "12px", color: T, margin: "4px 0 0", fontFamily: "Inter, sans-serif", fontWeight: 600 }}>Billed Rs.{annualPrice}/year — Save Rs.{monthlyPrice * 12 - annualPrice}</p>}
                </div>

                <button
                  onClick={() => handleUpgrade(billing)}
                  disabled={loading === billing}
                  style={{ display: "block", width: "100%", padding: "12px", textAlign: "center", border: "none", borderRadius: "8px", fontSize: "14px", fontWeight: 700, color: "#fff", cursor: loading === billing ? "not-allowed" : "pointer", fontFamily: "Space Grotesk, sans-serif", marginBottom: "20px", background: loading === billing ? "#9CA3AF" : T, transition: "all 150ms" }}>
                  {loading === billing ? "Processing..." : billing === "monthly" ? "Upgrade Monthly - Rs." + monthlyPrice : "Upgrade Annual - Rs." + annualPrice + "/yr"}
                </button>

                <p style={{ fontSize: "11px", color: "#9CA3AF", textAlign: "center", margin: "0 0 16px", fontFamily: "Inter, sans-serif" }}>7-day money-back guarantee</p>

                <div style={{ borderTop: "1px solid #F3F4F6", paddingTop: "16px" }}>
                  {["Everything in Free", "Batch CSV processing", "Cloud document storage", "Premium templates", "Priority support", "Custom branding & logo", "No DocMinty footer"].map(f => (
                    <div key={f} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                      <Check size={14} color={T} />
                      <span style={{ fontSize: "13px", color: "#374151", fontFamily: "Inter, sans-serif" }}>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Enterprise Plan */}
              <div style={{ border: "1px solid #E5E7EB", borderRadius: "16px", padding: "28px", background: "#1E293B" }}>
                <div style={{ marginBottom: "20px" }}>
                  <div style={{ width: "36px", height: "36px", background: "rgba(255,255,255,0.1)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "12px" }}>
                    <Building2 size={18} color="#fff" />
                  </div>
                  <h3 style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: "18px", fontWeight: 700, color: "#fff", margin: "0 0 4px" }}>Enterprise</h3>
                  <p style={{ fontSize: "13px", color: "#94A3B8", margin: "0 0 16px", fontFamily: "Inter, sans-serif" }}>For large teams and custom integrations.</p>
                  <div style={{ display: "flex", alignItems: "baseline", gap: "4px" }}>
                    <span style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: "36px", fontWeight: 800, color: "#fff" }}>Custom</span>
                  </div>
                </div>
                <a href="mailto:hello@docminty.com" style={{ display: "block", width: "100%", padding: "10px", textAlign: "center", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "8px", fontSize: "14px", fontWeight: 600, color: "#fff", textDecoration: "none", fontFamily: "Space Grotesk, sans-serif", marginBottom: "20px" }}>Contact Us</a>
                <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "16px" }}>
                  {["Everything in Pro", "Custom branding", "Full API access", "Dedicated account manager", "SLA guarantee", "On-premise deployment", "Training & onboarding"].map(f => (
                    <div key={f} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                      <Check size={14} color="#4ADE80" />
                      <span style={{ fontSize: "13px", color: "#CBD5E1", fontFamily: "Inter, sans-serif" }}>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Trust bar */}
            <div style={{ marginTop: "40px", display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div style={{ display: "flex", gap: "2px" }}>
                  {[1,2,3,4,5].map(i => <Star key={i} size={16} fill="#F59E0B" color="#F59E0B" />)}
                </div>
                <span style={{ fontSize: "14px", fontWeight: 700, color: "#111827", fontFamily: "Space Grotesk, sans-serif" }}>4.9/5</span>
                <span style={{ fontSize: "14px", color: "#6B7280", fontFamily: "Inter, sans-serif" }}>from 500+ reviews</span>
              </div>
              <p style={{ fontSize: "13px", color: "#9CA3AF", fontFamily: "Inter, sans-serif", margin: 0 }}>No credit card required · Cancel anytime · GST-compliant</p>
            </div>
          </div>
        </section>

        {/* Compare table */}
        <section style={{ background: "#fff", borderBottom: "1px solid #D1D5DB" }}>
          <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "64px 24px" }}>
            <h2 style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: "clamp(22px,2.5vw,30px)", fontWeight: 700, color: "#111827", margin: "0 0 8px", textAlign: "center" }}>Compare plans</h2>
            <p style={{ fontSize: "15px", color: "#6B7280", textAlign: "center", margin: "0 auto 32px", fontFamily: "Inter, sans-serif" }}>Everything you need to know about each plan.</p>
            <div style={{ border: "1px solid #E5E7EB", borderRadius: "12px", overflow: "hidden" }}>
              <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", background: "#F8F9FA", borderBottom: "1px solid #E5E7EB", padding: "14px 20px" }}>
                <span style={{ fontSize: "12px", fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: "Space Grotesk, sans-serif" }}>Feature</span>
                {["Free", "Business Pro", "Enterprise"].map(p => (
                  <span key={p} style={{ fontSize: "13px", fontWeight: 700, color: p === "Business Pro" ? T : "#111827", textAlign: "center", fontFamily: "Space Grotesk, sans-serif" }}>{p}</span>
                ))}
              </div>
              {COMPARE.map((row, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", padding: "12px 20px", borderBottom: i < COMPARE.length - 1 ? "1px solid #F3F4F6" : "none", background: i % 2 === 0 ? "#fff" : "#FAFAFA", alignItems: "center" }}>
                  <span style={{ fontSize: "13px", color: "#374151", fontFamily: "Inter, sans-serif" }}>{row.feature}</span>
                  {[row.free, row.pro, row.ent].map((val, j) => (
                    <div key={j} style={{ textAlign: "center" }}><Cell value={val} /></div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section style={{ background: "#F0F4F3", borderTop: "1px solid #D1D5DB" }}>
          <div style={{ maxWidth: "680px", margin: "0 auto", padding: "64px 24px" }}>
            <h2 style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: "clamp(22px,2.5vw,30px)", fontWeight: 700, color: "#111827", margin: "0 0 8px", textAlign: "center" }}>Pricing FAQs</h2>
            <p style={{ fontSize: "15px", color: "#6B7280", textAlign: "center", margin: "0 auto 32px", fontFamily: "Inter, sans-serif" }}>Common questions about our pricing.</p>
            {FAQS.map((faq, i) => <FAQItem key={i} {...faq} />)}
          </div>
        </section>

        {/* CTA */}
        <section style={{ background: "#134E4A", padding: "64px 24px" }}>
          <div style={{ maxWidth: "600px", margin: "0 auto", textAlign: "center" }}>
            <h2 style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: "clamp(24px,3vw,36px)", fontWeight: 700, color: "#fff", margin: "0 0 12px", lineHeight: 1.2 }}>Start for free today</h2>
            <p style={{ fontSize: "15px", color: "#99F6E4", margin: "0 0 28px", fontFamily: "Inter, sans-serif" }}>No credit card required. Upgrade anytime.</p>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
              <a href="/invoice" style={{ padding: "12px 28px", background: T, color: "#fff", borderRadius: "8px", fontSize: "14px", fontWeight: 700, textDecoration: "none", fontFamily: "Space Grotesk, sans-serif" }}>Create Free Invoice</a>
              <button onClick={() => handleUpgrade("monthly")} disabled={!!loading} style={{ padding: "12px 28px", background: "rgba(255,255,255,0.1)", color: "#fff", border: "1px solid rgba(255,255,255,0.3)", borderRadius: "8px", fontSize: "14px", fontWeight: 700, cursor: "pointer", fontFamily: "Space Grotesk, sans-serif" }}>Upgrade to Pro</button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}