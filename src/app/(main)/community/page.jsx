"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { FiStar, FiFilter, FiSearch, FiChevronRight, FiExternalLink } from "react-icons/fi";
import { FaDiscord, FaTwitter, FaLinkedin, FaGithub, FaYoutube, FaFire } from "react-icons/fa";
import {
  Users,
  MessageSquare,
  Calendar,
  Award,
  BookOpen,
  Heart,
  Share2,
  Plus,
  Sparkles,
  Trophy,
  Target,
  Globe,
  Clock,
  Zap,
  Users2,
  MessageCircle,
  Rocket,
  PartyPopper,
  Eye,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const CommunityPage = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  // Mock data - Replace with your actual data
  const topContributors = [
    { id: 1, name: "Alex Chen", role: "Senior Developer", avatar: "/avatars/1.jpg", articles: 42, likes: 1250, streak: 28 },
    { id: 2, name: "Sarah Johnson", role: "UX Designer", avatar: "/avatars/2.jpg", articles: 38, likes: 980, streak: 45 },
    { id: 3, name: "David Park", role: "DevOps Engineer", avatar: "/avatars/3.jpg", articles: 31, likes: 760, streak: 21 },
    { id: 4, name: "Maria Rodriguez", role: "Frontend Lead", avatar: "/avatars/4.jpg", articles: 56, likes: 2100, streak: 92 },
    { id: 5, name: "James Wilson", role: "Full-stack Dev", avatar: "/avatars/5.jpg", articles: 29, likes: 640, streak: 15 },
  ];

  const recentDiscussions = [
    { id: 1, title: "Best practices for React Server Components", author: "Alex Chen", replies: 42, views: 1200, category: "React", isPinned: true },
    { id: 2, title: "TypeScript tips for beginners", author: "Sarah Johnson", replies: 28, views: 850, category: "TypeScript", isPinned: false },
    { id: 3, title: "Deploying Next.js on AWS Lambda", author: "David Park", replies: 35, views: 950, category: "DevOps", isPinned: true },
    { id: 4, title: "CSS Grid vs Flexbox in 2024", author: "Maria Rodriguez", replies: 56, views: 2100, category: "CSS", isPinned: false },
    { id: 5, title: "State management in large React apps", author: "James Wilson", replies: 31, views: 780, category: "React", isPinned: false },
  ];

  const upcomingEvents = [
    { id: 1, title: "React Conf 2024 Watch Party", date: "2024-05-15", time: "18:00", attendees: 120, type: "virtual" },
    { id: 2, title: "TypeScript Workshop", date: "2024-05-20", time: "14:00", attendees: 85, type: "in-person" },
    { id: 3, title: "Open Source Contribution Day", date: "2024-05-25", time: "10:00", attendees: 200, type: "virtual" },
    { id: 4, title: "Frontend Architecture Meetup", date: "2024-06-01", time: "16:00", attendees: 65, type: "in-person" },
  ];

  const communityStats = {
    totalMembers: 12542,
    activeThisWeek: 3248,
    articlesPublished: 5280,
    totalDiscussions: 4210,
    eventsHosted: 128,
    countries: 120,
  };

  const socialLinks = [
    { platform: "Discord", icon: <FaDiscord />, members: "8.2K", link: "https://discord.gg/blogverse", color: "bg-indigo-500" },
    { platform: "Twitter", icon: <FaTwitter />, followers: "12.5K", link: "https://twitter.com/blogverse", color: "bg-blue-400" },
    { platform: "GitHub", icon: <FaGithub />, contributors: "245", link: "https://github.com/blogverse", color: "bg-gray-800" },
    { platform: "LinkedIn", icon: <FaLinkedin />, followers: "5.7K", link: "https://linkedin.com/blogverse", color: "bg-blue-600" },
    { platform: "YouTube", icon: <FaYoutube />, subscribers: "3.4K", link: "https://youtube.com/blogverse", color: "bg-red-500" },
  ];

  const formatNumber = (num) => {
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num;
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
    <div className='min-h-screen bg-gradient-to-b from-background via-background to-primary/5 pb-20'>
      {/* Hero Section */}
      <section className='relative overflow-hidden border-b'>
        <div className='absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent' />
        <div className='absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl' />
        <div className='absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl' />

        <div className='relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20'>
          <motion.div initial='hidden' animate='visible' variants={staggerContainer} className='text-center max-w-4xl mx-auto'>
            <motion.div variants={fadeInUp}>
              <Badge className='mb-6 px-4 py-2 bg-primary/10 text-primary hover:bg-primary/20'>
                <Sparkles className='w-4 h-4 mr-2' />
                Join Our Community
              </Badge>
            </motion.div>

            <motion.h1 variants={fadeInUp} className='text-5xl md:text-7xl font-bold tracking-tight mb-6'>
              Build. Learn. <span className='bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent'>Grow Together</span>
            </motion.h1>

            <motion.p variants={fadeInUp} className='text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed'>
              Connect with developers worldwide. Share knowledge, collaborate on projects, and grow your skills in our vibrant community.
            </motion.p>

            <motion.div variants={fadeInUp} className='flex flex-col sm:flex-row gap-4 justify-center'>
              <Button size='lg' className='gap-2 group' asChild>
                <Link href='/community/join'>
                  <Users className='w-5 h-5' />
                  Join Community
                  <FiChevronRight className='group-hover:translate-x-1 transition-transform' />
                </Link>
              </Button>
              <Button size='lg' variant='outline' className='gap-2' asChild>
                <Link href='#discussions'>
                  <MessageSquare className='w-5 h-5' />
                  Browse Discussions
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Overview */}
      <section className='py-12'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <motion.div
            variants={staggerContainer}
            initial='hidden'
            whileInView='visible'
            viewport={{ once: true }}
            className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4'
          >
            {[
              { label: "Total Members", value: formatNumber(communityStats.totalMembers), icon: Users, color: "text-blue-500" },
              { label: "Active This Week", value: formatNumber(communityStats.activeThisWeek), icon: Users2, color: "text-green-500" },
              { label: "Articles Published", value: formatNumber(communityStats.articlesPublished), icon: BookOpen, color: "text-purple-500" },
              { label: "Discussions", value: formatNumber(communityStats.totalDiscussions), icon: MessageCircle, color: "text-amber-500" },
              { label: "Events Hosted", value: formatNumber(communityStats.eventsHosted), icon: Calendar, color: "text-pink-500" },
              { label: "Countries", value: communityStats.countries, icon: Globe, color: "text-red-500" },
            ].map((stat, index) => (
              <motion.div key={stat.label} variants={fadeInUp} whileHover={{ y: -4, transition: { duration: 0.2 } }}>
                <Card className='border hover:shadow-lg transition-all duration-300'>
                  <CardContent className='p-6 text-center'>
                    <div className={`inline-flex p-3 rounded-xl bg-primary/10 mb-4 ${stat.color.replace("text", "bg")}/10`}>
                      <stat.icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                    <div className='text-2xl md:text-3xl font-bold mb-1'>{stat.value}</div>
                    <div className='text-sm text-muted-foreground'>{stat.label}</div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='flex flex-col lg:flex-row gap-8'>
          {/* Main Content Area */}
          <div className='lg:w-2/3'>
            {/* Social Platforms */}
            <motion.section initial='hidden' whileInView='visible' viewport={{ once: true }} variants={staggerContainer} className='mb-12'>
              <div className='flex items-center justify-between mb-6'>
                <div>
                  <h2 className='text-2xl font-bold flex items-center gap-2'>
                    <Globe className='w-5 h-5 text-primary' />
                    Connect With Us
                  </h2>
                  <p className='text-muted-foreground mt-1'>Join the conversation on your favorite platforms</p>
                </div>
              </div>

              <div className='grid grid-cols-2 md:grid-cols-5 gap-4'>
                {socialLinks.map((platform, index) => (
                  <motion.div key={platform.platform} variants={fadeInUp} custom={index} whileHover={{ y: -4, transition: { duration: 0.2 } }}>
                    <Card className='h-full border hover:shadow-lg transition-all duration-300'>
                      <CardContent className='p-6 text-center'>
                        <div className={`w-12 h-12 ${platform.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                          <span className='text-white text-xl'>{platform.icon}</span>
                        </div>
                        <h3 className='font-bold mb-1'>{platform.platform}</h3>
                        <div className='text-sm text-muted-foreground mb-3'>{platform.members} members</div>
                        <Button size='sm' className='w-full gap-2' asChild>
                          <Link href={platform.link} target='_blank'>
                            Join
                            <FiExternalLink className='w-3 h-3' />
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.section>

            {/* Recent Discussions */}
            <motion.section
              initial='hidden'
              whileInView='visible'
              viewport={{ once: true }}
              variants={staggerContainer}
              className='mb-12'
              id='discussions'
            >
              <div className='flex items-center justify-between mb-6'>
                <div>
                  <h2 className='text-2xl font-bold flex items-center gap-2'>
                    <MessageSquare className='w-5 h-5 text-primary' />
                    Recent Discussions
                  </h2>
                  <p className='text-muted-foreground mt-1'>Join the conversation on trending topics</p>
                </div>
                <Button className='gap-2' asChild>
                  <Link href='/community/discussions/new'>
                    <Plus className='w-4 h-4' />
                    New Discussion
                  </Link>
                </Button>
              </div>

              {/* Discussion Filters */}
              <Card className='mb-6 border'>
                <CardContent className='p-6'>
                  <div className='flex flex-col md:flex-row gap-4 items-center'>
                    <div className='flex-1 w-full'>
                      <div className='relative'>
                        <FiSearch className='absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground' />
                        <Input
                          type='text'
                          placeholder='Search discussions...'
                          className='pl-12'
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className='flex items-center gap-4 w-full md:w-auto'>
                      <Tabs value={activeTab} onValueChange={setActiveTab} className='w-full md:w-auto'>
                        <TabsList>
                          <TabsTrigger value='all'>All</TabsTrigger>
                          <TabsTrigger value='pinned'>Pinned</TabsTrigger>
                          <TabsTrigger value='trending'>Trending</TabsTrigger>
                        </TabsList>
                      </Tabs>

                      <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className='w-[140px]'>
                          <FiFilter className='w-4 h-4 mr-2' />
                          <SelectValue placeholder='Sort by' />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='newest'>Newest</SelectItem>
                          <SelectItem value='popular'>Most Popular</SelectItem>
                          <SelectItem value='replies'>Most Replies</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Discussions List */}
              <div className='space-y-4'>
                {recentDiscussions.map((discussion, index) => (
                  <motion.div
                    key={discussion.id}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className='border hover:shadow-md transition-shadow group'>
                      <CardContent className='p-6'>
                        <div className='flex items-start justify-between'>
                          <div className='flex-1'>
                            <div className='flex items-center gap-2 mb-2'>
                              {discussion.isPinned && (
                                <Badge className='bg-gradient-to-r from-amber-500 to-orange-500'>
                                  <FiStar className='w-3 h-3 mr-1' />
                                  Pinned
                                </Badge>
                              )}
                              <Badge variant='outline'>{discussion.category}</Badge>
                            </div>

                            <Link href={`/community/discussions/${discussion.id}`} className='block group-hover:text-primary transition-colors'>
                              <h3 className='text-lg font-semibold mb-2'>{discussion.title}</h3>
                            </Link>

                            <div className='flex items-center gap-4 text-sm text-muted-foreground'>
                              <span className='flex items-center gap-1'>
                                <Avatar className='w-5 h-5'>
                                  <AvatarFallback>{discussion.author.charAt(0)}</AvatarFallback>
                                </Avatar>
                                {discussion.author}
                              </span>
                              <span className='flex items-center gap-1'>
                                <MessageSquare className='w-4 h-4' />
                                {discussion.replies} replies
                              </span>
                              <span className='flex items-center gap-1'>
                                <Eye className='w-4 h-4' />
                                {formatNumber(discussion.views)} views
                              </span>
                            </div>
                          </div>

                          <Button variant='ghost' size='sm' className='gap-2' asChild>
                            <Link href={`/community/discussions/${discussion.id}`}>
                              Join
                              <FiChevronRight className='w-4 h-4' />
                            </Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.section>

            {/* Upcoming Events */}
            <motion.section initial='hidden' whileInView='visible' viewport={{ once: true }} variants={staggerContainer} className='mb-12'>
              <div className='flex items-center justify-between mb-6'>
                <div>
                  <h2 className='text-2xl font-bold flex items-center gap-2'>
                    <Calendar className='w-5 h-5 text-primary' />
                    Upcoming Events
                  </h2>
                  <p className='text-muted-foreground mt-1'>Join our virtual and in-person gatherings</p>
                </div>
                <Button variant='outline' className='gap-2' asChild>
                  <Link href='/community/events'>
                    View All Events
                    <FiChevronRight className='w-4 h-4' />
                  </Link>
                </Button>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                {upcomingEvents.map((event, index) => (
                  <motion.div key={event.id} variants={fadeInUp} custom={index} whileHover={{ y: -4, transition: { duration: 0.2 } }}>
                    <Card className='h-full border hover:shadow-lg transition-all duration-300'>
                      <CardContent className='p-6'>
                        <div className='flex items-start justify-between mb-4'>
                          <div>
                            <div className='flex items-center gap-2 mb-2'>
                              <Badge variant={event.type === "virtual" ? "default" : "secondary"}>
                                {event.type === "virtual" ? "Virtual" : "In-Person"}
                              </Badge>
                              <span className='text-sm text-muted-foreground'>
                                {new Date(event.date).toLocaleDateString("en-US", {
                                  weekday: "short",
                                  month: "short",
                                  day: "numeric",
                                })}
                              </span>
                            </div>
                            <h3 className='text-lg font-bold mb-2'>{event.title}</h3>
                          </div>
                          <Button size='sm' variant='ghost'>
                            <Calendar className='w-4 h-4' />
                          </Button>
                        </div>

                        <div className='space-y-3 mb-4'>
                          <div className='flex items-center gap-2 text-sm'>
                            <Clock className='w-4 h-4 text-muted-foreground' />
                            <span>
                              {event.time} • {event.type === "virtual" ? "Online" : "San Francisco, CA"}
                            </span>
                          </div>
                          <div className='flex items-center gap-2 text-sm'>
                            <Users className='w-4 h-4 text-muted-foreground' />
                            <span>{event.attendees} attending</span>
                          </div>
                        </div>

                        <div className='flex items-center justify-between'>
                          <Progress value={Math.min((event.attendees / 250) * 100, 100)} className='w-2/3' />
                          <Button size='sm' className='gap-2'>
                            <Rocket className='w-4 h-4' />
                            RSVP
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          </div>

          {/* Sidebar */}
          <div className='lg:w-1/3'>
            <div className='space-y-6 sticky top-8'>
              {/* Top Contributors */}
              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <Trophy className='w-5 h-5 text-primary' />
                    Top Contributors
                  </CardTitle>
                  <CardDescription>Most active members this month</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className='space-y-4'>
                    {topContributors.map((contributor, index) => (
                      <div key={contributor.id} className='flex items-center justify-between group'>
                        <div className='flex items-center gap-3'>
                          <div className='relative'>
                            <Avatar className='w-10 h-10 ring-2 ring-primary/10 group-hover:ring-primary/30 transition-all'>
                              <AvatarFallback className='bg-gradient-to-br from-primary to-primary/60 text-white'>
                                {contributor.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            {index < 3 && (
                              <div className='absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs flex items-center justify-center'>
                                {index + 1}
                              </div>
                            )}
                          </div>
                          <div>
                            <div className='font-semibold'>{contributor.name}</div>
                            <div className='text-xs text-muted-foreground'>{contributor.role}</div>
                          </div>
                        </div>
                        <div className='flex items-center gap-2'>
                          <Badge variant='outline' size='sm' className='gap-1'>
                            <BookOpen className='w-3 h-3' />
                            {contributor.articles}
                          </Badge>
                          {contributor.streak > 20 && (
                            <Badge className='bg-gradient-to-r from-green-500 to-emerald-500 gap-1'>
                              <FaFire className='w-3 h-3' />
                              {contributor.streak}d
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant='outline' className='w-full gap-2' asChild>
                    <Link href='/community/contributors'>
                      View All Contributors
                      <FiChevronRight className='w-4 h-4' />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>

              {/* Community Guidelines */}
              <Card className='bg-gradient-to-br from-primary/5 via-primary/5 to-primary/10 border-primary/20'>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <Target className='w-5 h-5 text-primary' />
                    Community Guidelines
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='space-y-3 text-sm'>
                    <div className='flex items-start gap-2'>
                      <Heart className='w-4 h-4 text-primary mt-0.5' />
                      <span>Be respectful and inclusive</span>
                    </div>
                    <div className='flex items-start gap-2'>
                      <Share2 className='w-4 h-4 text-primary mt-0.5' />
                      <span>Share knowledge and help others</span>
                    </div>
                    <div className='flex items-start gap-2'>
                      <Zap className='w-4 h-4 text-primary mt-0.5' />
                      <span>Keep discussions constructive</span>
                    </div>
                    <div className='flex items-start gap-2'>
                      <Award className='w-4 h-4 text-primary mt-0.5' />
                      <span>Credit original sources</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant='outline' className='w-full' asChild>
                    <Link href='/community/guidelines'>Read Full Guidelines</Link>
                  </Button>
                </CardFooter>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <Zap className='w-5 h-5 text-primary' />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='space-y-3'>
                    <Button className='w-full justify-start gap-2' asChild>
                      <Link href='/articles/new'>
                        <Plus className='w-4 h-4' />
                        Write Article
                      </Link>
                    </Button>
                    <Button variant='outline' className='w-full justify-start gap-2' asChild>
                      <Link href='/community/discussions/new'>
                        <MessageSquare className='w-4 h-4' />
                        Start Discussion
                      </Link>
                    </Button>
                    <Button variant='outline' className='w-full justify-start gap-2' asChild>
                      <Link href='/community/events/new'>
                        <Calendar className='w-4 h-4' />
                        Create Event
                      </Link>
                    </Button>
                    <Button variant='outline' className='w-full justify-start gap-2' asChild>
                      <Link href='/community/projects'>
                        <FaGithub className='w-4 h-4' />
                        Browse Projects
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Achievement Badges */}
              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <Award className='w-5 h-5 text-primary' />
                    Earn Badges
                  </CardTitle>
                  <CardDescription>Unlock achievements by participating</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className='grid grid-cols-3 gap-2'>
                    {[
                      { name: "First Article", icon: "📝", color: "bg-blue-100" },
                      { name: "10 Comments", icon: "💬", color: "bg-green-100" },
                      { name: "Helpful", icon: "⭐", color: "bg-yellow-100" },
                      { name: "7-Day Streak", icon: "🔥", color: "bg-orange-100" },
                      { name: "Event Host", icon: "🎤", color: "bg-purple-100" },
                      { name: "Mentor", icon: "👨‍🏫", color: "bg-pink-100" },
                    ].map((badge) => (
                      <div key={badge.name} className='text-center'>
                        <div className={`${badge.color} w-12 h-12 rounded-full flex items-center justify-center text-xl mx-auto mb-2`}>
                          {badge.icon}
                        </div>
                        <div className='text-xs font-medium'>{badge.name}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
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
            <div className='absolute inset-0 bg-gradient-to-r from-primary via-primary/80 to-primary/60' />
            <div className='absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl' />
            <div className='absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl' />

            <div className='relative z-10 p-8 md:p-12 text-center'>
              <div className='inline-flex p-4 rounded-2xl bg-white/10 backdrop-blur-sm mb-8'>
                <PartyPopper className='w-12 h-12 text-white' />
              </div>

              <h2 className='text-4xl font-bold text-white mb-6'>Ready to Join Our Community?</h2>

              <p className='text-white/90 text-xl mb-10 max-w-2xl mx-auto'>
                Connect with thousands of developers, share your knowledge, and grow your skills in a supportive environment.
              </p>

              <div className='flex flex-col sm:flex-row gap-4 justify-center'>
                <Button size='lg' variant='secondary' className='gap-2 group bg-white text-primary hover:bg-white/90' asChild>
                  <Link href='/community/join'>
                    Join Free
                    <Users className='w-5 h-5 group-hover:scale-110 transition-transform' />
                  </Link>
                </Button>
                <Button size='lg' variant='outline' className='gap-2 text-white border-white/30 hover:bg-white/10' asChild>
                  <Link href='/community/explore'>
                    Explore Features
                    <FiExternalLink className='w-5 h-5' />
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

export default CommunityPage;
