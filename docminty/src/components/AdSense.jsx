"use client"
export default function FormSection({ label, children }) {
    return (
        <div style={{ marginBottom: "20px" }}>
            {label && (
                <p style={{
                    fontSize: "11px",
                    fontWeight: 600,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "#6B7280",
                    marginBottom: "12px",
                    marginTop: 0,
                    fontFamily: "Inter, sans-serif",
                }}>
                    {label}
                </p>
            )}
            <div style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
            }}>
                {children}
            </div>
        </div>
    );
}
