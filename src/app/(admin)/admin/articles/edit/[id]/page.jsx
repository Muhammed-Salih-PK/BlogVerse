"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FaTags } from "react-icons/fa";
import { Loader2, X, ArrowLeft, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import EditPostSkeleton from "@/app/components/skeletons/EditPostSkeleton";
import { genericFetchData } from "@/lib/genericFetchData";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { postSchema } from "@/zod/schemas/postSchema";

export default function Page() {
  const { id } = useParams();
  const router = useRouter();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  const {
    register,
    setValue,
    handleSubmit,
    watch,
    trigger,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: "",
      excerpt: "",
      content: "",
      categories: [],
      tags: [],
      status: "draft",
      featuredImage: "",
    },
  });
  const formValues = watch();

  const [categories, setCategories] = useState([]);
  const [tagInput, setTagInput] = useState("");

  // Fetch post data on mount
  useEffect(() => {
    if (!id) return;

    async function fetchPost() {
      setLoading(true);

      const [data, error] = await genericFetchData(`/api/admin/posts/${id}`, "GET");

      if (error) {
        toast.error(error.message || "Failed to load post data");
      } else {
        setPost(data);
        reset({
          title: data.title || "",
          excerpt: data.excerpt || "",
          content: data.content || "",
          categories: Array.isArray(data.categories) ? data.categories.map((cat) => cat._id?.toString()) : [],
          tags: Array.isArray(data.tags) ? data.tags : [],
          status: data.status || "draft",
          featuredImage: data.featuredImage || "",
        });
      }
      setLoading(false);
    }

    fetchPost();
  }, [id, reset]);

  // Fetch all categories
  useEffect(() => {
    const fetchCategories = async () => {
      const [data, error] = await genericFetchData(`/api/categories`, "GET");
      if (error) {
        toast.error(error.message || "Failed to load categories");
      } else {
        setCategories(data);
      }
    };
    fetchCategories();
  }, []);

  const onSubmit = async (body) => {
    const [data, error] = await genericFetchData(`/api/admin/posts/${id}`, "PUT", body);

    if (error) {
      toast.error(error.message || "Failed to update post");
    } else {
      toast.success("Post updated successfully!");
      router.back();
    }
  };

  const handleTagKeyDown = (e) => {
    if ((e.key === "Enter" || e.key === ",") && tagInput.trim() !== "") {
      e.preventDefault();
      const newTag = tagInput.trim();
      if (!formValues.tags.includes(newTag)) {
        setValue("tags", [...formValues.tags, newTag]);
      }
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove) => {
    setValue(
      "tags",
      formValues.tags.filter((tag) => tag !== tagToRemove)
    );
  };

  const handleCategoryChange = (categoryId, checked) => {
    const currentCategories = formValues.categories;
    setValue("categories", checked ? [...currentCategories, categoryId] : currentCategories.filter((id) => id !== categoryId));
  };

  if (loading && !post) {
    return <EditPostSkeleton />;
  }

  if (!post) {
    return (
      <div className='container mx-auto px-4 py-10 max-w-4xl mt-9'>
        <div className='bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md text-center border dark:border-gray-700'>
          <h2 className='text-2xl font-bold mb-4 dark:text-white'>Post Not Found</h2>
          <p className='mb-6 dark:text-gray-300'>The post you're trying to edit doesn't exist or may have been deleted.</p>
          <Button onClick={() => router.back()}>Back to Profile</Button>
        </div>
      </div>
    );
  }

  return (
    <div className='container mx-auto px-4 py-8 max-w-4xl'>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden'
      >
        <div className='flex items-center justify-between my-5 pl-5'>
          <h1 className='text-3xl font-bold text-gray-900 dark:text-white'>Edit Post</h1>
        </div>

        {/* Form Content */}
        <div className='p-6 space-y-6'>
          {/* Title and Status */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div>
              <Label htmlFor='title' className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                Title <span className='text-red-500'>*</span>
              </Label>
              <Input
                id='title'
                {...register("title")}
                onBlur={() => trigger("title")}
                placeholder='Your post title'
                className='dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400'
              />
              {errors.title && <p className='mt-1 text-sm text-red-600'>{errors.title.message}</p>}
            </div>

            <div>
              <Label htmlFor='status' className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                Status
              </Label>
              <Select value={formValues.status} onValueChange={(value) => setValue("status", value)}>
                <SelectTrigger className='dark:bg-gray-700 dark:border-gray-600 dark:text-white'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className='dark:bg-gray-700 dark:border-gray-600'>
                  <SelectItem value='draft' className='dark:hover:bg-gray-600 dark:focus:bg-gray-600'>
                    <span className='flex items-center gap-2'>
                      <span className='w-2 h-2 rounded-full bg-yellow-400'></span>
                      <span className='dark:text-white'>Draft</span>
                    </span>
                  </SelectItem>
                  <SelectItem value='published' className='dark:hover:bg-gray-600 dark:focus:bg-gray-600'>
                    <span className='flex items-center gap-2'>
                      <span className='w-2 h-2 rounded-full bg-green-400'></span>
                      <span className='dark:text-white'>Published</span>
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Excerpt */}
          <div>
            <Label htmlFor='excerpt' className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
              Excerpt
            </Label>
            <Textarea id='excerpt' {...register("excerpt")} onBlur={() => trigger("excerpt")} rows={3} placeholder='Short summary of the post' />
            <p className='mt-1 text-sm text-gray-500'>A brief description that appears in post previews</p>
            {errors.excerpt && <p className='mt-1 text-sm text-red-600'>{errors.excerpt.message}</p>}
          </div>

          {/* Content */}
          <div>
            <Label htmlFor='content' className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
              Content <span className='text-red-500'>*</span>
            </Label>
            <Textarea id='content' {...register("content")} onBlur={() => trigger("content")} rows={10} placeholder='Write your post content here...' className='min-h-[250px]' />
            {errors.content && <p className='mt-1 text-sm text-red-600'>{errors.content.message}</p>}
          </div>

          {/* Categories and Tags */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {/* Categories */}
            <div>
              <Label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>Categories</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant='outline' className='w-full justify-between dark:bg-gray-700 dark:border-gray-600 dark:text-white'>
                    <span>
                      {formValues.categories.length > 0
                        ? categories
                            .filter((cat) => formValues.categories.includes(cat._id))
                            .map((cat) => cat.name)
                            .join(", ")
                        : "Select Categories"}
                    </span>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      width='16'
                      height='16'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='currentColor'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      className='dark:text-gray-400'
                    >
                      <polyline points='6 9 12 15 18 9'></polyline>
                    </svg>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className='w-[320px] max-h-64 overflow-auto p-4 shadow-lg rounded-xl dark:bg-gray-700 dark:border-gray-600'>
                  <div className='space-y-3'>
                    {categories.map((category) => (
                      <div key={category._id} className='flex items-center gap-3'>
                        <Checkbox
                          id={category._id}
                          checked={formValues.categories.includes(category._id.toString())}
                          onCheckedChange={(checked) => handleCategoryChange(category._id, checked)}
                          className='dark:border-gray-500'
                        />
                        <Label htmlFor={category._id} className='cursor-pointer text-gray-700 dark:text-gray-300'>
                          {category.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            {/* Tags */}
            <div>
              <Label htmlFor='tags' className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                Tags
              </Label>
              <div className='relative'>
                <Input
                  type='text'
                  id='tags'
                  name='tags'
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                  placeholder='e.g. react, nextjs, javascript'
                  className='dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400'
                />
                <FaTags className='absolute right-3 top-3 text-gray-400 dark:text-gray-500' />
              </div>
              <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>Type and press Enter or comma to add tags</p>

              {/* Tags Pills */}
              {formValues.tags.length > 0 && (
                <div className='flex flex-wrap gap-2 mt-3'>
                  {formValues.tags.map((tag) => (
                    <span
                      key={tag}
                      className='inline-flex items-center bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full px-3 py-1 text-sm gap-1.5'
                    >
                      <FaTags size={12} className='text-blue-400 dark:text-blue-300' />
                      {tag}
                      <button
                        type='button'
                        onClick={() => removeTag(tag)}
                        className='ml-0.5 text-blue-400 hover:text-blue-600 dark:hover:text-blue-200 transition'
                        aria-label={`Remove tag ${tag}`}
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Featured Image */}
          <div>
            <Label htmlFor='featuredImage' className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
              Featured Image URL
            </Label>
            <div className='relative'>
              <Input type='text' id='featuredImage' {...register("featuredImage")} placeholder='https://example.com/image.jpg' />
              <ImageIcon className='absolute right-3 top-3 text-gray-400' size={18} />
            </div>
            {errors.featuredImage && <p className='mt-1 text-sm text-red-600'>{errors.featuredImage.message}</p>}
            {formValues.featuredImage && (
              <div className='mt-3'>
                <div className='text-sm text-gray-500 mb-1'>Image Preview:</div>
                <img
                  src={formValues.featuredImage}
                  alt='Featured preview'
                  className='max-w-full h-auto max-h-40 rounded-lg border border-gray-200'
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Form Footer */}
        <div className='bg-gray-50 dark:bg-gray-700 px-6 py-4 border-t border-gray-200 dark:border-gray-600 flex justify-end gap-4'>
          <Button
            variant='outline'
            type='button'
            disabled={isSubmitting}
            onClick={() => router.back()}
            className='dark:border-gray-600 dark:text-white dark:hover:bg-gray-600'
          >
            Cancel
          </Button>
          <Button type='submit' disabled={isSubmitting}>
            {isSubmitting && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  );
}
