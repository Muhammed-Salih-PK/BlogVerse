import HomeClient from "@/app/components/home/HomeClient";
import { genericFetchData } from "@/lib/genericFetchData";
import Hero from "@/app/components/home/Hero";

export default async function Page() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ;
  const [data, error] = await genericFetchData(`${baseUrl}/api/posts`);
  const articles = data?.articles || [];

  const featured = articles.filter((p) => p.featured);
  const categories = ["All", ...new Set(articles.flatMap((p) => p.categories?.map((c) => c.name) || []))];

  return <div>
    <Hero />
    <HomeClient blogs={articles} error={error || null} featured={featured} categories={categories} />;
    </div>
}
