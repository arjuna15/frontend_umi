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
  title: {
    template: "%s | Universitas Mitra Bangsa",
    default: "Universitas Mitra Bangsa | Kampus Unggulan",
  },
  description: "Universitas Mitra Bangsa (UMIBA) adalah kampus unggulan di Jakarta yang menawarkan pendidikan berkualitas dengan program S1 dan S2, serta jalur beasiswa.",
  keywords: ["UMIBA", "Universitas Mitra Bangsa", "Kampus Jakarta", "Kuliah S1", "Kuliah S2", "Beasiswa KIP-K"],
  openGraph: {
    title: "Universitas Mitra Bangsa | Kampus Unggulan",
    description: "Universitas Mitra Bangsa (UMIBA) adalah kampus unggulan di Jakarta.",
    url: "https://umiba.ac.id",
    siteName: "Universitas Mitra Bangsa",
    images: [
      {
        url: "https://umiba.ac.id/wp-content/uploads/2024/05/logo-umiba.png",
        width: 800,
        height: 600,
        alt: "Logo UMIBA",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Universitas Mitra Bangsa",
    description: "Kampus unggulan dengan berbagai pilihan program studi terbaik.",
    images: ["https://umiba.ac.id/wp-content/uploads/2024/05/logo-umiba.png"],
  },
};

import HeaderWrapper from "../components/HeaderWrapper";
import FooterWrapper from "../components/FooterWrapper";
import ScrollAnimations from "../components/ScrollAnimations";
import { Providers } from "../context/Providers";

export default function RootLayout({ children }) {
  return (
    <html
      lang="id"
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
