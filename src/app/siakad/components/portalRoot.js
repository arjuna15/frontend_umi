'use client';

export function getPortalRoot() {
  if (typeof document === 'undefined') return null;
  return document.body instanceof HTMLElement ? document.body : null;
}
