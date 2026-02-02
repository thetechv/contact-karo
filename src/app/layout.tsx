import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { pageStyles } from "@/fe/module/home/styles/pageStyles";
import { ThemeToggle } from "@/fe/components/ui/ThemeToggle";

import { ThemeProvider } from "@/fe/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
              <ThemeToggle />
            </div>
          </header>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
