import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Web3Provider } from "@/components/providers/Web3Provider";
import { OptimizedWeb3Provider } from "@/components/providers/OptimizedWeb3Provider";
import { MinimalWeb3Provider } from "@/components/providers/MinimalWeb3Provider";
import { AuthProvider } from "@/contexts/AuthContext";
import { ClientInitializer } from "@/components/ClientInitializer";
// Import error suppressions and polyfills early
import "@/lib/indexeddb-polyfill";
import "@/lib/dev-overlay-suppression";
import "@/lib/crypto-polyfill";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CLORION - Blue Carbon Registry",
  description: "Blockchain-based Blue Carbon Registry and MRV System for sustainable carbon credit management",
  keywords: ["blue carbon", "blockchain", "carbon credits", "MRV", "sustainability"],
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: '/clorion-logo.png',
    shortcut: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        {/* Early error suppression for Phantom wallet conflicts */}
        <script src="/phantom-error-suppression.js" />
        
        {/* Additional favicon links for better browser compatibility */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" href="/clorion-logo.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-gradient-to-br from-blue-50 to-green-50`}
      >
        <ClientInitializer />
        <AuthProvider>
          <MinimalWeb3Provider>
            {children}
          </MinimalWeb3Provider>
        </AuthProvider>
      </body>
    </html>
  );
}
