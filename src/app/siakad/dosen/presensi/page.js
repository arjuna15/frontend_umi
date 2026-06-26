"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DosenPresensiPage() {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      const token = localStorage.getItem('siakad_token');
      if (!token) return router.push('/siakad/login');

      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
        const res = await fetch(`${apiUrl}/siakad/dashboard`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Failed to fetch');
        const result = await res.json();
        if (result.user.role !== 'dosen') return router.push('/siakad/login');
        setData(result);
      } catch (err) {
        router.push('/siakad/login');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, [router]);

  if (loading || !data) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyItems: 'center', height: '100%', color: '#6b7280' }}>
      <i className="ph-spinner ph-spin" style={{ fontSize: '2rem', marginRight: '10px' }}></i> Memuat modul absensi...
    </div>
  );

  return (
    <div>
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#111827', margin: '0 0 8px 0' }}>Presensi Mahasiswa 📅</h1>
          <p style={{ color: '#6b7280', margin: 0 }}>Input daftar hadir pertemuan kelas hari ini.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
        {data.jadwal.map((course, i) => (
          <div key={i} style={{ 
            background: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(10px)',
            borderRadius: '16px', boxShadow: '0 8px 32px rgba(31, 38, 135, 0.05)', 
            border: '1px solid rgba(255, 255, 255, 0.18)', overflow: 'hidden' 
          }}>
            <div style={{ background: 'linear-gradient(90deg, rgba(236,253,245,1) 0%, rgba(255,255,255,0) 100%)', padding: '20px 24px', borderBottom: '1px solid rgba(209, 213, 219, 0.3)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#064e3b', fontWeight: 'bold' }}>{course.name}</h3>
                <span style={{ display: 'inline-block', marginTop: '4px', fontSize: '0.85rem', color: '#047857' }}>{course.code} • {course.sks} SKS</span>
              </div>
              <button style={{ background: '#10b981', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 10px rgba(16, 185, 129, 0.3)' }}>
                <i className="ph-plus"></i> Buat Sesi Absen
              </button>
            </div>
            
            <div style={{ padding: '24px' }}>
              {course.attendances && course.attendances.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {course.attendances.map((att, j) => (
                    <div key={j} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: 'rgba(255, 255, 255, 0.8)', border: '1px solid rgba(229, 231, 235, 0.5)', borderRadius: '12px' }}>
                      <div>
                        <strong style={{ color: '#1f2937', display: 'block', marginBottom: '4px' }}>Pertemuan ke-{att.meeting_number}</strong>
                        <span style={{ fontSize: '0.85rem', color: '#6b7280' }}><i className="ph-calendar-blank"></i> {att.date}</span>
                      </div>
                      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                        <div style={{ fontSize: '0.85rem', color: '#059669', background: '#d1fae5', padding: '4px 12px', borderRadius: '999px', fontWeight: 'bold' }}>
                          {att.records?.filter(r => r.status === 'present').length || 0} Hadir
                        </div>
                        <div style={{ fontSize: '0.85rem', color: '#dc2626', background: '#fee2e2', padding: '4px 12px', borderRadius: '999px', fontWeight: 'bold' }}>
                          {att.records?.filter(r => r.status === 'absent').length || 0} Alpa
                        </div>
                        <button style={{ background: 'transparent', border: '1px solid #d1d5db', padding: '6px 12px', borderRadius: '6px', fontSize: '0.85rem', cursor: 'pointer', color: '#374151' }}>Lihat Detail</button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: '#9ca3af', fontSize: '0.9rem', margin: 0, fontStyle: 'italic', textAlign: 'center' }}>Belum ada sesi absensi untuk kelas ini.</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
