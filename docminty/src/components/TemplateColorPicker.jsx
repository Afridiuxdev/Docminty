"use client";
import React from "react";
import { Check } from "lucide-react";

const PRESETS = [
  "#0D9488", // Default Teal
  "#6366F1", // Indigo
  "#111827", // Dark
  "#EF4444", // Red
  "#1E3A5F", // Corporate Blue
  "#D97706", // Amber/Gold
  "#7C3AED", // Violet
];

export default function TemplateColorPicker({ value, selectedColor, onChange }) {
  // Support both "value" and "selectedColor" props for backward compatibility
  const color = value || selectedColor || "#0D9488";

  return (
    <div style={{ marginBottom: "20px" }}>
      <label style={{ 
        display: "block", 
        fontSize: "12px", 
        fontWeight: 600, 
        color: "#374151", 
        marginBottom: "10px",
        fontFamily: "Inter, sans-serif"
      }}>
        Template Accent Color
      </label>
      
      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", alignItems: "center" }}>
        {PRESETS.map(pColor => (
          <button
            key={pColor}
            onClick={() => onChange(pColor)}
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              background: pColor,
              border: color === pColor ? "2px solid #fff" : "none",
              boxShadow: color === pColor ? "0 0 0 2px " + pColor : "0 1px 3px rgba(0,0,0,0.1)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 0,
              transition: "transform 150ms ease"
            }}
            onMouseOver={e => e.currentTarget.style.transform = "scale(1.1)"}
            onMouseOut={e => e.currentTarget.style.transform = "scale(1)"}
          >
            {color === pColor && <Check size={14} color="#fff" />}
          </button>
        ))}
        
        {/* Custom Color Picker Input */}
        <div style={{ 
          position: "relative",
          width: "32px",
          height: "32px",
          borderRadius: "50%",
          overflow: "hidden",
          border: !PRESETS.includes(color) ? "2px solid #fff" : "none",
          boxShadow: !PRESETS.includes(color) ? "0 0 0 2px #9CA3AF" : "0 1px 3px rgba(0,0,0,0.1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}>
          <input
            type="color"
            value={color}
            onChange={(e) => onChange(e.target.value)}
            style={{
              position: "absolute",
              top: "-50%",
              left: "-50%",
              width: "200%",
              height: "200%",
              cursor: "pointer",
              border: "none",
              background: "none",
              padding: 0
            }}
          />
          {!PRESETS.includes(color) && (
            <div style={{ position: "absolute", pointerEvents: "none" }}>
              <Check size={14} color="#fff" style={{ filter: "drop-shadow(0 1px 1px rgba(0,0,0,0.5))" }} />
            </div>
          )}
        </div>
        
        <div style={{ marginLeft: "4px" }}>
          <span style={{ 
            fontSize: "11px", 
            fontFamily: "monospace", 
            color: "#6B7280",
            background: "#F3F4F6",
            padding: "2px 6px",
            borderRadius: "4px"
          }}>
            {color?.toUpperCase() || "#0D9488"}
          </span>
        </div>
      </div>
    </div>
  );
}
