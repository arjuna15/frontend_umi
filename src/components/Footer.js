export default function Footer() {
  return (
    <>
      <footer className="unique-footer" style={{ background: 'radial-gradient(circle at top right, #ef4444 0%, #b91c1c 40%, #7f1d1d 80%, #450a0a 100%)', color: 'white', padding: 'var(--space-8) 0 var(--space-4)', position: 'relative', overflow: 'hidden', marginTop: 'var(--space-8)' }}>
  
  {/*  Motif Belah Ketupat (Diamond Pattern) Overlay  */}
  <div style={{ position: 'absolute', inset: '0', backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"40\" height=\"40\" viewBox=\"0 0 40 40\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"%23ffffff\" fill-opacity=\"0.05\" fill-rule=\"evenodd\"%3E%3Cpath d=\"M20 0L40 20L20 40L0 20z\"/%3E%3C/g%3E%3C/svg%3E')", backgroundSize: '40px 40px', zIndex: '0', pointerEvents: 'none' }}></div>
  
  <div className="container" style={{ position: 'relative', zIndex: '1' }}>
    <div className="footer-main">
      <div className="footer-logo-col">
        <a href="/" className="logo-badge" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '120px', height: '120px', background: 'var(--color-white)', borderRadius: '50%', boxShadow: '0 8px 20px rgba(0,0,0,0.2)', marginBottom: 'var(--space-4)', textDecoration: 'none', transition: 'transform 0.3s ease' }} onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
          <img src="/erasebg-transformed.png" alt="Logo UMIBA" style={{ width: '90px', height: '90px', objectFit: 'contain', transform: 'scale(1.15)' }} />
        </a>
        <p style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.9)', marginBottom: 'var(--space-4)', lineHeight: '1.6' }}>Universitas Mitra Bangsa mencetak generasi unggul yang siap menghadapi tantangan global dan dunia kerja digital melalui pendidikan berkualitas tinggi.</p>
        <a href="https://pmb.umiba.ac.id" target="_blank" className="btn" style={{ background: 'var(--color-white)', color: 'var(--umiba-red)', padding: '14px 28px', fontSize: '1.05rem', borderRadius: '50px', fontWeight: 'bold', boxShadow: '0 10px 20px rgba(0,0,0,0.1)', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>Daftar Sekarang <i className="ph-bold ph-arrow-up-right"></i></a>
      </div>
      
      <div className="footer-links-col">
        <div>
          <h4 style={{ color: 'white', fontSize: '1.1rem', marginBottom: 'var(--space-3)', fontWeight: '600' }}>Fakultas</h4>
          <ul style={{ listStyle: 'none', padding: '0', margin: '0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <li><a href="/prodi-komputer" className="footer-hover-link" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', transition: '0.3s' }}>Ilmu Komputer</a></li>
            <li><a href="/prodi-sistem" className="footer-hover-link" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', transition: '0.3s' }}>Sistem Informasi</a></li>
            <li><a href="/prodi-hukum" className="footer-hover-link" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', transition: '0.3s' }}>Hukum</a></li>
            <li><a href="/prodi-manajemen" className="footer-hover-link" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', transition: '0.3s' }}>Manajemen</a></li>
          </ul>
        </div>
        <div>
          <h4 style={{ color: 'white', fontSize: '1.1rem', marginBottom: 'var(--space-3)', fontWeight: '600' }}>Tautan Utama</h4>
          <ul style={{ listStyle: 'none', padding: '0', margin: '0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <li><a href="/profil" className="footer-hover-link" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', transition: '0.3s' }}>Tentang Kampus</a></li>
            <li><a href="/berita" className="footer-hover-link" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', transition: '0.3s' }}>Berita Terbaru</a></li>
            <li><a href="/informasi" className="footer-hover-link" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', transition: '0.3s' }}>Penerimaan Mahasiswa</a></li>
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
    </>
  );
}
