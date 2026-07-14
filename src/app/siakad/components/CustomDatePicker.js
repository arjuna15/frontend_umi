"use client";
import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { getPortalRoot } from './portalRoot';

const MONTHS_ID = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];

const DAYS_SHORT = ["Sn", "Sl", "Rb", "Km", "Jm", "Sb", "Mg"];

// Helper to format date object to YYYY-MM-DD
const formatDateString = (date) => {
  if (!date) return "";
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

// Helper to parse YYYY-MM-DD to Date object
const parseDateString = (str) => {
  if (!str) return new Date();
  const parts = str.split('-');
  if (parts.length !== 3) return new Date();
  return new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
};

// Helper to format date display in Indonesian (e.g., 10 Oktober 2026)
const formatDisplayDate = (str) => {
  if (!str) return "Pilih tanggal...";
  const date = parseDateString(str);
  return `${date.getDate()} ${MONTHS_ID[date.getMonth()]} ${date.getFullYear()}`;
};

export default function CustomDatePicker({ name, value, onChange, placeholder = "Pilih tanggal...", disabled = false, style = {} }) {
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState(null);
  const [mounted, setMounted] = useState(false);
  const triggerRef = useRef(null);

  // Calendar State
  const selectedDate = value ? parseDateString(value) : null;
  const [currentYear, setCurrentYear] = useState((selectedDate || new Date()).getFullYear());
  const [currentMonth, setCurrentMonth] = useState((selectedDate || new Date()).getMonth());

  // Year view state (quick jump)
  const [isYearSelectOpen, setIsYearSelectOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Sync state with value when value changes
  useEffect(() => {
    if (value) {
      const parsed = parseDateString(value);
      setCurrentYear(parsed.getFullYear());
      setCurrentMonth(parsed.getMonth());
    }
  }, [value]);

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;
    function handleClickOutside(e) {
      if (triggerRef.current && triggerRef.current.contains(e.target)) return;
      // Also prevent closing if clicked inside the portal dropdown
      const pickerPortal = document.getElementById('siakad-datepicker-portal');
      if (pickerPortal && pickerPortal.contains(e.target)) return;
      setIsOpen(false);
      setIsYearSelectOpen(false);
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
        width: 320, // fixed calendar width
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

  // Calendar calculations
  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => {
    // 0 is Sunday, 1 is Monday, etc. Adjust so Monday is 0
    let day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1;
  };

  const handlePrevMonth = (e) => {
    e.stopPropagation();
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(prev => prev - 1);
    } else {
      setCurrentMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = (e) => {
    e.stopPropagation();
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(prev => prev + 1);
    } else {
      setCurrentMonth(prev => prev + 1);
    }
  };

  const handleSelectDay = (dayNum, isCurrentMonth = true) => {
    let targetMonth = currentMonth;
    let targetYear = currentYear;
    
    if (!isCurrentMonth) {
      // If clicked day of previous month or next month
      if (dayNum > 20) { // Previous month
        if (currentMonth === 0) {
          targetMonth = 11;
          targetYear = currentYear - 1;
        } else {
          targetMonth = currentMonth - 1;
        }
      } else { // Next month
        if (currentMonth === 11) {
          targetMonth = 0;
          targetYear = currentYear + 1;
        } else {
          targetMonth = currentMonth + 1;
        }
      }
    }

    const date = new Date(targetYear, targetMonth, dayNum);
    onChange(formatDateString(date));
    setIsOpen(false);
  };

  const renderDays = () => {
    const days = [];
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDayIndex = getFirstDayOfMonth(currentYear, currentMonth);

    // Render days of previous month for padding
    const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    const daysInPrevMonth = getDaysInMonth(prevYear, prevMonth);

    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const dayNum = daysInPrevMonth - i;
      days.push({ day: dayNum, isCurrentMonth: false });
    }

    // Render current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ day: i, isCurrentMonth: true });
    }

    // Render days of next month for padding (to keep 6 rows = 42 cells)
    const remainingCells = 42 - days.length;
    for (let i = 1; i <= remainingCells; i++) {
      days.push({ day: i, isCurrentMonth: false });
    }

    return days.map((cell, idx) => {
      const isSelected = selectedDate && 
        selectedDate.getDate() === cell.day && 
        selectedDate.getMonth() === (cell.isCurrentMonth ? currentMonth : (cell.day > 20 ? (currentMonth === 0 ? 11 : currentMonth - 1) : (currentMonth === 11 ? 0 : currentMonth + 1))) &&
        selectedDate.getFullYear() === (cell.isCurrentMonth ? currentYear : (cell.day > 20 ? (currentMonth === 0 ? currentYear - 1 : currentYear) : (currentMonth === 11 ? currentYear + 1 : currentYear)));

      const isToday = !isSelected &&
        new Date().getDate() === cell.day && 
        new Date().getMonth() === (cell.isCurrentMonth ? currentMonth : (cell.day > 20 ? (currentMonth === 0 ? 11 : currentMonth - 1) : (currentMonth === 11 ? 0 : currentMonth + 1))) &&
        new Date().getFullYear() === (cell.isCurrentMonth ? currentYear : (cell.day > 20 ? (currentMonth === 0 ? currentYear - 1 : currentYear) : (currentMonth === 11 ? currentYear + 1 : currentYear)));

      return (
        <button
          key={idx}
          type="button"
          onClick={() => handleSelectDay(cell.day, cell.isCurrentMonth)}
          style={{
            height: '36px',
            width: '36px',
            border: 'none',
            borderRadius: '10px',
            background: isSelected ? 'linear-gradient(135deg, rgb(59, 130, 246) 0%, rgb(29, 78, 216) 100%)' : isToday ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
            color: isSelected ? 'white' : cell.isCurrentMonth ? 'var(--color-text)' : 'var(--color-muted)',
            fontWeight: isSelected || isToday ? 'bold' : 'normal',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.85rem',
            transition: 'all 0.15s ease',
            boxShadow: isSelected ? '0 4px 12px rgba(29, 78, 216, 0.3)' : 'none',
            border: isToday ? '1px solid rgba(59, 130, 246, 0.4)' : 'none',
          }}
          className="siakad-datepicker-day"
        >
          {cell.day}
        </button>
      );
    });
  };

  // Year quick selector years
  const startYear = 2020;
  const yearsList = Array.from({ length: 15 }, (_, i) => startYear + i);

  const dropdown = isOpen && (
    <>
      {/* Backdrop overlay for centered calendar */}
      <div 
        onClick={() => {
          setIsOpen(false);
          setIsYearSelectOpen(false);
        }}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.45)',
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
          zIndex: 9999998,
          animation: 'csFadeIn 0.2s ease-out'
        }}
      />
      <div
        id="siakad-datepicker-portal"
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '340px',
          zIndex: 9999999,
          background: 'rgba(255, 255, 255, 0.70)',
          border: '1px solid rgba(255, 255, 255, 0.45)',
          borderRadius: '24px',
          boxShadow: '0 24px 64px rgba(0, 0, 0, 0.35)',
          overflow: 'hidden',
          padding: '20px',
          animation: 'csModalIn 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
          backdropFilter: 'blur(30px) saturate(180%)',
          WebkitBackdropFilter: 'blur(30px) saturate(180%)',
        }}
      >
        <style>{`
          @keyframes csFadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes csModalIn {
            from { opacity: 0; transform: translate(-50%, -46%) scale(0.95); }
            to   { opacity: 1; transform: translate(-50%, -50%) scale(1); }
          }
          .siakad-datepicker-day:hover {
            background: rgba(59, 130, 246, 0.15) !important;
            color: rgb(29, 78, 216) !important;
            transform: scale(1.05);
          }
          .siakad-datepicker-nav-btn:hover {
            background: rgba(255, 255, 255, 0.25) !important;
            color: var(--color-text) !important;
          }
          .siakad-datepicker-year-item:hover {
            background: rgba(255, 255, 255, 0.25) !important;
          }
        `}</style>

      {/* Calendar Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
        <button 
          type="button" 
          onClick={handlePrevMonth} 
          className="siakad-datepicker-nav-btn"
          style={{ width: '32px', height: '32px', border: '1px solid var(--color-border)', borderRadius: '8px', background: 'transparent', color: 'var(--color-text)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.15s' }}
        >
          <i className="ph ph-caret-left" style={{ fontSize: '1rem' }} />
        </button>

        <button
          type="button"
          onClick={() => setIsYearSelectOpen(p => !p)}
          style={{
            border: 'none',
            background: 'transparent',
            color: 'var(--color-text)',
            fontWeight: 'bold',
            fontSize: '0.95rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 8px',
            borderRadius: '6px',
            transition: 'all 0.2s',
          }}
          className="siakad-datepicker-nav-btn"
        >
          {MONTHS_ID[currentMonth]} {currentYear}
          <i className={`ph ph-caret-${isYearSelectOpen ? 'up' : 'down'}`} style={{ fontSize: '0.8rem' }} />
        </button>

        <button 
          type="button" 
          onClick={handleNextMonth} 
          className="siakad-datepicker-nav-btn"
          style={{ width: '32px', height: '32px', border: '1px solid var(--color-border)', borderRadius: '8px', background: 'transparent', color: 'var(--color-text)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.15s' }}
        >
          <i className="ph ph-caret-right" style={{ fontSize: '1rem' }} />
        </button>
      </div>

      {isYearSelectOpen ? (
        /* Year Quick Selector View */
        <div style={{ height: '240px', overflowY: 'auto', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', padding: '4px' }}>
          {yearsList.map((y, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setCurrentYear(y);
                setIsYearSelectOpen(false);
              }}
              style={{
                padding: '10px',
                border: 'none',
                borderRadius: '8px',
                background: currentYear === y ? 'linear-gradient(135deg, #b91c1c 0%, #ef4444 100%)' : 'transparent',
                color: currentYear === y ? 'white' : 'var(--color-text)',
                fontWeight: currentYear === y ? 'bold' : 'normal',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
              className="siakad-datepicker-year-item"
            >
              {y}
            </button>
          ))}
        </div>
      ) : (
        /* Normal Calendar Grid View */
        <>
          {/* Weekday headers */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', textAlign: 'center', marginBottom: '8px' }}>
            {DAYS_SHORT.map((day, idx) => (
              <span key={idx} style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--color-muted)', textTransform: 'uppercase' }}>
                {day}
              </span>
            ))}
          </div>

          {/* Days Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', justifyItems: 'center' }}>
            {renderDays()}
          </div>

          {/* Footer Today Button */}
          <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button
              type="button"
              onClick={() => {
                const today = new Date();
                onChange(formatDateString(today));
                setIsOpen(false);
              }}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#ef4444',
                fontSize: '0.8rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                padding: '4px 8px',
                borderRadius: '6px',
              }}
              className="siakad-datepicker-nav-btn"
            >
              Hari Ini
            </button>
            <button
              type="button"
              onClick={() => {
                onChange("");
                setIsOpen(false);
              }}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--color-muted)',
                fontSize: '0.8rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                padding: '4px 8px',
                borderRadius: '6px',
              }}
              className="siakad-datepicker-nav-btn"
            >
              Hapus
            </button>
          </div>
        </>
      )}
      </div>
    </>
  );

  return (
    <div style={{ position: 'relative', ...style }}>
      {name && <input type="hidden" name={name} value={value || ""} />}
      <button
        ref={triggerRef}
        type="button"
        onClick={handleToggle}
        disabled={disabled}
        className="siakad-input"
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          color: value ? 'var(--color-text)' : 'var(--color-muted)',
          fontWeight: value ? '500' : 'normal',
          cursor: disabled ? 'not-allowed' : 'pointer',
          textAlign: 'left',
          transition: 'all 0.2s ease-out',
        }}
      >
        <span>{formatDisplayDate(value)}</span>
        <i className="ph ph-calendar" style={{ fontSize: '1.2rem', color: isOpen ? 'rgb(59, 130, 246)' : 'var(--color-muted)' }} />
      </button>

      {mounted && (() => {
        const portalRoot = getPortalRoot();
        return portalRoot && createPortal(dropdown, portalRoot);
      })()}
    </div>
  );
}
