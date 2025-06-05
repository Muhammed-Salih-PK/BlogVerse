import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const TagSkeleton = () => {
  return (
    <main className='max-w-6xl mx-auto px-4 py-12 mt-6'>
      {/* Tag Header Skeleton */}
      <header className='mb-5 text-center'>
        <div className='inline-flex items-center justify-center w-full mb-2'>
          <Skeleton className='h-10 w-48 rounded-full' />
        </div>
        <Skeleton className='h-6 w-64 mx-auto' />
      </header>

      {/* Articles Grid Skeleton */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
        {[...Array(6)].map((_, i) => (
          <article
            key={i}
            className='bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden'
          >
            {/* Image with category skeleton */}
            <div className='relative'>
              <Skeleton className='h-48 w-full' />
              <Skeleton className='absolute bottom-4 left-4 h-6 w-20 rounded-full' />
            </div>

            <div className='p-6'>
              {/* Read time skeleton */}
              <Skeleton className='h-4 w-20 mb-3' />

              {/* Title skeleton */}
              <Skeleton className='h-6 w-full mb-2' />
              <Skeleton className='h-5 w-5/6 mb-2' />

              {/* Excerpt skeleton */}
              <div className='space-y-2 mb-4'>
                <Skeleton className='h-4 w-full' />
                <Skeleton className='h-4 w-4/5' />
                <Skeleton className='h-4 w-3/4' />
              </div>

              {/* Author and read more skeleton */}
              <div className='flex justify-between items-center'>
                <div className='flex items-center'>
                  <Skeleton className='w-8 h-8 rounded-full mr-2' />
                  <Skeleton className='h-4 w-20' />
                </div>
                <Skeleton className='h-4 w-10' />
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Back link skeleton */}
      <div className='mt-8 text-center'>
        <Skeleton className='h-5 w-40 mx-auto' />
      </div>
    </main>
  );
};

export default TagSkeleton;
