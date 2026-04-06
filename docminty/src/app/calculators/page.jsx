import React from "react";
import SEOLandingTemplate from "@/components/SEOLandingTemplate";
import { 
    Calculator, 
    Percent, 
    BadgeIndianRupee, 
    TrendingUp, 
    Coins, 
    BarChart3, 
    Tag,
    Landmark
} from "lucide-react";

export const metadata = {
    title: "Free Online Calculators - GST, Salary, Loan & Profit | DocMinty",
    description: "Get accurate results with our suite of free online financial and business calculators. GST, Salary, EMI, and Profit Margin calculation made simple.",
};

const CalculatorsPage = () => {
    const tools = [
        { 
            title: "EMI Calculator", 
            description: "Accurately calculate monthly loan repayments for home, car, or personal loans.", 
            icon: <Landmark size={20} />, 
            href: "/calculators/emi-calculator"
        },
        { 
            title: "GST Calculator", 
            description: "Quickly find CGST, SGST, and IGST for any amount with inclusive or exclusive GST.", 
            icon: <Percent size={20} />, 
            href: "/calculators/gst-calculator"
        },
        { 
            title: "Salary Calculator", 
            description: "Calculate your take-home salary after PF, PT, and tax deductions in India.", 
            icon: <BadgeIndianRupee size={20} />, 
            href: "/calculators/salary-calculator",
            badge: "Popular"
        },
        { 
            title: "Interest Calculator", 
            description: "Determine simple or compound interest earned on your savings or investments.", 
            icon: <TrendingUp size={20} />, 
            href: "/calculators/interest-calculator" 
        },
        { 
            title: "Loan Calculator", 
            description: "Calculate total interest and repayment schedule for any type of bank loan.", 
            icon: <Coins size={20} />, 
            href: "/calculators/loan-calculator" 
        },
        { 
            title: "Profit Margin", 
            description: "Find the selling price or profit percentage for your products and services.", 
            icon: <BarChart3 size={20} />, 
            href: "/calculators/profit-margin-calculator" 
        },
        { 
            title: "Discount Calculator", 
            description: "Quickly calculate the final price after applying percentage or flat discounts.", 
            icon: <Tag size={20} />, 
            href: "/calculators/discount-calculator" 
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