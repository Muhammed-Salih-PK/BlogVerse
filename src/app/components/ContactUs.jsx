"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Mail, Phone, MapPin, Send, CheckCircle, AlertCircle, Clock, Users, MessageSquare, Shield, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  phone: z.string().optional(),
});

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6 }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
    trigger,
  } = useForm({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
      phone: "",
    },
    mode: "onChange",
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    console.log("Contact form submitted:", data);
    
    setIsSubmitting(false);
    setSubmitSuccess(true);
    toast.success("Message Sent Successfully!", {
      description: "We'll get back to you within 24 hours.",
    });
    reset();
    
    // Reset success state after 5 seconds
    setTimeout(() => setSubmitSuccess(false), 5000);
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email Us",
      value: "support@nexus.com",
      description: "We reply within 24 hours",
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      icon: Phone,
      title: "Call Us",
      value: "+1 (555) 123-4567",
      description: "Mon-Fri, 9AM-6PM EST",
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      icon: MapPin,
      title: "Visit Us",
      value: "San Francisco, CA",
      description: "Come say hello!",
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
    },
    {
      icon: Clock,
      title: "Response Time",
      value: "24 Hours",
      description: "Average first response",
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
    },
  ];

  const faqs = [
    {
      question: "How quickly can I expect a response?",
      answer: "Our team typically responds within 24 hours during business days.",
    },
    {
      question: "Do you offer 24/7 support?",
      answer: "Yes, we have a dedicated team available around the clock for critical issues.",
    },
    {
      question: "What information should I include in my message?",
      answer: "Please include your name, contact details, and a detailed description of your inquiry.",
    },
    {
      question: "Can I schedule a demo call?",
      answer: "Absolutely! Mention 'Schedule Demo' in your subject line and we'll arrange a time.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <MessageSquare className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Contact Us</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-primary via-purple-500 to-primary bg-clip-text text-transparent mb-6">
              Get in Touch
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Have questions? We're here to help. Send us a message and our team will get back to you shortly.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Left Column - Contact Info */}
          <div className="lg:col-span-1">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="space-y-6"
            >
              {/* Contact Cards */}
              {contactInfo.map((item, index) => (
                <motion.div key={item.title} variants={fadeInUp}>
                  <Card className="border hover:shadow-xl transition-all duration-300 group hover:border-primary/30">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-xl ${item.bgColor} group-hover:scale-110 transition-transform`}>
                          <item.icon className={`w-6 h-6 ${item.color}`} />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">
                            {item.title}
                          </h3>
                          <p className="text-muted-foreground text-sm mb-2">{item.description}</p>
                          <p className="font-medium">{item.value}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}

              {/* Stats Card */}
              <motion.div variants={fadeInUp}>
                <Card className="bg-gradient-to-br from-gray-900 to-gray-800 text-white border-0">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-white/20 rounded-lg">
                        <Users className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Support Team</h3>
                        <p className="text-sm text-gray-300">Always ready to help</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold">50+</div>
                        <div className="text-xs text-gray-300">Team Members</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold">99%</div>
                        <div className="text-xs text-gray-300">Satisfaction</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </div>

          {/* Right Column - Contact Form */}
          <div className="lg:col-span-2">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <Card className="border-0 shadow-2xl overflow-hidden">
                <div className="h-2 bg-gradient-to-r from-primary via-purple-500 to-primary" />
                
                <CardHeader className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Send className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl">Send us a message</CardTitle>
                      <CardDescription>
                        Fill out the form below and we'll get back to you as soon as possible
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-6">
                  {submitSuccess ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-12"
                    >
                      <div className="w-20 h-20 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-10 h-10 text-emerald-500" />
                      </div>
                      <h3 className="text-2xl font-bold mb-3">Message Sent!</h3>
                      <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                        Thank you for reaching out. We've received your message and will get back to you within 24 hours.
                      </p>
                      <Button 
                        onClick={() => setSubmitSuccess(false)}
                        variant="outline"
                        className="gap-2 group"
                      >
                        Send Another Message
                        <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Name Field */}
                        <div className="space-y-2">
                          <Label htmlFor="name" className="text-sm font-medium">
                            Full Name *
                          </Label>
                          <div className="relative">
                            <Input
                              id="name"
                              placeholder="John Doe"
                              className={`pl-10 ${errors.name ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                              {...register("name")}
                              onBlur={() => trigger("name")}
                            />
                            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                              <Users className="w-5 h-5" />
                            </div>
                          </div>
                          {errors.name && (
                            <p className="text-red-500 text-xs flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" />
                              {errors.name.message}
                            </p>
                          )}
                        </div>

                        {/* Email Field */}
                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-sm font-medium">
                            Email Address *
                          </Label>
                          <div className="relative">
                            <Input
                              id="email"
                              type="email"
                              placeholder="you@example.com"
                              className={`pl-10 ${errors.email ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                              {...register("email")}
                              onBlur={() => trigger("email")}
                            />
                            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                              <Mail className="w-5 h-5" />
                            </div>
                          </div>
                          {errors.email && (
                            <p className="text-red-500 text-xs flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" />
                              {errors.email.message}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Phone Field */}
                        <div className="space-y-2">
                          <Label htmlFor="phone" className="text-sm font-medium">
                            Phone Number (Optional)
                          </Label>
                          <div className="relative">
                            <Input
                              id="phone"
                              type="tel"
                              placeholder="+1 (555) 123-4567"
                              className="pl-10"
                              {...register("phone")}
                            />
                            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                              <Phone className="w-5 h-5" />
                            </div>
                          </div>
                        </div>

                        {/* Subject Field */}
                        <div className="space-y-2">
                          <Label htmlFor="subject" className="text-sm font-medium">
                            Subject *
                          </Label>
                          <Input
                            id="subject"
                            placeholder="How can we help?"
                            className={errors.subject ? "border-red-500 focus-visible:ring-red-500" : ""}
                            {...register("subject")}
                            onBlur={() => trigger("subject")}
                          />
                          {errors.subject && (
                            <p className="text-red-500 text-xs flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" />
                              {errors.subject.message}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Message Field */}
                      <div className="space-y-2">
                        <Label htmlFor="message" className="text-sm font-medium">
                          Your Message *
                        </Label>
                        <Textarea
                          id="message"
                          placeholder="Please describe your inquiry in detail..."
                          className={`min-h-[150px] resize-none ${errors.message ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                          {...register("message")}
                          onBlur={() => trigger("message")}
                        />
                        {errors.message && (
                          <p className="text-red-500 text-xs flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {errors.message.message}
                          </p>
                        )}
                      </div>

                      {/* Security Note */}
                      <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <Shield className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-blue-700 dark:text-blue-300">
                          Your information is secure and encrypted. We'll never share your details with third parties.
                        </p>
                      </div>

                      {/* Submit Button */}
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button
                          type="submit"
                          size="lg"
                          className="w-full gap-2 group bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
                          disabled={isSubmitting || !isValid}
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="w-5 h-5 animate-spin" />
                              Sending Message...
                            </>
                          ) : (
                            <>
                              Send Message
                              <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </>
                          )}
                        </Button>
                      </motion.div>
                    </form>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* FAQ Section */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
              className="mt-12"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <MessageSquare className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {faqs.map((faq, index) => (
                  <Card key={index} className="border hover:border-primary/30 transition-colors">
                    <CardContent className="p-6">
                      <h3 className="font-semibold mb-2">{faq.question}</h3>
                      <p className="text-sm text-muted-foreground">{faq.answer}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="mt-16 lg:mt-24"
        >
          <Card className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-primary/20">
            <CardContent className="p-8 text-center">
              <div className="max-w-2xl mx-auto">
                <h2 className="text-2xl font-bold mb-3">Looking for Immediate Help?</h2>
                <p className="text-muted-foreground mb-6">
                  Check out our comprehensive documentation or join our community forum for quick answers.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button className="gap-2 group">
                    View Documentation
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                  <Button variant="outline" className="gap-2">
                    Join Community
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}