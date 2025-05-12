"use client";

import { useState } from "react";
import Link from "next/link";
import Head from "next/head";
import { FaTags } from "react-icons/fa";
import { FiArrowRight } from "react-icons/fi";

export default function TagsPage() {
  const tags = [
    { name: "Next.js", slug: "nextjs", articleCount: 15 },
    { name: "React", slug: "react", articleCount: 22 },
    { name: "TypeScript", slug: "typescript", articleCount: 18 },
    { name: "Performance", slug: "performance", articleCount: 12 },
    { name: "CSS", slug: "css", articleCount: 10 },
    { name: "Accessibility", slug: "accessibility", articleCount: 8 },
    { name: "State Management", slug: "state-management", articleCount: 9 },
    { name: "Server Components", slug: "server-components", articleCount: 7 },
    { name: "Rendering", slug: "rendering", articleCount: 6 },
    { name: "Optimization", slug: "optimization", articleCount: 11 },
    { name: "Design Systems", slug: "design-systems", articleCount: 5 },
    { name: "Testing", slug: "testing", articleCount: 7 },
  ];

  const [searchTerm, setSearchTerm] = useState("");

  const filteredTags = tags.filter((tag) => tag.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <>
      <Head>
        <title>Tags | BlogPress</title>
        <meta name='description' content='Browse all article tags on BlogPress' />
      </Head>

      <section className='py-12 px-4 mt-10'>
        <div className='container mx-auto max-w-6xl'>
          <div className='text-center mb-12'>
            <h1 className='text-4xl font-bold mb-4 dark:text-white'>Tags</h1>
            <p className='text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto'>Explore articles by specific topics and keywords</p>
          </div>

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
              {tags.slice(0, 6).map((tag) => (
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
      </section>
    </>
  );
}
