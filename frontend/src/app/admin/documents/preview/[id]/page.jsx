import AdminPreviewClient from "./AdminPreviewClient";

export function generateStaticParams() {
    return [{ id: "preview" }];
}

export default function AdminDocPreviewPage() {
    return <AdminPreviewClient />;
}
