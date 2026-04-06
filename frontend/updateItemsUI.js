const fs = require('fs');
const path = require('path');

const apps = [
    'invoice', 'quotation', 'proforma-invoice', 'purchase-order', 'packing-slip'
];

const newItemRow = `function ItemRow({ item, index, onChange, onRemove, showHSN, showDiscount }) {
    const update = (field, value) => {
        const updated = { ...item, [field]: value };
        const qty = parseFloat(updated.qty) || 0;
        const rate = parseFloat(updated.rate) || 0;
        const discount = parseFloat(updated.discount) || 0;
        const subtotal = (qty * rate) - discount;
        const gst = (subtotal * (parseFloat(updated.gstRate) || 0)) / 100;
        updated.amount = (subtotal + gst).toFixed(2);
        onChange(index, updated);
    };

    return (
        <div style={{
            background: "#fff", border: "1px solid #E5E7EB", borderRadius: "8px",
            padding: "16px", marginBottom: "12px", boxShadow: "0 1px 2px rgba(0,0,0,0.02)", position: "relative"
        }}>
            <div style={{ display: "flex", gap: "12px", marginBottom: "16px", alignItems: "flex-start" }}>
                <div style={{ flex: 1 }}>
                    <label style={{ display: "block", fontSize: "11px", fontWeight: 600, color: "#6B7280", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Description</label>
                    <input className="doc-input" placeholder="Item description" value={item.description} onChange={e => update("description", e.target.value)} style={{ background: "#F9FAFB" }} />
                </div>
                <button onClick={() => onRemove(index)} title="Remove Item" style={{ background: "#FEE2E2", color: "#EF4444", border: "none", width: "36px", height: "36px", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", marginTop: "18px", transition: "background 150ms" }}>
                    <Trash2 size={16} />
                </button>
            </div>
            <div style={{
                display: "grid",
                gridTemplateColumns: showHSN ? (showDiscount ? "repeat(5, 1fr) auto" : "repeat(4, 1fr) auto") : (showDiscount ? "repeat(4, 1fr) auto" : "repeat(3, 1fr) auto"),
                gap: "12px", alignItems: "end"
            }}>
                {showHSN && (
                    <div>
                        <label style={{ display: "block", fontSize: "11px", fontWeight: 600, color: "#6B7280", marginBottom: "4px" }}>HSN</label>
                        <input className="doc-input" placeholder="HSN" value={item.hsn} onChange={e => update("hsn", e.target.value)} style={{ background: "#F9FAFB" }} />
                    </div>
                )}
                <div>
                    <label style={{ display: "block", fontSize: "11px", fontWeight: 600, color: "#6B7280", marginBottom: "4px" }}>Qty</label>
                    <input className="doc-input" type="number" placeholder="1" value={item.qty} onChange={e => update("qty", e.target.value)} style={{ background: "#F9FAFB" }} />
                </div>
                <div>
                    <label style={{ display: "block", fontSize: "11px", fontWeight: 600, color: "#6B7280", marginBottom: "4px" }}>Rate</label>
                    <input className="doc-input" type="number" placeholder="0.00" value={item.rate} onChange={e => update("rate", e.target.value)} style={{ background: "#F9FAFB" }} />
                </div>
                {showDiscount && (
                    <div>
                        <label style={{ display: "block", fontSize: "11px", fontWeight: 600, color: "#6B7280", marginBottom: "4px" }}>Disc</label>
                        <input className="doc-input" type="number" placeholder="0" value={item.discount} onChange={e => update("discount", e.target.value)} style={{ background: "#F9FAFB" }} />
                    </div>
                )}
                <div>
                    <label style={{ display: "block", fontSize: "11px", fontWeight: 600, color: "#6B7280", marginBottom: "4px" }}>GST (%)</label>
                    <select className="doc-select" value={item.gstRate} onChange={e => update("gstRate", e.target.value)} style={{ background: "#F9FAFB" }}>
                        {[0, 5, 12, 18, 28].map(r => <option key={r} value={r}>{r}%</option>)}
                    </select>
                </div>
                <div style={{ textAlign: "right", height: "36px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                    <span style={{ fontSize: "10px", fontWeight: 600, color: "#9CA3AF", textTransform: "uppercase" }}>Amount</span>
                    <span style={{ fontSize: "15px", fontWeight: 800, color: "#0D9488", fontFamily: "Inter, sans-serif" }}>₹{item.amount}</span>
                </div>
            </div>
        </div>
    );
}`;

apps.forEach(app => {
    const p = path.join('c:/Users/admin/Documents/DocMintyC/docminty/src/app', app, 'page.jsx');
    if (!fs.existsSync(p)) return;

    let code = fs.readFileSync(p, 'utf8');

    // 1. Replace ItemRow function
    const itemRowRegex = /function ItemRow\(\{ item, index, onChange, onRemove, showHSN, showDiscount \}\) \{([\s\S]*?)return \([\s\S]*?\);\n\}/m;
    
    if (code.match(itemRowRegex)) {
        code = code.replace(itemRowRegex, newItemRow);
    }

    // 2. Remove Column Headers
    const headersRegex = /\{\/\* Column headers \*\/\}\s*<div style=\{\{[\s\S]*?\}<\/div>/g;
    code = code.replace(headersRegex, '');

    fs.writeFileSync(p, code);
    console.log(app, 'updated ItemRow UI');
});
