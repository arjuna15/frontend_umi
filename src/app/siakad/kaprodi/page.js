"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function KaprodiPage() {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    const token = localStorage.getItem('siakad_token');
    if (!token) return router.push('/siakad/login');

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
      
      const [dashRes, subRes] = await Promise.all([
        fetch(`${apiUrl}/siakad/dashboard`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${apiUrl}/siakad/krs/pending`, { headers: { 'Authorization': `Bearer ${token}` } })
      ]);

      if (!dashRes.ok) throw new Error('Failed to fetch');
      const result = await dashRes.json();
      if (result.user.role !== 'kaprodi') return router.push('/siakad/login');
      
      setData(result);
      
      const subData = await subRes.json();
      setSubmissions(subData);
    } catch (err) {
      router.push('/siakad/login');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [router]);

  const handleApprove = async (id) => {
    if (!confirm('Setujui KRS ini?')) return;
    
    const token = localStorage.getItem('siakad_token');
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
    
    try {
      const res = await fetch(`${apiUrl}/siakad/krs/approve/${id}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        alert('KRS Berhasil Disetujui');
        fetchData();
      }
    } catch (err) {
      alert('Error approving');
    }
  };

  const handleReject = async (id) => {
    if (!confirm('Tolak KRS ini? Mahasiswa harus mengajukan ulang.')) return;
    // In a real app we'd have a reject endpoint, we'll just delete it or update status for now
    alert('Fitur penolakan akan segera hadir.');
  };

  if (loading || !data) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyItems: 'center', height: '100%', color: '#6b7280' }}>
      <i className="ph-spinner ph-spin" style={{ fontSize: '2rem', marginRight: '10px' }}></i> Memuat Dasbor Kaprodi...
    </div>
  );

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#111827', margin: '0 0 8px 0' }}>Dasbor Kepala Program Studi 👨‍🏫</h1>
        <p style={{ color: '#6b7280', margin: 0 }}>Pantau statistik akademik dan kelola persetujuan KRS mahasiswa.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        <div className="siakad-card stagger-1" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px', borderLeft: '4px solid #3b82f6' }}>
          <div style={{ background: '#eff6ff', padding: '16px', borderRadius: '12px' }}>
            <i className="ph-users-three" style={{ fontSize: '2rem', color: '#3b82f6' }}></i>
          </div>
          <div>
            <p style={{ margin: '0 0 4px 0', color: '#6b7280', fontSize: '0.9rem' }}>Total Pengguna</p>
            <h3 style={{ margin: 0, fontSize: '1.8rem', color: '#1f2937' }}>{data.users_count || 0}</h3>
          </div>
        </div>
        <div className="siakad-card stagger-2" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px', borderLeft: '4px solid #f59e0b' }}>
          <div style={{ background: '#fef3c7', padding: '16px', borderRadius: '12px' }}>
            <i className="ph-file-signature" style={{ fontSize: '2rem', color: '#f59e0b' }}></i>
          </div>
          <div>
            <p style={{ margin: '0 0 4px 0', color: '#6b7280', fontSize: '0.9rem' }}>Menunggu Persetujuan</p>
            <h3 style={{ margin: 0, fontSize: '1.8rem', color: '#1f2937' }}>{submissions.filter(s => s.status === 'pending').length}</h3>
          </div>
        </div>
      </div>

      <div className="siakad-card stagger-3" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ padding: '24px', borderBottom: '1px solid #e5e7eb' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>Persetujuan KRS Mahasiswa</h2>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ background: 'rgba(249, 250, 251, 0.8)', borderBottom: '1px solid #e5e7eb' }}>
              <tr>
                <th style={{ padding: '16px 24px', fontWeight: '600', color: '#374151', fontSize: '0.9rem' }}>Mahasiswa</th>
                <th style={{ padding: '16px 24px', fontWeight: '600', color: '#374151', fontSize: '0.9rem' }}>Semester</th>
                <th style={{ padding: '16px 24px', fontWeight: '600', color: '#374151', fontSize: '0.9rem' }}>Jml Mata Kuliah</th>
                <th style={{ padding: '16px 24px', fontWeight: '600', color: '#374151', fontSize: '0.9rem' }}>Status</th>
                <th style={{ padding: '16px 24px', fontWeight: '600', color: '#374151', fontSize: '0.9rem', textAlign: 'right' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((sub, idx) => (
                <tr key={sub.id} style={{ borderBottom: '1px solid #e5e7eb', background: idx % 2 === 0 ? 'white' : 'rgba(249, 250, 251, 0.3)' }}>
                  <td style={{ padding: '16px 24px' }}>
                    <p style={{ margin: 0, fontWeight: 'bold', color: '#111827' }}>{sub.mahasiswa?.name}</p>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: '#6b7280' }}>{sub.mahasiswa?.nim_nip}</p>
                  </td>
                  <td style={{ padding: '16px 24px', color: '#4b5563' }}>{sub.semester}</td>
                  <td style={{ padding: '16px 24px', color: '#4b5563', fontWeight: 'bold' }}>{sub.course_ids.length} MK</td>
                  <td style={{ padding: '16px 24px' }}>
                    <span style={{ 
                      padding: '4px 12px', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 'bold',
                      background: sub.status === 'approved' ? '#dcfce7' : sub.status === 'pending' ? '#fef3c7' : '#fee2e2',
                      color: sub.status === 'approved' ? '#166534' : sub.status === 'pending' ? '#b45309' : '#991b1b'
                    }}>
                      {sub.status.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                    {sub.status === 'pending' && (
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <button 
                          onClick={() => handleApprove(sub.id)}
                          style={{ background: '#10b981', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '600' }}
                        >
                          Setujui
                        </button>
                        <button 
                          onClick={() => handleReject(sub.id)}
                          style={{ background: 'transparent', border: '1px solid #fecaca', color: '#dc2626', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '600' }}
                        >
                          Tolak
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {submissions.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ padding: '24px', textAlign: 'center', color: '#6b7280' }}>Belum ada pengajuan KRS</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
