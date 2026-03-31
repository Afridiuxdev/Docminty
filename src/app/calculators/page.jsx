import React from "react";
import SEOLandingTemplate from "@/components/SEOLandingTemplate";
import { Calculate, Calculator, Percent, Coins, Landmark, IndianRupee, PieChart, Activity } from "lucide-react";

export const metadata = {
    title: "Free Online Calculators - GST, SIP, Loan & Tax | DocMinty",
    description: "Get accurate results with our suite of free online financial and business calculators. GST, SIP, EMI, and income tax calculation made simple.",
};

const CalculatorsPage = () => {
    const tools = [
        { 
            title: "GST Calculator", 
            description: "Quickly find CGST, SGST, and IGST for any amount with inclusive or exclusive GST.", 
            icon: <IndianRupee size={20} />, 
            href: "/calculators/gst-calculator",
            badge: "Popular"
        },
        { 
            title: "SIP Calculator", 
            description: "Plan your wealth and estimate future returns on your mutual fund investments.", 
            icon: <PieChart size={20} />, 
            href: "/calculators/sip-calculator",
            badge: "Popular"
        },
        { 
            title: "EMI Calculator", 
            description: "Accurately calculate monthly loan repayments for home, car, or personal loans.", 
            icon: <Landmark size={20} />, 
            href: "/calculators/emi-calculator",
            badge: "Popular"
        },
        { 
            title: "Income Tax", 
            description: "Quickly estimate your annual tax liability under old and new tax regimes in India.", 
            icon: <Activity size={20} />, 
            href: "/calculators/income-tax-calculator" 
        },
        { 
            title: "Age Calculator", 
            description: "Determine exact age in years, months, and days with just a few simple clicks.", 
            icon: <Calculator size={20} />, 
            href: "/calculators/age-calculator" 
        },
        { 
            title: "Unit Converter", 
            description: "Universal converter for distance, weights, and file storage for all your daily needs.", 
            icon: <Coins size={20} />, 
            href: "/calculators/unit-converter" 
        },
    ];

    const howItWorks = [
        {
            title: "1. Select Calculator",
            desc: "Choose from our suite of financial tools like GST, SIP, or Loan EMI calculators.",
            tip: { icon: "📈", label: "Financial Data:", text: "Supports up-to-date tax rates and investment rules." },
            tipSide: "right",
        },
        {
            num: "2", title: "2. Input Values",
            desc: "Enter your principal amount, interest rate, or tenure to get instant results.",
            tip: { icon: "🔢", label: "Real-time:", text: "Calculations update instantly as you change any field." },
            tipSide: "left",
        },
        {
            num: "3", title: "3. Get Insights",
            desc: "View detailed breakdowns, payment schedules, and charts to understand your data better.",
            tip: { icon: "📉", label: "Visual:", text: "Includes visual aids for better financial planning." },
            tipSide: "right",
        },
    ];

    const stats = [
        { num: "2", suffix: "M+", label: "Calculations Done", decimals: 0 },
        { num: "0.1", suffix: "s", label: "Result Latency", decimals: 1 },
        { num: "100", suffix: "%", label: "Data Accuracy", decimals: 0 },
        { num: "15", suffix: "+", label: "Total Calculators", decimals: 0 },
    ];

    const faqs = [
        { 
            q: "Are these calculators accurate for 2024-25?", 
            a: "Yes! Our tax and GST calculators are updated to include the latest financial year changes and rules." 
        },
        { 
            q: "Can I save my calculation results?", 
            a: "We currently provide a 'Copy Results' button. PDF export for loan schedules is coming soon." 
        },
        { 
            q: "What is a SIP calculator useful for?", 
            a: "It helps you estimate the wealth you can build by investing fixed monthly amounts over a specific period." 
        },
        { 
            q: "How does the GST calculator work?", 
            a: "You can choose to add GST to a base amount or find the base amount from a total inclusive of GST." 
        },
        { 
            q: "Is any of my financial data recorded?", 
            a: "No. All calculations are performed in your browser. We do not store any of your inputs on our servers." 
        },
        { 
            q: "Can I use these calculators on my phone?", 
            a: "Absolutely. All DocMinty calculators are optimized for a smooth mobile experience on any device." 
        }
    ];

    return (
        <SEOLandingTemplate 
            title="Free Online Calculators - Fast & Accurate Results"
            subtitle="Plan your finances and business with our comprehensive suite of easy-to-use digital calculators. 100% free."
            tools={tools}
            howItWorks={howItWorks}
            stats={stats}
            faqs={faqs}
            heroCta="Open Calculator Now"
            finalCtaTitle="Ready for precise financial insights?"
            finalCtaSubtitle="Join 10,000+ users relying on DocMinty for accurate and instant calculations."
        />
    );
};

export default CalculatorsPage;