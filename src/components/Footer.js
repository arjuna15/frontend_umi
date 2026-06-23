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
                {/* Connecting Flare / Drip Shape (With Grid Pattern) */}
                <svg style={{ position: 'absolute', top: '-100px', left: '50px', transform: 'translateX(-50%)', width: '200px', height: '150px', zIndex: '0', pointerEvents: 'none', color: 'var(--color-text)' }} viewBox="0 0 200 150" preserveAspectRatio="none">
                  <defs>
                    <pattern id="dripGrid" width="30" height="30" patternUnits="userSpaceOnUse" patternTransform="translate(15, 0)">
                      <rect width="30" height="30" fill="var(--color-bg)" />
                      <path d="M 30 0 L 0 0 0 30" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.05" />
                    </pattern>
                  </defs>
                  <path d="M0,0 L200,0 C100,0 110,80 150,150 L50,150 C90,80 100,0 0,0 Z" fill="url(#dripGrid)" />
                </svg>
                {/* Logo Circle */}
                <div style={{ position: 'relative', filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.2))', zIndex: '1' }}>
                  <div className="droplet-bg" style={{
                    borderRadius: '50%',
                    padding: '8px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100px',
                    height: '100px'
                  }}>
                    <img src="/erasebg-transformed.png" alt="Logo UMIBA" style={{ width: '84px', height: '84px', objectFit: 'contain' }} />
                  </div>
                </div>
                <span style={{ color: 'white', fontSize: '1.8rem', fontWeight: '800', letterSpacing: '1px', position: 'relative', zIndex: '1' }}>UMIBA</span>
              </a>
              <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)', marginBottom: '32px', lineHeight: '1.8' }}>
                {lang === "en" ? "Universitas Mitra Bangsa creates superior generations ready to face global challenges and the digital work world through high quality education." : "Universitas Mitra Bangsa mencetak generasi unggul yang siap menghadapi tantangan global dan dunia kerja digital melalui pendidikan berkualitas."}
              </p>
            </div>
            
            {/* Kolom 2: Fakultas */}
            <div>
              <h4 style={{ color: 'white', fontSize: '1.1rem', marginBottom: '24px', fontWeight: '700' }}>{t("footer.fakultas")}</h4>
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
              <h4 style={{ color: 'white', fontSize: '1.1rem', marginBottom: '24px', fontWeight: '700' }}>{t("footer.tautan_utama")}</h4>
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
              <h4 style={{ color: 'white', fontSize: '1.1rem', marginBottom: '24px', fontWeight: '700' }}>{lang === "en" ? "Subscribe Info" : "Berlangganan Info"}</h4>
              
              <div className="travhub-newsletter-wrap">
                <input type="email" placeholder={lang === "en" ? "Enter Email Address" : "Masukkan Alamat Email"} />
                <button aria-label="Subscribe"><i className="ph-bold ph-paper-plane-right"></i></button>
              </div>

              <div style={{ display: 'flex', gap: '32px', marginTop: '32px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '24px' }}>
                <div>
                  <div className="travhub-stat-number">5000+</div>
                  <div className="travhub-stat-label">{lang === "en" ? "Active Students" : "Mahasiswa Aktif"}</div>
                </div>
                <div>
                  <div className="travhub-stat-number">BAIK SEKALI</div>
                  <div className="travhub-stat-label">{lang === "en" ? "Accreditation" : "Akreditasi Kampus"}</div>
                </div>
              </div>

              {/* Social Icons moved here */}
              <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <a href="#" className="travhub-social" aria-label="Facebook"><i className="ph-fill ph-facebook-logo"></i></a>
                <a href="#" className="travhub-social" aria-label="Twitter"><i className="ph-fill ph-twitter-logo"></i></a>
                <a href="#" className="travhub-social" aria-label="LinkedIn"><i className="ph-fill ph-linkedin-logo"></i></a>
                <a href="#" className="travhub-social" aria-label="Instagram"><i className="ph-fill ph-instagram-logo"></i></a>
              </div>
            </div>

          </div>
        </div>
        
        {/* Bottom Bar Khusus Copyright */}
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
