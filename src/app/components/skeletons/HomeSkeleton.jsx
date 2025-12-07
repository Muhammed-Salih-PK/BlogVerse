"use client";

import { BookOpen } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function HomeSkeleton() {
  return (
    <div className='min-h-screen bg-gradient-to-b from-background to-muted/20'>
      {/* Hero Gradient Bar */}
      <div className='border-b bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5'></div>

      {/* Main Content */}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='flex flex-col lg:flex-row gap-8'>
          {/* Main Content Area */}
          <div className='lg:w-2/3'>
            {/* Featured Articles Skeleton */}
            <div className='mb-12'>
              <div className='flex items-center justify-between mb-6'>
                <div>
                  <Skeleton className='h-8 w-48 mb-2' />
                  <Skeleton className='h-4 w-40' />
                </div>
                <Skeleton className='h-10 w-24' />
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                {[1, 2].map((i) => (
                  <div key={i} className='group'>
                    <div className='h-full overflow-hidden border rounded-lg'>
                      {/* Featured Image Skeleton */}
                      <div className='relative h-48 overflow-hidden bg-gradient-to-br from-gray-200 to-gray-100 dark:from-gray-800 dark:to-gray-900'>
                        <div className='absolute inset-0 flex items-center justify-center'>
                          <BookOpen className='w-16 h-16 text-gray-300 dark:text-gray-700' />
                        </div>
                        <div className='absolute top-4 left-4'>
                          <Skeleton className='h-6 w-24' />
                        </div>
                        <div className='absolute top-4 right-4'>
                          <Skeleton className='h-6 w-16' />
                        </div>
                      </div>

                      <div className='p-6'>
                        <div className='flex items-center gap-2 mb-3'>
                          <Skeleton className='h-4 w-20' />
                          <Skeleton className='w-1 h-1 rounded-full' />
                          <Skeleton className='h-4 w-16' />
                        </div>
                        <Skeleton className='h-6 w-full mb-2' />
                        <Skeleton className='h-6 w-3/4 mb-4' />
                        
                        <div className='space-y-2 mb-4'>
                          <Skeleton className='h-4 w-full' />
                          <Skeleton className='h-4 w-2/3' />
                        </div>

                        <div className='flex items-center justify-between'>
                          <div className='flex items-center gap-2'>
                            <Skeleton className='w-8 h-8 rounded-full' />
                            <Skeleton className='h-4 w-32' />
                          </div>
                          <div className='flex items-center gap-3'>
                            <Skeleton className='h-4 w-10' />
                            <Skeleton className='h-4 w-8' />
                          </div>
                        </div>

                        <div className='mt-6'>
                          <Skeleton className='h-10 w-full' />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats Bar Skeleton */}
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4'>
              <div className='flex flex-wrap items-center justify-between gap-4'>
                <div className='flex items-center gap-6'>
                  {[1, 2, 3].map((i) => (
                    <div key={i} className='flex items-center gap-2'>
                      <Skeleton className='w-5 h-5' />
                      <Skeleton className='h-6 w-24' />
                    </div>
                  ))}
                </div>

                <div className='flex items-center gap-3'>
                  <Skeleton className='h-10 w-32' />
                  <Skeleton className='h-10 w-40' />
                </div>
              </div>
            </div>

            {/* Search and Filters Skeleton */}
            <div className='mb-8'>
              <div className='border rounded-lg p-6'>
                <div className='flex flex-col lg:flex-row gap-4 items-center'>
                  {/* Search Skeleton */}
                  <div className='flex-1 w-full'>
                    <Skeleton className='h-12 w-full' />
                  </div>

                  {/* Quick Filters Skeleton */}
                  <div className='flex items-center gap-3'>
                    <Skeleton className='h-10 w-32' />
                    <div className='flex border rounded-lg overflow-hidden'>
                      <Skeleton className='w-10 h-10' />
                      <Skeleton className='w-10 h-10' />
                    </div>
                  </div>
                </div>

                {/* Category Filters Skeleton */}
                <div className='mt-6'>
                  <div className='flex flex-wrap gap-2'>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                      <Skeleton key={i} className='h-10 w-24' />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Results Header Skeleton */}
            <div className='mb-6 flex items-center justify-between'>
              <div>
                <Skeleton className='h-8 w-64 mb-2' />
                <Skeleton className='h-4 w-48' />
              </div>
              <Skeleton className='h-10 w-32' />
            </div>

            {/* Articles Grid Skeleton */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className='h-full overflow-hidden border rounded-lg'>
                  {/* Image Skeleton */}
                  <div className='relative h-48 overflow-hidden bg-gradient-to-br from-gray-200 to-gray-100 dark:from-gray-800 dark:to-gray-900'>
                    <div className='absolute inset-0 flex items-center justify-center'>
                      <BookOpen className='w-16 h-16 text-gray-300 dark:text-gray-700' />
                    </div>
                  </div>

                  <div className='p-6'>
                    <div className='flex items-center gap-2 mb-3'>
                      <Skeleton className='h-5 w-16' />
                      <Skeleton className='w-1 h-1 rounded-full' />
                      <Skeleton className='h-4 w-20' />
                    </div>
                    <Skeleton className='h-6 w-full mb-2' />
                    <Skeleton className='h-6 w-3/4 mb-4' />
                    
                    <div className='space-y-2 mb-4'>
                      <Skeleton className='h-4 w-full' />
                      <Skeleton className='h-4 w-2/3' />
                    </div>

                    <div className='flex items-center justify-between'>
                      <div className='flex items-center gap-2'>
                        <Skeleton className='w-6 h-6 rounded-full' />
                        <Skeleton className='h-4 w-20' />
                      </div>
                      <div className='flex items-center gap-3'>
                        <Skeleton className='h-4 w-10' />
                        <Skeleton className='h-4 w-8' />
                      </div>
                    </div>

                    <div className='mt-4 flex items-center justify-between'>
                      <div className='flex items-center gap-2'>
                        <Skeleton className='h-4 w-10' />
                        <Skeleton className='h-4 w-8' />
                      </div>
                      <Skeleton className='h-8 w-20' />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Skeleton */}
            <div className='flex justify-center mt-12'>
              <div className='flex items-center gap-2'>
                <Skeleton className='h-10 w-24' />
                <div className='flex items-center gap-1'>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Skeleton key={i} className='w-10 h-10' />
                  ))}
                </div>
                <Skeleton className='h-10 w-20' />
              </div>
            </div>
          </div>

          {/* Sidebar Skeleton */}
          <div className='lg:w-1/3'>
            <div className='space-y-6 sticky top-17'>
              {/* About Card Skeleton */}
              <div className='border rounded-lg p-6'>
                <div className='flex items-center gap-2 mb-4'>
                  <Skeleton className='w-5 h-5' />
                  <Skeleton className='h-6 w-40' />
                </div>
                <div className='space-y-3 mb-4'>
                  <Skeleton className='h-4 w-full' />
                  <Skeleton className='h-4 w-5/6' />
                  <Skeleton className='h-4 w-4/5' />
                </div>
                <div className='space-y-3'>
                  {[1, 2, 3].map((i) => (
                    <div key={i} className='flex items-center gap-2'>
                      <Skeleton className='w-4 h-4' />
                      <Skeleton className='h-4 w-32' />
                    </div>
                  ))}
                </div>
                <div className='mt-6'>
                  <Skeleton className='h-10 w-full' />
                </div>
              </div>

              {/* Trending Tags Skeleton */}
              <div className='border rounded-lg p-6'>
                <div className='flex items-center gap-2 mb-4'>
                  <Skeleton className='w-5 h-5' />
                  <Skeleton className='h-6 w-40' />
                </div>
                <div className='flex flex-wrap gap-2'>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map((i) => (
                    <Skeleton key={i} className='h-8 w-16' />
                  ))}
                </div>
              </div>

              {/* Newsletter Skeleton */}
              <div className='border rounded-lg p-6 bg-gradient-to-br from-primary/10 via-primary/5 to-primary/10'>
                <div className='text-center mb-4'>
                  <Skeleton className='w-12 h-12 rounded-full mx-auto mb-3' />
                  <Skeleton className='h-6 w-32 mx-auto mb-2' />
                  <Skeleton className='h-4 w-48 mx-auto' />
                </div>
                <div className='space-y-3'>
                  <Skeleton className='h-10 w-full' />
                  <Skeleton className='h-10 w-full' />
                </div>
                <Skeleton className='h-3 w-40 mx-auto mt-3' />
              </div>

              {/* Quick Stats Skeleton */}
              <div className='border rounded-lg p-6'>
                <div className='flex items-center gap-2 mb-4'>
                  <Skeleton className='w-5 h-5' />
                  <Skeleton className='h-6 w-40' />
                </div>
                <div className='space-y-4'>
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className='flex items-center justify-between'>
                      <Skeleton className='h-4 w-24' />
                      <Skeleton className='h-5 w-12' />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}