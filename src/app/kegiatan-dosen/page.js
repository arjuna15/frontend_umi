'use client';
import { useState, useEffect } from 'react';
import { useLanguage } from '../../context/Providers';

export default function Page() {
    const { lang, t } = useLanguage();
    
  const [dynamicHtml, setDynamicHtml] = useState(null);
  const [dynamicHeroBg, setDynamicHeroBg] = useState(null);

  useEffect(() => {
    const api = process.env.NEXT_PUBLIC_API_URL || 'https://backend.bikinwebdikitaaja.com/api';
    fetch(`${api}/contents`)
      .then(res => res.json())
      .then(data => {
        const htmlContent = data.find(c => c.key === 'kegiatan-dosen_html');
        const bgContent = data.find(c => c.key === 'kegiatan-dosen_hero_bg');
        if (htmlContent && htmlContent.value) setDynamicHtml(htmlContent.value);
        if (bgContent && bgContent.value) setDynamicHeroBg(bgContent.value);
      })
      .catch(err => console.error('Error fetching content for kegiatan-dosen:', err));
  }, []);
    
  
  const heroBg = 'https://umiba.ac.id/wp-content/uploads/2024/05/bannerUMIBA26_2.png';
  const heroTitle = (lang === "en" ? "Lecturer Activities" : 'Kegiatan Dosen');
  const mainHtml = `<!-- ░░░ HERO SUBPAGE ░░░ -->


<!-- ░░░ NAVIGATION TABS ░░░ -->
<div style="position: sticky; top: 100px; z-index: 900; margin-top: 24px; margin-bottom: 24px;">
  <div class="container">
    <div class="glass" style="padding: 12px; border-radius: var(--radius-full); display: flex; justify-content: center; gap: 8px; flex-wrap: wrap;">
      <a href="#tridharma" class="btn btn-glass" style="padding: 10px 20px; font-size: 0.9rem;">Tridharma Perguruan Tinggi</a>
      <a href="#publikasi" class="btn btn-glass" style="padding: 10px 20px; font-size: 0.9rem;">Publikasi & Riset</a>
    </div>
  </div>
</div>

<!-- ░░░ TRIDHARMA ░░░ -->
<section id="tridharma" style="padding: var(--space-8) 0;">
  <div class="container">
    <div class="fade-up" style="text-align: center; margin-bottom: 48px;">
      <span class="text-red" style="font-weight: 600; text-transform: uppercase;">Aktivitas Inti</span>
      <h2>Tridharma Perguruan Tinggi</h2>
      <p style="max-width: 600px; margin: 0 auto;">Dosen UMIBA tidak hanya aktif mengajar, tetapi juga terus berinovasi melalui penelitian dan terjun langsung membantu masyarakat.</p>
    </div>
    <div class="grid grid-3">
      <div class="glass glass-card fade-up">
        <i class="ph-duotone ph-chalkboard-teacher" style="font-size: 3rem; color: var(--umiba-red); margin-bottom: 16px;"></i>
        <h3>Pengajaran</h3>
        <p>Proses transfer ilmu pengetahuan menggunakan metode interaktif, studi kasus, dan e-learning terintegrasi.</p>
      </div>
      <div class="glass glass-card fade-up" style="transition-delay: 0.1s;">
        <i class="ph-duotone ph-flask" style="font-size: 3rem; color: var(--umiba-red); margin-bottom: 16px;"></i>
        <h3>${lang === "en" ? "Research" : "Penelitian"}</h3>
        <p>Eksplorasi ilmu baru yang inovatif, berkolaborasi dengan mahasiswa dan mitra industri untuk menjawab tantangan zaman.</p>
      </div>
      <div class="glass glass-card fade-up" style="transition-delay: 0.2s;">
        <i class="ph-duotone ph-users-three" style="font-size: 3rem; color: var(--umiba-red); margin-bottom: 16px;"></i>
        <h3>${lang === "en" ? "Community Service" : "Pengabdian"}</h3>
        <p>Penerapan hasil riset secara langsung untuk memberdayakan dan meningkatkan taraf hidup masyarakat (UMKM & Desa Binaan).</p>
      </div>
    </div>
  </div>
</section>

<!-- ░░░ PUBLIKASI ░░░ -->
<section id="publikasi" style="padding: var(--space-8) 0; background: var(--umiba-red-alpha);">
  <div class="container grid grid-2" style="align-items: center; gap: 40px;">
    <div class="fade-up">
      <span class="text-red" style="font-weight: 600; text-transform: uppercase;">Jejak Akademik</span>
      <h2>Publikasi & Rekam Jejak</h2>
      <p>Karya-karya ilmiah dosen UMIBA secara rutin diterbitkan di jurnal nasional terakreditasi SINTA maupun jurnal internasional bereputasi (Scopus).</p>
      <a href="https://ejurnal.umiba.ac.id/" target="_blank" class="btn btn-primary" style="margin-top: 16px;">Akses E-Jurnal UMIBA</a>
    </div>
    <div class="glass glass-card fade-up" style="transition-delay: 0.1s;">
      <h3 style="margin-bottom: 16px;">Pangkalan Data Dosen</h3>
      <p style="font-size: 0.95rem; margin-bottom: 24px;">Informasi detail mengenai riwayat pendidikan, kepangkatan, dan portofolio penelitian dosen dapat diakses secara transparan melalui portal PDDikti.</p>
      <a href="https://pddikti.kemdikbud.go.id/" target="_blank" class="btn btn-glass" style="width: 100%;"><i class="ph-bold ph-link" style="margin-right: 8px;"></i> Cari Dosen di PDDikti</a>
    </div>
  </div>
</section>`;

  
  return (
    <div>
      <section className="hero hero-sub" style={{ background: `url('${dynamicHeroBg || heroBg}') center/cover`, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', color: 'white', overflow: 'hidden', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ position: 'absolute', inset: '-20px', background: 'linear-gradient(to bottom, rgba(15, 23, 42, 0.7), rgba(15, 23, 42, 0.9))', backdropFilter: 'blur(12px) saturate(150%)', WebkitBackdropFilter: 'blur(12px) saturate(150%)', zIndex: 1 }}></div>
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div className="fade-up">
            <span style={{ background: 'var(--umiba-red)', color: 'white', padding: '6px 16px', borderRadius: 'var(--radius-full)', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '24px', display: 'inline-block' }}>UMIBA</span>
            <h1 style={{ color: 'white', marginBottom: '16px' }}>{heroTitle}</h1>
          </div>
        </div>
      </section>
      <div dangerouslySetInnerHTML={{ __html: dynamicHtml || mainHtml }} />
    </div>
  );
}
