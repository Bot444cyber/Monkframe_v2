import type { Metadata } from "next";
import { Inter_Tight } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { SocketProvider } from "@/context/SocketContext";
import { Toaster } from "react-hot-toast";
import ErrorBoundary from "@/components/ErrorBoundary";

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
    <html lang="en" className="dark">
      <body
        className={`${interTight.variable} font-sans antialiased bg-black text-white selection:bg-white/20 selection:text-white`}
      >
        <AuthProvider>
          <SocketProvider>
            <Toaster position="bottom-right" toastOptions={{
              style: {
                background: '#18181b',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.1)'
              }
            }} />
            <ErrorBoundary>
              {children}
            </ErrorBoundary>
          </SocketProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
