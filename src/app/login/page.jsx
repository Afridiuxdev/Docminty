"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Eye, EyeOff, FileText } from "lucide-react";
import { authApi, saveTokens } from "@/api/auth";
import toast from "react-hot-toast";

const T = "#0D9488";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm]       = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com";

  useEffect(() => {
    // Load Google GSI Script
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
    return () => document.body.removeChild(script);
  }, []);

  const handleGoogleResponse = async (response) => {
    setLoading(true);
    try {
      const res = await authApi.googleLogin(response.credential);
      const { accessToken, refreshToken, user } = res.data.data;
      saveTokens(accessToken, refreshToken);
      toast.success("Welcome, " + user.name + "!");
      if (user.role === "ADMIN") {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      toast.error("Google login failed");
    } finally {
      setLoading(false);
    }
  };

  const initGoogle = () => {
    if (!window.google) return;
    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: handleGoogleResponse,
    });
    window.google.accounts.id.prompt();
  };

  const handleSubmit = async () => {
    if (!form.email || !form.password) {
      setError("Please fill in all fields.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await authApi.login({ email: form.email, password: form.password });
      const { accessToken, refreshToken, user } = res.data.data;
      saveTokens(accessToken, refreshToken);
      toast.success("Welcome back, " + user.name + "!");
      if (user.role === "ADMIN") {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Invalid email or password";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%", height: "44px", padding: "0 12px",
    border: "1px solid #E5E7EB", borderRadius: "8px",
    fontSize: "14px", color: "#374151", outline: "none",
    fontFamily: "Inter, sans-serif", boxSizing: "border-box",
    background: "#fff",
  };

  return (
    <>
      <Navbar />
      <main style={{ minHeight: "calc(100vh - 120px)", background: "#F0F4F3", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px" }}>
        <div style={{ width: "100%", maxWidth: "420px" }}>

          {/* Logo */}
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <div style={{ width: "48px", height: "48px", background: T, borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
              <FileText size={24} color="#fff" />
            </div>
            <h1 style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: "24px", fontWeight: 700, color: "#111827", margin: "0 0 4px" }}>Welcome back</h1>
            <p style={{ fontSize: "14px", color: "#6B7280", margin: 0, fontFamily: "Inter, sans-serif" }}>Sign in to your DocMinty account</p>
          </div>

          {/* Card */}
          <div style={{ background: "#fff", borderRadius: "16px", padding: "32px", border: "1px solid #E5E7EB", boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>

            {error && (
              <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: "8px", padding: "10px 14px", marginBottom: "20px" }}>
                <p style={{ fontSize: "13px", color: "#DC2626", margin: 0, fontFamily: "Inter, sans-serif" }}>{error}</p>
              </div>
            )}

            {/* Email */}
            <div style={{ marginBottom: "16px" }}>
              <label style={{ fontSize: "13px", fontWeight: 600, color: "#374151", display: "block", marginBottom: "6px", fontFamily: "Inter, sans-serif" }}>Email address</label>
              <input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder="you@company.com" style={inputStyle} onKeyDown={e => e.key === "Enter" && handleSubmit()} />
            </div>

            {/* Password */}
            <div style={{ marginBottom: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                <label style={{ fontSize: "13px", fontWeight: 600, color: "#374151", fontFamily: "Inter, sans-serif" }}>Password</label>
                <Link href="/forgot-password" style={{ fontSize: "12px", color: T, textDecoration: "none", fontFamily: "Inter, sans-serif" }}>Forgot password?</Link>
              </div>
              <div style={{ position: "relative" }}>
                <input type={showPass ? "text" : "password"} value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} placeholder="Enter your password" style={{ ...inputStyle, paddingRight: "44px" }} onKeyDown={e => e.key === "Enter" && handleSubmit()} />
                <button onClick={() => setShowPass(!showPass)} style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#9CA3AF", display: "flex" }}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button onClick={handleSubmit} disabled={loading} style={{ width: "100%", height: "44px", background: loading ? "#9CA3AF" : T, color: "#fff", border: "none", borderRadius: "8px", fontSize: "14px", fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", fontFamily: "Space Grotesk, sans-serif", transition: "all 150ms" }}>
              {loading ? "Signing in..." : "Sign In"}
            </button>

            {/* Google Login */}
            <button 
              onClick={initGoogle}
              style={{ 
                width: "100%", height: "44px", background: "#fff", color: "#374151", 
                border: "1px solid #E5E7EB", borderRadius: "8px", fontSize: "14px", 
                fontWeight: 600, cursor: "pointer", fontFamily: "Inter, sans-serif", 
                marginTop: "12px", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
                transition: "all 150ms"
              }}
              onMouseEnter={e => e.currentTarget.style.background = "#F9FAFB"}
              onMouseLeave={e => e.currentTarget.style.background = "#fff"}
            >
              <svg width="18" height="18" viewBox="0 0 18 18"><path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285f4"/><path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34a853"/><path d="M3.964 10.712c-.18-.54-.282-1.117-.282-1.712s.102-1.173.282-1.712V4.956H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.044l3.007-2.332z" fill="#fbbc05"/><path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.956l3.007 2.332C4.672 5.164 6.656 3.58 9 3.58z" fill="#ea4335"/></svg>
              Continue with Google
            </button>

            {/* Divider */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px", margin: "20px 0" }}>
              <div style={{ flex: 1, height: "1px", background: "#E5E7EB" }} />
              <span style={{ fontSize: "12px", color: "#9CA3AF", fontFamily: "Inter, sans-serif" }}>or</span>
              <div style={{ flex: 1, height: "1px", background: "#E5E7EB" }} />
            </div>

            <p style={{ textAlign: "center", fontSize: "13px", color: "#6B7280", margin: 0, fontFamily: "Inter, sans-serif" }}>
              Do not have an account?{" "}<Link href="/signup" style={{ color: T, fontWeight: 600, textDecoration: "none" }}>Sign up free</Link>
            </p>
          </div>

          <p style={{ textAlign: "center", fontSize: "12px", color: "#9CA3AF", marginTop: "16px", fontFamily: "Inter, sans-serif" }}>
            By signing in, you agree to our{" "}<Link href="/terms" style={{ color: T, textDecoration: "none" }}>Terms</Link>{" "}and{" "}<Link href="/privacy" style={{ color: T, textDecoration: "none" }}>Privacy Policy</Link>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}