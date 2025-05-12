"use client";

import { useState } from "react";
import Link from "next/link";
import Head from "next/head";
import { FiClock, FiHeart, FiBookmark, FiSearch, FiChevronDown } from "react-icons/fi";
import { FaTags, FaUser } from "react-icons/fa";

export default function ArticlesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("newest");
  const [activeCategory, setActiveCategory] = useState("All");
  const [showFilters, setShowFilters] = useState(false);

  // Sample article data
  const articles = [
    {
      id: 1,
      title: "Advanced Next.js Routing Techniques",
      excerpt: "Learn about dynamic routing, catch-all routes, and middleware in Next.js applications.",
      category: "Next.js",
      tags: ["Routing", "SSR", "Performance"],
      author: "Sarah Johnson",
      date: "2023-11-20",
      readTime: "10 min read",
      featured: true,
      likes: 42,
      image: "/nextjs-article.jpg",
    },
    {
      id: 2,
      title: "Mastering React Server Components",
      excerpt: "A deep dive into how React Server Components can improve your application performance.",
      category: "React",
      tags: ["RSC", "Performance", "Components"],
      author: "Michael Chen",
      date: "2023-11-15",
      readTime: "12 min read",
      featured: true,
      likes: 35,
      image: "/react-article.jpg",
    },
    {
      id: 3,
      title: "CSS Container Queries Guide",
      excerpt: "How to use container queries for truly component-responsive designs.",
      category: "CSS",
      tags: ["Responsive", "Layout", "Design"],
      author: "Emma Davis",
      date: "2023-11-10",
      readTime: "8 min read",
      featured: false,
      likes: 28,
      image: "/css-article.jpg",
    },
    {
      id: 4,
      title: "TypeScript 5.0 New Features",
      excerpt: "Explore the latest features in TypeScript 5.0 and how to use them effectively.",
      category: "TypeScript",
      tags: ["TypeScript", "JavaScript", "Tooling"],
      author: "David Wilson",
      date: "2023-11-05",
      readTime: "14 min read",
      featured: false,
      likes: 31,
      image: "/typescript-article.jpg",
    },
    {
      id: 5,
      title: "Building Microfrontends with Module Federation",
      excerpt: "A practical guide to implementing microfrontends using Webpack Module Federation.",
      category: "Architecture",
      tags: ["Microfrontends", "Webpack", "Scalability"],
      author: "Lisa Thompson",
      date: "2023-10-28",
      readTime: "16 min read",
      featured: false,
      likes: 19,
      image: "/microfrontends-article.jpg",
    },
    {
      id: 6,
      title: "State Management in 2023",
      excerpt: "Comparing Zustand, Jotai, and Redux Toolkit for modern state management needs.",
      category: "React",
      tags: ["State", "Zustand", "Redux"],
      author: "James Rodriguez",
      date: "2023-10-22",
      readTime: "11 min read",
      featured: false,
      likes: 47,
      image: "/state-management-article.jpg",
    },
  ];

  const categories = ["All", "Next.js", "React", "CSS", "TypeScript", "Architecture"];
  const tags = ["Routing", "RSC", "Responsive", "TypeScript", "Microfrontends", "State", "Performance", "Components"];

  // Filter and sort articles
  const filteredArticles = articles
    .filter((article) => activeCategory === "All" || article.category === activeCategory)
    .filter(
      (article) =>
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .sort((a, b) => {
      if (sortOption === "newest") return new Date(b.date) - new Date(a.date);
      if (sortOption === "oldest") return new Date(a.date) - new Date(b.date);
      if (sortOption === "popular") return b.likes - a.likes;
      return 0;
    });

  return (
    <>
      {/* Page Header */}
      <section className='bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 md:mt-10'>
        <div className='container mx-auto px-4 py-8'>
          <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4'>
            <div>
              <h1 className='text-3xl font-bold dark:text-white'>All Articles</h1>
              <p className='text-gray-600 dark:text-gray-400 mt-2'>
                {articles.length} articles published · {categories.length - 1} categories
              </p>
            </div>

            {/* Search and Sort */}
            <div className='flex flex-col sm:flex-row gap-3 w-full md:w-auto'>
              <div className='relative flex-1'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                  <FiSearch className='text-gray-400' />
                </div>
                <input
                  type='text'
                  placeholder='Search articles...'
                  className='pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-800 dark:text-white'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className='relative'>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className='flex items-center justify-between px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg w-full sm:w-40 dark:bg-gray-800 dark:text-white'
                >
                  <span className='mr-2'>
                    {sortOption === "newest" && "Newest"}
                    {sortOption === "oldest" && "Oldest"}
                    {sortOption === "popular" && "Popular"}
                  </span>
                  <FiChevronDown className={`transition-transform ${showFilters ? "rotate-180" : ""}`} />
                </button>

                {showFilters && (
                  <div className='absolute right-0 mt-1 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10 border border-gray-200 dark:border-gray-700'>
                    <div className='py-1'>
                      <button
                        onClick={() => {
                          setSortOption("newest");
                          setShowFilters(false);
                        }}
                        className={`block px-4 py-2 text-sm w-full text-left ${
                          sortOption === "newest"
                            ? "bg-purple-100 dark:bg-gray-700 text-purple-600 dark:text-purple-400"
                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        }`}
                      >
                        Newest First
                      </button>
                      <button
                        onClick={() => {
                          setSortOption("oldest");
                          setShowFilters(false);
                        }}
                        className={`block px-4 py-2 text-sm w-full text-left ${
                          sortOption === "oldest"
                            ? "bg-purple-100 dark:bg-gray-700 text-purple-600 dark:text-purple-400"
                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        }`}
                      >
                        Oldest First
                      </button>
                      <button
                        onClick={() => {
                          setSortOption("popular");
                          setShowFilters(false);
                        }}
                        className={`block px-4 py-2 text-sm w-full text-left ${
                          sortOption === "popular"
                            ? "bg-purple-100 dark:bg-gray-700 text-purple-600 dark:text-purple-400"
                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        }`}
                      >
                        Most Popular
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className='py-8 px-4'>
        <div className='container mx-auto max-w-7xl'>
          <div className='flex flex-col lg:flex-row gap-8'>
            {/* Sidebar Filters */}
            <div className='lg:w-1/4 space-y-6'>
              {/* Categories */}
              <div className='bg-white dark:bg-gray-800 p-6 rounded-xl shadow border border-gray-200 dark:border-gray-700'>
                <h3 className='text-lg font-bold mb-4 dark:text-white'>Categories</h3>
                <div className='space-y-2'>
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setActiveCategory(category)}
                      className={`flex items-center justify-between w-full px-3 py-2 rounded-lg transition-colors ${
                        activeCategory === category
                          ? "bg-purple-100 dark:bg-gray-700 text-purple-600 dark:text-purple-400"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                    >
                      <span>{category}</span>
                      <span className='bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 text-xs px-2 py-1 rounded-full'>
                        {category === "All" ? articles.length : articles.filter((a) => a.category === category).length}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Popular Tags */}
              <div className='bg-white dark:bg-gray-800 p-6 rounded-xl shadow border border-gray-200 dark:border-gray-700'>
                <h3 className='text-lg font-bold mb-4 dark:text-white'>Popular Tags</h3>
                <div className='flex flex-wrap gap-2'>
                  {tags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setSearchQuery(tag)}
                      className={`px-3 py-1 text-sm rounded-full flex items-center ${
                        searchQuery === tag
                          ? "bg-purple-600 text-white"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600"
                      }`}
                    >
                      <FaTags className='mr-1 text-xs' /> {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Newsletter */}
              <div className='bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-xl shadow text-white'>
                <h3 className='text-lg font-bold mb-2'>Get Updates</h3>
                <p className='mb-4 opacity-90'>Subscribe to our newsletter for new articles.</p>
                <form className='space-y-3'>
                  <input
                    type='email'
                    placeholder='Your email'
                    className='w-full px-4 py-2 rounded-lg border text-gray-100 focus:outline-none'
                    required
                  />
                  <button type='submit' className='w-full bg-white text-purple-600 hover:bg-gray-100 py-2 rounded-lg font-medium transition-colors'>
                    Subscribe
                  </button>
                </form>
              </div>
            </div>

            {/* Articles List */}
            <div className='lg:w-3/4'>
              {filteredArticles.length > 0 ? (
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  {filteredArticles.map((article) => (
                    <article
                      key={article.id}
                      className='bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow'
                    >
                      <div className='h-48 bg-gray-200 dark:bg-gray-700 relative'>
                        {/* Featured image would go here */}
                        <div className='absolute bottom-4 left-4 bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium'>
                          {article.category}
                        </div>
                      </div>
                      <div className='p-6'>
                        <div className='flex items-center mb-3'>
                          <span className='text-gray-500 dark:text-gray-400 text-sm flex items-center'>
                            <FiClock className='mr-1' /> {article.readTime}
                          </span>
                          <span className='mx-2 text-gray-400'>•</span>
                          <span className='text-gray-500 dark:text-gray-400 text-sm'>
                            {new Date(article.date).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                        <h3 className='text-xl font-bold mb-2 dark:text-white'>
                          <Link href={`/articles/${article.id}`} className='hover:text-purple-600 dark:hover:text-purple-400'>
                            {article.title}
                          </Link>
                        </h3>
                        <p className='text-gray-600 dark:text-gray-300 mb-4'>{article.excerpt}</p>

                        <div className='flex flex-wrap gap-2 mb-4'>
                          {article.tags.map((tag) => (
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
                            <div className='w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 mr-2'></div>
                            <span className='text-sm text-gray-700 dark:text-gray-300'>{article.author}</span>
                          </div>
                          <div className='flex items-center space-x-3'>
                            <button className='flex items-center text-gray-500 dark:text-gray-400 hover:text-red-500'>
                              <FiHeart className='mr-1' /> {article.likes}
                            </button>
                            <button className='text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400'>
                              <FiBookmark />
                            </button>
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className='bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-200 dark:border-gray-700 p-8 text-center'>
                  <h3 className='text-xl font-bold mb-2 dark:text-white'>No articles found</h3>
                  <p className='text-gray-600 dark:text-gray-400'>Try adjusting your search or filter criteria</p>
                </div>
              )}

              {/* Pagination */}
              {filteredArticles.length > 0 && (
                <div className='flex justify-center mt-12'>
                  <nav className='flex items-center space-x-2'>
                    <button className='px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'>
                      Previous
                    </button>
                    <button className='px-4 py-2 bg-purple-600 text-white rounded-lg'>1</button>
                    <button className='px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg'>2</button>
                    <button className='px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg'>3</button>
                    <button className='px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'>
                      Next
                    </button>
                  </nav>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
