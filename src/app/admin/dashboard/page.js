'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('konten');
  const [news, setNews] = useState([]);
  const [contents, setContents] = useState({});
  const [loading, setLoading] = useState(true);
  const [openAccordion, setOpenAccordion] = useState('');
  const [saving, setSaving] = useState(false);

  const pages = [
    { id: 'home', label: 'Home / Beranda', icon: 'ph-house' },
    { id: 'profil', label: 'Profil Universitas', icon: 'ph-buildings' },
    { id: 'akademik', label: 'Akademik', icon: 'ph-graduation-cap' },
    { id: 'berita', label: 'Berita (Hero)', icon: 'ph-newspaper' },
    { id: 'dokumen', label: 'Dokumen', icon: 'ph-file-pdf' },
    { id: 'fasilitas', label: 'Fasilitas', icon: 'ph-desktop' },
    { id: 'informasi', label: 'Informasi', icon: 'ph-info' },
    { id: 'kegiatan-dosen', label: 'Kegiatan Dosen', icon: 'ph-chalkboard-teacher' },
    { id: 'kurikulum', label: 'Kurikulum', icon: 'ph-books' },
    { id: 'lppm', label: 'LPPM', icon: 'ph-flask' },
    { id: 'mutu', label: 'Penjaminan Mutu', icon: 'ph-check-circle' },
    { id: 'prodi-aktuaria', label: 'Prodi Aktuaria', icon: 'ph-chart-line-up' },
    { id: 'prodi-hukum', label: 'Prodi Hukum', icon: 'ph-scales' },
    { id: 'prodi-komputer', label: 'Prodi Komputer', icon: 'ph-laptop' },
    { id: 'prodi-magister', label: 'Prodi Magister', icon: 'ph-student' },
    { id: 'prodi-manajemen', label: 'Prodi Manajemen', icon: 'ph-briefcase' },
    { id: 'prodi-sistem', label: 'Prodi Sistem TI', icon: 'ph-tree-structure' }
  ];

  const fetchAuth = async (url, options = {}) => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.push('/admin/login');
      return null;
    }
    const headers = { ...options.headers, 'Authorization': `Bearer ${token}` };
    const res = await fetch(url, { ...options, headers });
    if (res.status === 401) {
      localStorage.removeItem('admin_token');
      router.push('/admin/login');
      return null;
    }
    return res;
  };

  const loadData = async () => {
    setLoading(true);
    const api = process.env.NEXT_PUBLIC_API_URL || 'https://backend.bikinwebdikitaaja.com/api';
    
    // Load News
    const newsRes = await fetchAuth(`${api}/admin/news`);
    if (newsRes && newsRes.ok) setNews(await newsRes.json());
    
    // Load Contents
    const contentRes = await fetch(`${api}/contents`);
    if (contentRes.ok) {
      const data = await contentRes.json();
      const contentMap = {};
      data.forEach(c => contentMap[c.key] = c.value);
      setContents(contentMap);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
    // Inject Phosphor Icons script just in case it's missing in this view
    if (!document.querySelector('script[src*="phosphor"]')) {
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/@phosphor-icons/web';
      document.head.appendChild(script);
    }
  }, []);

  const handleLogout = async () => {
    await fetchAuth(`${process.env.NEXT_PUBLIC_API_URL || 'https://backend.bikinwebdikitaaja.com/api'}/admin/logout`, { method: 'POST' });
    localStorage.removeItem('admin_token');
    router.push('/admin/login');
  };

  const handleUploadImage = async (e, setUrlCallback) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    const api = process.env.NEXT_PUBLIC_API_URL || 'https://backend.bikinwebdikitaaja.com/api';
    const res = await fetchAuth(`${api}/admin/upload-image`, {
      method: 'POST',
      body: formData
    });

    if (res && res.ok) {
      const data = await res.json();
      setUrlCallback(data.url);
      // Optional: Add a nice toast notification here instead of alert
    } else {
      alert('Upload gagal');
    }
  };

  const saveContents = async () => {
    setSaving(true);
    const api = process.env.NEXT_PUBLIC_API_URL || 'https://backend.bikinwebdikitaaja.com/api';
    const res = await fetchAuth(`${api}/admin/contents`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents })
    });
    setSaving(false);
    if (res && res.ok) {
      alert('Konten berhasil disimpan'); // In a real app, use a nice toast
    }
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f172a' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '3px solid rgba(255,255,255,0.1)', borderTopColor: '#e11d48', animation: 'spin 1s linear infinite' }}></div>
        <div style={{ color: '#94a3b8', fontSize: '0.9rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Authenticating...</div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'linear-gradient(135deg, #020617 0%, #0f172a 100%)', color: '#f8fafc', fontFamily: '"Inter", sans-serif' }}>
      {/* Sidebar */}
      <div style={{ 
        width: '280px', 
        background: 'rgba(15, 23, 42, 0.4)', 
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderRight: '1px solid rgba(255, 255, 255, 0.05)',
        padding: '32px 24px', 
        display: 'flex', 
        flexDirection: 'column',
        position: 'relative',
        zIndex: 10
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '48px' }}>
          <div style={{ background: 'linear-gradient(135deg, #e11d48 0%, #9f1239 100%)', padding: '10px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(225, 29, 72, 0.3)' }}>
            <i className="ph-fill ph-shield-check" style={{ fontSize: '1.5rem', color: 'white' }}></i>
          </div>
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: '700', margin: 0, letterSpacing: '-0.02em' }}>UMIBA</h2>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: '2px' }}>Admin Portal</div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: '700', marginBottom: '8px', paddingLeft: '12px' }}>Menu Utama</div>
          
          <button 
            onClick={() => setActiveTab('konten')} 
            style={{ 
              display: 'flex', alignItems: 'center', gap: '12px', textAlign: 'left', padding: '12px 16px', 
              background: activeTab === 'konten' ? 'rgba(225, 29, 72, 0.1)' : 'transparent', 
              color: activeTab === 'konten' ? '#e11d48' : '#cbd5e1', 
              border: '1px solid', borderColor: activeTab === 'konten' ? 'rgba(225, 29, 72, 0.2)' : 'transparent', 
              borderRadius: '12px', cursor: 'pointer', transition: 'all 0.2s', fontWeight: '500'
            }}
          >
            <i className="ph-duotone ph-browser" style={{ fontSize: '1.25rem' }}></i>
            Pengaturan Halaman
          </button>

          <button 
            onClick={() => setActiveTab('berita')} 
            style={{ 
              display: 'flex', alignItems: 'center', gap: '12px', textAlign: 'left', padding: '12px 16px', 
              background: activeTab === 'berita' ? 'rgba(225, 29, 72, 0.1)' : 'transparent', 
              color: activeTab === 'berita' ? '#e11d48' : '#cbd5e1', 
              border: '1px solid', borderColor: activeTab === 'berita' ? 'rgba(225, 29, 72, 0.2)' : 'transparent', 
              borderRadius: '12px', cursor: 'pointer', transition: 'all 0.2s', fontWeight: '500'
            }}
          >
            <i className="ph-duotone ph-newspaper" style={{ fontSize: '1.25rem' }}></i>
            Kelola Berita
          </button>
        </div>

        <div style={{ marginTop: 'auto' }}>
          <div style={{ padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#334155', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className="ph-fill ph-user" style={{ color: '#94a3b8' }}></i>
              </div>
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: '600' }}>Admin UMIBA</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>admin@umiba.ac.id</div>
              </div>
            </div>
          </div>
          <button 
            onClick={handleLogout} 
            style={{ 
              width: '100%', padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              background: 'rgba(225, 29, 72, 0.1)', color: '#e11d48', border: '1px solid rgba(225, 29, 72, 0.2)', 
              borderRadius: '12px', cursor: 'pointer', fontWeight: '600', transition: 'all 0.2s' 
            }}
            onMouseOver={(e) => e.currentTarget.style.background = 'rgba(225, 29, 72, 0.2)'}
            onMouseOut={(e) => e.currentTarget.style.background = 'rgba(225, 29, 72, 0.1)'}
          >
            <i className="ph-bold ph-sign-out"></i>
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, height: '100vh', overflowY: 'auto', position: 'relative' }}>
        
        {/* Top Gradient Blob for aesthetics */}
        <div style={{ position: 'absolute', top: '-10%', left: '20%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(225,29,72,0.15) 0%, rgba(0,0,0,0) 70%)', zIndex: 0, pointerEvents: 'none' }}></div>
        <div style={{ position: 'absolute', top: '30%', right: '-10%', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(56,189,248,0.05) 0%, rgba(0,0,0,0) 70%)', zIndex: 0, pointerEvents: 'none' }}></div>

        <div style={{ padding: '48px 64px', position: 'relative', zIndex: 1, maxWidth: '1400px', margin: '0 auto' }}>
          
          {activeTab === 'berita' && (
            <div className="fade-in">
              <div style={{ marginBottom: '40px' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '8px' }}>Kelola Berita</h1>
                <p style={{ color: '#94a3b8', fontSize: '1rem' }}>Manajemen publikasi berita dan pengumuman kampus.</p>
              </div>
              
              <div style={{ 
                display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' 
              }}>
                {/* Add New Card */}
                <div style={{ 
                  background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.1)', 
                  borderRadius: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  minHeight: '300px', cursor: 'pointer', transition: 'all 0.2s'
                }}
                onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor = 'rgba(225,29,72,0.4)'; }}
                onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
                >
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(225,29,72,0.1)', color: '#e11d48', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                    <i className="ph-bold ph-plus" style={{ fontSize: '1.5rem' }}></i>
                  </div>
                  <span style={{ fontWeight: '600', color: '#e2e8f0' }}>Tambah Berita Baru</span>
                </div>

                {news.map(n => (
                  <div key={n.id} style={{ 
                    background: 'rgba(30, 41, 59, 0.4)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.05)', 
                    borderRadius: '16px', overflow: 'hidden', display: 'flex', flexDirection: 'column', transition: 'transform 0.2s',
                  }}>
                    <div style={{ position: 'relative', height: '180px' }}>
                      <img src={n.image_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <div style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', padding: '4px 8px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: '600', color: '#f8fafc' }}>
                        {n.date}
                      </div>
                    </div>
                    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                      <h3 style={{ fontSize: '1.1rem', margin: '0 0 16px 0', lineHeight: '1.4', color: '#f8fafc', fontWeight: '600' }}>{n.title}</h3>
                      <div style={{ marginTop: 'auto', display: 'flex', gap: '8px' }}>
                        <button style={{ flex: 1, padding: '8px', background: 'rgba(255,255,255,0.05)', color: '#f8fafc', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '600' }}>Edit</button>
                        <button style={{ padding: '8px 12px', background: 'rgba(225,29,72,0.1)', color: '#e11d48', border: 'none', borderRadius: '8px', cursor: 'pointer' }}><i className="ph-bold ph-trash"></i></button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'konten' && (
            <div className="fade-in">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' }}>
                <div>
                  <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '8px' }}>Pengaturan Halaman</h1>
                  <p style={{ color: '#94a3b8', fontSize: '1rem', maxWidth: '600px' }}>Sesuaikan teks, HTML, dan gambar banner untuk seluruh halaman di website secara dinamis.</p>
                </div>
                <button 
                  onClick={saveContents}
                  disabled={saving}
                  style={{ 
                    background: 'linear-gradient(135deg, #e11d48 0%, #be123c 100%)', color: 'white', 
                    padding: '14px 28px', borderRadius: '12px', border: 'none', cursor: 'pointer', 
                    fontWeight: '600', fontSize: '0.95rem', boxShadow: '0 4px 15px rgba(225, 29, 72, 0.3)',
                    display: 'flex', alignItems: 'center', gap: '8px', opacity: saving ? 0.7 : 1, transition: 'all 0.2s'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  {saving ? (
                    <><div style={{ width: '16px', height: '16px', borderRadius: '50%', border: '2px solid white', borderTopColor: 'transparent', animation: 'spin 1s linear infinite' }}></div> Menyimpan...</>
                  ) : (
                    <><i className="ph-bold ph-floppy-disk" style={{ fontSize: '1.2rem' }}></i> Simpan Perubahan</>
                  )}
                </button>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {pages.map((page) => (
                  <div key={page.id} style={{ 
                    background: 'rgba(30, 41, 59, 0.4)', 
                    backdropFilter: 'blur(12px)',
                    border: openAccordion === page.id ? '1px solid rgba(225, 29, 72, 0.3)' : '1px solid rgba(255, 255, 255, 0.05)', 
                    borderRadius: '16px', 
                    overflow: 'hidden',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}>
                    <button 
                      onClick={() => setOpenAccordion(openAccordion === page.id ? '' : page.id)}
                      style={{ 
                        width: '100%', padding: '20px 24px', textAlign: 'left', background: 'transparent', border: 'none', 
                        color: '#f8fafc', fontWeight: '600', fontSize: '1.1rem', cursor: 'pointer', 
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between' 
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ 
                          width: '40px', height: '40px', borderRadius: '10px', 
                          background: openAccordion === page.id ? 'rgba(225, 29, 72, 0.1)' : 'rgba(255,255,255,0.05)', 
                          color: openAccordion === page.id ? '#e11d48' : '#94a3b8',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          transition: 'all 0.2s'
                        }}>
                          <i className={`ph-duotone ${page.icon}`} style={{ fontSize: '1.3rem' }}></i>
                        </div>
                        {page.label}
                      </div>
                      <div style={{ 
                        width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transform: openAccordion === page.id ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s'
                      }}>
                        <i className="ph-bold ph-caret-down" style={{ fontSize: '0.9rem', color: '#94a3b8' }}></i>
                      </div>
                    </button>
                    
                    {/* Accordion Content */}
                    <div style={{ 
                      maxHeight: openAccordion === page.id ? '2000px' : '0', 
                      opacity: openAccordion === page.id ? 1 : 0,
                      overflow: 'hidden', 
                      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}>
                      <div style={{ padding: '0 24px 32px 24px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                        <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                          
                          {/* Hero Title */}
                          <div>
                            <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px', color: '#cbd5e1', fontSize: '0.9rem' }}>Judul Hero (Banner Atas)</label>
                            <input 
                              type="text" 
                              value={contents[`${page.id}_hero_title`] || ''}
                              onChange={(e) => setContents({...contents, [`${page.id}_hero_title`]: e.target.value})}
                              style={{ 
                                width: '100%', padding: '12px 16px', borderRadius: '10px', 
                                background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255,255,255,0.1)', 
                                color: 'white', fontSize: '0.95rem', outline: 'none', transition: 'border-color 0.2s' 
                              }}
                              onFocus={(e) => e.target.style.borderColor = '#e11d48'}
                              onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                            />
                          </div>
                          
                          {/* Hero Subtitle (Home Only) */}
                          {page.id === 'home' && (
                            <div>
                              <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px', color: '#cbd5e1', fontSize: '0.9rem' }}>Subjudul Hero</label>
                              <textarea 
                                value={contents['home_hero_subtitle'] || ''}
                                onChange={(e) => setContents({...contents, 'home_hero_subtitle': e.target.value})}
                                style={{ 
                                  width: '100%', padding: '16px', borderRadius: '10px', 
                                  background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255,255,255,0.1)', 
                                  color: 'white', fontSize: '0.95rem', outline: 'none', height: '100px', resize: 'vertical'
                                }}
                                onFocus={(e) => e.target.style.borderColor = '#e11d48'}
                                onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                              />
                            </div>
                          )}

                          {/* Banner Background */}
                          <div>
                            <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px', color: '#cbd5e1', fontSize: '0.9rem' }}>Background Banner</label>
                            <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                              {contents[`${page.id}_hero_bg`] ? (
                                <div style={{ position: 'relative', width: '200px', height: '120px', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                                  <img src={contents[`${page.id}_hero_bg`]} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                              ) : (
                                <div style={{ width: '200px', height: '120px', borderRadius: '12px', background: 'rgba(15,23,42,0.6)', border: '1px dashed rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', fontSize: '0.85rem' }}>No Image</div>
                              )}
                              
                              <div style={{ flex: 1 }}>
                                <label style={{ 
                                  display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 20px', 
                                  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', 
                                  borderRadius: '8px', cursor: 'pointer', color: '#f8fafc', fontSize: '0.9rem', fontWeight: '500', transition: 'all 0.2s'
                                }}
                                onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                                onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                                >
                                  <i className="ph-bold ph-upload-simple"></i> Upload Gambar Baru
                                  <input type="file" accept="image/*" onChange={(e) => handleUploadImage(e, (url) => setContents({...contents, [`${page.id}_hero_bg`]: url}))} style={{ display: 'none' }} />
                                </label>
                                <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '12px', lineHeight: '1.5' }}>Upload gambar format apapun (JPG/PNG). Sistem akan otomatis mengompresnya menjadi <b>.webp</b> untuk loading yang lebih cepat.</p>
                              </div>
                            </div>
                          </div>

                          {/* HTML Content */}
                          {page.id !== 'home' && (
                            <div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                <label style={{ fontWeight: '600', color: '#cbd5e1', fontSize: '0.9rem' }}>Source Code Konten (HTML)</label>
                                <span style={{ fontSize: '0.75rem', background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', padding: '4px 8px', borderRadius: '4px', fontWeight: '600' }}>Expert Mode</span>
                              </div>
                              <div style={{ position: 'relative' }}>
                                <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: '40px', background: 'rgba(0,0,0,0.2)', borderRight: '1px solid rgba(255,255,255,0.05)', borderTopLeftRadius: '10px', borderBottomLeftRadius: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '16px', color: '#475569', fontSize: '0.75rem', fontFamily: 'monospace' }}>
                                  1<br/>2<br/>3<br/>4<br/>5
                                </div>
                                <textarea 
                                  value={contents[`${page.id}_html`] || ''}
                                  onChange={(e) => setContents({...contents, [`${page.id}_html`]: e.target.value})}
                                  style={{ 
                                    width: '100%', padding: '16px 16px 16px 56px', borderRadius: '10px', 
                                    background: '#020617', border: '1px solid rgba(255,255,255,0.1)', 
                                    color: '#38bdf8', fontSize: '0.85rem', outline: 'none', height: '400px', resize: 'vertical',
                                    fontFamily: '"Fira Code", "Consolas", monospace', whiteSpace: 'pre', lineHeight: '1.6'
                                  }}
                                  onFocus={(e) => e.target.style.borderColor = '#38bdf8'}
                                  onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                                  spellCheck="false"
                                />
                              </div>
                              <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '12px', lineHeight: '1.5' }}><i className="ph-fill ph-warning-circle" style={{ color: '#f59e0b' }}></i> <b>Perhatian:</b> Mode HTML mentah. Pastikan tag pembuka <code>&lt;div&gt;</code> memiliki penutup <code>&lt;/div&gt;</code> yang sesuai agar layout tidak berantakan.</p>
                            </div>
                          )}

                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
              </div>
            </div>
          )}
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .fade-in { animation: fadeIn 0.4s ease-out forwards; }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        /* Custom scrollbar for dark theme */
        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-track { background: rgba(0,0,0,0.1); }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
      `}} />
    </div>
  );
}
