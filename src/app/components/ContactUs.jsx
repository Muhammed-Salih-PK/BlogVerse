"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { FiSend, FiUser, FiMail, FiMessageSquare } from "react-icons/fi";
import { FaCheckCircle, FaExclamationCircle } from "react-icons/fa";

export function ContactUs() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState({ isSubmitting: false, isSuccess: false, error: null });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ isSubmitting: true, isSuccess: false, error: null });

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setStatus({ isSubmitting: false, isSuccess: true, error: null });
      setForm({ name: "", email: "", message: "" });
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setStatus(prev => ({ ...prev, isSuccess: false }));
      }, 5000);
    } catch (err) {
      setStatus({ isSubmitting: false, isSuccess: false, error: "Failed to send message. Please try again." });
    }
  };

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white"
          >
            Get in Touch
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-xl text-gray-600 dark:text-gray-300 mt-4 max-w-2xl mx-auto"
          >
            Have a project in mind or questions about our services? We'd love to hear from you.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg"
          >
            <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">Contact Information</h3>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-full">
                  <FiMail className="text-emerald-600 dark:text-emerald-400 text-xl" />
                </div>
                <div>
                  <h4 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Email</h4>
                  <a href="mailto:contact@example.com" className="text-gray-800 dark:text-gray-200 hover:text-emerald-600 dark:hover:text-emerald-400 transition">
                    contact@example.com
                  </a>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                  <FiMessageSquare className="text-blue-600 dark:text-blue-400 text-xl" />
                </div>
                <div>
                  <h4 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Support</h4>
                  <a href="mailto:support@example.com" className="text-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition">
                    support@example.com
                  </a>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                  <FiUser className="text-purple-600 dark:text-purple-400 text-xl" />
                </div>
                <div>
                  <h4 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Hours</h4>
                  <p className="text-gray-800 dark:text-gray-200">
                    Monday - Friday: 9AM - 5PM
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <h4 className="text-lg font-medium text-gray-800 dark:text-white mb-4">Follow Us</h4>
              <div className="flex gap-4">
                {['Twitter', 'LinkedIn', 'GitHub', 'Dribbble'].map((social) => (
                  <motion.a
                    key={social}
                    href="#"
                    whileHover={{ y: -3 }}
                    className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                    aria-label={social}
                  >
                    <span className="text-gray-700 dark:text-gray-300">{social.charAt(0)}</span>
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg"
          >
            <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">Send Us a Message</h3>
            
            {status.error && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3"
              >
                <FaExclamationCircle className="text-red-500 dark:text-red-400 mt-0.5 flex-shrink-0" />
                <p className="text-red-700 dark:text-red-300">{status.error}</p>
              </motion.div>
            )}
            
            {status.isSuccess && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg flex items-start gap-3"
              >
                <FaCheckCircle className="text-emerald-500 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
                <p className="text-emerald-700 dark:text-emerald-300">
                  Message sent successfully! We'll get back to you soon.
                </p>
              </motion.div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name Field */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiUser className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      placeholder="John Doe"
                      className="pl-10 w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white transition"
                    />
                  </div>
                </div>
                
                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiMail className="text-gray-400" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      placeholder="your@email.com"
                      className="pl-10 w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white transition"
                    />
                  </div>
                </div>
              </div>
              
              {/* Message Field */}
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Your Message
                </label>
                <div className="relative">
                  <div className="absolute top-3 left-3">
                    <FiMessageSquare className="text-gray-400" />
                  </div>
                  <textarea
                    id="message"
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    required
                    rows="5"
                    placeholder="Tell us about your project..."
                    className="pl-10 w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white transition"
                  ></textarea>
                </div>
              </div>
              
              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={status.isSubmitting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg shadow-md transition-all ${
                  status.isSubmitting
                    ? 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed'
                    : 'bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-600'
                }`}
              >
                {status.isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </>
                ) : (
                  <>
                    <FiSend />
                    Send Message
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}