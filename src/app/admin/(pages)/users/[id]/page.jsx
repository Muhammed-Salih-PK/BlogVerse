"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Loader2, User2, Mail, Link2, Globe } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import ProfileEditSkeleton from "@/app/components/skeletons/ProfileEditSkeleton";
import { genericFetchData } from "@/lib/genericFetchData";
import { useForm } from "react-hook-form";
import { FaGithub, FaTwitter } from "react-icons/fa";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileSchema } from "@/zod/schemas/profileSchema";

export default function EditUser() {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: "", type: "" });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    trigger,
    watch,
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: "",
      email: "",
      avatar: "",
      bio: "",
      socialLinks: {
        twitter: "",
        github: "",
        website: "",
      },
    },
  });
  const formValues = watch();

  // Fetch profile data on mount
  useEffect(() => {
    async function fetchProfile() {
      setLoading(true);

      const [response, error] = await genericFetchData(`${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/users/${id}`, "GET");

      const data = response.user;

      if (error) {
        setMessage({ text: "Error loading profile data.", type: "error" });
      } else {
        reset({
          username: data.username || "",
          email: data.email || "",
          bio: data.bio || "",
          avatar: data.avatar || "",
          socialLinks: {
            twitter: data.socialLinks?.twitter || "",
            github: data.socialLinks?.github || "",
            website: data.socialLinks?.website || "",
          },
        });
      }
      setLoading(false);
    }

    fetchProfile();
  }, []);

  const onSubmit = async (body) => {
    setMessage({ text: "", type: "" });

    const [data, error] = await genericFetchData(`${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/users/${id}`, "PUT", body);

    if (error) {
      setMessage({ text: "Network error. Please try again.", type: "error" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
      setMessage({ text: "Profile updated successfully!", type: "success" });
      setTimeout(() => router.back(), 1000);
    }
  };

  if (loading) {
    return <ProfileEditSkeleton />;
  }

  return (
    <div className='container mx-auto px-4 py-8 max-w-4xl'>
      <Card>
        <CardHeader>
          <CardTitle className='text-2xl font-bold'>Edit Profile</CardTitle>
        </CardHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className='space-y-6'>
            {message.text && (
              <div className={`p-4 rounded-md ${message.type === "error" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
                {message.text}
              </div>
            )}

            {/* Avatar Preview */}
            <div className='flex flex-col items-center gap-4'>
              <Avatar className='w-24 h-24 border-2 border-gray-200'>
                <AvatarImage src={formValues.avatar} />
                <AvatarFallback className='text-3xl'>{formValues.username.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
            </div>

            {/* Two Column Layout for Basic Info */}
            <div className='space-y-4'>
              <h3 className='text-lg font-semibold text-gray-700 border-b pb-2'>Basic Information</h3>

              <div className='grid gap-6 md:grid-cols-2'>
                <div className='space-y-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='username' className='flex items-center gap-2'>
                      <User2 className='w-4 h-4' />
                      Username <span className='text-red-500'>*</span>
                    </Label>
                    <Input id='username' {...register("username")} onBlur={() => trigger("username")} placeholder='Your username' />
                    {errors.username && <p className='mt-1 text-sm text-red-600'>{errors.username.message}</p>}
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='bio'>Bio</Label>
                    <Textarea id='bio' {...register("bio")} placeholder='Tell us a little about yourself...' className='min-h-[100px]' />
                    {errors.bio && <p className='text-sm text-red-600'>{errors.bio.message}</p>}
                  </div>
                </div>

                <div className='space-y-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='email' className='flex items-center gap-2'>
                      <Mail className='w-4 h-4' />
                      Email <span className='text-red-500'>*</span>
                    </Label>
                    <Input id='email' type='email' {...register("email")} onBlur={() => trigger("email")} placeholder='your.email@example.com' />
                    {errors.email && <p className='text-sm text-red-600'>{errors.email.message} </p>}
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='avatar' className='flex items-center gap-2'>
                      <Link2 className='w-4 h-4' />
                      Avatar URL
                    </Label>
                    <Input id='avatar' {...register("avatar")} placeholder='https://example.com/avatar.jpg' />
                    {errors.avatar && <p className='text-sm text-red-600'>{errors.avatar.message}</p>}
                  </div>
                </div>
              </div>
            </div>

            {/* Social Links - Two Column Layout */}
            <div className='space-y-4'>
              <h3 className='text-lg font-semibold text-gray-700 border-b pb-2'>Social Links</h3>

              <div className='grid gap-6 md:grid-cols-2'>
                <div className='space-y-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='twitter' className='flex items-center gap-2'>
                      <FaTwitter className='w-4 h-4 text-blue-400' />
                      Twitter
                    </Label>
                    <Input id='twitter' {...register("socialLinks.twitter")} placeholder='https://twitter.com/username' />
                    {errors.socialLinks?.twitter && <p className='text-sm text-red-600'>{errors.socialLinks.twitter.message}</p>}
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='github' className='flex items-center gap-2'>
                      <FaGithub className='w-4 h-4' />
                      GitHub
                    </Label>
                    <Input id='github' {...register("socialLinks.github")} placeholder='https://github.com/username' />
                    {errors.socialLinks?.github && <p className='text-red-600 text-sm'>{errors.socialLinks.github.message}</p>}
                  </div>
                </div>

                <div className='space-y-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='website' className='flex items-center gap-2'>
                      <Globe className='w-4 h-4 text-blue-500' />
                      Website
                    </Label>
                    <Input id='website' {...register("socialLinks.website")} placeholder='https://example.com' />
                    {errors.socialLinks?.website && <p className='text-red-600 text-sm'>{errors.socialLinks.website.message}</p>}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>

          <CardFooter className='flex justify-end gap-4 border-t pt-6'>
            <Button variant='outline' disabled={isSubmitting} type='button' onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type='submit' disabled={isSubmitting}>
              {isSubmitting && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
