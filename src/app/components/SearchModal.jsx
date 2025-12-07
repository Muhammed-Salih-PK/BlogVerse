"use client";

import { useState, useEffect, useRef } from "react";
import { useDebouncedCallback } from "use-debounce";
import { motion, AnimatePresence } from "framer-motion";
import { fadeIn, fadeInUp, scaleUp } from "@/lib/motionVariants";
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { FiSearch, FiClock, FiEye, FiHeart, FiStar, FiArrowRight, FiX, FiUser, FiCalendar } from "react-icons/fi";
import { FaFire } from "react-icons/fa";
import { Search, Clock, Eye, Heart, Sparkles, BookOpen, User, Calendar, ArrowRight, ExternalLink } from "lucide-react";
import { useRouter } from "next/navigation";

const SearchModal = () => {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const inputRef = useRef(null);

  // Load recent searches from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedSearches = JSON.parse(localStorage.getItem("recentSearches") || "[]");
      setRecentSearches(savedSearches.slice(0, 5));
    }
  }, []);

  // Save search to recent searches
  const saveToRecentSearches = (term) => {
    if (!term.trim()) return;

    const updatedSearches = [term, ...recentSearches.filter((s) => s !== term)].slice(0, 5);

    setRecentSearches(updatedSearches);
    if (typeof window !== "undefined") {
      localStorage.setItem("recentSearches", JSON.stringify(updatedSearches));
    }
  };

  // Fetch search results
  const fetchResults = async (q) => {
    if (!q.trim()) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}&filter=${activeFilter}`);
      const data = await res.json();
      setResults(data.results || []);
    } catch (error) {
      console.error("Error fetching search results:", error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Debounce search
  const debouncedSearch = useDebouncedCallback((q) => fetchResults(q), 300);

  useEffect(() => {
    debouncedSearch(query);
  }, [query, activeFilter, debouncedSearch]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    saveToRecentSearches(query);
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  const handleQuickSearch = (term) => {
    setQuery(term);
    saveToRecentSearches(term);
  };

  const handleResultClick = (item) => {
    saveToRecentSearches(query);
    router.push(`/articles/${item._id}`);
  };

  const clearSearch = () => {
    setQuery("");
    setResults([]);
    inputRef.current?.focus();
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
    });
  };

  const getTrendingScore = (article) => {
    return (article.views || 0) + (article.meta?.likes?.length || 0) * 2 + (article.commentCount || 0) * 3;
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    if (typeof window !== "undefined") {
      localStorage.removeItem("recentSearches");
    }
  };

  return (
    <div>
      <Dialog>
        <DialogTrigger className='w-full'>
          <div className='relative max-w-2xl mb-8'>
            <div className='relative group w-full'>
              <Search className='absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground z-10' size={20} />
              <input
                type='text'
                placeholder='Search 5,000+ articles, tutorials, and guides...'
                className='w-full pl-12 pr-6 py-4 bg-background/80 backdrop-blur-sm border-2 border-primary/20 rounded-xl focus:border-primary/50 focus:ring-2 focus:ring-primary/20 outline-none transition-all text-base'
              />

              <div className='absolute right-3 top-1/2 transform -translate-y-1/2'>
                <kbd className='px-2 py-1 text-xs bg-muted text-muted-foreground rounded'>⌘ K</kbd>
              </div>
            </div>
          </div>
        </DialogTrigger>
        <DialogContent className='sm:max-w-2xl w-full p-0 bg-transparent border-0 shadow-none'>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className='relative'
          >
            {/* Background Overlay */}
            <div className='absolute inset-0 bg-gradient-to-br from-background/95 via-background/98 to-background backdrop-blur-xl rounded-2xl border border-primary/20 z-0 ' />
            <div className='absolute -top-20 -right-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl z-0 pointer-events-none' />
            <div className='absolute -bottom-20 -left-20 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl z-0 pointer-events-none' />

            <div className='relative '>
              <DialogHeader className='px-6 pt-6 pb-4'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-3'>
                    <div className='p-2 rounded-lg bg-gradient-to-r from-primary/10 to-primary/5'>
                      <Search className='w-5 h-5 text-primary' />
                    </div>
                    <div>
                      <DialogTitle className='text-xl font-bold'>Search Articles</DialogTitle>
                      <p className='text-sm text-muted-foreground mt-1'>Find exactly what you're looking for</p>
                    </div>
                  </div>
                </div>
              </DialogHeader>

              <div className='px-6 pb-6'>
                {/* Search Input */}
                <form onSubmit={handleSearch} className='relative mb-4'>
                  <div className='absolute inset-0 bg-gradient-to-r from-primary/5 to-purple-500/5 rounded-xl blur-xl opacity-50' />
                  <div className='relative'>
                    <FiSearch className='absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground z-10' />
                    <Input
                      ref={inputRef}
                      type='text'
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder='Search articles, topics, or authors...'
                      className='pl-12 h-12 text-base bg-background/80 backdrop-blur-sm border-primary/20 focus:border-primary/40 pr-12'
                    />
                    {query && (
                      <button
                        type='button'
                        onClick={clearSearch}
                        className='absolute right-4 top-1/2 transform -translate-y-1/2 hover:scale-110 transition-transform'
                      >
                        <FiX className='w-4 h-4 text-muted-foreground' />
                      </button>
                    )}
                  </div>
                </form>

                {/* Quick Filters */}
                <div className='flex flex-wrap gap-2 mb-4'>
                  {["all", "articles", "tutorials", "guides"].map((filter) => (
                    <Badge
                      key={filter}
                      variant={activeFilter === filter ? "default" : "outline"}
                      className='cursor-pointer capitalize hover:bg-primary/10 text-xs px-3 py-1'
                      onClick={() => setActiveFilter(filter)}
                    >
                      {filter}
                    </Badge>
                  ))}
                </div>

                <AnimatePresence mode='wait'>
                  {/* Search Results */}
                  {query && (
                    <motion.div
                      key='results'
                      initial='hidden'
                      animate='visible'
                      exit='hidden'
                      variants={fadeIn}
                      className='space-y-3 max-h-[400px] overflow-y-auto pr-1'
                    >
                      {isLoading ? (
                        // Loading Skeletons
                        <div className='space-y-3'>
                          {[1, 2, 3].map((i) => (
                            <Card key={i} className='border animate-pulse'>
                              <CardContent className='p-4'>
                                <div className='flex items-start gap-3'>
                                  <Skeleton className='w-14 h-14 rounded-lg' />
                                  <div className='flex-1 space-y-2'>
                                    <Skeleton className='h-4 w-3/4' />
                                    <Skeleton className='h-3 w-full' />
                                    <Skeleton className='h-3 w-2/3' />
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      ) : results.length > 0 ? (
                        // Search Results
                        <div className='space-y-3'>
                          {results.slice(0, 5).map((item, index) => {
                            const trendingScore = getTrendingScore(item);
                            const isTrending = trendingScore > 1000;
                            const isFeatured = item.featured;

                            return (
                              <motion.div
                                key={item._id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                              >
                                <Card
                                  className='border hover:shadow-lg transition-all duration-200 cursor-pointer group'
                                  onClick={() => handleResultClick(item)}
                                >
                                  <CardContent className='p-3'>
                                    <div className='flex items-start gap-3'>
                                      {/* Thumbnail */}
                                      <div className='w-14 h-14 flex-shrink-0 rounded-lg overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5'>
                                        {item.featuredImage ? (
                                          <img
                                            src={item.featuredImage}
                                            alt={item.title}
                                            className='w-full h-full object-cover group-hover:scale-105 transition-transform'
                                          />
                                        ) : (
                                          <div className='w-full h-full flex items-center justify-center'>
                                            <BookOpen className='w-6 h-6 text-primary/30' />
                                          </div>
                                        )}
                                      </div>

                                      {/* Content */}
                                      <div className='flex-1 min-w-0'>
                                        <div className='flex items-center gap-2 mb-1'>
                                          {isFeatured && (
                                            <Badge className='bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs px-1.5 py-0'>
                                              <FiStar className='w-2 h-2 mr-1' />
                                              Featured
                                            </Badge>
                                          )}
                                          {isTrending && (
                                            <Badge className='bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs px-1.5 py-0'>
                                              <FaFire className='w-2 h-2 mr-1' />
                                              Trending
                                            </Badge>
                                          )}
                                        </div>

                                        <h3 className='font-semibold text-sm line-clamp-1 group-hover:text-primary transition-colors mb-1'>
                                          {item.title}
                                        </h3>

                                        <p className='text-xs text-muted-foreground line-clamp-2 mb-2'>{item.excerpt}</p>

                                        <div className='flex items-center justify-between text-xs'>
                                          <div className='flex items-center gap-3 text-muted-foreground'>
                                            <span className='flex items-center gap-1'>
                                              <FiUser className='w-3 h-3' />
                                              <span className='truncate max-w-[80px]'>{item.authorId?.username || "Anonymous"}</span>
                                            </span>
                                            <span className='flex items-center gap-1'>
                                              <FiCalendar className='w-3 h-3' />
                                              {formatDate(item.publishedAt)}
                                            </span>
                                          </div>
                                          <div className='flex items-center gap-2'>
                                            <span className='flex items-center gap-1 text-muted-foreground'>
                                              <FiEye className='w-3 h-3' />
                                              {formatCount(item.views || 0)}
                                            </span>
                                            <span className='flex items-center gap-1 text-muted-foreground'>
                                              <FiHeart className='w-3 h-3' />
                                              {item.meta?.likes?.length || 0}
                                            </span>
                                          </div>
                                        </div>
                                      </div>

                                      <ArrowRight className='w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0 mt-1' />
                                    </div>
                                  </CardContent>
                                </Card>
                              </motion.div>
                            );
                          })}

                          {/* View All Results Button */}
                          {results.length > 5 && (
                            <Button
                              onClick={() => {
                                saveToRecentSearches(query);
                                router.push(`/search?q=${encodeURIComponent(query)}`);
                              }}
                              className='w-full gap-2 group mt-2'
                              variant='outline'
                              size='sm'
                            >
                              <FiSearch className='w-3 h-3' />
                              View all {results.length} results
                              <FiArrowRight className='w-3 h-3 group-hover:translate-x-1 transition-transform' />
                            </Button>
                          )}
                        </div>
                      ) : query && !isLoading ? (
                        // No Results
                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className='text-center py-6'>
                          <div className='w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-primary/10 to-primary/5 rounded-full flex items-center justify-center'>
                            <Search className='w-8 h-8 text-primary/30' />
                          </div>
                          <h3 className='text-base font-semibold mb-1'>No results found</h3>
                          <p className='text-muted-foreground text-sm'>Try different keywords or check your spelling</p>
                        </motion.div>
                      ) : null}
                    </motion.div>
                  )}

                  {/* Recent Searches */}
                  {!query && recentSearches.length > 0 && (
                    <motion.div key='recent' initial='hidden' animate='visible' variants={fadeIn} className='space-y-3'>
                      <div className='flex items-center justify-between'>
                        <h3 className='text-sm font-semibold flex items-center gap-2 text-muted-foreground'>
                          <Clock className='w-3 h-3' />
                          Recent Searches
                        </h3>
                        <Button variant='ghost' size='sm' onClick={clearRecentSearches} className='text-xs h-6 px-2'>
                          Clear All
                        </Button>
                      </div>
                      <div className='flex flex-wrap gap-2'>
                        {recentSearches.map((term, index) => (
                          <motion.div key={term} variants={scaleUp} transition={{ delay: index * 0.05 }}>
                            <Badge
                              variant='outline'
                              className='cursor-pointer hover:bg-primary/10 hover:text-primary gap-1 px-3 py-1.5'
                              onClick={() => handleQuickSearch(term)}
                            >
                              <FiSearch className='w-3 h-3' />
                              {term}
                            </Badge>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* No Recent Searches */}
                  {!query && recentSearches.length === 0 && (
                    <motion.div key='empty' initial={{ opacity: 0 }} animate={{ opacity: 1 }} className='text-center py-8'>
                      <div className='w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-primary/10 to-primary/5 rounded-full flex items-center justify-center'>
                        <Sparkles className='w-8 h-8 text-primary/30' />
                      </div>
                      <h3 className='text-base font-semibold mb-1'>Start searching</h3>
                      <p className='text-muted-foreground text-sm mb-4'>Type to discover articles, tutorials, and more</p>
                      <div className='flex items-center justify-center gap-2 text-xs text-muted-foreground'>
                        <span>Try:</span>
                        <button onClick={() => handleQuickSearch("React")} className='text-primary hover:underline'>
                          React
                        </button>
                        <span>•</span>
                        <button onClick={() => handleQuickSearch("Next.js")} className='text-primary hover:underline'>
                          Next.js
                        </button>
                        <span>•</span>
                        <button onClick={() => handleQuickSearch("TypeScript")} className='text-primary hover:underline'>
                          TypeScript
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Footer */}
              <div className='px-6 py-3 border-t'>
                <div className='flex items-center justify-between text-xs text-muted-foreground'>
                  <div className='flex items-center gap-3'>
                    <span>
                      Press <kbd className='px-1.5 py-0.5 bg-muted rounded text-xs'>Esc</kbd> to close
                    </span>
                    <span>•</span>
                    <span>
                      Press <kbd className='px-1.5 py-0.5 bg-muted rounded text-xs'>↵</kbd> to search
                    </span>
                  </div>
                  <Button
                    size='sm'
                    variant='ghost'
                    onClick={() => {
                      router.push("/search");
                    }}
                    className='gap-1 text-xs h-7'
                  >
                    Advanced Search
                    <ExternalLink className='w-3 h-3' />
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SearchModal;
