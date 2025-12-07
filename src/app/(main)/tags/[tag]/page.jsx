import Link from "next/link";
import { genericFetchData } from "@/lib/genericFetchData";
import SingleTagClient from "@/app/components/tags/SingleTagClient";

export default async function TagPage({ params }) {
  const { tag } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const [data, error] = await genericFetchData(`${baseUrl}/api/tags/${tag}`, "GET");

  if (error) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <h1 className='text-2xl font-bold text-red-500 mb-4'>Error</h1>
          <p className='text-gray-600'>{error?.message || String(error)}</p>
          <Link href='/tags' className='mt-4 inline-block text-purple-600 hover:underline'>
            Back to Tags
          </Link>
        </div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return <SingleTagClient data={data} />;
}
