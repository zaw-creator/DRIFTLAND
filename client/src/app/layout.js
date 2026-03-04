import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import KeepAlive from "@/components/KeepAlive";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "DriftLand",
  description: "DriftLand Event Registration",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <KeepAlive />
        {children}
      </body>
    </html>
  );
}