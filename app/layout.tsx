import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = {
  title: "Журнал работ",
  description: "Учёт выполненных работ на строительном объекте",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className="h-full">
      <body className={`${geistSans.className} min-h-full`}>{children}</body>
    </html>
  );
}
