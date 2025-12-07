import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const ProfileSkeleton = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Skeleton */}
        <div className="mb-8">
          <Skeleton className="h-10 w-64 mb-4" />
          <Skeleton className="h-4 w-96" />
        </div>

        {/* Profile Header Skeleton */}
        <div className="flex flex-col lg:flex-row gap-8 mb-8">
          {/* Profile Image Skeleton */}
          <div className="lg:w-1/4">
            <Card className="border border-primary/20">
              <div className="relative">
                <Skeleton className="h-32 w-full" />
                <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
                  <Skeleton className="w-32 h-32 rounded-full" />
                </div>
              </div>
              <CardContent className="pt-20 pb-6 text-center">
                <Skeleton className="h-6 w-3/4 mx-auto mb-2" />
                <Skeleton className="h-4 w-1/2 mx-auto mb-4" />
                <Skeleton className="h-4 w-full" />
              </CardContent>
            </Card>
          </div>

          {/* Profile Info Skeleton */}
          <div className="lg:w-3/4">
            <Card className="border border-primary/20">
              <CardHeader>
                <Skeleton className="h-6 w-48 mb-2" />
                <Skeleton className="h-4 w-32" />
              </CardHeader>
              <CardContent>
                {/* Stats Grid Skeleton */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Card key={i} className="border border-primary/20">
                      <CardContent className="p-4 text-center">
                        <Skeleton className="w-12 h-12 rounded-xl mx-auto mb-3" />
                        <Skeleton className="h-6 w-16 mx-auto mb-1" />
                        <Skeleton className="h-3 w-20 mx-auto" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Posts Section Skeleton */}
        <Card className="border border-primary/20">
          <CardHeader>
            <Skeleton className="h-6 w-32 mb-2" />
            <Skeleton className="h-4 w-48" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <Card key={i} className="border border-primary/20">
                  <Skeleton className="h-48 w-full" />
                  <CardContent className="p-4">
                    <Skeleton className="h-5 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full mb-3" />
                    <Skeleton className="h-3 w-1/2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfileSkeleton;
