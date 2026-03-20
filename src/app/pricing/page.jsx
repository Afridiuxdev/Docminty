"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PricingCard from "@/components/PricingCard";
import { Check, Star } from "lucide-react";

const T = "#0D9488";

const PLANS = [
  {
    plan: "Free", price: "₹0", period: "forever",
    description: "For freelancers and occasional document needs.",
    subNote: "No expiration date, use anytime.",
    includedFeatures: [
      "All 14 document types",
      "Unlimited PDF downloads",
      "Logo upload",
      "GST auto-calculation",
      "Basic templates",
    ],
    notIncludedFeatures: [
      "Batch CSV processing",
      "Cloud document storage",
      "Premium templates",
      "Priority support",
    ],
    ctaLabel: "Get Started Free",
    ctaHref: "/invoice",
    highlighted: false,
  },
  {
    plan: "Business Pro", price: "₹199",
    originalPrice: "₹399", period: "/month",
    description: "For growing businesses with recurring document needs.",
    subNote: "2+ months free when billed annually.",
    includedFeatures: [
      "Everything in Free",
      "Batch CSV processing",
      "Cloud document storage",
      "Premium templates",
      "Priority support",
      "Custom branding & logo",
      "No DocMinty footer",
      "API access (coming soon)",
    ],
    notIncludedFeatures: [],
    ctaLabel: "Start Free Trial",
    ctaHref: "/signup",
    promoCode: "DOCMINTY20",
    extraLink: "/batch",
    extraLinkLabel: "See Batch Processing →",
    highlighted: true,
  },
  {
    plan: "Enterprise", price: "Custom", period: "",
    description: "For large teams and custom integrations.",
    subNote: "One-time payment, unlimited usage.",
    includedFeatures: [
      "Everything in Pro",
      "Custom branding",
      "Full API access",
      "Dedicated account manager",
      "SLA guarantee",
      "Custom templates",
      "On-premise deployment",
      "Training & onboarding",
    ],
    notIncludedFeatures: [],
    ctaLabel: "Contact Us",
    ctaHref: "mailto:hello@docminty.com",
    promoCode: "DOCMINTY20",
    highlighted: false,
    dark: true,
  },
];

const COMPARE = [
  { feature: "Document Types", free: "14", pro: "14", ent: "Custom" },
  { feature: "PDF Downloads", free: "Unlimited", pro: "Unlimited", ent: "Unlimited" },
  { feature: "Logo Upload", free: true, pro: true, ent: true },
  { feature: "GST Auto-Calculation", free: true, pro: true, ent: true },
  { feature: "Batch CSV Processing", free: false, pro: true, ent: true },
  { feature: "Cloud Storage", free: false, pro: true, ent: true },
  { feature: "Premium Templates", free: false, pro: true, ent: true },
  { feature: "No Watermark", free: true, pro: true, ent: true },
  { feature: "Priority Support", free: false, pro: true, ent: true },
  { feature: "API Access", free: false, pro: "Soon", ent: true },
  { feature: "Custom Branding", free: false, pro: true, ent: true },
  { feature: "Dedicated Manager", free: false, pro: false, ent: true },
  { feature: "SLA Guarantee", free: false, pro: false, ent: true },
];

const FAQS = [
  {
    q: "Can I cancel my subscription anytime?",
    a: "Yes. You can cancel at any time from your account settings. You will continue to have access until the end of your billing period."
  },
  {
    q: "What payment methods are accepted?",
    a: "We accept all major credit/debit cards, UPI, Net Banking, and Razorpay supported payment methods."
  },
  {
    q: "Is my data secure?",
    a: "Yes. We use industry-standard encryption. Documents created on the free plan are not stored on our servers."
  },
  {
    q: "Can I switch plans later?",
    a: "Yes. You can upgrade or downgrade your plan at any time. Changes take effect from the next billing cycle."
  },
  {
    q: "Do you offer refunds?",
    a: "We offer a 7-day money-back guarantee on all paid plans. Contact support within 7 days of purchase."
  },
];

function Cell({ value }) {
  if (value === true) return <span style={{ color: T, fontSize: "16px" }}>✓</span>;
  if (value === false) return <span style={{ color: "#D1D5DB", fontSize: "14px" }}>✗</span>;
  return <span style={{
    fontSize: "13px", color: "#374151",
    fontFamily: "Inter, sans-serif"
  }}>{value}</span>;
}

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: "1px solid #E5E7EB" }}>
      <button onClick={() => setOpen(!open)} style={{
        width: "100%", display: "flex",
        justifyContent: "space-between", alignItems: "center",
        padding: "16px 0", background: "none", border: "none",
        cursor: "pointer", textAlign: "left", gap: "16px",
      }}>
        <span style={{
          fontSize: "15px", fontWeight: 600,
          color: open ? T : "#111827",
          fontFamily: "Space Grotesk, sans-serif",
          transition: "color 150ms"
        }}>{q}</span>
        <span style={{
          fontSize: "18px", color: open ? T : "#9CA3AF",
          transition: "all 200ms",
          transform: open ? "rotate(45deg)" : "rotate(0deg)",
          display: "inline-block", lineHeight: 1,
        }}>+</span>
      </button>
      {open && (
        <p style={{
          fontSize: "14px", color: "#6B7280",
          lineHeight: 1.7, margin: "0 0 16px",
          fontFamily: "Inter, sans-serif"
        }}>{a}</p>
      )}
    </div>
  );
}

import { useState } from "react";

export default function PricingPage() {
  return (
    <>
      <Navbar />
      <main style={{ background: "#F0F4F3" }}>

        {/* Hero */}
        <section style={{
          background: "#fff",
          borderBottom: "1px solid #E5E7EB",
          padding: "64px 24px 0"
        }}>
          <div style={{
            maxWidth: "1100px", margin: "0 auto",
            textAlign: "center"
          }}>
            <p style={{
              fontSize: "12px", fontWeight: 700,
              color: T, textTransform: "uppercase",
              letterSpacing: "0.1em", margin: "0 0 12px",
              fontFamily: "Space Grotesk, sans-serif"
            }}>
              Pricing
            </p>
            <h1 style={{
              fontFamily: "Space Grotesk, sans-serif",
              fontSize: "clamp(28px, 4vw, 44px)",
              fontWeight: 700, color: "#111827",
              margin: "0 0 16px", lineHeight: 1.2,
            }}>
              Simple, transparent pricing
            </h1>
            <p style={{
              fontSize: "16px", color: "#6B7280",
              margin: "0 auto 40px", maxWidth: "500px",
              fontFamily: "Inter, sans-serif", lineHeight: 1.6,
            }}>
              Free forever for individual use.
              Upgrade when your business needs more.
            </p>
          </div>
        </section>

        {/* Plans */}
        <section style={{
          background: "#fff",
          borderBottom: "1px solid #E5E7EB"
        }}>
          <div style={{
            maxWidth: "1100px", margin: "0 auto",
            padding: "0 24px 64px"
          }}>
            <div className="pricing-grid" style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "24px", alignItems: "start",
            }}>
              {PLANS.map((plan, i) => (
                <PricingCard key={i} {...plan} />
              ))}
            </div>

            {/* Trust bar */}
            <div style={{
              marginTop: "40px", display: "flex",
              flexDirection: "column", alignItems: "center", gap: "10px",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div style={{ display: "flex", gap: "2px" }}>
                  {[1, 2, 3, 4, 5].map(i => (
                    <Star key={i} size={16} fill="#F59E0B" color="#F59E0B" />
                  ))}
                </div>
                <span style={{
                  fontSize: "14px", fontWeight: 700,
                  color: "#111827",
                  fontFamily: "Space Grotesk, sans-serif"
                }}>100%</span>
                <span style={{
                  fontSize: "14px", color: "#6B7280",
                  fontFamily: "Inter, sans-serif"
                }}>positive reviews</span>
              </div>
              <p style={{
                fontSize: "13px", color: "#9CA3AF",
                fontFamily: "Inter, sans-serif", margin: 0
              }}>
                No credit card required · Cancel anytime · GST-compliant
              </p>
            </div>
          </div>
        </section>

        {/* Feature comparison table */}
        <section style={{
          background: "#fff",
          borderBottom: "1px solid #D1D5DB"
        }}>
          <div style={{
            maxWidth: "1100px", margin: "0 auto",
            padding: "64px 24px"
          }}>
            <h2 style={{
              fontFamily: "Space Grotesk, sans-serif",
              fontSize: "clamp(22px, 2.5vw, 30px)",
              fontWeight: 700, color: "#111827",
              margin: "0 0 8px", textAlign: "center",
            }}>
              Compare plans
            </h2>
            <p style={{
              fontSize: "15px", color: "#6B7280",
              textAlign: "center", margin: "0 auto 32px",
              fontFamily: "Inter, sans-serif",
            }}>
              Everything you need to know about each plan.
            </p>

            <div style={{
              border: "1px solid #E5E7EB",
              borderRadius: "12px", overflow: "hidden",
            }}>
              {/* Table header */}
              <div style={{
                display: "grid",
                gridTemplateColumns: "2fr 1fr 1fr 1fr",
                background: "#F8F9FA",
                borderBottom: "1px solid #E5E7EB",
                padding: "14px 20px",
              }}>
                <span style={{
                  fontSize: "12px", fontWeight: 700,
                  color: "#9CA3AF", textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  fontFamily: "Space Grotesk, sans-serif"
                }}>
                  Feature
                </span>
                {["Free", "Business Pro", "Enterprise"].map(p => (
                  <span key={p} style={{
                    fontSize: "13px", fontWeight: 700,
                    color: p === "Business Pro" ? T : "#111827",
                    textAlign: "center",
                    fontFamily: "Space Grotesk, sans-serif",
                  }}>{p}</span>
                ))}
              </div>

              {/* Table rows */}
              {COMPARE.map((row, i) => (
                <div key={i} style={{
                  display: "grid",
                  gridTemplateColumns: "2fr 1fr 1fr 1fr",
                  padding: "12px 20px",
                  borderBottom: i < COMPARE.length - 1
                    ? "1px solid #F3F4F6" : "none",
                  background: i % 2 === 0 ? "#fff" : "#FAFAFA",
                  alignItems: "center",
                }}>
                  <span style={{
                    fontSize: "13px", color: "#374151",
                    fontFamily: "Inter, sans-serif"
                  }}>
                    {row.feature}
                  </span>
                  {[row.free, row.pro, row.ent].map((val, j) => (
                    <div key={j} style={{ textAlign: "center" }}>
                      <Cell value={val} />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section style={{
          background: "#F0F4F3",
          borderTop: "1px solid #D1D5DB"
        }}>
          <div style={{
            maxWidth: "680px", margin: "0 auto",
            padding: "64px 24px",
          }}>
            <h2 style={{
              fontFamily: "Space Grotesk, sans-serif",
              fontSize: "clamp(22px, 2.5vw, 30px)",
              fontWeight: 700, color: "#111827",
              margin: "0 0 8px", textAlign: "center",
            }}>
              Pricing FAQs
            </h2>
            <p style={{
              fontSize: "15px", color: "#6B7280",
              textAlign: "center", margin: "0 auto 32px",
              fontFamily: "Inter, sans-serif",
            }}>
              Common questions about our pricing.
            </p>
            {FAQS.map((faq, i) => (
              <FAQItem key={i} {...faq} />
            ))}
          </div>
        </section>

        {/* CTA */}
        <section style={{ background: "#134E4A", padding: "64px 24px" }}>
          <div style={{
            maxWidth: "600px", margin: "0 auto",
            textAlign: "center"
          }}>
            <h2 style={{
              fontFamily: "Space Grotesk, sans-serif",
              fontSize: "clamp(24px, 3vw, 36px)",
              fontWeight: 700, color: "#fff",
              margin: "0 0 12px", lineHeight: 1.2,
            }}>
              Start for free today
            </h2>
            <p style={{
              fontSize: "15px", color: "#99F6E4",
              margin: "0 0 28px",
              fontFamily: "Inter, sans-serif",
            }}>
              No credit card required. Upgrade anytime.
            </p>
            <a href="/invoice" className="cta-btn">
              Create Your First Invoice →
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}