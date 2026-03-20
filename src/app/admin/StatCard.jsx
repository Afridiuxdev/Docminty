"use client";

export default function StatCard({
    title, value, change, changeType = "up",
    icon, color = "#0D9488", bgColor = "#F0FDFA",
    prefix = "", suffix = "",
}) {
    return (
        <div style={{
            background: "#fff",
            border: "1px solid #E5E7EB",
            borderRadius: "12px",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
        }}>
            <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
            }}>
                <div>
                    <p style={{
                        fontSize: "12px", fontWeight: 600,
                        color: "#9CA3AF", margin: "0 0 6px",
                        fontFamily: "Inter, sans-serif",
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                    }}>{title}</p>
                    <p style={{
                        fontFamily: "Space Grotesk, sans-serif",
                        fontWeight: 800, fontSize: "26px",
                        color: "#111827", margin: 0, lineHeight: 1,
                    }}>
                        {prefix}{typeof value === "number"
                            ? value.toLocaleString("en-IN")
                            : value}{suffix}
                    </p>
                </div>
                <div style={{
                    width: "44px", height: "44px",
                    background: bgColor, borderRadius: "10px",
                    display: "flex", alignItems: "center",
                    justifyContent: "center", fontSize: "20px",
                    flexShrink: 0,
                }}>
                    {icon}
                </div>
            </div>
            {change !== undefined && (
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <span style={{
                        fontSize: "12px", fontWeight: 700,
                        color: changeType === "up" ? "#10B981" : "#EF4444",
                        fontFamily: "Inter, sans-serif",
                    }}>
                        {changeType === "up" ? "+" : "-"}{Math.abs(change)}%
                    </span>
                    <span style={{
                        fontSize: "12px", color: "#9CA3AF",
                        fontFamily: "Inter, sans-serif",
                    }}>vs last month</span>
                </div>
            )}
        </div>
    );
}