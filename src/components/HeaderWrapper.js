'use client';
import { usePathname } from 'next/navigation';
import Header from './Header';

export default function HeaderWrapper() {
  const pathname = usePathname();
  if (pathname && (pathname.startsWith('/admin') || pathname.startsWith('/siakad'))) return null;
  return <Header />;
}
