"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiSearch,
  FiArrowRight,
  FiHash,
  FiFilter,
  FiTag,
  FiTrendingUp,
  FiBarChart2,
  FiClock,
  FiBookOpen,
  FiZap,
  FiPlus,
  FiChevronRight,
  FiRefreshCw,
  FiGrid,
  FiList,
  FiEye,
  FiHeart,
  FiMessageSquare,
} from "react-icons/fi";
import {
  FaFire,
  FaChartLine,
  FaRegClock,
  FaRegChartBar,
  FaHashtag,
  FaUser,
  FaRegBookmark,
  FaBookmark,
  FaRocket,
  FaRegLightbulb,
} from "react-icons/fa";
import {
  Hash,
  TrendingUp,
  BarChart3,
  Sparkles,
  Zap,
  Rocket,
  Flame,
  Target,
  Award,
  Calendar,
  Users,
  BookOpen,
  Share2,
  ArrowUpRight,
  LineChart,
  Activity,
  Crown,
  Tag as TagIcon,
  Filter as FilterIcon,
  Search,
  X,
  ChevronRight,
  Plus,
  RefreshCw,
  Clock,
  Eye,
  Grid,
  List,
  ArrowRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";

export default function TagClient({ tags }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("popular");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [activeTab, setActiveTab] = useState("all");
  const [timeRange, setTimeRange] = useState("all");
  const [showStats, setShowStats] = useState(true);

  // Extract categories from tags
  const categories = useMemo(() => {
    const allCategories = new Set(["all"]);
    tags?.forEach((tag) => {
      if (tag.categories) {
        tag.categories.forEach((cat) => allCategories.add(cat));
      }
    });
    return Array.from(allCategories).slice(0, 8);
  }, [tags]);

  // Filter and sort tags
  const filteredTags = useMemo(() => {
    if (!Array.isArray(tags)) return [];

    let filtered = tags.filter((tag) => {
      const matchesSearch =
        !searchTerm ||
        tag.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (tag.description && tag.description.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesCategory = selectedCategory === "all" || (tag.categories && tag.categories.includes(selectedCategory));

      // Additional filters based on activeTab
      if (activeTab === "trending") {
        return matchesSearch && matchesCategory && (tag.trendingScore || 0) > 70;
      } else if (activeTab === "new") {
        return matchesSearch && matchesCategory && tag.isNew;
      } else if (activeTab === "featured") {
        return matchesSearch && matchesCategory && tag.isFeatured;
      }

      return matchesSearch && matchesCategory;
    });

    // Apply sorting
    switch (sortBy) {
      case "alphabetical":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "newest":
        filtered.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        break;
      case "trending":
        filtered.sort((a, b) => (b.trendingScore || 0) - (a.trendingScore || 0));
        break;
      case "growth":
        filtered.sort((a, b) => (b.growthRate || 0) - (a.growthRate || 0));
        break;
      case "popular":
      default:
        filtered.sort((a, b) => (b.articleCount || 0) - (a.articleCount || 0));
        break;
    }

    // Time range filter
    if (timeRange !== "all" && tags[0]?.lastUpdated) {
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

      filtered = filtered.filter((tag) => new Date(tag.lastUpdated) > cutoff);
    }

    return filtered;
  }, [tags, searchTerm, sortBy, selectedCategory, activeTab, timeRange]);

  // Calculate statistics
  const stats = useMemo(() => {
    if (!filteredTags.length) return { totalTags: 0, totalArticles: 0, avgArticles: 0, topTag: null };

    const totalArticles = filteredTags.reduce((sum, tag) => sum + (tag.articleCount || 0), 0);
    const avgArticles = totalArticles / filteredTags.length;
    const topTag = filteredTags.reduce((prev, current) => ((prev.articleCount || 0) > (current.articleCount || 0) ? prev : current));

    return {
      totalTags: filteredTags.length,
      totalArticles,
      avgArticles: Math.round(avgArticles),
      topTag,
    };
  }, [filteredTags]);

  const formatCount = (count) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count;
  };

  const getTagSize = (articleCount) => {
    if (articleCount >= 100) return "text-3xl";
    if (articleCount >= 50) return "text-2xl";
    if (articleCount >= 20) return "text-xl";
    if (articleCount >= 10) return "text-lg";
    return "text-base";
  };

  const getTagColor = (articleCount) => {
    if (articleCount >= 100) return "from-purple-600 to-pink-600";
    if (articleCount >= 50) return "from-blue-600 to-indigo-600";
    if (articleCount >= 20) return "from-emerald-600 to-teal-600";
    if (articleCount >= 10) return "from-amber-600 to-orange-600";
    return "from-gray-600 to-gray-700";
  };

  const getGrowthColor = (rate) => {
    if (rate > 20) return "text-emerald-500";
    if (rate > 10) return "text-amber-500";
    if (rate > 0) return "text-blue-500";
    return "text-gray-500";
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <div className='min-h-screen bg-gradient-to-b from-background via-background to-primary/5'>
      {/* Hero Section */}
      <section className='relative overflow-hidden border-b'>
        <div className='absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent' />
        <div className='absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl' />
        <div className='absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl' />

        <div className='relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
          <motion.div initial='hidden' animate='visible' variants={staggerContainer} className='text-center max-w-4xl mx-auto'>
            <motion.div variants={fadeInUp}>
              <Badge className='mb-6 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0'>
                <Hash className='w-4 h-4 mr-2' />
                Explore Topics
              </Badge>
            </motion.div>

            <motion.h1 variants={fadeInUp} className='text-4xl md:text-6xl font-bold tracking-tight mb-6'>
              Discover <span className='bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent'>Topics</span> That Matter
            </motion.h1>

            <motion.p variants={fadeInUp} className='text-xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed'>
              Dive into {stats.totalTags}+ curated topics. Find articles, tutorials, and discussions that match your interests and expertise.
            </motion.p>

            {/* Stats Overview */}
            <motion.div variants={fadeInUp} className='grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mb-8'>
              {[
                { label: "Total Tags", value: stats.totalTags, icon: Hash, color: "text-purple-500" },
                { label: "Articles", value: formatCount(stats.totalArticles), icon: BookOpen, color: "text-blue-500" },
                { label: "Avg. Articles", value: stats.avgArticles, icon: BarChart3, color: "text-emerald-500" },
                { label: "Top Tag", value: stats.topTag?.name || "—", icon: Crown, color: "text-amber-500" },
              ].map((stat, index) => (
                <Card key={stat.label} className='border hover:shadow-lg transition-shadow'>
                  <CardContent className='p-4 text-center'>
                    <div className={`inline-flex p-2 rounded-lg bg-primary/10 mb-2 ${stat.color.replace("text", "bg")}/10`}>
                      <stat.icon className={`w-4 h-4 ${stat.color}`} />
                    </div>
                    <div className='text-xl font-bold'>{stat.value}</div>
                    <div className='text-xs text-muted-foreground'>{stat.label}</div>
                  </CardContent>
                </Card>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {/* Controls */}
        <Card className='mb-8 border'>
          <CardContent className='p-6'>
            <div className='flex flex-col lg:flex-row gap-6 items-center mb-6'>
              {/* Search */}
              <div className='flex-1 w-full'>
                <div className='relative'>
                  <Search className='absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground' />
                  <Input
                    type='text'
                    placeholder='Search topics, descriptions...'
                    className='pl-12 h-12'
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

              {/* View Controls */}
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
                  <SelectTrigger className='w-[140px]'>
                    <FilterIcon className='w-4 h-4 mr-2' />
                    <SelectValue placeholder='Sort by' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='popular'>Most Popular</SelectItem>
                    <SelectItem value='trending'>Trending</SelectItem>
                    <SelectItem value='growth'>Growth Rate</SelectItem>
                    <SelectItem value='alphabetical'>Alphabetical</SelectItem>
                    <SelectItem value='newest'>Newest</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Tabs & Filters */}
            <div className='flex flex-col lg:flex-row gap-6 items-center justify-between'>
              <Tabs value={activeTab} onValueChange={setActiveTab} className='w-full lg:w-auto'>
                <TabsList>
                  <TabsTrigger value='all'>All</TabsTrigger>
                  <TabsTrigger value='trending'>
                    <TrendingUp className='w-4 h-4 mr-2' />
                    Trending
                  </TabsTrigger>
                  <TabsTrigger value='new'>
                    <Sparkles className='w-4 h-4 mr-2' />
                    New
                  </TabsTrigger>
                  <TabsTrigger value='featured'>
                    <Crown className='w-4 h-4 mr-2' />
                    Featured
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              <div className='flex flex-wrap items-center gap-4'>
                {/* Category Filter */}
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className='w-[160px]'>
                    <Hash className='w-4 h-4 mr-2' />
                    <SelectValue placeholder='Category' />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category === "all" ? "All Categories" : category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Time Range */}
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger className='w-[130px]'>
                    <Clock className='w-4 h-4 mr-2' />
                    <SelectValue placeholder='Time' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='all'>All Time</SelectItem>
                    <SelectItem value='today'>Today</SelectItem>
                    <SelectItem value='week'>This Week</SelectItem>
                    <SelectItem value='month'>This Month</SelectItem>
                  </SelectContent>
                </Select>

                {/* Toggle Stats */}
                <div className='flex items-center space-x-2'>
                  <Switch id='show-stats' checked={showStats} onCheckedChange={setShowStats} />
                  <Label htmlFor='show-stats' className='text-sm'>
                    Show Stats
                  </Label>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Header */}
        <div className='mb-6 flex items-center justify-between'>
          <div>
            <h2 className='text-2xl font-bold'>{searchTerm ? `Search: "${searchTerm}"` : "Browse Topics"}</h2>
            <p className='text-muted-foreground mt-1'>
              {filteredTags.length} topics • {formatCount(stats.totalArticles)} articles
              {sortBy !== "popular" && ` • Sorted by ${sortBy}`}
            </p>
          </div>

          {(searchTerm || selectedCategory !== "all" || activeTab !== "all" || timeRange !== "all") && (
            <Button
              variant='ghost'
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("all");
                setActiveTab("all");
                setTimeRange("all");
                setSortBy("popular");
              }}
              className='gap-2'
            >
              <X className='w-4 h-4' />
              Clear filters
            </Button>
          )}
        </div>

        {/* Enhanced Tags Display - Fixed for Hydration */}
        <AnimatePresence mode='wait'>
          {filteredTags.length > 0 ? (
            <div className='relative'>
              {/* Quick Stats Bar */}
              <motion.div className='flex items-center justify-between mb-6 px-4 py-3 bg-secondary/50 backdrop-blur-sm rounded-xl'>
                <div className='flex items-center gap-4 text-sm'>
                  <span className='flex items-center gap-1'>
                    <Hash className='w-4 h-4 text-primary' />
                    {filteredTags.length} topics
                  </span>
                  <span className='flex items-center gap-1'>
                    <BookOpen className='w-4 h-4 text-primary' />
                    {formatCount(stats.totalArticles)} articles
                  </span>
                  <span className='flex items-center gap-1'>
                    <TrendingUp className='w-4 h-4 text-primary' />
                    {filteredTags.filter((t) => (t.growthRate || 0) > 10).length} trending
                  </span>
                </div>

                <div className='flex items-center gap-2'>
                  <div className='flex items-center gap-1 text-sm'>
                    <Eye className='w-4 h-4 text-muted-foreground' />
                    <span className='text-muted-foreground'>View:</span>
                  </div>
                  <div className='flex border rounded-lg overflow-hidden'>
                    <Button
                      variant={viewMode === "grid" ? "default" : "ghost"}
                      size='sm'
                      onClick={() => setViewMode("grid")}
                      className='rounded-none px-3 gap-2'
                    >
                      <Grid className='w-4 h-4' />
                      Grid
                    </Button>
                    <Button
                      variant={viewMode === "list" ? "default" : "ghost"}
                      size='sm'
                      onClick={() => setViewMode("list")}
                      className='rounded-none px-3 gap-2'
                    >
                      <List className='w-4 h-4' />
                      List
                    </Button>
                  </div>
                </div>
              </motion.div>

              {viewMode === "grid" ? (
                <motion.div key='grid' className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
                  {filteredTags.map((tag, index) => {
                    // Generate deterministic values for hydration consistency
                    const deterministicScore = tag.trendingScore || (tag.articleCount ? Math.min(70 + (tag.articleCount % 30), 95) : 75);
                    const deterministicWeekly = tag.weeklyGrowth || (tag.articleCount ? 10 + (tag.articleCount % 40) : 25);
                    const deterministicMonthly = tag.monthlyGrowth || (tag.articleCount ? 50 + (tag.articleCount % 50) : 75);

                    return (
                      <motion.div
                        key={tag.slug}
                        layout
                        whileHover={{
                          y: -8,
                          transition: {
                            duration: 0.2,
                            type: "spring",
                            stiffness: 200,
                          },
                        }}
                        className='relative'
                      >
                        {/* Featured Ribbon */}
                        {tag.isFeatured && (
                          <div className='absolute -top-2 -right-2 z-10'>
                            <div className='relative'>
                              <div className='absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full blur-sm'></div>
                              <Badge className='relative bg-gradient-to-r from-amber-500 to-orange-500 border-0 shadow-lg'>
                                <Sparkles className='w-3 h-3 mr-1' />
                                Featured
                              </Badge>
                            </div>
                          </div>
                        )}

                        {/* Trending Indicator */}
                        {deterministicScore > 80 && (
                          <div className='absolute -top-2 -left-2 z-10'>
                            <Badge className='bg-gradient-to-r from-red-500 to-pink-500 border-0 shadow-lg animate-pulse'>
                              <Flame className='w-3 h-3 mr-1' />
                              Hot
                            </Badge>
                          </div>
                        )}

                        <Card className='h-full overflow-hidden border border-border/50 hover:border-primary/30 hover:shadow-2xl transition-all duration-300 group bg-gradient-to-b from-card to-card/80 backdrop-blur-sm'>
                          {/* Gradient Header */}
                          <div
                            className={`h-1.5 bg-gradient-to-r ${getTagColor(tag.articleCount || 0)} group-hover:h-2 transition-all duration-300`}
                          />

                          <CardHeader className='pb-3'>
                            <div className='flex items-start justify-between mb-3'>
                              <div className='flex-1 min-w-0'>
                                <CardTitle className='group-hover:text-primary transition-colors duration-300 truncate'>
                                  <Link
                                    href={`/tags/${tag.slug}`}
                                    className='flex items-center gap-2 hover:underline decoration-2 underline-offset-2'
                                  >
                                    <Hash
                                      className={`w-5 h-5 flex-shrink-0 ${getTagColor(tag.articleCount || 0)
                                        .replace("from-", "text-")
                                        .replace(" to-", "")}`}
                                    />
                                    <span className='font-bold truncate'>#{tag.name}</span>
                                  </Link>
                                </CardTitle>
                                <div className='flex items-center gap-2 mt-1'>
                                  <Badge variant='secondary' className='text-xs font-normal gap-1'>
                                    <BookOpen className='w-3 h-3' />
                                    {formatCount(tag.articleCount || 0)}
                                  </Badge>
                                  {(tag.growthRate || 0) > 0 && (
                                    <Badge variant='outline' className='text-xs gap-1'>
                                      <TrendingUp className='w-3 h-3' />+{tag.growthRate}%
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>

                            <p className='text-sm text-muted-foreground line-clamp-2 leading-relaxed'>
                              {tag.description || `Discover ${tag.articleCount || 0}+ articles, tutorials, and discussions about ${tag.name}`}
                            </p>
                          </CardHeader>

                          <CardContent className='pb-4'>
                            {/* Stats Visualization */}
                            {showStats && (
                              <div className='space-y-3 mb-4'>
                                {/* Engagement Score - Using deterministic value */}
                                <div className='flex items-center justify-between'>
                                  <div className='text-xs text-muted-foreground'>Engagement Score</div>
                                  <div className='text-xs font-medium text-amber-500'>{deterministicScore}/100</div>
                                </div>
                                <Progress value={deterministicScore} className='h-1.5' />

                                {/* Quick Stats - Using deterministic values */}
                                <div className='grid grid-cols-2 gap-2'>
                                  <div className='text-center p-2 bg-secondary/50 rounded-lg'>
                                    <div className='text-sm font-bold'>{deterministicWeekly}%</div>
                                    <div className='text-xs text-muted-foreground'>Weekly</div>
                                  </div>
                                  <div className='text-center p-2 bg-secondary/50 rounded-lg'>
                                    <div className='text-sm font-bold'>{deterministicMonthly}%</div>
                                    <div className='text-xs text-muted-foreground'>Monthly</div>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Categories & Topics */}
                            {tag.categories && tag.categories.length > 0 && (
                              <div className='space-y-2'>
                                <div className='flex items-center gap-2'>
                                  <TagIcon className='w-3.5 h-3.5 text-muted-foreground' />
                                  <span className='text-xs font-medium'>Related Topics</span>
                                </div>
                                <div className='flex flex-wrap gap-1'>
                                  {tag.categories.slice(0, 3).map((category) => (
                                    <Badge
                                      key={category}
                                      variant='outline'
                                      size='sm'
                                      className='text-xs hover:bg-primary/10 hover:border-primary/30 cursor-pointer transition-colors'
                                      onClick={(e) => {
                                        e.preventDefault();
                                        setSelectedCategory(category);
                                      }}
                                    >
                                      {category}
                                    </Badge>
                                  ))}
                                  {tag.categories.length > 3 && (
                                    <Badge variant='ghost' size='sm' className='text-xs'>
                                      +{tag.categories.length - 3}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            )}
                          </CardContent>

                          <CardFooter className='pt-0'>
                            <Button className='w-full gap-2 group/btn hover:shadow-lg transition-all duration-300' variant='default' asChild>
                              <Link href={`/tags/${tag.slug}`}>
                                <span>Explore Topic</span>
                                <ArrowRight className='w-4 h-4 group-hover/btn:translate-x-1 transition-transform' />
                              </Link>
                            </Button>
                          </CardFooter>
                        </Card>
                      </motion.div>
                    );
                  })}
                </motion.div>
              ) : (
                // Enhanced List View with deterministic values
                <motion.div
                  key='list'
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className='space-y-3'
                >
                  {filteredTags.map((tag, index) => {
                    // Generate deterministic values for list view too
                    const deterministicScore = tag.trendingScore || (tag.articleCount ? Math.min(70 + (tag.articleCount % 30), 95) : 75);

                    return (
                      <motion.div
                        key={tag.slug}
                        layout
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{
                          duration: 0.3,
                          delay: Math.min(index * 0.02, 0.1),
                        }}
                        whileHover={{ x: 4 }}
                      >
                        <Card className='border border-border/50 hover:border-primary/30 hover:shadow-lg transition-all duration-300 group bg-gradient-to-r from-card via-card to-card/95'>
                          <div className='flex items-center p-4'>
                            {/* Tag Icon & Status */}
                            <div className='relative flex-shrink-0 mr-4'>
                              <div
                                className={`w-14 h-14 rounded-xl bg-gradient-to-br ${getTagColor(
                                  tag.articleCount || 0
                                )} flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow`}
                              >
                                <Hash className='w-7 h-7 text-white' />
                              </div>
                              {tag.isFeatured && (
                                <div className='absolute -top-1 -right-1'>
                                  <Sparkles className='w-4 h-4 text-amber-500' />
                                </div>
                              )}
                            </div>

                            {/* Content */}
                            <div className='flex-1 min-w-0'>
                              <div className='flex items-start justify-between mb-2'>
                                <div className='flex-1 min-w-0'>
                                  <Link
                                    href={`/tags/${tag.slug}`}
                                    className='text-lg font-bold group-hover:text-primary transition-colors truncate block'
                                  >
                                    #{tag.name}
                                  </Link>
                                  <p className='text-sm text-muted-foreground mt-1 line-clamp-1'>
                                    {tag.description || `Browse ${tag.articleCount || 0} articles and tutorials`}
                                  </p>
                                </div>
                                <div className='text-right ml-4'>
                                  <div className='text-xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent'>
                                    {formatCount(tag.articleCount || 0)}
                                  </div>
                                  <div className='text-xs text-muted-foreground'>articles</div>
                                </div>
                              </div>

                              {/* Stats & Categories */}
                              <div className='flex items-center flex-wrap gap-3'>
                                <div className='flex items-center gap-2'>
                                  {(tag.growthRate || 0) > 0 && (
                                    <Badge variant='secondary' size='sm' className={`gap-1 ${getGrowthColor(tag.growthRate)}`}>
                                      <TrendingUp className='w-3 h-3' />+{tag.growthRate}% growth
                                    </Badge>
                                  )}
                                  {deterministicScore > 80 && (
                                    <Badge variant='outline' size='sm' className='gap-1 border-red-200 text-red-600'>
                                      <Flame className='w-3 h-3' />
                                      Trending
                                    </Badge>
                                  )}
                                </div>

                                <div className='flex-1'></div>

                                {tag.categories &&
                                  tag.categories.slice(0, 2).map((category) => (
                                    <Badge
                                      key={category}
                                      variant='outline'
                                      size='sm'
                                      className='text-xs hover:bg-primary/10 cursor-pointer transition-colors'
                                      onClick={(e) => {
                                        e.preventDefault();
                                        setSelectedCategory(category);
                                      }}
                                    >
                                      {category}
                                    </Badge>
                                  ))}
                              </div>
                            </div>

                            {/* Action Button */}
                            <Button
                              size='sm'
                              variant='ghost'
                              className='ml-4 gap-2 group/action hover:bg-primary/10 hover:text-primary transition-all'
                              asChild
                            >
                              <Link href={`/tags/${tag.slug}`}>
                                <span>Explore</span>
                                <ChevronRight className='w-4 h-4 group-hover/action:translate-x-1 transition-transform' />
                              </Link>
                            </Button>
                          </div>
                        </Card>
                      </motion.div>
                    );
                  })}
                </motion.div>
              )}
            </div>
          ) : (
            // Enhanced Empty State
            <motion.div
              key='empty'
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4, type: "spring" }}
              className='text-center py-16 lg:py-24'
            >
              <div className='relative mx-auto w-40 h-40 mb-6'>
                <div className='absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/5 rounded-full blur-xl'></div>
                <div className='relative w-full h-full bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center'>
                  <Hash className='w-20 h-20 text-primary/40' />
                  <div className='absolute inset-0 flex items-center justify-center'>
                    <Search className='w-12 h-12 text-primary/50' />
                  </div>
                </div>
              </div>

              <h3 className='text-2xl lg:text-3xl font-bold mb-4'>No topics found</h3>
              <p className='text-muted-foreground mb-8 max-w-md mx-auto text-lg'>
                {searchTerm ? `We couldn't find any topics matching "${searchTerm}"` : "It looks like there are no topics available at the moment."}
              </p>

              <div className='flex flex-col sm:flex-row gap-3 justify-center'>
                <Button
                  variant='outline'
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("all");
                    setActiveTab("all");
                    setTimeRange("all");
                    setSortBy("popular");
                  }}
                  className='gap-2 group'
                >
                  <X className='w-4 h-4 group-hover:rotate-90 transition-transform' />
                  Clear all filters
                </Button>
                <Button asChild className='gap-2 group bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90'>
                  <Link href='/tags/new'>
                    <Plus className='w-4 h-4 group-hover:rotate-90 transition-transform' />
                    Suggest New Topic
                  </Link>
                </Button>
              </div>

              {/* Suggestions */}
              {searchTerm && (
                <div className='mt-12 pt-8 border-t border-border'>
                  <h4 className='text-sm font-semibold text-muted-foreground mb-4'>Try searching for:</h4>
                  <div className='flex flex-wrap gap-2 justify-center'>
                    {["JavaScript", "React", "Web Development", "CSS", "TypeScript"].map((suggestion) => (
                      <Button key={suggestion} variant='ghost' size='sm' onClick={() => setSearchTerm(suggestion)} className='text-sm'>
                        {suggestion}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tag Cloud Section */}
        {filteredTags.length > 0 && (
          <div className='mt-16'>
            <Card className='border bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-2xl flex items-center gap-2'>
                      <Zap className='w-5 h-5 text-primary' />
                      Interactive Tag Cloud
                    </CardTitle>
                    <CardDescription className='mt-1'>Click on any tag to explore related content</CardDescription>
                  </div>
                  <Button variant='ghost' size='sm' className='gap-2'>
                    <RefreshCw className='w-4 h-4' />
                    Randomize
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className='flex flex-wrap gap-3 justify-center min-h-[200px] items-center'>
                  {filteredTags.slice(0, 20).map((tag) => (
                    <motion.div key={tag.slug} initial={{ scale: 0 }} animate={{ scale: 1 }} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                      <Link
                        href={`/tags/${tag.slug}`}
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-medium outline ${getTagColor(
                          tag.articleCount || 0
                        )}  hover:shadow-lg transition-shadow ${getTagSize(tag.articleCount || 0)}`}
                      >
                        #{tag.name}
                        <span className='text-xs bg-white/20 px-2 py-0.5 rounded-full'>{formatCount(tag.articleCount || 0)}</span>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* CTA Section */}
        <div className='mt-16 pb-20'>
          <Card className='border bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10'>
            <CardContent className='p-8'>
              <div className='flex flex-col lg:flex-row items-center justify-between gap-6'>
                <div>
                  <h3 className='text-2xl font-bold mb-2'>Missing a Topic?</h3>
                  <p className='text-muted-foreground'>Suggest new topics or help us improve existing ones</p>
                </div>
                <div className='flex gap-3'>
                  <Button variant='outline' className='gap-2' asChild>
                    <Link href='/tags/suggest'>
                      <FaRegLightbulb className='w-4 h-4' />
                      Suggest Topic
                    </Link>
                  </Button>
                  <Button className='gap-2' asChild>
                    <Link href='/articles'>
                      <BookOpen className='w-4 h-4' />
                      Browse Articles
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
