import { genericFetchData } from "@/lib/genericFetchData";
import TagClient from "@/app/components/tags/TagClient";

export default async function TagsPage() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const [data, error] = await genericFetchData(`${baseUrl}/api/tags`, "GET");
  const tags = data || [];

  if (error) {
    return (
      <div className='text-center py-12'>
        <h3 className='text-xl font-bold mb-2 dark:text-white'>Error loading tags</h3>
        <p className='text-gray-600 dark:text-gray-400'>Please try again later.</p>
      </div>
    );
  }

  return <TagClient tags={tags} />;
}
