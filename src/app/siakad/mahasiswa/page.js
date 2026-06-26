"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function MahasiswaDashboard() {
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
        if (result.user.role !== 'mahasiswa') return router.push('/siakad/login');
        setData(result);
      } catch (err) {
        router.push('/siakad/login');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, [router]);

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyItems: 'center', height: '100%', color: '#6b7280' }}>
      <i className="ph-spinner ph-spin" style={{ fontSize: '2rem', marginRight: '10px' }}></i> Memuat data akademik...
    </div>
  );

  const totalSKS = data.krs.reduce((sum, item) => sum + (item.course?.sks || 0), 0);

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#111827', margin: '0 0 8px 0' }}>Halo, {data.user.name.split(' ')[0]}! 👋</h1>
        <p style={{ color: '#6b7280', margin: 0 }}>Selamat datang kembali di Portal Akademik Anda.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        <div style={{ background: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', border: '1px solid #f3f4f6', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '50px', height: '50px', background: '#eff6ff', color: '#3b82f6', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>
            <i className="ph-student"></i>
          </div>
          <div>
            <p style={{ fontSize: '0.85rem', color: '#6b7280', margin: '0 0 4px 0' }}>Program Studi</p>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>{data.user.prodi}</h3>
          </div>
        </div>
        <div style={{ background: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', border: '1px solid #f3f4f6', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '50px', height: '50px', background: '#fef2f2', color: '#ef4444', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>
            <i className="ph-books"></i>
          </div>
          <div>
            <p style={{ fontSize: '0.85rem', color: '#6b7280', margin: '0 0 4px 0' }}>Total SKS Diambil</p>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>{totalSKS} <span style={{ fontSize: '0.9rem', fontWeight: 'normal', color: '#9ca3af' }}>SKS</span></h3>
          </div>
        </div>
        <div style={{ background: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', border: '1px solid #f3f4f6', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '50px', height: '50px', background: '#ecfdf5', color: '#10b981', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>
            <i className="ph-chart-line-up"></i>
          </div>
          <div>
            <p style={{ fontSize: '0.85rem', color: '#6b7280', margin: '0 0 4px 0' }}>IPK Sementara</p>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>3.75</h3>
          </div>
        </div>
      </div>

      <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', border: '1px solid #f3f4f6' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>Kartu Hasil Studi (KHS)</h2>
          <button style={{ background: '#f3f4f6', border: 'none', padding: '8px 16px', borderRadius: '8px', color: '#4b5563', fontWeight: '500', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <i className="ph-printer"></i> Cetak KHS
          </button>
        </div>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
            <thead>
              <tr style={{ background: '#f9fafb', color: '#6b7280', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                <th style={{ padding: '16px', borderRadius: '8px 0 0 8px', fontWeight: '600' }}>Kode MK</th>
                <th style={{ padding: '16px', fontWeight: '600' }}>Mata Kuliah</th>
                <th style={{ padding: '16px', fontWeight: '600' }}>Semester</th>
                <th style={{ padding: '16px', fontWeight: '600' }}>SKS</th>
                <th style={{ padding: '16px', fontWeight: '600' }}>Skor</th>
                <th style={{ padding: '16px', borderRadius: '0 8px 8px 0', fontWeight: '600' }}>Nilai</th>
              </tr>
            </thead>
            <tbody style={{ color: '#374151', fontSize: '0.95rem' }}>
              {data.krs.map((item, i) => (
                <tr key={i} style={{ borderBottom: i === data.krs.length - 1 ? 'none' : '1px solid #f3f4f6' }}>
                  <td style={{ padding: '16px', fontWeight: '500' }}>{item.course?.code}</td>
                  <td style={{ padding: '16px' }}>{item.course?.name}</td>
                  <td style={{ padding: '16px', color: '#6b7280' }}>{item.course?.semester}</td>
                  <td style={{ padding: '16px' }}>{item.course?.sks}</td>
                  <td style={{ padding: '16px' }}>{item.score || '-'}</td>
                  <td style={{ padding: '16px' }}>
                    <span style={{
                      display: 'inline-block',
                      padding: '4px 12px',
                      borderRadius: '999px',
                      fontSize: '0.85rem',
                      fontWeight: 'bold',
                      background: item.grade === 'A' || item.grade === 'A-' ? '#ecfdf5' : 
                                 item.grade === 'B+' || item.grade === 'B' ? '#eff6ff' : 
                                 item.grade ? '#fef2f2' : '#f3f4f6',
                      color: item.grade === 'A' || item.grade === 'A-' ? '#059669' : 
                             item.grade === 'B+' || item.grade === 'B' ? '#2563eb' : 
                             item.grade ? '#dc2626' : '#6b7280'
                    }}>
                      {item.grade || 'Menunggu'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
