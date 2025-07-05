import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./ThemeProvider";
import Navbar from "./Navbar";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Zippy",
  description: "P2P file sharing app.",
  authors: [
    {
      name: "Shivaanjay Narula",
      url: "https://github.com/ShivaanjayNarula",
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          {children}
        </ThemeProvider>
        <Toaster showOnLoad={true} />
      </body>
    </html>
  );
}
