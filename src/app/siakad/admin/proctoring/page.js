"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ProctoringAdminPage() {
  const router = useRouter();
  const [sessions, setSessions] = useState([]);
  const [stats, setStats] = useState({ total: 0, active: 0, completed: 0, violations: 0 });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [showLogs, setShowLogs] = useState(null);
  const [logs, setLogs] = useState([]);
  const [generatingToken, setGeneratingToken] = useState(false);
  const [processingId, setProcessingId] = useState(null);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
  const getToken = () => localStorage.getItem('siakad_token');

  const fetchSessions = async () => {
    const token = getToken();
    if (!token) return router.push('/siakad/login');
    try {
      const res = await fetch(`${apiUrl}/siakad/proctoring/sessions`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed');
      const data = await res.json();
      const list = data.data || data.sessions || [];
      setSessions(list);
      const active = list.filter(s => s.status === 'active' || s.status === 'running').length;
      const completed = list.filter(s => s.status === 'completed' || s.status === 'ended').length;
      const violations = list.reduce((acc, s) => acc + (s.violations_count || s.log_count || 0), 0);
      setStats({ total: list.length, active, completed, violations });
    } catch (e) {
      console.error(e);
      setMessage({ text: 'Gagal memuat data proctoring.', type: 'error' });
    } finally { setLoading(false); }
  };

  const generateToken = async () => {
    setGeneratingToken(true);
    try {
      const res = await fetch(`${apiUrl}/siakad/proctoring/generate-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` }
      });
      if (!res.ok) throw new Error('Failed');
      const data = await res.json();
      setMessage({ text: `Token berhasil dibuat: ${data.token || data.data?.token || 'OK'}`, type: 'success' });
      fetchSessions();
    } catch (e) {
      setMessage({ text: 'Gagal membuat token.', type: 'error' });
    } finally { setGeneratingToken(false); }
  };

  const controlSession = async (sessionId, action) => {
    setProcessingId(sessionId);
    try {
      await fetch(`${apiUrl}/siakad/proctoring/sessions/${sessionId}/${action}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${getToken()}` }
      });
      setMessage({ text: `Sesi berhasil di-${action}.`, type: 'success' });
      fetchSessions();
    } catch (e) {
      setMessage({ text: `Gagal ${action} sesi.`, type: 'error' });
    } finally { setProcessingId(null); }
  };

  const viewLogs = async (session) => {
    setShowLogs(session);
    try {
      const res = await fetch(`${apiUrl}/siakad/proctoring/sessions/${session.id}/logs`, {
        headers: { 'Authorization': `Bearer ${getToken()}` }
      });
      if (!res.ok) throw new Error('Failed');
      const data = await res.json();
      setLogs(data.data || data.logs || []);
    } catch (e) { setLogs([]); }
  };

  useEffect(() => { fetchSessions(); }, [router]);

  const statusBadge = (status) => {
    const colors = { active: '#10b981', running: '#10b981', pending: '#f59e0b', waiting: '#f59e0b', completed: '#3b82f6', ended: '#94a3b8' };
    const c = colors[status] || '#94a3b8';
    return <span style={{ background: `${c}20`, color: c, padding: '4px 12px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: '600', textTransform: 'capitalize' }}>{status}</span>;
  };

  const violationIcon = (type) => {
    const icons = { tab_switch: 'ph ph-browser', face_not_detected: 'ph ph-user-minus', multiple_faces: 'ph ph-users-three', phone_detected: 'ph ph-device-mobile', copy_paste: 'ph ph-copy' };
    return icons[type] || 'ph ph-warning';
  };

  const violationColor = (type) => {
    const colors = { tab_switch: '#f59e0b', face_not_detected: '#ef4444', multiple_faces: '#ef4444', phone_detected: '#ef4444', copy_paste: '#f59e0b' };
    return colors[type] || '#f59e0b';
  };

  if (loading) return (
    <div style={{ padding: '24px' }}>
      <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--color-text)', margin: '0 0 24px 0' }}>Memuat Proctoring...</h1>
      <div className="siakad-card" style={{ padding: '24px', height: '200px' }}></div>
    </div>
  );

  const statCards = [
    { label: 'Total Sesi', value: stats.total, icon: 'ph ph-monitor', color: '#3b82f6', bg: 'rgba(59,130,246,0.1)' },
    { label: 'Aktif Sekarang', value: stats.active, icon: 'ph ph-pulse', color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
    { label: 'Selesai', value: stats.completed, icon: 'ph ph-check-circle', color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)' },
    { label: 'Pelanggaran', value: stats.violations, icon: 'ph ph-warning', color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
  ];

  return (
    <div className="fade-in">
      <div className="siakad-page-header">
        <div className="siakad-page-header-glow"></div>
        <div className="siakad-page-header-grid"></div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', margin: '0 0 8px 0', letterSpacing: '0.1em', textTransform: 'uppercase' }}>SIAKAD — PENGAWASAN</p>
          <h1 style={{ color: 'white', fontSize: '2.2rem', fontWeight: '800', margin: '0 0 8px 0', letterSpacing: '-0.03em' }}>Proctoring Ujian</h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', margin: 0 }}>Kelola dan pantau sesi ujian online dengan sistem pengawasan otomatis.</p>
        </div>
      </div>

      {message.text && (
        <div style={{ padding: '16px 20px', borderRadius: '12px', marginBottom: '24px', background: message.type === 'success' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', border: `1px solid ${message.type === 'success' ? '#10b981' : '#ef4444'}`, color: message.type === 'success' ? '#10b981' : '#ef4444', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <i className={message.type === 'success' ? "ph-fill ph-check-circle" : "ph-fill ph-warning-circle"} style={{ fontSize: '1.4rem' }}></i>
          {message.text}
        </div>
      )}

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '32px' }}>
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

      {/* Sessions Table */}
      <div className="siakad-card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--color-text)', margin: 0 }}>Sesi Proctoring</h2>
          <button id="btn-generate-token" onClick={generateToken} disabled={generatingToken} className="btn" style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '30px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', opacity: generatingToken ? 0.6 : 1 }}>
            {generatingToken && <i className="ph ph-spinner" style={{ animation: 'pwaSpin 1s linear infinite' }}></i>}
            <i className="ph ph-key"></i> Generate Token
          </button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Kuis / Ujian', 'Pengajar', 'Token', 'Status', 'Mulai', 'Selesai', 'Log', 'Aksi'].map(h => (
                  <th key={h} style={{ padding: '12px 14px', textAlign: 'left', fontSize: '0.78rem', fontWeight: '700', color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '2px solid var(--color-border)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sessions.length === 0 ? (
                <tr><td colSpan={8} style={{ padding: '40px', textAlign: 'center', color: 'var(--color-muted)' }}>Belum ada sesi proctoring.</td></tr>
              ) : sessions.map(s => (
                <tr key={s.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={{ padding: '12px 14px', color: 'var(--color-text)', fontWeight: '600' }}>{s.quiz_name || s.title || '-'}</td>
                  <td style={{ padding: '12px 14px', color: 'var(--color-muted)' }}>{s.teacher_name || s.dosen || '-'}</td>
                  <td style={{ padding: '12px 14px' }}>
                    <code style={{ background: 'var(--color-surface)', padding: '4px 8px', borderRadius: '6px', fontSize: '0.82rem', color: '#3b82f6', fontWeight: '600', border: '1px solid var(--color-border)' }}>{s.token || '-'}</code>
                  </td>
                  <td style={{ padding: '12px 14px' }}>{statusBadge(s.status)}</td>
                  <td style={{ padding: '12px 14px', color: 'var(--color-muted)', fontSize: '0.85rem' }}>{s.start_time ? new Date(s.start_time).toLocaleString('id-ID') : '-'}</td>
                  <td style={{ padding: '12px 14px', color: 'var(--color-muted)', fontSize: '0.85rem' }}>{s.end_time ? new Date(s.end_time).toLocaleString('id-ID') : '-'}</td>
                  <td style={{ padding: '12px 14px' }}>
                    <button id={`btn-logs-${s.id}`} onClick={() => viewLogs(s)} style={{ background: 'rgba(139,92,246,0.1)', color: '#8b5cf6', border: 'none', padding: '4px 10px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '600' }}>
                      {s.log_count || s.violations_count || 0} <i className="ph ph-eye"></i>
                    </button>
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      {(s.status === 'pending' || s.status === 'waiting') && (
                        <button id={`btn-start-${s.id}`} onClick={() => controlSession(s.id, 'start')} disabled={processingId === s.id} style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981', border: 'none', padding: '6px 10px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '600' }}>
                          <i className="ph ph-play"></i> Start
                        </button>
                      )}
                      {(s.status === 'active' || s.status === 'running') && (
                        <button id={`btn-stop-${s.id}`} onClick={() => controlSession(s.id, 'stop')} disabled={processingId === s.id} style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: 'none', padding: '6px 10px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '600' }}>
                          <i className="ph ph-stop"></i> Stop
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Logs Modal */}
      {showLogs && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => setShowLogs(null)}>
          <div className="siakad-card" onClick={e => e.stopPropagation()} style={{ padding: '32px', width: '100%', maxWidth: '600px', borderRadius: '20px', maxHeight: '80vh', overflowY: 'auto' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 'bold', color: 'var(--color-text)', margin: '0 0 8px 0' }}>Log Pelanggaran</h2>
            <p style={{ color: 'var(--color-muted)', fontSize: '0.9rem', margin: '0 0 20px 0' }}>Sesi: {showLogs.quiz_name || showLogs.title || showLogs.id}</p>
            
            {logs.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '30px', color: 'var(--color-muted)' }}>
                <i className="ph ph-shield-check" style={{ fontSize: '2.5rem', display: 'block', marginBottom: '12px', opacity: 0.4 }}></i>
                <p style={{ margin: 0 }}>Tidak ada pelanggaran terdeteksi.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {logs.map((log, idx) => {
                  const vc = violationColor(log.type || log.event_type);
                  return (
                    <div key={log.id || idx} style={{ display: 'flex', gap: '12px', padding: '12px', borderRadius: '10px', background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: `${vc}15`, color: vc, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '1.1rem' }}>
                        <i className={violationIcon(log.type || log.event_type)}></i>
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                          <span style={{ fontWeight: '600', color: vc, fontSize: '0.88rem', textTransform: 'capitalize' }}>{(log.type || log.event_type || 'violation').replace(/_/g, ' ')}</span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--color-muted)' }}>{log.created_at ? new Date(log.created_at).toLocaleTimeString('id-ID') : ''}</span>
                        </div>
                        <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--color-muted)' }}>{log.student_name || log.user_name || 'Mahasiswa'} — {log.description || log.message || '-'}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
              <button id="btn-close-logs" onClick={() => setShowLogs(null)} style={{ padding: '10px 20px', borderRadius: '10px', border: '1px solid var(--color-border)', background: 'transparent', color: 'var(--color-text)', cursor: 'pointer', fontWeight: '600' }}>Tutup</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
