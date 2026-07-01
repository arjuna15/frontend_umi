"use client";
import { useState, useEffect } from 'react';

export default function AdminLogsPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Simulated fetch
    setTimeout(() => {
      setLogs([
        { id: 1, action: 'User Login', user: 'admin1', details: 'Logged in from 192.168.1.1', time: 'Hari ini, 08:30' },
        { id: 2, action: 'Tambah Pengguna', user: 'admin1', details: 'Menambahkan dosen Dr. Budi', time: 'Hari ini, 09:15' },
        { id: 3, action: 'Ubah Tagihan', user: 'keuangan', details: 'Ubah status tagihan UKT Andi menjadi Lunas', time: 'Hari ini, 11:20' },
        { id: 4, action: 'Hapus Mata Kuliah', user: 'kaprodi_ti', details: 'Menghapus MK Kecerdasan Buatan (Lama)', time: 'Kemarin, 14:00' },
        { id: 5, action: 'Update Sistem', user: 'admin1', details: 'Mengubah status Pengisian KRS menjadi NONAKTIF', time: 'Kemarin, 16:45' },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  const filteredLogs = logs.filter(log => 
    log.action.toLowerCase().includes(searchTerm.toLowerCase()) || 
    log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.details.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div style={{ padding: '20px' }}>Loading...</div>;

  return (
    <div className="fade-in" style={{ paddingBottom: '40px' }}>
      <div style={{ marginBottom: '32px' }}>
        <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #4c0519 100%)', borderRadius: '24px', padding: '40px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(196,30,58,0.15)', filter: 'blur(40px)' , flexShrink: 0 }}></div>
          <div style={{ position: 'absolute', bottom: '-20px', left: '30%', width: '150px', height: '150px', borderRadius: '50%', background: 'rgba(99,102,241,0.1)', filter: 'blur(30px)' , flexShrink: 0 }}></div>
          <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ flex: '1 1 300px' }}>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', margin: '0 0 8px 0', letterSpacing: '0.1em', textTransform: 'uppercase' }}>SIAKAD — ADMIN</p>
              <h1 style={{ color: 'white', fontSize: '2.2rem', fontWeight: '800', margin: '0 0 8px 0', letterSpacing: '-0.03em' }}>Log Aktivitas (Audit Trail)</h1>
              <p style={{ color: 'rgba(255,255,255,0.6)', margin: 0 }}>Pantau seluruh aktivitas krusial pengguna di dalam sistem untuk keperluan keamanan.</p>
            </div>
            <div>
              <button style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', padding: '10px 20px', borderRadius: '12px', cursor: 'pointer', color: 'white', display: 'flex', alignItems: 'center', gap: '8px' }}>
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
          <button style={{ padding: '12px 20px', background: 'var(--glass-bg)', border: '1px solid var(--color-border)', borderRadius: '12px', color: 'var(--color-text)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <i className="ph ph-funnel"></i> Filter
          </button>
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
                  <td style={{ padding: '16px', color: 'var(--color-muted)', fontSize: '0.9rem', whiteSpace: 'nowrap' }}>{log.time}</td>
                  <td style={{ padding: '16px', fontWeight: 'bold', color: 'var(--color-text)' }}>{log.user}</td>
                  <td style={{ padding: '16px' }}>
                    <span style={{ display: 'inline-block', background: 'var(--glass-bg)', padding: '4px 10px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 600, border: '1px solid var(--color-border)' }}>
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
