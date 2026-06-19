export default function Page() {
  return (
    <div dangerouslySetInnerHTML={{ __html: `<!-- ░░░ HERO SUBPAGE ░░░ -->
<section class="hero hero-sub" style="background: url('https://umiba.ac.id/wp-content/uploads/2024/05/bannerUMIBA26_2.png') center/cover; position: relative; display: flex; align-items: center; justify-content: center; text-align: center; color: white; overflow: hidden; border-bottom: 1px solid rgba(255,255,255,0.05);">
  <!-- Backdrop Overlay with Darkness and Blur -->
  <div style="position: absolute; inset: -50px; background: linear-gradient(to bottom, rgba(15, 23, 42, 0.7), rgba(15, 23, 42, 0.9)); backdrop-filter: blur(12px) saturate(150%); -webkit-backdrop-filter: blur(12px) saturate(150%); z-index: 1;"></div>
  
  <div class="container" style="position: relative; z-index: 2;">
    <div class="fade-up">
      <span style="background: var(--umiba-red); color: white; padding: 6px 16px; border-radius: var(--radius-full); font-size: 0.85rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 24px; display: inline-block;">Pusat Inovasi & Pengabdian</span>
      <h1 style="color: white; margin-bottom: 16px;">LPPM UMIBA</h1>
      <p style="font-size: 1.25rem; max-width: 700px; margin: 0 auto; opacity: 0.9; color: white;">Lembaga Penelitian dan Pengabdian kepada Masyarakat Universitas Mitra Bangsa.</p>
    </div>
  </div>
</section>

<!-- ░░░ NAVIGATION TABS ░░░ -->
<div style="position: sticky; top: 100px; z-index: 900; margin-top: 24px; margin-bottom: 24px;">
  <div class="container">
    <div class="glass" style="padding: 12px; border-radius: var(--radius-full); display: flex; justify-content: center; gap: 8px; flex-wrap: wrap;">
      <a href="#tentang" class="btn btn-glass" style="padding: 10px 20px; font-size: 0.9rem;">Tentang</a>
      <a href="#penelitian" class="btn btn-glass" style="padding: 10px 20px; font-size: 0.9rem;">Penelitian</a>
      <a href="#pengabdian" class="btn btn-glass" style="padding: 10px 20px; font-size: 0.9rem;">Pengabdian</a>
      <a href="#berita" class="btn btn-glass" style="padding: 10px 20px; font-size: 0.9rem;">Berita & Info</a>
    </div>
  </div>
</div>

<!-- ░░░ TENTANG SECTION ░░░ -->
<section id="tentang" style="padding: var(--space-8) 0;">
  <div class="container">
    <div class="grid grid-2" style="align-items: center;">
      <div class="fade-up">
        <span class="text-red" style="font-weight: 700; text-transform: uppercase; font-size: 0.9rem;">Profil Lembaga</span>
        <h2 style="margin-top: 12px;">Membangun Budaya Riset yang Berdampak</h2>
        <p>LPPM UMIBA merupakan jantung dari kegiatan akademik yang menghubungkan teori ilmiah dengan implementasi praktis di masyarakat. Kami berkomitmen untuk meningkatkan reputasi universitas melalui publikasi internasional dan hilirisasi produk penelitian.</p>
        
        <div class="grid grid-2" style="margin-top: 32px; gap: 20px;">
          <div class="glass glass-card" style="padding: 24px;">
            <i class="ph-duotone ph-eye" style="font-size: 2.5rem; color: var(--umiba-red); margin-bottom: 16px;"></i>
            <h3 style="font-size: 1.25rem;">Visi</h3>
            <p style="font-size: 0.9rem; margin: 0;">Menjadi lembaga unggulan dalam pengembangan IPTEK berbasis kearifan lokal yang diakui secara nasional.</p>
          </div>
          <div class="glass glass-card" style="padding: 24px;">
            <i class="ph-duotone ph-target" style="font-size: 2.5rem; color: var(--umiba-red); margin-bottom: 16px;"></i>
            <h3 style="font-size: 1.25rem;">Misi</h3>
            <p style="font-size: 0.9rem; margin: 0;">Memfasilitasi riset inovatif dan program pengabdian yang solutif bagi permasalahan bangsa.</p>
          </div>
        </div>
      </div>
      <div class="glass glass-card fade-up" style="padding: 0; overflow: hidden;">
        <img src="https://umiba.ac.id/wp-content/uploads/2026/05/rektor-UMIBA-2026.jpeg" alt="Struktur LPPM" style="width: 100%; height: 500px; object-fit: cover;">
        <div class="glass" style="position: absolute; bottom: 20px; left: 20px; right: 20px; padding: 20px;">
          <h4 style="margin:0;">Kepala LPPM UMIBA</h4>
          <p style="margin:0; font-size: 0.85rem;">Mengoordinasikan riset unggulan dosen & mahasiswa.</p>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ░░░ PENELITIAN SECTION ░░░ -->
<section id="penelitian" style="padding: var(--space-8) 0; background: rgba(248, 250, 252, 0.5);">
  <div class="container">
    <div style="text-align: center; max-width: 800px; margin: 0 auto 60px;" class="fade-up">
      <span class="text-red" style="font-weight: 700; text-transform: uppercase;">Excellence in Research</span>
      <h2 style="margin-top: 12px;">Program Penelitian</h2>
      <p>Kami menyediakan berbagai skema pendanaan dan dukungan bagi peneliti untuk mengeksplorasi batas-batas pengetahuan baru.</p>
    </div>

    <div class="grid grid-3">
      <div class="glass glass-card fade-up">
        <div style="background: rgba(185, 28, 28, 0.1); width: 60px; height: 60px; border-radius: 16px; display: flex; align-items: center; justify-content: center; margin-bottom: 24px;">
          <i class="ph-duotone ph-currency-circle-dollar" style="font-size: 2rem; color: var(--umiba-red);"></i>
        </div>
        <h3>Hibah Internal</h3>
        <p style="font-size: 0.95rem;">Pendanaan tahunan untuk dosen tetap UMIBA guna meningkatkan produktivitas publikasi SINTA.</p>
        <a href="#" class="btn btn-glass" style="margin-top: auto; font-size: 0.85rem;">Download Panduan</a>
      </div>
      <div class="glass glass-card fade-up" style="transition-delay: 0.1s;">
        <div style="background: rgba(185, 28, 28, 0.1); width: 60px; height: 60px; border-radius: 16px; display: flex; align-items: center; justify-content: center; margin-bottom: 24px;">
          <i class="ph-duotone ph-globe" style="font-size: 2rem; color: var(--umiba-red);"></i>
        </div>
        <h3>Hibah Kompetitif</h3>
        <p style="font-size: 0.95rem;">Dukungan pengajuan proposal hibah Kemendikbudristek dan pendanaan eksternal internasional.</p>
        <a href="#" class="btn btn-glass" style="margin-top: auto; font-size: 0.85rem;">Lihat Skema</a>
      </div>
      <div class="glass glass-card fade-up" style="transition-delay: 0.2s;">
        <div style="background: rgba(185, 28, 28, 0.1); width: 60px; height: 60px; border-radius: 16px; display: flex; align-items: center; justify-content: center; margin-bottom: 24px;">
          <i class="ph-duotone ph-student" style="font-size: 2rem; color: var(--umiba-red);"></i>
        </div>
        <h3>Riset Mahasiswa</h3>
        <p style="font-size: 0.95rem;">Program kolaborasi riset dosen-mahasiswa untuk tugas akhir dan kompetisi PKM.</p>
        <a href="#" class="btn btn-glass" style="margin-top: auto; font-size: 0.85rem;">Daftar Program</a>
      </div>
    </div>
  </div>
</section>

<!-- ░░░ PENGABDIAN SECTION ░░░ -->
<section id="pengabdian" style="padding: var(--space-8) 0;">
  <div class="container">
    <div class="grid grid-2" style="align-items: center; gap: 60px;">
      <div class="fade-up" style="order: 2;">
        <span class="text-red" style="font-weight: 700; text-transform: uppercase;">Community Impact</span>
        <h2 style="margin-top: 12px;">Pengabdian Masyarakat</h2>
        <p>Membawa solusi inovatif dari ruang kelas langsung ke tengah masyarakat untuk perubahan yang nyata dan berkelanjutan.</p>
        
        <ul style="list-style: none; padding: 0; margin: 32px 0;">
          <li style="display: flex; gap: 16px; margin-bottom: 24px;">
            <div style="color: var(--umiba-red); font-size: 1.5rem;"><i class="ph-fill ph-check-circle"></i></div>
            <div>
              <h4 style="margin:0;">Pemberdayaan UMKM</h4>
              <p style="margin:0; font-size: 0.9rem;">Digitalisasi pemasaran dan pengelolaan keuangan untuk pengusaha lokal.</p>
            </div>
          </li>
          <li style="display: flex; gap: 16px; margin-bottom: 24px;">
            <div style="color: var(--umiba-red); font-size: 1.5rem;"><i class="ph-fill ph-check-circle"></i></div>
            <div>
              <h4 style="margin:0;">Desa Binaan</h4>
              <p style="margin:0; font-size: 0.9rem;">Pengembangan potensi ekonomi desa melalui inovasi teknologi tepat guna.</p>
            </div>
          </li>
          <li style="display: flex; gap: 16px;">
            <div style="color: var(--umiba-red); font-size: 1.5rem;"><i class="ph-fill ph-check-circle"></i></div>
            <div>
              <h4 style="margin:0;">Edukasi Masyarakat</h4>
              <p style="margin:0; font-size: 0.9rem;">Penyuluhan hukum, kesehatan digital, dan literasi teknologi informasi.</p>
            </div>
          </li>
        </ul>
      </div>
      <div class="grid grid-2 fade-up" style="gap: 20px; order: 1;">
        <img src="https://umiba.ac.id/wp-content/uploads/2025/12/umiba-4pilar-1536x938-1.jpeg" style="width: 100%; height: 250px; object-fit: cover; border-radius: var(--radius-lg); margin-top: 40px;" alt="Pengabdian 1">
        <img src="https://umiba.ac.id/wp-content/uploads/2025/08/umiba-upacara.jpg" style="width: 100%; height: 250px; object-fit: cover; border-radius: var(--radius-lg);" alt="Pengabdian 2">
      </div>
    </div>
  </div>
</section>

<!-- ░░░ BERITA & PENGUMUMAN SECTION ░░░ -->
<section id="berita" style="padding: var(--space-8) 0; background: rgba(185, 28, 28, 0.03);">
  <div class="container">
    <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 48px;" class="fade-up">
      <div>
        <span class="text-red" style="font-weight: 700; text-transform: uppercase;">Update LPPM</span>
        <h2 style="margin: 8px 0 0;">Berita & Pengumuman</h2>
      </div>
      <a href="https://lppm.umiba.ac.id/" target="_blank" class="btn btn-primary">Lihat Web LPPM Original</a>
    </div>

    <div class="grid grid-3">
      <!-- Announcement Card -->
      <div class="glass glass-card fade-up" style="border-top: 4px solid var(--umiba-red);">
        <span style="font-size: 0.8rem; font-weight: 700; color: var(--umiba-red); text-transform: uppercase;">Pengumuman</span>
        <h3 style="font-size: 1.2rem; margin-top: 12px;">Penerimaan Proposal Hibah Penelitian & Pengabdian 2026</h3>
        <p style="font-size: 0.9rem;">Batas akhir pengumpulan proposal tahap 1 adalah 30 Juni 2026. Segera unduh panduan terbaru.</p>
        <div style="margin-top: auto; padding-top: 20px; border-top: 1px solid rgba(0,0,0,0.05); display: flex; justify-content: space-between; align-items: center;">
          <span style="font-size: 0.8rem; color: var(--color-muted);">10 Juni 2026</span>
          <a href="#" class="text-red" style="font-weight: 700; font-size: 0.85rem; text-decoration: none;">Unduh PDF →</a>
        </div>
      </div>

      <!-- News Card 1 -->
      <div class="glass glass-card fade-up" style="padding:0; overflow:hidden;">
        <img src="https://umiba.ac.id/wp-content/uploads/2025/08/umiba-upacara.jpg" style="width:100%; height:180px; object-fit:cover;" alt="Berita">
        <div style="padding:24px;">
          <span style="font-size: 0.8rem; font-weight: 700; color: var(--umiba-red); text-transform: uppercase;">Berita Riset</span>
          <h3 style="font-size: 1.15rem; margin-top: 12px;">LPPM UMIBA Gelar Sosialisasi Mitigasi Bencana di Pasar Minggu</h3>
          <p style="font-size: 0.9rem;">Implementasi teknologi sensor dini berbasis IoT untuk masyarakat bantaran sungai.</p>
        </div>
      </div>

      <!-- News Card 2 -->
      <div class="glass glass-card fade-up" style="padding:0; overflow:hidden;">
        <img src="https://umiba.ac.id/wp-content/uploads/2025/12/umiba-4pilar-1536x938-1.jpeg" style="width:100%; height:180px; object-fit:cover;" alt="Berita">
        <div style="padding:24px;">
          <span style="font-size: 0.8rem; font-weight: 700; color: var(--umiba-red); text-transform: uppercase;">Kerjasama</span>
          <h3 style="font-size: 1.15rem; margin-top: 12px;">MoU LPPM UMIBA & Dinas Koperasi Jakarta Selatan</h3>
          <p style="font-size: 0.9rem;">Kolaborasi strategis untuk pendampingan legalitas dan sertifikasi halal UMKM binaan.</p>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ░░░ QUICK LINKS CTA ░░░ -->
<section style="padding: var(--space-8) 0;">
  <div class="container">
    <div class="glass glass-card fade-up" style="background: linear-gradient(135deg, rgba(185, 28, 28, 0.05), rgba(185, 28, 28, 0.02)); padding: 60px; text-align: center; border: 1px solid rgba(185, 28, 28, 0.1);">
      <h2 style="font-size: 2.5rem; margin-bottom: 16px;">Siap Berinovasi Bersama Kami?</h2>
      <p style="max-width: 600px; margin: 0 auto 32px;">Akses seluruh layanan LPPM mulai dari pendaftaran HKI, pengajuan proposal, hingga publikasi jurnal dalam satu pintu.</p>
      <div class="flex-center" style="gap: 16px; flex-wrap: wrap;">
        <a href="https://ejurnal.umiba.ac.id/" target="_blank" class="btn btn-primary" style="padding: 16px 32px;">Portal E-Jurnal</a>
        <a href="https://lppm.umiba.ac.id/" target="_blank" class="btn btn-glass" style="padding: 16px 32px;">Panduan Peneliti</a>
      </div>
    </div>
  </div>
</section>` }} />
  );
}
