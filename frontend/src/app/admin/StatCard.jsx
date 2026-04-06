"use client";

export default function StatCard({
    title, value, change, up = true,
    icon, color = "#0D9488", bgColor = "#F0FDFA",
    prefix = "", suffix = "",
}) {
    const isNumeric = typeof change === "number";
    return (
        <div style={{
            background: "#fff",
            border: "1px solid #E5E7EB",
            borderRadius: "12px",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
        }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                    <p style={{ fontSize: "11px", fontWeight: 600, color: "#9CA3AF", margin: "0 0 6px", fontFamily: "Inter, sans-serif", textTransform: "uppercase", letterSpacing: "0.06em" }}>{title}</p>
                    <p style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 800, fontSize: "26px", color: "#111827", margin: 0, lineHeight: 1 }}>
                        {prefix}{typeof value === "number" ? value.toLocaleString("en-IN") : value}{suffix}
                    </p>
                </div>
                {icon && (
                    <div style={{ width: "44px", height: "44px", background: bgColor, borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", flexShrink: 0 }}>
                        {icon}
                    </div>
                )}
            </div>
            {change !== undefined && change !== null && (
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    {isNumeric ? (
                        <span style={{ fontSize: "12px", fontWeight: 700, color: up ? "#10B981" : "#EF4444", fontFamily: "Inter, sans-serif" }}>
                            {up ? "+" : "-"}{Math.abs(change)}%
                        </span>
                    ) : (
                        <span style={{ fontSize: "12px", fontWeight: 600, color: up ? "#10B981" : "#9CA3AF", fontFamily: "Inter, sans-serif" }}>
                            {up ? "↑" : "↓"} {change}
                        </span>
                    )}
                </div>
            )}
        </div>
    );
}