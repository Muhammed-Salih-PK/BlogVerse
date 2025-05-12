import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

export default async function Layout({ children, req }) {
  return (
    <SidebarProvider>
      <AppSidebar variant='inset' />
      <SidebarInset>
        <SiteHeader />
        <div className='flex flex-1 flex-col bg-gray-100 dark:bg-black/20'>{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}

export async function generateMetadata() {
  return {
    title: "Admin Panel",
    robots: "noindex, nofollow", // Prevent search engines from indexing this page
  };
}
