"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ModalShell from '../../components/ModalShell';
import CustomSelect from '../../components/CustomSelect';
import SkeletonLoader from '../../components/SkeletonLoader';

export default function AdminCalendarPage() {
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [schedules, setSchedules] = useState([]);
  const [overrides, setOverrides] = useState([]);
  const [showSwapModal, setShowSwapModal] = useState(false);
  const [swapForm, setSwapForm] = useState({
    date: '',
    original_schedule_id: '',
    swapped_with_schedule_id: '',
    status: 'swapped',
    notes: ''
  });
  const [saving, setSaving] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
  const getToken = () => localStorage.getItem('siakad_token');

  useEffect(() => {
    const token = getToken();
    if (!token) return router.push('/siakad/login');

    const fetchCalendarData = async () => {
      setLoading(true);
      try {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth() + 1;
        const res = await fetch(`${apiUrl}/siakad/schedules/calendar?year=${year}&month=${month}`, {
          headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' }
        });
        if (!res.ok) throw new Error('Failed to fetch calendar');
        const payload = await res.json();
        setSchedules(payload.schedules || []);
        setOverrides(payload.overrides || []);
        
        // Default select today if in the current month
        const today = new Date();
        if (today.getFullYear() === year && today.getMonth() === currentDate.getMonth()) {
          setSelectedDay(today.getDate());
        } else {
          setSelectedDay(1);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchCalendarData();
  }, [currentDate, router]);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleSaveSwap = async () => {
    if (!swapForm.original_schedule_id || !swapForm.date) return;
    setSaving(true);
    try {
      const res = await fetch(`${apiUrl}/siakad/schedules/override`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`,
          'Accept': 'application/json'
        },
        body: JSON.stringify(swapForm)
      });
      if (res.ok) {
        window.toast?.('Jadwal berhasil ditukar/diberikan override!');
        setShowSwapModal(false);
        fetchCalendarData();
      } else {
        window.toast?.('Gagal menyimpan penukaran jadwal.');
      }
    } catch (e) {
      console.error(e);
      window.toast?.('Terjadi kesalahan koneksi.');
    } finally {
      setSaving(false);
    }
  };

  // Generate days in month grid
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDayIndex = new Date(year, month, 1).getDay(); // Day of week (0-6)
  const totalDays = new Date(year, month + 1, 0).getDate();

  const daysGrid = [];
  // Padding for start of month
  for (let i = 0; i < (firstDayIndex === 0 ? 6 : firstDayIndex - 1); i++) {
    daysGrid.push({ day: null, dateStr: '' });
  }
  for (let d = 1; d <= totalDays; d++) {
    const formattedDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    daysGrid.push({ day: d, dateStr: formattedDate });
  }

  // Get active schedule for day
  const getDayAgenda = (dateStr) => {
    if (!dateStr) return [];
    
    // Find active overrides on this date
    const dayOverrides = overrides.filter(o => o.override_date === dateStr);
    
    // Day of week mapping (1 = Monday, 5 = Friday, etc.)
    const dateObj = new Date(dateStr);
    let dayOfWeek = dateObj.getDay();
    if (dayOfWeek === 0) dayOfWeek = 7; // Sunday mapping to 7

    // Match recurring weekly classes on this day of week
    const dayWeeklySchedules = schedules.filter(s => parseInt(s.day_of_week) === dayOfWeek);
    
    const finalAgenda = [];

    // Filter weekly schedules that are NOT cancelled/swapped out by overrides
    dayWeeklySchedules.forEach(s => {
      const isOverridden = dayOverrides.some(o => o.original_schedule_id === s.id);
      if (!isOverridden) {
        finalAgenda.push({
          id: s.id,
          title: s.course_name || s.course?.name || 'Kuliah',
          time: s.start_time,
          room: s.room_name || s.room?.name || '-',
          lecturer: s.lecturer_name || s.lecturer?.name || '-',
          type: 'regular'
        });
      }
    });

    // Add swap additions
    dayOverrides.forEach(o => {
      if (o.status === 'swapped' && o.swapped_with_schedule) {
        const sw = o.swapped_with_schedule;
        finalAgenda.push({
          id: sw.id,
          title: sw.course_name || sw.course?.name || 'Kuliah Pengganti',
          time: o.new_time || sw.start_time,
          room: sw.room_name || sw.room?.name || '-',
          lecturer: sw.lecturer_name || sw.lecturer?.name || '-',
          type: 'swap',
          notes: o.notes
        });
      }
    });

    return finalAgenda;
  };

  const selectedDateStr = selectedDay ? `${year}-${String(month + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}` : '';
  const selectedDayAgenda = getDayAgenda(selectedDateStr);

  const monthsMap = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

  if (loading) return (
    <div style={{ padding: '24px' }}>
      <SkeletonLoader type="card" />
      <SkeletonLoader type="chart" />
    </div>
  );

  return (
    <div className="fade-in" style={{ paddingBottom: '40px' }}>
      <div className="siakad-page-header">
        <div className="siakad-page-header-glow"></div>
        <div className="siakad-page-header-grid"></div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', margin: '0 0 8px 0', letterSpacing: '0.1em', textTransform: 'uppercase' }}>SIAKAD — AKADEMIK</p>
          <h1 style={{ color: 'white', fontSize: '2.2rem', fontWeight: '800', margin: '0 0 8px 0', letterSpacing: '-0.03em' }}>Kalender Akademik</h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', margin: 0 }}>Kelola, pantau, dan lakukan swap penukaran jadwal kuliah harian secara fleksibel.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', padding: '24px' }}>
        {/* Kalender Bulanan */}
        <div className="siakad-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--color-text)', margin: 0 }}>{monthsMap[month]} {year}</h3>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={handlePrevMonth} style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--glass-bg)', border: '1px solid var(--color-border)', color: 'var(--color-text)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className="ph ph-caret-left"></i>
              </button>
              <button onClick={handleNextMonth} style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--glass-bg)', border: '1px solid var(--color-border)', color: 'var(--color-text)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className="ph ph-caret-right"></i>
              </button>
            </div>
          </div>

          {/* Days Name Header */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px', textAlign: 'center', marginBottom: '8px' }}>
            {['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'].map(d => (
              <span key={d} style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--color-muted)', textTransform: 'uppercase' }}>{d}</span>
            ))}
          </div>

          {/* Grid Tanggal */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px', flex: 1 }}>
            {daysGrid.map((item, idx) => {
              const isToday = new Date().toDateString() === new Date(item.dateStr).toDateString();
              const isSelected = selectedDay === item.day;
              const agenda = getDayAgenda(item.dateStr);
              const hasSwap = agenda.some(a => a.type === 'swap');
              const hasClass = agenda.length > 0;

              return (
                <div
                  key={idx}
                  onClick={() => item.day && setSelectedDay(item.day)}
                  style={{
                    aspectRatio: '1',
                    borderRadius: '12px',
                    border: isSelected ? '2px solid #3b82f6' : '1px solid var(--color-border)',
                    background: isSelected ? 'rgba(59,130,246,0.1)' : (isToday ? 'rgba(128,128,128,0.2)' : 'rgba(128,128,128,0.06)'),
                    cursor: item.day ? 'pointer' : 'default',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    padding: '8px',
                    position: 'relative',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <span style={{ fontSize: '0.9rem', fontWeight: isToday || isSelected ? '700' : 'normal', color: item.day ? (isSelected ? '#3b82f6' : 'var(--color-text)') : 'transparent' }}>{item.day}</span>
                  
                  {/* Indicators */}
                  <div style={{ display: 'flex', gap: '4px', justifyContent: 'center' }}>
                    {hasClass && (
                      <span style={{
                        width: '6px', height: '6px', borderRadius: '50%',
                        background: hasSwap ? '#f59e0b' : '#3b82f6',
                        boxShadow: `0 0 6px ${hasSwap ? '#f59e0b' : '#3b82f6'}`
                      }} />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Panel Detail Harian */}
        <div className="siakad-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid var(--color-border)', paddingBottom: '12px' }}>
            <div>
              <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--color-muted)', fontWeight: '600' }}>AGENDA HARIAN</p>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--color-text)', margin: '2px 0 0 0' }}>
                {selectedDay ? `${selectedDay} ${monthsMap[month]} ${year}` : 'Pilih Tanggal'}
              </h3>
            </div>
            {selectedDay && (
              <button 
                id="btn-trigger-swap"
                onClick={() => {
                  setSwapForm({ ...swapForm, date: selectedDateStr });
                  setShowSwapModal(true);
                }} 
                className="siakad-btn-primary" 
                style={{ padding: '8px 16px', fontSize: '0.8rem' }}
              >
                <i className="ph ph-shuffle"></i> Swap Kelas
              </button>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1, overflowY: 'auto' }}>
            {selectedDayAgenda.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--color-muted)' }}>
                <i className="ph ph-calendar-blank" style={{ fontSize: '3rem', opacity: 0.3, marginBottom: '8px', display: 'block' }}></i>
                Belum ada jadwal kuliah terdaftar di hari ini.
              </div>
            ) : selectedDayAgenda.map((agenda, index) => (
              <div 
                key={index} 
                style={{ 
                  padding: '16px', 
                  borderRadius: '16px', 
                  background: 'var(--glass-bg)', 
                  borderLeft: `4px solid ${agenda.type === 'swap' ? '#f59e0b' : '#3b82f6'}`,
                  borderTop: '1px solid var(--color-border)',
                  borderRight: '1px solid var(--color-border)',
                  borderBottom: '1px solid var(--color-border)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: '700', padding: '2px 8px', borderRadius: '10px', background: agenda.type === 'swap' ? 'rgba(245,158,11,0.15)' : 'rgba(59,130,246,0.15)', color: agenda.type === 'swap' ? '#f59e0b' : '#3b82f6' }}>
                    {agenda.type === 'swap' ? 'Jadwal Dialihkan (Swap)' : 'Jadwal Mingguan'}
                  </span>
                  <span style={{ fontSize: '0.82rem', fontFamily: 'monospace', color: 'white', fontWeight: 'bold' }}>{agenda.time}</span>
                </div>
                <h4 style={{ margin: '0 0 6px 0', fontSize: '1rem', fontWeight: 'bold', color: 'white' }}>{agenda.title}</h4>
                <p style={{ margin: '0 0 4px 0', fontSize: '0.85rem', color: 'var(--color-muted)' }}><i className="ph ph-user"></i> {agenda.lecturer}</p>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-muted)' }}><i className="ph ph-door"></i> Ruang {agenda.room}</p>
                {agenda.notes && <p style={{ margin: '6px 0 0 0', padding: '6px 10px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', fontSize: '0.8rem', color: '#f59e0b' }}><strong>Info:</strong> {agenda.notes}</p>}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal Swap Kelas */}
      {showSwapModal && (
        <ModalShell title="Swap Penukaran Jadwal" icon="ph-shuffle" onClose={() => setShowSwapModal(false)} footer={
          <>
            <button onClick={() => setShowSwapModal(false)} style={{ padding: '10px 20px', border: 'none', background: 'transparent', color: 'var(--color-text)', cursor: 'pointer', fontWeight: '600' }}>Batal</button>
            <button onClick={handleSaveSwap} disabled={saving} className="siakad-btn-primary" style={{ padding: '10px 24px' }}>
              {saving ? 'Menyimpan...' : 'Terapkan Swap'}
            </button>
          </>
        }>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: 'var(--color-muted)', fontWeight: '600' }}>Tanggal Penukaran</label>
            <input type="text" className="siakad-input" value={swapForm.date} disabled />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: 'var(--color-muted)', fontWeight: '600' }}>Kelas Asli (Yang Ingin Digeser)</label>
            <CustomSelect
              value={swapForm.original_schedule_id}
              onChange={(val) => setSwapForm({ ...swapForm, original_schedule_id: val })}
              placeholder="-- Pilih Kelas Asli --"
              options={schedules.map(s => ({
                value: s.id,
                label: `${s.course_name || s.course?.name || 'Kuliah'} (${s.start_time} - Ruang ${s.room_name || s.room?.name || '-'})`
              }))}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: 'var(--color-muted)', fontWeight: '600' }}>Ditukar Dengan Kelas</label>
            <CustomSelect
              value={swapForm.swapped_with_schedule_id}
              onChange={(val) => setSwapForm({ ...swapForm, swapped_with_schedule_id: val })}
              placeholder="-- Pilih Kelas Pengganti --"
              options={schedules.map(s => ({
                value: s.id,
                label: `${s.course_name || s.course?.name || 'Kuliah'} (${s.start_time} - Ruang ${s.room_name || s.room?.name || '-'})`
              }))}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: 'var(--color-muted)', fontWeight: '600' }}>Catatan / Keterangan Swap</label>
            <textarea
              className="siakad-input"
              value={swapForm.notes}
              onChange={(e) => setSwapForm({ ...swapForm, notes: e.target.value })}
              placeholder="Contoh: Pertemuan diganti karena tanggal merah"
              rows={3}
              style={{ resize: 'vertical' }}
            />
          </div>
        </ModalShell>
      )}
    </div>
  );
}
