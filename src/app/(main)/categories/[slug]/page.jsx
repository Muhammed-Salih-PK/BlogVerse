import SingleCategoryClient from "@/app/components/categories/SingleCategoryClient";
import { genericFetchData } from "@/lib/genericFetchData";

export default async function CategoryPage({ params }) {
  const { slug } = params;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  const [data, error] = await genericFetchData(`${baseUrl}/api/categories/${slug}`, "GET");

  if (error) {
    return <Error error={error} backtext={"Back to Categories"} />;
  }

  if (!data) {
    return (
      <div className='col-span-full text-center py-12'>
        <h3 className='text-xl font-bold dark:text-white'>No articles found</h3>
        <p className='text-gray-600 dark:text-gray-400'>There are no published articles in this category yet.</p>
      </div>
    );
  }

  return <SingleCategoryClient data={data} />;
}
