"use client";
import { useState } from "react";
import { Lock, Check } from "lucide-react";
import { TEMPLATE_REGISTRY } from "@/templates/registry";

const T = "#0D9488";

const PREVIEW_COLORS = {
  "#0D9488": { header: "#0D9488", light: "#F0FDFA" },
  "#6366F1": { header: "#6366F1", light: "#EEF2FF" },
  "#111827": { header: "#111827", light: "#F8F9FA" },
  "#EF4444": { header: "#EF4444", light: "#FEF2F2" },
  "#1E3A5F": { header: "#1E3A5F", light: "#EFF6FF" },
  "#D97706": { header: "#D97706", light: "#FFFBEB" },
  "#7C3AED": { header: "#7C3AED", light: "#F5F3FF" },
};

function MiniPreview({ template, docType }) {
  const colors = PREVIEW_COLORS[template.accent] || PREVIEW_COLORS["#0D9488"];
  const isCert = docType === "certificate";
  const isModern = template.name === "Modern";
  const isMinimal = template.name === "Minimal";
  const isBold = template.name === "Bold";
  const isElegant = template.name === "Elegant";
  const isRoyal = template.name === "Royal";
  if (isCert) {
    return (
      <div style={{ width: "100%", height: "120px", background: "#fff", border: "1px solid #E5E7EB", borderRadius: "6px", overflow: "hidden", position: "relative", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "4px" }}>
        {isRoyal && <div style={{ position: "absolute", inset: 0, border: "4px solid " + colors.header, margin: "4px", borderRadius: "4px" }} />}
        {!isRoyal && <div style={{ position: "absolute", inset: 0, border: "2px solid " + colors.header, margin: "6px", borderRadius: "3px" }} />}
        <div style={{ width: "40px", height: "5px", background: colors.header, borderRadius: "2px", marginBottom: "3px" }} />
        <div style={{ width: "60px", height: "3px", background: "#E5E7EB", borderRadius: "1px" }} />
        <div style={{ width: "50px", height: "3px", background: "#E5E7EB", borderRadius: "1px" }} />
        <div style={{ width: "36px", height: "2px", background: colors.header, borderRadius: "1px", marginTop: "4px" }} />
      </div>
    );
  }
  if (isModern) {
    return (
      <div style={{ width: "100%", height: "120px", background: "#fff", border: "1px solid #E5E7EB", borderRadius: "6px", overflow: "hidden", display: "flex" }}>
        <div style={{ width: "28px", background: colors.header, flexShrink: 0 }} />
        <div style={{ flex: 1, padding: "8px 6px" }}>
          <div style={{ width: "50px", height: "5px", background: colors.header, borderRadius: "2px", marginBottom: "6px" }} />
          <div style={{ width: "100%", height: "2px", background: "#F3F4F6", marginBottom: "3px" }} />
          <div style={{ width: "80%", height: "2px", background: "#F3F4F6", marginBottom: "3px" }} />
          <div style={{ width: "90%", height: "2px", background: "#F3F4F6", marginBottom: "6px" }} />
          <div style={{ width: "100%", height: "1px", background: "#E5E7EB", marginBottom: "4px" }} />
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <div style={{ width: "40px", height: "10px", background: colors.light, border: "1px solid " + colors.header, borderRadius: "2px" }} />
          </div>
        </div>
      </div>
    );
  }
  if (isMinimal) {
    return (
      <div style={{ width: "100%", height: "120px", background: "#fff", border: "1px solid #E5E7EB", borderRadius: "6px", overflow: "hidden", padding: "10px 8px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
          <div style={{ width: "40px", height: "4px", background: "#111827", borderRadius: "1px" }} />
          <div style={{ width: "30px", height: "4px", background: "#D1D5DB", borderRadius: "1px" }} />
        </div>
        <div style={{ width: "100%", height: "1px", background: "#111827", marginBottom: "6px" }} />
        <div style={{ width: "70%", height: "2px", background: "#F3F4F6", marginBottom: "3px" }} />
        <div style={{ width: "85%", height: "2px", background: "#F3F4F6", marginBottom: "3px" }} />
        <div style={{ width: "60%", height: "2px", background: "#F3F4F6", marginBottom: "8px" }} />
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <div style={{ width: "35px", height: "8px", background: "#111827", borderRadius: "2px" }} />
        </div>
      </div>
    );
  }
  if (isBold) {
    return (
      <div style={{ width: "100%", height: "120px", background: "#fff", border: "1px solid #E5E7EB", borderRadius: "6px", overflow: "hidden" }}>
        <div style={{ background: colors.header, padding: "10px 8px" }}>
          <div style={{ width: "50px", height: "6px", background: "rgba(255,255,255,0.9)", borderRadius: "2px", marginBottom: "3px" }} />
          <div style={{ width: "35px", height: "3px", background: "rgba(255,255,255,0.5)", borderRadius: "1px" }} />
        </div>
        <div style={{ padding: "6px 8px" }}>
          <div style={{ width: "100%", height: "2px", background: "#F3F4F6", marginBottom: "3px" }} />
          <div style={{ width: "80%", height: "2px", background: "#F3F4F6", marginBottom: "3px" }} />
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "6px" }}>
            <div style={{ width: "40px", height: "10px", background: colors.header, borderRadius: "2px" }} />
          </div>
        </div>
      </div>
    );
  }
  if (isElegant) {
    return (
      <div style={{ width: "100%", height: "120px", background: "#FFFDF5", border: "1px solid " + colors.header, borderRadius: "6px", overflow: "hidden", padding: "8px" }}>
        <div style={{ borderBottom: "2px solid " + colors.header, paddingBottom: "6px", marginBottom: "6px", display: "flex", justifyContent: "space-between" }}>
          <div style={{ width: "40px", height: "4px", background: "#111827", borderRadius: "1px", marginTop: "6px" }} />
          <div style={{ width: "30px", height: "10px", background: colors.header, borderRadius: "2px" }} />
        </div>
        <div style={{ width: "90%", height: "2px", background: "#F3F4F6", marginBottom: "3px" }} />
        <div style={{ width: "70%", height: "2px", background: "#F3F4F6", marginBottom: "3px" }} />
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "8px" }}>
          <div style={{ width: "45px", height: "10px", background: colors.light, border: "1px solid " + colors.header, borderRadius: "2px" }} />
        </div>
      </div>
    );
  }
  // Classic / Corporate / default
  return (
    <div style={{ width: "100%", height: "120px", background: "#fff", border: "1px solid #E5E7EB", borderRadius: "6px", overflow: "hidden", padding: "8px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: "2px solid " + colors.header, paddingBottom: "6px", marginBottom: "6px" }}>
        <div>
          <div style={{ width: "40px", height: "4px", background: "#111827", borderRadius: "1px", marginBottom: "3px" }} />
          <div style={{ width: "28px", height: "2px", background: "#D1D5DB", borderRadius: "1px" }} />
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ width: "35px", height: "5px", background: colors.header, borderRadius: "1px", marginBottom: "3px" }} />
          <div style={{ width: "24px", height: "2px", background: "#D1D5DB", borderRadius: "1px" }} />
        </div>
      </div>
      <div style={{ width: "100%", height: "2px", background: "#F3F4F6", marginBottom: "2px" }} />
      <div style={{ width: "75%", height: "2px", background: "#F3F4F6", marginBottom: "2px" }} />
      <div style={{ width: "85%", height: "2px", background: "#F3F4F6", marginBottom: "6px" }} />
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <div style={{ width: "40px", height: "10px", background: colors.light, border: "1px solid " + colors.header, borderRadius: "2px" }} />
      </div>
    </div>
  );
}

export default function TemplatePicker({ docType, selected, onChange, isPro = false }) {
  const [open, setOpen] = useState(false);
  const templates = TEMPLATE_REGISTRY[docType] || {};
  const selectedMeta = templates[selected] || templates["Classic"];
  const PREVIEW_C = PREVIEW_COLORS[selectedMeta?.accent] || PREVIEW_COLORS["#0D9488"];

  return (
    <div style={{ marginBottom: "16px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
        <label style={{ fontSize: "12px", fontWeight: 600, color: "#374151", fontFamily: "Inter, sans-serif" }}>Template Style</label>
        <button onClick={() => setOpen(!open)} style={{ fontSize: "11px", color: T, fontWeight: 600, background: "none", border: "none", cursor: "pointer", fontFamily: "Inter, sans-serif" }}>
          {open ? "Close" : "Change Template"}
        </button>
      </div>

      {/* Current selection pill */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 12px", background: PREVIEW_C.light, border: "1px solid " + selectedMeta?.accent, borderRadius: "8px" }}>
        <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: selectedMeta?.accent, flexShrink: 0 }} />
        <span style={{ fontSize: "13px", fontWeight: 600, color: "#111827", fontFamily: "Inter, sans-serif" }}>{selectedMeta?.name}</span>
        <span style={{ fontSize: "11px", color: "#9CA3AF", fontFamily: "Inter, sans-serif" }}>{selectedMeta?.description}</span>
        {selectedMeta?.pro && !isPro && <span style={{ marginLeft: "auto", fontSize: "10px", fontWeight: 700, color: "#D97706", background: "#FEF9C3", padding: "2px 7px", borderRadius: "8px", fontFamily: "Inter, sans-serif" }}>PRO</span>}
      </div>

      {/* Template grid */}
      {open && (
        <div style={{ marginTop: "12px", padding: "16px", background: "#F8F9FA", borderRadius: "10px", border: "1px solid #E5E7EB" }}>
          <p style={{ fontSize: "11px", fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 12px", fontFamily: "Space Grotesk, sans-serif" }}>Choose Template</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px" }}>
            {Object.entries(templates).map(([key, tpl]) => {
              const isSelected = selected === key;
              const isLocked = tpl.pro && !isPro;
              return (
                <div key={key} onClick={() => { if (!isLocked) { onChange(key); setOpen(false); } }} style={{ cursor: isLocked ? "not-allowed" : "pointer", opacity: isLocked ? 0.7 : 1, position: "relative" }}>
                  <div style={{ border: "2px solid " + (isSelected ? tpl.accent : "#E5E7EB"), borderRadius: "8px", overflow: "hidden", marginBottom: "6px", transition: "border-color 150ms" }}>
                    <MiniPreview template={tpl} docType={docType} />
                    {isSelected && (
                      <div style={{ position: "absolute", top: "6px", right: "6px", width: "18px", height: "18px", background: tpl.accent, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Check size={10} color="#fff" />
                      </div>
                    )}
                    {isLocked && (
                      <div style={{ position: "absolute", inset: 0, background: "rgba(255,255,255,0.6)", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "6px" }}>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "3px" }}>
                          <Lock size={14} color="#D97706" />
                          <span style={{ fontSize: "9px", fontWeight: 700, color: "#D97706", fontFamily: "Inter, sans-serif" }}>PRO</span>
                        </div>
                      </div>
                    )}
                  </div>
                  <p style={{ fontSize: "11px", fontWeight: isSelected ? 700 : 500, color: isSelected ? tpl.accent : "#374151", textAlign: "center", margin: 0, fontFamily: "Inter, sans-serif" }}>{tpl.name}</p>
                </div>
              );
            })}
          </div>
          {!isPro && (
            <div style={{ marginTop: "12px", padding: "10px 12px", background: "#FEF9C3", border: "1px solid #F59E0B", borderRadius: "8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <p style={{ fontSize: "12px", color: "#92400E", fontFamily: "Inter, sans-serif", margin: 0 }}>Unlock all templates with Business Pro</p>
              <a href="/pricing" style={{ fontSize: "12px", fontWeight: 700, color: "#92400E", fontFamily: "Inter, sans-serif", textDecoration: "none", background: "#F59E0B", color: "#fff", padding: "4px 12px", borderRadius: "6px" }}>Upgrade</a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
