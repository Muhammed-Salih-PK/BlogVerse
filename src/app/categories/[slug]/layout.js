export default function CategoriesLayout({ children }) {
  return <>{children}</>;
}

export async function generateMetadata({ params }) {
  const { slug } = await params;

  // You must use absolute URL when fetching server-side
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/categories/${slug}`
  );
  const {category} = await res.json();
  
  return {
    title: `${category?.name} Articles | BlogPress`,
    robots: "noindex, follow",
    description: `Browse all articles tagged with ${category?.description}`,
  };
}
