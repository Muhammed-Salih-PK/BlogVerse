"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Head from "next/head";
import { FiArrowRight, FiSearch } from "react-icons/fi";
import { Skeleton } from "@/components/ui/skeleton";
import { genericFetchData } from "@/lib/genericFetchData";
import Error from "../components/error/Error";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      const [data, error] = await genericFetchData("/api/categories/", "GET");

      if (error) {
        console.error("Failed to fetch categories:", error);
        setError("Error fetching Categories");
      } else {
        setCategories(data);
      }
      setLoading(false);
    };

    fetchCategories();
  }, []);

  const filteredCategories = Array.isArray(categories)
    ? categories.filter(
        (category) =>
          category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (category.description && category.description.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : [];

  if (error) {
    return <Error error={error} />;
  }

  return (
    <section className='py-12 px-4 mt-10'>
      <div className='container mx-auto max-w-6xl'>
        {/* Header */}
        <div className='text-center mb-12'>
          <>
            <h1 className='text-4xl font-bold mb-4 dark:text-white'>Categories</h1>
            <p className='text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto'>Explore our articles organized by topic</p>
          </>
        </div>

        {/* Search */}
        <div className='relative max-w-md mx-auto mb-12'>
          {loading ? (
            <Skeleton className='h-12 w-full rounded-lg' />
          ) : (
            <>
              <input
                type='text'
                placeholder='Search categories...'
                className='w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-800 dark:text-white'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className='absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400'>
                <FiSearch className='text-xl' />
              </div>
            </>
          )}
        </div>

        {/* Categories Grid */}
        {loading ? (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {[...Array(6)].map((_, i) => (
              <div key={i} className='bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-200 dark:border-gray-700 p-6'>
                <div className='flex items-center justify-between mb-4'>
                  <Skeleton className='h-6 w-3/4' />
                  <Skeleton className='h-5 w-16 rounded-full' />
                </div>
                <Skeleton className='h-4 w-full mb-4' />
                <Skeleton className='h-4 w-2/3 mb-4' />
                <div className='space-y-2'>
                  <Skeleton className='h-3 w-24' />
                  <Skeleton className='h-4 w-full' />
                  <Skeleton className='h-3 w-32' />
                </div>
              </div>
            ))}
          </div>
        ) : filteredCategories.length > 0 ? (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {filteredCategories.map((category) => (
              <div
                key={category.slug}
                className='bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow'
              >
                <div className='p-6'>
                  <div className='flex items-center justify-between mb-4'>
                    <h2 className='text-xl font-bold dark:text-white'>
                      <Link href={`/categories/${category.slug}`} className='hover:text-purple-600 dark:hover:text-purple-400'>
                        {category.name}
                      </Link>
                    </h2>
                    <span className='bg-purple-100 dark:bg-gray-700 text-purple-600 dark:text-purple-400 text-xs px-2 py-1 rounded-full'>
                      {category.articleCount} articles
                    </span>
                  </div>
                  <p className='text-gray-600 dark:text-gray-300 mb-4'>{category.description || "No description available"}</p>
                  {category.latestArticle && (
                    <div className='text-sm text-gray-500 dark:text-gray-400'>
                      <p className='mb-1'>Latest article:</p>
                      <Link
                        href={`/categories/${category.slug}`}
                        className='font-medium text-purple-600 dark:text-purple-400 hover:underline flex items-center'
                      >
                        {category.latestArticle.title}
                        <FiArrowRight className='ml-1' />
                      </Link>
                      <p className='mt-1'>
                        {new Date(category.latestArticle.publishedAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className='text-center py-12'>
            <h3 className='text-xl font-bold mb-2 dark:text-white'>No categories found</h3>
            <p className='text-gray-600 dark:text-gray-400'>Try adjusting your search term</p>
          </div>
        )}
      </div>
    </section>
  );
}
