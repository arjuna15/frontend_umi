"use client";
import { useEffect, useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/Providers';
import CustomSelect from '../siakad/components/CustomSelect';

const PMB_TRANSLATIONS = {
  id: {
    select_wave: "Pilih Gelombang PMB",
    select_wave_desc: "Silakan pilih gelombang PMB yang aktif untuk memulai pendaftaran Anda.",
    loading: "Memuat gelombang pendaftaran...",
    empty_wave: "Belum Ada Gelombang Dibuka",
    empty_wave_desc: "Mohon maaf, saat ini pendaftaran online mandiri belum dibuka atau telah ditutup sementara.",
    quota: "Kuota Gelombang",
    deadline: "Batas Pendaftaran",
    start_btn: "Mulai Pendaftaran Mandiri",
    pendaftar: "Pendaftar",
    form_title: "Formulir Data Diri Calon Mahasiswa",
    form_desc: "Lengkapi seluruh formulir dengan data asli yang sesuai dengan berkas resmi Anda.",
    label_name: "Nama Lengkap",
    placeholder_name: "Nama sesuai ijazah resmi",
    label_email: "Email Aktif",
    placeholder_email: "email@contoh.com",
    label_phone: "Nomor HP / WhatsApp",
    placeholder_phone: "08xxxxxxxxxx",
    label_gender: "Jenis Kelamin",
    placeholder_gender: "Pilih jenis kelamin",
    gender_l: "Laki-laki",
    gender_p: "Perempuan",
    label_pob: "Tempat Lahir",
    placeholder_pob: "Kota kelahiran",
    label_dob: "Tanggal Lahir",
    label_school: "Asal Sekolah (SMA/SMK/MA)",
    placeholder_school: "Nama sekolah asal",
    label_prodi: "Pilihan Program Studi",
    placeholder_prodi: "Pilih Program Studi",
    label_address: "Alamat Domisili Lengkap",
    placeholder_address: "Tuliskan alamat lengkap tempat tinggal saat ini...",
    btn_back: "Kembali",
    btn_continue: "Lanjutkan Pengisian",
    upload_title: "Unggah Dokumen Pendukung",
    upload_desc: "Unggah dokumen dalam format PDF atau gambar (JPG/PNG) maksimal 2MB per berkas.",
    label_ijazah: "Salinan Ijazah / SKL",
    label_foto: "Pas Foto Resmi",
    label_ktp: "Salinan KTP / Kartu Keluarga",
    upload_click: "Klik untuk pilih file",
    btn_review: "Tinjau Berkas",
    review_title: "Tinjau Data Pendaftaran",
    review_desc: "Pastikan seluruh data Anda sudah benar. Data tidak dapat diubah setelah pendaftaran dikirim.",
    review_personal: "Data Calon Mahasiswa",
    review_academic: "Pilihan Akademik",
    review_docs: "Dokumen Terlampir",
    btn_submit: "Kirim Pendaftaran Mandiri",
    btn_submitting: "Mengirim Data...",
    btn_uploading: "Mengupload Berkas...",
    success_title: "Pendaftaran Berhasil dikirim!",
    success_desc: "Selamat! Akun pendaftaran online Anda telah resmi terdaftar pada database sistem universitas. Simpan nomor pendaftaran di bawah ini untuk memeriksa berkas verifikasi.",
    success_reg: "Nomor Registrasi PMB Anda",
    success_copied: "Nomor disalin ke clipboard!",
    btn_new_reg: "Daftarkan Akun Baru Lainnya",
    err_fill_all: "Mohon lengkapi seluruh formulir data diri.",
    err_submit_fail: "Gagal mengirim pendaftaran. Silakan coba lagi."
  },
  en: {
    select_wave: "Select PMB Wave",
    select_wave_desc: "Please choose an active PMB wave to start your registration.",
    loading: "Loading registration waves...",
    empty_wave: "No Active Waves Available",
    empty_wave_desc: "We are sorry, currently online registration is not open or temporarily closed.",
    quota: "Wave Quota",
    deadline: "Registration Deadline",
    start_btn: "Start Registration",
    pendaftar: "Applicants",
    form_title: "Candidate Personal Information Form",
    form_desc: "Complete the form with your real data corresponding to your official documents.",
    label_name: "Full Name",
    placeholder_name: "Name as in official certificate",
    label_email: "Active Email",
    placeholder_email: "email@example.com",
    label_phone: "Phone / WhatsApp Number",
    placeholder_phone: "08xxxxxxxxxx",
    label_gender: "Gender",
    placeholder_gender: "Select gender",
    gender_l: "Male",
    gender_p: "Female",
    label_pob: "Place of Birth",
    placeholder_pob: "City of birth",
    label_dob: "Date of Birth",
    label_school: "High School Origin (SMA/SMK/MA)",
    placeholder_school: "School name origin",
    label_prodi: "Study Program Choice",
    placeholder_prodi: "Select Study Program",
    label_address: "Complete Home Address",
    placeholder_address: "Write your complete current residence address...",
    btn_back: "Back",
    btn_continue: "Continue",
    upload_title: "Upload Supporting Documents",
    upload_desc: "Upload documents in PDF or image format (JPG/PNG) maximum 2MB per file.",
    label_ijazah: "Certificate copy / SKL",
    label_foto: "Official Photograph",
    label_ktp: "Copy of ID / Family Card",
    upload_click: "Click to select file",
    btn_review: "Review Files",
    review_title: "Review Registration Data",
    review_desc: "Make sure all your data is correct. Data cannot be changed after registration is submitted.",
    review_personal: "Candidate Personal Data",
    review_academic: "Academic Choices",
    review_docs: "Attached Documents",
    btn_submit: "Submit Online Registration",
    btn_submitting: "Submitting Data...",
    btn_uploading: "Uploading Files...",
    success_title: "Registration Successfully Submitted!",
    success_desc: "Congratulations! Your online registration account is officially registered. Save your registration number below to check document verification.",
    success_reg: "Your PMB Registration Number",
    success_copied: "Number copied to clipboard!",
    btn_new_reg: "Register Another Account",
    err_fill_all: "Please complete all fields in the personal information form.",
    err_submit_fail: "Failed to submit registration. Please try again."
  }
};

export default function PMBRegistrationPage() {
  const { theme } = useTheme();
  const { lang } = useLanguage();
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

  // Active translation dictionary selection
  const trans = PMB_TRANSLATIONS[lang] || PMB_TRANSLATIONS.id;

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
        setMessage({ text: trans.err_fill_all, type: 'error' });
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
      setMessage({ text: trans.err_submit_fail, type: 'error' });
    } finally { 
      setSubmitting(false); 
    }
  };

  const isDark = theme === 'dark';

  const containerStyle = {
    fontFamily: "'Inter', sans-serif",
    minHeight: '100vh',
    // Gunakan linear gradient yang memudar mengalir ke footer di bagian bawah
    background: isDark 
      ? 'linear-gradient(to bottom, #020617 0%, #0d1224 50%, #1a2035 100%)' 
      : 'linear-gradient(to bottom, #ffffff 0%, #f8fafc 50%, #e2e8f0 100%)',
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
    background: 'linear-gradient(135deg, rgb(59, 130, 246) 0%, rgb(29, 78, 216) 100%)',
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
    boxShadow: '0 8px 24px rgba(29, 78, 216, 0.3)'
  };

  const stepLabels = [
    { num: 1, label: trans.select_wave, icon: 'ph-duotone ph-calendar' },
    { num: 2, label: 'Biodata', icon: 'ph-duotone ph-user' },
    { num: 3, label: 'Dokumen', icon: 'ph-duotone ph-upload' },
    { num: 4, label: 'Review', icon: 'ph-duotone ph-eye' },
    { num: 5, label: 'Selesai', icon: 'ph-duotone ph-check-circle' },
  ];

  return (
    <div style={containerStyle}>
      {/* Background Ornaments (Glowing Ambient) */}
      <div className="siakad-page-header-glow" style={{ opacity: isDark ? 0.6 : 0.25 }}></div>
      
      {/* Ornamen Grid Garis Kotak-Kotak (Symmetric 30px Grid Pattern) */}
      <div style={{
        position: 'absolute',
        inset: 0,
        opacity: isDark ? 0.08 : 0.03,
        backgroundImage: `
          linear-gradient(var(--color-text) 1px, transparent 1px),
          linear-gradient(90deg, var(--color-text) 1px, transparent 1px)
        `,
        backgroundSize: '30px 30px',
        pointerEvents: 'none',
        zIndex: 0
      }}></div>

      <style>{`
        /* Overide Navbar Text to remain visible (dark/black color when not sticky/stay header) */
        header:not(.sticky) nav a, 
        header:not(.sticky) .btn, 
        header:not(.sticky) .lang-btn, 
        header:not(.sticky) .theme-toggle i,
        header:not(.sticky) .nav-link,
        header:not(.sticky) .nav-links a {
          color: var(--color-text) !important;
        }
        header:not(.sticky) .logo h1,
        header:not(.sticky) .logo p {
          color: var(--color-text) !important;
        }
        header:not(.sticky) .btn-primary {
          color: white !important;
        }

        .custom-select {
          appearance: none !important;
          background-image: url("data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20width%3D%2712%27%20height%3D%2712%27%20viewBox%3D%270%200%2012%2012%27%3E%3Cpath%20fill%3D%27%233b82f6%27%20d%3D%27M6%208L1%203h10z%27%2F%3E%3C%2Fsvg%3E") !important;
          background-repeat: no-repeat !important;
          background-position: right 22px center !important;
          background-size: 12px !important;
          padding-right: 46px !important;
          cursor: pointer;
        }
        .custom-select option {
          background: var(--color-surface);
          color: var(--color-text);
        }
        .pmb-card-period:hover {
          transform: translateY(-6px);
          background: rgba(255, 255, 255, 0.03) !important;
          border-color: rgba(59, 130, 246, 0.3) !important;
          box-shadow: 0 15px 30px rgba(59, 130, 246, 0.15) !important;
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
                  background: step === s.num ? 'linear-gradient(135deg, rgb(59, 130, 246) 0%, rgb(29, 78, 216) 100%)' : step > s.num ? 'rgba(34, 197, 94, 0.1)' : 'transparent',
                  border: step === s.num ? 'none' : '1px solid var(--color-border)',
                  boxShadow: step === s.num ? '0 4px 12px rgba(29, 78, 216, 0.25)' : 'none'
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
              <h1 style={{ fontSize: '2.5rem', fontWeight: '900', color: 'var(--color-text)', margin: '0 0 10px 0', letterSpacing: '-0.03em' }}>{trans.select_wave}</h1>
              <p style={{ color: 'var(--color-muted)', fontSize: '1.05rem', margin: 0 }}>{trans.select_wave_desc}</p>
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '60px 0' }}>
                <i className="ph ph-spinner ph-spin" style={{ fontSize: '2.5rem', color: '#3b82f6', marginBottom: '16px' }}></i>
                <p style={{ color: 'var(--color-muted)', fontSize: '0.95rem' }}>{trans.loading}</p>
              </div>
            ) : periods.length === 0 ? (
              <div style={{ ...cardStyle, textAlign: 'center', padding: '60px 40px' }}>
                <i className="ph-duotone ph-calendar-blank" style={{ fontSize: '4rem', display: 'block', marginBottom: '16px', color: 'var(--color-muted)', opacity: 0.6 }}></i>
                <h3 style={{ fontSize: '1.4rem', color: 'var(--color-text)', margin: '0 0 8px 0', fontWeight: '800' }}>{trans.empty_wave}</h3>
                <p style={{ color: 'var(--color-muted)', margin: 0, fontSize: '0.95rem' }}>{trans.empty_wave_desc}</p>
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
                        <span><i className="ph ph-users" style={{ marginRight: '6px' }}></i> {trans.quota}:</span>
                        <span style={{ color: 'var(--color-text)', fontWeight: '700' }}>{p.quota} {trans.pendaftar}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span><i className="ph ph-clock" style={{ marginRight: '6px' }}></i> {trans.deadline}:</span>
                        <span style={{ color: 'var(--color-text)', fontWeight: '700' }}>{p.end_date ? new Date(p.end_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}</span>
                      </div>
                    </div>
                    <div style={{ marginTop: '24px', textAlign: 'center' }}>
                      <button style={{ ...btnPrimary, width: '100%', justifyContent: 'center' }}>{trans.start_btn}</button>
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
              <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--color-text)', margin: '0 0 6px 0' }}>{trans.form_title}</h2>
              <p style={{ color: 'var(--color-muted)', fontSize: '0.9rem', margin: 0 }}>{trans.form_desc}</p>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
              <div>
                <label style={labelStyle}>{trans.label_name}</label>
                <input type="text" value={biodata.name} onChange={e => setBiodata({ ...biodata, name: e.target.value })} placeholder={trans.placeholder_name} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>{trans.label_email}</label>
                <input type="email" value={biodata.email} onChange={e => setBiodata({ ...biodata, email: e.target.value })} placeholder={trans.placeholder_email} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>{trans.label_phone}</label>
                <input type="tel" value={biodata.phone} onChange={e => setBiodata({ ...biodata, phone: e.target.value })} placeholder={trans.placeholder_phone} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>{trans.label_gender}</label>
                <CustomSelect 
                  value={biodata.gender} 
                  onChange={val => setBiodata({ ...biodata, gender: val })} 
                  placeholder={trans.placeholder_gender} 
                  options={[
                    { value: 'L', label: trans.gender_l },
                    { value: 'P', label: trans.gender_p }
                  ]}
                />
              </div>
              <div>
                <label style={labelStyle}>{trans.label_pob}</label>
                <input type="text" value={biodata.birth_place} onChange={e => setBiodata({ ...biodata, birth_place: e.target.value })} placeholder={trans.placeholder_pob} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>{trans.label_dob}</label>
                <input type="date" value={biodata.birth_date} onChange={e => setBiodata({ ...biodata, birth_date: e.target.value })} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>{trans.label_school}</label>
                <input type="text" value={biodata.school_origin} onChange={e => setBiodata({ ...biodata, school_origin: e.target.value })} placeholder={trans.placeholder_school} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>{trans.label_prodi}</label>
                <CustomSelect
                  value={biodata.program_choice}
                  onChange={val => setBiodata({ ...biodata, program_choice: val })}
                  placeholder={trans.placeholder_prodi}
                  options={[
                    { value: 'Manajemen S1', label: 'S1 Manajemen' },
                    { value: 'Sistem Informasi S1', label: 'S1 Sistem Informasi' },
                    { value: 'Ilmu Komputer S1', label: 'S1 Ilmu Komputer' },
                    { value: 'Hukum S1', label: 'S1 Hukum' },
                    { value: 'Magister Manajemen S2', label: 'S2 Magister Manajemen' }
                  ]}
                />
              </div>
            </div>
            
            <div style={{ marginTop: '24px' }}>
              <label style={labelStyle}>{trans.label_address}</label>
              <textarea value={biodata.address} onChange={e => setBiodata({ ...biodata, address: e.target.value })} placeholder={trans.placeholder_address} rows={4} style={{ ...inputStyle, borderRadius: '16px', resize: 'vertical' }} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '40px', gap: '16px' }}>
              <button onClick={() => setStep(1)} style={{ padding: '12px 24px', borderRadius: '50px', border: '1px solid var(--color-border)', background: 'transparent', color: 'var(--color-text)', cursor: 'pointer', fontWeight: '700' }}>{trans.btn_back}</button>
              <button onClick={() => validateBiodata() && setStep(3)} style={btnPrimary}>{trans.btn_continue} <i className="ph-bold ph-arrow-right"></i></button>
            </div>
          </div>
        )}

        {/* Step 3: File Uploads */}
        {step === 3 && (
          <div style={cardStyle}>
            <div style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '20px', marginBottom: '30px' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--color-text)', margin: '0 0 6px 0' }}>{trans.upload_title}</h2>
              <p style={{ color: 'var(--color-muted)', fontSize: '0.9rem', margin: 0 }}>{trans.upload_desc}</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginBottom: '32px' }}>
              {['ijazah', 'foto', 'ktp'].map((key) => {
                const label = key === 'ijazah' ? trans.label_ijazah : key === 'foto' ? trans.label_foto : trans.label_ktp;
                const fileIcon = key === 'foto' ? 'ph-image-square' : 'ph-file-pdf';
                return (
                  <div key={key} style={{ display: 'flex', flexDirection: 'column' }}>
                    <div style={{ minHeight: '40px', display: 'flex', alignItems: 'flex-end', marginBottom: '8px' }}>
                      <label style={{ ...labelStyle, marginBottom: 0 }}>{label}</label>
                    </div>
                    <div style={{ position: 'relative', border: '2px dashed var(--color-border)', borderRadius: '24px', padding: '24px 16px', textAlign: 'center', background: 'var(--color-bg)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', transition: 'all 0.2s', cursor: 'pointer' }} onMouseOver={e=>e.currentTarget.style.borderColor='#3b82f6'} onMouseOut={e=>e.currentTarget.style.borderColor='var(--color-border)'}>
                      <input type="file" onChange={(e) => handleFileChange(key, e)} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }} />
                      <i className={`ph-duotone ${fileIcon}`} style={{ fontSize: '2.5rem', color: fileNames[key] ? '#10b981' : 'var(--color-muted)' }} />
                      <span style={{ fontSize: '0.85rem', color: fileNames[key] ? 'var(--color-text)' : 'var(--color-muted)', fontWeight: '700', wordBreak: 'break-all' }}>
                        {fileNames[key] || trans.upload_click}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '40px', gap: '16px' }}>
              <button onClick={() => setStep(2)} style={{ padding: '12px 24px', borderRadius: '50px', border: '1px solid var(--color-border)', background: 'transparent', color: 'var(--color-text)', cursor: 'pointer', fontWeight: '700' }}>{trans.btn_back}</button>
              <button onClick={() => setStep(4)} style={btnPrimary}>{trans.btn_review} <i className="ph-bold ph-arrow-right"></i></button>
            </div>
          </div>
        )}

        {/* Step 4: Review and Submit */}
        {step === 4 && (
          <div style={cardStyle}>
            <div style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '20px', marginBottom: '30px' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--color-text)', margin: '0 0 6px 0' }}>{trans.review_title}</h2>
              <p style={{ color: 'var(--color-muted)', fontSize: '0.9rem', margin: 0 }}>{trans.review_desc}</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '32px' }}>
              <div style={{ background: 'var(--color-bg)', padding: '24px', borderRadius: '24px', border: '1px solid var(--color-border)' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}><i className="ph-duotone ph-identification-card" style={{ color: '#3b82f6' }}></i> {trans.review_personal}</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem' }}>
                  <div><span style={{ color: 'var(--color-muted)' }}>Name:</span> <strong style={{ color: 'var(--color-text)' }}>{biodata.name}</strong></div>
                  <div><span style={{ color: 'var(--color-muted)' }}>Email:</span> <strong style={{ color: 'var(--color-text)' }}>{biodata.email}</strong></div>
                  <div><span style={{ color: 'var(--color-muted)' }}>Nomor HP:</span> <strong style={{ color: 'var(--color-text)' }}>{biodata.phone}</strong></div>
                  <div><span style={{ color: 'var(--color-muted)' }}>Lahir:</span> <strong style={{ color: 'var(--color-text)' }}>{biodata.birth_place}, {biodata.birth_date ? new Date(biodata.birth_date).toLocaleDateString('id-ID') : '-'}</strong></div>
                  <div><span style={{ color: 'var(--color-muted)' }}>Gender:</span> <strong style={{ color: 'var(--color-text)' }}>{biodata.gender === 'L' ? trans.gender_l : trans.gender_p}</strong></div>
                </div>
              </div>

              <div style={{ background: 'var(--color-bg)', padding: '24px', borderRadius: '24px', border: '1px solid var(--color-border)' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}><i className="ph-duotone ph-graduation-cap" style={{ color: '#8b5cf6' }}></i> {trans.review_academic}</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem' }}>
                  <div><span style={{ color: 'var(--color-muted)' }}>Gelombang:</span> <strong style={{ color: 'var(--color-text)' }}>{selectedPeriod?.name}</strong></div>
                  <div><span style={{ color: 'var(--color-muted)' }}>Pilihan Prodi:</span> <strong style={{ color: 'var(--color-text)' }}>{biodata.program_choice}</strong></div>
                  <div><span style={{ color: 'var(--color-muted)' }}>Asal Sekolah:</span> <strong style={{ color: 'var(--color-text)' }}>{biodata.school_origin}</strong></div>
                </div>
              </div>
            </div>

            <div style={{ background: 'var(--color-bg)', padding: '24px', borderRadius: '24px', border: '1px solid var(--color-border)', marginBottom: '32px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}><i className="ph-duotone ph-file-arrow-up" style={{ color: '#10b981' }}></i> {trans.review_docs}</h3>
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
              <button onClick={() => setStep(3)} style={{ padding: '12px 24px', borderRadius: '50px', border: '1px solid var(--color-border)', background: 'transparent', color: 'var(--color-text)', cursor: 'pointer', fontWeight: '700' }}>{trans.btn_back}</button>
              <button onClick={submitApplication} disabled={submitting || uploading} style={btnPrimary}>
                {submitting ? (
                  <>
                    <i className="ph ph-spinner ph-spin"></i> {trans.btn_submitting}
                  </>
                ) : uploading ? (
                  <>
                    <i className="ph ph-spinner ph-spin"></i> {trans.btn_uploading}
                  </>
                ) : (
                  <>
                    {trans.btn_submit} <i className="ph-bold ph-paper-plane-right"></i>
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
            
            <h1 style={{ fontSize: '2.2rem', fontWeight: '900', color: 'var(--color-text)', margin: '0 0 10px 0' }}>{trans.success_title}</h1>
            <p style={{ color: 'var(--color-muted)', fontSize: '1.05rem', margin: '0 auto 40px', maxWidth: '600px' }}>
              {trans.success_desc}
            </p>

            <div style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)', padding: '24px 32px', borderRadius: '24px', display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: '12px', minWidth: '320px', marginBottom: '40px' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-muted)', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '1px' }}>{trans.success_reg}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <strong style={{ fontSize: '1.8rem', color: 'var(--color-text)', letterSpacing: '2px', fontWeight: '900' }}>{registrationNumber}</strong>
                <button onClick={copyToClipboard} style={{ background: 'transparent', border: 'none', color: copied ? '#10b981' : 'var(--color-text)', cursor: 'pointer', fontSize: '1.3rem', display: 'flex', padding: '6px', borderRadius: '50%', transition: 'all 0.15s' }}>
                  <i className={copied ? "ph ph-check-circle" : "ph ph-copy"}></i>
                </button>
              </div>
              {copied && <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: '700' }}>{trans.success_copied}</span>}
            </div>

            <div>
              <button onClick={() => { setStep(1); setBiodata({ name: '', email: '', phone: '', gender: '', birth_date: '', birth_place: '', address: '', school_origin: '', program_choice: '' }); setFiles({ ijazah: null, foto: null, ktp: null }); setFileNames({ ijazah: '', foto: '', ktp: '' }); }} style={{ ...btnPrimary, margin: '0 auto' }}>{trans.btn_new_reg}</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
