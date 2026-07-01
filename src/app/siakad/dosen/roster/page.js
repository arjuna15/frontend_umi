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

  if (loading) return <div style={{ padding: '40px', color: 'var(--color-text)' }}>Memuat roster kelas...</div>;

  return (
    <div className="siakad-page">
      <div className="siakad-header-block mb-4">
        <h1 className="siakad-title">Manajemen Kelas (Roster)</h1>
        <p className="siakad-subtitle">Daftar mahasiswa yang terdaftar di kelas Anda.</p>
      </div>

      {courses.length === 0 ? (
        <div className="siakad-card p-5" style={{ textAlign: 'center', opacity: 0.7 }}>
          Anda belum memiliki jadwal mengajar semester ini.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="siakad-card p-4 md:col-span-1">
            <h3 style={{ marginBottom: '16px', fontWeight: 'bold' }}>Pilih Mata Kuliah</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {courses.map(c => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCourseId(c.id.toString())}
                  style={{
                    padding: '12px 16px',
                    textAlign: 'left',
                    background: selectedCourseId === c.id.toString() ? 'var(--umiba-red)' : 'var(--glass-bg)',
                    color: selectedCourseId === c.id.toString() ? 'white' : 'var(--color-text)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    fontWeight: selectedCourseId === c.id.toString() ? 'bold' : 'normal'
                  }}
                >
                  <div style={{ fontSize: '0.85rem', opacity: 0.8 }}>{c.code}</div>
                  <div>{c.name}</div>
                  <div style={{ fontSize: '0.8rem', marginTop: '4px', opacity: 0.9 }}>
                    <i className="ph ph-users" style={{ marginRight: '4px' }}></i>
                    {c.students?.length || 0} Mahasiswa
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="siakad-card p-0 md:col-span-3" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '20px', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h3 style={{ margin: 0, fontWeight: 'bold' }}>Daftar Mahasiswa - {selectedCourse?.name}</h3>
                <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-muted)' }}>Total: {selectedCourse?.students?.length || 0} Mahasiswa</p>
              </div>
              <div style={{ position: 'relative', width: '250px' }}>
                <i className="ph ph-magnifying-glass" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-muted)' }}></i>
                <input 
                  type="text" 
                  placeholder="Cari NIM atau Nama..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 10px 10px 36px',
                    background: 'var(--glass-bg)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px',
                    color: 'var(--color-text)'
                  }}
                />
              </div>
            </div>

            <div style={{ overflowX: 'auto', flex: 1 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: 'rgba(0,0,0,0.05)', borderBottom: '1px solid var(--color-border)' }}>
                    <th style={{ padding: '16px 20px', fontWeight: '600' }}>No</th>
                    <th style={{ padding: '16px 20px', fontWeight: '600' }}>NIM</th>
                    <th style={{ padding: '16px 20px', fontWeight: '600' }}>Nama Mahasiswa</th>
                    <th style={{ padding: '16px 20px', fontWeight: '600' }}>Program Studi</th>
                    <th style={{ padding: '16px 20px', fontWeight: '600' }}>Kontak</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.length > 0 ? (
                    filteredStudents.map((mhs, idx) => (
                      <tr key={mhs.id} style={{ borderBottom: '1px solid var(--color-border)', transition: 'background 0.2s' }}>
                        <td style={{ padding: '16px 20px' }}>{idx + 1}</td>
                        <td style={{ padding: '16px 20px', fontWeight: '500' }}>{mhs.nim || '-'}</td>
                        <td style={{ padding: '16px 20px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--umiba-red)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 'bold' }}>
                              {mhs.name.charAt(0)}
                            </div>
                            <span>{mhs.name}</span>
                          </div>
                        </td>
                        <td style={{ padding: '16px 20px', color: 'var(--color-muted)' }}>{mhs.prodi || 'Teknik Informatika'}</td>
                        <td style={{ padding: '16px 20px' }}>
                          {mhs.phone ? (
                            <a href={`https://wa.me/${mhs.phone}`} target="_blank" style={{ color: '#10b981', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <i className="ph ph-whatsapp-logo"></i> {mhs.phone}
                            </a>
                          ) : '-'}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--color-muted)' }}>
                        {searchTerm ? 'Mahasiswa tidak ditemukan.' : 'Belum ada mahasiswa yang mengambil mata kuliah ini.'}
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
