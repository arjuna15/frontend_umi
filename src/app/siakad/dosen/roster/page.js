"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RosterPage() {
  const router = useRouter();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchRoster = async () => {
      const token = localStorage.getItem('siakad_token');
      if (!token) return router.push('/siakad/login');

      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
        const res = await fetch(`${apiUrl}/siakad/dosen/roster`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const result = await res.json();
          setCourses(result.courses || []);
          if (result.courses?.length > 0) {
            setSelectedCourseId(result.courses[0].id.toString());
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRoster();
  }, [router]);

  const selectedCourse = courses.find(c => c.id.toString() === selectedCourseId);
  
  const filteredStudents = selectedCourse?.students?.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (s.nim && s.nim.toLowerCase().includes(searchTerm.toLowerCase()))
  ) || [];

  const getAvatarGradient = (name) => {
    const palettes = [
      'linear-gradient(135deg,#C41E3A,#ef4444)',
      'linear-gradient(135deg,#6366f1,#8b5cf6)',
      'linear-gradient(135deg,#0ea5e9,#3b82f6)',
      'linear-gradient(135deg,#10b981,#059669)',
      'linear-gradient(135deg,#f59e0b,#d97706)',
      'linear-gradient(135deg,#ec4899,#db2777)',
    ];
    return palettes[(name?.charCodeAt(0) || 0) % palettes.length];
  };

  if (loading) return (
    <div style={{ padding: '60px', display: 'flex', alignItems: 'center', gap: '16px', color: 'var(--color-muted)' }}>
      <i className="ph ph-spinner" style={{ fontSize: '1.5rem' }}></i>
      Memuat roster kelas...
    </div>
  );

  return (
    <div className="siakad-page">
      {/* ── Hero Header ── */}
      <div className="siakad-page-header">
        <div className="siakad-page-header-glow"></div>
        <div className="siakad-page-header-grid"></div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', margin: '0 0 8px 0', letterSpacing: '0.12em', textTransform: 'uppercase' }}>SIAKAD — DOSEN</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(196,30,58,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(196,30,58,0.25)' , flexShrink: 0 }}>
              <i className="ph ph-student" style={{ fontSize: '1.6rem', color: '#C41E3A' }}></i>
            </div>
            <h1 style={{ color: 'white', fontSize: '2rem', fontWeight: '800', margin: 0, letterSpacing: '-0.03em' }}>Manajemen Kelas (Roster)</h1>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.6)', margin: '0 0 20px 0' }}>Daftar mahasiswa yang terdaftar di setiap kelas yang Anda ampu semester ini.</p>
          <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
            <div style={{ background: 'var(--glass-bg)', borderRadius: '12px', padding: '12px 20px', backdropFilter: 'none', border: 'var(--glass-border)', boxShadow: 'var(--glass-shadow)' }}>
              <p style={{ margin: 0, color: 'var(--color-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Total Kelas</p>
              <h3 style={{ margin: '4px 0 0 0', color: 'var(--color-text)', fontSize: '1.4rem', fontWeight: '800' }}>{courses.length}</h3>
            </div>
            <div style={{ background: 'var(--glass-bg)', borderRadius: '12px', padding: '12px 20px', backdropFilter: 'none', border: 'var(--glass-border)', boxShadow: 'var(--glass-shadow)' }}>
              <p style={{ margin: 0, color: 'var(--color-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Total Mahasiswa</p>
              <h3 style={{ margin: '4px 0 0 0', color: 'var(--color-text)', fontSize: '1.4rem', fontWeight: '800' }}>
                {courses.reduce((acc, c) => acc + (c.students?.length || 0), 0)}
              </h3>
            </div>
          </div>
        </div>
      </div>

      {courses.length === 0 ? (
        <div className="siakad-card" style={{ padding: '60px', textAlign: 'center' }}>
          <i className="ph ph-books" style={{ fontSize: '4rem', color: 'var(--color-muted)', marginBottom: '16px', display: 'block', opacity: 0.4 }}></i>
          <p style={{ color: 'var(--color-muted)', fontSize: '1rem', margin: 0 }}>Anda belum memiliki jadwal mengajar semester ini.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2.5fr', gap: '24px', alignItems: 'start' }}>
          {/* ── Left Sidebar: Course Selector ── */}
          <div className="siakad-card stagger-1" style={{ padding: '24px', borderRadius: '24px', border: '1px solid var(--color-border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--glass-bg)', border: 'var(--inset-border)', boxShadow: 'inset 2px 2px 5px var(--inset-shadow-dark), inset -2px -2px 5px var(--inset-shadow-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <i className="ph ph-book-open" style={{ color: '#C41E3A', fontSize: '1.1rem' }}></i>
              </div>
              <h3 style={{ color: 'var(--color-text)', margin: 0, fontSize: '1.1rem', fontWeight: '800' }}>Mata Kuliah</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {courses.map(c => {
                const isActive = selectedCourseId === c.id.toString();
                return (
                  <button
                    key={c.id}
                    className={isActive ? "active" : ""}
                    onClick={() => setSelectedCourseId(c.id.toString())}
                    style={{
                      padding: '14px 16px',
                      textAlign: 'left',
                      background: isActive ? 'linear-gradient(135deg, #C41E3A, #9b1c2e)' : 'var(--glass-bg)',
                      color: isActive ? 'white' : 'var(--color-text)',
                      border: isActive ? '1px solid rgba(196,30,58,0.5)' : 'var(--glass-border)',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: isActive ? '0 4px 14px rgba(196,30,58,0.3)' : 'var(--glass-shadow)',
                    }}
                  >
                    <div className="siakad-modal-header">
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '0.75rem', opacity: isActive ? 0.8 : 0.6, marginBottom: '3px', fontWeight: '600', letterSpacing: '0.05em' }}>{c.code}</div>
                        <div style={{ fontWeight: '700', fontSize: '0.9rem', lineHeight: 1.3 }}>{c.name}</div>
                      </div>
                      <span className={`siakad-badge ${isActive ? 'sks-badge-active' : ''}`} style={{ 
                        background: isActive ? '' : 'var(--glass-bg)', 
                        color: isActive ? '' : '#C41E3A !important', 
                        padding: '2px 8px', 
                        fontSize: '0.72rem', 
                        minWidth: '60px',
                        margin: '0',
                        boxShadow: isActive ? '' : 'inset 1px 1px 3px rgba(0,0,0,0.1), 1px 1px 2px rgba(255,255,255,0.8)',
                        border: isActive ? '' : '1px solid rgba(196,30,58,0.15)'
                      }}>
                        {c.sks || '?'} SKS
                      </span>
                    </div>
                    <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', opacity: isActive ? 0.85 : 0.55 }}>
                      <i className="ph ph-users"></i>
                      <span>{c.students?.length || 0} Mahasiswa</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Right: Student Table ── */}
          <div className="siakad-card stagger-2" style={{ padding: '24px 0 0 0', borderRadius: '24px', border: '1px solid var(--color-border)', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '0 24px 20px 24px', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h3 style={{ color: 'var(--color-text)', margin: '0 0 4px 0', fontWeight: '800', fontSize: '1.2rem' }}>
                  Daftar Mahasiswa
                </h3>
                <p style={{ color: 'var(--color-muted)', margin: 0, fontSize: '0.85rem' }}>
                  {filteredStudents.length} dari {selectedCourse?.students?.length || 0} mahasiswa terdaftar
                </p>
              </div>
              <div style={{ position: 'relative' }}>
                <i className="ph ph-magnifying-glass" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-muted)', fontSize: '0.9rem' }}></i>
                <input
                  type="text"
                  className="siakad-input"
                  placeholder="Cari NIM atau Nama..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    padding: '10px 14px 10px 46px',
                    width: '240px',
                    outline: 'none',
                    fontSize: '0.88rem'
                  }}
                />
              </div>
            </div>

            <div style={{ overflowX: 'auto', flex: 1, padding: '0 24px 24px 24px' }}>
              <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 12px', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--color-border)' }}>
                    <th style={{ padding: '8px 20px', fontWeight: '700', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-muted)' }}>No</th>
                    <th style={{ padding: '8px 20px', fontWeight: '700', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-muted)' }}>NIM</th>
                    <th style={{ padding: '8px 20px', fontWeight: '700', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-muted)' }}>Nama Mahasiswa</th>
                    <th style={{ padding: '8px 20px', fontWeight: '700', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-muted)' }}>Program Studi</th>
                    <th style={{ padding: '8px 20px', fontWeight: '700', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-muted)' }}>Kontak</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.length > 0 ? (
                    filteredStudents.map((mhs, idx) => (
                      <tr key={mhs.id}>
                        <td style={{ 
                          padding: '16px 20px', 
                          color: 'var(--color-muted)', 
                          fontSize: '0.9rem',
                          background: 'var(--liquid-bg)',
                          borderLeft: 'var(--inset-border)',
                          borderTop: 'var(--inset-border)',
                          borderBottom: 'var(--inset-border)',
                          borderRadius: '16px 0 0 16px',
                          boxShadow: 'inset 3px 3px 5px var(--inset-shadow-dark), inset 0 -3px 5px var(--inset-shadow-light)'
                        }}>{idx + 1}</td>
                        <td style={{ 
                          padding: '16px 20px', 
                          fontWeight: '600', 
                          fontFamily: 'monospace', 
                          fontSize: '0.9rem',
                          background: 'var(--liquid-bg)',
                          borderTop: 'var(--inset-border)',
                          borderBottom: 'var(--inset-border)',
                          boxShadow: 'inset 0 3px 5px var(--inset-shadow-dark), inset 0 -3px 5px var(--inset-shadow-light)'
                        }}>{mhs.nim || '—'}</td>
                        <td style={{ 
                          padding: '16px 20px',
                          background: 'var(--liquid-bg)',
                          borderTop: 'var(--inset-border)',
                          borderBottom: 'var(--inset-border)',
                          boxShadow: 'inset 0 3px 5px var(--inset-shadow-dark), inset 0 -3px 5px var(--inset-shadow-light)'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{
                               width: '38px', 
                               height: '38px', 
                               borderRadius: '50%',
                               background: 'rgba(0, 0, 0, 0.04)',
                               color: 'var(--apple-blue)', 
                               display: 'flex', 
                               alignItems: 'center',
                               justifyContent: 'center', 
                               fontSize: '0.85rem', 
                               fontWeight: '800',
                               flexShrink: 0, 
                               boxShadow: 'inset 3px 3px 6px var(--inset-shadow-dark), inset -3px -3px 6px var(--inset-shadow-light)',
                               border: 'var(--inset-border)'
                            }}>
                               {mhs.name?.slice(0, 2).toUpperCase()}
                            </div>
                            <span style={{ fontWeight: '600' }}>{mhs.name}</span>
                          </div>
                        </td>
                        <td style={{ 
                          padding: '16px 20px',
                          background: 'var(--liquid-bg)',
                          borderTop: 'var(--inset-border)',
                          borderBottom: 'var(--inset-border)',
                          boxShadow: 'inset 0 3px 5px var(--inset-shadow-dark), inset 0 -3px 5px var(--inset-shadow-light)'
                        }}>
                          <span className="siakad-badge-status" style={{ color: '#4f46e5', borderColor: 'rgba(79, 70, 229, 0.3)', minWidth: '130px', display: 'inline-block', textAlign: 'center' }}>
                            {mhs.prodi || 'Teknik Informatika'}
                          </span>
                        </td>
                        <td style={{ 
                          padding: '16px 20px',
                          background: 'var(--liquid-bg)',
                          borderRight: 'var(--inset-border)',
                          borderTop: 'var(--inset-border)',
                          borderBottom: 'var(--inset-border)',
                          borderRadius: '0 16px 16px 0',
                          boxShadow: 'inset -3px 3px 5px var(--inset-shadow-dark), inset 0 -3px 5px var(--inset-shadow-light)'
                        }}>
                          {mhs.phone ? (
                            <a href={`https://wa.me/${mhs.phone}`} target="_blank" rel="noreferrer"
                              style={{ color: '#047857', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: '700', fontSize: '0.88rem' }}>
                              <i className="ph ph-whatsapp-logo" style={{ fontSize: '1.1rem' }}></i>
                              {mhs.phone}
                            </a>
                          ) : <span style={{ color: 'var(--color-muted)', fontSize: '0.85rem' }}>—</span>}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" style={{ padding: '64px 20px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', opacity: 0.5 }}>
                          <i className="ph ph-users-three" style={{ fontSize: '3.5rem', color: 'var(--color-muted)' }}></i>
                          <p style={{ margin: 0, color: 'var(--color-muted)', fontWeight: '600' }}>
                            {searchTerm ? 'Mahasiswa tidak ditemukan.' : 'Belum ada mahasiswa yang terdaftar di kelas ini.'}
                          </p>
                        </div>
                      </td>
                    </tr>
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
