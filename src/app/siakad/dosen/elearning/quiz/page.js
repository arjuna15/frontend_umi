'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function QuizBuilder() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [duration, setDuration] = useState(60);
  const [questions, setQuestions] = useState([
    { question: '', option_a: '', option_b: '', option_c: '', option_d: '', correct_answer: 'A' }
  ]);
  const [loading, setLoading] = useState(false);

  const addQuestion = () => {
    setQuestions([...questions, { question: '', option_a: '', option_b: '', option_c: '', option_d: '', correct_answer: 'A' }]);
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
        alert('Kuis berhasil dibuat dan diterbitkan ke mahasiswa!');
        router.push('/siakad/dosen/elearning');
      } else {
        alert('Gagal membuat kuis.');
      }
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fade-in" style={{ paddingBottom: '40px' }}>
      <div style={{ marginBottom: '30px', display: 'flex', gap: '16px', alignItems: 'center' }}>
        <button onClick={() => router.back()} style={{ background: '#f1f5f9', border: 'none', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer' }}>
          <i className="ph ph-arrow-left"></i> Kembali
        </button>
        <div>
          <h2 style={{ margin: '0 0 4px 0', color: '#1f2937' }}>CBT Engine: Kuis Pilihan Ganda</h2>
          <p style={{ margin: 0, color: '#6b7280' }}>Buat kuis otomatis dengan durasi dan nilai instan.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="siakad-card stagger-1" style={{ padding: '24px', marginBottom: '24px' }}>
          <h3 style={{ margin: '0 0 16px 0' }}>Pengaturan Kuis</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
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
          <div key={idx} className={`siakad-card stagger-${(idx % 5) + 2}`} style={{ padding: '24px', marginBottom: '24px', position: 'relative' }}>
            <div style={{ position: 'absolute', top: '24px', right: '24px' }}>
              {questions.length > 1 && (
                <button type="button" onClick={() => removeQuestion(idx)} style={{ background: '#fee2e2', color: '#ef4444', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' }}>Hapus Soal</button>
              )}
            </div>
            <h3 style={{ margin: '0 0 16px 0', color: '#3b82f6' }}>Soal {idx + 1}</h3>
            <textarea 
              required
              value={q.question} onChange={e=>handleChange(idx, 'question', e.target.value)}
              className="siakad-input" 
              style={{ width: '100%', height: '80px', marginBottom: '16px', resize: 'vertical' }} 
              placeholder="Tuliskan pertanyaan di sini..."
            ></textarea>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
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
              <label style={{ fontWeight: 600, color: '#10b981' }}>Jawaban Benar (Kunci)</label>
              <select value={q.correct_answer} onChange={e=>handleChange(idx, 'correct_answer', e.target.value)} className="siakad-input" style={{ width: '100%', marginTop: '8px', border: '2px solid #10b981', background: '#ecfdf5' }}>
                <option value="A">Opsi A</option>
                <option value="B">Opsi B</option>
                <option value="C">Opsi C</option>
                <option value="D">Opsi D</option>
              </select>
            </div>
          </div>
        ))}

        <div style={{ display: 'flex', gap: '16px' }}>
          <button type="button" onClick={addQuestion} style={{ flex: 1, background: '#f3f4f6', color: '#374151', border: '2px dashed #d1d5db', padding: '16px', borderRadius: '12px', cursor: 'pointer', fontWeight: 600 }}>
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
