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
      <div style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #4c0519 100%)',
        borderRadius: '24px', padding: '40px', marginBottom: '32px',
        position: 'relative', overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(196,30,58,0.15)', filter: 'blur(40px)' }}></div>
        <div style={{ position: 'absolute', bottom: '-20px', left: '30%', width: '150px', height: '150px', borderRadius: '50%', background: 'rgba(99,102,241,0.15)', filter: 'blur(30px)' }}></div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', margin: '0 0 8px 0', letterSpacing: '0.12em', textTransform: 'uppercase' }}>SIAKAD — DOSEN</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(196,30,58,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(196,30,58,0.4)' , flexShrink: 0 }}>
              <i className="ph ph-student" style={{ fontSize: '1.6rem', color: '#fca5a5' }}></i>
            </div>
            <h1 style={{ color: 'white', fontSize: '2rem', fontWeight: '800', margin: 0, letterSpacing: '-0.03em' }}>Manajemen Kelas (Roster)</h1>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.6)', margin: '0 0 20px 0' }}>Daftar mahasiswa yang terdaftar di setiap kelas yang Anda ampu semester ini.</p>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '12px', padding: '12px 20px', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.12)' }}>
              <p style={{ margin: 0, color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Total Kelas</p>
              <p style={{ margin: 0, color: 'white', fontSize: '1.5rem', fontWeight: '800' }}>{courses.length}</p>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '12px', padding: '12px 20px', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.12)' }}>
              <p style={{ margin: 0, color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Total Mahasiswa</p>
              <p style={{ margin: 0, color: 'white', fontSize: '1.5rem', fontWeight: '800' }}>
                {courses.reduce((acc, c) => acc + (c.students?.length || 0), 0)}
              </p>
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
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', alignItems: 'start' }}>
          {/* ── Left Sidebar: Course Selector ── */}
          <div className="siakad-card stagger-1" style={{ padding: '0', overflow: 'hidden' }}>
            <div style={{ background: 'linear-gradient(to right, #1e1b4b, #312e81)', padding: '16px 20px' }}>
              <h3 style={{ color: 'white', margin: 0, fontSize: '0.88rem', fontWeight: '700', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                <i className="ph ph-book-open" style={{ marginRight: '8px' }}></i>Mata Kuliah
              </h3>
            </div>
            <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {courses.map(c => {
                const isActive = selectedCourseId === c.id.toString();
                return (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCourseId(c.id.toString())}
                    style={{
                      padding: '14px 16px',
                      textAlign: 'left',
                      background: isActive ? 'linear-gradient(135deg, #C41E3A, #9b1c2e)' : 'var(--glass-bg)',
                      color: isActive ? 'white' : 'var(--color-text)',
                      border: isActive ? '1px solid rgba(196,30,58,0.5)' : '1px solid var(--color-border)',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: isActive ? '0 4px 14px rgba(196,30,58,0.3)' : 'none',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '0.75rem', opacity: isActive ? 0.8 : 0.6, marginBottom: '3px', fontWeight: '600', letterSpacing: '0.05em' }}>{c.code}</div>
                        <div style={{ fontWeight: '700', fontSize: '0.9rem', lineHeight: 1.3 }}>{c.name}</div>
                      </div>
                      <div style={{ background: isActive ? 'rgba(255,255,255,0.2)' : 'rgba(196,30,58,0.1)', color: isActive ? 'white' : 'var(--umiba-red)', padding: '2px 8px', borderRadius: '20px', fontSize: '0.72rem', fontWeight: '700', whiteSpace: 'nowrap', flexShrink: 0 }}>
                        {c.sks || '?'} SKS
                      </div>
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
          <div className="siakad-card stagger-2" style={{ padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ background: 'linear-gradient(to right, #1e1b4b, #312e81)', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h3 style={{ color: 'white', margin: '0 0 4px 0', fontWeight: '700' }}>
                  Daftar Mahasiswa — {selectedCourse?.name}
                </h3>
                <p style={{ color: 'rgba(255,255,255,0.6)', margin: 0, fontSize: '0.85rem' }}>
                  <i className="ph ph-users" style={{ marginRight: '4px' }}></i>
                  {filteredStudents.length} dari {selectedCourse?.students?.length || 0} mahasiswa
                </p>
              </div>
              <div style={{ position: 'relative' }}>
                <i className="ph ph-magnifying-glass" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}></i>
                <input
                  type="text"
                  placeholder="Cari NIM atau Nama..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    padding: '10px 14px 10px 36px',
                    background: 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '10px',
                    color: 'white',
                    width: '240px',
                    outline: 'none',
                    fontSize: '0.88rem',
                  }}
                />
              </div>
            </div>

            <div style={{ overflowX: 'auto', flex: 1 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: 'rgba(196,30,58,0.05)', borderBottom: '2px solid var(--color-border)' }}>
                    <th style={{ padding: '14px 20px', fontWeight: '700', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-muted)' }}>No</th>
                    <th style={{ padding: '14px 20px', fontWeight: '700', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-muted)' }}>NIM</th>
                    <th style={{ padding: '14px 20px', fontWeight: '700', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-muted)' }}>Nama Mahasiswa</th>
                    <th style={{ padding: '14px 20px', fontWeight: '700', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-muted)' }}>Program Studi</th>
                    <th style={{ padding: '14px 20px', fontWeight: '700', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-muted)' }}>Kontak</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.length > 0 ? (
                    filteredStudents.map((mhs, idx) => (
                      <tr
                        key={mhs.id}
                        style={{ borderBottom: '1px solid var(--color-border)', transition: 'background 0.15s' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(196,30,58,0.04)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <td style={{ padding: '16px 20px', color: 'var(--color-muted)', fontSize: '0.9rem' }}>{idx + 1}</td>
                        <td style={{ padding: '16px 20px', fontWeight: '600', fontFamily: 'monospace', fontSize: '0.9rem' }}>{mhs.nim || '—'}</td>
                        <td style={{ padding: '16px 20px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{
                              width: '38px', height: '38px', borderRadius: '50%',
                              background: getAvatarGradient(mhs.name),
                              color: 'white', display: 'flex', alignItems: 'center',
                              justifyContent: 'center', fontSize: '0.85rem', fontWeight: '700',
                              flexShrink: 0, boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                            }}>
                              {mhs.name?.slice(0, 2).toUpperCase()}
                            </div>
                            <span style={{ fontWeight: '600' }}>{mhs.name}</span>
                          </div>
                        </td>
                        <td style={{ padding: '16px 20px' }}>
                          <span style={{ background: 'rgba(99,102,241,0.1)', color: '#6366f1', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '600' }}>
                            {mhs.prodi || 'Teknik Informatika'}
                          </span>
                        </td>
                        <td style={{ padding: '16px 20px' }}>
                          {mhs.phone ? (
                            <a href={`https://wa.me/${mhs.phone}`} target="_blank" rel="noreferrer"
                              style={{ color: '#10b981', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: '500', fontSize: '0.88rem' }}>
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
