"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { genericFetchData } from "@/lib/genericFetchData";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/zod/schemas/loginSchema";

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [error, setError] = useState("");
  const router = useRouter();

  const onSubmit = async (body) => {
    const [data, error] = await genericFetchData(`/api/auth/login`, "POST", body);

    if (error) {
      console.error(error);
      setError(error.message);
    } else {
      setError("");
      toast.success("Login Successfully");

      if (data.user.role === "admin") {
        router.push("/admin/dashboard");
      } else {
        router.push("/profile");
      }
    }
  };

  return (
    <div className='flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10'>
      <div className='w-full max-w-sm md:max-w-3xl'>
        <div className={cn("flex flex-col gap-6")}>
          <Card className='overflow-hidden p-0'>
            <CardContent className='grid p-0 md:grid-cols-2'>
              <form className='p-6 md:p-8' onSubmit={handleSubmit(onSubmit)}>
                <div className='flex flex-col gap-6'>
                  {/* Title */}
                  <div className='flex flex-col items-center text-center'>
                    <h1 className='text-2xl font-bold'>Welcome Back</h1>
                    <p className='text-muted-foreground'>Login to your account</p>
                  </div>

                  {/* Email Field */}
                  <div className='grid gap-3'>
                    <Label htmlFor='email'>Email</Label>
                    <Input
                      id='email'
                      type='email'
                      aria-invalid={!!errors.email}
                      className={`w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 ${
                        errors.email ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
                      }`}
                      placeholder='m@example.com'
                      {...register("email")}
                      onBlur={() => trigger("email")}
                    />
                    {errors.email && <p className='text-red-500 text-sm'>{errors.email.message}</p>}
                  </div>

                  {/* Password Field */}
                  <div className='grid gap-3'>
                    <div className='flex items-center'>
                      <Label htmlFor='password'>Password</Label>
                      <a href='#' className='ml-auto text-sm  underline-offset-2 hover:underline'>
                        Forgot password?
                      </a>
                    </div>
                    <Input
                      id='password'
                      type='password'
                      {...register("password")}
                      className={`w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 ${
                        errors.password ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
                      }`}
                      onBlur={() => trigger("password")}
                    />
                    {errors.password && <p className='text-red-500 text-sm'>{errors.password.message}</p>}
                  </div>
                  {error && <p className='text-red-600 text-sm'>{error}</p>}

                  {/* Login Button */}
                  <Button type='submit' className='w-full' disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
                    {isSubmitting ? "Logging..." : "Login"}
                  </Button>
                </div>
                <p className='mt-4 text-center'>
                  Don’t have an account?{" "}
                  <Link href='/signup' className='text-blue-600 hover:underline'>
                    Sign up
                  </Link>
                </p>
              </form>

              {/* Side Image (Only visible on larger screens) */}
              <div className='bg-muted relative hidden md:block'>
                <img
                  src='/img/placeholder.webp'
                  alt='Login Illustration'
                  className='absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale'
                />
              </div>
            </CardContent>
          </Card>

          {/* Terms & Privacy */}
          <div className='text-muted-foreground text-center text-xs'>
            By clicking continue, you agree to our{" "}
            <a href='#' className='underline underline-offset-4 hover:text-primary'>
              Terms of Service
            </a>{" "}
            and{" "}
            <a href='#' className='underline underline-offset-4 hover:text-primary'>
              Privacy Policy
            </a>
            .
          </div>
        </div>
      </div>
    </div>
  );
}
