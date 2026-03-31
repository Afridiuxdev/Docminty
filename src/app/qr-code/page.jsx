import React from "react";
import SEOLandingTemplate from "@/components/SEOLandingTemplate";
import { QrCode, Link, Wifi, Mail, Phone, MapPin, CreditCard, Share2 } from "lucide-react";

export const metadata = {
    title: "Free QR Code Generator & Customizable Designs | DocMinty",
    description: "Generate professional QR codes for websites, WiFi, V-Cards, and payments for free. Fast, high-resolution, and no registration required.",
};

const QRCodePage = () => {
    const tools = [
        { 
            title: "URL QR Code", 
            description: "Direct your users to any website, social profile, or digital landing page instantly.", 
            icon: <Link size={20} />, 
            href: "/qr-url",
            badge: "Popular"
        },
        { 
            title: "WiFi Access", 
            description: "Share your WiFi network name and password securely with a simple QR scan.", 
            icon: <Wifi size={20} />, 
            href: "/qr-wifi",
            badge: "Popular"
        },
        { 
            title: "Digital V-Card", 
            description: "Share your professional contact information directly to any smartphone's directory.", 
            icon: <Share2 size={20} />, 
            href: "/qr-vcard",
            badge: "Popular"
        },
        { 
            title: "Email & SMS", 
            description: "Pre-fill email or text message content for easy outreach and customer support.", 
            icon: <Mail size={20} />, 
            href: "/qr-email" 
        },
        { 
            title: "Location Marker", 
            description: "Guide customers to your store or event location using precise GPS coordinates.", 
            icon: <MapPin size={20} />, 
            href: "/qr-location" 
        },
        { 
            title: "Payment Link", 
            description: "Receive payments via UPI or Stripe through a scanable payment gateway link.", 
            icon: <CreditCard size={20} />, 
            href: "/qr-payment" 
        },
    ];

    const howItWorks = [
        {
            title: "1. Choose URL or Data",
            desc: "Pick the type of QR code you need—from a simple link to WiFi or contact details.",
            tip: { icon: "🔗", label: "Any Link:", text: "Works with websites, YouTube, or social media profiles." },
            tipSide: "right",
        },
        {
            num: "2", title: "2. Personalize & Style",
            desc: "Add custom colors and logos to match your brand. Customize the scan reliability as well.",
            tip: { icon: "🎨", label: "Logo:", text: "Adding your logo increases scan rate and brand trust." },
            tipSide: "left",
        },
        {
            num: "3", title: "3. Download & Scan",
            desc: "Export your QR code in high-resolution PNG or SVG formats, ready for any physical or digital medium.",
            tip: { icon: "🔳", label: "Tested:", text: "All QRs are pre-tested for scanability on iOS and Android." },
            tipSide: "right",
        },
    ];

    const stats = [
        { num: "1", suffix: "M+", label: "Total Scans", decimals: 0 },
        { num: "100", suffix: "K+", label: "Active QR Designs", decimals: 0 },
        { num: "250", suffix: "ms", label: "Scan Speed", decimals: 0 },
        { num: "0", suffix: "$", label: "Usage Cost", decimals: 0 },
    ];

    const faqs = [
        { 
            q: "Do these QR codes expire over time?", 
            a: "No! DocMinty generates static QR codes that last forever and have no scan limits." 
        },
        { 
            q: "Can I use these for commercial purposes?", 
            a: "Absolutely. All QR codes generated here are free for both personal and professional business use." 
        },
        { 
            q: "What format should I use for printing?", 
            a: "We recommend using the high-resolution PNG or SVG formats for clear, scanable printing on business cards or flyers." 
        },
        { 
            q: "Is it safe to share my WiFi password?", 
            a: "Yes. The QR code simply encodes the credentials for local device access and doesn't store anything on our cloud." 
        },
        { 
            q: "Can I track how many people scanned my code?", 
            a: "We currently provide static QRs. Dynamic tracking QRs are planned for our upcoming Enterprise dashboard." 
        },
        { 
            q: "Can I add my logo in the middle of the QR?", 
            a: "Yes! Our styling tools allow you to centrally place your brand logo without breaking scanability." 
        }
    ];

    return (
        <SEOLandingTemplate 
            title="Custom Free QR Code Generator & Designer"
            subtitle="Build high-resolution, scanable QR codes for your business today. No tracking, no expiration, 100% free."
            tools={tools}
            howItWorks={howItWorks}
            stats={stats}
            faqs={faqs}
            heroCta="Design QR Now"
            finalCtaTitle="Ready to design your perfect QR codes?"
            finalCtaSubtitle="Join 10,000+ users generating professional, high-resolution QR codes for free."
        />
    );
};

export default QRCodePage;
