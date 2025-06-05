"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Loader2, X, Image as ImageIcon } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FaTags } from "react-icons/fa";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { genericFetchData } from "@/lib/genericFetchData";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { adminPostSchema } from "@/zod/schemas/postSchema";

export default function CreatePost() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting, isDirty },
    watch,
    setValue,
    reset,
  } = useForm({
    resolver: zodResolver(adminPostSchema),
    defaultValues: {
      title: "",
      excerpt: "",
      content: "",
      categories: [],
      tags: [],
      status: "draft",
      featuredImage: "",
      authorId: "",
    },
  });

  const formValues = watch();
  const [tagInput, setTagInput] = useState("");
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [categoriesData, categoriesError] = await genericFetchData(`/api/categories`, "GET");
        const [usersResponse, usersError] = await genericFetchData(`/api/admin/users`, "GET");

        if (categoriesError || usersError) {
          throw new Error(categoriesError?.message || usersError?.message || "Failed to fetch data");
        }

        setCategories(Array.isArray(categoriesData) ? categoriesData : []);
        setUsers(Array.isArray(usersResponse?.users) ? usersResponse.users : []);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const [response, error] = await genericFetchData("/api/admin/posts", "POST", data);

      if (error) {
        throw new Error(error.message || "Failed to create post");
      }

      toast.success("Post created successfully!");
      if (data.status === "published") {
        router.push(`/articles/${response._id}`);
      } else {
        router.push("/admin/articles");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
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

  return (
    <div className='container mx-auto px-4 py-8 max-w-5xl mt-9 '>
      <Card>
        <CardHeader>
          <CardTitle>Create New Post</CardTitle>
          <CardDescription>Fill out the form below to create a new blog post</CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className='p-6 space-y-6'>
            {/* Title and Status */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div>
                <Label htmlFor='title' className='block text-sm font-medium mb-2'>
                  Title <span className='text-red-500'>*</span>
                </Label>
                <Input id='title' {...register("title")} onBlur={() => trigger("title")} placeholder='Your post title' />
                {errors.title && <p className='mt-1 text-sm text-red-600'>{errors.title.message}</p>}
              </div>
              <div>
                <Label htmlFor='author' className='block text-sm font-medium mb-2'>
                  Author
                </Label>
                <Controller
                  name='authorId'
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder='Select an author' />
                      </SelectTrigger>
                      <SelectContent>
                        {users.map(
                          (user) =>
                            user.role !== "admin" && (
                              <SelectItem key={user._id} value={user._id}>
                                <span className='flex items-center gap-2'>
                                  <span className='w-2 h-2 rounded-full bg-green-400'></span>
                                  {user.username || user.name || user.email}
                                </span>
                              </SelectItem>
                            )
                        )}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div>
                <Label htmlFor='status' className='block text-sm font-medium mb-2'>
                  Status
                </Label>
                <Controller
                  name='status'
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='draft'>
                          <span className='flex items-center gap-2'>
                            <span className='w-2 h-2 rounded-full bg-yellow-400'></span>
                            Draft
                          </span>
                        </SelectItem>
                        <SelectItem value='published'>
                          <span className='flex items-center gap-2'>
                            <span className='w-2 h-2 rounded-full bg-green-400'></span>
                            Published
                          </span>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>

            {/* Excerpt */}
            <div>
              <Label htmlFor='excerpt' className='block text-sm font-medium mb-2'>
                Excerpt
              </Label>
              <Textarea id='excerpt' {...register("excerpt")} rows={3} placeholder='Short summary of the post' />
              {errors.excerpt && <p className='mt-1 text-sm text-red-600'>{errors.excerpt.message}</p>}
              <p className='mt-1 text-sm text-gray-500'>A brief description that appears in post previews</p>
            </div>

            {/* Content */}
            <div>
              <Label htmlFor='content' className='block text-sm font-medium mb-2'>
                Content <span className='text-red-500'>*</span>
              </Label>
              <Textarea id='content' {...register("content")} rows={10} placeholder='Write your post content here...' className='min-h-[250px]' />
              {errors.content && <p className='mt-1 text-sm text-red-600'>{errors.content.message}</p>}
            </div>

            {/* Categories and Tags */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              {/* Categories */}
              <div>
                <Label className='block text-sm font-medium mb-2'>Categories</Label>
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
                            checked={formValues.categories.includes(category._id)}
                            onCheckedChange={(checked) => {
                              const currentCategories = formValues.categories;
                              setValue(
                                "categories",
                                checked ? [...currentCategories, category._id] : currentCategories.filter((id) => id !== category._id)
                              );
                            }}
                          />
                          <Label htmlFor={category._id} className='cursor-pointer'>
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
                <Label htmlFor='tags' className='block text-sm font-medium mb-2'>
                  Tags
                </Label>
                <div className='relative'>
                  <Input
                    type='text'
                    id='tags'
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleTagKeyDown}
                    placeholder='e.g. react, nextjs, javascript'
                  />
                  <FaTags className='absolute right-3 top-3 text-gray-400' />
                </div>
                <p className='mt-1 text-sm text-gray-500'>Type and press Enter or comma to add tags</p>

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
              <Label htmlFor='featuredImage' className='block text-sm font-medium mb-2'>
                Featured Image URL
              </Label>
              <div className='relative'>
                <Input id='featuredImage' {...register("featuredImage")} placeholder='https://example.com/image.jpg' />
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
          <div className='px-6 py-4 flex justify-end gap-4'>
            <Button type='button' variant='outline' onClick={() => router.back()} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type='submit' disabled={isSubmitting || !isDirty}>
              {isSubmitting && <Loader2 className='animate-spin w-4 h-4 mr-2' />}
              {isSubmitting ? "Creating..." : "Publish Post"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
