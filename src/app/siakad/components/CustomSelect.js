"use client";
import React, { useState, useRef, useEffect } from 'react';

export default function CustomSelect({ name, options, value, onChange, placeholder = "Pilih...", disabled = false, style = {} }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div ref={dropdownRef} style={{ position: 'relative', width: '100%', ...style }}>
      {name && <input type="hidden" name={name} value={value || ''} />}
      <div 
        onClick={() => !disabled && setIsOpen(!isOpen)}
        style={{
          padding: '12px 16px',
          background: disabled ? 'var(--glass-bg)' : 'var(--color-bg)',
          border: isOpen ? '2px solid #3b82f6' : '1px solid var(--color-border)',
          borderRadius: '12px',
          cursor: disabled ? 'not-allowed' : 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: isOpen ? '0 0 0 4px rgba(59, 130, 246, 0.1)' : '0 2px 4px rgba(0,0,0,0.02)',
          transition: 'all 0.2s ease',
          color: selectedOption ? 'var(--color-text)' : 'var(--color-muted)',
          fontWeight: '500',
          fontSize: '0.95rem'
        }}
      >
        <span>{selectedOption ? selectedOption.label : placeholder}</span>
        <i className={`ph ph-caret-${isOpen ? 'up' : 'down'}`} style={{ color: 'var(--color-text)', transition: 'transform 0.2s', transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}></i>
      </div>

      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          marginTop: '8px',
          background: 'var(--color-bg)',
          border: '1px solid var(--color-border)',
          borderRadius: '12px',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
          zIndex: 50,
          overflow: 'hidden',
          animation: 'dropdownFadeIn 0.2s ease-out'
        }}>
          <div style={{ maxHeight: '250px', overflowY: 'auto', padding: '8px' }}>
            {options.map((opt, idx) => (
              <div 
                key={idx}
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = opt.value === value ? 'rgba(59, 130, 246, 0.15)' : 'var(--glass-bg)';
                  e.currentTarget.style.color = opt.value === value ? '#3b82f6' : 'var(--color-text)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = opt.value === value ? 'rgba(59, 130, 246, 0.1)' : 'transparent';
                  e.currentTarget.style.color = opt.value === value ? '#3b82f6' : 'var(--color-text)';
                }}
                style={{
                  padding: '10px 14px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  background: opt.value === value ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                  color: opt.value === value ? '#3b82f6' : 'var(--color-text)',
                  fontWeight: opt.value === value ? '600' : '500',
                  transition: 'all 0.15s ease'
                }}
              >
                {opt.icon && <i className={opt.icon} style={{ fontSize: '1.1rem' }}></i>}
                {opt.label}
                {opt.value === value && <i className="ph ph-check" style={{ marginLeft: 'auto', color: 'var(--color-text)', fontWeight: 'bold' }}></i>}
              </div>
            ))}
          </div>
        </div>
      )}
      <style>{`
        @keyframes dropdownFadeIn {
          from { opacity: 0; transform: translateY(-10px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}
