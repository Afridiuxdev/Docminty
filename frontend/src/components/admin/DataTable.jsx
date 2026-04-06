"use client";
import { useState } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
const T = "#0D9488";
export default function DataTable({ columns, data, onRowClick }) {
  const [sortCol, setSortCol] = useState(null);
  const [sortDir, setSortDir] = useState("asc");
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const perPage = 10;
  const handleSort = (col) => {
    if (sortCol === col) { setSortDir(d => d === "asc" ? "desc" : "asc"); }
    else { setSortCol(col); setSortDir("asc"); }
  };
  const filtered = data.filter(row =>
    Object.values(row).some(v => String(v).toLowerCase().includes(search.toLowerCase()))
  );
  const sorted = [...filtered].sort((a, b) => {
    if (!sortCol) return 0;
    const va = a[sortCol], vb = b[sortCol];
    if (va < vb) return sortDir === "asc" ? -1 : 1;
    if (va > vb) return sortDir === "asc" ? 1 : -1;
    return 0;
  });
  const totalPages = Math.ceil(sorted.length / perPage);
  const paged = sorted.slice((page - 1) * perPage, page * perPage);
  return (
    <div>
      <div style={{ marginBottom: "16px" }}>
        <input
          placeholder="Search table..."
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
          style={{ height: "36px", padding: "0 12px", border: "1px solid #E5E7EB", borderRadius: "8px", fontSize: "13px", color: "#374151", fontFamily: "Inter, sans-serif", outline: "none", width: "240px" }}
        />
      </div>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#F8F9FA" }}>
              {columns.map((col, colIdx) => (
                <th
                  key={colIdx}
                  onClick={() => col.sortable !== false && handleSort(col.key)}
                  style={{ padding: "10px 14px", textAlign: col.align || "left", fontSize: "11px", fontWeight: 700, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.06em", fontFamily: "Inter, sans-serif", borderBottom: "1px solid #E5E7EB", cursor: col.sortable !== false ? "pointer" : "default", whiteSpace: "nowrap", userSelect: "none" }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "4px", justifyContent: col.align === "right" ? "flex-end" : "flex-start" }}>
                    {col.label}
                    {col.sortable !== false && sortCol === col.key && (
                      sortDir === "asc" ? <ChevronUp size={12} /> : <ChevronDown size={12} />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paged.length === 0 ? (
              <tr>
                <td colSpan={columns.length} style={{ padding: "40px", textAlign: "center", color: "#9CA3AF", fontSize: "13px", fontFamily: "Inter, sans-serif" }}>
                  No records found
                </td>
              </tr>
            ) : paged.map((row, rowIdx) => (
              <tr
                key={rowIdx}
                onClick={() => onRowClick && onRowClick(row)}
                style={{ borderBottom: "1px solid #F3F4F6", cursor: onRowClick ? "pointer" : "default", transition: "background 150ms" }}
                onMouseEnter={e => e.currentTarget.style.background = "#FAFAFA"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              >
                {columns.map((col, colIdx) => (
                  <td
                    key={colIdx}
                    style={{ padding: "12px 14px", fontSize: "13px", color: "#374151", fontFamily: "Inter, sans-serif", textAlign: col.align || "left", whiteSpace: col.wrap ? "normal" : "nowrap" }}
                  >
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "16px", paddingTop: "16px", borderTop: "1px solid #F3F4F6" }}>
          <span style={{ fontSize: "12px", color: "#9CA3AF", fontFamily: "Inter, sans-serif" }}>
            Showing {(page - 1) * perPage + 1} to {Math.min(page * perPage, sorted.length)} of {sorted.length}
          </span>
          <div style={{ display: "flex", gap: "4px" }}>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button
                key={p}
                onClick={() => setPage(p)}
                style={{ width: "30px", height: "30px", border: "1px solid " + (p === page ? T : "#E5E7EB"), borderRadius: "6px", background: p === page ? T : "#fff", color: p === page ? "#fff" : "#6B7280", fontSize: "12px", fontWeight: 600, cursor: "pointer", fontFamily: "Inter, sans-serif" }}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
