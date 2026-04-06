"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { X, PenTool, Type, Image as ImageIcon, Eraser, Loader2 } from "lucide-react";

const SignatureModal = ({ isOpen, onClose, onSave }) => {
    const [activeTab, setActiveTab] = useState("draw");
    const [color, setColor] = useState("#000000");
    const [lineWidth, setLineWidth] = useState(2);
    const [text, setText] = useState("");
    const [imagePreview, setImagePreview] = useState(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const canvasRef = useRef(null);
    const contextRef = useRef(null);

    // Initialize canvas
    useEffect(() => {
        if (!isOpen || activeTab !== "draw" || !canvasRef.current) return;
        
        const canvas = canvasRef.current;
        const parent = canvas.parentElement;
        const rect = parent.getBoundingClientRect();
        
        // Use parent width but leave space for toolbar (approx 60px)
        const canvasWidth = rect.width;
        const canvasHeight = 200; 

        canvas.width = canvasWidth * 2;
        canvas.height = canvasHeight * 2;
        canvas.style.width = `${canvasWidth}px`;
        canvas.style.height = `${canvasHeight}px`;

        const context = canvas.getContext("2d");
        context.scale(2, 2);
        context.lineCap = "round";
        context.strokeStyle = color;
        context.lineWidth = lineWidth;
        contextRef.current = context;
        
        // Fill white background (important for image quality)
        context.fillStyle = "#ffffff";
        context.fillRect(0, 0, canvas.width, canvas.height);
    }, [isOpen, activeTab]);

    // Update brush style when color or width changes
    useEffect(() => {
        if (contextRef.current) {
            contextRef.current.strokeStyle = color;
            contextRef.current.lineWidth = lineWidth;
        }
    }, [color, lineWidth]);

    const startDrawing = (e) => {
        const { offsetX, offsetY } = getCoordinates(e);
        contextRef.current.beginPath();
        contextRef.current.moveTo(offsetX, offsetY);
        setIsDrawing(true);
    };

    const draw = (e) => {
        if (!isDrawing) return;
        const { offsetX, offsetY } = getCoordinates(e);
        contextRef.current.lineTo(offsetX, offsetY);
        contextRef.current.stroke();
    };

    const finishDrawing = () => {
        contextRef.current.closePath();
        setIsDrawing(false);
    };

    const getCoordinates = (e) => {
        const event = e.nativeEvent || e;
        if (event.touches && event.touches[0]) {
            const rect = canvasRef.current.getBoundingClientRect();
            return {
                offsetX: event.touches[0].clientX - rect.left,
                offsetY: event.touches[0].clientY - rect.top,
            };
        }
        return { offsetX: event.offsetX, offsetY: event.offsetY };
    };

    const clearCanvas = () => {
        const context = contextRef.current;
        context.fillStyle = "#ffffff";
        context.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => setImagePreview(ev.target.result);
            reader.readAsDataURL(file);
        }
    };

    const handleSave = () => {
        let signatureData = null;
        if (activeTab === "draw") {
            // Trim whitespace and save as image
            signatureData = canvasRef.current.toDataURL("image/png");
        } else if (activeTab === "write") {
            if (!text.trim()) return;
            // Create a temporary canvas for text
            const tempCanvas = document.createElement("canvas");
            tempCanvas.width = 600;
            tempCanvas.height = 200;
            const ctx = tempCanvas.getContext("2d");
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
            ctx.font = "italic 60px var(--font-dancing-script), cursive";
            ctx.fillStyle = color;
            ctx.textAlign = "center";
            ctx.fillText(text, 300, 120);
            signatureData = tempCanvas.toDataURL("image/png");
        } else if (activeTab === "upload") {
            signatureData = imagePreview;
        }

        if (signatureData) {
            onSave(signatureData);
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div style={{
            position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
            background: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center",
            zIndex: 10001, backdropFilter: "blur(4px)"
        }}>
            <div style={{
                background: "#fff", width: "95%", maxWidth: "600px", borderRadius: "16px",
                boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)",
                overflow: "hidden", position: "relative"
            }}>
                {/* Header */}
                <div style={{
                    padding: "16px 24px", borderBottom: "1px solid #E5E7EB", display: "flex",
                    justifyContent: "space-between", alignItems: "center"
                }}>
                    <h2 style={{ fontSize: "18px", fontWeight: 700, margin: 0, color: "#111827", fontFamily: "Space Grotesk, sans-serif" }}>Create signature</h2>
                    <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#9CA3AF", padding: "4px" }}>
                        <X size={20} />
                    </button>
                </div>

                {/* Tabs */}
                <div style={{ padding: "16px 24px" }}>
                    <div style={{
                        display: "flex", background: "#F3F4F6", padding: "4px", borderRadius: "10px", marginBottom: "20px"
                    }}>
                        {[
                            { id: "draw", icon: <PenTool size={16} />, label: "Draw signature" },
                            { id: "write", icon: <Type size={16} />, label: "Write signature" },
                            { id: "upload", icon: <ImageIcon size={16} />, label: "Use image" }
                        ].map(t => (
                            <button
                                key={t.id}
                                onClick={() => setActiveTab(t.id)}
                                style={{
                                    flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                                    padding: "10px", borderRadius: "8px", border: "none", cursor: "pointer",
                                    fontSize: "13px", fontWeight: 600, transition: "all 200ms",
                                    background: activeTab === t.id ? "#fff" : "transparent",
                                    color: activeTab === t.id ? "#0D9488" : "#6B7280",
                                    boxShadow: activeTab === t.id ? "0 1px 3px rgba(0,0,0,0.1)" : "none"
                                }}>
                                {t.icon} {t.label}
                            </button>
                        ))}
                    </div>

                    {/* DRAW PANEL */}
                    {activeTab === "draw" && (
                        <div style={{ background: "#F9FAFB", borderRadius: "12px", border: "1px dashed #D1D5DB", position: "relative", marginBottom: "16px" }}>
                            {/* Toolbar */}
                            <div style={{ padding: "12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                                    <div style={{ display: "flex", gap: "8px" }}>
                                        {["#000000", "#1E40AF", "#B91C1C"].map(c => (
                                            <button key={c} onClick={() => setColor(c)} style={{
                                                width: "20px", height: "20px", borderRadius: "50%", background: c,
                                                border: color === c ? "2px solid #0D9488" : "2px solid #fff",
                                                cursor: "pointer", boxShadow: "0 0 0 1px #E5E7EB"
                                            }} />
                                        ))}
                                    </div>
                                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                        <input type="range" min="1" max="10" value={lineWidth} onChange={(e) => setLineWidth(parseInt(e.target.value))} style={{ cursor: "pointer" }} />
                                        <span style={{ fontSize: "12px", color: "#6B7280", fontWeight: 600 }}>{lineWidth}px</span>
                                    </div>
                                </div>
                                <button onClick={clearCanvas} style={{
                                    display: "flex", alignItems: "center", gap: "6px", background: "none",
                                    border: "1px solid #E5E7EB", borderRadius: "6px", padding: "4px 10px",
                                    fontSize: "12px", fontWeight: 600, cursor: "pointer", color: "#6B7280"
                                }}>
                                    <Eraser size={14} /> Clear
                                </button>
                            </div>
                            <canvas
                                ref={canvasRef}
                                onMouseDown={startDrawing}
                                onMouseMove={draw}
                                onMouseUp={finishDrawing}
                                onMouseOut={finishDrawing}
                                onTouchStart={startDrawing}
                                onTouchMove={draw}
                                onTouchEnd={finishDrawing}
                                style={{ width: "100%", height: "200px", display: "block", cursor: "crosshair", background: "#fff", touchAction: "none", borderRadius: "0 0 12px 12px" }}
                            />
                        </div>
                    )}

                    {/* WRITE PANEL */}
                    {activeTab === "write" && (
                        <div style={{ marginBottom: "16px" }}>
                            <div className="form-field">
                                <label className="field-label">Type your name</label>
                                <input
                                    className="doc-input"
                                    placeholder="Enter name..."
                                    value={text}
                                    onChange={(e) => setText(e.target.value)}
                                    autoFocus
                                />
                            </div>
                            <div style={{
                                marginTop: "20px", padding: "40px", background: "#fff",
                                borderRadius: "12px", border: "1px solid #E5E7EB",
                                display: "flex", justifyContent: "center", alignItems: "center",
                                minHeight: "150px", overflow: "hidden"
                            }}>
                                <span style={{
                                    fontSize: "48px",
                                    fontFamily: "var(--font-dancing-script), cursive",
                                    color: color,
                                    whiteSpace: "nowrap"
                                }}>
                                    {text || "Signature Preview"}
                                </span>
                            </div>
                            <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
                                {["#000000", "#1E3A8A", "#991B1B"].map(c => (
                                    <button key={c} onClick={() => setColor(c)} style={{
                                        width: "28px", height: "28px", borderRadius: "50%", background: c,
                                        border: color === c ? "3px solid #0D9488" : "1px solid #E5E7EB",
                                        cursor: "pointer"
                                    }} />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* UPLOAD PANEL */}
                    {activeTab === "upload" && (
                        <div style={{ marginBottom: "16px" }}>
                            <div style={{
                                border: "2px dashed #D1D5DB", borderRadius: "12px", padding: "40px",
                                textAlign: "center", background: "#F9FAFB", cursor: "pointer"
                            }} onClick={() => document.getElementById("sig-upload").click()}>
                                {imagePreview ? (
                                    <div style={{ position: "relative", display: "inline-block" }}>
                                        <img src={imagePreview} alt="Signature Preview" style={{ maxHeight: "150px", maxWidth: "100%" }} />
                                    </div>
                                ) : (
                                    <>
                                        <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }}>
                                            <ImageIcon size={24} color="#9CA3AF" />
                                        </div>
                                        <p style={{ margin: 0, fontSize: "13px", color: "#374151", fontWeight: 600 }}>Click to upload image</p>
                                        <p style={{ margin: "4px 0 0", fontSize: "12px", color: "#9CA3AF" }}>PNG, JPG or SVG (Max 5MB)</p>
                                    </>
                                )}
                                <input id="sig-upload" type="file" hidden accept="image/*" onChange={handleFileUpload} />
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div style={{ padding: "16px 24px", borderTop: "1px solid #E5E7EB", background: "#F9FAFB", display: "flex", justifyContent: "flex-end", gap: "12px" }}>
                    <button onClick={onClose} style={{
                        padding: "10px 20px", borderRadius: "10px", border: "1px solid #D1D5DB",
                        background: "#fff", color: "#374151", fontWeight: 600, fontSize: "14px", cursor: "pointer"
                    }}>
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={activeTab === "write" ? !text.trim() : activeTab === "upload" ? !imagePreview : false}
                        style={{
                            padding: "10px 24px", borderRadius: "10px", border: "none",
                            background: "#0D9488", color: "#fff", fontWeight: 700, fontSize: "14px",
                            cursor: "pointer", boxShadow: "0 4px 6px -1px rgba(13,148,136,0.1)",
                            opacity: (activeTab === "write" ? !text.trim() : activeTab === "upload" ? !imagePreview : false) ? 0.5 : 1
                        }}>
                        Create and use
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SignatureModal;
