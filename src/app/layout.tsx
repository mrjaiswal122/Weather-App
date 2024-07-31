/** @format */
'use client'

// import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { QueryClient, QueryClientProvider} from "react-query";
import { darkModeAtom} from "./atom";
import { useAtom } from "jotai";
import type { Metadata } from 'next'

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Weather Forecasting Web Application",
  description: "Stay ahead of the weather with our accurate and reliable weather forecasting web application. Get real-time updates, detailed forecasts, and weather alerts for your location. Plan your day with confidence, whether it's rain or shine."
};

export default function RootLayout({children}: {children: React.ReactNode;}){
  const[darkMode,_]=useAtom(darkModeAtom);
  const queryClient = new QueryClient();
  return (
    <html lang="en" className={darkMode?'dark':''}>
      <QueryClientProvider client={queryClient}>
        <body className={inter.className }>{children}</body>
      </QueryClientProvider>
    </html>
  );
}
