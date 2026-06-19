'use client';
import { useState, useEffect } from 'react';

export default function Page() {
  const [contents, setContents] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://backend.bikinwebdikitaaja.com/api'}/contents`)
      .then(res => res.json())
      .then(data => {
        const contentMap = {};
        data.forEach(c => contentMap[c.key] = c.value);
        setContents(contentMap);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const heroBg = contents['profil_hero_bg'] || '${heroBg}';
  const heroTitle = contents['profil_hero_title'] || '${heroTitle}';
  const mainHtml = contents['profil_html'] || `<!-- ░░░ HERO SUBPAGE ░░░ -->


<!-- ░░░ NAVIGATION TABS ░░░ -->
<div style="position: sticky; top: 100px; z-index: 900; margin-top: 24px; margin-bottom: 24px;">
  <div class="container">
    <div class="glass" style="padding: 12px; border-radius: var(--radius-full); display: flex; justify-content: center; gap: 8px; flex-wrap: wrap;">
      <a href="#sejarah" class="btn btn-glass" style="padding: 10px 20px; font-size: 0.9rem;">Sejarah</a>
      <a href="#visi-misi" class="btn btn-glass" style="padding: 10px 20px; font-size: 0.9rem;">Visi & Misi</a>
      <a href="#tujuan" class="btn btn-glass" style="padding: 10px 20px; font-size: 0.9rem;">Tujuan</a>
      <a href="#sasaran" class="btn btn-glass" style="padding: 10px 20px; font-size: 0.9rem;">Sasaran & Strategi</a>
      <a href="#struktur" class="btn btn-glass" style="padding: 10px 20px; font-size: 0.9rem;">Struktur Organisasi</a>
    </div>
  </div>
</div>

<!-- ░░░ SEJARAH ░░░ -->
<section id="sejarah" style="padding: var(--space-8) 0;">
  <div class="container">
    <div class="glass glass-card fade-up">
      <span class="text-red" style="font-weight: 600; text-transform: uppercase;">Perjalanan Kami</span>
      <h2>Sejarah UMIBA</h2>
      <p>Universitas Mitra Bangsa (UMIBA) didirikan dengan semangat untuk memberikan pendidikan berkualitas tinggi kepada generasi muda Indonesia. Sejak awal berdirinya, UMIBA terus berkembang dan bertransformasi menjadi salah satu perguruan tinggi unggulan di Jakarta yang fokus pada pengembangan ilmu pengetahuan, teknologi, dan karakter mahasiswa.</p>
      <p>Dengan fasilitas modern dan tenaga pengajar profesional, UMIBA berkomitmen untuk menghasilkan lulusan yang siap bersaing di dunia global.</p>
    </div>
  </div>
</section>

<!-- ░░░ VISI DAN MISI ░░░ -->
<section id="visi-misi" style="padding: var(--space-8) 0; background: rgba(255, 255, 255, 0.4);">
  <div class="container grid grid-2">
    <div class="glass glass-card fade-up">
      <h2 class="text-red">Visi</h2>
      <p>Menjadi Universitas yang unggul, berdaya saing global, dan berkarakter dalam pengembangan ilmu pengetahuan dan teknologi pada tahun 2030.</p>
    </div>
    <div class="glass glass-card fade-up" style="transition-delay: 0.1s;">
      <h2 class="text-red">Misi</h2>
      <ul style="padding-left: var(--space-4);">
        <li style="margin-bottom: 8px;">Menyelenggarakan pendidikan tinggi yang bermutu dan relevan dengan kebutuhan masyarakat dan industri.</li>
        <li style="margin-bottom: 8px;">Melaksanakan penelitian inovatif yang berkontribusi pada perkembangan IPTEK.</li>
        <li style="margin-bottom: 8px;">Melakukan pengabdian kepada masyarakat untuk meningkatkan kesejahteraan.</li>
        <li style="margin-bottom: 8px;">Membangun tata kelola universitas yang baik (Good University Governance).</li>
      </ul>
    </div>
  </div>
</section>

<!-- ░░░ TUJUAN ░░░ -->
<section id="tujuan" style="padding: var(--space-8) 0;">
  <div class="container grid grid-2" style="align-items: center;">
    <div class="fade-up">
      <span class="text-red" style="font-weight: 600; text-transform: uppercase;">Capaian Akademik</span>
      <h2>Tujuan Universitas</h2>
      <p>Tujuan Universitas Mitra Bangsa dirumuskan untuk menghasilkan lulusan yang unggul dan berdaya saing global:</p>
      <ul style="padding-left: var(--space-4); margin-top: var(--space-3);">
        <li style="margin-bottom: 8px;">Menghasilkan lulusan yang memiliki kompetensi akademik dan profesional yang tinggi.</li>
        <li style="margin-bottom: 8px;">Menghasilkan lulusan yang mampu beradaptasi dengan cepat terhadap perubahan teknologi dan tuntutan industri global.</li>
        <li style="margin-bottom: 8px;">Membentuk lulusan yang memiliki jiwa kewirausahaan (entrepreneurship) dan kepemimpinan yang berkarakter kebangsaan.</li>
        <li style="margin-bottom: 8px;">Menghasilkan karya riset dan publikasi yang bermanfaat bagi masyarakat.</li>
      </ul>
    </div>
    <div class="glass glass-card fade-up" style="transition-delay: 0.2s;" id="sasaran">
      <h3 class="text-red">Sasaran &amp; Strategi Pencapaian</h3>
      <p>Untuk mencapai tujuan tersebut, UMIBA menerapkan berbagai strategi yang terukur:</p>
      <ul style="padding-left: var(--space-4); margin-top: var(--space-3);">
        <li style="margin-bottom: 8px;">Pengembangan dan pemutakhiran kurikulum berbasis Kerangka Kualifikasi Nasional Indonesia (KKNI) secara berkala.</li>
        <li style="margin-bottom: 8px;">Peningkatan kualifikasi akademik dan sertifikasi kompetensi seluruh dosen pengajar.</li>
        <li style="margin-bottom: 8px;">Perluasan jaringan kerjasama institusional dan kemitraan dengan industri (DUDI).</li>
        <li style="margin-bottom: 8px;">Modernisasi sarana dan prasarana pembelajaran berbasis digital untuk mendukung perkuliahan hybrid.</li>
      </ul>
    </div>
  </div>
</section>

<!-- ░░░ STRUKTUR ORGANISASI ░░░ -->
<section id="struktur" style="padding: var(--space-8) 0; background: rgba(185, 28, 28, 0.03);">
  <div class="container">
    <div class="fade-up" style="text-align: center; margin-bottom: 60px;">
      <span class="text-red" style="font-weight: 600; text-transform: uppercase;">Manajemen Kampus</span>
      <h2>Struktur Organisasi UMIBA</h2>
      <p style="max-width: 700px; margin: 0 auto;">Dipimpin oleh jajaran akademisi dan profesional berpengalaman untuk mewujudkan visi universitas unggul.</p>
    </div>

    <!-- Pimpinan Universitas -->
    <div class="fade-up" style="margin-bottom: 48px;">
      <h3 style="text-align: center; margin-bottom: 32px; color: var(--umiba-red);">Pimpinan Universitas</h3>
      <div class="grid grid-2" style="gap: 24px; max-width: 1000px; margin: 0 auto; align-items: stretch;">
        <!-- Rektor -->
        <div class="glass glass-card" style="text-align: center; border-top: 4px solid var(--umiba-red); display: flex; flex-direction: column; justify-content: center; padding: 24px;">
          <h4 style="font-size: 1.2rem; margin-bottom: 4px;">Sri Wahyuningsih, SE., MM</h4>
          <p style="font-weight: 700; text-transform: uppercase; font-size: 0.8rem; color: var(--color-muted); margin: 0;">Rektor</p>
        </div>
        <!-- WR 1 -->
        <div class="glass glass-card" style="text-align: center; display: flex; flex-direction: column; justify-content: center; padding: 24px;">
          <h4 style="font-size: 1.1rem; margin-bottom: 4px;">Indi Nervilia, BIBM, MBA</h4>
          <p style="font-weight: 700; text-transform: uppercase; font-size: 0.8rem; color: var(--umiba-red); margin: 0;">Wakil Rektor I (Akademik)</p>
        </div>
        <!-- WR 2 -->
        <div class="glass glass-card" style="text-align: center; display: flex; flex-direction: column; justify-content: center; padding: 24px;">
          <h4 style="font-size: 1.1rem; margin-bottom: 4px;">Hadi Mulyo Wibowo, SH, MM</h4>
          <p style="font-weight: 700; text-transform: uppercase; font-size: 0.8rem; color: var(--umiba-red); margin: 0;">Wakil Rektor II (Keuangan & SDM)</p>
        </div>
        <!-- WR 3 -->
        <div class="glass glass-card" style="text-align: center; display: flex; flex-direction: column; justify-content: center; padding: 24px;">
          <h4 style="font-size: 1.1rem; margin-bottom: 4px;">Dr. Drs. Yuni Pratikno, SE, MM, MH</h4>
          <p style="font-weight: 700; text-transform: uppercase; font-size: 0.8rem; color: var(--umiba-red); margin: 0;">Wakil Rektor III (Kemahasiswaan & Kerjasama)</p>
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
            <p style="margin: 0; font-size: 0.85rem; color: var(--umiba-red);">Dekan Fak. Manajemen dan Bisnis</p>
          </li>
          <li class="glass glass-card" style="margin-bottom: 12px; padding: 16px;">
            <strong>Drs. Nurmansyah, MMSI</strong>
            <p style="margin: 0; font-size: 0.85rem; color: var(--umiba-red);">Dekan Fak. Teknologi Informasi & Aktuaria</p>
          </li>
          <li class="glass glass-card" style="padding: 16px;">
            <strong>Kamilov Sagala, S.H., M.H</strong>
            <p style="margin: 0; font-size: 0.85rem; color: var(--umiba-red);">Dekan Fakultas Hukum</p>
          </li>
        </ul>
      </div>
      <div>
        <h3 style="margin-bottom: 24px; font-size: 1.4rem;"><i class="ph-bold ph-briefcase"></i> Kepala Lembaga</h3>
        <ul style="list-style: none; padding: 0;">
          <li class="glass glass-card" style="margin-bottom: 12px; padding: 16px;">
            <strong>Ir. Aswin Naldi Sahim, MM, Ph.D</strong>
            <p style="margin: 0; font-size: 0.85rem; color: var(--umiba-red);">Kepala LPMI (Penjaminan Mutu)</p>
          </li>
          <li class="glass glass-card" style="padding: 16px;">
            <strong>Dr. Nurwulan Kusuma Devi, MM</strong>
            <p style="margin: 0; font-size: 0.85rem; color: var(--umiba-red);">Kepala LPPM (Riset & Pengabdian)</p>
          </li>
        </ul>
        <div style="margin-top: 32px; text-align: right;">
          <a href="#" class="btn btn-primary">Lihat Bagan Lengkap (PDF)</a>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ░░░ FASILITAS ░░░ -->
<section id="fasilitas" style="padding: var(--space-8) 0; background: rgba(255, 255, 255, 0.4);">
  <div class="container">
    <div style="text-align: center; margin-bottom: var(--space-6);" class="fade-up">
      <span class="text-red" style="font-weight: 600; text-transform: uppercase;">Lingkungan Kampus</span>
      <h2>Fasilitas UMIBA</h2>
    </div>
    <div class="grid grid-3">
      <div class="glass glass-card fade-up">
        <h3>Ruang Kelas Modern</h3>
        <p>Dilengkapi dengan AC, proyektor LCD, dan Wi-Fi berkecepatan tinggi untuk mendukung proses belajar mengajar yang nyaman.</p>
      </div>
      <div class="glass glass-card fade-up" style="transition-delay: 0.1s;">
        <h3>Laboratorium</h3>
        <p>Laboratorium komputer mutakhir untuk Fakultas TI dan fasilitas praktik peradilan semu untuk Fakultas Hukum.</p>
      </div>
      <div class="glass glass-card fade-up" style="transition-delay: 0.2s;">
        <h3>Perpustakaan &amp; E-Library</h3>
        <p>Koleksi buku lengkap, jurnal internasional, dan area baca yang representatif.</p>
      </div>
    </div>
  </div>
</section>`;

  if (loading) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>;

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
