import { genericFetchData } from "@/lib/genericFetchData";
import TagClient from "@/app/components/tags/TagClient";

export default async function TagsPage() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const [data, error] = await genericFetchData(`${baseUrl}/api/tags`, "GET");
  const tags = data || [];

  return (
    <section className='py-12 px-4 mt-10'>
      <div className='container mx-auto max-w-6xl'>
        {/* Header */}
        <div className='text-center mb-12'>
          <h1 className='text-4xl font-bold mb-4 dark:text-white'>Tags</h1>
          <p className='text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto'>Explore articles by specific topics and keywords</p>
        </div>
        {error ? (
          <div className='text-center py-12'>
            <h3 className='text-xl font-bold mb-2 dark:text-white'>Error loading tags</h3>
            <p className='text-gray-600 dark:text-gray-400'>Please try again later.</p>
          </div>
        ) : (
          <TagClient tags={tags} />
        )}
      </div>
    </section>
  );
}
