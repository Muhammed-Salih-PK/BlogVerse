"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { FiArrowRight, FiSearch, FiStar, FiEye, FiHeart } from "react-icons/fi";
import { FaUser, FaRegBookmark, FaBookmark } from "react-icons/fa";
import {
  BookOpen,
  TrendingUp,
  Sparkles,
  Zap,
  ChevronRight,
  ChevronLeft,
  Calendar,
  Users,
  BarChart3,
  Clock,
  Award,
  Filter,
  X,
  Eye,
} from "lucide-react";
import LikeButton from "@/app/components/LikeButton";
import { motion, AnimatePresence } from "framer-motion";
import { useAppSelector } from "@/hooks/reduxHooks";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const ARTICLES_PER_PAGE = 6;

export default function HomeClient({ blogs, featured, categories, error }) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("newest");
  const [timeRange, setTimeRange] = useState("all");
  const [showBookmarked, setShowBookmarked] = useState(false);
  const [viewMode, setViewMode] = useState("list");

  const userId = useAppSelector((state) => state.auth.user?.id);

  /** --------------------------------------------
   * DEBOUNCE SEARCH INPUT
   * -------------------------------------------*/
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  /** --------------------------------------------
   * FILTERED POSTS (CATEGORY + SEARCH + SORT)
   * -------------------------------------------*/
  const filteredPosts = useMemo(() => {
    let filtered = blogs;

    // Filter by category
    if (activeCategory !== "All") {
      filtered = filtered.filter((post) => post.categories?.some((cat) => cat.name === activeCategory));
    }

    // Filter by search query
    if (debouncedSearch) {
      const query = debouncedSearch.toLowerCase();
      filtered = filtered.filter(
        (post) =>
          post.title?.toLowerCase().includes(query) ||
          post.excerpt?.toLowerCase().includes(query) ||
          post.tags?.some((tag) => tag.toLowerCase().includes(query)) ||
          post.authorId?.username?.toLowerCase().includes(query)
      );
    }

    // Filter by time range
    if (timeRange !== "all") {
      const now = new Date();
      const cutoff = new Date();

      switch (timeRange) {
        case "today":
          cutoff.setDate(now.getDate() - 1);
          break;
        case "week":
          cutoff.setDate(now.getDate() - 7);
          break;
        case "month":
          cutoff.setMonth(now.getMonth() - 1);
          break;
      }

      filtered = filtered.filter((post) => new Date(post.publishedAt) > cutoff);
    }

    // Filter bookmarked articles
    if (showBookmarked && userId) {
      filtered = filtered.filter((post) => post.meta?.bookmarks?.includes(userId));
    }

    // Sort articles
    switch (sortBy) {
      case "trending":
        filtered.sort((a, b) => {
          const scoreA = (b.views || 0) + (b.meta?.likes?.length || 0) * 2 + (b.commentCount || 0) * 3;
          const scoreB = (a.views || 0) + (a.meta?.likes?.length || 0) * 2 + (a.commentCount || 0) * 3;
          return scoreA - scoreB;
        });
        break;
      case "popular":
        filtered.sort((a, b) => (b.views || 0) - (a.views || 0));
        break;
      case "likes":
        filtered.sort((a, b) => (b.meta?.likes?.length || 0) - (a.meta?.likes?.length || 0));
        break;
      case "comments":
        filtered.sort((a, b) => (b.commentCount || 0) - (a.commentCount || 0));
        break;
      case "newest":
      default:
        filtered.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
        break;
    }

    return filtered;
  }, [blogs, activeCategory, debouncedSearch, sortBy, timeRange, showBookmarked, userId]);

  /** --------------------------------------------
   * PAGINATION
   * -------------------------------------------*/
  const totalPages = useMemo(() => Math.ceil(filteredPosts.length / ARTICLES_PER_PAGE), [filteredPosts]);

  const paginatedArticles = useMemo(() => {
    const start = (currentPage - 1) * ARTICLES_PER_PAGE;
    return filteredPosts.slice(start, start + ARTICLES_PER_PAGE);
  }, [filteredPosts, currentPage]);

  /** --------------------------------------------
   * STATS & METRICS
   * -------------------------------------------*/
  const stats = useMemo(() => {
    const totalViews = blogs.reduce((sum, post) => sum + (post.views || 0), 0);
    const totalLikes = blogs.reduce((sum, post) => sum + (post.meta?.likes?.length || 0), 0);
    const totalComments = blogs.reduce((sum, post) => sum + (post.commentCount || 0), 0);
    const uniqueAuthors = new Set(blogs.map((post) => post.authorId?.username).filter(Boolean)).size;

    return { totalViews, totalLikes, totalComments, uniqueAuthors };
  }, [blogs]);

  const formatCount = (count) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays}d ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  };

  /** --------------------------------------------
   * UI: ERRORS
   * -------------------------------------------*/
  if (error) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <Card className='max-w-md'>
          <CardContent className='p-6 text-center'>
            <div className='text-red-500 text-lg font-semibold mb-2'>Something went wrong</div>
            <p className='text-muted-foreground'>{error.message || String(error)}</p>
            <Button className='mt-4' onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gradient-to-b from-background via-background to-muted/20 pb-10'>
      {/* Hero Stats Bar */}
      <div className='border-b bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5'></div>

      {/* Main Content */}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='flex flex-col lg:flex-row gap-8'>
          {/* Main Content Area */}
          <div className='lg:w-2/3'>
            {/* Featured Articles */}
            {featured.length > 0 && (
              <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className='mb-12'>
                <div className='flex items-center justify-between mb-6'>
                  <div>
                    <h2 className='text-2xl font-bold flex items-center gap-2'>
                      <Sparkles className='w-5 h-5 text-primary' />
                      Featured Articles
                    </h2>
                    <p className='text-muted-foreground mt-1'>Handpicked by our editors</p>
                  </div>
                  <Button variant='ghost' size='sm' asChild className='gap-2'>
                    <Link href='/featured'>
                      View All
                      <ChevronRight className='w-4 h-4' />
                    </Link>
                  </Button>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  {featured.map((post) => (
                    <motion.div
                      key={post._id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      whileHover={{ y: -4 }}
                      className='group'
                    >
                      <Card className='h-full overflow-hidden border hover:shadow-xl transition-all duration-300'>
                        {/* Featured Image */}
                        <div className='relative h-48 overflow-hidden'>
                          {post.featuredImage ? (
                            <>
                              <img
                                src={post.featuredImage}
                                alt={post.title}
                                className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-500'
                              />
                              <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent' />
                            </>
                          ) : (
                            <div className='w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5'>
                              <BookOpen className='w-16 h-16 text-primary/30' />
                            </div>
                          )}

                          {/* Featured Badge */}
                          <div className='absolute top-4 left-4'>
                            <Badge className='bg-gradient-to-r from-amber-500 to-orange-500'>
                              <FiStar className='w-3 h-3 mr-1' />
                              Featured
                            </Badge>
                          </div>

                          {/* Category */}
                          {post.categories?.[0] && (
                            <div className='absolute top-4 right-4'>
                              <Badge variant='secondary' className='backdrop-blur-sm bg-white/10 border-white/20'>
                                {post.categories[0].name}
                              </Badge>
                            </div>
                          )}
                        </div>

                        <CardHeader>
                          <div className='flex items-center gap-2 text-sm text-muted-foreground mb-2'>
                            <Clock className='w-4 h-4' />
                            {formatDate(post.publishedAt)}
                            <span className='mx-2'>•</span>
                            <span>{post.readTime || "5 min"}</span>
                          </div>
                          <CardTitle className='group-hover:text-primary transition-colors line-clamp-2'>
                            <Link href={`/articles/${post._id}`}>{post.title}</Link>
                          </CardTitle>
                        </CardHeader>

                        <CardContent>
                          <p className='text-muted-foreground line-clamp-2 mb-4'>{post.excerpt}</p>

                          {/* Author */}
                          <div className='flex items-center justify-between'>
                            <div className='flex items-center gap-2'>
                              {post.authorId?.avatar ? (
                                <img src={post.authorId.avatar} alt={post.authorId.username} className='w-8 h-8 rounded-full ring-2 ring-muted' />
                              ) : (
                                <div className='w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center'>
                                  <FaUser className='w-4 h-4 text-white' />
                                </div>
                              )}
                              <span className='font-medium'>{post.authorId?.username || "Anonymous"}</span>
                            </div>

                            <div className='flex items-center gap-3 text-sm text-muted-foreground'>
                              <span className='flex items-center gap-1'>
                                <FiEye className='w-4 h-4' />
                                {formatCount(post.views || 0)}
                              </span>
                              <span className='flex items-center gap-1'>
                                <FiHeart className='w-4 h-4' />
                                {post.meta?.likes?.length || 0}
                              </span>
                            </div>
                          </div>
                        </CardContent>

                        <CardFooter>
                          <Button className='w-full gap-2 group/btn' asChild>
                            <Link href={`/articles/${post._id}`}>
                              Read Article
                              <FiArrowRight className='group-hover/btn:translate-x-1 transition-transform' />
                            </Link>
                          </Button>
                        </CardFooter>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.section>
            )}
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4'>
              <div className='flex flex-wrap items-center justify-between gap-4'>
                <div className='flex items-center gap-6'>
                  <div className='flex items-center gap-2'>
                    <BookOpen className='w-5 h-5 text-primary' />
                    <span className='font-semibold'>{formatCount(blogs.length)} articles</span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <Users className='w-5 h-5 text-primary' />
                    <span className='font-semibold'>{stats.uniqueAuthors} authors</span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <Eye className='w-5 h-5 text-primary' />
                    <span className='font-semibold'>{formatCount(stats.totalViews)} views</span>
                  </div>
                </div>

                <div className='flex items-center gap-3'>
                  {userId && (
                    <Button
                      variant={showBookmarked ? "default" : "outline"}
                      size='sm'
                      onClick={() => setShowBookmarked(!showBookmarked)}
                      className='gap-2'
                    >
                      {showBookmarked ? (
                        <>
                          <FaBookmark className='w-4 h-4' />
                          Bookmarked
                        </>
                      ) : (
                        <>
                          <FaRegBookmark className='w-4 h-4' />
                          Bookmarks
                        </>
                      )}
                    </Button>
                  )}
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className='w-[140px]'>
                      <Filter className='w-4 h-4 mr-2' />
                      <SelectValue placeholder='Sort by' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='newest'>Newest</SelectItem>
                      <SelectItem value='trending'>Trending</SelectItem>
                      <SelectItem value='popular'>Popular</SelectItem>
                      <SelectItem value='likes'>Most Liked</SelectItem>
                      <SelectItem value='comments'>Most Comments</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            {/* Search and Filters */}
            <div className='mb-8'>
              <Card className='border'>
                <CardContent className='p-6'>
                  <div className='flex flex-col lg:flex-row gap-4 items-center'>
                    {/* Search */}
                    <div className='flex-1 w-full'>
                      <div className='relative'>
                        <FiSearch className='absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground' />
                        <Input
                          type='text'
                          placeholder='Search articles, topics, or authors...'
                          className='pl-12 h-12'
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        {searchQuery && (
                          <button onClick={() => setSearchQuery("")} className='absolute right-4 top-1/2 transform -translate-y-1/2'>
                            <X className='w-4 h-4 text-muted-foreground' />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Quick Filters */}
                    <div className='flex items-center gap-3'>
                      <Select value={timeRange} onValueChange={setTimeRange}>
                        <SelectTrigger className='w-[120px]'>
                          <Calendar className='w-4 h-4 mr-2' />
                          <SelectValue placeholder='Time' />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='all'>All Time</SelectItem>
                          <SelectItem value='today'>Today</SelectItem>
                          <SelectItem value='week'>This Week</SelectItem>
                          <SelectItem value='month'>This Month</SelectItem>
                        </SelectContent>
                      </Select>

                      <div className='flex border rounded-lg overflow-hidden'>
                        <Button
                          variant={viewMode === "list" ? "default" : "ghost"}
                          size='sm'
                          onClick={() => setViewMode("list")}
                          className='rounded-none px-3'
                        >
                          List
                        </Button>
                        <Button
                          variant={viewMode === "grid" ? "default" : "ghost"}
                          size='sm'
                          onClick={() => setViewMode("grid")}
                          className='rounded-none px-3'
                        >
                          Grid
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Category Filters */}
                  <div className='mt-6'>
                    <div className='flex flex-wrap gap-2'>
                      {categories.map((category) => (
                        <Button
                          key={category}
                          variant={activeCategory === category ? "default" : "outline"}
                          size='sm'
                          onClick={() => {
                            setActiveCategory(category);
                            setCurrentPage(1);
                          }}
                        >
                          {category}
                        </Button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Results Header */}
            <div className='mb-6 flex items-center justify-between'>
              <div>
                <h2 className='text-2xl font-bold'>{searchQuery ? `Search: "${searchQuery}"` : "Latest Articles"}</h2>
                <p className='text-muted-foreground mt-1'>
                  Showing {paginatedArticles.length} of {filteredPosts.length} articles
                  {sortBy !== "newest" && ` • Sorted by ${sortBy}`}
                </p>
              </div>

              {(searchQuery || activeCategory !== "All" || timeRange !== "all" || showBookmarked) && (
                <Button
                  variant='ghost'
                  onClick={() => {
                    setSearchQuery("");
                    setActiveCategory("All");
                    setSortBy("newest");
                    setTimeRange("all");
                    setShowBookmarked(false);
                  }}
                  className='gap-2'
                >
                  <X className='w-4 h-4' />
                  Clear filters
                </Button>
              )}
            </div>

            {/* Articles List */}
            <AnimatePresence>
              {paginatedArticles.length > 0 ? (
                viewMode === "list" ? (
                  <div className='space-y-4'>
                    {paginatedArticles.map((post, index) => (
                      <motion.div
                        key={post._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ delay: index * 0.03 }}
                      >
                        <Card className='border hover:shadow-md transition-shadow group'>
                          <div className='flex flex-col md:flex-row'>
                            {/* Image */}
                            <div className='md:w-48 relative overflow-hidden flex-shrink-0'>
                              <Link href={`/articles/${post._id}`} className='block h-full'>
                                <div className='relative h-48 md:h-full overflow-hidden'>
                                  {post.featuredImage ? (
                                    <img
                                      src={post.featuredImage}
                                      alt={post.title}
                                      className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300'
                                    />
                                  ) : (
                                    <div className='w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5'>
                                      <BookOpen className='w-12 h-12 text-primary/30' />
                                    </div>
                                  )}
                                </div>
                              </Link>
                            </div>

                            {/* Content */}
                            <div className='flex-1 p-6'>
                              <div className='flex items-start justify-between mb-3'>
                                <div className='flex-1'>
                                  <div className='flex items-center gap-2 mb-2'>
                                    {post.categories?.[0] && (
                                      <Badge variant='outline' size='sm'>
                                        {post.categories[0].name}
                                      </Badge>
                                    )}
                                    <span className='text-xs text-muted-foreground flex items-center gap-1'>
                                      <Calendar className='w-3 h-3' />
                                      {formatDate(post.publishedAt)}
                                    </span>
                                  </div>
                                  <Link
                                    href={`/articles/${post._id}`}
                                    className='text-xl font-semibold hover:text-primary transition-colors line-clamp-2'
                                  >
                                    {post.title}
                                  </Link>
                                  <p className='text-muted-foreground text-sm mt-2 line-clamp-2'>{post.excerpt}</p>
                                </div>
                              </div>

                              {/* Tags */}
                              {post.tags && post.tags.length > 0 && (
                                <div className='flex flex-wrap gap-1 mb-4'>
                                  {post.tags.slice(0, 4).map((tag) => (
                                    <Link key={tag} href={`/tags/${tag.toLowerCase()}`}>
                                      <Badge variant='secondary' size='sm' className='hover:bg-primary/10 cursor-pointer'>
                                        {tag}
                                      </Badge>
                                    </Link>
                                  ))}
                                </div>
                              )}

                              <div className='flex flex-wrap items-center justify-between gap-4 mt-4'>
                                <div className='flex items-center gap-4'>
                                  <div className='flex items-center gap-2'>
                                    {post.authorId?.avatar ? (
                                      <img src={post.authorId.avatar} alt={post.authorId.username} className='w-6 h-6 rounded-full' />
                                    ) : (
                                      <div className='w-6 h-6 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center'>
                                        <FaUser className='w-3 h-3 text-white' />
                                      </div>
                                    )}
                                    <span className='text-sm font-medium'>{post.authorId?.username || "Anonymous"}</span>
                                  </div>
                                  <span className='text-sm text-muted-foreground flex items-center gap-1'>
                                    <Clock className='w-3 h-3' />
                                    {post.readTime || "5 min"}
                                  </span>
                                </div>

                                <div className='flex items-center gap-4'>
                                  <span className='text-sm text-muted-foreground flex items-center gap-1'>
                                    <FiEye className='w-4 h-4' />
                                    {formatCount(post.views || 0)}
                                  </span>
                                  <LikeButton
                                    postId={post._id}
                                    initialLiked={Array.isArray(post.meta?.likes) && userId && post.meta.likes.includes(userId)}
                                    initialCount={post.meta?.likes?.length || 0}
                                    size='sm'
                                  />
                                  <Button size='sm' variant='ghost' className='gap-2' asChild>
                                    <Link href={`/articles/${post._id}`}>
                                      Read
                                      <ChevronRight className='w-4 h-4' />
                                    </Link>
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  // Grid View
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    {paginatedArticles.map((post, index) => (
                      <motion.div
                        key={post._id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Card className='h-full overflow-hidden border hover:shadow-lg transition-all duration-300 group hover:-translate-y-1'>
                          {/* Image */}
                          <div className='relative h-48 overflow-hidden'>
                            {post.featuredImage ? (
                              <img
                                src={post.featuredImage}
                                alt={post.title}
                                className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-500'
                              />
                            ) : (
                              <div className='w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5'>
                                <BookOpen className='w-16 h-16 text-primary/30' />
                              </div>
                            )}
                          </div>

                          <CardHeader className='pb-3'>
                            <div className='flex items-center gap-2 mb-2'>
                              {post.categories?.[0] && (
                                <Badge variant='outline' size='sm'>
                                  {post.categories[0].name}
                                </Badge>
                              )}
                              <span className='text-xs text-muted-foreground'>{formatDate(post.publishedAt)}</span>
                            </div>
                            <CardTitle className='group-hover:text-primary transition-colors line-clamp-2'>
                              <Link href={`/articles/${post._id}`}>{post.title}</Link>
                            </CardTitle>
                          </CardHeader>

                          <CardContent className='pb-4'>
                            <p className='text-muted-foreground text-sm line-clamp-2 mb-4'>{post.excerpt}</p>
                            <div className='flex items-center justify-between'>
                              <div className='flex items-center gap-2'>
                                <div className='flex items-center gap-1'>
                                  <FiEye className='w-3.5 h-3.5 text-muted-foreground' />
                                  <span className='text-xs text-muted-foreground'>{formatCount(post.views || 0)}</span>
                                </div>
                                <LikeButton
                                  postId={post._id}
                                  initialLiked={Array.isArray(post.meta?.likes) && userId && post.meta.likes.includes(userId)}
                                  initialCount={post.meta?.likes?.length || 0}
                                  size='xs'
                                />
                              </div>
                              <Button variant='ghost' size='sm' className='gap-2' asChild>
                                <Link href={`/articles/${post._id}`}>
                                  Read
                                  <ChevronRight className='w-4 h-4' />
                                </Link>
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                )
              ) : (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className='text-center py-16'>
                  <div className='w-32 h-32 mx-auto bg-gradient-to-br from-primary/10 to-primary/5 rounded-full flex items-center justify-center mb-6'>
                    <BookOpen className='w-16 h-16 text-primary/30' />
                  </div>
                  <h3 className='text-2xl font-bold mb-3'>No articles found</h3>
                  <p className='text-muted-foreground mb-6 max-w-md mx-auto'>
                    {searchQuery ? `No articles matching "${searchQuery}" found` : "No articles available at the moment. Check back soon!"}
                  </p>
                  <div className='flex gap-3 justify-center'>
                    <Button
                      variant='outline'
                      onClick={() => {
                        setSearchQuery("");
                        setActiveCategory("All");
                        setSortBy("newest");
                        setTimeRange("all");
                        setShowBookmarked(false);
                      }}
                    >
                      Clear filters
                    </Button>
                    <Button asChild className='gap-2'>
                      <Link href='/articles/new'>
                        <BookOpen className='w-4 h-4' />
                        Write Article
                      </Link>
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className='flex justify-center mt-12'>
                <div className='flex items-center gap-2'>
                  <Button variant='outline' size='sm' onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1} className='gap-2'>
                    <ChevronLeft className='w-4 h-4' />
                    Previous
                  </Button>

                  <div className='flex items-center gap-1'>
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }

                      return (
                        <Button
                          key={pageNum}
                          variant={currentPage === pageNum ? "default" : "outline"}
                          size='sm'
                          onClick={() => setCurrentPage(pageNum)}
                          className='w-10 h-10 p-0'
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                  </div>

                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className='gap-2'
                  >
                    Next
                    <ChevronRight className='w-4 h-4' />
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className='lg:w-1/3'>
            <div className='space-y-6 sticky top-17'>
              {/* About Card */}
              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <Sparkles className='w-5 h-5 text-primary' />
                    About BlogVerse
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className='text-muted-foreground mb-4'>
                    A community-driven platform where developers share knowledge, learn from each other, and stay updated with the latest
                    technologies.
                  </p>
                  <div className='space-y-3'>
                    <div className='flex items-center gap-2 text-sm'>
                      <Zap className='w-4 h-4 text-primary' />
                      <span>Daily updated content</span>
                    </div>
                    <div className='flex items-center gap-2 text-sm'>
                      <Users className='w-4 h-4 text-primary' />
                      <span>Community-driven reviews</span>
                    </div>
                    <div className='flex items-center gap-2 text-sm'>
                      <Award className='w-4 h-4 text-primary' />
                      <span>Quality curated content</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className='w-full gap-2' asChild>
                    <Link href='/about'>
                      Learn More
                      <ChevronRight className='w-4 h-4' />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>

              {/* Trending Tags */}
              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <TrendingUp className='w-5 h-5 text-primary' />
                    Trending Topics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='flex flex-wrap gap-2'>
                    {Array.from(new Set(blogs.flatMap((post) => post.tags || [])))
                      .slice(0, 15)
                      .map((tag) => (
                        <Link key={tag} href={`/tags/${tag.toLowerCase()}`}>
                          <Badge variant='outline' className='cursor-pointer hover:bg-primary/10 hover:border-primary/30 transition-colors'>
                            #{tag}
                          </Badge>
                        </Link>
                      ))}
                  </div>
                </CardContent>
              </Card>

              {/* Newsletter */}
              <Card className='bg-gradient-to-br from-primary/10 via-primary/5 to-primary/10 border-primary/20'>
                <CardContent className='p-6'>
                  <div className='text-center mb-4'>
                    <div className='w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-3'>
                      <BookOpen className='w-6 h-6 text-white' />
                    </div>
                    <h3 className='font-bold text-lg mb-2'>Stay Updated</h3>
                    <p className='text-sm text-muted-foreground mb-4'>Get the latest articles delivered to your inbox</p>
                  </div>
                  <form className='space-y-3'>
                    <Input type='email' placeholder='Your email' className='bg-background' required />
                    <Button type='submit' className='w-full gap-2'>
                      Subscribe
                      <ChevronRight className='w-4 h-4' />
                    </Button>
                  </form>
                  <p className='text-xs text-muted-foreground text-center mt-3'>No spam. Unsubscribe anytime.</p>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <BarChart3 className='w-5 h-5 text-primary' />
                    Platform Stats
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='space-y-4'>
                    <div className='flex items-center justify-between'>
                      <span className='text-sm text-muted-foreground'>Total Articles</span>
                      <span className='font-bold'>{formatCount(blogs.length)}</span>
                    </div>
                    <div className='flex items-center justify-between'>
                      <span className='text-sm text-muted-foreground'>Total Views</span>
                      <span className='font-bold'>{formatCount(stats.totalViews)}</span>
                    </div>
                    <div className='flex items-center justify-between'>
                      <span className='text-sm text-muted-foreground'>Total Likes</span>
                      <span className='font-bold'>{formatCount(stats.totalLikes)}</span>
                    </div>
                    <div className='flex items-center justify-between'>
                      <span className='text-sm text-muted-foreground'>Active Writers</span>
                      <span className='font-bold'>{stats.uniqueAuthors}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
