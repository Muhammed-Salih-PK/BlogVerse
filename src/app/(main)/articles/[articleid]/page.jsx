import SingleArticleClient from "@/app/components/articles/SingleArticleClient";
import Error from "@/app/components/error/Error";
import { genericFetchData } from "@/lib/genericFetchData";

export default async function ArticlePage({ params }) {
  const { articleid } = params;

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const [data, error] = await genericFetchData(`${baseUrl}/api/posts/${articleid}`, "GET");

  if (error) {
    return <Error error={error.message || "An unexpected error occurred."} />;
  }

  if (!data) {
    return <p className='text-center mt-12 dark:text-white'>Article not found.</p>;
  }

  return <SingleArticleClient article={data} />;
}
