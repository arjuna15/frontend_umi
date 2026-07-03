'use client';

let portalRoot = null;

export function getPortalRoot() {
  if (typeof document === 'undefined') return null;

  if (portalRoot && portalRoot.isConnected) return portalRoot;

  portalRoot = document.getElementById('siakad-portal-root');
  if (!portalRoot) {
    portalRoot = document.createElement('div');
    portalRoot.id = 'siakad-portal-root';
    (document.body || document.documentElement).appendChild(portalRoot);
  }

  return portalRoot;
}
