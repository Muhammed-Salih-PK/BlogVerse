"use client";

import Link from "next/link";
import { FaTags } from "react-icons/fa";
import { FiArrowRight } from "react-icons/fi";
import { useState } from "react";

export default function TagClient({ tags }) {
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredTags = tags.filter((tag) => tag.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div>
      {/* Search */}
      <div className='relative max-w-md mx-auto mb-12'>
        <input
          type='text'
          placeholder='Search tags...'
          className='w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-800 dark:text-white'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className='absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400'>
          <FaTags className='text-xl' />
        </div>
      </div>

      {/* Tags Cloud */}
      {filteredTags.length > 0 ? (
        <div className='flex flex-wrap justify-center gap-3'>
          {filteredTags.map((tag) => (
            <Link
              key={tag.slug}
              href={`/tags/${tag.slug}`}
              className='group relative flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-purple-600 hover:text-white transition-colors'
            >
              <span className='font-medium text-gray-800 dark:text-gray-200 group-hover:text-white'>#{tag.name}</span>
              <span className='ml-2 text-xs bg-white dark:bg-gray-800 text-purple-600 dark:text-purple-400 group-hover:bg-purple-700 group-hover:text-white px-2 py-1 rounded-full'>
                {tag.articleCount}
              </span>
            </Link>
          ))}
        </div>
      ) : (
        <div className='text-center py-12'>
          <h3 className='text-xl font-bold mb-2 dark:text-white'>No tags found</h3>
          <p className='text-gray-600 dark:text-gray-400'>Try adjusting your search term</p>
        </div>
      )}

      {/* Popular Tags Section */}
      <div className='mt-16'>
        <h2 className='text-2xl font-bold mb-6 dark:text-white text-center'>Popular Tags</h2>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {[...tags]
            .sort((a, b) => b.articleCount - a.articleCount)
            .slice(0, 6)
            .map((tag) => (
              <div
                key={tag.slug}
                className='bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow'
              >
                <div className='flex items-center justify-between mb-4'>
                  <h3 className='text-lg font-bold dark:text-white'>
                    <Link href={`/tags/${tag.slug}`} className='hover:text-purple-600 dark:hover:text-purple-400'>
                      #{tag.name}
                    </Link>
                  </h3>
                  <span className='bg-purple-100 dark:bg-gray-700 text-purple-600 dark:text-purple-400 text-xs px-2 py-1 rounded-full'>
                    {tag.articleCount} articles
                  </span>
                </div>
                <p className='text-gray-600 dark:text-gray-300 mb-4'>Explore all articles tagged with {tag.name}</p>
                <Link href={`/tags/${tag.slug}`} className='text-purple-600 dark:text-purple-400 hover:underline flex items-center text-sm'>
                  View all articles <FiArrowRight className='ml-1' />
                </Link>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
