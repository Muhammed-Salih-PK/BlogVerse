export default function ArticleLayout({ children }) {
  return <>{children}</>;
}

export async function generateMetadata() {
  
  return {
    title: `Article | BlogPress`,
    robots: "noindex, follow",
    description: `Browse all articles tagged with `,
  };
}
