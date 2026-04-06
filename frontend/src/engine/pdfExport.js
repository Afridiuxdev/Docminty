"use client";

// Download using @react-pdf/renderer (for structured templates)
export async function downloadPDF(documentElement, filename = "document.pdf") {
    try {
        const { pdf } = await import("@react-pdf/renderer");
        const blob = await pdf(documentElement).toBlob();
        triggerDownload(blob, filename);
    } catch (err) {
        console.error("PDF generation failed:", err);
        alert("PDF generation failed. Please try again.");
    }
}

// Helper
export function triggerDownload(blob, filename) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}