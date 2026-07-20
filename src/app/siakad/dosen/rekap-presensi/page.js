"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RekapPresensiPage() {
  const router = useRouter();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => { fetchRekap(); }, []);

  const fetchRekap = async () => {
    const token = localStorage.getItem('siakad_token');
    if (!token) return router.push('/siakad/login');
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
      const res = await fetch(`${apiUrl}/siakad/dosen/rekap-presensi`, { headers: { 'Authorization': `Bearer ${token}` } });
      if (res.ok) {
        const result = await res.json();
        setCourses(result.courses || []);
        if (result.courses?.length > 0) setSelectedCourseId(result.courses[0].id.toString());
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const selectedCourse = courses.find(c => c.id.toString() === selectedCourseId);
  const filteredStudents = selectedCourse?.students?.filter(s => {
    const q = searchTerm.toLowerCase();
    return s.name.toLowerCase().includes(q) || (s.nim && s.nim.toLowerCase().includes(q));
  }) || [];

  const atRisk = filteredStudents.filter(s => (s.attendance_percentage || 0) < 75).length;
  const safe = filteredStudents.filter(s => (s.attendance_percentage || 0) >= 75).length;

  const getAttColor = (pct) => {
    if (pct >= 75) return { color: '#047857', border: 'rgba(4,120,87,0.3)' };
    if (pct >= 50) return { color: '#d97706', border: 'rgba(217,119,6,0.3)' };
    return { color: '#b91c1c', border: 'rgba(185,28,28,0.3)' };
  };

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '12px', color: 'var(--color-muted)' }}>
      <i className="ph ph-spinner ph-spin" style={{ fontSize: '2rem' }}></i> Memuat rekap presensi...
    </div>
  );

  return (
    <div className="fade-in" style={{ paddingBottom: '40px' }}>
      {/* Hero Header */}
      <div className="siakad-page-header">
        <div className="siakad-page-header-glow"></div>
        <div className="siakad-page-header-grid"></div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', margin: '0 0 8px 0', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: '600' }}>SIAKAD — DOSEN</p>
          <h1 style={{ color: 'white', fontSize: '2.2rem', fontWeight: '900', margin: '0 0 8px 0', letterSpacing: '-0.03em' }}>Rekap Kehadiran Mahasiswa</h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', margin: '0 0 24px 0' }}>Pantau tingkat kehadiran — minimal <strong style={{ color: '#10b981' }}>75%</strong> untuk dapat mengikuti ujian.</p>
          {selectedCourse && (
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              {[
                { label: 'Total Mahasiswa', value: filteredStudents.length, icon: 'ph-users', color: '#6366f1' },
                { label: 'Aman (≥75%)', value: safe, icon: 'ph-check-circle', color: '#10b981' },
                { label: 'Berisiko (<75%)', value: atRisk, icon: 'ph-warning-circle', color: '#ef4444' },
                { label: 'Total Pertemuan', value: selectedCourse.total_meetings || 0, icon: 'ph-calendar', color: '#f59e0b' },
              ].map((s, i) => (
                <div key={i} style={{ flex: '1 1 90px', background: 'var(--glass-bg)', borderRadius: '14px', padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '10px', border: 'var(--glass-border)', boxShadow: 'var(--glass-shadow)' }}>
                  <div style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '50%',
                    background: 'var(--glass-bg)',
                    boxShadow: 'inset 2px 2px 5px var(--inset-shadow-dark), inset -2px -2px 5px var(--inset-shadow-light)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <i className={`ph ${s.icon}`} style={{ fontSize: '1.1rem', color: s.color }}></i>
                  </div>
                  <div>
                    <p style={{ color: 'var(--color-text)', fontWeight: '800', fontSize: '1.3rem', margin: 0, lineHeight: 1 }}>{s.value}</p>
                    <p style={{ color: 'var(--color-muted)', fontSize: '0.7rem', margin: 0 }}>{s.label}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {courses.length === 0 ? (
        <div style={{ padding: '60px', textAlign: 'center', color: 'var(--color-muted)', background: 'var(--glass-bg)', border: 'var(--glass-border)', boxShadow: 'var(--glass-shadow)', borderRadius: '24px' }}>
          <i className="ph ph-chart-bar" style={{ fontSize: '4rem', display: 'block', marginBottom: '16px', opacity: 0.3 }}></i>
          <p style={{ margin: 0, fontSize: '1.1rem' }}>Belum ada data presensi untuk ditampilkan.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', alignItems: 'start' }}>
          {/* Course Selector */}
          <div className="stagger-1" style={{ padding: '24px', borderRadius: '24px', border: 'var(--glass-border)', background: 'var(--glass-bg)', boxShadow: 'var(--glass-shadow)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--glass-bg)', border: 'var(--glass-border)', boxShadow: 'inset 2px 2px 5px var(--inset-shadow-dark), inset -2px -2px 5px var(--inset-shadow-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <i className="ph ph-book" style={{ color: '#C41E3A', fontSize: '1.1rem' }}></i>
              </div>
              <h3 style={{ margin: 0, color: 'var(--color-text)', fontWeight: '800', fontSize: '1.1rem' }}>Pilih Mata Kuliah</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {courses.map((c, i) => {
                const isActive = selectedCourseId === c.id.toString();
                return (
                  <button key={c.id} onClick={() => { setSelectedCourseId(c.id.toString()); setSearchTerm(''); }}
                    className={isActive ? 'active' : ''}
                    style={{ padding: '14px 16px', textAlign: 'left', background: isActive ? 'linear-gradient(135deg, #C41E3A, #9b1c2e)' : 'var(--glass-bg)', color: isActive ? 'white' : 'var(--color-text)', border: isActive ? 'none' : 'var(--glass-border)', borderRadius: '24px', cursor: 'pointer', transition: 'all 0.2s', boxShadow: 'var(--glass-shadow)' }}>
                    <div style={{ fontSize: '0.75rem', opacity: 0.7, marginBottom: '2px', fontWeight: '600' }}>{c.code}</div>
                    <div style={{ fontWeight: '700', fontSize: '0.9rem', lineHeight: 1.3 }}>{c.name}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Table container replaced by modern separate slots */}
          <div className="stagger-2" style={{ padding: '24px 0 0 0', borderRadius: '24px', border: 'var(--glass-border)', background: 'var(--glass-bg)', boxShadow: 'var(--glass-shadow)' }}>
            <div style={{ padding: '0 24px 20px 24px', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h3 style={{ margin: '0 0 4px 0', color: 'var(--color-text)', fontWeight: '800', fontSize: '1.2rem' }}>{selectedCourse?.name}</h3>
                <p style={{ margin: 0, color: 'var(--color-muted)', fontSize: '0.85rem' }}>{filteredStudents.length} mahasiswa · {selectedCourse?.total_meetings || 0} pertemuan</p>
              </div>
              <div style={{ position: 'relative' }}>
                <i className="ph ph-magnifying-glass" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-muted)' }}></i>
                <input 
                  type="text" 
                  className="siakad-input" 
                  placeholder="Cari mahasiswa..." 
                  value={searchTerm} 
                  onChange={e => setSearchTerm(e.target.value)}
                  style={{ 
                    padding: '10px 10px 10px 46px', 
                    outline: 'none', 
                    width: '220px', 
                    fontSize: '0.9rem' 
                  }} 
                />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '24px' }}>
              {filteredStudents.length > 0 ? filteredStudents.map((mhs, idx) => {
                const pct = mhs.attendance_percentage || 0;
                const attStyle = getAttColor(pct);
                return (
                  <div key={mhs.id} style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '16px 20px',
                    background: 'var(--liquid-bg)',
                    border: 'var(--inset-border)',
                    borderRadius: '16px',
                    boxShadow: 'inset 2px 2px 5px var(--inset-shadow-dark), inset -2px -2px 5px var(--inset-shadow-light)',
                    flexWrap: 'wrap',
                    gap: '12px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        background: 'var(--glass-bg)',
                        border: 'var(--glass-border)',
                        boxShadow: 'var(--glass-shadow)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--apple-blue)',
                        fontWeight: '800',
                        fontSize: '0.9rem',
                        flexShrink: 0
                      }}>
                        {mhs.name.charAt(0)}
                      </div>
                      <div>
                        <span style={{ fontWeight: '700', color: 'var(--color-text)', display: 'block' }}>{mhs.name}</span>
                        <span style={{ fontSize: '0.8rem', color: 'var(--color-muted)' }}>NIM: {mhs.nim || '—'}</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
                      <div style={{ fontWeight: '700', color: 'var(--color-text)' }}>
                        <span style={{ color: attStyle.color }}>{mhs.present_count || 0}</span>
                        <span style={{ color: 'var(--color-muted)' }}> / {selectedCourse?.total_meetings || 0}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '80px', height: '6px', background: 'var(--color-border)', borderRadius: '50px', overflow: 'hidden' }}>
                          <div style={{ width: `${Math.min(pct, 100)}%`, height: '100%', background: `linear-gradient(to right, ${attStyle.color}, ${attStyle.color}cc)`, borderRadius: '50px' }}></div>
                        </div>
                        <span style={{ fontWeight: '800', color: attStyle.color, fontSize: '0.85rem' }}>{pct.toFixed(0)}%</span>
                      </div>
                      <span className="siakad-badge-status" style={{ color: attStyle.color, borderColor: attStyle.border }}>
                        {pct >= 75 ? '✓ Aman' : pct >= 50 ? '⚠ Perhatian' : '✗ Tidak Memenuhi'}
                      </span>
                    </div>
                  </div>
                );
              }) : (
                <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--color-muted)', background: 'var(--liquid-bg)', border: 'var(--inset-border)', borderRadius: '16px', boxShadow: 'inset 2px 2px 5px var(--inset-shadow-dark), inset -2px -2px 5px var(--inset-shadow-light)' }}>
                  <i className="ph ph-users-slash" style={{ fontSize: '3rem', display: 'block', marginBottom: '12px', opacity: 0.4 }}></i>
                  {searchTerm ? 'Mahasiswa tidak ditemukan.' : 'Belum ada data mahasiswa.'}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
