"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CustomSelect from '../../components/CustomSelect';
import CustomTimePicker from '../../components/CustomTimePicker';
import SkeletonLoader from '../../components/SkeletonLoader';
import ModalShell from '../../components/ModalShell';

const DAY_COLORS = {
  Senin: { bg: 'rgba(59,130,246,0.15)', color: '#3b82f6', border: 'rgba(59,130,246,0.3)' },
  Selasa: { bg: 'rgba(16,185,129,0.15)', color: '#10b981', border: 'rgba(16,185,129,0.3)' },
  Rabu: { bg: 'rgba(139,92,246,0.15)', color: '#8b5cf6', border: 'rgba(139,92,246,0.3)' },
  Kamis: { bg: 'rgba(245,158,11,0.15)', color: '#f59e0b', border: 'rgba(245,158,11,0.3)' },
  Jumat: { bg: 'rgba(239,68,68,0.15)', color: '#ef4444', border: 'rgba(239,68,68,0.3)' },
  Sabtu: { bg: 'rgba(6,182,212,0.15)', color: '#06b6d4', border: 'rgba(6,182,212,0.3)' },
};

export default function JadwalPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('pengaturan'); // 'pengaturan' or 'kalender'
  const [courses, setCourses] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ day: '', start_time: '', end_time: '', room: '', frequency: 'every_week' });
  const [saving, setSaving] = useState(false);

  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    course_id: '',
    hari: 'Senin',
    jamMulai: '08:00',
    jamSelesai: '10:00',
    ruang: '',
    frequency: 'every_week',
    editMode: 'permanent'
  });

  // Calendar State
  const [currentDate, setCurrentDate] = useState(new Date());
  const [overrides, setOverrides] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
  const getToken = () => localStorage.getItem('siakad_token');

  const handleSaveFromCalendar = async () => {
    if (!editForm.course_id || !editForm.jamMulai || !editForm.jamSelesai || !editForm.ruang) {
      window.toast && window.toast('Harap lengkapi semua isian jadwal!');
      return;
    }
    if (editForm.editMode === 'permanent' && !editForm.hari) {
      window.toast && window.toast('Harap lengkapi semua isian jadwal!');
      return;
    }
    setSaving(true);
    const token = getToken();
    try {
      if (editForm.editMode === 'session') {
        const yr = currentDate.getFullYear();
        const mo = currentDate.getMonth();
        const dateStr = selectedDay ? `${yr}-${String(mo + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}` : '';
        const res = await fetch(`${apiUrl}/siakad/schedules/override`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            original_schedule_id: editForm.course_id,
            override_date: dateStr,
            status: 'moved',
            new_date: dateStr,
            new_time: `${editForm.jamMulai} - ${editForm.jamSelesai}`,
            notes: `Reschedule sesi: Jam diubah menjadi ${editForm.jamMulai} - ${editForm.jamSelesai}, Ruang: ${editForm.ruang}`
          })
        });
        if (res.ok) {
          window.toast && window.toast('Jadwal sesi tanggal ini berhasil diubah!');
          setShowEditModal(false);
          fetchCourses();
          fetchOverrides();
        } else {
          const err = await res.json();
          window.toast && window.toast('Gagal: ' + (err.message || 'Error'));
        }
      } else {
        const res = await fetch(`${apiUrl}/siakad/dosen/jadwal/update`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            course_id: editForm.course_id,
            day: editForm.hari,
            start_time: editForm.jamMulai,
            end_time: editForm.jamSelesai,
            room: editForm.ruang,
            frequency: editForm.frequency
          })
        });
        if (res.ok) {
          window.toast && window.toast('Jadwal mengajar berhasil diperbarui!');
          setShowEditModal(false);
          fetchCourses();
        } else {
          const err = await res.json();
          window.toast && window.toast('Gagal: ' + (err.message || 'Error'));
        }
      }
    } catch (err) {
      window.toast && window.toast('Error: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const fetchCourses = async () => {
    const token = getToken();
    if (!token) return router.push('/siakad/login');
    try {
      const res = await fetch(`${apiUrl}/siakad/dosen/roster`, { headers: { 'Authorization': `Bearer ${token}` } });
      if (res.ok) {
        const result = await res.json();
        setCourses(result.courses || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchClassrooms = async () => {
    const token = getToken();
    if (!token) return;
    try {
      const res = await fetch(`${apiUrl}/siakad/admin/classrooms`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setClassrooms(data || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchOverrides = async () => {
    const token = getToken();
    if (!token) return;
    try {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;
      const res = await fetch(`${apiUrl}/siakad/schedules/calendar?year=${year}&month=${month}`, {
        headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' }
      });
      if (res.ok) {
        const payload = await res.json();
        setOverrides(payload.overrides || []);
      }
      
      const today = new Date();
      if (today.getFullYear() === year && today.getMonth() === currentDate.getMonth()) {
        setSelectedDay(today.getDate());
      } else {
        setSelectedDay(1);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchCourses();
    fetchClassrooms();
    fetchOverrides();
  }, [currentDate.getFullYear(), currentDate.getMonth()]);



  const handleEdit = (course) => {
    setEditingId(course.id);
    setFormData({
      day: course.hari || '',
      start_time: course.jam_mulai || '',
      end_time: course.jam_selesai || '',
      room: course.ruangan || course.ruang || '',
      frequency: course.frequency || 'every_week'
    });
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({ day: '', start_time: '', end_time: '', room: '', frequency: 'every_week' });
  };

  const handleSave = async (courseId) => {
    setSaving(true);
    const token = getToken();
    try {
      const res = await fetch(`${apiUrl}/siakad/dosen/jadwal/update`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ course_id: courseId, ...formData })
      });
      if (res.ok) {
        window.toast && window.toast('Jadwal berhasil diperbarui!');
        setEditingId(null);
        fetchCourses();
      } else {
        const err = await res.json();
        window.toast && window.toast('Gagal: ' + (err.message || 'Error'));
      }
    } catch (err) {
      window.toast && window.toast('Error: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  // Generate days in month grid
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDayIndex = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();

  const daysGrid = [];
  for (let i = 0; i < (firstDayIndex === 0 ? 6 : firstDayIndex - 1); i++) {
    daysGrid.push({ day: null, dateStr: '' });
  }
  for (let d = 1; d <= totalDays; d++) {
    const formattedDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    daysGrid.push({ day: d, dateStr: formattedDate });
  }

  // Get active schedule for day for this lecturer
  const getDayAgenda = (dateStr) => {
    if (!dateStr) return [];
    const dayOverrides = overrides.filter(o => o.override_date === dateStr);
    
    const dateObj = new Date(dateStr);
    let dayOfWeek = dateObj.getDay();
    if (dayOfWeek === 0) dayOfWeek = 7;

    // Calculate ISO-8601 week number
    const getWeekNumber = (d) => {
      const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
      const dayNum = date.getUTCDay() || 7;
      date.setUTCDate(date.getUTCDate() + 4 - dayNum);
      const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
      return Math.ceil((((date - yearStart) / 86400000) + 1) / 7);
    };

    const weekNum = getWeekNumber(dateObj);
    const isOddWeek = (weekNum % 2) !== 0;

    // Filter lecturer's own course schedules
    const dayWeeklySchedules = courses.filter(s => {
      // Map day name to day of week index (Senin = 1, Minggu = 7)
      const dayMap = { 'Senin': 1, 'Selasa': 2, 'Rabu': 3, 'Kamis': 4, 'Jumat': 5, 'Sabtu': 6, 'Minggu': 7 };
      const matchDay = dayMap[s.hari] === dayOfWeek;
      if (!matchDay) return false;

      const freq = s.frequency || 'every_week';
      if (freq === 'odd_weeks' && !isOddWeek) return false;
      if (freq === 'even_weeks' && isOddWeek) return false;

      return true;
    });
    
    const finalAgenda = [];

    // Filter weekly schedules that are NOT cancelled/swapped out
    dayWeeklySchedules.forEach(s => {
      const isOverridden = dayOverrides.some(o => o.original_schedule_id === s.id);
      if (!isOverridden) {
        finalAgenda.push({
          id: s.id,
          title: s.course_name || s.name || 'Kuliah',
          time: s.jam_mulai ? `${s.jam_mulai} - ${s.jam_selesai || ''}` : '-',
          room: s.ruangan || s.ruang || '-',
          type: 'regular'
        });
      }
    });

    // Add swap additions where this lecturer's course is the target swap
    dayOverrides.forEach(o => {
      if (o.status === 'swapped' && o.swapped_with_schedule) {
        const sw = o.swapped_with_schedule;
        // Check if swapped_with_schedule belongs to this lecturer
        const ownCourse = courses.find(c => c.id === sw.id);
        if (ownCourse) {
          finalAgenda.push({
            id: sw.id,
            title: sw.course_name || sw.course?.name || 'Kuliah Pengganti',
            time: o.new_time || sw.start_time,
            room: sw.room_name || sw.room?.name || '-',
            type: 'swap',
            notes: o.notes
          });
        }
      }
    });

    return finalAgenda;
  };

  const selectedDateStr = selectedDay ? `${year}-${String(month + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}` : '';
  const selectedDayAgenda = getDayAgenda(selectedDateStr);

  const monthsMap = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

  const configuredCount = courses.filter(c => c.hari).length;
  const roomOptions = classrooms.map(r => ({ label: r.name, value: r.name }));

  if (loading) return (
    <div style={{ padding: '24px' }}>
      <SkeletonLoader type="card" />
      <SkeletonLoader type="table" />
    </div>
  );

  return (
    <div className="fade-in" style={{ paddingBottom: '40px' }}>
      {/* Hero Header */}
      <div className="siakad-page-header">
        <div className="siakad-page-header-glow"></div>
        <div className="siakad-page-header-grid"></div>
        <div style={{ relative: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ flex: '1 1 300px' }}>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', margin: '0 0 8px 0', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: '600' }}>SIAKAD — DOSEN</p>
            <h1 style={{ color: 'white', fontSize: '2.2rem', fontWeight: '900', margin: '0 0 8px 0', letterSpacing: '-0.03em' }}>Manajemen Jadwal Dosen</h1>
            <p style={{ color: 'rgba(255,255,255,0.6)', margin: 0 }}>Kelola konfigurasi jadwal mengajar dan pantau agenda kalender mengajar bulanan.</p>
          </div>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', flex: '1 1 300px', justifyContent: 'center' }}>
            {[
              { label: 'Total MK', value: courses.length, icon: 'ph-books', color: '#6366f1' },
              { label: 'Terkonfigurasi', value: configuredCount, icon: 'ph-check-circle', color: '#10b981' },
              { label: 'Belum Diatur', value: courses.length - configuredCount, icon: 'ph-warning', color: '#f59e0b' },
            ].map((s, i) => (
              <div key={i} style={{ flex: '1 1 90px', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', borderRadius: '24px', padding: '16px 20px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.15)' }}>
                <i className={`ph ${s.icon}`} style={{ fontSize: '1.3rem', color: s.color, display: 'block', marginBottom: '4px' }}></i>
                <p style={{ color: 'white', fontWeight: '800', fontSize: '1.4rem', margin: '0 0 2px 0' }}>{s.value}</p>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.65rem', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ padding: '24px' }}>
        {/* Tab Selector */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', borderBottom: '1px solid var(--color-border)', paddingBottom: '16px' }}>
          <button
            onClick={() => setActiveTab('pengaturan')}
            style={{
              background: activeTab === 'pengaturan' ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
              color: activeTab === 'pengaturan' ? '#3b82f6' : 'var(--color-muted)',
              border: activeTab === 'pengaturan' ? '2px solid #3b82f6' : '1px solid var(--color-border)',
              padding: '10px 22px', borderRadius: '50px', fontWeight: '700', fontSize: '0.85rem', cursor: 'pointer',
              transition: 'all 0.2s'
            }}>
            <i className="ph ph-sliders" style={{ marginRight: '8px' }}></i> Pengaturan Roster
          </button>
          <button
            onClick={() => setActiveTab('kalender')}
            style={{
              background: activeTab === 'kalender' ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
              color: activeTab === 'kalender' ? '#3b82f6' : 'var(--color-muted)',
              border: activeTab === 'kalender' ? '2px solid #3b82f6' : '1px solid var(--color-border)',
              padding: '10px 22px', borderRadius: '50px', fontWeight: '700', fontSize: '0.85rem', cursor: 'pointer',
              transition: 'all 0.2s'
            }}>
            <i className="ph ph-calendar" style={{ marginRight: '8px' }}></i> Kalender Mengajar
          </button>
        </div>

        {/* Tab 1: Pengaturan Roster */}
        {activeTab === 'pengaturan' && (
          <div className="siakad-card" style={{ padding: '24px 0 0 0', borderRadius: '24px', border: '1px solid var(--color-border)' }}>
            <div style={{ padding: '0 24px 20px 24px', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(59, 130, 246, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' , flexShrink: 0 }}>
                <i className="ph ph-calendar-plus" style={{ color: '#3b82f6', fontSize: '1.1rem' }}></i>
              </div>
              <h3 style={{ margin: 0, color: 'var(--color-text)', fontWeight: '800', fontSize: '1.2rem' }}>Daftar Mata Kuliah & Jadwal</h3>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: 'rgba(0,0,0,0.04)', borderBottom: '2px solid var(--color-border)' }}>
                    {['Mata Kuliah', 'SKS', 'Hari', 'Jam', 'Ruang', 'Frekuensi', 'Aksi'].map((h, i) => (
                      <th key={i} style={{ padding: '16px 20px', fontWeight: '700', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-muted)', whiteSpace: 'nowrap', textAlign: i === 6 ? 'center' : 'left' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {courses.map((c, i) => {
                    const isEditing = editingId === c.id;
                    const col = DAY_COLORS[c.hari] || { bg: 'rgba(255,255,255,0.05)', color: 'var(--color-text)', border: 'var(--color-border)' };
                    return (
                      <tr key={c.id} style={{ borderBottom: '1px solid var(--color-border)', transition: 'background 0.2s' }}>
                        <td style={{ padding: '16px 20px', fontWeight: '700', color: 'var(--color-text)' }}>
                          {c.course_name || c.name || '-'}
                          <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--color-muted)', fontWeight: 'normal', marginTop: '2px' }}>ID: {c.code || c.id}</span>
                        </td>
                        <td style={{ padding: '16px 20px', color: 'var(--color-text)' }}>{c.sks || 3} SKS</td>
                        <td style={{ padding: '16px 20px' }}>
                          {isEditing ? (
                            <CustomSelect
                              value={formData.day}
                              onChange={(val) => setFormData({ ...formData, day: val })}
                              placeholder="Pilih Hari"
                              options={['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'].map(d => ({ label: d, value: d }))}
                              style={{ width: '130px' }}
                            />
                          ) : (
                            c.hari ? (
                              <span style={{ display: 'inline-block', padding: '4px 12px', borderRadius: '50px', fontSize: '0.8rem', fontWeight: '700', background: col.bg, color: col.color, border: `1px solid ${col.border}` }}>{c.hari}</span>
                            ) : <span style={{ color: 'var(--color-muted)', fontSize: '0.85rem' }}>Belum diatur</span>
                          )}
                        </td>
                        <td style={{ padding: '16px 20px' }}>
                          {isEditing ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <CustomTimePicker value={formData.start_time} onChange={(val) => setFormData({ ...formData, start_time: val })} />
                              <span style={{ color: 'var(--color-muted)' }}>s/d</span>
                              <CustomTimePicker value={formData.end_time} onChange={(val) => setFormData({ ...formData, end_time: val })} />
                            </div>
                          ) : (
                            c.jam_mulai ? <span style={{ fontFamily: 'monospace', color: 'var(--color-text)', fontSize: '0.9rem' }}>{c.jam_mulai} - {c.jam_selesai || ''}</span> : '-'
                          )}
                        </td>
                        <td style={{ padding: '16px 20px' }}>
                          {isEditing ? (
                            <CustomSelect
                              value={formData.room}
                              onChange={(val) => setFormData({ ...formData, room: val })}
                              placeholder="Pilih Ruang"
                              options={roomOptions}
                              style={{ width: '180px' }}
                            />
                          ) : (
                            c.ruangan || c.ruang || '-'
                          )}
                        </td>
                        <td style={{ padding: '16px 20px' }}>
                          {isEditing ? (
                            <CustomSelect
                              value={formData.frequency}
                              onChange={(val) => setFormData({ ...formData, frequency: val })}
                              placeholder="Frekuensi"
                              options={[
                                { label: 'Setiap Minggu', value: 'every_week' },
                                { label: 'Ganjil Saja', value: 'odd_weeks' },
                                { label: 'Genap Saja', value: 'even_weeks' }
                              ]}
                              style={{ width: '160px' }}
                            />
                          ) : (
                            <span style={{ fontSize: '0.85rem', color: 'var(--color-text)' }}>
                              {c.frequency === 'odd_weeks' ? 'Ganjil Saja' : c.frequency === 'even_weeks' ? 'Genap Saja' : 'Setiap Minggu'}
                            </span>
                          )}
                        </td>
                        <td style={{ padding: '16px 20px', textAlign: 'center' }}>
                          {isEditing ? (
                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                              <button id={`btn-save-roster-${c.id}`} onClick={() => handleSave(c.id)} disabled={saving} className="siakad-btn-primary" style={{ padding: '8px 16px', fontSize: '0.8rem' }}>{saving ? 'Simpan...' : 'Simpan'}</button>
                              <button id={`btn-cancel-roster-${c.id}`} onClick={handleCancel} style={{ padding: '8px 14px', background: 'transparent', border: '1px solid var(--color-border)', borderRadius: '30px', color: 'var(--color-text)', fontSize: '0.8rem', cursor: 'pointer' }}>Batal</button>
                            </div>
                          ) : (
                            <button id={`btn-edit-roster-${c.id}`} onClick={() => handleEdit(c)} className="siakad-btn-primary" style={{ padding: '8px 16px', fontSize: '0.8rem', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', border: 'none' }}><i className="ph ph-pencil-simple"></i> Edit</button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Kalender Mengajar */}
        {activeTab === 'kalender' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
            {/* Grid Kalender */}
            <div className="siakad-card" style={{ padding: '24px' }}>
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

              {/* Days Header */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px', textAlign: 'center', marginBottom: '8px' }}>
                {['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'].map(d => (
                  <span key={d} style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--color-muted)', textTransform: 'uppercase' }}>{d}</span>
                ))}
              </div>

              {/* Grid Tanggal */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px' }}>
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

            {/* List Detail Mengajar Hari Terpilih */}
            <div className="siakad-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
              <div style={{ marginBottom: '20px', borderBottom: '1px solid var(--color-border)', paddingBottom: '12px' }}>
                <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--color-muted)', fontWeight: '600' }}>AGENDA MENGAJAR HARIAN</p>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--color-text)', margin: '2px 0 0 0' }}>
                  {selectedDay ? `${selectedDay} ${monthsMap[month]} ${year}` : 'Pilih Tanggal'}
                </h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1, overflowY: 'auto' }}>
                {selectedDayAgenda.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px', color: 'var(--color-muted)' }}>
                    <i className="ph ph-calendar-blank" style={{ fontSize: '3rem', opacity: 0.3, marginBottom: '8px', display: 'block' }}></i>
                    Tidak ada jadwal mengajar di hari ini.
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
                        {agenda.type === 'swap' ? 'Jadwal Pengganti (Swap)' : 'Jadwal Reguler'}
                      </span>
                      <span style={{ fontSize: '0.82rem', fontFamily: 'monospace', color: 'var(--color-text)', fontWeight: 'bold' }}>{agenda.time}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 'bold', color: 'var(--color-text)' }}>{agenda.title}</h4>
                      {agenda.type === 'regular' && (
                        <button
                          onClick={() => {
                            const originalCourse = courses.find(c => c.id === agenda.id);
                            setEditForm({
                              course_id: agenda.id,
                              hari: originalCourse?.hari || 'Senin',
                              jamMulai: originalCourse?.jam_mulai || '08:00',
                              jamSelesai: originalCourse?.jam_selesai || '10:00',
                              ruang: originalCourse?.ruangan || originalCourse?.ruang || '',
                              frequency: originalCourse?.frequency || 'every_week',
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
                          title="Ubah Jadwal"
                        >
                          <i className="ph ph-pencil-simple" style={{ fontSize: '0.95rem' }}></i>
                        </button>
                      )}
                    </div>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-muted)' }}><i className="ph ph-door"></i> Ruang {agenda.room}</p>
                    {agenda.notes && <p style={{ margin: '6px 0 0 0', padding: '6px 10px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', fontSize: '0.8rem', color: '#f59e0b' }}><strong>Catatan:</strong> {agenda.notes}</p>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {showEditModal && (
        <ModalShell title={editForm.editMode === 'session' ? `Ubah Jadwal Sesi ${selectedDateStr}` : 'Ubah Jadwal Mengajar'} icon="ph-calendar" onClose={() => setShowEditModal(false)} footer={
          <>
            <button onClick={() => setShowEditModal(false)} style={{ padding: '10px 20px', border: 'none', background: 'transparent', color: 'var(--color-text)', cursor: 'pointer', fontWeight: '600' }}>Batal</button>
            <button onClick={handleSaveFromCalendar} disabled={saving} className="siakad-btn-primary" style={{ padding: '10px 24px' }}>
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
            <CustomSelect
              value={editForm.ruang}
              onChange={(val) => setEditForm({ ...editForm, ruang: val })}
              placeholder="-- Pilih Ruangan --"
              options={roomOptions}
            />
          </div>

          {editForm.editMode === 'permanent' && (
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: 'var(--color-muted)', fontWeight: '600' }}>Frekuensi Mengajar</label>
            <CustomSelect
              value={editForm.frequency}
              onChange={(val) => setEditForm({ ...editForm, frequency: val })}
              placeholder="Frekuensi"
              options={[
                { label: 'Setiap Minggu', value: 'every_week' },
                { label: 'Ganjil Saja', value: 'odd_weeks' },
                { label: 'Genap Saja', value: 'even_weeks' }
              ]}
            />
          </div>
          )}
        </ModalShell>
      )}
    </div>
  );
}
