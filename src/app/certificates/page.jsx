import React from "react";
import SEOLandingTemplate from "@/components/SEOLandingTemplate";
import { Award, GraduationCap, Medal, Star, Shield, Trophy, CheckCircle, Verified } from "lucide-react";

export const metadata = {
    title: "Free Certificate Generator & Achievement Award Creator | DocMinty",
    description: "Create professional certificates for students, employees, and events for free. Choose from award, completion, and appreciation designs. No signup.",
};

const CertificatesPage = () => {
    const tools = [
        { 
            title: "Achievement Certificate", 
            description: "Recognize student or employee accomplishments with high-fidelity award designs.", 
            icon: <Award size={20} />, 
            href: "/achievement-certificate",
            badge: "Popular"
        },
        { 
            title: "Course Completion", 
            description: "Generate professional certificates for and educational or training course.", 
            icon: <GraduationCap size={20} />, 
            href: "/course-completion",
            badge: "Popular"
        },
        { 
            title: "Appreciation Award", 
            description: "Say thank you to your colleagues or volunteers with a heartfelt certificate.", 
            icon: <Star size={20} />, 
            href: "/appreciation-certificate",
            badge: "Popular"
        },
        { 
            title: "Training Participation", 
            description: "Official documents to verify workshop or seminar attendance for your team.", 
            icon: <Medal size={20} />, 
            href: "/training-certificate" 
        },
        { 
            title: "Professional Excellence", 
            description: "Reward top-tier performance with elite-grade professional layouts and fonts.", 
            icon: <Trophy size={20} />, 
            href: "/professional-excellence" 
        },
        { 
            title: "Verified Certificate", 
            description: "Add custom QR codes or unique IDs to your certificates for easy verification.", 
            icon: <Verified size={20} />, 
            href: "/verified-certificate" 
        },
    ];

    const howItWorks = [
        {
            title: "1. Pick Certificate Design",
            desc: "Choose from our library of professional certificate layouts tailored for every occasion.",
            tip: { icon: "🎨", label: "Pro Layouts:", text: "All designs are crafted for high-resolution printing." },
            tipSide: "right",
        },
        {
            num: "2", title: "2. Personalize Content",
            desc: "Add recipient names, descriptions, dates, and your organization's logo or signature.",
            tip: { icon: "🖋️", label: "Signature:", text: "Upload your digital signature for a truly authentic look." },
            tipSide: "left",
        },
        {
            num: "3", title: "3. Export High-Res PDF",
            desc: "Instantly download a 300 DPI high-resolution PDF certificate ready for professional printing.",
            tip: { icon: "🖨️", label: "Print Ready:", text: "Optimized for standard A4 and Letter paper sizes." },
            tipSide: "right",
        },
    ];

    const stats = [
        { num: "50", suffix: "K+", label: "Certificates Awarded", decimals: 0 },
        { num: "10", suffix: "K+", label: "Institutions & NGOs", decimals: 0 },
        { num: "300", suffix: "DPI", label: "Print Quality", decimals: 0 },
        { num: "14", suffix: "+", label: "Unique Styles", decimals: 0 },
    ];

    const faqs = [
        { 
            q: "Can I generate certificates for my entire class at once?", 
            a: "We currently allow individual generation. A bulk generation feature via CSV upload is coming soon." 
        },
        { 
            q: "Are these certificates free of watermarks?", 
            a: "Yes! All certificates generated on DocMinty are 100% free and have no company watermarks." 
        },
        { 
            q: "Do I need to sign up to create an award?", 
            a: "No signup required. You can choose a template, fill in the details, and download your PDF instantly." 
        },
        { 
            q: "Can I use my own organization's logo?", 
            a: "Absolutely. All our certificate templates allow you to upload your logo and even a digital signature." 
        },
        { 
            q: "Is recipient data secure?", 
            a: "We prioritize privacy. All certificate data is processed locally in your browser and is never stored on our servers." 
        },
        { 
            q: "What is the scan quality for printing?", 
            a: "Our certificates are downloaded as high-resolution PDFs, perfect for professional 300 DPI printing." 
        }
    ];

    return (
        <SEOLandingTemplate 
            title="Professional Free Certificate & Award Generator"
            subtitle="Create and download stunning certificates for your students, employees, or events. No signup and 100% free."
            tools={tools}
            howItWorks={howItWorks}
            stats={stats}
            faqs={faqs}
            heroCta="Create Certificate Now"
            finalCtaTitle="Ready to recognize achievement in seconds?"
            finalCtaSubtitle="Join 10,000+ institutions and NGOs creating stunning, professional certificates."
        />
    );
};

export default CertificatesPage;
