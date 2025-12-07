"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { genericFetchData } from "@/lib/genericFetchData";
import { useForm } from "react-hook-form";
import {
  Loader2,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Sparkles,
  Shield,
  Users,
  Lock,
  Mail,
  User,
  Check,
  ChevronRight,
} from "lucide-react";
import { signupSchema } from "@/zod/schemas/loginSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { FiFeather } from "react-icons/fi";

export default function SignupPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    trigger,
    watch,
  } = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [step, setStep] = useState(1);
  const router = useRouter();

  const password = watch("password", "");
  const confirmPassword = watch("confirmPassword", "");
  const email = watch("email", "");
  const username = watch("username", "");

  const onSubmit = async (body) => {
    const [data, error] = await genericFetchData(`/api/auth/signup`, "POST", body);

    if (error) {
      setError(error.message);
    } else {
      setError("");
      router.push("/profile");
    }
  };

  const getPasswordStrength = (pass) => {
    if (!pass) return 0;
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return score;
  };

  const strength = getPasswordStrength(password);
  const passwordsMatch = password && confirmPassword && password === confirmPassword;

  const passwordStrengthColors = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-blue-500", "bg-green-500"];

  const passwordStrengthText = ["Very Weak", "Weak", "Fair", "Good", "Strong"];

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50 dark:from-gray-950 dark:via-black dark:to-gray-900 flex items-center justify-center p-4 pb-20'>
      {/* Animated Background Particles */}
      <div className='absolute inset-0 overflow-hidden pointer-events-none'>
        <div className='absolute top-1/4 left-1/4 w-96 h-96 bg-purple-200 dark:bg-purple-900/20 rounded-full blur-3xl opacity-20 animate-pulse' />
        <div className='absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-200 dark:bg-blue-900/20 rounded-full blur-3xl opacity-20 animate-pulse delay-1000' />
        <div className='absolute top-1/2 right-1/3 w-64 h-64 bg-pink-200 dark:bg-pink-900/20 rounded-full blur-3xl opacity-10 animate-pulse delay-500' />
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className='w-full max-w-6xl'>
        <Card className='w-full shadow-2xl border-0 overflow-hidden bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm'>
          <div className='grid grid-cols-1 lg:grid-cols-5 h-[600px]'>
            {/* Left Side - Visual Hero */}
            <div className='hidden lg:block relative col-span-2 bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 overflow-hidden'>
              <div className='absolute inset-0 bg-grid-white/[0.02] bg-[size:20px_20px]' />

              <div className='relative h-full flex flex-col justify-between p-8'>
                {/* Logo/Brand */}
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className='mb-12'>
                  <div className='flex items-center gap-3'>
                    <div className='w-10 h-10 bg-black/50 rounded-xl flex items-center justify-center'>
                      <FiFeather className='w-4 h-4 text-white' />
                    </div>
                    <span className='text-2xl font-bold text-white'>BlogVerse</span>
                  </div>
                </motion.div>

                {/* Main Content */}
                <div className='space-y-8'>
                  <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                    <h2 className='text-4xl font-bold text-white mb-4'>Join the Future of Collaboration</h2>
                    <p className='text-gray-300 text-lg'>Connect with innovators worldwide. Start your journey today.</p>
                  </motion.div>

                  {/* Features List */}
                  <div className='space-y-6'>
                    {[
                      { icon: Shield, title: "Enterprise Security", desc: "Bank-level encryption" },
                      { icon: Users, title: "Global Network", desc: "10K+ professionals" },
                      { icon: Sparkles, title: "Smart Features", desc: "AI-powered tools" },
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
              </div>
            </div>

            {/* Right Side - Form */}
            <div className='col-span-3 p-6 md:p-5 overflow-y-auto'>
              <div className='max-w-md mx-auto'>
                {/* Header */}
                <CardHeader className='p-0 mb-8'>
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className='space-y-2'>
                    <CardTitle className='text-3xl font-bold text-gray-900 dark:text-white'>Create Account</CardTitle>
                    <CardDescription className='text-gray-600 dark:text-gray-300'>Fill in your details to get started</CardDescription>
                  </motion.div>
                </CardHeader>

                {/* Error Alert */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className='mb-6'
                    >
                      <div className='p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl'>
                        <div className='flex items-start gap-3'>
                          <AlertCircle className='w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5' />
                          <div>
                            <h4 className='font-semibold text-red-800 dark:text-red-200'>Signup Failed</h4>
                            <p className='text-red-700 dark:text-red-300 text-sm mt-1'>{error}</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                  {/* Form Fields */}
                  <div className='space-y-6'>
                    {/* Username */}
                    <div className='space-y-2'>
                      <Label htmlFor='username' className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                        Username
                      </Label>
                      <div className='relative group'>
                        <div className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors'>
                          <User className='w-5 h-5' />
                        </div>
                        <Input
                          id='username'
                          type='text'
                          placeholder='johndoe'
                          className={`pl-12 h-11 ${errors.username ? "border-red-500" : "border-gray-300 dark:border-gray-700"}`}
                          {...register("username")}
                        />
                        <AnimatePresence>
                          {!errors.username && username && (
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
                      {errors.username && (
                        <p className='text-red-500 text-xs flex items-center gap-2 mt-1'>
                          <AlertCircle className='w-3 h-3' />
                          {errors.username.message}
                        </p>
                      )}
                    </div>

                    {/* Email */}
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
                        />
                      </div>
                      {errors.email && (
                        <p className='text-red-500 text-xs flex items-center gap-2 mt-1'>
                          <AlertCircle className='w-3 h-3' />
                          {errors.email.message}
                        </p>
                      )}
                    </div>

                    {/* Password */}
                    <div className='space-y-3'>
                      <Label htmlFor='password' className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                        Password
                      </Label>
                      <div className='relative group'>
                        <div className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors'>
                          <Lock className='w-5 h-5' />
                        </div>
                        <Input
                          id='password'
                          type={showPassword ? "text" : "password"}
                          placeholder='Create a strong password'
                          className={`pl-12 pr-12 h-11 ${errors.password ? "border-red-500" : "border-gray-300 dark:border-gray-700"}`}
                          {...register("password")}
                        />
                        <button
                          type='button'
                          onClick={() => setShowPassword(!showPassword)}
                          className='absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                        >
                          {showPassword ? <EyeOff className='w-5 h-5' /> : <Eye className='w-5 h-5' />}
                        </button>
                      </div>

                      {/* Password Strength Indicator */}
                      {password && (
                        <div className='space-y-2 pt-2'>
                          <div className='flex items-center justify-between'>
                            <span className='text-xs text-gray-500'>Strength</span>
                            <span className={`text-xs font-medium ${passwordStrengthColors[strength].replace("bg-", "text-")}`}>
                              {passwordStrengthText[strength]}
                            </span>
                          </div>
                          <div className='flex gap-1'>
                            {[...Array(5)].map((_, i) => (
                              <motion.div
                                key={i}
                                initial={{ width: 0 }}
                                animate={{ width: i <= strength ? "100%" : "0%" }}
                                transition={{ delay: i * 0.1 }}
                                className={`h-1.5 rounded-full ${i <= strength ? passwordStrengthColors[i] : "bg-gray-200 dark:bg-gray-700"}`}
                              />
                            ))}
                          </div>
                        </div>
                      )}

                      {errors.password && (
                        <p className='text-red-500 text-xs flex items-center gap-2 mt-1'>
                          <AlertCircle className='w-3 h-3' />
                          {errors.password.message}
                        </p>
                      )}
                    </div>

                    {/* Confirm Password */}
                    <div className='space-y-2'>
                      <Label htmlFor='confirmPassword' className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                        Confirm Password
                      </Label>
                      <div className='relative group'>
                        <div className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors'>
                          <Lock className='w-5 h-5' />
                        </div>
                        <Input
                          id='confirmPassword'
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder='Confirm your password'
                          className={`pl-12 pr-12 h-11 ${errors.confirmPassword ? "border-red-500" : "border-gray-300 dark:border-gray-700"}`}
                          {...register("confirmPassword")}
                        />
                        <button
                          type='button'
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className='absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                        >
                          {showConfirmPassword ? <EyeOff className='w-5 h-5' /> : <Eye className='w-5 h-5' />}
                        </button>
                      </div>
                      <AnimatePresence>
                        {confirmPassword && (
                          <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className={`text-xs flex items-center gap-2 ${passwordsMatch ? "text-green-600" : "text-red-500"}`}
                          >
                            {passwordsMatch ? (
                              <>
                                <Check className='w-3 h-3' />
                                Passwords match
                              </>
                            ) : (
                              <>
                                <AlertCircle className='w-3 h-3' />
                                Passwords do not match
                              </>
                            )}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Terms & Conditions */}
                  <div className='space-y-4'>
                    <div className='flex items-start gap-3'>
                      <input
                        id='terms'
                        type='checkbox'
                        required
                        className='w-4 h-4 mt-1 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2'
                      />
                      <Label htmlFor='terms' className='text-sm text-gray-600 dark:text-gray-400 leading-relaxed'>
                        I agree to the{" "}
                        <a href='#' className='text-blue-600 dark:text-blue-400 hover:underline font-medium'>
                          Terms of Service
                        </a>{" "}
                        and{" "}
                        <a href='#' className='text-blue-600 dark:text-blue-400 hover:underline font-medium'>
                          Privacy Policy
                        </a>
                      </Label>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      type='submit'
                      size='lg'
                      className='w-full h-12 text-base font-semibold dark:text-white  bg-gradient-to-r from-gray-900 to-gray-800 dark:from-gray-800 dark:to-gray-900 hover:from-gray-800 hover:to-gray-700 dark:hover:from-gray-700 dark:hover:to-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 group'
                      disabled={isSubmitting || !isValid}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className='mr-2 h-5 w-5 animate-spin' />
                          Creating Account...
                        </>
                      ) : (
                        <>
                          Create Account
                          <ChevronRight className='ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform' />
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
                    <span className='px-4 bg-white dark:bg-gray-900 text-sm text-gray-500'>Or sign up with</span>
                  </div>
                </div>

                {/* Social Signup */}
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

                {/* Login Link */}
                <div className='text-center'>
                  <p className='text-gray-600 dark:text-gray-400'>
                    Already have an account?{" "}
                    <a
                      href='/login'
                      className='font-semibold text-gray-900 dark:text-white hover:text-gray-700 dark:hover:text-gray-300 transition-colors inline-flex items-center gap-1'
                    >
                      Sign in
                      <ChevronRight className='w-4 h-4' />
                    </a>
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
