"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { genericFetchData } from "@/lib/genericFetchData";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { signupSchema } from "@/zod/schemas/loginSchema";
import { zodResolver } from "@hookform/resolvers/zod";

export default function SignupPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    trigger,
  } = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });
  const [error, setError] = useState("");
  const router = useRouter();

  const onSubmit = async (body) => {
    const [data, error] = await genericFetchData(`/api/auth/signup`, "POST", body);

    if (error) {
      setError(error.message);
    } else {
      setError("");
      router.push("/profile");
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 md:mt-8 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4'>
      <Card className='w-full max-w-md md:max-w-2xl shadow-xl overflow-hidden'>
        <div className='grid grid-cols-1 md:grid-cols-2'>
          {/* Image Section */}
          <div className='hidden md:block relative bg-gradient-to-br from-blue-600 to-indigo-700 rounded-se-2xl'>
            <div className='absolute inset-0 flex items-center justify-center p-8 '>
              <div className='relative w-full h-64 '>
                <Image src='/img/signup.webp' alt='Signup Illustration' fill className='object-contain  ' priority />
              </div>
            </div>
            <div className='absolute bottom-0 left-0 right-0 p-6 text-white'>
              <h3 className='text-xl font-bold'>Join Our Community</h3>
              <p className='text-blue-100 text-sm mt-1'>Start your journey with us today</p>
            </div>
          </div>

          {/* Form Section */}
          <div className='p-6 md:p-8'>
            <CardHeader className='p-0 mb-6'>
              <CardTitle className='text-2xl font-bold text-center'>Create Account</CardTitle>
              <CardDescription className='text-center'>Fill in your details to get started</CardDescription>
            </CardHeader>

            {error && <div className='mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm'>{error}</div>}

            <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
              {/* Username Field */}
              <div className='space-y-2'>
                <Label htmlFor='username'>Username</Label>
                <Input
                  id='username'
                  type='text'
                  placeholder='Enter your username'
                  className={errors.username ? "border-red-500" : ""}
                  {...register("username")}
                  onBlur={() => trigger("username")}
                />
                {errors.username && <p className='text-red-500 text-xs'>{errors.username.message}</p>}
              </div>

              {/* Email Field */}
              <div className='space-y-2'>
                <Label htmlFor='email'>Email</Label>
                <Input
                  id='email'
                  type='email'
                  placeholder='your@email.com'
                  className={errors.email ? "border-red-500" : ""}
                  {...register("email")}
                  onBlur={() => trigger("email")}
                />
                {errors.email && <p className='text-red-500 text-xs'>{errors.email.message}</p>}
              </div>

              {/* Password Field */}
              <div className='space-y-2'>
                <Label htmlFor='password'>Password</Label>
                <Input
                  id='password'
                  type='password'
                  placeholder='••••••••'
                  className={errors.password ? "border-red-500" : ""}
                  {...register("password")}
                  onBlur={() => trigger("password")}
                />
                {errors.password && <p className='text-red-500 text-xs'>{errors.password.message}</p>}
              </div>
              {/* confirm Password field */}
              <div className='space-y-2'>
                <Label htmlFor='confirmPassword'>Confirm Password</Label>
                <Input
                  id='confirmPassword'
                  type='password'
                  placeholder='confirm password'
                  className={errors.password ? "border-red-500" : ""}
                  {...register("confirmPassword")}
                  onBlur={() => trigger("confirmPassword")}
                />
                {errors.confirmPassword && <p className='text-red-500 text-xs'>{errors.confirmPassword.message}</p>}
              </div>

              <Button type='submit' className='w-full mt-6' disabled={isSubmitting}>
                {isSubmitting && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
                {isSubmitting ? "Creating account..." : "Sign Up"}
              </Button>
            </form>

            <div className='mt-6 text-center text-sm'>
              <p className='text-muted-foreground'>
                Already have an account?{" "}
                <a href='/login' className='font-medium text-primary hover:underline'>
                  Log in
                </a>
              </p>
            </div>

            <div className='mt-8 text-center text-xs text-muted-foreground'>
              By signing up, you agree to our{" "}
              <a href='#' className='underline hover:text-primary'>
                Terms
              </a>{" "}
              and{" "}
              <a href='#' className='underline hover:text-primary'>
                Privacy Policy
              </a>
              .
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
