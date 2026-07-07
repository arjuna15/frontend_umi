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
        const htmlContent = data.find(c => c.key === 'informasi_html');
        const bgContent = data.find(c => c.key === 'informasi_hero_bg');
        if (htmlContent && htmlContent.value) setDynamicHtml(htmlContent.value);
        if (bgContent && bgContent.value) setDynamicHeroBg(bgContent.value);
      })
      .catch(err => console.error('Error fetching content for informasi:', err));
  }, []);
    
  
  const heroBg = 'https://umiba.ac.id/wp-content/uploads/2024/05/bannerUMIBA26_3.png';
  const heroTitle = (lang === "en" ? "Information Center" : 'Pusat Informasi');
  const mainHtml = `<!-- ░░░ HERO SUBPAGE ░░░ -->


<!-- ░░░ NAVIGATION TABS ░░░ -->
<div style="position: sticky; top: 100px; z-index: 900; margin-top: 24px; margin-bottom: 24px;">
  <div class="container">
    <div class="glass" style="padding: 12px; border-radius: var(--radius-full); display: flex; justify-content: center; gap: 8px; flex-wrap: wrap;">
      <a href="#biaya" class="btn btn-glass" style="padding: 10px 20px; font-size: 0.9rem;">${lang === "en" ? "Tuition Fees" : "Biaya Pendidikan"}</a>
      <a href="#infografis" class="btn btn-glass" style="padding: 10px 20px; font-size: 0.9rem;">${lang === "en" ? "Infographics" : "Info Grafis"}</a>
    </div>
  </div>
</div>

<!-- ░░░ BIAYA PENDIDIKAN ░░░ -->
<section id="biaya" style="padding: var(--space-8) 0;">
  <div class="container">
    <div class="glass glass-card fade-up">
      <span class="text-red" style="font-weight: 600; text-transform: uppercase;">${lang === "en" ? "Latest Information" : "Informasi Terkini"}</span>
      <h2>${lang === "en" ? "Tuition Fees for Academic Year 2025/2026" : "Biaya Pendidikan Tahun Ajaran 2025/2026"}</h2>
      <p>${lang === "en" ? "Universitas Mitra Bangsa is committed to providing quality education at affordable costs. We also provide various scholarship programs for outstanding and underprivileged students." : "Universitas Mitra Bangsa berkomitmen memberikan pendidikan berkualitas dengan biaya yang terjangkau. Kami juga menyediakan berbagai program beasiswa bagi mahasiswa berprestasi dan mahasiswa kurang mampu."}</p>
      
      <table style="width: 100%; border-collapse: collapse; margin-top: var(--space-4); text-align: left;">
        <thead>
          <tr style="border-bottom: 2px solid var(--umiba-red);">
            <th style="padding: 12px; color: var(--color-text);">${lang === "en" ? "Study Program" : "Program Studi"}</th>
            <th style="padding: 12px; color: var(--color-text);">${lang === "en" ? "Admission Fee" : "Uang Pangkal"}</th>
            <th style="padding: 12px; color: var(--color-text);">${lang === "en" ? "Tuition / Semester" : "SPP / Semester"}</th>
          </tr>
        </thead>
        <tbody>
          <tr style="border-bottom: 1px solid rgba(0,0,0,0.1);">
            <td style="padding: 12px;">${lang === "en" ? "Bachelor of Management / Law" : "S1 Manajemen / Hukum"}</td>
            <td style="padding: 12px;">Rp 5.500.000</td>
            <td style="padding: 12px;">Rp 4.000.000</td>
          </tr>
          <tr style="border-bottom: 1px solid rgba(0,0,0,0.1);">
            <td style="padding: 12px;">${lang === "en" ? "Bachelor of Computer Science / IT Systems" : "S1 Ilmu Komputer / Sistem TI"}</td>
            <td style="padding: 12px;">Rp 6.000.000</td>
            <td style="padding: 12px;">Rp 4.500.000</td>
          </tr>
          <tr style="border-bottom: 1px solid rgba(0,0,0,0.1);">
            <td style="padding: 12px;">${lang === "en" ? "Bachelor of Actuarial Science" : "S1 Ilmu Aktuaria"}</td>
            <td style="padding: 12px;">Rp 6.500.000</td>
            <td style="padding: 12px;">Rp 4.800.000</td>
          </tr>
          <tr>
            <td style="padding: 12px;">${lang === "en" ? "Master of Management" : "S2 Magister Manajemen"}</td>
            <td style="padding: 12px;">Rp 8.000.000</td>
            <td style="padding: 12px;">Rp 7.000.000</td>
          </tr>
        </tbody>
      </table>
      
      <p style="margin-top: var(--space-4); font-size: 0.9rem; color: var(--color-muted);">${lang === "en" ? "*The above costs are estimates and may change at any time. For complete cost details, please download the brochure or contact the admissions department." : "*Biaya di atas adalah estimasi dan dapat berubah sewaktu-waktu. Untuk informasi rincian biaya lengkap, silakan unduh brosur atau hubungi bagian pendaftaran."}</p>
    </div>
  </div>
</section>

<!-- ░░░ BROSUR & INFOGRAFIS ░░░ -->
<section id="infografis" style="padding: var(--space-8) 0; background: var(--color-surface);">
  <div class="container grid grid-2">
    <div class="glass glass-card fade-up">
      <h2 class="text-red">${lang === "en" ? "Download Brochure" : "Unduh Brosur"}</h2>
      <p>${lang === "en" ? "Get complete information about the vision, mission, faculties, study programs, student activities, and complete guidelines on the new student admission procedure." : "Dapatkan informasi lengkap tentang visi misi, fakultas, program studi, kegiatan kemahasiswaan, dan panduan lengkap tata cara pendaftaran mahasiswa baru."}</p>
      <a href="https://umiba.ac.id/doc/brosur/BrosurUMIBA2025.pdf" target="_blank" class="btn btn-primary" style="margin-top: var(--space-3);">${lang === "en" ? "Download Brochure (PDF)" : "Download Brosur (PDF)"}</a>
    </div>
    <div class="glass glass-card fade-up" style="transition-delay: 0.1s;">
      <h2 class="text-red">${lang === "en" ? "Infographics" : "Info Grafis"}</h2>
      <p>${lang === "en" ? "View data visualization regarding Universitas Mitra Bangsa achievements, graduation statistics, alumni employment, and student distribution across Indonesia." : "Melihat visualisasi data tentang pencapaian Universitas Mitra Bangsa, statistik kelulusan, penyerapan kerja alumni, dan persebaran mahasiswa di seluruh Indonesia."}</p>
      <a href="#" class="btn btn-glass" style="margin-top: var(--space-3);">Lihat ${lang === "en" ? "Infographics" : "Info Grafis"}</a>
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
