"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Head from "next/head";
import { FiClock, FiArrowRight } from "react-icons/fi";
import { FaTags } from "react-icons/fa";
import CategorySkeleton from "@/app/components/skeletons/CategorySkeleton";
import Error from "@/app/components/error/Error";
import { genericFetchData } from "@/lib/genericFetchData";

export default function CategoryPage() {
  const { slug } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [data, error] = await genericFetchData(`/api/categories/${slug}`, "GET");

      if (error) {
        console.error("Error fetching category:", error);
        setError(`Error fetching Category ${slug}`);
      } else {
        setData(data);
      }
      setLoading(false);
    };

    if (slug) {
      fetchData();
    }
  }, [slug]);

  if (loading) {
    return <CategorySkeleton />;
  }

  if (error) {
    return <Error error={error} backtext={"Back to Categories"} />;
  }

  if (!data) {
    return null;
  }

  const { category, articles, count } = data;

  return (
    <>
      <Head>
        <title>{category.name} Articles | BlogVerse</title>
        <meta name='description' content={`Browse all ${category.name} articles`} />
      </Head>

      <main className='max-w-6xl mx-auto px-4 py-10 mt-4'>
        {/* Category Header */}
        <header className='mb-4 text-center'>
          <h1 className='text-3xl md:text-4xl font-bold mb-1 dark:text-white'>{category.name}</h1>
          <p className='text-gray-600 dark:text-gray-400 text-lg'>
            {count} {count === 1 ? "article" : "articles"} in this category
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
                  <div className='flex flex-wrap gap-2 mb-4'>
                    {article.tags?.map((tag) => (
                      <span
                        key={tag}
                        className='text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded flex items-center'
                      >
                        <FaTags className='mr-1 text-xs' /> {tag}
                      </span>
                    ))}
                  </div>
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
              <p className='text-gray-600 dark:text-gray-400'>There are no published articles in this category yet.</p>
            </div>
          )}
        </div>

        {/* Back to Categories */}
        <div className='mt-8 text-center'>
          <Link href='/categories' className='text-black p-1 rounded-lg dark:text-white hover:underline inline-flex items-center'>
            ← Browse all categories
          </Link>
        </div>
      </main>
    </>
  );
}
