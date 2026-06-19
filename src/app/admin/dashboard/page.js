'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('berita');
  const [news, setNews] = useState([]);
  const [contents, setContents] = useState({});
  const [loading, setLoading] = useState(true);
  const [openAccordion, setOpenAccordion] = useState('');

  const pages = [
    { id: 'home', label: 'Home / Beranda' },
    { id: 'profil', label: 'Profil Universitas' },
    { id: 'akademik', label: 'Akademik' },
    { id: 'berita', label: 'Berita (Hero)' },
    { id: 'dokumen', label: 'Dokumen' },
    { id: 'fasilitas', label: 'Fasilitas' },
    { id: 'informasi', label: 'Informasi' },
    { id: 'kegiatan-dosen', label: 'Kegiatan Dosen' },
    { id: 'kurikulum', label: 'Kurikulum' },
    { id: 'lppm', label: 'LPPM' },
    { id: 'mutu', label: 'Penjaminan Mutu' },
    { id: 'prodi-aktuaria', label: 'Prodi Aktuaria' },
    { id: 'prodi-hukum', label: 'Prodi Hukum' },
    { id: 'prodi-komputer', label: 'Prodi Komputer' },
    { id: 'prodi-magister', label: 'Prodi Magister' },
    { id: 'prodi-manajemen', label: 'Prodi Manajemen' },
    { id: 'prodi-sistem', label: 'Prodi Sistem TI' }
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
      alert('Upload sukses (dikompres otomatis ke WebP)');
    } else {
      alert('Upload gagal');
    }
  };

  const saveContents = async () => {
    const api = process.env.NEXT_PUBLIC_API_URL || 'https://backend.bikinwebdikitaaja.com/api';
    const res = await fetchAuth(`${api}/admin/contents`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents })
    });
    if (res && res.ok) alert('Konten berhasil disimpan');
  };

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc' }}>
      {/* Sidebar */}
      <div style={{ width: '250px', background: '#0f172a', color: 'white', padding: '20px', display: 'flex', flexDirection: 'column' }}>
        <h2 style={{ marginBottom: '40px', color: '#f8fafc' }}>Admin UMIBA</h2>
        <button onClick={() => setActiveTab('berita')} style={{ textAlign: 'left', padding: '10px', background: activeTab === 'berita' ? '#1e293b' : 'transparent', color: 'white', border: 'none', borderRadius: '4px', marginBottom: '8px', cursor: 'pointer' }}>Berita</button>
        <button onClick={() => setActiveTab('konten')} style={{ textAlign: 'left', padding: '10px', background: activeTab === 'konten' ? '#1e293b' : 'transparent', color: 'white', border: 'none', borderRadius: '4px', marginBottom: '8px', cursor: 'pointer' }}>Pengaturan Halaman</button>
        <div style={{ marginTop: 'auto' }}>
          <button onClick={handleLogout} style={{ width: '100%', padding: '10px', background: '#b91c1c', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Logout</button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: '40px', height: '100vh', overflowY: 'auto' }}>
        {activeTab === 'berita' && (
          <div>
            <h2 style={{ marginBottom: '20px' }}>Kelola Berita</h2>
            <p>Daftar berita dapat dikelola di sini.</p>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              {news.map(n => (
                <div key={n.id} style={{ background: 'white', padding: '16px', borderRadius: '8px', width: '300px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                  <img src={n.image_url} alt="" style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '4px' }} />
                  <h3 style={{ fontSize: '1.1rem', margin: '12px 0 8px 0' }}>{n.title}</h3>
                  <p style={{ fontSize: '0.8rem', color: '#64748b' }}>{n.date}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'konten' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2>Pengaturan Halaman (Teks & HTML)</h2>
              <button 
                onClick={saveContents}
                style={{ background: '#b91c1c', color: 'white', padding: '10px 20px', borderRadius: '4px', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}
              >
                Simpan Semua Perubahan
              </button>
            </div>
            
            <div style={{ background: 'white', padding: '24px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <p style={{ marginBottom: '24px', color: '#64748b' }}>Pilih halaman yang ingin diedit di bawah ini. Anda dapat mengedit Judul Hero, Banner Background, dan Keseluruhan Konten HTML untuk setiap halamannya.</p>
              
              {pages.map((page) => (
                <div key={page.id} style={{ marginBottom: '16px', border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
                  <button 
                    onClick={() => setOpenAccordion(openAccordion === page.id ? '' : page.id)}
                    style={{ width: '100%', padding: '16px', textAlign: 'left', background: '#f8fafc', border: 'none', borderBottom: openAccordion === page.id ? '1px solid #e2e8f0' : 'none', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer', display: 'flex', justifyContent: 'space-between' }}
                  >
                    {page.label}
                    <span>{openAccordion === page.id ? '▲' : '▼'}</span>
                  </button>
                  
                  {openAccordion === page.id && (
                    <div style={{ padding: '20px', background: 'white' }}>
                      
                      <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>Judul Hero (Banner Atas)</label>
                        <input 
                          type="text" 
                          value={contents[`${page.id}_hero_title`] || ''}
                          onChange={(e) => setContents({...contents, [`${page.id}_hero_title`]: e.target.value})}
                          style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                        />
                      </div>
                      
                      {page.id === 'home' && (
                        <div style={{ marginBottom: '20px' }}>
                          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>Subjudul Hero</label>
                          <textarea 
                            value={contents['home_hero_subtitle'] || ''}
                            onChange={(e) => setContents({...contents, 'home_hero_subtitle': e.target.value})}
                            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #cbd5e1', height: '60px' }}
                          />
                        </div>
                      )}

                      <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>Banner Background</label>
                        {contents[`${page.id}_hero_bg`] && <img src={contents[`${page.id}_hero_bg`]} alt="preview" style={{ height: '100px', marginBottom: '8px', borderRadius: '4px', display: 'block' }} />}
                        <input type="file" accept="image/*" onChange={(e) => handleUploadImage(e, (url) => setContents({...contents, [`${page.id}_hero_bg`]: url}))} />
                      </div>

                      {page.id !== 'home' && (
                        <div style={{ marginBottom: '20px' }}>
                          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>Isi Konten Halaman (HTML)</label>
                          <textarea 
                            value={contents[`${page.id}_html`] || ''}
                            onChange={(e) => setContents({...contents, [`${page.id}_html`]: e.target.value})}
                            style={{ width: '100%', padding: '12px', borderRadius: '4px', border: '1px solid #cbd5e1', height: '400px', fontFamily: 'monospace', fontSize: '0.9rem', whiteSpace: 'pre' }}
                          />
                          <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '8px' }}>*Hati-hati saat mengedit kode HTML. Pastikan tag HTML tidak rusak.</p>
                        </div>
                      )}

                    </div>
                  )}
                </div>
              ))}
              
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
