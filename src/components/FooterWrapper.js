'use client';
import { usePathname } from 'next/navigation';
import Footer from './Footer';

export default function FooterWrapper() {
  const pathname = usePathname();
  if (pathname && (pathname.startsWith('/admin') || pathname.startsWith('/siakad'))) return null;
  return <Footer />;
}
