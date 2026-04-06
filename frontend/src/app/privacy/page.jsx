"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function PrivacyPage() {
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
                    DocMinty – Privacy Policy
                </h1>
                <p style={{
                    fontSize: "13px", color: "#9CA3AF",
                    fontFamily: "Inter, sans-serif",
                    margin: "0 0 32px"
                }}>
                    Last updated: March 2026
                </p>

                {[
                    ["1. Overview",
                     "DocMinty values your privacy and is committed to protecting your data. This Privacy Policy explains how we collect, use, and safeguard your information."],
                    ["2. Data We Collect",
                     "We collect only the information necessary to provide our services, including:\n- Business details (name, address, GST info)\n- Client details entered by users\n- Document-related data\n- Account information (email, login credentials)"],
                    ["3. How We Use Your Data",
                     "Your data is used strictly for:\n- Generating documents\n- Providing platform functionality\n- Improving service performance\n\nWe do not:\n- Sell your data\n- Share your data with third parties for advertising\n- Use your data for tracking-based marketing"],
                    ["4. Data Storage",
                     "- Free-tier documents may not be stored permanently\n- Paid users may have access to saved documents\n- Stored data is protected and access-controlled"],
                    ["5. Cookies",
                     "We use minimal cookies for:\n- Session management\n- Authentication\n- Basic analytics\n\nWe do not use invasive tracking cookies."],
                    ["6. Data Security",
                     "We implement industry-standard security measures:\n- HTTPS encryption for all data transmission\n- Secure authentication systems\n- Encrypted storage for sensitive data (where applicable)"],
                    ["7. Third-Party Services",
                     "We may use trusted third-party services for:\n- Payment processing\n- Hosting infrastructure\n- Analytics\n\nThese providers are required to follow strict data protection standards."],
                    ["8. User Responsibility",
                     "Users are responsible for:\n- Accuracy of the data entered\n- Ensuring compliance with legal and tax requirements"],
                    ["9. Data Retention",
                     "We retain data only as long as necessary to:\n- Provide services\n- Comply with legal obligations\n\nUsers may request deletion of their data."],
                    ["10. Your Rights",
                     "You have the right to:\n- Access your data\n- Request correction\n- Request deletion\n\nTo exercise these rights, contact us."],
                    ["11. Changes to Policy",
                     "We may update this Privacy Policy from time to time. Continued use of the service indicates acceptance of updates."],
                    ["12. Contact",
                     "For privacy-related queries:\n📧 docmintyofficial@gmail.com"]
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