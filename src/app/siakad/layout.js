'use client';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import './siakad.css';

export default function SiakadLayout({ children }) {
  const pathname = usePathname();
  const [role, setRole] = useState(null);

  useEffect(() => {
    setRole(localStorage.getItem('siakad_role'));
  }, [pathname]);

  const isLoginPage = pathname === '/siakad/login';
  if (isLoginPage) return <>{children}</>;

  let menuItems = [];
  if (role === 'admin' || role === 'superadmin') {
    menuItems = [
      { label: 'Admin Dashboard', icon: 'ph-chart-pie-slice', path: '/siakad/admin' },
      { label: 'Manajemen Pengguna', icon: 'ph-users-three', path: '/siakad/admin/users' },
      { label: 'Manajemen Kelas', icon: 'ph-chalkboard', path: '/siakad/admin/classes' },
      { label: 'Manajemen Keuangan', icon: 'ph-wallet', path: '/siakad/admin/keuangan' },
    ];
  } else if (role === 'kaprodi') {
    menuItems = [
      { label: 'Dashboard Statistik', icon: 'ph-chart-line-up', path: '/siakad/kaprodi' },
      { label: 'Persetujuan KRS', icon: 'ph-check-square-offset', path: '/siakad/kaprodi/krs' },
      { label: 'Monitoring Perkuliahan', icon: 'ph-chalkboard-teacher', path: '/siakad/kaprodi/monitoring' },
      { label: 'Plotting Dosen', icon: 'ph-users-three', path: '/siakad/kaprodi/plotting' },
      { label: 'Distribusi Nilai', icon: 'ph-student', path: '/siakad/kaprodi/students' },
      { label: 'Hasil EDOM', icon: 'ph-star-half', path: '/siakad/kaprodi/edom' },
      { label: 'Laporan Akreditasi', icon: 'ph-file-pdf', path: '/siakad/kaprodi/reports' },
    ];
  } else if (role === 'dosen') {
    menuItems = [
      { label: 'Dashboard Dosen', icon: 'ph-chalkboard-teacher', path: '/siakad/dosen' },
      { label: 'E-Learning', icon: 'ph-books', path: '/siakad/dosen/elearning' },
      { label: 'Presensi Mahasiswa', icon: 'ph-calendar-check', path: '/siakad/dosen/presensi' },
      { label: 'Gradebook & Nilai', icon: 'ph-exam', path: '/siakad/dosen/gradebook' },
      { label: 'Forum Diskusi', icon: 'ph-chats', path: '/siakad/dosen/forum' },
    ];
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
            <h2 style={{ fontSize: '1.4rem', fontWeight: '800', margin: 0, letterSpacing: '1px', color: '#0f172a' }}>SIAKAD</h2>
            <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0, fontWeight: '600' }}>V3 ULTIMATE</p>
          </div>
        </div>

        <nav className="siakad-nav">
          <p style={{ padding: '0 20px', fontSize: '0.7rem', textTransform: 'uppercase', color: '#94a3b8', fontWeight: '800', marginBottom: '8px', letterSpacing: '1px' }}>Menu Utama</p>
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
          }} style={{ 
            width: '100%', padding: '14px', background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.9)',
            color: '#b91c1c', borderRadius: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            transition: 'all 0.3s', fontWeight: 'bold', fontSize: '0.95rem', boxShadow: '0 4px 15px rgba(0,0,0,0.03)'
          }}
          onMouseOver={(e) => { e.currentTarget.style.background = '#fef2f2'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
          onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.7)'; e.currentTarget.style.transform = 'none'; }}
          >
            <i className="ph ph-sign-out" style={{ fontSize: '1.2rem' }}></i> Keluar
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="siakad-main">
        {/* Sleek Glass Header */}
        <header className="siakad-header">
          <Link href="/siakad/profile" className="siakad-user-badge" style={{ textDecoration: 'none' }} title="Pengaturan Profil">
            <div style={{ textAlign: 'right', marginRight: '4px' }}>
              <div style={{ fontSize: '0.95rem', fontWeight: '800', color: '#0f172a', lineHeight: '1.2' }}>Portal Akademik</div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '500', marginTop: '2px' }}>Tahun Ajaran 2026/2027</div>
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
          {children}
        </div>
      </main>
    </div>
  );
}
