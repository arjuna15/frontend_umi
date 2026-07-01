'use client';
import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { ToastContainer } from './components/Toast';
import './siakad.css';

export default function SiakadLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [role, setRole] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    setRole(localStorage.getItem('siakad_role'));
  }, [pathname]);

  const isLoginPage = pathname === '/siakad/login';
  if (isLoginPage) return <>{children}</>;

  let menuItems = [];
  if (role === 'admin' || role === 'superadmin') {
    menuItems = [
      { label: 'Admin Dashboard', icon: 'ph ph-chart-pie-slice', path: '/siakad/admin' },
      { label: 'Manajemen Pengguna', icon: 'ph ph-users-three', path: '/siakad/admin/users' },
      { label: 'Manajemen Kelas', icon: 'ph ph-chalkboard', path: '/siakad/admin/classes' },
      { label: 'Manajemen Keuangan', icon: 'ph ph-wallet', path: '/siakad/admin/keuangan' },
      { label: 'Pengaturan Sistem', icon: 'ph ph-gear', path: '/siakad/admin/pengaturan' },
    ];
  } else if (role === 'kaprodi') {
    menuItems = [
      { label: 'Dashboard Statistik', icon: 'ph ph-chart-line-up', path: '/siakad/kaprodi' },
      { label: 'Persetujuan KRS', icon: 'ph ph-check-square-offset', path: '/siakad/kaprodi/krs' },
      { label: 'Monitoring Perkuliahan', icon: 'ph ph-chalkboard-teacher', path: '/siakad/kaprodi/monitoring' },
      { label: 'Plotting Dosen', icon: 'ph ph-users-three', path: '/siakad/kaprodi/plotting' },
      { label: 'Distribusi Nilai', icon: 'ph ph-student', path: '/siakad/kaprodi/students' },
      { label: 'Hasil EDOM', icon: 'ph ph-star-half', path: '/siakad/kaprodi/edom' },
      { label: 'Laporan Akreditasi', icon: 'ph ph-file-pdf', path: '/siakad/kaprodi/reports' },
    ];
  } else if (role === 'dosen') {
    menuItems = [
      { label: 'Dashboard Dosen', icon: 'ph ph-chalkboard-teacher', path: '/siakad/dosen' },
      { label: 'E-Learning', icon: 'ph ph-books', path: '/siakad/dosen/elearning' },
      { label: 'Presensi Mahasiswa', icon: 'ph ph-calendar-check', path: '/siakad/dosen/presensi' },
      { label: 'Gradebook & Nilai', icon: 'ph ph-exam', path: '/siakad/dosen/gradebook' },
      { label: 'Forum Diskusi', icon: 'ph ph-chats', path: '/siakad/dosen/forum' },
    ];
  } else {
    // Default Mahasiswa
    menuItems = [
      { label: 'Dashboard & Info', icon: 'ph ph-squares-four', path: '/siakad/mahasiswa' },
      { label: 'KRS Online', icon: 'ph ph-list-checks', path: '/siakad/mahasiswa/krs' },
      { label: 'Ruang Kelas & Kuis', icon: 'ph ph-laptop', path: '/siakad/mahasiswa/elearning' },
      { label: 'Presensi Mandiri', icon: 'ph ph-calendar-check', path: '/siakad/mahasiswa/presensi' },
      { label: 'Rapor & Transkrip', icon: 'ph ph-exam', path: '/siakad/mahasiswa/gradebook' },
      { label: 'Forum Diskusi', icon: 'ph ph-chats', path: '/siakad/mahasiswa/forum' },
      { label: 'Keuangan', icon: 'ph ph-wallet', path: '/siakad/mahasiswa/keuangan' },
    ];
  }

  return (
    <div className="siakad-container">
      <ToastContainer />
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
            <h2 style={{ fontSize: '1.4rem', fontWeight: '800', margin: 0, letterSpacing: '1px', color: 'var(--color-text)' }}>SIAKAD</h2>
          </div>
        </div>

        <nav className="siakad-nav">
          <p style={{ padding: '0 20px', fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--color-text)', fontWeight: '800', marginBottom: '8px', letterSpacing: '1px' }}>Menu Utama</p>
          {menuItems.map((item, i) => {
            const isActive = pathname === item.path;
            return (
              <Link key={i} href={item.path} className={`siakad-nav-item ${isActive ? 'active' : ''}`}>
                <i className={item.icon} style={{ fontSize: '1.3rem' }}></i>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div style={{ padding: '24px' }}>
          <button onClick={() => {
            localStorage.removeItem('siakad_token');
            window.location.href = '/siakad/login';
          }} className="btn-logout"
          >
            <i className="ph ph-sign-out" style={{ fontSize: '1.2rem' }}></i> Keluar
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="siakad-main">
        {/* Sleek Glass Header */}
        <header className="siakad-header" style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '16px' }}>
          
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
            }}
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
          const maxVisible = 5;
          const displayItems = menuItems.length > maxVisible 
            ? [...menuItems.slice(0, 4), { label: 'Lainnya', icon: 'ph ph-dots-three-circle', path: '#' }] 
            : [...menuItems.slice(0, maxVisible - 1), { label: 'Lainnya', icon: 'ph ph-dots-three-circle', path: '#' }];
          
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
                  className="drawer-logout-btn" 
                  title="Logout"
                  onClick={() => {
                    localStorage.removeItem('siakad_token');
                    localStorage.removeItem('siakad_role');
                    router.push('/siakad/login');
                  }}
                >
                  <i className="ph ph-sign-out"></i>
                </button>
                <button className="drawer-close-btn" onClick={() => setIsDrawerOpen(false)}><i className="ph ph-x"></i></button>
              </div>
            </div>
            
            <div className="drawer-body">
              <h4 style={{ margin: '0 0 12px 0', fontSize: '0.85rem', color: 'var(--color-text)', textTransform: 'uppercase', letterSpacing: '1px' }}>Menu Lainnya</h4>
              {menuItems.slice(4).map((item, i) => (
                <Link key={i} href={item.path} className="drawer-item" onClick={() => setIsDrawerOpen(false)}>
                  <div className="icon"><i className={item.icon}></i></div>
                  <div className="label">{item.label}</div>
                  <i className="ph ph-caret-right chevron"></i>
                </Link>
              ))}

              <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
                <Link href="/siakad/profile" className="drawer-item" onClick={() => setIsDrawerOpen(false)}>
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
