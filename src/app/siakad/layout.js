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
  if (role === 'admin' || role === 'superadmin' || role === 'kaprodi') {
    menuItems = [
      { label: 'Admin Dashboard', icon: 'ph-chart-pie-slice', path: '/siakad/admin' },
      { label: 'Manajemen Pengguna', icon: 'ph-users-three', path: '/siakad/admin/users' },
      { label: 'Manajemen Kelas', icon: 'ph-chalkboard', path: '/siakad/admin/classes' },
    ];
  } else if (role === 'dosen') {
    menuItems = [
      { label: 'Dashboard Dosen', icon: 'ph-chalkboard-teacher', path: '/siakad/dosen' },
      { label: 'E-Learning', icon: 'ph-books', path: '/siakad/dosen/elearning' },
      { label: 'Presensi Mahasiswa', icon: 'ph-calendar-check', path: '/siakad/dosen/presensi' },
      { label: 'Gradebook & Nilai', icon: 'ph-exam', path: '/siakad/dosen/gradebook' },
      { label: 'Forum Diskusi', icon: 'ph-chats', path: '/siakad/dosen/forum' },
    ];
  } else {
    // Default Mahasiswa
    menuItems = [
      { label: 'Dashboard & KHS', icon: 'ph-squares-four', path: '/siakad/mahasiswa' },
      { label: 'KRS Online', icon: 'ph-list-checks', path: '/siakad/mahasiswa/krs' },
      { label: 'Ruang Kelas', icon: 'ph-laptop', path: '/siakad/mahasiswa/elearning' },
      { label: 'Forum Diskusi', icon: 'ph-chats', path: '/siakad/mahasiswa/forum' },
      { label: 'Keuangan', icon: 'ph-wallet', path: '/siakad/mahasiswa/keuangan' },
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
            <i className="ph-sign-out" style={{ fontSize: '1.2rem' }}></i> Keluar
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="siakad-main">
        {/* Sleek Glass Header */}
        <header className="siakad-header">
          <Link href="/siakad/profile" className="siakad-user-badge" style={{ textDecoration: 'none' }} title="Pengaturan Profil">
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.95rem', fontWeight: '800', color: '#1e293b', whiteSpace: 'nowrap' }}>Portal Akademik</div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '500', whiteSpace: 'nowrap' }}>Tahun Ajaran 2026/2027</div>
            </div>
            <div className="siakad-avatar" style={{ flexShrink: 0 }}>
              <i className="ph-user-circle" style={{ fontSize: '28px', color: 'white' }}></i>
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
