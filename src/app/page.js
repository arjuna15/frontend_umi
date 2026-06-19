
"use client";
import { useEffect, useState } from 'react';

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [newsData, setNewsData] = useState([]);
  const [testiData, setTestiData] = useState([]);

  useEffect(() => {
    // Basic slider logic
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % 3);
    }, 5000);

    // Fetch dynamic data from API
    const fetchHomeData = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://backend.bikinwebdikitaaja.com/api'}/home-data`);
        if (res.ok) {
          const data = await res.json();
          if (data.news) setNewsData(data.news.slice(0, 3));
          if (data.testimonials) setTestiData(data.testimonials);
        }
      } catch (error) {
        console.error('Failed to fetch home data:', error);
      }
    };
    fetchHomeData();

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      

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
        <a href="/akademik?tab=manajemen" className="btn btn-glass" style={{ width: '100%', marginTop: 'auto' }}>Lihat Fakultas</a>
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
        <a href="/akademik?tab=hukum" className="btn btn-glass" style={{ width: '100%', marginTop: 'auto' }}>Lihat Fakultas</a>
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
        <a href="/akademik?tab=it" className="btn btn-glass" style={{ width: '100%', marginTop: 'auto' }}>Lihat Fakultas</a>
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
      <a href="/berita" className="btn btn-glass">Lihat Semua</a>
    </div>
    <div className="grid grid-3">
      {newsData.length > 0 ? (
        newsData.map((newsItem, index) => (
          <div key={newsItem.id} className="glass glass-card fade-up" style={{ transitionDelay: `${index * 0.1}s` }}>
            <div style={{ background: 'var(--color-muted)', height: '200px', borderRadius: 'var(--radius-sm)', marginBottom: 'var(--space-3)', overflow: 'hidden' }}>
               <img src={newsItem.image_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={newsItem.title}/>
            </div>
            <p style={{ fontSize: '0.8rem', marginBottom: '8px' }}>{newsItem.date}</p>
            <h3 style={{ fontSize: '1.1rem' }}>{newsItem.title}</h3>
          </div>
        ))
      ) : (
        <div style={{ gridColumn: 'span 3', textAlign: 'center', padding: '20px' }}>Loading berita...</div>
      )}
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
      {testiData.length > 0 ? (
        testiData.map((testi, index) => (
          <div key={testi.id} className="testi-card" style={{ border: 'none', background: 'transparent', boxShadow: 'none' }}>
            <img className="alumni-img" style={{ borderRadius: 'var(--radius-lg)', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }} src={testi.image_url} alt={`Testimoni ${index + 1}`}/>
          </div>
        ))
      ) : (
        <div style={{ textAlign: 'center', padding: '20px' }}>Loading testimoni...</div>
      )}
    </div>
    <input type="range" className="custom-scrollbar" data-target=".testi-slider" min="0" max="100" value="0" />
  </div>
</section>



{/*  ░░░ FOOTER UNIK ░░░  */}



      </>
  );
}
