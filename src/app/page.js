
"use client";
import { useEffect, useState } from 'react';

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    // Basic slider logic
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <script src="https://unpkg.com/@phosphor-icons/web"></script>
      <div className="custom-scrollbar">
        

{/*  ░░░ HEADER ░░░  */}
<header id="site-header">
  <div className="glass">
    <a href="#" className="logo" aria-label="UMIBA Home">
      <img src="erasebg-transformed.png" alt="Logo UMIBA" onerror="this.onerror=null;this.src='https://via.placeholder.com/40x40/B91C1C/fff?text=U'"/>
    </a>
    <ul className="nav-links">
      <li className="nav-item"><a href="index.html" className="nav-link">HOME</a></li>
      <li className="nav-item">
        <a href="profil.html" className="nav-link">PROFIL <span className="dropdown-icon">▼</span></a>
        <div className="mega-menu grid-2 align-center">
          <div>
            <h4 style={{ fontSize: '0.8rem', color: 'var(--umiba-red)', marginBottom: '12px', textTransform: 'uppercase', borderBottom: '1px solid rgba(0,0,0,0.1)', paddingBottom: '8px' }}>Identitas Kampus</h4>
            <a href="profil.html#sejarah" className="dropdown-link" style={{ padding: '8px 12px', fontSize: '0.9rem' }}><i className="ph-bold ph-clock-counter-clockwise" style={{ marginRight: '8px' }}></i> Sejarah</a>
            <a href="profil.html#visi-misi" className="dropdown-link" style={{ padding: '8px 12px', fontSize: '0.9rem' }}><i className="ph-bold ph-target" style={{ marginRight: '8px' }}></i> Visi dan Misi</a>
            <a href="profil.html#tujuan" className="dropdown-link" style={{ padding: '8px 12px', fontSize: '0.9rem' }}><i className="ph-bold ph-flag-banner" style={{ marginRight: '8px' }}></i> Tujuan UMIBA</a>
          </div>
          <div style={{ background: 'rgba(185, 28, 28, 0.03)', padding: '16px', borderRadius: 'var(--radius-md)', marginTop: '-12px' }}>
            <h4 style={{ fontSize: '0.8rem', color: 'var(--umiba-red)', marginBottom: '12px', textTransform: 'uppercase' }}>Manajemen & Fasilitas</h4>
            <a href="profil.html#sasaran" className="dropdown-link" style={{ padding: '8px 12px', fontSize: '0.9rem' }}><i className="ph-bold ph-chart-line-up" style={{ marginRight: '8px' }}></i> Strategi Pencapaian</a>
            <a href="profil.html#struktur" className="dropdown-link" style={{ padding: '8px 12px', fontSize: '0.9rem' }}><i className="ph-bold ph-users-three" style={{ marginRight: '8px' }}></i> Struktur Organisasi</a>
            <a href="fasilitas.html" className="dropdown-link" style={{ padding: '8px 12px', fontSize: '0.9rem' }}><i className="ph-bold ph-buildings" style={{ marginRight: '8px' }}></i> Fasilitas Kampus</a>
          </div>
        </div>
      </li>
      <li className="nav-item">
        <a href="akademik.html" className="nav-link">AKADEMIK <span className="dropdown-icon">▼</span></a>
        <div className="mega-menu grid-3 align-center">
          
          {/*  Column 1: Fakultas & Prodi  */}
          <div>
            <h4 style={{ fontSize: '0.8rem', color: 'var(--umiba-red)', marginBottom: '12px', textTransform: 'uppercase', borderBottom: '1px solid rgba(0,0,0,0.1)', paddingBottom: '8px' }}>Manajemen &amp; Bisnis</h4>
            <a href="prodi-manajemen.html" className="dropdown-link" style={{ padding: '8px 12px', fontSize: '0.9rem' }}>S1 Manajemen</a>
            <a href="prodi-magister.html" className="dropdown-link" style={{ padding: '8px 12px', fontSize: '0.9rem' }}>S2 Magister Manajemen</a>
            
            <h4 style={{ fontSize: '0.8rem', color: 'var(--umiba-red)', marginBottom: '12px', marginTop: '24px', textTransform: 'uppercase', borderBottom: '1px solid rgba(0,0,0,0.1)', paddingBottom: '8px' }}>Ilmu Hukum</h4>
            <a href="prodi-hukum.html" className="dropdown-link" style={{ padding: '8px 12px', fontSize: '0.9rem' }}>S1 Ilmu Hukum</a>
          </div>
          
          {/*  Column 2: Fakultas & Prodi  */}
          <div>
            <h4 style={{ fontSize: '0.8rem', color: 'var(--umiba-red)', marginBottom: '12px', textTransform: 'uppercase', borderBottom: '1px solid rgba(0,0,0,0.1)', paddingBottom: '8px' }}>TI &amp; Aktuaria</h4>
            <a href="prodi-komputer.html" className="dropdown-link" style={{ padding: '8px 12px', fontSize: '0.9rem' }}>S1 Ilmu Komputer</a>
            <a href="prodi-sistem.html" className="dropdown-link" style={{ padding: '8px 12px', fontSize: '0.9rem' }}>S1 Sistem &amp; Teknologi Informasi</a>
            <a href="prodi-aktuaria.html" className="dropdown-link" style={{ padding: '8px 12px', fontSize: '0.9rem' }}>S1 Ilmu Aktuaria</a>
          </div>
          
          {/*  Column 3: Akademik Umum  */}
          <div style={{ background: 'rgba(185, 28, 28, 0.03)', padding: '16px', borderRadius: 'var(--radius-md)' }}>
            <h4 style={{ fontSize: '0.8rem', color: 'var(--umiba-red)', marginBottom: '12px', textTransform: 'uppercase' }}>Layanan Akademik</h4>
            <a href="kurikulum.html" className="dropdown-link" style={{ padding: '8px 12px', fontSize: '0.9rem' }}><i className="ph-bold ph-book-open" style={{ marginRight: '8px' }}></i> Kurikulum</a>
            <a href="kurikulum.html#kalender" className="dropdown-link" style={{ padding: '8px 12px', fontSize: '0.9rem' }}><i className="ph-bold ph-calendar" style={{ marginRight: '8px' }}></i> Kalender Akademik</a>
            <a href="kegiatan-dosen.html" className="dropdown-link" style={{ padding: '8px 12px', fontSize: '0.9rem' }}><i className="ph-bold ph-chalkboard-teacher" style={{ marginRight: '8px' }}></i> Kegiatan Dosen</a>
            
            <h4 style={{ fontSize: '0.8rem', color: 'var(--umiba-red)', marginBottom: '12px', marginTop: '24px', textTransform: 'uppercase' }}>Kemahasiswaan</h4>
            <a href="dokumen.html#mahasiswa" className="dropdown-link" style={{ padding: '8px 12px', fontSize: '0.9rem' }}><i className="ph-bold ph-users-three" style={{ marginRight: '8px' }}></i> BEM &amp; ORMAWA</a>
            <a href="dokumen.html#mahasiswa" className="dropdown-link" style={{ padding: '8px 12px', fontSize: '0.9rem' }}><i className="ph-bold ph-file-pdf" style={{ marginRight: '8px' }}></i> Unduh Pedoman</a>
          </div>
          
        </div>
      </li>
      <li className="nav-item"><a href="lppm.html" className="nav-link">LPPM</a></li>
      <li className="nav-item"><a href="mutu.html" className="nav-link">MUTU</a></li>
      <li className="nav-item">
        <a href="#" className="nav-link">PORTAL <span className="dropdown-icon">▼</span></a>
        <div className="mega-menu grid-2 align-right">
          <div>
            <h4 style={{ fontSize: '0.8rem', color: 'var(--umiba-red)', marginBottom: '12px', textTransform: 'uppercase', borderBottom: '1px solid rgba(0,0,0,0.1)', paddingBottom: '8px' }}>Sistem Akademik</h4>
            <a href="https://umiba.siakadcloud.com/" target="_blank" className="dropdown-link" style={{ padding: '8px 12px', fontSize: '0.9rem' }}><i className="ph-bold ph-student" style={{ marginRight: '8px' }}></i> Siakad Student</a>
            <a href="https://umiba.siakadcloud.com/" target="_blank" className="dropdown-link" style={{ padding: '8px 12px', fontSize: '0.9rem' }}><i className="ph-bold ph-chalkboard-teacher" style={{ marginRight: '8px' }}></i> Siakad Dosen</a>
          </div>
          <div>
            <h4 style={{ fontSize: '0.8rem', color: 'var(--umiba-red)', marginBottom: '12px', textTransform: 'uppercase', borderBottom: '1px solid rgba(0,0,0,0.1)', paddingBottom: '8px' }}>Sumber Referensi</h4>
            <a href="http://127.0.0.1:8000/" target="_blank" className="dropdown-link" style={{ padding: '8px 12px', fontSize: '0.9rem' }}><i className="ph-bold ph-books" style={{ marginRight: '8px' }}></i> Perpustakaan</a>
            <a href="https://ejurnal.umiba.ac.id/" target="_blank" className="dropdown-link" style={{ padding: '8px 12px', fontSize: '0.9rem' }}><i className="ph-bold ph-article" style={{ marginRight: '8px' }}></i> E-Jurnal</a>
          </div>
        </div>
      </li>
      <li className="nav-item">
        <a href="informasi.html" className="nav-link">INFORMASI <span className="dropdown-icon">▼</span></a>
        <div className="mega-menu grid-2 align-right">
          <div>
            <h4 style={{ fontSize: '0.8rem', color: 'var(--umiba-red)', marginBottom: '12px', textTransform: 'uppercase', borderBottom: '1px solid rgba(0,0,0,0.1)', paddingBottom: '8px' }}>Pendaftaran & Biaya</h4>
            <a href="informasi.html#biaya" className="dropdown-link" style={{ padding: '8px 12px', fontSize: '0.9rem' }}><i className="ph-bold ph-wallet" style={{ marginRight: '8px' }}></i> Biaya Pendidikan</a>
            <a href="dokumen.html" className="dropdown-link" style={{ padding: '8px 12px', fontSize: '0.9rem' }}><i className="ph-bold ph-file-pdf" style={{ marginRight: '8px' }}></i> Dokumen & Brosur</a>
          </div>
          <div>
            <h4 style={{ fontSize: '0.8rem', color: 'var(--umiba-red)', marginBottom: '12px', textTransform: 'uppercase', borderBottom: '1px solid rgba(0,0,0,0.1)', paddingBottom: '8px' }}>Update Kampus</h4>
            <a href="berita.html" className="dropdown-link" style={{ padding: '8px 12px', fontSize: '0.9rem' }}><i className="ph-bold ph-newspaper" style={{ marginRight: '8px' }}></i> Berita Terbaru</a>
            <a href="informasi.html#infografis" className="dropdown-link" style={{ padding: '8px 12px', fontSize: '0.9rem' }}><i className="ph-bold ph-image" style={{ marginRight: '8px' }}></i> Info Grafis</a>
          </div>
        </div>
      </li>
      {/*  MOBILE LANG SWITCH  */}
      <li className="nav-item d-block-mobile" style={{ display: 'none', paddingTop: '16px', marginTop: '16px', borderTop: '1px solid rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontWeight: '700', color: 'var(--color-text)', fontSize: '1.05rem' }}>Bahasa / Language</span>
          <div className="lang-switch">
            <a href="#" className="lang-btn active">ID</a>
            <a href="#" className="lang-btn">EN</a>
          </div>
        </div>
      </li>
    </ul>
    <button className="menu-toggle" aria-label="Toggle Menu">
      <span></span>
      <span></span>
      <span></span>
    </button>
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <div className="lang-switch d-none-mobile">
        <a href="#" className="lang-btn active">ID</a>
        <a href="#" className="lang-btn">EN</a>
      </div>
      <a href="https://pmb.umiba.ac.id/" target="_blank" className="btn btn-primary d-none-mobile">Daftar Sekarang</a>
      <button className="theme-toggle" aria-label="Toggle Theme">
        <i className="ph-bold ph-moon"></i>
      </button>
    </div>
  </div>
</header>

{/*  ░░░ HERO SECTION ░░░  */}
<section className="hero-wrapper" id="beranda">
  <div className="hero" style={{ position: 'relative', overflow: 'hidden' }}>
    {/*  Slider Backgrounds  */}
    <div id="heroSlides" style={{ position: 'absolute', inset: '0', zIndex: '-2' }}>
      <div className="hero-slide active" style={{ backgroundImage: "url('https://umiba.ac.id/wp-content/uploads/2024/05/bannerUMIBA26_1.png')" }}></div>
      <div className="hero-slide" style={{ backgroundImage: "url('https://umiba.ac.id/wp-content/uploads/2024/05/bannerUMIBA26_2.png')" }}></div>
      <div className="hero-slide" style={{ backgroundImage: "url('https://umiba.ac.id/wp-content/uploads/2024/05/bannerUMIBA26_3.png')" }}></div>
    </div>
    
    {/*  Slider Controls  */}
    <button className="hero-arrow prev" aria-label="Previous Slide">
      <i className="ph-bold ph-caret-left"></i>
    </button>
    <button className="hero-arrow next" aria-label="Next Slide">
      <i className="ph-bold ph-caret-right"></i>
    </button>
    <div className="hero-controls">
      <button className="hero-dot active" data-slide="0" aria-label="Slide 1"></button>
      <button className="hero-dot" data-slide="1" aria-label="Slide 2"></button>
      <button className="hero-dot" data-slide="2" aria-label="Slide 3"></button>
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
        <p style={{ margin: '0', fontSize: '1.05rem', fontWeight: '500' }}>Mahasiswa Aktif</p>
      </div>
      <div>
        <i className="ph-duotone ph-chalkboard-teacher" style={{ fontSize: '3rem', color: 'var(--umiba-red)', marginBottom: '12px' }}></i>
        <h2 style={{ margin: '0' }} className="text-gradient">150+</h2>
        <p style={{ margin: '0', fontSize: '1.05rem', fontWeight: '500' }}>Dosen Berkualitas</p>
      </div>
      <div>
        <i className="ph-duotone ph-books" style={{ fontSize: '3rem', color: 'var(--umiba-red)', marginBottom: '12px' }}></i>
        <h2 style={{ margin: '0' }} className="text-gradient">7</h2>
        <p style={{ margin: '0', fontSize: '1.05rem', fontWeight: '500' }}>Program Studi</p>
      </div>
      <div>
        <i className="ph-duotone ph-medal" style={{ fontSize: '3rem', color: 'var(--umiba-red)', marginBottom: '12px' }}></i>
        <h2 style={{ margin: '0' }} className="text-gradient">30+</h2>
        <p style={{ margin: '0', fontSize: '1.05rem', fontWeight: '500' }}>Tahun Berpengalaman</p>
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
        <h3 style={{ margin: '0', fontSize: '1.2rem' }}>Sambutan Rektor</h3>
        <p style={{ margin: '0', fontSize: '0.9rem' }}>"Pendidikan adalah investasi terbaik."</p>
      </div>
    </div>
    <div className="fade-up" style={{ paddingLeft: 'var(--space-4)' }}>
      <span className="text-red" style={{ fontWeight: '600', textTransform: 'uppercase' }}>Pesan Pimpinan</span>
      <h2>Selamat Datang di UMIBA</h2>
      <p>Sarana dan Prasarana yang dimiliki kampus kami meliputi kelas-kelas yang memiliki standar sarana terkini dalam pembelajaran, Perpustakaan yang menyediakan buku-buku terbaru, e-Library, serta jurnal-jurnal bereputasi baik nasional maupun internasional.</p>
      <p>Laboratorium Komputer yang modern mendukung proses pembelajaran mahasiswa serta dimanfaatkan oleh para dosen untuk melaksanakan kegiatan Tri Dharma Perguruan Tinggi.</p>
      <div className="grid grid-2" style={{ marginTop: 'var(--space-4)' }}>
        <div className="glass glass-card" style={{ padding: 'var(--space-3)' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>Kurikulum Modern</h3>
          <p style={{ fontSize: '0.9rem', margin: '0' }}>Relevan dengan kebutuhan industri masa depan.</p>
        </div>
        <div className="glass glass-card" style={{ padding: 'var(--space-3)' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>Kemitraan Industri</h3>
          <p style={{ fontSize: '0.9rem', margin: '0' }}>Jaringan alumni dan korporasi yang luas.</p>
        </div>
      </div>
    </div>
  </div>
</section>

{/*  ░░░ FAKULTAS & PRODI ░░░  */}
<section id="fakultas" style={{ padding: 'var(--space-8) 0', position: 'relative' }}>
  <div className="container">
    <div style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }} className="fade-up">
      <span className="text-red" style={{ fontWeight: '600', textTransform: 'uppercase' }}>Pilihan Studi</span>
      <h2>Fakultas &amp; Program Studi</h2>
      <p style={{ maxWidth: '600px', margin: '0 auto' }}>Pilih program studi yang sesuai dengan passion dan tujuan karier Anda bersama UMIBA.</p>
    </div>
    
    <div className="grid grid-3">
      {/*  Card 1  */}
      <div className="glass glass-card fade-up">
        <div style={{ background: 'rgba(185, 28, 28, 0.08)', width: '64px', height: '64px', borderRadius: 'var(--radius-full)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 'var(--space-4)' }}>
          <i className="ph-duotone ph-briefcase" style={{ fontSize: '2.2rem', color: 'var(--umiba-red)' }}></i>
        </div>
        <div style={{ minHeight: '240px' }}>
          <h3 style={{ fontSize: '1.4rem' }}>Fakultas Manajemen &amp; Bisnis</h3>
          <p>Siapkan diri menjadi pemimpin bisnis masa depan dengan pemahaman mendalam tentang manajemen strategis dan kewirausahaan.</p>
        </div>
        <ul style={{ listStyle: 'none', padding: '0', marginBottom: 'var(--space-4)', color: 'var(--color-muted)' }}>
          <li style={{ marginBottom: '8px', display: 'flex', alignItems: 'center' }}><i className="ph-fill ph-check-circle" style={{ color: 'var(--umiba-red)', marginRight: '10px', fontSize: '1.2rem' }}></i> S1 Manajemen</li>
          <li style={{ marginBottom: '8px', display: 'flex', alignItems: 'center' }}><i className="ph-fill ph-check-circle" style={{ color: 'var(--umiba-red)', marginRight: '10px', fontSize: '1.2rem' }}></i> S2 Magister Manajemen</li>
        </ul>
        <a href="akademik.html?tab=manajemen" className="btn btn-glass" style={{ width: '100%', marginTop: 'auto' }}>Lihat Fakultas</a>
      </div>
      
      {/*  Card 2  */}
      <div className="glass glass-card fade-up" style={{ transitionDelay: '0.1s' }}>
        <div style={{ background: 'rgba(185, 28, 28, 0.08)', width: '64px', height: '64px', borderRadius: 'var(--radius-full)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 'var(--space-4)' }}>
          <i className="ph-duotone ph-scales" style={{ fontSize: '2.2rem', color: 'var(--umiba-red)' }}></i>
        </div>
        <div style={{ minHeight: '240px' }}>
          <h3 style={{ fontSize: '1.4rem' }}>Fakultas Hukum</h3>
          <p>Menjadi ahli hukum yang kompeten, berintegritas tinggi, dan siap menghadapi dinamika hukum nasional maupun internasional.</p>
        </div>
        <ul style={{ listStyle: 'none', padding: '0', marginBottom: 'var(--space-4)', color: 'var(--color-muted)' }}>
          <li style={{ marginBottom: '8px', display: 'flex', alignItems: 'center' }}><i className="ph-fill ph-check-circle" style={{ color: 'var(--umiba-red)', marginRight: '10px', fontSize: '1.2rem' }}></i> S1 Ilmu Hukum</li>
        </ul>
        <a href="akademik.html?tab=hukum" className="btn btn-glass" style={{ width: '100%', marginTop: 'auto' }}>Lihat Fakultas</a>
      </div>
      
      {/*  Card 3  */}
      <div className="glass glass-card fade-up" style={{ transitionDelay: '0.2s' }}>
        <div style={{ background: 'rgba(185, 28, 28, 0.08)', width: '64px', height: '64px', borderRadius: 'var(--radius-full)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 'var(--space-4)' }}>
          <i className="ph-duotone ph-laptop" style={{ fontSize: '2.2rem', color: 'var(--umiba-red)' }}></i>
        </div>
        <div style={{ minHeight: '240px' }}>
          <h3 style={{ fontSize: '1.4rem' }}>Fak. Teknologi Informasi &amp; Aktuaria</h3>
          <p>Kuasai teknologi masa depan dan ilmu aktuaria dengan kurikulum yang terus berkembang mengikuti tren industri digital global.</p>
        </div>
        <ul style={{ listStyle: 'none', padding: '0', marginBottom: 'var(--space-4)', color: 'var(--color-muted)' }}>
          <li style={{ marginBottom: '8px', display: 'flex', alignItems: 'center' }}><i className="ph-fill ph-check-circle" style={{ color: 'var(--umiba-red)', marginRight: '10px', fontSize: '1.2rem' }}></i> S1 Ilmu Komputer</li>
          <li style={{ marginBottom: '8px', display: 'flex', alignItems: 'center' }}><i className="ph-fill ph-check-circle" style={{ color: 'var(--umiba-red)', marginRight: '10px', fontSize: '1.2rem' }}></i> S1 Sistem &amp; TI</li>
          <li style={{ marginBottom: '8px', display: 'flex', alignItems: 'center' }}><i className="ph-fill ph-check-circle" style={{ color: 'var(--umiba-red)', marginRight: '10px', fontSize: '1.2rem' }}></i> S1 Ilmu Aktuaria</li>
        </ul>
        <a href="akademik.html?tab=it" className="btn btn-glass" style={{ width: '100%', marginTop: 'auto' }}>Lihat Fakultas</a>
      </div>
    </div>
  </div>
</section>

{/*  ░░░ AKREDITASI ░░░  */}
<section id="akreditasi" style={{ padding: 'var(--space-8) 0', background: 'rgba(255, 255, 255, 0.4)' }}>
  <div className="container">
    <div style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }} className="fade-up">
      <span className="text-red" style={{ fontWeight: '600', textTransform: 'uppercase' }}>Kepercayaan &amp; Kualitas</span>
      <h2>Sertifikat Akreditasi</h2>
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
        <span className="text-red" style={{ fontWeight: '600', textTransform: 'uppercase' }}>Kabar Kampus</span>
        <h2 style={{ marginBottom: '0' }}>Berita &amp; Pengumuman</h2>
      </div>
      <a href="berita.html" className="btn btn-glass">Lihat Semua</a>
    </div>
    <div className="grid grid-3">
      <div className="glass glass-card fade-up">
        <div style={{ background: 'var(--color-muted)', height: '200px', borderRadius: 'var(--radius-sm)', marginBottom: 'var(--space-3)', overflow: 'hidden' }}>
           <img src="https://umiba.ac.id/wp-content/uploads/2024/05/bannerUMIBA26_1.png" style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Berita"/>
        </div>
        <p style={{ fontSize: '0.8rem', marginBottom: '8px' }}>8 Juni 2026</p>
        <h3 style={{ fontSize: '1.1rem' }}>Penerimaan Mahasiswa Baru Semester Gasal 2025/2026 Resmi Dibuka</h3>
      </div>
      <div className="glass glass-card fade-up" style={{ transitionDelay: '0.1s' }}>
        <div style={{ background: 'var(--color-muted)', height: '200px', borderRadius: 'var(--radius-sm)', marginBottom: 'var(--space-3)', overflow: 'hidden' }}>
           <img src="https://umiba.ac.id/wp-content/uploads/2024/05/bannerUMIBA26_2.png" style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Berita"/>
        </div>
        <p style={{ fontSize: '0.8rem', marginBottom: '8px' }}>5 Juni 2026</p>
        <h3 style={{ fontSize: '1.1rem' }}>Seminar Nasional Teknologi Informasi &amp; Aktuaria 2025</h3>
      </div>
      <div className="glass glass-card fade-up" style={{ transitionDelay: '0.2s' }}>
        <div style={{ background: 'var(--color-muted)', height: '200px', borderRadius: 'var(--radius-sm)', marginBottom: 'var(--space-3)', overflow: 'hidden' }}>
           <img src="https://umiba.ac.id/wp-content/uploads/2024/05/bannerUMIBA26_3.png" style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Berita"/>
        </div>
        <p style={{ fontSize: '0.8rem', marginBottom: '8px' }}>1 Juni 2026</p>
        <h3 style={{ fontSize: '1.1rem' }}>Mahasiswa UMIBA Raih Juara 1 Kompetisi Nasional 2025</h3>
      </div>
    </div>
  </div>
</section>

{/*  ░░░ LOKASI KAMPUS ░░░  */}
<section id="lokasi" style={{ padding: 'var(--space-8) 0', backgroundColor: 'var(--slate-50)' }}>
  <div className="container fade-up">
    <div style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }}>
      <h2 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>Lokasi Kampus UMIBA</h2>
      <p style={{ color: 'var(--slate-600)', fontSize: '1.1rem' }}>Kunjungi kampus kami di Jakarta Selatan dan Bintaro</p>
    </div>
    <div className="grid grid-2" style={{ gap: 'var(--space-6)' }}>
      {/*  Kampus Pasar Minggu  */}
      <div className="glass glass-card" style={{ padding: 'var(--space-4)' }}>
        <h3 style={{ color: 'var(--umiba-red-dark)', marginBottom: 'var(--space-2)' }}><i className="ph-fill ph-map-pin" style={{ color: 'var(--umiba-red)', marginRight: '8px' }}></i>Kampus Pasar Minggu</h3>
        <p style={{ color: 'var(--slate-600)', marginBottom: 'var(--space-4)', lineHeight: '1.5', fontSize: '0.95rem' }}>
          Jl. Raya Tj. Barat No.11, RT.11/RW.8, Pejaten Timur, Ps. Minggu, Kota Jakarta Selatan, Daerah Khusus Ibukota Jakarta 12530
        </p>
        <div style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', height: '300px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
          <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3965.8021859604723!2d106.84124877521778!3d-6.289711293699269!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69eda4b9cb7a3b%3A0xa480a640215e1b50!2sUniversitas%20Mitra%20Bangsa%20Jakarta%20(UMIBA)!5e0!3m2!1sid!2sid!4v1780999630946!5m2!1sid!2sid" width="100%" height="100%" style={{ border: '0' }} allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
        </div>
      </div>
      
      {/*  Kampus Bintaro  */}
      <div className="glass glass-card" style={{ padding: 'var(--space-4)' }}>
        <h3 style={{ color: 'var(--umiba-red-dark)', marginBottom: 'var(--space-2)' }}><i className="ph-fill ph-map-pin" style={{ color: 'var(--umiba-red)', marginRight: '8px' }}></i>Kampus Bintaro</h3>
        <p style={{ color: 'var(--slate-600)', marginBottom: 'var(--space-4)', lineHeight: '1.5', fontSize: '0.95rem' }}>
          Jl. Perdagangan No.54, RT.4/RW.7, Bintaro, Kec. Pesanggrahan, Kota Jakarta Selatan, Daerah Khusus Ibukota Jakarta 12330
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
    <div className="glass glass-card grid grid-2 fade-up" style={{ alignItems: 'center', background: 'linear-gradient(135deg, rgba(255,255,255,0.8), rgba(255,255,255,0.4))' }}>
      <div>
        <span className="text-red" style={{ fontWeight: '600', textTransform: 'uppercase' }}>Pendaftaran Dibuka</span>
        <h2 style={{ marginTop: '8px' }}>Penerimaan Mahasiswa Baru Semester Gasal 2025/2026</h2>
        <p>Jangan lewatkan kesempatan emas untuk bergabung bersama kami. Kuota terbatas!</p>
      </div>
      <div className="flex-center" style={{ gap: 'var(--space-3)', flexWrap: 'wrap' }}>
        <a href="https://pmb.umiba.ac.id/" target="_blank" className="btn btn-primary">Daftar Online</a>
        <a href="https://wa.me/62811870114" target="_blank" className="btn btn-glass">WhatsApp Kami</a>
      </div>
    </div>
  </div>
</section>

{/*  ░░░ LIPUTAN MEDIA ░░░  */}
<section style={{ padding: 'var(--space-8) 0', background: 'var(--color-background)' }}>
  <div className="container">
    <div style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }} className="fade-up">
      <span className="text-red" style={{ fontWeight: '600', textTransform: 'uppercase' }}>Kabar Terkini</span>
      <h2>Liputan Media</h2>
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
      <span className="text-red" style={{ fontWeight: '600', textTransform: 'uppercase' }}>Kisah Sukses</span>
      <h2>Testimoni Alumni</h2>
    </div>
    <div className="testi-slider fade-up">
      <div className="testi-card" style={{ border: 'none', background: 'transparent', boxShadow: 'none' }}>
        <img className="alumni-img" style={{ borderRadius: 'var(--radius-lg)', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }} src="https://umiba.ac.id/wp-content/uploads/2024/05/1-1.png" alt="Testimoni 1"/>
      </div>
      <div className="testi-card" style={{ border: 'none', background: 'transparent', boxShadow: 'none' }}>
        <img className="alumni-img" style={{ borderRadius: 'var(--radius-lg)', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }} src="https://umiba.ac.id/wp-content/uploads/2024/05/2-1.png" alt="Testimoni 2"/>
      </div>
      <div className="testi-card" style={{ border: 'none', background: 'transparent', boxShadow: 'none' }}>
        <img className="alumni-img" style={{ borderRadius: 'var(--radius-lg)', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }} src="https://umiba.ac.id/wp-content/uploads/2024/05/3-1.png" alt="Testimoni 3"/>
      </div>
      <div className="testi-card" style={{ border: 'none', background: 'transparent', boxShadow: 'none' }}>
        <img className="alumni-img" style={{ borderRadius: 'var(--radius-lg)', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }} src="https://umiba.ac.id/wp-content/uploads/2024/05/1-2.png" alt="Testimoni 4"/>
      </div>
      <div className="testi-card" style={{ border: 'none', background: 'transparent', boxShadow: 'none' }}>
        <img className="alumni-img" style={{ borderRadius: 'var(--radius-lg)', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }} src="https://umiba.ac.id/wp-content/uploads/2024/05/2-2.png" alt="Testimoni 5"/>
      </div>
      <div className="testi-card" style={{ border: 'none', background: 'transparent', boxShadow: 'none' }}>
        <img className="alumni-img" style={{ borderRadius: 'var(--radius-lg)', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }} src="https://umiba.ac.id/wp-content/uploads/2024/05/3-2.png" alt="Testimoni 6"/>
      </div>
    </div>
    <input type="range" className="custom-scrollbar" data-target=".testi-slider" min="0" max="100" value="0" />
  </div>
</section>



{/*  ░░░ FOOTER UNIK ░░░  */}
<footer className="unique-footer" style={{ background: 'radial-gradient(circle at top right, #ef4444 0%, #b91c1c 40%, #7f1d1d 80%, #450a0a 100%)', color: 'white', padding: 'var(--space-8) 0 var(--space-4)', position: 'relative', overflow: 'hidden', marginTop: 'var(--space-8)' }}>
  
  {/*  Motif Belah Ketupat (Diamond Pattern) Overlay  */}
  <div style={{ position: 'absolute', inset: '0', backgroundImage: "url('data:image/svg+xml,%3Csvg width=\\'80\\' height=\\'80\\' viewBox=\\'0 0 80 80\\' xmlns=\\'http://www.w3.org/2000/svg\\'%3E%3Cg fill=\\'none\\' fill-rule=\\'evenodd\\'%3E%3Cg fill=\\'%23B91C1C\\' fill-opacity=\\'0.03\\'%3E%3Cpath d=\\'M50 50c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10s-10-4.477-10-10 4.477-10 10-10zM10 10c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10S0 25.523 0 20s4.477-10 10-10zm10 8c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8zm40 40c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8z\\' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E')", backgroundSize: '80px 80px', zIndex: '0', pointerEvents: 'none' }}></div>
  
  <div className="container" style={{ position: 'relative', zIndex: '1' }}>
    <div className="footer-main">
      <div className="footer-logo-col">
        <a href="index.html" className="logo-badge" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '120px', height: '120px', background: 'var(--color-white)', borderRadius: '50%', boxShadow: '0 8px 20px rgba(0,0,0,0.2)', marginBottom: 'var(--space-4)', textDecoration: 'none', transition: 'transform 0.3s ease' }} onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
          <img src="erasebg-transformed.png" alt="Logo UMIBA" style={{ width: '90px', height: '90px', objectFit: 'contain', transform: 'scale(1.15)' }} />
        </a>
        <p style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.9)', marginBottom: 'var(--space-4)', lineHeight: '1.6' }}>Universitas Mitra Bangsa mencetak generasi unggul yang siap menghadapi tantangan global dan dunia kerja digital melalui pendidikan berkualitas tinggi.</p>
        <a href="https://pmb.umiba.ac.id" target="_blank" className="btn" style={{ background: 'var(--color-white)', color: 'var(--umiba-red)', padding: '14px 28px', fontSize: '1.05rem', borderRadius: '50px', fontWeight: 'bold', boxShadow: '0 10px 20px rgba(0,0,0,0.1)', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>Daftar Sekarang <i className="ph-bold ph-arrow-up-right"></i></a>
      </div>
      
      <div className="footer-links-col">
        <div>
          <h4 style={{ color: 'white', fontSize: '1.1rem', marginBottom: 'var(--space-3)', fontWeight: '600' }}>Fakultas</h4>
          <ul style={{ listStyle: 'none', padding: '0', margin: '0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <li><a href="prodi-komputer.html" className="footer-hover-link" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', transition: '0.3s' }}>Ilmu Komputer</a></li>
            <li><a href="prodi-sistem.html" className="footer-hover-link" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', transition: '0.3s' }}>Sistem Informasi</a></li>
            <li><a href="prodi-hukum.html" className="footer-hover-link" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', transition: '0.3s' }}>Hukum</a></li>
            <li><a href="prodi-manajemen.html" className="footer-hover-link" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', transition: '0.3s' }}>Manajemen</a></li>
          </ul>
        </div>
        <div>
          <h4 style={{ color: 'white', fontSize: '1.1rem', marginBottom: 'var(--space-3)', fontWeight: '600' }}>Tautan Utama</h4>
          <ul style={{ listStyle: 'none', padding: '0', margin: '0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <li><a href="profil.html" className="footer-hover-link" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', transition: '0.3s' }}>Tentang Kampus</a></li>
            <li><a href="berita.html" className="footer-hover-link" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', transition: '0.3s' }}>Berita Terbaru</a></li>
            <li><a href="informasi.html" className="footer-hover-link" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', transition: '0.3s' }}>Penerimaan Mahasiswa</a></li>
            <li><a href="#" className="footer-hover-link" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', transition: '0.3s' }}>Kontak &amp; Lokasi</a></li>
          </ul>
        </div>
        <div>
          <h4 style={{ color: 'white', fontSize: '1.1rem', marginBottom: 'var(--space-3)', fontWeight: '600' }}>Media Sosial</h4>
          <ul style={{ listStyle: 'none', padding: '0', margin: '0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <li><a href="#" className="footer-hover-link" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', transition: '0.3s', display: 'flex', alignItems: 'center', gap: '8px' }}><i className="ph-fill ph-instagram-logo"></i> Instagram</a></li>
            <li><a href="#" className="footer-hover-link" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', transition: '0.3s', display: 'flex', alignItems: 'center', gap: '8px' }}><i className="ph-fill ph-youtube-logo"></i> Youtube</a></li>
            <li><a href="#" className="footer-hover-link" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', transition: '0.3s', display: 'flex', alignItems: 'center', gap: '8px' }}><i className="ph-fill ph-facebook-logo"></i> Facebook</a></li>
            <li><a href="#" className="footer-hover-link" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', transition: '0.3s', display: 'flex', alignItems: 'center', gap: '8px' }}><i className="ph-fill ph-tiktok-logo"></i> Tiktok</a></li>
          </ul>
        </div>
      </div>
    </div>
    
    <div className="footer-bottom">
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <p style={{ margin: '0', color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem' }}>&copy; 2026 Universitas Mitra Bangsa. Hak Cipta Dilindungi.</p>
      </div>
      <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', display: 'flex', gap: 'var(--space-4)' }}>
        <a href="#" className="footer-hover-link" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none' }}>Kebijakan Privasi</a>
        <a href="#" className="footer-hover-link" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none' }}>Syarat &amp; Ketentuan</a>
      </div>
    </div>
  </div>
  
  {/* Floating WhatsApp Button */}
</footer>
  <a href="https://wa.me/62811870114" className="wa-float" target="_blank" aria-label="WhatsApp Kami">
    <div className="wa-badge">
      Tanya UMIBA
      <span><i className="ph-fill ph-circle"></i> Terhubung Sekarang</span>
    </div>
    <div className="wa-btn">
      <i className="ph-fill ph-whatsapp-logo"></i>
      <div className="wa-online-dot"></div>
    </div>
  </a>


      </div>
    </>
  );
}
