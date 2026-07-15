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

// Helper to format date display in Indonesian
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
        width: 640, // 2 months width
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

  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  
  const getFirstDayOfMonth = (year, month) => {
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

  const handleSelectDay = (dayNum, monthOffset) => {
    let targetMonth = currentMonth + monthOffset;
    let targetYear = currentYear;

    if (targetMonth > 11) {
      targetMonth = 0;
      targetYear += 1;
    } else if (targetMonth < 0) {
      targetMonth = 11;
      targetYear -= 1;
    }

    const date = new Date(targetYear, targetMonth, dayNum);
    onChange(formatDateString(date));
    setIsOpen(false);
  };

  const renderDaysForMonth = (year, month, monthOffset) => {
    const days = [];
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayIndex = getFirstDayOfMonth(year, month);

    // Padding previous month
    const prevMonth = month === 0 ? 11 : month - 1;
    const prevYear = month === 0 ? year - 1 : year;
    const daysInPrevMonth = getDaysInMonth(prevYear, prevMonth);

    for (let i = firstDayIndex - 1; i >= 0; i--) {
      days.push({ day: daysInPrevMonth - i, isCurrentMonth: false });
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ day: i, isCurrentMonth: true });
    }

    // Padding next month
    const remainingCells = 42 - days.length;
    for (let i = 1; i <= remainingCells; i++) {
      days.push({ day: i, isCurrentMonth: false });
    }

    return days.map((cell, idx) => {
      const isSelected = selectedDate && 
        selectedDate.getDate() === cell.day && 
        selectedDate.getMonth() === (cell.isCurrentMonth ? month : (cell.day > 20 ? prevMonth : (month === 11 ? 0 : month + 1))) &&
        selectedDate.getFullYear() === (cell.isCurrentMonth ? year : (cell.day > 20 ? prevYear : (month === 11 ? year + 1 : year)));

      const isToday = !isSelected &&
        new Date().getDate() === cell.day && 
        new Date().getMonth() === (cell.isCurrentMonth ? month : (cell.day > 20 ? prevMonth : (month === 11 ? 0 : month + 1))) &&
        new Date().getFullYear() === (cell.isCurrentMonth ? year : (cell.day > 20 ? prevYear : (month === 11 ? year + 1 : year)));

      return (
        <button
          key={idx}
          type="button"
          onClick={() => handleSelectDay(cell.day, cell.isCurrentMonth ? monthOffset : (cell.day > 20 ? monthOffset - 1 : monthOffset + 1))}
          style={{
            height: '34px',
            width: '34px',
            border: 'none',
            borderRadius: '50px',
            background: isSelected ? 'linear-gradient(135deg, #C41E3A 0%, #9b1c2e 100%)' : isToday ? 'rgba(196, 30, 58, 0.15)' : 'transparent',
            color: isSelected ? 'white' : cell.isCurrentMonth ? 'var(--color-text)' : 'var(--color-muted)',
            fontWeight: isSelected || isToday ? 'bold' : 'normal',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.82rem',
            transition: 'all 0.15s ease',
            boxShadow: isSelected ? '0 4px 10px rgba(196, 30, 58, 0.25)' : 'none',
            border: isToday ? '1px solid rgba(196, 30, 58, 0.4)' : 'none',
          }}
          className="siakad-datepicker-day"
        >
          {cell.day}
        </button>
      );
    });
  };

  const startYear = 2020;
  const yearsList = Array.from({ length: 15 }, (_, i) => startYear + i);

  // Month offset math for double month
  const nextMonthNum = currentMonth === 11 ? 0 : currentMonth + 1;
  const nextMonthYear = currentMonth === 11 ? currentYear + 1 : currentYear;

  const dropdown = isOpen && (
    <>
      <div 
        onClick={() => {
          setIsOpen(false);
          setIsYearSelectOpen(false);
        }}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.55)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
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
          width: '90%',
          maxWidth: '680px',
          zIndex: 9999999,
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: '24px',
          boxShadow: '0 24px 64px rgba(0, 0, 0, 0.5)',
          overflow: 'hidden',
          padding: '24px',
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
            background: rgba(196, 30, 58, 0.15) !important;
            color: #C41E3A !important;
            transform: scale(1.05);
          }
          .siakad-datepicker-nav-btn:hover {
            background: var(--glass-bg) !important;
            color: var(--color-text) !important;
          }
          .siakad-datepicker-year-item:hover {
            background: var(--glass-bg) !important;
          }
        `}</style>

        {/* Calendar Navigation Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <button 
            type="button" 
            onClick={handlePrevMonth} 
            className="siakad-datepicker-nav-btn"
            style={{ width: '36px', height: '36px', border: '1px solid var(--color-border)', borderRadius: '10px', background: 'transparent', color: 'var(--color-text)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.15s' }}
          >
            <i className="ph ph-caret-left" style={{ fontSize: '1.2rem' }} />
          </button>

          <button
            type="button"
            onClick={() => setIsYearSelectOpen(p => !p)}
            style={{
              border: 'none',
              background: 'transparent',
              color: 'var(--color-text)',
              fontWeight: '800',
              fontSize: '1.05rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '8px',
              transition: 'all 0.2s',
            }}
            className="siakad-datepicker-nav-btn"
          >
            {MONTHS_ID[currentMonth]} {currentYear} & {MONTHS_ID[nextMonthNum]} {nextMonthYear}
            <i className={`ph ph-caret-${isYearSelectOpen ? 'up' : 'down'}`} style={{ fontSize: '0.9rem' }} />
          </button>

          <button 
            type="button" 
            onClick={handleNextMonth} 
            className="siakad-datepicker-nav-btn"
            style={{ width: '36px', height: '36px', border: '1px solid var(--color-border)', borderRadius: '10px', background: 'transparent', color: 'var(--color-text)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.15s' }}
          >
            <i className="ph ph-caret-right" style={{ fontSize: '1.2rem' }} />
          </button>
        </div>

        {isYearSelectOpen ? (
          /* Year Quick Selector */
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
                  padding: '12px',
                  border: 'none',
                  borderRadius: '12px',
                  background: currentYear === y ? 'linear-gradient(135deg, #C41E3A 0%, #9b1c2e 100%)' : 'transparent',
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
          /* Double Calendar Grid View */
          <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap', justifyContent: 'center' }}>
            {/* Month 1: Current Month */}
            <div style={{ flex: '1 1 280px', minWidth: '280px' }}>
              <div style={{ textAlign: 'center', fontWeight: '800', color: 'var(--color-text)', fontSize: '0.95rem', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {MONTHS_ID[currentMonth]} {currentYear}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', textAlign: 'center', marginBottom: '8px' }}>
                {DAYS_SHORT.map((day, idx) => (
                  <span key={idx} style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--color-muted)', textTransform: 'uppercase' }}>
                    {day}
                  </span>
                ))}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', justifyItems: 'center' }}>
                {renderDaysForMonth(currentYear, currentMonth, 0)}
              </div>
            </div>

            {/* Month 2: Next Month */}
            <div style={{ flex: '1 1 280px', minWidth: '280px' }}>
              <div style={{ textAlign: 'center', fontWeight: '800', color: 'var(--color-text)', fontSize: '0.95rem', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {MONTHS_ID[nextMonthNum]} {nextMonthYear}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', textAlign: 'center', marginBottom: '8px' }}>
                {DAYS_SHORT.map((day, idx) => (
                  <span key={idx} style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--color-muted)', textTransform: 'uppercase' }}>
                    {day}
                  </span>
                ))}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', justifyItems: 'center' }}>
                {renderDaysForMonth(nextMonthYear, nextMonthNum, 1)}
              </div>
            </div>
          </div>
        )}

        {/* Footer actions */}
        <div style={{ marginTop: '20px', paddingTop: '14px', borderTop: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            type="button"
            onClick={() => {
              const today = new Date();
              onChange(formatDateString(today));
              setIsOpen(false);
            }}
            style={{
              background: 'transparent',
              border: '1px solid var(--color-border)',
              color: 'var(--color-text)',
              fontSize: '0.8rem',
              fontWeight: '700',
              cursor: 'pointer',
              padding: '8px 16px',
              borderRadius: '50px',
              transition: 'all 0.2s',
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
              color: '#ef4444',
              fontSize: '0.8rem',
              fontWeight: '700',
              cursor: 'pointer',
              padding: '8px 16px',
              borderRadius: '50px',
            }}
          >
            Hapus
          </button>
        </div>
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
          boxShadow: isOpen ? '0 0 0 3px rgba(196, 30, 58, 0.15), 0 2px 4px rgba(0,0,0,0.02)' : 'none',
          borderColor: isOpen ? '#C41E3A' : 'var(--color-border)',
        }}
      >
        <span>{value ? formatDisplayDate(value) : placeholder}</span>
        <i className="ph ph-calendar" style={{ fontSize: '1.2rem', color: isOpen ? '#C41E3A' : 'var(--color-muted)' }} />
      </button>

      {mounted && (() => {
        const portalRoot = getPortalRoot();
        return portalRoot && createPortal(dropdown, portalRoot);
      })()}
    </div>
  );
}
