"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import SkeletonLoader from '../components/SkeletonLoader';

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

  const pieSource = Array.isArray(stats.attendance_distribution)
    ? stats.attendance_distribution
    : Array.isArray(stats.attendance?.distribution)
      ? stats.attendance.distribution
      : [];
  const pieData = pieSource
    .map((item) => ({
      name: item.name || item.label || item.status || 'Kategori',
      value: Number(item.value ?? item.count ?? item.total ?? 0)
    }))
    .filter((item) => item.value > 0);
  const COLORS = ['#10b981', '#f59e0b', '#ef4444'];
  const warningText = stats.system_warning || stats.warning || stats.alert_message || null;

  return (
    <div className="fade-in" style={{ paddingBottom: '40px' }}>
      <div className="siakad-page-header">
        <div className="siakad-page-header-glow"></div>
        <div className="siakad-page-header-grid"></div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', margin: '0 0 8px 0', letterSpacing: '0.1em', textTransform: 'uppercase' }}>SIAKAD — KAPRODI</p>
          <h1 style={{ color: 'white', fontSize: '2.2rem', fontWeight: '800', margin: '0 0 8px 0', letterSpacing: '-0.03em', display: 'flex', alignItems: 'center', gap: '12px' }}>
            Dashboard Statistik <i className="ph ph-chart-pie-slice"></i>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', margin: 0 }}>Overview dan metrik utama Program Studi Anda.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        <div className="siakad-card stagger-1" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px', borderLeft: '4px solid #3b82f6' }}>
          <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: 'rgba(59,130,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <i className="ph ph-books" style={{ fontSize: '2rem', color: '#3b82f6' }}></i>
          </div>
          <div>
            <p style={{ margin: '0 0 4px 0', color: 'var(--color-muted)', fontSize: '0.9rem' }}>Total Kelas Aktif</p>
            <h3 style={{ margin: 0, fontSize: '1.8rem', color: 'var(--color-text)' }}>{stats.total_classes ?? 0}</h3>
          </div>
        </div>

        <div className="siakad-card stagger-2" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px', borderLeft: '4px solid #10b981' }}>
          <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: 'rgba(16,185,129,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <i className="ph ph-student" style={{ fontSize: '2rem', color: '#10b981' }}></i>
          </div>
          <div>
            <p style={{ margin: '0 0 4px 0', color: 'var(--color-muted)', fontSize: '0.9rem' }}>Total Mahasiswa</p>
            <h3 style={{ margin: 0, fontSize: '1.8rem', color: 'var(--color-text)' }}>{stats.total_students ?? 0}</h3>
          </div>
        </div>

        <div className="siakad-card stagger-3" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px', borderLeft: '4px solid #8b5cf6' }}>
          <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: 'rgba(139,92,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <i className="ph ph-chalkboard-teacher" style={{ fontSize: '2rem', color: '#8b5cf6' }}></i>
          </div>
          <div>
            <p style={{ margin: '0 0 4px 0', color: 'var(--color-muted)', fontSize: '0.9rem' }}>Total Dosen</p>
            <h3 style={{ margin: 0, fontSize: '1.8rem', color: 'var(--color-text)' }}>{stats.total_dosens ?? 0}</h3>
          </div>
        </div>
      </div>

      <div className="siakad-card stagger-4" style={{ marginBottom: '30px', padding: '24px' }}>
        <h3 style={{ margin: '0 0 20px 0', color: 'var(--color-text)' }}>Persentase Kehadiran Dosen (Bulan Ini)</h3>
        <div style={{ height: '300px', width: '100%' }}>
          {pieData.length > 0 ? (
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
                  contentStyle={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRadius: '8px', color: 'var(--color-text)' }}
                  itemStyle={{ color: 'var(--color-text)' }}
                />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-muted)', textAlign: 'center' }}>
              <div>
                <i className="ph ph-chart-pie-slice" style={{ fontSize: '2rem', display: 'block', marginBottom: '8px', opacity: 0.5 }}></i>
                Data distribusi kehadiran belum tersedia dari backend.
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="siakad-card stagger-5" style={{ padding: '24px' }}>
        <h3 style={{ margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-text)' }}>
          <i className="ph ph-bell-ringing" style={{ color: '#ef4444' }}></i> Peringatan Sistem
        </h3>
        {warningText ? (
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #fecaca', borderRadius: '12px', padding: '16px', color: 'var(--color-text)', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
            <i className="ph ph-warning-circle" style={{ fontSize: '1.5rem', marginTop: '2px', color: '#ef4444' }}></i>
            <div>
              <strong style={{ display: 'block', marginBottom: '4px', color: '#ef4444' }}>Peringatan dari Backend</strong>
              <span style={{ fontSize: '0.9rem', color: 'var(--color-text)' }}>{warningText}</span>
            </div>
          </div>
        ) : (
          <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid #bbf7d0', borderRadius: '12px', padding: '16px', color: 'var(--color-text)', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
            <i className="ph ph-check-circle" style={{ fontSize: '1.5rem', marginTop: '2px', color: '#10b981' }}></i>
            <div>
              <strong style={{ display: 'block', marginBottom: '4px', color: '#10b981' }}>Belum Ada Peringatan</strong>
              <span style={{ fontSize: '0.9rem', color: 'var(--color-text)' }}>Backend belum mengirim notifikasi kritis untuk program studi ini.</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
