import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PrelineScript from "@/components/PrelineScript";
import prisma from "@/lib/prisma";

// The logo is live CMS state. Never bake a build-time DB failure into static pages.
export const dynamic = 'force-dynamic';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kindline Care Foundation",
  description: "Restoring dignity and creating opportunity for orphans, vulnerable children, and widows.",
};

export default async function RootLayout(props: {
  children: React.ReactNode;
  params: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { children, params } = props;
  await params;

  let logoUrl: string | undefined = '';
  try {
    const logoImage = await prisma.siteImage.findUnique({
      where: { key: 'logo' }
    });
    logoUrl = logoImage?.url;
  } catch (error) {
    console.error('[RootLayout] Error fetching logo:', error);
  }

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <Header logoUrl={logoUrl} />
        <main className="flex-grow">
          {children}
        </main>
        <Footer logoUrl={logoUrl} />
        <PrelineScript />
      </body>
    </html>
  );
}
