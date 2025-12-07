export default function ArticleLayout({ children }) {
  return <>{children}</>;
}

export async function generateMetadata() {
  
  return {
    title: `Article | BlogVerse`,
    robots: "noindex, follow",
    description: `Browse all articles tagged with `,
  };
}
