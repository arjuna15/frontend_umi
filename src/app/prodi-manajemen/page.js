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
        const htmlContent = data.find(c => c.key === 'prodi-manajemen_html');
        const bgContent = data.find(c => c.key === 'prodi-manajemen_hero_bg');
        if (htmlContent && htmlContent.value) setDynamicHtml(htmlContent.value);
        if (bgContent && bgContent.value) setDynamicHeroBg(bgContent.value);
      })
      .catch(err => console.error('Error fetching content for prodi-manajemen:', err));
  }, []);
    
  
  const heroBg = 'https://umiba.ac.id/wp-content/uploads/2024/05/bannerUMIBA26_2.png';
  const heroTitle = (lang === "en" ? "Bachelor of Management" : 'S1 Manajemen');
  const mainHtml = `<!-- ░░░ HERO SUBPAGE ░░░ -->


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
        <p style="font-style: italic; font-size: 1.1rem; line-height: 1.8; color: var(--color-text); margin: 24px 0;">"Selamat Datang di Program Studi S1 Manajemen Universitas Mitra Bangsa. Kami berkomitmen untuk menyelenggarakan pendidikan manajemen yang inovatif dan berbasis IT untuk mencetak pemimpin bisnis masa depan yang profesional dan berintegritas tinggi."</p>
        <div style="display: flex; flex-direction: column; gap: 4px;">
          <h4 style="margin: 0; color: var(--umiba-red);">Indri Astuti, S.Pd., M.M., M.Pd.</h4>
          <p style="margin: 0; font-size: 0.9rem; font-weight: 600;">Ketua Program Studi S1 Manajemen</p>
        </div>
        <div style="margin-top: 32px;">
          <a href="https://pddikti.kemdikbud.go.id/detail-prodi/9fZK8_NXkdvm0r2V2yqdiIE1dLA3eEmsaU0r77u4lGSuMvxpBdtQAM66xGCACDWbLIP35g==" target="_blank" class="btn btn-glass"><i class="ph-bold ph-users-three"></i> Lihat Daftar Lengkap Dosen (PDDikti)</a>
        </div>
      </div>
      <div class="fade-up" style="position: relative;">
        <div class="glass" style="padding: 15px; border-radius: var(--radius-lg); transform: rotate(2deg);">
          <img src="https://umiba.ac.id/wp-content/uploads/2024/05/indri_130.jpg" alt="Indri Astuti" style="width: 100%; border-radius: var(--radius-md); box-shadow: 0 15px 30px rgba(0,0,0,0.1);">
        </div>
        <!-- Decorative blob -->
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
      <h2>Visi S1 Manajemen</h2>
      <p style="font-size: 1.1rem; line-height: 1.8; font-weight: 600; color: var(--color-text);">"Mencetak Sumber Daya Manusia yang Berkompeten Berbasis Teknologi Informasi dan Bertaraf Internasional Tahun 2035"</p>
    </div>
    <div class="glass glass-card fade-up" style="transition-delay: 0.1s;">
      <h3 class="text-red">Misi S1 Manajemen</h3>
      <ul style="padding-left: var(--space-4);">
        <li style="margin-bottom: 8px;">Menyelenggarakan program pendidikan berbasis IT secara professional dan ilmiah.</li>
        <li style="margin-bottom: 8px;">Melaksanakan penelitian terapan yang menunjang pengembangan keahlian bisnis.</li>
        <li style="margin-bottom: 8px;">Menyebarkan hasil penelitian terapan secara nyata dan tepat guna.</li>
        <li style="margin-bottom: 8px;">Mengadakan kegiatan pengabdian pada masyarakat secara edukatif dan konsisten.</li>
        <li style="margin-bottom: 8px;">Mencetak SDM kompeten yang mampu menjalankan kegiatan bisnis professional.</li>
        <li style="margin-bottom: 8px;">Meningkatkan sarana dan prasarana untuk mendukung proses pembelajaran berkualitas.</li>
        <li style="margin-bottom: 8px;">Menjalin kerjasama dengan Institusi dan Dunia Industri (DUDI) skala nasional & internasional.</li>
      </ul>
    </div>
  </div>
</section>

<!-- ░░░ PROFIL LULUSAN & PEMINATAN ░░░ -->
<section id="profil" style="padding: var(--space-8) 0; background: var(--umiba-red-alpha);">
  <div class="container grid grid-2" style="gap: 40px;">
    
    <!-- Peminatan -->
    <div class="fade-up">
      <span class="text-red" style="font-weight: 600; text-transform: uppercase;">Fokus Keilmuan</span>
      <h2>Peminatan / Konsentrasi</h2>
      <p>Mahasiswa dapat memilih peminatan khusus di semester atas untuk memfokuskan kompetensi dan karir profesional mereka.</p>
      <div class="grid grid-2" style="gap: 16px; margin-top: 24px;">
        <div class="glass glass-card" style="padding: 16px; text-align: center;">
          <h4 style="margin: 0; color: var(--umiba-red); font-size: 1rem;">Manajemen SDM</h4>
        </div>
        <div class="glass glass-card" style="padding: 16px; text-align: center;">
          <h4 style="margin: 0; color: var(--umiba-red); font-size: 1rem;">Manajemen Keuangan</h4>
        </div>
        <div class="glass glass-card" style="padding: 16px; text-align: center;">
          <h4 style="margin: 0; color: var(--umiba-red); font-size: 1rem;">Manajemen Pemasaran</h4>
        </div>
        <div class="glass glass-card" style="padding: 16px; text-align: center;">
          <h4 style="margin: 0; color: var(--umiba-red); font-size: 1rem;">Manajemen Produksi</h4>
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
          <strong>Manajer Bidang Bisnis (Keuangan, Pemasaran, SDM)</strong>
        </li>
        <li style="margin-bottom: 16px; display: flex; align-items: center; gap: 12px;">
          <div style="color: var(--umiba-red);"><i class="ph-fill ph-check-circle"></i></div>
          <strong>Wirausaha Bidang Jasa & Manufaktur</strong>
        </li>
        <li style="margin-bottom: 16px; display: flex; align-items: center; gap: 12px;">
          <div style="color: var(--umiba-red);"><i class="ph-fill ph-check-circle"></i></div>
          <strong>Praktisi Perbankan</strong>
        </li>
        <li style="margin-bottom: 16px; display: flex; align-items: center; gap: 12px;">
          <div style="color: var(--umiba-red);"><i class="ph-fill ph-check-circle"></i></div>
          <strong>Aparatur Sipil Negara (ASN)</strong>
        </li>
        <li style="margin-bottom: 16px; display: flex; align-items: center; gap: 12px;">
          <div style="color: var(--umiba-red);"><i class="ph-fill ph-check-circle"></i></div>
          <strong>Ilmuwan Bidang Manajemen Bisnis</strong>
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
