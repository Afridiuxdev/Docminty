"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Eye, EyeOff, FileText } from "lucide-react";

const T = "#0D9488";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!form.email || !form.password) {
      setError("Please fill in all fields.");
      return;
    }
    setLoading(true);
    setError("");
    // TODO: connect to Spring Boot /api/auth/login
    setTimeout(() => {
      setLoading(false);
      setError("Invalid credentials. Please try again.");
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
        <div style={{ width: "100%", maxWidth: "420px" }}>

          {/* Logo */}
          <div style={{
            textAlign: "center", marginBottom: "32px",
          }}>
            <div style={{
              width: "48px", height: "48px",
              background: T, borderRadius: "12px",
              display: "flex", alignItems: "center",
              justifyContent: "center", margin: "0 auto 12px",
            }}>
              <FileText size={24} color="#fff" />
            </div>
            <h1 style={{
              fontFamily: "Space Grotesk, sans-serif",
              fontSize: "24px", fontWeight: 700,
              color: "#111827", margin: "0 0 6px",
            }}>
              Welcome back
            </h1>
            <p style={{
              fontSize: "14px", color: "#6B7280",
              fontFamily: "Inter, sans-serif", margin: 0,
            }}>
              Sign in to your DocMinty account
            </p>
          </div>

          {/* Card */}
          <div style={{
            background: "#fff",
            border: "1px solid #E5E7EB",
            borderRadius: "16px",
            padding: "32px",
          }}>
            {error && (
              <div style={{
                background: "#FEF2F2",
                border: "1px solid #FCA5A5",
                borderRadius: "8px",
                padding: "10px 14px",
                marginBottom: "20px",
                fontSize: "13px",
                color: "#DC2626",
                fontFamily: "Inter, sans-serif",
              }}>
                {error}
              </div>
            )}

            <div className="form-field">
              <label className="field-label">Email Address</label>
              <input className="doc-input"
                type="email"
                placeholder="you@company.com"
                value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                style={{ height: "42px", fontSize: "14px" }}
              />
            </div>

            <div className="form-field" style={{ position: "relative" }}>
              <label className="field-label">Password</label>
              <div style={{ position: "relative" }}>
                <input className="doc-input"
                  type={showPass ? "text" : "password"}
                  placeholder="Enter password"
                  value={form.password}
                  onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                  style={{
                    height: "42px", fontSize: "14px",
                    paddingRight: "40px"
                  }}
                />
                <button
                  onClick={() => setShowPass(!showPass)}
                  style={{
                    position: "absolute", right: "10px",
                    top: "50%", transform: "translateY(-50%)",
                    background: "none", border: "none",
                    cursor: "pointer", color: "#9CA3AF",
                    display: "flex", alignItems: "center",
                  }}>
                  {showPass
                    ? <EyeOff size={16} />
                    : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div style={{
              display: "flex", justifyContent: "flex-end",
              marginBottom: "20px",
            }}>
              <Link href="#" style={{
                fontSize: "13px", color: T,
                textDecoration: "none",
                fontFamily: "Inter, sans-serif",
              }}>
                Forgot password?
              </Link>
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              style={{
                width: "100%", height: "44px",
                background: loading ? "#9CA3AF" : T,
                color: "#fff", border: "none",
                borderRadius: "8px", fontSize: "15px",
                fontWeight: 700, cursor: loading ? "not-allowed" : "pointer",
                fontFamily: "Space Grotesk, sans-serif",
                transition: "background 150ms",
              }}>
              {loading ? "Signing in..." : "Sign In"}
            </button>

            <div style={{
              display: "flex", alignItems: "center",
              gap: "12px", margin: "20px 0",
            }}>
              <div style={{
                flex: 1, height: "1px",
                background: "#E5E7EB"
              }} />
              <span style={{
                fontSize: "12px", color: "#9CA3AF",
                fontFamily: "Inter, sans-serif"
              }}>or</span>
              <div style={{
                flex: 1, height: "1px",
                background: "#E5E7EB"
              }} />
            </div>

            <Link href="/invoice" style={{
              display: "flex", alignItems: "center",
              justifyContent: "center",
              height: "44px",
              border: "1px solid #E5E7EB",
              borderRadius: "8px",
              fontSize: "14px", fontWeight: 600,
              color: "#374151", textDecoration: "none",
              fontFamily: "Inter, sans-serif",
              transition: "all 150ms",
              gap: "8px",
            }}>
              Continue without account →
            </Link>
          </div>

          <p style={{
            textAlign: "center", fontSize: "14px",
            color: "#6B7280", margin: "20px 0 0",
            fontFamily: "Inter, sans-serif",
          }}>
            Don't have an account?{" "}
            <Link href="/signup" style={{
              color: T, fontWeight: 600, textDecoration: "none",
            }}>
              Sign up free
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}