"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogsPage() {
  const router = useRouter();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    const token = localStorage.getItem('siakad_token');
    if (!token) return router.push('/siakad/login');

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
    try {
      const res = await fetch(`${apiUrl}/siakad/admin/logs`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        const mapped = data.map(log => ({
          id: log.id,
          action: log.action,
          user: log.user_name,
          details: log.details,
          time: log.created_at
        }));
        setLogs(mapped);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = logs.filter(log => 
    log.action.toLowerCase().includes(searchTerm.toLowerCase()) || 
    log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.details.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateStr) => {
    const options = { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateStr).toLocaleDateString('id-ID', options);
  };

  if (loading) return <div style={{ padding: '20px' }}>Loading...</div>;

  return (
    <div className="fade-in" style={{ paddingBottom: '40px' }}>
      <div style={{ marginBottom: '32px' }}>
        <div className="siakad-page-header">
        <div className="siakad-page-header-glow"></div>
        <div className="siakad-page-header-grid"></div>
          <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ flex: '1 1 300px' }}>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', margin: '0 0 8px 0', letterSpacing: '0.1em', textTransform: 'uppercase' }}>SIAKAD — ADMIN</p>
              <h1 style={{ color: 'white', fontSize: '2.2rem', fontWeight: '800', margin: '0 0 8px 0', letterSpacing: '-0.03em' }}>Log Aktivitas (Audit Trail)</h1>
              <p style={{ color: 'rgba(255,255,255,0.6)', margin: 0 }}>Pantau seluruh aktivitas krusial pengguna di dalam sistem untuk keperluan keamanan.</p>
            </div>
            <div>
              <button onClick={() => window.toast?.('Export CSV sedang diproses...')} style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', padding: '10px 20px', borderRadius: '12px', cursor: 'pointer', color: 'white', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <i className="ph ph-export"></i> Export CSV
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="siakad-card" style={{ padding: '24px' }}>
        <div style={{ marginBottom: '20px', display: 'flex', gap: '16px', alignItems: 'center' , flexWrap: 'wrap' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <i className="ph ph-magnifying-glass" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-muted)' }}></i>
            <input 
              type="text" 
              placeholder="Cari aksi, user, atau detail aktivitas..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="siakad-input"
              style={{ width: '100%', paddingLeft: '44px' }}
            />
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="siakad-table" style={{ width: '100%', minWidth: '800px', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'var(--glass-bg)', color: 'var(--color-muted)', borderBottom: '1px solid var(--color-border)', textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '0.05em' }}>
                <th style={{ padding: '16px' }}>Waktu</th>
                <th style={{ padding: '16px' }}>User</th>
                <th style={{ padding: '16px' }}>Aksi</th>
                <th style={{ padding: '16px' }}>Detail</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.length > 0 ? filteredLogs.map((log) => (
                <tr key={log.id} style={{ borderBottom: '1px solid var(--color-border)', transition: 'all 0.2s' }} onMouseEnter={(e)=>e.currentTarget.style.background='var(--glass-bg)'} onMouseLeave={(e)=>e.currentTarget.style.background='transparent'}>
                  <td style={{ padding: '16px', color: 'var(--color-muted)', fontSize: '0.9rem', whiteSpace: 'nowrap' }}>{formatDate(log.time)}</td>
                  <td style={{ padding: '16px', fontWeight: 'bold', color: 'var(--color-text)' }}>{log.user}</td>
                  <td style={{ padding: '16px' }}>
                    <span style={{ 
                      display: 'inline-block', 
                      background: 'var(--glass-bg)', 
                      padding: '6px 12px', 
                      borderRadius: '8px', 
                      fontSize: '0.85rem', 
                      fontWeight: 600, 
                      border: '1px solid var(--color-border)',
                      minWidth: '150px',
                      textAlign: 'center'
                    }}>
                      {log.action}
                    </span>
                  </td>
                  <td style={{ padding: '16px', color: 'var(--color-muted)' }}>{log.details}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="4" style={{ padding: '32px', textAlign: 'center', color: 'var(--color-muted)' }}>Tidak ada log ditemukan</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
