"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  FaTwitter, 
  FaGithub, 
  FaLinkedin, 
  FaYoutube,
  FaInstagram,
  FaDiscord,
  FaRss,
  FaHeart,
  FaArrowUp,
  FaRegNewspaper,
  FaRegEnvelope
} from "react-icons/fa";
import { 
  FiMail, 
  FiExternalLink,
  FiCode,
  FiBook,
  FiUsers,
  FiHelpCircle,
  FiMessageSquare,
  FiTrendingUp,
  FiCalendar
} from "react-icons/fi";
import { 
  BookOpen, 
  Code2, 
  Users, 
  MessageSquare,
  TrendingUp,
  FileText,
  ChevronUp,
  Globe,
  Sparkles,
  Zap,
  Target,
  Award,
  Mail,
  Rocket
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function BlogFooter() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      // Simulate subscription
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const quickLinks = [
    { label: "Home", path: "/", icon: "home" },
    { label: "Articles", path: "/articles", icon: "book" },
    { label: "Categories", path: "/categories", icon: "layers" },
    { label: "Tags", path: "/tags", icon: "tag" },
    { label: "Trending", path: "/trending", icon: "trending" },
    { label: "Community", path: "/community", icon: "users" },
    { label: "About", path: "/about", icon: "info" },
    { label: "Contact", path: "/contact", icon: "mail" },
  ];

  const resources = [
    { label: "Documentation", path: "/docs", icon: "file-text" },
    { label: "Tutorials", path: "/tutorials", icon: "graduation-cap" },
    { label: "API Reference", path: "/api", icon: "code" },
    { label: "Code Samples", path: "/samples", icon: "terminal" },
    { label: "Best Practices", path: "/best-practices", icon: "award" },
    { label: "Style Guide", path: "/style-guide", icon: "palette" },
  ];

  const community = [
    { label: "Forum", path: "/forum", icon: "message-square" },
    { label: "Discord", path: "https://discord.gg/blogverse", icon: "discord" },
    { label: "Events", path: "/events", icon: "calendar" },
    { label: "Contributors", path: "/contributors", icon: "users" },
    { label: "Code of Conduct", path: "/code-of-conduct", icon: "shield" },
    { label: "Sponsorship", path: "/sponsor", icon: "heart" },
  ];

  const company = [
    { label: "About Us", path: "/about", icon: "info" },
    { label: "Careers", path: "/careers", icon: "briefcase" },
    { label: "Blog", path: "/blog", icon: "newspaper" },
    { label: "Press", path: "/press", icon: "megaphone" },
    { label: "Brand", path: "/brand", icon: "palette" },
    { label: "Partners", path: "/partners", icon: "handshake" },
  ];

  const socialLinks = [
    { icon: <FaTwitter />, label: "Twitter", href: "https://twitter.com/blogverse", color: "hover:bg-blue-500 hover:text-white" },
    { icon: <FaGithub />, label: "GitHub", href: "https://github.com/blogverse", color: "hover:bg-gray-900 hover:text-white" },
    { icon: <FaLinkedin />, label: "LinkedIn", href: "https://linkedin.com/company/blogverse", color: "hover:bg-blue-700 hover:text-white" },
    { icon: <FaYoutube />, label: "YouTube", href: "https://youtube.com/blogverse", color: "hover:bg-red-600 hover:text-white" },
    { icon: <FaInstagram />, label: "Instagram", href: "https://instagram.com/blogverse", color: "hover:bg-pink-600 hover:text-white" },
    { icon: <FaDiscord />, label: "Discord", href: "https://discord.gg/blogverse", color: "hover:bg-indigo-600 hover:text-white" },
  ];

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <footer className="relative bg-gradient-to-b from-background via-background to-primary/5 pt-10">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:20px_20px]" />
      </div>

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Newsletter Section */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          className="max-w-4xl mx-auto -mt-20 mb-16"
        >
          <div className="bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 backdrop-blur-sm border border-primary/20 rounded-2xl p-8 md:p-10 shadow-xl">
            <div className="text-center mb-8">
              <Badge className="mb-4 px-4 py-2 bg-primary text-primary-foreground border-0">
                <Mail className="w-4 h-4 mr-2" />
                Newsletter
              </Badge>
              <h3 className="text-2xl md:text-3xl font-bold mb-3">
                Stay Ahead of the Curve
              </h3>
              <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                Join 10,000+ developers receiving weekly insights, tutorials, and industry updates.
              </p>
            </div>
            
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <div className="flex-1">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full h-12 bg-background/80 backdrop-blur-sm"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <Button 
                type="submit"
                size="lg"
                className="gap-2 group"
                disabled={subscribed}
              >
                {subscribed ? (
                  <>
                    <Sparkles className="w-5 h-5 animate-pulse" />
                    Welcome Aboard!
                  </>
                ) : (
                  <>
                    Subscribe
                    <Rocket className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </form>
            
            <div className="text-center mt-6">
              <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <FiUsers className="w-4 h-4" />
                  <span>10,000+ subscribers</span>
                </div>
                <div className="w-1 h-1 rounded-full bg-muted"></div>
                <span>Zero spam. Unsubscribe anytime.</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12 py-12">
          {/* Brand Section */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-xl bg-gradient-to-br from-primary to-primary/60">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">BlogVerse</h3>
                <p className="text-muted-foreground">The Developer's Knowledge Hub</p>
              </div>
            </div>
            
            <p className="text-muted-foreground mb-8 leading-relaxed">
              Empowering developers worldwide with high-quality tutorials, 
              insights, and community-driven content. Learn, build, and grow together.
            </p>
            
            {/* Social Links */}
            <div className="mb-8">
              <h4 className="text-sm font-medium text-muted-foreground mb-3">Connect with us</h4>
              <div className="flex flex-wrap gap-2">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-3 rounded-lg bg-secondary border hover:shadow-md transition-all ${social.color}`}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label={social.label}
                  >
                    <span className="text-xl">{social.icon}</span>
                  </motion.a>
                ))}
              </div>
            </div>
            
            {/* Feature Badges */}
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="gap-2">
                <Zap className="w-3 h-3" />
                Fast & Reliable
              </Badge>
              <Badge variant="outline" className="gap-2">
                <Target className="w-3 h-3" />
                Quality Content
              </Badge>
              <Badge variant="outline" className="gap-2">
                <Award className="w-3 h-3" />
                Community Driven
              </Badge>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            transition={{ delay: 0.2 }}
          >
            <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.path}
                    className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-muted group-hover:bg-primary transition-colors"></span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Resources */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            transition={{ delay: 0.3 }}
          >
            <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Code2 className="w-5 h-5 text-primary" />
              Resources
            </h4>
            <ul className="space-y-3">
              {resources.map((resource) => (
                <li key={resource.label}>
                  <Link
                    href={resource.path}
                    className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-muted group-hover:bg-primary transition-colors"></span>
                    {resource.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Company & Community */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            transition={{ delay: 0.4 }}
          >
            <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Community
            </h4>
            <ul className="space-y-3">
              {community.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.path}
                    className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-muted group-hover:bg-primary transition-colors"></span>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

            <h4 className="text-lg font-semibold mb-4 mt-6 flex items-center gap-2">
              <Globe className="w-5 h-5 text-primary" />
              Company
            </h4>
            <ul className="space-y-3">
              {company.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.path}
                    className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-muted group-hover:bg-primary transition-colors"></span>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border pt-8 pb-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Copyright & Legal */}
            <div className="text-center md:text-left">
              <p className="text-muted-foreground text-sm">
                © {new Date().getFullYear()} BlogVerse. Empowering developers worldwide.
              </p>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-3">
                <Link
                  href="/privacy"
                  className="text-xs text-muted-foreground hover:text-primary transition-colors"
                >
                  Privacy Policy
                </Link>
                <div className="w-1 h-1 rounded-full bg-muted"></div>
                <Link
                  href="/terms"
                  className="text-xs text-muted-foreground hover:text-primary transition-colors"
                >
                  Terms of Service
                </Link>
                <div className="w-1 h-1 rounded-full bg-muted"></div>
                <Link
                  href="/cookies"
                  className="text-xs text-muted-foreground hover:text-primary transition-colors"
                >
                  Cookie Policy
                </Link>
              </div>
            </div>
            
            {/* Quick Actions */}
            <div className="flex items-center gap-4">
              <Link
                href="/rss"
                className="flex items-center gap-2 text-muted-foreground hover:text-orange-500 transition-colors group"
              >
                <FaRss className="group-hover:animate-pulse" />
                <span className="text-sm">RSS Feed</span>
              </Link>
              
              <Link
                href="/help"
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors group"
              >
                <FiHelpCircle />
                <span className="text-sm">Help Center</span>
              </Link>
              
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={scrollToTop}
              >
                Back to Top
                <ChevronUp className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          {/* Attribution */}
          <div className="text-center mt-8">
            <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
              <span>Built with</span>
              <FaHeart className="w-3 h-3 text-red-500 animate-pulse" />
              <span>by the community</span>
              <div className="w-1 h-1 rounded-full bg-muted"></div>
              <span>Powered by Next.js & Tailwind CSS</span>
            </div>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-6 mt-8 pt-6 border-t border-border">
            <div className="text-center">
              <div className="text-2xl font-bold">10K+</div>
              <div className="text-xs text-muted-foreground">Articles</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">50K+</div>
              <div className="text-xs text-muted-foreground">Developers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">1M+</div>
              <div className="text-xs text-muted-foreground">Monthly Views</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">24/7</div>
              <div className="text-xs text-muted-foreground">Community Support</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
     
    </footer>
  );
}