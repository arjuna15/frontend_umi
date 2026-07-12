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
  const [copied, setCopied] = useState(false);

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

  const copyToClipboard = () => {
    navigator.clipboard.writeText(registrationNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const validateBiodata = () => {
    const required = ['name', 'email', 'phone', 'gender', 'birth_date', 'birth_place', 'address', 'school_origin', 'program_choice'];
    for (const key of required) {
      if (!biodata[key]) {
        setMessage({ text: 'Mohon lengkapi seluruh formulir data diri.', type: 'error' });
        return false;
      }
    }
    setMessage({ text: '', type: '' });
    return true;
  };

  const submitApplication = async () => {
    if (!validateBiodata()) return;
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
      
      const appId = data.applicant?.id || data.data?.id || data.id;
      const regNum = data.applicant?.registration_number || data.data?.registration_number || data.registration_number;
      
      setApplicantId(appId);
      setRegistrationNumber(regNum || `PMB-${Date.now()}`);

      // Upload files if any
      if (appId && (files.ijazah || files.foto || files.ktp)) {
        setUploading(true);
        for (const key of ['ijazah', 'foto', 'ktp']) {
          if (files[key]) {
            const formData = new FormData();
            formData.append('type', key);
            formData.append('file', files[key]);
            try {
              await fetch(`${apiUrl}/siakad/pmb/upload/${appId}`, { 
                method: 'POST', 
                body: formData 
              });
            } catch (e) { 
              console.error(`Upload error for ${key}:`, e); 
            }
          }
        }
        setUploading(false);
      }

      setStep(5);
    } catch (e) {
      setMessage({ text: 'Gagal mengirim pendaftaran. Silakan coba lagi.', type: 'error' });
    } finally { setSubmitting(false); }
  };

  const containerStyle = {
    fontFamily: "'Inter', sans-serif",
    minHeight: '100vh',
    background: '#0a0d1a',
    color: '#e2e8f0',
    backgroundImage: 'radial-gradient(circle at 10% 20%, rgba(90, 80, 250, 0.05) 0%, transparent 40%), radial-gradient(circle at 90% 80%, rgba(123, 97, 255, 0.05) 0%, transparent 40%)'
  };

  const cardStyle = {
    background: 'rgba(255, 255, 255, 0.03)',
    backdropFilter: 'blur(20px)',
    borderRadius: '24px',
    padding: '40px',
    border: '1px solid rgba(255, 255, 255, 0.06)',
    boxShadow: '0 20px 50px rgba(0, 0, 0, 0.3)',
    transition: 'all 0.3s ease'
  };

  const inputStyle = {
    width: '100%',
    padding: '14px 18px',
    borderRadius: '14px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    background: 'rgba(255, 255, 255, 0.03)',
    color: '#fff',
    fontSize: '0.95rem',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'all 0.2s ease',
    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)'
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '8px',
    fontSize: '0.85rem',
    color: '#94a3b8',
    fontWeight: '600',
    letterSpacing: '0.05em',
    textTransform: 'uppercase'
  };

  const btnPrimary = {
    background: 'linear-gradient(135deg, #4a90e2 0%, #7b61ff 100%)',
    border: 'none',
    color: 'white',
    padding: '14px 28px',
    borderRadius: '14px',
    cursor: 'pointer',
    fontWeight: '700',
    fontSize: '1rem',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    transition: 'transform 0.15s ease, box-shadow 0.15s ease, opacity 0.15s ease',
    boxShadow: '0 4px 20px rgba(123, 97, 255, 0.3)'
  };

  const stepLabels = [
    { num: 1, label: 'Pilih Periode', icon: 'ph ph-calendar' },
    { num: 2, label: 'Biodata', icon: 'ph ph-user' },
    { num: 3, label: 'Upload Dokumen', icon: 'ph ph-upload' },
    { num: 4, label: 'Review', icon: 'ph ph-eye' },
    { num: 5, label: 'Selesai', icon: 'ph ph-check-circle' },
  ];

  return (
    <div style={containerStyle}>
      {/* Premium Glassmorphic Header */}
      <div style={{ background: 'linear-gradient(180deg, rgba(26, 32, 53, 0.6) 0%, rgba(10, 13, 26, 0) 100%)', backdropFilter: 'blur(10px)', padding: '32px 24px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ background: 'linear-gradient(135deg, #4a90e2 0%, #7b61ff 100%)', width: '50px', height: '50px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 15px rgba(123, 97, 255, 0.3)' }}>
              <span style={{ fontSize: '1.6rem', fontWeight: '800', color: 'white' }}>U</span>
            </div>
            <div>
              <h2 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'white', margin: 0, letterSpacing: '1px' }}>UNIVERSITAS MITRA BANGSA</h2>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#94a3b8' }}>Portal Penerimaan Mahasiswa Baru Mandiri</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.04)', padding: '8px 16px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e', display: 'inline-block', boxShadow: '0 0 8px #22c55e' }}></span>
            <span style={{ fontSize: '0.8rem', fontWeight: '600', color: '#e2e8f0' }}>Pendaftaran Online Aktif</span>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 24px 80px' }}>
        
        {/* Progress Tracker with Premium Styling */}
        {step <= 5 && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '40px', background: 'rgba(255,255,255,0.02)', padding: '16px 24px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.04)', flexWrap: 'wrap', gap: '16px' }}>
            {stepLabels.map((s, i) => (
              <div key={s.num} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px', 
                  padding: '8px 16px', 
                  borderRadius: '30px', 
                  background: step === s.num ? 'linear-gradient(135deg, #4a90e2 0%, #7b61ff 100%)' : step > s.num ? 'rgba(34, 197, 94, 0.1)' : 'rgba(255, 255, 255, 0.02)', 
                  border: step === s.num ? 'none' : `1px solid ${step > s.num ? 'rgba(34, 197, 94, 0.2)' : 'rgba(255, 255, 255, 0.06)'}`, 
                  transition: 'all 0.3s ease',
                  boxShadow: step === s.num ? '0 4px 15px rgba(123, 97, 255, 0.3)' : 'none'
                }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: '700', color: step === s.num ? 'white' : step > s.num ? '#22c55e' : '#64748b' }}>{s.num}</span>
                  <span style={{ fontSize: '0.85rem', fontWeight: '600', color: step === s.num ? 'white' : step > s.num ? '#22c55e' : '#64748b' }}>{s.label}</span>
                </div>
                {i < stepLabels.length - 1 && <span style={{ color: 'rgba(255,255,255,0.15)', fontWeight: '300' }}>→</span>}
              </div>
            ))}
          </div>
        )}

        {message.text && (
          <div style={{ padding: '16px 20px', borderRadius: '16px', marginBottom: '30px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.95rem' }}>
            <span style={{ fontSize: '1.2rem' }}>⚠️</span>
            <span>{message.text}</span>
          </div>
        )}

        {/* Step 1: Select Period */}
        {step === 1 && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <h1 style={{ fontSize: '2.2rem', fontWeight: '800', color: '#fff', margin: '0 0 10px 0', letterSpacing: '-0.02em' }}>Pilih Periode Pendaftaran</h1>
              <p style={{ color: '#94a3b8', fontSize: '1.05rem', margin: 0 }}>Silakan pilih gelombang PMB yang aktif untuk memulai pendaftaran Anda.</p>
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '60px 0' }}>
                <div style={{ border: '4px solid rgba(255,255,255,0.05)', borderTop: '4px solid #7b61ff', borderRadius: '50%', width: '40px', height: '40px', margin: '0 auto 20px', animation: 'spin 1s linear infinite' }}></div>
                <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>Memuat gelombang pendaftaran...</p>
                <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
              </div>
            ) : periods.length === 0 ? (
              <div style={{ ...cardStyle, textAlign: 'center', padding: '60px 40px' }}>
                <span style={{ fontSize: '3.5rem', display: 'block', marginBottom: '16px', opacity: 0.6 }}>📅</span>
                <h3 style={{ fontSize: '1.3rem', color: '#fff', margin: '0 0 8px 0' }}>Belum Ada Gelombang Dibuka</h3>
                <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.95rem' }}>Mohon maaf, saat ini pendaftaran online mandiri belum dibuka atau telah ditutup sementara.</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
                {periods.map(p => (
                  <div key={p.id} onClick={() => { setSelectedPeriod(p); setStep(2); }} style={{ 
                    ...cardStyle, 
                    cursor: 'pointer', 
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-6px)';
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                    e.currentTarget.style.borderColor = 'rgba(123, 97, 255, 0.3)';
                    e.currentTarget.style.boxShadow = '0 15px 30px rgba(123, 97, 255, 0.15)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.05)';
                    e.currentTarget.style.boxShadow = '0 20px 50px rgba(0, 0, 0, 0.3)';
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                      <div style={{ width: '48px', height: '48px', background: 'linear-gradient(135deg, rgba(74,144,226,0.1) 0%, rgba(123,97,255,0.1) 100%)', color: '#4a90e2', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' }}>
                        📅
                      </div>
                      <div>
                        <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: '700', color: '#fff' }}>{p.name}</h3>
                        <p style={{ margin: 0, fontSize: '0.85rem', color: '#94a3b8', marginTop: '2px' }}>Tahun Akademik {p.academic_year}</p>
                      </div>
                    </div>
                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem', color: '#94a3b8' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>👥 Kuota Gelombang:</span>
                        <span style={{ color: '#fff', fontWeight: '600' }}>{p.quota} Pendaftar</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>⏰ Batas Pendaftaran:</span>
                        <span style={{ color: '#fff', fontWeight: '600' }}>{p.end_date ? new Date(p.end_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}</span>
                      </div>
                    </div>
                    <div style={{ marginTop: '24px', textAlign: 'center' }}>
                      <button style={{ ...btnPrimary, width: '100%', justifyContent: 'center' }}>Mulai Pendaftaran Mandiri</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Step 2: Biodata */}
        {step === 2 && (
          <div style={cardStyle}>
            <div style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '20px', marginBottom: '30px' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#fff', margin: '0 0 6px 0' }}>Formulir Data Diri Calon Mahasiswa</h2>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: 0 }}>Lengkapi seluruh formulir dengan data asli yang sesuai dengan berkas resmi Anda.</p>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
              <div>
                <label style={labelStyle}>Nama Lengkap</label>
                <input type="text" value={biodata.name} onChange={e => setBiodata({ ...biodata, name: e.target.value })} placeholder="Nama sesuai ijazah resmi" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Email Aktif</label>
                <input type="email" value={biodata.email} onChange={e => setBiodata({ ...biodata, email: e.target.value })} placeholder="email@contoh.com" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Nomor HP / WhatsApp</label>
                <input type="tel" value={biodata.phone} onChange={e => setBiodata({ ...biodata, phone: e.target.value })} placeholder="08xxxxxxxxxx" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Jenis Kelamin</label>
                <select value={biodata.gender} onChange={e => setBiodata({ ...biodata, gender: e.target.value })} style={inputStyle}>
                  <option value="">-- Pilih Jenis Kelamin --</option>
                  <option value="L">Laki-laki</option>
                  <option value="P">Perempuan</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Tempat Lahir</label>
                <input type="text" value={biodata.birth_place} onChange={e => setBiodata({ ...biodata, birth_place: e.target.value })} placeholder="Kota / Kabupaten Lahir" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Tanggal Lahir</label>
                <input type="date" value={biodata.birth_date} onChange={e => setBiodata({ ...biodata, birth_date: e.target.value })} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Asal Sekolah (SMA/SMK/MA)</label>
                <input type="text" value={biodata.school_origin} onChange={e => setBiodata({ ...biodata, school_origin: e.target.value })} placeholder="Contoh: SMAN 1 Jakarta" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Pilihan Program Studi</label>
                <select value={biodata.program_choice} onChange={e => setBiodata({ ...biodata, program_choice: e.target.value })} style={inputStyle}>
                  <option value="">-- Pilih Program Studi --</option>
                  <option value="S1 Aktuaria">S1 Aktuaria</option>
                  <option value="S1 Ilmu Hukum">S1 Ilmu Hukum</option>
                  <option value="S1 Teknik Komputer">S1 Teknik Komputer</option>
                  <option value="S1 Manajemen">S1 Manajemen</option>
                  <option value="S1 Sistem Informasi">S1 Sistem Informasi</option>
                  <option value="S2 Magister Manajemen">S2 Magister Manajemen</option>
                </select>
              </div>
            </div>
            <div style={{ marginTop: '24px' }}>
              <label style={labelStyle}>Alamat Domisili Lengkap</label>
              <textarea value={biodata.address} onChange={e => setBiodata({ ...biodata, address: e.target.value })} placeholder="Alamat jalan, RT/RW, Kecamatan, Kota/Kabupaten, Kode Pos" rows={4} style={{ ...inputStyle, resize: 'vertical' }} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '40px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '24px' }}>
              <button onClick={() => setStep(1)} style={{ ...btnPrimary, background: 'rgba(255,255,255,0.04)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', boxShadow: 'none' }}>
                ← Pilih Gelombang
              </button>
              <button onClick={() => { if (validateBiodata()) setStep(3); }} style={btnPrimary}>
                Selanjutnya: Berkas →
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Upload Documents */}
        {step === 3 && (
          <div style={cardStyle}>
            <div style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '20px', marginBottom: '30px' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#fff', margin: '0 0 6px 0' }}>Unggah Dokumen Syarat</h2>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: 0 }}>Unggah salinan dokumen pendukung pendaftaran Anda. Format yang diterima: PDF, JPG, atau PNG (Maksimal 5MB per berkas).</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {[
                { key: 'ijazah', label: 'Salinan Ijazah Terakhir / SKL', desc: 'Unggah bukti kelulusan formal Anda', icon: '🎓' },
                { key: 'foto', label: 'Pas Foto Resmi (Latar Biru / Merah)', desc: 'Pas foto resmi berukuran 3x4 atau 4x6 terbaru', icon: '📸' },
                { key: 'ktp', label: 'Kartu Tanda Penduduk (KTP) / Kartu Keluarga', desc: 'Kartu Identitas KTP asli / KK untuk pendaftar di bawah umur', icon: '🪪' },
              ].map(doc => (
                <div key={doc.key} style={{ 
                  border: '2px dashed rgba(255, 255, 255, 0.1)', 
                  borderRadius: '16px', 
                  padding: '24px', 
                  textAlign: 'center', 
                  position: 'relative', 
                  background: files[doc.key] ? 'rgba(34, 197, 94, 0.03)' : 'rgba(255,255,255,0.01)', 
                  borderColor: files[doc.key] ? 'rgba(34, 197, 94, 0.3)' : 'rgba(255,255,255,0.1)', 
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '20px',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', textAlign: 'left' }}>
                    <div style={{ fontSize: '2.2rem' }}>{doc.icon}</div>
                    <div>
                      <h4 style={{ margin: 0, color: '#fff', fontSize: '1rem', fontWeight: '700' }}>{doc.label}</h4>
                      <p style={{ margin: '2px 0 0', color: files[doc.key] ? '#22c55e' : '#94a3b8', fontSize: '0.85rem', fontWeight: files[doc.key] ? '600' : '400' }}>
                        {fileNames[doc.key] || doc.desc}
                      </p>
                    </div>
                  </div>
                  <div style={{ position: 'relative' }}>
                    <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={e => handleFileChange(doc.key, e)} style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', width: '100%', height: '100%' }} />
                    <button style={{ ...btnPrimary, padding: '8px 18px', fontSize: '0.85rem', background: files[doc.key] ? '#22c55e' : 'rgba(255,255,255,0.08)', boxShadow: 'none', color: '#fff' }}>
                      {files[doc.key] ? '✓ Berhasil Diunggah' : 'Pilih Berkas'}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '40px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '24px' }}>
              <button onClick={() => setStep(2)} style={{ ...btnPrimary, background: 'rgba(255,255,255,0.04)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', boxShadow: 'none' }}>
                ← Edit Data Diri
              </button>
              <button onClick={() => setStep(4)} style={btnPrimary}>
                Review Pendaftaran →
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Review */}
        {step === 4 && (
          <div style={cardStyle}>
            <div style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '20px', marginBottom: '30px' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#fff', margin: '0 0 6px 0' }}>Review & Konfirmasi</h2>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: 0 }}>Harap periksa seluruh data pendaftaran Anda sebelum dikirimkan ke sistem admisi.</p>
            </div>

            <div style={{ display: 'grid', gap: '20px', marginBottom: '30px' }}>
              
              <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '16px', padding: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <h3 style={{ fontSize: '0.85rem', fontWeight: '700', color: '#4a90e2', margin: '0 0 10px 0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Gelombang Pendaftaran</h3>
                <p style={{ margin: 0, color: '#fff', fontSize: '1.05rem', fontWeight: '600' }}>{selectedPeriod?.name} (Tahun Akademik {selectedPeriod?.academic_year})</p>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '16px', padding: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <h3 style={{ fontSize: '0.85rem', fontWeight: '700', color: '#4a90e2', margin: '0 0 16px 0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Biodata Pendaftar</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                  {[
                    { label: 'Nama Lengkap', value: biodata.name },
                    { label: 'Email Pendaftar', value: biodata.email },
                    { label: 'WhatsApp', value: biodata.phone },
                    { label: 'Jenis Kelamin', value: biodata.gender === 'L' ? 'Laki-laki' : 'Perempuan' },
                    { label: 'Tempat, Tanggal Lahir', value: `${biodata.birth_place}, ${biodata.birth_date}` },
                    { label: 'Asal Sekolah', value: biodata.school_origin },
                    { label: 'Program Studi Pilihan', value: biodata.program_choice, highlight: true },
                  ].map((f, i) => (
                    <div key={i}>
                      <span style={{ display: 'block', fontSize: '0.78rem', color: '#94a3b8', fontWeight: '500', marginBottom: '2px' }}>{f.label}</span>
                      <span style={{ fontSize: '0.95rem', color: f.highlight ? '#7b61ff' : '#fff', fontWeight: f.highlight ? '700' : '600' }}>{f.value || '-'}</span>
                    </div>
                  ))}
                </div>
                {biodata.address && (
                  <div style={{ marginTop: '16px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '16px' }}>
                    <span style={{ display: 'block', fontSize: '0.78rem', color: '#94a3b8', fontWeight: '500', marginBottom: '2px' }}>Alamat Lengkap</span>
                    <p style={{ margin: 0, fontSize: '0.95rem', color: '#fff', lineHeight: '1.5' }}>{biodata.address}</p>
                  </div>
                )}
              </div>

              <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '16px', padding: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <h3 style={{ fontSize: '0.85rem', fontWeight: '700', color: '#4a90e2', margin: '0 0 12px 0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Persyaratan Dokumen</h3>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  {[{ key: 'ijazah', label: 'Ijazah' }, { key: 'foto', label: 'Pas Foto' }, { key: 'ktp', label: 'Identitas KTP' }].map(d => (
                    <div key={d.key} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 14px', borderRadius: '10px', background: files[d.key] ? 'rgba(34,197,94,0.08)' : 'rgba(239,68,68,0.08)', color: files[d.key] ? '#22c55e' : '#ef4444', fontSize: '0.85rem', fontWeight: '600', border: `1px solid ${files[d.key] ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)'}` }}>
                      <span style={{ fontSize: '1rem' }}>{files[d.key] ? '✓' : '✗'}</span>
                      {d.label}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '24px' }}>
              <button onClick={() => setStep(3)} style={{ ...btnPrimary, background: 'rgba(255,255,255,0.04)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', boxShadow: 'none' }}>
                ← Edit Dokumen
              </button>
              <button onClick={submitApplication} disabled={submitting} style={{ ...btnPrimary, background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', boxShadow: '0 4px 20px rgba(16, 185, 129, 0.3)', opacity: submitting ? 0.6 : 1 }}>
                {submitting ? 'Memproses Pendaftaran...' : 'Kirim Pendaftaran Mandiri'}
              </button>
            </div>
          </div>
        )}

        {/* Step 5: Success Screen */}
        {step === 5 && (
          <div style={{ ...cardStyle, textAlign: 'center', padding: '60px 40px' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(34, 197, 94, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', border: '2px solid rgba(34, 197, 94, 0.2)' }}>
              <span style={{ fontSize: '2.5rem', color: '#22c55e' }}>✓</span>
            </div>
            <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#fff', margin: '0 0 12px 0' }}>Pendaftaran Terkirim!</h1>
            <p style={{ color: '#94a3b8', fontSize: '1.05rem', margin: '0 0 32px 0', lineHeight: '1.6', maxWidth: '600px', marginInside: 'auto' }}>
              Selamat, data Anda telah berhasil didaftarkan secara mandiri ke sistem Universitas Mitra Bangsa. Harap catat dan simpan nomor pendaftaran di bawah ini untuk memantau status Anda:
            </p>

            <div style={{ background: 'rgba(123, 97, 255, 0.05)', borderRadius: '20px', padding: '24px 40px', border: '2px dashed rgba(123, 97, 255, 0.3)', marginBottom: '32px', display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: '600', letterSpacing: '0.05em' }}>NOMOR REGISTRASI PMB</span>
              <span style={{ fontSize: '1.8rem', fontWeight: '900', color: '#7b61ff', letterSpacing: '0.05em' }}>{registrationNumber}</span>
              <button onClick={copyToClipboard} style={{ ...btnPrimary, padding: '6px 14px', fontSize: '0.8rem', background: copied ? '#22c55e' : 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', boxShadow: 'none', marginTop: '6px' }}>
                {copied ? '✓ Berhasil Disalin' : 'Copy Nomor Registrasi'}
              </button>
            </div>

            <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '24px', maxWidth: '500px', margin: '0 auto' }}>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: '1.5' }}>
                Proses peninjauan berkas pendaftaran membutuhkan waktu maksimal 3 hari kerja. Notifikasi status kelulusan berkas akan dikirimkan langsung ke email pendaftaran Anda.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
