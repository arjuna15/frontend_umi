'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function KaprodiKrs() {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [availableCourses, setAvailableCourses] = useState([]);
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

      const [dashRes, krsRes, availRes] = await Promise.all([
        fetch(`${apiUrl}/siakad/dashboard`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${apiUrl}/siakad/krs/pending`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${apiUrl}/siakad/krs/available`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      if (dashRes.ok && krsRes.ok) {
        const dashData = await dashRes.json();
        const krsData = await krsRes.json();
        const availData = availRes.ok ? await availRes.json() : [];
        setData(dashData);
        setAvailableCourses(availData);
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

  const rejectKrs = async (id) => {
    if (!confirm('Tolak pengajuan KRS ini?')) return;
    try {
      const token = localStorage.getItem('siakad_token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
      const res = await fetch(`${apiUrl}/siakad/krs/reject/${id}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        alert('KRS berhasil ditolak!');
        fetchData(); // reload
      } else {
        alert('Gagal menolak KRS');
      }
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  if (loading || !data) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyItems: 'center', height: '100%', color: 'var(--color-muted)' }}>
      <i className="ph ph-spinner ph-spin" style={{ fontSize: '2rem', marginRight: '10px' }}></i> Memuat tabel KRS...
    </div>
  );

  return (
    <div className="fade-in" style={{ paddingBottom: '40px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h2 style={{ margin: '0 0 8px 0', color: 'var(--color-text)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            Persetujuan KRS Mahasiswa <i className="ph ph-file-signature" style={{ color: 'var(--color-text)' }}></i>
          </h2>
          <p style={{ margin: 0, color: 'var(--color-muted)' }}>Tinjau dan setujui Kartu Rencana Studi mahasiswa.</p>
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
                <td colSpan="5" style={{ textAlign: 'center', color: 'var(--color-muted)', padding: '40px 20px' }}>
                  Belum ada pengajuan KRS yang pending.
                </td>
              </tr>
            ) : (
              submissions.map(sub => (
                <tr key={sub.id}>
                  <td style={{ fontWeight: 500, color: 'var(--color-text)' }}>
                    {sub.mahasiswa?.name} <br/>
                    <small style={{ color: 'var(--color-muted)' }}>{sub.mahasiswa?.nim_nip}</small>
                  </td>
                  <td>{sub.semester}</td>
                  <td>
                    {(() => {
                      const cIds = sub.course_ids ? (typeof sub.course_ids === 'string' ? JSON.parse(sub.course_ids) : sub.course_ids) : [];
                      const cCodes = cIds.map(id => availableCourses.find(c => c.id === parseInt(id))?.code).filter(Boolean).join(', ');
                      return (
                        <>
                          <div>{cIds.length} Matkul</div>
                          {cCodes && <div style={{ fontSize: '0.8rem', color: 'var(--color-muted)', marginTop: '4px', maxWidth: '200px', lineHeight: '1.4' }}>{cCodes}</div>}
                        </>
                      );
                    })()}
                  </td>
                  <td>
                    <span className="siakad-badge" style={{ background: 'var(--glass-bg)', color: '#d97706' }}>
                      {sub.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                      <button 
                        onClick={() => approveKrs(sub.id)}
                        style={{ 
                          background: '#10b981', color: 'white', border: 'none', 
                          padding: '8px 16px', borderRadius: '8px', cursor: 'pointer',
                          fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px'
                        }}
                      >
                        <i className="ph ph-check-circle"></i> Setujui
                      </button>
                      <button 
                        onClick={() => rejectKrs(sub.id)}
                        style={{ 
                          background: 'var(--glass-bg)', color: 'white', border: 'none', 
                          padding: '8px 16px', borderRadius: '8px', cursor: 'pointer',
                          fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px'
                        }}
                      >
                        <i className="ph ph-x-circle"></i> Tolak
                      </button>
                    </div>
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
