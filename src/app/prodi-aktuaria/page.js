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

  const heroBg = contents['prodi-aktuaria_hero_bg'] || 'https://umiba.ac.id/wp-content/uploads/2024/05/bannerUMIBA26_3.png';
  const heroTitle = contents['prodi-aktuaria_hero_title'] || (lang === "en" ? "Page" : 'S1 Ilmu Aktuaria');
  const mainHtml = contents['prodi-aktuaria_html'] || `<!-- ░░░ HERO SUBPAGE ░░░ -->


<!-- ░░░ TABS ░░░ -->
<div style="position: sticky; top: 100px; z-index: 900; margin-top: 24px; margin-bottom: 24px;">
  <div class="container">
    <div class="glass" style="padding: 12px; border-radius: var(--radius-full); display: flex; justify-content: center; gap: 8px; flex-wrap: wrap;">
      <a href="#sambutan" class="btn btn-glass" style="padding: 10px 20px; font-size: 0.9rem;">Sambutan Kaprodi</a>
      <a href="#visimisi" class="btn btn-glass" style="padding: 10px 20px; font-size: 0.9rem;">${lang === "en" ? "Vision & Mission" : "Visi & Misi"}</a>
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
        <p style="font-style: italic; font-size: 1.1rem; line-height: 1.8; color: var(--color-text); margin: 24px 0;">"Mengelola risiko adalah seni dalam matematika. Program Aktuaria UMIBA mempersiapkan Anda menjadi ahli finansial yang krusial bagi industri asuransi dan keuangan."</p>
        <div style="display: flex; flex-direction: column; gap: 4px;">
          <h4 style="margin: 0; color: var(--umiba-red);">Dosen Ahli UMIBA</h4>
          <p style="margin: 0; font-size: 0.9rem; font-weight: 600;">Ketua Program Studi S1 Ilmu Aktuaria</p>
        </div>
        <div style="margin-top: 32px;">
          <a href="https://pddikti.kemdikbud.go.id/" target="_blank" class="btn btn-glass"><i class="ph-bold ph-users-three"></i> Lihat Daftar Lengkap Dosen (PDDikti)</a>
        </div>
      </div>
      <div class="fade-up" style="position: relative;">
        <div class="glass" style="padding: 15px; border-radius: var(--radius-lg); transform: rotate(2deg);">
          <img src="https://via.placeholder.com/400x500/B91C1C/fff?text=Kaprodi+Aktuaria" alt="Dosen Ahli UMIBA" style="width: 100%; border-radius: var(--radius-md); box-shadow: 0 15px 30px rgba(0,0,0,0.1); background: #eee;">
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
      <h2>Visi S1 Ilmu Aktuaria</h2>
      <p style="font-size: 1.1rem; line-height: 1.8; font-weight: 600; color: var(--color-text);">"Mencetak aktuaris profesional bersertifikasi standar internasional yang tanggap terhadap dinamika industri keuangan dan asuransi."</p>
    </div>
    <div class="glass glass-card fade-up" style="transition-delay: 0.1s;">
      <h3 class="text-red">Misi S1 Ilmu Aktuaria</h3>
      <ul style="padding-left: var(--space-4);">
        <li style="margin-bottom: 8px;">Memberikan pendidikan matematika finansial dan aktuaria terbaik di tingkat nasional.</li>
        <li style="margin-bottom: 8px;">Bekerjasama aktif dengan PAI (Persatuan Aktuaris Indonesia) untuk sertifikasi lulusan.</li>
        <li style="margin-bottom: 8px;">Menerapkan sains data dan big data analytics pada manajemen risiko asuransi.</li>
        <li style="margin-bottom: 8px;">Mengembangkan riset inovatif dalam pemodelan risiko dan aktuaria.</li>
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
          <h4 style="margin: 0; color: var(--umiba-red); font-size: 1rem;">Asuransi Jiwa & Kesehatan</h4>
        </div>
        <div class="glass glass-card" style="padding: 16px; text-align: center;">
          <h4 style="margin: 0; color: var(--umiba-red); font-size: 1rem;">Asuransi Umum (General Insurance)</h4>
        </div>
        <div class="glass glass-card" style="padding: 16px; text-align: center;">
          <h4 style="margin: 0; color: var(--umiba-red); font-size: 1rem;">Manajemen Risiko Keuangan</h4>
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
          <strong>Aktuaris Bersertifikat (FSAI/ASAI)</strong>
        </li>
        <li style="margin-bottom: 16px; display: flex; align-items: center; gap: 12px;">
          <div style="color: var(--umiba-red);"><i class="ph-fill ph-check-circle"></i></div>
          <strong>Risk Manager</strong>
        </li>
        <li style="margin-bottom: 16px; display: flex; align-items: center; gap: 12px;">
          <div style="color: var(--umiba-red);"><i class="ph-fill ph-check-circle"></i></div>
          <strong>Data Analyst Keuangan</strong>
        </li>
        <li style="margin-bottom: 16px; display: flex; align-items: center; gap: 12px;">
          <div style="color: var(--umiba-red);"><i class="ph-fill ph-check-circle"></i></div>
          <strong>Konsultan Asuransi & Dana Pensiun</strong>
        </li>
        <li style="margin-bottom: 16px; display: flex; align-items: center; gap: 12px;">
          <div style="color: var(--umiba-red);"><i class="ph-fill ph-check-circle"></i></div>
          <strong>Underwriter</strong>
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
