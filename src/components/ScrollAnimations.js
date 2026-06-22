'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function ScrollAnimations() {
  const pathname = usePathname();

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.05, rootMargin: "0px 0px -50px 0px" });

      // Observe current elements
      const observeElements = () => {
        const elements = document.querySelectorAll('.fade-up:not(.visible), .scale-up:not(.visible), .slide-in-left:not(.visible), .slide-in-right:not(.visible)');
        elements.forEach(el => {
          if (!el.hasAttribute('data-observed')) {
            observer.observe(el);
            el.setAttribute('data-observed', 'true');
          }
        });
      };

      observeElements();

      // Watch for dynamically added elements (like fetched news)
      const mutationObserver = new MutationObserver(() => {
        observeElements();
      });

      mutationObserver.observe(document.body, { childList: true, subtree: true });

      return () => {
        observer.disconnect();
        mutationObserver.disconnect();
      };
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [pathname]);

  return null;
}
