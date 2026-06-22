'use client';
import { useLanguage } from '../../context/Providers';

export default function Page() {
  const { lang, t } = useLanguage();
    
  
  const heroBg = '/3.jpeg';
  const heroTitle = (lang === "en" ? "Profile" : 'PROFIL UMIBA');
  const mainHtml = `<!-- ░░░ HERO SUBPAGE ░░░ -->


<!-- ░░░ NAVIGATION TABS ░░░ -->
<div style="position: sticky; top: 100px; z-index: 900; margin-top: 24px; margin-bottom: 24px;">
  <div class="container">
    <div class="glass" style="padding: 12px; border-radius: var(--radius-full); display: flex; justify-content: center; gap: 8px; flex-wrap: wrap;">
      <a href="#sejarah" class="btn btn-glass" style="padding: 10px 20px; font-size: 0.9rem;">${lang === "en" ? "History" : "Sejarah"}</a>
      <a href="#visi-misi" class="btn btn-glass" style="padding: 10px 20px; font-size: 0.9rem;">${lang === "en" ? "Vision & Mission" : "Visi & Misi"}</a>
      <a href="#tujuan" class="btn btn-glass" style="padding: 10px 20px; font-size: 0.9rem;">${lang === "en" ? "Goals" : "Tujuan"}</a>
      <a href="#sasaran" class="btn btn-glass" style="padding: 10px 20px; font-size: 0.9rem;">${lang === "en" ? "Strategy" : "Sasaran & Strategi"}</a>
      <a href="#struktur" class="btn btn-glass" style="padding: 10px 20px; font-size: 0.9rem;">${lang === "en" ? "Org Structure" : "Struktur Organisasi"}</a>
    </div>
  </div>
</div>

<!-- ░░░ SEJARAH ░░░ -->
<section id="sejarah" style="padding: var(--space-8) 0;">
  <div class="container">
    <div class="glass glass-card fade-up">
      <span class="text-red" style="font-weight: 600; text-transform: uppercase;">${lang === "en" ? "Our Journey" : "Perjalanan Kami"}</span>
      <h2>${lang === "en" ? "History of UMIBA" : "Sejarah UMIBA"}</h2>
      <p>${lang === "en" ? "Mitra Bangsa University (UMIBA) was founded with the spirit of providing high-quality education to the younger generation of Indonesia. Since its inception, UMIBA has continued to grow and transform into one of the leading universities in Jakarta focused on the development of science, technology, and student character." : "Universitas Mitra Bangsa (UMIBA) didirikan dengan semangat untuk memberikan pendidikan berkualitas tinggi kepada generasi muda Indonesia. Sejak awal berdirinya, UMIBA terus berkembang dan bertransformasi menjadi salah satu perguruan tinggi unggulan di Jakarta yang fokus pada pengembangan ilmu pengetahuan, teknologi, dan karakter mahasiswa."}</p>
      <p>${lang === "en" ? "With modern facilities and professional teaching staff, UMIBA is committed to producing graduates who are ready to compete in the global world." : "Dengan fasilitas modern dan tenaga pengajar profesional, UMIBA berkomitmen untuk menghasilkan lulusan yang siap bersaing di dunia global."}</p>
    </div>
  </div>
</section>

<!-- ░░░ VISI DAN MISI ░░░ -->
<section id="visi-misi" style="padding: var(--space-8) 0; background: var(--color-surface);">
  <div class="container grid grid-2">
    <div class="glass glass-card fade-up">
      <h2 class="text-red">${lang === "en" ? "Vision" : "Visi"}</h2>
      <p>${lang === "en" ? "To become a superior university, globally competitive, and character-driven in the development of science and technology by 2030." : "Menjadi Universitas yang unggul, berdaya saing global, dan berkarakter dalam pengembangan ilmu pengetahuan dan teknologi pada tahun 2030."}</p>
    </div>
    <div class="glass glass-card fade-up" style="transition-delay: 0.1s;">
      <h2 class="text-red">${lang === "en" ? "Mission" : "Misi"}</h2>
      <ul style="padding-left: var(--space-4);">
        <li style="margin-bottom: 8px;">${lang === "en" ? "Organizing high-quality higher education that is relevant to the needs of society and industry." : "Menyelenggarakan pendidikan tinggi yang bermutu dan relevan dengan kebutuhan masyarakat dan industri."}</li>
        <li style="margin-bottom: 8px;">${lang === "en" ? "Conducting innovative research that contributes to the development of science and technology." : "Melaksanakan penelitian inovatif yang berkontribusi pada perkembangan IPTEK."}</li>
        <li style="margin-bottom: 8px;">${lang === "en" ? "Carrying out community service to improve community welfare." : "Melakukan pengabdian kepada masyarakat untuk meningkatkan kesejahteraan."}</li>
        <li style="margin-bottom: 8px;">${lang === "en" ? "Building Good University Governance." : "Membangun tata kelola universitas yang baik (Good University Governance)."}</li>
      </ul>
    </div>
  </div>
</section>

<!-- ░░░ TUJUAN ░░░ -->
<section id="tujuan" style="padding: var(--space-8) 0;">
  <div class="container grid grid-2" style="align-items: center;">
    <div class="fade-up">
      <span class="text-red" style="font-weight: 600; text-transform: uppercase;">${lang === "en" ? "Academic Achievements" : "Capaian Akademik"}</span>
      <h2>${lang === "en" ? "University Goals" : "Tujuan Universitas"}</h2>
      <p>${lang === "en" ? "The goals of Mitra Bangsa University are formulated to produce superior and globally competitive graduates:" : "Tujuan Universitas Mitra Bangsa dirumuskan untuk menghasilkan lulusan yang unggul dan berdaya saing global:"}</p>
      <ul style="padding-left: var(--space-4); margin-top: var(--space-3);">
        <li style="margin-bottom: 8px;">${lang === "en" ? "Producing graduates with high academic and professional competence." : "Menghasilkan lulusan yang memiliki kompetensi akademik dan profesional yang tinggi."}</li>
        <li style="margin-bottom: 8px;">${lang === "en" ? "Producing graduates who are able to adapt quickly to technological changes and global industry demands." : "Menghasilkan lulusan yang mampu beradaptasi dengan cepat terhadap perubahan teknologi dan tuntutan industri global."}</li>
        <li style="margin-bottom: 8px;">${lang === "en" ? "Forming graduates with an entrepreneurial spirit and leadership with national character." : "Membentuk lulusan yang memiliki jiwa kewirausahaan (entrepreneurship) dan kepemimpinan yang berkarakter kebangsaan."}</li>
        <li style="margin-bottom: 8px;">${lang === "en" ? "Producing research and publications that are beneficial to society." : "Menghasilkan karya riset dan publikasi yang bermanfaat bagi masyarakat."}</li>
      </ul>
    </div>
    <div class="glass glass-card fade-up" style="transition-delay: 0.2s;" id="sasaran">
      <h3 class="text-red">Sasaran &amp; Strategi Pencapaian</h3>
      <p>${lang === "en" ? "To achieve these goals, UMIBA implements various measurable strategies:" : "Untuk mencapai tujuan tersebut, UMIBA menerapkan berbagai strategi yang terukur:"}</p>
      <ul style="padding-left: var(--space-4); margin-top: var(--space-3);">
        <li style="margin-bottom: 8px;">${lang === "en" ? "Periodic development and updating of the curriculum based on the Indonesian National Qualifications Framework (KKNI)." : "Pengembangan dan pemutakhiran kurikulum berbasis Kerangka Kualifikasi Nasional Indonesia (KKNI) secara berkala."}</li>
        <li style="margin-bottom: 8px;">${lang === "en" ? "Improving academic qualifications and competency certification for all teaching lecturers." : "Peningkatan kualifikasi akademik dan sertifikasi kompetensi seluruh dosen pengajar."}</li>
        <li style="margin-bottom: 8px;">${lang === "en" ? "Expanding institutional cooperation networks and partnerships with industry (DUDI)." : "Perluasan jaringan kerjasama institusional dan kemitraan dengan industri (DUDI)."}</li>
        <li style="margin-bottom: 8px;">${lang === "en" ? "Modernization of digital-based learning facilities and infrastructure to support hybrid lectures." : "Modernisasi sarana dan prasarana pembelajaran berbasis digital untuk mendukung perkuliahan hybrid."}</li>
      </ul>
    </div>
  </div>
</section>

<!-- ░░░ STRUKTUR ORGANISASI ░░░ -->
<section id="struktur" style="padding: var(--space-8) 0; background: var(--umiba-red-alpha);">
  <div class="container">
    <div class="fade-up" style="text-align: center; margin-bottom: 60px;">
      <span class="text-red" style="font-weight: 600; text-transform: uppercase;">${lang === "en" ? "Campus Management" : "Manajemen Kampus"}</span>
      <h2>Struktur Organisasi UMIBA</h2>
      <p style="max-width: 700px; margin: 0 auto;">${lang === "en" ? "Led by experienced academics and professionals to realize the vision of an excellent university." : "Dipimpin oleh jajaran akademisi dan profesional berpengalaman untuk mewujudkan visi universitas unggul."}</p>
    </div>

    <!-- Pimpinan Universitas -->
    <div class="fade-up" style="margin-bottom: 48px;">
      <h3 style="text-align: center; margin-bottom: 32px; color: var(--umiba-red);">${lang === "en" ? "University Leaders" : "Pimpinan Universitas"}</h3>
      <div class="grid grid-2" style="gap: 24px; max-width: 1000px; margin: 0 auto; align-items: stretch;">
        <!-- Rektor -->
        <div class="glass glass-card" style="text-align: center; border-top: 4px solid var(--umiba-red); display: flex; flex-direction: column; justify-content: center; padding: 24px;">
          <h4 style="font-size: 1.2rem; margin-bottom: 4px;">Sri Wahyuningsih, SE., MM</h4>
          <p style="font-weight: 700; text-transform: uppercase; font-size: 0.8rem; color: var(--color-muted); margin: 0;">${lang === "en" ? "Rector" : "Rektor"}</p>
        </div>
        <!-- WR 1 -->
        <div class="glass glass-card" style="text-align: center; display: flex; flex-direction: column; justify-content: center; padding: 24px;">
          <h4 style="font-size: 1.1rem; margin-bottom: 4px;">Indi Nervilia, BIBM, MBA</h4>
          <p style="font-weight: 700; text-transform: uppercase; font-size: 0.8rem; color: var(--umiba-red); margin: 0;">${lang === "en" ? "Vice Rector I (Academics)" : "Wakil Rektor I (Akademik)"}</p>
        </div>
        <!-- WR 2 -->
        <div class="glass glass-card" style="text-align: center; display: flex; flex-direction: column; justify-content: center; padding: 24px;">
          <h4 style="font-size: 1.1rem; margin-bottom: 4px;">Hadi Mulyo Wibowo, SH, MM</h4>
          <p style="font-weight: 700; text-transform: uppercase; font-size: 0.8rem; color: var(--umiba-red); margin: 0;">${lang === "en" ? "Vice Rector II (Finance & HR)" : "Wakil Rektor II (Keuangan & SDM)"}</p>
        </div>
        <!-- WR 3 -->
        <div class="glass glass-card" style="text-align: center; display: flex; flex-direction: column; justify-content: center; padding: 24px;">
          <h4 style="font-size: 1.1rem; margin-bottom: 4px;">Dr. Drs. Yuni Pratikno, SE, MM, MH</h4>
          <p style="font-weight: 700; text-transform: uppercase; font-size: 0.8rem; color: var(--umiba-red); margin: 0;">${lang === "en" ? "Vice Rector III (Student Affairs & Partnerships)" : "Wakil Rektor III (Kemahasiswaan & Kerjasama)"}</p>
        </div>
      </div>
    </div>

    <!-- Dekan & Lembaga -->
    <div class="grid grid-2 fade-up" style="gap: 40px; margin-top: 60px;">
      <div>
        <h3 style="margin-bottom: 24px; font-size: 1.4rem;"><i class="ph-bold ph-graduation-cap"></i> Jajaran Dekanat</h3>
        <ul style="list-style: none; padding: 0;">
          <li class="glass glass-card" style="margin-bottom: 12px; padding: 16px;">
            <strong>Prof. Dr. Harries Madiistriyatno, S. Hum, M.Si</strong>
            <p style="margin: 0; font-size: 0.85rem; color: var(--umiba-red);">${lang === "en" ? "Dean of Management & Business" : "Dekan Fak. Manajemen dan Bisnis"}</p>
          </li>
          <li class="glass glass-card" style="margin-bottom: 12px; padding: 16px;">
            <strong>Drs. Nurmansyah, MMSI</strong>
            <p style="margin: 0; font-size: 0.85rem; color: var(--umiba-red);">${lang === "en" ? "Dean of IT & Actuarial" : "Dekan Fak. Teknologi Informasi & Aktuaria"}</p>
          </li>
          <li class="glass glass-card" style="padding: 16px;">
            <strong>Kamilov Sagala, S.H., M.H</strong>
            <p style="margin: 0; font-size: 0.85rem; color: var(--umiba-red);">${lang === "en" ? "Dean of Law" : "Dekan Fakultas Hukum"}</p>
          </li>
        </ul>
      </div>
      <div>
        <h3 style="margin-bottom: 24px; font-size: 1.4rem;"><i class="ph-bold ph-briefcase"></i> Kepala Lembaga</h3>
        <ul style="list-style: none; padding: 0;">
          <li class="glass glass-card" style="margin-bottom: 12px; padding: 16px;">
            <strong>Ir. Aswin Naldi Sahim, MM, Ph.D</strong>
            <p style="margin: 0; font-size: 0.85rem; color: var(--umiba-red);">${lang === "en" ? "Head of LPMI (Quality Assurance)" : "Kepala LPMI (Penjaminan Mutu)"}</p>
          </li>
          <li class="glass glass-card" style="padding: 16px;">
            <strong>Dr. Nurwulan Kusuma Devi, MM</strong>
            <p style="margin: 0; font-size: 0.85rem; color: var(--umiba-red);">${lang === "en" ? "Head of LPPM (Research & Community Service)" : "Kepala LPPM (Riset & Pengabdian)"}</p>
          </li>
        </ul>
        <div style="margin-top: 32px; text-align: right;">
          <a href="#" class="btn btn-primary">${lang === "en" ? "View Full Chart (PDF)" : "Lihat Bagan Lengkap (PDF)"}</a>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ░░░ FASILITAS ░░░ -->
<section id="fasilitas" style="padding: var(--space-8) 0; background: var(--color-surface);">
  <div class="container">
    <div style="text-align: center; margin-bottom: var(--space-6);" class="fade-up">
      <span class="text-red" style="font-weight: 600; text-transform: uppercase;">${lang === "en" ? "Campus Environment" : "Lingkungan Kampus"}</span>
      <h2>${lang === "en" ? "UMIBA Facilities" : "Fasilitas UMIBA"}</h2>
    </div>
    <div class="grid grid-3">
      <div class="glass glass-card fade-up">
        <h3>${lang === "en" ? "Modern Classrooms" : "Ruang Kelas Modern"}</h3>
        <p>${lang === "en" ? "Equipped with AC, LCD projectors, and high-speed Wi-Fi to support a comfortable teaching and learning process." : "Dilengkapi dengan AC, proyektor LCD, dan Wi-Fi berkecepatan tinggi untuk mendukung proses belajar mengajar yang nyaman."}</p>
      </div>
      <div class="glass glass-card fade-up" style="transition-delay: 0.1s;">
        <h3>Laboratorium</h3>
        <p>${lang === "en" ? "State-of-the-art computer labs for the IT Faculty and moot court practice facilities for the Law Faculty." : "Laboratorium komputer mutakhir untuk Fakultas TI dan fasilitas praktik peradilan semu untuk Fakultas Hukum."}</p>
      </div>
      <div class="glass glass-card fade-up" style="transition-delay: 0.2s;">
        <h3>${lang === "en" ? "Library & E-Library" : "Perpustakaan &amp; E-Library"}</h3>
        <p>${lang === "en" ? "Complete book collection, international journals, and a representative reading area." : "Koleksi buku lengkap, jurnal internasional, dan area baca yang representatif."}</p>
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
