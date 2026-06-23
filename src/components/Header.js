'use client';
import { useTheme, useLanguage } from '../context/Providers';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const { lang, changeLang, t } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      // Threshold 20px so it immediately reacts
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleDropdownClick = (e) => {
    if (window.innerWidth <= 992) {
      e.preventDefault();
      const parent = e.currentTarget.parentElement;
      parent.classList.toggle('open');
    }
  };

  return (
    <>
      <div className="top-banner" style={{
        background: '#B91C1C', 
        color: '#ffffff', 
        padding: '12px 4vw', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        position: 'relative',
        width: '100%',
        zIndex: 1002,
        fontFamily: 'var(--font-primary)',
        borderBottom: '1px solid rgba(255,255,255,0.1)'
      }}>
        {/* Kiri: Info PMB */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
           <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.15)', padding: '8px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.2)' }}>
             <i className="ph-fill ph-megaphone" style={{ fontSize: '1.4rem', color: '#ffffff' }}></i>
           </div>
           <div style={{ display: 'flex', flexDirection: 'column' }}>
             <span style={{ fontSize: '0.9rem', fontWeight: '800', letterSpacing: '0.5px' }}>
               PENDAFTARAN MAHASISWA BARU 2026/2027
             </span>
             <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
               <span style={{ display: 'inline-flex', position: 'relative', width: '8px', height: '8px' }}>
                 <span style={{ position: 'absolute', display: 'inline-flex', height: '100%', width: '100%', borderRadius: '50%', background: '#4ade80', opacity: '0.7', animation: 'ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite' }}></span>
                 <span style={{ position: 'relative', display: 'inline-flex', borderRadius: '50%', height: '8px', width: '8px', background: '#22c55e' }}></span>
               </span>
               <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.9)', fontWeight: '600', letterSpacing: '0.5px' }}>Gelombang 1 Dibuka</span>
             </div>
           </div>
           <a href="https://pmb.umiba.ac.id/" target="_blank" rel="noreferrer" className="d-none-mobile" style={{ 
             background: '#ffffff', color: '#B91C1C', padding: '6px 16px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '800', marginLeft: '16px', transition: 'all 0.3s', textDecoration: 'none'
           }} onMouseOver={e=>e.currentTarget.style.transform='translateY(-2px)'} onMouseOut={e=>e.currentTarget.style.transform='translateY(0)'}>
             DAFTAR SEKARANG <i className="ph-bold ph-arrow-right" style={{ marginLeft: '4px' }}></i>
           </a>
        </div>

        {/* Kanan: Search & Sosmed */}
        <div className="top-banner-right d-none-mobile" style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
           <div className="search-bar" style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.15)', borderRadius: '20px', padding: '6px 16px', border: '1px solid rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)', width: '200px' }}>
             <i className="ph-bold ph-magnifying-glass" style={{ color: 'rgba(255,255,255,0.8)', marginRight: '8px' }}></i>
             <input type="text" placeholder="Cari informasi..." style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: '0.8rem', width: '100%', color: '#ffffff' }} />
           </div>
           <div style={{ width: '1px', height: '24px', background: 'rgba(255,255,255,0.3)' }}></div>
           <div className="socials" style={{ display: 'flex', gap: '16px', fontSize: '1.2rem' }}>
             <a href="#" style={{ color: 'rgba(255,255,255,0.8)', transition: 'all 0.3s' }} onMouseOver={e=>{e.currentTarget.style.color='#ffffff'; e.currentTarget.style.transform='translateY(-2px)'}} onMouseOut={e=>{e.currentTarget.style.color='rgba(255,255,255,0.8)'; e.currentTarget.style.transform='translateY(0)'}}><i className="ph-fill ph-youtube-logo"></i></a>
             <a href="#" style={{ color: 'rgba(255,255,255,0.8)', transition: 'all 0.3s' }} onMouseOver={e=>{e.currentTarget.style.color='#ffffff'; e.currentTarget.style.transform='translateY(-2px)'}} onMouseOut={e=>{e.currentTarget.style.color='rgba(255,255,255,0.8)'; e.currentTarget.style.transform='translateY(0)'}}><i className="ph-fill ph-instagram-logo"></i></a>
             <a href="#" style={{ color: 'rgba(255,255,255,0.8)', transition: 'all 0.3s' }} onMouseOver={e=>{e.currentTarget.style.color='#ffffff'; e.currentTarget.style.transform='translateY(-2px)'}} onMouseOut={e=>{e.currentTarget.style.color='rgba(255,255,255,0.8)'; e.currentTarget.style.transform='translateY(0)'}}><i className="ph-fill ph-linkedin-logo"></i></a>
           </div>
           <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '700', background: 'rgba(255,255,255,0.15)', padding: '6px 16px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.2)' }}>
             <i className="ph-fill ph-headset" style={{ fontSize: '1.2rem', color: '#ffffff' }}></i> <span style={{ fontSize: '0.9rem' }}>0811 870 114</span>
           </div>
        </div>
      </div>
      <header id="site-header" className={isScrolled || menuOpen ? 'scrolled' : 'top-transparent'}>
  <div className="glass">
    <a href="#" className="logo" aria-label="UMIBA Home">
      <img src="/erasebg-transformed.png" alt="Logo UMIBA" onerror="this.onerror=null;this.src='https://via.placeholder.com/40x40/B91C1C/fff?text=U'"/>
    </a>
    <ul className={menuOpen ? "nav-links active" : "nav-links"}>
      <li className="nav-item"><a href="/" className={`nav-link ${pathname === "/" ? "active" : ""}`}>{t("nav.home")}</a></li>
      <li className="nav-item">
        <a href="/profil" className={`nav-link ${pathname?.startsWith("/profil") ? "active" : ""}`} onClick={handleDropdownClick}>{t("nav.profil")} <span className="dropdown-icon">▼</span></a>
        <div className="mega-menu grid-2 align-center">
          <div>
            <h4 style={{ fontWeight: 'bold', fontSize: '0.8rem', color: 'var(--umiba-red)', marginBottom: '12px', textTransform: 'uppercase', borderBottom: '1px solid rgba(0,0,0,0.1)', paddingBottom: '8px' }}>{t("nav.identitas_kampus")}</h4>
            <a href="/profil#sejarah" className="dropdown-link" style={{ padding: '8px 12px', fontSize: '0.9rem' }}><i className="ph-bold ph-clock-counter-clockwise" style={{ marginRight: '8px' }}></i>{t("nav.sejarah")}</a>
            <a href="/profil#visi-misi" className="dropdown-link" style={{ padding: '8px 12px', fontSize: '0.9rem' }}><i className="ph-bold ph-target" style={{ marginRight: '8px' }}></i>{t("nav.visi_misi")}</a>
            <a href="/profil#tujuan" className="dropdown-link" style={{ padding: '8px 12px', fontSize: '0.9rem' }}><i className="ph-bold ph-flag-banner" style={{ marginRight: '8px' }}></i>{t("nav.tujuan")}</a>
          </div>
          <div style={{ background: 'var(--umiba-red-alpha)', padding: '16px', borderRadius: 'var(--radius-md)', marginTop: '-12px' }}>
            <h4 style={{ fontWeight: 'bold', fontSize: '0.8rem', color: 'var(--umiba-red)', marginBottom: '12px', textTransform: 'uppercase' }}>{t("nav.manajemen_fasilitas")}</h4>
            <a href="/profil#sasaran" className="dropdown-link" style={{ padding: '8px 12px', fontSize: '0.9rem' }}><i className="ph-bold ph-chart-line-up" style={{ marginRight: '8px' }}></i>{t("nav.strategi_pencapaian")}</a>
            <a href="/profil#struktur" className="dropdown-link" style={{ padding: '8px 12px', fontSize: '0.9rem' }}><i className="ph-bold ph-users-three" style={{ marginRight: '8px' }}></i>{t("nav.struktur_organisasi")}</a>
            <a href="/fasilitas" className="dropdown-link" style={{ padding: '8px 12px', fontSize: '0.9rem' }}><i className="ph-bold ph-buildings" style={{ marginRight: '8px' }}></i>{t("nav.fasilitas_kampus")}</a>
          </div>
        </div>
      </li>
      <li className="nav-item">
        <a href="/akademik" className={`nav-link ${pathname?.startsWith("/akademik") || pathname?.startsWith("/prodi-") ? "active" : ""}`} onClick={handleDropdownClick}>{t("nav.akademik")} <span className="dropdown-icon">▼</span></a>
        <div className="mega-menu grid-3 align-center">
          
          {/*  Column 1: Fakultas & Prodi  */}
          <div>
            <h4 style={{ fontWeight: 'bold', fontSize: '0.8rem', color: 'var(--umiba-red)', marginBottom: '12px', textTransform: 'uppercase', borderBottom: '1px solid rgba(0,0,0,0.1)', paddingBottom: '8px' }}>{t("nav.manajemen_bisnis")}</h4>
            <a href="/prodi-manajemen" className="dropdown-link" style={{ padding: '8px 12px', fontSize: '0.9rem' }}>{t("nav.s1_manajemen")}</a>
            <a href="/prodi-magister" className="dropdown-link" style={{ padding: '8px 12px', fontSize: '0.9rem' }}>{t("nav.s2_manajemen")}</a>
            
            <h4 style={{ fontWeight: 'bold', fontSize: '0.8rem', color: 'var(--umiba-red)', marginBottom: '12px', marginTop: '24px', textTransform: 'uppercase', borderBottom: '1px solid rgba(0,0,0,0.1)', paddingBottom: '8px' }}>{t("nav.ilmu_hukum")}</h4>
            <a href="/prodi-hukum" className="dropdown-link" style={{ padding: '8px 12px', fontSize: '0.9rem' }}>{t("nav.s1_hukum")}</a>
          </div>
          
          {/*  Column 2: Fakultas & Prodi  */}
          <div>
            <h4 style={{ fontWeight: 'bold', fontSize: '0.8rem', color: 'var(--umiba-red)', marginBottom: '12px', textTransform: 'uppercase', borderBottom: '1px solid rgba(0,0,0,0.1)', paddingBottom: '8px' }}>{t("nav.ti_aktuaria")}</h4>
            <a href="/prodi-komputer" className="dropdown-link" style={{ padding: '8px 12px', fontSize: '0.9rem' }}>{t("nav.s1_komputer")}</a>
            <a href="/prodi-sistem" className="dropdown-link" style={{ padding: '8px 12px', fontSize: '0.9rem' }}>{t("nav.s1_sistem")}</a>
            <a href="/prodi-aktuaria" className="dropdown-link" style={{ padding: '8px 12px', fontSize: '0.9rem' }}>{t("nav.s1_aktuaria")}</a>
          </div>
          
          {/*  Column 3: Akademik Umum  */}
          <div style={{ background: 'var(--umiba-red-alpha)', padding: '16px', borderRadius: 'var(--radius-md)' }}>
            <h4 style={{ fontWeight: 'bold', fontSize: '0.8rem', color: 'var(--umiba-red)', marginBottom: '12px', textTransform: 'uppercase' }}>{t("nav.layanan_akademik")}</h4>
            <a href="/kurikulum" className="dropdown-link" style={{ padding: '8px 12px', fontSize: '0.9rem' }}><i className="ph-bold ph-book-open" style={{ marginRight: '8px' }}></i>{t("nav.kurikulum")}</a>
            <a href="/kurikulum#kalender" className="dropdown-link" style={{ padding: '8px 12px', fontSize: '0.9rem' }}><i className="ph-bold ph-calendar" style={{ marginRight: '8px' }}></i>{t("nav.kalender_akademik")}</a>
            <a href="/kegiatan-dosen" className="dropdown-link" style={{ padding: '8px 12px', fontSize: '0.9rem' }}><i className="ph-bold ph-chalkboard-teacher" style={{ marginRight: '8px' }}></i>{t("nav.kegiatan_dosen")}</a>
            
            <h4 style={{ fontWeight: 'bold', fontSize: '0.8rem', color: 'var(--umiba-red)', marginBottom: '12px', marginTop: '24px', textTransform: 'uppercase' }}>{t("nav.kemahasiswaan")}</h4>
            <a href="/dokumen#mahasiswa" className="dropdown-link" style={{ padding: '8px 12px', fontSize: '0.9rem' }}><i className="ph-bold ph-users-three" style={{ marginRight: '8px' }}></i>{t("nav.bem_ormawa")}</a>
            <a href="/dokumen#mahasiswa" className="dropdown-link" style={{ padding: '8px 12px', fontSize: '0.9rem' }}><i className="ph-bold ph-file-pdf" style={{ marginRight: '8px' }}></i>{t("nav.unduh_pedoman")}</a>
          </div>
          
        </div>
      </li>
      <li className="nav-item"><a href="/lppm" className={`nav-link ${pathname?.startsWith("/lppm") ? "active" : ""}`}>{t("nav.lppm")}</a></li>
      <li className="nav-item"><a href="/mutu" className={`nav-link ${pathname?.startsWith("/mutu") ? "active" : ""}`}>{t("nav.mutu")}</a></li>
      <li className="nav-item">
        <a href="#" className="nav-link" onClick={handleDropdownClick}>{t("nav.portal")} <span className="dropdown-icon">▼</span></a>
        <div className="mega-menu grid-2 align-right">
          <div>
            <h4 style={{ fontWeight: 'bold', fontSize: '0.8rem', color: 'var(--umiba-red)', marginBottom: '12px', textTransform: 'uppercase', borderBottom: '1px solid rgba(0,0,0,0.1)', paddingBottom: '8px' }}>{t("nav.sistem_akademik")}</h4>
            <a href="https://umiba.siakadcloud.com/" target="_blank" className="dropdown-link" style={{ padding: '8px 12px', fontSize: '0.9rem' }}><i className="ph-bold ph-student" style={{ marginRight: '8px' }}></i>{t("nav.siakad_student")}</a>
            <a href="https://umiba.siakadcloud.com/" target="_blank" className="dropdown-link" style={{ padding: '8px 12px', fontSize: '0.9rem' }}><i className="ph-bold ph-chalkboard-teacher" style={{ marginRight: '8px' }}></i>{t("nav.siakad_dosen")}</a>
          </div>
          <div>
            <h4 style={{ fontWeight: 'bold', fontSize: '0.8rem', color: 'var(--umiba-red)', marginBottom: '12px', textTransform: 'uppercase', borderBottom: '1px solid rgba(0,0,0,0.1)', paddingBottom: '8px' }}>{t("nav.sumber_referensi")}</h4>
            <a href="http://127.0.0.1:8000/" target="_blank" className="dropdown-link" style={{ padding: '8px 12px', fontSize: '0.9rem' }}><i className="ph-bold ph-books" style={{ marginRight: '8px' }}></i>{t("nav.perpustakaan")}</a>
            <a href="https://ejurnal.umiba.ac.id/" target="_blank" className="dropdown-link" style={{ padding: '8px 12px', fontSize: '0.9rem' }}><i className="ph-bold ph-article" style={{ marginRight: '8px' }}></i>{t("nav.ejurnal")}</a>
          </div>
        </div>
      </li>
      <li className="nav-item">
        <a href="/informasi" className={`nav-link ${pathname?.startsWith("/informasi") || pathname?.startsWith("/berita") || pathname?.startsWith("/dokumen") ? "active" : ""}`} onClick={handleDropdownClick}>{t("nav.informasi")} <span className="dropdown-icon">▼</span></a>
        <div className="mega-menu grid-2 align-right">
          <div>
            <h4 style={{ fontWeight: 'bold', fontSize: '0.8rem', color: 'var(--umiba-red)', marginBottom: '12px', textTransform: 'uppercase', borderBottom: '1px solid rgba(0,0,0,0.1)', paddingBottom: '8px' }}>{t("nav.pendaftaran_biaya")}</h4>
            <a href="/informasi#biaya" className="dropdown-link" style={{ padding: '8px 12px', fontSize: '0.9rem' }}><i className="ph-bold ph-wallet" style={{ marginRight: '8px' }}></i>{t("nav.biaya_pendidikan")}</a>
            <a href="/dokumen" className="dropdown-link" style={{ padding: '8px 12px', fontSize: '0.9rem' }}><i className="ph-bold ph-file-pdf" style={{ marginRight: '8px' }}></i>{t("nav.dokumen_brosur")}</a>
          </div>
          <div>
            <h4 style={{ fontWeight: 'bold', fontSize: '0.8rem', color: 'var(--umiba-red)', marginBottom: '12px', textTransform: 'uppercase', borderBottom: '1px solid rgba(0,0,0,0.1)', paddingBottom: '8px' }}>{t("nav.update_kampus")}</h4>
            <a href="/berita" className="dropdown-link" style={{ padding: '8px 12px', fontSize: '0.9rem' }}><i className="ph-bold ph-newspaper" style={{ marginRight: '8px' }}></i>{t("nav.berita_terbaru")}</a>
            <a href="/informasi#infografis" className="dropdown-link" style={{ padding: '8px 12px', fontSize: '0.9rem' }}><i className="ph-bold ph-image" style={{ marginRight: '8px' }}></i>{t("nav.info_grafis")}</a>
          </div>
        </div>
      </li>
      {/*  MOBILE LANG SWITCH  */}
      <li className="nav-item d-block-mobile" style={{ display: 'none', paddingTop: '16px', marginTop: '16px', borderTop: '1px solid rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontWeight: '700', color: 'var(--color-text)', fontSize: '1.05rem' }}>{t("nav.bahasa")}</span>
          <div className="lang-switch">
            <a href="#" className={`lang-btn ${lang === 'id' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); changeLang('id'); }}>ID</a>
            <a href="#" className={`lang-btn ${lang === 'en' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); changeLang('en'); }}>EN</a>
          </div>
        </div>
      </li>
    </ul>
    <button className={`menu-toggle ${menuOpen ? 'active' : ''}`} aria-label="Toggle Menu" onClick={() => setMenuOpen(!menuOpen)}>
      <span></span>
      <span></span>
      <span></span>
    </button>
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <div className="lang-switch d-none-mobile">
        <a href="#" className={`lang-btn ${lang === 'id' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); changeLang('id'); }}>ID</a>
        <a href="#" className={`lang-btn ${lang === 'en' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); changeLang('en'); }}>EN</a>
      </div>
      <a href="https://pmb.umiba.ac.id/" target="_blank" className="btn btn-primary d-none-mobile">{t('nav.daftar_sekarang')}</a>
      <button className="theme-toggle" aria-label="Toggle Theme" onClick={toggleTheme}>
        <i className={`ph-bold ${theme === 'light' ? 'ph-moon' : 'ph-sun'}`}></i>
      </button>
    </div>
  </div>
</header>
    </>
  );
}
