'use client';
import { useTheme, useLanguage } from '../context/Providers';

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const { lang, changeLang, t } = useLanguage();

  return (
    <>
      <header id="site-header">
  <div className="glass">
    <a href="#" className="logo" aria-label="UMIBA Home">
      <img src="/erasebg-transformed.png" alt="Logo UMIBA" onerror="this.onerror=null;this.src='https://via.placeholder.com/40x40/B91C1C/fff?text=U'"/>
    </a>
    <ul className="nav-links">
      <li className="nav-item"><a href="/" className="nav-link">{t("nav.home")}</a></li>
      <li className="nav-item">
        <a href="/profil" className="nav-link">{t("nav.profil")} <span className="dropdown-icon">▼</span></a>
        <div className="mega-menu grid-2 align-center">
          <div>
            <h4 style={{ fontSize: '0.8rem', color: 'var(--umiba-red)', marginBottom: '12px', textTransform: 'uppercase', borderBottom: '1px solid rgba(0,0,0,0.1)', paddingBottom: '8px' }}>{t("nav.identitas_kampus")}</h4>
            <a href="/profil#sejarah" className="dropdown-link" style={{ padding: '8px 12px', fontSize: '0.9rem' }}><i className="ph-bold ph-clock-counter-clockwise" style={{ marginRight: '8px' }}></i>{t("nav.sejarah")}</a>
            <a href="/profil#visi-misi" className="dropdown-link" style={{ padding: '8px 12px', fontSize: '0.9rem' }}><i className="ph-bold ph-target" style={{ marginRight: '8px' }}></i>{t("nav.visi_misi")}</a>
            <a href="/profil#tujuan" className="dropdown-link" style={{ padding: '8px 12px', fontSize: '0.9rem' }}><i className="ph-bold ph-flag-banner" style={{ marginRight: '8px' }}></i>{t("nav.tujuan")}</a>
          </div>
          <div style={{ background: 'var(--umiba-red-alpha)', padding: '16px', borderRadius: 'var(--radius-md)', marginTop: '-12px' }}>
            <h4 style={{ fontSize: '0.8rem', color: 'var(--umiba-red)', marginBottom: '12px', textTransform: 'uppercase' }}>{t("nav.manajemen_fasilitas")}</h4>
            <a href="/profil#sasaran" className="dropdown-link" style={{ padding: '8px 12px', fontSize: '0.9rem' }}><i className="ph-bold ph-chart-line-up" style={{ marginRight: '8px' }}></i>{t("nav.strategi_pencapaian")}</a>
            <a href="/profil#struktur" className="dropdown-link" style={{ padding: '8px 12px', fontSize: '0.9rem' }}><i className="ph-bold ph-users-three" style={{ marginRight: '8px' }}></i>{t("nav.struktur_organisasi")}</a>
            <a href="/fasilitas" className="dropdown-link" style={{ padding: '8px 12px', fontSize: '0.9rem' }}><i className="ph-bold ph-buildings" style={{ marginRight: '8px' }}></i>{t("nav.fasilitas_kampus")}</a>
          </div>
        </div>
      </li>
      <li className="nav-item">
        <a href="/akademik" className="nav-link">{t("nav.akademik")} <span className="dropdown-icon">▼</span></a>
        <div className="mega-menu grid-3 align-center">
          
          {/*  Column 1: Fakultas & Prodi  */}
          <div>
            <h4 style={{ fontSize: '0.8rem', color: 'var(--umiba-red)', marginBottom: '12px', textTransform: 'uppercase', borderBottom: '1px solid rgba(0,0,0,0.1)', paddingBottom: '8px' }}>{t("nav.manajemen_bisnis")}</h4>
            <a href="/prodi-manajemen" className="dropdown-link" style={{ padding: '8px 12px', fontSize: '0.9rem' }}>{t("nav.s1_manajemen")}</a>
            <a href="/prodi-magister" className="dropdown-link" style={{ padding: '8px 12px', fontSize: '0.9rem' }}>{t("nav.s2_manajemen")}</a>
            
            <h4 style={{ fontSize: '0.8rem', color: 'var(--umiba-red)', marginBottom: '12px', marginTop: '24px', textTransform: 'uppercase', borderBottom: '1px solid rgba(0,0,0,0.1)', paddingBottom: '8px' }}>{t("nav.ilmu_hukum")}</h4>
            <a href="/prodi-hukum" className="dropdown-link" style={{ padding: '8px 12px', fontSize: '0.9rem' }}>{t("nav.s1_hukum")}</a>
          </div>
          
          {/*  Column 2: Fakultas & Prodi  */}
          <div>
            <h4 style={{ fontSize: '0.8rem', color: 'var(--umiba-red)', marginBottom: '12px', textTransform: 'uppercase', borderBottom: '1px solid rgba(0,0,0,0.1)', paddingBottom: '8px' }}>{t("nav.ti_aktuaria")}</h4>
            <a href="/prodi-komputer" className="dropdown-link" style={{ padding: '8px 12px', fontSize: '0.9rem' }}>{t("nav.s1_komputer")}</a>
            <a href="/prodi-sistem" className="dropdown-link" style={{ padding: '8px 12px', fontSize: '0.9rem' }}>{t("nav.s1_sistem")}</a>
            <a href="/prodi-aktuaria" className="dropdown-link" style={{ padding: '8px 12px', fontSize: '0.9rem' }}>{t("nav.s1_aktuaria")}</a>
          </div>
          
          {/*  Column 3: Akademik Umum  */}
          <div style={{ background: 'var(--umiba-red-alpha)', padding: '16px', borderRadius: 'var(--radius-md)' }}>
            <h4 style={{ fontSize: '0.8rem', color: 'var(--umiba-red)', marginBottom: '12px', textTransform: 'uppercase' }}>{t("nav.layanan_akademik")}</h4>
            <a href="/kurikulum" className="dropdown-link" style={{ padding: '8px 12px', fontSize: '0.9rem' }}><i className="ph-bold ph-book-open" style={{ marginRight: '8px' }}></i>{t("nav.kurikulum")}</a>
            <a href="/kurikulum#kalender" className="dropdown-link" style={{ padding: '8px 12px', fontSize: '0.9rem' }}><i className="ph-bold ph-calendar" style={{ marginRight: '8px' }}></i>{t("nav.kalender_akademik")}</a>
            <a href="/kegiatan-dosen" className="dropdown-link" style={{ padding: '8px 12px', fontSize: '0.9rem' }}><i className="ph-bold ph-chalkboard-teacher" style={{ marginRight: '8px' }}></i>{t("nav.kegiatan_dosen")}</a>
            
            <h4 style={{ fontSize: '0.8rem', color: 'var(--umiba-red)', marginBottom: '12px', marginTop: '24px', textTransform: 'uppercase' }}>{t("nav.kemahasiswaan")}</h4>
            <a href="/dokumen#mahasiswa" className="dropdown-link" style={{ padding: '8px 12px', fontSize: '0.9rem' }}><i className="ph-bold ph-users-three" style={{ marginRight: '8px' }}></i>{t("nav.bem_ormawa")}</a>
            <a href="/dokumen#mahasiswa" className="dropdown-link" style={{ padding: '8px 12px', fontSize: '0.9rem' }}><i className="ph-bold ph-file-pdf" style={{ marginRight: '8px' }}></i>{t("nav.unduh_pedoman")}</a>
          </div>
          
        </div>
      </li>
      <li className="nav-item"><a href="/lppm" className="nav-link">{t("nav.lppm")}</a></li>
      <li className="nav-item"><a href="/mutu" className="nav-link">{t("nav.mutu")}</a></li>
      <li className="nav-item">
        <a href="#" className="nav-link">{t("nav.portal")} <span className="dropdown-icon">▼</span></a>
        <div className="mega-menu grid-2 align-right">
          <div>
            <h4 style={{ fontSize: '0.8rem', color: 'var(--umiba-red)', marginBottom: '12px', textTransform: 'uppercase', borderBottom: '1px solid rgba(0,0,0,0.1)', paddingBottom: '8px' }}>{t("nav.sistem_akademik")}</h4>
            <a href="https://umiba.siakadcloud.com/" target="_blank" className="dropdown-link" style={{ padding: '8px 12px', fontSize: '0.9rem' }}><i className="ph-bold ph-student" style={{ marginRight: '8px' }}></i>{t("nav.siakad_student")}</a>
            <a href="https://umiba.siakadcloud.com/" target="_blank" className="dropdown-link" style={{ padding: '8px 12px', fontSize: '0.9rem' }}><i className="ph-bold ph-chalkboard-teacher" style={{ marginRight: '8px' }}></i>{t("nav.siakad_dosen")}</a>
          </div>
          <div>
            <h4 style={{ fontSize: '0.8rem', color: 'var(--umiba-red)', marginBottom: '12px', textTransform: 'uppercase', borderBottom: '1px solid rgba(0,0,0,0.1)', paddingBottom: '8px' }}>{t("nav.sumber_referensi")}</h4>
            <a href="http://127.0.0.1:8000/" target="_blank" className="dropdown-link" style={{ padding: '8px 12px', fontSize: '0.9rem' }}><i className="ph-bold ph-books" style={{ marginRight: '8px' }}></i>{t("nav.perpustakaan")}</a>
            <a href="https://ejurnal.umiba.ac.id/" target="_blank" className="dropdown-link" style={{ padding: '8px 12px', fontSize: '0.9rem' }}><i className="ph-bold ph-article" style={{ marginRight: '8px' }}></i>{t("nav.ejurnal")}</a>
          </div>
        </div>
      </li>
      <li className="nav-item">
        <a href="/informasi" className="nav-link">{t("nav.informasi")} <span className="dropdown-icon">▼</span></a>
        <div className="mega-menu grid-2 align-right">
          <div>
            <h4 style={{ fontSize: '0.8rem', color: 'var(--umiba-red)', marginBottom: '12px', textTransform: 'uppercase', borderBottom: '1px solid rgba(0,0,0,0.1)', paddingBottom: '8px' }}>{t("nav.pendaftaran_biaya")}</h4>
            <a href="/informasi#biaya" className="dropdown-link" style={{ padding: '8px 12px', fontSize: '0.9rem' }}><i className="ph-bold ph-wallet" style={{ marginRight: '8px' }}></i>{t("nav.biaya_pendidikan")}</a>
            <a href="/dokumen" className="dropdown-link" style={{ padding: '8px 12px', fontSize: '0.9rem' }}><i className="ph-bold ph-file-pdf" style={{ marginRight: '8px' }}></i>{t("nav.dokumen_brosur")}</a>
          </div>
          <div>
            <h4 style={{ fontSize: '0.8rem', color: 'var(--umiba-red)', marginBottom: '12px', textTransform: 'uppercase', borderBottom: '1px solid rgba(0,0,0,0.1)', paddingBottom: '8px' }}>{t("nav.update_kampus")}</h4>
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
    <button className="menu-toggle" aria-label="Toggle Menu">
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
