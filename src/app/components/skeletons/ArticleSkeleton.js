import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const ArticleSkeleton = () => {
  return (
    <div className='min-h-screen max-w-4xl mx-auto px-4 py-12'>
      <div className='my-5'>
        <Skeleton className='h-6 w-32' />
      </div>

      {/* Category and read time skeleton */}
      <div className='flex items-center mb-4'>
        <Skeleton className='h-6 w-24 rounded-full' />
        <span className='mx-2 text-gray-400'>•</span>
        <Skeleton className='h-6 w-20' />
      </div>

      {/* Title skeleton */}
      <Skeleton className='h-10 w-full mb-6' />
      <Skeleton className='h-8 w-3/4 mb-8' />

      {/* Author and actions skeleton */}
      <div className='flex items-center justify-between mb-8'>
        <div className='flex items-center'>
          <Skeleton className='w-10 h-10 rounded-full mr-3' />
          <div>
            <Skeleton className='h-5 w-32 mb-1' />
            <Skeleton className='h-4 w-24' />
          </div>
        </div>
        <div className='flex space-x-3'>
          <Skeleton className='w-10 h-10 rounded-md' />
          <Skeleton className='w-10 h-10 rounded-md' />
          <Skeleton className='w-10 h-10 rounded-md' />
        </div>
      </div>

      {/* Featured image skeleton */}
      <Skeleton className='w-full h-64 mb-8 rounded-xl' />

      {/* Content skeleton */}
      <div className='space-y-4'>
        <Skeleton className='h-4 w-full' />
        <Skeleton className='h-4 w-5/6' />
        <Skeleton className='h-4 w-4/6' />
        <Skeleton className='h-4 w-full' />
        <Skeleton className='h-4 w-3/4' />
        <Skeleton className='h-4 w-5/6' />
      </div>
    </div>
  );
};

export default ArticleSkeleton;
