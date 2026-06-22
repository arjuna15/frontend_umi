'use client';
import { useLanguage } from '../../context/Providers';

export default function Page() {
  const { lang, t } = useLanguage();
    
  
  const heroBg = 'https://umiba.ac.id/wp-content/uploads/2024/05/bannerUMIBA26_2.png';
  const heroTitle = (lang === "en" ? "UMIBA LPPM" : 'LPPM UMIBA');
  const mainHtml = `<!-- ░░░ HERO SUBPAGE ░░░ -->


<!-- ░░░ NAVIGATION TABS ░░░ -->
<div style="position: sticky; top: 100px; z-index: 900; margin-top: 24px; margin-bottom: 24px;">
  <div class="container">
    <div class="glass" style="padding: 12px; border-radius: var(--radius-full); display: flex; justify-content: center; gap: 8px; flex-wrap: wrap;">
      <a href="#tentang" class="btn btn-glass" style="padding: 10px 20px; font-size: 0.9rem;">${lang === "en" ? "About" : "Tentang"}</a>
      <a href="#penelitian" class="btn btn-glass" style="padding: 10px 20px; font-size: 0.9rem;">${lang === "en" ? "Research" : "Penelitian"}</a>
      <a href="#pengabdian" class="btn btn-glass" style="padding: 10px 20px; font-size: 0.9rem;">${lang === "en" ? "Community Service" : "Pengabdian"}</a>
      <a href="#berita" class="btn btn-glass" style="padding: 10px 20px; font-size: 0.9rem;">${lang === "en" ? "News & Info" : "Berita & Info"}</a>
    </div>
  </div>
</div>

<!-- ░░░ TENTANG SECTION ░░░ -->
<section id="tentang" style="padding: var(--space-8) 0;">
  <div class="container">
    <div class="grid grid-2" style="align-items: center;">
      <div class="fade-up">
        <span class="text-red" style="font-weight: 700; text-transform: uppercase; font-size: 0.9rem;">${lang === "en" ? "Institution Profile" : "Profil Lembaga"}</span>
        <h2 style="margin-top: 12px;">${lang === "en" ? "Building an Impactful Research Culture" : "Membangun Budaya Riset yang Berdampak"}</h2>
        <p>${lang === "en" ? "LPPM UMIBA is the heart of academic activities that connect scientific theory with practical implementation in society. We are committed to enhancing the university's reputation through international publications and the downstreaming of research products." : "LPPM UMIBA merupakan jantung dari kegiatan akademik yang menghubungkan teori ilmiah dengan implementasi praktis di masyarakat. Kami berkomitmen untuk meningkatkan reputasi universitas melalui publikasi internasional dan hilirisasi produk penelitian."}</p>
        
        <div class="grid grid-2" style="margin-top: 32px; gap: 20px;">
          <div class="glass glass-card" style="padding: 24px;">
            <i class="ph-duotone ph-eye" style="font-size: 2.5rem; color: var(--umiba-red); margin-bottom: 16px;"></i>
            <h3 style="font-size: 1.25rem;">${lang === "en" ? "Vision" : "Visi"}</h3>
            <p style="font-size: 0.9rem; margin: 0;">${lang === "en" ? "To become a center of excellence in the development of science and technology based on local wisdom recognized nationally." : "Menjadi lembaga unggulan dalam pengembangan IPTEK berbasis kearifan lokal yang diakui secara nasional."}</p>
          </div>
          <div class="glass glass-card" style="padding: 24px;">
            <i class="ph-duotone ph-target" style="font-size: 2.5rem; color: var(--umiba-red); margin-bottom: 16px;"></i>
            <h3 style="font-size: 1.25rem;">${lang === "en" ? "Mission" : "Misi"}</h3>
            <p style="font-size: 0.9rem; margin: 0;">${lang === "en" ? "Facilitating innovative research and community service programs that provide solutions to the nation's problems." : "Memfasilitasi riset inovatif dan program pengabdian yang solutif bagi permasalahan bangsa."}</p>
          </div>
        </div>
      </div>
      <div class="glass glass-card fade-up" style="padding: 0; overflow: hidden;">
        <img src="https://umiba.ac.id/wp-content/uploads/2026/05/rektor-UMIBA-2026.jpeg" alt="Struktur LPPM" style="width: 100%; height: 500px; object-fit: cover;">
        <div class="glass" style="position: absolute; bottom: 20px; left: 20px; right: 20px; padding: 20px;">
          <h4 style="margin:0;">${lang === "en" ? "Head of LPPM UMIBA" : "Kepala LPPM UMIBA"}</h4>
          <p style="margin:0; font-size: 0.85rem;">${lang === "en" ? "Coordinating excellent research of lecturers & students." : "Mengoordinasikan riset unggulan dosen & mahasiswa."}</p>
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
      <h2 style="margin-top: 12px;">${lang === "en" ? "Research Programs" : "Program Penelitian"}</h2>
      <p>${lang === "en" ? "We provide various funding schemes and support for researchers to explore the boundaries of new knowledge." : "Kami menyediakan berbagai skema pendanaan dan dukungan bagi peneliti untuk mengeksplorasi batas-batas pengetahuan baru."}</p>
    </div>

    <div class="grid grid-3">
      <div class="glass glass-card fade-up">
        <div style="background: rgba(185, 28, 28, 0.1); width: 60px; height: 60px; border-radius: 16px; display: flex; align-items: center; justify-content: center; margin-bottom: 24px;">
          <i class="ph-duotone ph-currency-circle-dollar" style="font-size: 2rem; color: var(--umiba-red);"></i>
        </div>
        <h3>${lang === "en" ? "Internal Grants" : "Hibah Internal"}</h3>
        <p style="font-size: 0.95rem;">${lang === "en" ? "Annual funding for permanent lecturers of UMIBA to increase the productivity of SINTA publications." : "Pendanaan tahunan untuk dosen tetap UMIBA guna meningkatkan produktivitas publikasi SINTA."}</p>
        <a href="#" class="btn btn-glass" style="margin-top: auto; font-size: 0.85rem;">${lang === "en" ? "Download Guidelines" : "Download Panduan"}</a>
      </div>
      <div class="glass glass-card fade-up" style="transition-delay: 0.1s;">
        <div style="background: rgba(185, 28, 28, 0.1); width: 60px; height: 60px; border-radius: 16px; display: flex; align-items: center; justify-content: center; margin-bottom: 24px;">
          <i class="ph-duotone ph-globe" style="font-size: 2rem; color: var(--umiba-red);"></i>
        </div>
        <h3>${lang === "en" ? "Competitive Grants" : "Hibah Kompetitif"}</h3>
        <p style="font-size: 0.95rem;">${lang === "en" ? "Support for submitting Kemendikbudristek grant proposals and international external funding." : "Dukungan pengajuan proposal hibah Kemendikbudristek dan pendanaan eksternal internasional."}</p>
        <a href="#" class="btn btn-glass" style="margin-top: auto; font-size: 0.85rem;">${lang === "en" ? "View Schemes" : "Lihat Skema"}</a>
      </div>
      <div class="glass glass-card fade-up" style="transition-delay: 0.2s;">
        <div style="background: rgba(185, 28, 28, 0.1); width: 60px; height: 60px; border-radius: 16px; display: flex; align-items: center; justify-content: center; margin-bottom: 24px;">
          <i class="ph-duotone ph-student" style="font-size: 2rem; color: var(--umiba-red);"></i>
        </div>
        <h3>${lang === "en" ? "Student Research" : "Riset Mahasiswa"}</h3>
        <p style="font-size: 0.95rem;">${lang === "en" ? "Lecturer-student research collaboration program for final projects and PKM competitions." : "Program kolaborasi riset dosen-mahasiswa untuk tugas akhir dan kompetisi PKM."}</p>
        <a href="#" class="btn btn-glass" style="margin-top: auto; font-size: 0.85rem;">${lang === "en" ? "Register Program" : "Daftar Program"}</a>
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
        <h2 style="margin-top: 12px;">${lang === "en" ? "Community Service" : "Pengabdian Masyarakat"}</h2>
        <p>${lang === "en" ? "Bringing innovative solutions from the classroom directly to the community for real and sustainable change." : "Membawa solusi inovatif dari ruang kelas langsung ke tengah masyarakat untuk perubahan yang nyata dan berkelanjutan."}</p>
        
        <ul style="list-style: none; padding: 0; margin: 32px 0;">
          <li style="display: flex; gap: 16px; margin-bottom: 24px;">
            <div style="color: var(--umiba-red); font-size: 1.5rem;"><i class="ph-fill ph-check-circle"></i></div>
            <div>
              <h4 style="margin:0;">${lang === "en" ? "MSME Empowerment" : "Pemberdayaan UMKM"}</h4>
              <p style="margin:0; font-size: 0.9rem;">${lang === "en" ? "Marketing digitalization and financial management for local entrepreneurs." : "Digitalisasi pemasaran dan pengelolaan keuangan untuk pengusaha lokal."}</p>
            </div>
          </li>
          <li style="display: flex; gap: 16px; margin-bottom: 24px;">
            <div style="color: var(--umiba-red); font-size: 1.5rem;"><i class="ph-fill ph-check-circle"></i></div>
            <div>
              <h4 style="margin:0;">${lang === "en" ? "Fostered Villages" : "Desa Binaan"}</h4>
              <p style="margin:0; font-size: 0.9rem;">${lang === "en" ? "Development of village economic potential through appropriate technological innovations." : "Pengembangan potensi ekonomi desa melalui inovasi teknologi tepat guna."}</p>
            </div>
          </li>
          <li style="display: flex; gap: 16px;">
            <div style="color: var(--umiba-red); font-size: 1.5rem;"><i class="ph-fill ph-check-circle"></i></div>
            <div>
              <h4 style="margin:0;">${lang === "en" ? "Community Education" : "Edukasi Masyarakat"}</h4>
              <p style="margin:0; font-size: 0.9rem;">${lang === "en" ? "Legal counseling, digital health, and information technology literacy." : "Penyuluhan hukum, kesehatan digital, dan literasi teknologi informasi."}</p>
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
<section id="berita" style="padding: var(--space-8) 0; background: var(--umiba-red-alpha);">
  <div class="container">
    <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 48px;" class="fade-up">
      <div>
        <span class="text-red" style="font-weight: 700; text-transform: uppercase;">Update LPPM</span>
        <h2 style="margin: 8px 0 0;">${lang === "en" ? "News & Announcements" : "Berita & Pengumuman"}</h2>
      </div>
      <a href="https://lppm.umiba.ac.id/" target="_blank" class="btn btn-primary">${lang === "en" ? "View Original LPPM Web" : "Lihat Web LPPM Original"}</a>
    </div>

    <div class="grid grid-3">
      <!-- Announcement Card -->
      <div class="glass glass-card fade-up" style="border-top: 4px solid var(--umiba-red);">
        <span style="font-size: 0.8rem; font-weight: 700; color: var(--umiba-red); text-transform: uppercase;">${lang === "en" ? "Announcement" : "Pengumuman"}</span>
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
          <span style="font-size: 0.8rem; font-weight: 700; color: var(--umiba-red); text-transform: uppercase;">${lang === "en" ? "Research News" : "Berita Riset"}</span>
          <h3 style="font-size: 1.15rem; margin-top: 12px;">LPPM UMIBA Gelar Sosialisasi Mitigasi Bencana di Pasar Minggu</h3>
          <p style="font-size: 0.9rem;">Implementasi teknologi sensor dini berbasis IoT untuk masyarakat bantaran sungai.</p>
        </div>
      </div>

      <!-- News Card 2 -->
      <div class="glass glass-card fade-up" style="padding:0; overflow:hidden;">
        <img src="https://umiba.ac.id/wp-content/uploads/2025/12/umiba-4pilar-1536x938-1.jpeg" style="width:100%; height:180px; object-fit:cover;" alt="Berita">
        <div style="padding:24px;">
          <span style="font-size: 0.8rem; font-weight: 700; color: var(--umiba-red); text-transform: uppercase;">${lang === "en" ? "Partnership" : "Kerjasama"}</span>
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
      <h2 style="font-size: 2.5rem; margin-bottom: 16px;">${lang === "en" ? "Ready to Innovate with Us?" : "Siap Berinovasi Bersama Kami?"}</h2>
      <p style="max-width: 600px; margin: 0 auto 32px;">${lang === "en" ? "Access all LPPM services from IPR registration, proposal submission, to journal publication in one portal." : "Akses seluruh layanan LPPM mulai dari pendaftaran HKI, pengajuan proposal, hingga publikasi jurnal dalam satu pintu."}</p>
      <div class="flex-center" style="gap: 16px; flex-wrap: wrap;">
        <a href="https://ejurnal.umiba.ac.id/" target="_blank" class="btn btn-primary" style="padding: 16px 32px;">${lang === "en" ? "E-Journal Portal" : "Portal E-Jurnal"}</a>
        <a href="https://lppm.umiba.ac.id/" target="_blank" class="btn btn-glass" style="padding: 16px 32px;">${lang === "en" ? "Researcher Guidelines" : "Panduan Peneliti"}</a>
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
