'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('berita');
  const [news, setNews] = useState([]);
  const [contents, setContents] = useState({});
  const [loading, setLoading] = useState(true);

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
        <button onClick={() => setActiveTab('konten')} style={{ textAlign: 'left', padding: '10px', background: activeTab === 'konten' ? '#1e293b' : 'transparent', color: 'white', border: 'none', borderRadius: '4px', marginBottom: '8px', cursor: 'pointer' }}>Teks & Banner</button>
        <div style={{ marginTop: 'auto' }}>
          <button onClick={handleLogout} style={{ width: '100%', padding: '10px', background: '#b91c1c', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Logout</button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: '40px' }}>
        {activeTab === 'berita' && (
          <div>
            <h2 style={{ marginBottom: '20px' }}>Kelola Berita</h2>
            {/* Note: In a real app we'd have a full form here. Keeping it brief for now. */}
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
            <h2 style={{ marginBottom: '20px' }}>Teks & Banner Halaman Utama</h2>
            <div style={{ background: 'white', padding: '24px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>Judul Utama (Home)</label>
                <input 
                  type="text" 
                  value={contents['home_hero_title'] || ''}
                  onChange={(e) => setContents({...contents, home_hero_title: e.target.value})}
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>Subjudul (Home)</label>
                <textarea 
                  value={contents['home_hero_subtitle'] || ''}
                  onChange={(e) => setContents({...contents, home_hero_subtitle: e.target.value})}
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1', height: '80px' }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>Background Banner (Home)</label>
                {contents['home_hero_bg'] && <img src={contents['home_hero_bg']} alt="preview" style={{ height: '100px', marginBottom: '8px', borderRadius: '4px', display: 'block' }} />}
                <input type="file" accept="image/*" onChange={(e) => handleUploadImage(e, (url) => setContents({...contents, home_hero_bg: url}))} />
                <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '4px' }}>Akan otomatis dikonversi ke WebP</p>
              </div>

              <hr style={{ margin: '30px 0', borderColor: '#e2e8f0' }} />

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>Judul Halaman Profil</label>
                <input 
                  type="text" 
                  value={contents['profil_hero_title'] || ''}
                  onChange={(e) => setContents({...contents, profil_hero_title: e.target.value})}
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>Background Banner (Profil)</label>
                {contents['profil_hero_bg'] && <img src={contents['profil_hero_bg']} alt="preview" style={{ height: '100px', marginBottom: '8px', borderRadius: '4px', display: 'block' }} />}
                <input type="file" accept="image/*" onChange={(e) => handleUploadImage(e, (url) => setContents({...contents, profil_hero_bg: url}))} />
              </div>

              <button 
                onClick={saveContents}
                style={{ background: '#b91c1c', color: 'white', padding: '10px 20px', borderRadius: '4px', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}
              >
                Simpan Semua Perubahan
              </button>

            </div>
          </div>
        )}
      </div>
    </div>
  );
}
