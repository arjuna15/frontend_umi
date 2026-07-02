"use client";
import React, { useState, useRef, useEffect } from 'react';

export default function CustomSelect({ name, options, value, onChange, placeholder = "Pilih...", disabled = false, style = {} }) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        triggerRef.current && !triggerRef.current.contains(event.target) &&
        (!dropdownRef.current || !dropdownRef.current.contains(event.target))
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.value === value);

  // Compute position synchronously from the trigger element
  const getDropdownPosition = () => {
    if (!triggerRef.current) return { position: 'fixed', top: 0, left: 0, width: 200, zIndex: 99999 };
    const rect = triggerRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const spaceBelow = viewportHeight - rect.bottom;
    const openUpward = spaceBelow < 260 && rect.top > 260;

    return {
      position: 'fixed',
      left: rect.left,
      width: rect.width,
      zIndex: 99999,
      ...(openUpward
        ? { bottom: viewportHeight - rect.top + 4 }
        : { top: rect.bottom + 4 }
      ),
    };
  };

  return (
    <div style={{ position: 'relative', width: '100%', ...style }}>
      {name && <input type="hidden" name={name} value={value || ''} />}

      {/* Trigger Button */}
      <div
        ref={triggerRef}
        onClick={() => !disabled && setIsOpen(prev => !prev)}
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

      {/* Dropdown — position:fixed so it escapes ALL parent overflow clipping */}
      {isOpen && (
        <div
          ref={dropdownRef}
          style={{
            ...getDropdownPosition(),
            background: 'var(--color-bg)',
            border: '1px solid var(--color-border)',
            borderRadius: '12px',
            boxShadow: '0 10px 25px -5px rgba(0,0,0,0.15), 0 8px 10px -6px rgba(0,0,0,0.1)',
            overflow: 'hidden',
          }}
        >
          <div style={{ maxHeight: '250px', overflowY: 'auto', padding: '8px' }}>
            {options.map((opt, idx) => (
              <div
                key={idx}
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = opt.value === value ? 'rgba(59,130,246,0.15)' : 'var(--glass-bg)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = opt.value === value ? 'rgba(59,130,246,0.1)' : 'transparent';
                }}
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
                  transition: 'all 0.15s ease',
                  userSelect: 'none',
                }}
              >
                {opt.icon && <i className={opt.icon} style={{ fontSize: '1.1rem' }} />}
                {opt.label}
                {opt.value === value && (
                  <i className="ph ph-check" style={{ marginLeft: 'auto', color: '#3b82f6' }} />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
