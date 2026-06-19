export default function Page() {
  return (
    <div dangerouslySetInnerHTML={{ __html: `<!-- ░░░ HERO SUBPAGE ░░░ -->
<section class="hero hero-sub" style="background: url('https://umiba.ac.id/wp-content/uploads/2024/05/bannerUMIBA26_2.png') center/cover; position: relative; display: flex; align-items: center; justify-content: center; text-align: center; color: white; overflow: hidden; border-bottom: 1px solid rgba(255,255,255,0.05);">
  <div style="position: absolute; inset: -20px; background: linear-gradient(to bottom, rgba(15, 23, 42, 0.7), rgba(15, 23, 42, 0.9)); backdrop-filter: blur(12px) saturate(150%); -webkit-backdrop-filter: blur(12px) saturate(150%); z-index: 1;"></div>
  <div class="container" style="position: relative; z-index: 2;">
    <div class="fade-up">
      <span style="background: var(--umiba-red); color: white; padding: 6px 16px; border-radius: var(--radius-full); font-size: 0.85rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 24px; display: inline-block;">FAKULTAS MANAJEMEN & BISNIS</span>
      <h1 style="color: white; margin-bottom: 16px;">S2 Magister Manajemen</h1>
      <p style="font-size: 1.25rem; max-width: 700px; margin: 0 auto; opacity: 0.9; color: white;">Program pascasarjana untuk mendalami strategi kepemimpinan dan manajemen korporasi tingkat lanjut.</p>
    </div>
  </div>
</section>

<!-- ░░░ TABS ░░░ -->
<div style="position: sticky; top: 100px; z-index: 900; margin-top: 24px; margin-bottom: 24px;">
  <div class="container">
    <div class="glass" style="padding: 12px; border-radius: var(--radius-full); display: flex; justify-content: center; gap: 8px; flex-wrap: wrap;">
      <a href="#sambutan" class="btn btn-glass" style="padding: 10px 20px; font-size: 0.9rem;">Sambutan Kaprodi</a>
      <a href="#visimisi" class="btn btn-glass" style="padding: 10px 20px; font-size: 0.9rem;">Visi & Misi</a>
      <a href="#profil" class="btn btn-glass" style="padding: 10px 20px; font-size: 0.9rem;">Profil & Karir</a>
      <a href="#dokumen" class="btn btn-glass" style="padding: 10px 20px; font-size: 0.9rem;">Kurikulum & SK</a>
    </div>
  </div>
</div>

<!-- ░░░ SAMBUTAN KAPRODI ░░░ -->
<section id="sambutan" style="padding: var(--space-8) 0;">
  <div class="container">
    <div class="grid grid-2" style="align-items: center; gap: 60px;">
      <div class="fade-up">
        <span class="text-red" style="font-weight: 700; text-transform: uppercase; font-size: 0.9rem;">Greetings</span>
        <h2 style="margin-top: 12px;">Sambutan Ketua Program Studi</h2>
        <p style="font-style: italic; font-size: 1.1rem; line-height: 1.8; color: var(--color-text); margin: 24px 0;">"Membangun kepemimpinan strategis adalah kunci kesuksesan organisasi. Program Magister kami dirancang untuk mengasah visi manajerial Anda di level tertinggi."</p>
        <div style="display: flex; flex-direction: column; gap: 4px;">
          <h4 style="margin: 0; color: var(--umiba-red);">Dr. Nurmansyah, MMSI</h4>
          <p style="margin: 0; font-size: 0.9rem; font-weight: 600;">Ketua Program Pascasarjana Manajemen</p>
        </div>
        <div style="margin-top: 32px;">
          <a href="https://pddikti.kemdikbud.go.id/" target="_blank" class="btn btn-glass"><i class="ph-bold ph-users-three"></i> Lihat Daftar Lengkap Dosen (PDDikti)</a>
        </div>
      </div>
      <div class="fade-up" style="position: relative;">
        <div class="glass" style="padding: 15px; border-radius: var(--radius-lg); transform: rotate(2deg);">
          <img src="https://umiba.ac.id/wp-content/uploads/2024/06/WhatsApp-Image-2024-05-30-at-120111-239x300.jpeg" alt="Dr. Nurmansyah, MMSI" style="width: 100%; border-radius: var(--radius-md); box-shadow: 0 15px 30px rgba(0,0,0,0.1); background: #eee;">
        </div>
        <div style="position: absolute; -z-index: 1; top: -20px; right: -20px; width: 100px; height: 100px; background: var(--umiba-red-alpha); border-radius: 50%; filter: blur(30px);"></div>
      </div>
    </div>
  </div>
</section>

<!-- ░░░ VISI & MISI ░░░ -->
<section id="visimisi" style="padding: var(--space-8) 0;">
  <div class="container grid grid-2" style="align-items: start; gap: 40px;">
    <div class="glass glass-card fade-up">
      <span class="text-red" style="font-weight: 600; text-transform: uppercase;">Arah Gerak Prodi</span>
      <h2>Visi S2 Magister Manajemen</h2>
      <p style="font-size: 1.1rem; line-height: 1.8; font-weight: 600; color: var(--color-text);">"Menjadi pusat pengembangan kepemimpinan bisnis tingkat tinggi dan riset strategis di Asia Tenggara pada tahun 2030."</p>
    </div>
    <div class="glass glass-card fade-up" style="transition-delay: 0.1s;">
      <h3 class="text-red">Misi S2 Magister Manajemen</h3>
      <ul style="padding-left: var(--space-4);">
        <li style="margin-bottom: 8px;">Mengembangkan kompetensi kepemimpinan strategis bagi para profesional.</li>
        <li style="margin-bottom: 8px;">Mendorong riset bisnis berdampak global yang aplikatif bagi industri.</li>
        <li style="margin-bottom: 8px;">Membangun jejaring profesional (networking) yang solid antar mahasiswa dan alumni.</li>
        <li style="margin-bottom: 8px;">Mengintegrasikan prinsip tata kelola perusahaan yang baik (Good Corporate Governance).</li>
      </ul>
    </div>
  </div>
</section>

<!-- ░░░ PROFIL LULUSAN & PEMINATAN ░░░ -->
<section id="profil" style="padding: var(--space-8) 0; background: rgba(185, 28, 28, 0.03);">
  <div class="container grid grid-2" style="gap: 40px;">
    
    <!-- Peminatan -->
    <div class="fade-up">
      <span class="text-red" style="font-weight: 600; text-transform: uppercase;">Fokus Keilmuan</span>
      <h2>Peminatan / Konsentrasi</h2>
      <p>Mahasiswa dapat memilih peminatan khusus di semester atas untuk memfokuskan kompetensi dan karir profesional mereka.</p>
      <div class="grid grid-2" style="gap: 16px; margin-top: 24px;">
        <div class="glass glass-card" style="padding: 16px; text-align: center;">
          <h4 style="margin: 0; color: var(--umiba-red); font-size: 1rem;">Strategic Management</h4>
        </div>
        <div class="glass glass-card" style="padding: 16px; text-align: center;">
          <h4 style="margin: 0; color: var(--umiba-red); font-size: 1rem;">Corporate Finance</h4>
        </div>
        <div class="glass glass-card" style="padding: 16px; text-align: center;">
          <h4 style="margin: 0; color: var(--umiba-red); font-size: 1rem;">Human Capital Development</h4>
        </div>
        <div class="glass glass-card" style="padding: 16px; text-align: center;">
          <h4 style="margin: 0; color: var(--umiba-red); font-size: 1rem;">Global Marketing</h4>
        </div>
      </div>
    </div>

    <!-- Profil Lulusan -->
    <div class="glass glass-card fade-up" style="transition-delay: 0.1s;">
      <h3 class="text-red">Prospek Karir & Profil Lulusan</h3>
      <p>Lulusan program studi ini dipersiapkan untuk menempati berbagai posisi strategis di industri, pemerintahan, dan korporasi:</p>
      <ul style="list-style: none; padding: 0; margin-top: 24px;">
        <li style="margin-bottom: 16px; display: flex; align-items: center; gap: 12px;">
          <div style="color: var(--umiba-red);"><i class="ph-fill ph-check-circle"></i></div>
          <strong>C-Level Executive (CEO, CFO, CMO)</strong>
        </li>
        <li style="margin-bottom: 16px; display: flex; align-items: center; gap: 12px;">
          <div style="color: var(--umiba-red);"><i class="ph-fill ph-check-circle"></i></div>
          <strong>Senior Business Consultant</strong>
        </li>
        <li style="margin-bottom: 16px; display: flex; align-items: center; gap: 12px;">
          <div style="color: var(--umiba-red);"><i class="ph-fill ph-check-circle"></i></div>
          <strong>Corporate Strategist</strong>
        </li>
        <li style="margin-bottom: 16px; display: flex; align-items: center; gap: 12px;">
          <div style="color: var(--umiba-red);"><i class="ph-fill ph-check-circle"></i></div>
          <strong>Academic Researcher / Dosen Ahli</strong>
        </li>
        <li style="margin-bottom: 16px; display: flex; align-items: center; gap: 12px;">
          <div style="color: var(--umiba-red);"><i class="ph-fill ph-check-circle"></i></div>
          <strong>Entrepreneur Skala Besar</strong>
        </li>
      </ul>
    </div>
  </div>
</section>

<!-- ░░░ DOKUMEN ░░░ -->
<section id="dokumen" style="padding: var(--space-8) 0;">
  <div class="container">
    <div class="fade-up" style="text-align: center; margin-bottom: 48px;">
      <span class="text-red" style="font-weight: 600; text-transform: uppercase;">Unduhan Resmi</span>
      <h2>Dokumen {data['title']}</h2>
    </div>
    <div class="grid grid-3" style="gap: 24px;">
      
      <!-- Kurikulum -->
      <div class="glass glass-card fade-up" style="display: flex; flex-direction: column; text-align: center;">
        <i class="ph-duotone ph-book-open" style="font-size: 3rem; color: var(--umiba-red); margin-bottom: 16px;"></i>
        <h4 style="margin-bottom: 8px;">Buku Kurikulum</h4>
        <p style="font-size: 0.85rem; margin-bottom: 24px;">Pedoman sebaran mata kuliah (SKS) dari semester 1 hingga akhir kelulusan.</p>
        <a href="#" class="btn btn-glass" style="margin-top: auto; width: 100%;"><i class="ph-bold ph-download-simple"></i> Unduh PDF</a>
      </div>

      <!-- SK Pendirian -->
      <div class="glass glass-card fade-up" style="transition-delay: 0.1s; display: flex; flex-direction: column; text-align: center;">
        <i class="ph-duotone ph-certificate" style="font-size: 3rem; color: var(--umiba-red); margin-bottom: 16px;"></i>
        <h4 style="margin-bottom: 8px;">SK Pendirian Prodi</h4>
        <p style="font-size: 0.85rem; margin-bottom: 24px;">Legalitas resmi pembukaan program studi dari Kemendikbudristek RI.</p>
        <a href="#" class="btn btn-glass" style="margin-top: auto; width: 100%;"><i class="ph-bold ph-download-simple"></i> Unduh SK</a>
      </div>

      <!-- Akreditasi -->
      <div class="glass glass-card fade-up" style="transition-delay: 0.2s; display: flex; flex-direction: column; text-align: center;">
        <i class="ph-duotone ph-medal" style="font-size: 3rem; color: var(--umiba-red); margin-bottom: 16px;"></i>
        <h4 style="margin-bottom: 8px;">Sertifikat Akreditasi</h4>
        <p style="font-size: 0.85rem; margin-bottom: 24px;">Sertifikat Akreditasi resmi dari BAN-PT / LAM untuk program studi ini.</p>
        <a href="#" class="btn btn-glass" style="margin-top: auto; width: 100%;"><i class="ph-bold ph-download-simple"></i> Unduh Sertifikat</a>
      </div>

    </div>
  </div>
</section>` }} />
  );
}
