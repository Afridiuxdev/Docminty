"use client";
import { useRef, useState } from "react";
import { Upload, X } from "lucide-react";

export default function LogoUpload({ value, onChange }) {
    const inputRef = useRef(null);
    const [dragging, setDragging] = useState(false);

    const handleFile = (file) => {
        if (!file || !file.type.startsWith("image/")) return;
        const reader = new FileReader();
        reader.onload = (e) => onChange(e.target.result);
        reader.readAsDataURL(file);
    };

    return (
        <div>
            {value ? (
                <div style={{
                    display: "flex", alignItems: "center",
                    gap: "12px", padding: "10px",
                    border: "1px solid #E5E7EB",
                    borderRadius: "8px",
                }}>
                    <img
                        src={value}
                        alt="Logo"
                        style={{ height: "40px", objectFit: "contain" }}
                    />
                    <span style={{
                        fontSize: "13px", color: "#6B7280", flex: 1,
                    }}>
                        Logo uploaded
                    </span>
                    <button
                        onClick={() => onChange(null)}
                        style={{
                            background: "none", border: "none",
                            cursor: "pointer", color: "#9CA3AF",
                            padding: "4px",
                        }}
                    >
                        <X size={16} />
                    </button>
                </div>
            ) : (
                <div
                    onClick={() => inputRef.current?.click()}
                    onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={(e) => {
                        e.preventDefault();
                        setDragging(false);
                        handleFile(e.dataTransfer.files[0]);
                    }}
                    style={{
                        border: `1px dashed ${dragging ? "#4F46E5" : "#E5E7EB"}`,
                        borderRadius: "8px",
                        padding: "16px",
                        textAlign: "center",
                        cursor: "pointer",
                        background: dragging ? "#EEF2FF" : "#FAFAFA",
                        transition: "all 150ms",
                    }}
                >
                    <Upload
                        size={18}
                        color="#9CA3AF"
                        style={{ margin: "0 auto 6px", display: "block" }}
                    />
                    <p style={{
                        fontSize: "13px", color: "#6B7280",
                        margin: 0, fontFamily: "Inter, sans-serif",
                    }}>
                        Click or drag to upload logo
                    </p>
                    <p style={{
                        fontSize: "11px", color: "#9CA3AF",
                        margin: "2px 0 0", fontFamily: "Inter, sans-serif",
                    }}>
                        PNG, JPG up to 2MB
                    </p>
                </div>
            )}
            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={(e) => handleFile(e.target.files[0])}
            />
        </div>
    );
}