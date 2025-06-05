import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const ProfileSkeleton = () => {
  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
      {/* Profile Header Skeleton */}
      <div className='bg-gradient-to-br from-indigo-900 to-purple-900 py-16 px-4 text-white mt-5'>
        <div className='max-w-4xl mx-auto'>
          <div className='flex flex-col md:flex-row items-center gap-8'>
            {/* Avatar Skeleton */}
            <Skeleton className='rounded-full w-32 h-32 border-4 border-white shadow-lg' />

            <div className='flex-1 space-y-4'>
              {/* Username and Bio Skeleton */}
              <div className='flex justify-between'>
                <div className='space-y-2'>
                  <Skeleton className='h-8 w-48' />
                  <Skeleton className='h-4 w-64' />
                </div>
                <div className='flex gap-2'>
                  <Skeleton className='h-10 w-24' />
                  <Skeleton className='h-10 w-20' />
                </div>
              </div>

              {/* Create Post Button Skeleton */}
              <Skeleton className='h-10 w-32' />

              {/* Social Links Skeleton */}
              <div className='flex flex-wrap gap-4 mt-6'>
                <Skeleton className='h-4 w-24' />
                <Skeleton className='h-4 w-20' />
                <Skeleton className='h-4 w-20' />
                <Skeleton className='h-4 w-20' />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className='max-w-4xl mx-auto py-8 px-4'>
        <div className='bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden'>
          {/* Stats Bar Skeleton */}
          <div className='grid grid-cols-3 divide-x divide-gray-200 dark:divide-gray-700 border-b border-gray-200 dark:border-gray-700'>
            {[...Array(3)].map((_, i) => (
              <div key={i} className='py-4 text-center'>
                <Skeleton className='h-8 w-16 mx-auto mb-2' />
                <Skeleton className='h-4 w-20 mx-auto' />
              </div>
            ))}
          </div>

          {/* Posts Section Skeleton */}
          <div className='p-6'>
            <Skeleton className='h-8 w-48 mb-6' />

            {/* Posts List Skeleton */}
            <div className='space-y-6'>
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className='border-b border-gray-200 dark:border-gray-700 pb-6 last:border-0 space-y-4'
                >
                  <Skeleton className='h-6 w-3/4' />
                  <Skeleton className='h-4 w-full' />
                  <Skeleton className='h-4 w-5/6' />
                  <Skeleton className='h-4 w-1/2' />

                  {/* Post Meta Skeleton */}
                  <div className='flex justify-between'>
                    <Skeleton className='h-4 w-16' />
                    <div className='flex gap-4'>
                      <Skeleton className='h-4 w-24' />
                      <Skeleton className='h-4 w-20' />
                      <Skeleton className='h-4 w-16' />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSkeleton;
