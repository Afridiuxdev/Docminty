import { BLOGS } from "@/data/blogs";
import BlogSingleClient from "./BlogSingleClient";

export function generateStaticParams() {
    return BLOGS.map((blog) => ({
        slug: blog.slug,
    }));
}

export default function BlogSinglePage() {
    return <BlogSingleClient />;
}
