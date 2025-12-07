"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { fadeInUp, staggerContainer, scaleUp } from "@/lib/motionVariants";
import { genericFetchData } from "@/lib/genericFetchData";
import {
  Search,
  Clock,
  User,
  Calendar,
  Tag as TagIcon,
  BookOpen,
  ChevronRight,
  Filter,
  X,
  TrendingUp,
  Eye,
  Heart,
  MessageCircle,
  Hash,
  Sparkles,
  Target,
  BarChart3,
  Home,
  ArrowLeft,
  ArrowRight,
  Star,
  Flame,
  Zap,
  TrendingUp as TrendingUpIcon,
  Bookmark,
  Share2,
  MoreVertical,
} from "lucide-react";
import {
  FiSearch,
  FiClock,
  FiUser,
  FiCalendar,
  FiBookOpen,
  FiChevronRight,
  FiFilter,
  FiX,
  FiTrendingUp,
  FiEye,
  FiHeart,
  FiMessageSquare,
  FiHash,
  FiStar,
  FiArrowLeft,
  FiHome,
  FiBookmark,
  FiShare2,
  FiMoreVertical,
} from "react-icons/fi";
import { FaFire, FaStar, FaBookmark, FaRegBookmark } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function SearchClient({ initialQuery = "", initialResults = [], availableTags = [] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState(initialResults);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [activeFilters, setActiveFilters] = useState({
    tags: [],
    sortBy: "relevance",
    timeRange: "all",
    contentType: "all",
    featuredOnly: false,
    minReadTime: 0,
    maxReadTime: 60,
  });
  const [showFilters, setShowFilters] = useState(false);
  const [searchStats, setSearchStats] = useState({
    totalResults: 0,
    categories: 0,
    authors: 0,
    avgRelevance: 0,
    avgReadTime: 0,
  });
  const [mounted, setMounted] = useState(false);
  const [selectedTab, setSelectedTab] = useState("all");

  // Set mounted to true on component mount
  useEffect(() => {
    setMounted(true);
    setIsInitialLoad(false);
  }, []);

  // Update results when query changes from URL
  useEffect(() => {
    const urlQuery = searchParams.get("q") || "";
    if (urlQuery !== query) {
      setQuery(urlQuery);
      if (urlQuery.trim()) {
        performSearch(urlQuery);
      }
    }
  }, [searchParams]);

  const performSearch = useCallback(async (searchQuery) => {
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        q: searchQuery,
        sortBy: activeFilters.sortBy,
        timeRange: activeFilters.timeRange,
        tags: activeFilters.tags.join(","),
        contentType: activeFilters.contentType,
        featuredOnly: activeFilters.featuredOnly.toString(),
        minReadTime: activeFilters.minReadTime,
        maxReadTime: activeFilters.maxReadTime,
      });

      const [data, error] = await genericFetchData(`/api/search?${params.toString()}`);

      if (!error && data) {
        setResults(data.results || []);
        setSearchStats({
          totalResults: data.total || 0,
          categories: data.categories || 0,
          authors: data.authors || 0,
          avgRelevance: data.avgRelevance || 0,
          avgReadTime: data.avgReadTime || 0,
        });
      }
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setIsLoading(false);
    }
  }, [activeFilters]);

  const handleSearch = useCallback((e) => {
    e?.preventDefault();
    if (!query.trim()) return;

    performSearch(query);
    router.push(`/search?q=${encodeURIComponent(query)}`);
  }, [query, performSearch, router]);

  const handleQuickSearch = useCallback((quickQuery) => {
    setQuery(quickQuery);
    setTimeout(() => {
      handleSearch();
    }, 100);
  }, [handleSearch]);

  const toggleTagFilter = useCallback((tag) => {
    setActiveFilters((prev) => {
      const newTags = prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag];
      return { ...prev, tags: newTags };
    });
  }, []);

  const clearFilters = useCallback(() => {
    setActiveFilters({
      tags: [],
      sortBy: "relevance",
      timeRange: "all",
      contentType: "all",
      featuredOnly: false,
      minReadTime: 0,
      maxReadTime: 60,
    });
    if (query) {
      performSearch(query);
    }
  }, [query, performSearch]);

  const applyFilters = useCallback(() => {
    performSearch(query);
    setShowFilters(false);
  }, [query, performSearch]);

  // Memoized calculations
  const postsByCategory = useMemo(() => {
    return results.reduce((acc, post) => {
      const category = post.categories?.[0]?.name || "Uncategorized";
      if (!acc[category]) acc[category] = [];
      acc[category].push(post);
      return acc;
    }, {});
  }, [results]);

  const popularTags = useMemo(() => {
    const tagCounts = {};
    results.forEach(post => {
      post.tags?.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });
    return Object.entries(tagCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([name, count]) => ({ name, count }));
  }, [results]);

  const formatDate = useCallback((dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 1) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays}d ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  }, []);

  const formatCount = useCallback((count) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count;
  }, []);

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const scaleUp = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.4, ease: "easeOut" }
    }
  };

  const pulseAnimation = {
    initial: { scale: 1 },
    animate: { 
      scale: [1, 1.05, 1],
      transition: { duration: 2, repeat: Infinity }
    }
  };

  // Constants
  const sortOptions = [
    { value: "relevance", label: "Relevance", icon: FiSearch, color: "text-blue-500" },
    { value: "newest", label: "Newest", icon: Calendar, color: "text-emerald-500" },
    { value: "popular", label: "Most Popular", icon: TrendingUpIcon, color: "text-purple-500" },
    { value: "trending", label: "Trending", icon: Flame, color: "text-rose-500" },
    { value: "likes", label: "Most Liked", icon: Heart, color: "text-pink-500" },
    { value: "readTime", label: "Read Time", icon: Clock, color: "text-amber-500" },
  ];

  const timeRanges = [
    { value: "all", label: "All Time", color: "bg-blue-500" },
    { value: "today", label: "Today", color: "bg-emerald-500" },
    { value: "week", label: "This Week", color: "bg-purple-500" },
    { value: "month", label: "This Month", color: "bg-rose-500" },
    { value: "year", label: "This Year", color: "bg-amber-500" },
  ];

  const contentTypes = [
    { value: "all", label: "All Content", icon: BookOpen, color: "text-blue-500" },
    { value: "articles", label: "Articles", icon: BookOpen, color: "text-emerald-500" },
    { value: "tutorials", label: "Tutorials", icon: Zap, color: "text-purple-500" },
    { value: "guides", label: "Guides", icon: Target, color: "text-rose-500" },
    { value: "reviews", label: "Reviews", icon: Star, color: "text-amber-500" },
  ];

  const quickSearches = [
    { label: "React", icon: "⚛️", color: "from-blue-500 to-cyan-500", category: "Frontend" },
    { label: "Next.js", icon: "▲", color: "from-purple-500 to-pink-500", category: "Framework" },
    { label: "TypeScript", icon: "TS", color: "from-blue-600 to-blue-400", category: "Language" },
    { label: "Tailwind CSS", icon: "🎨", color: "from-teal-500 to-emerald-500", category: "CSS" },
    { label: "Node.js", icon: "🟢", color: "from-green-500 to-emerald-500", category: "Backend" },
    { label: "AI/ML", icon: "🧠", color: "from-purple-600 to-pink-600", category: "AI" },
  ];

  // Stats cards
  const stats = useMemo(() => [
    {
      label: "Total Results",
      value: formatCount(results.length),
      icon: BarChart3,
      color: "from-blue-500 to-cyan-500",
      iconColor: "text-blue-500",
      trend: "+12%",
      description: "Found results",
    },
    {
      label: "Categories",
      value: Object.keys(postsByCategory).length,
      icon: Target,
      color: "from-emerald-500 to-teal-500",
      iconColor: "text-emerald-500",
      trend: "+8%",
      description: "Different categories",
    },
    {
      label: "Authors",
      value: new Set(results.map((post) => post.authorId?.username).filter(Boolean)).size,
      icon: User,
      color: "from-purple-500 to-pink-500",
      iconColor: "text-purple-500",
      trend: "+15%",
      description: "Unique authors",
    },
    {
      label: "Avg. Read Time",
      value: `${Math.round(searchStats.avgReadTime || 0)} min`,
      icon: Clock,
      color: "from-amber-500 to-orange-500",
      iconColor: "text-amber-500",
      trend: "-2%",
      description: "Average reading time",
    },
  ], [results, postsByCategory, searchStats, formatCount]);

  // Don't render animations until mounted to prevent hydration issues
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="h-96 flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5 pb-20">
      {/* Hero Section with gradient */}
      <section className="relative overflow-hidden border-b bg-gradient-to-br from-primary/10 via-primary/5 to-transparent">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute top-0 right-1/4 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Navigation */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={() => router.back()} className="gap-2 group border-primary/20 hover:border-primary/40">
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Back
              </Button>
              <Separator orientation="vertical" className="h-6" />
              <Button variant="ghost" onClick={() => router.push("/")} className="gap-2 hover:bg-primary/10">
                <Home className="w-4 h-4" />
                Home
              </Button>
            </div>
          </motion.div>

          {/* Hero Content */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="max-w-4xl mx-auto mb-12"
          >
            <motion.div variants={fadeInUp} className="text-center mb-8">
              <Badge className="px-4 py-2 bg-gradient-to-r from-primary to-purple-500 text-white hover:from-primary/90 hover:to-purple-500/90 mb-4 border-0">
                <Search className="w-4 h-4 mr-2" />
                Search Results
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
                Search:{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-500 to-pink-500">
                  {query || "Discover"}
                </span>
              </h1>
              <p className="text-xl text-muted-foreground">
                {results.length > 0
                  ? `Found ${formatCount(results.length)} results across ${Object.keys(postsByCategory).length} categories`
                  : "Explore articles, tutorials, and guides across all topics"}
              </p>
            </motion.div>

            {/* Stats Grid */}
            <motion.div variants={fadeInUp} className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  variants={scaleUp}
                  whileHover={{ y: -4 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="border border-primary/20 hover:border-primary/40 hover:shadow-xl transition-all duration-300 group backdrop-blur-sm bg-background/50">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} bg-opacity-10`}>
                          <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
                        </div>
                        <Badge variant="outline" className="text-xs bg-primary/10">
                          {stat.trend}
                        </Badge>
                      </div>
                      <div className="text-3xl font-bold mb-1 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                        {stat.value}
                      </div>
                      <div className="text-sm font-medium mb-1">{stat.label}</div>
                      <div className="text-xs text-muted-foreground">{stat.description}</div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>

            {/* Search Input Card */}
            <motion.div variants={scaleUp} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
              <Card className="border border-primary/20 bg-background/50 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6">
                  {/* Search Input */}
                  <form onSubmit={handleSearch} className="relative mb-6">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-primary/10 to-purple-500/5 rounded-xl blur-xl opacity-30" />
                    <div className="relative">
                      <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground z-10" />
                      <Input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search for articles, tutorials, topics, or authors..."
                        className="pl-12 h-14 text-base bg-background/80 border-primary/20 focus:border-primary focus:ring-1 focus:ring-primary/30"
                      />
                      {query && (
                        <motion.button
                          type="button"
                          onClick={() => setQuery("")}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <X className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" />
                        </motion.button>
                      )}
                    </div>
                  </form>

                  {/* Quick Actions */}
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant={showFilters ? "default" : "outline"}
                        size="sm"
                        onClick={() => setShowFilters(!showFilters)}
                        className="gap-2 group border-primary/20 hover:border-primary/40"
                      >
                        <Filter className="w-4 h-4" />
                        Filters
                        {Object.values(activeFilters).some((v) =>
                          Array.isArray(v) ? v.length > 0 : v !== "relevance" && v !== "all"
                        ) && (
                          <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 bg-primary text-primary-foreground">
                            !
                          </Badge>
                        )}
                      </Button>

                      <Select 
                        value={activeFilters.sortBy} 
                        onValueChange={(value) => setActiveFilters({ ...activeFilters, sortBy: value })}
                      >
                        <SelectTrigger className="w-[160px] bg-background/80 border-primary/20 hover:border-primary/40">
                          <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                          {sortOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              <div className="flex items-center gap-2">
                                <option.icon className={`w-4 h-4 ${option.color}`} />
                                {option.label}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button 
                        type="button" 
                        onClick={handleSearch} 
                        className="gap-2 group bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
                        disabled={isLoading || !query.trim()}
                      >
                        {isLoading ? (
                          <>
                            <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                            Searching...
                          </>
                        ) : (
                          <>
                            <FiSearch className="w-4 h-4" />
                            Search
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </>
                        )}
                      </Button>
                    </motion.div>
                  </div>

                  {/* Advanced Filters */}
                  <AnimatePresence mode="wait">
                    {showFilters && (
                      <motion.div
                        key="filters"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6 pt-6 border-t border-primary/20">
                          {/* Time Range */}
                          <div>
                            <Label className="text-sm font-medium mb-3 block">Time Range</Label>
                            <div className="space-y-2">
                              {timeRanges.map((range) => (
                                <label key={range.value} className="flex items-center gap-3 cursor-pointer group">
                                  <div className={`w-3 h-3 rounded-full ${range.color} transition-all group-hover:scale-125`} />
                                  <span className="text-sm flex-1">{range.label}</span>
                                  <input
                                    type="radio"
                                    name="timeRange"
                                    value={range.value}
                                    checked={activeFilters.timeRange === range.value}
                                    onChange={(e) => setActiveFilters({ ...activeFilters, timeRange: e.target.value })}
                                    className="sr-only"
                                  />
                                </label>
                              ))}
                            </div>
                          </div>

                          {/* Content Type */}
                          <div>
                            <Label className="text-sm font-medium mb-3 block">Content Type</Label>
                            <Select
                              value={activeFilters.contentType}
                              onValueChange={(value) => setActiveFilters({ ...activeFilters, contentType: value })}
                            >
                              <SelectTrigger className="bg-background/80 border-primary/20 hover:border-primary/40">
                                <SelectValue placeholder="All Content" />
                              </SelectTrigger>
                              <SelectContent>
                                {contentTypes.map((type) => (
                                  <SelectItem key={type.value} value={type.value}>
                                    <div className="flex items-center gap-2">
                                      <type.icon className={`w-4 h-4 ${type.color}`} />
                                      {type.label}
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>

                            <div className="flex items-center space-x-2 mt-4">
                              <Switch
                                id="featured-only"
                                checked={activeFilters.featuredOnly}
                                onCheckedChange={(checked) => setActiveFilters({ ...activeFilters, featuredOnly: checked })}
                                className="data-[state=checked]:bg-primary"
                              />
                              <Label htmlFor="featured-only" className="text-sm cursor-pointer">
                                Featured Only
                              </Label>
                            </div>
                          </div>

                          {/* Popular Tags */}
                          <div>
                            <Label className="text-sm font-medium mb-3 block">Popular Tags</Label>
                            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-1">
                              {popularTags.map((tag) => (
                                <motion.div
                                  key={tag.name}
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  <Badge
                                    variant={activeFilters.tags.includes(tag.name) ? "default" : "outline"}
                                    className="cursor-pointer gap-1 border-primary/20 hover:border-primary/40"
                                    onClick={() => toggleTagFilter(tag.name)}
                                  >
                                    <Hash className="w-3 h-3" />
                                    {tag.name}
                                    <span className="text-xs opacity-75 ml-1">({tag.count})</span>
                                  </Badge>
                                </motion.div>
                              ))}
                            </div>
                          </div>

                          {/* Read Time Filter */}
                          <div>
                            <Label className="text-sm font-medium mb-3 block">Read Time (minutes)</Label>
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Min: {activeFilters.minReadTime}</span>
                                <span className="text-muted-foreground">Max: {activeFilters.maxReadTime}</span>
                              </div>
                              <div className="space-y-4">
                                <div>
                                  <input
                                    type="range"
                                    min="0"
                                    max="60"
                                    step="5"
                                    value={activeFilters.minReadTime}
                                    onChange={(e) => setActiveFilters({ ...activeFilters, minReadTime: parseInt(e.target.value) })}
                                    className="w-full h-2 bg-primary/10 rounded-lg appearance-none cursor-pointer"
                                  />
                                </div>
                                <div>
                                  <input
                                    type="range"
                                    min="0"
                                    max="120"
                                    step="5"
                                    value={activeFilters.maxReadTime}
                                    onChange={(e) => setActiveFilters({ ...activeFilters, maxReadTime: parseInt(e.target.value) })}
                                    className="w-full h-2 bg-primary/10 rounded-lg appearance-none cursor-pointer"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Filter Actions */}
                        <div className="flex items-center justify-between mt-6 pt-6 border-t border-primary/20">
                          <Button 
                            variant="ghost" 
                            onClick={clearFilters} 
                            className="gap-2 hover:bg-primary/10"
                          >
                            <X className="w-4 h-4" />
                            Clear All
                          </Button>
                          <div className="flex items-center gap-3">
                            <Button 
                              variant="outline" 
                              onClick={() => setShowFilters(false)}
                              className="border-primary/20 hover:border-primary/40"
                            >
                              Cancel
                            </Button>
                            <Button 
                              onClick={applyFilters} 
                              className="gap-2 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
                            >
                              <Filter className="w-4 h-4" />
                              Apply Filters
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Active Filters & Quick Searches */}
        <div className="mb-8 space-y-6">
          {/* Active Filters */}
          {(activeFilters.tags.length > 0 ||
            activeFilters.sortBy !== "relevance" ||
            activeFilters.timeRange !== "all" ||
            activeFilters.contentType !== "all" ||
            activeFilters.featuredOnly) && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-background/50 backdrop-blur-sm border border-primary/20 rounded-xl p-4"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-medium">Active filters:</span>
                {activeFilters.tags.map((tag) => (
                  <Badge 
                    key={tag} 
                    variant="secondary" 
                    className="gap-1 bg-primary/10 text-primary hover:bg-primary/20"
                  >
                    <Hash className="w-3 h-3" />
                    {tag}
                    <button 
                      onClick={() => toggleTagFilter(tag)} 
                      className="ml-1 hover:scale-110 transition-transform"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
                {activeFilters.sortBy !== "relevance" && (
                  <Badge variant="outline" className="gap-1 border-primary/20">
                    Sort: {sortOptions.find((o) => o.value === activeFilters.sortBy)?.label}
                    <button
                      onClick={() => setActiveFilters({ ...activeFilters, sortBy: "relevance" })}
                      className="ml-1 hover:scale-110 transition-transform"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                )}
                {activeFilters.featuredOnly && (
                  <Badge variant="outline" className="gap-1 border-amber-500/30 bg-amber-500/10 text-amber-600">
                    <FiStar className="w-3 h-3" />
                    Featured Only
                    <button
                      onClick={() => setActiveFilters({ ...activeFilters, featuredOnly: false })}
                      className="ml-1 hover:scale-110 transition-transform"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                )}
              </div>
            </motion.div>
          )}

          {/* Quick Searches */}
          {!query && results.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="text-lg font-semibold mb-4">Popular Searches</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                {quickSearches.map((item, index) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Button
                      variant="outline"
                      onClick={() => handleQuickSearch(item.label)}
                      className="w-full h-auto py-4 flex-col gap-2 border-primary/20 hover:border-primary/40 group"
                    >
                      <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${item.color} flex items-center justify-center text-white font-bold text-lg`}>
                        {item.icon}
                      </div>
                      <span className="font-medium">{item.label}</span>
                      <span className="text-xs text-muted-foreground">{item.category}</span>
                    </Button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* Content Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
            <TabsList className="bg-background/50 backdrop-blur-sm border border-primary/20 p-1">
              <TabsTrigger value="all" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-purple-500">
                All Content
              </TabsTrigger>
              <TabsTrigger value="articles" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-500">
                Articles
              </TabsTrigger>
              <TabsTrigger value="tutorials" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500">
                Tutorials
              </TabsTrigger>
              <TabsTrigger value="guides" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-rose-500 data-[state=active]:to-orange-500">
                Guides
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </motion.div>

        {/* Results Section */}
        <AnimatePresence mode="wait">
          {isLoading ? (
            // Loading State
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-16"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Card key={i} className="border border-primary/20 animate-pulse">
                    <div className="relative h-48 bg-gradient-to-br from-primary/10 to-primary/5" />
                    <CardHeader>
                      <Skeleton className="h-6 w-3/4 bg-primary/10" />
                      <Skeleton className="h-4 w-full mt-2 bg-primary/10" />
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-full bg-primary/10" />
                        <Skeleton className="h-4 w-2/3 bg-primary/10" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>
          ) : results.length === 0 && query ? (
            // Empty State
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-16"
            >
              <div className="w-32 h-32 mx-auto bg-gradient-to-br from-primary/10 to-primary/5 rounded-full flex items-center justify-center mb-6">
                <Search className="w-16 h-16 text-primary/30" />
              </div>
              <h3 className="text-2xl font-bold mb-3">No results found</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                We couldn't find any articles matching "{query}"
              </p>
              <div className="flex gap-3 justify-center">
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  disabled={!Object.values(activeFilters).some((v) =>
                    Array.isArray(v) ? v.length > 0 : v !== "relevance" && v !== "all"
                  )}
                  className="border-primary/20 hover:border-primary/40"
                >
                  Clear filters
                </Button>
                <Button 
                  className="gap-2 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90" 
                  asChild
                >
                  <Link href="/articles">
                    <BookOpen className="w-4 h-4" />
                    Browse Articles
                  </Link>
                </Button>
              </div>
            </motion.div>
          ) : results.length > 0 ? (
            // Results Grid
            <motion.div
              key="results"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="space-y-12"
            >
              {Object.entries(postsByCategory).map(([category, categoryPosts], categoryIndex) => (
                <motion.div key={category} variants={fadeInUp}>
                  {/* Category Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-gradient-to-r from-primary/10 to-purple-500/10">
                        <Target className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                          {category}
                        </h2>
                        <p className="text-sm text-muted-foreground">
                          {categoryPosts.length} articles in this category
                        </p>
                      </div>
                      <Badge variant="outline" className="bg-primary/10 border-primary/20">
                        {categoryPosts.length}
                      </Badge>
                    </div>
                    <Button variant="ghost" size="sm" asChild className="gap-2 hover:bg-primary/10">
                      <Link href={`/categories/${category.toLowerCase().replace(/\s+/g, "-")}`}>
                        View All
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    </Button>
                  </div>

                  {/* Articles Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categoryPosts.map((post, index) => {
                      const isTrending = (post.views || 0) > 1000;
                      const isFeatured = post.featured;
                      const readTime = post.readTime || "5";
                      const relevance = post.relevance || Math.random() * 100;

                      return (
                        <motion.div
                          key={post._id}
                          variants={scaleUp}
                          initial="hidden"
                          whileInView="visible"
                          viewport={{ once: true, margin: "-50px" }}
                          transition={{ delay: (categoryIndex * 0.1) + (index * 0.05) }}
                        >
                          <Link href={`/articles/${post.slug || post._id}`}>
                            <Card className="h-full overflow-hidden border border-primary/20 hover:border-primary/40 hover:shadow-xl transition-all duration-300 group hover:-translate-y-1 bg-background/50 backdrop-blur-sm">
                              {/* Article Image */}
                              <div className="relative h-48 overflow-hidden">
                                {post.featuredImage ? (
                                  <>
                                    <img
                                      src={post.featuredImage}
                                      alt={post.title}
                                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                                  </>
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-purple-500/10">
                                    <BookOpen className="w-16 h-16 text-primary/30" />
                                  </div>
                                )}

                                {/* Badges */}
                                <div className="absolute top-3 left-3 flex gap-2">
                                  {isFeatured && (
                                    <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 border-0">
                                      <FiStar className="w-3 h-3 mr-1" />
                                      Featured
                                    </Badge>
                                  )}
                                  {isTrending && (
                                    <Badge className="bg-gradient-to-r from-rose-500 to-pink-500 border-0">
                                      <Flame className="w-3 h-3 mr-1" />
                                      Trending
                                    </Badge>
                                  )}
                                </div>

                                {/* Read Time & Relevance */}
                                <div className="absolute top-3 right-3 flex flex-col gap-2">
                                  <Badge variant="secondary" className="bg-background/90 backdrop-blur-sm border-primary/20">
                                    <Clock className="w-3 h-3 mr-1" />
                                    {readTime} min
                                  </Badge>
                                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-purple-500 flex items-center justify-center text-xs font-bold text-white">
                                    {Math.round(relevance)}%
                                  </div>
                                </div>
                              </div>

                              <CardHeader className="pb-3">
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    {formatDate(post.publishedAt)}
                                  </span>
                                </div>

                                <CardTitle className="line-clamp-2 text-lg group-hover:text-primary transition-colors">
                                  {post.title}
                                </CardTitle>
                                <CardDescription className="line-clamp-2 text-sm mt-2">
                                  {post.excerpt || post.content?.substring(0, 100)}...
                                </CardDescription>
                              </CardHeader>

                              <CardContent className="pb-4">
                                {/* Tags */}
                                {post.tags && post.tags.length > 0 && (
                                  <div className="flex flex-wrap gap-1 mb-4">
                                    {post.tags.slice(0, 3).map((tag) => (
                                      <Badge 
                                        key={tag} 
                                        variant="secondary" 
                                        size="sm" 
                                        className="bg-primary/10 text-primary border-primary/20"
                                      >
                                        #{tag}
                                      </Badge>
                                    ))}
                                    {post.tags.length > 3 && (
                                      <Badge 
                                        variant="outline" 
                                        size="sm" 
                                        className="border-primary/20 text-muted-foreground"
                                      >
                                        +{post.tags.length - 3}
                                      </Badge>
                                    )}
                                  </div>
                                )}

                                {/* Author and Stats */}
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    {post.authorId?.avatar ? (
                                      <Avatar className="w-6 h-6 ring-1 ring-primary/20">
                                        <AvatarImage src={post.authorId.avatar} alt={post.authorId.username} />
                                        <AvatarFallback className="bg-gradient-to-r from-primary to-purple-500 text-white text-xs">
                                          {post.authorId.username?.charAt(0) || "A"}
                                        </AvatarFallback>
                                      </Avatar>
                                    ) : (
                                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center">
                                        <User className="w-3 h-3 text-white" />
                                      </div>
                                    )}
                                    <span className="text-sm font-medium">{post.authorId?.username || "Anonymous"}</span>
                                  </div>

                                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                    <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <span className="flex items-center gap-1 hover:text-foreground transition-colors cursor-help">
                                            <FiEye className="w-3.5 h-3.5" />
                                            {formatCount(post.views || 0)}
                                          </span>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          <p>Views</p>
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                    
                                    <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <span className="flex items-center gap-1 hover:text-rose-500 transition-colors cursor-help">
                                            <FiHeart className="w-3.5 h-3.5" />
                                            {post.meta?.likes?.length || 0}
                                          </span>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          <p>Likes</p>
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>

                                    <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <span className="flex items-center gap-1 hover:text-emerald-500 transition-colors cursor-help">
                                            <FiMessageSquare className="w-3.5 h-3.5" />
                                            {post.meta?.comments?.length || 0}
                                          </span>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          <p>Comments</p>
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                  </div>
                                </div>
                              </CardContent>

                              <CardFooter className="pt-0">
                                <div className="w-full">
                                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                                    <span>Relevance</span>
                                    <span>{Math.round(relevance)}%</span>
                                  </div>
                                  <Progress value={relevance} className="h-1 bg-primary/10">
                                    <div className="h-full bg-gradient-to-r from-primary to-purple-500 transition-all duration-500" />
                                  </Progress>
                                </div>
                              </CardFooter>
                            </Card>
                          </Link>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            // Initial State - No Search
            <motion.div
              key="initial"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-16"
            >
              <motion.div
                animate={pulseAnimation}
                className="w-32 h-32 mx-auto bg-gradient-to-br from-primary/10 to-primary/5 rounded-full flex items-center justify-center mb-6"
              >
                <Search className="w-16 h-16 text-primary/30" />
              </motion.div>
              <h3 className="text-2xl font-bold mb-3 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                Start Your Search Journey
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Enter a search term above to discover articles, tutorials, and guides across all topics
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                {quickSearches.slice(0, 4).map((item) => (
                  <Button 
                    key={item.label}
                    variant="outline" 
                    onClick={() => handleQuickSearch(item.label)}
                    className="hover:border-primary/40 hover:text-primary"
                  >
                    {item.label}
                  </Button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pagination or Load More */}
        {results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-12 pt-8 border-t border-primary/20"
          >
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Showing {Math.min(results.length, 12)} of {formatCount(results.length)} results
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="border-primary/20 hover:border-primary/40">
                  Previous
                </Button>
                <Button variant="outline" size="sm" className="border-primary/20 hover:border-primary/40">
                  1
                </Button>
                <Button 
                  variant="default" 
                  size="sm" 
                  className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
                >
                  2
                </Button>
                <Button variant="outline" size="sm" className="border-primary/20 hover:border-primary/40">
                  3
                </Button>
                <Button variant="outline" size="sm" className="border-primary/20 hover:border-primary/40">
                  Next
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}