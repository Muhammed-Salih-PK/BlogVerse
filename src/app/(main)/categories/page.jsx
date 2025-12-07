import { genericFetchData } from "@/lib/genericFetchData";
import CategoryClient from "@/app/components/categories/CategoryClient";

export default async function CategoriesPage() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const [data, error] = await genericFetchData(`${baseUrl}/api/categories/`, "GET");
  const categories = data || [];

  if (error) {
    <div className='col-span-full text-center py-12'>
      <h3 className='text-xl font-bold dark:text-white'>Error loading categories</h3>
      <p className='text-gray-600 dark:text-gray-400'>{error.message || "An unexpected error occurred."}</p>
    </div>;
  }

  return <CategoryClient categories={categories} />;
}
