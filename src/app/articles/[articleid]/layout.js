export default function ArticleLayout({ children }) {
  return <>{children}</>;
}

export async function generateMetadata({ params }) {
  const { articleid } = await params;

  // You must use absolute URL when fetching server-side
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/posts/${articleid}`
  );
  const { seo } = await res.json();

  return {
    title: `${seo?.title} Articles | BlogPress`,
    robots: "noindex, follow",
    description: `Browse all articles tagged with ${seo?.description}`,
  };
}
