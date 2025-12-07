"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { fadeInUp, staggerContainer, scaleUp } from "@/lib/motionVariants";
import { genericFetchData } from "@/lib/genericFetchData";
import { toast } from "sonner";
import { useAppSelector } from "@/hooks/reduxHooks";
import LikeButton from "../../components/LikeButton";
import ProfileSkeleton from "../../components/skeletons/ProfileSkeleton";

// Icons
import {
  FiEdit,
  FiFileText,
  FiChevronLeft,
  FiChevronRight,
  FiStar,
  FiTrash2,
  FiLogOut,
  FiPlus,
  FiGrid,
  FiList,
  FiMoreVertical,
  FiArrowRight,
} from "react-icons/fi";

import { User, Mail, Globe, Twitter, Github, Calendar, Eye, Clock, BookOpen, Target, Crown, Heart, Users } from "lucide-react";

// UI Components
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("published");
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const router = useRouter();
  const postsPerPage = 6;
  const currentUser = useAppSelector((state) => state.auth.user);

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const scaleUp = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

  useEffect(() => {
    async function fetchProfile() {
      setIsLoading(true);
      try {
        const [data, error] = await genericFetchData(`/api/profile`);

        if (error) {
          throw new Error(error.message || "Failed to fetch profile data");
        }

        setProfile(data);
      } catch (err) {
        setError(err.message || "Error fetching profile data");
        console.error("Profile fetch error:", err);
        toast.error("Failed to load profile data");
      } finally {
        setIsLoading(false);
      }
    }

    fetchProfile();
  }, []);

  const handleDelete = useCallback(
    async (id) => {
      try {
        const [data, error] = await genericFetchData(`/api/posts/${id}`, "DELETE");

        if (error) {
          throw new Error(error.message || "Failed to delete post");
        }

        setProfile((prev) => ({
          ...prev,
          posts: {
            ...prev.posts,
            [activeTab]: prev.posts[activeTab].filter((post) => post.id !== id),
          },
        }));
        toast.success("Post deleted successfully");
      } catch (err) {
        console.error("Delete error:", err);
        toast.error(err.message || "Failed to delete post");
      }
    },
    [activeTab]
  );

  const handleLogout = useCallback(async () => {
    try {
      const [data, error] = await genericFetchData("/api/auth/logout", "POST");

      if (error) {
        throw new Error(error.message || "Logout failed");
      }

      toast.success("Logged out successfully");
      router.push("/");
    } catch (err) {
      console.error("Logout error:", err);
      toast.error(err.message || "Logout failed");
    }
  }, [router]);

  // Memoized calculations
  const stats = useMemo(() => {
    if (!profile) return [];

    const totalPosts = profile.posts.published.length + profile.posts.drafts.length;
    const totalViews = profile.posts.published.reduce((sum, post) => sum + (post.meta?.views || 0), 0);
    const totalLikes = profile.posts.published.reduce((sum, post) => sum + (post.meta?.likes?.length || 0), 0);
    const avgReadTime =
      profile.posts.published.length > 0
        ? Math.round(profile.posts.published.reduce((sum, post) => sum + (post.readTime || 5), 0) / profile.posts.published.length)
        : 0;

    return [
      {
        label: "Total Posts",
        value: totalPosts,
        icon: BookOpen,
        color: "from-blue-500 to-cyan-500",

        description: "Articles written",
      },
      {
        label: "Published",
        value: profile.posts.published.length,
        icon: Target,
        color: "from-emerald-500 to-teal-500",

        description: "Public articles",
      },
      {
        label: "Total Views",
        value: totalViews.toLocaleString(),
        icon: Eye,
        color: "from-purple-500 to-pink-500",

        description: "Article views",
      },
      {
        label: "Total Likes",
        value: totalLikes.toLocaleString(),
        icon: Heart,
        color: "from-rose-500 to-red-500",

        description: "Received likes",
      },
      {
        label: "Avg. Read Time",
        value: `${avgReadTime}m`,
        icon: Clock,
        color: "from-amber-500 to-orange-500",

        description: "Average reading time",
      },
      {
        label: "Followers",
        value: profile.followers?.toLocaleString() || "0",
        icon: Users,
        color: "from-indigo-500 to-violet-500",

        description: "Profile followers",
      },
    ];
  }, [profile]);

  const getCurrentPosts = useCallback(() => {
    if (!profile) return [];
    const posts = profile.posts[activeTab];
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    return posts.slice(indexOfFirstPost, indexOfLastPost);
  }, [profile, activeTab, currentPage]);

  const totalPages = useMemo(() => {
    if (!profile) return 0;
    return Math.ceil(profile.posts[activeTab].length / postsPerPage);
  }, [profile, activeTab]);

  const handlePageChange = useCallback(
    (newPage) => {
      if (newPage >= 1 && newPage <= totalPages) {
        setCurrentPage(newPage);
      }
    },
    [totalPages]
  );

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

  if (isLoading) return <ProfileSkeleton />;

  if (error) {
    return (
      <div className='min-h-screen bg-gradient-to-b from-background via-background to-primary/5 flex items-center justify-center'>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className='max-w-md'>
          <Card className='border border-primary/20 bg-background/50 backdrop-blur-sm'>
            <CardContent className='p-8 text-center'>
              <div className='w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-rose-500/10 to-rose-500/5 rounded-full flex items-center justify-center'>
                <svg className='w-8 h-8 text-rose-500' fill='currentColor' viewBox='0 0 20 20'>
                  <path
                    fillRule='evenodd'
                    d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
                    clipRule='evenodd'
                  />
                </svg>
              </div>
              <h3 className='text-xl font-bold mb-2 text-rose-600'>Error Loading Profile</h3>
              <p className='text-muted-foreground mb-6'>{error}</p>
              <Button
                onClick={() => window.location.reload()}
                className='gap-2 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700'
              >
                Try Again
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  if (!profile) return null;

  const showProgress = !profile.user.profileComplete;
  const currentPosts = getCurrentPosts();
  const userLevel = profile.user.level || 1;
  const userRank = profile.user.rank || "Beginner";

  return (
    <div className='min-h-screen bg-gradient-to-b from-background via-background to-primary/5'>
      {/* Hero Header */}
      <section className='relative overflow-hidden border-b bg-gradient-to-br from-primary/10 via-primary/5 to-transparent'>
        <div className='absolute top-1/4 -left-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl' />
        <div className='absolute bottom-1/4 -right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl' />
        <div className='absolute top-0 right-1/4 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl' />

        <div className='relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
          {/* Profile Progress */}
          {showProgress && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className='mb-6 bg-background/50 backdrop-blur-sm border border-primary/20 rounded-xl p-4'
            >
              <div className='flex items-center justify-between mb-3'>
                <div>
                  <h3 className='font-semibold mb-1'>Complete your profile</h3>
                  <p className='text-sm text-muted-foreground'>Add missing information to unlock all features</p>
                </div>
                <Badge className='bg-gradient-to-r from-amber-500 to-orange-500'>{profile.completionPercentage}%</Badge>
              </div>
              <Progress value={profile.completionPercentage} className='h-2 bg-primary/10'>
                <div className='h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-500' />
              </Progress>
            </motion.div>
          )}

          {/* Profile Header */}
          <motion.div variants={staggerContainer} initial='hidden' animate='visible' className='mb-8'>
            <div className='flex flex-col lg:flex-row gap-8'>
              {/* Profile Image */}
              <motion.div variants={scaleUp} className='lg:w-1/4'>
                <Card className='border border-primary/20 bg-background/50 backdrop-blur-sm overflow-hidden'>
                  <div className='relative'>
                    <div className='h-32 bg-gradient-to-r from-primary to-purple-500' />
                    <div className='absolute -bottom-16 left-1/2 transform -translate-x-1/2'>
                      <Avatar className='w-32 h-32 border-4 border-background shadow-xl group'>
                        <AvatarImage src={profile.user.avatar || "/default-avatar.jpg"} alt={profile.user.username} />
                        <AvatarFallback className='bg-gradient-to-br from-primary to-purple-500 text-white text-2xl'>
                          {profile.user.username?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                        <Link
                          href='/profile/edit'
                          className='absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full'
                        >
                          <FiEdit className='text-white text-2xl' />
                        </Link>
                      </Avatar>
                    </div>
                  </div>
                  <CardContent className='pt-20 pb-6 text-center'>
                    <div className='space-y-2'>
                      <h1 className='text-2xl font-bold'>{profile.user.username}</h1>
                      <div className='flex items-center justify-center gap-2'>
                        <Badge className='bg-gradient-to-r from-primary to-purple-500'>
                          <Crown className='w-3 h-3 mr-1' />
                          {userRank}
                        </Badge>
                        <Badge variant='outline' className='border-primary/20'>
                          Level {userLevel}
                        </Badge>
                      </div>
                      <p className='text-muted-foreground text-sm mt-2'>{profile.user.bio || "No bio yet"}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Profile Info */}
              <motion.div variants={fadeInUp} className='lg:w-3/4'>
                <Card className='border border-primary/20 bg-background/50 backdrop-blur-sm h-full'>
                  <CardHeader>
                    <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
                      <div>
                        <CardTitle className='text-2xl flex items-center gap-2'>
                          <User className='w-6 h-6 text-primary' />
                          {profile.user.username}'s Profile
                        </CardTitle>
                        <CardDescription>Joined {formatDate(profile.user.createdAt)}</CardDescription>
                      </div>
                      <div className='flex flex-wrap gap-2'>
                        <Button asChild variant='outline' size='sm' className='gap-2 border-primary/20 hover:border-primary/40'>
                          <Link href='/profile/edit'>
                            <FiEdit className='w-4 h-4' />
                            Edit Profile
                          </Link>
                        </Button>
                        <Button asChild className='gap-2 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90'>
                          <Link href='/profile/newpost'>
                            <FiPlus className='w-4 h-4' />
                            New Post
                          </Link>
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant='ghost' size='sm'>
                              <FiMoreVertical className='w-4 h-4' />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align='end'>
                            <DropdownMenuItem onClick={handleLogout} className='text-rose-600'>
                              <FiLogOut className='w-4 h-4 mr-2' />
                              Logout
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent>
                    {/* Stats Grid */}
                    <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6'>
                      {stats.map((stat, index) => (
                        <motion.div key={stat.label} variants={scaleUp} whileHover={{ y: -4 }} transition={{ delay: index * 0.1 }}>
                          <Card className='border border-primary/20 hover:border-primary/40 transition-all'>
                            <CardContent className='p-4 text-center'>
                              <div
                                className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} bg-opacity-10 mb-3 mx-auto w-12 h-12 flex items-center justify-center`}
                              >
                                <stat.icon className={`w-5 text-white h-5 `} />
                              </div>
                              <div className='text-2xl font-bold mb-1'>{stat.value}</div>
                              <div className='text-xs text-muted-foreground'>{stat.label}</div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>

                    {/* Contact & Social */}
                    <div className='space-y-4'>
                      <div className='flex flex-wrap gap-4'>
                        <div className='flex items-center gap-2 text-sm'>
                          <Mail className='w-4 h-4 text-muted-foreground' />
                          <span>{profile.user.email}</span>
                        </div>
                        {profile.user.socialLinks?.website && (
                          <a
                            href={profile.user.socialLinks.website}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='flex items-center gap-2 text-sm hover:text-primary transition-colors'
                          >
                            <Globe className='w-4 h-4' />
                            <span>Website</span>
                          </a>
                        )}
                        {profile.user.socialLinks?.twitter && (
                          <a
                            href={`https://twitter.com/${profile.user.socialLinks.twitter}`}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='flex items-center gap-2 text-sm hover:text-blue-500 transition-colors'
                          >
                            <Twitter className='w-4 h-4' />
                            <span>Twitter</span>
                          </a>
                        )}
                        {profile.user.socialLinks?.github && (
                          <a
                            href={`https://github.com/${profile.user.socialLinks.github}`}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='flex items-center gap-2 text-sm hover:text-gray-800 dark:hover:text-gray-200 transition-colors'
                          >
                            <Github className='w-4 h-4' />
                            <span>GitHub</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20'>
        {/* Posts Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className='border border-primary/20 bg-background/50 backdrop-blur-sm'>
            <CardHeader>
              <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
                <div>
                  <CardTitle>Your Content</CardTitle>
                  <CardDescription>Manage your published articles and drafts</CardDescription>
                </div>
                <div className='flex items-center gap-3'>
                  <div className='flex border border-primary/20 rounded-lg p-1'>
                    <Button variant={viewMode === "grid" ? "default" : "ghost"} size='sm' onClick={() => setViewMode("grid")} className='gap-2'>
                      <FiGrid className='w-4 h-4' />
                      Grid
                    </Button>
                    <Button variant={viewMode === "list" ? "default" : "ghost"} size='sm' onClick={() => setViewMode("list")} className='gap-2'>
                      <FiList className='w-4 h-4' />
                      List
                    </Button>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className='w-full'>
                <TabsList className='bg-background/50 backdrop-blur-sm border border-primary/20 p-1'>
                  <TabsTrigger
                    value='published'
                    className='data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-purple-500'
                  >
                    <FiFileText className='w-4 h-4 mr-2' />
                    Published ({profile.posts.published.length})
                  </TabsTrigger>
                  <TabsTrigger
                    value='drafts'
                    className='data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-orange-500'
                  >
                    <FiEdit className='w-4 h-4 mr-2' />
                    Drafts ({profile.posts.drafts.length})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value='published' className='mt-6'>
                  <AnimatePresence mode='wait'>
                    {currentPosts.length > 0 ? (
                      viewMode === "grid" ? (
                        <motion.div
                          variants={staggerContainer}
                          initial='hidden'
                          animate='visible'
                          className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                        >
                          {currentPosts.map((post, index) => (
                            <ProfilePostCard
                              key={post.id}
                              post={post}
                              index={index}
                              onDelete={handleDelete}
                              currentUser={currentUser}
                              formatDate={formatDate}
                            />
                          ))}
                        </motion.div>
                      ) : (
                        <motion.div variants={fadeInUp}>
                          {currentPosts.map((post) => (
                            <ProfilePostList key={post.id} post={post} onDelete={handleDelete} currentUser={currentUser} formatDate={formatDate} />
                          ))}
                        </motion.div>
                      )
                    ) : (
                      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className='text-center py-12'>
                        <div className='w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-primary/10 to-primary/5 rounded-full flex items-center justify-center'>
                          <FiFileText className='w-12 h-12 text-primary/30' />
                        </div>
                        <h3 className='text-xl font-bold mb-2'>No published posts yet</h3>
                        <p className='text-muted-foreground mb-6'>Start sharing your knowledge with the community</p>
                        <Button asChild className='gap-2 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90'>
                          <Link href='/profile/newpost'>
                            <FiPlus className='w-4 h-4' />
                            Create Your First Post
                          </Link>
                        </Button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </TabsContent>

                <TabsContent value='drafts' className='mt-6'>
                  <AnimatePresence mode='wait'>
                    {currentPosts.length > 0 ? (
                      viewMode === "grid" ? (
                        <motion.div
                          variants={staggerContainer}
                          initial='hidden'
                          animate='visible'
                          className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                        >
                          {currentPosts.map((post, index) => (
                            <ProfilePostCard
                              key={post.id}
                              post={post}
                              index={index}
                              onDelete={handleDelete}
                              currentUser={currentUser}
                              formatDate={formatDate}
                              isDraft={true}
                            />
                          ))}
                        </motion.div>
                      ) : (
                        <motion.div variants={fadeInUp}>
                          {currentPosts.map((post) => (
                            <ProfilePostList
                              key={post.id}
                              post={post}
                              onDelete={handleDelete}
                              currentUser={currentUser}
                              formatDate={formatDate}
                              isDraft={true}
                            />
                          ))}
                        </motion.div>
                      )
                    ) : (
                      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className='text-center py-12'>
                        <div className='w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-amber-500/10 to-amber-500/5 rounded-full flex items-center justify-center'>
                          <FiEdit className='w-12 h-12 text-amber-500/30' />
                        </div>
                        <h3 className='text-xl font-bold mb-2'>No drafts yet</h3>
                        <p className='text-muted-foreground mb-6'>Start writing your next article</p>
                        <Button asChild className='gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600'>
                          <Link href='/profile/newpost'>
                            <FiPlus className='w-4 h-4' />
                            Create Draft
                          </Link>
                        </Button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </TabsContent>
              </Tabs>

              {/* Pagination */}
              {totalPages > 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className='flex items-center justify-between mt-6 pt-6 border-t border-primary/20'
                >
                  <div className='text-sm text-muted-foreground'>
                    Showing {(currentPage - 1) * postsPerPage + 1} - {Math.min(currentPage * postsPerPage, profile.posts[activeTab].length)} of{" "}
                    {profile.posts[activeTab].length} posts
                  </div>
                  <div className='flex gap-2'>
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className='gap-2 border-primary/20 hover:border-primary/40'
                    >
                      <FiChevronLeft className='w-4 h-4' />
                      Previous
                    </Button>
                    <div className='flex gap-1'>
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
                            onClick={() => handlePageChange(pageNum)}
                            className={
                              currentPage === pageNum ? "bg-gradient-to-r from-primary to-purple-500" : "border-primary/20 hover:border-primary/40"
                            }
                          >
                            {pageNum}
                          </Button>
                        );
                      })}
                    </div>
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className='gap-2 border-primary/20 hover:border-primary/40'
                    >
                      Next
                      <FiChevronRight className='w-4 h-4' />
                    </Button>
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

// Grid View Card Component
function ProfilePostCard({ post, index, onDelete, currentUser, formatDate, isDraft = false }) {
  return (
    <motion.div variants={fadeInUp} transition={{ delay: index * 0.1 }}>
      <Card className='border border-primary/20 hover:border-primary/40 hover:shadow-xl transition-all duration-300 group h-full bg-background/50 backdrop-blur-sm'>
        {/* Post Image */}
        <div className='relative h-48 overflow-hidden'>
          {post.featuredImage ? (
            <>
              <img
                src={post.featuredImage}
                alt={post.title}
                className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-500'
              />
              <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent' />
            </>
          ) : (
            <div className='w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-purple-500/10'>
              <BookOpen className='w-16 h-16 text-primary/30' />
            </div>
          )}
          {post.featured && (
            <Badge className='absolute top-3 left-3 bg-gradient-to-r from-amber-500 to-orange-500 border-0'>
              <FiStar className='w-3 h-3 mr-1' />
              Featured
            </Badge>
          )}
          {post.status === "published" && (
            <Badge className='absolute top-3 right-3 bg-background/90 backdrop-blur-sm border-primary/20'>
              <Eye className='w-3 h-3 mr-1' />
              {post.meta?.views || 0}
            </Badge>
          )}
        </div>

        <CardContent className='p-4'>
          <div className='space-y-3'>
            <div>
              <h3 className='font-semibold text-lg line-clamp-2 mb-2 group-hover:text-primary transition-colors'>
                <Link href={isDraft ? `/profile/post/edit/${post.id}` : `/articles/${post.id}`}>{post.title}</Link>
              </h3>
              <p className='text-sm text-muted-foreground line-clamp-2'>{post.excerpt}</p>
            </div>

            <div className='flex items-center justify-between text-sm'>
              <div className='flex items-center gap-2'>
                <Badge
                  variant={isDraft ? "outline" : "secondary"}
                  className={isDraft ? "border-amber-500/30 text-amber-600 bg-amber-500/10" : "bg-primary/10 text-primary border-primary/20"}
                >
                  {isDraft ? "Draft" : "Published"}
                </Badge>
                <span className='text-muted-foreground flex items-center gap-1'>
                  <Clock className='w-3 h-3' />
                  {formatDate(post.publishedAt || post.updatedAt)}
                </span>
              </div>
              {!isDraft && (
                <div className='flex items-center gap-1 text-muted-foreground'>
                  <Heart className='w-3 h-3' />
                  <span>{post.meta?.likes?.length || 0}</span>
                </div>
              )}
            </div>

            {!isDraft && post.tags && post.tags.length > 0 && (
              <div className='flex flex-wrap gap-1'>
                {post.tags.slice(0, 2).map((tag) => (
                  <Badge key={tag} variant='outline' size='sm' className='border-primary/20 text-xs'>
                    #{tag}
                  </Badge>
                ))}
                {post.tags.length > 2 && (
                  <Badge variant='ghost' size='sm' className='text-xs'>
                    +{post.tags.length - 2}
                  </Badge>
                )}
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className='p-4 pt-0'>
          <div className='flex items-center justify-between w-full gap-2'>
            <Button asChild variant='outline' size='sm' className='flex-1 border-primary/20 hover:border-primary/40'>
              <Link href={`/profile/post/edit/${post.id}`}>
                <FiEdit className='w-4 h-4 mr-2' />
                Edit
              </Link>
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant='outline' size='sm' className='border-rose-500/30 text-rose-600 hover:bg-rose-50 hover:text-rose-700'>
                  <FiTrash2 className='w-4 h-4' />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className='border border-primary/20'>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Post</AlertDialogTitle>
                  <AlertDialogDescription>Are you sure you want to delete "{post.title}"? This action cannot be undone.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => onDelete(post.id)}
                    className='bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700'
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}

// List View Component
function ProfilePostList({ post, onDelete, currentUser, formatDate, isDraft = false }) {
  return (
    <Card className='border border-primary/20 hover:border-primary/40 hover:shadow-lg transition-all duration-300 group mb-4 last:mb-0 bg-background/50 backdrop-blur-sm'>
      <div className='flex flex-col md:flex-row'>
        {/* Thumbnail */}
        <div className='md:w-48 flex-shrink-0'>
          <div className='h-48 md:h-full overflow-hidden'>
            {post.featuredImage ? (
              <img
                src={post.featuredImage}
                alt={post.title}
                className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-500'
              />
            ) : (
              <div className='w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-purple-500/10'>
                <BookOpen className='w-12 h-12 text-primary/30' />
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className='flex-1 p-6'>
          <div className='flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4'>
            <div className='flex-1'>
              <div className='flex items-center gap-3 mb-3'>
                <Badge
                  variant={isDraft ? "outline" : "secondary"}
                  className={isDraft ? "border-amber-500/30 text-amber-600 bg-amber-500/10" : "bg-primary/10 text-primary border-primary/20"}
                >
                  {isDraft ? "Draft" : "Published"}
                </Badge>
                {post.featured && (
                  <Badge className='bg-gradient-to-r from-amber-500 to-orange-500'>
                    <FiStar className='w-3 h-3 mr-1' />
                    Featured
                  </Badge>
                )}
              </div>

              <h3 className='text-xl font-semibold mb-3 group-hover:text-primary transition-colors'>
                <Link href={isDraft ? `/profile/post/edit/${post.id}` : `/articles/${post.id}`}>{post.title}</Link>
              </h3>
              <p className='text-muted-foreground mb-4 line-clamp-2'>{post.excerpt}</p>

              <div className='flex flex-wrap items-center gap-4 text-sm text-muted-foreground'>
                <div className='flex items-center gap-1'>
                  <Calendar className='w-4 h-4' />
                  {formatDate(post.publishedAt || post.updatedAt)}
                </div>
                {!isDraft && (
                  <>
                    <div className='flex items-center gap-1'>
                      <Eye className='w-4 h-4' />
                      {post.meta?.views || 0} views
                    </div>
                    <div className='flex items-center gap-1'>
                      <Heart className='w-4 h-4' />
                      {post.meta?.likes?.length || 0} likes
                    </div>
                    <div className='flex items-center gap-1'>
                      <Clock className='w-4 h-4' />
                      {post.readTime || 5} min read
                    </div>
                  </>
                )}
              </div>

              {!isDraft && post.tags && post.tags.length > 0 && (
                <div className='flex flex-wrap gap-2 mt-4'>
                  {post.tags.slice(0, 4).map((tag) => (
                    <Badge key={tag} variant='outline' size='sm' className='border-primary/20'>
                      #{tag}
                    </Badge>
                  ))}
                  {post.tags.length > 4 && (
                    <Badge variant='ghost' size='sm'>
                      +{post.tags.length - 4}
                    </Badge>
                  )}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className='flex flex-col gap-2'>
              <Button asChild variant='outline' size='sm' className='gap-2 border-primary/20 hover:border-primary/40'>
                <Link href={`/profile/post/edit/${post.id}`}>
                  <FiEdit className='w-4 h-4' />
                  Edit
                </Link>
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant='outline' size='sm' className='gap-2 border-rose-500/30 text-rose-600 hover:bg-rose-50 hover:text-rose-700'>
                    <FiTrash2 className='w-4 h-4' />
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className='border border-primary/20'>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Post</AlertDialogTitle>
                    <AlertDialogDescription>Are you sure you want to delete "{post.title}"? This action cannot be undone.</AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => onDelete(post.id)}
                      className='bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700'
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              {!isDraft && (
                <Button asChild variant='ghost' size='sm' className='gap-2 hover:bg-primary/10'>
                  <Link href={`/articles/${post.id}`}>
                    <FiArrowRight className='w-4 h-4' />
                    View
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
