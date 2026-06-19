export default function Page() {
  return (
    <div dangerouslySetInnerHTML={{ __html: `<!-- ░░░ HERO SUBPAGE ░░░ -->
<section class="hero hero-sub" style="background: url('https://umiba.ac.id/wp-content/uploads/2024/05/bannerUMIBA26_1.png') center/cover; position: relative; display: flex; align-items: center; justify-content: center; text-align: center; color: white; overflow: hidden; border-bottom: 1px solid rgba(255,255,255,0.05);">
  <div style="position: absolute; inset: -20px; background: linear-gradient(to bottom, rgba(15, 23, 42, 0.7), rgba(15, 23, 42, 0.9)); backdrop-filter: blur(12px) saturate(150%); -webkit-backdrop-filter: blur(12px) saturate(150%); z-index: 1;"></div>
  <div class="container" style="position: relative; z-index: 2;">
    <div class="fade-up">
      <span style="background: var(--umiba-red); color: white; padding: 6px 16px; border-radius: var(--radius-full); font-size: 0.85rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 24px; display: inline-block;">Akreditasi & Evaluasi</span>
      <h1 style="color: white; margin-bottom: 16px;">LPM UMIBA</h1>
      <p style="font-size: 1.25rem; max-width: 700px; margin: 0 auto; opacity: 0.9; color: white;">Lembaga Penjaminan Mutu Universitas Mitra Bangsa.</p>
    </div>
  </div>
</section>

<!-- ░░░ NAVIGATION TABS ░░░ -->
<div style="position: sticky; top: 100px; z-index: 900; margin-top: 24px; margin-bottom: 24px;">
  <div class="container">
    <div class="glass" style="padding: 12px; border-radius: var(--radius-full); display: flex; justify-content: center; gap: 8px; flex-wrap: wrap;">
      <a href="#tentang-lpm" class="btn btn-glass" style="padding: 10px 20px; font-size: 0.9rem;">Tentang LPM</a>
    </div>
  </div>
</div>

<!-- ░░░ CONTENT ░░░ -->
<section id="tentang-lpm" style="padding: var(--space-8) 0;">
  <div class="container grid grid-2" style="align-items: start;">
    <div class="glass glass-card fade-up">
      <span class="text-red" style="font-weight: 600; text-transform: uppercase;">Akreditasi &amp; Evaluasi</span>
      <h2>Lembaga Penjaminan Mutu</h2>
      <p>LPM UMIBA bertanggung jawab untuk merencanakan, melaksanakan, mengevaluasi, dan menindaklanjuti program penjaminan mutu internal di lingkungan Universitas Mitra Bangsa.</p>
      <p>Kami memastikan bahwa seluruh kegiatan tridharma perguruan tinggi sesuai dengan Standar Nasional Pendidikan Tinggi (SN Dikti) dan standar mutu yang telah ditetapkan universitas.</p>
      <a href="https://lpm.umiba.ac.id/" target="_blank" class="btn btn-primary" style="margin-top: var(--space-3);">Kunjungi Website LPM</a>
    </div>
    
    <div class="glass glass-card fade-up" style="transition-delay: 0.1s;">
      <h3 class="text-red">Sistem Penjaminan Mutu Internal (SPMI)</h3>
      <p>Tahapan SPMI yang diterapkan di UMIBA mencakup siklus PPEPP:</p>
      <ul style="padding-left: var(--space-4); margin-top: var(--space-3);">
        <li style="margin-bottom: 8px;"><strong>P</strong>enetapan Standar Mutu</li>
        <li style="margin-bottom: 8px;"><strong>P</strong>elaksanaan Standar Mutu</li>
        <li style="margin-bottom: 8px;"><strong>E</strong>valuasi (Pelaksanaan Standar Mutu)</li>
        <li style="margin-bottom: 8px;"><strong>P</strong>engendalian (Pelaksanaan Standar Mutu)</li>
        <li style="margin-bottom: 8px;"><strong>P</strong>eningkatan Standar Mutu</li>
      </ul>
    </div>
  </div>
</section>` }} />
  );
}
