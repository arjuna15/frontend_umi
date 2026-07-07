import "./globals.css";
import { ThemeProvider } from "../context/ThemeContext";

export const metadata = {
  title: {
    template: "%s | Universitas Mitra Bangsa",
    default: "Universitas Mitra Bangsa | Kampus Unggulan",
  },
  description: "Universitas Mitra Bangsa (UMIBA) adalah kampus unggulan di Jakarta yang menawarkan pendidikan berkualitas dengan program S1 dan S2, serta jalur beasiswa.",
  keywords: ["UMIBA", "Universitas Mitra Bangsa", "Kampus Jakarta", "Kuliah S1", "Kuliah S2", "Beasiswa KIP-K"],
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'UMIBA',
  },
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

import Script from "next/script";
import HeaderWrapper from "../components/HeaderWrapper";
import FooterWrapper from "../components/FooterWrapper";
import ScrollAnimations from "../components/ScrollAnimations";
import { Providers } from "../context/Providers";

export default function RootLayout({ children }) {
  return (
    <html
      lang="id"
      className="h-full antialiased"
    >
      <head>
        <Script src="https://unpkg.com/@phosphor-icons/web" strategy="beforeInteractive" />
        <meta name="theme-color" content="#C41E3A" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="UMIBA" />
        <link rel="apple-touch-icon" sizes="192x192" href="/icons/icon-192x192.png" />
        <link rel="apple-touch-icon" sizes="512x512" href="/icons/icon-512x512.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className="min-h-full flex flex-col">
        {/* PWA Animasi Splash Screen Overlay */}
        <div id="pwa-splash" className="pwa-splash-overlay">
          <div className="pwa-splash-logo-container">
            <div className="pwa-splash-ring"></div>
            <img src="/erasebg-transformed.png" alt="UMIBA Logo" className="pwa-splash-logo" />
          </div>
          <div className="pwa-splash-spinner"></div>
        </div>
        <Script id="hide-pwa-splash" strategy="afterInteractive">
          {`
            (function() {
              window.addEventListener('load', function() {
                var splash = document.getElementById('pwa-splash');
                if (splash) {
                  // Tambahkan class fade-out untuk fade transition
                  splash.classList.add('fade-out');
                  setTimeout(function() {
                    splash.style.display = 'none';
                  }, 800); // Cocok dengan durasi CSS transition 0.8s
                }
              });
              // Fallback jika window load terlalu cepat atau lambat
              setTimeout(function() {
                var splash = document.getElementById('pwa-splash');
                if (splash && !splash.classList.contains('fade-out')) {
                  splash.classList.add('fade-out');
                  setTimeout(function() {
                    splash.style.display = 'none';
                  }, 800);
                }
              }, 2000);
            })();
          `}
        </Script>

        <ThemeProvider>
          <Providers>
            <ScrollAnimations />
            <HeaderWrapper />
            <main style={{ flex: 1 }}>{children}</main>
            <FooterWrapper />
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
