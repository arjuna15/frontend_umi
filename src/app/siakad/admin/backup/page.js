"use client";
import { useState } from 'react';

export default function AdminBackupPage() {
  const [backups, setBackups] = useState([
    { id: 1, name: 'SIAKAD_DB_2026-06-01.sql', size: '45.2 MB', date: '01 Jun 2026, 02:00', status: 'Success' },
    { id: 2, name: 'SIAKAD_DB_2026-06-15.sql', size: '46.8 MB', date: '15 Jun 2026, 02:00', status: 'Success' },
    { id: 3, name: 'SIAKAD_DB_2026-06-30.sql', size: '48.1 MB', date: '30 Jun 2026, 02:00', status: 'Success' },
  ]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);

  const handleGenerateBackup = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const now = new Date();
      const dateString = now.toISOString().split('T')[0];
      setBackups([
        { 
          id: Date.now(), 
          name: `SIAKAD_DB_${dateString}_MANUAL.sql`, 
          size: '48.5 MB', 
          date: 'Hari ini, ' + now.getHours() + ':' + String(now.getMinutes()).padStart(2, '0'), 
          status: 'Success' 
        },
        ...backups
      ]);
      setIsGenerating(false);
      window.toast?.('Backup berhasil dibuat!');
    }, 2000);
  };

  const handleRestore = (id) => {
    if (!confirm('PERINGATAN: Memulihkan backup akan menimpa data saat ini. Yakin ingin melanjutkan?')) return;
    setIsRestoring(true);
    setTimeout(() => {
      setIsRestoring(false);
      window.toast?.('Database berhasil dipulihkan dari backup.');
    }, 3000);
  };

  const handleDelete = (id) => {
    if(confirm('Yakin ingin menghapus file backup ini?')) {
      setBackups(backups.filter(b => b.id !== id));
      window.toast?.('File backup dihapus.');
    }
  };

  return (
    <div className="fade-in" style={{ paddingBottom: '40px' }}>
      <div style={{ marginBottom: '32px' }}>
        <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #4c0519 100%)', borderRadius: '24px', padding: '40px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(196,30,58,0.15)', filter: 'blur(40px)' }}></div>
          <div style={{ position: 'absolute', bottom: '-20px', left: '30%', width: '150px', height: '150px', borderRadius: '50%', background: 'rgba(99,102,241,0.1)', filter: 'blur(30px)' }}></div>
          <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ flex: '1 1 300px' }}>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', margin: '0 0 8px 0', letterSpacing: '0.1em', textTransform: 'uppercase' }}>SIAKAD — ADMIN</p>
              <h1 style={{ color: 'white', fontSize: '2.2rem', fontWeight: '800', margin: '0 0 8px 0', letterSpacing: '-0.03em' }}>Backup & Restore Data</h1>
              <p style={{ color: 'rgba(255,255,255,0.6)', margin: 0 }}>Amankan data akademik dengan melakukan pencadangan secara berkala.</p>
            </div>
            <button 
              onClick={handleGenerateBackup} 
              disabled={isGenerating || isRestoring}
              style={{ background: '#10b981', color: 'white', padding: '12px 24px', borderRadius: '12px', border: 'none', cursor: (isGenerating || isRestoring) ? 'not-allowed' : 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)', opacity: (isGenerating || isRestoring) ? 0.7 : 1 }}
            >
              {isGenerating ? (
                <><i className="ph ph-spinner ph-spin" style={{ fontSize: '1.2rem' }}></i> Memproses Backup...</>
              ) : (
                <><i className="ph ph-database" style={{ fontSize: '1.2rem' }}></i> Generate Backup Sekarang</>
              )}
            </button>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', marginBottom: '24px' }}>
        <div className="siakad-card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
            <i className="ph ph-clock-counter-clockwise"></i>
          </div>
          <div>
            <p style={{ margin: 0, color: 'var(--color-muted)', fontSize: '0.9rem' }}>Jadwal Otomatis</p>
            <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Harian (02:00)</h3>
          </div>
        </div>
        <div className="siakad-card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
            <i className="ph ph-hard-drives"></i>
          </div>
          <div>
            <p style={{ margin: 0, color: 'var(--color-muted)', fontSize: '0.9rem' }}>Penyimpanan Tersedia</p>
            <h3 style={{ margin: 0, fontSize: '1.2rem' }}>450 GB / 1 TB</h3>
          </div>
        </div>
      </div>

      <div className="siakad-card" style={{ padding: '24px' }}>
        <h3 style={{ margin: '0 0 20px 0', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <i className="ph ph-files"></i> Riwayat Backup
        </h3>

        {isRestoring && (
          <div style={{ background: 'rgba(245, 158, 11, 0.1)', border: '1px solid #f59e0b', color: '#b45309', padding: '16px', borderRadius: '12px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <i className="ph ph-spinner ph-spin" style={{ fontSize: '1.5rem' }}></i>
            <div>
              <strong>Memulihkan Database...</strong>
              <p style={{ margin: 0, fontSize: '0.9rem' }}>Sistem sedang dimatikan sementara. Harap jangan menutup halaman ini.</p>
            </div>
          </div>
        )}

        <div style={{ overflowX: 'auto' }}>
          <table className="siakad-table" style={{ width: '100%', minWidth: '800px', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'var(--glass-bg)', color: 'var(--color-muted)', borderBottom: '1px solid var(--color-border)', textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '0.05em' }}>
                <th style={{ padding: '16px' }}>Nama File</th>
                <th style={{ padding: '16px' }}>Waktu</th>
                <th style={{ padding: '16px' }}>Ukuran</th>
                <th style={{ padding: '16px' }}>Status</th>
                <th style={{ padding: '16px', textAlign: 'right' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {backups.map((b) => (
                <tr key={b.id} style={{ borderBottom: '1px solid var(--color-border)', transition: 'all 0.2s' }} onMouseEnter={(e)=>e.currentTarget.style.background='var(--glass-bg)'} onMouseLeave={(e)=>e.currentTarget.style.background='transparent'}>
                  <td style={{ padding: '16px', fontWeight: 'bold', color: 'var(--color-text)' }}>
                    <i className="ph ph-file-sql" style={{ color: '#3b82f6', marginRight: '8px' }}></i>
                    {b.name}
                  </td>
                  <td style={{ padding: '16px', color: 'var(--color-muted)' }}>{b.date}</td>
                  <td style={{ padding: '16px' }}>{b.size}</td>
                  <td style={{ padding: '16px' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '4px 10px', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                      <i className="ph ph-check-circle"></i> {b.status}
                    </span>
                  </td>
                  <td style={{ padding: '16px', textAlign: 'right' }}>
                    <button onClick={() => window.toast?.('Mendownload file...')} style={{ background: 'transparent', border: '1px solid var(--color-border)', color: '#3b82f6', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', marginRight: '8px' }} title="Download">
                      <i className="ph ph-download-simple"></i>
                    </button>
                    <button onClick={() => handleRestore(b.id)} disabled={isRestoring} style={{ background: 'transparent', border: '1px solid var(--color-border)', color: '#f59e0b', padding: '6px 12px', borderRadius: '6px', cursor: isRestoring ? 'not-allowed' : 'pointer', marginRight: '8px', opacity: isRestoring ? 0.5 : 1 }} title="Restore">
                      <i className="ph ph-arrow-counter-clockwise"></i>
                    </button>
                    <button onClick={() => handleDelete(b.id)} disabled={isRestoring} style={{ background: 'transparent', border: '1px solid var(--color-border)', color: '#ef4444', padding: '6px 12px', borderRadius: '6px', cursor: isRestoring ? 'not-allowed' : 'pointer', opacity: isRestoring ? 0.5 : 1 }} title="Hapus">
                      <i className="ph ph-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
