'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function KaprodiEdom() {
  const router = useRouter();
  const [edoms, setEdoms] = useState([]);
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
        setEdoms(data.edoms);
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

  return (
    <div className="fade-in" style={{ paddingBottom: '40px' }}>
      
      <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #4c0519 100%)', borderRadius: '24px', padding: '40px', marginBottom: '32px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(196,30,58,0.15)', filter: 'blur(40px)' }}></div>
        <div style={{ position: 'absolute', bottom: '-20px', left: '30%', width: '150px', height: '150px', borderRadius: '50%', background: 'rgba(99,102,241,0.1)', filter: 'blur(30px)' }}></div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', margin: '0 0 8px 0', letterSpacing: '0.1em', textTransform: 'uppercase' }}>SIAKAD — KAPRODI</p>
          <h1 style={{ color: 'white', fontSize: '2.2rem', fontWeight: '800', margin: '0 0 8px 0', letterSpacing: '-0.03em' }}>Evaluasi Dosen Oleh Mahasiswa</h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', margin: 0 }}>Lihat hasil rating dan kritik dari mahasiswa secara anonim.</p>
        </div>
      </div>


      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        {edoms.length === 0 ? (
          <div className="siakad-card" style={{ padding: '30px', textAlign: 'center', color: 'var(--color-muted)' }}>Belum ada data evaluasi.</div>
        ) : (
          edoms.map((edom, index) => (
            <div key={edom.id} className={`siakad-card stagger-${(index % 5) + 1}`} style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div>
                  <h3 style={{ margin: '0 0 4px 0', fontSize: '1.2rem', color: 'var(--color-text)' }}>{edom.dosen?.name}</h3>
                  <span style={{ fontSize: '0.9rem', color: 'var(--color-muted)' }}>{edom.course?.name}</span>
                </div>
                <div style={{ background: 'var(--glass-bg)', padding: '6px 12px', borderRadius: '8px', color: 'var(--color-text)', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <i className="ph ph-star-fill"></i> {edom.score} / 5
                </div>
              </div>
              
              <div style={{ background: 'var(--color-bg)', padding: '16px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
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
