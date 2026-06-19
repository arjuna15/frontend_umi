export default function Page() {
  return (
    <div dangerouslySetInnerHTML={{ __html: `<!-- ░░░ HERO SUBPAGE ░░░ -->
<section class="hero hero-sub" style="background: url('https://umiba.ac.id/wp-content/uploads/2024/05/bannerUMIBA26_1.png') center/cover; position: relative; display: flex; align-items: center; justify-content: center; text-align: center; color: white; overflow: hidden; border-bottom: 1px solid rgba(255,255,255,0.05);">
  <div style="position: absolute; inset: -20px; background: linear-gradient(to bottom, rgba(15, 23, 42, 0.7), rgba(15, 23, 42, 0.9)); backdrop-filter: blur(12px) saturate(150%); -webkit-backdrop-filter: blur(12px) saturate(150%); z-index: 1;"></div>
  <div class="container" style="position: relative; z-index: 2;">
    <div class="fade-up">
      <span style="background: var(--umiba-red); color: white; padding: 6px 16px; border-radius: var(--radius-full); font-size: 0.85rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 24px; display: inline-block;">Layanan Kampus</span>
      <h1 style="color: white; margin-bottom: 16px;">Fasilitas UMIBA</h1>
      <p style="font-size: 1.25rem; max-width: 700px; margin: 0 auto; opacity: 0.9; color: white;">Mendukung kegiatan akademik dan non-akademik dengan standar terbaik.</p>
    </div>
  </div>
</section>

<!-- ░░░ NAVIGATION TABS ░░░ -->
<div style="position: sticky; top: 100px; z-index: 900; margin-top: 24px; margin-bottom: 24px;">
  <div class="container">
    <div class="glass" style="padding: 12px; border-radius: var(--radius-full); display: flex; justify-content: center; gap: 8px; flex-wrap: wrap;">
      <a href="#akademik" class="btn btn-glass" style="padding: 10px 20px; font-size: 0.9rem;">Fasilitas Akademik</a>
      <a href="#non-akademik" class="btn btn-glass" style="padding: 10px 20px; font-size: 0.9rem;">Fasilitas Umum</a>
    </div>
  </div>
</div>

<!-- ░░░ CONTENT ░░░ -->
<section id="akademik" style="padding: var(--space-8) 0;">
  <div class="container">
    <div class="fade-up" style="text-align: center; margin-bottom: 48px;">
      <span class="text-red" style="font-weight: 600; text-transform: uppercase;">Penunjang Belajar</span>
      <h2>Fasilitas Akademik</h2>
    </div>
    <div class="grid grid-3">
      <div class="glass glass-card fade-up">
        <i class="ph-duotone ph-books" style="font-size: 3rem; color: var(--umiba-red); margin-bottom: 16px;"></i>
        <h3>Perpustakaan Digital</h3>
        <p>Akses ribuan jurnal internasional, e-book, dan ruang baca yang nyaman dilengkapi dengan akses internet berkecepatan tinggi.</p>
      </div>
      <div class="glass glass-card fade-up" style="transition-delay: 0.1s;">
        <i class="ph-duotone ph-desktop" style="font-size: 3rem; color: var(--umiba-red); margin-bottom: 16px;"></i>
        <h3>Laboratorium Komputer</h3>
        <p>Dilengkapi dengan PC spesifikasi tinggi standar industri (i7/Ryzen 7) untuk mendukung praktikum prodi IT dan Sistem Informasi.</p>
      </div>
      <div class="glass glass-card fade-up" style="transition-delay: 0.2s;">
        <i class="ph-duotone ph-scales" style="font-size: 3rem; color: var(--umiba-red); margin-bottom: 16px;"></i>
        <h3>Ruang Peradilan Semu</h3>
        <p>Moot Court khusus untuk mahasiswa Fakultas Hukum untuk simulasi praktik peradilan yang didesain persis seperti pengadilan nyata.</p>
      </div>
    </div>
  </div>
</section>

<section id="non-akademik" style="padding: var(--space-8) 0; background: rgba(185, 28, 28, 0.03);">
  <div class="container">
    <div class="fade-up" style="text-align: center; margin-bottom: 48px;">
      <span class="text-red" style="font-weight: 600; text-transform: uppercase;">Penunjang Mahasiswa</span>
      <h2>Fasilitas Umum</h2>
    </div>
    <div class="grid grid-2">
      <div class="glass glass-card fade-up" style="display: flex; gap: 20px; align-items: center;">
        <i class="ph-duotone ph-coffee" style="font-size: 4rem; color: var(--umiba-red);"></i>
        <div>
          <h3>Student Lounge & Cafe</h3>
          <p style="margin:0;">Ruang komunal yang didesain modern untuk diskusi kelompok atau sekadar bersantai, lengkap dengan colokan listrik dan Wi-Fi.</p>
        </div>
      </div>
      <div class="glass glass-card fade-up" style="transition-delay: 0.1s; display: flex; gap: 20px; align-items: center;">
        <i class="ph-duotone ph-mosque" style="font-size: 4rem; color: var(--umiba-red);"></i>
        <div>
          <h3>Masjid Kampus</h3>
          <p style="margin:0;">Fasilitas ibadah yang luas dan bersih, mendukung kegiatan kerohanian mahasiswa dan dosen.</p>
        </div>
      </div>
    </div>
  </div>
</section>` }} />
  );
}
