'use client';
import { useLanguage } from '../context/Providers';

export default function Footer() {
  const { t, lang } = useLanguage();
  return (
    <>
      <footer style={{
        background: 'var(--color-bg)',
        position: 'relative',
        overflow: 'hidden',
        marginTop: '60px',
        paddingBottom: '0',
      }}>
        <div className="container" style={{ position: 'relative', paddingTop: '60px', paddingBottom: '60px' }}>
          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '40px', alignItems: 'start' }}>
            
            {/* Kolom 1: Identitas & Logo */}
            <div>
              <a href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '16px', marginBottom: '24px', textDecoration: 'none' }}>
                <div style={{
                  background: 'var(--color-surface)',
                  borderRadius: '50%',
                  padding: '8px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '100px',
                  height: '100px',
                  boxShadow: 'inset 3px 3px 6px #cbd5e1, inset -3px -3px 6px #ffffff'
                }}>
                  <img src="/erasebg-transformed.png" alt="Logo UMIBA" style={{ width: '84px', height: '84px', objectFit: 'contain' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ color: 'var(--color-text)', fontSize: 'clamp(1.1rem, 2vw, 1.5rem)', fontWeight: '900', letterSpacing: '1px', lineHeight: '1.2' }}>UNIVERSITAS</span>
                  <span style={{ color: 'var(--color-text)', fontSize: 'clamp(1.1rem, 2vw, 1.5rem)', fontWeight: '900', letterSpacing: '1px', lineHeight: '1.2' }}>MITRA BANGSA</span>
                </div>
              </a>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: '32px', lineHeight: '1.8' }}>
                {lang === "en" ? "Universitas Mitra Bangsa creates superior generations ready to face global challenges and the digital work world through high quality education." : "Universitas Mitra Bangsa mencetak generasi unggul yang siap menghadapi tantangan global dan dunia kerja digital melalui pendidikan berkualitas."}
              </p>
            </div>
            
            {/* Kolom 2: Fakultas */}
            <div>
              <h4 style={{ color: 'var(--color-text)', fontSize: '1.1rem', marginBottom: '24px', fontWeight: '800' }}>{t("footer.fakultas")}</h4>
              <ul style={{ listStyle: 'none', padding: '0', margin: '0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <li><a href="/prodi-komputer" style={{ color: 'var(--color-text-muted)', textDecoration: 'none', fontSize: '0.95rem', display: 'flex', alignItems: 'center', padding: '4px 0', transition: 'all 0.3s ease' }}><span style={{ display: 'inline-block', width: '6px', height: '6px', backgroundColor: 'var(--umiba-red)', borderRadius: '50%', marginRight: '12px' }}></span> {t("nav.s1_komputer")}</a></li>
                <li><a href="/prodi-sistem" style={{ color: 'var(--color-text-muted)', textDecoration: 'none', fontSize: '0.95rem', display: 'flex', alignItems: 'center', padding: '4px 0', transition: 'all 0.3s ease' }}><span style={{ display: 'inline-block', width: '6px', height: '6px', backgroundColor: 'var(--umiba-red)', borderRadius: '50%', marginRight: '12px' }}></span> {t("nav.s1_sistem")}</a></li>
                <li><a href="/prodi-hukum" style={{ color: 'var(--color-text-muted)', textDecoration: 'none', fontSize: '0.95rem', display: 'flex', alignItems: 'center', padding: '4px 0', transition: 'all 0.3s ease' }}><span style={{ display: 'inline-block', width: '6px', height: '6px', backgroundColor: 'var(--umiba-red)', borderRadius: '50%', marginRight: '12px' }}></span> {t("nav.s1_hukum")}</a></li>
                <li><a href="/prodi-manajemen" style={{ color: 'var(--color-text-muted)', textDecoration: 'none', fontSize: '0.95rem', display: 'flex', alignItems: 'center', padding: '4px 0', transition: 'all 0.3s ease' }}><span style={{ display: 'inline-block', width: '6px', height: '6px', backgroundColor: 'var(--umiba-red)', borderRadius: '50%', marginRight: '12px' }}></span> {t("nav.s1_manajemen")}</a></li>
                <li><a href="/prodi-aktuaria" style={{ color: 'var(--color-text-muted)', textDecoration: 'none', fontSize: '0.95rem', display: 'flex', alignItems: 'center', padding: '4px 0', transition: 'all 0.3s ease' }}><span style={{ display: 'inline-block', width: '6px', height: '6px', backgroundColor: 'var(--umiba-red)', borderRadius: '50%', marginRight: '12px' }}></span> {lang === "en" ? "B.S. Actuarial Science" : "(S1) Ilmu Aktuaria"}</a></li>
              </ul>
            </div>

            {/* Kolom 3: Layanan/Tautan Utama */}
            <div>
              <h4 style={{ color: 'var(--color-text)', fontSize: '1.1rem', marginBottom: '24px', fontWeight: '800' }}>{t("footer.tautan_utama")}</h4>
              <ul style={{ listStyle: 'none', padding: '0', margin: '0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <li><a href="/profil" style={{ color: 'var(--color-text-muted)', textDecoration: 'none', fontSize: '0.95rem', display: 'flex', alignItems: 'center', padding: '4px 0', transition: 'all 0.3s ease' }}><span style={{ display: 'inline-block', width: '6px', height: '6px', backgroundColor: 'var(--umiba-red)', borderRadius: '50%', marginRight: '12px' }}></span> {t("footer.tentang_kampus")}</a></li>
                <li><a href="/berita" style={{ color: 'var(--color-text-muted)', textDecoration: 'none', fontSize: '0.95rem', display: 'flex', alignItems: 'center', padding: '4px 0', transition: 'all 0.3s ease' }}><span style={{ display: 'inline-block', width: '6px', height: '6px', backgroundColor: 'var(--umiba-red)', borderRadius: '50%', marginRight: '12px' }}></span> {t("nav.berita_terbaru")}</a></li>
                <li><a href="/informasi" style={{ color: 'var(--color-text-muted)', textDecoration: 'none', fontSize: '0.95rem', display: 'flex', alignItems: 'center', padding: '4px 0', transition: 'all 0.3s ease' }}><span style={{ display: 'inline-block', width: '6px', height: '6px', backgroundColor: 'var(--umiba-red)', borderRadius: '50%', marginRight: '12px' }}></span> {t("footer.penerimaan_mahasiswa")}</a></li>
                <li><a href="/akademik" style={{ color: 'var(--color-text-muted)', textDecoration: 'none', fontSize: '0.95rem', display: 'flex', alignItems: 'center', padding: '4px 0', transition: 'all 0.3s ease' }}><span style={{ display: 'inline-block', width: '6px', height: '6px', backgroundColor: 'var(--umiba-red)', borderRadius: '50%', marginRight: '12px' }}></span> {lang === "en" ? "Academic Portal" : "Portal Akademik"}</a></li>
                <li><a href="#" style={{ color: 'var(--color-text-muted)', textDecoration: 'none', fontSize: '0.95rem', display: 'flex', alignItems: 'center', padding: '4px 0', transition: 'all 0.3s ease' }}><span style={{ display: 'inline-block', width: '6px', height: '6px', backgroundColor: 'var(--umiba-red)', borderRadius: '50%', marginRight: '12px' }}></span> {t("footer.kontak_lokasi")}</a></li>
              </ul>
            </div>

            {/* Kolom 4: Newsletter / Berlangganan Info */}
            <div>
              <h4 style={{ color: 'var(--color-text)', fontSize: '1.1rem', marginBottom: '24px', fontWeight: '800' }}>{lang === "en" ? "Subscribe Info" : "Berlangganan Info"}</h4>
              
              <div style={{ display: 'flex', background: 'var(--color-surface)', borderRadius: '16px', overflow: 'hidden', marginBottom: '24px', boxShadow: 'inset 2px 2px 5px #cbd5e1, inset -2px -2px 5px #ffffff' }}>
                <input type="email" placeholder={lang === "en" ? "Enter Email Address" : "Masukkan Alamat Email"} style={{ flex: 1, background: 'transparent', border: 'none', padding: '14px 16px', color: 'var(--color-text)', fontSize: '0.9rem', outline: 'none' }} />
                <button aria-label="Subscribe" style={{ background: 'var(--umiba-red)', color: 'white', border: 'none', padding: '0 20px', cursor: 'pointer', fontWeight: 'bold', borderRadius: '0 16px 16px 0', transition: 'all 0.3s ease' }}><i className="ph-bold ph-paper-plane-right"></i></button>
              </div>

              <div style={{ display: 'flex', gap: '24px', marginTop: '24px' }}>
                <div style={{ background: 'var(--color-surface)', borderRadius: '16px', padding: '16px 20px', boxShadow: 'inset 2px 2px 5px #cbd5e1, inset -2px -2px 5px #ffffff', flex: 1, textAlign: 'center' }}>
                  <div style={{ color: 'var(--umiba-red)', fontSize: '1.4rem', fontWeight: 800, marginBottom: '2px' }}>5000+</div>
                  <div style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>{lang === "en" ? "Active Students" : "Mahasiswa Aktif"}</div>
                </div>
                <div style={{ background: 'var(--color-surface)', borderRadius: '16px', padding: '16px 20px', boxShadow: 'inset 2px 2px 5px #cbd5e1, inset -2px -2px 5px #ffffff', flex: 1, textAlign: 'center' }}>
                  <div style={{ color: 'var(--umiba-red)', fontSize: '1.4rem', fontWeight: 800, marginBottom: '2px' }}>BAIK SEKALI</div>
                  <div style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>{lang === "en" ? "Accreditation" : "Akreditasi Kampus"}</div>
                </div>
              </div>

              {/* Social Icons */}
              <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <a href="#" aria-label="Facebook" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', background: 'var(--color-surface)', borderRadius: '50%', color: 'var(--color-text-muted)', fontSize: '1.1rem', boxShadow: 'inset 2px 2px 4px #cbd5e1, inset -2px -2px 4px #ffffff', transition: 'all 0.3s ease', textDecoration: 'none' }}><i className="ph-fill ph-facebook-logo"></i></a>
                <a href="#" aria-label="Twitter" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', background: 'var(--color-surface)', borderRadius: '50%', color: 'var(--color-text-muted)', fontSize: '1.1rem', boxShadow: 'inset 2px 2px 4px #cbd5e1, inset -2px -2px 4px #ffffff', transition: 'all 0.3s ease', textDecoration: 'none' }}><i className="ph-fill ph-twitter-logo"></i></a>
                <a href="#" aria-label="LinkedIn" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', background: 'var(--color-surface)', borderRadius: '50%', color: 'var(--color-text-muted)', fontSize: '1.1rem', boxShadow: 'inset 2px 2px 4px #cbd5e1, inset -2px -2px 4px #ffffff', transition: 'all 0.3s ease', textDecoration: 'none' }}><i className="ph-fill ph-linkedin-logo"></i></a>
                <a href="#" aria-label="Instagram" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', background: 'var(--color-surface)', borderRadius: '50%', color: 'var(--color-text-muted)', fontSize: '1.1rem', boxShadow: 'inset 2px 2px 4px #cbd5e1, inset -2px -2px 4px #ffffff', transition: 'all 0.3s ease', textDecoration: 'none' }}><i className="ph-fill ph-instagram-logo"></i></a>
              </div>
            </div>

          </div>
        </div>
        
        {/* Bottom Bar Copyright */}
        <div style={{ background: 'var(--color-surface)', padding: '20px 0', textAlign: 'center', fontSize: '0.9rem', color: 'var(--color-text-muted)', boxShadow: 'inset 0 3px 6px #cbd5e1' }}>
          <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              Copyright &copy; {new Date().getFullYear()} Universitas Mitra Bangsa
            </div>
            <div style={{ display: 'flex', gap: '24px' }}>
              <a href="#" style={{ color: 'var(--color-text-muted)', textDecoration: 'none', fontSize: '0.9rem' }}>{t("footer.kebijakan_privasi")}</a>
              <a href="#" style={{ color: 'var(--color-text-muted)', textDecoration: 'none', fontSize: '0.9rem' }}>{t("footer.syarat_ketentuan")}</a>
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
