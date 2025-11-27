"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FiClock, FiBookmark, FiSearch, FiChevronDown } from "react-icons/fi";
import { FaTags } from "react-icons/fa";
import { Skeleton } from "@/components/ui/skeleton";
import LikeButton from "../components/LikeButton";
import { motion } from "framer-motion";
import { scaleUp } from "@/lib/motionVariants";
import { useAppSelector } from "@/hooks/reduxHooks";

export default function ArticlesPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("newest");
  const [activeCategory, setActiveCategory] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = useAppSelector((state) => state.auth.user?.id);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      const [articlesRes, categoriesRes, tagsRes] = await Promise.all([fetch(`/api/posts`), fetch(`/api/categories`), fetch(`/api/tags`)]);

      if (!articlesRes.ok || !categoriesRes.ok || !tagsRes.ok) {
        throw new Error("Failed to fetch data");
      }

      const [articlesData, categoriesData, tagsData] = await Promise.all([articlesRes.json(), categoriesRes.json(), tagsRes.json()]);

      setArticles(articlesData.articles || []);
      setCategories([{ name: "All", slug: "all" }, ...(categoriesData || [])]);
      setTags((tagsData || []).map((tag) => tag.name));
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };
  const filteredArticles = articles
    .filter((article) => {
      if (activeCategory === "all") return true;
      return article.categories?.some((cat) => cat.slug === activeCategory);
    })
    .filter((article) => {
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      return (
        article.title?.toLowerCase().includes(query) ||
        article.excerpt?.toLowerCase().includes(query) ||
        article.tags?.some((tag) => tag.toLowerCase().includes(query))
      );
    })
    .sort((a, b) => {
      if (sortOption === "newest") return new Date(b.publishedAt) - new Date(a.publishedAt);
      if (sortOption === "oldest") return new Date(a.publishedAt) - new Date(b.publishedAt);
      if (sortOption === "popular") return (b.meta?.likes || 0) - (a.meta?.likes || 0);
      return 0;
    });

  const getCategoryCount = (categorySlug) => {
    if (categorySlug === "all") return articles.length;
    return articles.filter((article) => article.categories?.some((cat) => cat.slug === categorySlug)).length;
  };

  const iteamsPerPage = 6;
  const totalPages = Math.ceil(filteredArticles.length / iteamsPerPage);
  const startIndex = (currentPage - 1) * iteamsPerPage;
  const endIndex = startIndex + iteamsPerPage;
  const paginatedArticles = filteredArticles.slice(startIndex, endIndex);
  return (
    <>
      {/* Page Header */}
      <section className='bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 md:mt-10 mt-8'>
        <div className='container mx-auto px-4 py-8'>
          <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4'>
            <div>
              <h1 className='text-3xl font-bold dark:text-white'>All Articles</h1>
              {loading ? (
                <Skeleton className='h-4 w-60' />
              ) : (
                <p className='text-gray-600 dark:text-gray-400 mt-2'>
                  {articles.length} articles published · {categories.length - 1} categories
                </p>
              )}
            </div>

            {/* Search and Sort */}
            <div className='flex flex-col sm:flex-row gap-3 w-full md:w-auto'>
              <div className='relative flex-1'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                  {loading ? <Skeleton className='h-10 w-full rounded-lg' /> : <FiSearch className='text-gray-400' />}
                </div>
                {loading ? (
                  <Skeleton className='h-10 w-full rounded-lg' />
                ) : (
                  <input
                    type='text'
                    placeholder='Search articles...'
                    className='pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-800 dark:text-white'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                )}
              </div>

              <div className='relative'>
                {loading ? (
                  <Skeleton className='h-10 w-40 rounded-lg' />
                ) : (
                  <>
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
                  </>
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
                {loading ? (
                  <div className='space-y-2'>
                    {[...Array(5)].map((_, i) => (
                      <Skeleton key={i} className='h-10 w-full rounded-lg' />
                    ))}
                  </div>
                ) : (
                  <div className='space-y-2'>
                    {categories.map((category) => (
                      <button
                        key={category.slug}
                        onClick={() => setActiveCategory(category.slug)}
                        className={`flex items-center justify-between w-full px-3 py-2 rounded-lg transition-colors ${
                          activeCategory === category.slug
                            ? "bg-purple-100 dark:bg-gray-700 text-purple-600 dark:text-purple-400"
                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        }`}
                      >
                        <span>{category.name}</span>
                        <span className='bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 text-xs px-2 py-1 rounded-full'>
                          {getCategoryCount(category.slug)}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Popular Tags */}
              <div className='bg-white dark:bg-gray-800 p-6 rounded-xl shadow border border-gray-200 dark:border-gray-700'>
                <h3 className='text-lg font-bold mb-4 dark:text-white'>Popular Tags</h3>
                {loading ? (
                  <div className='flex flex-wrap gap-2'>
                    {[...Array(8)].map((_, i) => (
                      <Skeleton key={i} className='h-8 w-20 rounded-full' />
                    ))}
                  </div>
                ) : (
                  <div className='flex flex-wrap gap-2'>
                    {tags.map((tag) => (
                      <motion.button
                        whileHover={{ y: -1 }}
                        key={tag}
                        onClick={() => setSearchQuery(tag)}
                        className={`px-3 py-1 text-sm rounded-full flex items-center ${
                          searchQuery === tag
                            ? "bg-purple-600 text-white"
                            : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600"
                        }`}
                      >
                        <FaTags className='mr-1 text-xs' /> {tag}
                      </motion.button>
                    ))}
                  </div>
                )}
              </div>

              {/* Newsletter */}
              <motion.div
                initial='hidden'
                whileInView='visible'
                viewport={{ once: true, margin: "-50px" }}
                variants={scaleUp}
                transition={{ delay: 0.2 }}
                className='bg-gradient-to-r hidden lg:block from-blue-500 to-purple-600 p-6 rounded-xl shadow text-white'
              >
                <>
                  <h3 className='text-lg font-bold mb-2'>Get Updates</h3>
                  <p className='mb-4 opacity-90'>Subscribe to our newsletter for new articles.</p>
                  <form className='space-y-3'>
                    <input
                      type='email'
                      placeholder='Your email'
                      className='w-full px-4 py-2 rounded-lg border text-gray-100 focus:outline-none'
                      required
                    />
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type='submit'
                      className='w-full bg-white text-purple-600 hover:bg-gray-100 py-2 rounded-lg font-medium transition-colors'
                    >
                      Subscribe
                    </motion.button>
                  </form>
                </>
              </motion.div>
            </div>

            {/* Articles List */}
            <div className='lg:w-3/4'>
              {loading ? (
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className='bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-200 dark:border-gray-700 overflow-hidden'>
                      <Skeleton className='h-48 w-full' />
                      <div className='p-6 space-y-3'>
                        <Skeleton className='h-4 w-24' />
                        <Skeleton className='h-6 w-full' />
                        <Skeleton className='h-4 w-full' />
                        <Skeleton className='h-4 w-3/4' />
                        <div className='flex justify-between'>
                          <Skeleton className='h-8 w-24' />
                          <Skeleton className='h-8 w-24' />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredArticles.length > 0 ? (
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  {paginatedArticles.map((article) => (
                    <article
                      key={article._id}
                      className='bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow'
                    >
                      <div className='h-48 bg-gray-200 dark:bg-gray-700 relative'>
                        {article.featuredImage && (
                          <img src={article.featuredImage} alt={article.title} className='w-full h-full object-cover' loading='lazy' />
                        )}
                        <div className='absolute bottom-4 left-4 flex flex-wrap gap-2'>
                          {article.categories && article.categories.length > 0 ? (
                            article.categories.map((cat) => (
                              <div key={cat._id || cat.slug} className='bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium'>
                                {cat.name}
                              </div>
                            ))
                          ) : (
                            <div className='bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium'>Uncategorized</div>
                          )}
                        </div>
                      </div>
                      <div className='p-6'>
                        <div className='flex items-center mb-3'>
                          <span className='text-gray-500 dark:text-gray-400 text-sm flex items-center'>
                            <FiClock className='mr-1' /> {article.readTime}
                          </span>
                          <span className='mx-2 text-gray-400'>•</span>
                          <span className='text-gray-500 dark:text-gray-400 text-sm'>
                            {new Date(article.publishedAt).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                        <h3 className='text-xl font-bold mb-2 dark:text-white'>
                          <Link href={`/articles/${article._id}`} className='hover:text-purple-600 dark:hover:text-purple-400'>
                            {article.title}
                          </Link>
                        </h3>
                        <p className='text-gray-600 dark:text-gray-300 mb-4'>{article.excerpt}</p>

                        <div className='flex flex-wrap gap-2 mb-4'>
                          {article.tags?.map((tag) => (
                            <motion.span
                              whileHover={{ y: -2 }}
                              key={tag}
                              className='text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded flex items-center'
                            >
                              <FaTags className='mr-1 text-xs' /> {tag}
                            </motion.span>
                          ))}
                        </div>

                        <div className='flex justify-between items-center'>
                          <div className='flex items-center'>
                            {article.authorId?.avatar ? (
                              <motion.img
                                whileHover={{ scale: 1.2 }}
                                src={article.authorId.avatar}
                                alt={article.authorId.username}
                                className='w-8 h-8 rounded-full mr-2'
                              />
                            ) : (
                              <div className='w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 mr-2'></div>
                            )}
                            <span className='text-sm text-gray-700 dark:text-gray-300'>{article.authorId?.username || "Unknown Author"}</span>
                          </div>
                          <div className='flex items-center space-x-3'>
                            <LikeButton
                              postId={article._id}
                              initialLiked={Array.isArray(article.meta?.likes) && userId && article.meta.likes.includes(userId)} // Assuming userId is available in Home
                              initialCount={article.meta?.likes?.length || 0}
                            />

                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className='text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400'
                            >
                              <FiBookmark />
                            </motion.button>
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
              {!loading && totalPages > 1 && (
                <div className='flex justify-center mt-12'>
                  <nav className='flex items-center space-x-2'>
                    <button
                      disabled={currentPage == 1 ? true : false}
                      onClick={() => setCurrentPage(currentPage - 1)}
                      className='disabled:text-gray-300 disabled:cursor-not-allowed px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    >
                      Previous
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`px-4 py-2 rounded-md ${
                          currentPage === i + 1
                            ? "bg-purple-600 text-white"
                            : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                    <button
                      disabled={currentPage == totalPages ? true : false}
                      onClick={() => setCurrentPage(currentPage + 1)}
                      className='disabled:text-gray-300 disabled:cursor-not-allowed px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    >
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
