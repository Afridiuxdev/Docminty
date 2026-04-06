"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function TermsPage() {
    return (
        <>
            <Navbar />
            <main style={{
                maxWidth: "720px", margin: "0 auto",
                padding: "64px 24px"
            }}>
                <h1 style={{
                    fontFamily: "Space Grotesk, sans-serif",
                    fontSize: "32px", fontWeight: 700,
                    color: "#111827", margin: "0 0 8px"
                }}>
                    DocMinty – Terms of Service
                </h1>
                <p style={{
                    fontSize: "13px", color: "#9CA3AF",
                    fontFamily: "Inter, sans-serif",
                    margin: "0 0 32px"
                }}>
                    Last updated: March 2026
                </p>

                {[
                    ["1. Acceptance of Terms",
                     "By accessing or using DocMinty, you agree to be bound by these Terms of Service. If you do not agree, please do not use the platform."],
                    ["2. Description of Service",
                     "DocMinty is a web-based SaaS platform that provides tools to generate business documents including invoices, quotations, certificates, receipts, salary slips, and PDF utilities. The service is intended primarily for businesses and individuals operating in India."],
                    ["3. Use of Service",
                     "You agree to use DocMinty only for lawful purposes and in compliance with applicable laws.\n\nYou must not:\n- Use the platform for fraudulent, illegal, or misleading activities\n- Generate false or misleading documents\n- Attempt to disrupt or exploit the platform"],
                    ["4. User Accounts",
                     "- You are responsible for maintaining the confidentiality of your account\n- You are responsible for all activity under your account\n- DocMinty is not liable for unauthorized access due to user negligence"],
                    ["5. Free Plan",
                     "- The free plan allows limited usage of document generation and tools\n- Documents generated under the free plan may include a watermark or branding\n- Free-tier usage limits may change at any time"],
                    ["6. Paid Plans (Pro / Business)",
                     "- Paid plans provide access to premium features such as branding removal, higher limits, and advanced tools\n- Subscriptions are billed on a recurring monthly or yearly basis\n- You may cancel your subscription at any time"],
                    ["7. No Refund Policy",
                     "All payments made to DocMinty are non-refundable.\n\nWe do not provide refunds for:\n- Subscription charges\n- Partial usage\n- Accidental purchases\n- Unused time\n\nUsers are encouraged to use the free plan before upgrading."],
                    ["8. Intellectual Property",
                     "All documents created using DocMinty belong to the user. DocMinty retains full ownership of the Platform, Software, Templates, and Design systems. You may not copy, resell, or reproduce the platform or its components."],
                    ["9. Data & Storage",
                     "- Free users’ documents may not be permanently stored\n- Paid users may have access to document storage features\n- DocMinty reserves the right to manage storage limits and retention policies"],
                    ["10. Limitation of Liability",
                     "DocMinty provides tools for document generation only.\n\nWe are not responsible for:\n- Tax compliance\n- Legal validity of documents\n- Financial or business decisions made using generated documents\n\nUsers must verify documents with qualified professionals where required."],
                    ["11. Service Availability",
                     "We aim to provide uninterrupted service but do not guarantee continuous availability or error-free operation. DocMinty may update, modify, or discontinue features at any time."],
                    ["12. Termination",
                     "We reserve the right to suspend or terminate accounts that:\n- Violate these terms\n- Abuse the platform\n- Engage in fraudulent activity"],
                    ["13. Changes to Terms",
                     "We may update these Terms at any time. Continued use of the platform implies acceptance of updated terms."],
                    ["14. Contact",
                     "For any questions regarding these Terms, contact:\n📧 docmintyofficial@gmail.com"]
                ].map(([title, body], i) => (
                    <div key={i} style={{ marginBottom: "28px" }}>
                        <h2 style={{
                            fontFamily: "Space Grotesk, sans-serif",
                            fontSize: "18px", fontWeight: 700,
                            color: "#111827", margin: "0 0 8px"
                        }}>{title}</h2>
                        {body.split('\n').map((paragraph, j) => (
                            <p key={j} style={{
                                fontSize: "15px", color: "#374151",
                                fontFamily: "Inter, sans-serif",
                                lineHeight: 1.8, margin: paragraph.startsWith('-') ? "4px 0 4px 16px" : "0 0 12px"
                            }}>
                                {paragraph}
                            </p>
                        ))}
                    </div>
                ))}
            </main>
            <Footer />
        </>
    );
}