"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ModalShell from '../../components/ModalShell';

export default function PerpustakaanPage() {
  const router = useRouter();
  const [config, setConfig] = useState({ base_url: '', api_key: '' });
  const [connected, setConnected] = useState(false);
  const [lastSync, setLastSync] = useState(null);
  const [stats, setStats] = useState({ total_collections: 0, borrowed: 0, active_members: 0, digital: 0 });
  const [searchQuery, setSearchQuery] = useState('');
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [testing, setTesting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [configForm, setConfigForm] = useState({ base_url: '', api_key: '' });

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
  const getToken = () => localStorage.getItem('siakad_token');

  const fetchData = async () => {
    const token = getToken();
    if (!token) return router.push('/siakad/login');
    try {
      const [cRes, sRes] = await Promise.all([
        fetch(`${apiUrl}/siakad/perpustakaan/config`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${apiUrl}/siakad/perpustakaan/stats`, { headers: { 'Authorization': `Bearer ${token}` } })
      ]);
      if (cRes.ok) {
        const d = await cRes.json(); const c = d.data || d.config || d;
        setConfig({ base_url: c.base_url || '', api_key: c.api_key || '' });
        setConfigForm({ base_url: c.base_url || '', api_key: c.api_key || '' });
        setConnected(c.connected || c.is_connected || false);
        setLastSync(c.last_sync || null);
      }
      if (sRes.ok) {
        const d = await sRes.json(); const s = d.data || d.stats || d;
        setStats({ total_collections: s.total_collections || s.total || 0, borrowed: s.borrowed || 0, active_members: s.active_members || 0, digital: s.digital || 0 });
      }
    } catch (e) { setMessage({ text: 'Gagal memuat data perpustakaan.', type: 'error' }); }
    finally { setLoading(false); }
  };

  const testConnection = async () => {
    setTesting(true);
    try {
      const res = await fetch(`${apiUrl}/siakad/perpustakaan/test`, { method: 'POST', headers: { 'Authorization': `Bearer ${getToken()}` } });
      const d = await res.json();
      if (res.ok && (d.success || d.connected)) {
        setConnected(true);
        setMessage({ text: 'Koneksi ke sLimS berhasil!', type: 'success' });
      } else { setConnected(false); setMessage({ text: d.message || 'Koneksi gagal.', type: 'error' }); }
    } catch (e) { setConnected(false); setMessage({ text: 'Gagal menguji koneksi.', type: 'error' }); }
    finally { setTesting(false); }
  };

  const saveConfig = async () => {
    setSaving(true);
    try {
      const res = await fetch(`${apiUrl}/siakad/perpustakaan/config`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` }, body: JSON.stringify(configForm) });
      if (!res.ok) throw new Error('Failed');
      setConfig(configForm);
      setMessage({ text: 'Konfigurasi berhasil disimpan!', type: 'success' });
      setShowConfigModal(false);
    } catch (e) { setMessage({ text: 'Gagal menyimpan konfigurasi.', type: 'error' }); }
    finally { setSaving(false); }
  };

  const searchCatalog = async () => {
    if (!searchQuery.trim()) return;
    setSearching(true);
    try {
      const res = await fetch(`${apiUrl}/siakad/perpustakaan/search?q=${encodeURIComponent(searchQuery)}`, { headers: { 'Authorization': `Bearer ${getToken()}` } });
      if (res.ok) { const d = await res.json(); setBooks(d.data || d.books || d.results || []); }
    } catch (e) { setMessage({ text: 'Gagal mencari katalog.', type: 'error' }); }
    finally { setSearching(false); }
  };

  useEffect(() => { if (!getToken()) router.push('/siakad/login'); else fetchData(); }, []);

  if (loading) return (
    <div style={{ padding: '24px' }}>
      <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--color-text)', margin: '0 0 24px 0' }}>Memuat Perpustakaan...</h1>
      <div className="siakad-card" style={{ padding: '24px', height: '200px' }}></div>
    </div>
  );

  const statCards = [
    { label: 'Total Koleksi', value: stats.total_collections, icon: 'ph ph-books', color: '#3b82f6', bg: 'rgba(59,130,246,0.1)' },
    { label: 'Buku Dipinjam', value: stats.borrowed, icon: 'ph ph-book-open', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
    { label: 'Anggota Aktif', value: stats.active_members, icon: 'ph ph-users', color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
    { label: 'Koleksi Digital', value: stats.digital, icon: 'ph ph-file-pdf', color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)' },
  ];

  return (
    <div className="fade-in">
      <div className="siakad-page-header">
        <div className="siakad-page-header-glow"></div>
        <div className="siakad-page-header-grid"></div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', margin: '0 0 8px 0', letterSpacing: '0.1em', textTransform: 'uppercase' }}>SIAKAD — PERPUSTAKAAN</p>
          <h1 style={{ color: 'white', fontSize: '2.2rem', fontWeight: '800', margin: '0 0 8px 0', letterSpacing: '-0.03em' }}>Integrasi Perpustakaan</h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', margin: 0 }}>Integrasi dengan sistem perpustakaan sLimS untuk pencarian dan monitoring.</p>
        </div>
      </div>

      {message.text && (
        <div style={{ padding: '16px 20px', borderRadius: '12px', marginBottom: '24px', background: message.type === 'success' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', border: `1px solid ${message.type === 'success' ? '#10b981' : '#ef4444'}`, color: message.type === 'success' ? '#10b981' : '#ef4444', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <i className={message.type === 'success' ? "ph-fill ph-check-circle" : "ph-fill ph-warning-circle"} style={{ fontSize: '1.4rem' }}></i>
          {message.text}
        </div>
      )}

      {/* Connection Status + Config */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        <div className="siakad-card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--color-text)', margin: '0 0 20px 0' }}>Status Koneksi sLimS</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: connected ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
              <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: connected ? '#10b981' : '#ef4444', boxShadow: `0 0 12px ${connected ? '#10b981' : '#ef4444'}60` }}></div>
            </div>
            <div>
              <p style={{ margin: '0 0 2px', fontWeight: '700', fontSize: '1.1rem', color: connected ? '#10b981' : '#ef4444' }}>{connected ? 'Terhubung' : 'Tidak Terhubung'}</p>
              <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--color-muted)' }}>{lastSync ? `Sinkronisasi terakhir: ${lastSync}` : 'Belum pernah sinkronisasi'}</p>
            </div>
          </div>
          {config.base_url && (
            <div style={{ padding: '12px 16px', background: 'var(--color-bg)', borderRadius: '10px', marginBottom: '16px' }}>
              <p style={{ margin: '0 0 4px', fontSize: '0.8rem', color: 'var(--color-muted)', fontWeight: '600' }}>Base URL</p>
              <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-text)', fontFamily: 'monospace', wordBreak: 'break-all' }}>{config.base_url}</p>
            </div>
          )}
          <div style={{ display: 'flex', gap: '10px' }}>
            <button id="btn-test-connection" onClick={testConnection} disabled={testing} style={{ background: 'rgba(59,130,246,0.1)', color: '#3b82f6', border: '1px solid rgba(59,130,246,0.3)', padding: '10px 18px', borderRadius: '30px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem' }}>
              <i className="ph ph-plugs-connected"></i> {testing ? 'Menguji...' : 'Test Koneksi'}
            </button>
            <button id="btn-edit-config" onClick={() => setShowConfigModal(true)} style={{ background: 'rgba(139,92,246,0.1)', color: '#8b5cf6', border: '1px solid rgba(139,92,246,0.3)', padding: '10px 18px', borderRadius: '30px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem' }}>
              <i className="ph ph-gear"></i> Konfigurasi
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          {statCards.map((s, i) => (
            <div key={i} className="siakad-card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <div style={{ width: '40px', height: '40px', background: s.bg, color: s.color, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
                  <i className={s.icon}></i>
                </div>
                <span style={{ color: 'var(--color-muted)', fontSize: '0.85rem', fontWeight: '600' }}>{s.label}</span>
              </div>
              <p style={{ margin: 0, fontSize: '2rem', fontWeight: '800', color: 'var(--color-text)' }}>{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Search Catalog */}
      <div className="siakad-card" style={{ padding: '24px' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--color-text)', margin: '0 0 20px 0' }}>Pencarian Katalog</h2>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <i className="ph ph-magnifying-glass" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-muted)' }}></i>
            <input id="input-search-catalog" type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} onKeyDown={e => e.key === 'Enter' && searchCatalog()} placeholder="Cari judul buku, penulis, ISBN..." style={{ width: '100%', padding: '12px 14px 12px 40px', fontSize: '0.95rem', borderRadius: '30px', border: '1px solid var(--color-border)', background: 'var(--color-bg)', color: 'var(--color-text)', boxSizing: 'border-box' }} />
          </div>
          <button id="btn-search-catalog" onClick={searchCatalog} disabled={searching} className="btn" style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '30px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap' }}>
            <i className="ph ph-magnifying-glass"></i> {searching ? 'Mencari...' : 'Cari'}
          </button>
        </div>

        {books.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--color-muted)' }}>
            <i className="ph ph-books" style={{ fontSize: '3rem', marginBottom: '12px', display: 'block', opacity: 0.4 }}></i>
            <p style={{ margin: 0 }}>Masukkan kata kunci untuk mencari katalog perpustakaan.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
            {books.map((b, i) => (
              <div key={i} className="siakad-card" style={{ padding: '20px', border: '1px solid var(--color-border)' }}>
                <div style={{ display: 'flex', gap: '14px' }}>
                  <div style={{ width: '50px', height: '68px', background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <i className="ph ph-book" style={{ color: 'white', fontSize: '1.4rem' }}></i>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h4 style={{ margin: '0 0 4px', fontSize: '0.95rem', fontWeight: '700', color: 'var(--color-text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{b.title || '-'}</h4>
                    <p style={{ margin: '0 0 4px', fontSize: '0.82rem', color: 'var(--color-muted)' }}>{b.author || '-'}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '0.78rem', color: 'var(--color-muted)' }}>{b.year || '-'}</span>
                      <span style={{ background: (b.available || b.availability === 'available') ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)', color: (b.available || b.availability === 'available') ? '#10b981' : '#ef4444', padding: '2px 10px', borderRadius: '20px', fontSize: '0.72rem', fontWeight: '600' }}>
                        {(b.available || b.availability === 'available') ? 'Tersedia' : 'Dipinjam'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Config Modal */}
      {showConfigModal && (
        <ModalShell title="Konfigurasi sLimS" onClose={() => setShowConfigModal(false)} footer={
          <>
            <button id="btn-cancel-config" onClick={() => setShowConfigModal(false)} className="btn" style={{ padding: '10px 20px', border: 'none', color: 'var(--color-text)', cursor: 'pointer', fontWeight: '600' }}>Batal</button>
            <button id="btn-save-config" onClick={saveConfig} disabled={saving} className="siakad-btn-primary" style={{ padding: '10px 24px' }}>{saving ? 'Menyimpan...' : 'Simpan Konfigurasi'}</button>
          </>
        }>
          {[
            { label: 'Base URL', key: 'base_url', placeholder: 'https://perpustakaan.umiba.ac.id' },
            { label: 'API Key', key: 'api_key', placeholder: 'Masukkan API Key sLimS' },
          ].map(f => (
            <div key={f.key} style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: 'var(--color-muted)', fontWeight: '600' }}>{f.label}</label>
              <input id={`input-config-${f.key}`} type="text" value={configForm[f.key]} onChange={e => setConfigForm({ ...configForm, [f.key]: e.target.value })} placeholder={f.placeholder} style={{ width: '100%', padding: '10px 14px', fontSize: '0.9rem', boxSizing: 'border-box', color: 'var(--color-text)', fontFamily: 'monospace' }} />
            </div>
          ))}
        </ModalShell>
      )}
    </div>
  );
}
