"use client";
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function ProctoringStudentPage() {
  const router = useRouter();
  const [token, setToken] = useState('');
  const [session, setSession] = useState(null);
  const [joined, setJoined] = useState(false);
  const [joining, setJoining] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [timeLeft, setTimeLeft] = useState(null);
  const [violations, setViolations] = useState([]);
  const [showWarning, setShowWarning] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  
  // Quiz states
  const [quizData, setQuizData] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [loadingQuiz, setLoadingQuiz] = useState(false);

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const timerRef = useRef(null);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
  const getAuthToken = () => localStorage.getItem('siakad_token');

  const fetchQuiz = async (qId) => {
    setLoadingQuiz(true);
    try {
      const res = await fetch(`${apiUrl}/siakad/mahasiswa/quizzes/${qId}`, {
        headers: { 'Authorization': `Bearer ${getAuthToken()}` }
      });
      if (res.ok) {
        const data = await res.json();
        setQuizData(data);
      }
    } catch (e) {
      console.error('Failed to load quiz:', e);
    } finally {
      setLoadingQuiz(false);
    }
  };

  const joinSession = async () => {
    if (!token.trim()) return;
    setJoining(true);
    setMessage({ text: '', type: '' });
    try {
      const res = await fetch(`${apiUrl}/siakad/proctoring/sessions/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getAuthToken()}` },
        body: JSON.stringify({ token: token.trim() })
      });
      if (!res.ok) throw new Error('Invalid token');
      const data = await res.json();
      const sessObj = data.data || data.session || data;
      setSession(sessObj);
      setJoined(true);

      // Calculate remaining time
      if (sessObj.end_time || data.data?.end_time || data.session?.end_time) {
        const end = new Date(sessObj.end_time || data.data?.end_time || data.session?.end_time).getTime();
        const now = Date.now();
        setTimeLeft(Math.max(0, Math.floor((end - now) / 1000)));
      } else {
        setTimeLeft(3600); // default 1 hour
      }

      // Fetch the linked quiz questions
      const qId = sessObj.quiz_id;
      if (qId) {
        fetchQuiz(qId);
      }

      // Start camera
      startCamera();
    } catch (e) {
      setMessage({ text: 'Token tidak valid atau sesi belum dimulai.', type: 'error' });
    } finally { setJoining(false); }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraActive(true);
    } catch (e) {
      console.error('Camera error:', e);
      logViolation('camera_denied', 'Kamera tidak dapat diakses');
    }
  };

  const logViolation = async (type, description) => {
    const v = { type, description, timestamp: new Date().toISOString() };
    setViolations(prev => [...prev, v]);
    try {
      await fetch(`${apiUrl}/siakad/proctoring/log`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getAuthToken()}` },
        body: JSON.stringify({ token: token.trim(), event_type: type, description })
      });
    } catch (e) { console.error('Failed to log violation:', e); }
  };

  const submitQuizAnswers = async () => {
    if (!quizData) return;
    setSubmitting(true);
    try {
      const formattedAnswers = Object.entries(answers).map(([questionId, answer]) => ({
        question_id: parseInt(questionId),
        answer: answer
      }));

      const res = await fetch(`${apiUrl}/siakad/mahasiswa/quizzes/${quizData.id}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify({ answers: formattedAnswers })
      });

      if (res.ok) {
        const data = await res.json();
        setResult(data);
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
          setCameraActive(false);
        }
      } else {
        alert('Gagal mengirimkan jawaban.');
      }
    } catch (e) {
      console.error(e);
      alert('Error: ' + e.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Tab switch detection
  useEffect(() => {
    if (!joined) return;
    const handleVisibility = () => {
      if (document.hidden) {
        logViolation('tab_switch', 'Mahasiswa beralih tab/jendela');
        setShowWarning(true);
        setTimeout(() => setShowWarning(false), 3000);
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [joined, token]);

  // Timer countdown
  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0) return;
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) { clearInterval(timerRef.current); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [timeLeft !== null]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
      }
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const formatTimer = (s) => {
    if (s === null) return '--:--:--';
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  if (!joined) {
    return (
      <div className="fade-in">
        <div className="siakad-page-header">
          <div className="siakad-page-header-glow"></div>
          <div className="siakad-page-header-grid"></div>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', margin: '0 0 8px 0', letterSpacing: '0.1em', textTransform: 'uppercase' }}>SIAKAD — UJIAN</p>
            <h1 style={{ color: 'white', fontSize: '2.2rem', fontWeight: '800', margin: '0 0 8px 0', letterSpacing: '-0.03em' }}>Proctoring Ujian</h1>
            <p style={{ color: 'rgba(255,255,255,0.6)', margin: 0 }}>Masukkan token untuk bergabung ke sesi ujian yang diawasi.</p>
          </div>
        </div>

        {message.text && (
          <div style={{ padding: '16px 20px', borderRadius: '12px', marginBottom: '24px', background: message.type === 'success' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', border: `1px solid ${message.type === 'success' ? '#10b981' : '#ef4444'}`, color: message.type === 'success' ? '#10b981' : '#ef4444', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <i className={message.type === 'success' ? "ph-fill ph-check-circle" : "ph-fill ph-warning-circle"} style={{ fontSize: '1.4rem' }}></i>
            {message.text}
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 0' }}>
          <div className="siakad-card" style={{ padding: '40px', width: '100%', maxWidth: '460px', textAlign: 'center' }}>
            <div style={{ width: '70px', height: '70px', borderRadius: '18px', background: 'rgba(59,130,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
              <i className="ph ph-eye" style={{ fontSize: '2.2rem', color: '#3b82f6' }}></i>
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--color-text)', margin: '0 0 8px 0' }}>Masuk Sesi Ujian</h2>
            <p style={{ color: 'var(--color-muted)', fontSize: '0.9rem', margin: '0 0 28px 0' }}>Masukkan token yang diberikan dosen/pengawas ujian Anda.</p>
            <input id="input-exam-token" type="text" placeholder="Masukkan token ujian..." value={token} onChange={e => setToken(e.target.value.toUpperCase())} onKeyDown={e => e.key === 'Enter' && joinSession()} style={{ width: '100%', padding: '14px 18px', fontSize: '1.1rem', textAlign: 'center', letterSpacing: '0.15em', fontWeight: '700', boxSizing: 'border-box', color: 'var(--color-text)' }} />
            <button id="btn-join-session" onClick={joinSession} disabled={joining || !token.trim()} style={{ width: '100%', marginTop: '16px', background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)', color: 'white', border: 'none', padding: '14px', borderRadius: '14px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', opacity: (joining || !token.trim()) ? 0.6 : 1 }}>
              {joining ? <><i className="ph ph-spinner" style={{ animation: 'pwaSpin 1s linear infinite' }}></i> Bergabung...</> : <><i className="ph ph-sign-in"></i> Gabung Ujian</>}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Exam View (Joined)
  return (
    <div className="fade-in" style={{ position: 'relative' }}>
      {/* Warning overlay */}
      {showWarning && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(239,68,68,0.15)', backdropFilter: 'blur(2px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ background: 'rgba(239,68,68,0.95)', padding: '32px 48px', borderRadius: '20px', textAlign: 'center', color: 'white' }}>
            <i className="ph ph-warning" style={{ fontSize: '3rem', marginBottom: '12px', display: 'block' }}></i>
            <h2 style={{ margin: '0 0 8px 0', fontSize: '1.5rem', fontWeight: '800' }}>PERINGATAN!</h2>
            <p style={{ margin: 0, fontSize: '1rem' }}>Perpindahan tab terdeteksi. Aktivitas ini dicatat.</p>
          </div>
        </div>
      )}

      <div className="siakad-page-header" style={{ marginBottom: '24px' }}>
        <div className="siakad-page-header-glow"></div>
        <div className="siakad-page-header-grid"></div>
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', margin: '0 0 4px 0', letterSpacing: '0.1em', textTransform: 'uppercase' }}>UJIAN BERLANGSUNG</p>
            <h1 style={{ color: 'white', fontSize: '1.6rem', fontWeight: '800', margin: 0 }}>{session?.quiz_name || session?.title || 'Sesi Ujian'}</h1>
          </div>
          <div style={{ background: timeLeft <= 300 ? 'rgba(239,68,68,0.2)' : 'rgba(255,255,255,0.1)', padding: '12px 24px', borderRadius: '14px', backdropFilter: 'blur(10px)', border: `1px solid ${timeLeft <= 300 ? 'rgba(239,68,68,0.4)' : 'rgba(255,255,255,0.15)'}` }}>
            <p style={{ margin: '0 0 2px 0', fontSize: '0.7rem', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Sisa Waktu</p>
            <p style={{ margin: 0, fontSize: '1.6rem', fontWeight: '800', color: timeLeft <= 300 ? '#ef4444' : 'white', fontFamily: 'monospace' }}>{formatTimer(timeLeft)}</p>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '20px', alignItems: 'start' }}>
        {/* Main exam area */}
        {result !== null ? (
          /* Case A: Result is available */
          <div className="siakad-card" style={{ padding: '32px', minHeight: '400px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', color: '#10b981' }}>
              <i className="ph ph-check" style={{ fontSize: '3rem' }}></i>
            </div>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '1.6rem', fontWeight: '800', color: 'var(--color-text)' }}>Ujian Selesai Dikirim</h3>
            <p style={{ margin: '0 0 24px 0', fontSize: '0.95rem', color: 'var(--color-muted)', maxWidth: '400px' }}>
              Jawaban Anda telah berhasil disimpan di server ujian SIAKAD.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', width: '100%', maxWidth: '400px', marginBottom: '24px' }}>
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '16px' }}>
                <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--color-muted)', marginBottom: '4px' }}>Nilai Anda</span>
                <span style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--color-text)' }}>{result.score}</span>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '16px' }}>
                <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--color-muted)', marginBottom: '4px' }}>Benar / Total</span>
                <span style={{ fontSize: '1.4rem', fontWeight: '800', color: '#10b981' }}>{result.correct_count} <span style={{ fontSize: '1rem', color: 'var(--color-muted)' }}>/ {result.total_questions}</span></span>
              </div>
            </div>

            {(result.has_essay || result.essay_count > 0 || quizData?.questions?.some(q => q.type === 'essay' || q.question_type === 'essay')) && (
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', color: '#f59e0b', padding: '10px 16px', borderRadius: '10px', fontSize: '0.85rem', fontWeight: '600', marginBottom: '24px' }}>
                <i className="ph ph-info"></i>
                <span>Menunggu Penilaian Esai oleh Dosen</span>
              </div>
            )}

            <button 
              onClick={() => router.push('/siakad/mahasiswa/elearning')} 
              style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', color: 'var(--color-text)', padding: '12px 24px', borderRadius: '10px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '8px' }}
              onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}
              onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
            >
              <i className="ph ph-arrow-left"></i> Kembali ke E-Learning
            </button>
          </div>
        ) : loadingQuiz === true ? (
          /* Case B: Loading Quiz */
          <div className="siakad-card" style={{ padding: '32px', minHeight: '400px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--color-muted)' }}>
            <i className="ph ph-spinner" style={{ fontSize: '3rem', marginBottom: '16px', display: 'block', animation: 'pwaSpin 1s linear infinite' }}></i>
            <p style={{ margin: 0, fontSize: '0.95rem' }}>Memuat lembar soal...</p>
          </div>
        ) : quizData !== null ? (
          /* Case C: Quiz loaded */
          <div className="siakad-card" style={{ padding: '32px', minHeight: '400px' }}>
            <div style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '16px', marginBottom: '24px' }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '700', color: 'var(--color-text)' }}>Lembar Soal Ujian</h3>
              <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: 'var(--color-muted)' }}>Jawab seluruh pertanyaan dengan teliti. Pindah tab akan terekam oleh sistem.</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
              {quizData.questions?.map((q, i) => (
                <div key={q.id} style={{ borderBottom: i < quizData.questions.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none', paddingBottom: i < quizData.questions.length - 1 ? '24px' : '0' }}>
                  <p style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--color-text)', margin: '0 0 16px 0', lineHeight: '1.5' }}>
                    {i + 1}. {q.question}
                  </p>

                  {/* Render options based on type */}
                  {(q.question_type === 'multiple_choice' || q.type === 'multiple_choice') && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingLeft: '16px' }}>
                      {[
                        { label: q.option_a, key: 'A' },
                        { label: q.option_b, key: 'B' },
                        { label: q.option_c, key: 'C' },
                        { label: q.option_d, key: 'D' }
                      ].map(opt => (
                        <label key={opt.key} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer', fontSize: '0.92rem', color: answers[q.id] === opt.key ? 'var(--color-text)' : 'var(--color-muted)', padding: '8px 12px', borderRadius: '8px', background: answers[q.id] === opt.key ? 'rgba(59,130,246,0.08)' : 'transparent', border: answers[q.id] === opt.key ? '1px solid rgba(59,130,246,0.2)' : '1px solid transparent', transition: 'all 0.2s' }}>
                          <input 
                            type="radio" 
                            name={`q-${q.id}`} 
                            value={opt.key} 
                            checked={answers[q.id] === opt.key} 
                            onChange={() => setAnswers(prev => ({ ...prev, [q.id]: opt.key }))}
                            style={{ marginTop: '3px' }} 
                          />
                          <span><strong style={{ color: 'var(--color-text)', marginRight: '6px' }}>{opt.key}.</strong> {opt.label}</span>
                        </label>
                      ))}
                    </div>
                  )}

                  {(q.question_type === 'true_false' || q.type === 'true_false') && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingLeft: '16px' }}>
                      {[
                        { label: 'Benar', key: 'True' },
                        { label: 'Salah', key: 'False' }
                      ].map(opt => (
                        <label key={opt.key} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '0.92rem', color: answers[q.id] === opt.key ? 'var(--color-text)' : 'var(--color-muted)', padding: '8px 12px', borderRadius: '8px', background: answers[q.id] === opt.key ? 'rgba(59,130,246,0.08)' : 'transparent', border: answers[q.id] === opt.key ? '1px solid rgba(59,130,246,0.2)' : '1px solid transparent', transition: 'all 0.2s' }}>
                          <input 
                            type="radio" 
                            name={`q-${q.id}`} 
                            value={opt.key} 
                            checked={answers[q.id] === opt.key} 
                            onChange={() => setAnswers(prev => ({ ...prev, [q.id]: opt.key }))} 
                          />
                          <span>{opt.label}</span>
                        </label>
                      ))}
                    </div>
                  )}

                  {(q.question_type === 'essay' || q.type === 'essay') && (
                    <div style={{ paddingLeft: '16px' }}>
                      <textarea 
                        value={answers[q.id] || ''} 
                        onChange={(e) => setAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                        placeholder="Tuliskan jawaban esai Anda di sini..."
                        style={{ width: '100%', minHeight: '120px', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)', color: 'var(--color-text)', fontSize: '0.92rem', fontFamily: 'inherit', resize: 'vertical', outline: 'none' }}
                        onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                        onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '32px', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '20px' }}>
              <button 
                onClick={submitQuizAnswers} 
                disabled={submitting} 
                style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: 'white', border: 'none', padding: '14px 28px', borderRadius: '12px', fontWeight: '700', cursor: 'pointer', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px', opacity: submitting ? 0.6 : 1, transition: 'all 0.2s', boxShadow: '0 4px 12px rgba(16,185,129,0.2)' }}
                onMouseOver={e => !submitting && (e.currentTarget.style.boxShadow = '0 6px 16px rgba(16,185,129,0.3)')}
                onMouseOut={e => (e.currentTarget.style.boxShadow = '0 4px 12px rgba(16,185,129,0.2)')}
              >
                {submitting ? (
                  <>
                    <i className="ph ph-spinner" style={{ animation: 'pwaSpin 1s linear infinite' }}></i>
                    <span>Mengirim Jawaban...</span>
                  </>
                ) : (
                  <>
                    <i className="ph ph-paper-plane-tilt"></i>
                    <span>Kirim & Selesaikan Ujian</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          /* Case D: Fallback */
          <div className="siakad-card" style={{ padding: '32px', minHeight: '400px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--color-muted)', textAlign: 'center' }}>
            <i className="ph ph-broadcast" style={{ fontSize: '3rem', marginBottom: '16px', opacity: 0.5 }}></i>
            <p style={{ margin: 0, fontSize: '0.95rem' }}>Sesi terhubung. Menunggu lembar soal ujian dimuat...</p>
          </div>
        )}

        {/* Side panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Camera preview */}
          <div className="siakad-card" style={{ padding: '16px' }}>
            <h4 style={{ margin: '0 0 10px 0', fontSize: '0.85rem', fontWeight: '700', color: 'var(--color-text)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: cameraActive ? '#10b981' : '#ef4444', boxShadow: `0 0 6px ${cameraActive ? '#10b981' : '#ef4444'}` }}></div>
              Kamera Pengawasan
            </h4>
            <div style={{ width: '100%', aspectRatio: '4/3', borderRadius: '10px', overflow: 'hidden', background: '#0f172a', position: 'relative' }}>
              <video ref={videoRef} autoPlay playsInline muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              {!cameraActive && (
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444' }}>
                  <i className="ph ph-camera-slash" style={{ fontSize: '2rem' }}></i>
                </div>
              )}
            </div>
          </div>

          {/* Violations log */}
          <div className="siakad-card" style={{ padding: '16px' }}>
            <h4 style={{ margin: '0 0 10px 0', fontSize: '0.85rem', fontWeight: '700', color: 'var(--color-text)' }}>
              <i className="ph ph-warning" style={{ color: '#f59e0b' }}></i> Pelanggaran ({violations.length})
            </h4>
            {violations.length === 0 ? (
              <p style={{ color: 'var(--color-muted)', fontSize: '0.82rem', margin: 0, textAlign: 'center', padding: '12px 0' }}>Tidak ada pelanggaran</p>
            ) : (
              <div style={{ maxHeight: '200px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {violations.map((v, i) => (
                  <div key={i} style={{ padding: '8px 10px', borderRadius: '8px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)', fontSize: '0.78rem' }}>
                    <span style={{ color: '#ef4444', fontWeight: '600' }}>{(v.type || '').replace(/_/g, ' ')}</span>
                    <p style={{ margin: '2px 0 0', color: 'var(--color-muted)', fontSize: '0.72rem' }}>{new Date(v.timestamp).toLocaleTimeString('id-ID')}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
