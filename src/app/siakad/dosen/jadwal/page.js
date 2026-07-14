"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CustomSelect from '../../components/CustomSelect';
import CustomTimePicker from '../../components/CustomTimePicker';

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
  const [courses, setCourses] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ day: '', start_time: '', end_time: '', room: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchCourses();
    fetchClassrooms();
  }, []);

  const fetchCourses = async () => {
    const token = localStorage.getItem('siakad_token');
    if (!token) return router.push('/siakad/login');
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
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
    const token = localStorage.getItem('siakad_token');
    if (!token) return;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
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

  const handleEdit = (course) => {
    setEditingId(course.id);
    setFormData({
      day: course.hari || '',
      start_time: course.jam_mulai || '',
      end_time: course.jam_selesai || '',
      room: course.ruangan || course.ruang || ''
    });
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({ day: '', start_time: '', end_time: '', room: '' });
  };

  const handleSave = async (courseId) => {
    setSaving(true);
    const token = localStorage.getItem('siakad_token');
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
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

  const configuredCount = courses.filter(c => c.hari).length;

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '12px', color: 'var(--color-muted)' }}>
      <i className="ph ph-spinner ph-spin" style={{ fontSize: '2rem' }}></i> Memuat jadwal...
    </div>
  );

  const roomOptions = classrooms.length > 0
    ? classrooms.map(r => ({ label: r.name, value: r.name }))
    : [
        { label: 'Lab Komputer A', value: 'Lab Komputer A' },
        { label: 'Lab Komputer B', value: 'Lab Komputer B' },
        { label: 'Ruang 401', value: 'Ruang 401' },
        { label: 'Ruang 402', value: 'Ruang 402' },
        { label: 'Ruang 405 (Aula)', value: 'Ruang 405 (Aula)' },
        { label: 'Ruang Seminar 1', value: 'Ruang Seminar 1' }
      ];

  return (
    <div className="fade-in" style={{ paddingBottom: '40px' }}>
      {/* Hero Header */}
      <div className="siakad-page-header">
        <div className="siakad-page-header-glow"></div>
        <div className="siakad-page-header-grid"></div>
        <div style={{ relative: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ flex: '1 1 300px' }}>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', margin: '0 0 8px 0', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: '600' }}>SIAKAD — DOSEN</p>
            <h1 style={{ color: 'white', fontSize: '2.2rem', fontWeight: '900', margin: '0 0 8px 0', letterSpacing: '-0.03em' }}>Pengaturan Jadwal Mengajar</h1>
            <p style={{ color: 'rgba(255,255,255,0.6)', margin: 0 }}>Atur hari, jam, dan ruang kelas untuk mata kuliah Anda semester ini.</p>
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

      {/* Table Card */}
      <div className="siakad-card stagger-1" style={{ overflow: 'hidden' }}>
        <div style={{ background: 'var(--glass-bg)', padding: '20px 28px', borderBottom: '1px solid var(--color-border)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(59, 130, 246, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' , flexShrink: 0 }}>
            <i className="ph ph-calendar-plus" style={{ color: '#3b82f6', fontSize: '1.1rem' }}></i>
          </div>
          <h3 style={{ margin: 0, color: 'var(--color-text)', fontWeight: '700' }}>Daftar Mata Kuliah & Jadwal</h3>
          <span style={{ marginLeft: 'auto', padding: '4px 12px', background: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6', border: '1px solid rgba(59, 130, 246, 0.25)', borderRadius: '50px', fontSize: '0.8rem', fontWeight: '700' , flexShrink: 0 }}>{courses.length} MK</span>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'rgba(0,0,0,0.04)', borderBottom: '2px solid var(--color-border)' }}>
                {['Mata Kuliah', 'SKS', 'Hari', 'Jam', 'Ruang', 'Aksi'].map((h, i) => (
                  <th key={i} style={{ padding: '16px 20px', fontWeight: '700', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-muted)', whiteSpace: 'nowrap', textAlign: i === 5 ? 'center' : 'left' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {courses.length > 0 ? courses.map((c, i) => {
                const isEditing = editingId === c.id;
                const dayStyle = DAY_COLORS[c.hari] || null;
                return (
                  <tr key={c.id} style={{ borderBottom: '1px solid var(--color-border)', transition: 'background 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--glass-bg)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <td style={{ padding: '16px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(99,102,241,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <span style={{ color: '#6366f1', fontWeight: '800', fontSize: '0.85rem' }}>{c.code?.substring(0, 2) || '??'}</span>
                        </div>
                        <div>
                          <p style={{ margin: 0, fontWeight: '700', color: 'var(--color-text)' }}>{c.name}</p>
                          <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--color-muted)' }}>{c.code}</p>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <span style={{ display: 'inline-block', whiteSpace: 'nowrap', padding: '4px 12px', background: 'rgba(99,102,241,0.15)', color: '#6366f1', borderRadius: '50px', fontWeight: '700', fontSize: '0.85rem' }}>{c.sks} SKS</span>
                    </td>
                    {isEditing ? (
                      <>
                        <td style={{ padding: '12px 16px' }}>
                          <CustomSelect 
                            value={formData.day} 
                            onChange={val => setFormData({...formData, day: val})}
                            placeholder="Pilih Hari"
                            options={['Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'].map(d => ({label: d, value: d}))}
                          />
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' , flexWrap: 'wrap' }}>
                            <CustomTimePicker 
                              value={formData.start_time} 
                              onChange={val => setFormData({...formData, start_time: val})}
                              style={{ width: '110px' }}
                            />
                            <span style={{ color: 'var(--color-muted)' }}>—</span>
                            <CustomTimePicker 
                              value={formData.end_time} 
                              onChange={val => setFormData({...formData, end_time: val})}
                              style={{ width: '110px' }}
                            />
                          </div>
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <CustomSelect 
                            value={formData.room}
                            onChange={val => setFormData({...formData, room: val})}
                            placeholder="Pilih Ruangan"
                            options={roomOptions}
                          />
                        </td>
                        <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                            <button onClick={() => handleSave(c.id)} disabled={saving}
                              style={{ padding: '8px 18px', background: 'linear-gradient(135deg, #10b981, #059669)', color: 'white', borderRadius: '50px', border: 'none', cursor: 'pointer', fontWeight: '700', fontSize: '0.85rem', boxShadow: '0 4px 10px rgba(16,185,129,0.3)' }}>
                              {saving ? '...' : 'Simpan'}
                            </button>
                            <button onClick={handleCancel}
                              style={{ padding: '8px 18px', background: 'var(--glass-bg)', color: 'var(--color-muted)', borderRadius: '50px', border: '1px solid var(--color-border)', cursor: 'pointer', fontWeight: '600', fontSize: '0.85rem' }}>
                                Batal
                            </button>
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td style={{ padding: '16px 20px' }}>
                          {c.hari && dayStyle ? (
                            <span style={{ display: 'inline-block', minWidth: '95px', textAlign: 'center', padding: '6px 14px', background: dayStyle.bg, color: dayStyle.color, border: `1px solid ${dayStyle.border}`, borderRadius: '50px', fontWeight: '700', fontSize: '0.85rem' }}>{c.hari}</span>
                          ) : <span style={{ color: 'var(--color-muted)', fontStyle: 'italic', fontSize: '0.85rem' }}>Belum diatur</span>}
                        </td>
                        <td style={{ padding: '16px 20px', color: 'var(--color-text)', fontSize: '0.9rem', fontWeight: '500' }}>
                          {(c.jam_mulai && c.jam_selesai) ? `${c.jam_mulai.substring(0,5)} – ${c.jam_selesai.substring(0,5)}` : <span style={{ color: 'var(--color-muted)', fontStyle: 'italic', fontSize: '0.85rem' }}>—</span>}
                        </td>
                        <td style={{ padding: '16px 20px' }}>
                          {(c.ruang || c.ruangan) ? (
                            <span style={{ display: 'inline-flex', minWidth: '130px', justifyContent: 'center', alignItems: 'center', gap: '6px', padding: '6px 14px', background: 'var(--glass-bg)', borderRadius: '50px', fontWeight: '600', fontSize: '0.85rem', color: 'var(--color-text)', border: '1px solid var(--color-border)', whiteSpace: 'nowrap' }}>
                              <i className="ph ph-map-pin" style={{ color: '#C41E3A' }}></i>{c.ruang || c.ruangan}
                            </span>
                          ) : <span style={{ color: 'var(--color-muted)', fontStyle: 'italic', fontSize: '0.85rem' }}>—</span>}
                        </td>
                        <td style={{ padding: '16px 20px', textAlign: 'center' }}>
                          <button onClick={() => handleEdit(c)}
                            style={{ padding: '8px 18px', background: 'var(--glass-bg)', color: 'var(--color-text)', border: '1px solid var(--color-border)', borderRadius: '50px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: '600', fontSize: '0.85rem', transition: 'all 0.2s' }}>
                            <i className="ph ph-pencil-simple"></i> Atur
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                );
              }) : (
                <tr><td colSpan="6" style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--color-muted)' }}>
                  <i className="ph ph-calendar-x" style={{ fontSize: '3rem', display: 'block', marginBottom: '12px', opacity: 0.4 }}></i>
                  Anda tidak memiliki kelas aktif.
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
