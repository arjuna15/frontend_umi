
"use client";
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useLanguage } from '../context/Providers';

export default function Home() {
  const { t, lang } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [newsData, setNewsData] = useState([]);
  const [testiData, setTestiData] = useState([]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % 3);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + 3) % 3);

  useEffect(() => {
    const api = process.env.NEXT_PUBLIC_API_URL || 'https://backend.bikinwebdikitaaja.com/api';
    fetch(`${api}/news`).then(r => r.json()).then(d => setNewsData(d.news || [])).catch(e => console.error(e));
    
    setTestiData([
      { id: 1, image_url: 'https://umiba.ac.id/wp-content/uploads/2024/05/1-1.png' },
      { id: 2, image_url: 'https://umiba.ac.id/wp-content/uploads/2024/05/2-1.png' },
      { id: 3, image_url: 'https://umiba.ac.id/wp-content/uploads/2024/05/3-1.png' },
      { id: 4, image_url: 'https://umiba.ac.id/wp-content/uploads/2024/05/1-2.png' },
      { id: 5, image_url: 'https://umiba.ac.id/wp-content/uploads/2024/05/2-2.png' },
      { id: 6, image_url: 'https://umiba.ac.id/wp-content/uploads/2024/05/3-2.png' }
    ]);

    const slideInterval = setInterval(nextSlide, 5000);
    return () => clearInterval(slideInterval);
  }, []);

  const slideBg = ['/1.jpeg', '/2.jpeg', '/3.jpeg'];

  return (
    <>
      

{/*  ░░░ HERO SECTION ░░░  */}
<section id="beranda" style={{ width: '100%', minHeight: 'calc(100vh - 54px)', position: 'relative', margin: 0, padding: 0 }}>
  <div style={{ position: 'relative', overflow: 'hidden', height: '100%', width: '100%', minHeight: 'calc(100vh - 54px)' }}>
    
    {/*  Slider Backgrounds & Contents  */}
    <div id="heroSlides" style={{ position: 'absolute', inset: '0', zIndex: '1' }}>
      
      {/* SLIDE 1: Magister Manajemen */}
      <div className={`hero-slide hero-content-padding ${currentSlide === 0 ? 'active' : ''}`} style={{ position: 'absolute', inset: 0, opacity: currentSlide === 0 ? 1 : 0, pointerEvents: currentSlide === 0 ? 'auto' : 'none', zIndex: currentSlide === 0 ? 10 : 1, transition: 'opacity 0.8s ease-in-out', display: 'flex', alignItems: 'center', background: 'var(--color-bg)' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', position: 'relative', zIndex: 2, height: '100%' }}>
          <div style={{ maxWidth: '750px', width: '100%', opacity: currentSlide === 0 ? 1 : 0, transform: currentSlide === 0 ? 'translateY(0)' : 'translateY(30px)', transition: 'all 0.8s ease 0.3s', zIndex: 3 }}>
            <h1 style={{ color: 'var(--color-text)', fontSize: 'clamp(1.5rem, 3.5vw, 3rem)', lineHeight: '1.2', marginBottom: '8px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px' }}>
              {lang === "en" ? "New Student Admission 2026/27" : "Penerimaan Mahasiswa Baru TA. 2026/27"}
            </h1>
            <div className="siakad-badge" style={{ display: 'inline-flex', alignItems: 'center', color: 'var(--color-text)', padding: '6px 20px', fontSize: 'clamp(0.85rem, 2vw, 1rem)', fontWeight: '800', textTransform: 'uppercase', marginBottom: '20px', letterSpacing: '1px', borderRadius: '30px' }}>
              <i className="ph ph-fill ph-student" style={{ marginRight: '8px', fontSize: '1.2rem', color: 'var(--apple-red)' }}></i>
              {lang === "en" ? "Master of Management Program" : "Program Studi Magister Manajemen"}
            </div>
            
            {/* Keunggulan Glass Card */}
            <div style={{ background: 'var(--glass-bg)', border: 'var(--glass-border)', borderRadius: '24px', padding: '24px', marginBottom: '24px', boxShadow: 'var(--glass-shadow)' }}>
              <h3 style={{ color: 'var(--color-text)', fontSize: 'clamp(0.95rem, 2vw, 1.1rem)', marginBottom: '16px', borderBottom: '1px solid var(--color-border)', paddingBottom: '8px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>
                {lang === "en" ? "Why study Master's at UMIBA?" : "Keunggulan Kuliah S2 di UMIBA"}
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: "40px", height: "40px", borderRadius: "50%", boxShadow: "inset 2px 2px 4px var(--inset-shadow-dark), inset -2px -2px 4px var(--inset-shadow-light)", background: "var(--liquid-bg)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><i className="ph ph-fill ph-certificate" style={{ color: 'var(--apple-red)', fontSize: '1.25rem' }}></i></div>
                  <div style={{ color: 'var(--color-text)' }}><strong style={{ display: 'block', fontSize: '0.9rem', fontWeight: '700' }}>Dual Certificate</strong><span style={{ fontSize: '0.75rem', color: 'var(--color-muted)' }}>Ijazah & BNSP</span></div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: "40px", height: "40px", borderRadius: "50%", boxShadow: "inset 2px 2px 4px var(--inset-shadow-dark), inset -2px -2px 4px var(--inset-shadow-light)", background: "var(--liquid-bg)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><i className="ph ph-fill ph-laptop" style={{ color: 'var(--apple-red)', fontSize: '1.25rem' }}></i></div>
                  <div style={{ color: 'var(--color-text)' }}><strong style={{ display: 'block', fontSize: '0.9rem', fontWeight: '700' }}>Blended Learning</strong><span style={{ fontSize: '0.75rem', color: 'var(--color-muted)' }}>Online + Offline</span></div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: "40px", height: "40px", borderRadius: "50%", boxShadow: "inset 2px 2px 4px var(--inset-shadow-dark), inset -2px -2px 4px var(--inset-shadow-light)", background: "var(--liquid-bg)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><i className="ph ph-fill ph-users-three" style={{ color: 'var(--apple-red)', fontSize: '1.25rem' }}></i></div>
                  <div style={{ color: 'var(--color-text)' }}><strong style={{ display: 'block', fontSize: '0.9rem', fontWeight: '700' }}>Career Network</strong><span style={{ fontSize: '0.75rem', color: 'var(--color-muted)' }}>Jaringan Luas</span></div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: "40px", height: "40px", borderRadius: "50%", boxShadow: "inset 2px 2px 4px var(--inset-shadow-dark), inset -2px -2px 4px var(--inset-shadow-light)", background: "var(--liquid-bg)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><i className="ph ph-fill ph-wallet" style={{ color: 'var(--apple-red)', fontSize: '1.25rem' }}></i></div>
                  <div style={{ color: 'var(--color-text)' }}><strong style={{ display: 'block', fontSize: '0.9rem', fontWeight: '700' }}>Flexible Tuition</strong><span style={{ fontSize: '0.75rem', color: 'var(--color-muted)' }}>Bisa Diangsur</span></div>
                </div>
              </div>
              
              <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid var(--color-border)' }}>
                <span style={{ color: 'var(--color-text)', fontSize: '0.85rem', fontWeight: 'bold', marginRight: '8px' }}>{lang === "en" ? "Concentrations:" : "Konsentrasi:"}</span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px' }}>
                  {['Manajemen SDM', 'Manajemen Keuangan', 'Manajemen Pemasaran', 'Manajemen Rumah Sakit', 'Manajemen K3'].map(k => (
                    <span key={k} style={{ color: 'var(--color-text)', background: 'var(--liquid-bg)', border: 'var(--glass-border)', boxShadow: 'inset 1px 1px 3px var(--inset-shadow-dark), inset -1px -1px 3px var(--inset-shadow-light)', padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '700' }}>{k}</span>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <a href="/pmb" className="btn btn-primary" style={{ padding: '12px 28px', fontSize: 'clamp(0.9rem, 2vw, 1.1rem)', fontWeight: '800', borderRadius: '50px', textTransform: 'uppercase', transition: 'all 0.3s ease' }}>
                {lang === "en" ? "Register Now" : "DAFTAR SEKARANG"}
              </a>
              <a href="https://wa.me/62811870114" target="_blank" style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--color-text)', textDecoration: 'none' }}>
                <div style={{ background: 'white', padding: '8px', borderRadius: '50%', display: 'flex', boxShadow: 'var(--glass-shadow)' }}>
                  <i className="ph ph-fill ph-whatsapp-logo" style={{ color: '#25D366', fontSize: '1.4rem' }}></i>
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-muted)' }}>{lang === "en" ? "Registration Info" : "Informasi Pendaftaran"}</div>
                  <div style={{ fontSize: 'clamp(1.1rem, 2.5vw, 1.3rem)', fontWeight: 'bold', letterSpacing: '1px' }}>0811 870 114</div>
                </div>
              </a>
            </div>
          </div>
          <div className="hero-model-container" style={{ position: 'absolute', right: '0', bottom: 0, height: '100%', width: '45%', display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end', pointerEvents: 'none', zIndex: 1 }}>
            <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {/* Neumorphic Avatar Backdrop Circle */}
              <div className="avatar-circle-bg" style={{ position: 'absolute', width: '380px', height: '380px', borderRadius: '50%', background: 'var(--liquid-bg)', boxShadow: 'inset 8px 8px 16px var(--inset-shadow-dark), inset -8px -8px 16px var(--inset-shadow-light), 4px 4px 12px rgba(0,0,0,0.05)', bottom: '10%', right: '10%', zIndex: 0 }}></div>
              <div style={{ position: 'relative', width: '100%', height: '100%', zIndex: 1 }}>
                <Image src="/nobg1.png" alt="Student Model 1" fill style={{ objectFit: 'contain', objectPosition: 'bottom right' }} priority />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SLIDE 2: KIP-K */}
      <div className={`hero-slide hero-content-padding ${currentSlide === 1 ? 'active' : ''}`} style={{ position: 'absolute', inset: 0, opacity: currentSlide === 1 ? 1 : 0, pointerEvents: currentSlide === 1 ? 'auto' : 'none', zIndex: currentSlide === 1 ? 10 : 1, transition: 'opacity 0.8s ease-in-out', display: 'flex', alignItems: 'center', background: 'var(--color-bg)' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', position: 'relative', zIndex: 2, height: '100%' }}>
          <div style={{ maxWidth: '750px', width: '100%', opacity: currentSlide === 1 ? 1 : 0, transform: currentSlide === 1 ? 'translateY(0)' : 'translateY(30px)', transition: 'all 0.8s ease 0.3s', zIndex: 3 }}>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
              <span className="siakad-badge" style={{ display: 'inline-flex', alignItems: 'center', color: 'var(--color-text)', padding: '6px 16px', fontSize: 'clamp(0.8rem, 2vw, 0.95rem)', fontWeight: '800', textTransform: 'uppercase', borderRadius: '30px', letterSpacing: '1px' }}>
                TAHUN AKADEMIK 2026/2027
              </span>
              <span className="siakad-badge" style={{ display: 'inline-flex', alignItems: 'center', border: '1px solid rgba(196, 30, 58, 0.25)', color: 'var(--apple-red)', padding: '6px 16px', fontSize: 'clamp(0.8rem, 2vw, 0.95rem)', fontWeight: '800', textTransform: 'uppercase', borderRadius: '30px', letterSpacing: '1px', animation: 'pulse 2s infinite', boxShadow: 'inset 2px 2px 4px var(--inset-shadow-dark), inset -2px -2px 4px var(--inset-shadow-light), 0 0 10px rgba(196, 30, 58, 0.15)' }}>
                <i className="ph ph-fill ph-warning-circle" style={{ marginRight: '6px', fontSize: '1.1rem' }}></i> KUOTA TERBATAS!
              </span>
            </div>

            <h1 style={{ color: 'var(--color-text)', fontSize: 'clamp(1.5rem, 3.5vw, 3rem)', lineHeight: '1.2', marginBottom: '4px', fontWeight: 900, textTransform: 'uppercase' }}>
              {lang === "en" ? "NEW STUDENT ADMISSION" : "PENERIMAAN MAHASISWA BARU"}
            </h1>
            <h2 style={{ color: 'var(--apple-red)', fontSize: 'clamp(1.3rem, 3vw, 2.5rem)', lineHeight: '1.2', marginBottom: '16px', fontWeight: 900, textTransform: 'uppercase' }}>
               {lang === "en" ? "KIP-K SCHOLARSHIP TRACK" : "JALUR BEASISWA KIP-K"}
            </h2>
            <div style={{ background: 'var(--glass-bg)', border: 'var(--glass-border)', borderRadius: '24px', padding: '24px', marginBottom: '24px', boxShadow: 'var(--glass-shadow)' }}>
              <h3 style={{ color: 'var(--color-text)', fontSize: 'clamp(0.95rem, 2vw, 1.1rem)', fontWeight: '800', marginBottom: '16px', borderBottom: '1px solid var(--color-border)', paddingBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                {lang === "en" ? "QUALITY & FREE EDUCATION AT UMIBA" : "KULIAH BERKUALITAS & GRATIS DI UMIBA"}
              </h3>
              <ul style={{ color: 'var(--color-text)', listStyle: 'none', padding: 0, margin: 0, fontSize: 'clamp(0.85rem, 2vw, 0.95rem)', lineHeight: '1.5', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><div style={{ width: "24px", height: "24px", borderRadius: "50%", boxShadow: "inset 2px 2px 4px var(--inset-shadow-dark), inset -2px -2px 4px var(--inset-shadow-light)", background: "var(--liquid-bg)", display: "flex", alignItems: 'center', justifyContent: "center", flexShrink: 0 }}><i className="ph ph-bold ph-check" style={{ color: 'var(--apple-red)', fontSize: '0.9rem' }}></i></div> <span style={{ color: 'var(--color-text)' }}>Ter-Akreditasi <b style={{ fontWeight: '800' }}>BAIK SEKALI</b></span></li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><div style={{ width: "24px", height: "24px", borderRadius: "50%", boxShadow: "inset 2px 2px 4px var(--inset-shadow-dark), inset -2px -2px 4px var(--inset-shadow-light)", background: "var(--liquid-bg)", display: "flex", alignItems: 'center', justifyContent: "center", flexShrink: 0 }}><i className="ph ph-bold ph-check" style={{ color: 'var(--apple-red)', fontSize: '0.9rem' }}></i></div> <span style={{ color: 'var(--color-text)' }}>Kuliah <b style={{ fontWeight: '800' }}>Tanpa Biaya</b>, Hidup Lebih Tenang</span></li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><div style={{ width: "24px", height: "24px", borderRadius: "50%", boxShadow: "inset 2px 2px 4px var(--inset-shadow-dark), inset -2px -2px 4px var(--inset-shadow-light)", background: "var(--liquid-bg)", display: "flex", alignItems: 'center', justifyContent: "center", flexShrink: 0 }}><i className="ph ph-bold ph-check" style={{ color: 'var(--apple-red)', fontSize: '0.9rem' }}></i></div> <span style={{ color: 'var(--color-text)' }}>Lulusan SMA/SMK/MA <b style={{ fontWeight: '800' }}>2024, 2025, 2026</b></span></li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><div style={{ width: "24px", height: "24px", borderRadius: "50%", boxShadow: "inset 2px 2px 4px var(--inset-shadow-dark), inset -2px -2px 4px var(--inset-shadow-light)", background: "var(--liquid-bg)", display: "flex", alignItems: 'center', justifyContent: "center", flexShrink: 0 }}><i className="ph ph-bold ph-check" style={{ color: 'var(--apple-red)', fontSize: '0.9rem' }}></i></div> <span style={{ color: 'var(--color-text)' }}>Pendaftaran <b style={{ fontWeight: '800' }}>Mudah & Transparan</b></span></li>
              </ul>
            </div>

            <a href="https://wa.me/62811870114" target="_blank" className="btn btn-neu" style={{ padding: '12px 28px', borderRadius: '50px', display: 'inline-flex', alignItems: 'center', gap: '12px', textDecoration: 'none', transition: 'all 0.3s ease' }}>
              <i className="ph ph-fill ph-whatsapp-logo" style={{ color: '#25D366', fontSize: '2.2rem' }}></i>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Informasi Pendaftaran</div>
                <div style={{ fontSize: 'clamp(1.1rem, 2.5vw, 1.3rem)', fontWeight: 900, color: 'var(--color-text)', letterSpacing: '1px', lineHeight: '1' }}>0811 870 114</div>
              </div>
            </a>
          </div>
          <div className="hero-model-container" style={{ position: 'absolute', right: '0', bottom: 0, height: '100%', width: '45%', display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end', pointerEvents: 'none', zIndex: 1 }}>
            <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {/* Neumorphic Avatar Backdrop Circle */}
              <div className="avatar-circle-bg" style={{ position: 'absolute', width: '380px', height: '380px', borderRadius: '50%', background: 'var(--liquid-bg)', boxShadow: 'inset 8px 8px 16px var(--inset-shadow-dark), inset -8px -8px 16px var(--inset-shadow-light), 4px 4px 12px rgba(0,0,0,0.05)', bottom: '10%', right: '10%', zIndex: 0 }}></div>
              <div style={{ position: 'relative', width: '100%', height: '100%', zIndex: 1 }}>
                <Image src="/nobg2.png" alt="Student Model 2" fill style={{ objectFit: 'contain', objectPosition: 'bottom right' }} priority />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SLIDE 3: Penerimaan Umum S1 S2 */}
      <div className={`hero-slide hero-content-padding ${currentSlide === 2 ? 'active' : ''}`} style={{ position: 'absolute', inset: 0, opacity: currentSlide === 2 ? 1 : 0, pointerEvents: currentSlide === 2 ? 'auto' : 'none', zIndex: currentSlide === 2 ? 10 : 1, transition: 'opacity 0.8s ease-in-out', display: 'flex', alignItems: 'center', background: 'var(--color-bg)' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', position: 'relative', zIndex: 2, height: '100%' }}>
          <div style={{ maxWidth: '750px', width: '100%', opacity: currentSlide === 2 ? 1 : 0, transform: currentSlide === 2 ? 'translateY(0)' : 'translateY(30px)', transition: 'all 0.8s ease 0.3s', zIndex: 3 }}>
            <span className="siakad-badge" style={{ display: 'inline-flex', alignItems: 'center', color: 'var(--color-text)', padding: '6px 16px', fontSize: 'clamp(0.8rem, 2vw, 0.95rem)', fontWeight: '800', textTransform: 'uppercase', marginBottom: '16px', borderRadius: '30px', letterSpacing: '1px' }}>
              TAHUN AKADEMIK 2026/2027
            </span>

            <h1 style={{ color: 'var(--color-text)', fontSize: 'clamp(1.5rem, 3.5vw, 3rem)', lineHeight: '1.2', marginBottom: '4px', fontWeight: 900, textTransform: 'uppercase' }}>
              PENERIMAAN MAHASISWA BARU
            </h1>
            <div style={{ marginBottom: '24px' }}>
              <div className="neu-card" style={{ 
                display: 'inline-flex', 
                flexDirection: 'column',
                padding: '12px 28px',
                borderRadius: '16px',
                margin: 0,
                alignItems: 'center'
              }}>
                <h2 style={{ 
                  color: 'var(--apple-red)', 
                  fontSize: 'clamp(1.2rem, 2.5vw, 1.8rem)', 
                  lineHeight: '1.4', 
                  fontWeight: 900, 
                  textTransform: 'uppercase', 
                  margin: 0,
                }}>
                  UNIVERSITAS MITRA BANGSA
                </h2>
                <div style={{
                  height: '4px',
                  background: 'var(--apple-red)',
                  borderRadius: '2px',
                  marginTop: '4px',
                  width: '100%',
                  animation: 'expandWidth 2s ease-in-out infinite alternate'
                }}></div>
              </div>
            </div>

            <div style={{ background: 'var(--glass-bg)', border: 'var(--glass-border)', borderRadius: '24px', padding: '24px', marginBottom: '24px', boxShadow: 'var(--glass-shadow)' }}>
              <h3 style={{ color: 'var(--color-text)', fontSize: 'clamp(0.95rem, 2vw, 1.1rem)', fontWeight: '800', marginBottom: '16px', borderBottom: '1px solid var(--color-border)', paddingBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                {lang === "en" ? "Available Study Programs:" : "Program Studi Pilihan:"}
              </h3>
              <div className="prodi-grid">
                {['(S2) Magister Manajemen', '(S1) Manajemen', '(S1) Ilmu Aktuaria', '(S1) Ilmu Komputer', '(S1) Hukum', '(S1) Sistem & Teknologi Informasi'].map((prodi, idx) => (
                  <div key={idx} className="prodi-card">
                    <div style={{ width: "24px", height: "24px", borderRadius: "50%", boxShadow: "inset 2px 2px 4px var(--inset-shadow-dark), inset -2px -2px 4px var(--inset-shadow-light)", background: "var(--liquid-bg)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><i className="ph ph-bold ph-check" style={{ color: 'var(--apple-red)', fontSize: '0.9rem' }}></i></div>
                    <span style={{ color: 'var(--color-text)', fontWeight: 700 }}>{prodi}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <a href="/pmb" className="btn btn-neu" style={{ padding: '12px 28px', fontSize: 'clamp(0.9rem, 2vw, 1.1rem)', fontWeight: '800', borderRadius: '50px', textTransform: 'uppercase', transition: 'all 0.3s ease' }}>
                {lang === "en" ? "Register Now" : "DAFTAR SEKARANG"}
              </a>
              <a href="https://wa.me/62811870114" target="_blank" style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--color-text)', textDecoration: 'none' }}>
                <div style={{ background: 'white', padding: '8px', borderRadius: '50%', display: 'flex', boxShadow: 'var(--glass-shadow)' }}>
                  <i className="ph ph-fill ph-whatsapp-logo" style={{ color: '#25D366', fontSize: '1.4rem' }}></i>
                </div>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-muted)' }}>{lang === "en" ? "Registration Info" : "Informasi Pendaftaran"}</div>
                  <div style={{ fontSize: 'clamp(1.1rem, 2.5vw, 1.3rem)', fontWeight: 'bold', color: 'var(--color-text)', letterSpacing: '1px' }}>0811 870 114</div>
                </div>
              </a>
            </div>
          </div>
          <div className="hero-model-container" style={{ position: 'absolute', right: '0', bottom: 0, height: '100%', width: '45%', display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end', pointerEvents: 'none', zIndex: 1 }}>
            <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {/* Neumorphic Avatar Backdrop Circle */}
              <div className="avatar-circle-bg" style={{ position: 'absolute', width: '380px', height: '380px', borderRadius: '50%', background: 'var(--liquid-bg)', boxShadow: 'inset 8px 8px 16px var(--inset-shadow-dark), inset -8px -8px 16px var(--inset-shadow-light), 4px 4px 12px rgba(0,0,0,0.05)', bottom: '10%', right: '10%', zIndex: 0 }}></div>
              <div style={{ position: 'relative', width: '100%', height: '100%', zIndex: 1 }}>
                <Image src="/nobg3.png" alt="Student Model 3" fill style={{ objectFit: 'contain', objectPosition: 'bottom right' }} priority />
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
    {/*  Slider Controls  */}
    <button className="hero-arrow prev" aria-label="Previous Slide" onClick={prevSlide}>
      <i className="ph ph-bold ph-caret-left"></i>
    </button>
    <button className="hero-arrow next" aria-label="Next Slide" onClick={nextSlide}>
      <i className="ph ph-bold ph-caret-right"></i>
    </button>
    <div className="hero-controls">
      {slideBg.map((_, index) => (
        <button key={index} className={`hero-dot ${index === currentSlide ? 'active' : ''}`} onClick={() => setCurrentSlide(index)} aria-label={`Slide ${index + 1}`}></button>
      ))}
    </div>
  </div>
</section>

{/*  ░░░ QUICK STATS STRIP ░░░  */}
<section style={{ marginTop: '40px', position: 'relative', zIndex: '10' }}>
  <div className="container">
    <div className="neu-card grid grid-4 fade-up" style={{ background: "var(--glass-bg)", boxShadow: "var(--glass-shadow)", border: "none", borderRadius: "16px", textAlign: 'center', padding: 'var(--space-5)' }}>
      <div>
        <i className="ph ph-duotone ph-users-three" style={{ fontSize: '3rem', color: 'var(--umiba-red)', marginBottom: '12px' }}></i>
        <h2 style={{ margin: '0' }} className="text-gradient">5000+</h2>
        <p style={{ margin: '0', fontSize: '1.05rem', fontWeight: '500' }}>{t("home.mahasiswa_aktif")}</p>
      </div>
      <div>
        <i className="ph ph-duotone ph-chalkboard-teacher" style={{ fontSize: '3rem', color: 'var(--umiba-red)', marginBottom: '12px' }}></i>
        <h2 style={{ margin: '0' }} className="text-gradient">150+</h2>
        <p style={{ margin: '0', fontSize: '1.05rem', fontWeight: '500' }}>{t("home.dosen_berkualitas")}</p>
      </div>
      <div>
        <i className="ph ph-duotone ph-books" style={{ fontSize: '3rem', color: 'var(--umiba-red)', marginBottom: '12px' }}></i>
        <h2 style={{ margin: '0' }} className="text-gradient">7</h2>
        <p style={{ margin: '0', fontSize: '1.05rem', fontWeight: '500' }}>{t("home.program_studi")}</p>
      </div>
      <div>
        <i className="ph ph-duotone ph-medal" style={{ fontSize: '3rem', color: 'var(--umiba-red)', marginBottom: '12px' }}></i>
        <h2 style={{ margin: '0' }} className="text-gradient">30+</h2>
        <p style={{ margin: '0', fontSize: '1.05rem', fontWeight: '500' }}>{t("home.tahun_berpengalaman")}</p>
      </div>
    </div>
  </div>
</section>

{/*  ░░░ SAMBUTAN REKTOR ░░░  */}
<section id="sambutan" style={{ padding: 'var(--space-8) 0' }}>
  <div className="container grid grid-2" style={{ alignItems: 'center' }}>
    <div className="neu-card fade-up" style={{ background: "var(--glass-bg)", boxShadow: "var(--glass-shadow)", border: "none", borderRadius: "16px", padding: '0', overflow: 'hidden', position: 'relative', maxWidth: '400px', margin: '0 auto' }}>
      <Image src="https://umiba.ac.id/wp-content/uploads/2026/05/rektor-UMIBA-2026.jpeg" alt="Rektor UMIBA" width={400} height={600} style={{ width: '100%', aspectRatio: '3/4', objectFit: 'cover', objectPosition: 'top', display: 'block' }} onError={(e)=>{e.target.src='https://picsum.photos/400/600?random=A'}}/>
      <div className="neu-card" style={{ background: "var(--glass-bg)", boxShadow: "var(--glass-shadow)", border: "none", borderRadius: "16px", position: 'absolute', bottom: 'var(--space-4)', left: 'var(--space-4)', right: 'var(--space-4)', padding: 'var(--space-3)' }}>
        <h3 style={{ margin: '0', fontSize: '1.2rem' }}>{t("home.sambutan_rektor")}</h3>
        <p style={{ margin: '0', fontSize: '0.9rem' }}>{t("home.quote_rektor")}</p>
      </div>
    </div>
    <div className="fade-up" style={{ paddingLeft: 'var(--space-4)' }}>
      <span className="text-red" style={{ fontWeight: '600', textTransform: 'uppercase' }}>{t("home.pesan_pimpinan")}</span>
      <h2>{t("home.selamat_datang")}</h2>
      <p>{t("home.sambutan_p1")}</p>
      <p>{t("home.sambutan_p2")}</p>
      <div className="grid grid-2" style={{ marginTop: 'var(--space-4)' }}>
        <div className="neu-card" style={{ background: "var(--glass-bg)", boxShadow: "var(--glass-shadow)", border: "none", borderRadius: "16px", padding: 'var(--space-3)' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>{t("home.kurikulum_modern")}</h3>
          <p style={{ fontSize: '0.9rem', margin: '0' }}>{t("home.kurikulum_desc")}</p>
        </div>
        <div className="neu-card" style={{ background: "var(--glass-bg)", boxShadow: "var(--glass-shadow)", border: "none", borderRadius: "16px", padding: 'var(--space-3)' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>{t("home.kemitraan_industri")}</h3>
          <p style={{ fontSize: '0.9rem', margin: '0' }}>{t("home.kemitraan_desc")}</p>
        </div>
      </div>
    </div>
  </div>
</section>

{/*  ░░░ FAKULTAS & PRODI ░░░  */}
<section id="fakultas" style={{ padding: 'var(--space-8) 0', position: 'relative' }}>
  <div className="container">
    <div style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }} className="fade-up">
      <span className="text-red" style={{ fontWeight: '600', textTransform: 'uppercase' }}>{t("home.pilihan_studi")}</span>
      <h2>{t("home.fakultas_prodi")}</h2>
      <p style={{ maxWidth: '600px', margin: '0 auto' }}>{t("home.pilih_prodi_desc")}</p>
    </div>
    
    <div className="grid grid-3">
      {/*  Card 1  */}
      <div className="neu-card fade-up" style={{ background: "var(--glass-bg)", boxShadow: "var(--glass-shadow)", border: "none", borderRadius: "16px" }}>
        <div style={{ background: 'var(--umiba-red-alpha)', width: '64px', height: '64px', borderRadius: 'var(--radius-full)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 'var(--space-4)' }}>
          <i className="ph ph-duotone ph-briefcase" style={{ fontSize: '2.2rem', color: 'var(--umiba-red)' }}></i>
        </div>
        <div style={{ minHeight: '240px' }}>
          <h3 style={{ fontSize: '1.4rem' }}>{t("home.fak_manajemen")}</h3>
          <p>{t("home.fak_manajemen_desc")}</p>
        </div>
        <ul style={{ listStyle: 'none', padding: '0', marginBottom: 'var(--space-4)', color: 'var(--color-muted)' }}>
          <li style={{ marginBottom: '8px', display: 'flex', alignItems: 'center' }}><i className="ph ph-fill ph-check-circle" style={{ color: 'var(--umiba-red)', marginRight: '10px', fontSize: '1.2rem' }}></i> S1 Manajemen</li>
          <li style={{ marginBottom: '8px', display: 'flex', alignItems: 'center' }}><i className="ph ph-fill ph-check-circle" style={{ color: 'var(--umiba-red)', marginRight: '10px', fontSize: '1.2rem' }}></i> S2 Magister Manajemen</li>
        </ul>
        <a href="/akademik?tab=manajemen" className="btn btn-neu" style={{ width: '100%', marginTop: 'auto' }}>{t("home.lihat_fakultas")}</a>
      </div>
      
      {/*  Card 2  */}
      <div className="neu-card fade-up" style={{ background: "var(--glass-bg)", boxShadow: "var(--glass-shadow)", border: "none", borderRadius: "16px", transitionDelay: '0.1s' }}>
        <div style={{ background: 'var(--umiba-red-alpha)', width: '64px', height: '64px', borderRadius: 'var(--radius-full)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 'var(--space-4)' }}>
          <i className="ph ph-duotone ph-scales" style={{ fontSize: '2.2rem', color: 'var(--umiba-red)' }}></i>
        </div>
        <div style={{ minHeight: '240px' }}>
          <h3 style={{ fontSize: '1.4rem' }}>{t("home.fak_hukum")}</h3>
          <p>{t("home.fak_hukum_desc")}</p>
        </div>
        <ul style={{ listStyle: 'none', padding: '0', marginBottom: 'var(--space-4)', color: 'var(--color-muted)' }}>
          <li style={{ marginBottom: '8px', display: 'flex', alignItems: 'center' }}><i className="ph ph-fill ph-check-circle" style={{ color: 'var(--umiba-red)', marginRight: '10px', fontSize: '1.2rem' }}></i> S1 Ilmu Hukum</li>
        </ul>
        <a href="/akademik?tab=hukum" className="btn btn-neu" style={{ width: '100%', marginTop: 'auto' }}>{t("home.lihat_fakultas")}</a>
      </div>
      
      {/*  Card 3  */}
      <div className="neu-card fade-up" style={{ background: "var(--glass-bg)", boxShadow: "var(--glass-shadow)", border: "none", borderRadius: "16px", transitionDelay: '0.2s' }}>
        <div style={{ background: 'var(--umiba-red-alpha)', width: '64px', height: '64px', borderRadius: 'var(--radius-full)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 'var(--space-4)' }}>
          <i className="ph ph-duotone ph-laptop" style={{ fontSize: '2.2rem', color: 'var(--umiba-red)' }}></i>
        </div>
        <div style={{ minHeight: '240px' }}>
          <h3 style={{ fontSize: '1.4rem' }}>{t("home.fak_ti")}</h3>
          <p>{t("home.fak_ti_desc")}</p>
        </div>
        <ul style={{ listStyle: 'none', padding: '0', marginBottom: 'var(--space-4)', color: 'var(--color-muted)' }}>
          <li style={{ marginBottom: '8px', display: 'flex', alignItems: 'center' }}><i className="ph ph-fill ph-check-circle" style={{ color: 'var(--umiba-red)', marginRight: '10px', fontSize: '1.2rem' }}></i> S1 Ilmu Komputer</li>
          <li style={{ marginBottom: '8px', display: 'flex', alignItems: 'center' }}><i className="ph ph-fill ph-check-circle" style={{ color: 'var(--umiba-red)', marginRight: '10px', fontSize: '1.2rem' }}></i> S1 Sistem &amp; TI</li>
          <li style={{ marginBottom: '8px', display: 'flex', alignItems: 'center' }}><i className="ph ph-fill ph-check-circle" style={{ color: 'var(--umiba-red)', marginRight: '10px', fontSize: '1.2rem' }}></i> S1 Ilmu Aktuaria</li>
        </ul>
        <a href="/akademik?tab=it" className="btn btn-neu" style={{ width: '100%', marginTop: 'auto' }}>{t("home.lihat_fakultas")}</a>
      </div>
    </div>
  </div>
</section>

{/*  ░░░ AKREDITASI ░░░  */}
<section id="akreditasi" style={{ padding: 'var(--space-8) 0', background: "var(--color-bg)" }}>
  <div className="container">
    <div style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }} className="fade-up">
      <span className="text-red" style={{ fontWeight: '600', textTransform: 'uppercase' }}>{t("home.kepercayaan_kualitas")}</span>
      <h2>{t("home.sertifikat_akreditasi")}</h2>
    </div>
    <div className="cert-slider fade-up" style={{ marginTop: 'var(--space-5)' }}>
      <div className="cert-slide">
        <Image src="https://umiba.ac.id/wp-content/uploads/2026/05/Serifikat-Lamsama-BaikAKTUARIA-768x543.webp" alt="Akreditasi S1 Ilmu Aktuaria" width={768} height={543} style={{ width: '100%', height: 'auto' }} />
      </div>
      <div className="cert-slide">
        <Image src="https://umiba.ac.id/wp-content/uploads/2025/05/Sertifikat-UMIBA_page-0001-768x543.jpg" alt="Akreditasi Institusi UMIBA" width={768} height={543} style={{ width: '100%', height: 'auto' }} />
      </div>
      <div className="cert-slide">
        <Image src="https://umiba.ac.id/wp-content/uploads/2024/05/Sertifikat-Akreditasi-S1-Manajemen-UMIBA-768x543.jpg" alt="Akreditasi S1 Manajemen" width={768} height={543} style={{ width: '100%', height: 'auto' }} />
      </div>
      <div className="cert-slide">
        <Image src="https://umiba.ac.id/wp-content/uploads/2025/01/WhatsApp-Image-2025-01-23-at-3.58.34-PM-768x536.jpeg" alt="Akreditasi S2 Manajemen" width={768} height={536} style={{ width: '100%', height: 'auto' }} />
      </div>
      <div className="cert-slide">
        <Image src="https://umiba.ac.id/wp-content/uploads/2025/05/Sertifikat_RPL_S2_2025-2026_Ganjil-768x502.jpg" alt="Sertifikat RPL S2" width={768} height={502} style={{ width: '100%', height: 'auto' }} />
      </div>
    </div>
    <input type="range" className="custom-scrollbar" data-target=".cert-slider" min="0" max="100" defaultValue="0" />
  </div>
</section>

{/*  ░░░ BERITA TERBARU ░░░  */}
<section id="berita" style={{ padding: 'var(--space-8) 0' }}>
  <div className="container">
    <div className="flex fade-up" style={{ justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 'var(--space-6)' }}>
      <div>
        <span className="text-red" style={{ fontWeight: '600', textTransform: 'uppercase' }}>{t("home.kabar_kampus")}</span>
        <h2 style={{ marginBottom: '0' }}>{t("home.berita_pengumuman")}</h2>
      </div>
      <a href="/berita" className="btn btn-neu">{t("home.lihat_semua")}</a>
    </div>
    <div className="grid grid-3 scroll-mobile">
      {newsData && newsData.length > 0 ? (
        newsData.map((newsItem, index) => (
          <div key={newsItem.id} className="neu-card fade-up" style={{ background: "var(--glass-bg)", boxShadow: "var(--glass-shadow)", border: "none", borderRadius: "16px", transitionDelay: `${index * 0.1}s`, padding: 0, overflow: 'hidden' }}>
            <div style={{ background: 'var(--color-muted)', height: '200px', overflow: 'hidden' }}>
               <Image src={newsItem.image_url} width={400} height={300} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={newsItem.title}/>
            </div>
            <div style={{ padding: 'var(--space-4)' }}>
              <p style={{ fontSize: '0.8rem', marginBottom: '8px', color: 'var(--slate-500)' }}>{newsItem.date}</p>
              <h3 style={{ fontSize: '1.1rem', margin: 0, lineHeight: '1.4' }}>{newsItem.title}</h3>
            </div>
          </div>
        ))
      ) : (
        <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', background: "var(--color-bg)", borderRadius: '16px' }}>
          <p style={{ color: '#64748b', fontSize: '1.1rem', margin: 0 }}>{t("home.belum_ada_berita")}</p>
        </div>
      )}
    </div>
  </div>
</section>

{/*  ░░░ LOKASI KAMPUS ░░░  */}
<section id="lokasi" style={{ padding: 'var(--space-8) 0', background: "var(--color-bg)" }}>
  <div className="container fade-up">
    <div style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }}>
      <h2 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>{t("home.lokasi_kampus")}</h2>
      <p style={{ color: 'var(--slate-600)', fontSize: '1.1rem' }}>{t("home.lokasi_desc")}</p>
    </div>
    <div className="grid grid-2" style={{ gap: 'var(--space-6)' }}>
      {/*  Kampus Pasar Minggu  */}
      <div className="neu-card" style={{ background: "var(--glass-bg)", boxShadow: "var(--glass-shadow)", border: "none", borderRadius: "16px", padding: 'var(--space-4)' }}>
        <h3 style={{ color: 'var(--umiba-red-dark)', marginBottom: 'var(--space-2)' }}><i className="ph ph-fill ph-map-pin" style={{ color: 'var(--umiba-red)', marginRight: '8px' }}></i>{t("home.kampus_pasar_minggu")}</h3>
        <p style={{ color: 'var(--slate-600)', marginBottom: 'var(--space-4)', lineHeight: '1.5', fontSize: '0.95rem' }}>
          {t("home.alamat_pm")}
        </p>
        <div style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', height: '300px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
          <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3965.8021859604723!2d106.84124877521778!3d-6.289711293699269!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69eda4b9cb7a3b%3A0xa480a640215e1b50!2sUniversitas%20Mitra%20Bangsa%20Jakarta%20(UMIBA)!5e0!3m2!1sid!2sid!4v1780999630946!5m2!1sid!2sid" width="100%" height="100%" style={{ border: '0' }} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
        </div>
      </div>
      
      {/*  Kampus Bintaro  */}
      <div className="neu-card" style={{ background: "var(--glass-bg)", boxShadow: "var(--glass-shadow)", border: "none", borderRadius: "16px", padding: 'var(--space-4)' }}>
        <h3 style={{ color: 'var(--umiba-red-dark)', marginBottom: 'var(--space-2)' }}><i className="ph ph-fill ph-map-pin" style={{ color: 'var(--umiba-red)', marginRight: '8px' }}></i>{t("home.kampus_bintaro")}</h3>
        <p style={{ color: 'var(--slate-600)', marginBottom: 'var(--space-4)', lineHeight: '1.5', fontSize: '0.95rem' }}>
          {t("home.alamat_bintaro")}
        </p>
        <div style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', height: '300px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
          <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7931.8354716433105!2d106.76112597521758!3d-6.274546893714218!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f029893119b5%3A0x83f8e2bcc968c64a!2sUniversitas%20Mitra%20Bangsa%20Bintaro%20(UMIBA)!5e0!3m2!1sid!2sid!4v1780999658632!5m2!1sid!2sid" width="100%" height="100%" style={{ border: '0' }} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
        </div>
      </div>
    </div>
  </div>
</section>

{/*  ░░░ PMB CTA ░░░  */}
<section style={{ padding: 'var(--space-8) 0' }}>
  <div className="container">
    <div className="neu-card grid grid-2 fade-up" style={{ background: "var(--glass-bg)", boxShadow: "var(--glass-shadow)", border: "none", borderRadius: "16px", alignItems: 'center', background: 'var(--glass-bg)' }}>
      <div>
        <span className="text-red" style={{ fontWeight: '600', textTransform: 'uppercase' }}>{t("home.pendaftaran_dibuka")}</span>
        <h2 style={{ marginTop: '8px' }}>{t("home.penerimaan_maba")}</h2>
        <p>{t("home.penerimaan_desc")}</p>
      </div>
      <div className="flex-center" style={{ gap: 'var(--space-3)', flexWrap: 'wrap' }}>
        <a href="/pmb" className="btn btn-primary">{t("home.daftar_online")}</a>
        <a href="https://wa.me/62811870114" target="_blank" className="btn btn-neu">{t("home.whatsapp_kami")}</a>
      </div>
    </div>
  </div>
</section>

{/*  ░░░ LIPUTAN MEDIA ░░░  */}
<section style={{ padding: 'var(--space-8) 0', background: "var(--color-bg)" }}>
  <div className="container">
    <div style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }} className="fade-up">
      <span className="text-red" style={{ fontWeight: '600', textTransform: 'uppercase' }}>{t("home.kabar_terkini")}</span>
      <h2>{t("home.liputan_media")}</h2>
    </div>
    <div className="grid grid-4 scroll-mobile">
      <div className="neu-card media-card fade-up" style={{ background: "var(--glass-bg)", boxShadow: "var(--glass-shadow)", border: "none", borderRadius: "16px" }}>
        <div className="media-img-wrap">
          <Image src="https://umiba.ac.id/wp-content/uploads/2025/12/umiba-4pilar-1536x938-1.jpeg" alt="Berita 1" width={1536} height={938} style={{ width: '100%', height: 'auto' }} />
        </div>
        <div className="media-content">
          <div className="media-source"><i className="ph ph-fill ph-newspaper"></i> kompaskampus.id</div>
          <h3 style={{ fontSize: '1.05rem', lineHeight: '1.4', margin: '0' }}>UMIBA Gelar Seminar Kebangsaan, Teguhkan Budaya Kampus Berbasis 4 Pilar Kebangsaan</h3>
        </div>
      </div>
      <div className="neu-card media-card fade-up" style={{ background: "var(--glass-bg)", boxShadow: "var(--glass-shadow)", border: "none", borderRadius: "16px", transitionDelay: '0.1s' }}>
        <div className="media-img-wrap">
          <Image src="https://umiba.ac.id/wp-content/uploads/2025/10/serba-serbi_155621_big.webp" alt="Berita 2" width={800} height={600} style={{ width: '100%', height: 'auto' }} />
        </div>
        <div className="media-content">
          <div className="media-source"><i className="ph ph-fill ph-newspaper"></i> wartaekonomi.co.id</div>
          <h3 style={{ fontSize: '1.05rem', lineHeight: '1.4', margin: '0' }}>IKADIM dan Universitas Mitra Bangsa Teken MoU untuk Tingkatkan Kualitas Tri Dharma Perguruan Tinggi</h3>
        </div>
      </div>
      <div className="neu-card media-card fade-up" style={{ background: "var(--glass-bg)", boxShadow: "var(--glass-shadow)", border: "none", borderRadius: "16px", transitionDelay: '0.2s' }}>
        <div className="media-img-wrap">
          <Image src="https://umiba.ac.id/wp-content/uploads/2025/10/medium_tscom_news_photo_1759914601.jpg" alt="Berita 3" width={800} height={600} style={{ width: '100%', height: 'auto' }} />
        </div>
        <div className="media-content">
          <div className="media-source"><i className="ph ph-fill ph-newspaper"></i> teropongsenayan.com</div>
          <h3 style={{ fontSize: '1.05rem', lineHeight: '1.4', margin: '0' }}>IKADIM dan Universitas Mitra Bangsa Teken MoU untuk Tingkatkan Kualitas Tri Dharma Perguruan Tinggi</h3>
        </div>
      </div>
      <div className="neu-card media-card fade-up" style={{ background: "var(--glass-bg)", boxShadow: "var(--glass-shadow)", border: "none", borderRadius: "16px", transitionDelay: '0.3s' }}>
        <div className="media-img-wrap">
          <Image src="https://umiba.ac.id/wp-content/uploads/2025/08/umiba-upacara.jpg" alt="Berita 4" width={800} height={600} style={{ width: '100%', height: 'auto' }} />
        </div>
        <div className="media-content">
          <div className="media-source"><i className="ph ph-fill ph-newspaper"></i> newsdetik.co</div>
          <h3 style={{ fontSize: '1.05rem', lineHeight: '1.4', margin: '0' }}>Universitas Mitra Bangsa Selenggarakan Gebyar Kemerdekaan HUT-RI Ke-80</h3>
        </div>
      </div>
      
      <div className="neu-card media-card fade-up" style={{ background: "var(--glass-bg)", boxShadow: "var(--glass-shadow)", border: "none", borderRadius: "16px" }}>
        <div className="media-img-wrap">
          <Image src="https://umiba.ac.id/wp-content/uploads/2025/08/umiba-upacara.jpg" alt="Berita 5" width={800} height={600} style={{ width: '100%', height: 'auto' }} />
        </div>
        <div className="media-content">
          <div className="media-source"><i className="ph ph-fill ph-newspaper"></i> kompaskampus.id</div>
          <h3 style={{ fontSize: '1.05rem', lineHeight: '1.4', margin: '0' }}>Universitas Mitra Bangsa Gelar Gebyar Kemerdekaan HUT-RI</h3>
        </div>
      </div>
      <div className="neu-card media-card fade-up" style={{ background: "var(--glass-bg)", boxShadow: "var(--glass-shadow)", border: "none", borderRadius: "16px", transitionDelay: '0.1s' }}>
        <div className="media-img-wrap">
          <Image src="https://umiba.ac.id/wp-content/uploads/2025/07/pilarparlemen.jpg" style={{ objectFit: 'contain', background: '#fff', width: '100%', height: 'auto' }} width={800} height={600} alt="Berita 6"/>
        </div>
        <div className="media-content">
          <div className="media-source"><i className="ph ph-fill ph-newspaper"></i> pilarparlemen.id</div>
          <h3 style={{ fontSize: '1.05rem', lineHeight: '1.4', margin: '0' }}>BEM UMIBA Desak Pemkot Jakarta Selatan Atasi Penumpukan Sampah di Sekitar Kampus</h3>
        </div>
      </div>
      <div className="neu-card media-card fade-up" style={{ background: "var(--glass-bg)", boxShadow: "var(--glass-shadow)", border: "none", borderRadius: "16px", transitionDelay: '0.2s' }}>
        <div className="media-img-wrap">
          <Image src="https://umiba.ac.id/wp-content/uploads/2026/05/audensiUMIBA-300x158.webp" alt="Berita 7" width={300} height={158} style={{ width: '100%', height: 'auto' }} />
        </div>
        <div className="media-content">
          <div className="media-source"><i className="ph ph-fill ph-newspaper"></i> kompaskampus.id</div>
          <h3 style={{ fontSize: '1.05rem', lineHeight: '1.4', margin: '0' }}>Kampus UMIBA Terima Kunjungan Kehormatan dari Anggota DPR RI dan Ketua Umum IKADIM, Dr. Jazuli Juwaini, MA</h3>
        </div>
      </div>
      <div className="neu-card media-card fade-up" style={{ background: "var(--glass-bg)", boxShadow: "var(--glass-shadow)", border: "none", borderRadius: "16px", transitionDelay: '0.3s' }}>
        <div className="media-img-wrap">
          <Image src="https://umiba.ac.id/wp-content/uploads/2026/05/audensiUMIBA-300x158.webp" alt="Berita 8" width={300} height={158} style={{ width: '100%', height: 'auto' }} />
        </div>
        <div className="media-content">
          <div className="media-source"><i className="ph ph-fill ph-newspaper"></i> newsdetik.co</div>
          <h3 style={{ fontSize: '1.05rem', lineHeight: '1.4', margin: '0' }}>Kampus UMIBA Terima Kunjungan Kehormatan dari Anggota DPR RI dan Ketua Umum IKADIM, Dr. Jazuli Juwaini, MA</h3>
        </div>
      </div>
    </div>
  </div>
</section>

{/*  ░░░ TESTIMONI ALUMNI ░░░  */}
<section className="testi-section">
  <div className="container">
    <div style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }} className="fade-up">
      <span className="text-red" style={{ fontWeight: '600', textTransform: 'uppercase' }}>{t("home.kisah_sukses")}</span>
      <h2>{t("home.testimoni_alumni")}</h2>
    </div>
    <div className="testi-slider fade-up">
      {testiData.length > 0 ? (
        testiData.map((testi, index) => (
          <div key={testi.id} className="testi-card">
            <Image className="alumni-img" style={{ objectFit: 'cover' }} src={testi.image_url} width={380} height={440} alt={`Testimoni ${index + 1}`}/>
          </div>
        ))
      ) : (
        <div style={{ textAlign: 'center', padding: '20px' }}>{t("home.loading_testimoni")}</div>
      )}
    </div>
    <input type="range" className="custom-scrollbar" data-target=".testi-slider" min="0" max="100" defaultValue="0" />
  </div>
</section>



{/*  ░░░ FOOTER UNIK ░░░  */}



      </>
  );
}
