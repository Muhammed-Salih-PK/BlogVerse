"use client";

import { usePathname } from "next/navigation"; // For detecting the active route
import { useEffect, useState } from "react";
import { IconCirclePlusFilled, IconMail } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import Link from "next/link";

export function NavMain({ items }) {
  const pathname = usePathname(); // Next.js Client-side routing
  const [activePath, setActivePath] = useState("");

  useEffect(() => {
    setActivePath(pathname); // Only set the active path on the client
  }, [pathname]);

  return (
    <SidebarGroup>
      <SidebarGroupContent className='flex flex-col gap-2'>
        {/* Quick Create and Inbox Buttons */}
        <SidebarMenu>
          <SidebarMenuItem className='flex items-center gap-2'>
            <SidebarMenuButton
              tooltip='Quick Create'
              className='bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear'
            >
              <IconCirclePlusFilled />
              <span>Quick Create</span>
            </SidebarMenuButton>
            <Button size='icon' className='size-8 group-data-[collapsible=icon]:opacity-0' variant='outline'>
              <IconMail />
              <span className='sr-only'>Inbox</span>
            </Button>
          </SidebarMenuItem>
        </SidebarMenu>

        {/* Sidebar Menu Items */}
        <SidebarMenu>
          {items.map((item) => {
            const isActive = activePath === item.url; // Compare with updated state

            return (
              <SidebarMenuItem key={item.title} className={`rounded-lg ${isActive 
                ? "bg-gray-900 dark:bg-white text-white dark:text-black"
                : "hover:bg-gray-800 dark:hover:bg-gray-200"
              }`}>
                <Link href={item.url}>
                  <SidebarMenuButton tooltip={item.title}>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
