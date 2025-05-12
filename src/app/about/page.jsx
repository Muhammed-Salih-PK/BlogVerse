"use client";

import Head from "next/head";
import { FaBookOpen, FaUsers, FaLightbulb, FaRocket } from "react-icons/fa";

export default function AboutPage() {
  const features = [
    {
      icon: <FaBookOpen className="text-3xl text-purple-600" />,
      title: "Quality Content",
      description: "We publish well-researched, up-to-date articles on modern web technologies."
    },
    {
      icon: <FaUsers className="text-3xl text-purple-600" />,
      title: "Community Driven",
      description: "Our content is shaped by community feedback and real-world needs."
    },
    {
      icon: <FaLightbulb className="text-3xl text-purple-600" />,
      title: "Practical Knowledge",
      description: "Learn actionable skills you can apply immediately in your projects."
    },
    {
      icon: <FaRocket className="text-3xl text-purple-600" />,
      title: "Stay Ahead",
      description: "Get insights on emerging technologies before they go mainstream."
    }
  ];

  const teamMembers = [
    {
      name: "Sarah Johnson",
      role: "Founder & Editor",
      bio: "Full-stack developer with 10+ years of experience in web technologies.",
      image: "/team-sarah.jpg"
    },
    {
      name: "Michael Chen",
      role: "Senior Writer",
      bio: "React specialist and open source contributor passionate about developer education.",
      image: "/team-michael.jpg"
    },
    {
      name: "Emma Davis",
      role: "Content Strategist",
      bio: "Technical writer focused on making complex topics accessible to all developers.",
      image: "/team-emma.jpg"
    }
  ];

  return (
    <>
      <Head>
        <title>About | BlogPress</title>
        <meta name="description" content="Learn about BlogPress and our mission" />
      </Head>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-20 px-4">
        <div className="container mx-auto max-w-6xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">About BlogPress</h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Empowering developers with high-quality technical content since 2020
          </p>
        </div>
      </section>

      {/* Our Mission */}
      <section className="py-16 px-4 bg-white dark:bg-gray-900">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 dark:text-white">Our Mission</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              To create the most useful, practical, and up-to-date content for web developers at all skill levels.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl text-center">
                <div className="flex justify-center mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2 dark:text-white">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 px-4 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <div className="bg-gray-200 dark:bg-gray-700 h-64 rounded-xl"></div>
            </div>
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold mb-6 dark:text-white">Our Story</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                BlogPress was founded in 2020 by a group of developers who were frustrated with the lack of practical,
                up-to-date technical content available online. We started as a small blog with a handful of articles
                and have grown into a trusted resource for thousands of developers worldwide.
              </p>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                What sets us apart is our commitment to quality. Every article goes through a rigorous review process
                by industry experts to ensure accuracy and relevance.
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                Today, we're proud to have a diverse team of writers and editors from around the world who share our
                passion for great technical content.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 px-4 bg-white dark:bg-gray-900">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 dark:text-white">Meet Our Team</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              The passionate people behind BlogPress
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-gray-50 dark:bg-gray-800 rounded-xl overflow-hidden shadow">
                <div className="bg-gray-200 dark:bg-gray-700 h-48"></div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-1 dark:text-white">{member.name}</h3>
                  <p className="text-purple-600 dark:text-purple-400 mb-4">{member.role}</p>
                  <p className="text-gray-600 dark:text-gray-400">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-6">Join Our Community</h2>
          <p className="text-xl mb-8 opacity-90">
            Subscribe to our newsletter for the latest articles, tutorials, and resources
          </p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 px-4 py-3 rounded-lg border text-gray-100 focus:outline-none"
              required
            />
            <button
              type="submit"
              className="bg-white text-purple-600 hover:bg-gray-100 px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </>
  );
}