'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function KaprodiKrs() {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [submissions, setSubmissions] = useState([]);
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

      const [dashRes, krsRes] = await Promise.all([
        fetch(`${apiUrl}/siakad/dashboard`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${apiUrl}/siakad/krs/pending`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      if (dashRes.ok && krsRes.ok) {
        const dashData = await dashRes.json();
        const krsData = await krsRes.json();
        setData(dashData);
        setSubmissions(Array.isArray(krsData) ? krsData : []);
      } else {
        router.push('/siakad/login');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const approveKrs = async (id) => {
    if (!confirm('Setujui KRS ini?')) return;
    try {
      const token = localStorage.getItem('siakad_token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
      const res = await fetch(`${apiUrl}/siakad/krs/approve/${id}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        alert('KRS berhasil disetujui!');
        fetchData(); // reload
      } else {
        alert('Gagal menyetujui KRS');
      }
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  if (loading || !data) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyItems: 'center', height: '100%', color: '#6b7280' }}>
      <i className="ph ph-spinner ph-spin" style={{ fontSize: '2rem', marginRight: '10px' }}></i> Memuat tabel KRS...
    </div>
  );

  return (
    <div className="fade-in" style={{ paddingBottom: '40px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h2 style={{ margin: '0 0 8px 0', color: '#1f2937', display: 'flex', alignItems: 'center', gap: '10px' }}>
            Persetujuan KRS Mahasiswa <i className="ph ph-file-signature" style={{ color: '#3b82f6' }}></i>
          </h2>
          <p style={{ margin: 0, color: '#6b7280' }}>Tinjau dan setujui Kartu Rencana Studi mahasiswa.</p>
        </div>
      </div>

      <div className="siakad-card stagger-1" style={{ overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="siakad-table" style={{ minWidth: '800px' }}>
          <thead>
            <tr>
              <th>Mahasiswa</th>
              <th>Semester</th>
              <th>Jml Mata Kuliah</th>
              <th>Status</th>
              <th style={{ textAlign: 'center' }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {submissions.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', color: '#9ca3af', padding: '40px 20px' }}>
                  Belum ada pengajuan KRS yang pending.
                </td>
              </tr>
            ) : (
              submissions.map(sub => (
                <tr key={sub.id}>
                  <td style={{ fontWeight: 500, color: '#1f2937' }}>
                    {sub.mahasiswa?.name} <br/>
                    <small style={{ color: '#6b7280' }}>{sub.mahasiswa?.nim_nip}</small>
                  </td>
                  <td>{sub.semester}</td>
                  <td>{sub.course_ids ? (typeof sub.course_ids === 'string' ? JSON.parse(sub.course_ids).length : sub.course_ids.length) : 0} Matkul</td>
                  <td>
                    <span className="siakad-badge" style={{ background: '#fef3c7', color: '#d97706' }}>
                      {sub.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <button 
                      onClick={() => approveKrs(sub.id)}
                      style={{ 
                        background: '#10b981', color: 'white', border: 'none', 
                        padding: '8px 16px', borderRadius: '8px', cursor: 'pointer',
                        fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', margin: '0 auto'
                      }}
                    >
                      <i className="ph ph-check-circle"></i> Setujui
                    </button>
                  </td>
                </tr>
              ))
            )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
