"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { FiArrowRight, FiClock, FiBookmark } from "react-icons/fi";
import { FaSearch, FaTags, FaUser } from "react-icons/fa";
import LikeButton from "@/app/components/LikeButton";
import { motion } from "framer-motion";
import { containerVariants, fadeInUp, itemVariants, scaleUp } from "@/lib/motionVariants";
import { useAppSelector } from "@/hooks/reduxHooks";


const ITEAMS_PER_PAGE = 5;

export default function HomeClient({ blogs, featured, categories, error }) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const userId = useAppSelector((state) => state.auth.user?.id);

  /** --------------------------------------------
   * DEBOUNCE SEARCH INPUT
   * -------------------------------------------*/
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  /** --------------------------------------------
   * FILTERED POSTS (CATEGORY + SEARCH)
   * -------------------------------------------*/

  const filteredPosts = useMemo(() => {
    if (!searchQuery && activeCategory === "All") return blogs;

    const query = debouncedSearch.toLowerCase();
    return blogs.filter((post) => {
      const matchesCategory = activeCategory === "All" || post.categories?.some((cat) => cat.name === activeCategory);

      const matchesSearch =
        !searchQuery ||
        post.title.toLowerCase().includes(query) ||
        post.excerpt.toLowerCase().includes(query) ||
        post.tags?.some((tag) => tag.toLowerCase().includes(query));
      return matchesCategory && matchesSearch;
    });
  }, [blogs, activeCategory, searchQuery]);

  /** --------------------------------------------
   * PAGINATION
   * -------------------------------------------*/

  const totalPage = useMemo(() => Math.ceil(filteredPosts.length / ITEAMS_PER_PAGE), [filteredPosts]);

  const paginatedArticles = useMemo(() => {
    const start = (currentPage - 1) * ITEAMS_PER_PAGE;
    return filteredPosts.slice(start, start + ITEAMS_PER_PAGE);
  }, [filteredPosts, currentPage]);

  /** --------------------------------------------
   * UI: ERRORS
   * -------------------------------------------*/
  if (error) {
    return (
      <div className='min-h-screen flex items-center justify-center mt-10'>
        <div className='text-red-500'>Error: {error.message || String(error)}</div>
      </div>
    );
  }

  return (
    <>
      

      {/* Featured Posts Skeleton */}
      {featured.length > 0 ? (
        <motion.section
          initial='hidden'
          whileInView='visible'
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          className='py-12 px-4 bg-gray-50 dark:bg-gray-800'
        >
          <div className='container mx-auto max-w-6xl'>
            <h2 className='text-2xl font-bold mb-8 flex items-center'>
              <span className='w-2 h-8 bg-purple-600 mr-3'></span>
              Featured Articles
            </h2>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
              {featured.map((post) => (
                <motion.div
                  key={post._id}
                  whileHover={{ y: -5 }}
                  className='bg-white dark:bg-gray-700 rounded-xl shadow-md overflow-hidden transition-transform '
                >
                  <div className='h-48 relative'>
                    {post.featuredImage ? (
                      <img src={post.featuredImage} alt={post.title} className='w-full h-full object-cover' loading='lazy' />
                    ) : (
                      <div className='flex justify-center items-center font-bold text-xl bg-gradient-to-r from-purple-300 to-blue-200 text-gray-500  h-48'>
                        <span>{post.title}</span>
                      </div>
                    )}
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className='absolute top-4 left-4 bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium'
                    >
                      Featured
                    </motion.div>
                  </div>
                  <div className='p-6'>
                    <div className='flex items-center mb-3'>
                      <span className='bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs px-2 py-1 rounded'>
                        {post.categories?.[0]?.name || "Uncategorized"}
                      </span>
                      <span className='mx-2 text-gray-400'>•</span>
                      <span className='text-gray-500 dark:text-gray-400 text-sm flex items-center'>
                        <FiClock className='mr-1' /> {post.readTime}
                      </span>
                    </div>
                    <h3 className='text-xl font-bold mb-2 dark:text-white'>{post.title}</h3>
                    <p className='text-gray-600 dark:text-gray-300 mb-4'>{post.excerpt}</p>
                    <div className='flex justify-between items-center'>
                      <div className='flex items-center'>
                        {post.authorId?.avatar ? (
                          <img src={post.authorId.avatar} alt={post.authorId.username} className='w-8 h-8 rounded-full mr-2' />
                        ) : (
                          <div className='w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 mr-2'></div>
                        )}
                        <span className='text-sm text-gray-700 dark:text-gray-300'>{post.authorId?.username || "Unknown Author"}</span>
                      </div>
                      <Link
                        href={`/articles/${post._id}`}
                        className='text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 flex items-center'
                      >
                        Read more <FiArrowRight className='ml-1' />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>
      ) : null}

      {/* Main Content */}
      <section className='py-12 px-4'>
        <div className='container mx-auto max-w-6xl'>
          <div className='flex flex-col md:flex-row gap-8'>
            {/* Main Articles */}
            <div className='md:w-2/3'>
              <motion.div variants={fadeInUp} transition={{ delay: 0.9 }} className='relative max-w-xl my-5'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                  <FaSearch className='text-gray-400' />
                </div>
                <input
                  type='text'
                  placeholder='Search articles...'
                  className='pl-10 pr-4 py-3 w-full border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-800'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </motion.div>

              {/* Category Filter Skeleton */}

              <motion.div variants={containerVariants} className='flex flex-wrap gap-2 mb-8'>
                {categories.map((category) => (
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
              </motion.div>

              {/* Articles List Skeleton */}
              {paginatedArticles.length > 0 ? (
                <div className='space-y-8'>
                  {paginatedArticles.map((post) => (
                    <article key={post._id} className='border-b border-gray-200 dark:border-gray-700 pb-8'>
                      <div className='flex flex-col sm:flex-row gap-6'>
                        <motion.div whileHover={{ scale: 1.02 }} className='sm:w-1/3 bg-gray-200 dark:bg-gray-600 h-48 rounded-lg overflow-hidden'>
                          {post.featuredImage && (
                            <img src={post.featuredImage} alt={post.title} className='w-full h-full object-cover' loading='lazy' />
                          )}
                        </motion.div>
                        <div className='sm:w-2/3'>
                          <div className='flex items-center mb-3'>
                            <div className='flex flex-wrap gap-2'>
                              {post.categories && post.categories.length > 0 ? (
                                post.categories.map((cat) => (
                                  <motion.span
                                    key={cat._id || cat.slug}
                                    whileHover={{ scale: 1.1 }}
                                    className='bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs px-2 py-1 rounded'
                                    title={cat.name}
                                  >
                                    {cat.name}
                                  </motion.span>
                                ))
                              ) : (
                                <motion.span
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  className='bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 text-xs px-2 py-1 rounded'
                                >
                                  Uncategorized
                                </motion.span>
                              )}
                            </div>

                            <span className='mx-2 text-gray-400'>•</span>
                            <span className='text-gray-500 dark:text-gray-400 text-sm flex items-center'>
                              <FiClock className='mr-1' /> {post.readTime}
                            </span>
                          </div>
                          <h3 className='text-xl font-bold mb-2 dark:text-white'>{post.title}</h3>
                          <p className='text-gray-600 dark:text-gray-300 mb-4'>{post.excerpt}</p>
                          <div className='flex flex-wrap gap-2 mb-4'>
                            {post.tags?.map((tag) => (
                              <motion.span
                                key={tag}
                                whileHover={{ y: -2 }}
                                className='flex items-center text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded'
                              >
                                <FaTags className='mr-1 text-xs' /> {tag}
                              </motion.span>
                            ))}
                          </div>
                          <div className='flex justify-between items-center'>
                            <motion.div whileHover={{ scale: 1.02 }} className='flex items-center'>
                              {post.authorId?.avatar ? (
                                <img src={post.authorId.avatar} alt={post.authorId.username} className='w-8 h-8 rounded-full mr-2' />
                              ) : (
                                <div className='w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 mr-2'></div>
                              )}
                              <span className='text-sm text-gray-700 dark:text-gray-300'>{post.authorId?.username || "Unknown Author"}</span>
                            </motion.div>
                            <div className='flex items-center space-x-4'>
                              <LikeButton
                                postId={post._id}
                                initialLiked={Array.isArray(post.meta?.likes) && Boolean(userId) && post.meta.likes.includes(userId)}
                                initialCount={post.meta?.likes?.length ?? 0}
                              />

                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className='text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400'
                              >
                                <FiBookmark />
                              </motion.button>
                              <Link
                                href={`/articles/${post._id}`}
                                className='text-purple-600 dark:text-purple-400 group hover:text-purple-800 dark:hover:text-purple-300 flex items-center'
                              >
                                Read more <FiArrowRight className='ml-1 group-hover:translate-x-1 delay-300 ' />
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                  {paginatedArticles.length > 0 && filteredPosts.length > ITEAMS_PER_PAGE && (
                    <div className='flex justify-center mt-12'>
                      <nav className='flex items-center space-x-2'>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          disabled={currentPage == 1 ? true : false}
                          onClick={() => setCurrentPage(currentPage - 1)}
                          className='disabled:text-gray-300 disabled:cursor-not-allowed px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                        >
                          Previous
                        </motion.button>
                        {Array.from({ length: totalPage }, (_, i) => (
                          <motion.button
                            key={i + 1}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setCurrentPage(i + 1)}
                            className={`px-4 py-2 rounded-md ${
                              currentPage === i + 1
                                ? "bg-purple-600 text-white"
                                : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
                            }`}
                          >
                            {i + 1}
                          </motion.button>
                        ))}
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          disabled={currentPage == totalPage ? true : false}
                          onClick={() => setCurrentPage(currentPage + 1)}
                          className='disabled:text-gray-300 disabled:cursor-not-allowed px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                        >
                          Next
                        </motion.button>
                      </nav>
                    </div>
                  )}
                </div>
              ) : (
                <div className='text-center py-12'>
                  <h3 className='text-xl font-bold dark:text-white'>No articles found</h3>
                  <p className='text-gray-600 dark:text-gray-400'>{searchQuery ? "Try a different search term" : "No posts in this category"}</p>
                </div>
              )}

              {/* Pagination Skeleton */}
            </div>

            {/* Sidebar Skeleton */}
            <div className='md:w-1/3 space-y-8'>
              <>
                <motion.div
                  initial='hidden'
                  whileInView='visible'
                  viewport={{ once: true, margin: "-50px" }}
                  variants={scaleUp}
                  className='bg-white dark:bg-gray-700 p-6 rounded-xl shadow'
                >
                  <h3 className='text-lg font-bold mb-4 dark:text-white'>About BlogVerse</h3>
                  <p className='text-gray-600 dark:text-gray-300 mb-4'>
                    We publish high-quality articles on web development, design, and modern technologies to help developers stay updated.
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className='w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg transition-colors'
                  >
                    Learn More
                  </motion.button>
                </motion.div>

                <motion.div
                  initial='hidden'
                  whileInView='visible'
                  viewport={{ once: true, margin: "-50px" }}
                  variants={scaleUp}
                  transition={{ delay: 0.1 }}
                  className='bg-white dark:bg-gray-700 p-6 rounded-xl shadow'
                >
                  <h3 className='text-lg font-bold mb-4 dark:text-white'>Popular Tags</h3>
                  <div className='flex flex-wrap gap-2'>
                    {Array.from(new Set(blogs.flatMap((post) => post.tags || [])))
                      .slice(0, 12)
                      .map((tag) => (
                        <motion.div key={tag} whileHover={{ y: -2 }}>
                          <Link
                            key={tag}
                            href={`/tags/${tag.toLowerCase()}`}
                            className='bg-gray-100 dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-500 text-gray-800 dark:text-gray-200 px-3 py-1 rounded-full text-sm'
                          >
                            #{tag}
                          </Link>
                        </motion.div>
                      ))}
                  </div>
                </motion.div>

                <motion.div
                  initial='hidden'
                  whileInView='visible'
                  viewport={{ once: true, margin: "-50px" }}
                  variants={scaleUp}
                  transition={{ delay: 0.2 }}
                  className='bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-xl shadow text-white'
                >
                  <h3 className='text-lg font-bold mb-2'>Subscribe to Newsletter</h3>
                  <p className='mb-4 opacity-90'>Get the latest articles delivered to your inbox.</p>
                  <form className='space-y-3'>
                    <input
                      type='email'
                      placeholder='Your email address'
                      className='w-full px-4 py-2 rounded-lg text-gray-800 focus:outline-none'
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
                </motion.div>
              </>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
