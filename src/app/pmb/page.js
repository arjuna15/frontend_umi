"use client";
import { useEffect, useState } from 'react';

export default function PMBRegistrationPage() {
  const [step, setStep] = useState(1);
  const [periods, setPeriods] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [applicantId, setApplicantId] = useState(null);
  const [biodata, setBiodata] = useState({ name: '', email: '', phone: '', gender: '', birth_date: '', birth_place: '', address: '', school_origin: '', program_choice: '' });
  const [files, setFiles] = useState({ ijazah: null, foto: null, ktp: null });
  const [fileNames, setFileNames] = useState({ ijazah: '', foto: '', ktp: '' });

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

  const fetchPeriods = async () => {
    try {
      const res = await fetch(`${apiUrl}/siakad/pmb/periods`);
      if (!res.ok) throw new Error('Failed');
      const data = await res.json();
      setPeriods((data.data || data.periods || []).filter(p => p.status === 'open'));
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  useEffect(() => { fetchPeriods(); }, []);

  const handleFileChange = (key, e) => {
    const file = e.target.files[0];
    if (file) {
      setFiles(prev => ({ ...prev, [key]: file }));
      setFileNames(prev => ({ ...prev, [key]: file.name }));
    }
  };

  const submitApplication = async () => {
    setSubmitting(true);
    setMessage({ text: '', type: '' });
    try {
      const res = await fetch(`${apiUrl}/siakad/pmb/apply/${selectedPeriod.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(biodata)
      });
      if (!res.ok) throw new Error('Failed');
      const data = await res.json();
      const appId = data.data?.id || data.applicant_id || data.id;
      setApplicantId(appId);
      setRegistrationNumber(data.data?.registration_number || data.registration_number || `PMB-${Date.now()}`);

      // Upload files if any
      if (appId && (files.ijazah || files.foto || files.ktp)) {
        setUploading(true);
        const formData = new FormData();
        if (files.ijazah) formData.append('ijazah', files.ijazah);
        if (files.foto) formData.append('foto', files.foto);
        if (files.ktp) formData.append('ktp', files.ktp);
        try {
          await fetch(`${apiUrl}/siakad/pmb/upload/${appId}`, { method: 'POST', body: formData });
        } catch (e) { console.error('Upload error:', e); }
        setUploading(false);
      }

      setStep(5);
    } catch (e) {
      setMessage({ text: 'Gagal mengirim pendaftaran. Silakan coba lagi.', type: 'error' });
    } finally { setSubmitting(false); }
  };

  const inputStyle = { width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--color-border)', background: 'var(--color-surface)', color: 'var(--color-text)', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' };
  const labelStyle = { display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: 'var(--color-muted)', fontWeight: '600' };

  const stepLabels = [
    { num: 1, label: 'Pilih Periode', icon: 'ph ph-calendar' },
    { num: 2, label: 'Biodata', icon: 'ph ph-user' },
    { num: 3, label: 'Upload Dokumen', icon: 'ph ph-upload' },
    { num: 4, label: 'Review', icon: 'ph ph-eye' },
    { num: 5, label: 'Status', icon: 'ph ph-check-circle' },
  ];

  return (
    <div className="fade-in" style={{ minHeight: '100vh' }}>
      {/* Hero Header */}
      <div style={{ background: 'linear-gradient(135deg, #1e3a5f 0%, #0f172a 50%, #1e1b4b 100%)', padding: '48px 24px 40px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-50%', right: '-20%', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)' }}></div>
        <div style={{ position: 'absolute', bottom: '-30%', left: '-10%', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)' }}></div>
        <div style={{ maxWidth: '800px', margin: '0 auto', position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '16px' }}>
            <img src="/icon.png" alt="Logo" style={{ width: '48px', height: '48px', objectFit: 'contain', filter: 'brightness(0) invert(1)' }} onError={e => { e.target.style.display = 'none'; }} />
            <h2 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'white', margin: 0, letterSpacing: '2px' }}>UNIVERSITAS MITRA BANGSA</h2>
          </div>
          <h1 style={{ color: 'white', fontSize: '2.4rem', fontWeight: '800', margin: '0 0 12px 0', letterSpacing: '-0.03em' }}>Pendaftaran Mahasiswa Baru</h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', margin: 0, fontSize: '1rem' }}>Daftar sekarang dan raih masa depan cemerlang bersama kami.</p>
        </div>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '32px 24px' }}>
        {/* Progress Steps */}
        {step <= 5 && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', marginBottom: '32px', flexWrap: 'wrap' }}>
            {stepLabels.map((s, i) => (
              <div key={s.num} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 14px', borderRadius: '20px', background: step === s.num ? 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)' : step > s.num ? 'rgba(16,185,129,0.15)' : 'var(--color-surface)', border: step === s.num ? 'none' : '1px solid var(--color-border)', transition: 'all 0.3s ease' }}>
                  <i className={step > s.num ? 'ph-fill ph-check-circle' : s.icon} style={{ fontSize: '0.95rem', color: step === s.num ? 'white' : step > s.num ? '#10b981' : 'var(--color-muted)' }}></i>
                  <span style={{ fontSize: '0.78rem', fontWeight: '600', color: step === s.num ? 'white' : step > s.num ? '#10b981' : 'var(--color-muted)', display: 'none' }} className="pmb-step-label">{s.label}</span>
                </div>
                {i < stepLabels.length - 1 && <div style={{ width: '24px', height: '2px', background: step > s.num ? '#10b981' : 'var(--color-border)' }}></div>}
              </div>
            ))}
          </div>
        )}

        {message.text && (
          <div style={{ padding: '16px 20px', borderRadius: '12px', marginBottom: '24px', background: 'rgba(239,68,68,0.1)', border: '1px solid #ef4444', color: '#ef4444', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <i className="ph-fill ph-warning-circle" style={{ fontSize: '1.4rem' }}></i>
            {message.text}
          </div>
        )}

        {/* Step 1: Select Period */}
        {step === 1 && (
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--color-text)', margin: '0 0 8px 0', textAlign: 'center' }}>Pilih Periode Pendaftaran</h2>
            <p style={{ color: 'var(--color-muted)', textAlign: 'center', margin: '0 0 28px 0' }}>Pilih periode PMB yang sedang dibuka untuk memulai pendaftaran.</p>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--color-muted)' }}>
                <i className="ph ph-spinner" style={{ animation: 'pwaSpin 1s linear infinite', fontSize: '2rem' }}></i>
              </div>
            ) : periods.length === 0 ? (
              <div className="siakad-card" style={{ padding: '40px', textAlign: 'center' }}>
                <i className="ph ph-calendar-x" style={{ fontSize: '3rem', color: 'var(--color-muted)', display: 'block', marginBottom: '12px', opacity: 0.4 }}></i>
                <p style={{ color: 'var(--color-muted)', margin: 0 }}>Saat ini tidak ada periode PMB yang dibuka.</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
                {periods.map(p => (
                  <div key={p.id} id={`period-${p.id}`} className="siakad-card" onClick={() => { setSelectedPeriod(p); setStep(2); }} style={{ padding: '24px', cursor: 'pointer', border: selectedPeriod?.id === p.id ? '2px solid #3b82f6' : '1px solid transparent', transition: 'all 0.2s ease' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                      <div style={{ width: '44px', height: '44px', background: 'rgba(59,130,246,0.1)', color: '#3b82f6', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem' }}>
                        <i className="ph ph-calendar"></i>
                      </div>
                      <div>
                        <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: '700', color: 'var(--color-text)' }}>{p.name || 'Periode PMB'}</h3>
                        <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--color-muted)' }}>{p.academic_year || '-'}</p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '12px', fontSize: '0.82rem', color: 'var(--color-muted)' }}>
                      <span><i className="ph ph-users"></i> Kuota: {p.quota || '-'}</span>
                      {p.end_date && <span><i className="ph ph-clock"></i> s/d {new Date(p.end_date).toLocaleDateString('id-ID')}</span>}
                    </div>
                    <div style={{ marginTop: '16px', textAlign: 'center' }}>
                      <span style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)', color: 'white', padding: '8px 20px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '600' }}>Pilih Periode Ini</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Step 2: Biodata */}
        {step === 2 && (
          <div className="siakad-card" style={{ padding: '32px' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: '800', color: 'var(--color-text)', margin: '0 0 24px 0' }}>Data Diri Calon Mahasiswa</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
              {[
                { label: 'Nama Lengkap', key: 'name', placeholder: 'Nama sesuai ijazah' },
                { label: 'Email', key: 'email', placeholder: 'email@example.com', type: 'email' },
                { label: 'Nomor HP', key: 'phone', placeholder: '08xxxxxxxxx', type: 'tel' },
                { label: 'Tempat Lahir', key: 'birth_place', placeholder: 'Kota kelahiran' },
                { label: 'Tanggal Lahir', key: 'birth_date', type: 'date' },
                { label: 'Asal Sekolah', key: 'school_origin', placeholder: 'Nama SMA/SMK' },
              ].map(f => (
                <div key={f.key}>
                  <label style={labelStyle}>{f.label}</label>
                  <input id={`input-bio-${f.key}`} type={f.type || 'text'} value={biodata[f.key]} onChange={e => setBiodata({ ...biodata, [f.key]: e.target.value })} placeholder={f.placeholder || ''} style={inputStyle} />
                </div>
              ))}
              <div>
                <label style={labelStyle}>Jenis Kelamin</label>
                <select id="input-bio-gender" value={biodata.gender} onChange={e => setBiodata({ ...biodata, gender: e.target.value })} style={inputStyle}>
                  <option value="">-- Pilih --</option>
                  <option value="L">Laki-laki</option>
                  <option value="P">Perempuan</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Program Studi Pilihan</label>
                <input id="input-bio-program" type="text" value={biodata.program_choice} onChange={e => setBiodata({ ...biodata, program_choice: e.target.value })} placeholder="Contoh: Teknik Informatika" style={inputStyle} />
              </div>
            </div>
            <div style={{ marginTop: '16px' }}>
              <label style={labelStyle}>Alamat Lengkap</label>
              <textarea id="input-bio-address" value={biodata.address} onChange={e => setBiodata({ ...biodata, address: e.target.value })} placeholder="Alamat domisili lengkap" rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '28px' }}>
              <button id="btn-back-step2" onClick={() => setStep(1)} style={{ padding: '12px 24px', borderRadius: '12px', border: '1px solid var(--color-border)', background: 'transparent', color: 'var(--color-text)', cursor: 'pointer', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <i className="ph ph-arrow-left"></i> Kembali
              </button>
              <button id="btn-next-step2" onClick={() => setStep(3)} style={{ padding: '12px 24px', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)', color: 'white', cursor: 'pointer', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
                Selanjutnya <i className="ph ph-arrow-right"></i>
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Upload Documents */}
        {step === 3 && (
          <div className="siakad-card" style={{ padding: '32px' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: '800', color: 'var(--color-text)', margin: '0 0 24px 0' }}>Upload Dokumen</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[
                { key: 'ijazah', label: 'Ijazah / SKL', icon: 'ph ph-certificate' },
                { key: 'foto', label: 'Pas Foto (3x4)', icon: 'ph ph-camera' },
                { key: 'ktp', label: 'KTP / Kartu Identitas', icon: 'ph ph-identification-card' },
              ].map(doc => (
                <div key={doc.key} style={{ border: '2px dashed var(--color-border)', borderRadius: '14px', padding: '24px', textAlign: 'center', position: 'relative', background: files[doc.key] ? 'rgba(16,185,129,0.05)' : 'transparent', borderColor: files[doc.key] ? 'rgba(16,185,129,0.3)' : 'var(--color-border)', transition: 'all 0.2s ease' }}>
                  <input type="file" id={`file-${doc.key}`} accept=".pdf,.jpg,.jpeg,.png" onChange={e => handleFileChange(doc.key, e)} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }} />
                  <i className={files[doc.key] ? 'ph-fill ph-check-circle' : doc.icon} style={{ fontSize: '2rem', color: files[doc.key] ? '#10b981' : 'var(--color-muted)', marginBottom: '8px', display: 'block' }}></i>
                  <p style={{ margin: '0 0 4px', fontWeight: '600', color: 'var(--color-text)', fontSize: '0.95rem' }}>{doc.label}</p>
                  <p style={{ margin: 0, fontSize: '0.82rem', color: files[doc.key] ? '#10b981' : 'var(--color-muted)' }}>
                    {fileNames[doc.key] || 'Klik atau seret file ke sini (PDF, JPG, PNG)'}
                  </p>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '28px' }}>
              <button id="btn-back-step3" onClick={() => setStep(2)} style={{ padding: '12px 24px', borderRadius: '12px', border: '1px solid var(--color-border)', background: 'transparent', color: 'var(--color-text)', cursor: 'pointer', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <i className="ph ph-arrow-left"></i> Kembali
              </button>
              <button id="btn-next-step3" onClick={() => setStep(4)} style={{ padding: '12px 24px', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)', color: 'white', cursor: 'pointer', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
                Review Data <i className="ph ph-arrow-right"></i>
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Review */}
        {step === 4 && (
          <div className="siakad-card" style={{ padding: '32px' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: '800', color: 'var(--color-text)', margin: '0 0 24px 0' }}>Review Pendaftaran</h2>
            <p style={{ color: 'var(--color-muted)', fontSize: '0.9rem', margin: '0 0 24px 0' }}>Periksa kembali data Anda sebelum mengirim pendaftaran.</p>

            <div style={{ background: 'var(--color-surface)', borderRadius: '14px', padding: '20px', border: '1px solid var(--color-border)', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '0.9rem', fontWeight: '700', color: '#3b82f6', margin: '0 0 12px 0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Periode</h3>
              <p style={{ margin: 0, color: 'var(--color-text)', fontWeight: '600' }}>{selectedPeriod?.name} — {selectedPeriod?.academic_year}</p>
            </div>

            <div style={{ background: 'var(--color-surface)', borderRadius: '14px', padding: '20px', border: '1px solid var(--color-border)', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '0.9rem', fontWeight: '700', color: '#3b82f6', margin: '0 0 12px 0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Data Diri</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {[
                  { label: 'Nama', value: biodata.name },
                  { label: 'Email', value: biodata.email },
                  { label: 'Telepon', value: biodata.phone },
                  { label: 'Gender', value: biodata.gender === 'L' ? 'Laki-laki' : biodata.gender === 'P' ? 'Perempuan' : '-' },
                  { label: 'Tempat, Tanggal Lahir', value: `${biodata.birth_place}, ${biodata.birth_date}` },
                  { label: 'Asal Sekolah', value: biodata.school_origin },
                  { label: 'Program Pilihan', value: biodata.program_choice },
                ].map((f, i) => (
                  <div key={i}>
                    <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--color-muted)', fontWeight: '600' }}>{f.label}</p>
                    <p style={{ margin: '2px 0 0', color: 'var(--color-text)', fontSize: '0.9rem' }}>{f.value || '-'}</p>
                  </div>
                ))}
              </div>
              {biodata.address && (
                <div style={{ marginTop: '12px' }}>
                  <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--color-muted)', fontWeight: '600' }}>Alamat</p>
                  <p style={{ margin: '2px 0 0', color: 'var(--color-text)', fontSize: '0.9rem' }}>{biodata.address}</p>
                </div>
              )}
            </div>

            <div style={{ background: 'var(--color-surface)', borderRadius: '14px', padding: '20px', border: '1px solid var(--color-border)', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '0.9rem', fontWeight: '700', color: '#3b82f6', margin: '0 0 12px 0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Dokumen</h3>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                {[{ key: 'ijazah', label: 'Ijazah' }, { key: 'foto', label: 'Pas Foto' }, { key: 'ktp', label: 'KTP' }].map(d => (
                  <div key={d.key} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '8px', background: files[d.key] ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', color: files[d.key] ? '#10b981' : '#ef4444', fontSize: '0.85rem', fontWeight: '600' }}>
                    <i className={files[d.key] ? 'ph-fill ph-check-circle' : 'ph ph-x-circle'}></i>
                    {d.label}: {fileNames[d.key] || 'Belum diupload'}
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button id="btn-back-step4" onClick={() => setStep(3)} style={{ padding: '12px 24px', borderRadius: '12px', border: '1px solid var(--color-border)', background: 'transparent', color: 'var(--color-text)', cursor: 'pointer', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <i className="ph ph-arrow-left"></i> Kembali
              </button>
              <button id="btn-submit-pmb" onClick={submitApplication} disabled={submitting} style={{ padding: '12px 28px', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, #10b981 0%, #047857 100%)', color: 'white', cursor: 'pointer', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1rem', opacity: submitting ? 0.6 : 1 }}>
                {submitting ? <><i className="ph ph-spinner" style={{ animation: 'pwaSpin 1s linear infinite' }}></i> {uploading ? 'Mengupload...' : 'Mendaftar...'}</> : <><i className="ph ph-paper-plane-tilt"></i> Kirim Pendaftaran</>}
              </button>
            </div>
          </div>
        )}

        {/* Step 5: Success */}
        {step === 5 && (
          <div className="siakad-card" style={{ padding: '48px', textAlign: 'center' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(16,185,129,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
              <i className="ph-fill ph-check-circle" style={{ fontSize: '3rem', color: '#10b981' }}></i>
            </div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--color-text)', margin: '0 0 12px 0' }}>Pendaftaran Berhasil!</h2>
            <p style={{ color: 'var(--color-muted)', fontSize: '1rem', margin: '0 0 24px 0', lineHeight: '1.6' }}>
              Selamat! Pendaftaran Anda telah berhasil dikirim. Simpan nomor registrasi berikut:
            </p>
            <div style={{ background: 'var(--color-surface)', borderRadius: '14px', padding: '20px', border: '2px solid rgba(59,130,246,0.3)', marginBottom: '24px', display: 'inline-block' }}>
              <p style={{ margin: '0 0 4px', fontSize: '0.8rem', color: 'var(--color-muted)', fontWeight: '600' }}>Nomor Registrasi</p>
              <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: '800', color: '#3b82f6', letterSpacing: '0.05em' }}>{registrationNumber}</p>
            </div>
            <p style={{ color: 'var(--color-muted)', fontSize: '0.9rem', margin: 0 }}>
              Tim admisi akan memverifikasi data Anda. Pantau status pendaftaran melalui email yang terdaftar.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
