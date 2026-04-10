export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/admin/",
        "/dashboard/",
        "/forgot-password",
        "/login",
        "/signup",
      ],
    },
    sitemap: "https://docminty.com/sitemap.xml",
  };
}
