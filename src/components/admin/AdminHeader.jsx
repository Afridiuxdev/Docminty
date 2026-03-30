"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, LogOut, User } from "lucide-react";
import { clearTokens, getAccessToken } from "@/api/auth";

const T = "#0D9488";

function decodeJwtPayload(token) {
  try {
    const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(base64));
  } catch {
    return {};
  }
}

export default function AdminHeader({ title, subtitle }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [adminName, setAdminName] = useState("Admin");
  const [adminEmail, setAdminEmail] = useState("");
  const ref = useRef(null);

  useEffect(() => {
    const token = getAccessToken();
    if (token) {
      const payload = decodeJwtPayload(token);
      if (payload.sub)   setAdminEmail(payload.sub);
      if (payload.name)  setAdminName(payload.name);
    }
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    clearTokens();
    router.push("/login");
  };

  const initials = adminName ? adminName.charAt(0).toUpperCase() : "A";

  return (
    <header style={{
      background: "#fff", borderBottom: "1px solid #E5E7EB",
      padding: "0 28px", height: "64px",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      position: "sticky", top: 0, zIndex: 10,
    }}>
      <div>
        <h1 style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: "17px", fontWeight: 700, color: "#111827", margin: 0 }}>{title}</h1>
        {subtitle && <p style={{ fontSize: "12px", color: "#9CA3AF", margin: 0, fontFamily: "Inter, sans-serif" }}>{subtitle}</p>}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        {/* Search */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "#F8F9FA", border: "1px solid #E5E7EB", borderRadius: "8px", padding: "7px 12px" }}>
          <Search size={14} color="#9CA3AF" />
          <input placeholder="Search..." style={{ border: "none", background: "none", outline: "none", fontSize: "13px", color: "#374151", width: "180px", fontFamily: "Inter, sans-serif" }} />
        </div>

        {/* Avatar + dropdown */}
        <div ref={ref} style={{ position: "relative" }}>
          <button
            onClick={() => setOpen(o => !o)}
            title={adminEmail || "Admin"}
            style={{
              width: "36px", height: "36px", background: T,
              borderRadius: "50%", border: "none",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "13px", fontWeight: 700, color: "#fff",
              cursor: "pointer", fontFamily: "Space Grotesk, sans-serif",
              boxShadow: open ? `0 0 0 3px ${T}33` : "none",
              transition: "box-shadow 150ms",
            }}
          >
            {initials}
          </button>

          {open && (
            <div style={{
              position: "absolute", right: 0, top: "calc(100% + 8px)",
              background: "#fff", border: "1px solid #E5E7EB",
              borderRadius: "12px", padding: "8px",
              minWidth: "220px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
              zIndex: 100,
            }}>
              {/* Profile info */}
              <div style={{ padding: "10px 12px 10px", borderBottom: "1px solid #F3F4F6", marginBottom: "6px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{
                    width: "38px", height: "38px", background: T, borderRadius: "50%",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "15px", fontWeight: 700, color: "#fff",
                    fontFamily: "Space Grotesk, sans-serif", flexShrink: 0,
                  }}>{initials}</div>
                  <div style={{ minWidth: 0 }}>
                    <p style={{ margin: 0, fontSize: "13px", fontWeight: 700, color: "#111827", fontFamily: "Space Grotesk, sans-serif", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{adminName}</p>
                    <p style={{ margin: 0, fontSize: "11px", color: "#6B7280", fontFamily: "Inter, sans-serif", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "150px" }}>{adminEmail}</p>
                  </div>
                </div>
              </div>

              {/* Logout */}
              <button
                onClick={handleLogout}
                style={{
                  width: "100%", display: "flex", alignItems: "center", gap: "8px",
                  padding: "8px 12px", border: "none", background: "none",
                  borderRadius: "8px", cursor: "pointer",
                  fontSize: "13px", fontWeight: 600, color: "#EF4444",
                  fontFamily: "Inter, sans-serif", textAlign: "left",
                  transition: "background 150ms",
                }}
                onMouseEnter={e => e.currentTarget.style.background = "#FEF2F2"}
                onMouseLeave={e => e.currentTarget.style.background = "none"}
              >
                <LogOut size={14} color="#EF4444" />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
