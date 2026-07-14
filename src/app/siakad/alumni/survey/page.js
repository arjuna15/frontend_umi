"use client";
import { useState } from 'react';

export default function AlumniSurveyPage() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [formData, setFormData] = useState({
    // Step 1: Personal
    name: '', nim: '', email: '', phone: '', graduation_year: '', program: '',
    // Step 2: Employment
    employment_status: '', company_name: '', position: '', salary_range: '', work_start_date: '', relevance: '',
    // Step 3: Satisfaction
    teaching_quality: '', curriculum_relevance: '', facilities: '', career_preparation: '', overall_satisfaction: '', suggestions: '',
  });

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

  const updateField = (key, value) => setFormData(prev => ({ ...prev, [key]: value }));

  const submitSurvey = async () => {
    setSubmitting(true);
    try {
      const token = localStorage.getItem('siakad_token');
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;
      const res = await fetch(`${apiUrl}/siakad/tracer/survey`, {
        method: 'POST',
        headers,
        body: JSON.stringify(formData)
      });
      if (!res.ok) throw new Error('Failed');
      setSubmitted(true);
    } catch (e) {
      setMessage({ text: 'Gagal mengirim survei. Silakan coba lagi.', type: 'error' });
    } finally { setSubmitting(false); }
  };

  const steps = [
    { num: 1, label: 'Data Pribadi', icon: 'ph ph-user' },
    { num: 2, label: 'Data Pekerjaan', icon: 'ph ph-briefcase' },
    { num: 3, label: 'Survei Kepuasan', icon: 'ph ph-star' },
  ];

  const inputStyle = { width: '100%', padding: '12px 16px', fontSize: '0.9rem', boxSizing: 'border-box', color: 'var(--color-text)' };
  const labelStyle = { display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: 'var(--color-muted)', fontWeight: '600' };

  const ratingOptions = ['1', '2', '3', '4', '5'];
  const ratingLabels = { '1': 'Sangat Kurang', '2': 'Kurang', '3': 'Cukup', '4': 'Baik', '5': 'Sangat Baik' };

  const RatingField = ({ label, field }) => (
    <div style={{ marginBottom: '20px' }}>
      <label style={labelStyle}>{label}</label>
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {ratingOptions.map(r => (
          <button key={r} id={`rating-${field}-${r}`} type="button" onClick={() => updateField(field, r)} style={{ padding: '10px 16px', borderRadius: '10px', border: formData[field] === r ? '2px solid #3b82f6' : '1px solid var(--color-border)', background: formData[field] === r ? 'rgba(59,130,246,0.15)' : 'var(--color-surface)', color: formData[field] === r ? '#3b82f6' : 'var(--color-text)', cursor: 'pointer', fontWeight: '600', fontSize: '0.85rem', minWidth: '60px', textAlign: 'center', transition: 'all 0.2s ease' }}>
            {r} <span style={{ fontSize: '0.7rem', display: 'block', color: 'var(--color-muted)' }}>{ratingLabels[r]}</span>
          </button>
        ))}
      </div>
    </div>
  );

  if (submitted) {
    return (
      <div className="fade-in">
        <div className="siakad-page-header">
          <div className="siakad-page-header-glow"></div>
          <div className="siakad-page-header-grid"></div>
          <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
            <h1 style={{ color: 'white', fontSize: '2.2rem', fontWeight: '800', margin: '0 0 8px 0' }}>Tracer Study</h1>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 0' }}>
          <div className="siakad-card" style={{ padding: '48px', maxWidth: '500px', textAlign: 'center' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(16,185,129,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
              <i className="ph-fill ph-check-circle" style={{ fontSize: '3rem', color: '#10b981' }}></i>
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--color-text)', margin: '0 0 12px 0' }}>Terima Kasih!</h2>
            <p style={{ color: 'var(--color-muted)', fontSize: '1rem', lineHeight: '1.6', margin: 0 }}>Survei Anda telah berhasil dikirim. Terima kasih telah meluangkan waktu untuk mengisi Tracer Study. Masukan Anda sangat berarti bagi pengembangan universitas.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <div className="siakad-page-header">
        <div className="siakad-page-header-glow"></div>
        <div className="siakad-page-header-grid"></div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', margin: '0 0 8px 0', letterSpacing: '0.1em', textTransform: 'uppercase' }}>ALUMNI — SURVEI</p>
          <h1 style={{ color: 'white', fontSize: '2.2rem', fontWeight: '800', margin: '0 0 8px 0', letterSpacing: '-0.03em' }}>Tracer Study</h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', margin: 0 }}>Bantu universitas berkembang dengan mengisi survei pelacakan alumni.</p>
        </div>
      </div>

      {message.text && (
        <div style={{ padding: '16px 20px', borderRadius: '12px', marginBottom: '24px', background: 'rgba(239,68,68,0.1)', border: '1px solid #ef4444', color: '#ef4444', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <i className="ph-fill ph-warning-circle" style={{ fontSize: '1.4rem' }}></i>
          {message.text}
        </div>
      )}

      {/* Progress Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '32px' }}>
        {steps.map((s, i) => (
          <div key={s.num} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div onClick={() => { if (s.num < step) setStep(s.num); }} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 18px', borderRadius: '30px', background: step === s.num ? 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)' : step > s.num ? 'rgba(16,185,129,0.15)' : 'var(--color-surface)', border: step === s.num ? 'none' : '1px solid var(--color-border)', cursor: s.num < step ? 'pointer' : 'default', transition: 'all 0.3s ease' }}>
              <i className={step > s.num ? 'ph-fill ph-check-circle' : s.icon} style={{ fontSize: '1.1rem', color: step === s.num ? 'white' : step > s.num ? '#10b981' : 'var(--color-muted)' }}></i>
              <span style={{ fontSize: '0.85rem', fontWeight: '600', color: step === s.num ? 'white' : step > s.num ? '#10b981' : 'var(--color-muted)' }}>{s.label}</span>
            </div>
            {i < steps.length - 1 && <div style={{ width: '40px', height: '2px', background: step > s.num ? '#10b981' : 'var(--color-border)' }}></div>}
          </div>
        ))}
      </div>

      <div style={{ maxWidth: '640px', margin: '0 auto' }}>
        <div className="siakad-card" style={{ padding: '32px' }}>
          {/* Step 1: Personal */}
          {step === 1 && (
            <>
              <h2 style={{ fontSize: '1.3rem', fontWeight: '800', color: 'var(--color-text)', margin: '0 0 24px 0' }}>Informasi Pribadi</h2>
              {[
                { label: 'Nama Lengkap', key: 'name', placeholder: 'Masukkan nama lengkap' },
                { label: 'NIM', key: 'nim', placeholder: 'Masukkan NIM' },
                { label: 'Email', key: 'email', placeholder: 'email@example.com', type: 'email' },
                { label: 'Nomor Telepon', key: 'phone', placeholder: '08xxxxxxxxx', type: 'tel' },
                { label: 'Tahun Lulus', key: 'graduation_year', placeholder: 'Contoh: 2024' },
                { label: 'Program Studi', key: 'program', placeholder: 'Contoh: Teknik Informatika' },
              ].map(f => (
                <div key={f.key} style={{ marginBottom: '16px' }}>
                  <label style={labelStyle}>{f.label}</label>
                  <input id={`input-${f.key}`} type={f.type || 'text'} value={formData[f.key]} onChange={e => updateField(f.key, e.target.value)} placeholder={f.placeholder} style={inputStyle} />
                </div>
              ))}
            </>
          )}

          {/* Step 2: Employment */}
          {step === 2 && (
            <>
              <h2 style={{ fontSize: '1.3rem', fontWeight: '800', color: 'var(--color-text)', margin: '0 0 24px 0' }}>Informasi Pekerjaan</h2>
              <div style={{ marginBottom: '16px' }}>
                <label style={labelStyle}>Status Pekerjaan</label>
                <select id="input-employment_status" value={formData.employment_status} onChange={e => updateField('employment_status', e.target.value)} style={inputStyle}>
                  <option value="">-- Pilih --</option>
                  <option value="employed">Bekerja</option>
                  <option value="self_employed">Wirausaha</option>
                  <option value="freelance">Freelance</option>
                  <option value="studying">Melanjutkan Studi</option>
                  <option value="unemployed">Belum Bekerja</option>
                </select>
              </div>
              {[
                { label: 'Nama Perusahaan/Instansi', key: 'company_name', placeholder: 'Nama tempat kerja' },
                { label: 'Jabatan/Posisi', key: 'position', placeholder: 'Jabatan saat ini' },
              ].map(f => (
                <div key={f.key} style={{ marginBottom: '16px' }}>
                  <label style={labelStyle}>{f.label}</label>
                  <input id={`input-${f.key}`} type="text" value={formData[f.key]} onChange={e => updateField(f.key, e.target.value)} placeholder={f.placeholder} style={inputStyle} />
                </div>
              ))}
              <div style={{ marginBottom: '16px' }}>
                <label style={labelStyle}>Range Gaji</label>
                <select id="input-salary_range" value={formData.salary_range} onChange={e => updateField('salary_range', e.target.value)} style={inputStyle}>
                  <option value="">-- Pilih --</option>
                  <option value="<3jt">{'< 3 Juta'}</option>
                  <option value="3-5jt">3 - 5 Juta</option>
                  <option value="5-10jt">5 - 10 Juta</option>
                  <option value="10-15jt">10 - 15 Juta</option>
                  <option value=">15jt">{'> 15 Juta'}</option>
                </select>
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={labelStyle}>Mulai Bekerja</label>
                <input id="input-work_start_date" type="date" value={formData.work_start_date} onChange={e => updateField('work_start_date', e.target.value)} style={inputStyle} />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={labelStyle}>Relevansi Pekerjaan dengan Jurusan</label>
                <select id="input-relevance" value={formData.relevance} onChange={e => updateField('relevance', e.target.value)} style={inputStyle}>
                  <option value="">-- Pilih --</option>
                  <option value="very_relevant">Sangat Relevan</option>
                  <option value="relevant">Relevan</option>
                  <option value="somewhat">Cukup Relevan</option>
                  <option value="not_relevant">Tidak Relevan</option>
                </select>
              </div>
            </>
          )}

          {/* Step 3: Satisfaction */}
          {step === 3 && (
            <>
              <h2 style={{ fontSize: '1.3rem', fontWeight: '800', color: 'var(--color-text)', margin: '0 0 24px 0' }}>Survei Kepuasan</h2>
              <RatingField label="Kualitas Pengajaran" field="teaching_quality" />
              <RatingField label="Relevansi Kurikulum" field="curriculum_relevance" />
              <RatingField label="Fasilitas Kampus" field="facilities" />
              <RatingField label="Persiapan Karir" field="career_preparation" />
              <RatingField label="Kepuasan Keseluruhan" field="overall_satisfaction" />
              <div style={{ marginBottom: '16px' }}>
                <label style={labelStyle}>Saran & Masukan</label>
                <textarea id="input-suggestions" value={formData.suggestions} onChange={e => updateField('suggestions', e.target.value)} placeholder="Tulis saran dan masukan Anda..." rows={4} style={{ ...inputStyle, resize: 'vertical' }} />
              </div>
            </>
          )}

          {/* Navigation */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '28px' }}>
            {step > 1 ? (
              <button id="btn-prev-step" onClick={() => setStep(step - 1)} style={{ padding: '12px 24px', borderRadius: '12px', border: '1px solid var(--color-border)', background: 'transparent', color: 'var(--color-text)', cursor: 'pointer', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <i className="ph ph-arrow-left"></i> Sebelumnya
              </button>
            ) : <div></div>}
            {step < 3 ? (
              <button id="btn-next-step" onClick={() => setStep(step + 1)} style={{ padding: '12px 24px', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)', color: 'white', cursor: 'pointer', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
                Selanjutnya <i className="ph ph-arrow-right"></i>
              </button>
            ) : (
              <button id="btn-submit-survey" onClick={submitSurvey} disabled={submitting} style={{ padding: '12px 28px', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, #10b981 0%, #047857 100%)', color: 'white', cursor: 'pointer', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px', opacity: submitting ? 0.6 : 1 }}>
                {submitting ? <><i className="ph ph-spinner" style={{ animation: 'pwaSpin 1s linear infinite' }}></i> Mengirim...</> : <><i className="ph ph-paper-plane-tilt"></i> Kirim Survei</>}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
