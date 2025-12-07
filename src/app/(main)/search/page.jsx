import { genericFetchData } from "@/lib/genericFetchData";
import SearchClient from "@/app/components/SearchClient";

export default async function SearchPage({ searchParams }) {
  const params = await searchParams; // ✅ await required
  const query = params.q || ""; // now safe

  if (!query) {
    return <SearchClient query='' results={[]} />;
  }

  let results = [];
  try {
    const [data, error] = await genericFetchData(`/api/search?q=${query}`, "GET");
    results = data || [];
  } catch (error) {
    console.error("Search error:", error);
  }

  return <SearchClient query={query} results={results} />;
}
