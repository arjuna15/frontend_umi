"use client";
import { useEffect } from 'react';
import Image from 'next/image';

export default function PortalGateway() {
  
  useEffect(() => {
    // Basic animation trigger if they use an intersection observer for .fade-up
    const elements = document.querySelectorAll('.fade-up');
    elements.forEach((el, index) => {
      setTimeout(() => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }, index * 100);
    });
  }, []);

  const portals = [
    {
      id: 'mahasiswa',
      title: 'SIAKAD Mahasiswa',
      desc: 'Akses portal akademik, KRS, KHS, jadwal, dan informasi perkuliahan.',
      icon: 'ph-student',
      link: '/siakad/login',
      color: '#3B82F6' // Blue
    },
    {
      id: 'dosen',
      title: 'SIAKAD Dosen',
      desc: 'Sistem manajemen akademik khusus untuk Dosen dan Staf Pengajar.',
      icon: 'ph-chalkboard-teacher',
      link: '/siakad/login',
      color: '#10B981' // Green
    },
    {
      id: 'elearning',
      title: 'E-Learning (SPADA)',
      desc: 'Platform pembelajaran daring, materi, dan ujian (CBT).',
      icon: 'ph-laptop',
      link: '/siakad/login',
      color: '#8B5CF6' // Purple
    },
    {
      id: 'pmb',
      title: 'Portal PMB',
      desc: 'Pendaftaran Mahasiswa Baru dan Informasi Penerimaan UMIBA.',
      icon: 'ph-user-plus',
      link: 'https://pmb.umiba.ac.id/',
      color: '#B91C1C' // Red
    }
  ];

  return (
    <>
      <section 
        className="portal-section" 
        style={{ 
          position: 'relative', 
          minHeight: 'calc(100vh - 80px)', 
          padding: '60px 20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {/* Background Overlay from existing assets */}
        <div style={{ position: 'absolute', inset: 0, zIndex: -2 }}>
          <Image 
            src="https://umiba.ac.id/wp-content/uploads/2026/05/rektor-UMIBA-2026.jpeg" 
            alt="Background" 
            fill 
            style={{ objectFit: 'cover', objectPosition: 'center', filter: 'blur(5px) brightness(0.4)' }}
            unoptimized
          />
        </div>
        
        {/* Dark Red Overlay */}
        <div className="hero-overlay-red" style={{ position: 'absolute', inset: 0, zIndex: -1, opacity: 0.8 }}></div>

        <div className="container" style={{ position: 'relative', zIndex: 1, maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
          
          <div className="fade-up" style={{ opacity: 0, transform: 'translateY(20px)', transition: 'all 0.6s ease' }}>
            <div style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              background: 'rgba(255, 255, 255, 0.15)', 
              backdropFilter: 'blur(10px)', 
              border: '1px solid rgba(255,255,255,0.3)', 
              color: 'white', 
              padding: '6px 20px', 
              fontSize: '0.9rem', 
              fontWeight: 'bold', 
              textTransform: 'uppercase', 
              marginBottom: '20px', 
              borderRadius: '30px', 
              letterSpacing: '1px' 
            }}>
              <i className="ph-fill ph-squares-four" style={{ marginRight: '8px', fontSize: '1.2rem' }}></i>
              Layanan Sistem Informasi
            </div>

            <h1 style={{ 
              color: 'white', 
              fontSize: 'clamp(2rem, 4vw, 3.5rem)', 
              lineHeight: '1.2', 
              marginBottom: '16px', 
              fontWeight: 900, 
              textTransform: 'uppercase', 
              textShadow: '0 4px 10px rgba(0,0,0,0.5)', 
              letterSpacing: '1px' 
            }}>
              Portal Gateway UMIBA
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto 40px auto' }}>
              Silakan pilih sistem informasi yang ingin Anda tuju sesuai dengan peran Anda di Universitas Mitra Bangsa.
            </p>
          </div>

          <div 
            style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
              gap: '24px',
              padding: '10px'
            }}
          >
            {portals.map((item, index) => (
              <a 
                key={item.id}
                href={item.link}
                className="glass-card fade-up portal-card"
                style={{ 
                  textDecoration: 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  background: 'rgba(255, 255, 255, 0.1)', 
                  backdropFilter: 'blur(16px)', 
                  WebkitBackdropFilter: 'blur(16px)', 
                  border: '1px solid rgba(255,255,255,0.2)', 
                  borderRadius: '20px', 
                  padding: '30px 20px', 
                  boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                  transition: 'all 0.4s ease',
                  opacity: 0,
                  transform: 'translateY(20px)'
                }}
                onMouseOver={e => {
                  e.currentTarget.style.transform = 'translateY(-10px)';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.4)';
                  e.currentTarget.style.boxShadow = '0 15px 40px rgba(0,0,0,0.4)';
                }}
                onMouseOut={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                  e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.3)';
                }}
              >
                <div style={{ 
                  background: item.color, 
                  width: '70px', 
                  height: '70px', 
                  borderRadius: '50%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  marginBottom: '20px',
                  boxShadow: `0 8px 20px ${item.color}80`
                }}>
                  <i className={`ph-fill ${item.icon}`} style={{ color: 'white', fontSize: '2.2rem' }}></i>
                </div>
                <h3 style={{ color: 'white', fontSize: '1.25rem', fontWeight: '800', marginBottom: '10px', textTransform: 'uppercase' }}>
                  {item.title}
                </h3>
                <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', lineHeight: '1.5', margin: 0 }}>
                  {item.desc}
                </p>
                
                <div style={{ 
                  marginTop: '24px', 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  gap: '8px',
                  color: 'white',
                  fontSize: '0.9rem',
                  fontWeight: 'bold',
                  background: 'rgba(255,255,255,0.1)',
                  padding: '8px 20px',
                  borderRadius: '30px',
                  transition: 'background 0.3s'
                }} className="portal-btn">
                  Masuk Portal <i className="ph-bold ph-arrow-right"></i>
                </div>
              </a>
            ))}
          </div>

        </div>
      </section>
    </>
  );
}
