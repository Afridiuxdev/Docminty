"use client";

import { Share2, Link as LinkIcon, Twitter, Linkedin, Facebook } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

const T = "#0D9488";

export default function ShareButtons({ title, slug }) {
    const [copied, setCopied] = useState(false);
    const url = typeof window !== "undefined" ? window.location.href : `https://docminty.com/blogs/${slug}`;

    const handleCopy = () => {
        navigator.clipboard.writeText(url);
        toast.success("Link copied to clipboard!");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const shareLinks = [
        { 
            name: "WhatsApp", 
            icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766 0-3.187-2.59-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.513-2.961-2.628-.086-.115-.718-.954-.718-1.817 0-.863.454-1.287.614-1.46.16-.174.346-.217.462-.217s.231.001.332.005c.109.004.253-.041.397.301.144.344.492 1.199.535 1.284.044.084.073.183.015.298-.058.116-.087.188-.175.289-.087.101-.183.226-.261.303-.093.093-.19.193-.082.378.109.186.483.797 1.037 1.288.714.633 1.314.83 1.501.923.187.093.298.077.405-.047.107-.123.461-.537.586-.719.124-.181.249-.152.419-.09s1.08.509 1.268.601c.188.092.312.138.358.217.045.08.045.459-.1.864z" />
                </svg>
            ),
            href: `https://wa.me/?text=${encodeURIComponent(title + " " + url)}`,
            color: "#25D366"
        },
        { 
            name: "LinkedIn", 
            icon: <Linkedin size={18} />, 
            href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
            color: "#0077B5"
        },
        { 
            name: "Twitter", 
            icon: <Twitter size={18} />, 
            href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
            color: "#1DA1F2"
        },
    ];

    return (
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "13px", fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.05em", marginRight: "4px" }}>Share:</span>
            
            {shareLinks.map((link) => (
                <a 
                    key={link.name}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={`Share on ${link.name}`}
                    style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "50%",
                        background: "#fff",
                        border: "1px solid #E2E8F0",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#64748B",
                        transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                        textDecoration: "none"
                    }}
                    className="share-btn"
                    onMouseEnter={(e) => { e.currentTarget.style.color = link.color; e.currentTarget.style.borderColor = link.color; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = "#64748B"; e.currentTarget.style.borderColor = "#E2E8F0"; }}
                >
                    {link.icon}
                </a>
            ))}

            <button 
                onClick={handleCopy}
                title="Copy Link"
                style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    background: copied ? T : "#fff",
                    border: `1px solid ${copied ? T : "#E2E8F0"}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: copied ? "#fff" : "#64748B",
                    cursor: "pointer",
                    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
                }}
                className="share-btn"
            >
                <LinkIcon size={18} />
            </button>
        </div>
    );
}
