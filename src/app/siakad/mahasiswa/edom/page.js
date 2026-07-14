'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SkeletonLoader from '../../components/SkeletonLoader';

export default function EdomMahasiswaPage() {
  const router = useRouter();
  const [questions, setQuestions] = useState([]);
  const [myCourses, setMyCourses] = useState([]);
  const [selectedCourseIndex, setSelectedCourseIndex] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ course_id: '', dosen_id: '', answers: [], comments: '' });
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
  const getToken = () => localStorage.getItem('siakad_token');

  useEffect(() => {
    if (!getToken()) {
      router.push('/siakad/login');
    } else {
      initPage();
    }
  }, []);

  const initPage = async () => {
    try {
      const headers = { Authorization: `Bearer ${getToken()}`, Accept: 'application/json' };
      const [qRes, cRes] = await Promise.all([
        fetch(`${apiUrl}/siakad/edom/questions`, { headers }),
        fetch(`${apiUrl}/siakad/edom/my-courses`, { headers })
      ]);
      
      const qData = await qRes.json();
      const qs = qData.data || [];
      setQuestions(qs);
      setForm(prev => ({ ...prev, answers: qs.map(q => ({ question_id: q.id, score: 0 })) }));

      if (cRes.ok) {
        const cData = await cRes.json();
        const courses = cData.data || [];
        setMyCourses(courses);
        if (courses.length > 0) {
          setSelectedCourseIndex('0');
          setForm(prev => ({
            ...prev,
            course_id: courses[0].course_id,
            dosen_id: courses[0].dosen_id
          }));
        }
      }
    } catch(e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCourseChange = (idxVal) => {
    setSelectedCourseIndex(idxVal);
    const selected = myCourses[parseInt(idxVal)];
    if (selected) {
      setForm(prev => ({
        ...prev,
        course_id: selected.course_id,
        dosen_id: selected.dosen_id
      }));
    }
  };

  const setScore = (qId, score) => {
    setForm(prev => ({ ...prev, answers: prev.answers.map(a => a.question_id === qId ? { ...a, score } : a) }));
  };

  const handleSubmit = async () => {
    if (!form.course_id || !form.dosen_id) {
      setMessage({ text: 'Pilih mata kuliah & dosen terlebih dahulu.', type: 'error' });
      return;
    }
    if (form.answers.some(a => a.score === 0)) {
      setMessage({ text: 'Harap isi semua aspek penilaian kuesioner.', type: 'error' });
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`${apiUrl}/siakad/edom/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}`, Accept: 'application/json' },
        body: JSON.stringify(form)
      });
      if (res.ok) {
        setSubmitted(true);
        setMessage({ text: 'Evaluasi berhasil disimpan!', type: 'success' });
      } else {
        const err = await res.json();
        setMessage({ text: err.message || 'Gagal menyimpan evaluasi.', type: 'error' });
      }
    } catch(e) {
      setMessage({ text: 'Terjadi kesalahan.', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div style={{ padding: '24px' }}>
      <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--color-text)', margin: '0 0 24px 0' }}>Memuat Kuesioner EDOM...</h1>
      <SkeletonLoader type="card" />
      <SkeletonLoader type="table" />
    </div>
  );

  if (submitted) return (
    <div className="fade-in">
      <div className="siakad-page-header">
        <div className="siakad-page-header-glow"></div>
        <div className="siakad-page-header-grid"></div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', margin: '0 0 8px 0', letterSpacing: '0.1em', textTransform: 'uppercase' }}>SIAKAD — EVALUASI</p>
          <h1 style={{ color: 'white', fontSize: '2.2rem', fontWeight: '800', margin: '0 0 8px 0', letterSpacing: '-0.03em' }}>Evaluasi Dosen (EDOM)</h1>
        </div>
      </div>
      <div style={{ padding: '24px' }}>
        <div className="siakad-card" style={{ padding: '60px 40px', textAlign: 'center' }}>
          <i className="ph ph-check-circle" style={{ fontSize: '4rem', color: '#10b981', marginBottom: '16px' }}></i>
          <h1 style={{ color: 'var(--color-text)', fontSize: '2rem', fontWeight: '800', margin: '0 0 12px 0' }}>Terima Kasih!</h1>
          <p style={{ color: 'var(--color-muted)', fontSize: '1.1rem', margin: 0 }}>Evaluasi dosen Anda telah berhasil disimpan.</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fade-in">
      <div className="siakad-page-header">
        <div className="siakad-page-header-glow"></div>
        <div className="siakad-page-header-grid"></div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', margin: '0 0 8px 0', letterSpacing: '0.1em', textTransform: 'uppercase' }}>SIAKAD — MAHASISWA</p>
          <h1 style={{ color: 'white', fontSize: '2.2rem', fontWeight: '800', margin: '0 0 8px 0', letterSpacing: '-0.03em' }}>Evaluasi Dosen (EDOM)</h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', margin: 0 }}>Berikan evaluasi objektif mengenai kinerja pengajaran Dosen untuk menjaga mutu akademik.</p>
        </div>
      </div>

      <div style={{ padding: '24px' }}>
        {message && <div style={{ padding: '12px 20px', borderRadius: '12px', marginBottom: '16px', background: message.type === 'success' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', color: message.type === 'success' ? '#10b981' : '#ef4444', fontWeight: '600' }}>{message.text}</div>}

      <div className="siakad-card stagger-2" style={{ padding: '24px', marginBottom: '24px' }}>
        
        <div style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '20px', marginBottom: '24px' }}>
          <label style={{ display: 'block', marginBottom: '10px', fontSize: '0.95rem', color: 'var(--color-text)', fontWeight: '700' }}>Pilih Mata Kuliah & Dosen Pengajar</label>
          {myCourses.length > 0 ? (
            <select
              value={selectedCourseIndex}
              onChange={e => handleCourseChange(e.target.value)}
              className="siakad-input"
              style={{ width: '100%', padding: '12px 16px', fontSize: '0.95rem', color: 'var(--color-text)' }}
            >
              {myCourses.map((c, idx) => (
                <option key={idx} value={idx} style={{ background: 'var(--color-surface)', color: 'var(--color-text)' }}>
                  [{c.course_code}] {c.course_name} — {c.dosen_name}
                </option>
              ))}
            </select>
          ) : (
            <div style={{ padding: '14px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444', borderRadius: '12px', fontSize: '0.9rem', fontWeight: '600' }}>
              Anda belum memiliki KRS yang disetujui untuk mengisi kuesioner evaluasi dosen.
            </div>
          )}
        </div>

        <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--color-text)', margin: '0 0 20px 0' }}>Kuesioner Penilaian</h2>
        {questions.map((q, qi) => (
          <div key={q.id} style={{ marginBottom: '24px', padding: '20px', borderRadius: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--color-border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <p style={{ color: 'var(--color-text)', fontWeight: '600', margin: 0, flex: 1 }}><span style={{ color: 'var(--color-muted)', marginRight: '8px' }}>{qi + 1}.</span>{q.question}</p>
              <span style={{ padding: '2px 10px', borderRadius: '12px', fontSize: '0.7rem', fontWeight: '700', background: 'rgba(59,130,246,0.1)', color: '#3b82f6', whiteSpace: 'nowrap' }}>{q.category}</span>
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {[1,2,3,4,5].map(score => {
                const isSelected = form.answers.find(a => a.question_id === q.id)?.score === score;
                return (
                  <button key={score} onClick={() => setScore(q.id, score)} style={{
                    width: '48px', height: '48px', borderRadius: '50px', border: isSelected ? '2px solid #3b82f6' : '1px solid var(--color-border)',
                    background: isSelected ? 'rgba(59,130,246,0.2)' : 'rgba(255,255,255,0.05)', color: isSelected ? '#3b82f6' : 'var(--color-muted)',
                    fontSize: '1.1rem', fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s'
                  }}>{score}</button>
                );
              })}
              <span style={{ alignSelf: 'center', fontSize: '0.75rem', color: 'var(--color-muted)', marginLeft: '8px' }}>1 = Sangat Kurang, 5 = Sangat Baik</span>
            </div>
          </div>
        ))}

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: 'var(--color-muted)', fontWeight: '600' }}>Komentar / Saran (Opsional)</label>
          <textarea className="siakad-input" value={form.comments} onChange={e => setForm({...form, comments: e.target.value})} placeholder="Tulis komentar atau saran Anda..." rows={3} style={{ resize: 'vertical' }} />
        </div>

        <button onClick={handleSubmit} disabled={saving || myCourses.length === 0} className="siakad-btn-primary" style={{ padding: '14px 32px', width: '100%', borderRadius: '50px' }}>
          {saving ? 'Menyimpan...' : <><i className="ph ph-paper-plane-tilt"></i> Kirim Evaluasi</>}
        </button>
      </div>
      </div>
    </div>
  );
}
