"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ArticlesSkeleton() {
  return (
    <div className='min-h-screen bg-gradient-to-b from-background via-background to-muted/20'>
      {/* Hero Header Skeleton */}
      <div className='relative overflow-hidden border-b bg-gradient-to-br from-background via-background to-primary/5'>
        <div className='absolute top-1/4 -left-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl' />
        <div className='absolute bottom-1/4 -right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl' />

        <div className='relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-8'>
          {/* Header Content */}
          <div className='text-center max-w-4xl mx-auto mb-12'>
            <Skeleton className='h-6 w-32 mx-auto mb-6' />
            <Skeleton className='h-16 w-full max-w-3xl mx-auto mb-4' />
            <Skeleton className='h-6 w-full max-w-2xl mx-auto mb-10' />
            
            <div className='flex flex-col sm:flex-row gap-4 justify-center'>
              <Skeleton className='h-12 w-40' />
              <Skeleton className='h-12 w-40' />
            </div>
          </div>

          {/* Stats Cards */}
          <div className='grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5'>
            {[...Array(4)].map((_, i) => (
              <Card key={i} className='border bg-gradient-to-br from-muted/10 to-muted/5'>
                <CardContent className='p-4'>
                  <div className='flex items-start justify-between mb-2'>
                    <Skeleton className='w-10 h-10 rounded-xl' />
                    <Skeleton className='w-12 h-5' />
                  </div>
                  <Skeleton className='h-8 w-16 mb-1' />
                  <Skeleton className='h-4 w-20' />
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Search & Filters */}
          <Card className='border bg-background/50'>
            <CardContent className='p-6'>
              {/* Main Search */}
              <div className='relative mb-6'>
                <Skeleton className='h-14 w-full rounded-xl' />
              </div>

              {/* Quick Actions */}
              <div className='flex flex-wrap items-center justify-between gap-4 mb-4'>
                <div className='flex flex-wrap gap-2'>
                  {[...Array(4)].map((_, i) => (
                    <Skeleton key={i} className='h-8 w-20 rounded-full' />
                  ))}
                </div>
                <div className='flex items-center gap-3'>
                  <div className='hidden sm:flex items-center gap-2'>
                    <Skeleton className='h-4 w-12' />
                    <div className='flex'>
                      <Skeleton className='h-10 w-20 rounded-none' />
                      <Skeleton className='h-10 w-20 rounded-none' />
                    </div>
                  </div>
                  <Skeleton className='h-10 w-[140px]' />
                </div>
              </div>

              {/* Advanced Filters */}
              <div className='pt-5 border-t'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-2'>
                    <Skeleton className='w-4 h-4' />
                    <Skeleton className='h-5 w-32' />
                  </div>
                  <Skeleton className='h-9 w-28' />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Main Content */}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='flex flex-col lg:flex-row gap-8'>
          {/* Sidebar */}
          <div className='lg:w-64 flex-shrink-0'>
            <div className='sticky top-18 space-y-6'>
              {/* Categories */}
              <Card>
                <CardHeader>
                  <Skeleton className='h-6 w-24' />
                </CardHeader>
                <CardContent className='space-y-2'>
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className='h-10 w-full' />
                  ))}
                </CardContent>
              </Card>

              {/* Tags */}
              <Card>
                <CardHeader>
                  <Skeleton className='h-6 w-28' />
                </CardHeader>
                <CardContent>
                  <div className='flex flex-wrap gap-2'>
                    {[...Array(10)].map((_, i) => (
                      <Skeleton key={i} className='h-8 w-16 rounded-full' />
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Newsletter */}
              <Card className='bg-gradient-to-br from-muted/10 via-muted/5 to-muted/10'>
                <CardContent className='p-6'>
                  <div className='text-center mb-4'>
                    <Skeleton className='w-8 h-8 mx-auto mb-3 rounded-full' />
                    <Skeleton className='h-6 w-32 mx-auto mb-2' />
                    <Skeleton className='h-4 w-48 mx-auto mb-4' />
                  </div>
                  <div className='space-y-3'>
                    <Skeleton className='h-10 w-full' />
                    <Skeleton className='h-10 w-full' />
                  </div>
                  <Skeleton className='h-3 w-40 mx-auto mt-3' />
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Articles Area */}
          <div className='flex-1'>
            {/* Results Header */}
            <div className='mb-6 flex items-center justify-between'>
              <div>
                <Skeleton className='h-8 w-48 mb-2' />
                <Skeleton className='h-4 w-64' />
              </div>
              <Skeleton className='h-9 w-28' />
            </div>

            {/* Articles Grid */}
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {[...Array(6)].map((_, i) => (
                <Card key={i} className='h-full overflow-hidden border'>
                  {/* Image */}
                  <Skeleton className='h-48 w-full' />
                  
                  <CardHeader className='pb-3'>
                    <div className='flex items-center gap-2 mb-2'>
                      <Skeleton className='h-6 w-16' />
                      <Skeleton className='h-4 w-20' />
                    </div>
                    <Skeleton className='h-6 w-full mb-1' />
                    <Skeleton className='h-5 w-3/4' />
                  </CardHeader>

                  <CardContent className='pb-4'>
                    <Skeleton className='h-4 w-full mb-2' />
                    <Skeleton className='h-4 w-full mb-4' />
                    
                    {/* Tags */}
                    <div className='flex flex-wrap gap-1 mb-4'>
                      <Skeleton className='h-6 w-12 rounded-full' />
                      <Skeleton className='h-6 w-14 rounded-full' />
                      <Skeleton className='h-6 w-10 rounded-full' />
                    </div>

                    {/* Author and Stats */}
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center gap-2'>
                        <Skeleton className='w-6 h-6 rounded-full' />
                        <Skeleton className='h-4 w-20' />
                      </div>
                      <div className='flex items-center gap-3'>
                        <Skeleton className='h-4 w-8' />
                        <Skeleton className='h-4 w-8' />
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className='pt-0'>
                    <div className='flex items-center justify-between w-full'>
                      <Skeleton className='h-9 w-20' />
                      <Skeleton className='h-9 w-20' />
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            <div className='flex justify-center mt-12'>
              <div className='flex items-center gap-2'>
                <Skeleton className='h-10 w-24' />
                <div className='flex items-center gap-1'>
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className='w-10 h-10' />
                  ))}
                </div>
                <Skeleton className='h-10 w-24' />
              </div>
            </div>
          </div>
        </div>

        {/* Featured Topics */}
        <div className='mt-8 hidden lg:block pb-5'>
          <div className='flex items-center justify-between mb-4'>
            <Skeleton className='h-6 w-48' />
            <Skeleton className='h-9 w-24' />
          </div>
          <div className='flex overflow-x-auto pb-4 gap-2'>
            {[...Array(10)].map((_, i) => (
              <Skeleton key={i} className='h-10 w-24 flex-shrink-0 rounded-full' />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}