'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function KaprodiEdom() {
  const router = useRouter();
  const [edoms, setEdoms] = useState([]);
  const [aspects, setAspects] = useState({ pedagogik: 0, profesional: 0, sosial: 0, kepribadian: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [router]);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('siakad_token');
      if (!token) {
        router.push('/siakad/login');
        return;
      }
      
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
      const res = await fetch(`${apiUrl}/siakad/kaprodi/edom`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        const data = await res.json();
        setEdoms(data.edoms || []);
        if (data.aspect_averages) {
          setAspects(data.aspect_averages);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyItems: 'center', height: '100%', color: 'var(--color-muted)' }}>
      <i className="ph ph-spinner ph-spin" style={{ fontSize: '2rem', marginRight: '10px' }}></i> Memuat Hasil EDOM...
    </div>
  );

  const avg = edoms.length > 0 ? (edoms.reduce((acc, curr) => acc + curr.score, 0) / edoms.length).toFixed(2) : '0.00';

  return (
    <div className="fade-in" style={{ paddingBottom: '40px' }}>
      
      <div className="siakad-page-header">
        <div className="siakad-page-header-glow"></div>
        <div className="siakad-page-header-grid"></div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', margin: '0 0 8px 0', letterSpacing: '0.1em', textTransform: 'uppercase' }}>SIAKAD — KAPRODI</p>
          <h1 style={{ color: 'white', fontSize: '2.2rem', fontWeight: '800', margin: '0 0 8px 0', letterSpacing: '-0.03em' }}>Evaluasi Dosen Oleh Mahasiswa</h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', margin: 0 }}>Lihat hasil rating dan kritik dari mahasiswa secara anonim.</p>
        </div>
      </div>

      <div className="siakad-card stagger-1" style={{ padding: '24px', marginBottom: '24px' }}>
        <h2 style={{ margin: '0 0 20px 0', fontSize: '1.2rem', color: 'var(--color-text)' }}>Ringkasan Evaluasi Prodi</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px' }}>
          <div style={{ flex: '1 1 200px', display: 'flex', alignItems: 'center', gap: '16px', background: 'var(--glass-bg)', padding: '20px', borderRadius: '16px', border: '1px solid var(--color-border)' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' , flexShrink: 0 }}>
              <i className="ph ph-star-fill"></i>
            </div>
            <div>
              <p style={{ margin: 0, color: 'var(--color-muted)', fontSize: '0.9rem' }}>Rata-rata Keseluruhan</p>
              <h3 style={{ margin: 0, fontSize: '1.8rem', color: 'var(--color-text)' }}>{avg} <span style={{ fontSize: '1rem', color: 'var(--color-muted)' }}>/ 5.0</span></h3>
            </div>
          </div>
          <div style={{ flex: '2 1 400px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px' }}>
            {Object.entries(aspects).map(([key, val]) => (
              <div key={key} style={{ background: 'var(--glass-bg)', padding: '16px', borderRadius: '12px', border: '1px solid var(--color-border)' }}>
                <p style={{ margin: 0, color: 'var(--color-muted)', fontSize: '0.85rem', textTransform: 'capitalize', fontWeight: 600 }}>{key}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
                  <div style={{ flex: 1, height: '8px', background: 'var(--color-bg)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${(val / 5) * 100}%`, background: 'linear-gradient(to right, #C41E3A, #9b1c2e)', borderRadius: '4px' }}></div>
                  </div>
                  <span style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>{val}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
 
      <h3 style={{ margin: '0 0 16px 0', fontSize: '1.2rem', color: 'var(--color-text)' }}>Detail Masukan Mahasiswa</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        {edoms.length === 0 ? (
          <div className="siakad-card" style={{ padding: '30px', textAlign: 'center', color: 'var(--color-muted)' }}>Belum ada data evaluasi.</div>
        ) : (
          edoms.map((edom, index) => (
            <div key={edom.id} className={`siakad-card stagger-${(index % 5) + 1}`} style={{ padding: '24px' }}>
              <div className="siakad-modal-header">
                <div>
                  <h3 style={{ margin: '0 0 4px 0', fontSize: '1.2rem', color: 'var(--color-text)' }}>{edom.dosen?.name}</h3>
                  <span style={{ fontSize: '0.9rem', color: 'var(--color-muted)' }}>{edom.course?.name}</span>
                </div>
                <div style={{ background: 'var(--glass-bg)', padding: '6px 14px', borderRadius: '50px', color: 'var(--color-text)', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px', border: '1px solid var(--color-border)' }}>
                  <i className="ph ph-star-fill" style={{ color: '#f59e0b' }}></i> {edom.score} / 5
                </div>
              </div>
              
              <div style={{ background: 'var(--color-bg)', padding: '16px', borderRadius: '16px', border: '1px solid var(--color-border)' }}>
                <p style={{ margin: 0, fontStyle: 'italic', color: 'var(--color-muted)', fontSize: '0.95rem' }}>
                  "{edom.comment}"
                </p>
                <div style={{ marginTop: '10px', fontSize: '0.8rem', color: 'var(--color-muted)', textAlign: 'right' }}>
                  - Anonim (Mahasiswa)
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
