"use client";

export default function DashHeader({ title, subtitle, action }) {
  return (
    <header style={{ 
      background: "#fff", 
      borderBottom: "1px solid #E5E7EB", 
      padding: "16px 24px", 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "space-between",
      flexWrap: "wrap",
      gap: "12px",
    }} className={`dash-sub-header ${!action ? 'hide-desktop' : ''}`}>
      <style>{`
        @media (min-width: 1024px) {
          .hide-desktop { display: none !important; }
          .dash-sub-header .title-section { display: none !important; }
          /* Ensure actions stay on the right when title is hidden */
          .dash-sub-header { 
            padding: 8px 24px !important; 
            min-height: 50px; 
            justify-content: flex-end !important; 
          }
        }
        @media (max-width: 640px) {
          .dash-sub-header { padding: 12px 16px; }
          .dash-sub-header { justify-content: space-between !important; }
        }
      `}</style>
      <div className="title-section" style={{ flex: 1 }}>
        <h1 style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: "16px", fontWeight: 700, color: "#111827", margin: 0 }}>{title}</h1>
        {subtitle && <p style={{ fontSize: "12px", color: "#9CA3AF", margin: 0, fontFamily: "Inter, sans-serif" }}>{subtitle}</p>}
      </div>
      {action && <div className="sub-header-action">{action}</div>}
    </header>
  );
}
