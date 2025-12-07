export default function ProfileLayout({ children }) {
  return <>{children}</>;
}

export async function generateMetadata() {
  return {
    title: ` Profile Page | BlogVerse`,
    robots: "noindex, follow",
    description: `Browse all articles tagged with profile`,
  };
}
