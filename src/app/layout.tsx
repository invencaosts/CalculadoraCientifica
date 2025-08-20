import type { Metadata } from "next";
import { Geist, Lobster } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const lobster = Lobster({
  weight: "400",
});

export const metadata: Metadata = {
  title: "Calculadora Científica",
  description:
    "Calculadora Científica para resolver expressões matemáticas complexas",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-br">
      <body className={`${geistSans.variable} antialiased`}>{children}</body>
    </html>
  );
}
