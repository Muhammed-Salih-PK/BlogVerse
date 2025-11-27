"use client";

import { useState } from "react";
import Link from "next/link";
import { FiSearch, FiArrowRight } from "react-icons/fi";

const CategoryClient = ({ categories }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const query = searchTerm.toLowerCase();
  const filteredCategories = Array.isArray(categories)
    ? categories.filter(
        (category) => category.name.toLowerCase().includes(query) || (category.description && category.description.toLowerCase().includes(query))
      )
    : [];

  return (
    <div>
      {/* Search */}
      <div className='relative max-w-md mx-auto mb-12'>
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
      </div>

      {/* Categories Grid */}
      {filteredCategories.length > 0 ? (
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
  );
};

export default CategoryClient;
