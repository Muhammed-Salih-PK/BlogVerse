export default function TagLayout({ children }) {
  return <>{children}</>;
}

export async function generateMetadata({ params }) {
  const { tag } = await params;

  return {
    title: `#${tag} Articles | BlogPress`,
    robots: "noindex, follow",
    description: `Browse all articles tagged with #${tag}`,
  };
}
