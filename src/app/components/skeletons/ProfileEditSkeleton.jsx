import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const ProfileEditSkeleton = () => {
  return (
    <div className='container mx-auto px-4 py-8 max-w-4xl mt-8'>
      <Card>
        <CardHeader>
          <Skeleton className='h-8 w-48' />
        </CardHeader>

        <CardContent className='space-y-6'>
          <div className='flex flex-col items-center gap-4'>
            <Skeleton className='w-24 h-24 rounded-full' />
          </div>

          <div className='space-y-4'>
            <Skeleton className='h-6 w-32 mb-4' />

            <div className='grid gap-4 md:grid-cols-2'>
              {[...Array(4)].map((_, i) => (
                <div key={i} className='space-y-2'>
                  <Skeleton className='h-5 w-24' />
                  <Skeleton className='h-10 w-full' />
                </div>
              ))}
            </div>
          </div>

          <div className='space-y-4'>
            <Skeleton className='h-6 w-32 mb-4' />

            {[...Array(3)].map((_, i) => (
              <div key={i} className='space-y-2'>
                <Skeleton className='h-5 w-24' />
                <Skeleton className='h-10 w-full' />
              </div>
            ))}
          </div>
        </CardContent>

        <CardFooter className='flex justify-end gap-4'>
          <Skeleton className='h-10 w-24' />
          <Skeleton className='h-10 w-32' />
        </CardFooter>
      </Card>
    </div>
  );
};

export default ProfileEditSkeleton;
