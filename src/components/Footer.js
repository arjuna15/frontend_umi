'use client';
import { useLanguage } from '../context/Providers';

export default function Footer() {
  const { t, lang } = useLanguage();
  return (
    <>
      <footer className="premium-footer" style={{ color: 'white', padding: '100px 0 40px', position: 'relative', overflow: 'hidden', marginTop: 'var(--space-8)' }}>
  
  <div className="container" style={{ position: 'relative', zIndex: '1' }}>
    <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '40px', alignItems: 'start' }}>
      
      {/* Kolom 1: Logo & Identitas */}
      <div>
        <a href="/" style={{ display: 'inline-block', marginBottom: '24px' }}>
          {/* Logo tanpa background putih bulat, biarkan nyatu dengan background gelap */}
          <img src="/erasebg-transformed.png" alt="Logo UMIBA" style={{ width: '130px', height: '130px', objectFit: 'contain', filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.5))' }} />
        </a>
        <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.6)', marginBottom: '32px', lineHeight: '1.7', fontWeight: '300' }}>
          Universitas Mitra Bangsa mencetak generasi unggul yang siap menghadapi tantangan global dan dunia kerja digital melalui pendidikan berkualitas tinggi berstandar internasional.
        </p>
        <div style={{ display: 'flex', gap: '16px' }}>
          <a href="#" className="footer-link-modern" style={{ padding: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%', width: '40px', height: '40px', justifyContent: 'center' }} aria-label="Instagram"><i className="ph-fill ph-instagram-logo" style={{ color: 'white' }}></i></a>
          <a href="#" className="footer-link-modern" style={{ padding: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%', width: '40px', height: '40px', justifyContent: 'center' }} aria-label="YouTube"><i className="ph-fill ph-youtube-logo" style={{ color: 'white' }}></i></a>
          <a href="#" className="footer-link-modern" style={{ padding: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%', width: '40px', height: '40px', justifyContent: 'center' }} aria-label="Facebook"><i className="ph-fill ph-facebook-logo" style={{ color: 'white' }}></i></a>
        </div>
      </div>
      
      {/* Kolom 2: Fakultas & Prodi */}
      <div>
        <h4 style={{ color: '#ffffff', fontSize: '1.2rem', marginBottom: '24px', fontWeight: '700', letterSpacing: '1px' }}>{t("footer.fakultas")}</h4>
        <ul style={{ listStyle: 'none', padding: '0', margin: '0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <li><a href="/prodi-komputer" className="footer-link-modern"><i className="ph-bold ph-caret-right"></i> {t("nav.s1_komputer")}</a></li>
          <li><a href="/prodi-sistem" className="footer-link-modern"><i className="ph-bold ph-caret-right"></i> {t("nav.s1_sistem")}</a></li>
          <li><a href="/prodi-hukum" className="footer-link-modern"><i className="ph-bold ph-caret-right"></i> {t("nav.s1_hukum")}</a></li>
          <li><a href="/prodi-manajemen" className="footer-link-modern"><i className="ph-bold ph-caret-right"></i> {t("nav.s1_manajemen")}</a></li>
          <li><a href="/prodi-aktuaria" className="footer-link-modern"><i className="ph-bold ph-caret-right"></i> {lang === "en" ? "B.S. Actuarial Science" : "(S1) Ilmu Aktuaria"}</a></li>
          <li><a href="/prodi-magister" className="footer-link-modern"><i className="ph-bold ph-caret-right"></i> {lang === "en" ? "Master of Management" : "(S2) Magister Manajemen"}</a></li>
        </ul>
      </div>

      {/* Kolom 3: Tautan Penting */}
      <div>
        <h4 style={{ color: '#ffffff', fontSize: '1.2rem', marginBottom: '24px', fontWeight: '700', letterSpacing: '1px' }}>{t("footer.tautan_utama")}</h4>
        <ul style={{ listStyle: 'none', padding: '0', margin: '0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <li><a href="/profil" className="footer-link-modern"><i className="ph-bold ph-caret-right"></i> {t("footer.tentang_kampus")}</a></li>
          <li><a href="/akademik" className="footer-link-modern"><i className="ph-bold ph-caret-right"></i> {lang === "en" ? "Academic Portal" : "Portal Akademik"}</a></li>
          <li><a href="/berita" className="footer-link-modern"><i className="ph-bold ph-caret-right"></i> {t("nav.berita_terbaru")}</a></li>
          <li><a href="/informasi" className="footer-link-modern"><i className="ph-bold ph-caret-right"></i> {t("footer.penerimaan_mahasiswa")}</a></li>
          <li><a href="#" className="footer-link-modern"><i className="ph-bold ph-caret-right"></i> {t("footer.kontak_lokasi")}</a></li>
        </ul>
      </div>

      {/* Kolom 4: Glassmorphism CTA Box */}
      <div>
        <div className="footer-glass-box">
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'linear-gradient(135deg, #ef4444, #b91c1c)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', boxShadow: '0 8px 16px rgba(185,28,28,0.3)' }}>
             <i className="ph-bold ph-graduation-cap" style={{ fontSize: '1.5rem', color: 'white' }}></i>
          </div>
          <h4 style={{ color: 'white', fontSize: '1.3rem', fontWeight: '800', marginBottom: '12px', lineHeight: '1.3' }}>
            {lang === "en" ? "Ready to shape your future?" : "Siap meraih masa depanmu?"}
          </h4>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', marginBottom: '24px', lineHeight: '1.6' }}>
            {lang === "en" ? "Registration for the 2026/2027 academic year is now open." : "Pendaftaran mahasiswa baru Tahun Akademik 2026/2027 telah dibuka."}
          </p>
          <a href="https://pmb.umiba.ac.id" target="_blank" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%', padding: '14px', background: 'white', color: '#b91c1c', borderRadius: '8px', fontWeight: '800', textDecoration: 'none', transition: 'all 0.3s ease' }} onMouseOver={(e)=>{e.currentTarget.style.background='#f8f8f8'; e.currentTarget.style.transform='translateY(-2px)'}} onMouseOut={(e)=>{e.currentTarget.style.background='white'; e.currentTarget.style.transform='translateY(0)'}}>
            {t("nav.daftar_sekarang")} <i className="ph-bold ph-arrow-right"></i>
          </a>
        </div>
      </div>

    </div>
    
    {/* Footer Bottom */}
    <div className="footer-bottom-divider" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
      <p style={{ margin: '0', color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>
        &copy; {new Date().getFullYear()} Universitas Mitra Bangsa. {lang === "en" ? "All Rights Reserved." : "Hak Cipta Dilindungi."}
      </p>
      <div style={{ display: 'flex', gap: '24px' }}>
        <a href="#" className="footer-link-modern" style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}>{t("footer.kebijakan_privasi")}</a>
        <a href="#" className="footer-link-modern" style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}>{t("footer.syarat_ketentuan")}</a>
      </div>
    </div>
  </div>
</footer>

{/* Floating WhatsApp Button */}
<a href="https://wa.me/62811870114" className="wa-float" target="_blank" aria-label="WhatsApp Kami">
  <div className="wa-badge">
    {t("footer.tanya_umiba")}
    <span><i className="ph-fill ph-circle"></i> {t("footer.terhubung_sekarang")}</span>
  </div>
  <div className="wa-btn">
    <i className="ph-fill ph-whatsapp-logo"></i>
    <div className="wa-online-dot"></div>
  </div>
</a>
    </>
  );
}
