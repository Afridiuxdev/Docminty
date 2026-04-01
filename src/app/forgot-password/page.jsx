"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Eye, EyeOff, Mail, Shield, Lock, CheckCircle, ArrowLeft } from "lucide-react";
import { authApi } from "@/api/auth";
import toast from "react-hot-toast";

const T = "#0D9488";

function StepIndicator({ currentStep }) {
  const steps = ["Email", "Verify OTP", "New Password"];
  const stepNums = [1, 2, 3];
  const stepMap = { email: 1, otp: 2, reset: 3, done: 4 };
  const active = stepMap[currentStep] || 1;

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "32px", gap: "0" }}>
      {steps.map((label, i) => {
        const num = stepNums[i];
        const isActive = num === active;
        const isDone = num < active;
        return (
          <div key={i} style={{ display: "flex", alignItems: "center" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
              <div style={{
                width: "32px", height: "32px", borderRadius: "50%",
                background: isDone ? T : isActive ? T : "#E5E7EB",
                color: isDone || isActive ? "#fff" : "#9CA3AF",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "13px", fontWeight: 700, fontFamily: "Space Grotesk, sans-serif",
                transition: "all 250ms",
              }}>
                {isDone ? <CheckCircle size={16} /> : num}
              </div>
              <span style={{
                fontSize: "11px", fontFamily: "Inter, sans-serif",
                color: isActive ? T : isDone ? "#374151" : "#9CA3AF",
                fontWeight: isActive ? 600 : 400, whiteSpace: "nowrap",
              }}>{label}</span>
            </div>
            {i < steps.length - 1 && (
              <div style={{
                width: "60px", height: "2px", marginBottom: "16px",
                background: isDone ? T : "#E5E7EB", transition: "all 250ms",
              }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep]           = useState("email"); // email | otp | reset | done
  const [email, setEmail]         = useState("");
  const [otp, setOtp]             = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPass] = useState("");
  const [confirmPassword, setCon] = useState("");
  const [showPass, setShowPass]   = useState(false);
  const [showConf, setShowConf]   = useState(false);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState("");

  const inputStyle = {
    width: "100%", height: "44px", padding: "0 12px",
    border: "1px solid #E5E7EB", borderRadius: "8px",
    fontSize: "14px", color: "#374151", outline: "none",
    fontFamily: "Inter, sans-serif", boxSizing: "border-box", background: "#fff",
  };

  // ── Step 1: Send OTP ──
  const handleSendOtp = async () => {
    if (!email) { setError("Please enter your email address."); return; }
    setLoading(true); setError("");
    try {
      await authApi.forgotPassword({ email });
      toast.success("Reset OTP sent to " + email);
      setStep("otp");
    } catch (err) {
      const msg = err.response?.data?.message || "Something went wrong. Please try again.";
      setError(msg); toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // ── Step 2: Verify OTP ──
  const handleVerifyOtp = async () => {
    const otpStr = otp.join("");
    if (otpStr.length !== 6) { setError("Please enter the 6-digit OTP."); return; }
    setLoading(true); setError("");
    try {
      await authApi.verifyResetOtp({ email, otp: otpStr });
      toast.success("OTP verified!");
      setStep("reset");
    } catch (err) {
      const msg = err.response?.data?.message || "Invalid OTP. Please try again.";
      setError(msg); toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // ── Step 3: Reset Password ──
  const handleResetPassword = async () => {
    if (!newPassword || newPassword.length < 8) {
      setError("Password must be at least 8 characters."); return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match."); return;
    }
    setLoading(true); setError("");
    try {
      const otpStr = otp.join("");
      await authApi.resetPassword({ email, otp: otpStr, newPassword });
      toast.success("Password reset successfully!");
      setStep("done");
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to reset password. Please try again.";
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
    if (val && idx < 5) document.getElementById("rotp-" + (idx + 1))?.focus();
  };

  const handleOtpKeyDown = (idx, e) => {
    if (e.key === "Backspace" && !otp[idx] && idx > 0)
      document.getElementById("rotp-" + (idx - 1))?.focus();
  };

  const handleResendOtp = async () => {
    setLoading(true);
    try {
      await authApi.forgotPassword({ email });
      setOtp(["", "", "", "", "", ""]);
      toast.success("New OTP sent to " + email);
    } catch {
      toast.error("Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  const stepIcon = { email: Mail, otp: Shield, reset: Lock, done: CheckCircle };
  const Icon = stepIcon[step] || Mail;
  const stepTitle = {
    email: "Forgot Password",
    otp: "Verify Your OTP",
    reset: "Set New Password",
    done: "Password Reset!",
  };
  const stepSubtitle = {
    email: "Enter your email and we'll send you a reset OTP.",
    otp: `Enter the 6-digit OTP sent to ${email}`,
    reset: "Create a strong new password for your account.",
    done: "Your password has been successfully reset.",
  };

  return (
    <>
      <Navbar />
      <main style={{ minHeight: "calc(100vh - 120px)", background: "#F0F4F3", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px" }}>
        <div style={{ width: "100%", maxWidth: "420px" }}>

          {/* Logo area */}
          <div style={{ textAlign: "center", marginBottom: "28px" }}>
            <div style={{
              width: "52px", height: "52px",
              background: step === "done" ? "#10B981" : T,
              borderRadius: "14px", display: "flex", alignItems: "center",
              justifyContent: "center", margin: "0 auto 14px",
              boxShadow: `0 4px 16px ${step === "done" ? "rgba(16,185,129,0.3)" : "rgba(13,148,136,0.3)"}`,
              transition: "all 300ms",
            }}>
              <Icon size={26} color="#fff" />
            </div>
            <h1 style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: "24px", fontWeight: 700, color: "#111827", margin: "0 0 6px" }}>
              {stepTitle[step]}
            </h1>
            <p style={{ fontSize: "14px", color: "#6B7280", margin: 0, fontFamily: "Inter, sans-serif", lineHeight: 1.5 }}>
              {stepSubtitle[step]}
            </p>
          </div>

          {/* Step indicator — only show on first 3 steps */}
          {step !== "done" && <StepIndicator currentStep={step} />}

          {/* Card */}
          <div style={{ background: "#fff", borderRadius: "16px", padding: "32px", border: "1px solid #E5E7EB", boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>

            {error && (
              <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: "8px", padding: "10px 14px", marginBottom: "20px" }}>
                <p style={{ fontSize: "13px", color: "#DC2626", margin: 0, fontFamily: "Inter, sans-serif" }}>{error}</p>
              </div>
            )}

            {/* ── STEP 1: EMAIL ── */}
            {step === "email" && (
              <div>
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ fontSize: "13px", fontWeight: 600, color: "#374151", display: "block", marginBottom: "6px", fontFamily: "Inter, sans-serif" }}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => { setEmail(e.target.value); setError(""); }}
                    placeholder="you@company.com"
                    style={inputStyle}
                    onKeyDown={e => e.key === "Enter" && handleSendOtp()}
                    autoFocus
                  />
                </div>
                <button
                  onClick={handleSendOtp}
                  disabled={loading}
                  style={{ width: "100%", height: "44px", background: loading ? "#9CA3AF" : T, color: "#fff", border: "none", borderRadius: "8px", fontSize: "14px", fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", fontFamily: "Space Grotesk, sans-serif", transition: "all 150ms" }}
                >
                  {loading ? "Sending OTP..." : "Send Reset OTP"}
                </button>
              </div>
            )}

            {/* ── STEP 2: OTP ── */}
            {step === "otp" && (
              <div>
                <div style={{ display: "flex", gap: "8px", justifyContent: "center", marginBottom: "24px" }}>
                  {otp.map((digit, idx) => (
                    <input
                      key={idx}
                      id={"rotp-" + idx}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={e => handleOtpChange(idx, e.target.value)}
                      onKeyDown={e => handleOtpKeyDown(idx, e)}
                      style={{
                        width: "44px", height: "52px", textAlign: "center",
                        fontSize: "22px", fontWeight: 700,
                        border: "2px solid " + (digit ? T : "#E5E7EB"),
                        borderRadius: "10px", outline: "none",
                        fontFamily: "Space Grotesk, sans-serif",
                        color: "#111827", background: digit ? "#F0FDFA" : "#fff",
                        transition: "all 150ms",
                      }}
                    />
                  ))}
                </div>
                <button
                  onClick={handleVerifyOtp}
                  disabled={loading}
                  style={{ width: "100%", height: "44px", background: loading ? "#9CA3AF" : T, color: "#fff", border: "none", borderRadius: "8px", fontSize: "14px", fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", fontFamily: "Space Grotesk, sans-serif", marginBottom: "12px" }}
                >
                  {loading ? "Verifying..." : "Verify OTP"}
                </button>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <button
                    onClick={() => { setStep("email"); setOtp(["","","","","",""]); setError(""); }}
                    style={{ background: "none", border: "none", color: "#6B7280", fontSize: "13px", cursor: "pointer", fontFamily: "Inter, sans-serif", display: "flex", alignItems: "center", gap: "4px" }}
                  >
                    <ArrowLeft size={14} /> Change email
                  </button>
                  <button
                    onClick={handleResendOtp}
                    disabled={loading}
                    style={{ background: "none", border: "none", color: T, fontWeight: 600, cursor: "pointer", fontSize: "13px", fontFamily: "Inter, sans-serif" }}
                  >
                    Resend OTP
                  </button>
                </div>
              </div>
            )}

            {/* ── STEP 3: RESET PASSWORD ── */}
            {step === "reset" && (
              <div>
                <div style={{ marginBottom: "16px" }}>
                  <label style={{ fontSize: "13px", fontWeight: 600, color: "#374151", display: "block", marginBottom: "6px", fontFamily: "Inter, sans-serif" }}>
                    New Password
                  </label>
                  <div style={{ position: "relative" }}>
                    <input
                      type={showPass ? "text" : "password"}
                      value={newPassword}
                      onChange={e => { setNewPass(e.target.value); setError(""); }}
                      placeholder="Min. 8 characters"
                      style={{ ...inputStyle, paddingRight: "44px" }}
                    />
                    <button onClick={() => setShowPass(!showPass)} style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#9CA3AF", display: "flex" }}>
                      {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {newPassword.length > 0 && (
                    <div style={{ marginTop: "6px", display: "flex", gap: "4px" }}>
                      {[1,2,3,4].map(i => (
                        <div key={i} style={{
                          flex: 1, height: "3px", borderRadius: "2px",
                          background: newPassword.length >= i * 2
                            ? (newPassword.length < 6 ? "#EF4444" : newPassword.length < 10 ? "#F59E0B" : "#10B981")
                            : "#E5E7EB",
                          transition: "all 200ms",
                        }} />
                      ))}
                    </div>
                  )}
                </div>
                <div style={{ marginBottom: "24px" }}>
                  <label style={{ fontSize: "13px", fontWeight: 600, color: "#374151", display: "block", marginBottom: "6px", fontFamily: "Inter, sans-serif" }}>
                    Confirm New Password
                  </label>
                  <div style={{ position: "relative" }}>
                    <input
                      type={showConf ? "text" : "password"}
                      value={confirmPassword}
                      onChange={e => { setCon(e.target.value); setError(""); }}
                      placeholder="Repeat your password"
                      style={{ ...inputStyle, paddingRight: "44px" }}
                      onKeyDown={e => e.key === "Enter" && handleResetPassword()}
                    />
                    <button onClick={() => setShowConf(!showConf)} style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#9CA3AF", display: "flex" }}>
                      {showConf ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {confirmPassword && (
                    <p style={{ fontSize: "12px", margin: "4px 0 0", color: newPassword === confirmPassword ? "#10B981" : "#EF4444", fontFamily: "Inter, sans-serif" }}>
                      {newPassword === confirmPassword ? "✓ Passwords match" : "✗ Passwords do not match"}
                    </p>
                  )}
                </div>
                <button
                  onClick={handleResetPassword}
                  disabled={loading}
                  style={{ width: "100%", height: "44px", background: loading ? "#9CA3AF" : T, color: "#fff", border: "none", borderRadius: "8px", fontSize: "14px", fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", fontFamily: "Space Grotesk, sans-serif", transition: "all 150ms" }}
                >
                  {loading ? "Resetting..." : "Reset Password"}
                </button>
              </div>
            )}

            {/* ── STEP 4: DONE ── */}
            {step === "done" && (
              <div style={{ textAlign: "center" }}>
                <div style={{ width: "64px", height: "64px", background: "#D1FAE5", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                  <CheckCircle size={32} color="#10B981" />
                </div>
                <h2 style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: "20px", fontWeight: 700, color: "#111827", margin: "0 0 10px" }}>
                  Password Reset Successfully!
                </h2>
                <p style={{ fontSize: "14px", color: "#6B7280", margin: "0 0 28px", fontFamily: "Inter, sans-serif", lineHeight: 1.6 }}>
                  Your password has been updated. You can now log in with your new password.
                </p>
                <button
                  onClick={() => router.push("/login")}
                  style={{ width: "100%", height: "44px", background: T, color: "#fff", border: "none", borderRadius: "8px", fontSize: "14px", fontWeight: 700, cursor: "pointer", fontFamily: "Space Grotesk, sans-serif" }}
                >
                  Go to Login
                </button>
              </div>
            )}
          </div>

          <p style={{ textAlign: "center", fontSize: "13px", color: "#6B7280", marginTop: "20px", fontFamily: "Inter, sans-serif" }}>
            Remember your password?{" "}
            <Link href="/login" style={{ color: T, fontWeight: 600, textDecoration: "none" }}>Sign in</Link>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
