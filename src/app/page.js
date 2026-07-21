
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
    <div className="home-neu-page">
      

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
            <div style={{ background: 'var(--color-surface)', border: 'none', borderRadius: '24px', padding: '24px', marginBottom: '24px', boxShadow: 'inset 3px 3px 6px #cbd5e1, inset -3px -3px 6px #ffffff' }}>
              <h3 style={{ color: 'var(--color-text)', fontSize: 'clamp(0.95rem, 2vw, 1.1rem)', marginBottom: '16px', borderBottom: '1px solid var(--color-border)', paddingBottom: '8px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>
                {lang === "en" ? "MM UMIBA ADVANTAGES:" : "KEUNGGULAN MM UMIBA:"}
              </h3>
              <ul style={{ color: 'var(--color-text)', listStyle: 'none', padding: 0, margin: 0, fontSize: 'clamp(0.85rem, 2vw, 0.95rem)', lineHeight: '1.5', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><div style={{ width: "24px", height: "24px", borderRadius: "50%", boxShadow: "inset 2px 2px 4px var(--inset-shadow-dark), inset -2px -2px 4px var(--inset-shadow-light)", background: "var(--liquid-bg)", display: "flex", alignItems: 'center', justifyContent: "center", flexShrink: 0 }}><i className="ph ph-bold ph-check" style={{ color: 'var(--apple-red)', fontSize: '0.9rem' }}></i></div> <span style={{ color: 'var(--color-text)' }}>Ter-Akreditasi <b style={{ fontWeight: '800' }}>BAIK SEKALI</b> oleh BAN-PT</span></li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><div style={{ width: "24px", height: "24px", borderRadius: "50%", boxShadow: "inset 2px 2px 4px var(--inset-shadow-dark), inset -2px -2px 4px var(--inset-shadow-light)", background: "var(--liquid-bg)", display: "flex", alignItems: 'center', justifyContent: "center", flexShrink: 0 }}><i className="ph ph-bold ph-check" style={{ color: 'var(--apple-red)', fontSize: '0.9rem' }}></i></div> <span style={{ color: 'var(--color-text)' }}>Gelar Resmi <b style={{ fontWeight: '800' }}>M.M. (Magister Manajemen)</b></span></li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><div style={{ width: "24px", height: "24px", borderRadius: "50%", boxShadow: "inset 2px 2px 4px var(--inset-shadow-dark), inset -2px -2px 4px var(--inset-shadow-light)", background: "var(--liquid-bg)", display: "flex", alignItems: 'center', justifyContent: "center", flexShrink: 0 }}><i className="ph ph-bold ph-check" style={{ color: 'var(--apple-red)', fontSize: '0.9rem' }}></i></div> <span style={{ color: 'var(--color-text)' }}>Waktu Kuliah Fleksibel: <b style={{ fontWeight: '800' }}>Reguler & Karyawan</b></span></li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><div style={{ width: "24px", height: "24px", borderRadius: "50%", boxShadow: "inset 2px 2px 4px var(--inset-shadow-dark), inset -2px -2px 4px var(--inset-shadow-light)", background: "var(--liquid-bg)", display: "flex", alignItems: 'center', justifyContent: "center", flexShrink: 0 }}><i className="ph ph-bold ph-check" style={{ color: 'var(--apple-red)', fontSize: '0.9rem' }}></i></div> <span style={{ color: 'var(--color-text)' }}>Kurikulum Relevan & Aplikatif Industri Modern</span></li>
              </ul>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <a href="/pmb" className="btn btn-neu" style={{ padding: '12px 28px', fontSize: 'clamp(0.9rem, 2vw, 1.1rem)', fontWeight: '800', borderRadius: '50px', textTransform: 'uppercase', transition: 'all 0.3s ease' }}>
                {lang === "en" ? "Register Now" : "DAFTAR SEKARANG"}
              </a>
              <a href="https://wa.me/62811870114" target="_blank" style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--color-text)', textDecoration: 'none' }}>
                <div style={{ background: 'var(--color-surface)', padding: '8px', borderRadius: '50%', display: 'flex', boxShadow: 'inset 3px 3px 6px #cbd5e1, inset -3px -3px 6px #ffffff' }}>
                  <i className="ph ph-fill ph-whatsapp-logo" style={{ color: '#25D366', fontSize: '1.4rem' }}></i>
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-muted)' }}>{lang === "en" ? "Registration Info" : "Informasi Pendaftaran"}</div>
                  <div style={{ fontSize: 'clamp(1.1rem, 2.5vw, 1.3rem)', fontWeight: 'bold', letterSpacing: '1px' }}>0811 870 114</div>
                </div>
              </a>
            </div>
          </div>
          <div className="hero-model-container" style={{ position: 'absolute', right: '0', bottom: 0, height: '100%', width: '45%', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', pointerEvents: 'none', zIndex: 1 }}>
            <div style={{ position: 'relative', width: '380px', height: '380px', marginRight: '40px', marginTop: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              
              {/* The Masked Container (clips bottom body inside circle shape) */}
              <div className="hero-model-circle" style={{ position: 'absolute', inset: 0, borderRadius: '50%', overflow: 'hidden', zIndex: 0, transform: 'translate3d(0,0,0)' }}>
                {/* Neumorphic Inner Shadow Overlay to stack on top of body but inside circle */}
                <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', boxShadow: 'inset 8px 8px 16px var(--inset-shadow-dark), inset -8px -8px 16px var(--inset-shadow-light)', zIndex: 2, pointerEvents: 'none' }}></div>
                <div style={{ position: 'absolute', inset: '-60px -20px 0 -20px', zIndex: 2, transform: 'translate3d(0,0,0)' }}>
                  <img 
                    src="/nobcg1.png" 
                    alt="Student Model 1 Base" 
                    style={{ width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'bottom center' }} 
                  />
                </div>
              </div>

              {/* The Pop-Out Overlay (uncut head popping out above circle, clipped below middle) */}
              <div style={{ position: 'absolute', inset: '-60px -20px 0 -20px', zIndex: 3, clipPath: 'inset(0px 0px 45% 0px)', transform: 'translate3d(0,0,0)' }}>
                <div style={{ position: 'relative', width: '100%', height: '100%', transform: 'translate3d(0,0,0)' }}>
                  <img 
                    src="/nobcg1.png" 
                    alt="Student Model 1 Popout" 
                    style={{ width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'bottom center' }} 
                  />
                </div>
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
            <div style={{ background: 'var(--color-surface)', border: 'none', borderRadius: '24px', padding: '24px', marginBottom: '24px', boxShadow: 'inset 3px 3px 6px #cbd5e1, inset -3px -3px 6px #ffffff' }}>
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
          <div className="hero-model-container" style={{ position: 'absolute', right: '0', bottom: 0, height: '100%', width: '45%', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', pointerEvents: 'none', zIndex: 1 }}>
            <div style={{ position: 'relative', width: '380px', height: '380px', marginRight: '40px', marginTop: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              
              {/* The Masked Container (clips bottom body inside circle shape) */}
              <div className="hero-model-circle" style={{ position: 'absolute', inset: 0, borderRadius: '50%', overflow: 'hidden', zIndex: 0, transform: 'translate3d(0,0,0)' }}>
                {/* Neumorphic Inner Shadow Overlay to stack on top of body but inside circle */}
                <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', boxShadow: 'inset 8px 8px 16px var(--inset-shadow-dark), inset -8px -8px 16px var(--inset-shadow-light)', zIndex: 2, pointerEvents: 'none' }}></div>
                <div style={{ position: 'absolute', inset: '-100px -20px 0 -20px', zIndex: 2, transform: 'translate3d(0,0,0)' }}>
                  <img 
                    src="/nobcg2.png" 
                    alt="Student Model 2 Base" 
                    style={{ width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'bottom center' }} 
                  />
                </div>
              </div>

              {/* The Pop-Out Overlay (uncut head popping out above circle, clipped below middle) */}
              <div style={{ position: 'absolute', inset: '-100px -20px 0 -20px', zIndex: 3, clipPath: 'inset(0px 0px 45% 0px)', transform: 'translate3d(0,0,0)' }}>
                <div style={{ position: 'relative', width: '100%', height: '100%', transform: 'translate3d(0,0,0)' }}>
                  <img 
                    src="/nobcg2.png" 
                    alt="Student Model 2 Popout" 
                    style={{ width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'bottom center' }} 
                  />
                </div>
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

            <div style={{ background: 'var(--color-surface)', border: 'none', borderRadius: '24px', padding: '24px', marginBottom: '24px', boxShadow: 'inset 3px 3px 6px #cbd5e1, inset -3px -3px 6px #ffffff' }}>
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
            </div>
          </div>
          <div className="hero-model-container" style={{ position: 'absolute', right: '0', bottom: 0, height: '100%', width: '45%', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', pointerEvents: 'none', zIndex: 1 }}>
            <div style={{ position: 'relative', width: '380px', height: '380px', marginRight: '40px', marginTop: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              
              {/* The Masked Container (clips bottom body inside circle shape) */}
              <div className="hero-model-circle" style={{ position: 'absolute', inset: 0, borderRadius: '50%', overflow: 'hidden', zIndex: 0, transform: 'translate3d(0,0,0)' }}>
                {/* Neumorphic Inner Shadow Overlay to stack on top of body but inside circle */}
                <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', boxShadow: 'inset 8px 8px 16px var(--inset-shadow-dark), inset -8px -8px 16px var(--inset-shadow-light)', zIndex: 2, pointerEvents: 'none' }}></div>
                <div style={{ position: 'absolute', inset: '-60px -20px 0 -20px', zIndex: 2, transform: 'translate3d(0,0,0)' }}>
                  <img 
                    src="/nobcg3.png" 
                    alt="Student Model 3 Base" 
                    style={{ width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'bottom center' }} 
                  />
                </div>
              </div>

              {/* The Pop-Out Overlay (uncut head popping out above circle, clipped below middle) */}
              <div style={{ position: 'absolute', inset: '-60px -20px 0 -20px', zIndex: 3, clipPath: 'inset(0px 0px 45% 0px)', transform: 'translate3d(0,0,0)' }}>
                <div style={{ position: 'relative', width: '100%', height: '100%', transform: 'translate3d(0,0,0)' }}>
                  <img 
                    src="/nobcg3.png" 
                    alt="Student Model 3 Popout" 
                    style={{ width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'bottom center' }} 
                  />
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
  </div>
</section>

{/*  ░░░ QUICK STATS STRIP ░░░  */}
<section style={{ padding: '40px 0', position: 'relative', zIndex: '10' }}>
  <div className="container">
    <div className="neu-card grid grid-4 fade-up" style={{ background: "var(--color-surface)", boxShadow: "inset 4px 4px 8px #cbd5e1, inset -4px -4px 8px #ffffff", border: "none", borderRadius: "24px", textAlign: 'center', padding: 'var(--space-5)' }}>
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
<section id="sambutan" style={{ padding: '40px 0' }}>
  <div className="container grid grid-2" style={{ alignItems: 'center' }}>
    <div className="fade-up" style={{ position: 'relative', maxWidth: '400px', margin: '0 auto', width: '100%' }}>
      <div style={{ borderRadius: '24px', overflow: 'hidden', boxShadow: 'inset 3px 3px 6px #cbd5e1, inset -3px -3px 6px #ffffff' }}>
        <img src="https://umiba.ac.id/wp-content/uploads/2026/05/rektor-UMIBA-2026.jpeg" alt="Rektor UMIBA" style={{ width: '100%', aspectRatio: '3/4', objectFit: 'cover', objectPosition: 'top', display: 'block' }}/>
      </div>
      <div className="neu-card" style={{ background: "var(--color-surface)", boxShadow: "inset 3px 3px 6px #cbd5e1, inset -3px -3px 6px #ffffff", border: "none", borderRadius: "16px", position: 'absolute', bottom: '24px', left: '24px', right: '24px', padding: 'var(--space-3)' }}>
        <h3 style={{ margin: '0 0 4px 0', fontSize: '1.1rem', fontWeight: 800 }}>{t("home.sambutan_rektor")}</h3>
        <p style={{ margin: '0', fontSize: '0.85rem', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>{t("home.quote_rektor")}</p>
      </div>
    </div>
    <div className="fade-up" style={{ paddingLeft: 'var(--space-4)' }}>
      <span className="text-red" style={{ fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.9rem' }}>{t("home.pesan_pimpinan")}</span>
      <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', fontWeight: 900, marginBottom: '20px' }}>{t("home.selamat_datang")}</h2>
      <p style={{ lineHeight: '1.7', color: 'var(--color-text)', marginBottom: '16px' }}>{t("home.sambutan_p1")}</p>
      <p style={{ lineHeight: '1.7', color: 'var(--color-text)', marginBottom: '24px' }}>{t("home.sambutan_p2")}</p>
      <div className="grid grid-2" style={{ gap: '20px' }}>
        <div className="neu-card" style={{ background: "var(--color-surface)", boxShadow: "inset 3px 3px 6px #cbd5e1, inset -3px -3px 6px #ffffff", border: "none", borderRadius: "20px", padding: '20px' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '8px', fontWeight: 800 }}>{t("home.kurikulum_modern")}</h3>
          <p style={{ fontSize: '0.85rem', margin: '0', color: 'var(--color-text-muted)', lineHeight: '1.5' }}>{t("home.kurikulum_desc")}</p>
        </div>
        <div className="neu-card" style={{ background: "var(--color-surface)", boxShadow: "inset 3px 3px 6px #cbd5e1, inset -3px -3px 6px #ffffff", border: "none", borderRadius: "20px", padding: '20px' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '8px', fontWeight: 800 }}>{t("home.kemitraan_industri")}</h3>
          <p style={{ fontSize: '0.85rem', margin: '0', color: 'var(--color-text-muted)', lineHeight: '1.5' }}>{t("home.kemitraan_desc")}</p>
        </div>
      </div>
    </div>
  </div>
</section>

{/*  ░░░ FAKULTAS & PRODI ░░░  */}
<section id="fakultas" style={{ padding: '40px 0', position: 'relative' }}>
  <div className="container">
    <div style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }} className="fade-up">
      <span className="text-red" style={{ fontWeight: '600', textTransform: 'uppercase' }}>{t("home.pilihan_studi")}</span>
      <h2>{t("home.fakultas_prodi")}</h2>
      <p style={{ maxWidth: '600px', margin: '0 auto' }}>{t("home.pilih_prodi_desc")}</p>
    </div>
    
    <div className="grid grid-3">
      {/*  Card 1  */}
      <div className="neu-card fade-up" style={{ background: "var(--color-surface)", boxShadow: "inset 3px 3px 6px #cbd5e1, inset -3px -3px 6px #ffffff", border: "none", borderRadius: "24px", padding: '24px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ background: 'var(--color-surface)', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 'var(--space-4)', boxShadow: 'inset 3px 3px 6px #cbd5e1, inset -3px -3px 6px #ffffff' }}>
          <i className="ph ph-duotone ph-briefcase" style={{ fontSize: '2.2rem', color: 'var(--umiba-red)' }}></i>
        </div>
        <div style={{ minHeight: '220px' }}>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 800 }}>{t("home.fak_manajemen")}</h3>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', lineHeight: '1.6' }}>{t("home.fak_manajemen_desc")}</p>
        </div>
        <ul style={{ listStyle: 'none', padding: '0', marginBottom: 'var(--space-4)', color: 'var(--color-muted)' }}>
          <li style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', fontSize: '0.95rem' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px', borderRadius: '50%', background: 'var(--color-surface)', boxShadow: 'inset 2px 2px 4px #cbd5e1, inset -2px -2px 4px #ffffff', marginRight: '10px' }}>
              <i className="ph ph-fill ph-check-circle" style={{ color: 'var(--umiba-red)', fontSize: '1.1rem' }}></i>
            </span>
            S1 Manajemen
          </li>
          <li style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', fontSize: '0.95rem' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px', borderRadius: '50%', background: 'var(--color-surface)', boxShadow: 'inset 2px 2px 4px #cbd5e1, inset -2px -2px 4px #ffffff', marginRight: '10px' }}>
              <i className="ph ph-fill ph-check-circle" style={{ color: 'var(--umiba-red)', fontSize: '1.1rem' }}></i>
            </span>
            S2 Magister Manajemen
          </li>
        </ul>
        <a href="/akademik?tab=manajemen" className="btn btn-neu" style={{ width: '100%', marginTop: 'auto', borderRadius: '12px' }}>{t("home.lihat_fakultas")}</a>
      </div>
      
      {/*  Card 2  */}
      <div className="neu-card fade-up" style={{ background: "var(--color-surface)", boxShadow: "inset 3px 3px 6px #cbd5e1, inset -3px -3px 6px #ffffff", border: "none", borderRadius: "24px", padding: '24px', display: 'flex', flexDirection: 'column', transitionDelay: '0.1s' }}>
        <div style={{ background: 'var(--color-surface)', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 'var(--space-4)', boxShadow: 'inset 3px 3px 6px #cbd5e1, inset -3px -3px 6px #ffffff' }}>
          <i className="ph ph-duotone ph-scales" style={{ fontSize: '2.2rem', color: 'var(--umiba-red)' }}></i>
        </div>
        <div style={{ minHeight: '220px' }}>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 800 }}>{t("home.fak_hukum")}</h3>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', lineHeight: '1.6' }}>{t("home.fak_hukum_desc")}</p>
        </div>
        <ul style={{ listStyle: 'none', padding: '0', marginBottom: 'var(--space-4)', color: 'var(--color-muted)' }}>
          <li style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', fontSize: '0.95rem' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px', borderRadius: '50%', background: 'var(--color-surface)', boxShadow: 'inset 2px 2px 4px #cbd5e1, inset -2px -2px 4px #ffffff', marginRight: '10px' }}>
              <i className="ph ph-fill ph-check-circle" style={{ color: 'var(--umiba-red)', fontSize: '1.1rem' }}></i>
            </span>
            S1 Ilmu Hukum
          </li>
        </ul>
        <a href="/akademik?tab=hukum" className="btn btn-neu" style={{ width: '100%', marginTop: 'auto', borderRadius: '12px' }}>{t("home.lihat_fakultas")}</a>
      </div>
      
      {/*  Card 3  */}
      <div className="neu-card fade-up" style={{ background: "var(--color-surface)", boxShadow: "inset 3px 3px 6px #cbd5e1, inset -3px -3px 6px #ffffff", border: "none", borderRadius: "24px", padding: '24px', display: 'flex', flexDirection: 'column', transitionDelay: '0.2s' }}>
        <div style={{ background: 'var(--color-surface)', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 'var(--space-4)', boxShadow: 'inset 3px 3px 6px #cbd5e1, inset -3px -3px 6px #ffffff' }}>
          <i className="ph ph-duotone ph-laptop" style={{ fontSize: '2.2rem', color: 'var(--umiba-red)' }}></i>
        </div>
        <div style={{ minHeight: '220px' }}>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 800 }}>{t("home.fak_ti")}</h3>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', lineHeight: '1.6' }}>{t("home.fak_ti_desc")}</p>
        </div>
        <ul style={{ listStyle: 'none', padding: '0', marginBottom: 'var(--space-4)', color: 'var(--color-muted)' }}>
          <li style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', fontSize: '0.95rem' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px', borderRadius: '50%', background: 'var(--color-surface)', boxShadow: 'inset 2px 2px 4px #cbd5e1, inset -2px -2px 4px #ffffff', marginRight: '10px' }}>
              <i className="ph ph-fill ph-check-circle" style={{ color: 'var(--umiba-red)', fontSize: '1.1rem' }}></i>
            </span>
            S1 Ilmu Komputer
          </li>
          <li style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', fontSize: '0.95rem' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px', borderRadius: '50%', background: 'var(--color-surface)', boxShadow: 'inset 2px 2px 4px #cbd5e1, inset -2px -2px 4px #ffffff', marginRight: '10px' }}>
              <i className="ph ph-fill ph-check-circle" style={{ color: 'var(--umiba-red)', fontSize: '1.1rem' }}></i>
            </span>
            S1 Sistem &amp; TI
          </li>
          <li style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', fontSize: '0.95rem' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px', borderRadius: '50%', background: 'var(--color-surface)', boxShadow: 'inset 2px 2px 4px #cbd5e1, inset -2px -2px 4px #ffffff', marginRight: '10px' }}>
              <i className="ph ph-fill ph-check-circle" style={{ color: 'var(--umiba-red)', fontSize: '1.1rem' }}></i>
            </span>
            S1 Ilmu Aktuaria
          </li>
        </ul>
        <a href="/akademik?tab=it" className="btn btn-neu" style={{ width: '100%', marginTop: 'auto', borderRadius: '12px' }}>{t("home.lihat_fakultas")}</a>
      </div>
    </div>
  </div>
</section>

{/*  ░░░ AKREDITASI ░░░  */}
<section id="akreditasi" style={{ padding: '40px 0', background: "var(--color-bg)" }}>
  <div className="container">
    <div style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }} className="fade-up">
      <span className="text-red" style={{ fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.9rem' }}>{t("home.kepercayaan_kualitas")}</span>
      <h2 style={{ fontWeight: 900 }}>{t("home.sertifikat_akreditasi")}</h2>
    </div>
    <div className="cert-slider fade-up" style={{ marginTop: '24px', display: 'flex', gap: '24px', overflowX: 'auto', padding: '20px 10px' }}>
      <div className="cert-slide" style={{ flex: '0 0 320px', background: 'var(--color-surface)', padding: '16px', borderRadius: '24px', boxShadow: 'inset 3px 3px 6px #cbd5e1, inset -3px -3px 6px #ffffff', border: 'none' }}>
        <div style={{ borderRadius: '16px', overflow: 'hidden' }}>
          <img src="https://umiba.ac.id/wp-content/uploads/2026/05/Serifikat-Lamsama-BaikAKTUARIA-768x543.webp" alt="Akreditasi S1 Ilmu Aktuaria" style={{ width: '100%', height: 'auto', display: 'block' }} />
        </div>
      </div>
      <div className="cert-slide" style={{ flex: '0 0 320px', background: 'var(--color-surface)', padding: '16px', borderRadius: '24px', boxShadow: 'inset 3px 3px 6px #cbd5e1, inset -3px -3px 6px #ffffff', border: 'none' }}>
        <div style={{ borderRadius: '16px', overflow: 'hidden' }}>
          <img src="https://umiba.ac.id/wp-content/uploads/2025/05/Sertifikat-UMIBA_page-0001-768x543.jpg" alt="Akreditasi Institusi UMIBA" style={{ width: '100%', height: 'auto', display: 'block' }} />
        </div>
      </div>
      <div className="cert-slide" style={{ flex: '0 0 320px', background: 'var(--color-surface)', padding: '16px', borderRadius: '24px', boxShadow: 'inset 3px 3px 6px #cbd5e1, inset -3px -3px 6px #ffffff', border: 'none' }}>
        <div style={{ borderRadius: '16px', overflow: 'hidden' }}>
          <img src="https://umiba.ac.id/wp-content/uploads/2024/05/Sertifikat-Akreditasi-S1-Manajemen-UMIBA-768x543.jpg" alt="Akreditasi S1 Manajemen" style={{ width: '100%', height: 'auto', display: 'block' }} />
        </div>
      </div>
      <div className="cert-slide" style={{ flex: '0 0 320px', background: 'var(--color-surface)', padding: '16px', borderRadius: '24px', boxShadow: 'inset 3px 3px 6px #cbd5e1, inset -3px -3px 6px #ffffff', border: 'none' }}>
        <div style={{ borderRadius: '16px', overflow: 'hidden' }}>
          <img src="https://umiba.ac.id/wp-content/uploads/2025/01/WhatsApp-Image-2025-01-23-at-3.58.34-PM-768x536.jpeg" alt="Akreditasi S2 Manajemen" style={{ width: '100%', height: 'auto', display: 'block' }} />
        </div>
      </div>
      <div className="cert-slide" style={{ flex: '0 0 320px', background: 'var(--color-surface)', padding: '16px', borderRadius: '24px', boxShadow: 'inset 3px 3px 6px #cbd5e1, inset -3px -3px 6px #ffffff', border: 'none' }}>
        <div style={{ borderRadius: '16px', overflow: 'hidden' }}>
          <img src="https://umiba.ac.id/wp-content/uploads/2025/05/Sertifikat_RPL_S2_2025-2026_Ganjil-768x502.jpg" alt="Sertifikat RPL S2" style={{ width: '100%', height: 'auto', display: 'block' }} />
        </div>
      </div>
    </div>
    <input type="range" className="custom-scrollbar" data-target=".cert-slider" min="0" max="100" defaultValue="0" />
  </div>
</section>

{/*  ░░░ BERITA TERBARU ░░░  */}
<section id="berita" style={{ padding: '40px 0' }}>
  <div className="container">
    <div className="flex fade-up" style={{ justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 'var(--space-6)' }}>
      <div>
        <span className="text-red" style={{ fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.9rem' }}>{t("home.kabar_kampus")}</span>
        <h2 style={{ marginBottom: '0', fontWeight: 900 }}>{t("home.berita_pengumuman")}</h2>
      </div>
      <a href="/berita" className="btn btn-neu" style={{ borderRadius: '12px' }}>{t("home.lihat_semua")}</a>
    </div>
    <div className="grid grid-3 scroll-mobile">
      {newsData && newsData.length > 0 ? (
        newsData.slice(0, 6).map((newsItem, index) => (
          <div key={newsItem.id} className="neu-card fade-up" style={{ background: "var(--color-surface)", boxShadow: "inset 3px 3px 6px #cbd5e1, inset -3px -3px 6px #ffffff", border: "none", borderRadius: "24px", transitionDelay: `${index * 0.1}s`, padding: '16px', overflow: 'hidden' }}>
            <div style={{ borderRadius: '16px', height: '200px', overflow: 'hidden' }}>
               <img src={newsItem.image_url} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} alt={newsItem.title}/>
            </div>
            <div style={{ padding: '12px 4px 4px 4px' }}>
              <p style={{ fontSize: '0.8rem', marginBottom: '8px', color: 'var(--color-text-muted)' }}>{newsItem.date}</p>
              <h3 style={{ fontSize: '1.1rem', margin: 0, lineHeight: '1.4', fontWeight: 800 }}>{newsItem.title}</h3>
            </div>
          </div>
        ))
      ) : (
        <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', background: "var(--color-surface)", borderRadius: '24px', boxShadow: "inset 3px 3px 6px #cbd5e1, inset -3px -3px 6px #ffffff" }}>
          <p style={{ color: '#64748b', fontSize: '1.1rem', margin: 0 }}>{t("home.belum_ada_berita")}</p>
        </div>
      )}
    </div>
  </div>
</section>

{/*  ░░░ LOKASI KAMPUS ░░░  */}
<section id="lokasi" style={{ padding: '40px 0', background: "var(--color-bg)" }}>
  <div className="container fade-up">
    <div style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }}>
      <span className="text-red" style={{ fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.9rem' }}>Lokasi Kami</span>
      <h2 style={{ fontSize: '2.5rem', marginBottom: '8px', fontWeight: 900 }}>{t("home.lokasi_kampus")}</h2>
      <p style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem' }}>{t("home.lokasi_desc")}</p>
    </div>
    <div className="grid grid-2" style={{ gap: 'var(--space-6)' }}>
      {/*  Kampus Pasar Minggu  */}
      <div className="neu-card" style={{ background: "var(--color-surface)", boxShadow: "inset 3px 3px 6px #cbd5e1, inset -3px -3px 6px #ffffff", border: "none", borderRadius: "24px", padding: '24px' }}>
        <h3 style={{ color: 'var(--umiba-red-dark)', marginBottom: 'var(--space-2)', fontWeight: 800 }}><i className="ph ph-fill ph-map-pin" style={{ color: 'var(--umiba-red)', marginRight: '8px' }}></i>{t("home.kampus_pasar_minggu")}</h3>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--space-4)', lineHeight: '1.5', fontSize: '0.95rem' }}>
          {t("home.alamat_pm")}
        </p>
        <div style={{ borderRadius: '16px', overflow: 'hidden', height: '300px' }}>
          <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3965.8021859604723!2d106.84124877521778!3d-6.289711293699269!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69eda4b9cb7a3b%3A0xa480a640215e1b50!2sUniversitas%20Mitra%20Bangsa%20Jakarta%20(UMIBA)!5e0!3m2!1sid!2sid!4v1780999630946!5m2!1sid!2sid" width="100%" height="100%" style={{ border: '0' }} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
        </div>
      </div>
      
      {/*  Kampus Bintaro  */}
      <div className="neu-card" style={{ background: "var(--color-surface)", boxShadow: "inset 3px 3px 6px #cbd5e1, inset -3px -3px 6px #ffffff", border: "none", borderRadius: "24px", padding: '24px' }}>
        <h3 style={{ color: 'var(--umiba-red-dark)', marginBottom: 'var(--space-2)', fontWeight: 800 }}><i className="ph ph-fill ph-map-pin" style={{ color: 'var(--umiba-red)', marginRight: '8px' }}></i>{t("home.kampus_bintaro")}</h3>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--space-4)', lineHeight: '1.5', fontSize: '0.95rem' }}>
          {t("home.alamat_bintaro")}
        </p>
        <div style={{ borderRadius: '16px', overflow: 'hidden', height: '300px' }}>
          <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7931.8354716433105!2d106.76112597521758!3d-6.274546893714218!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f029893119b5%3A0x83f8e2bcc968c64a!2sUniversitas%20Mitra%20Bangsa%20Bintaro%20(UMIBA)!5e0!3m2!1sid!2sid!4v1780999658632!5m2!1sid!2sid" width="100%" height="100%" style={{ border: '0' }} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
        </div>
      </div>
    </div>
  </div>
</section>

{/*  ░░░ PMB CTA ░░░  */}
<section style={{ padding: 'var(--space-8) 0' }}>
  <div className="container">
    <div className="neu-card grid grid-2 fade-up" style={{ background: "var(--color-surface)", boxShadow: "inset 4px 4px 8px #cbd5e1, inset -4px -4px 8px #ffffff", border: "none", borderRadius: "24px", alignItems: 'center', padding: '24px' }}>
      <div>
        <span className="text-red" style={{ fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.9rem' }}>{t("home.pendaftaran_dibuka")}</span>
        <h2 style={{ marginTop: '8px', fontWeight: 900 }}>{t("home.penerimaan_maba")}</h2>
        <p style={{ color: 'var(--color-text-muted)', margin: 0 }}>{t("home.penerimaan_desc")}</p>
      </div>
      <div className="flex-center" style={{ gap: 'var(--space-3)', flexWrap: 'wrap' }}>
        <a href="/pmb" className="btn btn-neu" style={{ borderRadius: '12px' }}>{t("home.daftar_online")}</a>
        <a href="https://wa.me/62811870114" target="_blank" className="btn btn-neu" style={{ borderRadius: '12px' }}>{t("home.whatsapp_kami")}</a>
      </div>
    </div>
  </div>
</section>

{/*  ░░░ LIPUTAN MEDIA ░░░  */}
<section style={{ padding: '40px 0', background: "var(--color-bg)" }}>
  <div className="container">
    <div style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }} className="fade-up">
      <span className="text-red" style={{ fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.9rem' }}>{t("home.kabar_terkini")}</span>
      <h2 style={{ fontWeight: 900 }}>{t("home.liputan_media")}</h2>
    </div>
    <div className="grid grid-4 scroll-mobile">
      <div className="neu-card media-card fade-up" style={{ background: "var(--color-surface)", boxShadow: "inset 3px 3px 6px #cbd5e1, inset -3px -3px 6px #ffffff", border: "none", borderRadius: "24px", padding: '16px' }}>
        <div className="media-img-wrap" style={{ borderRadius: '16px', overflow: 'hidden' }}>
          <img src="https://umiba.ac.id/wp-content/uploads/2025/12/umiba-4pilar-1536x938-1.jpeg" alt="Berita 1" style={{ width: '100%', height: 'auto', display: 'block' }} />
        </div>
        <div className="media-content" style={{ marginTop: '12px' }}>
          <div className="media-source" style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '8px' }}><i className="ph ph-fill ph-newspaper"></i> kompaskampus.id</div>
          <h3 style={{ fontSize: '1.05rem', lineHeight: '1.4', margin: '0', fontWeight: 800 }}>UMIBA Gelar Seminar Kebangsaan, Teguhkan Budaya Kampus Berbasis 4 Pilar Kebangsaan</h3>
        </div>
      </div>
      <div className="neu-card media-card fade-up" style={{ background: "var(--color-surface)", boxShadow: "inset 3px 3px 6px #cbd5e1, inset -3px -3px 6px #ffffff", border: "none", borderRadius: "24px", padding: '16px', transitionDelay: '0.1s' }}>
        <div className="media-img-wrap" style={{ borderRadius: '16px', overflow: 'hidden' }}>
          <img src="https://umiba.ac.id/wp-content/uploads/2025/10/serba-serbi_155621_big.webp" alt="Berita 2" style={{ width: '100%', height: 'auto', display: 'block' }} />
        </div>
        <div className="media-content" style={{ marginTop: '12px' }}>
          <div className="media-source" style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '8px' }}><i className="ph ph-fill ph-newspaper"></i> wartaekonomi.co.id</div>
          <h3 style={{ fontSize: '1.05rem', lineHeight: '1.4', margin: '0', fontWeight: 800 }}>IKADIM dan Universitas Mitra Bangsa Teken MoU untuk Tingkatkan Kualitas Tri Dharma Perguruan Tinggi</h3>
        </div>
      </div>
      <div className="neu-card media-card fade-up" style={{ background: "var(--color-surface)", boxShadow: "inset 3px 3px 6px #cbd5e1, inset -3px -3px 6px #ffffff", border: "none", borderRadius: '24px', padding: '16px', transitionDelay: '0.2s' }}>
        <div className="media-img-wrap" style={{ borderRadius: '16px', overflow: 'hidden' }}>
          <img src="https://umiba.ac.id/wp-content/uploads/2025/10/medium_tscom_news_photo_1759914601.jpg" alt="Berita 3" style={{ width: '100%', height: 'auto', display: 'block' }} />
        </div>
        <div className="media-content" style={{ marginTop: '12px' }}>
          <div className="media-source" style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '8px' }}><i className="ph ph-fill ph-newspaper"></i> teropongsenayan.com</div>
          <h3 style={{ fontSize: '1.05rem', lineHeight: '1.4', margin: '0', fontWeight: 800 }}>IKADIM dan Universitas Mitra Bangsa Teken MoU untuk Tingkatkan Kualitas Tri Dharma Perguruan Tinggi</h3>
        </div>
      </div>
      <div className="neu-card media-card fade-up" style={{ background: "var(--color-surface)", boxShadow: "inset 3px 3px 6px #cbd5e1, inset -3px -3px 6px #ffffff", border: "none", borderRadius: "24px", padding: '16px', transitionDelay: '0.3s' }}>
        <div className="media-img-wrap" style={{ borderRadius: '16px', overflow: 'hidden' }}>
          <img src="https://umiba.ac.id/wp-content/uploads/2025/08/umiba-upacara.jpg" alt="Berita 4" style={{ width: '100%', height: 'auto', display: 'block' }} />
        </div>
        <div className="media-content" style={{ marginTop: '12px' }}>
          <div className="media-source" style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '8px' }}><i className="ph ph-fill ph-newspaper"></i> newsdetik.co</div>
          <h3 style={{ fontSize: '1.05rem', lineHeight: '1.4', margin: '0', fontWeight: 800 }}>Universitas Mitra Bangsa Selenggarakan Gebyar Kemerdekaan HUT-RI Ke-80</h3>
        </div>
      </div>
      
      <div className="neu-card media-card fade-up" style={{ background: "var(--color-surface)", boxShadow: "inset 3px 3px 6px #cbd5e1, inset -3px -3px 6px #ffffff", border: "none", borderRadius: "24px", padding: '16px' }}>
        <div className="media-img-wrap" style={{ borderRadius: '16px', overflow: 'hidden' }}>
          <img src="https://umiba.ac.id/wp-content/uploads/2025/08/umiba-upacara.jpg" alt="Berita 5" style={{ width: '100%', height: 'auto', display: 'block' }} />
        </div>
        <div className="media-content" style={{ marginTop: '12px' }}>
          <div className="media-source" style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '8px' }}><i className="ph ph-fill ph-newspaper"></i> kompaskampus.id</div>
          <h3 style={{ fontSize: '1.05rem', lineHeight: '1.4', margin: '0', fontWeight: 800 }}>Universitas Mitra Bangsa Gelar Gebyar Kemerdekaan HUT-RI</h3>
        </div>
      </div>
      <div className="neu-card media-card fade-up" style={{ background: "var(--color-surface)", boxShadow: "inset 3px 3px 6px #cbd5e1, inset -3px -3px 6px #ffffff", border: "none", borderRadius: "24px", padding: '16px', transitionDelay: '0.1s' }}>
        <div className="media-img-wrap" style={{ borderRadius: '16px', overflow: 'hidden' }}>
          <img src="https://umiba.ac.id/wp-content/uploads/2025/07/pilarparlemen.jpg" style={{ objectFit: 'contain', background: '#fff', width: '100%', height: 'auto', display: 'block' }} alt="Berita 6"/>
        </div>
        <div className="media-content" style={{ marginTop: '12px' }}>
          <div className="media-source" style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '8px' }}><i className="ph ph-fill ph-newspaper"></i> pilarparlemen.id</div>
          <h3 style={{ fontSize: '1.05rem', lineHeight: '1.4', margin: '0', fontWeight: 800 }}>BEM UMIBA Desak Pemkot Jakarta Selatan Atasi Penumpukan Sampah di Sekitar Kampus</h3>
        </div>
      </div>
    </div>
  </div>
</section>

{/*  ░░░ TESTIMONI ALUMNI ░░░  */}
<section className="testi-section" style={{ padding: '40px 0' }}>
  <div className="container">
    <div style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }} className="fade-up">
      <span className="text-red" style={{ fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.9rem' }}>{t("home.kisah_sukses")}</span>
      <h2 style={{ fontWeight: 900 }}>{t("home.testimoni_alumni")}</h2>
    </div>
    <div className="testi-slider fade-up">
      {testiData.length > 0 ? (
        testiData.map((testi, index) => (
          <div key={testi.id} className="testi-card" style={{ background: 'var(--glass-bg)', border: 'var(--glass-border)', boxShadow: 'var(--glass-shadow)', borderRadius: '24px', padding: '12px' }}>
            <img className="alumni-img" style={{ objectFit: 'cover', width: '100%', height: '440px', borderRadius: '16px', display: 'block' }} src={testi.image_url} alt={`Testimoni ${index + 1}`}/>
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



      </div>
  );
}
