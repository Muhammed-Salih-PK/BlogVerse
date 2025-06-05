"use client";

import Head from "next/head";
import { FaBookOpen, FaUsers, FaLightbulb, FaRocket, FaTwitter, FaGithub, FaLinkedin } from "react-icons/fa";
import { motion } from "framer-motion";
import Link from "next/link";

export default function AboutPage() {
  const features = [
    {
      icon: <FaBookOpen className='text-3xl' />,
      title: "Quality Content",
      description: "We publish well-researched, up-to-date articles on modern web technologies.",
    },
    {
      icon: <FaUsers className='text-3xl' />,
      title: "Community Driven",
      description: "Our content is shaped by community feedback and real-world needs.",
    },
    {
      icon: <FaLightbulb className='text-3xl' />,
      title: "Practical Knowledge",
      description: "Learn actionable skills you can apply immediately in your projects.",
    },
    {
      icon: <FaRocket className='text-3xl' />,
      title: "Stay Ahead",
      description: "Get insights on emerging technologies before they go mainstream.",
    },
  ];

  const teamMembers = {
    name: "Muhammed Salih",
    role: "Founder & Developer",
    bio: "Full-stack developer with years of experience in web technologies.",
    image:
      "https://images.unsplash.com/photo-1640161339667-88fc7a1135b0?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjZ8fGJsb2d8ZW58MHx8MHx8fDA%3D",
    social: {
      twitter: "#",
      github: "https://github.com/Muhammed-Salih-PK",
      linkedin: "https://www.linkedin.com/in/mhdsalihpk",
    },
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <>
      <Head>
        <title>About BlogPress | Empowering Developers</title>
        <meta name='description' content='Learn about BlogPress and our mission to provide high-quality technical content for developers.' />
      </Head>

      {/* Hero Section */}
      <section className='relative bg-gradient-to-br from-indigo-900 to-purple-800 text-white py-28 px-4 overflow-hidden'>
        <div className='absolute inset-0 opacity-10'>
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
        </div>
        <div className='container mx-auto max-w-6xl text-center relative z-10'>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className='text-5xl md:text-6xl font-bold mb-6 leading-tight'
          >
            About <span className='text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400'>BlogPress</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className='text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90'
          >
            Empowering developers with high-quality technical content since 2025
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className='flex justify-center gap-4'
          >
            <Link
              href={"/articles"}
              className='px-6 py-3 bg-white text-purple-800 rounded-lg font-medium hover:bg-opacity-90 transition-all transform hover:-translate-y-1'
            >
              Explore Articles
            </Link>
            <Link
              href={"/signup"}
              className='px-6 py-3 border border-white text-white rounded-lg font-medium  hover:bg-opacity-10 transition-all transform hover:-translate-y-1'
            >
              Join Community
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Our Mission */}
      <section className='py-20 px-4 bg-white dark:bg-gray-900'>
        <div className='container mx-auto max-w-6xl'>
          <div className='text-center mb-16'>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
              <span className='inline-block px-3 py-1 text-sm font-medium rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200 mb-4'>
                Our Purpose
              </span>
              <h2 className='text-4xl font-bold mb-4 dark:text-white'>Empowering Developers Through Knowledge</h2>
              <p className='text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto'>
                To create the most useful, practical, and up-to-date content for web developers at all skill levels.
              </p>
            </motion.div>
          </div>

          {/* Features Grid */}
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeIn}
                initial='hidden'
                whileInView='visible'
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className='bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-500 p-8 rounded-2xl shadow-sm hover:shadow-md transition-all'
              >
                <div className='flex justify-center mb-6'>
                  <div className='p-4 bg-indigo-100 dark:bg-indigo-900 rounded-xl text-indigo-600 dark:text-indigo-300'>{feature.icon}</div>
                </div>
                <h3 className='text-xl font-bold mb-3 dark:text-white text-center'>{feature.title}</h3>
                <p className='text-gray-600 dark:text-gray-400 text-center'>{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className='py-20 px-4 bg-gray-50 dark:bg-gray-800'>
        <div className='container mx-auto max-w-6xl'>
          <div className='flex flex-col lg:flex-row items-center gap-12'>
            <motion.div
              className='lg:w-1/2'
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className='relative'>
                <img
                  src='https://plus.unsplash.com/premium_photo-1720744786849-a7412d24ffbf?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YmxvZ3xlbnwwfHwwfHx8MA%3D%3D'
                  alt='BlogPress team working'
                  className='w-full h-auto rounded-2xl shadow-xl'
                />
                <div className='absolute -bottom-6 -right-6 bg-indigo-600 text-white p-4 rounded-xl shadow-lg'>
                  <span className='block text-2xl font-bold'>2025</span>
                  <span className='text-sm'>Founded</span>
                </div>
              </div>
            </motion.div>
            <motion.div
              className='lg:w-1/2'
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className='inline-block px-3 py-1 text-sm font-medium rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200 mb-4'>
                Our Journey
              </span>
              <h2 className='text-3xl font-bold mb-6 dark:text-white'>From Idea to Developer Resource</h2>
              <p className='text-gray-600 dark:text-gray-400 mb-6'>
                BlogPress was founded in 2025 by a developers who were frustrated with the lack of practical, up-to-date technical content available
                online. We started as a small blog with a handful of articles and have grown into a trusted resource for thousands of developers
                worldwide.
              </p>
              <p className='text-gray-600 dark:text-gray-400 mb-6'>
                What sets us apart is our commitment to quality. Every article goes through a rigorous review process by industry experts to ensure
                accuracy and relevance.
              </p>
              <div className='bg-indigo-50 dark:bg-gray-700 p-4 rounded-lg border-l-4 border-indigo-500'>
                <p className='text-indigo-800 dark:text-indigo-200 italic'>
                  "Our goal is to bridge the gap between cutting-edge technology and practical implementation."
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className='py-20 px-4 bg-white dark:bg-gray-900'>
        <div className='container mx-auto max-w-6xl'>
          <div className='text-center mb-16'>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
              <span className='inline-block px-3 py-1 text-sm font-medium rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200 mb-4'>
                Our Team
              </span>
              <h2 className='text-4xl font-bold mb-4 dark:text-white'>Meet The Minds Behind BlogPress</h2>
              <p className='text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto'>
                A diverse team of developers, writers, and designers passionate about technology education.
              </p>
            </motion.div>
          </div>

          <div className=' justify-center flex'>
            <motion.div
              variants={fadeIn}
              initial='hidden'
              whileInView='visible'
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 1 * 0.1 }}
              className='bg-gray-50 dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all'
            >
              <div className='relative h-64'>
                <img src={teamMembers.image} alt={teamMembers.name} className='w-full h-full object-cover' />
                <div className='absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-70'></div>
                <div className='absolute bottom-4 left-4'>
                  <h3 className='text-2xl font-bold text-white'>{teamMembers.name}</h3>
                  <p className='text-indigo-300'>{teamMembers.role}</p>
                </div>
              </div>
              <div className='p-6'>
                <p className='text-gray-600 dark:text-gray-400 mb-4'>{teamMembers.bio}</p>
                <div className='flex gap-4'>
                  <a href={teamMembers.social.twitter} className='text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors'>
                    <FaTwitter className='text-xl' />
                  </a>
                  <a
                    href={teamMembers.social.github}
                    target='_blank'
                    className='text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors'
                  >
                    <FaGithub className='text-xl' />
                  </a>
                  <a
                    href={teamMembers.social.linkedin}
                    target='_blank'
                    className='text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors'
                  >
                    <FaLinkedin className='text-xl' />
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className='py-16 bg-indigo-50 dark:bg-gray-800'>
        <div className='container mx-auto max-w-6xl px-4'>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-8 text-center'>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className='p-6'
            >
              <div className='text-4xl font-bold text-indigo-600 dark:text-indigo-400 mb-2'>250+</div>
              <div className='text-gray-600 dark:text-gray-400'>Published Articles</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className='p-6'
            >
              <div className='text-4xl font-bold text-indigo-600 dark:text-indigo-400 mb-2'>50k+</div>
              <div className='text-gray-600 dark:text-gray-400'>Monthly Readers</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className='p-6'
            >
              <div className='text-4xl font-bold text-indigo-600 dark:text-indigo-400 mb-2'>15+</div>
              <div className='text-gray-600 dark:text-gray-400'>Expert Contributors</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className='p-6'
            >
              <div className='text-4xl font-bold text-indigo-600 dark:text-indigo-400 mb-2'>4.9</div>
              <div className='text-gray-600 dark:text-gray-400'>Average Rating</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className='py-20 px-4 bg-gradient-to-br from-indigo-900 to-purple-800 text-white'>
        <div className='container mx-auto max-w-4xl text-center'>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <h2 className='text-3xl md:text-4xl font-bold mb-6'>Join Our Developer Community</h2>
            <p className='text-xl mb-8 opacity-90 max-w-2xl mx-auto'>
              Subscribe to our newsletter for the latest articles, tutorials, and resources delivered to your inbox.
            </p>
            <form className='flex flex-col sm:flex-row gap-3 max-w-md mx-auto'>
              <input
                type='email'
                placeholder='Your email address'
                className='flex-1 px-4 py-3 rounded-lg border border-white border-opacity-30 bg-white bg-opacity-10 text-black placeholder-black placeholder-opacity-70 focus:outline-none focus:ring-2 focus:ring-black focus:bg-gray-200 focus:ring-opacity-50'
                required
              />
              <button
                type='submit'
                className='bg-white text-indigo-800 hover:bg-opacity-90 px-6 py-3 rounded-lg font-medium transition-all transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl'
              >
                Subscribe
              </button>
            </form>
            <p className='text-sm mt-4 opacity-70'>We respect your privacy. Unsubscribe at any time.</p>
          </motion.div>
        </div>
      </section>
    </>
  );
}
