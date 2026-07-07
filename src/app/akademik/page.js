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
        const htmlContent = data.find(c => c.key === 'akademik_html');
        const bgContent = data.find(c => c.key === 'akademik_hero_bg');
        if (htmlContent && htmlContent.value) setDynamicHtml(htmlContent.value);
        if (bgContent && bgContent.value) setDynamicHeroBg(bgContent.value);
      })
      .catch(err => console.error('Error fetching content for akademik:', err));
  }, []);
    
  
  const heroBg = 'https://umiba.ac.id/wp-content/uploads/2024/05/bannerUMIBA26_2.png';
  const heroTitle = (lang === "en" ? "Faculties & Academics" : 'Fakultas & Akademik');
  const mainHtml = `<!-- ░░░ HERO SUBPAGE ░░░ -->


<!-- ░░░ NAVIGATION TABS ░░░ -->
<div style="position: sticky; top: 100px; z-index: 900; margin-top: 24px; margin-bottom: 24px;">
  <div class="container">
    <div class="glass" style="padding: 12px; border-radius: var(--radius-full); display: flex; justify-content: center; gap: 8px; flex-wrap: wrap;">
      <a href="#manajemen" class="btn btn-glass" style="padding: 10px 20px; font-size: 0.9rem;">${lang === "en" ? "Management & Business" : "Manajemen & Bisnis"}</a>
      <a href="#hukum" class="btn btn-glass" style="padding: 10px 20px; font-size: 0.9rem;">${lang === "en" ? "Law" : "Ilmu Hukum"}</a>
      <a href="#komputer" class="btn btn-glass" style="padding: 10px 20px; font-size: 0.9rem;">${lang === "en" ? "IT & Actuarial" : "TI & Aktuaria"}</a>
    </div>
  </div>
</div>

<!-- ░░░ MANAJEMEN & BISNIS ░░░ -->
<section id="manajemen" style="padding: var(--space-8) 0;">
  <div class="container">
    <div class="glass glass-card fade-up">
      <span class="text-red" style="font-weight: 600; text-transform: uppercase;">${lang === "en" ? "Main Faculty" : "Fakultas Utama"}</span>
      <h2>${lang === "en" ? "Faculty of Management and Business" : "Fakultas Manajemen dan Bisnis"}</h2>
      <p>${lang === "en" ? "UMIBA Faculty of Management and Business aims to produce entrepreneurs and professionals in the management field capable of facing global business dynamics." : "Fakultas Manajemen dan Bisnis UMIBA bertujuan mencetak wirausahawan dan profesional di bidang manajemen yang mampu menghadapi dinamika bisnis global."}</p>
      
      <div class="grid grid-2" style="margin-top: var(--space-5);">
        <div class="glass glass-card">
          <h3 class="text-red">S1 Manajemen</h3>
          <p>${lang === "en" ? "Equips students with business analysis, marketing, finance, and human resources skills with an industry-based curriculum approach." : "Membekali mahasiswa dengan kemampuan analisis bisnis, pemasaran, keuangan, dan sumber daya manusia dengan pendekatan kurikulum berbasis industri."}</p>
          
          <div style="margin: 16px 0; padding: 12px; background: var(--color-border); border-radius: var(--radius-sm); border: var(--glass-border);">
            <span style="font-size: 0.75rem; text-transform: uppercase; font-weight: 700; color: var(--color-muted); display: block; margin-bottom: 4px;">${lang === "en" ? "Head of Program" : "Ketua Program Studi"}</span>
            <div style="display: flex; align-items: center; gap: 8px;">
              <i class="ph-fill ph-user-circle" style="font-size: 1.5rem; color: var(--umiba-red);"></i>
              <span style="font-size: 0.9rem; font-weight: 600;">Indri Astuti, S.Pd., M.M., M.Pd.</span>
            </div>
          </div>

          <a href="/prodi-manajemen" class="btn btn-glass" style="width: 100%; margin-top: auto;">${lang === "en" ? "Program Details" : "Detail Program Studi"}</a>
        </div>
        <div class="glass glass-card" id="magister" style="display: flex; flex-direction: column;">
          <h3 class="text-red">S2 Magister Manajemen</h3>
          <p>${lang === "en" ? "Postgraduate program to deepen advanced leadership strategies and corporate management for professionals." : "Program pascasarjana untuk mendalami strategi kepemimpinan dan manajemen korporasi tingkat lanjut bagi para profesional."}</p>
          <a href="/prodi-magister" class="btn btn-glass" style="width: 100%; margin-top: auto;">${lang === "en" ? "Program Details" : "Detail Program Studi"}</a>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ░░░ FAKULTAS HUKUM ░░░ -->
<section id="hukum" style="padding: var(--space-8) 0; background: var(--color-surface);">
  <div class="container">
    <div class="glass glass-card fade-up">
      <span class="text-red" style="font-weight: 600; text-transform: uppercase;">${lang === "en" ? "Career Options" : "Pilihan Profesi"}</span>
      <h2>${lang === "en" ? "Faculty of Law" : "Fakultas Hukum"}</h2>
      <p>${lang === "en" ? "Making law graduates critical, possessing integrity, and upholding the values of social justice in Indonesia and internationally." : "Menjadikan mahasiswa lulusan ilmu hukum yang kritis, berintegritas, dan menjunjung tinggi nilai-nilai keadilan sosial di Indonesia maupun taraf internasional."}</p>
      
      <div class="glass glass-card" style="margin-top: var(--space-5); max-width: 600px; display: flex; flex-direction: column;">
        <h3 class="text-red">S1 Ilmu Hukum</h3>
        <p>${lang === "en" ? "Study program with concentrations in Civil Law, Criminal Law, and Constitutional Law. Students are facilitated with moot court practices." : "Program studi dengan konsentrasi Hukum Perdata, Pidana, dan Hukum Tata Negara. Mahasiswa difasilitasi dengan praktik peradilan semu (Moot Court)."}</p>
        
        <div style="margin: 16px 0; padding: 12px; background: var(--color-border); border-radius: var(--radius-sm); border: var(--glass-border);">
          <span style="font-size: 0.75rem; text-transform: uppercase; font-weight: 700; color: var(--color-muted); display: block; margin-bottom: 4px;">${lang === "en" ? "Head of Program" : "Ketua Program Studi"}</span>
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
            <i class="ph-fill ph-user-circle" style="font-size: 1.5rem; color: var(--umiba-red);"></i>
            <span style="font-size: 0.9rem; font-weight: 600;">Kamilov Sagala, S.H., M.H.</span>
          </div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <i class="ph-fill ph-user" style="font-size: 1.2rem; color: var(--color-muted);"></i>
            <span style="font-size: 0.85rem; color: var(--color-muted);">Darwin S. Siagian, S.H., M.H. (Dosen)</span>
          </div>
        </div>

        <a href="/prodi-hukum" class="btn btn-glass" style="width: 100%; margin-top: auto;">${lang === "en" ? "Program Details" : "Detail Program Studi"}</a>
      </div>
    </div>
  </div>
</section>

<!-- ░░░ FAKULTAS TI & AKTUARIA ░░░ -->
<section id="komputer" style="padding: var(--space-8) 0;">
  <div class="container">
    <div class="glass glass-card fade-up">
      <span class="text-red" style="font-weight: 600; text-transform: uppercase;">${lang === "en" ? "Digital Future" : "Masa Depan Digital"}</span>
      <h2>${lang === "en" ? "Faculty of Information Technology and Actuarial Science" : "Fakultas Teknologi Informasi dan Aktuaria"}</h2>
      <p>${lang === "en" ? "Producing superior talents in intelligent computing, cybersecurity, and actuarial analysis to meet Industry 4.0 needs." : "Mencetak talenta unggul di bidang komputasi cerdas, keamanan siber, dan analisis aktuaria untuk memenuhi kebutuhan industri 4.0."}</p>
      
      <div class="grid grid-3" style="margin-top: var(--space-5);">
        <div class="glass glass-card" style="display: flex; flex-direction: column;">
          <h3 class="text-red">S1 Ilmu Komputer</h3>
          <p>${lang === "en" ? "Focuses on artificial intelligence, software engineering, and data science." : "Fokus pada kecerdasan buatan, rekayasa perangkat lunak, dan sains data."}</p>
          
          <div style="margin: 16px 0; padding: 12px; background: var(--color-border); border-radius: var(--radius-sm); border: var(--glass-border);">
            <span style="font-size: 0.75rem; text-transform: uppercase; font-weight: 700; color: var(--color-muted); display: block; margin-bottom: 4px;">${lang === "en" ? "Head of Program" : "Ketua Program Studi"}</span>
            <div style="display: flex; align-items: center; gap: 8px;">
              <i class="ph-fill ph-user-circle" style="font-size: 1.5rem; color: var(--umiba-red);"></i>
              <span style="font-size: 0.9rem; font-weight: 600;">Ahmad Fajar Sidiq, S.Kom., M.Kom.</span>
            </div>
          </div>

          <a href="/prodi-komputer" class="btn btn-glass" style="width: 100%; margin-top: auto;">${lang === "en" ? "Program Details" : "Detail Program Studi"}</a>
        </div>
        <div class="glass glass-card" id="sistem" style="display: flex; flex-direction: column;">
          <h3 class="text-red">${lang === "en" ? "Bachelor of Information Systems & Technology" : "S1 Sistem &amp; Teknologi Informasi"}</h3>
          <p>${lang === "en" ? "Integrating information technology with business processes to manage enterprise systems." : "Memadukan teknologi informasi dengan proses bisnis untuk mengelola sistem enterprise."}</p>
          <a href="/prodi-sistem" class="btn btn-glass" style="width: 100%; margin-top: auto;">${lang === "en" ? "Program Details" : "Detail Program Studi"}</a>
        </div>
        <div class="glass glass-card" id="aktuaria" style="display: flex; flex-direction: column;">
          <h3 class="text-red">S1 Ilmu Aktuaria</h3>
          <p>${lang === "en" ? "Studying statistics, mathematics, and insurance and financial risk management." : "Mempelajari statistika, matematika, dan manajemen risiko asuransi dan keuangan."}</p>
          <a href="/prodi-aktuaria" class="btn btn-glass" style="width: 100%; margin-top: auto;">${lang === "en" ? "Program Details" : "Detail Program Studi"}</a>
        </div>
      </div>
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
