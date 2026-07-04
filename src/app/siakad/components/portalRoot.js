'use client';

export function getPortalRoot() {
  if (typeof document === 'undefined') return null;
  return document.body && document.body.nodeType === 1 ? document.body : null;
}
