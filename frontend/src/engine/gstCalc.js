// GST calculation engine for Indian tax system

export function calculateGST(amount, gstRate, isInterstate = false) {
    const taxableAmount = parseFloat(amount) || 0;
    const rate = parseFloat(gstRate) || 0;
    const totalGST = (taxableAmount * rate) / 100;

    if (isInterstate) {
        return {
            cgst: 0,
            sgst: 0,
            igst: totalGST,
            totalTax: totalGST,
            grandTotal: taxableAmount + totalGST,
        };
    }

    return {
        cgst: totalGST / 2,
        sgst: totalGST / 2,
        igst: 0,
        totalTax: totalGST,
        grandTotal: taxableAmount + totalGST,
    };
}

export function calculateLineItems(items, isInterstate = false) {
    let subtotal = 0;
    let totalDiscount = 0;
    let totalCGST = 0;
    let totalSGST = 0;
    let totalIGST = 0;

    const processedItems = items.map((item) => {
        const qty = parseFloat(item.qty) || 0;
        const rate = parseFloat(item.rate) || 0;
        const discount = parseFloat(item.discount) || 0;
        const gstRate = parseFloat(item.gstRate) || 0;

        const lineTotal = qty * rate;
        const lineDiscount = discount;
        const taxableAmount = lineTotal - lineDiscount;
        const gst = calculateGST(taxableAmount, gstRate, isInterstate);

        subtotal += lineTotal;
        totalDiscount += lineDiscount;

        if (isInterstate) {
            totalIGST += gst.igst;
        } else {
            totalCGST += gst.cgst;
            totalSGST += gst.sgst;
        }

        return {
            ...item,
            lineTotal: lineTotal.toFixed(2),
            taxableAmount: taxableAmount.toFixed(2),
            cgst: gst.cgst.toFixed(2),
            sgst: gst.sgst.toFixed(2),
            igst: gst.igst.toFixed(2),
            amount: gst.grandTotal.toFixed(2),
        };
    });

    const taxableSubtotal = subtotal - totalDiscount;
    const totalTax = totalCGST + totalSGST + totalIGST;
    const grandTotal = taxableSubtotal + totalTax;

    return {
        items: processedItems,
        subtotal: subtotal.toFixed(2),
        totalDiscount: totalDiscount.toFixed(2),
        taxableSubtotal: taxableSubtotal.toFixed(2),
        totalCGST: totalCGST.toFixed(2),
        totalSGST: totalSGST.toFixed(2),
        totalIGST: totalIGST.toFixed(2),
        totalTax: totalTax.toFixed(2),
        grandTotal: grandTotal.toFixed(2),
    };
}

export function numberToWords(amount) {
    const ones = ["", "One", "Two", "Three", "Four", "Five", "Six",
        "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen",
        "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
    const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty",
        "Sixty", "Seventy", "Eighty", "Ninety"];

    if (amount === 0) return "Zero";

    function convert(n) {
        if (n < 20) return ones[n];
        if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? " " + ones[n % 10] : "");
        if (n < 1000) return ones[Math.floor(n / 100)] + " Hundred" + (n % 100 ? " " + convert(n % 100) : "");
        if (n < 100000) return convert(Math.floor(n / 1000)) + " Thousand" + (n % 1000 ? " " + convert(n % 1000) : "");
        if (n < 10000000) return convert(Math.floor(n / 100000)) + " Lakh" + (n % 100000 ? " " + convert(n % 100000) : "");
        return convert(Math.floor(n / 10000000)) + " Crore" + (n % 10000000 ? " " + convert(n % 10000000) : "");
    }

    const rupees = Math.floor(amount);
    const paise = Math.round((amount - rupees) * 100);

    let result = "Rupees " + convert(rupees);
    if (paise > 0) result += " and " + convert(paise) + " Paise";
    result += " Only";
    return result;
}