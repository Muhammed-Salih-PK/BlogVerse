import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavWrapper from "./components/NavWrapper"; // New wrapper component
import { Toaster } from "@/components/ui/sonner";
import StoreProvider from "./StoreProvider";
import ScrollToTopWrapper from "./components/ScrollToTopWrapper";
import BlogFooter from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";


const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  
  return (
    <html lang='en'>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ScrollToTopWrapper>
        <StoreProvider>
          <Toaster richColors />
          <NavWrapper />
          <main>{children}</main>
          <ScrollToTop />
          <BlogFooter />
        </StoreProvider>
        </ScrollToTopWrapper>
      </body>
    </html>
  );
}

export const metadata = {
  title: "BlogVerse | Modern Web Development Articles",
  robots: "noindex, follow",
  description:
    "Latest articles on web development, React, Next.js, and modern frontend technologies",
};
