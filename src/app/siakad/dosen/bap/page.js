"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function BapPage() {
  const router = useRouter();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      const token = localStorage.getItem('siakad_token');
      if (!token) return router.push('/siakad/login');

      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
        const res = await fetch(`${apiUrl}/siakad/dosen/roster`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const result = await res.json();
          setCourses(result.courses || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const token = localStorage.getItem('siakad_token');
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
    const form = new FormData(e.target);
    const data = Object.fromEntries(form.entries());

    try {
      const res = await fetch(`${apiUrl}/siakad/dosen/bap`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        window.toast('BAP Berhasil Disimpan!');
        e.target.reset();
      } else {
        const err = await res.json();
        window.toast('Gagal: ' + (err.message || 'Server Error'));
      }
    } catch (err) {
      window.toast('Error: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div style={{ padding: '40px', color: 'var(--color-text)' }}>Memuat form BAP...</div>;

  return (
    <div className="siakad-page">
      <div className="siakad-header-block mb-4">
        <h1 className="siakad-title">Isi BAP (Berita Acara Perkuliahan)</h1>
        <p className="siakad-subtitle">Laporkan realisasi mengajar per pertemuan.</p>
      </div>

      <div className="siakad-card p-6 mx-auto" style={{ maxWidth: '600px' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Mata Kuliah</label>
            <select name="course_id" required className="form-control" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-bg)', color: 'var(--color-text)' }}>
              <option value="">Pilih Mata Kuliah...</option>
              {courses.map(c => (
                <option key={c.id} value={c.id}>{c.code} - {c.name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Pertemuan Ke-</label>
              <input type="number" name="meeting_number" required min="1" max="16" className="form-control" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-bg)', color: 'var(--color-text)' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Tanggal Perkuliahan</label>
              <input type="date" name="date" required className="form-control" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-bg)', color: 'var(--color-text)' }} />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Topik / Materi yang Diajarkan</label>
            <textarea name="topic" required rows="3" placeholder="Deskripsikan materi..." className="form-control" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-bg)', color: 'var(--color-text)' }}></textarea>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Catatan / Kendala (Opsional)</label>
            <textarea name="notes" rows="2" placeholder="Catatan tambahan atau kendala selama perkuliahan..." className="form-control" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-bg)', color: 'var(--color-text)' }}></textarea>
          </div>

          <button type="submit" disabled={submitting} className="btn-primary" style={{ width: '100%', padding: '14px', borderRadius: '8px', fontWeight: 'bold', border: 'none', cursor: 'pointer', marginTop: '10px' }}>
            {submitting ? 'Menyimpan...' : 'Submit BAP'}
          </button>
        </form>
      </div>
    </div>
  );
}
