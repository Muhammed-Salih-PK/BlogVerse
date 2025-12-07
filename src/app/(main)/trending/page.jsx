"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { FiSearch, FiChevronRight, FiRefreshCw, FiArrowUp } from "react-icons/fi";
import { FaRegBookmark, FaTwitter, FaLinkedin, FaShareAlt } from "react-icons/fa";
import {
  Clock,
  Eye,
  Heart,
  MessageSquare,
  BarChart3,
  Sparkles,
  Zap,
  Rocket,
  TrendingUp,
  Flame,
  Target,
  TrendingDown,
  TrendingUp as TrendingUpSolid,
  Users,
  Hash,
  BookOpen,
  Share2,
  Activity,
  Target as TargetIcon,
  Crown,
  PenTool,
  Bell,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const TrendingPage = () => {
  const [activeTab, setActiveTab] = useState("articles");
  const [timeRange, setTimeRange] = useState("today");
  const [category, setCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [autoRefresh, setAutoRefresh] = useState(false);

  // Mock trending data
  const trendingArticles = [
    {
      id: 1,
      title: "React Server Components: The Complete Guide",
      author: { name: "Alex Chen", avatar: "/avatars/1.jpg" },
      views: 12500,
      likes: 842,
      comments: 156,
      readTime: "12 min",
      publishedAt: "2024-05-10T10:30:00Z",
      trendingScore: 95,
      change: "+42%",
      category: "React",
      tags: ["React", "Next.js", "RSC"],
      isFeatured: true,
      featuredImage:
        "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      id: 2,
      title: "TypeScript 5.4: What's New and Exciting",
      author: { name: "Sarah Johnson", avatar: "/avatars/2.jpg" },
      views: 9800,
      likes: 621,
      comments: 89,
      readTime: "8 min",
      publishedAt: "2024-05-09T14:20:00Z",
      trendingScore: 88,
      change: "+35%",
      category: "TypeScript",
      tags: ["TypeScript", "JavaScript"],
      featuredImage:
        "https://images.unsplash.com/photo-1519337265831-281ec6cc8514?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      id: 3,
      title: "Building Real-time Apps with Next.js 14 & Socket.io",
      author: { name: "David Park", avatar: "/avatars/3.jpg" },
      views: 15400,
      likes: 1024,
      comments: 231,
      readTime: "15 min",
      publishedAt: "2024-05-08T09:15:00Z",
      trendingScore: 92,
      change: "+58%",
      category: "Next.js",
      tags: ["Next.js", "WebSockets", "Real-time"],
      isFeatured: true,
      featuredImage:
        "https://plus.unsplash.com/premium_photo-1664297989345-f4ff2063b212?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fGRhdGFiYXNlc3xlbnwwfHwwfHx8MA%3D%3D",
    },
    {
      id: 4,
      title: "The Future of CSS: Container Queries and Beyond",
      author: { name: "Maria Rodriguez", avatar: "/avatars/4.jpg" },
      views: 7200,
      likes: 421,
      comments: 67,
      readTime: "10 min",
      publishedAt: "2024-05-07T16:45:00Z",
      trendingScore: 76,
      change: "+28%",
      category: "CSS",
      tags: ["CSS", "Design", "Responsive"],
      featuredImage:
        "https://images.unsplash.com/photo-1669023414162-5bb06bbff0ec?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGNzc3xlbnwwfHwwfHx8MA%3D%3D",
    },
    {
      id: 5,
      title: "State Management 2024: Beyond Redux",
      author: { name: "James Wilson", avatar: "/avatars/5.jpg" },
      views: 8900,
      likes: 534,
      comments: 124,
      readTime: "11 min",
      publishedAt: "2024-05-06T11:30:00Z",
      trendingScore: 81,
      change: "+31%",
      category: "React",
      tags: ["React", "State Management"],
      featuredImage:
        "https://images.unsplash.com/photo-1545665277-5937489579f2?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fFN0YXRlJTIwTWFuYWdlbWVudCUyMGNvZGluZ3xlbnwwfHwwfHx8MA%3D%3D",
    },
  ];

  const trendingTopics = [
    { name: "Next.js", count: 142, change: "+45%", color: "from-black to-gray-800" },
    { name: "React", count: 256, change: "+32%", color: "from-blue-500 to-cyan-400" },
    { name: "TypeScript", count: 189, change: "+58%", color: "from-blue-600 to-blue-400" },
    { name: "Tailwind CSS", count: 124, change: "+28%", color: "from-teal-400 to-emerald-500" },
    { name: "Web3", count: 87, change: "+62%", color: "from-purple-500 to-pink-500" },
    { name: "AI/ML", count: 203, change: "+78%", color: "from-orange-500 to-red-500" },
    { name: "DevOps", count: 98, change: "+24%", color: "from-green-500 to-emerald-500" },
    { name: "GraphQL", count: 76, change: "+19%", color: "from-pink-500 to-rose-500" },
  ];

  const trendingAuthors = [
    { id: 1, name: "Alex Chen", role: "Senior Developer", articles: 42, trendingScore: 95, change: "+15", avatar: "/avatars/1.jpg" },
    { id: 2, name: "Sarah Johnson", role: "UX Architect", articles: 38, trendingScore: 88, change: "+12", avatar: "/avatars/2.jpg" },
    { id: 3, name: "David Park", role: "DevOps Lead", articles: 31, trendingScore: 82, change: "+18", avatar: "/avatars/3.jpg" },
    { id: 4, name: "Maria Rodriguez", role: "Frontend Lead", articles: 56, trendingScore: 90, change: "+22", avatar: "/avatars/4.jpg" },
    { id: 5, name: "James Wilson", role: "Full-stack Dev", articles: 29, trendingScore: 76, change: "+8", avatar: "/avatars/5.jpg" },
  ];

  const stats = {
    totalViews: "2.4M",
    totalEngagement: "425K",
    trendingArticles: 156,
    topCategory: "React",
    growthRate: "+42%",
  };

  const categories = ["all", "React", "Next.js", "TypeScript", "CSS", "JavaScript", "Node.js", "DevOps", "AI/ML"];

  const formatNumber = (num) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffHours = Math.abs(now - date) / (1000 * 60 * 60);

    if (diffHours < 1) return "Just now";
    if (diffHours < 24) return `${Math.floor(diffHours)}h ago`;
    if (diffHours < 168) return `${Math.floor(diffHours / 24)}d ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const getTrendingColor = (score) => {
    if (score >= 90) return "text-green-500";
    if (score >= 80) return "text-amber-500";
    if (score >= 70) return "text-orange-500";
    return "text-red-500";
  };

  const getTrendingIcon = (score) => {
    if (score >= 90) return <FiArrowUp className='w-4 h-4 text-green-500' />;
    if (score >= 80) return <TrendingUp className='w-4 h-4 text-amber-500' />;
    if (score >= 70) return <Activity className='w-4 h-4 text-orange-500' />;
    return <TrendingDown className='w-4 h-4 text-red-500' />;
  };

  // Auto-refresh simulation
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      // In a real app, this would refetch data
      console.log("Refreshing trending data...");
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [autoRefresh]);

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
    <div className='min-h-screen bg-gradient-to-b from-background via-background to-primary/5 pb-10'>
      {/* Hero Section */}
      <section className='relative overflow-hidden border-b'>
        <div className='absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent' />
        <div className='absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl' />
        <div className='absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl' />

        <div className='relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
          <motion.div initial='hidden' animate='visible' variants={staggerContainer} className='text-center'>
            <motion.div variants={fadeInUp}>
              <Badge className='mb-6 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0'>
                <Flame className='w-4 h-4 mr-2' />
                Live Trending
              </Badge>
            </motion.div>

            <motion.h1 variants={fadeInUp} className='text-4xl md:text-6xl font-bold tracking-tight mb-6'>
              What's <span className='bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 bg-clip-text text-transparent'>Trending</span> Now
            </motion.h1>

            <motion.p variants={fadeInUp} className='text-xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed'>
              Discover the hottest articles, topics, and authors in real-time. Stay ahead of the curve with our live trending analytics.
            </motion.p>

            {/* Stats Overview */}
            <motion.div variants={fadeInUp} className='grid grid-cols-2 md:grid-cols-5 gap-4 max-w-4xl mx-auto mb-8'>
              {[
                { label: "Total Views", value: stats.totalViews, icon: Eye, color: "text-blue-500" },
                { label: "Engagement", value: stats.totalEngagement, icon: Heart, color: "text-pink-500" },
                { label: "Trending Articles", value: stats.trendingArticles, icon: TrendingUp, color: "text-amber-500" },
                { label: "Top Category", value: stats.topCategory, icon: Target, color: "text-green-500" },
                { label: "Growth", value: stats.growthRate, icon: TrendingUpSolid, color: "text-emerald-500" },
              ].map((stat, index) => (
                <div key={stat.label} className='text-center'>
                  <div className={`inline-flex p-3 rounded-xl bg-primary/10 mb-3 ${stat.color.replace("text", "bg")}/10`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <div className='text-2xl font-bold'>{stat.value}</div>
                  <div className='text-sm text-muted-foreground'>{stat.label}</div>
                </div>
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
            <div className='flex flex-col lg:flex-row gap-6 items-center'>
              {/* Search */}
              <div className='flex-1 w-full'>
                <div className='relative'>
                  <FiSearch className='absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground' />
                  <Input
                    type='text'
                    placeholder='Search trending content...'
                    className='pl-12 h-12'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              {/* Filters */}
              <div className='flex flex-wrap gap-3 items-center'>
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger className='w-[140px]'>
                    <Clock className='w-4 h-4 mr-2' />
                    <SelectValue placeholder='Time' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='today'>Today</SelectItem>
                    <SelectItem value='week'>This Week</SelectItem>
                    <SelectItem value='month'>This Month</SelectItem>
                    <SelectItem value='all'>All Time</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className='w-[140px]'>
                    <Hash className='w-4 h-4 mr-2' />
                    <SelectValue placeholder='Category' />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat === "all" ? "All Categories" : cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className='flex items-center space-x-2'>
                  <Switch id='auto-refresh' checked={autoRefresh} onCheckedChange={setAutoRefresh} />
                  <Label htmlFor='auto-refresh' className='text-sm'>
                    Auto-refresh
                  </Label>
                </div>

                <Button
                  variant='outline'
                  size='icon'
                  onClick={() => {
                    // Refresh logic here
                    console.log("Manual refresh");
                  }}
                >
                  <FiRefreshCw className='w-4 h-4' />
                </Button>
              </div>
            </div>

            {/* Tabs */}
            <div className='mt-6'>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className='grid grid-cols-4 w-full'>
                  <TabsTrigger value='articles' className='gap-2'>
                    <BookOpen className='w-4 h-4' />
                    Articles
                  </TabsTrigger>
                  <TabsTrigger value='topics' className='gap-2'>
                    <Hash className='w-4 h-4' />
                    Topics
                  </TabsTrigger>
                  <TabsTrigger value='authors' className='gap-2'>
                    <Users className='w-4 h-4' />
                    Authors
                  </TabsTrigger>
                  <TabsTrigger value='insights' className='gap-2'>
                    <BarChart3 className='w-4 h-4' />
                    Insights
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardContent>
        </Card>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Main Content */}
          <div className='lg:col-span-2'>
            <AnimatePresence mode='wait'>
              {activeTab === "articles" && (
                <motion.div key='articles' initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className='space-y-6'>
                  {trendingArticles.map((article, index) => (
                    <motion.div key={article.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
                      <Card className='border hover:shadow-xl transition-all duration-300 group'>
                        <div className='flex flex-col md:flex-row'>
                          {/* Trending Badge */}
                          <div className='absolute top-4 left-4 z-10'>
                            <div
                              className={`flex items-center gap-1 px-3 py-1.5 rounded-full ${getTrendingColor(article.trendingScore).replace(
                                "text",
                                "bg"
                              )}/20 backdrop-blur-sm`}
                            >
                              {getTrendingIcon(article.trendingScore)}
                              <span className={`text-sm font-bold ${getTrendingColor(article.trendingScore)}`}>{article.trendingScore}</span>
                            </div>
                          </div>

                          {/* Image */}
                          <div className='md:w-48 relative overflow-hidden flex-shrink-0'>
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
                              <div className='absolute inset-0 bg-gradient-to-t from-black/40 to-transparent md:hidden' />
                            </div>
                          </div>

                          {/* Content */}
                          <div className='flex-1 p-6'>
                            <div className='flex items-start justify-between mb-3'>
                              <div className='flex-1'>
                                <div className='flex items-center gap-2 mb-2'>
                                  <Badge variant='outline' size='sm'>
                                    {article.category}
                                  </Badge>
                                  {article.isFeatured && (
                                    <Badge className='bg-gradient-to-r from-amber-500 to-orange-500'>
                                      <Sparkles className='w-3 h-3 mr-1' />
                                      Featured
                                    </Badge>
                                  )}
                                </div>
                                <Link
                                  href={`/articles/${article.id}`}
                                  className='text-xl font-bold hover:text-primary transition-colors line-clamp-2'
                                >
                                  {article.title}
                                </Link>
                                <p className='text-muted-foreground text-sm mt-2 line-clamp-2'>
                                  {article.readTime} • {formatDate(article.publishedAt)}
                                </p>
                              </div>
                              <div className='text-right'>
                                <div className='text-sm font-semibold text-emerald-500'>{article.change}</div>
                                <div className='text-xs text-muted-foreground'>growth</div>
                              </div>
                            </div>

                            {/* Stats */}
                            <div className='flex items-center gap-6 mb-4'>
                              <div className='flex items-center gap-1 text-sm text-muted-foreground'>
                                <Eye className='w-4 h-4' />
                                {formatNumber(article.views)}
                              </div>
                              <div className='flex items-center gap-1 text-sm text-muted-foreground'>
                                <Heart className='w-4 h-4' />
                                {formatNumber(article.likes)}
                              </div>
                              <div className='flex items-center gap-1 text-sm text-muted-foreground'>
                                <MessageSquare className='w-4 h-4' />
                                {formatNumber(article.comments)}
                              </div>
                            </div>

                            {/* Author & Actions */}
                            <div className='flex items-center justify-between'>
                              <div className='flex items-center gap-3'>
                                <Avatar className='w-8 h-8 ring-2 ring-primary/10'>
                                  <AvatarFallback>{article.author.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className='font-medium'>{article.author.name}</div>
                                </div>
                              </div>
                              <div className='flex items-center gap-2'>
                                <Button size='sm' variant='ghost' className='gap-2'>
                                  <FaRegBookmark className='w-4 h-4' />
                                  Save
                                </Button>
                                <Button size='sm' className='gap-2'>
                                  Read
                                  <FiChevronRight className='w-4 h-4' />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {activeTab === "topics" && (
                <motion.div key='topics' initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                    {trendingTopics.map((topic, index) => (
                      <motion.div
                        key={topic.name}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ y: -4, transition: { duration: 0.2 } }}
                      >
                        <Card className='h-full border hover:shadow-lg transition-all duration-300'>
                          <CardContent className='p-6 text-center'>
                            <div className={`w-16 h-16 bg-gradient-to-br ${topic.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                              <Hash className='w-8 h-8 text-white' />
                            </div>
                            <h3 className='font-bold text-lg mb-2'>#{topic.name}</h3>
                            <div className='text-2xl font-bold mb-1'>{topic.count}</div>
                            <div className='text-sm text-muted-foreground mb-2'>articles</div>
                            <Badge variant='outline' className='gap-1'>
                              <FiArrowUp className='w-3 h-3 text-emerald-500' />
                              {topic.change}
                            </Badge>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === "authors" && (
                <motion.div key='authors' initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className='space-y-4'>
                  {trendingAuthors.map((author, index) => (
                    <motion.div key={author.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }}>
                      <Card className='border hover:shadow-md transition-shadow'>
                        <CardContent className='p-6'>
                          <div className='flex items-center justify-between'>
                            <div className='flex items-center gap-4'>
                              <div className='relative'>
                                <Avatar className='w-16 h-16 ring-2 ring-primary/10'>
                                  <AvatarFallback className='bg-gradient-to-br from-primary to-primary/60 text-white'>
                                    {author.name.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                                {index < 3 && (
                                  <div className='absolute -top-2 -right-2'>
                                    <Crown className='w-6 h-6 text-amber-500' />
                                  </div>
                                )}
                              </div>
                              <div>
                                <h3 className='text-lg font-bold'>{author.name}</h3>
                                <p className='text-sm text-muted-foreground'>{author.role}</p>
                                <div className='flex items-center gap-4 mt-2'>
                                  <Badge variant='outline' size='sm' className='gap-1'>
                                    <BookOpen className='w-3 h-3' />
                                    {author.articles} articles
                                  </Badge>
                                  <Badge className='bg-gradient-to-r from-amber-500 to-orange-500 gap-1'>
                                    <TrendingUp className='w-3 h-3' />
                                    Score: {author.trendingScore}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                            <div className='text-right'>
                              <div className='text-2xl font-bold text-emerald-500'>{author.change}</div>
                              <div className='text-sm text-muted-foreground'>rank change</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {activeTab === "insights" && (
                <motion.div key='insights' initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <Card className='border'>
                    <CardHeader>
                      <CardTitle>Trending Insights</CardTitle>
                      <CardDescription>Analytics and patterns in trending content</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className='space-y-6'>
                        <div>
                          <h4 className='font-semibold mb-3'>Trending Categories</h4>
                          <div className='space-y-3'>
                            {["React", "Next.js", "TypeScript", "AI/ML"].map((cat, i) => (
                              <div key={cat} className='flex items-center justify-between'>
                                <span className='text-sm'>{cat}</span>
                                <div className='w-48'>
                                  <Progress value={[85, 72, 68, 90][i]} className='h-2' />
                                </div>
                                <span className='text-sm font-medium'>{[85, 72, 68, 90][i]}%</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <Separator />

                        <div>
                          <h4 className='font-semibold mb-3'>Peak Hours</h4>
                          <div className='grid grid-cols-6 gap-2'>
                            {["6AM", "9AM", "12PM", "3PM", "6PM", "9PM"].map((time, i) => (
                              <div key={time} className='text-center'>
                                <div className='text-xs text-muted-foreground mb-1'>{time}</div>
                                <div
                                  className='w-full bg-gradient-to-t from-primary to-primary/60 rounded-t'
                                  style={{ height: `${[20, 45, 85, 90, 75, 35][i]}%` }}
                                />
                              </div>
                            ))}
                          </div>
                        </div>

                        <Separator />

                        <div>
                          <h4 className='font-semibold mb-3'>Engagement Metrics</h4>
                          <div className='grid grid-cols-3 gap-4'>
                            <div className='text-center p-4 bg-secondary rounded-lg'>
                              <div className='text-2xl font-bold'>42%</div>
                              <div className='text-sm text-muted-foreground'>Avg. Read Rate</div>
                            </div>
                            <div className='text-center p-4 bg-secondary rounded-lg'>
                              <div className='text-2xl font-bold'>7.2 min</div>
                              <div className='text-sm text-muted-foreground'>Avg. Read Time</div>
                            </div>
                            <div className='text-center p-4 bg-secondary rounded-lg'>
                              <div className='text-2xl font-bold'>68%</div>
                              <div className='text-sm text-muted-foreground'>Engagement Score</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sidebar */}
          <div className='space-y-6'>
            {/* Trending Now */}
            <Card className='border'>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <Zap className='w-5 h-5 text-amber-500' />
                  Trending Now
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  {[
                    { rank: 1, title: "React Server Components", change: "▲", category: "React" },
                    { rank: 2, title: "Next.js 14 Updates", change: "▲", category: "Next.js" },
                    { rank: 3, title: "TypeScript 5.4", change: "▲", category: "TypeScript" },
                    { rank: 4, title: "AI Code Assistants", change: "▶", category: "AI/ML" },
                    { rank: 5, title: "CSS Container Queries", change: "▼", category: "CSS" },
                  ].map((item) => (
                    <div key={item.rank} className='flex items-center gap-3 group'>
                      <div className='w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center font-bold'>{item.rank}</div>
                      <div className='flex-1'>
                        <div className='font-medium group-hover:text-primary transition-colors'>{item.title}</div>
                        <div className='text-xs text-muted-foreground'>{item.category}</div>
                      </div>
                      <div
                        className={`text-sm font-bold ${
                          item.change === "▲" ? "text-emerald-500" : item.change === "▼" ? "text-red-500" : "text-amber-500"
                        }`}
                      >
                        {item.change}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Time Analysis */}
            <Card className='border'>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <Clock className='w-5 h-5 text-primary' />
                  Time Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-3'>
                  <div className='flex items-center justify-between'>
                    <span className='text-sm'>Last Updated</span>
                    <span className='text-sm font-medium'>Just now</span>
                  </div>
                  <div className='flex items-center justify-between'>
                    <span className='text-sm'>Refresh Rate</span>
                    <span className='text-sm font-medium'>Every 30s</span>
                  </div>
                  <div className='flex items-center justify-between'>
                    <span className='text-sm'>Data Since</span>
                    <span className='text-sm font-medium'>May 1, 2024</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant='outline' className='w-full gap-2' asChild>
                  <Link href='/trending/history'>
                    View History
                    <FiChevronRight className='w-4 h-4' />
                  </Link>
                </Button>
              </CardFooter>
            </Card>

            {/* Share Insights */}
            <Card className='border bg-gradient-to-br from-primary/5 via-primary/5 to-primary/10'>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <Share2 className='w-5 h-5 text-primary' />
                  Share Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-3'>
                  <Button variant='outline' className='w-full justify-start gap-2'>
                    <FaTwitter className='w-4 h-4' />
                    Share on Twitter
                  </Button>
                  <Button variant='outline' className='w-full justify-start gap-2'>
                    <FaLinkedin className='w-4 h-4' />
                    Share on LinkedIn
                  </Button>
                  <Button variant='outline' className='w-full justify-start gap-2'>
                    <FaShareAlt className='w-4 h-4' />
                    Copy Insights
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Newsletter */}
            <Card className='border'>
              <CardContent className='p-6'>
                <div className='text-center mb-4'>
                  <TargetIcon className='w-8 h-8 text-primary mx-auto mb-3' />
                  <h3 className='font-bold text-lg mb-2'>Trending Alerts</h3>
                  <p className='text-sm text-muted-foreground'>Get notified when topics you follow start trending</p>
                </div>
                <form className='space-y-3'>
                  <Input type='email' placeholder='Your email' className='bg-background' required />
                  <Button className='w-full gap-2'>
                    <Bell className='w-4 h-4' />
                    Subscribe to Alerts
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <section className='py-16'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className='relative overflow-hidden rounded-2xl'
          >
            <div className='absolute inset-0 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500' />
            <div className='absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl' />
            <div className='absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl' />

            <div className='relative z-10 p-8 md:p-12 text-center'>
              <div className='inline-flex p-4 rounded-2xl bg-white/10 backdrop-blur-sm mb-8'>
                <Rocket className='w-12 h-12 text-white' />
              </div>

              <h2 className='text-4xl font-bold text-white mb-6'>Want Your Content to Trend?</h2>

              <p className='text-white/90 text-xl mb-10 max-w-2xl mx-auto'>
                Write engaging articles, share valuable insights, and join the conversation to get featured in trending.
              </p>

              <div className='flex flex-col sm:flex-row gap-4 justify-center'>
                <Button size='lg' variant='secondary' className='gap-2 group bg-white text-orange-600 hover:bg-white/90' asChild>
                  <Link href='/articles/new'>
                    <PenTool className='w-5 h-5' />
                    Start Writing
                  </Link>
                </Button>
                <Button size='lg' variant='outline' className='gap-2 text-white border-white/30 hover:bg-white/10' asChild>
                  <Link href='/trending/guide'>
                    <BookOpen className='w-5 h-5' />
                    Trending Guide
                  </Link>
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default TrendingPage;
