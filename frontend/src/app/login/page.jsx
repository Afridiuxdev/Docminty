"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Eye, EyeOff, FileText } from "lucide-react";
import { authApi, saveTokens } from "@/api/auth";
import toast from "react-hot-toast";
import NativeGoogleLogin from "@/components/NativeGoogleLogin";

const T = "#0D9488";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm]       = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp]         = useState("");

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    try {
      const res = await authApi.googleLogin(credentialResponse.credential);
      const { accessToken, refreshToken, user } = res.data.data;
      saveTokens(accessToken, refreshToken);
      toast.success("Welcome, " + user.name + "!");
      if (user.role === "ADMIN") {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      toast.error("Google login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    toast.error("Google sign-in was cancelled or failed.");
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
      
      if (res.data?.data?.require2fa) {
          toast.success("2FA OTP sent to your email.");
           setShowOtp(true);
           return;
      }

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

  const handleOtpSubmit = async () => {
    if (!otp) { setError("Please enter the OTP."); return; }
    setLoading(true); setError("");
    try {
        const res = await authApi.verifyLoginOtp({ email: form.email, otp });
        const { accessToken, refreshToken, user } = res.data.data;
        saveTokens(accessToken, refreshToken);
        toast.success("Welcome back, " + user.name + "!");
        if (user.role === "ADMIN") router.push("/admin");
        else router.push("/dashboard");
    } catch (err) {
        const msg = err.response?.data?.message || "Invalid OTP";
        setError(msg); toast.error(msg);
    } finally { setLoading(false); }
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

            {showOtp ? (
              <>
                <div style={{ marginBottom: "20px", textAlign: "center" }}>
                    <p style={{ fontSize: "14px", color: "#374151", margin: "0 0 8px", fontFamily: "Inter, sans-serif" }}>We've sent a one-time password to <b>{form.email}</b>.</p>
                </div>
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ fontSize: "13px", fontWeight: 600, color: "#374151", display: "block", marginBottom: "6px", fontFamily: "Inter, sans-serif" }}>One-Time Password (OTP)</label>
                  <input type="text" value={otp} onChange={e => setOtp(e.target.value)} placeholder="000000" maxLength={6} style={{ ...inputStyle, textAlign: "center", fontSize: "20px", letterSpacing: "0.2em", fontWeight: 700 }} onKeyDown={e => e.key === "Enter" && handleOtpSubmit()} />
                </div>
                <button onClick={handleOtpSubmit} disabled={loading} style={{ width: "100%", height: "44px", background: loading ? "#9CA3AF" : T, color: "#fff", border: "none", borderRadius: "8px", fontSize: "14px", fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", fontFamily: "Space Grotesk, sans-serif", transition: "all 150ms" }}>
                  {loading ? "Verifying..." : "Verify & Sign In"}
                </button>
                <div style={{ marginTop: "16px", textAlign: "center" }}>
                    <button onClick={() => { setShowOtp(false); setOtp(""); setError(""); }} style={{ background: "none", border: "none", color: "#6B7280", fontSize: "13px", textDecoration: "underline", cursor: "pointer", fontFamily: "Inter, sans-serif" }}>Cancel</button>
                </div>
              </>
            ) : (
              <>
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

                {/* Divider */}
                <div style={{ display: "flex", alignItems: "center", gap: "12px", margin: "20px 0" }}>
                  <div style={{ flex: 1, height: "1px", background: "#E5E7EB" }} />
                  <span style={{ fontSize: "12px", color: "#9CA3AF", fontFamily: "Inter, sans-serif" }}>or</span>
                  <div style={{ flex: 1, height: "1px", background: "#E5E7EB" }} />
                </div>

                {/* Google Login */}
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <NativeGoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={handleGoogleError}
                    text="signin_with"
                  />
                </div>

                {/* Divider */}
                <div style={{ display: "flex", alignItems: "center", gap: "12px", margin: "20px 0" }}>
                  <div style={{ flex: 1, height: "1px", background: "#E5E7EB" }} />
                </div>

                <p style={{ textAlign: "center", fontSize: "13px", color: "#6B7280", margin: 0, fontFamily: "Inter, sans-serif" }}>
                  Do not have an account?{" "}<Link href="/signup" style={{ color: T, fontWeight: 600, textDecoration: "none" }}>Sign up free</Link>
                </p>
              </>
            )}
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