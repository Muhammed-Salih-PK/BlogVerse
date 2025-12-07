"use client";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { FiAlertTriangle } from "react-icons/fi";

const Error = ({ error, backtext = null }) => {
  const router = useRouter();
  return (
    <div className='min-h-screen flex items-center justify-center px-4'>
      <div className='max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center'>
        <div className='mx-auto w-16 h-16 flex items-center justify-center bg-red-100 dark:bg-red-900/30 rounded-full mb-6'>
          <FiAlertTriangle className='w-8 h-8 text-red-500 dark:text-red-400' />
        </div>

        <h1 className='text-2xl font-bold text-gray-800 dark:text-white mb-2'>Oops! Something went wrong</h1>

        <p className='text-gray-600 dark:text-gray-300 mb-6'>{error || "We couldn't load the requested content."}</p>

        <div className='flex flex-col sm:flex-row gap-3 justify-center'>
          <Button variant='outline' onClick={() => router.back()} className='gap-2 border-gray-300 dark:border-gray-600'>
            <ArrowLeft className='w-5 h-5' />
            {backtext ? backtext : " Back to Home"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Error;
