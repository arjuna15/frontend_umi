"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function BapPage() {
  const router = useRouter();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

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
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        setSubmitted(true);
        e.target.reset();
        setTimeout(() => setSubmitted(false), 3000);
        window.toast && window.toast('BAP Berhasil Disimpan!');
      } else {
        const err = await res.json();
        window.toast && window.toast('Gagal: ' + (err.message || 'Server Error'));
      }
    } catch (err) {
      window.toast && window.toast('Error: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '12px', color: 'var(--color-muted)' }}>
      <i className="ph ph-spinner ph-spin" style={{ fontSize: '2rem' }}></i> Memuat form BAP...
    </div>
  );

  return (
    <div className="fade-in" style={{ paddingBottom: '40px' }}>
      {/* Hero Header */}
      <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #064e3b 100%)', borderRadius: '24px', padding: '40px', marginBottom: '32px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '220px', height: '220px', borderRadius: '50%', background: 'rgba(16,185,129,0.2)', filter: 'blur(50px)', pointerEvents: 'none' }}></div>
        <div style={{ position: 'absolute', bottom: '-20px', left: '25%', width: '160px', height: '160px', borderRadius: '50%', background: 'rgba(99,102,241,0.15)', filter: 'blur(40px)', pointerEvents: 'none' }}></div>
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', margin: '0 0 8px 0', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: '600' }}>SIAKAD — DOSEN</p>
            <h1 style={{ color: 'white', fontSize: '2.2rem', fontWeight: '900', margin: '0 0 8px 0', letterSpacing: '-0.03em' }}>Isi Berita Acara Perkuliahan</h1>
            <p style={{ color: 'rgba(255,255,255,0.6)', margin: 0 }}>Laporkan realisasi mengajar per pertemuan sebagai kewajiban administratif.</p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            {[
              { label: 'Mata Kuliah', value: courses.length, icon: 'ph-books', color: '#10b981' },
              { label: 'Maks Pertemuan', value: 16, icon: 'ph-calendar', color: '#6366f1' },
            ].map((s, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', borderRadius: '16px', padding: '16px 20px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.15)' }}>
                <i className={`ph ${s.icon}`} style={{ fontSize: '1.5rem', color: s.color, display: 'block', marginBottom: '4px' }}></i>
                <p style={{ color: 'white', fontWeight: '800', fontSize: '1.4rem', margin: '0 0 2px 0' }}>{s.value}</p>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.7rem', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px', alignItems: 'start' }}>
        {/* Info Panel */}
        <div className="siakad-card stagger-1" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, #10b981, #059669)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <i className="ph ph-info" style={{ color: 'white', fontSize: '1.2rem' }}></i>
            </div>
            <h3 style={{ margin: 0, fontWeight: '700', color: 'var(--color-text)' }}>Panduan Pengisian</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { icon: 'ph-check-circle', color: '#10b981', text: 'Isi BAP setelah selesai mengajar di hari yang sama.' },
              { icon: 'ph-check-circle', color: '#10b981', text: 'Topik harus sesuai dengan Rencana Pembelajaran Semester (RPS).' },
              { icon: 'ph-check-circle', color: '#10b981', text: 'Nomor pertemuan dimulai dari 1 hingga 16 per semester.' },
              { icon: 'ph-warning', color: '#f59e0b', text: 'BAP yang belum diisi akan muncul sebagai notifikasi di dashboard.' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <i className={`ph ${item.icon}`} style={{ color: item.color, fontSize: '1rem', marginTop: '2px', flexShrink: 0 }}></i>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-muted)', lineHeight: 1.5 }}>{item.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Form Card */}
        <div className="siakad-card stagger-2" style={{ overflow: 'hidden' }}>
          <div style={{ background: 'linear-gradient(to right, #1e1b4b, #312e81)', padding: '20px 28px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <i className="ph ph-file-text" style={{ color: 'white', fontSize: '1.1rem' }}></i>
            </div>
            <h3 style={{ margin: 0, color: 'white', fontWeight: '700' }}>Form Pengisian BAP</h3>
          </div>

          <div style={{ padding: '32px' }}>
            {submitted && (
              <div style={{ padding: '16px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '12px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px', color: '#10b981' }}>
                <i className="ph ph-check-circle" style={{ fontSize: '1.3rem' }}></i>
                <span style={{ fontWeight: '600' }}>BAP berhasil disimpan!</span>
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Mata Kuliah */}
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', fontWeight: '700', color: 'var(--color-text)', fontSize: '0.9rem' }}>
                  <i className="ph ph-books" style={{ color: '#6366f1' }}></i> Mata Kuliah
                </label>
                <select name="course_id" required style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', border: '1px solid var(--color-border)', background: 'var(--color-bg)', color: 'var(--color-text)', fontSize: '0.95rem', outline: 'none', transition: 'border 0.2s' }}>
                  <option value="">Pilih Mata Kuliah...</option>
                  {courses.map(c => (
                    <option key={c.id} value={c.id}>{c.code} — {c.name}</option>
                  ))}
                </select>
              </div>

              {/* Pertemuan & Tanggal */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', fontWeight: '700', color: 'var(--color-text)', fontSize: '0.9rem' }}>
                    <i className="ph ph-hash" style={{ color: '#10b981' }}></i> Pertemuan Ke-
                  </label>
                  <input type="number" name="meeting_number" required min="1" max="16" placeholder="Contoh: 7"
                    style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', border: '1px solid var(--color-border)', background: 'var(--color-bg)', color: 'var(--color-text)', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', fontWeight: '700', color: 'var(--color-text)', fontSize: '0.9rem' }}>
                    <i className="ph ph-calendar-blank" style={{ color: '#f59e0b' }}></i> Tanggal Perkuliahan
                  </label>
                  <input type="date" name="date" required
                    style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', border: '1px solid var(--color-border)', background: 'var(--color-bg)', color: 'var(--color-text)', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box' }} />
                </div>
              </div>

              {/* Topik */}
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', fontWeight: '700', color: 'var(--color-text)', fontSize: '0.9rem' }}>
                  <i className="ph ph-chalkboard" style={{ color: '#C41E3A' }}></i> Topik / Materi yang Diajarkan
                </label>
                <textarea name="topic" required rows="3" placeholder="Deskripsikan materi sesuai RPS, contoh: Pengenalan algoritma sorting — Bubble Sort & Quick Sort"
                  style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', border: '1px solid var(--color-border)', background: 'var(--color-bg)', color: 'var(--color-text)', fontSize: '0.95rem', outline: 'none', resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box' }}></textarea>
              </div>

              {/* Catatan */}
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', fontWeight: '700', color: 'var(--color-text)', fontSize: '0.9rem' }}>
                  <i className="ph ph-note-pencil" style={{ color: '#8b5cf6' }}></i> Catatan / Kendala <span style={{ fontWeight: '400', color: 'var(--color-muted)', fontSize: '0.8rem' }}>(opsional)</span>
                </label>
                <textarea name="notes" rows="2" placeholder="Kendala teknis, mahasiswa yang absen banyak, atau catatan lainnya..."
                  style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', border: '1px solid var(--color-border)', background: 'var(--color-bg)', color: 'var(--color-text)', fontSize: '0.95rem', outline: 'none', resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box' }}></textarea>
              </div>

              <button type="submit" disabled={submitting}
                style={{ width: '100%', padding: '16px', background: submitting ? 'var(--color-muted)' : 'linear-gradient(135deg, #1e1b4b, #C41E3A)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '800', fontSize: '1rem', cursor: submitting ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', transition: 'all 0.2s', boxShadow: submitting ? 'none' : '0 8px 20px rgba(196,30,58,0.3)' }}>
                {submitting ? (
                  <><i className="ph ph-spinner ph-spin"></i> Menyimpan...</>
                ) : (
                  <><i className="ph ph-paper-plane-tilt"></i> Submit BAP</>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
