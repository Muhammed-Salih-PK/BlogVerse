"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { FiSearch, FiArrowRight, FiBookOpen, FiTrendingUp, FiClock, FiHash, FiGrid, FiList, FiFilter, FiEye, FiUsers, FiStar } from "react-icons/fi";
import { FaHashtag, FaFire, FaNewspaper, FaUsers as FaUsersSolid, FaChartLine, FaRegBookmark, FaBookmark } from "react-icons/fa";
import {
  BookOpen,
  Hash,
  Target,
  TrendingUp,
  Zap,
  Sparkles,
  BarChart3,
  Users,
  Calendar,
  Tag,
  ChevronRight,
  Filter,
  X,
  Globe,
  Award,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const CategoryClient = ({ categories }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("articles");
  const [viewMode, setViewMode] = useState("grid");
  const [activeFilter, setActiveFilter] = useState("all");

  const query = searchTerm.toLowerCase();

  const filteredCategories = useMemo(() => {
    if (!Array.isArray(categories)) return [];

    let filtered = categories.filter(
      (category) =>
        category.name.toLowerCase().includes(query) ||
        (category.description && category.description.toLowerCase().includes(query)) ||
        (category.tags && category.tags.some((tag) => tag.toLowerCase().includes(query)))
    );

    // Apply additional filters
    if (activeFilter === "popular") {
      filtered = filtered.filter((cat) => (cat.viewCount || 0) > 1000);
    } else if (activeFilter === "growing") {
      filtered = filtered.filter((cat) => (cat.growthRate || 0) > 10);
    } else if (activeFilter === "new") {
      filtered = filtered.filter((cat) => cat.isNew);
    }

    // Apply sorting
    switch (sortBy) {
      case "trending":
        filtered.sort((a, b) => (b.trendingScore || 0) - (a.trendingScore || 0));
        break;
      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "growth":
        filtered.sort((a, b) => (b.growthRate || 0) - (a.growthRate || 0));
        break;
      case "writers":
        filtered.sort((a, b) => (b.writerCount || 0) - (a.writerCount || 0));
        break;
      case "articles":
      default:
        filtered.sort((a, b) => (b.articleCount || 0) - (a.articleCount || 0));
        break;
    }

    return filtered;
  }, [categories, query, sortBy, activeFilter]);

  const totalArticles = useMemo(() => filteredCategories.reduce((sum, cat) => sum + (cat.articleCount || 0), 0), [filteredCategories]);

  const totalWriters = useMemo(() => [...new Set(filteredCategories.flatMap((cat) => cat.writers || []))].length, [filteredCategories]);

  const averageGrowth = useMemo(() => {
    const avg = filteredCategories.reduce((sum, cat) => sum + (cat.growthRate || 0), 0) / filteredCategories.length;
    return filteredCategories.length > 0 ? avg.toFixed(1) : "0.0";
  }, [filteredCategories]);

  const formatCount = (count) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count;
  };

  const getTrendingScore = (category) => {
    return (category.articleCount || 0) * 0.5 + (category.viewCount || 0) * 0.2 + (category.writerCount || 0) * 0.3 + (category.growthRate || 0) * 2;
  };

  const stats = [
    {
      label: "Total Categories",
      value: filteredCategories.length,
      icon: Hash,
      trend: "+8%",
      color: "text-blue-500",
      bg: "from-blue-500/10 to-blue-500/5",
    },
    {
      label: "Total Articles",
      value: formatCount(totalArticles),
      icon: BookOpen,
      trend: "+15%",
      color: "text-purple-500",
      bg: "from-purple-500/10 to-purple-500/5",
    },
    {
      label: "Active Writers",
      value: totalWriters,
      icon: Users,
      trend: "+12%",
      color: "text-green-500",
      bg: "from-green-500/10 to-green-500/5",
    },
    {
      label: "Avg. Growth",
      value: `${averageGrowth}%`,
      icon: TrendingUp,
      trend: "MoM",
      color: "text-amber-500",
      bg: "from-amber-500/10 to-amber-500/5",
    },
  ];
  const getGrowthColor = (rate) => {
    if (rate > 20) return "text-green-500";
    if (rate > 10) return "text-amber-500";
    if (rate > 0) return "text-blue-500";
    return "text-gray-500";
  };

  return (
    <div className='min-h-screen bg-gradient-to-b from-background via-background to-muted/20 pb-10'>
      {/* Hero Section */}
      <section className='relative overflow-hidden border-b'>
        <div className='absolute inset-0 bg-gradient-to-br from-primary/5 via-primary/10 to-transparent' />
        <div className='absolute -top-20 -right-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl' />
        <div className='absolute -bottom-20 -left-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl' />

        <div className='relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20'>
          <motion.div
            className='text-center max-w-4xl mx-auto mb-12'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge className='mb-6 px-4 py-2 text-sm bg-primary/10 text-primary hover:bg-primary/20'>
              <Target className='w-4 h-4 mr-2' />
              Content Categories
            </Badge>

            <h1 className='text-5xl md:text-7xl font-bold tracking-tight mb-6'>
              Explore <span className='text-primary'>Knowledge</span> Domains
            </h1>

            <p className='text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed'>
              Dive into specialized topics, discover expert content, and find your niche among {filteredCategories.length} carefully curated
              categories.
            </p>
          </motion.div>

          {/* Stats Overview */}
          <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-8'>
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
              >
                <Card className={`border bg-gradient-to-br ${stat.bg} backdrop-blur-sm hover:shadow-lg transition-all duration-300`}>
                  <CardContent className='p-6'>
                    <div className='flex items-start justify-between mb-4'>
                      <div className={`p-3 rounded-xl ${stat.bg.replace("bg-gradient-to-br", "bg").replace("10", "20").replace("5", "10")}`}>
                        <stat.icon className={`w-6 h-6 ${stat.color}`} />
                      </div>
                      <Badge variant='secondary' className='text-xs'>
                        {stat.trend}
                      </Badge>
                    </div>
                    <div className='text-3xl font-bold mb-1'>{stat.value}</div>
                    <div className='text-sm text-muted-foreground'>{stat.label}</div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Search and Controls */}
          <Card className='border bg-background/50 backdrop-blur-sm'>
            <CardContent className='p-6'>
              <div className='flex flex-col lg:flex-row gap-6 items-center mb-6'>
                {/* Search Bar */}
                <div className='flex-1 w-full'>
                  <div className='relative'>
                    <FiSearch className='absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground' />
                    <Input
                      type='text'
                      placeholder='Search categories, topics, or descriptions...'
                      className='pl-12 h-12 text-base bg-background/80 backdrop-blur-sm border-primary/20'
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {searchTerm && (
                      <button onClick={() => setSearchTerm("")} className='absolute right-4 top-1/2 transform -translate-y-1/2'>
                        <X className='w-4 h-4 text-muted-foreground' />
                      </button>
                    )}
                  </div>
                </div>

                {/* View and Sort Controls */}
                <div className='flex items-center gap-4 w-full lg:w-auto'>
                  <div className='flex border rounded-lg overflow-hidden'>
                    <Button
                      variant={viewMode === "grid" ? "default" : "ghost"}
                      size='sm'
                      onClick={() => setViewMode("grid")}
                      className='rounded-none px-3'
                    >
                      <FiGrid className='w-4 h-4' />
                    </Button>
                    <Button
                      variant={viewMode === "list" ? "default" : "ghost"}
                      size='sm'
                      onClick={() => setViewMode("list")}
                      className='rounded-none px-3'
                    >
                      <FiList className='w-4 h-4' />
                    </Button>
                  </div>

                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className='w-[180px]'>
                      <div className='flex items-center gap-2'>
                        <FiFilter className='w-4 h-4' />
                        <SelectValue placeholder='Sort by' />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='articles'>Most Articles</SelectItem>
                      <SelectItem value='trending'>Trending</SelectItem>
                      <SelectItem value='growth'>Growth Rate</SelectItem>
                      <SelectItem value='writers'>Most Writers</SelectItem>
                      <SelectItem value='name'>Name</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Quick Filters */}
              <Tabs value={activeFilter} onValueChange={setActiveFilter} className='w-full'>
                <TabsList className='grid grid-cols-4 w-full'>
                  <TabsTrigger value='all' className='gap-2'>
                    <Hash className='w-4 h-4' />
                    All
                  </TabsTrigger>
                  <TabsTrigger value='popular' className='gap-2'>
                    <FaFire className='w-4 h-4' />
                    Popular
                  </TabsTrigger>
                  <TabsTrigger value='growing' className='gap-2'>
                    <TrendingUp className='w-4 h-4' />
                    Growing
                  </TabsTrigger>
                  <TabsTrigger value='new' className='gap-2'>
                    <Sparkles className='w-4 h-4' />
                    New
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Main Content */}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20'>
        {/* Results Header */}
        <div className='mb-8 flex items-center justify-between'>
          <div>
            <h2 className='text-2xl font-bold'>{searchTerm ? `Search Results for "${searchTerm}"` : "Browse Categories"}</h2>
            <p className='text-muted-foreground mt-1'>
              Showing {filteredCategories.length} categories • {formatCount(totalArticles)} articles total
              {sortBy !== "articles" && ` • Sorted by ${sortBy}`}
            </p>
          </div>

          {(searchTerm || activeFilter !== "all") && (
            <Button
              variant='ghost'
              onClick={() => {
                setSearchTerm("");
                setActiveFilter("all");
                setSortBy("articles");
              }}
              className='gap-2'
            >
              <X className='w-4 h-4' />
              Clear filters
            </Button>
          )}
        </div>

        {/* Categories Grid/List */}
        <AnimatePresence>
          {filteredCategories.length > 0 ? (
            viewMode === "grid" ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                {filteredCategories.map((category, index) => {
                  const trendingScore = getTrendingScore(category);
                  const isTrending = trendingScore > 100;
                  const isNew = category.isNew;

                  return (
                    <motion.div
                      key={category.slug}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ y: -4, transition: { duration: 0.2 } }}
                    >
                      <Card className='h-full overflow-hidden border hover:shadow-lg transition-all duration-300 group'>
                        {/* Category Header */}
                        <div className='relative h-32 overflow-hidden'>
                          {category.bannerImage ? (
                            <img
                              src={category.bannerImage}
                              alt={category.name}
                              className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-500'
                            />
                          ) : (
                            <div className='w-full h-full bg-gradient-to-br from-primary/10 via-primary/5 to-primary/20 flex items-center justify-center'>
                              <Target className='w-16 h-16 text-primary/30' />
                            </div>
                          )}

                          {/* Badges */}
                          <div className='absolute top-3 left-3 flex gap-2'>
                            {isNew && (
                              <Badge className='bg-gradient-to-r from-green-500 to-emerald-500 border-0 backdrop-blur-sm'>
                                <Sparkles className='w-3 h-3 mr-1' />
                                New
                              </Badge>
                            )}
                            {isTrending && (
                              <Badge className='bg-gradient-to-r from-amber-500 to-orange-500 border-0 backdrop-blur-sm'>
                                <FaFire className='w-3 h-3 mr-1' />
                                Trending
                              </Badge>
                            )}
                          </div>

                          {/* Stats Overlay */}
                          <div className='absolute bottom-3 left-3 right-3 flex justify-between items-center'>
                            <Badge variant='secondary' className='backdrop-blur-sm bg-white/10 border-white/20'>
                              {category.articleCount || 0} articles
                            </Badge>
                            {category.growthRate > 0 && (
                              <Badge className={`backdrop-blur-sm bg-white/10 border-white/20 ${getGrowthColor(category.growthRate)}`}>
                                ↗ {category.growthRate}%
                              </Badge>
                            )}
                          </div>
                        </div>

                        <CardHeader>
                          <CardTitle className='group-hover:text-primary transition-colors'>
                            <Link href={`/categories/${category.slug}`} className='hover:underline'>
                              {category.name}
                            </Link>
                          </CardTitle>
                          <p className='text-sm text-muted-foreground mt-2 line-clamp-2'>
                            {category.description || "Explore fascinating content in this category"}
                          </p>
                        </CardHeader>

                        <CardContent>
                          {/* Category Stats */}
                          <div className='grid grid-cols-3 gap-2 mb-4'>
                            <div className='text-center p-2 bg-secondary rounded-lg'>
                              <div className='text-lg font-bold'>{category.articleCount || 0}</div>
                              <div className='text-xs text-muted-foreground'>Articles</div>
                            </div>
                            <div className='text-center p-2 bg-secondary rounded-lg'>
                              <div className='text-lg font-bold'>{formatCount(category.viewCount || 0)}</div>
                              <div className='text-xs text-muted-foreground'>Views</div>
                            </div>
                            <div className='text-center p-2 bg-secondary rounded-lg'>
                              <div className='text-lg font-bold'>{category.writerCount || 0}</div>
                              <div className='text-xs text-muted-foreground'>Writers</div>
                            </div>
                          </div>

                          {/* Top Topics */}
                          {category.tags && category.tags.length > 0 && (
                            <div className='mb-4'>
                              <div className='flex items-center gap-2 mb-2'>
                                <Hash className='w-4 h-4 text-muted-foreground' />
                                <span className='text-sm font-medium'>Top Topics</span>
                              </div>
                              <div className='flex flex-wrap gap-1'>
                                {category.tags.slice(0, 4).map((tag) => (
                                  <Badge key={tag} variant='outline' size='sm' className='text-xs'>
                                    {tag}
                                  </Badge>
                                ))}
                                {category.tags.length > 4 && (
                                  <Badge variant='outline' size='sm' className='text-xs'>
                                    +{category.tags.length - 4}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Latest Activity */}
                          {category.latestArticle && (
                            <div className='pt-4 border-t'>
                              <div className='flex items-center gap-2 mb-2'>
                                <BookOpen className='w-4 h-4 text-muted-foreground' />
                                <span className='text-sm font-medium'>Latest Article</span>
                              </div>
                              <Link href={`/articles/${category.latestArticle.slug || category.latestArticle._id}`} className='group/article block'>
                                <p className='text-sm font-medium group-hover/article:text-primary transition-colors line-clamp-1'>
                                  {category.latestArticle.title}
                                </p>
                                <div className='text-xs text-muted-foreground flex items-center gap-1 mt-1'>
                                  <Calendar className='w-3 h-3' />
                                  {new Date(category.latestArticle.publishedAt).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                  })}
                                </div>
                              </Link>
                            </div>
                          )}
                        </CardContent>

                        <CardFooter>
                          <Button className='w-full gap-2 group/btn' asChild>
                            <Link href={`/categories/${category.slug}`}>
                              Explore Category
                              <FiArrowRight className='group-hover/btn:translate-x-1 transition-transform' />
                            </Link>
                          </Button>
                        </CardFooter>
                      </Card>
                    </motion.div>
                  );
                })}
              </motion.div>
            ) : (
              // List View
              <div className='space-y-4'>
                {filteredCategories.map((category, index) => (
                  <motion.div
                    key={category.slug}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.03 }}
                  >
                    <Card className='border hover:shadow-md transition-shadow group'>
                      <div className='flex flex-col md:flex-row'>
                        {/* Image */}
                        <div className='md:w-48 relative overflow-hidden flex-shrink-0'>
                          {category.bannerImage ? (
                            <img
                              src={category.bannerImage}
                              alt={category.name}
                              className='w-full h-48 md:h-full object-cover group-hover:scale-105 transition-transform duration-300'
                            />
                          ) : (
                            <div className='w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5'>
                              <Target className='w-16 h-16 text-primary/30' />
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className='flex-1 p-6'>
                          <div className='flex items-start justify-between mb-3'>
                            <div className='flex-1'>
                              <div className='flex items-center gap-2 mb-2'>
                                {category.isNew && (
                                  <Badge className='bg-gradient-to-r from-green-500 to-emerald-500'>
                                    <Sparkles className='w-3 h-3 mr-1' />
                                    New
                                  </Badge>
                                )}
                                <Badge variant='outline'>{category.articleCount || 0} articles</Badge>
                              </div>
                              <Link href={`/categories/${category.slug}`} className='text-xl font-semibold hover:text-primary transition-colors'>
                                {category.name}
                              </Link>
                              <p className='text-muted-foreground text-sm mt-2 line-clamp-2'>
                                {category.description || "Explore fascinating content in this category"}
                              </p>
                            </div>
                          </div>

                          <div className='flex flex-wrap items-center justify-between mt-4 gap-4'>
                            <div className='flex items-center gap-4'>
                              <div className='text-sm text-muted-foreground flex items-center gap-1'>
                                <FiEye className='w-4 h-4' />
                                {formatCount(category.viewCount || 0)} views
                              </div>
                              <div className='text-sm text-muted-foreground flex items-center gap-1'>
                                <FiUsers className='w-4 h-4' />
                                {category.writerCount || 0} writers
                              </div>
                              {category.growthRate > 0 && (
                                <div className={`text-sm font-medium flex items-center gap-1 ${getGrowthColor(category.growthRate)}`}>
                                  <TrendingUp className='w-4 h-4' />
                                  {category.growthRate}% growth
                                </div>
                              )}
                            </div>

                            <div className='flex items-center gap-3'>
                              {category.tags &&
                                category.tags.slice(0, 3).map((tag) => (
                                  <Badge key={tag} variant='secondary' size='sm'>
                                    {tag}
                                  </Badge>
                                ))}
                              <Button size='sm' variant='ghost' className='gap-2' asChild>
                                <Link href={`/categories/${category.slug}`}>
                                  Explore
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
            )
          ) : (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className='text-center py-16'>
              <div className='w-32 h-32 mx-auto bg-gradient-to-br from-primary/10 to-primary/5 rounded-full flex items-center justify-center mb-6'>
                <Target className='w-16 h-16 text-primary/30' />
              </div>
              <h3 className='text-2xl font-bold mb-3'>No categories found</h3>
              <p className='text-muted-foreground mb-6 max-w-md mx-auto'>
                {searchTerm
                  ? `No categories matching "${searchTerm}" found. Try a different search.`
                  : "No categories available at the moment. Check back soon!"}
              </p>
              <div className='flex gap-3 justify-center'>
                {searchTerm && (
                  <Button variant='outline' onClick={() => setSearchTerm("")}>
                    Clear search
                  </Button>
                )}
                <Button asChild className='gap-2'>
                  <Link href='/'>
                    <BookOpen className='w-4 h-4' />
                    Browse Articles
                  </Link>
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Related Topics Section */}
        {filteredCategories.length > 0 && (
          <div className='mt-16'>
            <Card className='border bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-2xl'>Explore More Topics</CardTitle>
                    <p className='text-muted-foreground mt-1'>Discover related tags and trending discussions</p>
                  </div>
                  <Button variant='ghost' asChild className='gap-2'>
                    <Link href='/tags'>
                      View All Tags
                      <ChevronRight />
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className='flex flex-wrap gap-3'>
                  {[
                    "Web Development",
                    "Data Science",
                    "UI/UX Design",
                    "DevOps",
                    "Mobile Apps",
                    "Machine Learning",
                    "Cloud Computing",
                    "Cybersecurity",
                    "Blockchain",
                    "IoT",
                    "AR/VR",
                    "Game Development",
                  ].map((topic) => (
                    <Link
                      key={topic}
                      href={`/tags/${topic.toLowerCase().replace(/\s+/g, "-")}`}
                      className={`group inline-flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-300 hover:shadow-md ${
                        searchTerm === topic ? "bg-primary text-primary-foreground border-primary" : "bg-background hover:bg-accent border-border"
                      }`}
                    >
                      <Hash className={`w-4 h-4 ${searchTerm === topic ? "text-primary-foreground" : "text-muted-foreground"}`} />
                      <span className='font-medium'>{topic}</span>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* CTA Section */}
        <div className='mt-16'>
          <div className='relative overflow-hidden rounded-2xl border bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 p-8'>
            <div className='absolute -top-20 -right-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl' />
            <div className='absolute -bottom-20 -left-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl' />

            <div className='relative z-10 text-center'>
              <div className='inline-flex items-center gap-3 mb-6'>
                <div className='p-3 rounded-full bg-primary'>
                  <BookOpen className='w-6 h-6 text-white' />
                </div>
                <h3 className='text-3xl font-bold'>Want to Start a New Category?</h3>
              </div>
              <p className='text-muted-foreground mb-8 max-w-2xl mx-auto text-lg'>
                Have expertise in a specific area? Help us grow our knowledge base by suggesting new categories and contributing content.
              </p>
              <div className='flex flex-col sm:flex-row gap-4 justify-center'>
                <Button size='lg' className='gap-2' asChild>
                  <Link href='/suggest-category'>
                    <Hash className='w-5 h-5' />
                    Suggest Category
                  </Link>
                </Button>
                <Button size='lg' variant='outline' asChild>
                  <Link href='/articles/new'>Write First Article</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryClient;
