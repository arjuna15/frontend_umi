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

  const heroBg = contents['akademik_hero_bg'] || 'https://umiba.ac.id/wp-content/uploads/2024/05/bannerUMIBA26_2.png';
  const heroTitle = contents['akademik_hero_title'] || 'Fakultas & Akademik';
  const mainHtml = contents['akademik_html'] || `<!-- ░░░ HERO SUBPAGE ░░░ -->


<!-- ░░░ NAVIGATION TABS ░░░ -->
<div style="position: sticky; top: 100px; z-index: 900; margin-top: 24px; margin-bottom: 24px;">
  <div class="container">
    <div class="glass" style="padding: 12px; border-radius: var(--radius-full); display: flex; justify-content: center; gap: 8px; flex-wrap: wrap;">
      <a href="#manajemen" class="btn btn-glass" style="padding: 10px 20px; font-size: 0.9rem;">Manajemen & Bisnis</a>
      <a href="#hukum" class="btn btn-glass" style="padding: 10px 20px; font-size: 0.9rem;">Ilmu Hukum</a>
      <a href="#komputer" class="btn btn-glass" style="padding: 10px 20px; font-size: 0.9rem;">TI & Aktuaria</a>
    </div>
  </div>
</div>

<!-- ░░░ MANAJEMEN & BISNIS ░░░ -->
<section id="manajemen" style="padding: var(--space-8) 0;">
  <div class="container">
    <div class="glass glass-card fade-up">
      <span class="text-red" style="font-weight: 600; text-transform: uppercase;">Fakultas Utama</span>
      <h2>Fakultas Manajemen dan Bisnis</h2>
      <p>Fakultas Manajemen dan Bisnis UMIBA bertujuan mencetak wirausahawan dan profesional di bidang manajemen yang mampu menghadapi dinamika bisnis global.</p>
      
      <div class="grid grid-2" style="margin-top: var(--space-5);">
        <div class="glass glass-card">
          <h3 class="text-red">S1 Manajemen</h3>
          <p>Membekali mahasiswa dengan kemampuan analisis bisnis, pemasaran, keuangan, dan sumber daya manusia dengan pendekatan kurikulum berbasis industri.</p>
          
          <div style="margin: 16px 0; padding: 12px; background: rgba(0,0,0,0.05); border-radius: var(--radius-sm); border: 1px solid rgba(255,255,255,0.1);">
            <span style="font-size: 0.75rem; text-transform: uppercase; font-weight: 700; color: var(--color-muted); display: block; margin-bottom: 4px;">Ketua Program Studi</span>
            <div style="display: flex; align-items: center; gap: 8px;">
              <i class="ph-fill ph-user-circle" style="font-size: 1.5rem; color: var(--umiba-red);"></i>
              <span style="font-size: 0.9rem; font-weight: 600;">Indri Astuti, S.Pd., M.M., M.Pd.</span>
            </div>
          </div>

          <a href="/prodi-manajemen" class="btn btn-glass" style="width: 100%; margin-top: auto;">Detail Program Studi</a>
        </div>
        <div class="glass glass-card" id="magister" style="display: flex; flex-direction: column;">
          <h3 class="text-red">S2 Magister Manajemen</h3>
          <p>Program pascasarjana untuk mendalami strategi kepemimpinan dan manajemen korporasi tingkat lanjut bagi para profesional.</p>
          <a href="/prodi-magister" class="btn btn-glass" style="width: 100%; margin-top: auto;">Detail Program Studi</a>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ░░░ FAKULTAS HUKUM ░░░ -->
<section id="hukum" style="padding: var(--space-8) 0; background: rgba(255, 255, 255, 0.4);">
  <div class="container">
    <div class="glass glass-card fade-up">
      <span class="text-red" style="font-weight: 600; text-transform: uppercase;">Pilihan Profesi</span>
      <h2>Fakultas Hukum</h2>
      <p>Menjadikan mahasiswa lulusan ilmu hukum yang kritis, berintegritas, dan menjunjung tinggi nilai-nilai keadilan sosial di Indonesia maupun taraf internasional.</p>
      
      <div class="glass glass-card" style="margin-top: var(--space-5); max-width: 600px; display: flex; flex-direction: column;">
        <h3 class="text-red">S1 Ilmu Hukum</h3>
        <p>Program studi dengan konsentrasi Hukum Perdata, Pidana, dan Hukum Tata Negara. Mahasiswa difasilitasi dengan praktik peradilan semu (Moot Court).</p>
        
        <div style="margin: 16px 0; padding: 12px; background: rgba(0,0,0,0.05); border-radius: var(--radius-sm); border: 1px solid rgba(255,255,255,0.1);">
          <span style="font-size: 0.75rem; text-transform: uppercase; font-weight: 700; color: var(--color-muted); display: block; margin-bottom: 4px;">Ketua Program Studi</span>
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
            <i class="ph-fill ph-user-circle" style="font-size: 1.5rem; color: var(--umiba-red);"></i>
            <span style="font-size: 0.9rem; font-weight: 600;">Kamilov Sagala, S.H., M.H.</span>
          </div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <i class="ph-fill ph-user" style="font-size: 1.2rem; color: var(--color-muted);"></i>
            <span style="font-size: 0.85rem; color: var(--color-muted);">Darwin S. Siagian, S.H., M.H. (Dosen)</span>
          </div>
        </div>

        <a href="/prodi-hukum" class="btn btn-glass" style="width: 100%; margin-top: auto;">Detail Program Studi</a>
      </div>
    </div>
  </div>
</section>

<!-- ░░░ FAKULTAS TI & AKTUARIA ░░░ -->
<section id="komputer" style="padding: var(--space-8) 0;">
  <div class="container">
    <div class="glass glass-card fade-up">
      <span class="text-red" style="font-weight: 600; text-transform: uppercase;">Masa Depan Digital</span>
      <h2>Fakultas Teknologi Informasi dan Aktuaria</h2>
      <p>Mencetak talenta unggul di bidang komputasi cerdas, keamanan siber, dan analisis aktuaria untuk memenuhi kebutuhan industri 4.0.</p>
      
      <div class="grid grid-3" style="margin-top: var(--space-5);">
        <div class="glass glass-card" style="display: flex; flex-direction: column;">
          <h3 class="text-red">S1 Ilmu Komputer</h3>
          <p>Fokus pada kecerdasan buatan, rekayasa perangkat lunak, dan sains data.</p>
          
          <div style="margin: 16px 0; padding: 12px; background: rgba(0,0,0,0.05); border-radius: var(--radius-sm); border: 1px solid rgba(255,255,255,0.1);">
            <span style="font-size: 0.75rem; text-transform: uppercase; font-weight: 700; color: var(--color-muted); display: block; margin-bottom: 4px;">Ketua Program Studi</span>
            <div style="display: flex; align-items: center; gap: 8px;">
              <i class="ph-fill ph-user-circle" style="font-size: 1.5rem; color: var(--umiba-red);"></i>
              <span style="font-size: 0.9rem; font-weight: 600;">Ahmad Fajar Sidiq, S.Kom., M.Kom.</span>
            </div>
          </div>

          <a href="/prodi-komputer" class="btn btn-glass" style="width: 100%; margin-top: auto;">Detail Program Studi</a>
        </div>
        <div class="glass glass-card" id="sistem" style="display: flex; flex-direction: column;">
          <h3 class="text-red">S1 Sistem &amp; Teknologi Informasi</h3>
          <p>Memadukan teknologi informasi dengan proses bisnis untuk mengelola sistem enterprise.</p>
          <a href="/prodi-sistem" class="btn btn-glass" style="width: 100%; margin-top: auto;">Detail Program Studi</a>
        </div>
        <div class="glass glass-card" id="aktuaria" style="display: flex; flex-direction: column;">
          <h3 class="text-red">S1 Ilmu Aktuaria</h3>
          <p>Mempelajari statistika, matematika, dan manajemen risiko asuransi dan keuangan.</p>
          <a href="/prodi-aktuaria" class="btn btn-glass" style="width: 100%; margin-top: auto;">Detail Program Studi</a>
        </div>
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
