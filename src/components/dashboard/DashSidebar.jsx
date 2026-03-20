"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FileText, PlusCircle, CreditCard, Settings, User, LogOut, ChevronRight, Shield } from "lucide-react";

const T = "#0D9488";

const NAV = [
  { href: "/dashboard",           icon: LayoutDashboard, label: "Overview"     },
  { href: "/dashboard/documents", icon: FileText,        label: "My Documents" },
  { href: "/dashboard/create",    icon: PlusCircle,      label: "Create New"   },
  { href: "/dashboard/billing",   icon: CreditCard,      label: "Billing"      },
  { href: "/dashboard/profile",   icon: User,            label: "Profile"      },
  { href: "/dashboard/settings",  icon: Settings,        label: "Settings"     },
];

export default function DashSidebar({ user }) {
  const pathname = usePathname();
  const isPro = user?.plan === "pro";
  return (
    <aside style={{ width: "220px", minHeight: "100vh", background: "#fff", borderRight: "1px solid #E5E7EB", display: "flex", flexDirection: "column", flexShrink: 0, position: "sticky", top: 0 }}>
      <div style={{ padding: "20px 16px", borderBottom: "1px solid #F3F4F6" }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none" }}>
          <div style={{ width: "30px", height: "30px", background: T, borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <FileText size={15} color="#fff" />
          </div>
          <span style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: "15px", color: "#111827" }}>DocMinty</span>
        </Link>
      </div>
      <div style={{ padding: "12px 16px" }}>
        <div style={{ padding: "10px 12px", background: isPro ? "#F0FDFA" : "#F8F9FA", border: "1px solid " + (isPro ? T : "#E5E7EB"), borderRadius: "10px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
            <Shield size={13} color={isPro ? T : "#9CA3AF"} />
            <span style={{ fontSize: "12px", fontWeight: 700, color: isPro ? T : "#9CA3AF", fontFamily: "Space Grotesk, sans-serif" }}>{isPro ? "Business Pro" : "Free Plan"}</span>
          </div>
          {!isPro && (
            <Link href="/dashboard/billing" style={{ fontSize: "11px", color: T, fontFamily: "Inter, sans-serif", textDecoration: "none", fontWeight: 600 }}>Upgrade to Pro</Link>
          )}
          {isPro && (
            <p style={{ fontSize: "11px", color: "#6B7280", fontFamily: "Inter, sans-serif", margin: 0 }}>Renews Apr 19, 2026</p>
          )}
        </div>
      </div>
      <nav style={{ flex: 1, padding: "4px 12px" }}>
        {NAV.map(item => {
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href}
              style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px", padding: "8px 10px", borderRadius: "8px", marginBottom: "2px", textDecoration: "none", background: isActive ? "#F0FDFA" : "transparent", transition: "all 150ms" }}
              onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = "#F8F9FA"; }}
              onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Icon size={15} color={isActive ? T : "#9CA3AF"} />
                <span style={{ fontSize: "13px", fontWeight: isActive ? 600 : 500, color: isActive ? T : "#6B7280", fontFamily: "Inter, sans-serif" }}>{item.label}</span>
              </div>
              {isActive && <ChevronRight size={12} color={T} />}
            </Link>
          );
        })}
      </nav>
      <div style={{ padding: "12px 16px", borderTop: "1px solid #F3F4F6" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 10px", borderRadius: "8px", background: "#F8F9FA", cursor: "pointer" }}>
          <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: T, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 700, color: "#fff", flexShrink: 0, fontFamily: "Space Grotesk, sans-serif" }}>
            {(user?.name || "U").charAt(0).toUpperCase()}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: "12px", fontWeight: 600, color: "#111827", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontFamily: "Inter, sans-serif" }}>{user?.name || "User"}</p>
            <p style={{ fontSize: "10px", color: "#9CA3AF", margin: 0, fontFamily: "Inter, sans-serif", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user?.email || "user@example.com"}</p>
          </div>
          <LogOut size={13} color="#9CA3AF" />
        </div>
      </div>
    </aside>
  );
}
