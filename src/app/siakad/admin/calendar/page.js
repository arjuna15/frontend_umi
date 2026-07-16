"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ModalShell from '../../components/ModalShell';
import CustomSelect from '../../components/CustomSelect';
import SkeletonLoader from '../../components/SkeletonLoader';
import CustomDatePicker from '../../components/CustomDatePicker';
import CustomTimePicker from '../../components/CustomTimePicker';


export default function AdminCalendarPage() {
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [schedules, setSchedules] = useState([]);
  const [overrides, setOverrides] = useState([]);
  const [events, setEvents] = useState([]);
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
  
  const [rooms, setRooms] = useState([]);
  
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    course_id: '',
    hari: 'Senin',
    jamMulai: '08:00',
    jamSelesai: '10:00',
    ruang: '',
    editMode: 'permanent',
    newDate: ''
  });

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
  const getToken = () => localStorage.getItem('siakad_token');

  const fetchRooms = async () => {
    const token = getToken();
    if (!token) return;
    try {
      const res = await fetch(`${apiUrl}/siakad/rooms`, {
        headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' }
      });
      if (res.ok) {
        const data = await res.json();
        setRooms(data || []);
      }
    } catch (e) {
      console.error(e);
    }
  };


  const fetchCalendarData = async () => {
    const token = getToken();
    if (!token) return router.push('/siakad/login');
    setLoading(true);
    try {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;
      const res = await fetch(`${apiUrl}/siakad/schedules/calendar?year=${year}&month=${month}`, {
        headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' }
      });
      if (!res.ok) throw new Error('Failed to fetch calendar');
      const payload = await res.json();
      setEvents(payload.events || []);
      setSchedules(payload.schedules || []);
      setOverrides(payload.overrides || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCalendarData().then(() => {
      const year = currentDate.getFullYear();
      const today = new Date();
      if (today.getFullYear() === year && today.getMonth() === currentDate.getMonth()) {
        setSelectedDay(today.getDate());
      } else {
        setSelectedDay(1);
      }
    });
  }, [currentDate.getFullYear(), currentDate.getMonth(), router]);

  useEffect(() => {
    fetchRooms();
  }, []);


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

  const handleSaveSchedule = async () => {
    if (!editForm.course_id || !editForm.jamMulai || !editForm.jamSelesai || !editForm.ruang) {
      window.toast?.('Harap lengkapi semua isian jadwal!');
      return;
    }
    if (editForm.editMode === 'permanent' && !editForm.hari) {
      window.toast?.('Harap lengkapi semua isian jadwal!');
      return;
    }
    setSaving(true);
    try {
      const yr = currentDate.getFullYear();
      const mo = currentDate.getMonth();
      const dateStr = selectedDay ? `${yr}-${String(mo + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}` : '';

      let res;
      if (editForm.editMode === 'session') {
        res = await fetch(`${apiUrl}/siakad/schedules/override`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getToken()}`,
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            original_schedule_id: editForm.course_id,
            override_date: dateStr,
            status: 'moved',
            new_date: dateStr,
            new_time: `${editForm.jamMulai} - ${editForm.jamSelesai}`,
            notes: `Reschedule sesi: Jam diubah menjadi ${editForm.jamMulai} - ${editForm.jamSelesai}, Ruang: ${editForm.ruang}`
          })
        });
      } else {
        res = await fetch(`${apiUrl}/siakad/kaprodi/courses/${editForm.course_id}/schedule`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getToken()}`,
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            hari: editForm.hari,
            jamMulai: editForm.jamMulai,
            jamSelesai: editForm.jamSelesai,
            ruang: editForm.ruang
          })
        });
      }
      if (res.ok) {
        window.toast?.(editForm.editMode === 'session' ? 'Jadwal sesi tanggal ini berhasil diubah!' : 'Jadwal perkuliahan berhasil diperbarui secara permanen!');
        setShowEditModal(false);
        fetchCalendarData();
      } else {
        const errJson = await res.json().catch(() => ({}));
        window.toast?.('Gagal: ' + (errJson.message || 'Gagal memperbarui jadwal.'));
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
    return events
      .filter(e => e.date === dateStr)
      .map(e => ({
        id: e.course_id,
        title: e.course_name,
        time: e.time,
        room: e.room,
        lecturer: e.dosen,
        type: e.status === 'swapped' || e.status === 'swapped_here' || e.status === 'moved_here' ? 'swap' : 'regular',
        notes: e.notes
      }));
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
      <style dangerouslySetInnerHTML={{__html: `
        .calendar-responsive-container {
          display: grid;
          grid-template-columns: 1fr;
          gap: 24px;
          padding: 16px;
          align-items: start;
        }
        @media (min-width: 768px) {
          .calendar-responsive-container {
            grid-template-columns: 1.2fr 0.8fr;
            padding: 24px;
          }
        }
        .day-cell {
          aspect-ratio: 1;
          width: 100%;
          margin: 0 auto;
          border-radius: 10px;
          border: 1px solid var(--color-border);
          background: rgba(128,128,128,0.06);
          cursor: pointer;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 6px;
          position: relative;
          transition: all 0.15s ease;
          box-sizing: border-box;
        }
        @media (max-width: 480px) {
          .day-cell {
            padding: 4px;
            border-radius: 8px;
            max-width: 40px;
            height: 40px;
            aspect-ratio: 1;
          }
          .day-cell span {
            font-size: 0.8rem !important;
          }
        }
        .calendar-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 6px;
          width: 100%;
        }
        @media (max-width: 480px) {
          .calendar-grid {
            max-width: 320px;
            margin: 0 auto;
          }
        }
      `}} />

      <div className="siakad-page-header">
        <div className="siakad-page-header-glow"></div>
        <div className="siakad-page-header-grid"></div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', margin: '0 0 8px 0', letterSpacing: '0.1em', textTransform: 'uppercase' }}>SIAKAD — AKADEMIK</p>
          <h1 style={{ color: 'white', fontSize: '2.2rem', fontWeight: '800', margin: '0 0 8px 0', letterSpacing: '-0.03em' }}>Kalender Akademik</h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', margin: 0 }}>Kelola, pantau, dan lakukan swap penukaran jadwal kuliah harian secara fleksibel.</p>
        </div>
      </div>

      <div className="calendar-responsive-container">
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
          <div className="calendar-grid" style={{ textAlign: 'center', marginBottom: '8px' }}>
            {['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'].map(d => (
              <span key={d} style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--color-muted)', textTransform: 'uppercase' }}>{d}</span>
            ))}
          </div>

          {/* Grid Tanggal */}
          <div className="calendar-grid">
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
                  className={item.day ? "day-cell" : ""}
                  style={{
                    border: item.day ? (isSelected ? '2px solid #3b82f6' : undefined) : 'none',
                    background: item.day ? (isSelected ? 'rgba(59,130,246,0.1)' : (isToday ? 'rgba(128,128,128,0.2)' : undefined)) : 'transparent',
                    cursor: item.day ? 'pointer' : 'default',
                    pointerEvents: item.day ? 'auto' : 'none',
                    aspectRatio: '1',
                  }}
                >
                  <span style={{ fontSize: '0.9rem', fontWeight: isToday || isSelected ? '700' : 'normal', color: item.day ? (isSelected ? '#3b82f6' : 'var(--color-text)') : 'transparent' }}>{item.day}</span>
                  
                  {/* Indicators */}
                  <div style={{ display: 'flex', gap: '4px', justifyContent: 'center' }}>
                    {item.day && hasClass && (
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
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 'bold', color: 'var(--color-text)' }}>{agenda.title}</h4>
                  {agenda.type === 'regular' && (
                    <button
                      onClick={() => {
                        const originalCourse = schedules.find(s => s.id === agenda.id);
                        setEditForm({
                          course_id: agenda.id,
                          hari: originalCourse?.hari || 'Senin',
                          jamMulai: originalCourse?.jam_mulai || '08:00',
                          jamSelesai: originalCourse?.jam_selesai || '10:00',
                          ruang: originalCourse?.ruang || '',
                          editMode: 'permanent'
                        });
                        setShowEditModal(true);
                      }}
                      style={{
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '50%',
                        width: '28px', height: '28px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'var(--color-text)', cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                      title="Ubah Jadwal Permanen"
                    >
                      <i className="ph ph-pencil-simple" style={{ fontSize: '0.95rem' }}></i>
                    </button>
                  )}
                </div>
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

      {showEditModal && (
        <ModalShell title={editForm.editMode === 'session' ? `Ubah Jadwal Sesi ${selectedDateStr}` : 'Ubah Jadwal Kuliah Permanen'} icon="ph-calendar" onClose={() => setShowEditModal(false)} footer={
          <>
            <button onClick={() => setShowEditModal(false)} style={{ padding: '10px 20px', border: 'none', background: 'transparent', color: 'var(--color-text)', cursor: 'pointer', fontWeight: '600' }}>Batal</button>
            <button onClick={handleSaveSchedule} disabled={saving} className="siakad-btn-primary" style={{ padding: '10px 24px' }}>
              {saving ? 'Menyimpan...' : (editForm.editMode === 'session' ? 'Terapkan untuk Sesi Ini' : 'Simpan Permanen')}
            </button>
          </>
        }>
          <div style={{ marginBottom: '20px', padding: '14px', borderRadius: '14px', background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.15)' }}>
            <p style={{ margin: '0 0 10px 0', fontSize: '0.85rem', fontWeight: '700', color: 'var(--color-text)' }}>Cakupan Perubahan</p>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--color-text)' }}>
              <input type="radio" name="editMode" checked={editForm.editMode === 'permanent'} onChange={() => setEditForm({ ...editForm, editMode: 'permanent' })} style={{ accentColor: '#3b82f6' }} />
              Ubah permanen untuk seluruh semester
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.85rem', color: 'var(--color-text)' }}>
              <input type="radio" name="editMode" checked={editForm.editMode === 'session'} onChange={() => setEditForm({ ...editForm, editMode: 'session' })} style={{ accentColor: '#f59e0b' }} />
              Hanya ubah untuk sesi tanggal {selectedDateStr || 'ini'} saja
            </label>
          </div>

          {editForm.editMode === 'permanent' && (
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: 'var(--color-muted)', fontWeight: '600' }}>Hari Mengajar</label>
            <CustomSelect
              value={editForm.hari}
              onChange={(val) => setEditForm({ ...editForm, hari: val })}
              placeholder="-- Pilih Hari --"
              options={[
                { value: 'Senin', label: 'Senin' },
                { value: 'Selasa', label: 'Selasa' },
                { value: 'Rabu', label: 'Rabu' },
                { value: 'Kamis', label: 'Kamis' },
                { value: 'Jumat', label: 'Jumat' },
                { value: 'Sabtu', label: 'Sabtu' },
                { value: 'Minggu', label: 'Minggu' }
              ]}
            />
          </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: 'var(--color-muted)', fontWeight: '600' }}>Jam Mulai</label>
              <input 
                type="text" 
                className="siakad-input" 
                value={editForm.jamMulai} 
                onChange={(e) => setEditForm({ ...editForm, jamMulai: e.target.value })} 
                placeholder="Contoh: 08:00" 
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: 'var(--color-muted)', fontWeight: '600' }}>Jam Selesai</label>
              <input 
                type="text" 
                className="siakad-input" 
                value={editForm.jamSelesai} 
                onChange={(e) => setEditForm({ ...editForm, jamSelesai: e.target.value })} 
                placeholder="Contoh: 10:30" 
              />
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: 'var(--color-muted)', fontWeight: '600' }}>Ruangan Kelas</label>
            <input 
              type="text" 
              className="siakad-input" 
              value={editForm.ruang} 
              onChange={(e) => setEditForm({ ...editForm, ruang: e.target.value })} 
              placeholder="Contoh: Ruang A.32" 
            />
          </div>
        </ModalShell>
      )}
    </div>
  );
}
