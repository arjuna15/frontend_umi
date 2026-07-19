'use client';
import { useLanguage } from '../context/Providers';

export default function Footer() {
  const { t, lang } = useLanguage();
  return (
    <>
      <footer className="travhub-footer">
        <div className="container" style={{ position: 'relative', paddingTop: '100px', paddingBottom: '60px' }}>
          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '40px', alignItems: 'start' }}>
            
            {/* Kolom 1: Identitas & Logo */}
            <div>
              <a href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '16px', marginBottom: '24px', textDecoration: 'none', position: 'relative' }}>
                {/* Logo Circle - inset neumorphic on dark */}
                <div style={{ position: 'relative', zIndex: '1' }}>
                  <div style={{
                    background: 'rgba(255,255,255,0.1)',
                    borderRadius: '50%',
                    padding: '8px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100px',
                    height: '100px',
                    boxShadow: 'inset 3px 3px 6px rgba(0,0,0,0.3), inset -3px -3px 6px rgba(255,255,255,0.08)'
                  }}>
                    <img src="/erasebg-transformed.png" alt="Logo UMIBA" style={{ width: '84px', height: '84px', objectFit: 'contain' }} />
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ color: 'white', fontSize: 'clamp(1.1rem, 2vw, 1.5rem)', fontWeight: '900', letterSpacing: '1px', lineHeight: '1.2', position: 'relative', zIndex: '1' }}>UNIVERSITAS</span>
                  <span style={{ color: 'white', fontSize: 'clamp(1.1rem, 2vw, 1.5rem)', fontWeight: '900', letterSpacing: '1px', lineHeight: '1.2', position: 'relative', zIndex: '1' }}>MITRA BANGSA</span>
                </div>
              </a>
              <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)', marginBottom: '32px', lineHeight: '1.8' }}>
                {lang === "en" ? "Universitas Mitra Bangsa creates superior generations ready to face global challenges and the digital work world through high quality education." : "Universitas Mitra Bangsa mencetak generasi unggul yang siap menghadapi tantangan global dan dunia kerja digital melalui pendidikan berkualitas."}
              </p>
            </div>
            
            {/* Kolom 2: Fakultas */}
            <div>
              <h4 style={{ color: 'white', fontSize: '1.1rem', marginBottom: '24px', fontWeight: '800' }}>{t("footer.fakultas")}</h4>
              <ul style={{ listStyle: 'none', padding: '0', margin: '0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <li><a href="/prodi-komputer" className="travhub-link"><span className="travhub-bullet"></span> {t("nav.s1_komputer")}</a></li>
                <li><a href="/prodi-sistem" className="travhub-link"><span className="travhub-bullet"></span> {t("nav.s1_sistem")}</a></li>
                <li><a href="/prodi-hukum" className="travhub-link"><span className="travhub-bullet"></span> {t("nav.s1_hukum")}</a></li>
                <li><a href="/prodi-manajemen" className="travhub-link"><span className="travhub-bullet"></span> {t("nav.s1_manajemen")}</a></li>
                <li><a href="/prodi-aktuaria" className="travhub-link"><span className="travhub-bullet"></span> {lang === "en" ? "B.S. Actuarial Science" : "(S1) Ilmu Aktuaria"}</a></li>
              </ul>
            </div>

            {/* Kolom 3: Layanan/Tautan Utama */}
            <div>
              <h4 style={{ color: 'white', fontSize: '1.1rem', marginBottom: '24px', fontWeight: '800' }}>{t("footer.tautan_utama")}</h4>
              <ul style={{ listStyle: 'none', padding: '0', margin: '0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <li><a href="/profil" className="travhub-link"><span className="travhub-bullet"></span> {t("footer.tentang_kampus")}</a></li>
                <li><a href="/berita" className="travhub-link"><span className="travhub-bullet"></span> {t("nav.berita_terbaru")}</a></li>
                <li><a href="/informasi" className="travhub-link"><span className="travhub-bullet"></span> {t("footer.penerimaan_mahasiswa")}</a></li>
                <li><a href="/akademik" className="travhub-link"><span className="travhub-bullet"></span> {lang === "en" ? "Academic Portal" : "Portal Akademik"}</a></li>
                <li><a href="#" className="travhub-link"><span className="travhub-bullet"></span> {t("footer.kontak_lokasi")}</a></li>
              </ul>
            </div>

            {/* Kolom 4: Newsletter / Berlangganan Info */}
            <div>
              <h4 style={{ color: 'white', fontSize: '1.1rem', marginBottom: '24px', fontWeight: '800' }}>{lang === "en" ? "Subscribe Info" : "Berlangganan Info"}</h4>
              
              {/* Newsletter - inset neumorphic on dark */}
              <div style={{ display: 'flex', background: 'rgba(255,255,255,0.08)', borderRadius: '16px', overflow: 'hidden', marginBottom: '24px', boxShadow: 'inset 2px 2px 5px rgba(0,0,0,0.3), inset -2px -2px 5px rgba(255,255,255,0.05)' }}>
                <input type="email" placeholder={lang === "en" ? "Enter Email Address" : "Masukkan Alamat Email"} style={{ flex: 1, background: 'transparent', border: 'none', padding: '14px 16px', color: 'white', fontSize: '0.9rem', outline: 'none' }} />
                <button aria-label="Subscribe" style={{ background: 'white', color: 'var(--umiba-red)', border: 'none', padding: '0 20px', cursor: 'pointer', fontWeight: 'bold', borderRadius: '0 16px 16px 0', transition: 'all 0.3s ease' }}><i className="ph-bold ph-paper-plane-right"></i></button>
              </div>

              {/* Stats - inset neumorphic on dark */}
              <div style={{ display: 'flex', gap: '16px', marginTop: '24px' }}>
                <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '16px', padding: '16px 20px', boxShadow: 'inset 2px 2px 5px rgba(0,0,0,0.3), inset -2px -2px 5px rgba(255,255,255,0.05)', flex: 1, textAlign: 'center' }}>
                  <div style={{ color: 'white', fontSize: '1.4rem', fontWeight: 800, marginBottom: '2px' }}>5000+</div>
                  <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem' }}>{lang === "en" ? "Active Students" : "Mahasiswa Aktif"}</div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '16px', padding: '16px 20px', boxShadow: 'inset 2px 2px 5px rgba(0,0,0,0.3), inset -2px -2px 5px rgba(255,255,255,0.05)', flex: 1, textAlign: 'center' }}>
                  <div style={{ color: 'white', fontSize: '1.3rem', fontWeight: 800, marginBottom: '2px' }}>BAIK SEKALI</div>
                  <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem' }}>{lang === "en" ? "Accreditation" : "Akreditasi Kampus"}</div>
                </div>
              </div>

              {/* Social Icons - inset neumorphic on dark */}
              <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <a href="#" className="travhub-social" aria-label="Facebook" style={{ background: 'rgba(255,255,255,0.08)', boxShadow: 'inset 2px 2px 4px rgba(0,0,0,0.3), inset -2px -2px 4px rgba(255,255,255,0.05)', width: '40px', height: '40px', borderRadius: '50%' }}><i className="ph-fill ph-facebook-logo"></i></a>
                <a href="#" className="travhub-social" aria-label="Twitter" style={{ background: 'rgba(255,255,255,0.08)', boxShadow: 'inset 2px 2px 4px rgba(0,0,0,0.3), inset -2px -2px 4px rgba(255,255,255,0.05)', width: '40px', height: '40px', borderRadius: '50%' }}><i className="ph-fill ph-twitter-logo"></i></a>
                <a href="#" className="travhub-social" aria-label="LinkedIn" style={{ background: 'rgba(255,255,255,0.08)', boxShadow: 'inset 2px 2px 4px rgba(0,0,0,0.3), inset -2px -2px 4px rgba(255,255,255,0.05)', width: '40px', height: '40px', borderRadius: '50%' }}><i className="ph-fill ph-linkedin-logo"></i></a>
                <a href="#" className="travhub-social" aria-label="Instagram" style={{ background: 'rgba(255,255,255,0.08)', boxShadow: 'inset 2px 2px 4px rgba(0,0,0,0.3), inset -2px -2px 4px rgba(255,255,255,0.05)', width: '40px', height: '40px', borderRadius: '50%' }}><i className="ph-fill ph-instagram-logo"></i></a>
              </div>
            </div>

          </div>
        </div>
        
        {/* Bottom Bar Copyright */}
        <div className="travhub-bottom-bar">
          <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              Copyright &copy; {new Date().getFullYear()} Universitas Mitra Bangsa
            </div>
            <div style={{ display: 'flex', gap: '24px' }}>
              <a href="#" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '0.9rem' }}>{t("footer.kebijakan_privasi")}</a>
              <a href="#" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '0.9rem' }}>{t("footer.syarat_ketentuan")}</a>
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
