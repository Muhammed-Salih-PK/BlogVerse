"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

export default function TagSkeleton() {
  return (
    <div className='min-h-screen bg-gradient-to-b from-background via-background to-primary/5'>
      {/* Hero Section */}
      <section className='relative overflow-hidden border-b'>
        <div className='absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent' />
        <div className='absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl' />
        <div className='absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl' />

        <div className='relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
          <div className='text-center max-w-4xl mx-auto'>
            <div className='mb-6 inline-block rounded-md'>
              <Skeleton className='h-6 w-40 mx-auto' />
            </div>

            <div className='mb-6'>
              <Skeleton className='h-16 w-full max-w-3xl mx-auto' />
            </div>

            <div className='mb-10 max-w-3xl mx-auto'>
              <Skeleton className='h-8 w-full' />
            </div>

            {/* Stats Overview */}
            <div className='grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mb-8'>
              {[...Array(4)].map((_, index) => (
                <Card key={index} className='border hover:shadow-lg transition-shadow'>
                  <CardContent className='p-4 text-center'>
                    <Skeleton className='w-8 h-8 mx-auto mb-2 rounded-lg' />
                    <Skeleton className='h-8 w-16 mx-auto mb-1' />
                    <Skeleton className='h-4 w-20 mx-auto' />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {/* Controls */}
        <Card className='mb-8 border'>
          <CardContent className='p-6'>
            <div className='flex flex-col lg:flex-row gap-6 items-center mb-6'>
              {/* Search */}
              <div className='flex-1 w-full'>
                <Skeleton className='h-12 w-full rounded-xl' />
              </div>

              {/* View Controls */}
              <div className='flex items-center gap-4 w-full lg:w-auto'>
                <div className='flex border rounded-lg overflow-hidden'>
                  <Skeleton className='h-10 w-20 rounded-none' />
                  <Skeleton className='h-10 w-20 rounded-none' />
                </div>
                <Skeleton className='h-10 w-[140px]' />
              </div>
            </div>

            {/* Tabs & Filters */}
            <div className='flex flex-col lg:flex-row gap-6 items-center justify-between'>
              <div className='flex gap-2'>
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className='h-10 w-24' />
                ))}
              </div>

              <div className='flex flex-wrap items-center gap-4'>
                <Skeleton className='h-10 w-[160px]' />
                <Skeleton className='h-10 w-[130px]' />
                <div className='flex items-center space-x-2'>
                  <Skeleton className='w-9 h-5 rounded-full' />
                  <Skeleton className='h-5 w-20' />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Header */}
        <div className='mb-6 flex items-center justify-between'>
          <div>
            <Skeleton className='h-8 w-64 mb-2' />
            <Skeleton className='h-4 w-80' />
          </div>
          <Skeleton className='h-9 w-32' />
        </div>

        {/* Enhanced Tags Display */}
        <div className='relative'>
          {/* Quick Stats Bar */}
          <div className='flex items-center justify-between mb-6 px-4 py-3 bg-secondary/50 backdrop-blur-sm rounded-xl'>
            <div className='flex items-center gap-4 text-sm'>
              <Skeleton className='h-4 w-24' />
              <Skeleton className='h-4 w-24' />
              <Skeleton className='h-4 w-24' />
            </div>

            <div className='flex items-center gap-2'>
              <div className='flex items-center gap-1 text-sm'>
                <Skeleton className='w-4 h-4' />
                <Skeleton className='h-4 w-12' />
              </div>
              <div className='flex border rounded-lg overflow-hidden'>
                <Skeleton className='h-10 w-20 rounded-none' />
                <Skeleton className='h-10 w-20 rounded-none' />
              </div>
            </div>
          </div>

          {/* Tags Grid */}
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
            {[...Array(12)].map((_, i) => (
              <Card key={i} className='h-full overflow-hidden border'>
                {/* Gradient Header */}
                <Skeleton className='h-2 w-full' />

                <CardHeader className='pb-3'>
                  <div className='flex items-start justify-between mb-3'>
                    <div className='flex-1 min-w-0'>
                      <Skeleton className='h-6 w-3/4 mb-2' />
                      <div className='flex items-center gap-2 mt-1'>
                        <Skeleton className='h-5 w-16 rounded-full' />
                        <Skeleton className='h-5 w-16 rounded-full' />
                      </div>
                    </div>
                  </div>
                  <Skeleton className='h-4 w-full mb-1' />
                  <Skeleton className='h-4 w-2/3' />
                </CardHeader>

                <CardContent className='pb-4'>
                  {/* Stats Visualization */}
                  <div className='space-y-3 mb-4'>
                    <div className='flex items-center justify-between'>
                      <Skeleton className='h-4 w-32' />
                      <Skeleton className='h-4 w-12' />
                    </div>
                    <Skeleton className='h-2 w-full rounded-full' />

                    <div className='grid grid-cols-2 gap-2'>
                      <div className='text-center p-2 bg-secondary/50 rounded-lg'>
                        <Skeleton className='h-6 w-12 mx-auto mb-1' />
                        <Skeleton className='h-3 w-16 mx-auto' />
                      </div>
                      <div className='text-center p-2 bg-secondary/50 rounded-lg'>
                        <Skeleton className='h-6 w-12 mx-auto mb-1' />
                        <Skeleton className='h-3 w-16 mx-auto' />
                      </div>
                    </div>
                  </div>

                  {/* Categories & Topics */}
                  <div className='space-y-2'>
                    <div className='flex items-center gap-2'>
                      <Skeleton className='w-3.5 h-3.5' />
                      <Skeleton className='h-4 w-24' />
                    </div>
                    <div className='flex flex-wrap gap-1'>
                      {[...Array(3)].map((_, i) => (
                        <Skeleton key={i} className='h-6 w-16 rounded-full' />
                      ))}
                    </div>
                  </div>
                </CardContent>

                <CardFooter className='pt-0'>
                  <Skeleton className='h-10 w-full' />
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>

        {/* Tag Cloud Section */}
        <div className='mt-16'>
          <Card className='border'>
            <CardHeader>
              <div className='flex items-center justify-between'>
                <div>
                  <Skeleton className='h-8 w-48 mb-2' />
                  <Skeleton className='h-4 w-64' />
                </div>
                <Skeleton className='h-9 w-24' />
              </div>
            </CardHeader>
            <CardContent>
              <div className='flex flex-wrap gap-3 justify-center min-h-[200px] items-center'>
                {[...Array(20)].map((_, i) => (
                  <Skeleton key={i} className='h-10 w-32 rounded-full' />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className='mt-16 pb-20'>
          <Card className='border'>
            <CardContent className='p-8'>
              <div className='flex flex-col lg:flex-row items-center justify-between gap-6'>
                <div>
                  <Skeleton className='h-8 w-48 mb-2' />
                  <Skeleton className='h-4 w-64' />
                </div>
                <div className='flex gap-3'>
                  <Skeleton className='h-10 w-36' />
                  <Skeleton className='h-10 w-36' />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}