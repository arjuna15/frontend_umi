'use client';
import { useLanguage } from '../../context/Providers';

export default function Page() {
  const { lang, t } = useLanguage();
    
  
  const heroBg = 'https://umiba.ac.id/wp-content/uploads/2024/05/bannerUMIBA26_3.png';
  const heroTitle = (lang === "en" ? "Official Documents" : 'Dokumen Resmi');
  const mainHtml = `<!-- ░░░ HERO SUBPAGE ░░░ -->


<!-- ░░░ NAVIGATION TABS ░░░ -->
<div style="position: sticky; top: 100px; z-index: 900; margin-top: 24px; margin-bottom: 24px;">
  <div class="container">
    <div class="glass" style="padding: 12px; border-radius: var(--radius-full); display: flex; justify-content: center; gap: 8px; flex-wrap: wrap;">
      <a href="#sk" class="btn btn-glass" style="padding: 10px 20px; font-size: 0.9rem;">SK & Legalitas</a>
      <a href="#mahasiswa" class="btn btn-glass" style="padding: 10px 20px; font-size: 0.9rem;">Pedoman Mahasiswa</a>
      <a href="#brosur" class="btn btn-glass" style="padding: 10px 20px; font-size: 0.9rem;">Brosur PMB</a>
    </div>
  </div>
</div>

<!-- ░░░ DOKUMEN SECTION ░░░ -->
<section id="sk" style="padding: var(--space-8) 0;">
  <div class="container">
    <div class="fade-up" style="margin-bottom: 40px;">
      <span class="text-red" style="font-weight: 600; text-transform: uppercase;">Dokumen Universitas</span>
      <h2>SK & Legalitas Kampus</h2>
    </div>
    <div class="grid grid-2" style="gap: 20px;">
      <div class="glass glass-card fade-up" style="display: flex; justify-content: space-between; align-items: center;">
        <div>
          <h4 style="margin-bottom: 4px;">SK Pendirian UMIBA</h4>
          <p style="font-size: 0.85rem; margin: 0;">No. 486/E/O/2023 tertanggal 13 Juni 2023</p>
        </div>
        <a href="#" class="btn btn-primary" style="padding: 10px; border-radius: 50%;"><i class="ph-bold ph-download-simple"></i></a>
      </div>
      <div class="glass glass-card fade-up">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div>
            <h4 style="margin-bottom: 4px;">Sertifikat Akreditasi Institusi</h4>
            <p style="font-size: 0.85rem; margin: 0;">BAN-PT Tahun 2024</p>
          </div>
          <a href="#" class="btn btn-primary" style="padding: 10px; border-radius: 50%;"><i class="ph-bold ph-download-simple"></i></a>
        </div>
      </div>
    </div>
  </div>
</section>

<section id="mahasiswa" style="padding: var(--space-8) 0; background: var(--umiba-red-alpha);">
  <div class="container">
    <div class="fade-up" style="margin-bottom: 40px;">
      <span class="text-red" style="font-weight: 600; text-transform: uppercase;">Kemahasiswaan</span>
      <h2>Pedoman & ORMAWA</h2>
    </div>
    <div class="grid grid-3" style="gap: 20px;">
      <div class="glass glass-card fade-up" style="text-align: center;">
        <i class="ph-duotone ph-file-pdf" style="font-size: 3rem; color: var(--umiba-red); margin-bottom: 16px;"></i>
        <h4 style="margin-bottom: 8px;">AD/ART BEM UMIBA</h4>
        <a href="#" class="btn btn-glass" style="width: 100%; margin-top: 16px;">Unduh Dokumen</a>
      </div>
      <div class="glass glass-card fade-up">
        <div style="text-align: center;">
          <i class="ph-duotone ph-file-pdf" style="font-size: 3rem; color: var(--umiba-red); margin-bottom: 16px;"></i>
          <h4 style="margin-bottom: 8px;">Pedoman PKM 2025</h4>
          <a href="#" class="btn btn-glass" style="width: 100%; margin-top: 16px;">Unduh Dokumen</a>
        </div>
      </div>
      <div class="glass glass-card fade-up">
        <div style="text-align: center;">
          <i class="ph-duotone ph-file-pdf" style="font-size: 3rem; color: var(--umiba-red); margin-bottom: 16px;"></i>
          <h4 style="margin-bottom: 8px;">Buku Panduan Akademik</h4>
          <a href="#" class="btn btn-glass" style="width: 100%; margin-top: 16px;">Unduh Dokumen</a>
        </div>
      </div>
    </div>
  </div>
</section>

<section id="brosur" style="padding: var(--space-8) 0;">
  <div class="container">
    <div class="glass glass-card fade-up" style="background: linear-gradient(135deg, rgba(185, 28, 28, 0.05), rgba(185, 28, 28, 0.02)); padding: 60px; text-align: center; border: 1px solid rgba(185, 28, 28, 0.1);">
      <h2 style="font-size: 2.5rem; margin-bottom: 16px;">Unduh Brosur PMB 2026</h2>
      <p style="max-width: 600px; margin: 0 auto 32px;">Dapatkan informasi lengkap mengenai biaya pendidikan, syarat pendaftaran, dan beasiswa di Universitas Mitra Bangsa.</p>
      <div class="flex-center" style="gap: 16px;">
        <a href="#" class="btn btn-primary" style="padding: 16px 32px;"><i class="ph-bold ph-download-simple"></i> Download Brosur (PDF)</a>
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
