"use client";
import { Plus, Trash2 } from "lucide-react";

export default function LineItemsTable({
    items,
    onChange,
    showHSN = false,
    showGST = false,
}) {
    const update = (index, field, value) => {
        const updated = items.map((item, i) => {
            if (i !== index) return item;
            const newItem = { ...item, [field]: value };
            const qty = parseFloat(newItem.qty) || 0;
            const rate = parseFloat(newItem.rate) || 0;
            const discount = parseFloat(newItem.discount) || 0;
            const subtotal = qty * rate - discount;
            const gstRate = parseFloat(newItem.gstRate) || 0;
            const gstAmount = (subtotal * gstRate) / 100;
            newItem.amount = (subtotal + gstAmount).toFixed(2);
            return newItem;
        });
        onChange(updated);
    };

    const addItem = () => {
        onChange([
            ...items,
            {
                description: "", qty: 1, rate: "",
                discount: 0, hsn: "", gstRate: 18, amount: "0.00",
            },
        ]);
    };

    const removeItem = (index) => {
        onChange(items.filter((_, i) => i !== index));
    };

    const cols = ["Description", showHSN && "HSN/SAC", "Qty",
        "Rate (₹)", "Discount", showGST && "GST%", "Amount", ""]
        .filter(Boolean);

    return (
        <div style={{ overflowX: "auto" }}>
            {/* Header */}
            <div style={{
                display: "grid",
                gridTemplateColumns: showHSN
                    ? "2fr 0.6fr 0.5fr 0.7fr 0.6fr 0.5fr 0.7fr 0.3fr"
                    : "2fr 0.5fr 0.7fr 0.6fr 0.7fr 0.3fr",
                gap: "8px",
                padding: "8px 0",
                borderBottom: "1px solid #E5E7EB",
                marginBottom: "8px",
                minWidth: "500px",
            }}>
                {cols.map((h, i) => (
                    <span key={i} style={{
                        fontSize: "11px", fontWeight: 600,
                        color: "#9CA3AF", textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        fontFamily: "Inter, sans-serif",
                    }}>
                        {h}
                    </span>
                ))}
            </div>

            {/* Rows */}
            {items.map((item, i) => (
                <div key={i} style={{
                    display: "grid",
                    gridTemplateColumns: showHSN
                        ? "2fr 0.6fr 0.5fr 0.7fr 0.6fr 0.5fr 0.7fr 0.3fr"
                        : "2fr 0.5fr 0.7fr 0.6fr 0.7fr 0.3fr",
                    gap: "8px",
                    marginBottom: "8px",
                    alignItems: "center",
                    minWidth: "500px",
                }}>
                    <input
                        className="input-base"
                        placeholder="Item description"
                        value={item.description}
                        onChange={(e) => update(i, "description", e.target.value)}
                    />
                    {showHSN && (
                        <input
                            className="input-base"
                            placeholder="HSN"
                            value={item.hsn}
                            onChange={(e) => update(i, "hsn", e.target.value)}
                        />
                    )}
                    <input
                        className="input-base"
                        type="number" placeholder="1"
                        value={item.qty}
                        onChange={(e) => update(i, "qty", e.target.value)}
                    />
                    <input
                        className="input-base"
                        type="number" placeholder="0.00"
                        value={item.rate}
                        onChange={(e) => update(i, "rate", e.target.value)}
                    />
                    <input
                        className="input-base"
                        type="number" placeholder="0"
                        value={item.discount}
                        onChange={(e) => update(i, "discount", e.target.value)}
                    />
                    {showGST && (
                        <select
                            className="input-base"
                            value={item.gstRate}
                            onChange={(e) => update(i, "gstRate", e.target.value)}
                        >
                            {[0, 5, 12, 18, 28].map((r) => (
                                <option key={r} value={r}>{r}%</option>
                            ))}
                        </select>
                    )}
                    <span style={{
                        fontSize: "14px", fontWeight: 600, color: "#111827",
                        fontFamily: "Inter, sans-serif",
                    }}>
                        ₹{item.amount}
                    </span>
                    <button
                        onClick={() => removeItem(i)}
                        style={{
                            background: "none", border: "none",
                            cursor: "pointer", color: "#9CA3AF", padding: "4px",
                        }}
                    >
                        <Trash2 size={14} />
                    </button>
                </div>
            ))}

            {/* Add item button */}
            <button
                onClick={addItem}
                style={{
                    display: "flex", alignItems: "center", gap: "6px",
                    background: "none", border: "none",
                    fontSize: "13px", fontWeight: 600,
                    color: "#4F46E5", cursor: "pointer",
                    padding: "8px 0",
                    fontFamily: "Inter, sans-serif",
                }}
            >
                <Plus size={14} /> Add Line Item
            </button>
        </div>
    );
}