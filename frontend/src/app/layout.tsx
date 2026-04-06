import type { Metadata } from "next";
import { Inter_Tight, Geist } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "react-hot-toast";
import ErrorBoundary from "@/components/ErrorBoundary";
import PresenceHandler from "@/components/PresenceHandler";
import { ThemeProvider } from "next-themes";
import { cn } from "@/lib/utils";

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });

const interTight = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-inter-tight",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Monkframe",
  description: "Premium UI Asset Marketplace",
  icons: {
    icon: "/svg/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={cn("font-sans", geist.variable)}>
      <body className={`${interTight.variable} font-sans antialiased bg-white text-gray-900 selection:bg-amber-600/10 selection:text-amber-500`}>
        <AuthProvider>
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: '#ffffff',
                color: '#111827',
                border: '1px solid #f3f4f6',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                borderRadius: '0.75rem',
                fontSize: '0.875rem',
                fontWeight: '600',
                padding: '16px',
              },
              success: {
                iconTheme: { primary: '#f59e0b', secondary: '#ffffff' },
              },
              error: {
                iconTheme: { primary: '#ef4444', secondary: '#ffffff' },
              },
            }}
          />
          <PresenceHandler />
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
            <ErrorBoundary>
              {children}
            </ErrorBoundary>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
