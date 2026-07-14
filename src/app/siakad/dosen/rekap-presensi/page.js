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
    if (pct >= 75) return { color: '#10b981', bg: 'rgba(16,185,129,0.15)', border: 'rgba(16,185,129,0.3)' };
    if (pct >= 50) return { color: '#f59e0b', bg: 'rgba(245,158,11,0.15)', border: 'rgba(245,158,11,0.3)' };
    return { color: '#ef4444', bg: 'rgba(239,68,68,0.15)', border: 'rgba(239,68,68,0.3)' };
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
                <div key={i} style={{ flex: '1 1 90px', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', borderRadius: '14px', padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '10px', border: '1px solid rgba(255,255,255,0.15)' }}>
                  <i className={`ph ${s.icon}`} style={{ fontSize: '1.2rem', color: s.color }}></i>
                  <div>
                    <p style={{ color: 'white', fontWeight: '800', fontSize: '1.3rem', margin: 0, lineHeight: 1 }}>{s.value}</p>
                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.7rem', margin: 0 }}>{s.label}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {courses.length === 0 ? (
        <div className="siakad-card" style={{ padding: '60px', textAlign: 'center', color: 'var(--color-muted)' }}>
          <i className="ph ph-chart-bar" style={{ fontSize: '4rem', display: 'block', marginBottom: '16px', opacity: 0.3 }}></i>
          <p style={{ margin: 0, fontSize: '1.1rem' }}>Belum ada data presensi untuk ditampilkan.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', alignItems: 'start' }}>
          {/* Course Selector */}
          <div className="siakad-card stagger-1" style={{ overflow: 'hidden' }}>
            <div style={{ background: 'linear-gradient(to right, #064e3b, #065f46)', padding: '16px 20px' }}>
              <h3 style={{ margin: 0, color: 'white', fontWeight: '700', fontSize: '0.95rem' }}>Pilih Mata Kuliah</h3>
            </div>
            <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {courses.map((c, i) => {
                const isActive = selectedCourseId === c.id.toString();
                return (
                  <button key={c.id} onClick={() => { setSelectedCourseId(c.id.toString()); setSearchTerm(''); }}
                    style={{ padding: '14px 16px', textAlign: 'left', background: isActive ? 'linear-gradient(135deg, #065f46, #064e3b)' : 'var(--glass-bg)', color: isActive ? 'white' : 'var(--color-text)', border: `1px solid ${isActive ? 'transparent' : 'var(--color-border)'}`, borderRadius: '24px', cursor: 'pointer', transition: 'all 0.2s', boxShadow: isActive ? '0 4px 12px rgba(6,95,70,0.4)' : 'none' }}>
                    <div style={{ fontSize: '0.75rem', opacity: 0.7, marginBottom: '2px', fontWeight: '600' }}>{c.code}</div>
                    <div style={{ fontWeight: '700', fontSize: '0.9rem', lineHeight: 1.3 }}>{c.name}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Table */}
          <div className="siakad-card stagger-2" style={{ overflow: 'hidden' }}>
            <div style={{ background: 'linear-gradient(to right, #064e3b, #1e1b4b)', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h3 style={{ margin: '0 0 4px 0', color: 'white', fontWeight: '700' }}>{selectedCourse?.name}</h3>
                <p style={{ margin: 0, color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>{filteredStudents.length} mahasiswa · {selectedCourse?.total_meetings || 0} pertemuan</p>
              </div>
              <div style={{ position: 'relative' }}>
                <i className="ph ph-magnifying-glass" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.5)' }}></i>
                <input type="text" placeholder="Cari mahasiswa..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                  style={{ padding: '10px 10px 10px 46px', borderRadius: '50px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.1)', color: 'white', outline: 'none', width: '220px', fontSize: '0.9rem', boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.15)' }} />
              </div>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: 'rgba(0,0,0,0.04)', borderBottom: '2px solid var(--color-border)' }}>
                    {['NIM', 'Nama Mahasiswa', 'Hadir / Total', 'Kehadiran', 'Status'].map((h, i) => (
                      <th key={i} style={{ padding: '14px 20px', fontWeight: '700', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-muted)', whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.length > 0 ? filteredStudents.map((mhs, idx) => {
                    const pct = mhs.attendance_percentage || 0;
                    const attStyle = getAttColor(pct);
                    return (
                      <tr key={mhs.id} style={{ borderBottom: '1px solid var(--color-border)', transition: 'background 0.15s' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'var(--glass-bg)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                        <td style={{ padding: '16px 20px', fontWeight: '600', color: 'var(--color-muted)', fontSize: '0.9rem' }}>{mhs.nim || '—'}</td>
                        <td style={{ padding: '16px 20px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(99,102,241,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6366f1', fontWeight: '800', fontSize: '0.9rem', flexShrink: 0 }}>
                              {mhs.name.charAt(0)}
                            </div>
                            <span style={{ fontWeight: '600', color: 'var(--color-text)' }}>{mhs.name}</span>
                          </div>
                        </td>
                        <td style={{ padding: '16px 20px', fontWeight: '700', color: 'var(--color-text)' }}>
                          <span style={{ color: attStyle.color }}>{mhs.present_count || 0}</span>
                          <span style={{ color: 'var(--color-muted)' }}> / {selectedCourse?.total_meetings || 0}</span>
                        </td>
                        <td style={{ padding: '16px 20px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ flex: 1, height: '8px', background: 'var(--color-border)', borderRadius: '50px', overflow: 'hidden', maxWidth: '120px' }}>
                              <div style={{ width: `${Math.min(pct, 100)}%`, height: '100%', background: `linear-gradient(to right, ${attStyle.color}, ${attStyle.color}cc)`, borderRadius: '50px', transition: 'width 0.5s ease' }}></div>
                            </div>
                            <span style={{ fontWeight: '800', color: attStyle.color, fontSize: '0.9rem', whiteSpace: 'nowrap' }}>{pct.toFixed(0)}%</span>
                          </div>
                        </td>
                        <td style={{ padding: '16px 20px' }}>
                          <span style={{ padding: '5px 12px', background: attStyle.bg, color: attStyle.color, border: `1px solid ${attStyle.border}`, borderRadius: '999px', fontSize: '0.78rem', fontWeight: '700', whiteSpace: 'nowrap' }}>
                            {pct >= 75 ? '✓ Aman (Bisa Ujian)' : pct >= 50 ? '⚠ Perlu Perhatian' : '✗ Tidak Memenuhi'}
                          </span>
                        </td>
                      </tr>
                    );
                  }) : (
                    <tr><td colSpan="5" style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--color-muted)' }}>
                      <i className="ph ph-users-slash" style={{ fontSize: '3rem', display: 'block', marginBottom: '12px', opacity: 0.4 }}></i>
                      {searchTerm ? 'Mahasiswa tidak ditemukan.' : 'Belum ada data mahasiswa.'}
                    </td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
