"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2, X, Image as ImageIcon } from "lucide-react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { genericFetchData } from "@/lib/genericFetchData";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { categorySchema } from "@/zod/schemas/categorySchema";

export default function CreateCategory() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      description: "",
      featuredImage: "",
    },
  });

  const formValues = watch();

  const onSubmit = async (body) => {
    const [data, error] = await genericFetchData("/api/admin/categories", "POST", body);

    if (error) {
      console.error("Error creating category:", error);

      toast.error(error.message || "Failed to create category");
    } else {
      toast.success("category created successfully!");
      router.back();
    }
  };

  return (
    <div className='container mx-auto px-4 py-8 max-w-5xl mt-9'>
      <Card>
        <CardHeader>
          <CardTitle>Create New Category</CardTitle>
          <CardDescription>Fill out the form below to create a new category</CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Form Content */}
          <div className='p-6 space-y-6'>
            {/* Title and Status */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div>
                <Label htmlFor='title' className='block text-sm font-medium dark:text-gray-50 text-gray-700 mb-2'>
                  Title <span className='text-red-500'>*</span>
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

            {/* Excerpt */}
            <div>
              <Label htmlFor='description' className='block text-sm font-medium dark:text-gray-50 text-gray-700 mb-2'>
                description
              </Label>
              <Textarea
                id='description'
                {...register("description")}
                placeholder='Short description of the Category'
                className='dark:bg-gray-700 dark:border-gray-600 dark:text-white'
              />
              <p className='mt-1 text-sm text-gray-500'>A brief description that appears in post previews</p>
              {errors.description && <p className='mt-1 text-sm text-red-600'>{errors.description.message}</p>}
            </div>

            {/* Featured Image */}
            <div>
              <Label htmlFor='featuredImage' className='block text-sm font-medium text-gray-700 dark:text-gray-50 mb-2'>
                Featured Image URL
              </Label>
              <div className='relative'>
                <Input type='text' id='featuredImage' {...register("featuredImage")} placeholder='https://example.com/image.jpg' />
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

          {/* Form Footer */}
          <div className=' px-6 py-4  flex justify-end'>
            <Button type='button' variant='ghost' onClick={() => router.back()}>
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
                "Publish description"
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
