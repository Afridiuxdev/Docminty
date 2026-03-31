import React from "react";
import SEOLandingTemplate from "@/components/SEOLandingTemplate";
import { FileText, UserPlus, Briefcase, FileCheck, FileCode, Users, CreditCard, Building } from "lucide-react";

export const metadata = {
    title: "Free HR Document Generator & Salary Slip Creator | DocMinty",
    description: "Generate professional salary slips, offer letters, experience letters, and resignation letters for free. Secure HR documents for startups.",
};

const HRDocumentsPage = () => {
    const tools = [
        { 
            title: "Salary Slip", 
            description: "Generate professional pay slips with breakdown of basic, HRA, and deductions.", 
            icon: <FileText size={20} />, 
            href: "/salary-slip",
            badge: "Popular"
        },
        { 
            title: "Job Offer Letter", 
            description: "Formal offer letters with roles, compensation, and onboarding details.", 
            icon: <UserPlus size={20} />, 
            href: "/job-offer-letter",
            badge: "Popular"
        },
        { 
            title: "Experience Letter", 
            description: "Official documents to verify employment history and performance.", 
            icon: <Briefcase size={20} />, 
            href: "/experience-letter",
            badge: "Popular"
        },
        { 
            title: "Internship Certificate", 
            description: "Acknowledge successful internship completions with official certificates.", 
            icon: <FileCheck size={20} />, 
            href: "/internship-certificate" 
        },
        { 
            title: "Resignation Letter", 
            description: "Standard resignation formats for professional and polite exit processes.", 
            icon: <FileCode size={20} />, 
            href: "/resignation-letter" 
        },
        { 
            title: "Appointment Letter", 
            description: "Confirm employee positions within your organization formally.", 
            icon: <Users size={20} />, 
            href: "/appointment-letter" 
        },
        { 
            title: "Relieving Letter", 
            description: "Necessary documentation for employees transitioning out of a company.", 
            icon: <Building size={20} />, 
            href: "/relieving-letter" 
        },
    ];

    const howItWorks = [
        {
            title: "1. Choose HR Template",
            desc: "Select from our library of HR documents like Salary Slips, Offer Letters, or Experience Letters.",
            tip: { icon: "📋", label: "Pro Format:", text: "All documents follow standard HR and legal guidelines." },
            tipSide: "right",
        },
        {
            num: "2", title: "2. Input Employee Data",
            desc: "Enter employee names, salaries, joining dates, and specific company policies. Everything is easy to fill.",
            tip: { icon: "🔐", label: "Private:", text: "Employee sensitive data is never stored on our servers." },
            tipSide: "left",
        },
        {
            num: "3", title: "3. Export HR Ready PDF",
            desc: "Download professional PDF documents ready to be signed and shared via email or WhatsApp.",
            tip: { icon: "✅", label: "Verified:", text: "Ensure your startup looks professional from day one." },
            tipSide: "right",
        },
    ];

    const stats = [
        { num: "15", suffix: "K+", label: "Salary Slips Generated", decimals: 0 },
        { num: "8", suffix: "K+", label: "Offer Letters Created", decimals: 0 },
        { num: "100", suffix: "%", label: "HR Ready Format", decimals: 0 },
        { num: "0.2", suffix: "s", label: "Generation Time", decimals: 1 },
    ];

    const faqs = [
        { 
            q: "Can I generate salary slips in bulk?", 
            a: "Our current tool allows you to create individual slips. We are actively working on a bulk upload feature for larger teams." 
        },
        { 
            q: "Are these HR documents legally valid?", 
            a: "Yes, our templates are based on standard professional practices. However, for complex legal matters, we recommend consulting an HR expert." 
        },
        { 
            q: "Do I need to sign up to create an offer letter?", 
            a: "No signup required. You can generate professional offer letters for your new hires instantly." 
        },
        { 
            q: "Can I customize the salary breakdown?", 
            a: "Yes! Our salary slip generator allows you to add custom earnings and deductions to match your company's pay structure." 
        },
        { 
            q: "Is employee data secure?", 
            a: "DocMinty processes all data in your browser. We do not save any employee's personal or financial information." 
        },
        { 
            q: "Can I add my company seal or signature?", 
            a: "Currently, you can add your company logo. We are working on a feature to upload digital signatures directly." 
        }
    ];

    return (
        <SEOLandingTemplate 
            title="Professional HR Document & Salary Slip Generator"
            subtitle="Securely create salary slips, offer letters, and experience letters for your startup or enterprise. Simple, fast, and free."
            tools={tools}
            howItWorks={howItWorks}
            stats={stats}
            faqs={faqs}
            heroCta="Generate HR Doc Now"
            finalCtaTitle="Ready to streamline your HR paperwork?"
            finalCtaSubtitle="Join 10,000+ HR professionals automating salary slips and onboarding documents."
        />
    );
};

export default HRDocumentsPage;
