export default function Page() {
  return (
    <div dangerouslySetInnerHTML={{ __html: `<!-- ░░░ HERO SUBPAGE ░░░ -->
<section class="hero hero-sub" style="background: url('https://umiba.ac.id/wp-content/uploads/2024/05/bannerUMIBA26_3.png') center/cover; position: relative; display: flex; align-items: center; justify-content: center; text-align: center; color: white; overflow: hidden; border-bottom: 1px solid rgba(255,255,255,0.05);">
  <div style="position: absolute; inset: -20px; background: linear-gradient(to bottom, rgba(15, 23, 42, 0.7), rgba(15, 23, 42, 0.9)); backdrop-filter: blur(12px) saturate(150%); -webkit-backdrop-filter: blur(12px) saturate(150%); z-index: 1;"></div>
  <div class="container" style="position: relative; z-index: 2;">
    <div class="fade-up">
      <span style="background: var(--umiba-red); color: white; padding: 6px 16px; border-radius: var(--radius-full); font-size: 0.85rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 24px; display: inline-block;">Layanan Kampus</span>
      <h1 style="color: white; margin-bottom: 16px;">Pusat Informasi</h1>
      <p style="font-size: 1.25rem; max-width: 700px; margin: 0 auto; opacity: 0.9; color: white;">Temukan informasi biaya pendidikan, brosur, dan infografis kampus kami.</p>
    </div>
  </div>
</section>

<!-- ░░░ NAVIGATION TABS ░░░ -->
<div style="position: sticky; top: 100px; z-index: 900; margin-top: 24px; margin-bottom: 24px;">
  <div class="container">
    <div class="glass" style="padding: 12px; border-radius: var(--radius-full); display: flex; justify-content: center; gap: 8px; flex-wrap: wrap;">
      <a href="#biaya" class="btn btn-glass" style="padding: 10px 20px; font-size: 0.9rem;">Biaya Pendidikan</a>
      <a href="#infografis" class="btn btn-glass" style="padding: 10px 20px; font-size: 0.9rem;">Info Grafis</a>
    </div>
  </div>
</div>

<!-- ░░░ BIAYA PENDIDIKAN ░░░ -->
<section id="biaya" style="padding: var(--space-8) 0;">
  <div class="container">
    <div class="glass glass-card fade-up">
      <span class="text-red" style="font-weight: 600; text-transform: uppercase;">Informasi Terkini</span>
      <h2>Biaya Pendidikan Tahun Ajaran 2025/2026</h2>
      <p>Universitas Mitra Bangsa berkomitmen memberikan pendidikan berkualitas dengan biaya yang terjangkau. Kami juga menyediakan berbagai program beasiswa bagi mahasiswa berprestasi dan mahasiswa kurang mampu.</p>
      
      <table style="width: 100%; border-collapse: collapse; margin-top: var(--space-4); text-align: left;">
        <thead>
          <tr style="border-bottom: 2px solid var(--umiba-red);">
            <th style="padding: 12px; color: var(--color-text);">Program Studi</th>
            <th style="padding: 12px; color: var(--color-text);">Uang Pangkal</th>
            <th style="padding: 12px; color: var(--color-text);">SPP / Semester</th>
          </tr>
        </thead>
        <tbody>
          <tr style="border-bottom: 1px solid rgba(0,0,0,0.1);">
            <td style="padding: 12px;">S1 Manajemen / Hukum</td>
            <td style="padding: 12px;">Rp 5.500.000</td>
            <td style="padding: 12px;">Rp 4.000.000</td>
          </tr>
          <tr style="border-bottom: 1px solid rgba(0,0,0,0.1);">
            <td style="padding: 12px;">S1 Ilmu Komputer / Sistem TI</td>
            <td style="padding: 12px;">Rp 6.000.000</td>
            <td style="padding: 12px;">Rp 4.500.000</td>
          </tr>
          <tr style="border-bottom: 1px solid rgba(0,0,0,0.1);">
            <td style="padding: 12px;">S1 Ilmu Aktuaria</td>
            <td style="padding: 12px;">Rp 6.500.000</td>
            <td style="padding: 12px;">Rp 4.800.000</td>
          </tr>
          <tr>
            <td style="padding: 12px;">S2 Magister Manajemen</td>
            <td style="padding: 12px;">Rp 8.000.000</td>
            <td style="padding: 12px;">Rp 7.000.000</td>
          </tr>
        </tbody>
      </table>
      
      <p style="margin-top: var(--space-4); font-size: 0.9rem; color: var(--color-muted);">*Biaya di atas adalah estimasi dan dapat berubah sewaktu-waktu. Untuk informasi rincian biaya lengkap, silakan unduh brosur atau hubungi bagian pendaftaran.</p>
    </div>
  </div>
</section>

<!-- ░░░ BROSUR & INFOGRAFIS ░░░ -->
<section id="infografis" style="padding: var(--space-8) 0; background: rgba(255, 255, 255, 0.4);">
  <div class="container grid grid-2">
    <div class="glass glass-card fade-up">
      <h2 class="text-red">Unduh Brosur</h2>
      <p>Dapatkan informasi lengkap tentang visi misi, fakultas, program studi, kegiatan kemahasiswaan, dan panduan lengkap tata cara pendaftaran mahasiswa baru.</p>
      <a href="https://umiba.ac.id/doc/brosur/BrosurUMIBA2025.pdf" target="_blank" class="btn btn-primary" style="margin-top: var(--space-3);">Download Brosur (PDF)</a>
    </div>
    <div class="glass glass-card fade-up" style="transition-delay: 0.1s;">
      <h2 class="text-red">Info Grafis</h2>
      <p>Melihat visualisasi data tentang pencapaian Universitas Mitra Bangsa, statistik kelulusan, penyerapan kerja alumni, dan persebaran mahasiswa di seluruh Indonesia.</p>
      <a href="#" class="btn btn-glass" style="margin-top: var(--space-3);">Lihat Info Grafis</a>
    </div>
  </div>
</section>` }} />
  );
}
