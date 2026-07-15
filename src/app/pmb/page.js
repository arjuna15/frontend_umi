"use client";
import { useEffect, useState } from 'react';
import { useTheme } from '../../context/ThemeContext';

export default function PMBRegistrationPage() {
  const { theme } = useTheme();
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
    } catch (e) { 
      console.error(e); 
    } finally { 
      setLoading(false); 
    }
  };

  useEffect(() => { 
    fetchPeriods(); 
  }, []);

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
    } finally { 
      setSubmitting(false); 
    }
  };

  const isDark = theme === 'dark';

  const containerStyle = {
    fontFamily: "'Inter', sans-serif",
    minHeight: '100vh',
    background: 'var(--color-bg)',
    color: 'var(--color-text)',
    transition: 'all 0.3s ease',
    position: 'relative',
    overflow: 'hidden'
  };

  const cardStyle = {
    background: 'var(--color-surface)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderRadius: '24px',
    padding: '40px',
    border: '1px solid var(--color-border)',
    boxShadow: isDark ? '0 20px 50px rgba(0, 0, 0, 0.4)' : '0 10px 30px rgba(0, 0, 0, 0.05)',
    transition: 'all 0.3s ease'
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 22px',
    borderRadius: '50px',
    border: '1px solid var(--color-border)',
    background: 'var(--color-bg)',
    color: 'var(--color-text)',
    fontSize: '0.95rem',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'all 0.2s ease',
    boxShadow: 'inset 0 3px 8px rgba(0, 0, 0, 0.12), inset 0 1px 2px rgba(0, 0, 0, 0.04)'
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '8px',
    fontSize: '0.82rem',
    color: 'var(--color-muted)',
    fontWeight: '700',
    letterSpacing: '0.05em',
    textTransform: 'uppercase'
  };

  const btnPrimary = {
    background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
    border: 'none',
    color: 'white',
    padding: '14px 28px',
    borderRadius: '50px',
    cursor: 'pointer',
    fontWeight: '800',
    fontSize: '1rem',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    transition: 'all 0.15s ease',
    boxShadow: '0 8px 24px rgba(99, 102, 241, 0.3)'
  };

  const stepLabels = [
    { num: 1, label: 'Pilih Periode', icon: 'ph-duotone ph-calendar' },
    { num: 2, label: 'Biodata', icon: 'ph-duotone ph-user' },
    { num: 3, label: 'Upload Dokumen', icon: 'ph-duotone ph-upload' },
    { num: 4, label: 'Review', icon: 'ph-duotone ph-eye' },
    { num: 5, label: 'Selesai', icon: 'ph-duotone ph-check-circle' },
  ];

  return (
    <div style={containerStyle}>
      {/* Background Ornaments (Grid & Glowing Ambient) */}
      <div className="siakad-page-header-glow" style={{ opacity: isDark ? 0.6 : 0.25 }}></div>
      <div className="siakad-page-header-grid"></div>

      <style>{`
        .custom-select {
          appearance: none;
          background-image: url("data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20width%3D%2724%27%20height%3D%2724%27%20viewBox%3D%270%200%2024%2024%27%20fill%3D%27none%27%20stroke%3D%27%233b82f6%27%20stroke-width%3D%272.5%27%20stroke-linecap%3D%27round%27%20stroke-linejoin%3D%27round%27%3E%3Cpolyline%20points%3D%276%209%2012%2015%2018%209%27%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E") !important;
          background-repeat: no-repeat !important;
          background-position: right 22px center !important;
          background-size: 16px !important;
          cursor: pointer;
        }
        .custom-select option {
          background: var(--color-surface);
          color: var(--color-text);
        }
        .pmb-card-period:hover {
          transform: translateY(-6px);
          background: rgba(255, 255, 255, 0.03) !important;
          border-color: rgba(99, 102, 241, 0.3) !important;
          box-shadow: 0 15px 30px rgba(99, 102, 241, 0.15) !important;
        }
        .pmb-step-pill {
          background: var(--color-surface);
          border: 1px solid var(--color-border);
        }
        input:focus, select:focus, textarea:focus {
          border-color: #3b82f6 !important;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.25) !important;
        }
      `}</style>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '120px 24px 80px', position: 'relative', zIndex: 2 }}>
        
        {/* Progress Tracker with Premium Styling */}
        {step <= 5 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '40px', background: 'var(--glass-bg)', padding: '16px 24px', borderRadius: '50px', border: '1px solid var(--color-border)' }}>
            {stepLabels.map((s, i) => (
              <div key={s.num} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div className="pmb-step-pill" style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px', 
                  padding: '8px 16px', 
                  borderRadius: '50px', 
                  background: step === s.num ? 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)' : step > s.num ? 'rgba(34, 197, 94, 0.1)' : 'transparent',
                  border: step === s.num ? 'none' : '1px solid var(--color-border)',
                  boxShadow: step === s.num ? '0 4px 12px rgba(99, 102, 241, 0.25)' : 'none'
                }}>
                  <i className={s.icon} style={{ fontSize: '1rem', color: step === s.num ? 'white' : step > s.num ? '#22c55e' : 'var(--color-muted)' }}></i>
                  <span style={{ fontSize: '0.85rem', fontWeight: '800', color: step === s.num ? 'white' : step > s.num ? '#22c55e' : 'var(--color-text)' }}>{s.label}</span>
                </div>
                {i < stepLabels.length - 1 && <span style={{ color: 'var(--color-muted)', fontWeight: '300' }}>→</span>}
              </div>
            ))}
          </div>
        )}

        {message.text && (
          <div style={{ padding: '16px 20px', borderRadius: '50px', marginBottom: '30px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.95rem', fontWeight: '600' }}>
            <i className="ph-bold ph-warning-circle" style={{ fontSize: '1.3rem' }}></i>
            <span>{message.text}</span>
          </div>
        )}

        {/* Step 1: Select Period */}
        {step === 1 && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <h1 style={{ fontSize: '2.5rem', fontWeight: '900', color: 'var(--color-text)', margin: '0 0 10px 0', letterSpacing: '-0.03em' }}>Pilih Gelombang PMB</h1>
              <p style={{ color: 'var(--color-muted)', fontSize: '1.05rem', margin: 0 }}>Silakan pilih gelombang PMB yang aktif untuk memulai pendaftaran Anda.</p>
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '60px 0' }}>
                <i className="ph ph-spinner ph-spin" style={{ fontSize: '2.5rem', color: '#3b82f6', marginBottom: '16px' }}></i>
                <p style={{ color: 'var(--color-muted)', fontSize: '0.95rem' }}>Memuat gelombang pendaftaran...</p>
              </div>
            ) : periods.length === 0 ? (
              <div style={{ ...cardStyle, textAlign: 'center', padding: '60px 40px' }}>
                <i className="ph-duotone ph-calendar-blank" style={{ fontSize: '4rem', display: 'block', marginBottom: '16px', color: 'var(--color-muted)', opacity: 0.6 }}></i>
                <h3 style={{ fontSize: '1.4rem', color: 'var(--color-text)', margin: '0 0 8px 0', fontWeight: '800' }}>Belum Ada Gelombang Dibuka</h3>
                <p style={{ color: 'var(--color-muted)', margin: 0, fontSize: '0.95rem' }}>Mohon maaf, saat ini pendaftaran online mandiri belum dibuka atau telah ditutup sementara.</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
                {periods.map(p => (
                  <div key={p.id} onClick={() => { setSelectedPeriod(p); setStep(2); }} className="pmb-card-period" style={{ 
                    ...cardStyle, 
                    cursor: 'pointer', 
                    background: 'var(--color-surface)',
                    borderColor: 'var(--color-border)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                      <div style={{ width: '48px', height: '48px', background: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' }}>
                        <i className="ph-duotone ph-calendar"></i>
                      </div>
                      <div>
                        <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: '800', color: 'var(--color-text)' }}>{p.name}</h3>
                        <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-muted)', marginTop: '2px' }}>Tahun Akademik {p.academic_year}</p>
                      </div>
                    </div>
                    <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem', color: 'var(--color-muted)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span><i className="ph ph-users" style={{ marginRight: '6px' }}></i> Kuota Gelombang:</span>
                        <span style={{ color: 'var(--color-text)', fontWeight: '700' }}>{p.quota} Pendaftar</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span><i className="ph ph-clock" style={{ marginRight: '6px' }}></i> Batas Pendaftaran:</span>
                        <span style={{ color: 'var(--color-text)', fontWeight: '700' }}>{p.end_date ? new Date(p.end_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}</span>
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
            <div style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '20px', marginBottom: '30px' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--color-text)', margin: '0 0 6px 0' }}>Formulir Data Diri Calon Mahasiswa</h2>
              <p style={{ color: 'var(--color-muted)', fontSize: '0.9rem', margin: 0 }}>Lengkapi seluruh formulir dengan data asli yang sesuai dengan berkas resmi Anda.</p>
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
                <select value={biodata.gender} onChange={e => setBiodata({ ...biodata, gender: e.target.value })} className="custom-select" style={inputStyle}>
                  <option value="">Pilih jenis kelamin</option>
                  <option value="L">Laki-laki</option>
                  <option value="P">Perempuan</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Tempat Lahir</label>
                <input type="text" value={biodata.birth_place} onChange={e => setBiodata({ ...biodata, birth_place: e.target.value })} placeholder="Kota kelahiran" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Tanggal Lahir</label>
                <input type="date" value={biodata.birth_date} onChange={e => setBiodata({ ...biodata, birth_date: e.target.value })} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Asal Sekolah (SMA/SMK/MA)</label>
                <input type="text" value={biodata.school_origin} onChange={e => setBiodata({ ...biodata, school_origin: e.target.value })} placeholder="Nama sekolah asal" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Pilihan Program Studi</label>
                <select value={biodata.program_choice} onChange={e => setBiodata({ ...biodata, program_choice: e.target.value })} className="custom-select" style={inputStyle}>
                  <option value="">Pilih Program Studi</option>
                  <option value="Manajemen S1">S1 Manajemen</option>
                  <option value="Sistem Informasi S1">S1 Sistem Informasi</option>
                  <option value="Ilmu Komputer S1">S1 Ilmu Komputer</option>
                  <option value="Hukum S1">S1 Hukum</option>
                  <option value="Magister Manajemen S2">S2 Magister Manajemen</option>
                </select>
              </div>
            </div>
            
            <div style={{ marginTop: '24px' }}>
              <label style={labelStyle}>Alamat Domisili Lengkap</label>
              <textarea value={biodata.address} onChange={e => setBiodata({ ...biodata, address: e.target.value })} placeholder="Tuliskan alamat lengkap tempat tinggal saat ini..." rows={4} style={{ ...inputStyle, borderRadius: '16px', resize: 'vertical' }} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '40px', gap: '16px' }}>
              <button onClick={() => setStep(1)} style={{ padding: '12px 24px', borderRadius: '50px', border: '1px solid var(--color-border)', background: 'transparent', color: 'var(--color-text)', cursor: 'pointer', fontWeight: '700' }}>Kembali</button>
              <button onClick={() => validateBiodata() && setStep(3)} style={btnPrimary}>Lanjutkan Pengisian <i className="ph-bold ph-arrow-right"></i></button>
            </div>
          </div>
        )}

        {/* Step 3: File Uploads */}
        {step === 3 && (
          <div style={cardStyle}>
            <div style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '20px', marginBottom: '30px' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--color-text)', margin: '0 0 6px 0' }}>Unggah Dokumen Pendukung</h2>
              <p style={{ color: 'var(--color-muted)', fontSize: '0.9rem', margin: 0 }}>Unggah dokumen dalam format PDF atau gambar (JPG/PNG) maksimal 2MB per berkas.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginBottom: '32px' }}>
              {['ijazah', 'foto', 'ktp'].map((key) => {
                const label = key === 'ijazah' ? 'Salinan Ijazah / SKL' : key === 'foto' ? 'Pas Foto Resmi' : 'Salinan KTP / Kartu Keluarga';
                const fileIcon = key === 'foto' ? 'ph-image-square' : 'ph-file-pdf';
                return (
                  <div key={key} style={{ display: 'flex', flexDirection: 'column' }}>
                    <label style={labelStyle}>{label}</label>
                    <div style={{ position: 'relative', border: '2px dashed var(--color-border)', borderRadius: '24px', padding: '24px 16px', textAlign: 'center', background: 'var(--color-bg)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', transition: 'all 0.2s', cursor: 'pointer' }} onMouseOver={e=>e.currentTarget.style.borderColor='#3b82f6'} onMouseOut={e=>e.currentTarget.style.borderColor='var(--color-border)'}>
                      <input type="file" onChange={(e) => handleFileChange(key, e)} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }} />
                      <i className={`ph-duotone ${fileIcon}`} style={{ fontSize: '2.5rem', color: fileNames[key] ? '#10b981' : 'var(--color-muted)' }} />
                      <span style={{ fontSize: '0.85rem', color: fileNames[key] ? 'var(--color-text)' : 'var(--color-muted)', fontWeight: '700', wordBreak: 'break-all' }}>
                        {fileNames[key] || 'Klik untuk pilih file'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '40px', gap: '16px' }}>
              <button onClick={() => setStep(2)} style={{ padding: '12px 24px', borderRadius: '50px', border: '1px solid var(--color-border)', background: 'transparent', color: 'var(--color-text)', cursor: 'pointer', fontWeight: '700' }}>Kembali</button>
              <button onClick={() => setStep(4)} style={btnPrimary}>Tinjau Berkas <i className="ph-bold ph-arrow-right"></i></button>
            </div>
          </div>
        )}

        {/* Step 4: Review and Submit */}
        {step === 4 && (
          <div style={cardStyle}>
            <div style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '20px', marginBottom: '30px' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--color-text)', margin: '0 0 6px 0' }}>Tinjau Data Pendaftaran</h2>
              <p style={{ color: 'var(--color-muted)', fontSize: '0.9rem', margin: 0 }}>Pastikan seluruh data Anda sudah benar. Data tidak dapat diubah setelah pendaftaran dikirim.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '32px' }}>
              <div style={{ background: 'var(--color-bg)', padding: '24px', borderRadius: '24px', border: '1px solid var(--color-border)' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}><i className="ph-duotone ph-identification-card" style={{ color: '#3b82f6' }}></i> Data Calon Mahasiswa</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem' }}>
                  <div><span style={{ color: 'var(--color-muted)' }}>Nama:</span> <strong style={{ color: 'var(--color-text)' }}>{biodata.name}</strong></div>
                  <div><span style={{ color: 'var(--color-muted)' }}>Email:</span> <strong style={{ color: 'var(--color-text)' }}>{biodata.email}</strong></div>
                  <div><span style={{ color: 'var(--color-muted)' }}>Nomor HP:</span> <strong style={{ color: 'var(--color-text)' }}>{biodata.phone}</strong></div>
                  <div><span style={{ color: 'var(--color-muted)' }}>Lahir:</span> <strong style={{ color: 'var(--color-text)' }}>{biodata.birth_place}, {biodata.birth_date ? new Date(biodata.birth_date).toLocaleDateString('id-ID') : '-'}</strong></div>
                  <div><span style={{ color: 'var(--color-muted)' }}>Gender:</span> <strong style={{ color: 'var(--color-text)' }}>{biodata.gender === 'L' ? 'Laki-laki' : 'Perempuan'}</strong></div>
                </div>
              </div>

              <div style={{ background: 'var(--color-bg)', padding: '24px', borderRadius: '24px', border: '1px solid var(--color-border)' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}><i className="ph-duotone ph-graduation-cap" style={{ color: '#8b5cf6' }}></i> Pilihan Akademik</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem' }}>
                  <div><span style={{ color: 'var(--color-muted)' }}>Gelombang:</span> <strong style={{ color: 'var(--color-text)' }}>{selectedPeriod?.name}</strong></div>
                  <div><span style={{ color: 'var(--color-muted)' }}>Pilihan Prodi:</span> <strong style={{ color: 'var(--color-text)' }}>{biodata.program_choice}</strong></div>
                  <div><span style={{ color: 'var(--color-muted)' }}>Asal Sekolah:</span> <strong style={{ color: 'var(--color-text)' }}>{biodata.school_origin}</strong></div>
                </div>
              </div>
            </div>

            <div style={{ background: 'var(--color-bg)', padding: '24px', borderRadius: '24px', border: '1px solid var(--color-border)', marginBottom: '32px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}><i className="ph-duotone ph-file-arrow-up" style={{ color: '#10b981' }}></i> Dokumen Terlampir</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
                {['ijazah', 'foto', 'ktp'].map(key => (
                  <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--color-surface)', padding: '10px 20px', borderRadius: '50px', border: '1px solid var(--color-border)', fontSize: '0.85rem' }}>
                    <i className="ph ph-check-circle" style={{ color: fileNames[key] ? '#10b981' : 'var(--color-muted)' }}></i>
                    <span style={{ color: 'var(--color-text)', fontWeight: '700' }}>{key.toUpperCase()}:</span>
                    <span style={{ color: fileNames[key] ? 'var(--color-text)' : 'var(--color-muted)' }}>{fileNames[key] || 'Belum diupload'}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px' }}>
              <button onClick={() => setStep(3)} style={{ padding: '12px 24px', borderRadius: '50px', border: '1px solid var(--color-border)', background: 'transparent', color: 'var(--color-text)', cursor: 'pointer', fontWeight: '700' }}>Kembali</button>
              <button onClick={submitApplication} disabled={submitting || uploading} style={btnPrimary}>
                {submitting ? (
                  <>
                    <i className="ph ph-spinner ph-spin"></i> Mengirim Data...
                  </>
                ) : uploading ? (
                  <>
                    <i className="ph ph-spinner ph-spin"></i> Mengupload Berkas...
                  </>
                ) : (
                  <>
                    Kirim Pendaftaran Mandiri <i className="ph-bold ph-paper-plane-right"></i>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Step 5: Success Output */}
        {step === 5 && (
          <div style={{ ...cardStyle, textAlign: 'center', padding: '60px 40px' }}>
            <div style={{ width: '80px', height: '80px', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', margin: '0 auto 24px' }}>
              <i className="ph ph-check-bold"></i>
            </div>
            
            <h1 style={{ fontSize: '2.2rem', fontWeight: '900', color: 'var(--color-text)', margin: '0 0 10px 0' }}>Pendaftaran Berhasil dikirim!</h1>
            <p style={{ color: 'var(--color-muted)', fontSize: '1.05rem', margin: '0 auto 40px', maxWidth: '600px' }}>
              Selamat! Akun pendaftaran online Anda telah resmi terdaftar pada database sistem universitas. Simpan nomor pendaftaran di bawah ini untuk memeriksa berkas verifikasi.
            </p>

            <div style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)', padding: '24px 32px', borderRadius: '24px', display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: '12px', minWidth: '320px', marginBottom: '40px' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-muted)', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '1px' }}>Nomor Registrasi PMB Anda</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <strong style={{ fontSize: '1.8rem', color: 'var(--color-text)', letterSpacing: '2px', fontWeight: '900' }}>{registrationNumber}</strong>
                <button onClick={copyToClipboard} style={{ background: 'transparent', border: 'none', color: copied ? '#10b981' : 'var(--color-text)', cursor: 'pointer', fontSize: '1.3rem', display: 'flex', padding: '6px', borderRadius: '50%', transition: 'all 0.15s' }}>
                  <i className={copied ? "ph ph-check-circle" : "ph ph-copy"}></i>
                </button>
              </div>
              {copied && <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: '700' }}>Nomor disalin ke clipboard!</span>}
            </div>

            <div>
              <button onClick={() => { setStep(1); setBiodata({ name: '', email: '', phone: '', gender: '', birth_date: '', birth_place: '', address: '', school_origin: '', program_choice: '' }); setFiles({ ijazah: null, foto: null, ktp: null }); setFileNames({ ijazah: '', foto: '', ktp: '' }); }} style={{ ...btnPrimary, margin: '0 auto' }}>Daftarkan Akun Baru Lainnya</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
