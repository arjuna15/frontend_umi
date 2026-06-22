import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Universitas Mitra Bangsa",
  description: "Kampus Unggulan di Jakarta",
};

import HeaderWrapper from "../components/HeaderWrapper";
import FooterWrapper from "../components/FooterWrapper";
import ScrollAnimations from "../components/ScrollAnimations";
import { Providers } from "../context/Providers";

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script src="https://unpkg.com/@phosphor-icons/web" defer></script>
      </head>
      <body className="min-h-full flex flex-col">
        <Providers>
          <ScrollAnimations />
          <HeaderWrapper />
          <main style={{ flex: 1 }}>{children}</main>
          <FooterWrapper />
        </Providers>
      </body>
    </html>
  );
}
