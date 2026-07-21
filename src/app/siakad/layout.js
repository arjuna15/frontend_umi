'use client';
import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { ToastContainer, ConfirmModal, PromptModal, FormModal } from './components/Toast';
import { getTranslation } from './components/i18n';
import './siakad.css';

export default function SiakadLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [hydrated, setHydrated] = useState(false);
  const [session, setSession] = useState({ role: null, portalRole: null });
  const [user, setUser] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const [showMobileNotifs, setShowMobileNotifs] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [menuSearch, setMenuSearch] = useState('');
  const [lang, setLang] = useState('id');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLang = localStorage.getItem('siakad_lang');
      if (savedLang) setLang(savedLang);
    }
  }, []);

  const changeLanguage = (newLang) => {
    setLang(newLang);
    localStorage.setItem('siakad_lang', newLang);
    window.location.reload();
  };

  const role = session.role;
  const portalRole = session.portalRole;
  const effectiveRole = role === 'kaprodi' ? (portalRole || 'kaprodi') : role;

  const redirectToDashboard = (userRole) => {
    if (userRole === 'mahasiswa') router.push('/siakad/mahasiswa');
    else if (userRole === 'dosen') router.push('/siakad/dosen');
    else if (userRole === 'kaprodi') router.push('/siakad/kaprodi');
    else if (userRole === 'admin' || userRole === 'superadmin') router.push('/siakad/admin');
  };

  useEffect(() => {
    setHydrated(true);
    setSession({
      role: localStorage.getItem('siakad_role'),
      portalRole: localStorage.getItem('siakad_portal'),
    });
    try {
      const userStr = localStorage.getItem('siakad_user');
      if (userStr) {
        setUser(JSON.parse(userStr));
      }
    } catch (e) {
      console.error(e);
    }
  }, [pathname]);

  // Premium Spotlight Hover Tracker
  useEffect(() => {
    const handleMouseMove = (e) => {
      const cards = document.querySelectorAll('.siakad-card');
      cards.forEach((card) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [pathname]);

  // Central Routing Guard & Authorization Protection
  useEffect(() => {
    if (!hydrated) return;

    const token = localStorage.getItem('siakad_token');
    const isLoginPage = pathname === '/siakad/login';

    if (!token) {
      if (!isLoginPage) {
        router.push('/siakad/login');
      }
      return;
    }

    if (isLoginPage && effectiveRole) {
      redirectToDashboard(effectiveRole);
      return;
    }

    if (pathname === '/siakad' && effectiveRole) {
      redirectToDashboard(effectiveRole);
      return;
    }

    if (effectiveRole) {
      if (pathname.startsWith('/siakad/mahasiswa') && effectiveRole !== 'mahasiswa') {
        redirectToDashboard(effectiveRole);
      } else if (pathname.startsWith('/siakad/dosen') && effectiveRole !== 'dosen') {
        redirectToDashboard(effectiveRole);
      } else if (pathname.startsWith('/siakad/kaprodi') && effectiveRole !== 'kaprodi') {
        redirectToDashboard(effectiveRole);
      } else if (pathname.startsWith('/siakad/admin') && !['admin', 'superadmin'].includes(effectiveRole)) {
        redirectToDashboard(effectiveRole);
      }
    }
  }, [pathname, hydrated, effectiveRole, router]);

  useEffect(() => {
    const loadNotifications = async () => {
      const token = localStorage.getItem('siakad_token');
      if (!token || !effectiveRole) {
        setNotifications([]);
        return;
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
      const headers = {
        Authorization: `Bearer ${token}`,
        ...(portalRole || role ? { 'X-SIAKAD-PORTAL': portalRole || role } : {})
      };

      try {
        if (effectiveRole === 'mahasiswa') {
          const [dashRes, extRes] = await Promise.all([
            fetch(`${apiUrl}/siakad/dashboard`, { headers }),
            fetch(`${apiUrl}/siakad/mahasiswa/dashboard`, { headers }),
          ]);
          if (!dashRes.ok) throw new Error('Failed to load mahasiswa dashboard');
          const dash = await dashRes.json();
          const ext = extRes.ok ? await extRes.json() : {};
          const krsItems = Array.isArray(dash.krs) ? dash.krs : [];
          const scheduleItems = Array.isArray(ext.schedule_today) ? ext.schedule_today : [];
          const deadlineItems = Array.isArray(ext.upcoming_deadlines) ? ext.upcoming_deadlines : [];
          setNotifications([
            ...(krsItems.filter((item) => item.status === 'pending').slice(0, 1).map((item) => ({
              title: 'KRS menunggu persetujuan',
              body: `${krsItems.length} mata kuliah sudah masuk daftar KHS/KRS kamu.`,
              time: 'Baru',
              path: '/siakad/mahasiswa/krs',
            })) || []),
            ...(deadlineItems.slice(0, 1).map((item) => ({
              title: item.title || 'Tenggat akademik',
              body: `${item.course || 'Mata kuliah'} H-${Math.ceil(item.due_in_days)}`,
              time: 'Jadwal akademik',
              path: '/siakad/mahasiswa/jadwal',
            })) || []),
            ...(scheduleItems.slice(0, 1).map((item) => ({
              title: 'Jadwal kuliah aktif',
              body: `${item.course || '-'} ${item.time || ''} ${item.room ? `di ${item.room}` : ''}`.trim(),
              time: 'Hari ini',
              path: '/siakad/mahasiswa/jadwal',
            })) || []),
          ].filter((item) => item.title));
        } else if (effectiveRole === 'dosen') {
          const res = await fetch(`${apiUrl}/siakad/dosen/dashboard`, { headers });
          if (!res.ok) throw new Error('Failed to load dosen dashboard');
          const dash = await res.json();
          setNotifications([
            ...(Array.isArray(dash.todos) ? dash.todos.slice(0, 3).map((todo) => {
              let targetPath = '/siakad/dosen';
              const text = todo.toLowerCase();
              if (text.includes('nilai') || text.includes('grade') || text.includes('gradebook')) {
                targetPath = '/siakad/dosen/gradebook';
              } else if (text.includes('bap')) {
                targetPath = '/siakad/dosen/bap';
              } else if (text.includes('tugas') || text.includes('quiz') || text.includes('kuis') || text.includes('learning')) {
                targetPath = '/siakad/dosen/elearning';
              } else if (text.includes('krs') || text.includes('persetujuan')) {
                targetPath = '/siakad/dosen/krs-approval';
              }
              return {
                title: 'Tugas dosen',
                body: todo,
                time: 'Dashboard dosen',
                path: targetPath,
              };
            }) : []),
            ...(Array.isArray(dash.schedule) ? dash.schedule.slice(0, 1).map((item) => ({
              title: 'Jadwal mengajar aktif',
              body: `${item.course || '-'} ${item.time || ''} ${item.room ? `di ${item.room}` : ''}`.trim(),
              time: 'Hari ini',
              path: '/siakad/dosen/jadwal',
            })) : []),
          ]);
        } else if (effectiveRole === 'kaprodi' || effectiveRole === 'admin' || effectiveRole === 'superadmin') {
          const res = await fetch(`${apiUrl}/siakad/dashboard`, { headers });
          if (!res.ok) throw new Error('Failed to load admin dashboard');
          const dash = await res.json();
          setNotifications([
            { title: 'Ringkasan pengguna', body: `${dash.users_count || 0} akun aktif terdata di sistem.`, time: 'Dashboard admin', path: '/siakad/admin/users' },
            { title: 'Data perkuliahan', body: `${Array.isArray(dash.courses) ? dash.courses.length : 0} mata kuliah tersedia.`, time: 'Dashboard admin', path: '/siakad/admin/courses' },
          ]);
        } else {
          setNotifications([]);
        }
      } catch (error) {
        setNotifications([]);
      }
    };

    loadNotifications();
  }, [role, portalRole, effectiveRole]);

  if (!hydrated) return null;

  const isLoginPage = pathname === '/siakad/login';
  if (isLoginPage) return <>{children}</>;

  let menuItems = [];
  if (effectiveRole === 'admin' || effectiveRole === 'superadmin') {
    menuItems = [
      { label: 'Admin Dashboard', icon: 'ph ph-chart-pie-slice', path: '/siakad/admin', isMobilePrimary: true },
      { label: 'Manajemen Pengguna', icon: 'ph ph-users-three', path: '/siakad/admin/users', isMobilePrimary: true },
      { label: 'Manajemen Prodi', icon: 'ph ph-buildings', path: '/siakad/admin/prodi' },
      { label: 'Manajemen Kelas', icon: 'ph ph-chalkboard', path: '/siakad/admin/classes', isMobilePrimary: true },
      { label: 'Manajemen Ruangan', icon: 'ph ph-door', path: '/siakad/admin/ruangan' },
      { label: 'Kalender Akademik', icon: 'ph ph-calendar', path: '/siakad/admin/calendar' },
      { label: 'Proctoring Ujian', icon: 'ph ph-laptop', path: '/siakad/admin/proctoring' },
      { label: 'Manajemen Keuangan', icon: 'ph ph-wallet', path: '/siakad/admin/keuangan', isMobilePrimary: true },
      { label: 'Manajemen Surat', icon: 'ph ph-envelope-simple', path: '/siakad/admin/surat', isMobilePrimary: true },
      { label: 'Chat Real-Time', icon: 'ph ph-chat-circle-dots', path: '/siakad/chat', isMobilePrimary: true },
      { label: 'SKPI Mahasiswa', icon: 'ph ph-certificate', path: '/siakad/admin/skpi' },
      { label: 'Yudisium & Wisuda', icon: 'ph ph-scroll', path: '/siakad/admin/wisuda' },
      { label: 'Litabmas Dosen', icon: 'ph ph-projector-screen', path: '/siakad/admin/litabmas' },
      { label: 'Penjaminan Mutu & IKU', icon: 'ph ph-shield-check', path: '/siakad/admin/qa' },
      { label: 'Program MBKM', icon: 'ph ph-graduation-cap', path: '/siakad/admin/mbkm' },
      { label: 'Tracer Study', icon: 'ph ph-chart-pie-slice', path: '/siakad/admin/tracer' },
      { label: 'PMB', icon: 'ph ph-user-plus', path: '/siakad/admin/pmb', isMobilePrimary: true },
      { label: 'Beasiswa & KIP Kuliah', icon: 'ph ph-medal', path: '/siakad/admin/beasiswa' },
      { label: 'Kepegawaian (HRD)', icon: 'ph ph-identification-card', path: '/siakad/admin/kepegawaian' },
      { label: 'Manajemen Kerjasama', icon: 'ph ph-handshake', path: '/siakad/admin/kerjasama' },
      { label: 'Manajemen RPL', icon: 'ph ph-user-switch', path: '/siakad/admin/rpl' },
      { label: 'Career Center (Admin)', icon: 'ph ph-briefcase', path: '/siakad/admin/career' },
      { label: 'CRM CAMABA', icon: 'ph ph-funnel', path: '/siakad/admin/crm' },
      { label: 'Manajemen PPG', icon: 'ph ph-chalkboard-teacher', path: '/siakad/admin/ppg' },
      { label: 'Integrasi sLimS', icon: 'ph ph-books', path: '/siakad/admin/perpustakaan' },
      { label: 'Log Aktivitas (Audit)', icon: 'ph ph-list-magnifying-glass', path: '/siakad/admin/logs' },
      { label: 'Integrasi PDDIKTI Feeder', icon: 'ph ph-swap', path: '/siakad/admin/feeder' },
      { label: 'Backup & Restore', icon: 'ph ph-database', path: '/siakad/admin/backup' },
      { label: 'Pengaturan Sistem', icon: 'ph ph-gear', path: '/siakad/admin/pengaturan' },
      { label: 'Pengaturan Profil', icon: 'ph ph-user-gear', path: '/siakad/profile' },
    ];
  } else if (effectiveRole === 'kaprodi') {
    menuItems = [
      { label: 'Dashboard Statistik', icon: 'ph ph-chart-line-up', path: '/siakad/kaprodi', isMobilePrimary: true },
      { label: 'Manajemen Kurikulum', icon: 'ph ph-books', path: '/siakad/kaprodi/kurikulum' },
      { label: 'Manajemen Dosen', icon: 'ph ph-users', path: '/siakad/kaprodi/dosen', isMobilePrimary: true },
      { label: 'Kalender Akademik', icon: 'ph ph-calendar', path: '/siakad/kaprodi/kalender' },
      { label: 'Persetujuan KRS', icon: 'ph ph-check-square-offset', path: '/siakad/kaprodi/krs', isMobilePrimary: true },
      { label: 'Monitoring Perkuliahan', icon: 'ph ph-chalkboard-teacher', path: '/siakad/kaprodi/monitoring' },
      { label: 'Plotting Dosen', icon: 'ph ph-users-three', path: '/siakad/kaprodi/plotting' },
      { label: 'Distribusi Nilai', icon: 'ph ph-student', path: '/siakad/kaprodi/students' },
      { label: 'Hasil EDOM', icon: 'ph ph-star-half', path: '/siakad/kaprodi/edom', isMobilePrimary: true },
      { label: 'Laporan Akreditasi', icon: 'ph ph-file-pdf', path: '/siakad/kaprodi/reports' },
      { label: 'Pengaturan Profil', icon: 'ph ph-user-gear', path: '/siakad/profile' },
    ];
  } else if (effectiveRole === 'dosen') {
    menuItems = [
      { label: 'Dashboard Dosen', icon: 'ph ph-chalkboard-teacher', path: '/siakad/dosen', isMobilePrimary: true },
      { label: 'Roster Kelas', icon: 'ph ph-users-three', path: '/siakad/dosen/roster' },
      { label: 'Jadwal Mengajar', icon: 'ph ph-calendar-plus', path: '/siakad/dosen/jadwal', isMobilePrimary: true },
      { label: 'Isi BAP', icon: 'ph ph-file-text', path: '/siakad/dosen/bap' },
      { label: 'Persetujuan KRS', icon: 'ph ph-check-square', path: '/siakad/dosen/krs-approval', isMobilePrimary: true },
      { label: 'Bimbingan Akademik', icon: 'ph ph-users', path: '/siakad/dosen/bimbingan' },
      { label: 'Litabmas (Penelitian)', icon: 'ph ph-projector-screen', path: '/siakad/dosen/litabmas' },
      { label: 'Chat Real-Time', icon: 'ph ph-chat-circle-dots', path: '/siakad/chat' },
      { label: 'E-Learning', icon: 'ph ph-books', path: '/siakad/dosen/elearning' },
      { label: 'Presensi Mahasiswa', icon: 'ph ph-calendar-check', path: '/siakad/dosen/presensi', isMobilePrimary: true },
      { label: 'Rekap Presensi', icon: 'ph ph-chart-bar', path: '/siakad/dosen/rekap-presensi' },
      { label: 'Gradebook & Nilai', icon: 'ph ph-exam', path: '/siakad/dosen/gradebook' },
      { label: 'Forum Diskusi', icon: 'ph ph-chats', path: '/siakad/dosen/forum' },
      { label: 'Pengaturan Profil', icon: 'ph ph-user-gear', path: '/siakad/profile' },
    ];
  } else {
    // Default Mahasiswa
    menuItems = [
      { label: 'Dashboard & Info', icon: 'ph ph-squares-four', path: '/siakad/mahasiswa', isMobilePrimary: true },
      { label: 'Jadwal & Kalender', icon: 'ph ph-calendar-blank', path: '/siakad/mahasiswa/jadwal', isMobilePrimary: true },
      { label: 'KRS Online', icon: 'ph ph-list-checks', path: '/siakad/mahasiswa/krs', isMobilePrimary: true },
      { label: 'Ruang Kelas & Kuis', icon: 'ph ph-laptop', path: '/siakad/mahasiswa/elearning', isMobilePrimary: true },
      { label: 'Chat Real-Time', icon: 'ph ph-chat-circle-dots', path: '/siakad/chat', isMobilePrimary: true },
      { label: 'SKPI & Prestasi', icon: 'ph ph-certificate', path: '/siakad/mahasiswa/skpi' },
      { label: 'Yudisium & Wisuda', icon: 'ph ph-scroll', path: '/siakad/mahasiswa/wisuda' },
      { label: 'Evaluasi Dosen (EDOM)', icon: 'ph ph-chart-bar', path: '/siakad/mahasiswa/edom' },
      { label: 'Program MBKM', icon: 'ph ph-graduation-cap', path: '/siakad/mahasiswa/mbkm' },
      { label: 'Proctoring Ujian', icon: 'ph ph-laptop', path: '/siakad/mahasiswa/proctoring' },
      { label: 'Presensi Mandiri', icon: 'ph ph-calendar-check', path: '/siakad/mahasiswa/presensi' },
      { label: 'Rapor & Transkrip', icon: 'ph ph-exam', path: '/siakad/mahasiswa/gradebook' },
      { label: 'Bimbingan Akademik', icon: 'ph ph-users', path: '/siakad/mahasiswa/bimbingan' },
      { label: 'Forum Diskusi', icon: 'ph ph-chats', path: '/siakad/mahasiswa/forum' },
      { label: 'Surat & Administrasi', icon: 'ph ph-envelope-simple', path: '/siakad/mahasiswa/surat' },
      { label: 'Keuangan', icon: 'ph ph-wallet', path: '/siakad/mahasiswa/keuangan' },
      { label: 'Alumni Career Portal', icon: 'ph ph-briefcase', path: '/siakad/alumni/career' },
      { label: 'Pengaturan Profil', icon: 'ph ph-user-gear', path: '/siakad/profile' },
    ];
  }

  // Translate labels dynamically
  menuItems = menuItems.map(item => {
    let key = '';
    const labelLower = item.label.toLowerCase();
    
    if (labelLower.includes('dash')) key = 'dashboard';
    else if (labelLower.includes('transkrip') || labelLower.includes('rapor') || labelLower.includes('gradebook')) key = 'gradebook';
    else if (labelLower.includes('krs') && !labelLower.includes('setuju')) key = 'krs';
    else if (labelLower.includes('persetujuan krs') || labelLower.includes('approve')) key = 'krs_approval';
    else if (labelLower.includes('rekap presensi') || labelLower.includes('rekapitulasi')) key = 'rekap_presensi';
    else if (labelLower.includes('presensi') || labelLower.includes('kehadiran')) key = 'presensi';
    else if (labelLower.includes('elearning') || labelLower.includes('kuis') || labelLower.includes('elearning')) key = 'elearning';
    else if (labelLower.includes('proctoring') || labelLower.includes('ujian')) key = 'proctoring';
    else if (labelLower.includes('bimbingan')) key = 'bimbingan';
    else if (labelLower.includes('wisuda') || labelLower.includes('yudisium')) key = 'wisuda';
    else if (labelLower.includes('surat')) key = 'surat';
    else if (labelLower.includes('skpi') || labelLower.includes('prestasi')) key = 'skpi';
    else if (labelLower.includes('edom') || labelLower.includes('evaluasi')) key = 'edom';
    else if (labelLower.includes('keuangan') || labelLower.includes('tagihan')) key = 'keuangan';
    else if (labelLower.includes('chat') || labelLower.includes('diskusi')) key = 'chat';
    else if (labelLower.includes('career') || labelLower.includes('karir') || labelLower.includes('lowongan')) key = 'career';
    else if (labelLower.includes('profil')) key = 'profile';
    else if (labelLower.includes('litabmas')) key = 'litabmas';
    else if (labelLower.includes('kepegawaian') || labelLower.includes('hrd')) key = 'kepegawaian';
    else if (labelLower.includes('kerjasama') || labelLower.includes('mitra')) key = 'kerjasama';
    else if (labelLower.includes('rpl')) key = 'rpl';
    else if (labelLower.includes('crm') || labelLower.includes('camaba')) key = 'crm';
    else if (labelLower.includes('ppg')) key = 'ppg';
    else if (labelLower.includes('perpustakaan') || labelLower.includes('slims')) key = 'perpustakaan';
    else if (labelLower.includes('feeder') || labelLower.includes('pddikti')) key = 'feeder';
    else if (labelLower.includes('mutu') || labelLower.includes('qa')) key = 'qa';
    else if (labelLower.includes('backup')) key = 'backup';
    else if (labelLower.includes('audit') || labelLower.includes('log')) key = 'logs';
    else if (labelLower.includes('sistem') || labelLower.includes('pengaturan')) key = 'setting';

    if (key) {
      return { ...item, label: getTranslation(key, lang) };
    }
    return item;
  });

  return (
    <div className="siakad-container">
      <ToastContainer />
      <ConfirmModal />
      <PromptModal />
      <FormModal />
      {/* Animated Background Blobs */}
      <div className="siakad-bg-shapes">
        <div className="siakad-blob siakad-blob-1"></div>
        <div className="siakad-blob siakad-blob-2"></div>
        <div className="siakad-blob siakad-blob-3"></div>
      </div>

      {/* Floating Glass Sidebar */}
      <aside className="siakad-sidebar">
        <div className="siakad-sidebar-header">
          <div className="siakad-sidebar-logo">
            <img src="/icon.png" alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '800', margin: 0, letterSpacing: '1px', color: 'var(--color-text)', lineHeight: '1.2' }}>SIAKAD</h2>
            <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--color-muted)', fontWeight: '600' }}>Universitas Mitra Bangsa</p>
          </div>
        </div>

        <nav className="siakad-nav" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100% - 110px)' }}>
          {/* Real-time Menu Search */}
          <div style={{ padding: '0 20px', marginBottom: '14px', position: 'relative' }}>
            <i className="ph ph-magnifying-glass" style={{ position: 'absolute', left: '32px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-muted)', fontSize: '0.95rem', pointerEvents: 'none' }}></i>
            <input 
              type="text" 
              placeholder="Cari menu..." 
              value={menuSearch} 
              onChange={e => setMenuSearch(e.target.value)} 
              className="siakad-input"
              style={{ 
                width: '100%', 
                padding: '9px 12px 9px 38px', 
                fontSize: '0.82rem',
                height: '36px',
                borderRadius: '50px'
              }} 
            />
            {menuSearch && (
              <i 
                className="ph ph-x" 
                onClick={() => setMenuSearch('')} 
                style={{ position: 'absolute', right: '32px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-muted)', fontSize: '0.9rem', cursor: 'pointer', zIndex: 10 }}
              ></i>
            )}
          </div>

          <p style={{ padding: '0 20px', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-muted)', fontWeight: '800', marginBottom: '8px', letterSpacing: '1.5px', display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            Menu Utama
            <span style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, var(--color-border) 0%, transparent 100%)' }}></span>
          </p>
          
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '2px', paddingRight: '4px' }}>
            {menuItems.filter(item => 
              !menuSearch || item.label.toLowerCase().includes(menuSearch.toLowerCase())
            ).map((item, i) => {
              const isActive = pathname === item.path;
              const iconClass = isActive ? item.icon.replace('ph ', 'ph-fill ph ') : item.icon;
              return (
                <Link key={i} href={item.path} className={`siakad-nav-item ${isActive ? 'active' : ''}`} style={{ flexShrink: 0 }}>
                  <i className={iconClass} style={{ fontSize: '1.3rem', flexShrink: 0 }}></i>
                  <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.label}</span>
                  {item.label === 'Admin Dashboard' && !isActive && <span style={{ background: '#e0e7ff', color: '#4f46e5', padding: '2px 8px', borderRadius: '10px', fontSize: '0.65rem', fontWeight: 'bold', flexShrink: 0 }}>BARU</span>}
                </Link>
              );
            })}
            {menuItems.filter(item => 
              item.label.toLowerCase().includes(menuSearch.toLowerCase())
            ).length === 0 && (
              <div style={{ padding: '20px', textAlign: 'center', color: 'var(--color-muted)', fontSize: '0.8rem' }}>
                Menu tidak ditemukan
              </div>
            )}
          </div>
        </nav>

        <div className="siakad-user-profile">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, cursor: 'pointer', overflow: 'hidden' }} onClick={() => router.push('/siakad/profile')}>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'var(--glass-bg)', border: 'var(--inset-border)', boxShadow: 'inset 2px 2px 4px var(--inset-shadow-dark), inset -2px -2px 4px var(--inset-shadow-light)', color: 'var(--apple-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.2rem', flexShrink: 0 }}>
              {effectiveRole ? effectiveRole.charAt(0).toUpperCase() : 'U'}
            </div>
            <div style={{ overflow: 'hidden', flex: 1 }}>
              <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 'bold', color: 'var(--color-text)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                {user?.name || 'Pengguna SIAKAD'}
              </h4>
              <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--color-muted)', textTransform: 'capitalize', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                Role: {role || 'Guest'}{role === 'kaprodi' && portalRole ? ` • Portal: ${portalRole}` : ''}
              </p>
            </div>
          </div>
          <button 
            onClick={() => {
              fetch('/api/siakad/logout', { method: 'POST' }).finally(() => {
                localStorage.removeItem('siakad_token');
                localStorage.removeItem('siakad_role');
                localStorage.removeItem('siakad_user');
                localStorage.removeItem('siakad_portal');
                window.location.href = '/siakad/login';
              });
            }} 
            className="btn-logout-icon" 
            title="Keluar"
          >
            <i className="ph ph-sign-out" style={{ fontSize: '1.2rem' }}></i>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="siakad-main">
        {/* Sleek Glass Header */}
        <header className="siakad-header" style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '16px' }}>
          {/* Language Switcher */}
          <div style={{ display: 'flex', background: 'var(--glass-bg)', padding: '4px 6px', borderRadius: '30px', border: 'var(--glass-border)', alignItems: 'center', fontSize: '0.8rem', fontWeight: 'bold', boxShadow: 'var(--glass-shadow)' }}>
            <button 
              onClick={() => changeLanguage('id')} 
              style={{
                background: 'transparent',
                border: 'none',
                borderRadius: '20px',
                padding: '5px 12px',
                cursor: 'pointer',
                color: 'var(--color-text)',
                transition: 'all 0.2s',
                opacity: lang === 'id' ? 1 : 0.5,
                boxShadow: lang === 'id' ? 'inset 2px 2px 5px var(--inset-shadow-dark), inset -2px -2px 5px var(--inset-shadow-light)' : 'none'
              }}
              title="Bahasa Indonesia"
            >
              ID
            </button>
            <span style={{ color: 'var(--color-muted)', padding: '0 2px', opacity: 0.5 }}>|</span>
            <button 
              onClick={() => changeLanguage('en')} 
              style={{
                background: 'transparent',
                border: 'none',
                borderRadius: '20px',
                padding: '5px 12px',
                cursor: 'pointer',
                color: 'var(--color-text)',
                transition: 'all 0.2s',
                opacity: lang === 'en' ? 1 : 0.5,
                boxShadow: lang === 'en' ? 'inset 2px 2px 5px var(--inset-shadow-dark), inset -2px -2px 5px var(--inset-shadow-light)' : 'none'
              }}
              title="English"
            >
              EN
            </button>
          </div>

          <div style={{ position: 'relative' }}>
            <button 
              onClick={() => setShowNotif(!showNotif)} 
              title="Notifikasi"
              style={{
                background: 'var(--glass-bg)',
                border: 'var(--glass-border)',
                borderRadius: '50%',
                width: '40px', height: '40px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer',
                color: 'var(--color-text)',
                transition: 'all 0.3s',
                position: 'relative',
                flexShrink: 0,
                boxShadow: 'var(--glass-shadow)'
              }}
            >
              <i className="ph ph-bell" style={{ fontSize: '1.2rem' }}></i>
              {notifications.length > 0 && (
                <span style={{ position: 'absolute', top: 0, right: '2px', background: '#ef4444', border: '2px solid var(--color-bg)', borderRadius: '50%', width: '12px', height: '12px', flexShrink: 0 }}></span>
              )}
            </button>
            
            <AnimatePresence>
              {showNotif && (
                <>
                  {/* Backdrop click-away helper */}
                  <div 
                    onClick={() => setShowNotif(false)} 
                    style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999 }}
                  />
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="siakad-notif-dropdown"
                    style={{
                      position: 'absolute', top: '50px', right: 0,
                      width: '350px', background: 'var(--color-bg)',
                      borderRadius: '16px', boxShadow: 'var(--glass-shadow)',
                      border: '1px solid var(--color-border)',
                      zIndex: 10000, overflow: 'hidden'
                    }}
                  >
                    <div style={{ padding: '16px', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--glass-bg)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <h4 style={{ margin: 0, fontWeight: 'bold', color: 'var(--color-text)', fontSize: '1rem' }}>Notifikasi</h4>
                        {notifications.length > 0 && (
                          <span style={{ background: '#ef4444', color: 'white', fontSize: '0.75rem', padding: '2px 8px', borderRadius: '20px', fontWeight: 'bold' }}>{notifications.length} new</span>
                        )}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        {notifications.length > 0 && (
                          <span 
                            onClick={() => {
                              setNotifications([]);
                              window.toast?.('Semua notifikasi ditandai telah dibaca!');
                            }} 
                            style={{ fontSize: '0.75rem', color: '#3b82f6', cursor: 'pointer', fontWeight: 'bold' }}
                          >
                            Tandai dibaca
                          </span>
                        )}
                        <i 
                          className="ph ph-x" 
                          onClick={() => setShowNotif(false)} 
                          style={{ cursor: 'pointer', color: 'var(--color-muted)', fontSize: '1.1rem' }}
                        ></i>
                      </div>
                    </div>
                    <div style={{ maxHeight: '350px', overflowY: 'auto' }}>
                      {notifications.length > 0 ? notifications.map((item, idx) => (
                        <div 
                          key={idx} 
                          onClick={() => {
                            if (item.path) {
                              router.push(item.path);
                              setShowNotif(false);
                            }
                          }}
                          style={{ padding: '16px', borderBottom: idx < notifications.length - 1 ? '1px solid var(--color-border)' : 'none', display: 'flex', gap: '12px', cursor: 'pointer', transition: 'background 0.2s' }} 
                          onMouseOver={(e) => e.currentTarget.style.background = 'var(--glass-bg)'} 
                          onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                        >
                          <div style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <i className="ph ph-info" style={{ fontSize: '1.1rem' }}></i>
                          </div>
                          <div style={{ flex: 1 }}>
                            <p style={{ margin: '0 0 4px 0', fontSize: '0.9rem', color: 'var(--color-text)', fontWeight: 'bold', lineHeight: '1.3' }}>{item.title}</p>
                            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--color-muted)', lineHeight: '1.4' }}>{item.body}</p>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
                              <span style={{ fontSize: '0.7rem', color: 'var(--color-muted)', fontWeight: '500' }}>{item.time}</span>
                              <span style={{ fontSize: '0.7rem', color: '#3b82f6', fontWeight: 'bold' }} onClick={(e) => { e.stopPropagation(); setNotifications(notifications.filter((_, i) => i !== idx)); }}>Hapus</span>
                            </div>
                          </div>
                        </div>
                      )) : (
                        <div style={{ padding: '32px 16px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                          <div style={{ background: 'var(--glass-bg)', width: '48px', height: '48px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-muted)' }}>
                            <i className="ph ph-bell-slash" style={{ fontSize: '1.5rem' }}></i>
                          </div>
                          <div>
                            <p style={{ margin: 0, fontWeight: 'bold', color: 'var(--color-text)', fontSize: '0.9rem' }}>Tidak Ada Notifikasi</p>
                            <p style={{ margin: '4px 0 0 0', color: 'var(--color-muted)', fontSize: '0.8rem' }}>Semua notifikasi baru dari sistem sudah dibaca.</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          <button 
            onClick={toggleTheme} 
            title="Toggle Dark Mode"
            style={{
              background: 'var(--glass-bg)',
              border: 'var(--glass-border)',
              borderRadius: '50%',
              width: '40px', height: '40px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--color-text)',
              transition: 'all 0.3s',
              flexShrink: 0,
              boxShadow: 'var(--glass-shadow)'
            }}
          >
            {theme === 'dark' ? <i className="ph ph-sun" style={{ fontSize: '1.2rem' }}></i> : <i className="ph ph-moon" style={{ fontSize: '1.2rem' }}></i>}
          </button>

          <Link href="/siakad/profile" className="siakad-user-badge" style={{ textDecoration: 'none', margin: 0 }} title="Pengaturan Profil">
            <div style={{ textAlign: 'right', marginRight: '2px' }}>
              <div style={{ fontSize: '0.9rem', fontWeight: '800', color: 'var(--color-text)', lineHeight: '1.2', textTransform: 'none', letterSpacing: '0' }}>Portal Akademik</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--color-muted)', fontWeight: '700', marginTop: '2px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>TAHUN AJARAN 2026/2027</div>
            </div>
            <div className="siakad-avatar" style={{ background: 'var(--liquid-bg)', color: '#C41E3A', border: 'var(--inset-border)', boxShadow: 'inset 3px 3px 6px var(--inset-shadow-dark), inset -3px -3px 6px var(--inset-shadow-light)' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" viewBox="0 0 256 256">
                <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24ZM74.08,197.5a64,64,0,0,1,107.84,0,87.83,87.83,0,0,1-107.84,0ZM96,120a32,32,0,1,1,32,32A32,32,0,0,1,96,120Zm97.76,66.41a79.66,79.66,0,0,0-36.06-28.75,48,48,0,1,0-59.4,0,79.66,79.66,0,0,0-36.06,28.75,88,88,0,1,1,131.52,0Z"></path>
              </svg>
            </div>
          </Link>
        </header>

        {/* Scrollable Content */}
        <div className="siakad-content" id="siakad-scroll-area">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              style={{ minHeight: '100%' }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* MOBILE BOTTOM NAVIGATION */}
      <nav className="siakad-bottom-nav">
        {(() => {
          const primaryItems = menuItems.filter(item => item.isMobilePrimary).slice(0, 4);
          const displayItems = [...primaryItems, { label: 'Lainnya', icon: 'ph ph-dots-three-circle', path: '#' }];
          
          let activeIndex = displayItems.findIndex(item => pathname === item.path);
          if (activeIndex === -1) {
            if (pathname === '/siakad/profile') {
              activeIndex = -1;
            } else {
              const inOverflow = menuItems.some(item => pathname === item.path);
              activeIndex = inOverflow ? displayItems.length - 1 : 0;
            }
          }

          return (
            <>
              {displayItems.map((item, i) => {
                const isActive = i === activeIndex;
                const isMore = item.label === 'Lainnya';
                
                return (
                  <Link 
                    key={i} 
                    href={item.path} 
                    className={`siakad-bottom-nav-item ${isActive ? 'active' : ''}`}
                    onClick={(e) => {
                      if(isMore) {
                        e.preventDefault();
                        setIsDrawerOpen(true);
                      }
                    }}
                  >
                    <div className="icon-wrapper">
                      <i className={item.icon}></i>
                    </div>
                    <span className="label">{item.label.split(' ')[0]}</span>
                  </Link>
                );
              })}
            </>
          );
        })()}
      </nav>

      {/* MOBILE DRAWER OVERLAY */}
      {isDrawerOpen && (
        <div className="siakad-drawer-overlay" onClick={() => { setIsDrawerOpen(false); setShowMobileNotifs(false); }}>
          <div className="siakad-drawer-content" onClick={e => e.stopPropagation()}>
            <div className="drawer-header">
              <div className="drawer-profile">
                <div className="drawer-avatar"><i className="ph ph-user"></i></div>
                <div className="drawer-user-info">
                  <h4>{user?.name || 'User'}</h4>
                  <p>{role}</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <button 
                  className="drawer-close-btn" 
                  title="Notifikasi"
                  style={{ position: 'relative' }}
                  onClick={() => setShowMobileNotifs(!showMobileNotifs)}
                >
                  <i className="ph ph-bell"></i>
                  {notifications.length > 0 && (
                    <span style={{ position: 'absolute', top: '8px', right: '8px', background: '#ef4444', borderRadius: '50%', width: '8px', height: '8px' }}></span>
                  )}
                </button>
                <button 
                  className="drawer-close-btn" 
                  title="Toggle Theme"
                  onClick={toggleTheme}
                >
                  {theme === 'dark' ? <i className="ph ph-sun"></i> : <i className="ph ph-moon"></i>}
                </button>
                <button 
                  className="drawer-logout-btn" 
                  title="Logout"
                  onClick={() => {
                    fetch('/api/siakad/logout', { method: 'POST' }).finally(() => {
                      localStorage.removeItem('siakad_token');
                      localStorage.removeItem('siakad_role');
                      localStorage.removeItem('siakad_user');
                      localStorage.removeItem('siakad_portal');
                      window.location.href = '/siakad/login';
                    });
                  }}
                >
                  <i className="ph ph-sign-out"></i>
                </button>
                <button className="drawer-close-btn" onClick={() => { setIsDrawerOpen(false); setShowMobileNotifs(false); }}><i className="ph ph-x"></i></button>
              </div>
            </div>
            
            <div className="drawer-body">
              {showMobileNotifs ? (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h4 style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-text)', textTransform: 'uppercase', letterSpacing: '1px' }}>Notifikasi ({notifications.length})</h4>
                    <button 
                      onClick={() => setShowMobileNotifs(false)}
                      style={{ background: 'none', border: 'none', color: '#3b82f6', fontSize: '0.85rem', cursor: 'pointer', fontWeight: 'bold' }}
                    >
                      Kembali ke Menu
                    </button>
                  </div>
                  {notifications.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '350px', overflowY: 'auto' }}>
                      {notifications.map((item, idx) => (
                        <div 
                          key={idx} 
                          onClick={() => {
                            if (item.path) {
                              router.push(item.path);
                              setIsDrawerOpen(false);
                              setShowMobileNotifs(false);
                            }
                          }}
                          style={{ padding: '12px', borderRadius: '12px', background: 'var(--glass-bg)', border: '1px solid var(--color-border)', cursor: 'pointer' }}
                        >
                          <p style={{ margin: '0 0 4px 0', fontSize: '0.9rem', color: 'var(--color-text)', fontWeight: 'bold' }}>{item.title}</p>
                          <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--color-muted)' }}>{item.body}</p>
                          <span style={{ fontSize: '0.7rem', color: 'var(--color-muted)', display: 'block', marginTop: '6px' }}>{item.time}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ padding: '32px 16px', textAlign: 'center', color: 'var(--color-muted)' }}>
                      <i className="ph ph-bell-slash" style={{ fontSize: '2rem', opacity: 0.5, marginBottom: '8px' }}></i>
                      <p style={{ margin: 0, fontSize: '0.9rem' }}>Tidak ada notifikasi baru.</p>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <h4 style={{ margin: '0 0 12px 0', fontSize: '0.85rem', color: 'var(--color-text)', textTransform: 'uppercase', letterSpacing: '1px' }}>Menu Lainnya</h4>
                  {menuItems.filter(item => !item.isMobilePrimary && item.path !== '/siakad/profile').map((item, i) => {
                    const isActive = pathname === item.path;
                    return (
                      <Link key={i} href={item.path} className={`drawer-item ${isActive ? 'active' : ''}`} onClick={() => { setIsDrawerOpen(false); setShowMobileNotifs(false); }}>
                        <div className="icon"><i className={item.icon}></i></div>
                        <div className="label">{item.label}</div>
                        <i className="ph ph-caret-right chevron"></i>
                      </Link>
                    );
                  })}

                  <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--color-border)' }}>
                    <Link href="/siakad/profile" className={`drawer-item ${pathname === '/siakad/profile' ? 'active' : ''}`} onClick={() => { setIsDrawerOpen(false); setShowMobileNotifs(false); }}>
                      <div className="icon"><i className="ph ph-user-gear"></i></div>
                      <div className="label">Pengaturan Profil</div>
                      <i className="ph ph-caret-right chevron"></i>
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
