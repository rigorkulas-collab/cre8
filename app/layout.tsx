import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import "./globals.css";

export const metadata: Metadata = {
  title: "CRE8 Salon - Booking",
  description: "Book your salon appointment easily",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${GeistSans.variable} h-full antialiased`}>
      <body className={`${GeistSans.className} min-h-full flex flex-col`}>
        {children}
      </body>
    </html>
  );
}
