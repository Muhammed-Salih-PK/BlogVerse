import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'

const CategorySkeleton = () => {
  return (
    <div>
      <main className="max-w-6xl mx-auto px-4 py-10 mt-4">
        {/* Category Header Skeleton */}
        <header className="mb-8 text-center">
          <Skeleton className="h-10 w-1/3 mx-auto mb-3" />
          <Skeleton className="h-6 w-1/4 mx-auto" />
        </header>

        {/* Articles Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <article key={i} className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
              {/* Image Skeleton */}
              <Skeleton className="h-48 w-full" />
              
              <div className="p-6">
                {/* Read time Skeleton */}
                <Skeleton className="h-4 w-20 mb-3" />
                
                {/* Title Skeleton */}
                <Skeleton className="h-6 w-full mb-2" />
                <Skeleton className="h-5 w-5/6 mb-2" />
                
                {/* Excerpt Skeleton */}
                <div className="space-y-2 mb-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-4/5" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
                
                {/* Tags Skeleton */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <Skeleton className="h-6 w-16 rounded-full" />
                  <Skeleton className="h-6 w-14 rounded-full" />
                </div>
                
                {/* Author and Read More Skeleton */}
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Skeleton className="w-8 h-8 rounded-full mr-2" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                  <Skeleton className="h-4 w-10" />
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Back Link Skeleton */}
        <div className="mt-8 text-center">
          <Skeleton className="h-5 w-40 mx-auto" />
        </div>
      </main>
    </div>
  )
}

export default CategorySkeleton
