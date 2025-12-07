"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { FaHandshake, FaChartLine, FaTwitter, FaLinkedin, FaGithub, FaAward, FaBookOpen } from "react-icons/fa";
import { FiArrowRight, FiEye } from "react-icons/fi";
import { BookOpen, Target, Zap, Sparkles, TrendingUp, Shield, Globe, Users, Clock, Award, Tag, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const teamMembers = [
  {
    name: "Muhammed Salih",
    role: "Founder & CEO",
    bio: "Former Google engineer passionate about democratizing knowledge sharing",
    image: "/team/alex.jpg",
    social: { twitter: "#", linkedin: "#", github: "#" },
    expertise: ["React", "Next.js", "DevRel"],
  },
  {
    name: "Muhammed Salih",
    role: "Head of Content",
    bio: "Ex-Media executive with years in digital content strategy",
    image: "/team/maria.jpg",
    social: { twitter: "#", linkedin: "#", instagram: "#" },
    expertise: ["Content Strategy", "SEO", "Community"],
  },
  {
    name: "Muhammed Salih",
    role: "Lead Developer",
    bio: "Full-stack wizard focused on building scalable platforms",
    image: "/team/david.jpg",
    social: { twitter: "#", linkedin: "#", github: "#" },
    expertise: ["Node.js", "AWS", "DevOps"],
  },
  {
    name: "Muhammed Salih",
    role: "Community Lead",
    bio: "Building inclusive communities where everyone can thrive",
    image: "/team/sarah.jpg",
    social: { twitter: "#", linkedin: "#", instagram: "#" },
    expertise: ["Community", "Education", "Events"],
  },
];

const values = [
  {
    icon: BookOpen,
    title: "Knowledge Sharing",
    description: "We believe in open knowledge exchange where everyone can learn and teach",
    color: "text-blue-500",
  },
  {
    icon: Users,
    title: "Community First",
    description: "Our community drives innovation and shapes the platform's direction",
    color: "text-green-500",
  },
  {
    icon: Zap,
    title: "Quality Over Quantity",
    description: "We curate content to ensure high-value, actionable insights",
    color: "text-amber-500",
  },
  {
    icon: Shield,
    title: "Trust & Integrity",
    description: "Transparent practices and authentic interactions are non-negotiable",
    color: "text-purple-500",
  },
  {
    icon: Globe,
    title: "Inclusivity",
    description: "Creating a welcoming space for diverse perspectives and backgrounds",
    color: "text-pink-500",
  },
  {
    icon: TrendingUp,
    title: "Continuous Growth",
    description: "Always learning, always improving—both as individuals and as a platform",
    color: "text-red-500",
  },
];

const milestones = [
  { year: "2021", event: "Platform launched with 100 founding members" },
  { year: "2022", event: "Reached 10,000 active users & 5,000 articles" },
  { year: "2023", event: "Mobile app released & community awards introduced" },
  { year: "2024", event: "International expansion & AI-powered recommendations" },
];

const stats = [
  { label: "Active Users", value: "100K+", icon: Users, change: "+45%" },
  { label: "Articles Published", value: "50K+", icon: BookOpen, change: "+60%" },
  { label: "Countries", value: "150+", icon: Globe, change: "+20%" },
  { label: "Avg. Read Time", value: "7min", icon: Clock, change: "+15%" },
  { label: "Expert Authors", value: "5K+", icon: Award, change: "+35%" },
  { label: "Community Tags", value: "10K+", icon: Tag, change: "+70%" },
];

export default function AboutPage() {
  const [activeTab, setActiveTab] = useState("mission");

  return (
    <div className='min-h-screen bg-gradient-to-b from-background via-background to-muted/20 overflow-hidden'>
      {/* Hero Section */}
      <section className='relative overflow-hidden'>
        <div className='absolute inset-0 bg-gradient-to-br from-blue-950/5  to-transparent dark:from-gray-950 dark:via-40% dark:to-black' />
        <div className='absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl ' />
        <div className='absolute bottom-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl' />

        <div className='relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32'>
          <motion.div
            className='text-center max-w-4xl mx-auto'
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Badge className='mb-6 px-4 py-2 text-sm bg-primary/10 text-primary hover:bg-primary/20'>
              <Sparkles className='w-4 h-4 mr-2' />
              Our Story
            </Badge>

            <h1 className='text-5xl md:text-7xl font-bold tracking-tight mb-6'>
              Where <span className='text-primary'>Knowledge</span> Meets <span className='text-primary'>Community</span>
            </h1>

            <p className='text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed'>
              We're building the world's most inclusive platform for sharing insights, learning together, and growing as a community of passionate
              creators.
            </p>

            <div className='flex flex-col sm:flex-row gap-4 justify-center'>
              <Button size='lg' className='gap-2 group' asChild>
                <Link href='/join'>
                  Join Our Community
                  <FiArrowRight className='group-hover:translate-x-1 transition-transform' />
                </Link>
              </Button>
              <Button size='lg' variant='outline' className='gap-2' asChild>
                <Link href='/explore'>
                  <FaBookOpen className='w-5 h-5' />
                  Explore Articles
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className='py-16'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <motion.div
            variants={staggerContainer}
            initial='initial'
            whileInView='animate'
            viewport={{ once: true }}
            className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6'
          >
            {stats.map((stat, index) => (
              <motion.div key={stat.label} variants={fadeInUp} custom={index}>
                <Card className='border-none shadow-sm hover:shadow-md transition-shadow'>
                  <CardContent className='p-6 text-center'>
                    <div className='inline-flex p-3 rounded-xl bg-primary/10 mb-4'>
                      <stat.icon className={`w-6 h-6 text-primary`} />
                    </div>
                    <div className='text-3xl font-bold mb-2'>{stat.value}</div>
                    <div className='text-sm text-muted-foreground mb-2'>{stat.label}</div>
                    <div className='text-xs text-green-500 font-medium'>{stat.change} this year</div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className='py-16'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className='text-center mb-12'>
            <h2 className='text-4xl font-bold mb-4'>Our Purpose & Vision</h2>
            <p className='text-xl text-muted-foreground max-w-3xl mx-auto'>We're on a mission to make knowledge accessible to everyone, everywhere</p>
          </motion.div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className='max-w-5xl mx-auto'>
            <TabsList className='grid grid-cols-3 mb-12'>
              <TabsTrigger value='mission' className='gap-2'>
                <Target className='w-4 h-4' />
                Our Mission
              </TabsTrigger>
              <TabsTrigger value='vision' className='gap-2'>
                <FiEye className='w-4 h-4' />
                Our Vision
              </TabsTrigger>
              <TabsTrigger value='impact' className='gap-2'>
                <FaChartLine className='w-4 h-4' />
                Our Impact
              </TabsTrigger>
            </TabsList>

            <TabsContent value='mission' className='space-y-8'>
              <Card className='border-none shadow-lg'>
                <CardHeader className='text-center'>
                  <div className='inline-flex p-4 rounded-full bg-blue-500/10 mb-4'>
                    <Target className='w-12 h-12 text-blue-500' />
                  </div>
                  <CardTitle className='text-3xl'>Our Mission</CardTitle>
                  <CardDescription className='text-lg'>What drives us every day</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className='max-w-3xl mx-auto space-y-6 text-lg text-muted-foreground leading-relaxed'>
                    <p>
                      To democratize knowledge sharing by creating a platform where anyone can learn from experts, share their insights, and grow
                      together as part of a global community.
                    </p>
                    <p>
                      We believe that knowledge should be accessible, practical, and community-driven. Our mission is to break down barriers to
                      learning and create opportunities for meaningful connections and growth.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value='vision' className='space-y-8'>
              <Card className='border-none shadow-lg'>
                <CardHeader className='text-center'>
                  <div className='inline-flex p-4 rounded-full bg-purple-500/10 mb-4'>
                    <FiEye className='w-12 h-12 text-purple-500' />
                  </div>
                  <CardTitle className='text-3xl'>Our Vision</CardTitle>
                  <CardDescription className='text-lg'>Where we're heading</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className='max-w-3xl mx-auto space-y-6 text-lg text-muted-foreground leading-relaxed'>
                    <p>
                      To become the world's most trusted platform for knowledge exchange, where millions of people come together to learn, teach, and
                      innovate.
                    </p>
                    <p>
                      We envision a future where geographical, financial, and educational barriers no longer limit anyone's ability to access quality
                      knowledge and connect with mentors and peers.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value='impact' className='space-y-8'>
              <Card className='border-none shadow-lg'>
                <CardHeader className='text-center'>
                  <div className='inline-flex p-4 rounded-full bg-green-500/10 mb-4'>
                    <FaChartLine className='w-12 h-12 text-green-500' />
                  </div>
                  <CardTitle className='text-3xl'>Our Impact</CardTitle>
                  <CardDescription className='text-lg'>Making a difference</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className='max-w-3xl mx-auto space-y-6 text-lg text-muted-foreground leading-relaxed'>
                    <p>
                      Through our platform, we've helped thousands of people acquire new skills, transition careers, and connect with opportunities
                      they never thought possible.
                    </p>
                    <p>
                      Our community-driven approach has created a virtuous cycle where learners become teachers, and every interaction contributes to
                      collective growth.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Values Section */}
      <section className='py-16 bg-gradient-to-b from-muted/30 to-background'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className='text-center mb-12'>
            <h2 className='text-4xl font-bold mb-4'>Our Core Values</h2>
            <p className='text-xl text-muted-foreground max-w-3xl mx-auto'>The principles that guide everything we do</p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial='initial'
            whileInView='animate'
            viewport={{ once: true }}
            className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
          >
            {values.map((value, index) => (
              <motion.div key={value.title} variants={fadeInUp} custom={index}>
                <Card className='h-full border hover:shadow-lg transition-all duration-300 hover:-translate-y-1'>
                  <CardContent className='p-8'>
                    <div className={`inline-flex p-4 rounded-xl ${value.color.replace("text", "bg")}/10 mb-6`}>
                      <value.icon className={`w-8 h-8 ${value.color}`} />
                    </div>
                    <h3 className='text-xl font-bold mb-3'>{value.title}</h3>
                    <p className='text-muted-foreground'>{value.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Team Section */}
      <section className='py-16'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className='text-center mb-12'>
            <h2 className='text-4xl font-bold mb-4'>Meet Our Team</h2>
            <p className='text-xl text-muted-foreground max-w-3xl mx-auto'>
              Passionate individuals dedicated to building a better platform for everyone
            </p>
          </motion.div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className='border hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group'>
                  <CardContent className='p-8'>
                    <div className='relative mb-6'>
                      <Avatar className='w-24 h-24 mx-auto ring-4 ring-primary/10 group-hover:ring-primary/20 transition-all'>
                        <AvatarImage src={member.image} alt={member.name} />
                        <AvatarFallback className='bg-gradient-to-br from-primary to-primary/60 text-white text-2xl'>
                          {member.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    </div>

                    <div className='text-center mb-4'>
                      <h3 className='text-xl font-bold mb-1'>{member.name}</h3>
                      <p className='text-primary font-medium mb-3'>{member.role}</p>
                      <p className='text-sm text-muted-foreground mb-4'>{member.bio}</p>
                    </div>

                    <div className='flex flex-wrap gap-2 justify-center mb-6'>
                      {member.expertise.map((skill) => (
                        <Badge key={skill} variant='secondary' className='text-xs'>
                          {skill}
                        </Badge>
                      ))}
                    </div>

                    <div className='flex justify-center gap-3'>
                      <Button size='sm' variant='ghost' asChild>
                        <Link href={member.social.twitter}>
                          <FaTwitter className='w-4 h-4' />
                        </Link>
                      </Button>
                      <Button size='sm' variant='ghost' asChild>
                        <Link href={member.social.linkedin}>
                          <FaLinkedin className='w-4 h-4' />
                        </Link>
                      </Button>
                      {"github" in member.social && (
                        <Button size='sm' variant='ghost' asChild>
                          <Link href={member.social.github}>
                            <FaGithub className='w-4 h-4' />
                          </Link>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Journey Timeline */}
      <section className='py-16 bg-gradient-to-b from-background to-muted/30'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className='text-center mb-12'>
            <h2 className='text-4xl font-bold mb-4'>Our Journey</h2>
            <p className='text-xl text-muted-foreground max-w-3xl mx-auto'>Milestones in our growth story</p>
          </motion.div>

          <div className='relative max-w-4xl mx-auto'>
            {/* Timeline line */}
            <div className='absolute left-8 md:left-1/2 md:-translate-x-1/2 w-1 h-full bg-gradient-to-b from-primary/20 to-primary/10' />

            {milestones.map((milestone, index) => (
              <motion.div
                key={milestone.year}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.2 }}
                viewport={{ once: true }}
                className={`relative flex items-center mb-12 ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}
              >
                <div className={`flex-1 ${index % 2 === 0 ? "md:text-right md:pr-12" : "md:pl-12"}`}>
                  <Card className='inline-block max-w-md'>
                    <CardContent className='p-6'>
                      <div className='flex items-center gap-3 mb-3'>
                        <div className='p-2 rounded-lg bg-primary/10'>
                          <FaAward className='w-5 h-5 text-primary' />
                        </div>
                        <h3 className='text-xl font-bold'>{milestone.year}</h3>
                      </div>
                      <p className='text-muted-foreground'>{milestone.event}</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Timeline dot */}
                <div className='absolute left-6 md:left-1/2 md:-translate-x-1/2 w-4 h-4 rounded-full bg-primary ring-8 ring-primary/10' />

                <div className={`flex-1 ${index % 2 === 0 ? "md:pl-12" : "md:pr-12"}`}>
                  <div className='h-12' />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className='py-16 '>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className='relative overflow-hidden rounded-3xl'
          >
            <div className='absolute inset-0 bg-gradient-to-br from-stone-800 to-stone-500 dark:from-black via-stone-900 dark:via-black/80 dark:to-black/60' />
            <div className='absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl' />
            <div className='absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl' />

            <div className='relative z-10 p-12 text-center'>
              <div className='inline-flex p-4 rounded-2xl bg-white/10 backdrop-blur-sm mb-8'>
                <FaHandshake className='w-12 h-12 text-white' />
              </div>

              <h2 className='text-4xl font-bold text-white mb-6'>Ready to Join Our Community?</h2>

              <p className='text-white/90 text-xl mb-10 max-w-2xl mx-auto'>
                Whether you want to learn, teach, or simply connect with like-minded people, there's a place for you here.
              </p>

              <div className='flex flex-col sm:flex-row gap-4 justify-center'>
                <Button size='lg' variant='secondary' className='gap-2 group bg-white text-primary hover:bg-white/90' asChild>
                  <Link href='/signup'>
                    Get Started Free
                    <FiArrowRight className='group-hover:translate-x-1 transition-transform' />
                  </Link>
                </Button>
                <Button size='lg' variant='outline' className='gap-2 text-white border-white/30 hover:bg-white/10' asChild>
                  <Link href='/contact'>Contact Us</Link>
                </Button>
              </div>

              <div className='mt-12 pt-8 border-t border-white/20'>
                <p className='text-white/80 mb-4'>Trusted by companies and individuals worldwide</p>
                <div className='flex flex-wrap justify-center items-center gap-8 opacity-80'>
                  <div className='text-white/60 font-bold text-xl'>TechCorp</div>
                  <div className='text-white/60 font-bold text-xl'>DevHub</div>
                  <div className='text-white/60 font-bold text-xl'>LearnStack</div>
                  <div className='text-white/60 font-bold text-xl'>CodeMasters</div>
                  <div className='text-white/60 font-bold text-xl'>EduTech</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer Note */}
      <section className='py-12'>
        <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
          <Heart className='w-12 h-12 text-primary mx-auto mb-6' />
          <p className='text-2xl font-light text-muted-foreground italic'>"Education is not preparation for life; education is life itself."</p>
          <p className='text-sm text-muted-foreground mt-4'>— John Dewey</p>
        </div>
      </section>
    </div>
  );
}
