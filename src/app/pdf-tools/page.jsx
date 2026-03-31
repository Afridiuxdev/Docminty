import React from "react";
import SEOLandingTemplate from "@/components/SEOLandingTemplate";
import { FileText, FileSearch, Trash2, Combine, Scissors, FileUp, FileDown, Lock } from "lucide-react";

export const metadata = {
    title: "Free Online PDF Tools - Merge, Split, Compress & Edit | DocMinty",
    description: "Access powerful online PDF tools for free. Merge multiple PDFs, split documents, compress file size, and protect with passwords. 100% private.",
};

const PDFToolsPage = () => {
    const tools = [
        { 
            title: "Merge PDF", 
            description: "Combine multiple PDF files into one single organized document instantly.", 
            icon: <Combine size={20} />, 
            href: "/tools/merge-pdf",
            badge: "Popular"
        },
        { 
            title: "Split PDF", 
            description: "Extract specific pages from a PDF or split a large file into smaller parts.", 
            icon: <Scissors size={20} />, 
            href: "/tools/split-pdf",
            badge: "Popular"
        },
        { 
            title: "Compress PDF", 
            description: "Reduce the file size of your PDF while maintaining the best possible quality.", 
            icon: <FileDown size={20} />, 
            href: "/tools/compress-pdf",
            badge: "Popular"
        },
        { 
            title: "Protect PDF", 
            description: "Secure your sensitive documents with a custom password for privacy.", 
            icon: <Lock size={20} />, 
            href: "/tools/protect-pdf" 
        },
        { 
            title: "PDF to Image", 
            description: "Convert each PDF page into high-quality JPEG or PNG image files.", 
            icon: <FileUp size={20} />, 
            href: "/tools/pdf-to-image" 
        },
        { 
            title: "Unlock PDF", 
            description: "Remove passwords and restrictions from your PDF files for editing and sharing.", 
            icon: <FileSearch size={20} />, 
            href: "/tools/unlock-pdf" 
        },
    ];

    const howItWorks = [
        {
            title: "1. Upload PDF Files",
            desc: "Select or drag and drop your PDF documents into our secure browser-based engine.",
            tip: { icon: "📤", label: "Any Size:", text: "Supports uploading multiple files at once easily." },
            tipSide: "right",
        },
        {
            num: "2", title: "2. Process & Arrange",
            desc: "Drag to reorder pages, select specific splits, or set your desired compression level.",
            tip: { icon: "⚙️", label: "Control:", text: "You have full control over the output quality and page order." },
            tipSide: "left",
        },
        {
            num: "3", title: "3. Download Result",
            desc: "Our engine processes your request in seconds. Download your optimized PDF immediately.",
            tip: { icon: "⬇️", label: "Fast:", text: "Processing happens on your local machine for privacy." },
            tipSide: "right",
        },
    ];

    const stats = [
        { num: "5", suffix: "M+", label: "Files Processed", decimals: 0 },
        { num: "50", suffix: "%", label: "Average Size Reduced", decimals: 0 },
        { num: "0.1", suffix: "s", label: "Engine Speed", decimals: 1 },
        { num: "100", suffix: "%", label: "Data Privacy", decimals: 0 },
    ];

    const faqs = [
        { 
            q: "Is it safe to upload my private PDFs?", 
            a: "DocMinty uses browser-side processing. Your files are processed locally and are never stored on our servers." 
        },
        { 
            q: "How many files can I merge at once?", 
            a: "You can merge up to 50 PDF files simultaneously with our high-speed merging tool." 
        },
        { 
            q: "What is the file size limit?", 
            a: "Currently, we support files up to 200MB, although browser performance can vary by device." 
        },
        { 
            q: "Do I lose quality during compression?", 
            a: "Our compression engine is designed to balance visual quality with file size reduction for the best result." 
        },
        { 
            q: "Can I unlock a PDF without its password?", 
            a: "No. For security reasons, you must provide the correct password to unlock and manage protected files." 
        },
        { 
            q: "Are these tools free for everyone?", 
            a: "Yes. All our PDF tools are available for free to any user with a modern web browser." 
        }
    ];

    return (
        <SEOLandingTemplate 
            title="Professional Online PDF Tools - All-in-One for Free"
            subtitle="Securely edit, merge, split, and compress your PDF documents. Fast, efficient, and 100% private."
            tools={tools}
            howItWorks={howItWorks}
            stats={stats}
            faqs={faqs}
            heroCta="Open PDF Tool Now"
            finalCtaTitle="Ready to master your PDF documents?"
            finalCtaSubtitle="Join 10,000+ professionals processing PDFs with world-class speed and security."
        />
    );
};

export default PDFToolsPage;
