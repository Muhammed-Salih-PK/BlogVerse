import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavWrapper from "./components/NavWrapper"; // New wrapper component
import { Toaster } from "@/components/ui/sonner";
import StoreProvider from "./StoreProvider";

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
        <StoreProvider>
          <Toaster richColors />
          <NavWrapper />
          <main>{children}</main>
        </StoreProvider>
      </body>
    </html>
  );
}
export async function generateMetadata() {
  return {
    title: "BlogVerse | Modern Web Development Articles",
    robots: "noindex, follow",
    content:
      "Latest articles on web development, React, Next.js, and modern frontend technologies",
  };
}
