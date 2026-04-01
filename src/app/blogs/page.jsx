"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BlogCard from "@/components/BlogCard";
import { BLOGS } from "@/data/blogs";
import { Search, Filter, ArrowRight } from "lucide-react";
import { useState } from "react";

const T = "#0D9488";
const DT = "#134E4A";

export default function BlogListingPage() {
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("All");

    const categories = ["All", "Guides", "Finance", "Education", "Business", "Productivity"];

    const filteredBlogs = BLOGS.filter(blog => {
        const matchesSearch = blog.title.toLowerCase().includes(search.toLowerCase()) ||
            blog.excerpt.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = category === "All" || blog.category === category;
        return matchesSearch && matchesCategory;
    });

    return (
        <>
            <Navbar />
            <main style={{ background: "#F9FAFB", minHeight: "100vh" }}>
                {/* Hero section */}
                <section style={{
                    background: DT,
                    padding: "80px 24px 64px",
                    textAlign: "center",
                    position: "relative",
                    overflow: "hidden"
                }}>
                    <div style={{
                        position: "absolute", inset: 0, opacity: 0.05, pointerEvents: "none",
                        backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
                        backgroundSize: "32px 32px",
                    }} />

                    <div style={{ maxWidth: "800px", margin: "0 auto", position: "relative", zIndex: 1 }}>

                        <h1 style={{
                            fontFamily: "Space Grotesk, sans-serif",
                            fontSize: "clamp(32px, 5vw, 56px)",
                            fontWeight: 800,
                            color: "#fff",
                            marginBottom: "16px",
                            lineHeight: 1.1
                        }}>Insights for Smart Businesses</h1>

                        <p style={{
                            fontSize: "18px",
                            color: "#99F6E4",
                            marginBottom: "40px",
                            lineHeight: 1.6,
                            fontFamily: "Inter, sans-serif",
                            maxWidth: "600px",
                            margin: "0 auto 40px"
                        }}>
                            Master your documents, automate your workflows, and grow your business with our expert guides and tools.
                        </p>

                        {/* Search Bar */}
                        <div style={{
                            maxWidth: "500px",
                            margin: "0 auto",
                            position: "relative"
                        }}>
                            <input
                                type="text"
                                placeholder="Search articles..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                style={{
                                    width: "100%",
                                    padding: "16px 16px 16px 48px",
                                    borderRadius: "14px",
                                    border: "1px solid rgba(255,255,255,0.1)",
                                    background: "rgba(255,255,255,0.05)",
                                    color: "#fff",
                                    fontSize: "16px",
                                    fontFamily: "Inter, sans-serif",
                                    outline: "none",
                                    transition: "all 0.3s ease"
                                }}
                                className="search-input"
                            />
                            <Search
                                size={20}
                                style={{
                                    position: "absolute",
                                    left: "16px",
                                    top: "51%",
                                    transform: "translateY(-50%)",
                                    color: "#5EEAD4",
                                    pointerEvents: "none",
                                    zIndex: 1
                                }}
                            />
                        </div>
                    </div>
                </section>

                {/* Filters & Grid */}
                <section style={{ maxWidth: "1240px", margin: "0 auto", padding: "48px 24px 80px" }}>
                    {/* Category Tabs */}
                    <div style={{
                        display: "flex",
                        gap: "8px",
                        marginBottom: "48px",
                        overflowX: "auto",
                        paddingBottom: "8px",
                        scrollbarWidth: "none"
                    }}>
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setCategory(cat)}
                                style={{
                                    padding: "8px 20px",
                                    borderRadius: "10px",
                                    border: "1px solid",
                                    borderColor: category === cat ? T : "#E2E8F0",
                                    background: category === cat ? T : "#fff",
                                    color: category === cat ? "#fff" : "#64748B",
                                    fontSize: "14px",
                                    fontWeight: 700,
                                    cursor: "pointer",
                                    whiteSpace: "nowrap",
                                    fontFamily: "Space Grotesk, sans-serif",
                                    transition: "all 0.2s"
                                }}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* Blog Grid */}
                    {filteredBlogs.length > 0 ? (
                        <div style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
                            gap: "32px"
                        }}>
                            {filteredBlogs.map((blog) => (
                                <BlogCard key={blog.id} blog={blog} />
                            ))}
                        </div>
                    ) : (
                        <div style={{ textAlign: "center", padding: "100px 0" }}>
                            <div style={{ fontSize: "48px", marginBottom: "16px" }}>🔍</div>
                            <h3 style={{ fontSize: "20px", fontWeight: 700, color: "#1E293B" }}>No articles found</h3>
                            <p style={{ color: "#64748B" }}>Try adjusting your search or category filter.</p>
                            <button
                                onClick={() => { setSearch(""); setCategory("All"); }}
                                style={{
                                    marginTop: "24px", color: T, fontWeight: 700, background: "none", border: "none", cursor: "pointer"
                                }}
                            >
                                Reset all filters
                            </button>
                        </div>
                    )}
                </section>

            </main>
            <Footer />

            <style jsx>{`
                .search-input:focus {
                    background: rgba(255,255,255,0.1);
                    border-color: ${T};
                    box-shadow: 0 0 0 4px rgba(13, 148, 136, 0.2);
                }
            `}</style>
        </>
    );
}
