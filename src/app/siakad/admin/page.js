"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import SkeletonLoader from '../components/SkeletonLoader';

export default function AdminDashboard() {
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
        if (result.user.role !== 'admin' && result.user.role !== 'kaprodi' && result.user.role !== 'superadmin') return router.push('/siakad/login');
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
    <div style={{ padding: '24px' }}>
      <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--color-text)', margin: '0 0 24px 0' }}>Memuat panel admin...</h1>
      <SkeletonLoader type="card" />
      <SkeletonLoader type="chart" />
      <SkeletonLoader type="table" />
    </div>
  );

  const chartData = Array.isArray(data.prodi_distribution) && data.prodi_distribution.length > 0
    ? data.prodi_distribution
    : [
      { name: 'Sistem Informasi', users: 120 },
      { name: 'Teknik Informatika', users: 180 },
      { name: 'Manajemen', users: 200 },
      { name: 'Akuntansi', users: 150 }
    ];

  return (
    <div className="fade-in">
      <div className="siakad-page-header">
        <div className="siakad-page-header-glow"></div>
        <div className="siakad-page-header-grid"></div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', margin: '0 0 8px 0', letterSpacing: '0.1em', textTransform: 'uppercase' }}>SIAKAD — ADMIN</p>
          <h1 style={{ color: 'white', fontSize: '2.2rem', fontWeight: '800', margin: '0 0 8px 0', letterSpacing: '-0.03em' }}>Panel Administrator</h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', margin: 0 }}>Kelola pengguna, kelas, dan pantau aktivitas akademik.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        <div className="siakad-card stagger-1" style={{ 
          padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' 
        }}>
          <div style={{ width: '50px', height: '50px', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' , flexShrink: 0 }}>
            <i className="ph ph-users"></i>
          </div>
          <div>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-muted)', margin: '0 0 4px 0' }}>Total Pengguna</p>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--color-text)', margin: 0 }}>{data.users_count}</h3>
          </div>
        </div>
        
        <div className="siakad-card stagger-2" style={{ 
          padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' 
        }}>
          <div style={{ width: '50px', height: '50px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' , flexShrink: 0 }}>
            <i className="ph ph-chalkboard"></i>
          </div>
          <div>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-muted)', margin: '0 0 4px 0' }}>Total Kelas Aktif</p>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--color-text)', margin: 0 }}>{data.courses?.length || 0}</h3>
          </div>
        </div>
      </div>

      <div className="siakad-card stagger-3" style={{ marginBottom: '32px', padding: '24px' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--color-text)', margin: '0 0 20px 0' }}>Distribusi Mahasiswa per Prodi</h2>
        <div style={{ height: '300px', width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis dataKey="name" stroke="var(--color-muted)" tick={{ fill: 'var(--color-muted)' }} axisLine={false} tickLine={false} />
              <YAxis stroke="var(--color-muted)" tick={{ fill: 'var(--color-muted)' }} axisLine={false} tickLine={false} />
              <Tooltip 
                contentStyle={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRadius: '8px', color: 'var(--color-text)' }}
                cursor={{ fill: 'var(--color-border)', opacity: 0.4 }}
              />
              <Bar dataKey="users" radius={[8, 8, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#3b82f6' : '#C41E3A'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="siakad-card stagger-4" style={{ padding: '24px', overflow: 'hidden' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--color-text)', margin: '0 0 20px 0' }}>Daftar Kelas (Overview)</h2>
        
        <div style={{ overflowX: 'auto' }}>
          <table className="siakad-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
            <thead>
              <tr>
                <th style={{ padding: '16px', fontWeight: '600' }}>Kode MK</th>
                <th style={{ padding: '16px', fontWeight: '600' }}>Mata Kuliah</th>
                <th style={{ padding: '16px', fontWeight: '600' }}>Dosen Pengampu</th>
                <th style={{ padding: '16px', fontWeight: '600' }}>SKS</th>
              </tr>
            </thead>
            <tbody>
              {data.courses && data.courses.map((c, i) => (
                <tr key={i}>
                  <td style={{ padding: '16px', fontWeight: 'bold', color: 'var(--color-text)' }}>{c.code}</td>
                  <td style={{ padding: '16px', color: 'var(--color-text)' }}>{c.name}</td>
                  <td style={{ padding: '16px', color: 'var(--color-text)' }}>{c.dosen?.name || '-'}</td>
                  <td style={{ padding: '16px', fontWeight: 'bold', color: 'var(--color-text)' }}>{c.sks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
