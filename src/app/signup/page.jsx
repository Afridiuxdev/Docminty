"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Eye, EyeOff, FileText, Check } from "lucide-react";

const T = "#0D9488";

const BENEFITS = [
  "Save documents to cloud",
  "Batch CSV processing",
  "Access from any device",
  "Premium templates",
];

export default function SignupPage() {
  const [form, setForm] = useState({
    name: "", email: "", phone: "",
    password: "", confirmPassword: "",
    plan: "free",
  });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const update = (field, value) =>
    setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.password) {
      setError("Please fill in all required fields.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    setLoading(true);
    setError("");
    // TODO: connect to Spring Boot /api/auth/signup
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  };

  return (
    <>
      <Navbar />
      <main style={{
        minHeight: "calc(100vh - 120px)",
        background: "#F0F4F3",
        display: "flex", alignItems: "center",
        justifyContent: "center", padding: "40px 24px",
      }}>
        <div className="signup-grid" style={{
          width: "100%", maxWidth: "900px",
          display: "grid",
          gridTemplateColumns: "1fr 420px",
          gap: "40px", alignItems: "start",
        }}>

          {/* Left — Benefits */}
          <div style={{ paddingTop: "8px" }}>
            <div style={{
              width: "48px", height: "48px",
              background: T, borderRadius: "12px",
              display: "flex", alignItems: "center",
              justifyContent: "center", marginBottom: "16px",
            }}>
              <FileText size={24} color="#fff" />
            </div>
            <h1 style={{
              fontFamily: "Space Grotesk, sans-serif",
              fontSize: "28px", fontWeight: 700,
              color: "#111827", margin: "0 0 8px", lineHeight: 1.2,
            }}>
              Create your free account
            </h1>
            <p style={{
              fontSize: "15px", color: "#6B7280",
              fontFamily: "Inter, sans-serif",
              margin: "0 0 28px", lineHeight: 1.6,
            }}>
              Join 10,000+ Indian businesses using DocMinty to automate
              their document workflows.
            </p>
            <div style={{
              display: "flex", flexDirection: "column", gap: "12px",
            }}>
              {BENEFITS.map((b, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: "10px",
                }}>
                  <div style={{
                    width: "22px", height: "22px",
                    borderRadius: "50%", background: T,
                    display: "flex", alignItems: "center",
                    justifyContent: "center", flexShrink: 0,
                  }}>
                    <Check size={12} color="#fff" />
                  </div>
                  <span style={{
                    fontSize: "14px", color: "#374151",
                    fontFamily: "Inter, sans-serif",
                  }}>
                    {b}
                  </span>
                </div>
              ))}
            </div>

            {/* Plan toggle */}
            <div style={{
              marginTop: "32px", padding: "20px",
              background: "#fff", border: "1px solid #E5E7EB",
              borderRadius: "12px",
            }}>
              <p style={{
                fontSize: "12px", fontWeight: 700,
                color: "#9CA3AF", textTransform: "uppercase",
                letterSpacing: "0.08em", margin: "0 0 12px",
                fontFamily: "Space Grotesk, sans-serif",
              }}>
                Choose Plan
              </p>
              <div style={{ display: "flex", gap: "8px" }}>
                {[
                  { v: "free", l: "Free", p: "₹0/mo" },
                  { v: "pro", l: "Business Pro", p: "₹199/mo" },
                ].map(opt => (
                  <button key={opt.v}
                    onClick={() => update("plan", opt.v)}
                    style={{
                      flex: 1, padding: "10px",
                      borderRadius: "8px",
                      border: `1px solid ${form.plan === opt.v
                        ? T : "#E5E7EB"}`,
                      background: form.plan === opt.v ? "#F0FDFA" : "#fff",
                      cursor: "pointer", transition: "all 150ms",
                      textAlign: "center",
                    }}>
                    <p style={{
                      fontSize: "13px", fontWeight: 700,
                      color: form.plan === opt.v ? T : "#111827",
                      margin: "0 0 2px",
                      fontFamily: "Space Grotesk, sans-serif",
                    }}>{opt.l}</p>
                    <p style={{
                      fontSize: "12px",
                      color: form.plan === opt.v ? T : "#9CA3AF",
                      margin: 0, fontFamily: "Inter, sans-serif",
                    }}>{opt.p}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right — Form */}
          <div style={{
            background: "#fff",
            border: "1px solid #E5E7EB",
            borderRadius: "16px",
            padding: "32px",
          }}>
            <h2 style={{
              fontFamily: "Space Grotesk, sans-serif",
              fontSize: "18px", fontWeight: 700,
              color: "#111827", margin: "0 0 20px",
            }}>
              Create account
            </h2>

            {error && (
              <div style={{
                background: "#FEF2F2", border: "1px solid #FCA5A5",
                borderRadius: "8px", padding: "10px 14px",
                marginBottom: "16px", fontSize: "13px",
                color: "#DC2626", fontFamily: "Inter, sans-serif",
              }}>
                {error}
              </div>
            )}

            <div className="form-field">
              <label className="field-label">Full Name *</label>
              <input className="doc-input" placeholder="Your Name"
                value={form.name}
                onChange={e => update("name", e.target.value)}
                style={{ height: "40px" }}
              />
            </div>

            <div className="form-field">
              <label className="field-label">Email Address *</label>
              <input className="doc-input" type="email"
                placeholder="you@company.com"
                value={form.email}
                onChange={e => update("email", e.target.value)}
                style={{ height: "40px" }}
              />
            </div>

            <div className="form-field">
              <label className="field-label">Phone Number</label>
              <input className="doc-input"
                placeholder="+91 98765 43210"
                value={form.phone}
                onChange={e => update("phone", e.target.value)}
                style={{ height: "40px" }}
              />
            </div>

            <div className="form-field">
              <label className="field-label">Password *</label>
              <div style={{ position: "relative" }}>
                <input className="doc-input"
                  type={showPass ? "text" : "password"}
                  placeholder="Min 8 characters"
                  value={form.password}
                  onChange={e => update("password", e.target.value)}
                  style={{ height: "40px", paddingRight: "40px" }}
                />
                <button onClick={() => setShowPass(!showPass)} style={{
                  position: "absolute", right: "10px",
                  top: "50%", transform: "translateY(-50%)",
                  background: "none", border: "none",
                  cursor: "pointer", color: "#9CA3AF",
                  display: "flex", alignItems: "center",
                }}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="form-field">
              <label className="field-label">Confirm Password *</label>
              <input className="doc-input" type="password"
                placeholder="Repeat password"
                value={form.confirmPassword}
                onChange={e => update("confirmPassword", e.target.value)}
                style={{ height: "40px" }}
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              style={{
                width: "100%", height: "44px",
                background: loading ? "#9CA3AF" : T,
                color: "#fff", border: "none",
                borderRadius: "8px", fontSize: "15px",
                fontWeight: 700,
                cursor: loading ? "not-allowed" : "pointer",
                fontFamily: "Space Grotesk, sans-serif",
                marginTop: "4px", transition: "background 150ms",
              }}>
              {loading ? "Creating account..." : "Create Free Account"}
            </button>

            <p style={{
              fontSize: "11px", color: "#9CA3AF",
              textAlign: "center", margin: "12px 0 0",
              fontFamily: "Inter, sans-serif", lineHeight: 1.6,
            }}>
              By signing up, you agree to our{" "}
              <Link href="/terms" style={{ color: T }}>Terms</Link>
              {" "}and{" "}
              <Link href="/privacy" style={{ color: T }}>Privacy Policy</Link>
            </p>

            <p style={{
              textAlign: "center", fontSize: "14px",
              color: "#6B7280", margin: "20px 0 0",
              fontFamily: "Inter, sans-serif",
            }}>
              Already have an account?{" "}
              <Link href="/login" style={{
                color: T, fontWeight: 600, textDecoration: "none",
              }}>
                Sign in
              </Link>
            </p>
          </div>
        </div>


      </main>

      <style>{`
        @media (max-width: 768px) {
          .signup-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
      <Footer />
    </>
  );
}