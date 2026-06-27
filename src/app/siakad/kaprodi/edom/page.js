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
    <div style={{ display: 'flex', alignItems: 'center', justifyItems: 'center', height: '100%', color: '#6b7280' }}>
      <i className="ph-spinner ph-spin" style={{ fontSize: '2rem', marginRight: '10px' }}></i> Memuat Hasil EDOM...
    </div>
  );

  return (
    <div className="fade-in" style={{ paddingBottom: '40px' }}>
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ margin: '0 0 8px 0', color: '#1f2937', display: 'flex', alignItems: 'center', gap: '10px' }}>
          Evaluasi Dosen Oleh Mahasiswa <i className="ph-star-half" style={{ color: '#3b82f6' }}></i>
        </h2>
        <p style={{ margin: 0, color: '#6b7280' }}>Lihat hasil rating dan kritik dari mahasiswa secara anonim.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        {edoms.length === 0 ? (
          <div className="siakad-card" style={{ padding: '30px', textAlign: 'center', color: '#6b7280' }}>Belum ada data evaluasi.</div>
        ) : (
          edoms.map((edom, index) => (
            <div key={edom.id} className={`siakad-card stagger-${(index % 5) + 1}`} style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div>
                  <h3 style={{ margin: '0 0 4px 0', fontSize: '1.2rem', color: '#1f2937' }}>{edom.dosen?.name}</h3>
                  <span style={{ fontSize: '0.9rem', color: '#6b7280' }}>{edom.course?.name}</span>
                </div>
                <div style={{ background: '#fef3c7', padding: '6px 12px', borderRadius: '8px', color: '#b45309', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <i className="ph-star-fill"></i> {edom.score} / 5
                </div>
              </div>
              
              <div style={{ background: '#f9fafb', padding: '16px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                <p style={{ margin: 0, fontStyle: 'italic', color: '#4b5563', fontSize: '0.95rem' }}>
                  "{edom.comment}"
                </p>
                <div style={{ marginTop: '10px', fontSize: '0.8rem', color: '#9ca3af', textAlign: 'right' }}>
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
