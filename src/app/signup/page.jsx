"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Eye, EyeOff, FileText, Check, Shield } from "lucide-react";
import { authApi, saveTokens } from "@/api/auth";
import toast from "react-hot-toast";

const T = "#0D9488";
const BENEFITS = [
  "Save documents to cloud",
  "Batch CSV processing",
  "Access from any device",
  "Premium templates",
];

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep]         = useState("signup"); // signup | otp
  const [form, setForm]         = useState({ name: "", email: "", phone: "", password: "", confirmPassword: "" });
  const [otp, setOtp]           = useState(["", "", "", "", "", ""]);
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

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
      toast.success("Welcome to DocMinty, " + user.name + "!");
      router.push("/dashboard");
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

  const update = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const inputStyle = {
    width: "100%", height: "44px", padding: "0 12px",
    border: "1px solid #E5E7EB", borderRadius: "8px",
    fontSize: "14px", color: "#374151", outline: "none",
    fontFamily: "Inter, sans-serif", boxSizing: "border-box", background: "#fff",
  };

  // ── Step 1: Signup ──
  const handleSignup = async () => {
    if (!form.name || !form.email || !form.password) {
      setError("Please fill in all required fields."); return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match."); return;
    }
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters."); return;
    }
    setLoading(true); setError("");
    try {
      await authApi.signup({ name: form.name, email: form.email, password: form.password, phone: form.phone });
      toast.success("Account created! Check your email for OTP.");
      setStep("otp");
    } catch (err) {
      const msg = err.response?.data?.message || "Signup failed. Please try again.";
      setError(msg); toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // ── Step 2: OTP Verify ──
  const handleVerifyOtp = async () => {
    const otpString = otp.join("");
    if (otpString.length !== 6) {
      setError("Please enter the 6-digit OTP."); return;
    }
    setLoading(true); setError("");
    try {
      await authApi.verifyOtp({ email: form.email, otp: otpString });
      toast.success("Email verified! Signing you in...");
      // Auto login after verification
      const loginRes = await authApi.login({ email: form.email, password: form.password });
      const { accessToken, refreshToken, user } = loginRes.data.data;
      saveTokens(accessToken, refreshToken);
      toast.success("Welcome to DocMinty, " + user.name + "!");
      router.push("/dashboard");
    } catch (err) {
      const msg = err.response?.data?.message || "Invalid OTP. Please try again.";
      setError(msg); toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // OTP input handler
  const handleOtpChange = (idx, val) => {
    if (!/^\d*$/.test(val)) return;
    const newOtp = [...otp];
    newOtp[idx] = val.slice(-1);
    setOtp(newOtp);
    if (val && idx < 5) {
      document.getElementById("otp-" + (idx + 1))?.focus();
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);
    try {
      await authApi.resendOtp({ email: form.email });
      toast.success("New OTP sent to " + form.email);
    } catch (err) {
      toast.error("Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpKeyDown = (idx, e) => {
    if (e.key === "Backspace" && !otp[idx] && idx > 0) {
      document.getElementById("otp-" + (idx - 1))?.focus();
    }
  };

  return (
    <>
      <Navbar />
      <main style={{ minHeight: "calc(100vh - 120px)", background: "#F0F4F3", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px" }}>
        <div style={{ width: "100%", maxWidth: "440px" }}>

          {/* Logo */}
          <div style={{ textAlign: "center", marginBottom: "28px" }}>
            <div style={{ width: "48px", height: "48px", background: T, borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
              {step === "otp" ? <Shield size={24} color="#fff" /> : <FileText size={24} color="#fff" />}
            </div>
            <h1 style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: "24px", fontWeight: 700, color: "#111827", margin: "0 0 4px" }}>
              {step === "otp" ? "Verify your email" : "Create your account"}
            </h1>
            <p style={{ fontSize: "14px", color: "#6B7280", margin: 0, fontFamily: "Inter, sans-serif" }}>
              {step === "otp" ? "Enter the 6-digit OTP sent to " + form.email : "Free forever. No credit card required."}
            </p>
          </div>

          <div style={{ background: "#fff", borderRadius: "16px", padding: "32px", border: "1px solid #E5E7EB", boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>

            {error && (
              <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: "8px", padding: "10px 14px", marginBottom: "20px" }}>
                <p style={{ fontSize: "13px", color: "#DC2626", margin: 0, fontFamily: "Inter, sans-serif" }}>{error}</p>
              </div>
            )}

            {/* ── OTP STEP ── */}
            {step === "otp" && (
              <div>
                <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginBottom: "24px" }}>
                  {otp.map((digit, idx) => (
                    <input key={idx} id={"otp-" + idx} type="text" inputMode="numeric" maxLength={1} value={digit}
                      onChange={e => handleOtpChange(idx, e.target.value)}
                      onKeyDown={e => handleOtpKeyDown(idx, e)}
                      style={{ width: "44px", height: "52px", textAlign: "center", fontSize: "22px", fontWeight: 700, border: "2px solid " + (digit ? T : "#E5E7EB"), borderRadius: "10px", outline: "none", fontFamily: "Space Grotesk, sans-serif", color: "#111827", background: digit ? "#F0FDFA" : "#fff", transition: "all 150ms" }}
                    />
                  ))}
                </div>
                <button onClick={handleVerifyOtp} disabled={loading} style={{ width: "100%", height: "44px", background: loading ? "#9CA3AF" : T, color: "#fff", border: "none", borderRadius: "8px", fontSize: "14px", fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", fontFamily: "Space Grotesk, sans-serif" }}>
                  {loading ? "Verifying..." : "Verify & Continue"}
                </button>
                <p style={{ textAlign: "center", fontSize: "13px", color: "#6B7280", margin: "16px 0 0", fontFamily: "Inter, sans-serif" }}>
                  Did not receive it?{" "}
                  <button onClick={handleResendOtp} disabled={loading} style={{ background: "none", border: "none", color: T, fontWeight: 600, cursor: "pointer", fontSize: "13px", fontFamily: "Inter, sans-serif" }}>Resend OTP</button>
                </p>
              </div>
            )}

            {/* ── SIGNUP STEP ── */}
            {step === "signup" && (
              <div>
                <div style={{ marginBottom: "14px" }}>
                  <label style={{ fontSize: "13px", fontWeight: 600, color: "#374151", display: "block", marginBottom: "6px", fontFamily: "Inter, sans-serif" }}>Full Name *</label>
                  <input type="text" value={form.name} onChange={e => update("name", e.target.value)} placeholder="Rahul Sharma" style={inputStyle} />
                </div>
                <div style={{ marginBottom: "14px" }}>
                  <label style={{ fontSize: "13px", fontWeight: 600, color: "#374151", display: "block", marginBottom: "6px", fontFamily: "Inter, sans-serif" }}>Email Address *</label>
                  <input type="email" value={form.email} onChange={e => update("email", e.target.value)} placeholder="you@company.com" style={inputStyle} />
                </div>
                <div style={{ marginBottom: "14px" }}>
                  <label style={{ fontSize: "13px", fontWeight: 600, color: "#374151", display: "block", marginBottom: "6px", fontFamily: "Inter, sans-serif" }}>Phone (optional)</label>
                  <input type="tel" value={form.phone} onChange={e => update("phone", e.target.value)} placeholder="+91 98765 43210" style={inputStyle} />
                </div>
                <div style={{ marginBottom: "14px" }}>
                  <label style={{ fontSize: "13px", fontWeight: 600, color: "#374151", display: "block", marginBottom: "6px", fontFamily: "Inter, sans-serif" }}>Password *</label>
                  <div style={{ position: "relative" }}>
                    <input type={showPass ? "text" : "password"} value={form.password} onChange={e => update("password", e.target.value)} placeholder="Min. 8 characters" style={{ ...inputStyle, paddingRight: "44px" }} />
                    <button onClick={() => setShowPass(!showPass)} style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#9CA3AF", display: "flex" }}>
                      {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ fontSize: "13px", fontWeight: 600, color: "#374151", display: "block", marginBottom: "6px", fontFamily: "Inter, sans-serif" }}>Confirm Password *</label>
                  <input type="password" value={form.confirmPassword} onChange={e => update("confirmPassword", e.target.value)} placeholder="Repeat your password" style={inputStyle} onKeyDown={e => e.key === "Enter" && handleSignup()} />
                </div>

                {/* Benefits */}
                <div style={{ background: "#F0FDFA", borderRadius: "8px", padding: "12px 16px", marginBottom: "20px" }}>
                  <p style={{ fontSize: "12px", fontWeight: 600, color: T, margin: "0 0 8px", fontFamily: "Space Grotesk, sans-serif" }}>Free plan includes:</p>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px" }}>
                    {BENEFITS.map(b => (
                      <div key={b} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <Check size={12} color={T} />
                        <span style={{ fontSize: "12px", color: "#374151", fontFamily: "Inter, sans-serif" }}>{b}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button onClick={handleSignup} disabled={loading} style={{ width: "100%", height: "44px", background: loading ? "#9CA3AF" : T, color: "#fff", border: "none", borderRadius: "8px", fontSize: "14px", fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", fontFamily: "Space Grotesk, sans-serif" }}>
                  {loading ? "Creating account..." : "Create Free Account"}
                </button>

                {/* Google Sign up */}
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

                <p style={{ textAlign: "center", fontSize: "13px", color: "#6B7280", margin: "16px 0 0", fontFamily: "Inter, sans-serif" }}>
                  Already have an account?{" "}<Link href="/login" style={{ color: T, fontWeight: 600, textDecoration: "none" }}>Sign in</Link>
                </p>
              </div>
            )}
          </div>

          <p style={{ textAlign: "center", fontSize: "12px", color: "#9CA3AF", marginTop: "16px", fontFamily: "Inter, sans-serif" }}>
            By signing up, you agree to our{" "}<Link href="/terms" style={{ color: T, textDecoration: "none" }}>Terms</Link>{" "}and{" "}<Link href="/privacy" style={{ color: T, textDecoration: "none" }}>Privacy Policy</Link>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}