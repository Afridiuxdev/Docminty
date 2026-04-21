import ShareClient from "./ShareClient";

export function generateStaticParams() {
    return [{ token: "view" }];
}

export default function SharedDocumentPage() {
    return <ShareClient />;
}
