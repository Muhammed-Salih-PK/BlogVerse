"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function EditPostSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl mt-9">
      <div className="flex items-center justify-between mb-8">
        <Skeleton className="h-10 w-24 rounded-md" />
        <Skeleton className="h-10 w-48 rounded-md" />
        <div className="w-10"></div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 space-y-6">
          {/* Title and Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Skeleton className="h-5 w-20 rounded-md" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-5 w-20 rounded-md" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
          </div>

          {/* Excerpt */}
          <div className="space-y-2">
            <Skeleton className="h-5 w-20 rounded-md" />
            <Skeleton className="h-24 w-full rounded-md" />
            <Skeleton className="h-4 w-64 rounded-md" />
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Skeleton className="h-5 w-20 rounded-md" />
            <Skeleton className="h-64 w-full rounded-md" />
          </div>

          {/* Categories and Tags */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Categories */}
            <div className="space-y-2">
              <Skeleton className="h-5 w-20 rounded-md" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <Skeleton className="h-5 w-20 rounded-md" />
              <Skeleton className="h-10 w-full rounded-md" />
              <Skeleton className="h-4 w-64 rounded-md" />
              <div className="flex flex-wrap gap-2 mt-3">
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-6 w-12 rounded-full" />
              </div>
            </div>
          </div>

          {/* Featured Image */}
          <div className="space-y-2">
            <Skeleton className="h-5 w-32 rounded-md" />
            <Skeleton className="h-10 w-full rounded-md" />
            <div className="mt-3 space-y-1">
              <Skeleton className="h-4 w-24 rounded-md" />
              <Skeleton className="h-40 w-full rounded-lg" />
            </div>
          </div>
        </div>

        {/* Form Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end gap-4">
          <Skeleton className="h-10 w-24 rounded-md" />
          <Skeleton className="h-10 w-32 rounded-md" />
        </div>
      </div>
    </div>
  );
}