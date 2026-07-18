"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import SkeletonLoader from '../../components/SkeletonLoader';

export default function NeoFeederSyncPage() {
  const router = useRouter();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState({ tested: false, success: false, message: '', token: '' });
  const [testingConnection, setTestingConnection] = useState(false);
  const [syncingType, setSyncingType] = useState(null);
  const [message, setMessage] = useState({ text: '', type: '' });

  const fetchStats = async () => {
    const token = localStorage.getItem('siakad_token');
    if (!token) return router.push('/siakad/login');

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
      const res = await fetch(`${apiUrl}/siakad/admin/feeder/stats`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to fetch stats');
      const result = await res.json();
      if (result.success) {
        setStats(result.stats);
      }
    } catch (err) {
      console.error(err);
      setMessage({ text: 'Gagal mengambil statistik sinkronisasi.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const testConnection = async () => {
    setTestingConnection(true);
    setMessage({ text: '', type: '' });
    const token = localStorage.getItem('siakad_token');

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
      const res = await fetch(`${apiUrl}/siakad/admin/feeder/test-connection`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await res.json();
      
      setConnectionStatus({
        tested: true,
        success: res.ok && result.success,
        message: result.message || 'Gagal tersambung ke Neo Feeder.',
        token: result.token || ''
      });
      
      if (res.ok && result.success) {
        setMessage({ text: 'Koneksi ke Neo Feeder Web Service terverifikasi aktif!', type: 'success' });
      } else {
        setMessage({ text: 'Gagal menghubungi Neo Feeder. Silakan periksa server WS lokal.', type: 'error' });
      }
    } catch (err) {
      setConnectionStatus({
        tested: true,
        success: false,
        message: 'Tidak dapat menjangkau server SIAKAD.',
        token: ''
      });
      setMessage({ text: 'Koneksi gagal: Server backend tidak merespon.', type: 'error' });
    } finally {
      setTestingConnection(false);
    }
  };

  const startSync = async (type) => {
    setSyncingType(type);
    setMessage({ text: '', type: '' });
    const token = localStorage.getItem('siakad_token');

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
      const res = await fetch(`${apiUrl}/siakad/admin/feeder/sync`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ type })
      });

      const result = await res.json();
      if (res.ok && result.success) {
        setMessage({ text: result.message, type: 'success' });
        // Refresh stats after delay to see queued changes
        setTimeout(fetchStats, 2000);
      } else {
        setMessage({ text: result.message || 'Gagal memulai sinkronisasi.', type: 'error' });
      }
    } catch (err) {
      setMessage({ text: 'Terjadi kesalahan sistem saat mencoba sinkronisasi.', type: 'error' });
    } finally {
      setSyncingType(null);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [router]);

  if (loading) return (
    <div style={{ padding: '24px' }}>
      <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--color-text)', margin: '0 0 24px 0' }}>Memuat Integrasi Feeder...</h1>
      <SkeletonLoader type="card" />
      <SkeletonLoader type="table" />
    </div>
  );

  return (
    <div className="fade-in">
      <div className="siakad-page-header">
        <div className="siakad-page-header-glow"></div>
        <div className="siakad-page-header-grid"></div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', margin: '0 0 8px 0', letterSpacing: '0.1em', textTransform: 'uppercase' }}>SIAKAD — INTEGRASI</p>
          <h1 style={{ color: 'white', fontSize: '2.2rem', fontWeight: '800', margin: '0 0 8px 0', letterSpacing: '-0.03em' }}>Integrasi PDDIKTI Neo Feeder</h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', margin: 0 }}>Sinkronisasikan data akademik kampus dengan server Pangkalan Data Pendidikan Tinggi secara real-time.</p>
        </div>
      </div>

      {message.text && (
        <div style={{ padding: '14px 20px', borderRadius: '50px', marginBottom: '24px', background: 'var(--liquid-bg)', border: 'var(--inset-border)', boxShadow: 'inset 2px 2px 4px var(--inset-shadow-dark), inset -2px -2px 4px var(--inset-shadow-light)', color: message.type === 'success' ? '#10b981' : '#ef4444', fontWeight: '700', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <i className={message.type === 'success' ? "ph-fill ph-check-circle" : "ph-fill ph-warning-circle"} style={{ fontSize: '1.2rem' }}></i>
          {message.text}
        </div>
      )}

      {/* Connection Test Section */}
      <div className="siakad-card" style={{ background: 'var(--glass-bg)', border: 'var(--glass-border)', boxShadow: 'var(--glass-shadow)', padding: '24px', marginBottom: '32px' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--color-text)', margin: '0 0 16px 0' }}>Status Koneksi Web Service</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '16px',
              height: '16px',
              borderRadius: '50%',
              boxShadow: 'inset 4px 4px 8px var(--inset-shadow-dark), inset -4px -4px 8px var(--inset-shadow-light)',
              background: connectionStatus.tested ? (connectionStatus.success ? '#10b981' : '#ef4444') : 'none'
            }}></div>
            <div>
              <p style={{ margin: 0, fontWeight: 'bold', color: 'var(--color-text)' }}>
                {connectionStatus.tested ? (connectionStatus.success ? 'Koneksi Aktif' : 'Koneksi Terputus') : 'Koneksi Belum Dicek'}
              </p>
              <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: 'var(--color-muted)' }}>
                {connectionStatus.tested ? connectionStatus.message : 'Silakan klik tombol di samping untuk memverifikasi jalur WS.'}
              </p>
            </div>
          </div>
          
          <button 
            onClick={testConnection} 
            disabled={testingConnection}
            className="btn" 
            style={{ 
              background: 'var(--umiba-red)', 
              color: 'white', 
              border: 'none', 
              padding: '10px 24px', 
              borderRadius: '30px', 
              fontWeight: 'bold',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              opacity: testingConnection ? 0.6 : 1
            }}
          >
            {testingConnection && <i className="ph ph-spinner pwa-spin" style={{ animation: 'pwaSpin 1s linear infinite' }}></i>}
            <i className="ph ph-plugs"></i>
            {testingConnection ? 'Memverifikasi...' : 'Tes Koneksi'}
          </button>
        </div>
      </div>

      {/* Sync Cards Container */}
      <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--color-text)', margin: '0 0 20px 0', letterSpacing: '-0.02em' }}>Kelola Sinkronisasi Data</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
        
        {/* CARD 1: MAHASISWA */}
        <div className="siakad-card" style={{ background: 'var(--glass-bg)', border: 'var(--glass-border)', boxShadow: 'var(--glass-shadow)', padding: '24px', display: 'flex', flexDirection: 'column', justifyBetween: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{ borderRadius: '50%', boxShadow: 'inset 4px 4px 8px var(--inset-shadow-dark), inset -4px -4px 8px var(--inset-shadow-light)', background: 'var(--liquid-bg)', width: '40px', height: '40px',   borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
                <i className="ph ph-student"></i>
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--color-text)', margin: 0 }}>Profil Mahasiswa</h3>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', margin: '0 0 24px 0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-border)', paddingBottom: '6px' }}>
                <span style={{ color: 'var(--color-muted)', fontSize: '0.9rem' }}>Total Akun Mahasiswa</span>
                <strong style={{ color: 'var(--color-text)' }}>{stats?.mahasiswa.total}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-border)', paddingBottom: '6px' }}>
                <span style={{ color: '#10b981', fontSize: '0.9rem' }}>Tersinkron (PDDIKTI)</span>
                <strong style={{ color: '#10b981' }}>{stats?.mahasiswa.synced}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '6px' }}>
                <span style={{ color: '#f59e0b', fontSize: '0.9rem' }}>Belum Sinkron</span>
                <strong style={{ color: '#f59e0b' }}>{stats?.mahasiswa.unsynced}</strong>
              </div>
            </div>
          </div>
          
          <button
            onClick={() => startSync('mahasiswa')}
            disabled={syncingType !== null || stats?.mahasiswa.unsynced === 0}
            className="btn"
            style={{
              width: '100%',
              background: stats?.mahasiswa.unsynced === 0 ? 'var(--color-border)' : 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
              color: 'white',
              border: 'none',
              padding: '12px 16px',
              borderRadius: '12px',
              fontWeight: 'bold',
              cursor: stats?.mahasiswa.unsynced === 0 ? 'default' : 'pointer',
              opacity: syncingType === 'mahasiswa' ? 0.6 : 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            {syncingType === 'mahasiswa' ? 'Proses Sync...' : 'Sinkronkan Sekarang'}
          </button>
        </div>

        {/* CARD 2: MATA KULIAH */}
        <div className="siakad-card" style={{ background: 'var(--glass-bg)', border: 'var(--glass-border)', boxShadow: 'var(--glass-shadow)', padding: '24px', display: 'flex', flexDirection: 'column', justifyBetween: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{ borderRadius: '50%', boxShadow: 'inset 4px 4px 8px var(--inset-shadow-dark), inset -4px -4px 8px var(--inset-shadow-light)', background: 'var(--liquid-bg)', width: '40px', height: '40px',   borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
                <i className="ph ph-books"></i>
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--color-text)', margin: 0 }}>Mata Kuliah</h3>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', margin: '0 0 24px 0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-border)', paddingBottom: '6px' }}>
                <span style={{ color: 'var(--color-muted)', fontSize: '0.9rem' }}>Total Kurikulum MK</span>
                <strong style={{ color: 'var(--color-text)' }}>{stats?.courses.total}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-border)', paddingBottom: '6px' }}>
                <span style={{ color: '#10b981', fontSize: '0.9rem' }}>Tersinkron (PDDIKTI)</span>
                <strong style={{ color: '#10b981' }}>{stats?.courses.synced}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '6px' }}>
                <span style={{ color: '#f59e0b', fontSize: '0.9rem' }}>Belum Sinkron</span>
                <strong style={{ color: '#f59e0b' }}>{stats?.courses.unsynced}</strong>
              </div>
            </div>
          </div>
          
          <button
            onClick={() => startSync('courses')}
            disabled={syncingType !== null || stats?.courses.unsynced === 0}
            className="btn"
            style={{
              width: '100%',
              background: stats?.courses.unsynced === 0 ? 'var(--color-border)' : 'linear-gradient(135deg, #10b981 0%, #047857 100%)',
              color: 'white',
              border: 'none',
              padding: '12px 16px',
              borderRadius: '12px',
              fontWeight: 'bold',
              cursor: stats?.courses.unsynced === 0 ? 'default' : 'pointer',
              opacity: syncingType === 'courses' ? 0.6 : 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            {syncingType === 'courses' ? 'Proses Sync...' : 'Sinkronkan Sekarang'}
          </button>
        </div>

        {/* CARD 3: KRS (RENCANA STUDI) */}
        <div className="siakad-card" style={{ background: 'var(--glass-bg)', border: 'var(--glass-border)', boxShadow: 'var(--glass-shadow)', padding: '24px', display: 'flex', flexDirection: 'column', justifyBetween: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{ borderRadius: '50%', boxShadow: 'inset 4px 4px 8px var(--inset-shadow-dark), inset -4px -4px 8px var(--inset-shadow-light)', background: 'var(--liquid-bg)', width: '40px', height: '40px',   borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
                <i className="ph ph-newspaper-clipping"></i>
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--color-text)', margin: 0 }}>Rencana Studi (KRS)</h3>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', margin: '0 0 24px 0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-border)', paddingBottom: '6px' }}>
                <span style={{ color: 'var(--color-muted)', fontSize: '0.9rem' }}>Total Item Rencana Studi</span>
                <strong style={{ color: 'var(--color-text)' }}>{stats?.krs.total}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-border)', paddingBottom: '6px' }}>
                <span style={{ color: '#10b981', fontSize: '0.9rem' }}>Tersinkron (PDDIKTI)</span>
                <strong style={{ color: '#10b981' }}>{stats?.krs.synced}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '6px' }}>
                <span style={{ color: '#f59e0b', fontSize: '0.9rem' }}>Belum Sinkron</span>
                <strong style={{ color: '#f59e0b' }}>{stats?.krs.unsynced}</strong>
              </div>
            </div>
          </div>
          
          <button
            onClick={() => startSync('krs')}
            disabled={syncingType !== null || stats?.krs.unsynced === 0}
            className="btn"
            style={{
              width: '100%',
              background: stats?.krs.unsynced === 0 ? 'var(--color-border)' : 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              color: 'white',
              border: 'none',
              padding: '12px 16px',
              borderRadius: '12px',
              fontWeight: 'bold',
              cursor: stats?.krs.unsynced === 0 ? 'default' : 'pointer',
              opacity: syncingType === 'krs' ? 0.6 : 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            {syncingType === 'krs' ? 'Proses Sync...' : 'Sinkronkan Sekarang'}
          </button>
        </div>

        {/* CARD 4: NILAI PERKULIAHAN */}
        <div className="siakad-card" style={{ background: 'var(--glass-bg)', border: 'var(--glass-border)', boxShadow: 'var(--glass-shadow)', padding: '24px', display: 'flex', flexDirection: 'column', justifyBetween: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{ borderRadius: '50%', boxShadow: 'inset 4px 4px 8px var(--inset-shadow-dark), inset -4px -4px 8px var(--inset-shadow-light)', background: 'var(--liquid-bg)', width: '40px', height: '40px',   borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
                <i className="ph ph-graduation-cap"></i>
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--color-text)', margin: 0 }}>Nilai Perkuliahan</h3>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', margin: '0 0 24px 0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-border)', paddingBottom: '6px' }}>
                <span style={{ color: 'var(--color-muted)', fontSize: '0.9rem' }}>Total Nilai Tercatat</span>
                <strong style={{ color: 'var(--color-text)' }}>{stats?.grades.total}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-border)', paddingBottom: '6px' }}>
                <span style={{ color: '#10b981', fontSize: '0.9rem' }}>Tersinkron (PDDIKTI)</span>
                <strong style={{ color: '#10b981' }}>{stats?.grades.synced}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '6px' }}>
                <span style={{ color: '#f59e0b', fontSize: '0.9rem' }}>Belum Sinkron</span>
                <strong style={{ color: '#f59e0b' }}>{stats?.grades.unsynced}</strong>
              </div>
            </div>
          </div>
          
          <button
            onClick={() => startSync('grades')}
            disabled={syncingType !== null || stats?.grades.unsynced === 0}
            className="btn"
            style={{
              width: '100%',
              background: stats?.grades.unsynced === 0 ? 'var(--color-border)' : 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
              color: 'white',
              border: 'none',
              padding: '12px 16px',
              borderRadius: '12px',
              fontWeight: 'bold',
              cursor: stats?.grades.unsynced === 0 ? 'default' : 'pointer',
              opacity: syncingType === 'grades' ? 0.6 : 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            {syncingType === 'grades' ? 'Proses Sync...' : 'Sinkronkan Sekarang'}
          </button>
        </div>

      </div>
    </div>
  );
}
