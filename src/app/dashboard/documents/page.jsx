"use client";
import { useState } from "react";
import DashHeader from "@/components/dashboard/DashHeader";
import DocCard from "@/components/dashboard/DocCard";
import { Search, Filter } from "lucide-react";

const T = "#0D9488";

const ALL_DOCS = [
    { id: 1, type: "GST Invoice", name: "Invoice #INV-2026-014", amount: "Rs. 24,500", date: "24 Mar 2026" },
    { id: 2, type: "Quotation", name: "Quote for Mehta Ltd", amount: "Rs. 48,000", date: "23 Mar 2026" },
    { id: 3, type: "Salary Slip", name: "March Salary - Ravi Kumar", amount: "Rs. 42,800", date: "21 Mar 2026" },
    { id: 4, type: "Rent Receipt", name: "March Rent Receipt", amount: "Rs. 18,000", date: "19 Mar 2026" },
    { id: 5, type: "GST Invoice", name: "Invoice #INV-2026-013", amount: "Rs. 12,400", date: "18 Mar 2026" },
    { id: 6, type: "Certificate", name: "React Course Certificate", amount: "", date: "15 Mar 2026" },
    { id: 7, type: "Purchase Order", name: "PO for Sharma Suppliers", amount: "Rs. 88,000", date: "12 Mar 2026" },
    { id: 8, type: "GST Invoice", name: "Invoice #INV-2026-012", amount: "Rs. 34,200", date: "10 Mar 2026" },
    { id: 9, type: "Quotation", name: "Quote for Patel Corp", amount: "Rs. 62,000", date: "8 Mar 2026" },
    { id: 10, type: "Salary Slip", name: "Feb Salary - Priya Nair", amount: "Rs. 38,600", date: "28 Feb 2026" },
    { id: 11, type: "GST Invoice", name: "Invoice #INV-2026-011", amount: "Rs. 19,800", date: "24 Feb 2026" },
    { id: 12, type: "Rent Receipt", name: "February Rent Receipt", amount: "Rs. 18,000", date: "19 Feb 2026" },
];

const DOC_TYPES = ["All", "GST Invoice", "Quotation", "Salary Slip", "Receipt",
    "Rent Receipt", "Certificate", "Purchase Order"];

export default function DashDocumentsPage() {
    const [docs, setDocs] = useState(ALL_DOCS);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("All");
    const [sortBy, setSortBy] = useState("newest");

    const deleteDoc = (id) => setDocs(prev => prev.filter(d => d.id !== id));

    const filtered = docs.filter(d => {
        const matchType = filter === "All" || d.type === filter;
        const matchSearch = d.name.toLowerCase().includes(search.toLowerCase()) ||
            d.type.toLowerCase().includes(search.toLowerCase());
        return matchType && matchSearch;
    });

    return (
        <>
            <DashHeader
                title="My Documents"
                subtitle={`${docs.length} total documents`}
            />
            <div style={{ padding: "24px" }}>

                {/* Controls */}
                <div style={{
                    display: "flex", gap: "12px",
                    marginBottom: "20px", flexWrap: "wrap",
                    alignItems: "center",
                }}>
                    {/* Search */}
                    <div style={{
                        display: "flex", alignItems: "center",
                        gap: "8px", background: "#fff",
                        border: "1px solid #E5E7EB",
                        borderRadius: "8px", padding: "7px 12px",
                        flex: 1, minWidth: "200px",
                    }}>
                        <Search size={14} color="#9CA3AF" />
                        <input
                            placeholder="Search documents..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            style={{
                                border: "none", background: "none",
                                outline: "none", fontSize: "13px",
                                color: "#374151", width: "100%",
                                fontFamily: "Inter, sans-serif",
                            }}
                        />
                    </div>

                    {/* Sort */}
                    <select
                        value={sortBy}
                        onChange={e => setSortBy(e.target.value)}
                        style={{
                            height: "36px", padding: "0 12px",
                            border: "1px solid #E5E7EB",
                            borderRadius: "8px", background: "#fff",
                            fontSize: "13px", color: "#374151",
                            fontFamily: "Inter, sans-serif",
                            outline: "none", cursor: "pointer",
                        }}>
                        <option value="newest">Newest First</option>
                        <option value="oldest">Oldest First</option>
                        <option value="name">Name A-Z</option>
                    </select>
                </div>

                {/* Type filter tabs */}
                <div style={{
                    display: "flex", gap: "6px",
                    flexWrap: "wrap", marginBottom: "20px",
                }}>
                    {DOC_TYPES.map(type => (
                        <button key={type} onClick={() => setFilter(type)} style={{
                            padding: "5px 14px",
                            border: `1px solid ${filter === type ? T : "#E5E7EB"}`,
                            borderRadius: "20px",
                            background: filter === type ? "#F0FDFA" : "#fff",
                            color: filter === type ? T : "#6B7280",
                            fontSize: "12px", fontWeight: 600,
                            cursor: "pointer",
                            fontFamily: "Inter, sans-serif",
                            transition: "all 150ms",
                        }}>{type}</button>
                    ))}
                </div>

                {/* Results count */}
                <p style={{
                    fontSize: "12px", color: "#9CA3AF",
                    fontFamily: "Inter, sans-serif",
                    marginBottom: "14px",
                }}>
                    Showing {filtered.length} document{filtered.length !== 1 ? "s" : ""}
                    {filter !== "All" && ` · ${filter}`}
                    {search && ` · "${search}"`}
                </p>

                {/* Grid */}
                {filtered.length === 0 ? (
                    <div style={{
                        textAlign: "center", padding: "60px 24px",
                        background: "#fff", borderRadius: "12px",
                        border: "1px solid #E5E7EB",
                    }}>
                        <p style={{ fontSize: "40px", margin: "0 0 12px" }}>📭</p>
                        <p style={{
                            fontFamily: "Space Grotesk, sans-serif",
                            fontWeight: 700, fontSize: "16px",
                            color: "#111827", margin: "0 0 6px",
                        }}>No documents found</p>
                        <p style={{
                            fontSize: "13px", color: "#9CA3AF",
                            fontFamily: "Inter, sans-serif", margin: 0,
                        }}>Try changing your search or filter</p>
                    </div>
                ) : (
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
                        gap: "14px",
                    }}>
                        {filtered.map(doc => (
                            <DocCard key={doc.id} doc={doc} onDelete={deleteDoc} />
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}