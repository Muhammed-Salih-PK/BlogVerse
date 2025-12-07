"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Mail, Lock, Eye, EyeOff, Shield, Sparkles, ArrowRight, CheckCircle, AlertCircle, Users } from "lucide-react";
import { useState } from "react";
import { genericFetchData } from "@/lib/genericFetchData";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/zod/schemas/loginSchema";
import { useAppDispatch } from "@/hooks/reduxHooks";
import { setUser } from "@/lib/features/auth/authSlice";
import { motion, AnimatePresence } from "framer-motion";

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    trigger,
    watch,
    formState: { errors, isSubmitting, isValid },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange",
  });

  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const dispatch = useAppDispatch();

  const email = watch("email", "");

  const onSubmit = async (body) => {
    const [data, error] = await genericFetchData(`/api/auth/login`, "POST", body);

    if (error) {
      console.error(error);
      setError(error.message);
      toast.error("Login Failed", {
        description: error.message,
      });
    } else {
      setError("");
      toast.success("Welcome back!", {
        description: "You've successfully logged in.",
      });
      dispatch(setUser(data.user));
      if (data.user.role === "admin") {
        window.location.href = "/admin/dashboard";
      } else {
        window.location.href = "/profile";
      }
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-950 dark:via-black dark:to-gray-900 flex items-center justify-center p-4 md:p-6 '>
      {/* Animated Background */}
      <div className='absolute inset-0 overflow-hidden pointer-events-none'>
        <div className='absolute -top-40 -right-40 w-80 h-80 bg-blue-200 dark:bg-blue-900/20 rounded-full mix-blend-multiply blur-3xl opacity-20' />
        <div className='absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 dark:bg-purple-900/20 rounded-full mix-blend-multiply blur-3xl opacity-20' />
        <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-100 dark:bg-cyan-900/10 rounded-full mix-blend-multiply blur-3xl opacity-10' />
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className='w-full max-w-6xl pb-20'>
        <Card className='w-full shadow-2xl border-0 overflow-hidden bg-white/90 dark:bg-gray-950/90 backdrop-blur-sm'>
          <div className='grid grid-cols-1 lg:grid-cols-5 h-[600px]'>
            {/* Left Side - Visual Section */}
            <div className='hidden lg:block relative col-span-2 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 overflow-hidden'>
              <div className='absolute inset-0 bg-grid-white/[0.02] bg-[size:20px_20px]' />

              {/* Animated Elements */}
              <div className='absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
                <motion.div
                  animate={{
                    y: [0, -20, 0],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className='w-32 h-32 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-2xl'
                />
              </div>

              <div className='relative h-full flex flex-col justify-between p-8'>
                {/* Logo/Brand */}
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className='mb-12'>
                  <div className='flex items-center gap-3'>
                    <div className='w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center'>
                      <Shield className='w-6 h-6 text-white' />
                    </div>
                    <span className='text-2xl font-bold text-white'>BlogVerse</span>
                  </div>
                </motion.div>

                {/* Main Content */}
                <div className='space-y-8'>
                  <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                    <h2 className='text-4xl font-bold text-white mb-4'>Welcome Back to BlogVerse</h2>
                    <p className='text-gray-300 text-lg'>Continue your journey with thousands of creators worldwide.</p>
                  </motion.div>

                  {/* Features List */}
                  <div className='space-y-6'>
                    {[
                      { icon: Shield, title: "Secure Login", desc: "End-to-end encryption" },
                      { icon: Users, title: "Global Community", desc: "10K+ active creators" },
                      { icon: Sparkles, title: "Smart Features", desc: "AI-powered insights" },
                    ].map((feature, idx) => (
                      <motion.div
                        key={feature.title}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + idx * 0.1 }}
                        className='flex items-center gap-4'
                      >
                        <div className='w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center'>
                          <feature.icon className='w-6 h-6 text-white' />
                        </div>
                        <div>
                          <h4 className='font-semibold text-white'>{feature.title}</h4>
                          <p className='text-gray-400 text-sm'>{feature.desc}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Stats */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className='pt-8 border-t border-white/10'
                >
                  <div className='grid grid-cols-3 gap-4'>
                    <div className='text-center'>
                      <div className='text-2xl font-bold text-white'>10K+</div>
                      <div className='text-xs text-gray-300'>Active Users</div>
                    </div>
                    <div className='text-center'>
                      <div className='text-2xl font-bold text-white'>5K+</div>
                      <div className='text-xs text-gray-300'>Articles</div>
                    </div>
                    <div className='text-center'>
                      <div className='text-2xl font-bold text-white'>99.9%</div>
                      <div className='text-xs text-gray-300'>Uptime</div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Right Side - Form */}
            <div className='col-span-3 p-6 md:p-12 overflow-y-auto'>
              <div className='max-w-md mx-auto'>
                {/* Header */}
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className='mb-10'>
                  <div className='flex items-center gap-3 mb-4'>
                    <div className='w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center'>
                      <Shield className='w-6 h-6 text-white' />
                    </div>
                    <span className='text-2xl font-bold text-gray-900 dark:text-white'>BlogVerse</span>
                  </div>
                  <div>
                    <h1 className='text-3xl font-bold text-gray-900 dark:text-white mb-2'>Welcome Back</h1>
                    <p className='text-gray-600 dark:text-gray-300'>Sign in to access your account and continue your journey</p>
                  </div>
                </motion.div>

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                  <div className='space-y-5'>
                    {/* Email Field */}
                    <div className='space-y-2'>
                      <Label htmlFor='email' className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                        Email Address
                      </Label>
                      <div className='relative group'>
                        <div className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors'>
                          <Mail className='w-5 h-5' />
                        </div>
                        <Input
                          id='email'
                          type='email'
                          placeholder='you@example.com'
                          className={`pl-12 h-11 ${errors.email ? "border-red-500" : "border-gray-300 dark:border-gray-700"}`}
                          {...register("email")}
                          onBlur={() => trigger("email")}
                        />
                        <AnimatePresence>
                          {!errors.email && email && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className='absolute right-4 top-1/2 -translate-y-1/2'
                            >
                              <CheckCircle className='w-5 h-5 text-green-500' />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                      {errors.email && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className='text-red-500 text-xs flex items-center gap-2 mt-1'
                        >
                          <AlertCircle className='w-3 h-3' />
                          {errors.email.message}
                        </motion.p>
                      )}
                    </div>

                    {/* Password Field */}
                    <div className='space-y-2'>
                      <div className='flex items-center justify-between'>
                        <Label htmlFor='password' className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                          Password
                        </Label>
                        <Link
                          href='/forgot-password'
                          className='text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline transition-colors'
                        >
                          Forgot password?
                        </Link>
                      </div>
                      <div className='relative group'>
                        <div className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors'>
                          <Lock className='w-5 h-5' />
                        </div>
                        <Input
                          id='password'
                          type={showPassword ? "text" : "password"}
                          placeholder='Enter your password'
                          className={`pl-12 pr-12 h-11 ${errors.password ? "border-red-500" : "border-gray-300 dark:border-gray-700"}`}
                          {...register("password")}
                          onBlur={() => trigger("password")}
                        />
                        <button
                          type='button'
                          onClick={() => setShowPassword(!showPassword)}
                          className='absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors'
                        >
                          {showPassword ? <EyeOff className='w-5 h-5' /> : <Eye className='w-5 h-5' />}
                        </button>
                      </div>
                      {errors.password && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className='text-red-500 text-xs flex items-center gap-2 mt-1'
                        >
                          <AlertCircle className='w-3 h-3' />
                          {errors.password.message}
                        </motion.p>
                      )}
                    </div>
                  </div>

                  {/* Error Message */}
                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className='p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg'
                      >
                        <p className='text-red-600 dark:text-red-400 text-sm flex items-center gap-2'>
                          <AlertCircle className='w-4 h-4' />
                          {error}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Login Button */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onHoverStart={() => setIsHovered(true)}
                    onHoverEnd={() => setIsHovered(false)}
                  >
                    <Button
                      type='submit'
                      size='lg'
                      className='w-full h-12 text-base font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 group'
                      disabled={isSubmitting || !isValid}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className='mr-2 h-5 w-5 animate-spin' />
                          Signing in...
                        </>
                      ) : (
                        <>
                          Sign In
                          <motion.span animate={{ x: isHovered ? 3 : 0 }} transition={{ duration: 0.2 }} className='ml-2'>
                            <ArrowRight className='w-5 h-5' />
                          </motion.span>
                        </>
                      )}
                    </Button>
                  </motion.div>
                </form>

                {/* Divider */}
                <div className='relative my-8'>
                  <div className='absolute inset-0 flex items-center'>
                    <div className='w-full border-t border-gray-200 dark:border-gray-800' />
                  </div>
                  <div className='relative flex justify-center'>
                    <span className='px-4 bg-white dark:bg-gray-900 text-sm text-gray-500'>Or continue with</span>
                  </div>
                </div>

                {/* Social Login */}
                <div className='grid grid-cols-2 gap-3 mb-8'>
                  <Button
                    variant='outline'
                    className='h-11 border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300'
                  >
                    <svg className='w-5 h-5 mr-2' viewBox='0 0 24 24'>
                      <path
                        fill='currentColor'
                        d='M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z'
                      />
                    </svg>
                    Google
                  </Button>
                  <Button
                    variant='outline'
                    className='h-11 border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300'
                  >
                    <svg className='w-5 h-5 mr-2' viewBox='0 0 24 24'>
                      <path
                        fill='currentColor'
                        d='M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z'
                      />
                    </svg>
                    GitHub
                  </Button>
                </div>

                {/* Sign Up Link */}
                <div className='text-center'>
                  <p className='text-gray-600 dark:text-gray-400'>
                    Don't have an account?{" "}
                    <Link
                      href='/signup'
                      className='font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors inline-flex items-center gap-1 group'
                    >
                      Sign up now
                      <ArrowRight className='w-4 h-4 group-hover:translate-x-1 transition-transform' />
                    </Link>
                  </p>
                </div>

                {/* Terms & Privacy */}
                <div className='mt-8 text-center'>
                  <p className='text-xs text-gray-500 dark:text-gray-400'>
                    By signing in, you agree to our{" "}
                    <Link href='/terms' className='underline hover:text-gray-700 dark:hover:text-gray-300 transition-colors'>
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href='/privacy' className='underline hover:text-gray-700 dark:hover:text-gray-300 transition-colors'>
                      Privacy Policy
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
