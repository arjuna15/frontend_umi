'use client';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function SiakadLayout({ children }) {
  const pathname = usePathname();
  const [role, setRole] = useState(null);

  useEffect(() => {
    setRole(localStorage.getItem('siakad_role'));
  }, []);

  const isLoginPage = pathname === '/siakad/login';
  if (isLoginPage) return <>{children}</>;

  let menuItems = [];
  if (role === 'admin' || role === 'superadmin') {
    menuItems = [
      { label: 'Admin Dashboard', icon: 'ph-chart-pie-slice', path: '/siakad/admin' },
      { label: 'Manajemen Pengguna', icon: 'ph-users-three', path: '/siakad/admin/users' },
      { label: 'Manajemen Kelas', icon: 'ph-chalkboard', path: '/siakad/admin/classes' },
    ];
  } else if (role === 'dosen') {
    menuItems = [
      { label: 'Dashboard Dosen', icon: 'ph-chalkboard-teacher', path: '/siakad/dosen' },
      { label: 'E-Learning (Materi & Tugas)', icon: 'ph-books', path: '/siakad/dosen/elearning' },
      { label: 'Presensi Mahasiswa', icon: 'ph-calendar-check', path: '/siakad/dosen/presensi' },
      { label: 'Gradebook & Nilai', icon: 'ph-exam', path: '/siakad/dosen/gradebook' },
      { label: 'Forum Diskusi', icon: 'ph-chats', path: '/siakad/dosen/forum' },
    ];
  } else {
    // Default Mahasiswa
    menuItems = [
      { label: 'Dashboard & KHS', icon: 'ph-squares-four', path: '/siakad/mahasiswa' },
      { label: 'KRS Online', icon: 'ph-list-checks', path: '/siakad/mahasiswa/krs' },
      { label: 'Ruang Kelas (E-Learning)', icon: 'ph-laptop', path: '/siakad/mahasiswa/elearning' },
      { label: 'Forum Diskusi', icon: 'ph-chats', path: '/siakad/mahasiswa/forum' },
      { label: 'Tagihan & Keuangan', icon: 'ph-wallet', path: '/siakad/mahasiswa/keuangan' },
    ];
  }

  return (
    <div style={{ 
      display: 'flex', minHeight: '100vh', 
      background: 'linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)',
      fontFamily: 'Inter, sans-serif'
    }}>
      {/* Sidebar */}
      <aside style={{ 
        width: '280px', 
        background: 'linear-gradient(180deg, #991b1b 0%, #7f1d1d 100%)', 
        color: 'white',
        boxShadow: '4px 0 15px rgba(0,0,0,0.1)',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div style={{ padding: '24px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img src="/icon.png" alt="Logo" style={{ width: '40px', height: '40px', background: 'white', borderRadius: '8px', padding: '4px' }} />
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold', margin: 0, letterSpacing: '1px' }}>SIAKAD</h2>
            <p style={{ fontSize: '0.75rem', opacity: 0.8, margin: 0 }}>Universitas Mitra Bangsa</p>
          </div>
        </div>

        <nav style={{ padding: '20px 0', flex: 1 }}>
          <p style={{ padding: '0 24px', fontSize: '0.75rem', textTransform: 'uppercase', opacity: 0.6, fontWeight: 'bold', marginBottom: '12px' }}>Menu Utama</p>
          {menuItems.map((item, i) => (
            <Link key={i} href={item.path} style={{
              display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 24px',
              color: i === 0 ? 'white' : 'rgba(255,255,255,0.7)',
              background: i === 0 ? 'rgba(255,255,255,0.1)' : 'transparent',
              borderLeft: i === 0 ? '4px solid white' : '4px solid transparent',
              textDecoration: 'none', transition: 'all 0.2s', fontSize: '0.9rem'
            }}>
              <i className={item.icon} style={{ fontSize: '1.2rem' }}></i>
              {item.label}
            </Link>
          ))}
        </nav>

        <div style={{ padding: '24px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <button onClick={() => {
            localStorage.removeItem('siakad_token');
            window.location.href = '/siakad/login';
          }} style={{ 
            width: '100%', padding: '12px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
            color: 'white', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            transition: 'background 0.2s'
          }}>
            <i className="ph-sign-out" style={{ fontSize: '1.2rem' }}></i> Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflowY: 'auto' }}>
        <header style={{ background: 'white', padding: '20px 32px', display: 'flex', justifyContent: 'flex-end', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#1f2937' }}>Portal Akademik</div>
              <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Tahun Ajaran 2026/2027</div>
            </div>
            <div style={{ width: '40px', height: '40px', background: '#f3f4f6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af' }}>
              <i className="ph-user-circle" style={{ fontSize: '24px' }}></i>
            </div>
          </div>
        </header>
        <div style={{ padding: '32px' }}>
          {children}
        </div>
      </main>
    </div>
  );
}
