export default function CategoriesLayout({ children }) {
  return <>{children}</>;
}

export async function generateMetadata() {
  return {
    title: ` Category | BlogVerse`,
    robots: "noindex, follow",
    description: `Browse all articles tagged with `,
  };
}
