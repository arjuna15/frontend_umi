"use client";
import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { getPortalRoot } from './portalRoot';

export default function CustomSelect({ value, onChange, options, placeholder = "Pilih opsi...", disabled = false, style = {} }) {
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState(null);
  const [mounted, setMounted] = useState(false);
  const triggerRef = useRef(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    if (!isOpen) return;
    function handleClickOutside(e) {
      if (triggerRef.current && triggerRef.current.contains(e.target)) return;
      const selectPortal = document.getElementById('siakad-select-portal');
      if (selectPortal && selectPortal.contains(e.target)) return;
      setIsOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Update coords to align with the trigger button position
  useEffect(() => {
    if (!isOpen || !triggerRef.current) return;
    const updatePosition = () => {
      if (!triggerRef.current) return;
      const rect = triggerRef.current.getBoundingClientRect();
      setCoords({
        top: rect.bottom + window.scrollY + 6,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    };
    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition);
    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition);
    };
  }, [isOpen]);

  const handleToggle = () => {
    if (disabled) return;
    setIsOpen(prev => !prev);
  };

  const handleSelectOption = (val) => {
    onChange(val);
    setIsOpen(false);
  };

  const selectedOption = options.find(opt => opt.value === value);

  const dropdown = isOpen && coords && (
    <div
      id="siakad-select-portal"
      style={{
        position: 'absolute',
        top: `${coords.top}px`,
        left: `${coords.left}px`,
        width: `${coords.width}px`,
        zIndex: 9999999,
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: '20px',
        boxShadow: '0 16px 40px rgba(0, 0, 0, 0.35)',
        overflow: 'hidden',
        padding: '8px',
        backdropFilter: 'blur(30px) saturate(180%)',
        WebkitBackdropFilter: 'blur(30px) saturate(180%)',
        animation: 'csSelectFadeIn 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}
    >
      <style>{`
        @keyframes csSelectFadeIn {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .siakad-select-option {
          width: 100%;
          padding: 12px 18px;
          border: none;
          background: transparent;
          color: var(--color-text);
          font-size: 0.92rem;
          text-align: left;
          cursor: pointer;
          border-radius: 50px;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-weight: 500;
        }
        .siakad-select-option:hover {
          background: rgba(59, 130, 246, 0.15) !important;
          color: #3b82f6 !important;
        }
        .siakad-select-option.active {
          background: linear-gradient(135deg, rgb(59, 130, 246) 0%, rgb(29, 78, 216) 100%) !important;
          color: white !important;
        }
      `}</style>
      {options.map((opt) => {
        const isActive = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            className={`siakad-select-option ${isActive ? 'active' : ''}`}
            onClick={() => handleSelectOption(opt.value)}
          >
            <span>{opt.label}</span>
            {isActive && <i className="ph-bold ph-check" style={{ color: 'white' }}></i>}
          </button>
        );
      })}
    </div>
  );

  return (
    <div style={{ position: 'relative', ...style }}>
      <button
        ref={triggerRef}
        type="button"
        onClick={handleToggle}
        disabled={disabled}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 22px',
          borderRadius: '50px',
          border: '1px solid var(--color-border)',
          background: 'var(--color-bg)',
          color: value ? 'var(--color-text)' : 'var(--color-muted)',
          fontSize: '0.95rem',
          fontWeight: value ? '600' : 'normal',
          cursor: disabled ? 'not-allowed' : 'pointer',
          textAlign: 'left',
          outline: 'none',
          transition: 'all 0.2s ease-out',
          boxShadow: isOpen ? '0 0 0 3px rgba(59, 130, 246, 0.15), inset 0 3px 8px rgba(0, 0, 0, 0.12)' : 'inset 0 3px 8px rgba(0, 0, 0, 0.12), inset 0 1px 2px rgba(0, 0, 0, 0.04)',
          borderColor: isOpen ? '#3b82f6' : 'var(--color-border)',
        }}
      >
        <span>{selectedOption ? selectedOption.label : placeholder}</span>
        <i className="ph-bold ph-caret-down" style={{ fontSize: '1rem', color: isOpen ? '#3b82f6' : 'var(--color-muted)', transition: 'transform 0.2s', transform: isOpen ? 'rotate(180deg)' : 'none' }} />
      </button>

      {mounted && (() => {
        const portalRoot = getPortalRoot();
        return portalRoot && createPortal(dropdown, portalRoot);
      })()}
    </div>
  );
}
