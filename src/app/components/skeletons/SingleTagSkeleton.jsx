"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

export default function SingleTagSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5">
      {/* Hero Header */}
      <div className="relative overflow-hidden border-b bg-gradient-to-br from-background via-background to-primary/5">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Navigation */}
          <div className="mb-8">
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-6 w-6" />
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-6 w-6" />
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-6 w-6" />
              <Skeleton className="h-6 w-24 rounded-full" />
            </div>
          </div>

          {/* Tag Header */}
          <div className="max-w-4xl mx-auto text-center mb-12">
            <div className="mb-6">
              <Skeleton className="h-6 w-32 mx-auto mb-4" />
              <Skeleton className="h-16 w-full max-w-3xl mx-auto mb-4" />
              <Skeleton className="h-8 w-2/3 mx-auto" />
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, index) => (
                <Card key={index} className="border">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <Skeleton className="w-10 h-10 rounded-xl" />
                      <Skeleton className="w-12 h-6" />
                    </div>
                    <Skeleton className="h-10 w-20 mb-1" />
                    <Skeleton className="h-4 w-24" />
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 justify-center mt-8">
              <Skeleton className="h-12 w-48" />
              <Skeleton className="h-12 w-32" />
            </div>
          </div>

          {/* Search & Filters */}
          <Card className="border bg-background/50 backdrop-blur-sm">
            <CardContent className="p-6">
              {/* Main Search */}
              <div className="relative mb-6">
                <Skeleton className="h-14 w-full rounded-xl" />
              </div>

              {/* Quick Actions */}
              <div className="flex flex-wrap items-center justify-between gap-4">
                {/* Quick Filter Chips */}
                <div className="flex flex-wrap gap-2">
                  {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-8 w-24 rounded-full" />
                  ))}
                </div>

                {/* View Controls */}
                <div className="flex items-center gap-3">
                  <div className="hidden sm:flex items-center gap-2">
                    <Skeleton className="h-4 w-12" />
                    <div className="flex border rounded-lg overflow-hidden">
                      <Skeleton className="h-10 w-20 rounded-none" />
                      <Skeleton className="h-10 w-20 rounded-none" />
                    </div>
                  </div>
                  <Skeleton className="h-10 w-[140px]" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="sticky top-20 space-y-6">
              {/* Filters Card */}
              <Card className="border">
                <CardHeader>
                  <Skeleton className="h-6 w-24" />
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-10 w-full" />
                  </div>

                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-10 w-full" />
                  </div>

                  <Skeleton className="h-4 w-full" />

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-4 w-28" />
                      <Skeleton className="w-9 h-5 rounded-full" />
                    </div>
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="w-9 h-5 rounded-full" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Top Authors */}
              <Card className="border">
                <CardHeader>
                  <Skeleton className="h-6 w-32" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[...Array(3)].map((_, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Skeleton className="w-10 h-10 rounded-full" />
                          <div>
                            <Skeleton className="h-4 w-24 mb-1" />
                            <Skeleton className="h-3 w-16" />
                          </div>
                        </div>
                        <Skeleton className="w-4 h-4" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="mb-8 flex items-center justify-between">
              <div>
                <Skeleton className="h-8 w-64 mb-2" />
                <Skeleton className="h-4 w-80" />
              </div>
              <Skeleton className="h-9 w-32" />
            </div>

            {/* Articles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {[...Array(9)].map((_, i) => (
                <Card key={i} className="h-full overflow-hidden border">
                  {/* Article Header */}
                  <div className="relative h-48 overflow-hidden">
                    <Skeleton className="w-full h-full" />
                    <div className="absolute top-3 left-3 flex gap-2">
                      <Skeleton className="h-6 w-16" />
                      <Skeleton className="h-6 w-16" />
                    </div>
                    <div className="absolute top-3 right-3">
                      <Skeleton className="h-6 w-20" />
                    </div>
                  </div>

                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                    <Skeleton className="h-6 w-full mb-1" />
                    <Skeleton className="h-5 w-3/4" />
                  </CardHeader>

                  <CardContent className="pb-4">
                    <Skeleton className="h-4 w-full mb-1" />
                    <Skeleton className="h-4 w-full mb-4" />

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {[...Array(3)].map((_, i) => (
                        <Skeleton key={i} className="h-6 w-16 rounded-full" />
                      ))}
                    </div>

                    {/* Author and Stats */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Skeleton className="w-8 h-8 rounded-full" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-4 w-8" />
                        <Skeleton className="h-4 w-8" />
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="pt-0">
                    <Skeleton className="h-10 w-full" />
                  </CardFooter>
                </Card>
              ))}
            </div>

            {/* Related Tags */}
            <div className="mt-12">
              <div className="mb-6">
                <Skeleton className="h-8 w-48 mb-2" />
                <Skeleton className="h-4 w-64" />
              </div>

              <div className="flex flex-wrap gap-3">
                {[...Array(12)].map((_, index) => (
                  <Skeleton key={index} className="h-10 w-32 rounded-full" />
                ))}
              </div>
            </div>

            {/* CTA Section */}
            <div className="mt-12 pb-20">
              <div className="relative overflow-hidden rounded-2xl border p-8">
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />

                <div className="relative z-10 text-center">
                  <div className="inline-flex items-center gap-3 mb-6">
                    <Skeleton className="w-12 h-12 rounded-full" />
                    <Skeleton className="h-8 w-64" />
                  </div>
                  <Skeleton className="h-6 w-full max-w-2xl mx-auto mb-8" />
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Skeleton className="h-12 w-40" />
                    <Skeleton className="h-12 w-48" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}