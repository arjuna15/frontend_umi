'use client';
import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { ToastContainer, ConfirmModal, PromptModal, FormModal } from './components/Toast';
import './siakad.css';

export default function SiakadLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [hydrated, setHydrated] = useState(false);
  const [session, setSession] = useState({ role: null, portalRole: null });
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const [notifications, setNotifications] = useState([]);

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
            })) || []),
            ...(deadlineItems.slice(0, 1).map((item) => ({
              title: item.title || 'Tenggat akademik',
              body: `${item.course || 'Mata kuliah'} H-${Math.ceil(item.due_in_days)}`,
              time: 'Jadwal akademik',
            })) || []),
            ...(scheduleItems.slice(0, 1).map((item) => ({
              title: 'Jadwal kuliah aktif',
              body: `${item.course || '-'} ${item.time || ''} ${item.room ? `di ${item.room}` : ''}`.trim(),
              time: 'Hari ini',
            })) || []),
          ].filter((item) => item.title));
        } else if (effectiveRole === 'dosen') {
          const res = await fetch(`${apiUrl}/siakad/dosen/dashboard`, { headers });
          if (!res.ok) throw new Error('Failed to load dosen dashboard');
          const dash = await res.json();
          setNotifications([
            ...(Array.isArray(dash.todos) ? dash.todos.slice(0, 3).map((todo) => ({
              title: 'Tugas dosen',
              body: todo,
              time: 'Dashboard dosen',
            })) : []),
            ...(Array.isArray(dash.schedule) ? dash.schedule.slice(0, 1).map((item) => ({
              title: 'Jadwal mengajar aktif',
              body: `${item.course || '-'} ${item.time || ''} ${item.room ? `di ${item.room}` : ''}`.trim(),
              time: 'Hari ini',
            })) : []),
          ]);
        } else if (effectiveRole === 'kaprodi' || effectiveRole === 'admin' || effectiveRole === 'superadmin') {
          const res = await fetch(`${apiUrl}/siakad/dashboard`, { headers });
          if (!res.ok) throw new Error('Failed to load admin dashboard');
          const dash = await res.json();
          setNotifications([
            { title: 'Ringkasan pengguna', body: `${dash.users_count || 0} akun aktif terdata di sistem.`, time: 'Dashboard admin' },
            { title: 'Data perkuliahan', body: `${Array.isArray(dash.courses) ? dash.courses.length : 0} mata kuliah tersedia.`, time: 'Dashboard admin' },
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
      { label: 'Manajemen Keuangan', icon: 'ph ph-wallet', path: '/siakad/admin/keuangan', isMobilePrimary: true },
      { label: 'Manajemen Surat', icon: 'ph ph-envelope-simple', path: '/siakad/admin/surat', isMobilePrimary: true },
      { label: 'Log Aktivitas (Audit)', icon: 'ph ph-list-magnifying-glass', path: '/siakad/admin/logs' },
      { label: 'Backup & Restore', icon: 'ph ph-database', path: '/siakad/admin/backup' },
      { label: 'Pengaturan Sistem', icon: 'ph ph-gear', path: '/siakad/admin/pengaturan' },
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
    ];
  } else if (effectiveRole === 'dosen') {
    menuItems = [
      { label: 'Dashboard Dosen', icon: 'ph ph-chalkboard-teacher', path: '/siakad/dosen', isMobilePrimary: true },
      { label: 'Roster Kelas', icon: 'ph ph-users-three', path: '/siakad/dosen/roster' },
      { label: 'Jadwal Mengajar', icon: 'ph ph-calendar-plus', path: '/siakad/dosen/jadwal', isMobilePrimary: true },
      { label: 'Isi BAP', icon: 'ph ph-file-text', path: '/siakad/dosen/bap' },
      { label: 'Persetujuan KRS', icon: 'ph ph-check-square', path: '/siakad/dosen/krs-approval', isMobilePrimary: true },
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
      { label: 'Presensi Mandiri', icon: 'ph ph-calendar-check', path: '/siakad/mahasiswa/presensi' },
      { label: 'Rapor & Transkrip', icon: 'ph ph-exam', path: '/siakad/mahasiswa/gradebook' },
      { label: 'Bimbingan Akademik', icon: 'ph ph-users', path: '/siakad/mahasiswa/bimbingan' },
      { label: 'Forum Diskusi', icon: 'ph ph-chats', path: '/siakad/mahasiswa/forum' },
      { label: 'Surat & Administrasi', icon: 'ph ph-envelope-simple', path: '/siakad/mahasiswa/surat' },
      { label: 'Keuangan', icon: 'ph ph-wallet', path: '/siakad/mahasiswa/keuangan' },
    ];
  }

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
            <img src="/icon.png" alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain', filter: 'brightness(0) invert(1)' }} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '800', margin: 0, letterSpacing: '1px', color: 'var(--color-text)', lineHeight: '1.2' }}>SIAKAD</h2>
            <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--color-muted)', fontWeight: '600' }}>Universitas Mitra Bangsa</p>
          </div>
        </div>

        <nav className="siakad-nav">
          <p style={{ padding: '0 20px', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-muted)', fontWeight: '800', marginBottom: '8px', letterSpacing: '1.5px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            Menu Utama
            <span style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, var(--color-border) 0%, transparent 100%)' }}></span>
          </p>
          {menuItems.map((item, i) => {
            const isActive = pathname === item.path;
            const iconClass = isActive ? item.icon.replace('ph ', 'ph-fill ph ') : item.icon;
            return (
              <Link key={i} href={item.path} className={`siakad-nav-item ${isActive ? 'active' : ''}`}>
                <i className={iconClass} style={{ fontSize: '1.3rem', flexShrink: 0 }}></i>
                <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.label}</span>
                {i === 0 && <span style={{ background: isActive ? 'rgba(255,255,255,0.2)' : '#e0e7ff', color: isActive ? 'white' : '#4f46e5', padding: '2px 8px', borderRadius: '10px', fontSize: '0.65rem', fontWeight: 'bold', flexShrink: 0 }}>BARU</span>}
              </Link>
            );
          })}
        </nav>

        <div className="siakad-user-profile">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, cursor: 'pointer', overflow: 'hidden' }} onClick={() => router.push('/siakad/profile')}>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.2rem', flexShrink: 0 }}>
              {effectiveRole ? effectiveRole.charAt(0).toUpperCase() : 'U'}
            </div>
            <div style={{ overflow: 'hidden', flex: 1 }}>
              <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 'bold', color: 'var(--color-text)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                Pengguna SIAKAD
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
          
          <div style={{ position: 'relative' }}>
            <button 
              onClick={() => setShowNotif(!showNotif)} 
              title="Notifikasi"
              style={{
                background: 'var(--glass-bg)',
                border: '1px solid rgba(255,255,255,0.4)',
                borderRadius: '50%',
                width: '40px', height: '40px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer',
                color: 'var(--color-text)',
                transition: 'all 0.3s'
              , flexShrink: 0 }}
            >
              <i className="ph ph-bell" style={{ fontSize: '1.2rem' }}></i>
              <span style={{ position: 'absolute', top: 0, right: '2px', background: '#ef4444', border: '2px solid var(--color-bg)', borderRadius: '50%', width: '12px', height: '12px' , flexShrink: 0 }}></span>
            </button>
            
            <AnimatePresence>
              {showNotif && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  style={{
                    position: 'absolute', top: '50px', right: 0,
                    width: '320px', background: 'var(--color-bg)',
                    borderRadius: '16px', boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
                    border: '1px solid var(--color-border)',
                    zIndex: 1000, overflow: 'hidden'
                  }}
                >
                  <div style={{ padding: '16px', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--glass-bg)' }}>
                    <h4 style={{ margin: 0, fontWeight: 'bold', color: 'var(--color-text)' }}>Notifikasi</h4>
                    <span style={{ fontSize: '0.75rem', color: '#3b82f6', cursor: 'pointer', fontWeight: 'bold' }}>Tandai sudah dibaca</span>
                  </div>
                  <div style={{ maxHeight: '350px', overflowY: 'auto' }}>
                    {notifications.length > 0 ? notifications.map((item, idx) => (
                      <div key={idx} style={{ padding: '16px', borderBottom: idx < notifications.length - 1 ? '1px solid var(--color-border)' : 'none', display: 'flex', gap: '12px', cursor: 'pointer' }}>
                        <div style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <i className="ph ph-bell"></i>
                        </div>
                        <div>
                          <p style={{ margin: '0 0 4px 0', fontSize: '0.9rem', color: 'var(--color-text)', fontWeight: 'bold' }}>{item.title}</p>
                          <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--color-muted)' }}>{item.body}</p>
                          <p style={{ margin: '4px 0 0 0', fontSize: '0.7rem', color: 'var(--color-muted)' }}>{item.time}</p>
                        </div>
                      </div>
                    )) : (
                      <div style={{ padding: '20px', textAlign: 'center', color: 'var(--color-muted)' }}>
                        Tidak ada notifikasi baru dari backend.
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button 
            onClick={toggleTheme} 
            title="Toggle Dark Mode"
            style={{
              background: 'var(--glass-bg)',
              border: '1px solid rgba(255,255,255,0.4)',
              borderRadius: '50%',
              width: '40px', height: '40px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--color-text)',
              transition: 'all 0.3s'
            , flexShrink: 0 }}
          >
            {theme === 'dark' ? <i className="ph ph-sun" style={{ fontSize: '1.2rem' }}></i> : <i className="ph ph-moon" style={{ fontSize: '1.2rem' }}></i>}
          </button>

          <Link href="/siakad/profile" className="siakad-user-badge" style={{ textDecoration: 'none', margin: 0 }} title="Pengaturan Profil">
            <div style={{ textAlign: 'right', marginRight: '4px' }}>
              <div style={{ fontSize: '0.95rem', fontWeight: '800', color: 'var(--color-text)', lineHeight: '1.2' }}>Portal Akademik</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text)', fontWeight: '500', marginTop: '2px' }}>Tahun Ajaran 2026/2027</div>
            </div>
            <div className="siakad-avatar">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
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
        <div className="siakad-drawer-overlay" onClick={() => setIsDrawerOpen(false)}>
          <div className="siakad-drawer-content" onClick={e => e.stopPropagation()}>
            <div className="drawer-header">
              <div className="drawer-profile">
                <div className="drawer-avatar"><i className="ph ph-user"></i></div>
                <div className="drawer-user-info">
                  <h4>User</h4>
                  <p>{role}</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
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
                <button className="drawer-close-btn" onClick={() => setIsDrawerOpen(false)}><i className="ph ph-x"></i></button>
              </div>
            </div>
            
            <div className="drawer-body">
              <h4 style={{ margin: '0 0 12px 0', fontSize: '0.85rem', color: 'var(--color-text)', textTransform: 'uppercase', letterSpacing: '1px' }}>Menu Lainnya</h4>
              {menuItems.filter(item => !item.isMobilePrimary).map((item, i) => {
                const isActive = pathname === item.path;
                return (
                  <Link key={i} href={item.path} className={`drawer-item ${isActive ? 'active' : ''}`} onClick={() => setIsDrawerOpen(false)}>
                    <div className="icon"><i className={item.icon}></i></div>
                    <div className="label">{item.label}</div>
                    <i className="ph ph-caret-right chevron"></i>
                  </Link>
                );
              })}

              <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--color-border)' }}>
                <Link href="/siakad/profile" className={`drawer-item ${pathname === '/siakad/profile' ? 'active' : ''}`} onClick={() => setIsDrawerOpen(false)}>
                  <div className="icon"><i className="ph ph-user-gear"></i></div>
                  <div className="label">Pengaturan Profil</div>
                  <i className="ph ph-caret-right chevron"></i>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
