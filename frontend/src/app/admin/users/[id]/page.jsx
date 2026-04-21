import UserDetailClient from "./UserDetailClient";

export function generateStaticParams() {
    return [{ id: "profile" }];
}

export default function UserProfilePage({ params }) {
    return <UserDetailClient params={params} />;
}
