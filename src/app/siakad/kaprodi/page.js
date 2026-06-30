'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import SkeletonLoader from '../../components/SkeletonLoader';

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
    <div style={{ padding: '24px' }}>
      <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--color-text)', margin: '0 0 24px 0' }}>Memuat Statistik...</h1>
      <SkeletonLoader type="card" />
      <SkeletonLoader type="chart" />
    </div>
  );

  const pieData = [
    { name: 'Hadir Penuh', value: 85 },
    { name: 'Izin', value: 10 },
    { name: 'Alpa', value: 5 },
  ];
  const COLORS = ['#10b981', '#f59e0b', '#ef4444'];

  return (
    <div className="fade-in" style={{ paddingBottom: '40px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h2 style={{ margin: '0 0 8px 0', color: '#1f2937', display: 'flex', alignItems: 'center', gap: '10px' }}>
            Dashboard Statistik <i className="ph ph-chart-pie-slice" style={{ color: '#3b82f6' }}></i>
          </h2>
          <p style={{ margin: 0, color: '#6b7280' }}>Overview dan metrik utama Program Studi Anda.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        
        <div className="siakad-card stagger-1" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px', borderLeft: '4px solid #3b82f6' }}>
          <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <i className="ph ph-books" style={{ fontSize: '2rem', color: '#3b82f6' }}></i>
          </div>
          <div>
            <p style={{ margin: '0 0 4px 0', color: '#6b7280', fontSize: '0.9rem' }}>Total Kelas Aktif</p>
            <h3 style={{ margin: 0, fontSize: '1.8rem', color: '#1f2937' }}>{stats.total_classes}</h3>
          </div>
        </div>
        
        <div className="siakad-card stagger-2" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px', borderLeft: '4px solid #10b981' }}>
          <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <i className="ph ph-student" style={{ fontSize: '2rem', color: '#10b981' }}></i>
          </div>
          <div>
            <p style={{ margin: '0 0 4px 0', color: '#6b7280', fontSize: '0.9rem' }}>Total Mahasiswa</p>
            <h3 style={{ margin: 0, fontSize: '1.8rem', color: '#1f2937' }}>{stats.total_students}</h3>
          </div>
        </div>

        <div className="siakad-card stagger-3" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px', borderLeft: '4px solid #8b5cf6' }}>
          <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: '#f5f3ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <i className="ph ph-chalkboard-teacher" style={{ fontSize: '2rem', color: '#8b5cf6' }}></i>
          </div>
          <div>
            <p style={{ margin: '0 0 4px 0', color: '#6b7280', fontSize: '0.9rem' }}>Total Dosen</p>
            <h3 style={{ margin: 0, fontSize: '1.8rem', color: '#1f2937' }}>{stats.total_dosens}</h3>
          </div>
        </div>

      </div>

      <div className="siakad-card stagger-4" style={{ marginBottom: '30px', padding: '24px' }}>
        <h3 style={{ margin: '0 0 20px 0', color: 'var(--color-text)' }}>Persentase Kehadiran Dosen (Bulan Ini)</h3>
        <div style={{ height: '300px', width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={110}
                paddingAngle={5}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ background: 'var(--color-bg)', border: 'var(--glass-border)', borderRadius: '8px', color: 'var(--color-text)' }}
                itemStyle={{ color: 'var(--color-text)' }}
              />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="siakad-card stagger-5" style={{ padding: '24px' }}>
        <h3 style={{ margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: '8px', color: '#1f2937' }}>
          <i className="ph ph-bell-ringing" style={{ color: '#ef4444' }}></i> Peringatan Sistem
        </h3>
        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '12px', padding: '16px', color: '#991b1b', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
          <i className="ph ph-warning-circle" style={{ fontSize: '1.5rem', marginTop: '2px' }}></i>
          <div>
            <strong style={{ display: 'block', marginBottom: '4px' }}>Tidak Ada Peringatan Kritis</strong>
            <span style={{ fontSize: '0.9rem', color: '#b91c1c' }}>Semua dosen telah aktif mengisi jurnal BAP minggu ini. Tidak ada kelas yang kosong lebih dari 3 kali berturut-turut.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
