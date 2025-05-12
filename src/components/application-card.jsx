"use client";

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";


export function ApplicationCards({ AppId, AppName, AppEmail, AppResume, AppPhone, AppjobId }) {
  return (
    <Card className='relative bg-white dark:bg-black shadow-md rounded-xl border dark:border-gray-800 transition-all duration-300 hover:shadow-lg group p-4'>
      <CardHeader>
        <CardTitle className='text-2xl font-semibold text-gray-900 dark:text-white'>{AppName}</CardTitle>
        <CardDescription className='dark:text-gray-400'>Application Details</CardDescription>
      </CardHeader>

      <CardHeader>
        <div className='space-y-2'>
          <p>
            <span className='font-medium'>Email:</span>{" "}
            <a href={`mailto:${AppEmail}`} className='hover:text-blue-800 transition-all'>
              {AppEmail}
            </a>
          </p>
          <p>
            <span className='font-medium'>Phone:</span> {AppPhone}
          </p>
          <p>
            <span className='font-medium'>Applied for:</span> {AppjobId?.title || "Unknown Job"}
          </p>

          <a
            href={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/raw/upload/${AppResume}`}
            target='_blank'
            rel='noopener noreferrer'
            className='"inline-block px-4 py-2 bg-black/80 dark:bg-white/80 rounded-md text-[13px] font-semibold text-white dark:text-gray-700  transition hover:underline'
          >
            View Resume
          </a>
        </div>
      </CardHeader>
    </Card>
  );
}
