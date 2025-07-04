"use client";
import ThemeToggle from "@/app/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useRouter } from "next/navigation";
import { FiArrowLeft } from "react-icons/fi";

export function SiteHeader() {
  const router = useRouter();
  return (
    <>
      <header className='flex h-(--header-height) shrink-0 items-center sticky top-0 z-10 backdrop-blur-sm rounded-tl-xl gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)'>
        <div className='flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6 '>
          <SidebarTrigger className='-ml-1 ' />
          <Separator orientation='vertical' className='mx-2 data-[orientation=vertical]:h-4' />
          <button variant='outline' type='button' onClick={() => router.back()}>
            <FiArrowLeft />
          </button>
          <Separator orientation='vertical' className='mx-2 data-[orientation=vertical]:h-4' />
          <h1 className='text-base font-medium'>Documents</h1>
          <div className='ml-auto flex items-center gap-2'>
            <ThemeToggle />
            <Button variant='ghost' asChild size='sm' className='hidden sm:flex'>
              <a className='dark:text-foreground'></a>
            </Button>
          </div>
        </div>
      </header>
    </>
  );
}
