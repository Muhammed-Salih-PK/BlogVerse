"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, X, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import EditPostSkeleton from "@/app/components/skeletons/EditPostSkeleton";
import { genericFetchData } from "@/lib/genericFetchData";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { categorySchema } from "@/zod/schemas/categorySchema";

export default function Page() {
  const { id } = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      description: "",
      featuredImage: "",
    },
  });

  const formValues = watch();

  useEffect(() => {
    if (!id) return;

    async function fetchCategories() {
      setLoading(true);

      const [data, error] = await genericFetchData(`/api/admin/categories/${id}`, "GET");

      if (error) {
        toast.error("Failed to load post data");
      } else {
        reset({
          name: data.name || "",
          description: data.description || "",
          featuredImage: data.featuredImage || "",
        });
      }
      setLoading(false);
    }

    fetchCategories();
  }, [id]);

  const onSubmit = async (body) => {
    const [data, error] = await genericFetchData(`/api/admin/categories/${id}`, "PUT", body);

    if (error) {
      toast.error("Failed to update post");
    } else {
      toast.success("Post updated successfully!");
      router.back();
    }
  };

  if (loading) return <EditPostSkeleton />;

  return (
    <div className='container mx-auto px-4 py-8 max-w-4xl'>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden'
      >
        <div className='flex items-center justify-between my-5 pl-5'>
          <h1 className='text-3xl font-bold text-gray-900 dark:text-white'>Edit Category</h1>
        </div>
        {/* Form Content */}
        <div className='p-6 space-y-6'>
          {/* Title and Status */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div>
              <Label htmlFor='name' className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                Name <span className='text-red-500'>*</span>
              </Label>
              <Input
                id='name'
                {...register("name")}
                onBlur={() => trigger("name")}
                placeholder='Edit Category name'
                className='dark:bg-gray-700 dark:border-gray-600 dark:text-white'
              />
              {errors.name && <p className='mt-1 text-sm text-red-600'>{errors.name.message}</p>}
            </div>
          </div>

          {/* Description */}
          <div>
            <Label htmlFor='description' className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
              Description
            </Label>
            <Textarea
              id='description'
              {...register("description")}
              placeholder='Short description of the Category'
              className='dark:bg-gray-700 dark:border-gray-600 dark:text-white'
            />
            {errors.description && <p className='mt-1 text-sm text-red-600'>{errors.description.message}</p>}
            <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>A brief description that appears in post previews</p>
          </div>

          {/* Featured Image */}
          <div>
            <Label htmlFor='featuredImage' className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
              Featured Image URL
            </Label>
            <div className='relative'>
              <Input type='text' id='featuredImage' {...register("featuredImage")} placeholder='https://example.com/image.jpg' />
              <ImageIcon className='absolute right-3 top-3 text-gray-400 dark:text-gray-500' size={18} />
            </div>
            {formValues.featuredImage && (
              <div className='mt-3'>
                <div className='text-sm text-gray-500 dark:text-gray-400 mb-1'>Image Preview:</div>
                <img
                  src={formValues?.featuredImage}
                  alt='Featured preview'
                  className='max-w-full h-auto max-h-40 rounded-lg border border-gray-200 dark:border-gray-600'
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
