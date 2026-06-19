export default function Header() {
  return (
    <>
      <header id="site-header">
  <div className="glass">
    <a href="#" className="logo" aria-label="UMIBA Home">
      <img src="/erasebg-transformed.png" alt="Logo UMIBA" onerror="this.onerror=null;this.src='https://via.placeholder.com/40x40/B91C1C/fff?text=U'"/>
    </a>
    <ul className="nav-links">
      <li className="nav-item"><a href="/" className="nav-link">HOME</a></li>
      <li className="nav-item">
        <a href="/profil" className="nav-link">PROFIL <span className="dropdown-icon">▼</span></a>
        <div className="mega-menu grid-2 align-center">
          <div>
            <h4 style={{ fontSize: '0.8rem', color: 'var(--umiba-red)', marginBottom: '12px', textTransform: 'uppercase', borderBottom: '1px solid rgba(0,0,0,0.1)', paddingBottom: '8px' }}>Identitas Kampus</h4>
            <a href="/profil#sejarah" className="dropdown-link" style={{ padding: '8px 12px', fontSize: '0.9rem' }}><i className="ph-bold ph-clock-counter-clockwise" style={{ marginRight: '8px' }}></i> Sejarah</a>
            <a href="/profil#visi-misi" className="dropdown-link" style={{ padding: '8px 12px', fontSize: '0.9rem' }}><i className="ph-bold ph-target" style={{ marginRight: '8px' }}></i> Visi dan Misi</a>
            <a href="/profil#tujuan" className="dropdown-link" style={{ padding: '8px 12px', fontSize: '0.9rem' }}><i className="ph-bold ph-flag-banner" style={{ marginRight: '8px' }}></i> Tujuan UMIBA</a>
          </div>
          <div style={{ background: 'rgba(185, 28, 28, 0.03)', padding: '16px', borderRadius: 'var(--radius-md)', marginTop: '-12px' }}>
            <h4 style={{ fontSize: '0.8rem', color: 'var(--umiba-red)', marginBottom: '12px', textTransform: 'uppercase' }}>Manajemen & Fasilitas</h4>
            <a href="/profil#sasaran" className="dropdown-link" style={{ padding: '8px 12px', fontSize: '0.9rem' }}><i className="ph-bold ph-chart-line-up" style={{ marginRight: '8px' }}></i> Strategi Pencapaian</a>
            <a href="/profil#struktur" className="dropdown-link" style={{ padding: '8px 12px', fontSize: '0.9rem' }}><i className="ph-bold ph-users-three" style={{ marginRight: '8px' }}></i> Struktur Organisasi</a>
            <a href="/fasilitas" className="dropdown-link" style={{ padding: '8px 12px', fontSize: '0.9rem' }}><i className="ph-bold ph-buildings" style={{ marginRight: '8px' }}></i> Fasilitas Kampus</a>
          </div>
        </div>
      </li>
      <li className="nav-item">
        <a href="/akademik" className="nav-link">AKADEMIK <span className="dropdown-icon">▼</span></a>
        <div className="mega-menu grid-3 align-center">
          
          {/*  Column 1: Fakultas & Prodi  */}
          <div>
            <h4 style={{ fontSize: '0.8rem', color: 'var(--umiba-red)', marginBottom: '12px', textTransform: 'uppercase', borderBottom: '1px solid rgba(0,0,0,0.1)', paddingBottom: '8px' }}>Manajemen &amp; Bisnis</h4>
            <a href="/prodi-manajemen" className="dropdown-link" style={{ padding: '8px 12px', fontSize: '0.9rem' }}>S1 Manajemen</a>
            <a href="/prodi-magister" className="dropdown-link" style={{ padding: '8px 12px', fontSize: '0.9rem' }}>S2 Magister Manajemen</a>
            
            <h4 style={{ fontSize: '0.8rem', color: 'var(--umiba-red)', marginBottom: '12px', marginTop: '24px', textTransform: 'uppercase', borderBottom: '1px solid rgba(0,0,0,0.1)', paddingBottom: '8px' }}>Ilmu Hukum</h4>
            <a href="/prodi-hukum" className="dropdown-link" style={{ padding: '8px 12px', fontSize: '0.9rem' }}>S1 Ilmu Hukum</a>
          </div>
          
          {/*  Column 2: Fakultas & Prodi  */}
          <div>
            <h4 style={{ fontSize: '0.8rem', color: 'var(--umiba-red)', marginBottom: '12px', textTransform: 'uppercase', borderBottom: '1px solid rgba(0,0,0,0.1)', paddingBottom: '8px' }}>TI &amp; Aktuaria</h4>
            <a href="/prodi-komputer" className="dropdown-link" style={{ padding: '8px 12px', fontSize: '0.9rem' }}>S1 Ilmu Komputer</a>
            <a href="/prodi-sistem" className="dropdown-link" style={{ padding: '8px 12px', fontSize: '0.9rem' }}>S1 Sistem &amp; Teknologi Informasi</a>
            <a href="/prodi-aktuaria" className="dropdown-link" style={{ padding: '8px 12px', fontSize: '0.9rem' }}>S1 Ilmu Aktuaria</a>
          </div>
          
          {/*  Column 3: Akademik Umum  */}
          <div style={{ background: 'rgba(185, 28, 28, 0.03)', padding: '16px', borderRadius: 'var(--radius-md)' }}>
            <h4 style={{ fontSize: '0.8rem', color: 'var(--umiba-red)', marginBottom: '12px', textTransform: 'uppercase' }}>Layanan Akademik</h4>
            <a href="/kurikulum" className="dropdown-link" style={{ padding: '8px 12px', fontSize: '0.9rem' }}><i className="ph-bold ph-book-open" style={{ marginRight: '8px' }}></i> Kurikulum</a>
            <a href="/kurikulum#kalender" className="dropdown-link" style={{ padding: '8px 12px', fontSize: '0.9rem' }}><i className="ph-bold ph-calendar" style={{ marginRight: '8px' }}></i> Kalender Akademik</a>
            <a href="/kegiatan-dosen" className="dropdown-link" style={{ padding: '8px 12px', fontSize: '0.9rem' }}><i className="ph-bold ph-chalkboard-teacher" style={{ marginRight: '8px' }}></i> Kegiatan Dosen</a>
            
            <h4 style={{ fontSize: '0.8rem', color: 'var(--umiba-red)', marginBottom: '12px', marginTop: '24px', textTransform: 'uppercase' }}>Kemahasiswaan</h4>
            <a href="/dokumen#mahasiswa" className="dropdown-link" style={{ padding: '8px 12px', fontSize: '0.9rem' }}><i className="ph-bold ph-users-three" style={{ marginRight: '8px' }}></i> BEM &amp; ORMAWA</a>
            <a href="/dokumen#mahasiswa" className="dropdown-link" style={{ padding: '8px 12px', fontSize: '0.9rem' }}><i className="ph-bold ph-file-pdf" style={{ marginRight: '8px' }}></i> Unduh Pedoman</a>
          </div>
          
        </div>
      </li>
      <li className="nav-item"><a href="/lppm" className="nav-link">LPPM</a></li>
      <li className="nav-item"><a href="/mutu" className="nav-link">MUTU</a></li>
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
        <a href="/informasi" className="nav-link">INFORMASI <span className="dropdown-icon">▼</span></a>
        <div className="mega-menu grid-2 align-right">
          <div>
            <h4 style={{ fontSize: '0.8rem', color: 'var(--umiba-red)', marginBottom: '12px', textTransform: 'uppercase', borderBottom: '1px solid rgba(0,0,0,0.1)', paddingBottom: '8px' }}>Pendaftaran & Biaya</h4>
            <a href="/informasi#biaya" className="dropdown-link" style={{ padding: '8px 12px', fontSize: '0.9rem' }}><i className="ph-bold ph-wallet" style={{ marginRight: '8px' }}></i> Biaya Pendidikan</a>
            <a href="/dokumen" className="dropdown-link" style={{ padding: '8px 12px', fontSize: '0.9rem' }}><i className="ph-bold ph-file-pdf" style={{ marginRight: '8px' }}></i> Dokumen & Brosur</a>
          </div>
          <div>
            <h4 style={{ fontSize: '0.8rem', color: 'var(--umiba-red)', marginBottom: '12px', textTransform: 'uppercase', borderBottom: '1px solid rgba(0,0,0,0.1)', paddingBottom: '8px' }}>Update Kampus</h4>
            <a href="/berita" className="dropdown-link" style={{ padding: '8px 12px', fontSize: '0.9rem' }}><i className="ph-bold ph-newspaper" style={{ marginRight: '8px' }}></i> Berita Terbaru</a>
            <a href="/informasi#infografis" className="dropdown-link" style={{ padding: '8px 12px', fontSize: '0.9rem' }}><i className="ph-bold ph-image" style={{ marginRight: '8px' }}></i> Info Grafis</a>
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
    </>
  );
}
