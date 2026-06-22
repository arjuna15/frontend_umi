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

      // Scrollbar sync logic
      const setupScrollbars = () => {
        const scrollbars = document.querySelectorAll('.custom-scrollbar');
        scrollbars.forEach(scrollbar => {
          if (!scrollbar.hasAttribute('data-scroll-handled')) {
            const targetSelector = scrollbar.getAttribute('data-target');
            const targetEl = document.querySelector(targetSelector);
            
            if (targetEl) {
              // Update target scroll when range input changes
              scrollbar.addEventListener('input', (e) => {
                const maxScroll = targetEl.scrollWidth - targetEl.clientWidth;
                targetEl.scrollLeft = (e.target.value / 100) * maxScroll;
              });

              // Update range input when target scrolls
              targetEl.addEventListener('scroll', () => {
                const maxScroll = targetEl.scrollWidth - targetEl.clientWidth;
                if (maxScroll > 0) {
                  scrollbar.value = (targetEl.scrollLeft / maxScroll) * 100;
                }
              });
            }
            scrollbar.setAttribute('data-scroll-handled', 'true');
          }
        });
      };
      
      setupScrollbars();

      // Watch for dynamically added elements (like fetched news)
      const mutationObserver = new MutationObserver(() => {
        observeElements();
        setupScrollbars();
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
