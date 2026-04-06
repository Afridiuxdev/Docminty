"use client";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Eye, EyeOff, FileText, Check, Shield, Star, Zap } from "lucide-react";
import { authApi, saveTokens } from "@/api/auth";
import { initiatePayment } from "@/api/payment";
import toast from "react-hot-toast";
import NativeGoogleLogin from "@/components/NativeGoogleLogin";

const T = "#0D9488";
const BENEFITS = {
  FREE: [
    "Save documents to cloud",
    "Batch CSV processing",
    "Access from any device",
    "Premium templates",
  ],
  PRO: [
    "Logo upload & custom branding",
    "Batch CSV generation",
    "Store 20 documents in cloud",
    "Priority support (24/7)",
  ],
  ENTERPRISE: [
    "Team access / multi-user login",
    "Store 50 documents in cloud",
    "Priority processing",
    "Dedicated account manager",
  ]
};

function SignupContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedPlan = searchParams.get("plan");
  const billingCycle = searchParams.get("billing") || "monthly";

  const isUpgrade = !!selectedPlan && selectedPlan !== "Free";

  const [step, setStep]         = useState("signup"); // signup | otp
  const [form, setForm]         = useState({ name: "", email: "", phone: "", password: "", confirmPassword: "" });
  const [otp, setOtp]           = useState(["", "", "", "", "", ""]);
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [success, setSuccess]   = useState(false); // New state for post-payment success
  const [error, setError]       = useState("");

  const handlePostRegistration = async (user, accessToken, refreshToken) => {
    saveTokens(accessToken, refreshToken);

    if (isUpgrade) {
      const type = selectedPlan === "Enterprise"
        ? (billingCycle === "monthly" ? "MONTHLY_ENTERPRISE" : "ANNUAL_ENTERPRISE")
        : (billingCycle === "monthly" ? "MONTHLY_PRO" : "ANNUAL_PRO");

      setLoading(true);
      toast.loading("Initiating payment...");
      await initiatePayment(
        type,
        () => {
          setSuccess(true);
          setLoading(true); // Keep loader on
          toast.dismiss();
          toast.success(`Payment successful! Redirecting to dashboard...`);
          router.push("/dashboard");
        },
        (err) => {
          setLoading(false);
          toast.dismiss();
          toast.error(err || "Payment failed. You can upgrade from the dashboard.");
          router.push("/dashboard");
        }
      );
    } else {
      setSuccess(true);
      setLoading(true);
      toast.success("Welcome to DocMinty, " + user.name + "!");
      router.push("/dashboard");
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    try {
      const res = await authApi.googleLogin(credentialResponse.credential);
      const { accessToken, refreshToken, user } = res.data.data;
      await handlePostRegistration(user, accessToken, refreshToken);
    } catch (err) {
      toast.error("Google sign-up failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    toast.error("Google sign-in was cancelled or failed.");
  };

  const update = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const inputStyle = {
    width: "100%", height: "44px", padding: "0 12px",
    border: "1px solid #E5E7EB", borderRadius: "8px",
    fontSize: "14px", color: "#374151", outline: "none",
    fontFamily: "Inter, sans-serif", boxSizing: "border-box", background: "#fff",
  };

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

  const handleVerifyOtp = async () => {
    const otpString = otp.join("");
    if (otpString.length !== 6) {
      setError("Please enter the 6-digit OTP."); return;
    }
    setLoading(true); setError("");
    try {
      await authApi.verifyOtp({ email: form.email, otp: otpString });
      const loginRes = await authApi.login({ email: form.email, password: form.password });
      const { accessToken, refreshToken, user } = loginRes.data.data;
      await handlePostRegistration(user, accessToken, refreshToken);
    } catch (err) {
      const msg = err.response?.data?.message || "Invalid OTP. Please try again.";
      setError(msg); toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

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

  const currentBenefits = selectedPlan?.includes("PRO") || selectedPlan === "Business Pro" ? BENEFITS.PRO : (selectedPlan === "Enterprise" ? BENEFITS.ENTERPRISE : BENEFITS.FREE);

  return (
    <>
      {(loading && success) && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(255,255,255,0.9)", backdropFilter: "blur(4px)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div style={{ width: "48px", height: "48px", border: "4px solid #F3F3F3", borderTop: "4px solid " + T, borderRadius: "50%", animation: "spin 1s linear infinite", marginBottom: "20px" }} />
          <h2 style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: "20px", fontWeight: 700, color: "#111827", margin: "0 0 8px" }}>Sign up successful!</h2>
          <p style={{ fontSize: "14px", color: "#6B7280", margin: 0, fontFamily: "Inter, sans-serif" }}>Securely redirecting to your dashboard...</p>
          <style dangerouslySetInnerHTML={{ __html: "@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }" }} />
        </div>
      )}
      <main style={{ minHeight: "calc(100vh - 120px)", background: "#F0F4F3", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px" }}>
        <div style={{ width: "100%", maxWidth: "440px" }}>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <div style={{ width: "48px", height: "48px", background: T, borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
            {step === "otp" ? <Shield size={24} color="#fff" /> : (isUpgrade ? <Zap size={24} color="#fff" /> : <FileText size={24} color="#fff" />)}
          </div>
          <h1 style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: "24px", fontWeight: 700, color: "#111827", margin: "0 0 4px" }}>
            {step === "otp" ? "Verify your email" : (isUpgrade ? `Setup your ${selectedPlan} account` : "Create your account")}
          </h1>
          <p style={{ fontSize: "14px", color: "#6B7280", margin: 0, fontFamily: "Inter, sans-serif" }}>
            {step === "otp" ? "Enter the 6-digit OTP sent to " + form.email : (isUpgrade ? `Complete the steps below to start your plan.` : "Free forever. No credit card required.")}
          </p>
        </div>

        <div style={{ background: "#fff", borderRadius: "16px", padding: "32px", border: "1px solid #E5E7EB", boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>

          {error && (
            <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: "8px", padding: "10px 14px", marginBottom: "20px" }}>
              <p style={{ fontSize: "13px", color: "#DC2626", margin: 0, fontFamily: "Inter, sans-serif" }}>{error}</p>
            </div>
          )}

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
                <p style={{ fontSize: "12px", fontWeight: 600, color: T, margin: "0 0 8px", fontFamily: "Space Grotesk, sans-serif" }}>
                  {isUpgrade ? `${selectedPlan} benefits:` : "Free plan includes:"}
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px" }}>
                  {currentBenefits.map(b => (
                    <div key={b} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <Check size={12} color={T} />
                      <span style={{ fontSize: "12px", color: "#374151", fontFamily: "Inter, sans-serif" }}>{b}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button onClick={handleSignup} disabled={loading} style={{ width: "100%", height: "44px", background: loading ? "#9CA3AF" : T, color: "#fff", border: "none", borderRadius: "8px", fontSize: "14px", fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", fontFamily: "Space Grotesk, sans-serif" }}>
                {loading ? "Creating account..." : (isUpgrade ? "Continue to Payment" : "Create Free Account")}
              </button>

              <div style={{ display: "flex", alignItems: "center", gap: "12px", margin: "16px 0" }}>
                <div style={{ flex: 1, height: "1px", background: "#E5E7EB" }} />
                <span style={{ fontSize: "12px", color: "#9CA3AF", fontFamily: "Inter, sans-serif" }}>or</span>
                <div style={{ flex: 1, height: "1px", background: "#E5E7EB" }} />
              </div>

              <div style={{ display: "flex", justifyContent: "center" }}>
                <NativeGoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  text={isUpgrade ? "signup_with" : "signup_with"}
                />
              </div>

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
    </>
  );
}

export default function SignupPage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={
        <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: "40px", height: "40px", border: "3px solid #F3F3F3", borderTop: "3px solid #0D9488", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
          <style dangerouslySetInnerHTML={{ __html: "@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }" }} />
        </div>
      }>
        <SignupContent />
      </Suspense>
      <Footer />
    </>
  );
}