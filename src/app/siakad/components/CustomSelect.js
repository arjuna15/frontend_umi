"use client";
import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { getPortalRoot } from './portalRoot';

export default function CustomSelect({ value, onChange, options, placeholder = "Pilih opsi...", disabled = false, style = {} }) {
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState(null);
  const [mounted, setMounted] = useState(false);
  const triggerRef = useRef(null);

  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  // Reset search query when dropdown opens or closes
  useEffect(() => {
    if (!isOpen) {
      setSearchQuery('');
    }
  }, [isOpen]);

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

  // Filter options based on search query
  const filteredOptions = options.filter(opt =>
    (opt.label || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const dropdown = isOpen && coords && (
    <div
      id="siakad-select-portal"
      style={{
        position: 'absolute',
        top: `${coords.top}px`,
        left: `${coords.left}px`,
        width: `${coords.width}px`,
        zIndex: 9999999,
        background: 'var(--glass-bg)',
        border: 'var(--glass-border)',
        borderRadius: '20px',
        boxShadow: 'var(--glass-shadow)',
        maxHeight: '220px', // slightly taller to accommodate search bar
        overflowY: 'auto',
        padding: '8px',
        backdropFilter: 'none',
        WebkitBackdropFilter: 'none',
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
          padding: 10px 18px;
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
          background: rgba(196, 30, 58, 0.1) !important;
          color: #C41E3A !important;
        }
        .siakad-select-option.active {
          background: linear-gradient(135deg, #C41E3A 0%, #9b1c2e 100%) !important;
          color: white !important;
        }
      `}</style>
      
      {/* Search Input for long lists (options size > 5) */}
      {options.length > 5 && (
        <div 
          style={{ 
            position: 'sticky', 
            top: '-8px', 
            background: 'var(--glass-bg)', 
            padding: '4px 0 10px 0', 
            zIndex: 10,
            borderBottom: '1px solid rgba(0, 0, 0, 0.03)',
            marginBottom: '6px'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div style={{ position: 'relative', width: '100%' }}>
            <i 
              className="ph ph-magnifying-glass" 
              style={{ 
                position: 'absolute', 
                left: '14px', 
                top: '50%', 
                transform: 'translateY(-50%)', 
                color: 'var(--color-muted)',
                fontSize: '0.9rem',
                pointerEvents: 'none'
              }}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari..."
              style={{
                width: '100%',
                padding: '8px 12px 8px 36px',
                fontSize: '0.85rem',
                borderRadius: '50px',
                border: 'var(--inset-border)',
                background: 'var(--liquid-bg)',
                color: 'var(--color-text)',
                outline: 'none',
                boxSizing: 'border-box',
                boxShadow: 'inset 2px 2px 4px var(--inset-shadow-dark), inset -2px -2px 4px var(--inset-shadow-light)'
              }}
              autoFocus
            />
          </div>
        </div>
      )}
 
       {filteredOptions.length === 0 ? (
        <div style={{ padding: '20px 10px', textAlign: 'center', color: 'var(--color-muted)', fontSize: '0.85rem' }}>
          Tidak ada hasil pencarian.
        </div>
      ) : (
        filteredOptions.map((opt) => {
          const isActive = opt.value === value;
          return (
            <button
              key={opt.value}
              type="button"
              className={`siakad-select-option ${isActive ? 'active' : ''}`}
              onClick={() => handleSelectOption(opt.value)}
              style={{ overflow: 'hidden' }}
            >
              <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginRight: '8px' }}>{opt.label}</span>
              {isActive && <i className="ph ph-check" style={{ color: 'white', flexShrink: 0 }}></i>}
            </button>
          );
        })
      )}
    </div>
  );
 
   return (
    <div style={{ position: 'relative', ...style }}>
      <button
        ref={triggerRef}
        type="button"
        className="siakad-custom-select-trigger"
        onClick={handleToggle}
        disabled={disabled}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 22px',
          borderRadius: '50px',
          border: isOpen ? '1px solid #C41E3A' : 'var(--inset-border)',
          background: 'var(--glass-bg)',
          color: value ? 'var(--color-text)' : 'var(--color-muted)',
          fontSize: '0.95rem',
          fontWeight: value ? '600' : 'normal',
          cursor: disabled ? 'not-allowed' : 'pointer',
          textAlign: 'left',
          outline: 'none',
          transition: 'all 0.2s ease-out',
          boxShadow: isOpen ? '0 0 0 3px rgba(196, 30, 58, 0.15), inset 3px 3px 6px var(--inset-shadow-dark), inset -3px -3px 6px var(--inset-shadow-light)' : 'inset 3px 3px 6px var(--inset-shadow-dark), inset -3px -3px 6px var(--inset-shadow-light)',
          overflow: 'hidden'
        }}
      >
        <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginRight: '8px' }}>{selectedOption ? selectedOption.label : placeholder}</span>
        <i className="ph-bold ph-caret-down" style={{ fontSize: '1rem', color: isOpen ? '#B91C1C' : 'var(--color-muted)', transition: 'transform 0.2s', transform: isOpen ? 'rotate(180deg)' : 'none', flexShrink: 0 }} />
      </button>

      {mounted && (() => {
        const portalRoot = getPortalRoot();
        return portalRoot && createPortal(dropdown, portalRoot);
      })()}
    </div>
  );
}
