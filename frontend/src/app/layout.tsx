import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PersonalLM",
  description: "A simple OpenAI connection tester",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
