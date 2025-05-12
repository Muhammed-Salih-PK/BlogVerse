"use client";

import { useState } from "react";
import Link from "next/link";
import Head from "next/head";
import { FiBookmark, FiArrowRight } from "react-icons/fi";

export default function CategoriesPage() {
  const categories = [
    {
      name: "Next.js",
      slug: "nextjs",
      description: "Articles about Next.js framework, server components, and modern web development",
      articleCount: 18,
      latestArticle: {
        title: "Next.js 14 Performance Improvements",
        date: "2023-11-15"
      }
    },
    {
      name: "React",
      slug: "react",
      description: "Learn about React hooks, state management, and component architecture",
      articleCount: 24,
      latestArticle: {
        title: "React Server Components Deep Dive",
        date: "2023-11-10"
      }
    },
    {
      name: "TypeScript",
      slug: "typescript",
      description: "TypeScript tips, tricks, and advanced patterns for better type safety",
      articleCount: 15,
      latestArticle: {
        title: "TypeScript 5.0 New Features",
        date: "2023-11-05"
      }
    },
    {
      name: "CSS",
      slug: "css",
      description: "Modern CSS techniques, layout patterns, and design systems",
      articleCount: 12,
      latestArticle: {
        title: "CSS Container Queries Guide",
        date: "2023-10-28"
      }
    },
    {
      name: "Performance",
      slug: "performance",
      description: "Web performance optimization techniques and best practices",
      articleCount: 9,
      latestArticle: {
        title: "Core Web Vitals Optimization",
        date: "2023-10-22"
      }
    },
    {
      name: "Accessibility",
      slug: "accessibility",
      description: "Building accessible web applications for all users",
      articleCount: 7,
      latestArticle: {
        title: "ARIA Patterns for Modern Web Apps",
        date: "2023-10-15"
      }
    }
  ];

  const [searchTerm, setSearchTerm] = useState("");

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
    

      <section className="py-12 px-4 mt-10">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 dark:text-white">Categories</h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Explore our articles organized by topic
            </p>
          </div>

          {/* Search */}
          <div className="relative max-w-md mx-auto mb-12">
            <input
              type="text"
              placeholder="Search categories..."
              className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-800 dark:text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
              <FiBookmark className="text-xl" />
            </div>
          </div>

          {/* Categories Grid */}
          {filteredCategories.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCategories.map((category) => (
                <div
                  key={category.slug}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-bold dark:text-white">
                        <Link href={`/categories/${category.slug}`} className="hover:text-purple-600 dark:hover:text-purple-400">
                          {category.name}
                        </Link>
                      </h2>
                      <span className="bg-purple-100 dark:bg-gray-700 text-purple-600 dark:text-purple-400 text-xs px-2 py-1 rounded-full">
                        {category.articleCount} articles
                      </span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">{category.description}</p>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      <p className="mb-1">Latest article:</p>
                      <Link 
                        href="#" 
                        className="font-medium text-purple-600 dark:text-purple-400 hover:underline flex items-center"
                      >
                        {category.latestArticle.title}
                        <FiArrowRight className="ml-1" />
                      </Link>
                      <p className="mt-1">
                        {new Date(category.latestArticle.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-bold mb-2 dark:text-white">No categories found</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Try adjusting your search term
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}