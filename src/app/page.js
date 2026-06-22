
"use client";
import { useEffect, useState } from 'react';
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
    
    const slideInterval = setInterval(nextSlide, 5000);
    return () => clearInterval(slideInterval);
  }, []);

  const slideBg = ['/1.jpeg', '/2.jpeg', '/3.jpeg'];

  return (
    <>
      

{/*  ░░░ HERO SECTION ░░░  */}
<section className="hero-wrapper" id="beranda" style={{ minHeight: '80vh', position: 'relative' }}>
  <div className="hero" style={{ position: 'relative', overflow: 'hidden', height: '100%', width: '100%', minHeight: '80vh' }}>
    
    {/*  Slider Backgrounds & Contents  */}
    <div id="heroSlides" style={{ position: 'absolute', inset: '0', zIndex: '-2' }}>
      
      {/* SLIDE 1: Magister Manajemen */}
      <div className={`hero-slide ${currentSlide === 0 ? 'active' : ''}`} style={{ backgroundImage: `url('/1.jpeg')`, position: 'absolute', inset: 0, opacity: currentSlide === 0 ? 1 : 0, transition: 'opacity 0.8s ease-in-out', display: 'flex', alignItems: 'center', padding: '0 5%' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(136, 17, 34, 0.95) 0%, rgba(136, 17, 34, 0.8) 40%, rgba(136, 17, 34, 0.2) 70%, transparent 100%)', zIndex: 1 }}></div>
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '850px', color: 'white' }} className={currentSlide === 0 ? 'fade-up active' : 'fade-up'}>
          <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', lineHeight: '1.1', marginBottom: '8px', fontWeight: 900, textTransform: 'uppercase', textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
            PENERIMAAN MAHASISWA BARU TA. 2026/27
          </h1>
          <div style={{ display: 'inline-block', background: 'white', color: 'var(--umiba-red)', padding: '8px 24px', fontSize: '1.2rem', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '24px', letterSpacing: '2px', borderRadius: '4px' }}>
            PROGRAM STUDI MAGISTER MANAJEMEN
          </div>
          
          {/* Keunggulan */}
          <div style={{ background: '#6A0D1A', color: 'white', padding: '4px 16px', borderRadius: '20px', display: 'inline-block', marginBottom: '12px', fontWeight: 'bold' }}>Keunggulan Kuliah S2 di UMIBA</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><i className="ph-fill ph-certificate" style={{ color: '#FDE047', fontSize: '1.5rem' }}></i><span style={{ fontSize: '0.95rem' }}><b>Dual Certificate:</b> Ijazah Magister + Sertifikat BNSP</span></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><i className="ph-fill ph-laptop" style={{ color: '#FDE047', fontSize: '1.5rem' }}></i><span style={{ fontSize: '0.95rem' }}><b>Blended Learning:</b> Kuliah Online + Offline</span></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><i className="ph-fill ph-users-three" style={{ color: '#FDE047', fontSize: '1.5rem' }}></i><span style={{ fontSize: '0.95rem' }}><b>Career Network:</b> Jaringan Alumni yang Luas</span></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><i className="ph-fill ph-wallet" style={{ color: '#FDE047', fontSize: '1.5rem' }}></i><span style={{ fontSize: '0.95rem' }}><b>Flexible Tuition Payment:</b> Biaya Kuliah Bisa Diangsur</span></div>
          </div>

          {/* Konsentrasi */}
          <div style={{ background: '#6A0D1A', color: 'white', padding: '4px 16px', borderRadius: '20px', display: 'inline-block', marginBottom: '12px', fontWeight: 'bold' }}>Pilihan Konsentrasi Perkuliahan</div>
          <p style={{ fontSize: '0.95rem', marginBottom: '30px', fontWeight: 500 }}>
            • Manajemen SDM • Manajemen Keuangan • Manajemen Pemasaran • Manajemen Rumah Sakit • Manajemen K3
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
            <a href="#" className="btn" style={{ background: '#FDE047', color: '#881122', padding: '14px 32px', fontSize: '1.2rem', fontWeight: 'bold', borderRadius: '30px', textTransform: 'uppercase', boxShadow: '0 4px 15px rgba(253, 224, 71, 0.4)' }}>
              DAFTAR SEKARANG
            </a>
            <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
              <i className="ph-fill ph-whatsapp-logo" style={{ color: '#25D366', fontSize: '1.8rem', verticalAlign: 'middle', marginRight: '8px' }}></i>
              Informasi Pendaftaran: 0811 870 114
            </div>
          </div>
        </div>
      </div>

      {/* SLIDE 2: KIP-K */}
      <div className={`hero-slide ${currentSlide === 1 ? 'active' : ''}`} style={{ backgroundImage: `url('/2.jpeg')`, position: 'absolute', inset: 0, opacity: currentSlide === 1 ? 1 : 0, transition: 'opacity 0.8s ease-in-out', display: 'flex', alignItems: 'center', padding: '0 5%' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(30, 58, 138, 0.95) 0%, rgba(30, 58, 138, 0.8) 45%, rgba(30, 58, 138, 0.2) 75%, transparent 100%)', zIndex: 1 }}></div>
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '850px', color: 'white' }} className={currentSlide === 1 ? 'fade-up active' : 'fade-up'}>
          
          <h1 style={{ fontSize: 'clamp(2.2rem, 4.5vw, 4rem)', lineHeight: '1.1', marginBottom: '8px', fontWeight: 900, textTransform: 'uppercase', textShadow: '2px 2px 4px rgba(0,0,0,0.5)', color: '#FDE047' }}>
            PENERIMAAN MAHASISWA BARU
          </h1>
          <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 3rem)', lineHeight: '1.1', marginBottom: '16px', fontWeight: 900, textTransform: 'uppercase', textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
            JALUR BEASISWA KIP-K
          </h2>
          <div style={{ display: 'inline-block', background: '#1E3A8A', border: '2px solid white', color: 'white', padding: '6px 20px', fontSize: '1.2rem', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '24px', borderRadius: '30px' }}>
            TAHUN AKADEMIK 2026/2027
          </div>

          <div style={{ display: 'inline-block', background: '#FDE047', color: '#1E3A8A', padding: '8px 24px', fontSize: '1.2rem', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '24px', borderRadius: '30px', marginLeft: '12px', animation: 'pulse 2s infinite' }}>
            KUOTA TERBATAS!
          </div>
          
          <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '16px', borderBottom: '2px solid rgba(255,255,255,0.3)', paddingBottom: '8px', display: 'inline-block' }}>
            KULIAH BERKUALITAS & GRATIS DI UMIBA
          </h3>
          
          <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 30px 0', fontSize: '1.05rem', lineHeight: '1.8' }}>
            <li><i className="ph-fill ph-check-circle" style={{ color: '#4ade80', marginRight: '8px' }}></i> Ter-Akreditasi <b>BAIK SEKALI</b></li>
            <li><i className="ph-fill ph-check-circle" style={{ color: '#4ade80', marginRight: '8px' }}></i> Kuliah <b>Tanpa Biaya</b>, Hidup Lebih Tenang;</li>
            <li><i className="ph-fill ph-check-circle" style={{ color: '#4ade80', marginRight: '8px' }}></i> Terbuka untuk Lulusan SMA/SMK/MA Sederajat tahun <b>2024, 2025 atau 2026</b>;</li>
            <li><i className="ph-fill ph-check-circle" style={{ color: '#4ade80', marginRight: '8px' }}></i> Pendaftaran Online <b>Mudah & Transparan</b> melalui Portal Resmi KIP-K;</li>
            <li><i className="ph-fill ph-check-circle" style={{ color: '#4ade80', marginRight: '8px' }}></i> Terintegrasi dengan <b>Seleksi Nasional</b>;</li>
          </ul>

          <div style={{ background: 'white', padding: '12px 24px', borderRadius: '12px', display: 'inline-flex', alignItems: 'center', gap: '12px', color: '#1E3A8A' }}>
            <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>Informasi Pendaftaran:</span>
            <span style={{ fontWeight: 900, fontSize: '1.5rem' }}>0811 870 114</span>
            <i className="ph-fill ph-whatsapp-logo" style={{ color: '#25D366', fontSize: '2rem' }}></i>
          </div>
        </div>
      </div>

      {/* SLIDE 3: Penerimaan Umum S1 S2 */}
      <div className={`hero-slide ${currentSlide === 2 ? 'active' : ''}`} style={{ backgroundImage: `url('/3.jpeg')`, position: 'absolute', inset: 0, opacity: currentSlide === 2 ? 1 : 0, transition: 'opacity 0.8s ease-in-out', display: 'flex', alignItems: 'center', padding: '0 5%' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(136, 17, 34, 0.95) 0%, rgba(136, 17, 34, 0.8) 45%, rgba(136, 17, 34, 0.2) 75%, transparent 100%)', zIndex: 1 }}></div>
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '850px', color: 'white' }} className={currentSlide === 2 ? 'fade-up active' : 'fade-up'}>
          
          <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', lineHeight: '1.1', marginBottom: '8px', fontWeight: 900, textTransform: 'uppercase', textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
            PENERIMAAN MAHASISWA BARU
          </h1>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', lineHeight: '1.1', marginBottom: '16px', fontWeight: 900, textTransform: 'uppercase', fontStyle: 'italic', color: '#FDE047', textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
            UNIVERSITAS MITRA BANGSA
          </h2>
          <div style={{ display: 'inline-block', background: 'transparent', border: '2px solid white', color: 'white', padding: '6px 20px', fontSize: '1.2rem', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '30px', borderRadius: '30px' }}>
            TAHUN AKADEMIK 2026/2027
          </div>

          <h3 style={{ fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '12px' }}>PROGRAM STUDI:</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '40px', fontSize: '1.1rem', fontWeight: 600 }}>
            <div><i className="ph-bold ph-check" style={{ color: '#FDE047', marginRight: '8px' }}></i>(S2) MAGISTER MANAJEMEN</div>
            <div><i className="ph-bold ph-check" style={{ color: '#FDE047', marginRight: '8px' }}></i>(S1) MANAJEMEN</div>
            <div><i className="ph-bold ph-check" style={{ color: '#FDE047', marginRight: '8px' }}></i>(S1) ILMU AKTUARIA</div>
            <div><i className="ph-bold ph-check" style={{ color: '#FDE047', marginRight: '8px' }}></i>(S1) ILMU KOMPUTER</div>
            <div><i className="ph-bold ph-check" style={{ color: '#FDE047', marginRight: '8px' }}></i>(S1) HUKUM</div>
            <div><i className="ph-bold ph-check" style={{ color: '#FDE047', marginRight: '8px' }}></i>(S1) SISTEM & TEKNOLOGI INFORMASI</div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
            <a href="#" className="btn" style={{ background: '#FDE047', color: '#881122', padding: '14px 32px', fontSize: '1.2rem', fontWeight: 'bold', borderRadius: '30px', textTransform: 'uppercase', boxShadow: '0 4px 15px rgba(253, 224, 71, 0.4)' }}>
              DAFTAR SEKARANG
            </a>
            <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
              Informasi Pendaftaran:<br/>
              <span style={{ fontSize: '1.6rem', color: '#FDE047' }}>0811 870 114</span>
            </div>
          </div>
        </div>
      </div>

    </div>
    
    {/*  Slider Controls  */}
    <button className="hero-arrow prev" aria-label="Previous Slide" onClick={prevSlide}>
      <i className="ph-bold ph-caret-left"></i>
    </button>
    <button className="hero-arrow next" aria-label="Next Slide" onClick={nextSlide}>
      <i className="ph-bold ph-caret-right"></i>
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
    <div className="glass glass-card grid grid-4 fade-up" style={{ textAlign: 'center', padding: 'var(--space-5)' }}>
      <div>
        <i className="ph-duotone ph-users-three" style={{ fontSize: '3rem', color: 'var(--umiba-red)', marginBottom: '12px' }}></i>
        <h2 style={{ margin: '0' }} className="text-gradient">5000+</h2>
        <p style={{ margin: '0', fontSize: '1.05rem', fontWeight: '500' }}>{t("home.mahasiswa_aktif")}</p>
      </div>
      <div>
        <i className="ph-duotone ph-chalkboard-teacher" style={{ fontSize: '3rem', color: 'var(--umiba-red)', marginBottom: '12px' }}></i>
        <h2 style={{ margin: '0' }} className="text-gradient">150+</h2>
        <p style={{ margin: '0', fontSize: '1.05rem', fontWeight: '500' }}>{t("home.dosen_berkualitas")}</p>
      </div>
      <div>
        <i className="ph-duotone ph-books" style={{ fontSize: '3rem', color: 'var(--umiba-red)', marginBottom: '12px' }}></i>
        <h2 style={{ margin: '0' }} className="text-gradient">7</h2>
        <p style={{ margin: '0', fontSize: '1.05rem', fontWeight: '500' }}>{t("home.program_studi")}</p>
      </div>
      <div>
        <i className="ph-duotone ph-medal" style={{ fontSize: '3rem', color: 'var(--umiba-red)', marginBottom: '12px' }}></i>
        <h2 style={{ margin: '0' }} className="text-gradient">30+</h2>
        <p style={{ margin: '0', fontSize: '1.05rem', fontWeight: '500' }}>{t("home.tahun_berpengalaman")}</p>
      </div>
    </div>
  </div>
</section>

{/*  ░░░ SAMBUTAN REKTOR ░░░  */}
<section id="sambutan" style={{ padding: 'var(--space-8) 0' }}>
  <div className="container grid grid-2" style={{ alignItems: 'center' }}>
    <div className="glass glass-card fade-up" style={{ padding: '0', overflow: 'hidden', position: 'relative' }}>
      <img src="https://umiba.ac.id/wp-content/uploads/2026/05/rektor-UMIBA-2026.jpeg" alt="Rektor UMIBA" style={{ width: '100%', height: 'auto', objectFit: 'cover' }} onerror="this.src='https://via.placeholder.com/600x600/f1f5f9/B91C1C?text=Rektor+UMIBA'"/>
      <div className="glass" style={{ position: 'absolute', bottom: 'var(--space-4)', left: 'var(--space-4)', right: 'var(--space-4)', padding: 'var(--space-3)' }}>
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
        <div className="glass glass-card" style={{ padding: 'var(--space-3)' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>{t("home.kurikulum_modern")}</h3>
          <p style={{ fontSize: '0.9rem', margin: '0' }}>{t("home.kurikulum_desc")}</p>
        </div>
        <div className="glass glass-card" style={{ padding: 'var(--space-3)' }}>
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
      <div className="glass glass-card fade-up">
        <div style={{ background: 'var(--umiba-red-alpha)', width: '64px', height: '64px', borderRadius: 'var(--radius-full)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 'var(--space-4)' }}>
          <i className="ph-duotone ph-briefcase" style={{ fontSize: '2.2rem', color: 'var(--umiba-red)' }}></i>
        </div>
        <div style={{ minHeight: '240px' }}>
          <h3 style={{ fontSize: '1.4rem' }}>{t("home.fak_manajemen")}</h3>
          <p>{t("home.fak_manajemen_desc")}</p>
        </div>
        <ul style={{ listStyle: 'none', padding: '0', marginBottom: 'var(--space-4)', color: 'var(--color-muted)' }}>
          <li style={{ marginBottom: '8px', display: 'flex', alignItems: 'center' }}><i className="ph-fill ph-check-circle" style={{ color: 'var(--umiba-red)', marginRight: '10px', fontSize: '1.2rem' }}></i> S1 Manajemen</li>
          <li style={{ marginBottom: '8px', display: 'flex', alignItems: 'center' }}><i className="ph-fill ph-check-circle" style={{ color: 'var(--umiba-red)', marginRight: '10px', fontSize: '1.2rem' }}></i> S2 Magister Manajemen</li>
        </ul>
        <a href="/akademik?tab=manajemen" className="btn btn-glass" style={{ width: '100%', marginTop: 'auto' }}>{t("home.lihat_fakultas")}</a>
      </div>
      
      {/*  Card 2  */}
      <div className="glass glass-card fade-up" style={{ transitionDelay: '0.1s' }}>
        <div style={{ background: 'var(--umiba-red-alpha)', width: '64px', height: '64px', borderRadius: 'var(--radius-full)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 'var(--space-4)' }}>
          <i className="ph-duotone ph-scales" style={{ fontSize: '2.2rem', color: 'var(--umiba-red)' }}></i>
        </div>
        <div style={{ minHeight: '240px' }}>
          <h3 style={{ fontSize: '1.4rem' }}>{t("home.fak_hukum")}</h3>
          <p>{t("home.fak_hukum_desc")}</p>
        </div>
        <ul style={{ listStyle: 'none', padding: '0', marginBottom: 'var(--space-4)', color: 'var(--color-muted)' }}>
          <li style={{ marginBottom: '8px', display: 'flex', alignItems: 'center' }}><i className="ph-fill ph-check-circle" style={{ color: 'var(--umiba-red)', marginRight: '10px', fontSize: '1.2rem' }}></i> S1 Ilmu Hukum</li>
        </ul>
        <a href="/akademik?tab=hukum" className="btn btn-glass" style={{ width: '100%', marginTop: 'auto' }}>{t("home.lihat_fakultas")}</a>
      </div>
      
      {/*  Card 3  */}
      <div className="glass glass-card fade-up" style={{ transitionDelay: '0.2s' }}>
        <div style={{ background: 'var(--umiba-red-alpha)', width: '64px', height: '64px', borderRadius: 'var(--radius-full)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 'var(--space-4)' }}>
          <i className="ph-duotone ph-laptop" style={{ fontSize: '2.2rem', color: 'var(--umiba-red)' }}></i>
        </div>
        <div style={{ minHeight: '240px' }}>
          <h3 style={{ fontSize: '1.4rem' }}>{t("home.fak_ti")}</h3>
          <p>{t("home.fak_ti_desc")}</p>
        </div>
        <ul style={{ listStyle: 'none', padding: '0', marginBottom: 'var(--space-4)', color: 'var(--color-muted)' }}>
          <li style={{ marginBottom: '8px', display: 'flex', alignItems: 'center' }}><i className="ph-fill ph-check-circle" style={{ color: 'var(--umiba-red)', marginRight: '10px', fontSize: '1.2rem' }}></i> S1 Ilmu Komputer</li>
          <li style={{ marginBottom: '8px', display: 'flex', alignItems: 'center' }}><i className="ph-fill ph-check-circle" style={{ color: 'var(--umiba-red)', marginRight: '10px', fontSize: '1.2rem' }}></i> S1 Sistem &amp; TI</li>
          <li style={{ marginBottom: '8px', display: 'flex', alignItems: 'center' }}><i className="ph-fill ph-check-circle" style={{ color: 'var(--umiba-red)', marginRight: '10px', fontSize: '1.2rem' }}></i> S1 Ilmu Aktuaria</li>
        </ul>
        <a href="/akademik?tab=it" className="btn btn-glass" style={{ width: '100%', marginTop: 'auto' }}>{t("home.lihat_fakultas")}</a>
      </div>
    </div>
  </div>
</section>

{/*  ░░░ AKREDITASI ░░░  */}
<section id="akreditasi" style={{ padding: 'var(--space-8) 0', background: 'var(--color-surface)' }}>
  <div className="container">
    <div style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }} className="fade-up">
      <span className="text-red" style={{ fontWeight: '600', textTransform: 'uppercase' }}>{t("home.kepercayaan_kualitas")}</span>
      <h2>{t("home.sertifikat_akreditasi")}</h2>
    </div>
    <div className="cert-slider fade-up" style={{ marginTop: 'var(--space-5)' }}>
      <div className="cert-slide">
        <img src="https://umiba.ac.id/wp-content/uploads/2026/05/Serifikat-Lamsama-BaikAKTUARIA-768x543.webp" alt="Akreditasi S1 Ilmu Aktuaria"/>
      </div>
      <div className="cert-slide">
        <img src="https://umiba.ac.id/wp-content/uploads/2025/05/Sertifikat-UMIBA_page-0001-768x543.jpg" alt="Akreditasi Institusi UMIBA"/>
      </div>
      <div className="cert-slide">
        <img src="https://umiba.ac.id/wp-content/uploads/2024/05/Sertifikat-Akreditasi-S1-Manajemen-UMIBA-768x543.jpg" alt="Akreditasi S1 Manajemen"/>
      </div>
      <div className="cert-slide">
        <img src="https://umiba.ac.id/wp-content/uploads/2025/01/WhatsApp-Image-2025-01-23-at-3.58.34-PM-768x536.jpeg" alt="Akreditasi S2 Manajemen"/>
      </div>
      <div className="cert-slide">
        <img src="https://umiba.ac.id/wp-content/uploads/2025/05/Sertifikat_RPL_S2_2025-2026_Ganjil-768x502.jpg" alt="Sertifikat RPL S2"/>
      </div>
    </div>
    <input type="range" className="custom-scrollbar" data-target=".cert-slider" min="0" max="100" value="0" />
  </div>
</section>

{/*  ░░░ BERITA TERBARU ░░░  */}
<section id="berita" style={{ padding: 'var(--space-8) 0' }}>
  <div className="container">
    <div className="flex" style={{ justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 'var(--space-6)' }} className="fade-up">
      <div>
        <span className="text-red" style={{ fontWeight: '600', textTransform: 'uppercase' }}>{t("home.kabar_kampus")}</span>
        <h2 style={{ marginBottom: '0' }}>{t("home.berita_pengumuman")}</h2>
      </div>
      <a href="/berita" className="btn btn-glass">{t("home.lihat_semua")}</a>
    </div>
    <div className="grid grid-3">
      {newsData && newsData.length > 0 ? (
        newsData.map((newsItem, index) => (
          <div key={newsItem.id} className="glass glass-card fade-up" style={{ transitionDelay: `${index * 0.1}s` }}>
            <div style={{ background: 'var(--color-muted)', height: '200px', borderRadius: 'var(--radius-sm)', marginBottom: 'var(--space-3)', overflow: 'hidden' }}>
               <img src={newsItem.image_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={newsItem.title}/>
            </div>
            <p style={{ fontSize: '0.8rem', marginBottom: '8px' }}>{newsItem.date}</p>
            <h3 style={{ fontSize: '1.1rem' }}>{newsItem.title}</h3>
          </div>
        ))
      ) : (
        <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', background: 'var(--color-surface)', borderRadius: '16px' }}>
          <p style={{ color: '#64748b', fontSize: '1.1rem', margin: 0 }}>{t("home.belum_ada_berita")}</p>
        </div>
      )}
    </div>
  </div>
</section>

{/*  ░░░ LOKASI KAMPUS ░░░  */}
<section id="lokasi" style={{ padding: 'var(--space-8) 0', backgroundColor: 'var(--slate-50)' }}>
  <div className="container fade-up">
    <div style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }}>
      <h2 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>{t("home.lokasi_kampus")}</h2>
      <p style={{ color: 'var(--slate-600)', fontSize: '1.1rem' }}>{t("home.lokasi_desc")}</p>
    </div>
    <div className="grid grid-2" style={{ gap: 'var(--space-6)' }}>
      {/*  Kampus Pasar Minggu  */}
      <div className="glass glass-card" style={{ padding: 'var(--space-4)' }}>
        <h3 style={{ color: 'var(--umiba-red-dark)', marginBottom: 'var(--space-2)' }}><i className="ph-fill ph-map-pin" style={{ color: 'var(--umiba-red)', marginRight: '8px' }}></i>{t("home.kampus_pasar_minggu")}</h3>
        <p style={{ color: 'var(--slate-600)', marginBottom: 'var(--space-4)', lineHeight: '1.5', fontSize: '0.95rem' }}>
          {t("home.alamat_pm")}
        </p>
        <div style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', height: '300px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
          <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3965.8021859604723!2d106.84124877521778!3d-6.289711293699269!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69eda4b9cb7a3b%3A0xa480a640215e1b50!2sUniversitas%20Mitra%20Bangsa%20Jakarta%20(UMIBA)!5e0!3m2!1sid!2sid!4v1780999630946!5m2!1sid!2sid" width="100%" height="100%" style={{ border: '0' }} allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
        </div>
      </div>
      
      {/*  Kampus Bintaro  */}
      <div className="glass glass-card" style={{ padding: 'var(--space-4)' }}>
        <h3 style={{ color: 'var(--umiba-red-dark)', marginBottom: 'var(--space-2)' }}><i className="ph-fill ph-map-pin" style={{ color: 'var(--umiba-red)', marginRight: '8px' }}></i>{t("home.kampus_bintaro")}</h3>
        <p style={{ color: 'var(--slate-600)', marginBottom: 'var(--space-4)', lineHeight: '1.5', fontSize: '0.95rem' }}>
          {t("home.alamat_bintaro")}
        </p>
        <div style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', height: '300px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
          <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7931.8354716433105!2d106.76112597521758!3d-6.274546893714218!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f029893119b5%3A0x83f8e2bcc968c64a!2sUniversitas%20Mitra%20Bangsa%20Bintaro%20(UMIBA)!5e0!3m2!1sid!2sid!4v1780999658632!5m2!1sid!2sid" width="100%" height="100%" style={{ border: '0' }} allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
        </div>
      </div>
    </div>
  </div>
</section>

{/*  ░░░ PMB CTA ░░░  */}
<section style={{ padding: 'var(--space-8) 0' }}>
  <div className="container">
    <div className="glass glass-card grid grid-2 fade-up" style={{ alignItems: 'center', background: 'var(--glass-bg)' }}>
      <div>
        <span className="text-red" style={{ fontWeight: '600', textTransform: 'uppercase' }}>{t("home.pendaftaran_dibuka")}</span>
        <h2 style={{ marginTop: '8px' }}>{t("home.penerimaan_maba")}</h2>
        <p>{t("home.penerimaan_desc")}</p>
      </div>
      <div className="flex-center" style={{ gap: 'var(--space-3)', flexWrap: 'wrap' }}>
        <a href="https://pmb.umiba.ac.id/" target="_blank" className="btn btn-primary">{t("home.daftar_online")}</a>
        <a href="https://wa.me/62811870114" target="_blank" className="btn btn-glass">{t("home.whatsapp_kami")}</a>
      </div>
    </div>
  </div>
</section>

{/*  ░░░ LIPUTAN MEDIA ░░░  */}
<section style={{ padding: 'var(--space-8) 0', background: 'var(--color-background)' }}>
  <div className="container">
    <div style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }} className="fade-up">
      <span className="text-red" style={{ fontWeight: '600', textTransform: 'uppercase' }}>{t("home.kabar_terkini")}</span>
      <h2>{t("home.liputan_media")}</h2>
    </div>
    <div className="grid grid-4">
      <div className="glass glass-card media-card fade-up">
        <div className="media-img-wrap">
          <img src="https://umiba.ac.id/wp-content/uploads/2025/12/umiba-4pilar-1536x938-1.jpeg" alt="Berita 1"/>
        </div>
        <div className="media-content">
          <div className="media-source"><i className="ph-fill ph-newspaper"></i> kompaskampus.id</div>
          <h3 style={{ fontSize: '1.05rem', lineHeight: '1.4', margin: '0' }}>UMIBA Gelar Seminar Kebangsaan, Teguhkan Budaya Kampus Berbasis 4 Pilar Kebangsaan</h3>
        </div>
      </div>
      <div className="glass glass-card media-card fade-up" style={{ transitionDelay: '0.1s' }}>
        <div className="media-img-wrap">
          <img src="https://umiba.ac.id/wp-content/uploads/2025/10/serba-serbi_155621_big.webp" alt="Berita 2"/>
        </div>
        <div className="media-content">
          <div className="media-source"><i className="ph-fill ph-newspaper"></i> wartaekonomi.co.id</div>
          <h3 style={{ fontSize: '1.05rem', lineHeight: '1.4', margin: '0' }}>IKADIM dan Universitas Mitra Bangsa Teken MoU untuk Tingkatkan Kualitas Tri Dharma Perguruan Tinggi</h3>
        </div>
      </div>
      <div className="glass glass-card media-card fade-up" style={{ transitionDelay: '0.2s' }}>
        <div className="media-img-wrap">
          <img src="https://umiba.ac.id/wp-content/uploads/2025/10/medium_tscom_news_photo_1759914601.jpg" alt="Berita 3"/>
        </div>
        <div className="media-content">
          <div className="media-source"><i className="ph-fill ph-newspaper"></i> teropongsenayan.com</div>
          <h3 style={{ fontSize: '1.05rem', lineHeight: '1.4', margin: '0' }}>IKADIM dan Universitas Mitra Bangsa Teken MoU untuk Tingkatkan Kualitas Tri Dharma Perguruan Tinggi</h3>
        </div>
      </div>
      <div className="glass glass-card media-card fade-up" style={{ transitionDelay: '0.3s' }}>
        <div className="media-img-wrap">
          <img src="https://umiba.ac.id/wp-content/uploads/2025/08/umiba-upacara.jpg" alt="Berita 4"/>
        </div>
        <div className="media-content">
          <div className="media-source"><i className="ph-fill ph-newspaper"></i> newsdetik.co</div>
          <h3 style={{ fontSize: '1.05rem', lineHeight: '1.4', margin: '0' }}>Universitas Mitra Bangsa Selenggarakan Gebyar Kemerdekaan HUT-RI Ke-80</h3>
        </div>
      </div>
      
      <div className="glass glass-card media-card fade-up">
        <div className="media-img-wrap">
          <img src="https://umiba.ac.id/wp-content/uploads/2025/08/umiba-upacara.jpg" alt="Berita 5"/>
        </div>
        <div className="media-content">
          <div className="media-source"><i className="ph-fill ph-newspaper"></i> kompaskampus.id</div>
          <h3 style={{ fontSize: '1.05rem', lineHeight: '1.4', margin: '0' }}>Universitas Mitra Bangsa Gelar Gebyar Kemerdekaan HUT-RI</h3>
        </div>
      </div>
      <div className="glass glass-card media-card fade-up" style={{ transitionDelay: '0.1s' }}>
        <div className="media-img-wrap">
          <img src="https://umiba.ac.id/wp-content/uploads/2025/07/pilarparlemen.jpg" style={{ objectFit: 'contain', background: '#fff' }} alt="Berita 6"/>
        </div>
        <div className="media-content">
          <div className="media-source"><i className="ph-fill ph-newspaper"></i> pilarparlemen.id</div>
          <h3 style={{ fontSize: '1.05rem', lineHeight: '1.4', margin: '0' }}>BEM UMIBA Desak Pemkot Jakarta Selatan Atasi Penumpukan Sampah di Sekitar Kampus</h3>
        </div>
      </div>
      <div className="glass glass-card media-card fade-up" style={{ transitionDelay: '0.2s' }}>
        <div className="media-img-wrap">
          <img src="https://umiba.ac.id/wp-content/uploads/2026/05/audensiUMIBA-300x158.webp" alt="Berita 7"/>
        </div>
        <div className="media-content">
          <div className="media-source"><i className="ph-fill ph-newspaper"></i> kompaskampus.id</div>
          <h3 style={{ fontSize: '1.05rem', lineHeight: '1.4', margin: '0' }}>Kampus UMIBA Terima Kunjungan Kehormatan dari Anggota DPR RI dan Ketua Umum IKADIM, Dr. Jazuli Juwaini, MA</h3>
        </div>
      </div>
      <div className="glass glass-card media-card fade-up" style={{ transitionDelay: '0.3s' }}>
        <div className="media-img-wrap">
          <img src="https://umiba.ac.id/wp-content/uploads/2026/05/audensiUMIBA-300x158.webp" alt="Berita 8"/>
        </div>
        <div className="media-content">
          <div className="media-source"><i className="ph-fill ph-newspaper"></i> newsdetik.co</div>
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
          <div key={testi.id} className="testi-card" style={{ border: 'none', background: 'transparent', boxShadow: 'none' }}>
            <img className="alumni-img" style={{ borderRadius: 'var(--radius-lg)', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }} src={testi.image_url} alt={`Testimoni ${index + 1}`}/>
          </div>
        ))
      ) : (
        <div style={{ textAlign: 'center', padding: '20px' }}>{t("home.loading_testimoni")}</div>
      )}
    </div>
    <input type="range" className="custom-scrollbar" data-target=".testi-slider" min="0" max="100" value="0" />
  </div>
</section>



{/*  ░░░ FOOTER UNIK ░░░  */}



      </>
  );
}
