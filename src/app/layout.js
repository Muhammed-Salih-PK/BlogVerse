import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavWrapper from "./components/NavWrapper"; // New wrapper component
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Toaster richColors />
        <NavWrapper />
        <main>{children}</main>
      </body>
    </html>
  );
}
export async function generateMetadata() {
  return {
    title: "blog - section",
    robots: "noindex, follow",
  };
}

