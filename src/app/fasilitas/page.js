'use client';
import { useLanguage } from '../../context/Providers';

export default function Page() {
  const { lang, t } = useLanguage();
    
  
  const heroBg = 'https://umiba.ac.id/wp-content/uploads/2024/05/bannerUMIBA26_1.png';
  const heroTitle = (lang === "en" ? "Page" : 'Fasilitas UMIBA');
  const mainHtml = `<!-- ░░░ HERO SUBPAGE ░░░ -->


<!-- ░░░ NAVIGATION TABS ░░░ -->
<div style="position: sticky; top: 100px; z-index: 900; margin-top: 24px; margin-bottom: 24px;">
  <div class="container">
    <div class="glass" style="padding: 12px; border-radius: var(--radius-full); display: flex; justify-content: center; gap: 8px; flex-wrap: wrap;">
      <a href="#akademik" class="btn btn-glass" style="padding: 10px 20px; font-size: 0.9rem;">${lang === "en" ? "Academic Facilities" : "Fasilitas Akademik"}</a>
      <a href="#non-akademik" class="btn btn-glass" style="padding: 10px 20px; font-size: 0.9rem;">${lang === "en" ? "Public Facilities" : "Fasilitas Umum"}</a>
    </div>
  </div>
</div>

<!-- ░░░ CONTENT ░░░ -->
<section id="akademik" style="padding: var(--space-8) 0;">
  <div class="container">
    <div class="fade-up" style="text-align: center; margin-bottom: 48px;">
      <span class="text-red" style="font-weight: 600; text-transform: uppercase;">${lang === "en" ? "Learning Support" : "Penunjang Belajar"}</span>
      <h2>${lang === "en" ? "Academic Facilities" : "Fasilitas Akademik"}</h2>
    </div>
    <div class="grid grid-3">
      <div class="glass glass-card fade-up">
        <i class="ph-duotone ph-books" style="font-size: 3rem; color: var(--umiba-red); margin-bottom: 16px;"></i>
        <h3>${lang === "en" ? "Digital Library" : "Perpustakaan Digital"}</h3>
        <p>${lang === "en" ? "Access thousands of international journals, e-books, and comfortable reading rooms equipped with high-speed internet." : "Akses ribuan jurnal internasional, e-book, dan ruang baca yang nyaman dilengkapi dengan akses internet berkecepatan tinggi."}</p>
      </div>
      <div class="glass glass-card fade-up" style="transition-delay: 0.1s;">
        <i class="ph-duotone ph-desktop" style="font-size: 3rem; color: var(--umiba-red); margin-bottom: 16px;"></i>
        <h3>${lang === "en" ? "Computer Laboratory" : "Laboratorium Komputer"}</h3>
        <p>${lang === "en" ? "Equipped with industry-standard high-spec PCs (i7/Ryzen 7) to support IT and Information Systems practicums." : "Dilengkapi dengan PC spesifikasi tinggi standar industri (i7/Ryzen 7) untuk mendukung praktikum prodi IT dan Sistem Informasi."}</p>
      </div>
      <div class="glass glass-card fade-up" style="transition-delay: 0.2s;">
        <i class="ph-duotone ph-scales" style="font-size: 3rem; color: var(--umiba-red); margin-bottom: 16px;"></i>
        <h3>${lang === "en" ? "Moot Court" : "Ruang Peradilan Semu"}</h3>
        <p>${lang === "en" ? "Special Moot Court for Law students for court practice simulations designed exactly like a real court." : "Moot Court khusus untuk mahasiswa Fakultas Hukum untuk simulasi praktik peradilan yang didesain persis seperti pengadilan nyata."}</p>
      </div>
    </div>
  </div>
</section>

<section id="non-akademik" style="padding: var(--space-8) 0; background: var(--umiba-red-alpha);">
  <div class="container">
    <div class="fade-up" style="text-align: center; margin-bottom: 48px;">
      <span class="text-red" style="font-weight: 600; text-transform: uppercase;">${lang === "en" ? "Student Support" : "Penunjang Mahasiswa"}</span>
      <h2>${lang === "en" ? "Public Facilities" : "Fasilitas Umum"}</h2>
    </div>
    <div class="grid grid-2">
      <div class="glass glass-card fade-up" style="display: flex; gap: 20px; align-items: center;">
        <i class="ph-duotone ph-coffee" style="font-size: 4rem; color: var(--umiba-red);"></i>
        <div>
          <h3>Student Lounge & Cafe</h3>
          <p style="margin:0;">${lang === "en" ? "A modernly designed communal space for group discussions or just relaxing, complete with power outlets and Wi-Fi." : "Ruang komunal yang didesain modern untuk diskusi kelompok atau sekadar bersantai, lengkap dengan colokan listrik dan Wi-Fi."}</p>
        </div>
      </div>
      <div class="glass glass-card fade-up" style="transition-delay: 0.1s; display: flex; gap: 20px; align-items: center;">
        <i class="ph-duotone ph-mosque" style="font-size: 4rem; color: var(--umiba-red);"></i>
        <div>
          <h3>${lang === "en" ? "Campus Mosque" : "Masjid Kampus"}</h3>
          <p style="margin:0;">${lang === "en" ? "Spacious and clean worship facilities, supporting the spiritual activities of students and lecturers." : "Fasilitas ibadah yang luas dan bersih, mendukung kegiatan kerohanian mahasiswa dan dosen."}</p>
        </div>
      </div>
    </div>
  </div>
</section>`;

  
  return (
    <div>
      <section className="hero hero-sub" style={{ background: `url('${heroBg}') center/cover`, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', color: 'white', overflow: 'hidden', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ position: 'absolute', inset: '-20px', background: 'linear-gradient(to bottom, rgba(15, 23, 42, 0.7), rgba(15, 23, 42, 0.9))', backdropFilter: 'blur(12px) saturate(150%)', WebkitBackdropFilter: 'blur(12px) saturate(150%)', zIndex: 1 }}></div>
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div className="fade-up">
            <span style={{ background: 'var(--umiba-red)', color: 'white', padding: '6px 16px', borderRadius: 'var(--radius-full)', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '24px', display: 'inline-block' }}>UMIBA</span>
            <h1 style={{ color: 'white', marginBottom: '16px' }}>{heroTitle}</h1>
          </div>
        </div>
      </section>
      <div dangerouslySetInnerHTML={{ __html: mainHtml }} />
    </div>
  );
}
