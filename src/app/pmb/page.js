"use client";
import { useEffect, useState } from 'react';
import { useTheme, useLanguage } from '../../context/Providers';
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
    err_submit_fail: "Gagal mengirim pendaftaran. Silakan coba lagi.",
    // Tambahan Pembayaran
    step_payment: "Pembayaran",
    pay_title: "Pembayaran Biaya Pendaftaran",
    pay_desc: "Lakukan pelunasan biaya administrasi PMB menggunakan salah satu opsi transfer di bawah ini.",
    pay_cost: "Nominal Biaya Pendaftaran",
    pay_method: "Pilih Metode Pembayaran",
    pay_upload: "Unggah Bukti Transaksi",
    pay_status: "Status Pembayaran",
    pay_pending: "Menunggu Verifikasi",
    pay_paid: "Lunas / Terverifikasi",
    // Tambahan Cek Status
    check_tab: "Cek Status Kelulusan",
    reg_tab: "Formulir Pendaftaran",
    check_title: "Pantau Status Kelulusan PMB",
    check_desc: "Masukkan nomor registrasi PMB dan nomor WhatsApp Anda yang terdaftar untuk melihat status seleksi.",
    btn_check: "Cek Progress Hasil",
    check_error: "Data registrasi tidak ditemukan. Periksa kembali nomor pendaftaran Anda.",
    test_title: "Jadwal Ujian Seleksi Online & Wawancara",
    test_date: "Tanggal Tes",
    test_link: "Link Ujian Seleksi",
    status_verified: "Status Dokumen",
    status_passed: "LULUS SELEKSI",
    status_failed: "TIDAK LULUS SELEKSI",
    status_processing: "Proses Seleksi Berkas"
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
    err_submit_fail: "Failed to submit registration. Please try again.",
    // Tambahan Pembayaran
    step_payment: "Payment",
    pay_title: "Registration Fee Payment",
    pay_desc: "Complete the PMB administration fee payment using one of the transfer options below.",
    pay_cost: "Registration Fee Amount",
    pay_method: "Select Payment Method",
    pay_upload: "Upload Transaction Receipt",
    pay_status: "Payment Status",
    pay_pending: "Awaiting Verification",
    pay_paid: "Verified / Paid",
    // Tambahan Cek Status
    check_tab: "Check Admission Status",
    reg_tab: "Registration Form",
    check_title: "Monitor PMB Selection Progress",
    check_desc: "Enter your PMB registration number and your registered WhatsApp number to see selection status.",
    btn_check: "Check Progress Status",
    check_error: "Registration data not found. Please double-check your registration number.",
    test_title: "Online Selection Test & Interview Schedule",
    test_date: "Test Date",
    test_link: "Selection Exam Link",
    status_verified: "Document Status",
    status_passed: "SELECTION PASSED",
    status_failed: "SELECTION FAILED",
    status_processing: "Verifying Documents"
  }
};

export default function PMBRegistrationPage() {
  const { theme } = useTheme();
  const { lang } = useLanguage();
  const [activeTab, setActiveTab] = useState('register'); // 'register' or 'status'
  
  // Registration Form States
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
  const [files, setFiles] = useState({ ijazah: null, foto: null, ktp: null, bukti_bayar: null });
  const [fileNames, setFileNames] = useState({ ijazah: '', foto: '', ktp: '', bukti_bayar: '' });
  const [copied, setCopied] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('VA Mandiri');

  // Status Check States
  const [searchRegNum, setSearchRegNum] = useState('');
  const [searchPhone, setSearchPhone] = useState('');
  const [checkLoading, setCheckLoading] = useState(false);
  const [statusResult, setStatusResult] = useState(null);

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
    setShowToast(true);
    setTimeout(() => {
      setCopied(false);
      setShowToast(false);
    }, 3000);
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

      // Upload files if any (Documents & Bukti Bayar)
      if (appId && (files.ijazah || files.foto || files.ktp || files.bukti_bayar)) {
        setUploading(true);
        for (const key of ['ijazah', 'foto', 'ktp', 'bukti_bayar']) {
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

      setStep(6);
    } catch (e) {
      setMessage({ text: trans.err_submit_fail, type: 'error' });
    } finally { 
      setSubmitting(false); 
    }
  };

  const handleCheckStatus = async (e) => {
    e.preventDefault();
    if (!searchRegNum) return;
    setCheckLoading(true);
    setStatusResult(null);
    setMessage({ text: '', type: '' });

    try {
      // Find applicant detail by reg number
      const res = await fetch(`${apiUrl}/siakad/pmb/applicant/status/${encodeURIComponent(searchRegNum)}`);
      if (!res.ok) throw new Error('Not Found');
      const data = await res.json();
      
      const applicant = data.applicant || data.data || data;
      if (!applicant) throw new Error('Empty');

      setStatusResult(applicant);
    } catch (err) {
      setMessage({ text: trans.check_error, type: 'error' });
    } finally {
      setCheckLoading(false);
    }
  };

  const isDark = theme === 'dark';

  const containerStyle = {
    fontFamily: "'Inter', sans-serif",
    minHeight: '100vh',
    color: 'var(--color-text)',
    transition: 'all 0.3s ease',
    position: 'relative',
    overflow: 'hidden'
  };

  const cardStyle = {
    background: 'var(--glass-bg)',
    borderRadius: '24px',
    padding: '40px',
    border: 'var(--glass-border)',
    boxShadow: 'var(--glass-shadow)',
    transition: 'all 0.3s ease',
    boxSizing: 'border-box',
    width: '100%'
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 22px',
    borderRadius: '50px',
    border: 'var(--inset-border)',
    background: 'var(--liquid-bg)',
    color: 'var(--color-text)',
    fontSize: '0.95rem',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'all 0.2s ease',
    boxShadow: 'inset 4px 4px 8px var(--inset-shadow-dark), inset -4px -4px 8px var(--inset-shadow-light)'
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
    background: 'var(--gradient-red, linear-gradient(135deg, #B91C1C 0%, #E11D48 100%))',
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
    boxShadow: '0 8px 24px rgba(185, 28, 28, 0.25)'
  };

  const stepLabels = [
    { num: 1, label: trans.select_wave, icon: 'ph-duotone ph-calendar' },
    { num: 2, label: 'Biodata', icon: 'ph-duotone ph-user' },
    { num: 3, label: 'Dokumen', icon: 'ph-duotone ph-upload' },
    { num: 4, label: trans.step_payment, icon: 'ph-duotone ph-credit-card' },
    { num: 5, label: 'Review', icon: 'ph-duotone ph-eye' },
    { num: 6, label: 'Selesai', icon: 'ph-duotone ph-check-circle' },
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
        backgroundSize: '30px 30px',
        pointerEvents: 'none',
        zIndex: 0
      }}></div>

      <style>{`
        /* Light Mode Specific: Stay Navbar Text remains black and visible */
        body:not(.dark-mode) header:not(.sticky) .nav-link,
        body:not(.dark-mode) header:not(.sticky) .nav-links > li > a {
          color: #000000 !important;
          text-shadow: none !important;
        }
        body:not(.dark-mode) header:not(.sticky) .dropdown-icon {
          color: #000000 !important;
        }

        /* Dark Mode Specific: Stay & Sticky Navbar Text remains white */
        body.dark-mode header .nav-link,
        body.dark-mode header .nav-links > li > a {
          color: #ffffff !important;
          text-shadow: none !important;
        }
        body.dark-mode header .dropdown-icon {
          color: #ffffff !important;
        }

        header:not(.sticky) .logo h1,
        header:not(.sticky) .logo p {
          color: var(--color-text) !important;
        }
        
        /* Language switcher labels in light mode should be dark for visibility */
        body:not(.dark-mode) header:not(.sticky) .lang-switch .lang-btn:not(.active) {
          color: #1e293b !important;
          text-shadow: none !important;
        }
        body:not(.dark-mode) header:not(.sticky) .lang-switch .lang-btn.active {
          color: white !important;
        }
        /* In dark mode, non-active lang buttons stay white */
        body.dark-mode header:not(.sticky) .lang-switch .lang-btn:not(.active) {
          color: #ffffff !important;
          text-shadow: none !important;
        }
        body.dark-mode header:not(.sticky) .lang-switch .lang-btn.active {
          color: white !important;
        }

        /* Theme toggle icon: dark in light mode, white in dark mode */
        body:not(.dark-mode) header:not(.sticky) .theme-toggle i {
          color: #1e293b !important;
        }
        body.dark-mode header:not(.sticky) .theme-toggle i {
          color: #ffffff !important;
        }

        /* Adaptive transparent backgrounds for switches */
        body:not(.dark-mode) header .lang-switch,
        body:not(.dark-mode) header .theme-toggle {
          background: var(--glass-bg) !important;
          border-color: var(--color-border) !important;
          box-shadow: var(--glass-shadow) !important;
        }
        body.dark-mode header .lang-switch,
        body.dark-mode header .theme-toggle {
          background: #0003 !important;
          border-color: #fff6 !important;
        }

        /* Responsive Progress Tracker Wizard */
        .pmb-step-outer {
          display: flex;
          justify-content: center;
          width: 100%;
        }

        .pmb-step-wrapper {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 12px;
          margin-bottom: 40px;
          background: var(--glass-bg);
          padding: 16px 24px;
          border-radius: 50px;
          border: var(--glass-border);
          box-shadow: var(--glass-shadow);
          box-sizing: border-box !important;
          width: fit-content;
        }
        .pmb-step-item {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .pmb-step-pill span {
          white-space: nowrap !important;
        }

        @media (max-width: 768px) {
          .pmb-step-wrapper {
            justify-content: center;
            border-radius: 24px;
            padding: 8px 12px !important;
            gap: 4px;
          }
          .pmb-step-item {
            display: none;
          }
          .pmb-step-item.active-step,
          .pmb-step-item.next-step {
            display: flex;
            align-items: center;
          }
          .pmb-step-item.next-step {
            opacity: 0.55;
          }
          .pmb-step-item.next-step .pmb-step-pill {
            background: transparent !important;
            border: 1px dashed var(--color-border) !important;
          }
          .pmb-step-item.active-step .pmb-step-pill span,
          .pmb-step-item.next-step .pmb-step-pill span {
            font-size: 0.72rem !important;
          }
          .pmb-step-item.active-step .pmb-step-pill,
          .pmb-step-item.next-step .pmb-step-pill {
            padding: 6px 12px !important;
          }
          /* Show active step divider specifically to separate the two steps in mobile view */
          .pmb-step-item.active-step .pmb-step-divider {
            display: inline-block !important;
            margin-left: 6px !important;
          }
          /* Fix card overflow by reducing padding on mobile */
          .siakad-pmb-card {
            padding: 20px !important;
          }
          .siakad-pmb-tab-wrapper {
            flex-direction: column !important;
            width: 100% !important;
            gap: 10px !important;
          }
          .siakad-pmb-tab-btn {
            width: 100% !important;
            text-align: center !important;
            justify-content: center !important;
          }
        }

        .custom-select {
          appearance: none !important;
          background-image: url("data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20width%3D%2712%27%20height%3D%2712%27%20viewBox%3D%270%200%2012%2012%27%3E%3Cpath%20fill%3D%27%23B91C1C%27%20d%3D%27M6%208L1%203h10z%27%2F%3E%3C%2Fsvg%3E") !important;
          background-repeat: no-repeat !important;
          background-position: right 22px center !important;
          background-size: 12px !important;
          padding-right: 46px !important;
          cursor: pointer;
        }
        .custom-select option {
          background: var(--glass-bg);
          color: var(--color-text);
        }
        .pmb-card-period:hover {
          transform: translateY(-6px);
          background: var(--glass-bg) !important;
          border-color: var(--umiba-red-light) !important;
          box-shadow: 0 15px 30px rgba(185, 28, 28, 0.15) !important;
        }
        .pmb-step-pill {
          background: var(--glass-bg);
          border: var(--glass-border);
          box-shadow: var(--glass-shadow);
          transition: all 0.25s ease;
        }
        .pmb-step-item.active-step .pmb-step-pill {
          box-shadow: 0 4px 12px rgba(185, 28, 28, 0.25) !important;
        }
        input:focus, select:focus, textarea:focus {
          border-color: var(--umiba-red-light, #EF4444) !important;
          box-shadow: 0 0 0 3px rgba(185, 28, 28, 0.2) !important;
        }

        /* Neumorphic datepicker / date input */
        input[type="date"] {
          background: var(--liquid-bg) !important;
          border: var(--inset-border) !important;
          box-shadow: inset 4px 4px 8px var(--inset-shadow-dark), inset -4px -4px 8px var(--inset-shadow-light) !important;
          color-scheme: light;
          cursor: pointer;
        }
        body.dark-mode input[type="date"] {
          color-scheme: dark;
        }
        input[type="date"]::-webkit-calendar-picker-indicator {
          filter: none;
          cursor: pointer;
          opacity: 0.6;
        }
        body.dark-mode input[type="date"]::-webkit-calendar-picker-indicator {
          filter: invert(1);
          opacity: 0.7;
        }

        /* Neumorphic badge for payment pending */
        .pmb-badge-pending {
          background: var(--glass-bg) !important;
          border: var(--glass-border) !important;
          box-shadow: var(--glass-shadow) !important;
          color: #f59e0b !important;
          padding: 6px 16px;
          border-radius: 50px;
          font-size: 0.85rem;
          font-weight: 800;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }

        /* Section header dividers neumorphic */
        .pmb-section-divider {
          border-bottom: var(--glass-border) !important;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        
        /* Floating Toast style */
        .siakad-toast {
          position: fixed;
          bottom: 30px;
          right: 30px;
          background: #10b981;
          color: white;
          padding: 14px 28px;
          border-radius: 50px;
          box-shadow: 0 8px 24px rgba(16, 185, 129, 0.3);
          z-index: 10000000;
          font-weight: 800;
          display: flex;
          align-items: center;
          gap: 10px;
          animation: toastIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        @keyframes toastIn {
          from { transform: translateY(20px) scale(0.9); opacity: 0; }
          to { transform: translateY(0) scale(1); opacity: 1; }
        }
      `}</style>

      {/* Floating Copy Confirmation Toast */}
      {showToast && (
        <div className="siakad-toast">
          <i className="ph-bold ph-check-circle" style={{ fontSize: '1.2rem' }}></i>
          <span>{trans.success_copied}</span>
        </div>
      )}

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '120px 24px 80px', position: 'relative', zIndex: 2 }}>
        
        {/* Navigation Tabs for switching between Registration and Status Checks */}
        {step < 6 && (
          <div className="siakad-pmb-tab-wrapper" style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginBottom: '45px' }}>
            <button 
              onClick={() => { setActiveTab('register'); setStep(1); }} 
              className="siakad-pmb-tab-btn"
              style={{
                padding: '12px 28px',
                borderRadius: '50px',
                border: 'none',
                cursor: 'pointer',
                fontWeight: '800',
                fontSize: '0.95rem',
                background: activeTab === 'register' ? 'var(--gradient-red, linear-gradient(135deg, #B91C1C 0%, #E11D48 100%))' : 'var(--glass-bg)',
                color: activeTab === 'register' ? 'white' : 'var(--color-text)',
                border: activeTab === 'register' ? 'none' : 'var(--glass-border)',
                boxShadow: activeTab === 'register' ? '0 6px 16px rgba(185, 28, 28, 0.25)' : 'var(--glass-shadow)',
                transition: 'all 0.25s ease',
                display: 'inline-flex',
                alignItems: 'center'
              }}
            >
              <i className="ph-bold ph-note-pencil" style={{ marginRight: '8px' }}></i>
              {trans.reg_tab}
            </button>
            <button 
              onClick={() => { setActiveTab('status'); }} 
              className="siakad-pmb-tab-btn"
              style={{
                padding: '12px 28px',
                borderRadius: '50px',
                border: 'none',
                cursor: 'pointer',
                fontWeight: '800',
                fontSize: '0.95rem',
                background: activeTab === 'status' ? 'var(--gradient-red, linear-gradient(135deg, #B91C1C 0%, #E11D48 100%))' : 'var(--glass-bg)',
                color: activeTab === 'status' ? 'white' : 'var(--color-text)',
                border: activeTab === 'status' ? 'none' : 'var(--glass-border)',
                boxShadow: activeTab === 'status' ? '0 6px 16px rgba(185, 28, 28, 0.25)' : 'var(--glass-shadow)',
                transition: 'all 0.25s ease',
                display: 'inline-flex',
                alignItems: 'center'
              }}
            >
              <i className="ph-bold ph-sparkle" style={{ marginRight: '8px' }}></i>
              {trans.check_tab}
            </button>
          </div>
        )}

        {/* MODE 1: REGISTRATION WIZARD */}
        {activeTab === 'register' && (
          <>
            {/* Progress Tracker with Premium Styling */}
            {step <= 5 && (
              <div className="pmb-step-outer">
                <div className="pmb-step-wrapper">
                  {stepLabels.map((s, i) => (
                    <div key={s.num} className={`pmb-step-item ${step === s.num ? 'active-step' : s.num === step + 1 ? 'next-step' : ''}`}>
                      <div className="pmb-step-pill" style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '8px', 
                        padding: '8px 16px', 
                        borderRadius: '50px', 
                        background: step === s.num ? 'var(--gradient-red, linear-gradient(135deg, #B91C1C 0%, #E11D48 100%))' : step > s.num ? 'rgba(34, 197, 94, 0.08)' : 'var(--glass-bg)',
                        border: step === s.num ? 'none' : 'var(--glass-border)',
                        boxShadow: step === s.num ? '0 4px 12px rgba(185, 28, 28, 0.25)' : step > s.num ? 'inset 2px 2px 4px var(--inset-shadow-dark), inset -2px -2px 4px var(--inset-shadow-light)' : 'var(--glass-shadow)'
                      }}>
                        <i className={s.icon} style={{ fontSize: '1rem', color: step === s.num ? 'white' : step > s.num ? '#15803d' : 'var(--color-muted)' }}></i>
                        <span style={{ fontSize: '0.85rem', fontWeight: '800', color: step === s.num ? 'white' : step > s.num ? '#15803d' : 'var(--color-text)' }}>{s.label}</span>
                      </div>
                      {i < stepLabels.length - 1 && <span className="pmb-step-divider" style={{ color: 'var(--color-muted)', fontWeight: '300', marginLeft: '8px' }}>→</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {message.text && (
              <div className="pmb-alert-error" style={{ padding: '16px 20px', borderRadius: '20px', marginBottom: '30px', background: 'var(--glass-bg)', border: 'var(--glass-border)', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.95rem', fontWeight: '600', boxShadow: 'var(--glass-shadow)' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(239,68,68,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: 'inset 2px 2px 4px var(--inset-shadow-dark), inset -2px -2px 4px var(--inset-shadow-light)' }}>
                  <i className="ph-bold ph-warning-circle" style={{ fontSize: '1.2rem' }}></i>
                </div>
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
                    <i className="ph ph-spinner ph-spin" style={{ fontSize: '2.5rem', color: 'var(--umiba-red)', marginBottom: '16px' }}></i>
                    <p style={{ color: 'var(--color-muted)', fontSize: '0.95rem' }}>{trans.loading}</p>
                  </div>
                ) : periods.length === 0 ? (
                  <div style={{ ...cardStyle, textAlign: 'center', padding: '60px 40px' }}>
                    <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'var(--glass-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', boxShadow: 'inset 4px 4px 8px var(--inset-shadow-dark), inset -4px -4px 8px var(--inset-shadow-light)' }}>
                      <i className="ph-duotone ph-calendar-blank" style={{ fontSize: '2.5rem', color: 'var(--color-muted)', opacity: 0.6 }}></i>
                    </div>
                    <h3 style={{ fontSize: '1.4rem', color: 'var(--color-text)', margin: '0 0 8px 0', fontWeight: '800' }}>{trans.empty_wave}</h3>
                    <p style={{ color: 'var(--color-muted)', margin: 0, fontSize: '0.95rem' }}>{trans.empty_wave_desc}</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', justifyContent: periods.length === 1 ? 'center' : 'flex-start', flexWrap: 'wrap', gap: '24px', width: '100%', boxSizing: 'border-box' }}>
                    {periods.map(p => (
                      <div key={p.id} onClick={() => { setSelectedPeriod(p); setStep(2); }} className="pmb-card-period" style={{ 
                        ...cardStyle, 
                        maxWidth: '360px',
                        cursor: 'pointer', 
                        background: 'var(--glass-bg)',
                        border: 'var(--glass-border)',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                          <div style={{ width: '48px', height: '48px', background: 'var(--glass-bg)', color: 'var(--umiba-red)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', boxShadow: 'inset 3px 3px 6px var(--inset-shadow-dark), inset -3px -3px 6px var(--inset-shadow-light)' }}>
                            <i className="ph-duotone ph-calendar"></i>
                          </div>
                          <div>
                            <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: '800', color: 'var(--color-text)' }}>{p.name}</h3>
                            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-muted)', marginTop: '2px' }}>Tahun Akademik {p.academic_year}</p>
                          </div>
                        </div>
                        <div style={{ borderTop: 'var(--glass-border)', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem', color: 'var(--color-muted)' }}>
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
              <div className="siakad-pmb-card" style={cardStyle}>
                <div style={{ borderBottom: 'var(--glass-border)', paddingBottom: '20px', marginBottom: '30px' }}>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--color-text)', margin: '0 0 6px 0' }}>{trans.form_title}</h2>
                  <p style={{ color: 'var(--color-muted)', fontSize: '0.9rem', margin: 0 }}>{trans.form_desc}</p>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
                  <div>
                    <label style={labelStyle}>{trans.label_name} <span style={{ color: '#ef4444' }}>*</span></label>
                    <input type="text" value={biodata.name} onChange={e => setBiodata({ ...biodata, name: e.target.value })} placeholder={trans.placeholder_name} style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>{trans.label_email} <span style={{ color: '#ef4444' }}>*</span></label>
                    <input type="email" value={biodata.email} onChange={e => setBiodata({ ...biodata, email: e.target.value })} placeholder={trans.placeholder_email} style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>{trans.label_phone} <span style={{ color: '#ef4444' }}>*</span></label>
                    <input type="tel" value={biodata.phone} onChange={e => setBiodata({ ...biodata, phone: e.target.value })} placeholder={trans.placeholder_phone} style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>{trans.label_gender} <span style={{ color: '#ef4444' }}>*</span></label>
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
                    <label style={labelStyle}>{trans.label_pob} <span style={{ color: '#ef4444' }}>*</span></label>
                    <input type="text" value={biodata.birth_place} onChange={e => setBiodata({ ...biodata, birth_place: e.target.value })} placeholder={trans.placeholder_pob} style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>{trans.label_dob} <span style={{ color: '#ef4444' }}>*</span></label>
                    <input type="date" value={biodata.birth_date} onChange={e => setBiodata({ ...biodata, birth_date: e.target.value })} style={{ ...inputStyle, cursor: 'pointer' }} />
                  </div>
                  <div>
                    <label style={labelStyle}>{trans.label_school} <span style={{ color: '#ef4444' }}>*</span></label>
                    <input type="text" value={biodata.school_origin} onChange={e => setBiodata({ ...biodata, school_origin: e.target.value })} placeholder={trans.placeholder_school} style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>{trans.label_prodi} <span style={{ color: '#ef4444' }}>*</span></label>
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
                  <label style={labelStyle}>{trans.label_address} <span style={{ color: '#ef4444' }}>*</span></label>
                  <textarea value={biodata.address} onChange={e => setBiodata({ ...biodata, address: e.target.value })} placeholder={trans.placeholder_address} rows={4} style={{ ...inputStyle, borderRadius: '16px', resize: 'vertical' }} />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '40px', gap: '16px' }}>
                  <button onClick={() => setStep(1)} style={{ padding: '12px 24px', borderRadius: '50px', border: 'var(--glass-border)', background: 'var(--glass-bg)', color: 'var(--color-text)', cursor: 'pointer', fontWeight: '700', boxShadow: 'var(--glass-shadow)' }}>{trans.btn_back}</button>
                  <button onClick={() => validateBiodata() && setStep(3)} style={btnPrimary}>{trans.btn_continue} <i className="ph-bold ph-arrow-right"></i></button>
                </div>
              </div>
            )}

            {/* Step 3: File Uploads */}
            {step === 3 && (
              <div className="siakad-pmb-card" style={cardStyle}>
                <div style={{ borderBottom: 'var(--glass-border)', paddingBottom: '20px', marginBottom: '30px' }}>
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
                          <label style={{ ...labelStyle, marginBottom: 0 }}>{label} <span style={{ color: '#ef4444' }}>*</span></label>
                        </div>
                        <div style={{ position: 'relative', border: '2px dashed var(--color-border)', borderRadius: '24px', padding: '24px 16px', textAlign: 'center', background: 'var(--liquid-bg)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', transition: 'all 0.2s', cursor: 'pointer', boxShadow: 'inset 4px 4px 8px var(--inset-shadow-dark), inset -4px -4px 8px var(--inset-shadow-light)' }} onMouseOver={e=>e.currentTarget.style.borderColor='var(--umiba-red)'} onMouseOut={e=>e.currentTarget.style.borderColor='var(--color-border)'}>
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
                  <button onClick={() => setStep(2)} style={{ padding: '12px 24px', borderRadius: '50px', border: 'var(--glass-border)', background: 'var(--glass-bg)', color: 'var(--color-text)', cursor: 'pointer', fontWeight: '700', boxShadow: 'var(--glass-shadow)' }}>{trans.btn_back}</button>
                  <button onClick={() => setStep(4)} style={btnPrimary}>{trans.btn_continue} <i className="ph-bold ph-arrow-right"></i></button>
                </div>
              </div>
            )}

            {/* Step 4: Pembayaran */}
            {step === 4 && (
              <div className="siakad-pmb-card" style={cardStyle}>
                <div style={{ borderBottom: 'var(--glass-border)', paddingBottom: '20px', marginBottom: '30px' }}>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--color-text)', margin: '0 0 6px 0' }}>{trans.pay_title}</h2>
                  <p style={{ color: 'var(--color-muted)', fontSize: '0.9rem', margin: 0 }}>{trans.pay_desc}</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px', marginBottom: '32px' }}>
                  <div style={{ background: 'var(--glass-bg)', padding: '24px', borderRadius: '24px', border: 'var(--glass-border)', display: 'flex', flexDirection: 'column', gap: '16px', boxShadow: 'var(--glass-shadow)' }}>
                    <div>
                      <span style={labelStyle}>{trans.pay_cost}</span>
                      <strong style={{ fontSize: '1.8rem', color: '#10b981', fontWeight: '900' }}>Rp 250.000</strong>
                    </div>
                    <div>
                      <span style={labelStyle}>{trans.pay_status}</span>
                      <span className="pmb-badge-pending">
                        <i className="ph ph-clock"></i> {trans.pay_pending}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                      <label style={labelStyle}>{trans.pay_method}</label>
                      <CustomSelect
                        value={paymentMethod}
                        onChange={val => setPaymentMethod(val)}
                        placeholder="Pilih bank VA"
                        options={[
                          { value: 'VA Mandiri', label: 'Mandiri Virtual Account' },
                          { value: 'VA BNI', label: 'BNI Virtual Account' },
                          { value: 'VA BRI', label: 'BRI Virtual Account' },
                          { value: 'QRIS', label: 'QRIS UMIBA Pay' }
                        ]}
                      />
                    </div>

                    <div style={{ background: 'rgba(185, 28, 28, 0.06)', border: '1px solid rgba(185, 28, 28, 0.15)', padding: '16px 20px', borderRadius: '20px', fontSize: '0.9rem' }}>
                      <span style={{ display: 'block', color: 'var(--color-muted)', fontSize: '0.8rem', fontWeight: '700' }}>Nomor Rekening VA / Kode Bayar:</span>
                      <strong style={{ fontSize: '1.2rem', color: 'var(--color-text)', letterSpacing: '1px', display: 'block', margin: '4px 0' }}>
                        {paymentMethod === 'VA Mandiri' ? '8801202611982736' : paymentMethod === 'VA BNI' ? '9880120263445522' : paymentMethod === 'VA BRI' ? '1288012026778811' : 'QRIS_CODE_ACTIVE'}
                      </strong>
                      <span style={{ fontSize: '0.78rem', color: 'var(--color-muted)' }}>Silakan bayar via m-banking atau e-wallet sebelum melanjutkan review berkas.</span>
                    </div>
                  </div>
                </div>

                <div style={{ borderTop: 'var(--glass-border)', paddingTop: '24px' }}>
                  <label style={labelStyle}>{trans.pay_upload} <span style={{ color: '#ef4444' }}>*</span></label>
                  <div style={{ position: 'relative', border: '2px dashed var(--color-border)', borderRadius: '24px', padding: '24px', textAlign: 'center', background: 'var(--liquid-bg)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', cursor: 'pointer', boxShadow: 'inset 4px 4px 8px var(--inset-shadow-dark), inset -4px -4px 8px var(--inset-shadow-light)' }} onMouseOver={e=>e.currentTarget.style.borderColor='var(--umiba-red)'} onMouseOut={e=>e.currentTarget.style.borderColor='var(--color-border)'}>
                    <input type="file" onChange={(e) => handleFileChange('bukti_bayar', e)} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }} />
                    <i className="ph-duotone ph-receipt" style={{ fontSize: '2.5rem', color: fileNames.bukti_bayar ? '#10b981' : 'var(--color-muted)' }} />
                    <span style={{ fontSize: '0.85rem', color: fileNames.bukti_bayar ? 'var(--color-text)' : 'var(--color-muted)', fontWeight: '700' }}>
                      {fileNames.bukti_bayar || 'Pilih/Unggah Bukti Struk Transfer Pembayaran'}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '40px', gap: '16px' }}>
                  <button onClick={() => setStep(3)} style={{ padding: '12px 24px', borderRadius: '50px', border: 'var(--glass-border)', background: 'var(--glass-bg)', color: 'var(--color-text)', cursor: 'pointer', fontWeight: '700', boxShadow: 'var(--glass-shadow)' }}>{trans.btn_back}</button>
                  <button onClick={() => files.bukti_bayar ? setStep(5) : setMessage({ text: 'Mohon unggah bukti bayar terlebih dahulu.', type: 'error' })} style={btnPrimary}>{trans.btn_continue} <i className="ph-bold ph-arrow-right"></i></button>
                </div>
              </div>
            )}

            {/* Step 5: Review and Submit */}
            {step === 5 && (
              <div className="siakad-pmb-card" style={cardStyle}>
                <div style={{ borderBottom: 'var(--glass-border)', paddingBottom: '20px', marginBottom: '30px' }}>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--color-text)', margin: '0 0 6px 0' }}>{trans.review_title}</h2>
                  <p style={{ color: 'var(--color-muted)', fontSize: '0.9rem', margin: 0 }}>{trans.review_desc}</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '32px' }}>
                  <div style={{ background: 'var(--glass-bg)', padding: '24px', borderRadius: '24px', border: 'var(--glass-border)', boxShadow: 'var(--glass-shadow)' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}><i className="ph-duotone ph-identification-card" style={{ color: 'var(--umiba-red)' }}></i> {trans.review_personal}</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem' }}>
                      <div><span style={{ color: 'var(--color-muted)' }}>Name:</span> <strong style={{ color: 'var(--color-text)' }}>{biodata.name}</strong></div>
                      <div><span style={{ color: 'var(--color-muted)' }}>Email:</span> <strong style={{ color: 'var(--color-text)' }}>{biodata.email}</strong></div>
                      <div><span style={{ color: 'var(--color-muted)' }}>Nomor HP:</span> <strong style={{ color: 'var(--color-text)' }}>{biodata.phone}</strong></div>
                      <div><span style={{ color: 'var(--color-muted)' }}>Lahir:</span> <strong style={{ color: 'var(--color-text)' }}>{biodata.birth_place}, {biodata.birth_date ? new Date(biodata.birth_date).toLocaleDateString('id-ID') : '-'}</strong></div>
                      <div><span style={{ color: 'var(--color-muted)' }}>Gender:</span> <strong style={{ color: 'var(--color-text)' }}>{biodata.gender === 'L' ? trans.gender_l : trans.gender_p}</strong></div>
                    </div>
                  </div>

                  <div style={{ background: 'var(--glass-bg)', padding: '24px', borderRadius: '24px', border: 'var(--glass-border)', boxShadow: 'var(--glass-shadow)' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}><i className="ph-duotone ph-graduation-cap" style={{ color: '#8b5cf6' }}></i> {trans.review_academic}</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem' }}>
                      <div><span style={{ color: 'var(--color-muted)' }}>Gelombang:</span> <strong style={{ color: 'var(--color-text)' }}>{selectedPeriod?.name}</strong></div>
                      <div><span style={{ color: 'var(--color-muted)' }}>Pilihan Prodi:</span> <strong style={{ color: 'var(--color-text)' }}>{biodata.program_choice}</strong></div>
                      <div><span style={{ color: 'var(--color-muted)' }}>Asal Sekolah:</span> <strong style={{ color: 'var(--color-text)' }}>{biodata.school_origin}</strong></div>
                    </div>
                  </div>
                </div>

                <div style={{ background: 'var(--glass-bg)', padding: '24px', borderRadius: '24px', border: 'var(--glass-border)', marginBottom: '32px', boxSizing: 'border-box', width: '100%', overflow: 'hidden', boxShadow: 'var(--glass-shadow)' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}><i className="ph-duotone ph-file-arrow-up" style={{ color: '#10b981' }}></i> {trans.review_docs}</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%', boxSizing: 'border-box' }}>
                    {['ijazah', 'foto', 'ktp', 'bukti_bayar'].map(key => (
                      <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--liquid-bg)', padding: '10px 16px', borderRadius: '50px', border: 'var(--glass-border)', fontSize: '0.85rem', boxSizing: 'border-box', width: '100%', overflow: 'hidden', boxShadow: 'inset 2px 2px 4px var(--inset-shadow-dark), inset -2px -2px 4px var(--inset-shadow-light)' }}>
                        <i className="ph ph-check-circle" style={{ color: fileNames[key] ? '#10b981' : 'var(--color-muted)', flexShrink: 0 }}></i>
                        <span style={{ color: 'var(--color-text)', fontWeight: '700', flexShrink: 0 }}>{key.toUpperCase()}:</span>
                        <span style={{ color: fileNames[key] ? 'var(--color-text)' : 'var(--color-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1, textAlign: 'left' }}>{fileNames[key] || 'Belum diupload'}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px' }}>
                  <button onClick={() => setStep(4)} style={{ padding: '12px 24px', borderRadius: '50px', border: 'var(--glass-border)', background: 'var(--glass-bg)', color: 'var(--color-text)', cursor: 'pointer', fontWeight: '700', boxShadow: 'var(--glass-shadow)' }}>{trans.btn_back}</button>
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

            {/* Step 6: Success Output */}
            {step === 6 && (
              <div className="siakad-pmb-card" style={{ ...cardStyle, textAlign: 'center', padding: '60px 40px' }}>
                <div style={{ width: '80px', height: '80px', background: 'var(--glass-bg)', color: '#10b981', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', margin: '0 auto 24px', boxShadow: 'inset 4px 4px 8px var(--inset-shadow-dark), inset -4px -4px 8px var(--inset-shadow-light)' }}>
                  <i className="ph ph-check"></i>
                </div>
                
                <h1 style={{ fontSize: '2.2rem', fontWeight: '900', color: 'var(--color-text)', margin: '0 0 10px 0' }}>{trans.success_title}</h1>
                <p style={{ color: 'var(--color-muted)', fontSize: '1.05rem', margin: '0 auto 40px', maxWidth: '600px' }}>
                  {trans.success_desc}
                </p>

                <div style={{ background: 'var(--glass-bg)', border: 'var(--glass-border)', padding: '24px 32px', borderRadius: '24px', display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: '12px', width: 'fit-content', maxWidth: '100%', boxSizing: 'border-box', margin: '0 auto 40px', boxShadow: 'var(--glass-shadow)' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-muted)', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '1px' }}>{trans.success_reg}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <strong style={{ fontSize: '1.8rem', color: 'var(--color-text)', letterSpacing: '2px', fontWeight: '900' }}>{registrationNumber}</strong>
                    <button onClick={copyToClipboard} style={{ background: 'transparent', border: 'none', color: copied ? '#10b981' : 'var(--color-text)', cursor: 'pointer', fontSize: '1.3rem', display: 'flex', padding: '6px', borderRadius: '50%', transition: 'all 0.15s' }}>
                      <i className={copied ? "ph ph-check-circle" : "ph ph-copy"}></i>
                    </button>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '400px', margin: '0 auto' }}>
                  <button 
                    onClick={() => { setActiveTab('status'); setSearchRegNum(registrationNumber); }} 
                    style={{ ...btnPrimary, justifyContent: 'center' }}
                  >
                    Pantau Hasil Kelulusan & Jadwal Tes <i className="ph-bold ph-sparkle"></i>
                  </button>
                  <button 
                    onClick={() => { setStep(1); setBiodata({ name: '', email: '', phone: '', gender: '', birth_date: '', birth_place: '', address: '', school_origin: '', program_choice: '' }); setFiles({ ijazah: null, foto: null, ktp: null, bukti_bayar: null }); setFileNames({ ijazah: '', foto: '', ktp: '', bukti_bayar: '' }); }} 
                    style={{ padding: '12px 24px', borderRadius: '50px', border: 'var(--glass-border)', background: 'var(--glass-bg)', color: 'var(--color-text)', cursor: 'pointer', fontWeight: '700', boxShadow: 'var(--glass-shadow)' }}
                  >
                    {trans.btn_new_reg}
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* MODE 2: STATUS CHECK & TIMELINE SELECTION */}
        {activeTab === 'status' && (
          <div className="siakad-pmb-card" style={cardStyle}>
            <div style={{ borderBottom: 'var(--glass-border)', paddingBottom: '20px', marginBottom: '30px', textAlign: 'center' }}>
              <h2 style={{ fontSize: '1.6rem', fontWeight: '900', color: 'var(--color-text)', margin: '0 0 6px 0' }}>{trans.check_title}</h2>
              <p style={{ color: 'var(--color-muted)', fontSize: '0.92rem', margin: 0 }}>{trans.check_desc}</p>
            </div>

            <form onSubmit={handleCheckStatus} style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginBottom: '40px', justifyContent: 'center', alignItems: 'center' }}>
              <div style={{ flex: '1', minWidth: '240px' }}>
                <input 
                  type="text" 
                  value={searchRegNum} 
                  onChange={e => setSearchRegNum(e.target.value.toUpperCase())} 
                  placeholder="Masukkan Nomor Registrasi (contoh: PMB-178...)" 
                  style={inputStyle}
                  required 
                />
              </div>
              <button type="submit" disabled={checkLoading} style={btnPrimary}>
                {checkLoading ? (
                  <>
                    <i className="ph ph-spinner ph-spin"></i> Loading...
                  </>
                ) : (
                  <>
                    {trans.btn_check} <i className="ph-bold ph-magnifying-glass"></i>
                  </>
                )}
              </button>
            </form>

            {message.text && message.type === 'error' && (
              <div className="pmb-alert-error" style={{ padding: '16px 20px', borderRadius: '20px', marginBottom: '30px', background: 'var(--glass-bg)', border: 'var(--glass-border)', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.95rem', fontWeight: '600', boxShadow: 'var(--glass-shadow)' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(239,68,68,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: 'inset 2px 2px 4px var(--inset-shadow-dark), inset -2px -2px 4px var(--inset-shadow-light)' }}>
                  <i className="ph-bold ph-warning-circle" style={{ fontSize: '1.2rem' }}></i>
                </div>
                <span>{message.text}</span>
              </div>
            )}

            {/* Render Status Timeline Detail */}
            {statusResult && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                
                {/* 1. Header Ringkasan */}
                <div style={{ background: 'var(--glass-bg)', padding: '24px', borderRadius: '24px', border: 'var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', boxShadow: 'var(--glass-shadow)' }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '800' }}>{statusResult.name}</h3>
                    <p style={{ margin: '4px 0 0 0', fontSize: '0.88rem', color: 'var(--color-muted)' }}>Prodi Pilihan: {statusResult.program_choice}</p>
                  </div>
                  <div>
                    <span style={{ 
                      background: statusResult.status === 'accepted' ? 'rgba(16, 185, 129, 0.15)' : statusResult.status === 'rejected' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(185, 28, 28, 0.12)', 
                      color: statusResult.status === 'accepted' ? '#10b981' : statusResult.status === 'rejected' ? '#ef4444' : 'var(--umiba-red)', 
                      padding: '8px 20px', 
                      borderRadius: '50px', 
                      fontSize: '0.9rem', 
                      fontWeight: '800' 
                    }}>
                      {statusResult.status === 'accepted' ? trans.status_passed : statusResult.status === 'rejected' ? trans.status_failed : trans.status_processing}
                    </span>
                  </div>
                </div>

                {/* 2. Wizard Timeline Progress */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', position: 'relative', paddingLeft: '40px' }}>
                  {/* Vertical Line Connector */}
                  <div style={{ position: 'absolute', left: '16px', top: '24px', bottom: '24px', width: '3px', borderRadius: '2px', background: 'var(--glass-bg)', boxShadow: 'inset 1px 1px 2px var(--inset-shadow-dark), inset -1px -1px 2px var(--inset-shadow-light)' }}></div>

                  {/* Stage 1: Pendaftaran Terkirim */}
                  <div style={{ position: 'relative' }}>
                    <div style={{ position: 'absolute', left: '-32px', top: '2px', width: '24px', height: '24px', borderRadius: '50%', background: 'var(--glass-bg)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', border: '2px solid #10b981', boxShadow: 'var(--glass-shadow)' }}>
                      <i className="ph ph-check"></i>
                    </div>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '0.98rem', fontWeight: '800' }}>Pendaftaran Terkirim</h4>
                      <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: 'var(--color-muted)' }}>Formulir biodata calon mahasiswa berhasil masuk ke database PMB online.</p>
                    </div>
                  </div>

                  {/* Stage 2: Verifikasi Pembayaran */}
                  <div style={{ position: 'relative' }}>
                    <div style={{ position: 'absolute', left: '-32px', top: '2px', width: '24px', height: '24px', borderRadius: '50%', background: 'var(--glass-bg)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', border: '2px solid #10b981', boxShadow: 'var(--glass-shadow)' }}>
                      <i className="ph ph-check"></i>
                    </div>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '0.98rem', fontWeight: '800' }}>{trans.pay_status}</h4>
                      <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: 'var(--color-muted)' }}>Status biaya pendaftaran: <strong>{trans.pay_paid}</strong>.</p>
                    </div>
                  </div>

                  {/* Stage 3: Jadwal Ujian Seleksi */}
                  <div style={{ position: 'relative' }}>
                    <div style={{ 
                      position: 'absolute', 
                      left: '-32px', 
                      top: '2px', 
                      width: '24px', 
                      height: '24px', 
                      borderRadius: '50%', 
                      background: 'var(--glass-bg)', 
                      color: statusResult.status !== 'pending' ? '#10b981' : 'var(--umiba-red)', 
                      border: `2px solid ${statusResult.status !== 'pending' ? '#10b981' : 'var(--umiba-red)'}`,
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      fontSize: '0.75rem',
                      boxShadow: 'var(--glass-shadow)'
                    }}>
                      <i className="ph ph-sparkle"></i>
                    </div>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '0.98rem', fontWeight: '800' }}>{trans.test_title}</h4>
                      <div style={{ background: 'var(--glass-bg)', padding: '16px', borderRadius: '16px', marginTop: '10px', border: 'var(--glass-border)', display: 'inline-flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem', boxShadow: 'var(--glass-shadow)' }}>
                        <div><span style={{ color: 'var(--color-muted)' }}>{trans.test_date}:</span> <strong>17 Agustus 2026, 09:00 - 11:30 WIB</strong></div>
                        <div><span style={{ color: 'var(--color-muted)' }}>{trans.test_link}:</span> <a href="https://cbt.umiba.ac.id/pmb-test" target="_blank" style={{ color: 'var(--umiba-red)', fontWeight: '700' }}>cbt.umiba.ac.id/pmb-test</a></div>
                      </div>
                    </div>
                  </div>

                  {/* Stage 4: Hasil Kelulusan */}
                  <div style={{ position: 'relative' }}>
                    <div style={{ 
                      position: 'absolute', 
                      left: '-32px', 
                      top: '2px', 
                      width: '24px', 
                      height: '24px', 
                      borderRadius: '50%', 
                      background: 'var(--glass-bg)', 
                      color: statusResult.status === 'accepted' ? '#10b981' : statusResult.status === 'rejected' ? '#ef4444' : 'var(--color-muted)', 
                      border: `2px solid ${statusResult.status === 'accepted' ? '#10b981' : statusResult.status === 'rejected' ? '#ef4444' : 'var(--color-border)'}`,
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      fontSize: '0.75rem',
                      boxShadow: 'var(--glass-shadow)'
                    }}>
                      <i className="ph ph-flag"></i>
                    </div>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '0.98rem', fontWeight: '800' }}>Keputusan Akhir Kelulusan</h4>
                      <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: 'var(--color-muted)' }}>
                        {statusResult.status === 'accepted' 
                          ? "Selamat! Anda dinyatakan LULUS seleksi sebagai mahasiswa baru Universitas Mitra Bangsa. Silakan klik tombol di bawah untuk mengunduh Surat Keputusan Kelulusan resmi."
                          : statusResult.status === 'rejected' 
                            ? "Mohon maaf, Anda dinyatakan belum lulus seleksi gelombang ini."
                            : "Ujian seleksi sedang dinilai oleh panitia PMB. Harap cek halaman ini secara berkala."}
                      </p>
                      {statusResult.status === 'accepted' && (
                        <button 
                          onClick={() => window.open('https://pmb.umiba.ac.id/sk-kelulusan.pdf', '_blank')} 
                          style={{ ...btnPrimary, marginTop: '16px', padding: '10px 24px', fontSize: '0.9rem' }}
                        >
                          <i className="ph-bold ph-download-simple"></i> Download SK Kelulusan
                        </button>
                      )}
                    </div>
                  </div>

                </div>

              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}
