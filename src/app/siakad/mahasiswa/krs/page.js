"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function KRSPage() {
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
      <i className="ph-spinner ph-spin" style={{ fontSize: '2rem', marginRight: '10px' }}></i> Memuat KRS Online...
    </div>
  );

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#111827', margin: '0 0 8px 0' }}>KRS Online 📝</h1>
        <p style={{ color: '#6b7280', margin: 0 }}>Pilih dan ajukan mata kuliah untuk semester ini.</p>
      </div>

      <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '12px', padding: '16px 20px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <i className="ph-info" style={{ color: '#3b82f6', fontSize: '1.5rem' }}></i>
        <p style={{ margin: 0, color: '#1e40af', fontSize: '0.9rem' }}>Masa pengisian KRS untuk Semester Ganjil 2026/2027 telah <strong>DITUTUP</strong>. Data di bawah ini adalah KRS Anda yang sudah disetujui Dosen Wali.</p>
      </div>

      <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', border: '1px solid #f3f4f6' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#1f2937', margin: '0 0 20px 0' }}>Mata Kuliah yang Diambil</h2>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
            <thead>
              <tr style={{ background: '#f9fafb', color: '#6b7280', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                <th style={{ padding: '16px', borderRadius: '8px 0 0 8px', fontWeight: '600' }}>Kode MK</th>
                <th style={{ padding: '16px', fontWeight: '600' }}>Mata Kuliah</th>
                <th style={{ padding: '16px', fontWeight: '600' }}>Dosen Pengampu</th>
                <th style={{ padding: '16px', borderRadius: '0 8px 8px 0', fontWeight: '600' }}>SKS</th>
              </tr>
            </thead>
            <tbody style={{ color: '#374151', fontSize: '0.95rem' }}>
              {data.krs.map((item, i) => (
                <tr key={i} style={{ borderBottom: i === data.krs.length - 1 ? 'none' : '1px solid #f3f4f6' }}>
                  <td style={{ padding: '16px', fontWeight: 'bold', color: '#0f172a' }}>{item.course?.code}</td>
                  <td style={{ padding: '16px' }}>{item.course?.name}</td>
                  <td style={{ padding: '16px' }}>{item.course?.dosen?.name || 'Tim Dosen'}</td>
                  <td style={{ padding: '16px', fontWeight: 'bold' }}>{item.course?.sks}</td>
                </tr>
              ))}
            </tbody>
            <tfoot style={{ borderTop: '2px solid #e5e7eb' }}>
              <tr>
                <td colSpan="3" style={{ padding: '16px', textAlign: 'right', fontWeight: 'bold', color: '#1f2937' }}>Total SKS:</td>
                <td style={{ padding: '16px', fontWeight: 'bold', color: '#B91C1C', fontSize: '1.1rem' }}>
                  {data.krs.reduce((sum, item) => sum + (item.course?.sks || 0), 0)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
