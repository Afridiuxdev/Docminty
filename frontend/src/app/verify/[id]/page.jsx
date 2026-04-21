import VerifyClient from "./VerifyClient";

export function generateStaticParams() {
    return [{ id: "doc" }];
}

export default function VerifyPage() {
    return <VerifyClient />;
}