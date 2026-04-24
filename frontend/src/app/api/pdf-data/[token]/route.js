import { getCacheItem } from "@/lib/pdfCache";

export const runtime = "nodejs";

export async function GET(_req, { params }) {
  const { token } = await params;
  const data = getCacheItem(token);
  if (!data) {
    return Response.json({ error: "Not found or expired" }, { status: 404 });
  }
  return Response.json(data);
}
