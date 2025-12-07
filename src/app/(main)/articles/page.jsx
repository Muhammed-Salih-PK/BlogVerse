import ArticleClient from "@/app/components/articles/ArticlesClient";

export default async function ArticlePage() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const [articlesRes, categoriesRes, tagsRes] = await Promise.all([
      fetch(`${baseUrl}/api/posts`, { cache: "no-store" }),
      fetch(`${baseUrl}/api/categories`, { cache: "no-store" }),
      fetch(`${baseUrl}/api/tags`, { cache: "no-store" }),
    ]);

    const [articlesData, categoriesData, tagsData] = await Promise.all([articlesRes.json(), categoriesRes.json(), tagsRes.json()]);

    const articles = articlesData.articles || [];
    const categories = [{ name: "All", slug: "all" }, ...(categoriesData || [])];
    const tags = (tagsData || []).map((tag) => tag.name);

    return <ArticleClient articles={articles} categories={categories} tags={tags} />;
  } catch (error) {
    console.error("Error fetching data:", error);
    return <div>Error loading articles. Please try again later.</div>;
  }
}
