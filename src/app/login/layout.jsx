export const metadata = {
  title: "Sign In - DocMinty",
  description: "Sign in to your DocMinty account.",
  keywords: ["DocMinty login"],
  alternates: { canonical: "https://docminty.com/login" },
  openGraph: {
    title: "Sign In - DocMinty",
    description: "Sign in to your DocMinty account.",
    url: "https://docminty.com/login",
  },
  robots: { index: false, follow: false },
};

export default function Layout({ children }) {
  return children;
}
