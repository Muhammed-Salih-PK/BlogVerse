"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Loader2, X, Image as ImageIcon, Watch } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FaBan, FaCheckCircle, FaTags } from "react-icons/fa";
import { genericFetchData } from "@/lib/genericFetchData";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { motion } from "framer-motion";
import { zodResolver } from "@hookform/resolvers/zod";
import { postSchema } from "@/zod/schemas/postSchema";

export default function CreatePost() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
    watch,
    trigger,
  } = useForm({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: "",
      excerpt: "",
      content: "",
      status: "draft",
      categories: [],
      tags: [],
      featuredImage: "",
    },
  });
  const formValues = watch();
  const [tagInput, setTagInput] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const [data, error] = await genericFetchData(`/api/categories`, "GET");

      if (error) {
        console.error("Failed to fetch categories:", error);
        setMessage({ text: data?.message || data?.error || error.message || "Network error. Please try again.", type: "error" });
      } else {
        setCategories(data);
      }
    };
    fetchCategories();
  }, []);

  const onSubmit = async (body) => {
    setMessage({ text: "", type: "" });
    const [data, error] = await genericFetchData("/api/posts", "POST", body);

    if (error) {
      console.error("Error creating post:", error);
      setMessage({ text: data?.message || data?.error || error.message || "Network error. Please try again.", type: "error" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
      setMessage({ text: "Post created successfully!", type: "success" });
      setTimeout(() => router.back(), 1500);
    }
  };

  const handleTagKeyDown = (e) => {
    if ((e.key === "Enter" || e.key === ",") && tagInput.trim() !== "") {
      e.preventDefault();
      const newTag = tagInput.trim().replace(/,+$/, "");
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

  return (
    <div className='container mx-auto px-4 py-8 max-w-5xl mt-9'>
      <Card>
        <CardHeader>
          <div className='mb-8'>
            <h1 className='text-3xl font-bold text-gray-900 mb-2'>Create New Post</h1>
            <p className='text-gray-600'>Fill out the form below to create a new blog post</p>
          </div>
        </CardHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent>
            {message.text && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mb-6 p-4  border ${
                  message.type === "error"
                    ? "border-red-500 dark:border-red-800 bg-red-50 dark:bg-red-900/20"
                    : "border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20"
                }  rounded-lg flex items-start gap-3`}
              >
                {message.type === "error" ? (
                  <FaBan className='text-red-500 dark:text-red-400 mt-0.5 flex-shrink-0' />
                ) : (
                  <FaCheckCircle className='text-emerald-500 dark:text-emerald-400 mt-0.5 flex-shrink-0' />
                )}
                <p className={message.type === "error" ? "text-red-700 dark:text-red-300" : "text-emerald-700 dark:text-emerald-300"}>
                  {message.text}
                </p>
              </motion.div>
            )}

            <div className=' px-6 py-4 border-b border-gray-200'>
              <h2 className='font-semibold text-gray-800'>Post Details</h2>
            </div>

            {/* Form Content */}
            <div className='p-6 space-y-6'>
              {/* Title and Status */}
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div>
                  <Label htmlFor='title' className='block text-sm font-medium text-gray-700 mb-2'>
                    Title{" "}
                    <span className='text-red-500' aria-required='true'>
                      *
                    </span>
                  </Label>
                  <input
                    type='text'
                    id='title'
                    className='w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition'
                    {...register("title")}
                    onBlur={() => trigger("title")}
                    error={errors.title?.message}
                    placeholder='Your post title'
                  />
                  {errors.title && <p className='mt-1 text-sm text-red-600'>{errors.title.message}</p>}
                </div>

                <div>
                  <Label htmlFor='status' className='block text-sm font-medium text-gray-700 mb-2'>
                    Status
                  </Label>
                  <Select {...register("status")} value={formValues.status} onValueChange={(value) => setValue("status", value)}>
                    <SelectTrigger className='w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition'>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='draft' className='hover:bg-gray-50'>
                        <span className='flex items-center gap-2'>
                          <span className='w-2 h-2 rounded-full bg-yellow-400'></span>
                          Draft
                        </span>
                      </SelectItem>
                      <SelectItem value='published' className='hover:bg-gray-50'>
                        <span className='flex items-center gap-2'>
                          <span className='w-2 h-2 rounded-full bg-green-400'></span>
                          Published
                        </span>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Excerpt */}
              <div>
                <Label htmlFor='excerpt' className='block text-sm font-medium text-gray-700 mb-2'>
                  Excerpt
                </Label>
                <textarea
                  id='excerpt'
                  className='w-full px-4 py-2.5 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition'
                  {...register("excerpt")}
                  rows={3}
                  onBlur={() => trigger("excerpt")}
                  placeholder='Short summary of the post'
                />
                {errors.excerpt && <p className='mt-1 text-sm text-red-600'>{errors.excerpt.message}</p>}
                <p className='mt-1 text-sm text-gray-500'>A brief description that appears in post previews</p>
              </div>

              {/* Content */}
              <div>
                <Label htmlFor='content' className='block text-sm font-medium text-gray-700 mb-2'>
                  Content <span className='text-red-500'>*</span>
                </Label>
                <textarea
                  id='content'
                  className='w-full px-4 py-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition min-h-[250px]'
                  {...register("content")}
                  rows={10}
                  placeholder='Write your post content here...'
                  error={errors.content?.message}
                />
                {errors.content && <p className='mt-1 text-sm text-red-600'>{errors.content.message}</p>}
              </div>

              {/* Categories and Tags */}
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                {/* Categories */}
                <div>
                  <Label className='block text-sm font-medium text-gray-700 mb-2'>Categories</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant='outline' className='w-full justify-between text-left'>
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
                        >
                          <polyline points='6 9 12 15 18 9'></polyline>
                        </svg>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className='w-[320px] max-h-64 overflow-auto p-4 shadow-lg rounded-xl'>
                      <div className='space-y-3'>
                        {categories.map((category) => (
                          <div key={category._id} className='flex items-center gap-3'>
                            <Checkbox
                              id={category._id}
                              checked={formValues.categories.includes(category._id.toString())}
                              onCheckedChange={(checked) => handleCategoryChange(category._id, checked)}
                            />
                            <Label htmlFor={category._id} className='cursor-pointer text-gray-700'>
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
                  <Label htmlFor='tags' className='block text-sm font-medium text-gray-700 mb-2'>
                    Tags
                  </Label>
                  <div className='relative'>
                    <input
                      type='text'
                      id='tags'
                      name='tags'
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleTagKeyDown}
                      placeholder='e.g. react, nextjs, javascript'
                      className='w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition pr-10'
                    />
                    <FaTags className='absolute right-3 top-3 text-gray-400' />
                  </div>
                  <p className='mt-1 text-sm text-gray-500'>Type and press Enter or comma to add tags</p>

                  {/* Tags Pills */}
                  {formValues.tags.length > 0 && (
                    <div className='flex flex-wrap gap-2 mt-3'>
                      {formValues.tags.map((tag) => (
                        <span key={tag} className='inline-flex items-center bg-blue-50 text-blue-700 rounded-full px-3 py-1 text-sm gap-1.5'>
                          <FaTags size={12} className='text-blue-400' />
                          {tag}
                          <button
                            type='button'
                            onClick={() => removeTag(tag)}
                            className='ml-0.5 text-blue-400 hover:text-blue-600 transition'
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
                <Label htmlFor='featuredImage' className='block text-sm font-medium text-gray-700 mb-2'>
                  Featured Image URL
                </Label>
                <div className='relative'>
                  <input
                    type='text'
                    className='w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition pr-10'
                    id='featuredImage'
                    {...register("featuredImage")}
                    placeholder='https://example.com/image.jpg'
                  />
                  <ImageIcon className='absolute right-3 top-3 text-gray-400' size={18} />
                </div>
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
          </CardContent>
          <CardFooter className='flex justify-end  '>
            {/* Form Footer */}
            <div className=' '>
              <Button type='button' variant='outline' onClick={() => router.back()} className='mr-3 text-gray-700 hover:bg-gray-100'>
                Cancel
              </Button>
              <Button
                type='submit'
                disabled={isSubmitting}
                className='bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed px-6 py-2.5 rounded-lg text-white font-medium shadow-sm'
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className='animate-spin w-4 h-4 mr-2' />
                    Creating...
                  </>
                ) : (
                  "Publish Post"
                )}
              </Button>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
