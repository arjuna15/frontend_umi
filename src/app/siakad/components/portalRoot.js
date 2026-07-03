'use client';

export function getPortalRoot() {
  if (typeof document === 'undefined') return null;
  return document.getElementById('siakad-portal-root');
}
