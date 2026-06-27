"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

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
    <div style={{ display: 'flex', alignItems: 'center', justifyItems: 'center', height: '100%', color: '#6b7280' }}>
      <i className="ph ph-spinner ph-spin" style={{ fontSize: '2rem', marginRight: '10px' }}></i> Memuat panel admin...
    </div>
  );

  return (
    <div>
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#111827', margin: '0 0 8px 0' }}>Panel Administrator 🛡️</h1>
          <p style={{ color: '#6b7280', margin: 0 }}>Kelola pengguna, kelas, dan pantau aktivitas akademik.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        <div style={{ 
          background: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(10px)',
          padding: '24px', borderRadius: '16px', boxShadow: '0 8px 32px rgba(31, 38, 135, 0.05)', 
          border: '1px solid rgba(255, 255, 255, 0.18)', display: 'flex', alignItems: 'center', gap: '16px' 
        }}>
          <div style={{ width: '50px', height: '50px', background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)', color: 'white', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>
            <i className="ph ph-users"></i>
          </div>
          <div>
            <p style={{ fontSize: '0.85rem', color: '#6b7280', margin: '0 0 4px 0' }}>Total Pengguna</p>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>{data.users_count}</h3>
          </div>
        </div>
        
        <div style={{ 
          background: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(10px)',
          padding: '24px', borderRadius: '16px', boxShadow: '0 8px 32px rgba(31, 38, 135, 0.05)', 
          border: '1px solid rgba(255, 255, 255, 0.18)', display: 'flex', alignItems: 'center', gap: '16px' 
        }}>
          <div style={{ width: '50px', height: '50px', background: 'linear-gradient(135deg, #10b981 0%, #047857 100%)', color: 'white', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>
            <i className="ph ph-chalkboard"></i>
          </div>
          <div>
            <p style={{ fontSize: '0.85rem', color: '#6b7280', margin: '0 0 4px 0' }}>Total Kelas Aktif</p>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>{data.courses?.length || 0}</h3>
          </div>
        </div>
      </div>

      <div style={{ 
        background: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(10px)', borderRadius: '16px', padding: '24px', 
        boxShadow: '0 8px 32px rgba(31, 38, 135, 0.05)', border: '1px solid rgba(255, 255, 255, 0.18)' 
      }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#1f2937', margin: '0 0 20px 0' }}>Daftar Kelas (Overview)</h2>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
            <thead>
              <tr style={{ background: 'rgba(243, 244, 246, 0.5)', color: '#6b7280', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                <th style={{ padding: '16px', borderRadius: '8px 0 0 8px', fontWeight: '600' }}>Kode MK</th>
                <th style={{ padding: '16px', fontWeight: '600' }}>Mata Kuliah</th>
                <th style={{ padding: '16px', fontWeight: '600' }}>Dosen Pengampu</th>
                <th style={{ padding: '16px', borderRadius: '0 8px 8px 0', fontWeight: '600' }}>SKS</th>
              </tr>
            </thead>
            <tbody style={{ color: '#374151', fontSize: '0.95rem' }}>
              {data.courses && data.courses.map((c, i) => (
                <tr key={i} style={{ borderBottom: i === data.courses.length - 1 ? 'none' : '1px solid rgba(229, 231, 235, 0.5)' }}>
                  <td style={{ padding: '16px', fontWeight: 'bold', color: '#0f172a' }}>{c.code}</td>
                  <td style={{ padding: '16px' }}>{c.name}</td>
                  <td style={{ padding: '16px' }}>{c.dosen?.name || '-'}</td>
                  <td style={{ padding: '16px', fontWeight: 'bold' }}>{c.sks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
