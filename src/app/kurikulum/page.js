'use client';
import { useState, useEffect } from 'react';
import { useLanguage } from '../../context/Providers';

export default function Page() {
  const { lang, t } = useLanguage();
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

  const heroBg = contents['kurikulum_hero_bg'] || 'https://umiba.ac.id/wp-content/uploads/2024/05/bannerUMIBA26_2.png';
  const heroTitle = contents['kurikulum_hero_title'] || (lang === "en" ? "Page" : 'Kurikulum & Akademik');
  const mainHtml = contents['kurikulum_html'] || `<!-- ░░░ HERO SUBPAGE ░░░ -->


<!-- ░░░ NAVIGATION TABS ░░░ -->
<div style="position: sticky; top: 100px; z-index: 900; margin-top: 24px; margin-bottom: 24px;">
  <div class="container">
    <div class="glass" style="padding: 12px; border-radius: var(--radius-full); display: flex; justify-content: center; gap: 8px; flex-wrap: wrap;">
      <a href="#struktur" class="btn btn-glass" style="padding: 10px 20px; font-size: 0.9rem;">Struktur Kurikulum</a>
      <a href="#kalender" class="btn btn-glass" style="padding: 10px 20px; font-size: 0.9rem;">Kalender Akademik</a>
    </div>
  </div>
</div>

<!-- ░░░ STRUKTUR KURIKULUM ░░░ -->
<section id="struktur" style="padding: var(--space-8) 0;">
  <div class="container">
    <div class="grid grid-2" style="align-items: center; gap: 40px;">
      <div class="fade-up">
        <span class="text-red" style="font-weight: 600; text-transform: uppercase;">Berbasis KKNI</span>
        <h2>Struktur Kurikulum UMIBA</h2>
        <p>Kurikulum Universitas Mitra Bangsa dirancang secara komprehensif mengacu pada Kerangka Kualifikasi Nasional Indonesia (KKNI) dan Merdeka Belajar Kampus Merdeka (MBKM). Total Satuan Kredit Semester (SKS) yang harus ditempuh untuk jenjang Sarjana (S1) minimal adalah 144 SKS.</p>
        <ul style="list-style: none; padding: 0; margin-top: 24px;">
          <li style="margin-bottom: 12px; display: flex; align-items: center; gap: 12px;">
            <div style="color: var(--umiba-red);"><i class="ph-fill ph-check-circle"></i></div>
            Mata Kuliah Wajib Umum (MKWU)
          </li>
          <li style="margin-bottom: 12px; display: flex; align-items: center; gap: 12px;">
            <div style="color: var(--umiba-red);"><i class="ph-fill ph-check-circle"></i></div>
            Mata Kuliah Wajib Fakultas (MKWF)
          </li>
          <li style="margin-bottom: 12px; display: flex; align-items: center; gap: 12px;">
            <div style="color: var(--umiba-red);"><i class="ph-fill ph-check-circle"></i></div>
            Mata Kuliah Keahlian Program Studi
          </li>
          <li style="display: flex; align-items: center; gap: 12px;">
            <div style="color: var(--umiba-red);"><i class="ph-fill ph-check-circle"></i></div>
            Mata Kuliah Pilihan / MBKM
          </li>
        </ul>
      </div>
      <div class="glass glass-card fade-up">
        <h3 style="margin-bottom: 16px;">Download Kurikulum per Prodi</h3>
        <div style="display: flex; flex-direction: column; gap: 12px;">
          <a href="#" class="btn btn-glass" style="justify-content: flex-start;"><i class="ph-bold ph-download-simple"></i> Kurikulum S1 Manajemen</a>
          <a href="#" class="btn btn-glass" style="justify-content: flex-start;"><i class="ph-bold ph-download-simple"></i> Kurikulum S1 Hukum</a>
          <a href="#" class="btn btn-glass" style="justify-content: flex-start;"><i class="ph-bold ph-download-simple"></i> Kurikulum S1 Ilmu Komputer</a>
          <a href="#" class="btn btn-glass" style="justify-content: flex-start;"><i class="ph-bold ph-download-simple"></i> Kurikulum S1 Sistem Informasi</a>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ░░░ KALENDER AKADEMIK ░░░ -->
<section id="kalender" style="padding: var(--space-8) 0; background: rgba(185, 28, 28, 0.03);">
  <div class="container">
    <div class="fade-up" style="text-align: center; margin-bottom: 48px;">
      <span class="text-red" style="font-weight: 600; text-transform: uppercase;">Jadwal</span>
      <h2>Kalender Akademik 2025/2026</h2>
    </div>
    <div class="glass glass-card fade-up" style="max-width: 800px; margin: 0 auto;">
      <div style="display: flex; justify-content: space-between; padding: 16px; border-bottom: 1px solid rgba(0,0,0,0.1);">
        <strong>Awal Perkuliahan Gasal</strong> <span>Agustus 2025</span>
      </div>
      <div style="display: flex; justify-content: space-between; padding: 16px; border-bottom: 1px solid rgba(0,0,0,0.1);">
        <strong>Ujian Tengah Semester (UTS)</strong> <span>Oktober 2025</span>
      </div>
      <div style="display: flex; justify-content: space-between; padding: 16px; border-bottom: 1px solid rgba(0,0,0,0.1);">
        <strong>Ujian Akhir Semester (UAS)</strong> <span>Januari 2026</span>
      </div>
      <div style="display: flex; justify-content: space-between; padding: 16px;">
        <strong>Awal Perkuliahan Genap</strong> <span>Februari 2026</span>
      </div>
      <div style="margin-top: 24px; text-align: center;">
        <a href="#" class="btn btn-primary">Unduh PDF Kalender Lengkap</a>
      </div>
    </div>
  </div>
</section>`;

  if (loading) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>${lang === "en" ? "Loading..." : "Loading..."}</div>;

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
