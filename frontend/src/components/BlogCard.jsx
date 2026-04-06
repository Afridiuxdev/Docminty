"use client";

import Link from "next/link";
import { ArrowRight, Clock, User } from "lucide-react";

const T = "#0D9488";

export default function BlogCard({ blog }) {
    return (
        <Link href={`/blogs/${blog.slug}`} style={{ textDecoration: "none", display: "block", height: "100%" }}>
            <div className="blog-card" style={{
                background: "#fff",
                border: "1px solid #E5E7EB",
                borderRadius: "16px",
                overflow: "hidden",
                transition: "all 300ms ease",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)"
            }}>
                {/* Featured Image */}
                <div style={{
                    width: "100%",
                    height: "200px",
                    position: "relative",
                    overflow: "hidden",
                    background: "#F1F5F9"
                }}>
                    <img 
                        src={blog.featuredImage} 
                        alt={blog.title}
                        style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            transition: "transform 500ms ease"
                        }}
                        className="blog-card-image"
                    />
                    <div style={{
                        position: "absolute",
                        inset: 0,
                        background: "linear-gradient(to top, rgba(0,0,0,0.2), transparent)"
                    }} />
                </div>

                <div style={{ padding: "24px", flexGrow: 1, display: "flex", flexDirection: "column" }}>
                    <div style={{ display: "flex", gap: "10px", marginBottom: "12px", alignItems: "center" }}>
                        <span style={{
                            fontSize: "11px",
                            fontWeight: 700,
                            padding: "4px 10px",
                            background: "#F0FDFA",
                            color: T,
                            borderRadius: "20px",
                            textTransform: "uppercase",
                            letterSpacing: "0.05em"
                        }}>{blog.category}</span>
                        <span style={{ fontSize: "12px", color: "#6B7280", display: "flex", alignItems: "center", gap: "4px" }}>
                            <Clock size={12} /> {blog.readTime}
                        </span>
                    </div>

                    <h3 style={{
                        fontFamily: "Space Grotesk, sans-serif",
                        fontSize: "20px",
                        fontWeight: 700,
                        color: "#111827",
                        margin: "0 0 12px",
                        lineHeight: 1.3
                    }}>{blog.title}</h3>

                    <p style={{
                        fontSize: "14px",
                        color: "#6B7280",
                        lineHeight: 1.6,
                        margin: "0 0 20px",
                        flexGrow: 1
                    }}>{blog.excerpt}</p>

                    <div style={{ 
                        marginTop: "auto", 
                        display: "flex", 
                        alignItems: "center", 
                        justifyContent: "space-between",
                        paddingTop: "16px",
                        borderTop: "1px solid #F3F4F6"
                    }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: "#E5E7EB", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <User size={14} color="#6B7280" />
                            </div>
                            <span style={{ fontSize: "12px", color: "#374151", fontWeight: 500 }}>{blog.author}</span>
                        </div>
                        <div style={{ color: T, fontWeight: 700, fontSize: "14px", display: "flex", alignItems: "center", gap: "4px" }}>
                            Read More <ArrowRight size={14} />
                        </div>
                    </div>
                </div>
            </div>
            
            <style jsx>{`
                .blog-card:hover {
                    border-color: ${T};
                    transform: translateY(-4px);
                    box-shadow: 0 12px 30px rgba(13, 148, 136, 0.1);
                }
                .blog-card:hover .blog-card-image {
                    transform: scale(1.05);
                }
            `}</style>
        </Link>
    );
}
