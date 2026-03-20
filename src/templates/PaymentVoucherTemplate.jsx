"use client";
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";

const T = "#0D9488";

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 10,
    color: "#111827",
    padding: 40,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    borderBottomWidth: 2,
    borderBottomColor: T,
    paddingBottom: 14,
    marginBottom: 16,
  },
  logo: {
    width: 55,
    height: 38,
    objectFit: "contain",
    marginBottom: 5,
  },
  fromName: {
    fontSize: 13,
    fontFamily: "Helvetica-Bold",
    color: "#111827",
  },
  small: {
    fontSize: 9,
    color: "#6B7280",
    marginTop: 2,
  },
  title: {
    fontSize: 18,
    fontFamily: "Helvetica-Bold",
    color: T,
    textAlign: "right",
  },
  num: {
    fontSize: 10,
    color: "#6B7280",
    textAlign: "right",
    marginTop: 3,
  },
  meta: {
    fontSize: 9,
    color: "#9CA3AF",
    textAlign: "right",
    marginTop: 2,
  },
  amtRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F0FDFA",
    borderWidth: 2,
    borderColor: T,
    borderRadius: 8,
    padding: "12 16",
    marginBottom: 14,
  },
  amtLabel: {
    fontSize: 9,
    color: "#6B7280",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 3,
  },
  amtValue: {
    fontSize: 24,
    fontFamily: "Helvetica-Bold",
    color: T,
  },
  modeBadge: {
    backgroundColor: T,
    padding: "4 12",
    borderRadius: 12,
  },
  modeText: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: "#ffffff",
  },
  wordsText: {
    fontSize: 9,
    color: "#374151",
    fontStyle: "italic",
    marginBottom: 14,
  },
  tableRow: {
    flexDirection: "row",
    padding: "6 0",
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  tLabel: {
    flex: 1,
    fontSize: 9,
    color: "#6B7280",
  },
  tValue: {
    flex: 2,
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: "#111827",
  },
  sigGrid: {
    flexDirection: "row",
    gap: 20,
    marginTop: 32,
  },
  sigBox: {
    flex: 1,
    borderTopWidth: 1,
    borderTopColor: "#374151",
    paddingTop: 5,
    alignItems: "center",
  },
  sigName: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: "#111827",
    textAlign: "center",
  },
  sigRole: {
    fontSize: 8,
    color: "#9CA3AF",
    marginTop: 2,
    textAlign: "center",
  },
  footer: {
    marginTop: 20,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  footerGen: {
    fontSize: 8,
    color: "#D1D5DB",
  },
});

function numToWords(n) {
  if (!n || n === 0) return "Zero Rupees Only";
  const ones = [
    "", "One", "Two", "Three", "Four", "Five", "Six", "Seven",
    "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen",
    "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen",
  ];
  const tens = [
    "", "", "Twenty", "Thirty", "Forty", "Fifty",
    "Sixty", "Seventy", "Eighty", "Ninety",
  ];
  function convert(num) {
    if (num < 20) return ones[num];
    if (num < 100)
      return tens[Math.floor(num / 10)] +
        (num % 10 ? " " + ones[num % 10] : "");
    if (num < 1000)
      return ones[Math.floor(num / 100)] + " Hundred" +
        (num % 100 ? " " + convert(num % 100) : "");
    if (num < 100000)
      return convert(Math.floor(num / 1000)) + " Thousand" +
        (num % 1000 ? " " + convert(num % 1000) : "");
    return convert(Math.floor(num / 100000)) + " Lakh" +
      (num % 100000 ? " " + convert(num % 100000) : "");
  }
  return "Rupees " + convert(Math.floor(n)) + " Only";
}

export default function PaymentVoucherTemplate({ form }) {
  const amount = parseFloat(form.amount) || 0;

  const amountFormatted = amount.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
  });

  const chequeDetails =
    form.chequeNumber
      ? form.chequeNumber + (form.bankName ? " - " + form.bankName : "")
      : null;

  return (
    <Document>
      <Page size="A4" style={styles.page}>

        {/* Header */}
        <View style={styles.header}>
          <View>
            {form.logo && (
              <Image src={form.logo} style={styles.logo} />
            )}
            <Text style={styles.fromName}>
              {form.companyName || "Company Name"}
            </Text>
            {form.companyAddress && (
              <Text style={styles.small}>{form.companyAddress}</Text>
            )}
          </View>
          <View>
            <Text style={styles.title}>PAYMENT VOUCHER</Text>
            <Text style={styles.num}>{"#" + form.voucherNumber}</Text>
            <Text style={styles.meta}>{"Date: " + form.voucherDate}</Text>
          </View>
        </View>

        {/* Amount row */}
        <View style={styles.amtRow}>
          <View>
            <Text style={styles.amtLabel}>Amount Paid</Text>
            <Text style={styles.amtValue}>{"Rs. " + amountFormatted}</Text>
          </View>
          <View style={styles.modeBadge}>
            <Text style={styles.modeText}>{form.paymentMode}</Text>
          </View>
        </View>

        {/* Amount in words */}
        <Text style={styles.wordsText}>
          {"In words: " + numToWords(amount)}
        </Text>

        {/* Details table */}
        <View>
          <View style={styles.tableRow}>
            <Text style={styles.tLabel}>Paid To</Text>
            <Text style={styles.tValue}>{form.paidTo || "—"}</Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={styles.tLabel}>Purpose</Text>
            <Text style={styles.tValue}>{form.purpose || "—"}</Text>
          </View>

          {form.accountHead ? (
            <View style={styles.tableRow}>
              <Text style={styles.tLabel}>Account Head</Text>
              <Text style={styles.tValue}>{form.accountHead}</Text>
            </View>
          ) : null}

          <View style={styles.tableRow}>
            <Text style={styles.tLabel}>Payment Mode</Text>
            <Text style={styles.tValue}>{form.paymentMode || "—"}</Text>
          </View>

          {form.paymentMode === "Cheque" && chequeDetails ? (
            <View style={styles.tableRow}>
              <Text style={styles.tLabel}>Cheque Details</Text>
              <Text style={styles.tValue}>{chequeDetails}</Text>
            </View>
          ) : null}

          {form.narration ? (
            <View style={styles.tableRow}>
              <Text style={styles.tLabel}>Narration</Text>
              <Text style={styles.tValue}>{form.narration}</Text>
            </View>
          ) : null}
        </View>

        {/* Signatures */}
        <View style={styles.sigGrid}>
          <View style={styles.sigBox}>
            {form.preparedBy ? (
              <Text style={styles.sigName}>{form.preparedBy}</Text>
            ) : null}
            <Text style={styles.sigRole}>Prepared By</Text>
          </View>
          <View style={styles.sigBox}>
            {form.approvedBy ? (
              <Text style={styles.sigName}>{form.approvedBy}</Text>
            ) : null}
            <Text style={styles.sigRole}>Approved By</Text>
          </View>
          <View style={styles.sigBox}>
            <Text style={styles.sigRole}>Received By</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerGen}>Generated by DocMinty.com</Text>
        </View>

      </Page>
    </Document>
  );
}