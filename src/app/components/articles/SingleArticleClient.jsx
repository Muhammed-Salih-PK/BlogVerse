"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { containerVariants, scaleUp, fadeIn } from "@/lib/motionVariants";
import { FaFacebook, FaTwitter, FaLinkedin, FaCopy, FaCheck, FaWhatsapp, FaReddit, FaTelegram, FaFire } from "react-icons/fa";
import {
  ArrowLeft,
  BookOpen,
  TrendingUp,
  ChevronRight,
  Heart,
  Share2,
  Bookmark,
  Clock,
  Eye,
  MessageCircle,
  Calendar,
  User,
  Tag,
  Sparkles,
  Maximize2,
  Printer,
  Settings,
  Target,
} from "lucide-react";
import LikeButton from "@/app/components/LikeButton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useAppSelector } from "@/hooks/reduxHooks";
import ThemeToggle from "../ThemeToggle";

export default function SingleArticleClient({ article, relatedArticles = [], popularArticles = [] }) {
  const router = useRouter();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);
  const [estimatedReadingTime, setEstimatedReadingTime] = useState(article.readTime || "5 min");
  const [fontSize, setFontSize] = useState("medium");
  const [isLoading, setIsLoading] = useState(false);

  const userId = useAppSelector((state) => state.auth.user?.id);

  // Calculate reading time
  useEffect(() => {
    if (article.content) {
      const wordCount = article.content.split(/\s+/).length;
      const readingTime = Math.ceil(wordCount / 200);
      setEstimatedReadingTime(`${readingTime} min`);
    }
  }, [article.content]);

  // Reading progress tracking
  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const progress = (scrollTop / (documentHeight - windowHeight)) * 100;
      setReadingProgress(Math.min(progress, 100));
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Memoized calculations
  const trendingScore = useMemo(() => {
    return (article.views || 0) + (article.meta?.likes?.length || 0) * 2 + (article.commentCount || 0) * 3;
  }, [article.views, article.meta?.likes, article.commentCount]);

  const formatReadCount = useMemo(
    () => (count) => {
      if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
      if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
      return count?.toString() || "0";
    },
    []
  );

  const isTrending = trendingScore > 1000;
  const isFeatured = article.featured;

  const handleBookmark = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/articles/${article._id}/bookmark`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      if (response.ok) {
        setIsBookmarked(!isBookmarked);
      }
    } catch (error) {
      console.error("Bookmark error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = (platform) => {
    const url = window.location.href;
    const title = encodeURIComponent(article.title);
    const hashtags = article.tags?.slice(0, 3).join(",") || "";

    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?text=${title}&url=${encodeURIComponent(url)}&hashtags=${hashtags}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      whatsapp: `https://api.whatsapp.com/send?text=${title} ${encodeURIComponent(url)}`,
      reddit: `https://reddit.com/submit?url=${encodeURIComponent(url)}&title=${title}`,
      telegram: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${title}`,
    };

    if (platform === "copy") {
      navigator.clipboard.writeText(url);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } else if (shareUrls[platform]) {
      window.open(shareUrls[platform], "_blank", "noopener,noreferrer");
    } else if (navigator.share) {
      navigator.share({ title: article.title, text: article.excerpt, url });
    }

    setShowShareOptions(false);
  };

  // Stats cards configuration
  const stats = useMemo(
    () => [
      {
        label: "Views",
        value: formatReadCount(article.views || 0),
        icon: Eye,
        change: "+12%",
        color: "from-blue-500/10 to-blue-500/5",
        iconColor: "text-blue-500",
      },
      {
        label: "Likes",
        value: article.meta?.likes?.length || 0,
        icon: Heart,
        change: "+24%",
        color: "from-red-500/10 to-red-500/5",
        iconColor: "text-red-500",
      },
      {
        label: "Comments",
        value: article.commentCount || 0,
        icon: MessageCircle,
        change: "+8%",
        color: "from-emerald-500/10 to-emerald-500/5",
        iconColor: "text-emerald-500",
      },
      {
        label: "Read Time",
        value: estimatedReadingTime,
        icon: Clock,
        change: "",
        color: "from-amber-500/10 to-amber-500/5",
        iconColor: "text-amber-500",
      },
    ],
    [article.views, article.meta?.likes, article.commentCount, estimatedReadingTime, formatReadCount]
  );

  // Loading state
  if (isLoading) {
    return (
      <div className='min-h-screen bg-gradient-to-b from-background via-background to-primary/5'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
          <div className='animate-pulse space-y-8'>
            <Skeleton className='h-12 w-64' />
            <Skeleton className='h-96 w-full' />
            <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
              <Skeleton className='h-[400px] lg:col-span-2' />
              <Skeleton className='h-[400px]' />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gradient-to-b from-background via-background to-primary/5'>
      {/* Reading Progress Bar */}
      <div className='fixed top-0 left-0 w-full z-50'>
        <div className='h-1 w-full bg-primary/20'>
          <div className='h-full bg-gradient-to-r from-primary to-purple-600 transition-all duration-300' style={{ width: `${readingProgress}%` }} />
        </div>
      </div>

      {/* Enhanced Floating Action Buttons */}
      <div className='fixed right-6 bottom-6 z-40 flex flex-col gap-3'>
        <TooltipProvider>
          {/* Reading Preferences */}
          <Tooltip>
            <TooltipTrigger asChild>
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className='p-3 bg-background/50 backdrop-blur-sm rounded-full shadow-lg border border-primary/20 hover:shadow-xl transition-all flex items-center justify-center'
              >
                <ThemeToggle />
              </motion.div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Toggle Theme</p>
            </TooltipContent>
          </Tooltip>

          {/* Font Size */}
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className='p-3 bg-background/50 backdrop-blur-sm rounded-full shadow-lg border border-primary/20 hover:shadow-xl transition-all'
                  >
                    <Maximize2 className='w-5 h-5 text-primary' />
                  </motion.button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end' className='w-40'>
                  <DropdownMenuItem onClick={() => setFontSize("small")}>Small</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFontSize("medium")}>Medium</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFontSize("large")}>Large</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFontSize("xlarge")}>Extra Large</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TooltipTrigger>
            <TooltipContent>
              <p>Font Size</p>
            </TooltipContent>
          </Tooltip>

          {/* Bookmark */}
          <Tooltip>
            <TooltipTrigger asChild>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleBookmark}
                className='p-3 bg-background/50 backdrop-blur-sm rounded-full shadow-lg border border-primary/20 hover:shadow-xl transition-all'
              >
                <Bookmark className={`w-5 h-5 ${isBookmarked ? "text-amber-500 fill-amber-500" : "text-primary"}`} />
              </motion.button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{isBookmarked ? "Remove Bookmark" : "Bookmark"}</p>
            </TooltipContent>
          </Tooltip>

          {/* Share Button */}
          <div className='relative'>
            <Tooltip>
              <TooltipTrigger asChild>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowShareOptions(!showShareOptions)}
                  className='p-3 bg-gradient-to-r from-primary to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all'
                >
                  <Share2 className='w-5 h-5' />
                </motion.button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Share Article</p>
              </TooltipContent>
            </Tooltip>

            <AnimatePresence>
              {showShareOptions && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 10 }}
                  className='absolute bottom-full right-0 mb-3 bg-background/80 backdrop-blur-sm rounded-xl shadow-2xl p-4 border border-primary/20 min-w-[200px]'
                >
                  <div className='grid grid-cols-3 gap-2 mb-3'>
                    {[
                      { platform: "twitter", icon: FaTwitter, color: "text-blue-400" },
                      { platform: "facebook", icon: FaFacebook, color: "text-blue-600" },
                      { platform: "linkedin", icon: FaLinkedin, color: "text-blue-700" },
                      { platform: "whatsapp", icon: FaWhatsapp, color: "text-green-500" },
                      { platform: "reddit", icon: FaReddit, color: "text-orange-500" },
                      { platform: "telegram", icon: FaTelegram, color: "text-blue-500" },
                    ].map((item) => (
                      <button
                        key={item.platform}
                        onClick={() => handleShare(item.platform)}
                        className='p-2 rounded-lg hover:bg-primary/10 transition-colors flex flex-col items-center gap-1'
                      >
                        <item.icon className={`w-5 h-5 ${item.color}`} />
                        <span className='text-xs capitalize'>{item.platform}</span>
                      </button>
                    ))}
                  </div>
                  <Separator className='my-3' />
                  <div className='space-y-2'>
                    <button
                      onClick={() => handleShare("copy")}
                      className='w-full flex items-center gap-3 p-2 rounded-lg hover:bg-primary/10 transition-colors'
                    >
                      {isCopied ? <FaCheck className='text-green-500' /> : <FaCopy className='text-muted-foreground' />}
                      <span className='text-sm'>{isCopied ? "Copied!" : "Copy Link"}</span>
                    </button>
                    <button
                      onClick={() => window.print()}
                      className='w-full flex items-center gap-3 p-2 rounded-lg hover:bg-primary/10 transition-colors'
                    >
                      <Printer className='w-4 h-4 text-muted-foreground' />
                      <span className='text-sm'>Print</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </TooltipProvider>
      </div>

      {/* Hero Header with Gradient */}
      <div className='relative overflow-hidden border-b bg-gradient-to-br from-background via-background to-primary/5'>
        {/* Animated gradient orbs */}
        <div className='absolute top-1/4 -left-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl' />
        <div className='absolute bottom-1/4 -right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl' />

        <div className='relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
          {/* Navigation */}
          <motion.div initial='hidden' animate='visible' variants={fadeIn} className='mb-8 flex items-center justify-between'>
            <Button variant='outline' onClick={() => router.back()} className='gap-2 group hover:bg-primary/10'>
              <ArrowLeft className='w-4 h-4 group-hover:-translate-x-1 transition-transform' />
              Back
            </Button>
            <div className='flex items-center gap-4'>
              <Badge variant='outline' className='gap-2'>
                <Clock className='w-3 h-3' />
                {estimatedReadingTime}
              </Badge>
              <Badge variant='outline' className='gap-2'>
                <Eye className='w-3 h-3' />
                {formatReadCount(article.views || 0)}
              </Badge>
            </div>
          </motion.div>

          {/* Article Header */}
          <motion.header initial='hidden' animate='visible' variants={containerVariants} className='max-w-4xl mx-auto'>
            <motion.div variants={fadeIn} className='flex flex-wrap items-center gap-3 mb-6'>
              <Link href={`/category/${article.categories?.[0]?.slug || "uncategorized"}`}>
                <Badge className='px-4 py-2 bg-gradient-to-r from-primary/10 to-primary/5 text-primary border-primary/20 hover:shadow-md transition-shadow'>
                  <Target className='w-3 h-3 mr-1' />
                  {article.categories?.[0]?.name || "Uncategorized"}
                </Badge>
              </Link>

              {isTrending && (
                <Badge className='bg-gradient-to-r from-red-500 to-pink-500 text-white border-0'>
                  <FaFire className='w-3 h-3 mr-1' />
                  Trending
                </Badge>
              )}

              {isFeatured && (
                <Badge className='bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0'>
                  <Sparkles className='w-3 h-3 mr-1' />
                  Featured
                </Badge>
              )}

              <div className='flex items-center gap-4 text-sm text-muted-foreground ml-auto'>
                <span className='flex items-center gap-1'>
                  <Calendar className='w-4 h-4' />
                  {new Date(article.publishedAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
            </motion.div>

            <motion.h1 variants={fadeIn} className='text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6'>
              {article.title}
            </motion.h1>

            <motion.p variants={fadeIn} className='text-xl text-muted-foreground mb-8 leading-relaxed'>
              {article.excerpt}
            </motion.p>

            {/* Stats Cards */}
            <motion.div variants={fadeIn}>
              <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-8'>
                {stats.map((stat, index) => (
                  <motion.div key={stat.label} variants={scaleUp} whileHover={{ y: -4 }} transition={{ delay: index * 0.1 }}>
                    <Card className={`border bg-gradient-to-br ${stat.color} backdrop-blur-sm hover:shadow-lg transition-all`}>
                      <CardContent className='p-4 text-center'>
                        <div
                          className={`p-3 rounded-xl ${stat.color.replace("bg-gradient-to-br", "bg").replace("10", "20").replace("5", "10")} mb-3`}
                        >
                          <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
                        </div>
                        <div className='text-2xl font-bold'>{stat.value}</div>
                        <div className='text-sm text-muted-foreground'>{stat.label}</div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.header>
        </div>
      </div>

      {/* Main Content */}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='flex flex-col lg:flex-row gap-8'>
          {/* Main Article Content */}
          <motion.article initial='hidden' animate='visible' variants={fadeIn} transition={{ duration: 0.6 }} className='lg:w-2/3'>
            {/* Author Card */}
            <motion.div variants={fadeIn} className='mb-8'>
              <Card className='border hover:shadow-lg transition-all'>
                <CardContent className='p-6'>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-4'>
                      <Avatar className='h-14 w-14 border-2 border-background'>
                        <AvatarImage src={article.authorId?.avatar} />
                        <AvatarFallback className='bg-gradient-to-r from-primary to-purple-600 text-white'>
                          {article.authorId?.username?.charAt(0) || "A"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className='font-semibold text-lg'>{article.authorId?.username || "Anonymous Author"}</p>
                        <p className='text-muted-foreground text-sm'>{article.authorId?.bio || "Blog Contributor"}</p>
                      </div>
                    </div>
                    <Button variant='outline' size='sm' className='gap-2'>
                      <User className='w-4 h-4' />
                      Follow
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Featured Image */}
            {article.featuredImage && (
              <motion.div variants={fadeIn} className='mb-8 rounded-2xl overflow-hidden shadow-2xl'>
                <img src={article.featuredImage} alt={article.title} className='w-full h-auto object-cover' />
              </motion.div>
            )}

            {/* Article Content */}
            <motion.div
              variants={fadeIn}
              className={`prose prose-lg dark:prose-invert max-w-none mb-8 ${
                fontSize === "small" ? "text-sm" : fontSize === "large" ? "text-xl" : fontSize === "xlarge" ? "text-2xl" : ""
              }`}
            >
              <Card className='border'>
                <CardContent className='p-8'>
                  {article.content ? (
                    article.content.split("\n\n").map((paragraph, i) => (
                      <div key={i} className={`pb-4 ${fontSize} `}>
                        {paragraph}
                      </div>
                    ))
                  ) : (
                    <div className='text-center py-12'>
                      <BookOpen className='w-16 h-16 mx-auto mb-6 text-muted-foreground/30' />
                      <p className='text-muted-foreground text-xl'>Content coming soon...</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Tags Section */}
            {article.tags?.length > 0 && (
              <motion.div variants={fadeIn} className='mb-8'>
                <Card className='border'>
                  <CardHeader>
                    <CardTitle className='flex items-center gap-2'>
                      <Tag className='w-5 h-5' />
                      Topics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className='flex flex-wrap gap-2'>
                      {article.tags.map((tag, index) => (
                        <motion.div
                          key={tag}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <Link
                            href={`/tags/${tag.toLowerCase()}`}
                            className='px-4 py-2 bg-gradient-to-r from-primary/10 to-primary/5 hover:from-primary/20 hover:to-primary/10 border border-primary/20 rounded-full text-sm font-medium hover:shadow-md transition-all'
                          >
                            #{tag}
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Engagement Section */}
            <motion.div variants={fadeIn} className='mb-8'>
              <Card className='border bg-gradient-to-br from-primary/5 to-transparent'>
                <CardContent className='p-6'>
                  <div className='flex flex-col md:flex-row items-center justify-between gap-6'>
                    <div>
                      <h3 className='text-xl font-semibold mb-2'>Found this helpful?</h3>
                      <p className='text-muted-foreground'>Share your feedback with the community</p>
                    </div>
                    <div className='flex items-center gap-4'>
                      <LikeButton
                        postId={article._id}
                        initialLiked={Array.isArray(article.meta?.likes) && userId && article.meta.likes.includes(userId)}
                        initialCount={article.meta?.likes?.length || 0}
                        size='lg'
                      />
                      <Button
                        variant='outline'
                        className='gap-2'
                        onClick={() => {
                          document.getElementById("comments")?.scrollIntoView({ behavior: "smooth" });
                        }}
                      >
                        <MessageCircle className='w-4 h-4' />
                        Comment
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.article>

          {/* Sidebar */}
          <aside className='lg:w-1/3 space-y-6'>
            {/* Reading Preferences */}
            <motion.div variants={scaleUp}>
              <Card className='border'>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2 text-sm'>
                    <Settings className='w-4 h-4' />
                    Reading Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <div className='space-y-2'>
                    <Label>Font Size</Label>
                    <div className='flex gap-2'>
                      {["small", "medium", "large", "xlarge"].map((size) => (
                        <Button
                          key={size}
                          size='sm'
                          variant={fontSize === size ? "default" : "outline"}
                          onClick={() => setFontSize(size)}
                          className='flex-1 capitalize'
                        >
                          {size}
                        </Button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Author Profile */}
            <motion.div variants={scaleUp}>
              <Card className='border hover:shadow-lg transition-all'>
                <CardContent className='p-6 text-center'>
                  <Avatar className='h-20 w-20 mx-auto mb-4 border-4 border-background'>
                    <AvatarImage src={article.authorId?.avatar} />
                    <AvatarFallback className='bg-gradient-to-r from-primary to-purple-600 text-white text-2xl'>
                      {article.authorId?.username?.charAt(0) || "A"}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className='text-xl font-bold mb-2'>{article.authorId?.username || "Anonymous"}</h3>
                  <p className='text-muted-foreground text-sm mb-4'>{article.authorId?.bio || "Passionate writer sharing insights"}</p>
                  <Button variant='outline' size='sm' className='w-full gap-2'>
                    <User className='w-4 h-4' />
                    View Profile
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Popular Articles */}
            {popularArticles.length > 0 && (
              <motion.div variants={scaleUp}>
                <Card className='border'>
                  <CardHeader>
                    <CardTitle className='flex items-center gap-2'>
                      <TrendingUp className='w-5 h-5' />
                      Trending Now
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className='space-y-4'>
                      {popularArticles.slice(0, 4).map((popular, index) => (
                        <motion.div
                          key={popular._id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <Link
                            href={`/articles/${popular._id}`}
                            className='group flex items-start gap-3 p-3 rounded-lg hover:bg-primary/5 transition-colors'
                          >
                            <div className='flex-shrink-0 w-12 h-12 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg flex items-center justify-center'>
                              <BookOpen className='w-5 h-5 text-primary' />
                            </div>
                            <div>
                              <h4 className='font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors'>{popular.title}</h4>
                              <div className='flex items-center gap-2 mt-1'>
                                <span className='text-xs text-muted-foreground'>{popular.readTime}</span>
                                <span className='text-xs text-muted-foreground'>•</span>
                                <span className='text-xs text-muted-foreground'>{formatReadCount(popular.views || 0)} reads</span>
                              </div>
                            </div>
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Newsletter */}
            <motion.div variants={scaleUp}>
              <Card className='border bg-gradient-to-br from-primary/10 via-primary/5 to-primary/10 border-primary/20'>
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
          </aside>
        </div>

        {/* Comments Section */}
        <motion.div initial='hidden' whileInView='visible' viewport={{ once: true }} variants={fadeIn} className='mt-12 pb-20' id='comments'>
          <Card className='border'>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <MessageCircle className='w-5 h-5' />
                Comments ({article.commentCount || 0})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='text-center py-12'>
                <MessageCircle className='w-16 h-16 mx-auto mb-6 text-muted-foreground/30' />
                <h3 className='text-2xl font-bold mb-3'>Join the Discussion</h3>
                <p className='text-muted-foreground mb-6 max-w-md mx-auto'>Share your thoughts and engage with other readers</p>
                <Button className='gap-2'>
                  <MessageCircle className='w-4 h-4' />
                  Add Comment
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
