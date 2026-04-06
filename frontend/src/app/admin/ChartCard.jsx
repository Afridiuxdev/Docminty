"use client";

const T = "#0D9488";

export default function ChartCard({ title, subtitle, children, action }) {
    return (
        <div style={{
            background: "#fff",
            border: "1px solid #E5E7EB",
            borderRadius: "12px",
            overflow: "hidden",
        }}>
            <div style={{
                padding: "16px 20px",
                borderBottom: "1px solid #F3F4F6",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
            }}>
                <div>
                    <p style={{
                        fontFamily: "Space Grotesk, sans-serif",
                        fontWeight: 700, fontSize: "14px",
                        color: "#111827", margin: 0,
                    }}>{title}</p>
                    {subtitle && (
                        <p style={{
                            fontSize: "12px", color: "#9CA3AF",
                            margin: "2px 0 0", fontFamily: "Inter, sans-serif",
                        }}>{subtitle}</p>
                    )}
                </div>
                {action && action}
            </div>
            <div style={{ padding: "20px" }}>
                {children}
            </div>
        </div>
    );
}