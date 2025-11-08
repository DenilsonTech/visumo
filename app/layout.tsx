import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";

import '@stream-io/video-react-sdk/dist/css/styles.css';

import { Toaster } from "@/components/ui/toaster"
import 'react-datepicker/dist/react-datepicker.css'
import { ThemeProvider } from "@/providers/ThemeProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "VISUMO",
  description: "Aplicatico de vídeo chamada",
  icons: {
    icon: '/icons/logo.svg'
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <ClerkProvider 
        appearance={{
          layout: {
            socialButtonsVariant: 'iconButton',
          },
          variables: {
            colorText: '#fff',
            colorPrimary: '#0E78F9',
            colorBackground: '#1c1f2e',
            colorInputBackground: '#252a41',
            colorInputText: '#fff',
          }
        }}
      >
          <body className={`${inter.className} bg-dark-2`}>
            <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster/>
            </ThemeProvider>
          </body>
      </ClerkProvider>
    </html>  
  );
}
