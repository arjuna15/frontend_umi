"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RekapPresensiPage() {
  const router = useRouter();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchRekap();
  }, []);

  const fetchRekap = async () => {
    const token = localStorage.getItem('siakad_token');
    if (!token) return router.push('/siakad/login');

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
      const res = await fetch(`${apiUrl}/siakad/dosen/rekap-presensi`, {
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

  const selectedCourse = courses.find(c => c.id.toString() === selectedCourseId);
  
  const filteredStudents = selectedCourse?.students?.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (s.nim && s.nim.toLowerCase().includes(searchTerm.toLowerCase()))
  ) || [];

  if (loading) return <div style={{ padding: '40px', color: 'var(--color-text)' }}>Memuat rekap presensi...</div>;

  return (
    <div className="siakad-page">
      <div className="siakad-header-block mb-4">
        <h1 className="siakad-title">Rekap Kehadiran Mahasiswa</h1>
        <p className="siakad-subtitle">Pantau tingkat kehadiran mahasiswa di kelas Anda. Batas minimum kehadiran ujian adalah 75%.</p>
      </div>

      {courses.length === 0 ? (
        <div className="siakad-card p-5" style={{ textAlign: 'center', opacity: 0.7 }}>
          Anda belum memiliki jadwal mengajar atau data presensi.
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
                </button>
              ))}
            </div>
          </div>

          <div className="siakad-card p-0 md:col-span-3" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '20px', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h3 style={{ margin: 0, fontWeight: 'bold' }}>Laporan Presensi - {selectedCourse?.name}</h3>
                <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-muted)' }}>Total Pertemuan Berlangsung: {selectedCourse?.total_meetings || 0} Pertemuan</p>
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
                    <th style={{ padding: '16px 20px', fontWeight: '600' }}>NIM</th>
                    <th style={{ padding: '16px 20px', fontWeight: '600' }}>Nama Mahasiswa</th>
                    <th style={{ padding: '16px 20px', fontWeight: '600', textAlign: 'center' }}>Hadir</th>
                    <th style={{ padding: '16px 20px', fontWeight: '600', textAlign: 'center' }}>Persentase</th>
                    <th style={{ padding: '16px 20px', fontWeight: '600', textAlign: 'center' }}>Status Kelayakan</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.length > 0 ? (
                    filteredStudents.map((mhs) => {
                      const percentage = mhs.attendance_percentage || 0;
                      const isEligible = percentage >= 75;
                      return (
                        <tr key={mhs.id} style={{ borderBottom: '1px solid var(--color-border)', transition: 'background 0.2s' }}>
                          <td style={{ padding: '16px 20px', fontWeight: '500' }}>{mhs.nim || '-'}</td>
                          <td style={{ padding: '16px 20px' }}>{mhs.name}</td>
                          <td style={{ padding: '16px 20px', textAlign: 'center' }}>
                            <span style={{ fontWeight: 'bold' }}>{mhs.present_count || 0}</span> / {selectedCourse?.total_meetings || 0}
                          </td>
                          <td style={{ padding: '16px 20px', textAlign: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                              <div style={{ width: '60px', height: '6px', background: 'var(--color-border)', borderRadius: '3px', overflow: 'hidden' }}>
                                <div style={{ width: `${percentage}%`, height: '100%', background: isEligible ? '#10b981' : '#ef4444' }}></div>
                              </div>
                              <span style={{ fontWeight: 'bold', color: isEligible ? '#10b981' : '#ef4444' }}>{percentage.toFixed(0)}%</span>
                            </div>
                          </td>
                          <td style={{ padding: '16px 20px', textAlign: 'center' }}>
                            {isEligible ? (
                              <span style={{ padding: '4px 10px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 'bold' }}>Aman (Bisa Ujian)</span>
                            ) : (
                              <span style={{ padding: '4px 10px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 'bold' }}>Tidak Memenuhi Syarat</span>
                            )}
                          </td>
                        </tr>
                      );
                    })
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
