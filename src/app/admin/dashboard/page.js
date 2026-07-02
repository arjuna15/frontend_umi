'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('news_management');
  const [news, setNews] = useState([]);
  const [contents, setContents] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [newsModalOpen, setNewsModalOpen] = useState(false);
  const [editingNews, setEditingNews] = useState(null);
  const [newsForm, setNewsForm] = useState({ title: '', date: '', image_url: '', source: '' });

  const pages = [
    { id: 'home', label: 'Home / Beranda', icon: 'ph-house' },
    { id: 'profil', label: 'Profil Universitas', icon: 'ph-buildings' },
    { id: 'akademik', label: 'Akademik', icon: 'ph-graduation-cap' },
    { id: 'berita-hero', label: 'Banner Berita', icon: 'ph-newspaper' },
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
    const headers = { 
      'Accept': 'application/json',
      ...options.headers, 
      'Authorization': `Bearer ${token}` 
    };
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
    
    const newsRes = await fetchAuth(`${api}/admin/news`);
    if (newsRes && newsRes.ok) setNews(await newsRes.json());
    
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

    // Compress di frontend pake Canvas
    const canvas = document.createElement('canvas');
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = async () => {
      let width = img.width;
      let height = img.height;
      if (width > 1600) {
        height = Math.round((1600 * height) / width);
        width = 1600;
      }
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(async (blob) => {
        if (!blob) {
          alert('Gagal memproses gambar');
          return;
        }
        const formData = new FormData();
        formData.append('image', blob, file.name.replace(/\.[^/.]+$/, "") + ".webp");

        const api = process.env.NEXT_PUBLIC_API_URL || 'https://backend.bikinwebdikitaaja.com/api';
        try {
          const res = await fetchAuth(`${api}/admin/upload-image`, {
            method: 'POST',
            body: formData
          });

          if (res && res.ok) {
            const data = await res.json();
            setUrlCallback(data.url);
          } else {
            const errData = await res.json().catch(() => ({}));
            alert(`Upload gagal: ${errData.message || res?.statusText || 'Server Error'}`);
          }
        } catch(err) {
          alert('Upload gagal: tidak bisa connect ke server');
        }
      }, 'image/webp', 0.8);
    };
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
      alert('Konten berhasil disimpan');
    }
  };

  const handleOpenNewsModal = (newsItem = null) => {
    if (newsItem) {
      setEditingNews(newsItem.id);
      setNewsForm({
        title: newsItem.title || '',
        date: newsItem.date || '',
        image_url: newsItem.image_url || '',
        source: newsItem.source || ''
      });
    } else {
      setEditingNews(null);
      setNewsForm({ title: '', date: '', image_url: '', source: '' });
    }
    setNewsModalOpen(true);
  };

  const handleSaveNews = async (e) => {
    e.preventDefault();
    const api = process.env.NEXT_PUBLIC_API_URL || 'https://backend.bikinwebdikitaaja.com/api';
    const method = editingNews ? 'PUT' : 'POST';
    const url = editingNews ? `${api}/admin/news/${editingNews}` : `${api}/admin/news`;
    
    const res = await fetchAuth(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newsForm)
    });

    if (res && res.ok) {
      setNewsModalOpen(false);
      loadData();
    } else {
      alert('Gagal menyimpan berita');
    }
  };

  const handleDeleteNews = async (id) => {
    if (!confirm('Yakin ingin menghapus berita ini?')) return;
    const api = process.env.NEXT_PUBLIC_API_URL || 'https://backend.bikinwebdikitaaja.com/api';
    const res = await fetchAuth(`${api}/admin/news/${id}`, { method: 'DELETE' });
    if (res && res.ok) loadData();
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '3px solid #e2e8f0', borderTopColor: '#e11d48', animation: 'spin 1s linear infinite' }}></div>
        <div style={{ color: '#64748b', fontSize: '0.9rem', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: '600' }}>Authenticating...</div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );

  const activePageObj = pages.find(p => p.id === activeTab);
  const isNewsTab = activeTab === 'news_management';

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc', color: '#0f172a', fontFamily: '"Inter", sans-serif', position: 'relative' }}>
      
      {/* Mobile Header / Hamburger */}
      <div className="mobile-header" style={{ position: 'fixed', top: 0, left: 0, right: 0, height: '60px', background: 'white', borderBottom: '1px solid #e2e8f0', zIndex: 50, display: 'none', alignItems: 'center', padding: '0 20px', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ background: '#e11d48', padding: '6px', borderRadius: '8px' }}>
            <i className="ph ph-fill ph-shield-check" style={{ color: 'white' }}></i>
          </div>
          <span style={{ fontWeight: '700' }}>Admin UMIBA</span>
        </div>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: 'transparent', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>
          <i className={`ph-bold ${sidebarOpen ? 'ph-x' : 'ph-list'}`}></i>
        </button>
      </div>

      {/* Sidebar Overlay (Mobile) */}
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 40 }} />
      )}

      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? 'open' : ''}`} style={{ 
        width: '280px', 
        background: 'white', 
        borderRight: '1px solid #e2e8f0',
        display: 'flex', 
        flexDirection: 'column',
        position: 'fixed',
        top: 0, left: 0, bottom: 0,
        zIndex: 45,
        transition: 'transform 0.3s ease'
      }}>
        <div className="desktop-logo" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid #f1f5f9' }}>
          <div style={{ background: '#e11d48', padding: '10px', borderRadius: '12px', boxShadow: '0 4px 10px rgba(225, 29, 72, 0.2)' }}>
            <i className="ph ph-fill ph-shield-check" style={{ fontSize: '1.5rem', color: 'white' }}></i>
          </div>
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: '800', margin: 0, color: '#0f172a' }}>UMIBA</h2>
            <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Admin Portal</div>
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 16px' }}>
          
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '700', marginBottom: '12px', paddingLeft: '8px' }}>Sistem</div>
          <button 
            onClick={() => { setActiveTab('news_management'); setSidebarOpen(false); }} 
            style={{ 
              width: '100%', display: 'flex', alignItems: 'center', gap: '12px', textAlign: 'left', padding: '10px 12px', 
              background: isNewsTab ? '#fff1f2' : 'transparent', 
              color: isNewsTab ? '#e11d48' : '#475569', 
              border: 'none', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s', fontWeight: isNewsTab ? '700' : '500',
              marginBottom: '24px'
            }}
          >
            <i className="ph ph-duotone ph-newspaper-clipping" style={{ fontSize: '1.25rem' }}></i>
            Kelola Berita Baru
          </button>

          <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '700', marginBottom: '12px', paddingLeft: '8px' }}>Halaman Konten</div>
          
          {pages.map(page => (
            <button 
              key={page.id}
              onClick={() => { setActiveTab(page.id); setSidebarOpen(false); }} 
              style={{ 
                width: '100%', display: 'flex', alignItems: 'center', gap: '12px', textAlign: 'left', padding: '10px 12px', 
                background: activeTab === page.id ? '#fff1f2' : 'transparent', 
                color: activeTab === page.id ? '#e11d48' : '#475569', 
                border: 'none', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s', fontWeight: activeTab === page.id ? '700' : '500',
                marginBottom: '4px'
              }}
            >
              <i className={`ph-duotone ${page.icon}`} style={{ fontSize: '1.25rem' }}></i>
              {page.label}
            </button>
          ))}
        </div>

        <div style={{ padding: '16px', borderTop: '1px solid #f1f5f9', background: 'white' }}>
          <button 
            onClick={handleLogout} 
            style={{ 
              width: '100%', padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              background: '#f8fafc', color: '#64748b', border: '1px solid #e2e8f0', 
              borderRadius: '8px', cursor: 'pointer', fontWeight: '600', transition: 'all 0.2s' 
            }}
          >
            <i className="ph ph-bold ph-sign-out"></i> Logout
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="main-content" style={{ flex: 1, marginLeft: '280px', padding: '40px', minHeight: '100vh', transition: 'margin 0.3s ease' }}>
        
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          {isNewsTab ? (
            <div className="fade-in">
              <div style={{ marginBottom: '40px' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '8px', color: '#0f172a' }}>Kelola Berita</h1>
                <p style={{ color: '#64748b', fontSize: '1rem' }}>Manajemen publikasi berita dan pengumuman kampus.</p>
              </div>
              
              <div style={{ 
                display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' 
              }}>
                <div 
                  onClick={() => handleOpenNewsModal()}
                  style={{ 
                  background: 'white', border: '2px dashed #cbd5e1', 
                  borderRadius: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  minHeight: '280px', cursor: 'pointer', transition: 'all 0.2s'
                }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#fff1f2', color: '#e11d48', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                    <i className="ph ph-bold ph-plus" style={{ fontSize: '1.5rem' }}></i>
                  </div>
                  <span style={{ fontWeight: '600', color: '#475569' }}>Tambah Berita Baru</span>
                </div>

                {news.map(n => (
                  <div key={n.id} style={{ 
                    background: 'white', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
                    borderRadius: '16px', overflow: 'hidden', display: 'flex', flexDirection: 'column'
                  }}>
                    <div style={{ position: 'relative', height: '160px' }}>
                      <img src={n.image_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <div style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(4px)', padding: '4px 8px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: '700', color: '#e11d48' }}>
                        {n.date}
                      </div>
                    </div>
                    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                      <h3 style={{ fontSize: '1.1rem', margin: '0 0 16px 0', lineHeight: '1.4', color: '#0f172a', fontWeight: '700' }}>{n.title}</h3>
                      <div style={{ marginTop: 'auto', display: 'flex', gap: '8px' }}>
                        <button onClick={() => handleOpenNewsModal(n)} style={{ flex: 1, padding: '8px', background: '#f1f5f9', color: '#475569', border: '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '600' }}>Edit</button>
                        <button onClick={() => handleDeleteNews(n.id)} style={{ padding: '8px 12px', background: '#fff1f2', color: '#e11d48', border: 'none', borderRadius: '8px', cursor: 'pointer' }}><i className="ph ph-bold ph-trash"></i></button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="fade-in">
              <div className="header-flex" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
                <div>
                  <h1 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '8px', color: '#0f172a' }}>{activePageObj?.label}</h1>
                  <p style={{ color: '#64748b', fontSize: '1rem', maxWidth: '600px' }}>Sesuaikan gambar banner dan kode HTML konten khusus untuk halaman ini.</p>
                </div>
                <button 
                  onClick={saveContents}
                  disabled={saving}
                  style={{ 
                    background: '#e11d48', color: 'white', padding: '12px 24px', borderRadius: '8px', border: 'none', 
                    cursor: 'pointer', fontWeight: '600', fontSize: '0.95rem', boxShadow: '0 4px 10px rgba(225, 29, 72, 0.2)',
                    display: 'flex', alignItems: 'center', gap: '8px', opacity: saving ? 0.7 : 1, transition: 'all 0.2s',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {saving ? (
                    <><div style={{ width: '16px', height: '16px', borderRadius: '50%', border: '2px solid white', borderTopColor: 'transparent', animation: 'spin 1s linear infinite' }}></div> Menyimpan...</>
                  ) : (
                    <><i className="ph ph-bold ph-floppy-disk" style={{ fontSize: '1.2rem' }}></i> Simpan Halaman</>
                  )}
                </button>
              </div>
              
              <div style={{ background: 'white', borderRadius: '16px', padding: '32px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                  
                  {/* Hero Title */}
                  <div>
                    <label style={{ display: 'block', fontWeight: '700', marginBottom: '8px', color: '#334155', fontSize: '0.95rem' }}>Judul Hero (Banner Atas)</label>
                    <input 
                      type="text" 
                      value={contents[`${activeTab}_hero_title`] || ''}
                      onChange={(e) => setContents({...contents, [`${activeTab}_hero_title`]: e.target.value})}
                      style={{ 
                        width: '100%', padding: '12px 16px', borderRadius: '8px', 
                        background: '#f8fafc', border: '1px solid #cbd5e1', 
                        color: '#0f172a', fontSize: '1rem', outline: 'none' 
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#e11d48'}
                      onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
                    />
                  </div>
                  
                  {/* Hero Subtitle (Home Only) */}
                  {activeTab === 'home' && (
                    <div>
                      <label style={{ display: 'block', fontWeight: '700', marginBottom: '8px', color: '#334155', fontSize: '0.95rem' }}>Subjudul Hero</label>
                      <textarea 
                        value={contents['home_hero_subtitle'] || ''}
                        onChange={(e) => setContents({...contents, 'home_hero_subtitle': e.target.value})}
                        style={{ 
                          width: '100%', padding: '16px', borderRadius: '8px', 
                          background: '#f8fafc', border: '1px solid #cbd5e1', 
                          color: '#0f172a', fontSize: '1rem', outline: 'none', height: '100px', resize: 'vertical'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#e11d48'}
                        onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
                      />
                    </div>
                  )}

                  {/* Banner Background */}
                  <div>
                    <label style={{ display: 'block', fontWeight: '700', marginBottom: '8px', color: '#334155', fontSize: '0.95rem' }}>Background Banner</label>
                    <div className="banner-flex" style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
                      {contents[`${activeTab}_hero_bg`] ? (
                        <div style={{ position: 'relative', width: '280px', height: '140px', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                          <img src={contents[`${activeTab}_hero_bg`]} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                      ) : (
                        <div style={{ width: '280px', height: '140px', borderRadius: '12px', background: '#f8fafc', border: '1px dashed #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: '0.9rem', fontWeight: '500' }}>Tidak ada gambar</div>
                      )}
                      
                      <div style={{ flex: 1 }}>
                        <label style={{ 
                          display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 20px', 
                          background: 'white', border: '1px solid #cbd5e1', boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                          borderRadius: '8px', cursor: 'pointer', color: '#0f172a', fontSize: '0.9rem', fontWeight: '600'
                        }}>
                          <i className="ph ph-bold ph-upload-simple" style={{ color: '#e11d48' }}></i> Pilih Gambar Baru
                          <input type="file" accept="image/*" onChange={(e) => handleUploadImage(e, (url) => setContents({...contents, [`${activeTab}_hero_bg`]: url}))} style={{ display: 'none' }} />
                        </label>
                        <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '12px', lineHeight: '1.6' }}>Upload gambar (JPG/PNG). Sistem akan otomatis mengompresnya menjadi <b>.webp</b> untuk akses website yang lebih ringan.</p>
                      </div>
                    </div>
                  </div>

                  {/* HTML Content */}
                  {activeTab !== 'home' && (
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <label style={{ fontWeight: '700', color: '#334155', fontSize: '0.95rem' }}>Source Code Konten (HTML)</label>
                      </div>
                      <div style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', border: '1px solid #cbd5e1' }}>
                        <textarea 
                          value={contents[`${activeTab}_html`] || ''}
                          onChange={(e) => setContents({...contents, [`${activeTab}_html`]: e.target.value})}
                          style={{ 
                            width: '100%', padding: '24px', 
                            background: '#1e293b', border: 'none', 
                            color: '#38bdf8', fontSize: '0.9rem', outline: 'none', height: '500px', resize: 'vertical',
                            fontFamily: '"Fira Code", "Consolas", monospace', whiteSpace: 'pre', lineHeight: '1.6'
                          }}
                          spellCheck="false"
                        />
                      </div>
                      <div style={{ display: 'flex', gap: '8px', marginTop: '12px', alignItems: 'flex-start' }}>
                        <i className="ph ph-fill ph-warning-circle" style={{ color: '#f59e0b', fontSize: '1.2rem', marginTop: '2px' }}></i>
                        <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0, lineHeight: '1.6' }}><b>Perhatian:</b> Anda sedang mengedit <i>raw HTML</i>. Pastikan setiap tag pembuka seperti <code>&lt;div&gt;</code> memiliki tag penutup <code>&lt;/div&gt;</code> yang benar agar struktur web tidak hancur.</p>
                      </div>
                    </div>
                  )}

                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* News Modal */}
      {newsModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="fade-in" style={{ background: 'white', borderRadius: '16px', width: '100%', maxWidth: '600px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)', overflow: 'hidden' }}>
            <div style={{ padding: '24px 32px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '800', margin: 0, color: '#0f172a' }}>{editingNews ? 'Edit Berita' : 'Tambah Berita Baru'}</h2>
              <button onClick={() => setNewsModalOpen(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                <i className="ph ph-bold ph-x" style={{ fontSize: '1.25rem' }}></i>
              </button>
            </div>
            <form onSubmit={handleSaveNews} style={{ padding: '32px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                
                <div>
                  <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px', color: '#334155', fontSize: '0.9rem' }}>Judul Berita</label>
                  <input 
                    type="text" 
                    required
                    value={newsForm.title}
                    onChange={(e) => setNewsForm({...newsForm, title: e.target.value})}
                    style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', background: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a', outline: 'none' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div>
                    <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px', color: '#334155', fontSize: '0.9rem' }}>Tanggal Berita</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Contoh: 12 Agustus 2026"
                      value={newsForm.date}
                      onChange={(e) => setNewsForm({...newsForm, date: e.target.value})}
                      style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', background: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a', outline: 'none' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px', color: '#334155', fontSize: '0.9rem' }}>Sumber / Link (Opsional)</label>
                    <input 
                      type="text" 
                      value={newsForm.source}
                      onChange={(e) => setNewsForm({...newsForm, source: e.target.value})}
                      style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', background: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a', outline: 'none' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px', color: '#334155', fontSize: '0.9rem' }}>Gambar Cover</label>
                  {newsForm.image_url && (
                    <img src={newsForm.image_url} alt="preview" style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: '8px', marginBottom: '12px', border: '1px solid #e2e8f0' }} />
                  )}
                  <label style={{ 
                    display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 20px', 
                    background: 'white', border: '1px solid #cbd5e1', boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                    borderRadius: '8px', cursor: 'pointer', color: '#0f172a', fontSize: '0.9rem', fontWeight: '600'
                  }}>
                    <i className="ph ph-bold ph-upload-simple" style={{ color: '#e11d48' }}></i> {newsForm.image_url ? 'Ganti Gambar' : 'Pilih Gambar Baru'}
                    <input type="file" accept="image/*" onChange={(e) => handleUploadImage(e, (url) => setNewsForm({...newsForm, image_url: url}))} style={{ display: 'none' }} />
                  </label>
                </div>
                
              </div>
              
              <div style={{ display: 'flex', gap: '12px', marginTop: '32px', paddingTop: '24px', borderTop: '1px solid #e2e8f0' }}>
                <button type="button" onClick={() => setNewsModalOpen(false)} style={{ flex: 1, padding: '12px', background: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>Batal</button>
                <button type="submit" style={{ flex: 1, padding: '12px', background: '#e11d48', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', boxShadow: '0 4px 10px rgba(225, 29, 72, 0.2)' }}>Simpan Berita</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        .fade-in { animation: fadeIn 0.4s ease-out forwards; }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: none; }
        }
        
        /* Mobile Responsiveness */
        @media (max-width: 1024px) {
          .mobile-header { display: flex !important; }
          .desktop-logo { display: none !important; }
          .sidebar { transform: translateX(-100%); }
          .sidebar.open { transform: translateX(0); }
          .main-content { margin-left: 0 !important; padding: 100px 20px 40px 20px !important; }
          .header-flex { flex-direction: column; align-items: flex-start !important; gap: 20px; }
          .banner-flex { flex-direction: column; }
        }
      `}} />
    </div>
  );
}
