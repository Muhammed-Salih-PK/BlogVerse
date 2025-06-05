"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Head from "next/head";
import { FiClock, FiArrowRight } from "react-icons/fi";
import { FaTags } from "react-icons/fa";
import TagSkeleton from "@/app/components/skeletons/TagSkeleton";
import { genericFetchData } from "@/lib/genericFetchData";

export default function TagPage() {
  const { tag } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [data, error] = await genericFetchData(`${process.env.NEXT_PUBLIC_BASE_URL}/api/tags/${tag}`, "GET");

      if (error) {
        console.error("Error fetching tag:", error);
        setError(error.message);
      } else {
        setData(data);
      }
      setLoading(false);
    };

    if (tag) {
      fetchData();
    }
  }, [tag]);

  if (loading) {
    return <TagSkeleton />;
  }

  if (error) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <h1 className='text-2xl font-bold text-red-500 mb-4'>Error</h1>
          <p className='text-gray-600'>{error}</p>
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

  const { tag: currentTag, articles, count } = data;

  return (
    <>
      <Head>
        <title>#{currentTag} Articles | BlogPress</title>
        <meta name='description' content={`Browse all articles tagged with ${currentTag}`} />
      </Head>

      <main className='max-w-6xl mx-auto px-4 py-12 mt-6'>
        {/* Tag Header */}
        <header className='mb-5 text-center'>
          <div className='inline-flex items-center bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-4 py-2 rounded-full mb-2'>
            <FaTags className='mr-2' />
            <h1 className='text-2xl font-bold'>#{currentTag}</h1>
          </div>
          <p className='text-gray-600 dark:text-gray-400 text-lg'>
            {count} {count === 1 ? "article" : "articles"} tagged with #{currentTag}
          </p>
        </header>

        {/* Articles List */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
          {articles.length > 0 ? (
            articles.map((article) => (
              <article key={article._id} className='bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow'>
                {article.featuredImage && (
                  <div className='h-48 bg-gray-200 dark:bg-gray-700 relative'>
                    <img src={article.featuredImage} alt={article.title} className='w-full h-full object-cover' loading='lazy' />
                    {article.categories?.[0]?.name && (
                      <div className='absolute bottom-4 left-4 bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium'>
                        {article.categories[0].name}
                      </div>
                    )}
                  </div>
                )}
                <div className='p-6'>
                  <div className='flex items-center mb-3'>
                    <span className='text-gray-500 dark:text-gray-400 text-sm flex items-center'>
                      <FiClock className='mr-1' /> {article.readTime}
                    </span>
                  </div>
                  <h2 className='text-xl font-bold mb-2 dark:text-white'>
                    <Link href={`/articles/${article._id}`} className='hover:text-purple-600 dark:hover:text-purple-400'>
                      {article.title}
                    </Link>
                  </h2>
                  <p className='text-gray-600 dark:text-gray-300 mb-4'>{article.excerpt}</p>
                  <div className='flex justify-between items-center'>
                    <div className='flex items-center'>
                      {article.authorId?.avatar ? (
                        <img src={article.authorId.avatar} alt={article.authorId.username} className='w-8 h-8 rounded-full mr-2' />
                      ) : (
                        <div className='w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 mr-2'></div>
                      )}
                      <span className='text-sm text-gray-700 dark:text-gray-300'>{article.authorId?.username || "Unknown Author"}</span>
                    </div>
                    <Link
                      href={`/articles/${article._id}`}
                      className='text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 flex items-center'
                    >
                      Read <FiArrowRight className='ml-1' />
                    </Link>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <div className='col-span-full text-center py-12'>
              <h3 className='text-xl font-bold dark:text-white'>No articles found</h3>
              <p className='text-gray-600 dark:text-gray-400'>There are no published articles with this tag yet.</p>
            </div>
          )}
        </div>

        {/* Back to Tags */}
        <div className='mt-8 text-center'>
          <Link href='/tags' className='text-purple-600 dark:text-purple-400 hover:underline inline-flex items-center'>
            ← Browse all tags
          </Link>
        </div>
      </main>
    </>
  );
}
