"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { fadeIn, containerVariants, scaleUp } from "@/lib/motionVariants";
import { 
  FiArrowRight, FiFilter, FiGrid, FiList, FiBookOpen, 
  FiArrowLeft, FiTrendingUp, FiStar, FiEye, FiHeart,
  FiMessageCircle, FiClock, FiCalendar, FiSearch, FiX
} from "react-icons/fi";
import { 
  FaUser, FaFire, FaBookmark, FaShareAlt, FaFacebook,
  FaTwitter, FaLinkedin, FaCopy, FaCheck
} from "react-icons/fa";
import { 
  BookOpen, Hash, Tag as TagIcon, TrendingUp, Users, 
  Clock, BarChart3, Calendar, ChevronRight, Filter, 
  X, Home, Sparkles, Target, Zap, MessageCircle,
  Eye, Heart, Share2, ExternalLink, Download,
  Settings, Maximize2, Printer
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
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import { useRouter } from "next/navigation";

export default function SingleTagClient({ data }) {
  const { tag: currentTag, articles = [], relatedTags = [], count = 0 } = data || {};
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [activeTab, setActiveTab] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [timeRange, setTimeRange] = useState("all-time");
  const [showFilters, setShowFilters] = useState(false);
  const [showBookmarked, setShowBookmarked] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [fontSize, setFontSize] = useState("medium");

  const router = useRouter();

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
          article.authorId?.username?.toLowerCase().includes(query) ||
          article.tags?.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    // Tab filter
    if (activeTab === "popular") {
      filtered = filtered.filter((article) => (article.views || 0) > 100);
    } else if (activeTab === "trending") {
      const trendingThreshold = Math.max(100, Math.ceil(articles.length * 0.1));
      filtered = filtered.filter((article) => {
        const score = calculateTrendingScore(article);
        return score > trendingThreshold;
      });
    } else if (activeTab === "featured") {
      filtered = filtered.filter((article) => article.featured);
    }

    // Time range filter
    if (timeRange !== "all-time") {
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
      case "trending":
        filtered.sort((a, b) => {
          const scoreA = calculateTrendingScore(a);
          const scoreB = calculateTrendingScore(b);
          return scoreB - scoreA;
        });
        break;
      case "likes":
        filtered.sort((a, b) => (b.meta?.likes?.length || 0) - (a.meta?.likes?.length || 0));
        break;
      case "comments":
        filtered.sort((a, b) => (b.commentCount || 0) - (a.commentCount || 0));
        break;
      case "read-time":
        filtered.sort((a, b) => {
          const timeA = parseInt(a.readTime) || 0;
          const timeB = parseInt(b.readTime) || 0;
          return timeA - timeB;
        });
        break;
      case "newest":
      default:
        filtered.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
        break;
    }

    return filtered;
  }, [articles, searchTerm, sortBy, activeTab, timeRange]);

  const calculateTrendingScore = (article) => {
    const hoursSincePublished = (Date.now() - new Date(article.publishedAt).getTime()) / (1000 * 60 * 60);
    const recencyFactor = Math.max(0.1, 1 - hoursSincePublished / 168); // Decay over 1 week

    return (
      ((article.views || 0) * 0.5 + (article.meta?.likes?.length || 0) * 2 + (article.commentCount || 0) * 3) *
      recencyFactor
    );
  };

  // Calculate tag statistics
  const tagStats = useMemo(() => {
    const totalViews = articles?.reduce((sum, article) => sum + (article.views || 0), 0) || 0;
    const totalLikes = articles?.reduce((sum, article) => sum + (article.meta?.likes?.length || 0), 0) || 0;
    const totalComments = articles?.reduce((sum, article) => sum + (article.commentCount || 0), 0) || 0;
    const totalBookmarks = articles?.reduce((sum, article) => sum + (article.meta?.bookmarks?.length || 0), 0) || 0;
    const uniqueAuthors = new Set(articles?.map((article) => article.authorId?.username).filter(Boolean)).size;
    const avgReadTime =
      articles?.reduce((sum, article) => {
        const time = parseInt(article.readTime) || 5;
        return sum + time;
      }, 0) / (articles?.length || 1);

    // Most active authors
    const authorActivity = articles?.reduce((acc, article) => {
      const author = article.authorId?.username;
      if (author) {
        acc[author] = (acc[author] || 0) + 1;
      }
      return acc;
    }, {});

    const topAuthors = Object.entries(authorActivity || {})
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([name, count]) => ({ name, count }));

    return {
      totalViews,
      totalLikes,
      totalComments,
      totalBookmarks,
      uniqueAuthors,
      avgReadTime: avgReadTime.toFixed(1),
      topAuthors,
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

  const getTrendingLevel = (score) => {
    if (score > 1000) return { level: "high", label: "Hot", color: "from-red-500 to-pink-500" };
    if (score > 500) return { level: "medium", label: "Trending", color: "from-orange-500 to-amber-500" };
    if (score > 100) return { level: "low", label: "Popular", color: "from-blue-500 to-cyan-500" };
    return null;
  };

  const handleShare = (platform) => {
    const url = window.location.href;
    const title = `Articles tagged with #${currentTag}`;
    const text = `Explore ${count} articles about #${currentTag}`;
    const hashtags = currentTag;

    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}&hashtags=${hashtags}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    };

    if (platform === "copy") {
      navigator.clipboard.writeText(url);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } else if (shareUrls[platform]) {
      window.open(shareUrls[platform], "_blank", "noopener,noreferrer");
    } else if (navigator.share) {
      navigator.share({ title, text, url });
    }
  };

  // Stats cards configuration
  const stats = useMemo(() => [
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
      value: formatCount(tagStats.totalViews),
      icon: Eye,
      change: "+24%",
      color: "from-purple-500/10 to-purple-500/5",
      iconColor: "text-purple-500",
    },
    {
      label: "Engagement",
      value: formatCount(tagStats.totalLikes + tagStats.totalComments),
      icon: Users,
      change: "+8%",
      color: "from-emerald-500/10 to-emerald-500/5",
      iconColor: "text-emerald-500",
    },
    {
      label: "Avg Read Time",
      value: `${tagStats.avgReadTime} min`,
      icon: Clock,
      change: "-2%",
      color: "from-amber-500/10 to-amber-500/5",
      iconColor: "text-amber-500",
    },
  ], [count, tagStats.totalViews, tagStats.totalLikes, tagStats.totalComments, tagStats.avgReadTime, formatCount]);

  // Loading state
  if (!currentTag || !articles) {
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
                <FiArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
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
                onClick={() => router.push("/tags")}
                className="gap-2 hover:bg-primary/10"
              >
                <Hash className="w-4 h-4" />
                All Tags
              </Button>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
              <Badge variant="outline" className="font-normal">
                #{currentTag}
              </Badge>
            </div>
          </motion.div>

          {/* Tag Header */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-4xl mx-auto text-center mb-12"
          >
            <motion.div variants={fadeIn} className="mb-6">
              <Badge className="px-4 py-1 text-sm bg-primary/10 text-primary hover:bg-primary/20 mb-4">
                <TagIcon className="w-4 h-4 mr-2" />
                Topic
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
                <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                  #{currentTag}
                </span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Explore {formatCount(count)}+ curated articles about {currentTag}. From tutorials to deep dives, 
                find everything you need to know.
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

            {/* Action Buttons */}
            <motion.div
              variants={fadeIn}
              className="flex flex-wrap gap-3 justify-center mt-8"
            >
              <Button size="lg" className="gap-2 group" asChild>
                <Link href="/articles/new">
                  <FiBookOpen className="w-5 h-5" />
                  Write About #{currentTag}
                  <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="lg" className="gap-2">
                    <Share2 className="w-5 h-5" />
                    Share
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => handleShare("copy")}>
                    {isCopied ? <FaCheck className="w-4 h-4 mr-2 text-green-500" /> : <FaCopy className="w-4 h-4 mr-2" />}
                    {isCopied ? "Copied!" : "Copy Link"}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleShare("twitter")}>
                    <FaTwitter className="w-4 h-4 mr-2 text-blue-400" />
                    Share on Twitter
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleShare("facebook")}>
                    <FaFacebook className="w-4 h-4 mr-2 text-blue-600" />
                    Share on Facebook
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleShare("linkedin")}>
                    <FaLinkedin className="w-4 h-4 mr-2 text-blue-700" />
                    Share on LinkedIn
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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
                      placeholder={`Search ${count} articles about #${currentTag}...`}
                      className="pl-12 h-14 text-base bg-background/80 backdrop-blur-sm border-primary/20 focus:border-primary/40"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {searchTerm && (
                      <button
                        onClick={() => setSearchTerm("")}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 hover:scale-110 transition-transform"
                      >
                        <X className="w-5 h-5 text-muted-foreground" />
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
                        <SelectItem value="all-time">All Time</SelectItem>
                        <SelectItem value="today">Today</SelectItem>
                        <SelectItem value="week">This Week</SelectItem>
                        <SelectItem value="month">This Month</SelectItem>
                        <SelectItem value="year">This Year</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="sticky top-20 space-y-6">
              {/* Filters Card */}
              <motion.div variants={scaleUp}>
                <Card className="border hover:shadow-lg transition-all">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Filter className="w-4 h-4" />
                      Filters
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Sort By</Label>
                      <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger>
                          <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="newest">Newest First</SelectItem>
                          <SelectItem value="trending">Trending</SelectItem>
                          <SelectItem value="popular">Most Popular</SelectItem>
                          <SelectItem value="likes">Most Liked</SelectItem>
                          <SelectItem value="comments">Most Comments</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Max Read Time</Label>
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

                    <Separator />

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="featured-only">Featured Only</Label>
                        <Switch 
                          id="featured-only" 
                          checked={activeTab === "featured"}
                          onCheckedChange={(checked) => setActiveTab(checked ? "featured" : "all")}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="bookmarked-only">Bookmarked Only</Label>
                        <Switch 
                          id="bookmarked-only" 
                          checked={showBookmarked}
                          onCheckedChange={setShowBookmarked}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Top Authors */}
              <motion.div variants={scaleUp}>
                <Card className="border hover:shadow-lg transition-all">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Top Authors
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {tagStats.topAuthors.map((author, index) => (
                        <motion.div
                          key={author.name}
                          whileHover={{ x: 4 }}
                          className="flex items-center justify-between group cursor-pointer"
                        >
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 group-hover:from-primary/30 group-hover:to-primary/20 flex items-center justify-center">
                                <FaUser className="w-5 h-5 text-primary" />
                              </div>
                              {index < 3 && (
                                <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs flex items-center justify-center font-bold">
                                  {index + 1}
                                </div>
                              )}
                            </div>
                            <div>
                              <div className="font-medium">{author.name}</div>
                              <div className="text-xs text-muted-foreground">
                                {author.count} article{author.count !== 1 ? "s" : ""}
                              </div>
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1">
            {/* Results Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 flex items-center justify-between"
            >
              <div>
                <h2 className="text-2xl font-semibold">
                  {searchTerm ? `Search: "${searchTerm}"` : `Articles about #${currentTag}`}
                </h2>
                <p className="text-muted-foreground mt-1">
                  Showing {filteredArticles.length} of {articles.length} articles
                  {sortBy !== "newest" && ` • Sorted by ${sortBy}`}
                  {timeRange !== "all-time" && ` • ${timeRange}`}
                </p>
              </div>

              {(searchTerm || activeTab !== "all" || timeRange !== "all-time" || showBookmarked) && (
                <Button
                  variant="ghost"
                  onClick={() => {
                    setSearchTerm("");
                    setActiveTab("all");
                    setSortBy("newest");
                    setTimeRange("all-time");
                    setShowBookmarked(false);
                  }}
                  className="gap-2"
                >
                  <X className="w-4 h-4" />
                  Clear filters
                </Button>
              )}
            </motion.div>

            {/* Articles Grid/List */}
            <AnimatePresence>
              {filteredArticles.length > 0 ? (
                viewMode === "grid" ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredArticles.map((article, index) => {
                      const trendingInfo = getTrendingLevel(calculateTrendingScore(article));
                      const trendingScore = calculateTrendingScore(article);

                      return (
                        <motion.div
                          key={article._id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <Card className="h-full overflow-hidden border hover:shadow-xl transition-all duration-300 group hover:-translate-y-1">
                            {/* Article Header */}
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
                                {article.featured && (
                                  <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 border-0 backdrop-blur-sm">
                                    <FiStar className="w-3 h-3 mr-1" />
                                    Featured
                                  </Badge>
                                )}
                                {trendingInfo && (
                                  <Badge className={`bg-gradient-to-r ${trendingInfo.color} border-0 backdrop-blur-sm`}>
                                    <FaFire className="w-3 h-3 mr-1" />
                                    {trendingInfo.label}
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
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                  <Calendar className="w-3 h-3" />
                                  {formatDate(article.publishedAt)}
                                </div>
                                {article.category && (
                                  <>
                                    <div className="w-1 h-1 rounded-full bg-muted" />
                                    <div className="text-xs text-muted-foreground">{article.category}</div>
                                  </>
                                )}
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
                                    <Badge 
                                      key={tag} 
                                      variant="secondary" 
                                      size="sm"
                                      className="hover:bg-primary/20 cursor-pointer"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        router.push(`/tags/${tag.toLowerCase()}`);
                                      }}
                                    >
                                      #{tag}
                                    </Badge>
                                  ))}
                                </div>
                              )}

                              {/* Author and Stats */}
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  {article.authorId?.avatar ? (
                                    <img
                                      src={article.authorId.avatar}
                                      alt={article.authorId.username}
                                      className="w-8 h-8 rounded-full ring-2 ring-muted"
                                    />
                                  ) : (
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                                      <FaUser className="w-4 h-4 text-white" />
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
                              <Button variant="outline" className="w-full gap-2 group/btn" asChild>
                                <Link href={`/articles/${article._id}`}>
                                  Read Article
                                  <FiArrowRight className="group-hover/btn:translate-x-1 transition-transform" />
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
                      const trendingInfo = getTrendingLevel(calculateTrendingScore(article));

                      return (
                        <motion.div
                          key={article._id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ delay: index * 0.03 }}
                        >
                          <Card className="hover:shadow-lg transition-shadow group">
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
                                    {trendingInfo && (
                                      <Badge className={`absolute top-2 right-2 bg-gradient-to-r ${trendingInfo.color} border-0`}>
                                        <FaFire className="w-3 h-3 mr-1" />
                                        {trendingInfo.label}
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
                                      {article.category && (
                                        <Badge variant="secondary" size="sm">
                                          {article.category}
                                        </Badge>
                                      )}
                                      <span className="text-xs text-muted-foreground">{formatDate(article.publishedAt)}</span>
                                    </div>
                                    <Link
                                      href={`/articles/${article._id}`}
                                      className="text-xl font-semibold hover:text-primary transition-colors line-clamp-2"
                                    >
                                      {article.title}
                                    </Link>
                                    <p className="text-muted-foreground text-sm mt-2 line-clamp-2">{article.excerpt}</p>
                                  </div>
                                  {article.featured && (
                                    <Badge className="ml-2 bg-gradient-to-r from-amber-500 to-orange-500">
                                      <FiStar className="w-3 h-3" />
                                    </Badge>
                                  )}
                                </div>

                                {/* Tags */}
                                {article.tags && article.tags.length > 0 && (
                                  <div className="flex flex-wrap gap-1 mb-4">
                                    {article.tags.slice(0, 5).map((tag) => (
                                      <Badge 
                                        key={tag} 
                                        variant="secondary" 
                                        size="sm"
                                        className="hover:bg-primary/20 cursor-pointer"
                                        onClick={(e) => {
                                          e.preventDefault();
                                          e.stopPropagation();
                                          router.push(`/tags/${tag.toLowerCase()}`);
                                        }}
                                      >
                                        #{tag}
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
                                      <FiMessageCircle className="w-4 h-4" />
                                      {article.commentCount || 0}
                                    </span>
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
                    <TagIcon className="w-16 h-16 text-primary/30" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">No articles found</h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    {searchTerm
                      ? `No articles matching "${searchTerm}" found in #${currentTag}`
                      : `No articles tagged with #${currentTag} yet. Be the first to contribute!`}
                  </p>
                  <div className="flex gap-3 justify-center">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSearchTerm("");
                        setActiveTab("all");
                        setSortBy("newest");
                        setTimeRange("all-time");
                        setShowBookmarked(false);
                      }}
                    >
                      Clear filters
                    </Button>
                    <Button asChild className="gap-2">
                      <Link href={`/articles/new?tag=${currentTag}`}>
                        <FiBookOpen className="w-4 h-4" />
                        Write Article
                      </Link>
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Related Tags */}
            {relatedTags?.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-12"
              >
                <div className="mb-6">
                  <h3 className="text-2xl font-semibold mb-2 flex items-center gap-2">
                    <Hash className="w-5 h-5" />
                    Related Topics
                  </h3>
                  <p className="text-muted-foreground">Discover more content in related tags</p>
                </div>

                <div className="flex flex-wrap gap-3">
                  {relatedTags.slice(0, 12).map((tag, index) => (
                    <motion.div
                      key={tag.name}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link
                        href={`/tags/${tag.slug || tag.name.toLowerCase()}`}
                        className={`group relative inline-flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-300 hover:shadow-md ${
                          tag.name.toLowerCase() === currentTag.toLowerCase()
                            ? "bg-gradient-to-r from-primary to-purple-600 text-primary-foreground border-transparent"
                            : "bg-card hover:bg-accent border-border"
                        }`}
                      >
                        <Hash
                          className={`w-4 h-4 ${
                            tag.name.toLowerCase() === currentTag.toLowerCase() ? "text-primary-foreground" : "text-muted-foreground"
                          }`}
                        />
                        <span className="font-medium">{tag.name}</span>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            tag.name.toLowerCase() === currentTag.toLowerCase()
                              ? "bg-primary-foreground/20 text-primary-foreground"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {formatCount(tag.count)}
                        </span>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* CTA Section */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={scaleUp}
              className="mt-12 pb-20"
            >
              <div className="relative overflow-hidden rounded-2xl border bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 p-8">
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />

                <div className="relative z-10 text-center">
                  <div className="inline-flex items-center gap-3 mb-6">
                    <div className="p-3 rounded-full bg-gradient-to-r from-primary to-purple-600">
                      <FiBookOpen className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-3xl font-bold">Contribute to #{currentTag}</h3>
                  </div>
                  <p className="text-muted-foreground mb-8 max-w-2xl mx-auto text-lg">
                    Share your knowledge about {currentTag} with the community. Whether it's a tutorial, case study, or deep dive, your article can
                    help others learn.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button size="lg" className="gap-2" asChild>
                      <Link href={`/articles/new?tag=${currentTag}`}>
                        <FiBookOpen className="w-5 h-5" />
                        Start Writing
                      </Link>
                    </Button>
                    <Button size="lg" variant="outline" className="gap-2" asChild>
                      <Link href="/articles?tag=how-to">
                        View Writing Guide
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}