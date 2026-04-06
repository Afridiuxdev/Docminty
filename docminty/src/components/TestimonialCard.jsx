"use client"
export default function TestimonialCard({
    name,
    role,
    company,
    review,
    rating = 5,
    avatar,
}) {
    return (
        <div style={{
            border: "1px solid #E5E7EB",
            borderRadius: "12px",
            padding: "24px",
            background: "#fff",
            minWidth: "300px",
            maxWidth: "360px",
            flexShrink: 0,
        }}>
            {/* Stars */}
            <div style={{
                display: "flex", gap: "2px", marginBottom: "12px",
            }}>
                {Array.from({ length: rating }).map((_, i) => (
                    <span key={i} style={{ color: "#F59E0B", fontSize: "14px" }}>★</span>
                ))}
            </div>

            {/* Review */}
            <p style={{
                fontSize: "14px", color: "#374151",
                lineHeight: 1.6, margin: "0 0 16px",
                fontFamily: "Inter, sans-serif",
            }}>
                "{review}"
            </p>

            {/* Author */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{
                    width: "36px", height: "36px",
                    borderRadius: "50%",
                    background: "#EEF2FF",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "14px", fontWeight: 700, color: "#0D9488",
                    fontFamily: "Plus Jakarta Sans, sans-serif",
                    flexShrink: 0,
                    overflow: "hidden",
                }}>
                    {avatar ? (
                        <img
                            src={avatar}
                            alt={name}
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                    ) : (
                        name?.charAt(0)?.toUpperCase()
                    )}
                </div>
                <div>
                    <p style={{
                        fontSize: "14px", fontWeight: 600,
                        color: "#111827", margin: 0,
                        fontFamily: "Plus Jakarta Sans, sans-serif",
                    }}>
                        {name}
                    </p>
                    <p style={{
                        fontSize: "12px", color: "#9CA3AF",
                        margin: 0, fontFamily: "Inter, sans-serif",
                    }}>
                        {role}{company ? `, ${company}` : ""}
                    </p>
                </div>
            </div>
        </div>
    );
}
