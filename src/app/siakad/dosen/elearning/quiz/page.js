'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import CustomSelect from '../../../components/CustomSelect';

export default function DosenQuizCreate() {
  const router = useRouter();
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [title, setTitle] = useState('');
  const [duration, setDuration] = useState(60);
  const [questions, setQuestions] = useState([
    { type: 'multiple_choice', question: '', option_a: '', option_b: '', option_c: '', option_d: '', correct_answer: 'A', correct_answer_text: '' }
  ]);
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState('kuis'); // 'kuis', 'uts', 'uas'
  const [requireProctoring, setRequireProctoring] = useState(false);

  useEffect(() => {
    const fetchDashboard = async () => {
      const token = localStorage.getItem('siakad_token');
      if (!token) return router.push('/siakad/login');
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
        const res = await fetch(`${apiUrl}/siakad/dosen/dashboard`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Failed to fetch');
        const result = await res.json();
        const courseList = Array.isArray(result.courses) ? result.courses.map((c) => ({ id: c.id, name: c.name, code: c.code })) : [];
        setCourses(courseList);
        if (courseList.length > 0) {
          setSelectedCourseId(String(courseList[0].id));
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchDashboard();
  }, [router]);

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
      
      if (!selectedCourseId) {
        window.toast('Pilih mata kuliah terlebih dahulu.');
        setLoading(false);
        return;
      }

      const normalizedQuestions = questions.map((q) => {
        let optA = q.option_a || '';
        let optB = q.option_b || '';
        let optC = q.option_c || '';
        let optD = q.option_d || '';
        let corrAns = q.correct_answer || '';

        if (q.type === 'true_false') {
          optA = 'Benar';
          optB = 'Salah';
          optC = '';
          optD = '';
        } else if (q.type === 'essay') {
          optA = '';
          optB = '';
          optC = '';
          optD = '';
          corrAns = '';
        }

        return {
          question: q.question || '',
          option_a: optA,
          option_b: optB,
          option_c: optC,
          option_d: optD,
          correct_answer: corrAns,
          type: q.type || 'multiple_choice',
          correct_answer_text: q.correct_answer_text || '',
        };
      });

      const payload = {
        course_id: selectedCourseId,
        title,
        duration_minutes: duration,
        category,
        require_proctoring: requireProctoring,
        questions: normalizedQuestions
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
        <div className="siakad-page-header">
        <div className="siakad-page-header-glow"></div>
        <div className="siakad-page-header-grid"></div>
          <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <button 
              type="button" 
              onClick={() => router.back()} 
              style={{ 
                background: 'var(--glass-bg)', 
                border: 'var(--glass-border)', 
                padding: '12px 24px', 
                borderRadius: '50px', 
                cursor: 'pointer', 
                color: 'var(--apple-red)', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px', 
                transition: 'all 0.3s', 
                fontWeight: 'bold',
                boxShadow: 'var(--glass-shadow)' 
              }}
            >
              <i className="ph ph-arrow-left"></i> Kembali
            </button>
            <div style={{ flex: '1 1 300px' }}>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', margin: '0 0 8px 0', letterSpacing: '0.1em', textTransform: 'uppercase' }}>SIAKAD — DOSEN</p>
              <h1 style={{ color: 'white', fontSize: '2.2rem', fontWeight: '800', margin: '0 0 8px 0', letterSpacing: '-0.03em' }}>CBT Engine: Kuis Pilihan Ganda</h1>
              <p style={{ color: 'rgba(255,255,255,0.6)', margin: 0 }}>Buat kuis otomatis dengan various tipe soal dan durasi.</p>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="siakad-card stagger-1" style={{ padding: '24px', marginBottom: '24px', borderRadius: '24px' }}>
          <h3 style={{ margin: '0 0 16px 0', fontWeight: '800', color: 'var(--color-text)' }}>Pengaturan Kuis</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Mata Kuliah</label>
              <CustomSelect
                value={selectedCourseId}
                onChange={(val) => setSelectedCourseId(val)}
                options={[
                  { value: "", label: "Pilih mata kuliah..." },
                  ...courses.map(course => ({
                    value: String(course.id),
                    label: `${course.code ? `${course.code} - ` : ''}${course.name}`
                  }))
                ]}
                style={{ width: '100%' }}
              />
            </div>
          </div>
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
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginTop: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Kategori Ujian</label>
              <CustomSelect
                value={category}
                onChange={(val) => setCategory(val)}
                options={[
                  { value: 'kuis', label: 'Kuis Harian' },
                  { value: 'uts', label: 'Ujian Tengah Semester (UTS)' },
                  { value: 'uas', label: 'Ujian Akhir Semester (UAS)' }
                ]}
                style={{ width: '100%' }}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', marginTop: '30px', gap: '12px' }}>
              <input
                type="checkbox"
                id="require-proctoring-check"
                checked={requireProctoring}
                onChange={(e) => setRequireProctoring(e.target.checked)}
                style={{ display: 'none' }}
              />
              <div 
                onClick={() => setRequireProctoring(!requireProctoring)}
                style={{ 
                  width: '54px', 
                  height: '28px', 
                  borderRadius: '50px', 
                  background: 'var(--glass-bg)', 
                  boxShadow: 'inset 3px 3px 6px var(--inset-shadow-dark), inset -3px -3px 6px var(--inset-shadow-light)',
                  border: 'var(--inset-border)',
                  position: 'relative',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                <div style={{ 
                  width: '20px', 
                  height: '20px', 
                  borderRadius: '50%', 
                  background: requireProctoring ? 'linear-gradient(135deg, #C41E3A, #9b1c2e)' : 'var(--color-muted)', 
                  boxShadow: requireProctoring ? '0 2px 5px rgba(196,30,58,0.4)' : '0 2px 5px rgba(0,0,0,0.2)',
                  position: 'absolute',
                  top: '3px',
                  left: requireProctoring ? '29px' : '4px',
                  transition: 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)'
                }}></div>
              </div>
              <label htmlFor="require-proctoring-check" style={{ fontWeight: 600, cursor: 'pointer', color: 'var(--color-text)', fontSize: '0.9rem' }}>
                Aktifkan Pengawasan Kamera & Anti-Tab Switch (Proctoring Ujian)
              </label>
            </div>
          </div>
        </div>

        {questions.map((q, idx) => (
          <div key={idx} className={`siakad-card stagger-${(idx % 5) + 2}`} style={{ padding: '24px', borderRadius: '24px', marginBottom: '24px', position: 'relative', zIndex: 50 - idx }}>
            <div className="siakad-modal-header" style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '16px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <h3 style={{ margin: '0', color: 'var(--color-text)', fontWeight: '800' }}>Soal {idx + 1}</h3>
                <CustomSelect
                  value={q.type}
                  onChange={(val) => handleChange(idx, 'type', val)}
                  options={[
                    { value: "multiple_choice", label: "Pilihan Ganda" },
                    { value: "true_false", label: "Benar / Salah" },
                    { value: "essay", label: "Esai" }
                  ]}
                  style={{ width: '150px' }}
                />
              </div>
              {questions.length > 1 && (
                <button 
                  type="button" 
                  onClick={() => removeQuestion(idx)} 
                  className="siakad-btn-primary" 
                  style={{ 
                    padding: '8px 16px', 
                    borderRadius: '50px',
                    fontSize: '0.85rem' 
                  }}
                >
                  Hapus Soal
                </button>
              )}
            </div>
            
            <textarea 
              required
              value={q.question} onChange={e=>handleChange(idx, 'question', e.target.value)}
              className="siakad-input" 
              style={{ width: '100%', height: '100px', marginBottom: '16px', resize: 'vertical' }} 
              placeholder="Tuliskan pertanyaan di sini..."
            ></textarea>
            
            {q.type === 'multiple_choice' && (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
                  <div>
                    <label style={{ fontWeight: '600', fontSize: '0.85rem' }}>Opsi A</label>
                    <input required type="text" value={q.option_a} onChange={e=>handleChange(idx, 'option_a', e.target.value)} className="siakad-input" style={{ width: '100%', marginTop: '4px' }} />
                  </div>
                  <div>
                    <label style={{ fontWeight: '600', fontSize: '0.85rem' }}>Opsi B</label>
                    <input required type="text" value={q.option_b} onChange={e=>handleChange(idx, 'option_b', e.target.value)} className="siakad-input" style={{ width: '100%', marginTop: '4px' }} />
                  </div>
                  <div>
                    <label style={{ fontWeight: '600', fontSize: '0.85rem' }}>Opsi C</label>
                    <input required type="text" value={q.option_c} onChange={e=>handleChange(idx, 'option_c', e.target.value)} className="siakad-input" style={{ width: '100%', marginTop: '4px' }} />
                  </div>
                  <div>
                    <label style={{ fontWeight: '600', fontSize: '0.85rem' }}>Opsi D</label>
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
                    style={{ 
                      flex: 1, 
                      padding: '12px', 
                      borderRadius: '50px', 
                      border: q.correct_answer === 'True' ? 'none' : 'var(--glass-border)', 
                      background: q.correct_answer === 'True' ? 'linear-gradient(135deg, #047857 0%, #065f46 100%)' : 'var(--glass-bg)', 
                      color: q.correct_answer === 'True' ? 'white' : 'var(--color-text)', 
                      fontWeight: 'bold', 
                      cursor: 'pointer',
                      boxShadow: q.correct_answer === 'True' ? '3px 3px 6px rgba(4,120,87,0.3)' : 'var(--glass-shadow)',
                      transition: 'all 0.2s'
                    }}
                  >
                    Benar (True)
                  </button>
                  <button 
                    type="button" 
                    onClick={() => handleChange(idx, 'correct_answer', 'False')}
                    style={{ 
                      flex: 1, 
                      padding: '12px', 
                      borderRadius: '50px', 
                      border: q.correct_answer === 'False' ? 'none' : 'var(--glass-border)', 
                      background: q.correct_answer === 'False' ? 'linear-gradient(135deg, #b91c1c 0%, #991b1b 100%)' : 'var(--glass-bg)', 
                      color: q.correct_answer === 'False' ? 'white' : 'var(--color-text)', 
                      fontWeight: 'bold', 
                      cursor: 'pointer',
                      boxShadow: q.correct_answer === 'False' ? '3px 3px 6px rgba(185,28,28,0.3)' : 'var(--glass-shadow)',
                      transition: 'all 0.2s'
                    }}
                  >
                    Salah (False)
                  </button>
                </div>
              </div>
            )}

            {q.type === 'essay' && (
              <div style={{ marginTop: '16px' }}>
                <label style={{ fontWeight: 600, color: 'var(--color-text)' }}>Kunci Jawaban / Panduan Penilaian (Opsional)</label>
                <textarea 
                  value={q.correct_answer_text} onChange={e=>handleChange(idx, 'correct_answer_text', e.target.value)}
                  className="siakad-input" 
                  style={{ width: '100%', height: '100px', marginTop: '8px', resize: 'vertical' }} 
                  placeholder="Tuliskan kunci jawaban esai atau poin-poin yang diharapkan..."
                ></textarea>
              </div>
            )}
          </div>
        ))}

        <div style={{ display: 'flex', gap: '16px' , flexWrap: 'wrap' }}>
          <button 
            type="button" 
            onClick={addQuestion} 
            style={{ 
              flex: 1, 
              background: 'var(--glass-bg)', 
              color: 'var(--color-text)', 
              border: 'var(--glass-border)', 
              padding: '12px 24px', 
              borderRadius: '50px', 
              cursor: 'pointer', 
              fontWeight: 'bold',
              boxShadow: 'var(--glass-shadow)',
              transition: 'all 0.2s'
            }}
          >
            <i className="ph ph-plus"></i> Tambah Soal
          </button>
          <button 
            type="submit" 
            disabled={loading} 
            className="siakad-btn-primary"
            style={{ 
              flex: 1, 
              padding: '12px 24px',
              justifyContent: 'center'
            }}
          >
            {loading ? 'Menyimpan...' : 'Terbitkan Kuis Sekarang'}
          </button>
        </div>
      </form>
    </div>
  );
}
