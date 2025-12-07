"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  FiSearch,
  FiChevronDown,
  FiGrid,
  FiList,
  FiTrendingUp,
  FiEye,
  FiHeart,
  FiMessageSquare,
  FiChevronLeft,
  FiChevronRight,
  FiStar,
  FiArrowRight,
} from "react-icons/fi";
import { FaTags, FaFire, FaChartLine, FaRegBookmark, FaBookmark } from "react-icons/fa";
import { BookOpen, Hash, Calendar, User, TrendingUp, Zap, Sparkles, Target, BarChart3, Clock, Tag, ChevronRight, Filter, X } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import LikeButton from "@/app/components/LikeButton";
import { motion, AnimatePresence } from "framer-motion";
import { scaleUp } from "@/lib/motionVariants";
import { useAppSelector } from "@/hooks/reduxHooks";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function ArticlesClient({ articles, categories, tags }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("newest");
  const [activeCategory, setActiveCategory] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [timeRange, setTimeRange] = useState("all");
  const [showBookmarked, setShowBookmarked] = useState(false);
  const [bookmarkedArticles, setBookmarkedArticles] = useState([]);

  const userId = useAppSelector((state) => state.auth.user?.id);

  // Filter articles
  const filteredArticles = useMemo(() => {
    let filtered = articles;

    // Filter by category
    if (activeCategory !== "all") {
      filtered = filtered.filter((article) => article.categories?.some((cat) => cat.slug === activeCategory));
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (article) =>
          article.title?.toLowerCase().includes(query) ||
          article.excerpt?.toLowerCase().includes(query) ||
          article.tags?.some((tag) => tag.toLowerCase().includes(query)) ||
          article.authorId?.username?.toLowerCase().includes(query)
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
        case "year":
          cutoff.setFullYear(now.getFullYear() - 1);
          break;
      }

      filtered = filtered.filter((article) => new Date(article.publishedAt) > cutoff);
    }

    // Filter bookmarked articles
    if (showBookmarked) {
      filtered = filtered.filter((article) => article.meta?.bookmarks?.includes(userId));
    }

    // Sort articles
    switch (sortOption) {
      case "newest":
        filtered.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
        break;
      case "oldest":
        filtered.sort((a, b) => new Date(a.publishedAt) - new Date(b.publishedAt));
        break;
      case "popular":
        filtered.sort((a, b) => (b.views || 0) - (a.views || 0));
        break;
      case "trending":
        filtered.sort((a, b) => {
          const scoreA = (b.views || 0) + (b.meta?.likes?.length || 0) * 2 + (b.commentCount || 0) * 3;
          const scoreB = (a.views || 0) + (a.meta?.likes?.length || 0) * 2 + (a.commentCount || 0) * 3;
          return scoreA - scoreB;
        });
        break;
      case "likes":
        filtered.sort((a, b) => (b.meta?.likes?.length || 0) - (a.meta?.likes?.length || 0));
        break;
      case "comments":
        filtered.sort((a, b) => (b.commentCount || 0) - (a.commentCount || 0));
        break;
    }

    return filtered;
  }, [articles, activeCategory, searchQuery, sortOption, timeRange, showBookmarked, userId]);

  const getCategoryCount = (categorySlug) => {
    if (categorySlug === "all") return articles.length;
    return articles.filter((article) => article.categories?.some((cat) => cat.slug === categorySlug)).length;
  };

  const getTrendingScore = (article) => {
    return (article.views || 0) + (article.meta?.likes?.length || 0) * 2 + (article.commentCount || 0) * 3;
  };

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

  // Pagination
  const itemsPerPage = viewMode === "grid" ? 9 : 6;
  const totalPages = Math.ceil(filteredArticles.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedArticles = filteredArticles.slice(startIndex, endIndex);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, searchQuery, sortOption, timeRange, showBookmarked]);

  const stats = [
    {
      label: "Articles",
      value: formatCount(articles.length),
      icon: BookOpen,
      change: "+12%",
      color: "from-blue-500/10 to-blue-500/5",
      iconColor: "text-blue-500",
    },
    {
      label: "Categories",
      value: categories.length,
      icon: Target,
      change: "+5%",
      color: "from-green-500/10 to-green-500/5",
      iconColor: "text-green-500",
    },
    {
      label: "Topics",
      value: tags.length,
      icon: Hash,
      change: "+18%",
      color: "from-purple-500/10 to-purple-500/5",
      iconColor: "text-purple-500",
    },
    {
      label: "Avg. Read",
      value: "7 min",
      icon: Clock,
      change: "-2%",
      color: "from-amber-500/10 to-amber-500/5",
      iconColor: "text-amber-500",
    },
  ];
  return (
    <div className='min-h-screen bg-gradient-to-b from-background via-background to-muted/20'>
      {/* Hero Header */}
      <div className='relative overflow-hidden border-b bg-gradient-to-br from-background via-background to-primary/5'>
        {/* Animated gradient orbs */}
        <div className='absolute top-1/4 -left-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl' />
        <div className='absolute bottom-1/4 -right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl' />

        <div className='relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-8'>
          {/* Header Content */}
          <motion.div
            className='text-center max-w-4xl mx-auto mb-12'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge className='mb-6 px-4 py-1 text-sm bg-primary/10 text-primary hover:bg-primary/20'>
              <Sparkles className='w-4 h-4 mr-2' />
              Knowledge Hub
            </Badge>

            <h1 className='text-5xl md:text-7xl font-bold tracking-tight mb-6'>
              Discover & <span className='bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent'>Share Insights</span>
            </h1>

            <p className='text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed'>
              Explore {articles.length}+ articles from {categories.length} categories and {tags.length} topics. Learn, share, and grow with our
              community.
            </p>

            <div className='flex flex-col sm:flex-row gap-4 justify-center'>
              <Button size='lg' className='gap-2 group' asChild>
                <Link href='/profile/'>
                  <BookOpen className='w-5 h-5' />
                  Start Writing
                  <FiArrowRight className='group-hover:translate-x-1 transition-transform' />
                </Link>
              </Button>
              <Button size='lg' variant='outline' className='gap-2' asChild>
                <Link href='/trending'>
                  <FiTrendingUp className='w-5 h-5' />
                  Trending Now
                </Link>
              </Button>
            </div>
          </motion.div>

          {/* Interactive Stats Cards */}
          <motion.div
            className='grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5'
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1,
                },
              },
            }}
            initial='hidden'
            animate='show'
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0 },
                }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
              >
                <Card className={`border bg-gradient-to-br ${stat.color} backdrop-blur-sm hover:shadow-lg transition-all duration-300`}>
                  <CardContent className='p-4'>
                    <div className='flex items-start justify-between mb-2'>
                      <div className={`p-3 rounded-xl ${stat.color.replace("bg-gradient-to-br", "bg").replace("10", "20").replace("5", "10")}`}>
                        <stat.icon className={`w-4 h-4 ${stat.iconColor}`} />
                      </div>
                      <Badge variant='secondary' className='text-xs'>
                        {stat.change}
                      </Badge>
                    </div>
                    <div className='text-3xl font-bold mb-1'>{stat.value}</div>
                    <div className='text-sm text-muted-foreground'>{stat.label}</div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Enhanced Search & Filters */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className='border bg-background/50 backdrop-blur-sm'>
              <CardContent className='p-6'>
                {/* Main Search */}
                <div className='relative mb-6'>
                  <div className='absolute inset-0 bg-gradient-to-r from-primary/5 to-purple-500/5 rounded-xl blur-xl opacity-50' />
                  <div className='relative'>
                    <FiSearch className='absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground z-10' />
                    <Input
                      type='text'
                      placeholder='Search for articles, tutorials, topics, or authors...'
                      className='pl-12 h-14 text-base bg-background/80 backdrop-blur-sm border-primary/20 focus:border-primary/40'
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery("")}
                        className='absolute right-4 top-1/2 transform -translate-y-1/2 hover:scale-110 transition-transform'
                      >
                        <X className='w-5 h-5 text-muted-foreground' />
                      </button>
                    )}
                  </div>
                </div>

                {/* Quick Actions Row */}
                <div className='flex flex-wrap items-center justify-between gap-4'>
                  {/* Quick Filter Chips */}
                  <div className='flex flex-wrap gap-2'>
                    <Badge
                      variant={activeCategory === "all" ? "default" : "outline"}
                      className='cursor-pointer hover:bg-primary/10'
                      onClick={() => setActiveCategory("all")}
                    >
                      <Hash className='w-3 h-3 mr-1' />
                      All Topics
                    </Badge>

                    {["trending", "popular", "featured"].map((filter) => (
                      <Badge
                        key={filter}
                        variant={sortOption === filter ? "default" : "outline"}
                        className='cursor-pointer hover:bg-primary/10 capitalize'
                        onClick={() => setSortOption(filter)}
                      >
                        {filter === "trending" && <FiTrendingUp className='w-3 h-3 mr-1' />}
                        {filter === "popular" && <FaChartLine className='w-3 h-3 mr-1' />}
                        {filter === "featured" && <FiStar className='w-3 h-3 mr-1' />}
                        {filter}
                      </Badge>
                    ))}
                  </div>

                  {/* View Controls */}
                  <div className='flex items-center gap-3'>
                    <div className='hidden sm:flex items-center gap-2'>
                      <span className='text-sm text-muted-foreground'>View:</span>
                      <div className='flex border rounded-lg overflow-hidden'>
                        <Button
                          variant={viewMode === "grid" ? "default" : "ghost"}
                          size='sm'
                          onClick={() => setViewMode("grid")}
                          className='rounded-none px-4'
                        >
                          <FiGrid className='w-4 h-4' />
                          <span className='ml-2'>Grid</span>
                        </Button>
                        <Button
                          variant={viewMode === "list" ? "default" : "ghost"}
                          size='sm'
                          onClick={() => setViewMode("list")}
                          className='rounded-none px-4'
                        >
                          <FiList className='w-4 h-4' />
                          <span className='ml-2'>List</span>
                        </Button>
                      </div>
                    </div>

                    <Select value={timeRange} onValueChange={setTimeRange}>
                      <SelectTrigger className='w-[140px]'>
                        <Clock className='w-4 h-4 mr-2' />
                        <SelectValue placeholder='Time range' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='all'>All Time</SelectItem>
                        <SelectItem value='today'>Today</SelectItem>
                        <SelectItem value='week'>This Week</SelectItem>
                        <SelectItem value='month'>This Month</SelectItem>
                        <SelectItem value='year'>This Year</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Advanced Filters Toggle */}
                <div className='mt-5 pt-5 border-t'>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-2'>
                      <Filter className='w-4 h-4 text-muted-foreground' />
                      <span className='text-sm font-medium'>Advanced Filters</span>
                    </div>
                    <Button variant='ghost' size='sm' onClick={() => setShowFilters(!showFilters)} className='gap-2'>
                      {showFilters ? "Hide" : "Show"} Filters
                      <FiChevronDown className={`transition-transform ${showFilters ? "rotate-180" : ""}`} />
                    </Button>
                  </div>

                  {/* Advanced Filters (Collapsible) */}
                  <AnimatePresence>
                    {showFilters && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className='overflow-hidden'
                      >
                        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t'>
                          <div>
                            <Label htmlFor='category-select' className='text-sm font-medium mb-2 block'>
                              Category
                            </Label>
                            <Select value={activeCategory} onValueChange={setActiveCategory}>
                              <SelectTrigger>
                                <SelectValue placeholder='Select category' />
                              </SelectTrigger>
                              <SelectContent>
                                {categories.map((category) => (
                                  <SelectItem key={category.slug} value={category.slug}>
                                    {category.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <Label htmlFor='read-time' className='text-sm font-medium mb-2 block'>
                              Read Time
                            </Label>
                            <Select defaultValue='any'>
                              <SelectTrigger>
                                <SelectValue placeholder='Any length' />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value='any'>Any Length</SelectItem>
                                <SelectItem value='5'>≤ 5 min</SelectItem>
                                <SelectItem value='10'>≤ 10 min</SelectItem>
                                <SelectItem value='15'>≤ 15 min</SelectItem>
                                <SelectItem value='30'>≤ 30 min</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className='flex items-end'>
                            {userId && (
                              <div className='flex items-center space-x-2'>
                                <Switch id='bookmarked-only' checked={showBookmarked} onCheckedChange={setShowBookmarked} />
                                <Label htmlFor='bookmarked-only' className='text-sm'>
                                  Show bookmarked only
                                </Label>
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='flex flex-col lg:flex-row gap-8'>
          {/* Sidebar */}
          <div className='lg:w-64 flex-shrink-0'>
            <div className='sticky top-18 space-y-6'>
              {/* Categories */}
              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <Target className='w-4 h-4' />
                    Categories
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='space-y-2'>
                    {categories.map((category) => (
                      <Button
                        key={category.slug}
                        variant={activeCategory === category.slug ? "default" : "ghost"}
                        className='w-full justify-between'
                        onClick={() => {
                          setActiveCategory(category.slug);
                          setShowFilters(false);
                        }}
                      >
                        <span>{category.name}</span>
                        <Badge variant='secondary'>{getCategoryCount(category.slug)}</Badge>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Popular Tags */}
              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <Hash className='w-4 h-4' />
                    Popular Topics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='flex flex-wrap gap-2'>
                    {tags.map((tag) => (
                      <motion.button
                        key={tag}
                        whileHover={{ y: -2 }}
                        onClick={() => setSearchQuery(searchQuery === tag ? "" : tag)}
                        className={`px-3 py-1.5 text-sm rounded-full border transition-all ${
                          searchQuery === tag
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-secondary text-secondary-foreground border-border hover:border-primary/50"
                        }`}
                      >
                        {tag}
                      </motion.button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Newsletter */}
              <motion.div initial='hidden' whileInView='visible' viewport={{ once: true }} variants={scaleUp} className='hidden lg:block'>
                <Card className='bg-gradient-to-br from-primary/10 via-primary/5 to-primary/10 border-primary/20'>
                  <CardContent className='p-6'>
                    <div className='text-center mb-4'>
                      <Sparkles className='w-8 h-8 text-primary mx-auto mb-3' />
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
              </motion.div>
            </div>
          </div>

          {/* Articles Area */}
          <div className='flex-1'>
            {/* Results Header */}
            <div className='mb-6 flex items-center justify-between'>
              <div>
                <h2 className='text-2xl font-semibold'>
                  {searchQuery ? `Search: "${searchQuery}"` : "Latest Articles"}
                  {showBookmarked && " • Bookmarked"}
                </h2>
                <p className='text-muted-foreground mt-1'>
                  Showing {paginatedArticles.length} of {filteredArticles.length} articles
                  {sortOption !== "newest" && ` • Sorted by ${sortOption}`}
                  {timeRange !== "all" && ` • ${timeRange}`}
                </p>
              </div>

              {(searchQuery || activeCategory !== "all" || timeRange !== "all" || showBookmarked) && (
                <Button
                  variant='ghost'
                  onClick={() => {
                    setSearchQuery("");
                    setActiveCategory("all");
                    setSortOption("newest");
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

            {/* Articles Grid/List */}
            <AnimatePresence>
              {paginatedArticles.length > 0 ? (
                viewMode === "grid" ? (
                  <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                    {paginatedArticles.map((article, index) => {
                      const trendingScore = getTrendingScore(article);
                      const isTrending = trendingScore > 1000;

                      return (
                        <motion.div
                          key={article._id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <Card className='h-full overflow-hidden border hover:shadow-lg transition-all duration-300 group hover:-translate-y-1'>
                            {/* Article Image */}
                            <div className='relative h-48 overflow-hidden'>
                              {article.featuredImage ? (
                                <>
                                  <img
                                    src={article.featuredImage}
                                    alt={article.title}
                                    className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-500'
                                  />
                                  <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent' />
                                </>
                              ) : (
                                <div className='w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5'>
                                  <BookOpen className='w-16 h-16 text-primary/30' />
                                </div>
                              )}

                              {/* Badges */}
                              <div className='absolute top-3 left-3 flex gap-2'>
                                {article.featured && (
                                  <Badge className='bg-gradient-to-r from-amber-500 to-orange-500 border-0 backdrop-blur-sm'>
                                    <FiStar className='w-3 h-3 mr-1' />
                                    Featured
                                  </Badge>
                                )}
                                {isTrending && (
                                  <Badge className='bg-gradient-to-r from-red-500 to-pink-500 border-0 backdrop-blur-sm'>
                                    <FaFire className='w-3 h-3 mr-1' />
                                    Trending
                                  </Badge>
                                )}
                              </div>

                              {/* Read Time */}
                              <Badge variant='secondary' className='absolute top-3 right-3 backdrop-blur-sm bg-white/10 border-white/20 text-ededed'>
                                <Clock className='w-3 h-3 mr-1' />
                                {article.readTime || "5 min"}
                              </Badge>
                            </div>

                            <CardHeader className='pb-3'>
                              <div className='flex items-center gap-2 mb-2'>
                                <Badge variant='outline' size='sm'>
                                  {article.categories?.[0]?.name || "General"}
                                </Badge>
                                <div className='text-xs text-muted-foreground flex items-center gap-1'>
                                  <Calendar className='w-3 h-3' />
                                  {formatDate(article.publishedAt)}
                                </div>
                              </div>

                              <CardTitle className='line-clamp-2 text-lg group-hover:text-primary transition-colors'>
                                <Link href={`/articles/${article._id}`} className='hover:underline'>
                                  {article.title}
                                </Link>
                              </CardTitle>
                            </CardHeader>

                            <CardContent className='pb-4'>
                              <p className='text-muted-foreground text-sm line-clamp-2 mb-4'>{article.excerpt}</p>

                              {/* Tags */}
                              {article.tags && article.tags.length > 0 && (
                                <div className='flex flex-wrap gap-1 mb-4'>
                                  {article.tags.slice(0, 3).map((tag) => (
                                    <Badge key={tag} variant='secondary' size='sm'>
                                      {tag}
                                    </Badge>
                                  ))}
                                  {article.tags.length > 3 && (
                                    <Badge variant='outline' size='sm'>
                                      +{article.tags.length - 3}
                                    </Badge>
                                  )}
                                </div>
                              )}

                              {/* Author and Stats */}
                              <div className='flex items-center justify-between'>
                                <div className='flex items-center gap-2'>
                                  {article.authorId?.avatar ? (
                                    <img
                                      src={article.authorId.avatar}
                                      alt={article.authorId.username}
                                      className='w-6 h-6 rounded-full ring-1 ring-muted'
                                    />
                                  ) : (
                                    <div className='w-6 h-6 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center'>
                                      <User className='w-3 h-3 text-white' />
                                    </div>
                                  )}
                                  <span className='text-sm font-medium'>{article.authorId?.username || "Anonymous"}</span>
                                </div>

                                <div className='flex items-center gap-3 text-xs text-muted-foreground'>
                                  <span className='flex items-center gap-1'>
                                    <FiEye className='w-3.5 h-3.5' />
                                    {formatCount(article.views || 0)}
                                  </span>
                                  <span className='flex items-center gap-1'>
                                    <FiHeart className='w-3.5 h-3.5' />
                                    {article.meta?.likes?.length || 0}
                                  </span>
                                </div>
                              </div>
                            </CardContent>

                            <CardFooter className='pt-0'>
                              <div className='flex items-center justify-between w-full'>
                                <LikeButton
                                  postId={article._id}
                                  initialLiked={Array.isArray(article.meta?.likes) && userId && article.meta.likes.includes(userId)}
                                  initialCount={article.meta?.likes?.length || 0}
                                  size='sm'
                                />
                                <Button variant='outline' size='sm' className='gap-2 group/btn' asChild>
                                  <Link href={`/articles/${article._id}`}>
                                    Read
                                    <ChevronRight className='w-4 h-4 group-hover/btn:translate-x-1 transition-transform' />
                                  </Link>
                                </Button>
                              </div>
                            </CardFooter>
                          </Card>
                        </motion.div>
                      );
                    })}
                  </div>
                ) : (
                  // List View
                  <div className='space-y-4'>
                    {paginatedArticles.map((article, index) => {
                      const trendingScore = getTrendingScore(article);
                      const isTrending = trendingScore > 1000;

                      return (
                        <motion.div
                          key={article._id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ delay: index * 0.03 }}
                        >
                          <Card className='border hover:shadow-md transition-shadow group'>
                            <div className='flex flex-col md:flex-row'>
                              {/* Image */}
                              <div className='md:w-48 flex-shrink-0'>
                                <Link href={`/articles/${article._id}`} className='block h-full'>
                                  <div className='relative h-48 md:h-full overflow-hidden'>
                                    {article.featuredImage ? (
                                      <img
                                        src={article.featuredImage}
                                        alt={article.title}
                                        className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300'
                                      />
                                    ) : (
                                      <div className='w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5'>
                                        <BookOpen className='w-12 h-12 text-primary/30' />
                                      </div>
                                    )}
                                    {isTrending && (
                                      <Badge className='absolute top-2 right-2 bg-gradient-to-r from-red-500 to-pink-500 border-0'>
                                        <FaFire className='w-3 h-3 mr-1' />
                                      </Badge>
                                    )}
                                  </div>
                                </Link>
                              </div>

                              {/* Content */}
                              <div className='flex-1 p-6'>
                                <div className='flex items-start justify-between mb-3'>
                                  <div className='flex-1'>
                                    <div className='flex items-center gap-2 mb-2'>
                                      <Badge variant='outline' size='sm'>
                                        {article.categories?.[0]?.name || "General"}
                                      </Badge>
                                      <span className='text-xs text-muted-foreground flex items-center gap-1'>
                                        <Calendar className='w-3 h-3' />
                                        {formatDate(article.publishedAt)}
                                      </span>
                                    </div>
                                    <Link
                                      href={`/articles/${article._id}`}
                                      className='text-xl font-semibold hover:text-primary transition-colors line-clamp-2'
                                    >
                                      {article.title}
                                    </Link>
                                    <p className='text-muted-foreground text-sm mt-2 line-clamp-2'>{article.excerpt}</p>
                                  </div>
                                  {article.featured && (
                                    <Badge className='ml-2 bg-gradient-to-r from-amber-500 to-orange-500'>
                                      <FiStar className='w-3 h-3' />
                                    </Badge>
                                  )}
                                </div>

                                {/* Tags */}
                                {article.tags && article.tags.length > 0 && (
                                  <div className='flex flex-wrap gap-1 mb-4'>
                                    {article.tags.slice(0, 5).map((tag) => (
                                      <Badge key={tag} variant='secondary' size='sm'>
                                        {tag}
                                      </Badge>
                                    ))}
                                  </div>
                                )}

                                <div className='flex items-center justify-between mt-4'>
                                  <div className='flex items-center gap-4'>
                                    <div className='flex items-center gap-2'>
                                      {article.authorId?.avatar ? (
                                        <img src={article.authorId.avatar} alt={article.authorId.username} className='w-6 h-6 rounded-full' />
                                      ) : (
                                        <div className='w-6 h-6 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center'>
                                          <User className='w-3 h-3 text-white' />
                                        </div>
                                      )}
                                      <span className='text-sm font-medium'>{article.authorId?.username || "Anonymous"}</span>
                                    </div>
                                    <span className='text-sm text-muted-foreground flex items-center gap-1'>
                                      <Clock className='w-3 h-3' />
                                      {article.readTime || "5 min"}
                                    </span>
                                  </div>

                                  <div className='flex items-center gap-4'>
                                    <span className='text-sm text-muted-foreground flex items-center gap-1'>
                                      <FiEye className='w-4 h-4' />
                                      {formatCount(article.views || 0)}
                                    </span>
                                    <LikeButton
                                      postId={article._id}
                                      initialLiked={Array.isArray(article.meta?.likes) && userId && article.meta.likes.includes(userId)}
                                      initialCount={article.meta?.likes?.length || 0}
                                      size='sm'
                                    />
                                    <span className='text-sm text-muted-foreground flex items-center gap-1'>
                                      <FiMessageSquare className='w-4 h-4' />
                                      {article.commentCount || 0}
                                    </span>
                                    <Button size='sm' variant='ghost' className='gap-2' asChild>
                                      <Link href={`/articles/${article._id}`}>
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
                      );
                    })}
                  </div>
                )
              ) : (
                // Empty State
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className='text-center py-16'>
                  <div className='w-32 h-32 mx-auto bg-gradient-to-br from-primary/10 to-primary/5 rounded-full flex items-center justify-center mb-6'>
                    <BookOpen className='w-16 h-16 text-primary/30' />
                  </div>
                  <h3 className='text-2xl font-bold mb-3'>No articles found</h3>
                  <p className='text-muted-foreground mb-6 max-w-md mx-auto'>
                    {searchQuery ? `No articles matching "${searchQuery}" found` : "No articles available in this category"}
                  </p>
                  <div className='flex gap-3 justify-center'>
                    <Button
                      variant='outline'
                      onClick={() => {
                        setSearchQuery("");
                        setActiveCategory("all");
                        setSortOption("newest");
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
                    <FiChevronLeft className='w-4 h-4' />
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
                    <FiChevronRight className='w-4 h-4' />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
        {/* Featured Topics Carousel (Optional) */}
        <motion.div className='mt-8 hidden lg:block pb-5' initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
          <div className='flex items-center justify-between mb-4'>
            <h3 className='text-lg font-semibold'>Popular Topics Right Now</h3>
            <Button variant='ghost' size='sm' asChild className='gap-1'>
              <Link href='/tags'>
                View All
                <ChevronRight className='w-4 h-4' />
              </Link>
            </Button>
          </div>
          <div className='flex overflow-x-auto pb-4 gap-2 scrollbar-hide'>
            {tags.slice(0, 10).map((tag) => (
              <Badge
                key={tag}
                variant='outline'
                className='px-4 py-2 text-sm whitespace-nowrap hover:bg-primary/10 cursor-pointer transition-colors'
                onClick={() => setSearchQuery(tag)}
              >
                <Hash className='w-3 h-3 mr-2' />
                {tag}
              </Badge>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
