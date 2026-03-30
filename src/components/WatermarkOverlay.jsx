"use client";

import React from "react";

export default function WatermarkOverlay({ text = "DocMinty PRO", scale = 1 }) {
    // We'll use a data URI SVG background for a cleaner, consistent look
    const svgString = `
    <svg width="250" height="150" xmlns="http://www.w3.org/1992/svg">
      <text x="50%" y="50%" 
        font-family="Inter, system-ui, sans-serif" 
        font-size="14" 
        font-weight="700" 
        fill="rgba(0, 0, 0, 0.04)" 
        text-anchor="middle" 
        transform="rotate(-25 125 75)">
        DOCMINTY PRO
      </text>
    </svg>
    `;
    const svgBase64 = typeof window !== 'undefined' ? btoa(svgString.trim()) : '';

    return (
        <div style={{
            position: "absolute",
            inset: 0,
            overflow: "hidden",
            pointerEvents: "none",
            zIndex: 10,
            userSelect: "none",
            backgroundImage: `url("data:image/svg+xml;base64,${svgBase64}")`,
            backgroundRepeat: "repeat",
            backgroundSize: `${200 * scale}px ${120 * scale}px`,
        }} />
    );
}
