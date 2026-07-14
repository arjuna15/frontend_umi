"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function MahasiswaPresensi() {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [coords, setCoords] = useState({ bintaro: '-6.2758, 106.7405', pasar_minggu: '-6.2842, 106.8442' });

  const fetchPresensi = async () => {
    const token = localStorage.getItem('siakad_token');
    if (!token) return router.push('/siakad/login');
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
      
      const settingsRes = await fetch(`${apiUrl}/siakad/settings`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (settingsRes.ok) {
        const settingsData = await settingsRes.json();
        setCoords({
          bintaro: settingsData.siakad_coord_bintaro || '-6.2758, 106.7405',
          pasar_minggu: settingsData.siakad_coord_pasar_minggu || '-6.2842, 106.8442'
        });
      }

      const res = await fetch(`${apiUrl}/siakad/mahasiswa/presensi`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const result = await res.json();
        setData(result);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPresensi();
  }, [router]);

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3; // metres
    const φ1 = lat1 * Math.PI/180;
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180;
    const Δλ = (lon2-lon1) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c;
  };

  const submitAttendance = async (attendanceId) => {
    const token = localStorage.getItem('siakad_token');
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
      const res = await fetch(`${apiUrl}/siakad/mahasiswa/presensi/${attendanceId}/submit`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        window.toast('Kehadiran berhasil dicatat!');
        fetchPresensi();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleAttend = async (session) => {
    if (!await window.toast.confirm(`Tandai kehadiran untuk sesi ini? Mode kelas: ${session.mode}`)) return;
    
    if (session.mode !== 'Online') {
      if (!navigator.geolocation) {
        window.toast('Geolocation tidak didukung oleh browser Anda.');
        return;
      }
      
      setSubmitting(true);
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        const bintaroStr = coords.bintaro;
        const pmStr = coords.pasar_minggu;
        
        const parseCoord = (str) => {
          const parts = str.split(',');
          return { lat: parseFloat(parts[0]), lng: parseFloat(parts[1]) };
        };

        const campuses = {
          'Bintaro': parseCoord(bintaroStr),
          'Pasar Minggu': parseCoord(pmStr)
        };
        const target = campuses[session.mode];
        if (!target) {
           window.toast('Lokasi kampus tidak valid.');
           setSubmitting(false);
           return;
        }
        
        const dist = calculateDistance(latitude, longitude, target.lat, target.lng);
        // We will allow up to 50m for realistic geofencing
        if (dist > 50) {
          window.toast(`Gagal: Anda berada ${Math.round(dist)}m dari kampus ${session.mode}. Jarak maksimal adalah 50m.`);
          setSubmitting(false);
          return;
        }
        
        window.toast(`Lokasi terverifikasi (${Math.round(dist)}m dari kampus).`);
        submitAttendance(session.id);
      }, (error) => {
        window.toast('Gagal mendapatkan lokasi. Pastikan GPS aktif dan diizinkan.');
        setSubmitting(false);
      }, {
        enableHighAccuracy: true
      });
    } else {
      setSubmitting(true);
      submitAttendance(session.id);
    }
  };

  if (loading || !data) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--color-muted)' }}>
      <i className="ph ph-spinner ph-spin" style={{ fontSize: '2rem', marginRight: '10px' }}></i> Memuat modul presensi...
    </div>
  );

  return (
    <div>
      <div className="siakad-page-header">
        <div className="siakad-page-header-glow"></div>
        <div className="siakad-page-header-grid"></div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', margin: '0 0 8px 0', letterSpacing: '0.1em', textTransform: 'uppercase' }}>SIAKAD — MAHASISWA</p>
          <h1 style={{ color: 'white', fontSize: '2.2rem', fontWeight: '800', margin: '0 0 8px 0', letterSpacing: '-0.03em' }}>Presensi Mahasiswa</h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', margin: 0 }}>Catat kehadiran mandiri dan pantau persentase absensi Anda.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        {data.map((course, idx) => {
          const percentage = Math.round((course.attended / course.total_meetings) * 100);
          const isSafe = percentage >= 75;
          
          return (
            <div key={idx} className="siakad-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <h3 style={{ margin: '0 0 4px 0', fontSize: '1.2rem', color: 'var(--color-text)', fontWeight: 'bold' }}>{course.course_name}</h3>
                <span style={{ fontSize: '0.85rem', color: 'var(--color-muted)', fontWeight: '600' }}>{course.course_code}</span>
              </div>
              
              <div>
                <div className="siakad-modal-header">
                  <span style={{ color: 'var(--color-text)', fontWeight: '600' }}>Kehadiran: {course.attended}/{course.total_meetings}</span>
                  <span style={{ fontWeight: 'bold', color: isSafe ? '#10b981' : '#ef4444' }}>{percentage}%</span>
                </div>
                <div style={{ height: '8px', background: 'var(--glass-bg)', borderRadius: '999px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${percentage}%`, background: isSafe ? '#10b981' : '#ef4444', borderRadius: '999px', transition: 'width 0.5s ease' }}></div>
                </div>
                {!isSafe && (
                  <p style={{ margin: '8px 0 0 0', fontSize: '0.8rem', color: '#ef4444', fontStyle: 'italic' }}>* Persentase kurang dari 75% (Syarat UAS).</p>
                )}
              </div>
              
              {course.active_session ? (
                <div style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
                  <p style={{ margin: '0 0 12px 0', fontSize: '0.95rem', color: 'var(--color-text)', fontWeight: '600' }}>Sesi Absen Pertemuan ke-{course.active_session.meeting} Dibuka! ({course.active_session.mode})</p>
                  <button 
                    onClick={() => handleAttend(course.active_session)}
                    disabled={submitting}
                    style={{ background: '#10b981', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '50px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', width: '100%', boxShadow: '0 4px 10px rgba(16,185,129,0.3)' }}
                  >
                    {submitting ? 'Mencatat...' : 'KLIK UNTUK HADIR'}
                  </button>
                </div>
              ) : (
                <div style={{ background: 'var(--glass-bg)', border: '1px dashed var(--color-border)', padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-text)' }}>Tidak ada sesi absen yang aktif saat ini.</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
