'use client';
import { useTheme, useLanguage } from '../context/Providers';
import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

const mockSearchData = [
  { title: "Berita & Pengumuman", url: "/berita", type: "Halaman" },
  { title: "Profil Kampus", url: "/profil", type: "Halaman" },
  { title: "Pendaftaran Mahasiswa Baru (PMB)", url: "https://pmb.umiba.ac.id/", type: "Link Luar" },
  { title: "Program Studi Magister Manajemen", url: "/prodi-magister", type: "S2" },
  { title: "Program Studi Manajemen", url: "/prodi-manajemen", type: "S1" },
  { title: "Program Studi Hukum", url: "/prodi-hukum", type: "S1" },
  { title: "Program Studi Sistem Informasi", url: "/prodi-sistem", type: "S1" },
  { title: "Program Studi Ilmu Komputer", url: "/prodi-komputer", type: "S1" },
  { title: "Fasilitas Kampus", url: "/fasilitas", type: "Halaman" },
  { title: "Informasi Beasiswa KIP-K", url: "/informasi", type: "Halaman" },
];

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const { lang, changeLang, t } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [bannerHeight, setBannerHeight] = useState(48); // default approx
  const pathname = usePathname();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const filteredResults = mockSearchData.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const handleScroll = () => {
      // Threshold 20px so it immediately reacts
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    const updateBannerHeight = () => {
      const banner = document.querySelector('.top-banner');
      if (banner) setBannerHeight(banner.offsetHeight);
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', updateBannerHeight);
    
    handleScroll();
    updateBannerHeight();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', updateBannerHeight);
    };
  }, []);

  const handleDropdownClick = (e) => {
    if (window.innerWidth <= 992) {
      e.preventDefault();
      const parent = e.currentTarget.parentElement;
      parent.classList.toggle('open');
    }
  };

  return (
    <div style={{ width: '100%' }}>
      <div className="top-banner" style={{
        background: '#B91C1C', 
        color: '#ffffff', 
        padding: '10px 4vw', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        position: 'relative',
        width: '100%',
        zIndex: searchQuery.trim() !== '' ? 100005 : 999,
        fontFamily: 'var(--font-primary)',
        borderBottom: '1px solid rgba(255,255,255,0.1)'
      }}>
        {/* Kiri: Info PMB */}
        <div className="top-banner-left" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
           <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.15)', padding: '6px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.2)', flexShrink: 0 }}>
             <i className="ph-fill ph-megaphone" style={{ fontSize: '1.2rem', color: '#ffffff' }}></i>
           </div>
           <div className="pmb-text-container" style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, overflow: 'hidden' }}>
             <span className="pmb-title" style={{ fontSize: 'clamp(0.75rem, 2.5vw, 0.9rem)', fontWeight: '800', letterSpacing: '0.5px', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
               <span className="d-none-mobile">PENDAFTARAN MAHASISWA BARU </span>
               <span className="d-none-desktop">PMB </span>
               2026/2027
             </span>
             <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
               <span style={{ display: 'inline-flex', position: 'relative', width: '6px', height: '6px', flexShrink: 0 }}>
                 <span style={{ position: 'absolute', display: 'inline-flex', height: '100%', width: '100%', borderRadius: '50%', background: '#4ade80', opacity: '0.7', animation: 'ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite' }}></span>
                 <span style={{ position: 'relative', display: 'inline-flex', borderRadius: '50%', height: '6px', width: '6px', background: '#22c55e' }}></span>
               </span>
               <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.9)', fontWeight: '600', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>Gelombang 1 Dibuka</span>
             </div>
           </div>
           <a href="https://pmb.umiba.ac.id/" target="_blank" rel="noreferrer" className="btn-daftar-top" style={{ 
             background: '#ffffff', color: '#B91C1C', padding: '6px 16px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '800', marginLeft: 'auto', transition: 'all 0.3s', textDecoration: 'none', whiteSpace: 'nowrap', flexShrink: 0
           }} onMouseOver={e=>e.currentTarget.style.transform='translateY(-2px)'} onMouseOut={e=>e.currentTarget.style.transform='translateY(0)'}>
             <span className="d-none-mobile">DAFTAR SEKARANG</span>
             <span className="d-none-desktop">DAFTAR</span>
             <i className="ph-bold ph-arrow-right" style={{ marginLeft: '4px' }}></i>
           </a>
        </div>

        {/* Kanan: Search & Sosmed */}
        <div className="top-banner-right" style={{ display: 'flex', alignItems: 'center', gap: '24px', flexShrink: 0 }}>
           <div className="search-bar" style={{ position: 'relative', display: 'flex', alignItems: 'center', width: '100%', zIndex: 99999 }}>
             <form onSubmit={(e) => { e.preventDefault(); if (searchQuery.trim() && filteredResults.length > 0) router.push(filteredResults[0].url); }} style={{ display: 'flex', width: '100%', alignItems: 'center', padding: '6px 16px', background: 'rgba(255,255,255,0.15)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)' }}>
               <i className="ph-bold ph-magnifying-glass" style={{ color: 'rgba(255,255,255,0.8)', marginRight: '8px' }}></i>
               <input type="text" placeholder="Cari..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: '0.8rem', width: '100%', color: '#ffffff' }} />
               {searchQuery && (
                 <i className="ph-bold ph-x" onClick={() => setSearchQuery('')} style={{ color: 'rgba(255,255,255,0.8)', cursor: 'pointer', marginLeft: '8px', fontSize: '0.8rem' }}></i>
               )}
             </form>
             {searchQuery.trim() !== '' && (
               <div style={{ position: 'absolute', top: '40px', left: 0, width: '280px', maxWidth: 'calc(100vw - 32px)', background: '#ffffff', borderRadius: '12px', padding: '8px', boxShadow: '0 10px 25px rgba(0,0,0,0.3)', zIndex: 99999, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                 {filteredResults.length > 0 ? (
                   <>
                     {filteredResults.slice(0, 2).map((item, idx) => (
                       <a key={idx} href={item.url} onClick={() => setSearchQuery('')} style={{ padding: '8px 12px', borderRadius: '8px', color: '#1f2937', textDecoration: 'none', display: 'flex', flexDirection: 'column', transition: 'background 0.2s' }} onMouseOver={e=>e.currentTarget.style.background='rgba(0,0,0,0.05)'} onMouseOut={e=>e.currentTarget.style.background='transparent'}>
                         <span style={{ fontSize: '0.85rem', fontWeight: '700' }}>{item.title}</span>
                         <span style={{ fontSize: '0.7rem', color: '#B91C1C', fontWeight: '600' }}>{item.type}</span>
                       </a>
                     ))}
                     {filteredResults.length > 2 && (
                       <a href={`/berita?q=${encodeURIComponent(searchQuery)}`} onClick={() => setSearchQuery('')} style={{ padding: '8px', textAlign: 'center', fontSize: '0.75rem', color: '#B91C1C', fontWeight: '700', textDecoration: 'none', borderTop: '1px solid #e5e7eb', marginTop: '4px' }} onMouseOver={e=>e.currentTarget.style.textDecoration='underline'} onMouseOut={e=>e.currentTarget.style.textDecoration='none'}>
                         Lihat {filteredResults.length - 2} hasil lainnya...
                       </a>
                     )}
                   </>
                 ) : (
                   <div style={{ padding: '24px 16px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                     <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(185,28,28,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#B91C1C', marginBottom: '4px' }}>
                       <i className="ph-fill ph-magnifying-glass-minus" style={{ fontSize: '1.5rem' }}></i>
                     </div>
                     <span style={{ color: '#1f2937', fontSize: '0.9rem', fontWeight: '700' }}>
                       Duh, nggak ketemu nih!
                     </span>
                     <span style={{ color: '#6b7280', fontSize: '0.75rem', lineHeight: '1.4' }}>
                       Pencarian untuk <strong>&quot;{searchQuery}&quot;</strong> tidak ada hasilnya. Coba cek ejaan atau gunakan kata kunci lain.
                     </span>
                   </div>
                 )}
               </div>
             )}
           </div>
           <div className="top-divider" style={{ width: '1px', height: '24px', background: 'rgba(255,255,255,0.3)' }}></div>
           
           <div className="top-banner-phone" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '700', background: 'rgba(255,255,255,0.15)', padding: '4px 10px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.2)', flexShrink: 0 }}>
             <i className="ph-fill ph-headset" style={{ fontSize: '1.2rem', color: '#ffffff' }}></i> 
             <span style={{ fontSize: '0.85rem', whiteSpace: 'nowrap' }}>0811 870 114</span>
           </div>

           <div className="socials" style={{ display: 'flex', gap: '16px', fontSize: '1.2rem' }}>
             <a href="#" style={{ color: 'rgba(255,255,255,0.8)', transition: 'all 0.3s' }} onMouseOver={e=>{e.currentTarget.style.color='#ffffff'; e.currentTarget.style.transform='translateY(-2px)'}} onMouseOut={e=>{e.currentTarget.style.color='rgba(255,255,255,0.8)'; e.currentTarget.style.transform='translateY(0)'}}><i className="ph-fill ph-youtube-logo"></i></a>
             <a href="#" style={{ color: 'rgba(255,255,255,0.8)', transition: 'all 0.3s' }} onMouseOver={e=>{e.currentTarget.style.color='#ffffff'; e.currentTarget.style.transform='translateY(-2px)'}} onMouseOut={e=>{e.currentTarget.style.color='rgba(255,255,255,0.8)'; e.currentTarget.style.transform='translateY(0)'}}><i className="ph-fill ph-instagram-logo"></i></a>
             <a href="#" style={{ color: 'rgba(255,255,255,0.8)', transition: 'all 0.3s' }} onMouseOver={e=>{e.currentTarget.style.color='#ffffff'; e.currentTarget.style.transform='translateY(-2px)'}} onMouseOut={e=>{e.currentTarget.style.color='rgba(255,255,255,0.8)'; e.currentTarget.style.transform='translateY(0)'}}><i className="ph-fill ph-linkedin-logo"></i></a>
           </div>
        </div>
      </div>
      <header 
        id="site-header" 
        className={isScrolled || menuOpen ? 'scrolled' : 'top-transparent'}
        style={{ top: (isScrolled || menuOpen) ? undefined : `${bannerHeight}px`, zIndex: 100002 }}
      >
  <div className="glass">
    <a href="#" className="logo" aria-label="UMIBA Home">
      <img src="/erasebg-transformed.png" alt="Logo UMIBA" onError={(e)=>{e.target.onerror=null;e.target.src='https://via.placeholder.com/40x40/B91C1C/fff?text=U'}}/>
    </a>
    <ul className={menuOpen ? "nav-links active" : "nav-links"}>
      <li className="nav-item"><a href="/" className={`nav-link ${pathname === "/" ? "active" : ""}`}>{t("nav.home")}</a></li>
      <li className="nav-item">
        <a href="/profil" className={`nav-link ${pathname?.startsWith("/profil") ? "active" : ""}`} onClick={handleDropdownClick}>{t("nav.profil")} <i className="ph-bold ph-caret-down dropdown-icon"></i></a>
        <div className="mega-menu profile-mega grid-3 align-center" style={{ gap: '32px' }}>
          {/* Rector Featured Card */}
          <div style={{
            background: 'linear-gradient(to bottom right, rgba(185, 28, 28, 0.02), rgba(185, 28, 28, 0.08))',
            borderRadius: 'var(--radius-lg)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            minHeight: '280px',
            padding: '24px',
            border: '1px solid rgba(185, 28, 28, 0.1)',
            marginTop: '-8px',
            marginBottom: '-8px'
          }}>
            <img src="https://umiba.ac.id/wp-content/uploads/2026/05/rektor-UMIBA-2026.jpeg" alt="Rektor UMIBA" style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', marginBottom: '16px', border: '3px solid white', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }} />
            <h4 style={{ margin: '0 0 4px 0', fontSize: '1rem', fontWeight: '800', color: 'var(--umiba-red)', whiteSpace: 'normal', wordWrap: 'break-word' }}>Sri Wahyuningsih, SE., MM</h4>
            <p style={{ margin: '0 0 16px 0', fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: '500', whiteSpace: 'normal', wordWrap: 'break-word' }}>Rektor Universitas Mitra Bangsa</p>
            <a href="/profil#sambutan" style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'var(--umiba-red)',
              color: 'white',
              padding: '8px 20px',
              borderRadius: '30px',
              fontSize: '0.8rem',
              fontWeight: '700',
              textDecoration: 'none',
              boxShadow: '0 4px 10px rgba(185, 28, 28, 0.25)',
              transition: 'all 0.2s ease'
            }} onMouseOver={e=>e.currentTarget.style.transform='scale(1.05)'} onMouseOut={e=>e.currentTarget.style.transform='scale(1)'}>
              Sambutan <i className="ph-bold ph-caret-right"></i>
            </a>
          </div>

          <div style={{ padding: '8px 0' }}>
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
        <a href="/akademik" className={`nav-link ${pathname?.startsWith("/akademik") || pathname?.startsWith("/prodi-") ? "active" : ""}`} onClick={handleDropdownClick}>{t("nav.akademik")} <i className="ph-bold ph-caret-down dropdown-icon"></i></a>
        <div className="mega-menu grid-3 full-width align-center">
          
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
        <a href="#" className="nav-link" onClick={handleDropdownClick}>{t("nav.portal")} <i className="ph-bold ph-caret-down dropdown-icon"></i></a>
        <div className="mega-menu portal-mega grid-3 align-right" style={{ gap: '24px' }}>
          {/* UMIBA Featured Column */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '16px', background: 'var(--umiba-red-alpha)', borderRadius: 'var(--radius-md)' }}>
            <img src="/erasebg-transformed.png" alt="UMIBA Logo" style={{ width: '90px', marginBottom: '16px', filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))' }} onError={(e)=>{e.target.src='https://via.placeholder.com/90x90/B91C1C/fff?text=U'}}/>
            <h4 style={{ color: 'var(--umiba-red)', fontSize: '0.9rem', fontWeight: 'bold', margin: '0', textAlign: 'center', textTransform: 'uppercase' }}>Portal Sivitas<br/>Akademika</h4>
          </div>
          <div>
            <h4 style={{ fontWeight: 'bold', fontSize: '0.8rem', color: 'var(--umiba-red)', marginBottom: '12px', textTransform: 'uppercase', borderBottom: '1px solid rgba(0,0,0,0.1)', paddingBottom: '8px' }}>{t("nav.sistem_akademik")}</h4>
            <a href="/siakad/login" className="dropdown-link" style={{ padding: '8px 12px', fontSize: '0.9rem' }}><i className="ph-bold ph-student" style={{ marginRight: '8px' }}></i>{t("nav.siakad_student")}</a>
            <a href="/siakad/login" className="dropdown-link" style={{ padding: '8px 12px', fontSize: '0.9rem' }}><i className="ph-bold ph-chalkboard-teacher" style={{ marginRight: '8px' }}></i>{t("nav.siakad_dosen")}</a>
          </div>
          <div>
            <h4 style={{ fontWeight: 'bold', fontSize: '0.8rem', color: 'var(--umiba-red)', marginBottom: '12px', textTransform: 'uppercase', borderBottom: '1px solid rgba(0,0,0,0.1)', paddingBottom: '8px' }}>{t("nav.sumber_referensi")}</h4>
            <a href="http://127.0.0.1:8000/" target="_blank" className="dropdown-link" style={{ padding: '8px 12px', fontSize: '0.9rem' }}><i className="ph-bold ph-books" style={{ marginRight: '8px' }}></i>{t("nav.perpustakaan")}</a>
            <a href="https://ejurnal.umiba.ac.id/" target="_blank" className="dropdown-link" style={{ padding: '8px 12px', fontSize: '0.9rem' }}><i className="ph-bold ph-article" style={{ marginRight: '8px' }}></i>{t("nav.ejurnal")}</a>
          </div>
        </div>
      </li>
      <li className="nav-item">
        <a href="/informasi" className={`nav-link ${pathname?.startsWith("/informasi") || pathname?.startsWith("/berita") || pathname?.startsWith("/dokumen") ? "active" : ""}`} onClick={handleDropdownClick}>{t("nav.informasi")} <i className="ph-bold ph-caret-down dropdown-icon"></i></a>
        <div className="mega-menu info-mega grid-3 align-right" style={{ gap: '24px' }}>
          {/* UMIBA Featured Column */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '16px', background: 'var(--umiba-red-alpha)', borderRadius: 'var(--radius-md)' }}>
            <img src="/erasebg-transformed.png" alt="UMIBA Logo" style={{ width: '90px', marginBottom: '16px', filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))' }} onError={(e)=>{e.target.src='https://via.placeholder.com/90x90/B91C1C/fff?text=U'}}/>
            <h4 style={{ color: 'var(--umiba-red)', fontSize: '0.9rem', fontWeight: 'bold', margin: '0', textAlign: 'center', textTransform: 'uppercase' }}>Pusat Informasi<br/>& Layanan</h4>
          </div>
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
    </div>
  );
}
