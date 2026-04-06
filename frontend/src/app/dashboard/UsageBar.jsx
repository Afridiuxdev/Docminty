"use client";
const T = "#0D9488";

export default function UsageBar({ label, used, total, unit = "", color = T }) {
    const pct = Math.min((used / total) * 100, 100);
    const isWarning = pct > 80;

    return (
        <div>
            <div style={{
                display: "flex", justifyContent: "space-between",
                marginBottom: "5px",
            }}>
                <span style={{
                    fontSize: "12px", color: "#6B7280",
                    fontFamily: "Inter, sans-serif",
                }}>{label}</span>
                <span style={{
                    fontSize: "12px", fontWeight: 700,
                    color: isWarning ? "#EF4444" : "#111827",
                    fontFamily: "Space Grotesk, sans-serif",
                }}>
                    {used}{unit} / {total}{unit}
                </span>
            </div>
            <div style={{
                height: "6px", background: "#F3F4F6",
                borderRadius: "3px", overflow: "hidden",
            }}>
                <div style={{
                    height: "100%", borderRadius: "3px",
                    background: isWarning ? "#EF4444" : color,
                    width: `${pct}%`,
                    transition: "width 500ms ease",
                }} />
            </div>
        </div>
    );
}