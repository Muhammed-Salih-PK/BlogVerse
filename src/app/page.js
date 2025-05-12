"use client";

import { useState } from "react";
import Link from "next/link";
import Head from "next/head";
import { FiArrowRight, FiClock, FiHeart, FiBookmark } from "react-icons/fi";
import { FaSearch, FaTags, FaUser } from "react-icons/fa";

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Sample blog post data
  const blogPosts = [
    {
      id: 1,
      title: "Getting Started with Next.js 14",
      excerpt: "Learn how to build modern web applications with Next.js 14 and React Server Components.",
      category: "Development",
      tags: ["Next.js", "React", "JavaScript"],
      author: "Sarah Johnson",
      date: "2023-11-15",
      readTime: "8 min read",
      featured: true,
      image: "/nextjs-blog.jpg"
    },
    {
      id: 2,
      title: "The Complete Guide to Tailwind CSS",
      excerpt: "Master utility-first CSS with this comprehensive Tailwind CSS tutorial and best practices.",
      category: "CSS",
      tags: ["Tailwind", "Frontend", "Design"],
      author: "Michael Chen",
      date: "2023-11-10",
      readTime: "12 min read",
      featured: true,
      image: "/tailwind-blog.jpg"
    },
    {
      id: 3,
      title: "State Management in React 2023",
      excerpt: "Comparing Zustand, Jotai, and Redux Toolkit for modern React state management solutions.",
      category: "React",
      tags: ["React", "State Management", "Frontend"],
      author: "Emma Davis",
      date: "2023-11-05",
      readTime: "10 min read",
      image: "/react-state.jpg"
    },
    {
      id: 4,
      title: "Building Accessible Web Applications",
      excerpt: "Essential techniques to make your web apps accessible to all users.",
      category: "Accessibility",
      tags: ["A11y", "Web Development", "Best Practices"],
      author: "David Wilson",
      date: "2023-10-28",
      readTime: "15 min read",
      image: "/a11y-blog.jpg"
    },
    {
      id: 5,
      title: "TypeScript Best Practices for 2023",
      excerpt: "Level up your TypeScript skills with these advanced patterns and techniques.",
      category: "TypeScript",
      tags: ["TypeScript", "JavaScript", "Web Development"],
      author: "Lisa Thompson",
      date: "2023-10-20",
      readTime: "14 min read",
      image: "/typescript-blog.jpg"
    },
    {
      id: 6,
      title: "Modern CSS Layout Techniques",
      excerpt: "Explore Grid, Flexbox, and Container Queries for responsive designs.",
      category: "CSS",
      tags: ["CSS", "Layout", "Responsive Design"],
      author: "James Rodriguez",
      date: "2023-10-15",
      readTime: "9 min read",
      image: "/css-layouts.jpg"
    }
  ];

  const categories = ["All", "Development", "React", "CSS", "TypeScript", "Accessibility"];
  const featuredPosts = blogPosts.filter(post => post.featured);
  const filteredPosts = activeCategory === "All" 
    ? blogPosts 
    : blogPosts.filter(post => post.category === activeCategory);

  return (
    <>
      <Head>
        <title>BlogPress | Modern Web Development Articles</title>
        <meta name="description" content="Latest articles on web development, React, Next.js, and modern frontend technologies" />
      </Head>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-20 px-4">
        <div className="container mx-auto max-w-6xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Welcome to BlogPress</h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Discover the latest articles on web development, design, and modern technologies.
          </p>
        </div>
      </section>

      {/* Featured Posts */}
      {featuredPosts.length > 0 && (
        <section className="py-12 px-4 bg-gray-50 dark:bg-gray-800">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-2xl font-bold mb-8 flex items-center">
              <span className="w-2 h-8 bg-purple-600 mr-3"></span>
              Featured Articles
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {featuredPosts.map(post => (
                <div key={post.id} className="bg-white dark:bg-gray-700 rounded-xl shadow-md overflow-hidden transition-transform hover:scale-[1.02]">
                  <div className="h-48 bg-gray-200 dark:bg-gray-600 relative">
                    <div className="absolute top-4 left-4 bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Featured
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center mb-3">
                      <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs px-2 py-1 rounded">
                        {post.category}
                      </span>
                      <span className="mx-2 text-gray-400">•</span>
                      <span className="text-gray-500 dark:text-gray-400 text-sm flex items-center">
                        <FiClock className="mr-1" /> {post.readTime}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold mb-2 dark:text-white">{post.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">{post.excerpt}</p>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 mr-2"></div>
                        <span className="text-sm text-gray-700 dark:text-gray-300">{post.author}</span>
                      </div>
                      <Link 
                        href={`/articles/${post.id}`}
                        className="text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 flex items-center"
                      >
                        Read more <FiArrowRight className="ml-1" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Main Content */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Main Articles */}
            <div className="md:w-2/3">
              {/* Category Filter */}
              <div className="flex flex-wrap gap-2 mb-8">
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      activeCategory === category
                        ? "bg-purple-600 text-white"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              {/* Articles List */}
              <div className="space-y-8">
                {filteredPosts.map(post => (
                  <article key={post.id} className="border-b border-gray-200 dark:border-gray-700 pb-8">
                    <div className="flex flex-col sm:flex-row gap-6">
                      <div className="sm:w-1/3 bg-gray-200 dark:bg-gray-600 h-48 rounded-lg"></div>
                      <div className="sm:w-2/3">
                        <div className="flex items-center mb-3">
                          <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs px-2 py-1 rounded">
                            {post.category}
                          </span>
                          <span className="mx-2 text-gray-400">•</span>
                          <span className="text-gray-500 dark:text-gray-400 text-sm flex items-center">
                            <FiClock className="mr-1" /> {post.readTime}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold mb-2 dark:text-white">{post.title}</h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">{post.excerpt}</p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {post.tags.map(tag => (
                            <span key={tag} className="flex items-center text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded">
                              <FaTags className="mr-1 text-xs" /> {tag}
                            </span>
                          ))}
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 mr-2"></div>
                            <span className="text-sm text-gray-700 dark:text-gray-300">{post.author}</span>
                          </div>
                          <div className="flex items-center space-x-4">
                            <button className="text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400">
                              <FiHeart />
                            </button>
                            <button className="text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400">
                              <FiBookmark />
                            </button>
                            <Link 
                              href={`/articles/${post.id}`}
                              className="text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 flex items-center"
                            >
                              Read more <FiArrowRight className="ml-1" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {/* Pagination */}
              <div className="flex justify-center mt-12">
                <nav className="flex items-center space-x-2">
                  <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                    Previous
                  </button>
                  <button className="px-4 py-2 bg-purple-600 text-white rounded-lg">1</button>
                  <button className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                    2
                  </button>
                  <button className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                    3
                  </button>
                  <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                    Next
                  </button>
                </nav>
              </div>
            </div>

            {/* Sidebar */}
            <div className="md:w-1/3 space-y-8">
              {/* About Card */}
              <div className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow">
                <h3 className="text-lg font-bold mb-4 dark:text-white">About BlogPress</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  We publish high-quality articles on web development, design, and modern technologies to help developers stay updated.
                </p>
                <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg transition-colors">
                  Learn More
                </button>
              </div>

              {/* Popular Tags */}
              <div className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow">
                <h3 className="text-lg font-bold mb-4 dark:text-white">Popular Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {["React", "Next.js", "JavaScript", "TypeScript", "CSS", "Tailwind", "Frontend", "Web Development"].map(tag => (
                    <Link 
                      key={tag}
                      href={`/tags/${tag.toLowerCase()}`}
                      className="bg-gray-100 dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-500 text-gray-800 dark:text-gray-200 px-3 py-1 rounded-full text-sm"
                    >
                      #{tag}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Newsletter */}
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-xl shadow text-white">
                <h3 className="text-lg font-bold mb-2">Subscribe to Newsletter</h3>
                <p className="mb-4 opacity-90">Get the latest articles delivered to your inbox.</p>
                <form className="space-y-3">
                  <input
                    type="email"
                    placeholder="Your email address"
                    className="w-full px-4 py-2 rounded-lg text-gray-800 focus:outline-none"
                    required
                  />
                  <button
                    type="submit"
                    className="w-full bg-white text-purple-600 hover:bg-gray-100 py-2 rounded-lg font-medium transition-colors"
                  >
                    Subscribe
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}