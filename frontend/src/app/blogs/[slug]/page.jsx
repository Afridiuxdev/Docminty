"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BlogCTA from "@/components/BlogCTA";
import ShareButtons from "@/components/ShareButtons";
import { BLOGS } from "@/data/blogs";
import { ArrowLeft, Clock, Calendar, User, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const T = "#0D9488";

export default function BlogSinglePage() {
    const { slug } = useParams();
    const [blog, setBlog] = useState(null);

    useEffect(() => {
        const foundBlog = BLOGS.find(b => b.slug === slug);
        setBlog(foundBlog);
    }, [slug]);

    if (!blog) return (
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <p>Loading article...</p>
        </div>
    );

    const relatedPosts = BLOGS.filter(b => b.slug !== slug).slice(0, 3);

    return (
        <>
            <Navbar />
            <main style={{ background: "#fff" }}>
                {/* Header / Breadcrumb */}
                <div style={{ maxWidth: "800px", margin: "0 auto", padding: "40px 24px 0" }}>
                    <div style={{ display: "flex", gap: "8px", fontSize: "14px", color: "#64748B", marginBottom: "32px", alignItems: "center" }}>
                        <Link href="/blogs" style={{ textDecoration: "none", color: "#64748B" }}>Blogs</Link>
                        <ChevronRight size={14} />
                        <span style={{ color: T, fontWeight: 600 }}>{blog.category}</span>
                    </div>

                    <h1 style={{
                        fontFamily: "Space Grotesk, sans-serif",
                        fontSize: "clamp(32px, 5vw, 48px)",
                        fontWeight: 800,
                        color: "#111827",
                        marginBottom: "24px",
                        lineHeight: 1.1,
                        letterSpacing: "-0.02em"
                    }}>
                        {blog.title}
                    </h1>

                    <div style={{ 
                        display: "flex", 
                        flexWrap: "wrap", 
                        alignItems: "center", 
                        gap: "24px", 
                        marginBottom: "40px",
                        paddingBottom: "32px",
                        borderBottom: "1px solid #E5E7EB"
                    }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#F1F5F9", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <User size={18} color="#64748B" />
                            </div>
                            <div>
                                <p style={{ fontSize: "14px", fontWeight: 700, color: "#1E293B", margin: 0 }}>{blog.author}</p>
                                <p style={{ fontSize: "12px", color: "#64748B", margin: 0 }}>{blog.date}</p>
                            </div>
                        </div>
                        <div style={{ height: "24px", width: "1px", background: "#E2E8F0" }} />
                        <div style={{ display: "flex", alignItems: "center", gap: "20px", flexGrow: 1 }}>
                            <span style={{ fontSize: "14px", color: "#64748B", display: "flex", alignItems: "center", gap: "6px" }}>
                                <Clock size={16} /> {blog.readTime}
                            </span>
                            <div style={{ marginLeft: "auto" }}>
                                <ShareButtons title={blog.title} slug={blog.slug} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Hero Image */}
                <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "0 24px 64px" }}>
                    <div style={{ 
                        width: "100%", height: "auto", aspectRatio: "16/9", background: "#F8FAFC", borderRadius: "24px", 
                        display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden",
                        boxShadow: "0 20px 50px rgba(0,0,0,0.1)"
                    }}>
                        <img 
                            src={blog.featuredImage} 
                            alt={blog.title}
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                    </div>
                </div>

                {/* Content Area */}
                <div style={{ 
                    maxWidth: "1240px", margin: "0 auto", padding: "0 24px 80px", 
                    display: "grid", gridTemplateColumns: "1fr 340px", gap: "80px"
                }} className="blog-content-grid">
                    
                    <div className="prose" style={{ 
                        fontFamily: "Inter, sans-serif", fontSize: "18px", color: "#374151", lineHeight: 1.8 
                    }}>
                        <style dangerouslySetInnerHTML={{ __html: `
                            .prose h2 { font-family: 'Space Grotesk', sans-serif; font-size: 28px; font-weight: 800; color: #111827; margin: 48px 0 24px; letter-spacing: -0.01em; }
                            .prose h3 { font-family: 'Space Grotesk', sans-serif; font-size: 22px; font-weight: 700; color: #111827; margin: 32px 0 16px; }
                            .prose p { margin-bottom: 24px; }
                            .prose ul { margin-bottom: 24px; padding-left: 20px; }
                            .prose li { margin-bottom: 12px; }
                            .prose strong { color: #111827; }
                            @media (max-width: 1024px) {
                                .blog-content-grid { grid-template-columns: 1fr !important; }
                                .blog-sidebar { display: none !important; }
                            }
                        `}} />
                        
                        {/* Simple Markdown-ish Parser for Content */}
                        {blog.content.split('\n').map((block, i) => {
                            const trimmed = block.trim();
                            if (trimmed === '# ') return <h1 key={i} style={{ display: "none" }}>{trimmed.substring(2)}</h1>;
                            if (trimmed.startsWith('## ')) return <h2 key={i}>{trimmed.substring(3)}</h2>;
                            if (trimmed.startsWith('### ')) return <h3 key={i}>{trimmed.substring(4)}</h3>;
                            if (trimmed.startsWith('- ')) return <li key={i} style={{ marginLeft: "20px" }}>{trimmed.substring(2)}</li>;
                            
                            // Image Markers
                            if (trimmed === '[IMAGE_1]' && blog.inlineImages?.[0]) {
                                return (
                                    <div key={i} style={{ margin: "48px 0", borderRadius: "20px", overflow: "hidden", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.1)" }}>
                                        <img src={blog.inlineImages[0]} alt="SaaS Workflow Illustration" style={{ width: "100%", height: "auto", display: "block" }} />
                                    </div>
                                );
                            }
                            if (trimmed === '[IMAGE_2]' && blog.inlineImages?.[1]) {
                                return (
                                    <div key={i} style={{ margin: "48px 0", borderRadius: "20px", overflow: "hidden", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.1)" }}>
                                        <img src={blog.inlineImages[1]} alt="Professional Document Dashboard" style={{ width: "100%", height: "auto", display: "block" }} />
                                    </div>
                                );
                            }

                            if (trimmed === '') return null;
                            if (trimmed.startsWith('👉 ')) {
                                return (
                                    <p key={i} style={{ 
                                        padding: "24px", background: "#F0FDFA", borderLeft: `4px solid ${T}`, 
                                        borderRadius: "0 12px 12px 0", color: "#134E4A", fontWeight: 600, fontSize: "20px",
                                        margin: "40px 0"
                                    }}>
                                        {block}
                                    </p>
                                );
                            }
                            return <p key={i}>{block}</p>;
                        })}

                        <BlogCTA />
                    </div>

                    {/* Sidebar */}
                    <aside className="blog-sidebar" style={{ position: "sticky", top: "100px", height: "fit-content" }}>
                        <div style={{ marginBottom: "48px" }}>
                            <h3 style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: "18px", fontWeight: 700, color: "#111827", marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
                                <div style={{ width: "4px", height: "18px", background: T, borderRadius: "2px" }} />
                                Related Posts
                            </h3>
                            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                                {relatedPosts.map(post => (
                                    <Link key={post.id} href={`/blogs/${post.slug}`} style={{ textDecoration: "none" }}>
                                        <div className="related-card" style={{ transition: "all 0.2s" }}>
                                            <p style={{ fontSize: "11px", fontWeight: 700, color: T, textTransform: "uppercase", marginBottom: "8px" }}>{post.category}</p>
                                            <h4 style={{ fontSize: "15px", fontWeight: 700, color: "#111827", lineHeight: 1.4, margin: 0 }}>{post.title}</h4>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        <div style={{ background: "#F8FAFC", borderRadius: "16px", padding: "32px", textAlign: "center" }}>
                            <h3 style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: "18px", fontWeight: 700, color: "#111827", marginBottom: "12px" }}>Stay ahead of the curve</h3>
                            <p style={{ fontSize: "14px", color: "#64748B", lineHeight: 1.6, marginBottom: "24px" }}>Receive the latest guides and tool updates directly in your inbox.</p>
                            <input type="email" placeholder="Email address" style={{ width: "100%", padding: "12px 16px", borderRadius: "8px", border: "1px solid #E2E8F0", marginBottom: "12px" }} />
                            <button style={{ width: "100%", padding: "12px", background: T, color: "#fff", borderRadius: "8px", border: "none", fontWeight: 700, cursor: "pointer" }}>Subscribe Free</button>
                        </div>
                    </aside>
                </div>
            </main>
            <Footer />
            <style jsx>{`
                .related-card:hover h4 {
                    color: ${T};
                }
            `}</style>
        </>
    );
}
