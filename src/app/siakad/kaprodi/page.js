'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function KaprodiDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, [router]);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('siakad_token');
      if (!token) {
        router.push('/siakad/login');
        return;
      }
      
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

      const res = await fetch(`${apiUrl}/siakad/kaprodi/stats`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        const data = await res.json();
        setStats(data);
      } else {
        router.push('/siakad/login');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !stats) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyItems: 'center', height: '100%', color: '#6b7280' }}>
      <i className="ph-spinner ph-spin" style={{ fontSize: '2rem', marginRight: '10px' }}></i> Memuat Statistik...
    </div>
  );

  return (
    <div className="fade-in" style={{ paddingBottom: '40px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h2 style={{ margin: '0 0 8px 0', color: '#1f2937', display: 'flex', alignItems: 'center', gap: '10px' }}>
            Dashboard Statistik <i className="ph-chart-pie-slice" style={{ color: '#3b82f6' }}></i>
          </h2>
          <p style={{ margin: 0, color: '#6b7280' }}>Overview dan metrik utama Program Studi Anda.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        
        <div className="siakad-card stagger-1" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px', borderLeft: '4px solid #3b82f6' }}>
          <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <i className="ph-books" style={{ fontSize: '2rem', color: '#3b82f6' }}></i>
          </div>
          <div>
            <p style={{ margin: '0 0 4px 0', color: '#6b7280', fontSize: '0.9rem' }}>Total Kelas Aktif</p>
            <h3 style={{ margin: 0, fontSize: '1.8rem', color: '#1f2937' }}>{stats.total_classes}</h3>
          </div>
        </div>
        
        <div className="siakad-card stagger-2" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px', borderLeft: '4px solid #10b981' }}>
          <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <i className="ph-student" style={{ fontSize: '2rem', color: '#10b981' }}></i>
          </div>
          <div>
            <p style={{ margin: '0 0 4px 0', color: '#6b7280', fontSize: '0.9rem' }}>Total Mahasiswa</p>
            <h3 style={{ margin: 0, fontSize: '1.8rem', color: '#1f2937' }}>{stats.total_students}</h3>
          </div>
        </div>

        <div className="siakad-card stagger-3" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px', borderLeft: '4px solid #8b5cf6' }}>
          <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: '#f5f3ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <i className="ph-chalkboard-teacher" style={{ fontSize: '2rem', color: '#8b5cf6' }}></i>
          </div>
          <div>
            <p style={{ margin: '0 0 4px 0', color: '#6b7280', fontSize: '0.9rem' }}>Total Dosen</p>
            <h3 style={{ margin: 0, fontSize: '1.8rem', color: '#1f2937' }}>{stats.total_dosens}</h3>
          </div>
        </div>

      </div>

      <div className="siakad-card stagger-4" style={{ padding: '24px' }}>
        <h3 style={{ margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: '8px', color: '#1f2937' }}>
          <i className="ph-bell-ringing" style={{ color: '#ef4444' }}></i> Peringatan Sistem
        </h3>
        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '12px', padding: '16px', color: '#991b1b', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
          <i className="ph-warning-circle" style={{ fontSize: '1.5rem', marginTop: '2px' }}></i>
          <div>
            <strong style={{ display: 'block', marginBottom: '4px' }}>Tidak Ada Peringatan Kritis</strong>
            <span style={{ fontSize: '0.9rem', color: '#b91c1c' }}>Semua dosen telah aktif mengisi jurnal BAP minggu ini. Tidak ada kelas yang kosong lebih dari 3 kali berturut-turut.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
