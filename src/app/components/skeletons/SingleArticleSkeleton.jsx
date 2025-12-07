"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

export default function SingleArticleSkeleton() {
  return (
    <div className='min-h-screen bg-gradient-to-b from-background via-background to-primary/5'>
      {/* Reading Progress Bar */}
      <div className='fixed top-0 left-0 w-full z-50'>
        <Skeleton className='h-1 w-full' />
      </div>

      {/* Hero Header with Gradient */}
      <div className='relative overflow-hidden border-b bg-gradient-to-br from-background via-background to-primary/5'>
        <div className='absolute top-1/4 -left-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl' />
        <div className='absolute bottom-1/4 -right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl' />

        <div className='relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
          {/* Navigation */}
          <div className='mb-8 flex items-center justify-between'>
            <Skeleton className='h-10 w-24' />
            <div className='flex items-center gap-4'>
              <Skeleton className='h-6 w-20 rounded-full' />
              <Skeleton className='h-6 w-20 rounded-full' />
            </div>
          </div>

          {/* Article Header */}
          <div className='max-w-4xl mx-auto'>
            <div className='flex flex-wrap items-center gap-3 mb-6'>
              <Skeleton className='h-8 w-32 rounded-full' />
              <Skeleton className='h-8 w-24 rounded-full' />
              <Skeleton className='h-8 w-28 rounded-full' />
              <div className='ml-auto'>
                <Skeleton className='h-6 w-32' />
              </div>
            </div>

            <div className='mb-6'>
              <Skeleton className='h-16 w-full mb-4' />
              <Skeleton className='h-6 w-3/4' />
              <Skeleton className='h-6 w-full mt-2' />
            </div>

            {/* Stats Cards */}
            <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-8'>
              {[...Array(4)].map((_, index) => (
                <Card key={index} className='border'>
                  <CardContent className='p-4 text-center'>
                    <Skeleton className='w-10 h-10 mx-auto mb-3 rounded-xl' />
                    <Skeleton className='h-8 w-16 mx-auto mb-1' />
                    <Skeleton className='h-4 w-20 mx-auto' />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='flex flex-col lg:flex-row gap-8'>
          {/* Main Article Content */}
          <div className='lg:w-2/3'>
            {/* Author Card */}
            <div className='mb-8'>
              <Card className='border'>
                <CardContent className='p-6'>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-4'>
                      <Skeleton className='h-14 w-14 rounded-full' />
                      <div>
                        <Skeleton className='h-6 w-32 mb-2' />
                        <Skeleton className='h-4 w-48' />
                      </div>
                    </div>
                    <Skeleton className='h-9 w-24' />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Featured Image */}
            <div className='mb-8 rounded-2xl overflow-hidden shadow-2xl'>
              <Skeleton className='w-full h-64' />
            </div>

            {/* Article Content */}
            <div className='mb-8'>
              <Card className='border'>
                <CardContent className='p-8 space-y-4'>
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className='space-y-2'>
                      <Skeleton className='h-4 w-full' />
                      <Skeleton className='h-4 w-11/12' />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Tags Section */}
            <div className='mb-8'>
              <Card className='border'>
                <CardHeader>
                  <Skeleton className='h-6 w-24' />
                </CardHeader>
                <CardContent>
                  <div className='flex flex-wrap gap-2'>
                    {[...Array(6)].map((_, i) => (
                      <Skeleton key={i} className='h-8 w-24 rounded-full' />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Engagement Section */}
            <div className='mb-8'>
              <Card className='border'>
                <CardContent className='p-6'>
                  <div className='flex flex-col md:flex-row items-center justify-between gap-6'>
                    <div>
                      <Skeleton className='h-6 w-48 mb-2' />
                      <Skeleton className='h-4 w-64' />
                    </div>
                    <div className='flex items-center gap-4'>
                      <Skeleton className='h-10 w-24' />
                      <Skeleton className='h-10 w-24' />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Sidebar */}
          <div className='lg:w-1/3 space-y-6'>
            {/* Reading Preferences */}
            <Card className='border'>
              <CardHeader>
                <Skeleton className='h-6 w-36' />
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='space-y-2'>
                  <Skeleton className='h-4 w-24' />
                  <div className='flex gap-2'>
                    {[...Array(4)].map((_, i) => (
                      <Skeleton key={i} className='h-9 w-full' />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Author Profile */}
            <Card className='border'>
              <CardContent className='p-6 text-center'>
                <Skeleton className='h-20 w-20 mx-auto mb-4 rounded-full' />
                <Skeleton className='h-6 w-32 mx-auto mb-2' />
                <Skeleton className='h-4 w-48 mx-auto mb-4' />
                <Skeleton className='h-9 w-full' />
              </CardContent>
            </Card>

            {/* Popular Articles */}
            <Card className='border'>
              <CardHeader>
                <Skeleton className='h-6 w-32' />
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  {[...Array(4)].map((_, index) => (
                    <div key={index} className='flex items-start gap-3 p-3'>
                      <Skeleton className='w-12 h-12 rounded-lg' />
                      <div className='flex-1'>
                        <Skeleton className='h-4 w-full mb-2' />
                        <Skeleton className='h-3 w-24' />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Newsletter */}
            <Card className='border'>
              <CardContent className='p-6'>
                <div className='text-center mb-4'>
                  <Skeleton className='w-8 h-8 mx-auto mb-3 rounded-full' />
                  <Skeleton className='h-6 w-40 mx-auto mb-2' />
                  <Skeleton className='h-4 w-56 mx-auto mb-4' />
                </div>
                <div className='space-y-3'>
                  <Skeleton className='h-10 w-full' />
                  <Skeleton className='h-10 w-full' />
                </div>
                <Skeleton className='h-3 w-48 mx-auto mt-3' />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Comments Section */}
        <div className='mt-12 pb-20'>
          <Card className='border'>
            <CardHeader>
              <Skeleton className='h-6 w-48' />
            </CardHeader>
            <CardContent>
              <div className='text-center py-12'>
                <Skeleton className='w-16 h-16 mx-auto mb-6 rounded-full' />
                <Skeleton className='h-8 w-64 mx-auto mb-3' />
                <Skeleton className='h-4 w-80 mx-auto mb-6' />
                <Skeleton className='h-10 w-36 mx-auto' />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
