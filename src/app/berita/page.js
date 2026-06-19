'use client';
import { useState, useEffect } from 'react';

export default function BeritaPage() {
  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://backend.bikinwebdikitaaja.com/api'}/news`);
        if (res.ok) {
          const data = await res.json();
          setNewsData(data.news || []);
        }
      } catch (err) {
        console.error("Failed to fetch news:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  return (
    <>
      {/* ░░░ HERO SUBPAGE ░░░ */}
      <section className="hero hero-sub" style={{ background: "url('https://umiba.ac.id/wp-content/uploads/2024/05/bannerUMIBA26_2.png') center/cover", position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', color: 'white', overflow: 'hidden', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ position: 'absolute', inset: '-20px', background: 'linear-gradient(to bottom, rgba(15, 23, 42, 0.7), rgba(15, 23, 42, 0.9))', backdropFilter: 'blur(12px) saturate(150%)', WebkitBackdropFilter: 'blur(12px) saturate(150%)', zIndex: '1' }}></div>
        <div className="container" style={{ position: 'relative', zIndex: '2' }}>
          <div className="fade-up">
            <span style={{ background: 'var(--umiba-red)', color: 'white', padding: '6px 16px', borderRadius: 'var(--radius-full)', fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '24px', display: 'inline-block' }}>Kabar Kampus</span>
            <h1 style={{ color: 'white', marginBottom: '16px' }}>Berita & Artikel</h1>
            <p style={{ fontSize: '1.25rem', maxWidth: '700px', margin: '0 auto', opacity: '0.9', color: 'white' }}>Kabar terbaru seputar kegiatan akademik dan non-akademik di UMIBA.</p>
          </div>
        </div>
      </section>

      {/* ░░░ NAVIGATION TABS ░░░ */}
      <div style={{ position: 'sticky', top: '100px', zIndex: '900', marginTop: '24px', marginBottom: '24px' }}>
        <div className="container">
          <div className="glass" style={{ padding: '12px', borderRadius: 'var(--radius-full)', display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <a href="#list-berita" className="btn btn-glass" style={{ padding: '10px 20px', fontSize: '0.9rem' }}>Berita Terbaru</a>
          </div>
        </div>
      </div>

      {/* ░░░ GRID BERITA ░░░ */}
      <section id="list-berita" style={{ padding: 'var(--space-8) 0' }}>
        <div className="container">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>Loading berita...</div>
          ) : (
            <div className="grid grid-3">
              {newsData.length > 0 ? (
                newsData.map((item, index) => (
                  <div key={item.id} className="glass glass-card fade-up" style={{ transitionDelay: `${index * 0.1}s` }}>
                    <div style={{ background: 'var(--color-muted)', height: '200px', borderRadius: 'var(--radius-sm)', marginBottom: 'var(--space-3)', overflow: 'hidden' }}>
                      <img src={item.image_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={item.title}/>
                    </div>
                    <p style={{ fontSize: '0.8rem', marginBottom: '8px' }}>{item.date}</p>
                    <h3 style={{ fontSize: '1.1rem' }}>{item.title}</h3>
                    {/* Hardcoding source or a static description since original DB didn't have full description field */}
                    <p style={{ fontSize: '0.9rem', marginTop: '8px' }}>Sumber: {item.source || 'UMIBA'}</p>
                    <a href="#" className="btn btn-glass" style={{ marginTop: 'auto' }}>Baca Selengkapnya</a>
                  </div>
                ))
              ) : (
                <div style={{ gridColumn: 'span 3', textAlign: 'center' }}>Tidak ada berita saat ini.</div>
              )}
            </div>
          )}
          
          <div style={{ textAlign: 'center', marginTop: 'var(--space-6)' }} className="fade-up">
            <a href="#" className="btn btn-primary">Muat Lebih Banyak</a>
          </div>
        </div>
      </section>
    </>
  );
}
