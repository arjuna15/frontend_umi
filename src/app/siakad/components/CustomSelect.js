"use client";
import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { getPortalRoot } from './portalRoot';

export default function CustomSelect({ name, options, value, onChange, placeholder = "Pilih...", disabled = false, style = {} }) {
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState(null);
  const [mounted, setMounted] = useState(false);
  const triggerRef = useRef(null);

  // Ensure we're mounted on client before using portals
  useEffect(() => {
    setMounted(true);
  }, []);

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;
    function handleClickOutside(e) {
      if (triggerRef.current && triggerRef.current.contains(e.target)) return;
      setIsOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Update coords when open
  useEffect(() => {
    if (!isOpen || !triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    setCoords({
      top: rect.bottom + window.scrollY + 4,
      left: rect.left + window.scrollX,
      width: rect.width,
    });
  }, [isOpen]);

  const handleToggle = () => {
    if (disabled) return;
    if (!isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setCoords({
        top: rect.bottom + window.scrollY + 4,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
    setIsOpen(prev => !prev);
  };

  const selectedOption = options.find(opt => opt.value === value);

  const dropdown = coords && isOpen && (
    <div
      style={{
        position: 'absolute',
        top: coords.top,
        left: coords.left,
        width: coords.width,
        zIndex: 99999,
        background: 'var(--color-bg)',
        border: '1px solid var(--color-border)',
        borderRadius: '12px',
        boxShadow: '0 10px 25px -5px rgba(0,0,0,0.15), 0 8px 10px -6px rgba(0,0,0,0.1)',
        overflow: 'hidden',
      }}
    >
      <style>{`
        @keyframes csDropIn {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      <div style={{ maxHeight: '132px', overflowY: 'auto', padding: '8px', animation: 'csDropIn 0.15s ease-out' }}>
        {options.map((opt, idx) => (
          <div
            key={idx}
            onMouseDown={(e) => {
              e.preventDefault();
              onChange(opt.value);
              setIsOpen(false);
            }}
            onMouseEnter={e => { e.currentTarget.style.background = opt.value === value ? 'rgba(59,130,246,0.15)' : 'var(--glass-bg)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = opt.value === value ? 'rgba(59,130,246,0.1)' : 'transparent'; }}
            style={{
              padding: '10px 14px',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              background: opt.value === value ? 'rgba(59,130,246,0.1)' : 'transparent',
              color: opt.value === value ? '#3b82f6' : 'var(--color-text)',
              fontWeight: opt.value === value ? '600' : '500',
              userSelect: 'none',
            }}
          >
            {opt.icon && <i className={opt.icon} style={{ fontSize: '1.1rem' }} />}
            {opt.label}
            {opt.value === value && <i className="ph ph-check" style={{ marginLeft: 'auto', color: '#3b82f6' }} />}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div ref={triggerRef} style={{ position: 'relative', width: '100%', ...style }}>
      {name && <input type="hidden" name={name} value={value || ''} />}

      {/* Trigger */}
      <div
        onClick={handleToggle}
        style={{
          padding: '12px 16px',
          background: disabled ? 'var(--glass-bg)' : 'var(--color-bg)',
          border: isOpen ? '2px solid #3b82f6' : '1px solid var(--color-border)',
          borderRadius: '12px',
          cursor: disabled ? 'not-allowed' : 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: isOpen ? '0 0 0 4px rgba(59,130,246,0.1)' : '0 2px 4px rgba(0,0,0,0.02)',
          transition: 'all 0.2s ease',
          color: selectedOption ? 'var(--color-text)' : 'var(--color-muted)',
          fontWeight: '500',
          fontSize: '0.95rem',
          userSelect: 'none',
        }}
      >
        <span>{selectedOption ? selectedOption.label : placeholder}</span>
        <i
          className="ph ph-caret-down"
          style={{
            color: 'var(--color-text)',
            transition: 'transform 0.2s',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            display: 'inline-block',
          }}
        />
      </div>

      {/* Portal: renders dropdown directly on document.body */}
      {mounted && (() => {
        const portalRoot = getPortalRoot();
        return portalRoot && createPortal(dropdown, portalRoot);
      })()}
    </div>
  );
}
