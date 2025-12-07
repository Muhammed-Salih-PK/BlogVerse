"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

export default function CategorySkeleton() {
  return (
    <div className='min-h-screen bg-gradient-to-b from-background via-background to-muted/20'>
      {/* Hero Section */}
      <section className='relative overflow-hidden border-b'>
        <div className='absolute inset-0 bg-gradient-to-br from-primary/5 via-primary/10 to-transparent' />
        <div className='absolute -top-20 -right-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl' />
        <div className='absolute -bottom-20 -left-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl' />

        <div className='relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20'>
          {/* Header Content */}
          <div className='text-center max-w-4xl mx-auto mb-12'>
            <div className='mb-6 inline-block rounded-md'>
              <Skeleton className='h-6 w-40' />
            </div>

            <div className='mb-6'>
              <Skeleton className='h-20 w-full max-w-3xl mx-auto' />
            </div>

            <div className='mb-10 max-w-3xl mx-auto'>
              <Skeleton className='h-8 w-full' />
            </div>
          </div>

          {/* Stats Overview */}
          <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-8'>
            {[...Array(4)].map((_, index) => (
              <Card key={index} className='border hover:shadow-lg transition-all duration-300'>
                <CardContent className='p-6'>
                  <div className='flex items-start justify-between mb-4'>
                    <Skeleton className='w-10 h-10 rounded-xl' />
                    <Skeleton className='w-12 h-6' />
                  </div>
                  <Skeleton className='h-10 w-20 mb-1' />
                  <Skeleton className='h-4 w-24' />
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Search and Controls */}
          <Card className='border bg-background/50 backdrop-blur-sm'>
            <CardContent className='p-6'>
              <div className='flex flex-col lg:flex-row gap-6 items-center mb-6'>
                {/* Search Bar */}
                <div className='flex-1 w-full'>
                  <div className='relative'>
                    <Skeleton className='h-12 w-full rounded-xl' />
                  </div>
                </div>

                {/* View and Sort Controls */}
                <div className='flex items-center gap-4 w-full lg:w-auto'>
                  <div className='flex border rounded-lg overflow-hidden'>
                    <Skeleton className='h-10 w-20 rounded-none' />
                    <Skeleton className='h-10 w-20 rounded-none' />
                  </div>
                  <Skeleton className='h-10 w-[180px]' />
                </div>
              </div>

              {/* Quick Filters */}
              <div className='w-full'>
                <div className='grid grid-cols-4 gap-2'>
                  {[...Array(4)].map((_, i) => (
                    <Skeleton key={i} className='h-10 w-full' />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Main Content */}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20'>
        {/* Results Header */}
        <div className='mb-8 flex items-center justify-between'>
          <div>
            <Skeleton className='h-8 w-64 mb-2' />
            <Skeleton className='h-4 w-80' />
          </div>
          <Skeleton className='h-9 w-32' />
        </div>

        {/* Categories Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {[...Array(9)].map((_, i) => (
            <Card key={i} className='h-full overflow-hidden border hover:shadow-lg transition-all duration-300 group'>
              {/* Category Header */}
              <div className='relative h-32 overflow-hidden'>
                <Skeleton className='w-full h-full' />
                <div className='absolute top-3 left-3 flex gap-2'>
                  <Skeleton className='h-6 w-16' />
                  <Skeleton className='h-6 w-16' />
                </div>
                <div className='absolute bottom-3 left-3 right-3 flex justify-between'>
                  <Skeleton className='h-6 w-24' />
                  <Skeleton className='h-6 w-20' />
                </div>
              </div>

              <CardHeader>
                <Skeleton className='h-6 w-3/4 mb-2' />
                <Skeleton className='h-4 w-full' />
                <Skeleton className='h-4 w-2/3 mt-2' />
              </CardHeader>

              <CardContent>
                {/* Category Stats */}
                <div className='grid grid-cols-3 gap-2 mb-4'>
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className='text-center p-2 bg-secondary rounded-lg'>
                      <Skeleton className='h-6 w-8 mx-auto mb-1' />
                      <Skeleton className='h-3 w-16 mx-auto' />
                    </div>
                  ))}
                </div>

                {/* Top Topics */}
                <div className='mb-4'>
                  <div className='flex items-center gap-2 mb-2'>
                    <Skeleton className='w-4 h-4' />
                    <Skeleton className='h-4 w-20' />
                  </div>
                  <div className='flex flex-wrap gap-1'>
                    {[...Array(4)].map((_, i) => (
                      <Skeleton key={i} className='h-6 w-16 rounded-full' />
                    ))}
                  </div>
                </div>

                {/* Latest Activity */}
                <div className='pt-4 border-t'>
                  <div className='flex items-center gap-2 mb-2'>
                    <Skeleton className='w-4 h-4' />
                    <Skeleton className='h-4 w-24' />
                  </div>
                  <Skeleton className='h-4 w-full mb-1' />
                  <Skeleton className='h-3 w-32' />
                </div>
              </CardContent>

              <CardFooter>
                <Skeleton className='h-10 w-full' />
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Related Topics Section */}
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
              <div className='flex flex-wrap gap-3'>
                {[...Array(12)].map((_, i) => (
                  <Skeleton key={i} className='h-10 w-32 rounded-full' />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className='mt-16'>
          <div className='relative overflow-hidden rounded-2xl border p-8'>
            <div className='absolute -top-20 -right-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl' />
            <div className='absolute -bottom-20 -left-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl' />

            <div className='relative z-10 text-center'>
              <div className='inline-flex items-center gap-3 mb-6'>
                <Skeleton className='w-12 h-12 rounded-full' />
                <Skeleton className='h-8 w-64' />
              </div>
              <Skeleton className='h-6 w-full max-w-2xl mx-auto mb-8' />
              <div className='flex flex-col sm:flex-row gap-4 justify-center'>
                <Skeleton className='h-12 w-40' />
                <Skeleton className='h-12 w-40' />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}