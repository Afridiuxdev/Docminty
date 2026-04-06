"use client";

import React from "react";

export default function WatermarkOverlay({ text = "DocMinty PRO", scale = 1 }) {
    // We'll use a data URI SVG background for a cleaner, consistent look
    const svgString = `
    <svg width="200" height="120" xmlns="http://www.w3.org/2000/svg">
      <text x="50%" y="55%"
        font-family="Inter, system-ui, sans-serif"
        font-size="13"
        font-weight="700"
        fill="rgba(0, 0, 0, 0.10)"
        text-anchor="middle"
        transform="rotate(-25 100 60)">
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
