import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { pageStyles } from "@/fe/module/home/styles/pageStyles";

import { ThemeProvider } from "@/fe/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  fallback: ["system-ui", "sans-serif"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  fallback: ["monospace"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ContactKaro - Privacy and Security at its Best",
  description:
    "ContactKaro Vehicle Parking Tag with Masked Calls, SMS, WhatsApp and Emergency help",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <header className={pageStyles.header}>
            <div className={pageStyles.headerContent}>
              <div className={pageStyles.logo}>
                <h1 className={pageStyles.title}>Contact</h1>
                <span className={pageStyles.badge}>Karo</span>
              </div>
            </div>
          </header>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
