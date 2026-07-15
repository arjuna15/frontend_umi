"use client";
import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { getPortalRoot } from './portalRoot';

export default function CustomTimePicker({ name, value, onChange, placeholder = "Pilih jam...", disabled = false, style = {} }) {
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState(null);
  const [mounted, setMounted] = useState(false);
  const triggerRef = useRef(null);

  // Parse current value or set default
  const timeStr = value || "08:00";
  const [hour, setHour] = useState(timeStr.split(':')[0] || "08");
  const [minute, setMinute] = useState(timeStr.split(':')[1] || "00");

  useEffect(() => {
    setMounted(true);
  }, []);

  // Sync state with value
  useEffect(() => {
    if (value && value.includes(':')) {
      const [h, m] = value.split(':');
      setHour(h);
      setMinute(m);
    }
  }, [value]);

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;
    function handleClickOutside(e) {
      if (triggerRef.current && triggerRef.current.contains(e.target)) return;
      const pickerPortal = document.getElementById('siakad-timepicker-portal');
      if (pickerPortal && pickerPortal.contains(e.target)) return;
      setIsOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Update coords when open
  useEffect(() => {
    if (!isOpen || !triggerRef.current) return;
    const updatePosition = () => {
      if (!triggerRef.current) return;
      const rect = triggerRef.current.getBoundingClientRect();
      setCoords({
        top: rect.bottom + window.scrollY + 4,
        left: rect.left + window.scrollX,
        width: 220, // fixed timepicker width
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

  const handleHourSelect = (h) => {
    setHour(h);
    const newTime = `${h}:${minute}`;
    onChange(newTime);
  };

  const handleMinuteSelect = (m) => {
    setMinute(m);
    const newTime = `${hour}:${m}`;
    onChange(newTime);
  };

  // Generate hour (00-23) and minute (00-59) lists
  const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
  const minutes = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));

  const dropdown = coords && isOpen && (
    <div
      id="siakad-timepicker-portal"
      style={{
        position: 'absolute',
        top: coords.top,
        left: coords.left,
        width: coords.width,
        zIndex: 9999999,
        background: 'var(--color-bg)',
        border: '1px solid var(--color-border)',
        borderRadius: '16px',
        boxShadow: '0 10px 30px -10px rgba(0,0,0,0.3)',
        overflow: 'hidden',
        padding: '12px',
        animation: 'csDropIn 0.15s ease-out',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}
    >
      <style>{`
        @keyframes csDropIn {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .siakad-time-scroll-col::-webkit-scrollbar {
          width: 4px;
        }
        .siakad-time-scroll-col::-webkit-scrollbar-thumb {
          background: var(--color-border);
          border-radius: 4px;
        }
        .siakad-time-item:hover {
          background: var(--glass-bg);
          color: #ef4444 !important;
        }
      `}</style>

      {/* Dual Column Picker */}
      <div style={{ display: 'flex', gap: '8px', height: '180px' }}>
        {/* Hour Column */}
        <div 
          className="siakad-time-scroll-col"
          style={{ 
            flex: 1, 
            overflowY: 'auto', 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '4px',
            paddingRight: '4px'
          }}
        >
          <div style={{ fontSize: '0.7rem', fontWeight: 'bold', color: 'var(--color-muted)', textAlign: 'center', marginBottom: '4px', textTransform: 'uppercase' }}>JAM</div>
          {hours.map((h, i) => {
            const isSelected = h === hour;
            return (
              <button
                key={i}
                type="button"
                onClick={() => handleHourSelect(h)}
                style={{
                  padding: '6px',
                  border: 'none',
                  borderRadius: '8px',
                  background: isSelected ? 'linear-gradient(135deg, #C41E3A 0%, #9b1c2e 100%)' : 'transparent',
                  color: isSelected ? 'white' : 'var(--color-text)',
                  fontWeight: isSelected ? 'bold' : 'normal',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  transition: 'all 0.15s'
                }}
                className="siakad-time-item"
              >
                {h}
              </button>
            );
          })}
        </div>

        {/* Divider */}
        <div style={{ width: '1px', background: 'var(--color-border)', height: '100%' }}></div>

        {/* Minute Column */}
        <div 
          className="siakad-time-scroll-col"
          style={{ 
            flex: 1, 
            overflowY: 'auto', 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '4px',
            paddingRight: '4px'
          }}
        >
          <div style={{ fontSize: '0.7rem', fontWeight: 'bold', color: 'var(--color-muted)', textAlign: 'center', marginBottom: '4px', textTransform: 'uppercase' }}>MENIT</div>
          {minutes.map((m, i) => {
            const isSelected = m === minute;
            return (
              <button
                key={i}
                type="button"
                onClick={() => handleMinuteSelect(m)}
                style={{
                  padding: '6px',
                  border: 'none',
                  borderRadius: '8px',
                  background: isSelected ? 'linear-gradient(135deg, #C41E3A 0%, #9b1c2e 100%)' : 'transparent',
                  color: isSelected ? 'white' : 'var(--color-text)',
                  fontWeight: isSelected ? 'bold' : 'normal',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  transition: 'all 0.15s'
                }}
                className="siakad-time-item"
              >
                {m}
              </button>
            );
          })}
        </div>
      </div>

      {/* Done Button */}
      <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid var(--color-border)', display: 'flex', justifyContent: 'flex-end' }}>
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          style={{
            background: 'linear-gradient(135deg, #C41E3A 0%, #9b1c2e 100%)',
            border: 'none',
            color: 'white',
            fontSize: '0.8rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            padding: '6px 12px',
            borderRadius: '8px',
            boxShadow: '0 4px 10px rgba(196, 30, 58, 0.2)'
          }}
        >
          Selesai
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ position: 'relative', ...style }}>
      {name && <input type="hidden" name={name} value={value || ""} />}
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
          padding: '12px 16px',
          borderRadius: '12px',
          border: '1px solid var(--color-border)',
          background: 'var(--color-bg)',
          color: value ? 'var(--color-text)' : 'var(--color-muted)',
          fontSize: '0.95rem',
          fontWeight: value ? '500' : 'normal',
          cursor: disabled ? 'not-allowed' : 'pointer',
          textAlign: 'left',
          outline: 'none',
          transition: 'all 0.2s ease-out',
          boxShadow: isOpen ? '0 0 0 3px rgba(185, 28, 28, 0.15), 0 2px 4px rgba(0,0,0,0.02)' : 'none',
          borderColor: isOpen ? '#ef4444' : 'var(--color-border)',
        }}
      >
        <span>{value ? `${value}` : placeholder}</span>
        <i className="ph ph-clock" style={{ fontSize: '1.2rem', color: isOpen ? '#ef4444' : 'var(--color-muted)' }} />
      </button>

      {mounted && (() => {
        const portalRoot = getPortalRoot();
        return portalRoot && createPortal(dropdown, portalRoot);
      })()}
    </div>
  );
}
