'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function ScrollAnimations() {
  const pathname = usePathname();

  useEffect(() => {
    // Small delay to ensure DOM is fully rendered (especially with dangerouslySetInnerHTML)
    const timeoutId = setTimeout(() => {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.05, rootMargin: "0px 0px -50px 0px" });

      const elements = document.querySelectorAll('.fade-up, .scale-up, .slide-in-left, .slide-in-right');
      elements.forEach(el => {
        // Reset visibility if it was already visible (useful on route changes)
        // Note: For Next.js App Router, components might remount or persist. 
        // We ensure the observer catches them.
        observer.observe(el);
      });

      return () => observer.disconnect();
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [pathname]); // Re-run when route changes

  return null; // This component doesn't render anything visually
}
