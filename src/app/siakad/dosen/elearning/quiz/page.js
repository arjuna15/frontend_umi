'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import CustomSelect from '../../../components/CustomSelect';

export default function DosenQuizCreate() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [duration, setDuration] = useState(60);
  const [questions, setQuestions] = useState([
    { type: 'multiple_choice', question: '', option_a: '', option_b: '', option_c: '', option_d: '', correct_answer: 'A', correct_answer_text: '' }
  ]);
  const [loading, setLoading] = useState(false);

  const addQuestion = () => {
    setQuestions([...questions, { type: 'multiple_choice', question: '', option_a: '', option_b: '', option_c: '', option_d: '', correct_answer: 'A', correct_answer_text: '' }]);
  };

  const removeQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleChange = (index, field, value) => {
    const newQs = [...questions];
    newQs[index][field] = value;
    setQuestions(newQs);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('siakad_token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
      
      const payload = {
        course_id: 1, // Mock
        title,
        duration_minutes: duration,
        questions
      };

      const res = await fetch(`${apiUrl}/siakad/dosen/quiz`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        window.toast('Kuis berhasil dibuat dan diterbitkan ke mahasiswa!');
        router.push('/siakad/dosen/elearning');
      } else {
        window.toast('Gagal membuat kuis.');
      }
    } catch (err) {
      window.toast('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fade-in" style={{ paddingBottom: '40px' }}>
            <div style={{ marginBottom: '32px' }}>
        <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #4c0519 100%)', borderRadius: '24px', padding: '40px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(196,30,58,0.15)', filter: 'blur(40px)' }}></div>
          <div style={{ position: 'absolute', bottom: '-20px', left: '30%', width: '150px', height: '150px', borderRadius: '50%', background: 'rgba(99,102,241,0.1)', filter: 'blur(30px)' }}></div>
          <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button onClick={() => router.back()} style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', padding: '12px 16px', borderRadius: '12px', cursor: 'pointer', color: 'white', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.3s' }}>
              <i className="ph ph-arrow-left"></i> Kembali
            </button>
            <div>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', margin: '0 0 8px 0', letterSpacing: '0.1em', textTransform: 'uppercase' }}>SIAKAD — DOSEN</p>
              <h1 style={{ color: 'white', fontSize: '2.2rem', fontWeight: '800', margin: '0 0 8px 0', letterSpacing: '-0.03em' }}>CBT Engine: Kuis Pilihan Ganda</h1>
              <p style={{ color: 'rgba(255,255,255,0.6)', margin: 0 }}>Buat kuis otomatis dengan berbagai tipe soal dan durasi.</p>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="siakad-card stagger-1" style={{ padding: '24px', marginBottom: '24px' }}>
          <h3 style={{ margin: '0 0 16px 0' }}>Pengaturan Kuis</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Judul Kuis / Ujian</label>
              <input type="text" required value={title} onChange={e=>setTitle(e.target.value)} className="siakad-input" style={{ width: '100%' }} placeholder="Contoh: Ujian Tengah Semester (UTS)" />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Durasi Pengerjaan (Menit)</label>
              <input type="number" required value={duration} onChange={e=>setDuration(e.target.value)} className="siakad-input" style={{ width: '100%' }} placeholder="60" />
            </div>
          </div>
        </div>

        {questions.map((q, idx) => (
          <div key={idx} className={`stagger-${(idx % 5) + 2}`} style={{ background: 'var(--color-bg)', padding: '24px', borderRadius: '16px', marginBottom: '24px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', border: '1px solid var(--color-border)', position: 'relative', zIndex: 50 - idx }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <h3 style={{ margin: '0', color: 'var(--color-text)' }}>Soal {idx + 1}</h3>
                <select
                  value={q.type}
                  onChange={(e) => handleChange(idx, 'type', e.target.value)}
                  style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--glass-bg)', color: 'var(--color-text)', outline: 'none' }}
                >
                  <option value="multiple_choice">Pilihan Ganda</option>
                  <option value="true_false">Benar / Salah</option>
                  <option value="essay">Esai</option>
                </select>
              </div>
              {questions.length > 1 && (
                <button type="button" onClick={() => removeQuestion(idx)} style={{ background: 'var(--glass-bg)', color: '#ef4444', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' }}>Hapus Soal</button>
              )}
            </div>
            
            <textarea 
              required
              value={q.question} onChange={e=>handleChange(idx, 'question', e.target.value)}
              className="siakad-input" 
              style={{ width: '100%', height: '80px', marginBottom: '16px', resize: 'vertical' }} 
              placeholder="Tuliskan pertanyaan di sini..."
            ></textarea>
            
            {q.type === 'multiple_choice' && (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
                  <div>
                    <label>Opsi A</label>
                    <input required type="text" value={q.option_a} onChange={e=>handleChange(idx, 'option_a', e.target.value)} className="siakad-input" style={{ width: '100%', marginTop: '4px' }} />
                  </div>
                  <div>
                    <label>Opsi B</label>
                    <input required type="text" value={q.option_b} onChange={e=>handleChange(idx, 'option_b', e.target.value)} className="siakad-input" style={{ width: '100%', marginTop: '4px' }} />
                  </div>
                  <div>
                    <label>Opsi C</label>
                    <input required type="text" value={q.option_c} onChange={e=>handleChange(idx, 'option_c', e.target.value)} className="siakad-input" style={{ width: '100%', marginTop: '4px' }} />
                  </div>
                  <div>
                    <label>Opsi D</label>
                    <input required type="text" value={q.option_d} onChange={e=>handleChange(idx, 'option_d', e.target.value)} className="siakad-input" style={{ width: '100%', marginTop: '4px' }} />
                  </div>
                </div>

                <div style={{ marginTop: '20px' }}>
                  <label style={{ fontWeight: 600, color: 'var(--color-text)' }}>Jawaban Benar (Kunci)</label>
                  <CustomSelect 
                    name="correct_answer"
                    value={q.correct_answer} 
                    onChange={(val) => handleChange(idx, 'correct_answer', val)}
                    options={[
                      { value: 'A', label: 'Opsi A', icon: 'ph ph-check-circle' },
                      { value: 'B', label: 'Opsi B', icon: 'ph ph-check-circle' },
                      { value: 'C', label: 'Opsi C', icon: 'ph ph-check-circle' },
                      { value: 'D', label: 'Opsi D', icon: 'ph ph-check-circle' }
                    ]}
                    style={{ marginTop: '8px' }}
                  />
                </div>
              </>
            )}

            {q.type === 'true_false' && (
              <div style={{ marginTop: '16px' }}>
                <label style={{ fontWeight: 600, color: 'var(--color-text)' }}>Jawaban Benar (Kunci)</label>
                <div style={{ display: 'flex', gap: '16px', marginTop: '8px' , flexWrap: 'wrap' }}>
                  <button 
                    type="button" 
                    onClick={() => handleChange(idx, 'correct_answer', 'True')}
                    style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid var(--color-border)', background: q.correct_answer === 'True' ? '#10b981' : 'var(--glass-bg)', color: q.correct_answer === 'True' ? 'white' : 'var(--color-text)', fontWeight: 'bold', cursor: 'pointer' }}
                  >
                    Benar (True)
                  </button>
                  <button 
                    type="button" 
                    onClick={() => handleChange(idx, 'correct_answer', 'False')}
                    style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid var(--color-border)', background: q.correct_answer === 'False' ? '#ef4444' : 'var(--glass-bg)', color: q.correct_answer === 'False' ? 'white' : 'var(--color-text)', fontWeight: 'bold', cursor: 'pointer' }}
                  >
                    Salah (False)
                  </button>
                </div>
              </div>
            )}

            {q.type === 'essay' && (
              <div style={{ marginTop: '16px' }}>
                <label style={{ fontWeight: 600, color: 'var(--color-text)' }}>Kunci Jawaban / Panduan Penilaian</label>
                <textarea 
                  required
                  value={q.correct_answer_text} onChange={e=>handleChange(idx, 'correct_answer_text', e.target.value)}
                  className="siakad-input" 
                  style={{ width: '100%', height: '80px', marginTop: '8px', resize: 'vertical' }} 
                  placeholder="Tuliskan kunci jawaban esai atau poin-poin yang diharapkan..."
                ></textarea>
              </div>
            )}
          </div>
        ))}

        <div style={{ display: 'flex', gap: '16px' , flexWrap: 'wrap' }}>
          <button type="button" onClick={addQuestion} style={{ flex: 1, background: 'var(--color-border)', color: 'var(--color-text)', border: '2px dashed var(--color-muted)', padding: '16px', borderRadius: '12px', cursor: 'pointer', fontWeight: 600 }}>
            <i className="ph ph-plus"></i> Tambah Soal
          </button>
          <button type="submit" disabled={loading} style={{ flex: 1, background: '#3b82f6', color: 'white', border: 'none', padding: '16px', borderRadius: '12px', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: 600, fontSize: '1.1rem' }}>
            {loading ? 'Menyimpan...' : 'Terbitkan Kuis Sekarang'}
          </button>
        </div>
      </form>
    </div>
  );
}
