import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Using Inter for clean typography
import "./globals.css";
import QueryProvider from "@/components/QueryProvider";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import RightSidebar from "@/components/layout/RightSidebar";
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NSTSphere - College Solutions Hub",
  description: "Share and upvote assignment solutions",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <QueryProvider>
          <AuthProvider>
            <div className="min-h-screen bg-gray-50">
              <Navbar />
              <div className="max-w-7xl mx-auto pt-16">
                <Sidebar />
                <main className="lg:pl-64 xl:pr-80 min-h-[calc(100vh-4rem)]">
                  <div className="px-4 sm:px-6 py-6">
                    {children}
                  </div>
                </main>
                <RightSidebar />
              </div>
            </div>
            <Toaster position="bottom-right" />
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
