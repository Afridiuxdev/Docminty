import InvoiceClient from "./InvoiceClient";
import { Suspense } from "react";

export function generateStaticParams() {
    return [{ id: "receipt" }];
}

export default function InvoicePrintPage() {
    return (
        <Suspense fallback={
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", fontFamily: "Inter, sans-serif" }}>
                <p>Loading receipt...</p>
            </div>
        }>
            <InvoiceClient />
        </Suspense>
    );
}
