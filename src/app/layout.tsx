import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ImageKitProvider } from "@imagekit/next";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const imagekitUrlEndpoint =
  process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT ?? "";

export const metadata: Metadata = {
  title: "OpenLynk",
  description: "Web development with Next.js, Better Auth & ReUI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${inter.variable} dark font-sans h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans bg-background text-foreground">
        <ImageKitProvider urlEndpoint={imagekitUrlEndpoint}>
          {children}
        </ImageKitProvider>
      </body>
    </html>
  );
}
