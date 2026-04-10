import { BLOGS } from "@/data/blogs";

export default function sitemap() {
  const baseUrl = "https://docminty.com";

  // Static routes
  const staticRoutes = [
    "",
    "/invoice",
    "/quotation",
    "/receipt",
    "/proforma-invoice",
    "/rent-receipt",
    "/payment-voucher",
    "/salary-slip",
    "/certificate",
    "/internship-certificate",
    "/experience-letter",
    "/resignation-letter",
    "/job-offer-letter",
    "/purchase-order",
    "/packing-slip",
    "/pricing",
    "/blogs",
    "/calculators/gst-calculator",
    "/calculators/emi-calculator", 
    "/calculators/loan-calculator",
    "/calculators/interest-calculator",
    "/calculators/salary-calculator",
    "/calculators/discount-calculator",
    "/calculators/profit-margin-calculator",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "daily" : "weekly",
    priority: route === "" ? 1.0 : 0.8,
  }));

  // Dynamic blog routes
  const blogRoutes = BLOGS.map((blog) => ({
    url: `${baseUrl}/blogs/${blog.slug}`,
    lastModified: new Date(blog.date || "2026-04-01"),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...blogRoutes];
}
