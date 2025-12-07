"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { fadeIn, containerVariants, scaleUp } from "@/lib/motionVariants";
import { 
  FiClock, FiArrowRight, FiSearch, FiChevronLeft, 
  FiUsers, FiArrowLeft, FiEye, FiHeart, FiMessageSquare,
  FiTrendingUp, FiGrid, FiList, FiStar, FiFilter, FiX
} from "react-icons/fi";
import { 
  FaUser, FaFire, FaChartLine, FaTags, FaBookmark,
  FaFacebook, FaTwitter, FaLinkedin, FaShareAlt
} from "react-icons/fa";
import { 
  BookOpen, TrendingUp, ArrowLeft, Home, ChevronRight,
  Sparkles, Target, Hash, Calendar, Clock, Eye, Heart,
  MessageCircle, Share2, Users, Zap, BarChart3, Filter,
  ExternalLink, Download, Printer, Settings, Maximize2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { useRouter } from "next/navigation";

export default function SingleCategoryClient({ data }) {
  const { category, articles = [], relatedCategories = [], count = 0 } = data || {};
  const router = useRouter();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [activeTab, setActiveTab] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [timeRange, setTimeRange] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [showBookmarked, setShowBookmarked] = useState(false);

  const filteredArticles = useMemo(() => {
    if (!Array.isArray(articles)) return [];

    let filtered = articles;

    // Search filter
    if (searchTerm) {
      const query = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (article) =>
          article.title?.toLowerCase().includes(query) ||
          article.excerpt?.toLowerCase().includes(query) ||
          article.tags?.some((tag) => tag.toLowerCase().includes(query)) ||
          article.authorId?.username?.toLowerCase().includes(query)
      );
    }

    // Tab filter
    if (activeTab === "popular") {
      filtered = filtered.filter((article) => (article.views || 0) > 100);
    } else if (activeTab === "featured") {
      filtered = filtered.filter((article) => article.featured);
    } else if (activeTab === "trending") {
      filtered = filtered.filter((article) => {
        const score = (article.views || 0) + (article.meta?.likes?.length || 0) * 2;
        return score > 500;
      });
    }

    // Time range filter
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

    // Sort articles
    switch (sortBy) {
      case "popular":
        filtered.sort((a, b) => (b.views || 0) - (a.views || 0));
        break;
      case "likes":
        filtered.sort((a, b) => (b.meta?.likes?.length || 0) - (a.meta?.likes?.length || 0));
        break;
      case "comments":
        filtered.sort((a, b) => (b.commentCount || 0) - (a.commentCount || 0));
        break;
      case "trending":
        filtered.sort((a, b) => {
          const scoreA = (b.views || 0) + (b.meta?.likes?.length || 0) * 2;
          const scoreB = (a.views || 0) + (a.meta?.likes?.length || 0) * 2;
          return scoreA - scoreB;
        });
        break;
      case "newest":
      default:
        filtered.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
        break;
    }

    return filtered;
  }, [articles, searchTerm, sortBy, activeTab, timeRange, showBookmarked]);

  // Category stats
  const categoryStats = useMemo(() => {
    const totalViews = articles?.reduce((sum, article) => sum + (article.views || 0), 0) || 0;
    const totalLikes = articles?.reduce((sum, article) => sum + (article.meta?.likes?.length || 0), 0) || 0;
    const totalComments = articles?.reduce((sum, article) => sum + (article.commentCount || 0), 0) || 0;
    const uniqueAuthors = new Set(articles?.map((article) => article.authorId?.username).filter(Boolean)).size;
    const avgReadTime = articles?.reduce((sum, article) => {
      const time = parseInt(article.readTime) || 5;
      return sum + time;
    }, 0) / (articles?.length || 1);

    const trendingArticles = articles?.filter(article => {
      const score = (article.views || 0) + (article.meta?.likes?.length || 0) * 2;
      return score > 500;
    }).length || 0;

    const featuredArticles = articles?.filter(article => article.featured).length || 0;

    return { 
      totalViews, 
      totalLikes, 
      totalComments, 
      uniqueAuthors, 
      avgReadTime: Math.round(avgReadTime),
      trendingArticles,
      featuredArticles
    };
  }, [articles]);

  const formatCount = (count) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count?.toString() || "0";
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

  // Stats cards configuration
  const stats = [
    {
      label: "Articles",
      value: formatCount(count),
      icon: BookOpen,
      change: "+12%",
      color: "from-blue-500/10 to-blue-500/5",
      iconColor: "text-blue-500",
    },
    {
      label: "Total Views",
      value: formatCount(categoryStats.totalViews),
      icon: Eye,
      change: "+24%",
      color: "from-purple-500/10 to-purple-500/5",
      iconColor: "text-purple-500",
    },
    {
      label: "Writers",
      value: categoryStats.uniqueAuthors,
      icon: Users,
      change: "+8%",
      color: "from-emerald-500/10 to-emerald-500/5",
      iconColor: "text-emerald-500",
    },
    {
      label: "Avg. Read",
      value: `${categoryStats.avgReadTime} min`,
      icon: Clock,
      change: "-2%",
      color: "from-amber-500/10 to-amber-500/5",
      iconColor: "text-amber-500",
    },
  ];

  // Loading state
  if (!category || !articles) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-8">
            <Skeleton className="h-12 w-64" />
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[1,2,3,4].map(i => <Skeleton key={i} className="h-24" />)}
            </div>
            <Skeleton className="h-96 w-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5">
      {/* Hero Header */}
      <div className="relative overflow-hidden border-b bg-gradient-to-br from-background via-background to-primary/5">
        {/* Gradient Orbs */}
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Navigation */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                onClick={() => router.back()}
                className="gap-2 group hover:bg-primary/10"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Back
              </Button>
              <Separator orientation="vertical" className="h-6" />
              <Button
                variant="ghost"
                onClick={() => router.push("/")}
                className="gap-2 hover:bg-primary/10"
              >
                <Home className="w-4 h-4" />
                Home
              </Button>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
              <Button
                variant="ghost"
                onClick={() => router.push("/categories")}
                className="gap-2 hover:bg-primary/10"
              >
                <BookOpen className="w-4 h-4" />
                Categories
              </Button>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
              <Badge variant="outline" className="font-normal">
                {category.name}
              </Badge>
            </div>
          </motion.div>

          {/* Category Header */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-4xl mx-auto text-center mb-12"
          >
            <motion.div variants={fadeIn} className="mb-6">
              <Badge className="px-4 py-1 text-sm bg-primary/10 text-primary hover:bg-primary/20 mb-4">
                <Target className="w-4 h-4 mr-2" />
                Category
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
                <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                  {category.name}
                </span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                {category.description || `Explore ${count}+ articles about ${category.name}`}
              </p>
            </motion.div>

            {/* Stats Cards */}
            <motion.div
              variants={fadeIn}
              className="grid grid-cols-2 lg:grid-cols-4 gap-4"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  variants={scaleUp}
                  whileHover={{ y: -4 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className={`border bg-gradient-to-br ${stat.color} backdrop-blur-sm hover:shadow-lg transition-all`}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className={`p-3 rounded-xl ${stat.color.replace("bg-gradient-to-br", "bg").replace("10", "20").replace("5", "10")}`}>
                          <stat.icon className={`w-4 h-4 ${stat.iconColor}`} />
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {stat.change}
                        </Badge>
                      </div>
                      <div className="text-3xl font-bold mb-1">{stat.value}</div>
                      <div className="text-sm text-muted-foreground">{stat.label}</div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Search & Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border bg-background/50 backdrop-blur-sm">
              <CardContent className="p-6">
                {/* Main Search */}
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-purple-500/5 rounded-xl blur-xl opacity-50" />
                  <div className="relative">
                    <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground z-10" />
                    <Input
                      type="text"
                      placeholder={`Search ${category.name} articles, topics, or authors...`}
                      className="pl-12 h-14 text-base bg-background/80 backdrop-blur-sm border-primary/20 focus:border-primary/40"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {searchTerm && (
                      <button
                        onClick={() => setSearchTerm("")}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 hover:scale-110 transition-transform"
                      >
                        <FiX className="w-5 h-5 text-muted-foreground" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="flex flex-wrap items-center justify-between gap-4">
                  {/* Quick Filter Chips */}
                  <div className="flex flex-wrap gap-2">
                    <Badge
                      variant={activeTab === "all" ? "default" : "outline"}
                      className="cursor-pointer hover:bg-primary/10"
                      onClick={() => setActiveTab("all")}
                    >
                      <Hash className="w-3 h-3 mr-1" />
                      All Articles
                    </Badge>
                    <Badge
                      variant={activeTab === "trending" ? "default" : "outline"}
                      className="cursor-pointer hover:bg-primary/10"
                      onClick={() => setActiveTab("trending")}
                    >
                      <FiTrendingUp className="w-3 h-3 mr-1" />
                      Trending
                    </Badge>
                    <Badge
                      variant={activeTab === "featured" ? "default" : "outline"}
                      className="cursor-pointer hover:bg-primary/10"
                      onClick={() => setActiveTab("featured")}
                    >
                      <FiStar className="w-3 h-3 mr-1" />
                      Featured
                    </Badge>
                  </div>

                  {/* View Controls */}
                  <div className="flex items-center gap-3">
                    <div className="hidden sm:flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">View:</span>
                      <div className="flex border rounded-lg overflow-hidden">
                        <Button
                          variant={viewMode === "grid" ? "default" : "ghost"}
                          size="sm"
                          onClick={() => setViewMode("grid")}
                          className="rounded-none px-4"
                        >
                          <FiGrid className="w-4 h-4" />
                          <span className="ml-2">Grid</span>
                        </Button>
                        <Button
                          variant={viewMode === "list" ? "default" : "ghost"}
                          size="sm"
                          onClick={() => setViewMode("list")}
                          className="rounded-none px-4"
                        >
                          <FiList className="w-4 h-4" />
                          <span className="ml-2">List</span>
                        </Button>
                      </div>
                    </div>

                    <Select value={timeRange} onValueChange={setTimeRange}>
                      <SelectTrigger className="w-[140px]">
                        <Clock className="w-4 h-4 mr-2" />
                        <SelectValue placeholder="Time range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Time</SelectItem>
                        <SelectItem value="today">Today</SelectItem>
                        <SelectItem value="week">This Week</SelectItem>
                        <SelectItem value="month">This Month</SelectItem>
                        <SelectItem value="year">This Year</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Advanced Filters */}
                <div className="mt-5 pt-5 border-t">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Filter className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Advanced Filters</span>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => setShowFilters(!showFilters)} className="gap-2">
                      {showFilters ? "Hide" : "Show"} Filters
                      <FiChevronLeft className={`transition-transform ${showFilters ? "rotate-90" : "-rotate-90"}`} />
                    </Button>
                  </div>

                  <AnimatePresence>
                    {showFilters && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t">
                          <div>
                            <Label className="text-sm font-medium mb-2 block">Sort By</Label>
                            <Select value={sortBy} onValueChange={setSortBy}>
                              <SelectTrigger>
                                <SelectValue placeholder="Sort by" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="newest">Newest First</SelectItem>
                                <SelectItem value="popular">Most Popular</SelectItem>
                                <SelectItem value="trending">Trending</SelectItem>
                                <SelectItem value="likes">Most Liked</SelectItem>
                                <SelectItem value="comments">Most Comments</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <Label className="text-sm font-medium mb-2 block">Read Time</Label>
                            <Select defaultValue="any">
                              <SelectTrigger>
                                <SelectValue placeholder="Any length" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="any">Any Length</SelectItem>
                                <SelectItem value="5">≤ 5 min</SelectItem>
                                <SelectItem value="10">≤ 10 min</SelectItem>
                                <SelectItem value="15">≤ 15 min</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="flex items-end">
                            <div className="flex items-center space-x-2">
                              <Switch id="bookmarked-only" checked={showBookmarked} onCheckedChange={setShowBookmarked} />
                              <Label htmlFor="bookmarked-only" className="text-sm">
                                Show bookmarked only
                              </Label>
                            </div>
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Results Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold">
              {searchTerm ? `Search: "${searchTerm}"` : `Latest ${category.name} Articles`}
            </h2>
            <p className="text-muted-foreground mt-1">
              Showing {filteredArticles.length} of {articles.length} articles
              {sortBy !== "newest" && ` • Sorted by ${sortBy}`}
              {timeRange !== "all" && ` • ${timeRange}`}
            </p>
          </div>

          {(searchTerm || activeTab !== "all" || timeRange !== "all" || showBookmarked) && (
            <Button
              variant="ghost"
              onClick={() => {
                setSearchTerm("");
                setActiveTab("all");
                setSortBy("newest");
                setTimeRange("all");
                setShowBookmarked(false);
              }}
              className="gap-2"
            >
              <FiX className="w-4 h-4" />
              Clear filters
            </Button>
          )}
        </div>

        {/* Articles Grid/List */}
        <AnimatePresence>
          {filteredArticles.length > 0 ? (
            viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredArticles.map((article, index) => {
                  const isTrending = (article.views || 0) > 1000;
                  const isFeatured = article.featured;

                  return (
                    <motion.div
                      key={article._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card className="h-full overflow-hidden border hover:shadow-lg transition-all duration-300 group hover:-translate-y-1">
                        {/* Article Image */}
                        <div className="relative h-48 overflow-hidden">
                          {article.featuredImage ? (
                            <>
                              <img
                                src={article.featuredImage}
                                alt={article.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                            </>
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
                              <BookOpen className="w-16 h-16 text-primary/30" />
                            </div>
                          )}

                          {/* Badges */}
                          <div className="absolute top-3 left-3 flex gap-2">
                            {isFeatured && (
                              <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 border-0 backdrop-blur-sm">
                                <FiStar className="w-3 h-3 mr-1" />
                                Featured
                              </Badge>
                            )}
                            {isTrending && (
                              <Badge className="bg-gradient-to-r from-red-500 to-pink-500 border-0 backdrop-blur-sm">
                                <FaFire className="w-3 h-3 mr-1" />
                                Trending
                              </Badge>
                            )}
                          </div>

                          {/* Read Time */}
                          <Badge variant="secondary" className="absolute top-3 right-3 backdrop-blur-sm bg-white/10 border-white/20">
                            <Clock className="w-3 h-3 mr-1" />
                            {article.readTime || "5 min"}
                          </Badge>
                        </div>

                        <CardHeader className="pb-3">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="text-xs text-muted-foreground flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {formatDate(article.publishedAt)}
                            </div>
                          </div>

                          <CardTitle className="line-clamp-2 text-lg group-hover:text-primary transition-colors">
                            <Link href={`/articles/${article._id}`} className="hover:underline">
                              {article.title}
                            </Link>
                          </CardTitle>
                        </CardHeader>

                        <CardContent className="pb-4">
                          <p className="text-muted-foreground text-sm line-clamp-2 mb-4">{article.excerpt}</p>

                          {/* Tags */}
                          {article.tags && article.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-4">
                              {article.tags.slice(0, 3).map((tag) => (
                                <Badge key={tag} variant="secondary" size="sm">
                                  {tag}
                                </Badge>
                              ))}
                              {article.tags.length > 3 && (
                                <Badge variant="outline" size="sm">
                                  +{article.tags.length - 3}
                                </Badge>
                              )}
                            </div>
                          )}

                          {/* Author and Stats */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {article.authorId?.avatar ? (
                                <img
                                  src={article.authorId.avatar}
                                  alt={article.authorId.username}
                                  className="w-6 h-6 rounded-full ring-1 ring-muted"
                                />
                              ) : (
                                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                                  <FaUser className="w-3 h-3 text-white" />
                                </div>
                              )}
                              <span className="text-sm font-medium">{article.authorId?.username || "Anonymous"}</span>
                            </div>

                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <FiEye className="w-3.5 h-3.5" />
                                {formatCount(article.views || 0)}
                              </span>
                              <span className="flex items-center gap-1">
                                <FiHeart className="w-3.5 h-3.5" />
                                {article.meta?.likes?.length || 0}
                              </span>
                            </div>
                          </div>
                        </CardContent>

                        <CardFooter className="pt-0">
                          <Button variant="outline" size="sm" className="w-full gap-2 group/btn" asChild>
                            <Link href={`/articles/${article._id}`}>
                              Read Article
                              <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                            </Link>
                          </Button>
                        </CardFooter>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              // List View
              <div className="space-y-4">
                {filteredArticles.map((article, index) => {
                  const isTrending = (article.views || 0) > 1000;
                  const isFeatured = article.featured;

                  return (
                    <motion.div
                      key={article._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.03 }}
                    >
                      <Card className="border hover:shadow-md transition-shadow group">
                        <div className="flex flex-col md:flex-row">
                          {/* Image */}
                          <div className="md:w-48 flex-shrink-0">
                            <Link href={`/articles/${article._id}`} className="block h-full">
                              <div className="relative h-48 md:h-full overflow-hidden">
                                {article.featuredImage ? (
                                  <img
                                    src={article.featuredImage}
                                    alt={article.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
                                    <BookOpen className="w-12 h-12 text-primary/30" />
                                  </div>
                                )}
                                {isTrending && (
                                  <Badge className="absolute top-2 right-2 bg-gradient-to-r from-red-500 to-pink-500 border-0">
                                    <FaFire className="w-3 h-3 mr-1" />
                                  </Badge>
                                )}
                              </div>
                            </Link>
                          </div>

                          {/* Content */}
                          <div className="flex-1 p-6">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    {formatDate(article.publishedAt)}
                                  </span>
                                </div>
                                <Link
                                  href={`/articles/${article._id}`}
                                  className="text-xl font-semibold hover:text-primary transition-colors line-clamp-2"
                                >
                                  {article.title}
                                </Link>
                                <p className="text-muted-foreground text-sm mt-2 line-clamp-2">{article.excerpt}</p>
                              </div>
                              {isFeatured && (
                                <Badge className="ml-2 bg-gradient-to-r from-amber-500 to-orange-500">
                                  <FiStar className="w-3 h-3" />
                                </Badge>
                              )}
                            </div>

                            {/* Tags */}
                            {article.tags && article.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 mb-4">
                                {article.tags.slice(0, 5).map((tag) => (
                                  <Badge key={tag} variant="secondary" size="sm">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            )}

                            <div className="flex items-center justify-between mt-4">
                              <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                  {article.authorId?.avatar ? (
                                    <img src={article.authorId.avatar} alt={article.authorId.username} className="w-6 h-6 rounded-full" />
                                  ) : (
                                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                                      <FaUser className="w-3 h-3 text-white" />
                                    </div>
                                  )}
                                  <span className="text-sm font-medium">{article.authorId?.username || "Anonymous"}</span>
                                </div>
                                <span className="text-sm text-muted-foreground flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {article.readTime || "5 min"}
                                </span>
                              </div>

                              <div className="flex items-center gap-4">
                                <span className="text-sm text-muted-foreground flex items-center gap-1">
                                  <FiEye className="w-4 h-4" />
                                  {formatCount(article.views || 0)}
                                </span>
                                <span className="text-sm text-muted-foreground flex items-center gap-1">
                                  <FiHeart className="w-4 h-4" />
                                  {article.meta?.likes?.length || 0}
                                </span>
                                <span className="text-sm text-muted-foreground flex items-center gap-1">
                                  <FiMessageSquare className="w-4 h-4" />
                                  {article.commentCount || 0}
                                </span>
                                <Button size="sm" variant="ghost" className="gap-2" asChild>
                                  <Link href={`/articles/${article._id}`}>
                                    Read
                                    <ChevronRight className="w-4 h-4" />
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
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-16">
              <div className="w-32 h-32 mx-auto bg-gradient-to-br from-primary/10 to-primary/5 rounded-full flex items-center justify-center mb-6">
                <BookOpen className="w-16 h-16 text-primary/30" />
              </div>
              <h3 className="text-2xl font-bold mb-3">No articles found</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                {searchTerm ? `No articles matching "${searchTerm}" found in ${category.name}` : `No articles available in ${category.name}`}
              </p>
              <div className="flex gap-3 justify-center">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("");
                    setActiveTab("all");
                    setSortBy("newest");
                    setTimeRange("all");
                    setShowBookmarked(false);
                  }}
                >
                  Clear filters
                </Button>
                <Button asChild className="gap-2">
                  <Link href={`/articles/new?category=${category._id}`}>
                    <BookOpen className="w-4 h-4" />
                    Write Article
                  </Link>
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Related Categories */}
        {relatedCategories?.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-12"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold">Explore Related Categories</h3>
              <Button variant="ghost" asChild className="gap-2">
                <Link href="/categories">
                  View All Categories
                  <ArrowLeft className="w-4 h-4 rotate-180" />
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {relatedCategories.slice(0, 4).map((relatedCat, index) => (
                <motion.div
                  key={relatedCat._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    href={`/categories/${relatedCat.slug}`}
                    className="group block p-6 rounded-xl border hover:border-primary/30 bg-gradient-to-br from-background via-background to-primary/5 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 rounded-lg bg-gradient-to-r from-primary/10 to-primary/5 group-hover:from-primary/20 group-hover:to-primary/10">
                        <Target className="w-5 h-5 text-primary" />
                      </div>
                      <Badge variant="secondary">{relatedCat.count} articles</Badge>
                    </div>
                    <h4 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">{relatedCat.name}</h4>
                    {relatedCat.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">{relatedCat.description}</p>
                    )}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Newsletter */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={scaleUp}
          className="mt-12 pb-20"
        >
          <Card className="border bg-gradient-to-br from-primary/10 via-primary/5 to-primary/10 border-primary/20">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="text-center md:text-left">
                  <div className="inline-flex items-center gap-2 mb-4">
                    <Sparkles className="w-6 h-6 text-primary" />
                    <h3 className="text-2xl font-bold">Stay Updated</h3>
                  </div>
                  <p className="text-muted-foreground max-w-lg">
                    Get the latest articles about {category.name} and related topics delivered to your inbox
                  </p>
                </div>
                <div className="w-full md:w-auto">
                  <form className="flex flex-col sm:flex-row gap-3">
                    <Input
                      type="email"
                      placeholder="Your email address"
                      className="bg-background min-w-[280px]"
                      required
                    />
                    <Button type="submit" className="gap-2 whitespace-nowrap">
                      <BookOpen className="w-4 h-4" />
                      Subscribe
                    </Button>
                  </form>
                  <p className="text-xs text-muted-foreground text-center md:text-left mt-3">
                    No spam. Unsubscribe anytime.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}