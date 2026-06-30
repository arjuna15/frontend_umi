"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function MahasiswaQuiz() {
  const router = useRouter();
  const [quizData, setQuizData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(3600); // 1 jam = 3600 detik
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  // Hardcode ID untuk demo
  const quizId = 1;

  useEffect(() => {
    const fetchQuiz = async () => {
      const token = localStorage.getItem('siakad_token');
      if (!token) return router.push('/siakad/login');
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
        const res = await fetch(`${apiUrl}/siakad/mahasiswa/quizzes/${quizId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const result = await res.json();
          setQuizData(result);
          if (result.duration_minutes) {
            setTimeLeft(result.duration_minutes * 60);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [router]);

  useEffect(() => {
    if (loading || result) return;
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit(new Event('submit'));
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [loading, result]);

  const handleAnswer = (questionId, optionKey) => {
    setAnswers(prev => ({ ...prev, [questionId]: optionKey }));
  };

  const handleSubmit = async (e) => {
    if(e) e.preventDefault();
    if (!confirm('Yakin ingin menyelesaikan kuis ini?')) return;
    
    setSubmitting(true);
    const token = localStorage.getItem('siakad_token');
    
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
      const res = await fetch(`${apiUrl}/siakad/mahasiswa/quizzes/${quizId}/submit`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ answers })
      });
      if (res.ok) {
        const resultData = await res.json();
        setResult(resultData);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--color-muted)' }}>
      <i className="ph ph-spinner ph-spin" style={{ fontSize: '2rem', marginRight: '10px' }}></i> Memuat Kuis...
    </div>
  );

  if (!quizData) return <div>Kuis tidak ditemukan.</div>;

  if (result) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
      <div className="siakad-card" style={{ padding: '40px', textAlign: 'center', maxWidth: '500px', width: '100%' }}>
        <div style={{ width: '80px', height: '80px', background: 'var(--glass-bg)', color: 'var(--color-text)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px', margin: '0 auto 20px auto' }}>
          <i className="ph ph-check-circle"></i>
        </div>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--color-text)', marginBottom: '10px' }}>Selesai!</h2>
        <p style={{ color: 'var(--color-text)', marginBottom: '24px' }}>{result.message}</p>
        <div style={{ background: 'var(--glass-bg)', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0', marginBottom: '32px' }}>
          <p style={{ margin: '0 0 8px 0', fontSize: '1.1rem', color: 'var(--color-text)' }}>Nilai Kamu:</p>
          <h1 style={{ fontSize: '4rem', margin: 0, color: 'var(--color-text)', fontWeight: '900' }}>{result.score}</h1>
        </div>
        <button onClick={() => router.push('/siakad/mahasiswa/elearning')} style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '14px 24px', borderRadius: '12px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', width: '100%' }}>
          Kembali ke Kelas
        </button>
      </div>
    </div>
  );

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const isWarningTime = timeLeft < 300; // less than 5 minutes

  return (
    <div style={{ paddingBottom: '80px' }}>
      {/* Sticky Header with Timer */}
      <div style={{ position: 'sticky', top: 0, background: 'var(--color-bg)', padding: '20px 24px', borderRadius: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', zIndex: 10 }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 'bold', color: 'var(--color-text)', margin: '0 0 4px 0' }}>{quizData.title}</h2>
          <p style={{ color: 'var(--color-text)', margin: 0, fontSize: '0.9rem' }}>Mata Kuliah: {quizData.course?.name} • Soal: {quizData.questions?.length || 0}</p>
        </div>
        <div style={{ background: isWarningTime ? '#fef2f2' : '#f0fdf4', border: `2px solid ${isWarningTime ? '#ef4444' : '#10b981'}`, padding: '12px 24px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <i className="ph ph-timer" style={{ fontSize: '1.5rem', color: isWarningTime ? '#ef4444' : '#10b981' }}></i>
          <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: isWarningTime ? '#ef4444' : '#166534', fontVariantNumeric: 'tabular-nums' }}>
            {formatTime(timeLeft)}
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        {quizData.questions && quizData.questions.length > 0 ? quizData.questions.map((q, idx) => (
          <div key={q.id} className="siakad-card" style={{ padding: '32px' }}>
            <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
              <div style={{ width: '36px', height: '36px', background: '#3b82f6', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', flexShrink: 0 }}>
                {idx + 1}
              </div>
              <h3 style={{ fontSize: '1.2rem', color: 'var(--color-text)', margin: 0, lineHeight: 1.5 }}>
                {q.question}
              </h3>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingLeft: '52px' }}>
              {['a', 'b', 'c', 'd'].map(opt => (
                <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', border: answers[q.id] === opt ? '2px solid #3b82f6' : '1px solid #e2e8f0', background: answers[q.id] === opt ? '#eff6ff' : 'white', borderRadius: '12px', cursor: 'pointer', transition: 'all 0.2s' }}>
                  <input 
                    type="radio" 
                    name={`q_${q.id}`} 
                    value={opt} 
                    checked={answers[q.id] === opt} 
                    onChange={() => handleAnswer(q.id, opt)}
                    style={{ width: '20px', height: '20px', accentcolor: 'var(--color-text)' }}
                  />
                  <span style={{ fontWeight: 'bold', textTransform: 'uppercase', color: answers[q.id] === opt ? '#2563eb' : '#64748b' }}>{opt}.</span>
                  <span style={{ fontSize: '1rem', color: 'var(--color-text)' }}>{q[`option_${opt}`]}</span>
                </label>
              ))}
            </div>
          </div>
        )) : (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--color-text)' }}>Belum ada soal untuk kuis ini.</div>
        )}

        {quizData.questions && quizData.questions.length > 0 && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
            <button 
              type="submit" 
              disabled={submitting}
              style={{ background: 'linear-gradient(135deg, #4f46e5, #3b82f6)', color: 'white', border: 'none', padding: '16px 40px', borderRadius: '16px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 10px 25px rgba(59, 130, 246, 0.4)', display: 'flex', alignItems: 'center', gap: '10px' }}
            >
              {submitting ? 'Mengirim...' : 'Kumpulkan Jawaban'} <i className="ph ph-paper-plane-right"></i>
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
