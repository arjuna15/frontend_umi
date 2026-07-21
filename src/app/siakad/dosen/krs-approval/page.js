"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function KrsApprovalPage() {
  const router = useRouter();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSub, setSelectedSub] = useState(null);
  const [notes, setNotes] = useState('');
  const [processing, setProcessing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const STATUS_STYLES = {
    pending:  { label: 'Menunggu', bg: 'rgba(217,119,6,0.15)', color: '#d97706', border: 'rgba(217,119,6,0.3)' },
    approved: { label: 'Disetujui', bg: 'rgba(4,120,87,0.15)', color: '#047857', border: 'rgba(4,120,87,0.3)' },
    rejected: { label: 'Ditolak', bg: 'rgba(185,28,28,0.15)', color: '#b91c1c', border: 'rgba(185,28,28,0.3)' },
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    const token = localStorage.getItem('siakad_token');
    if (!token) return router.push('/siakad/login');

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
      const res = await fetch(`${apiUrl}/siakad/dosen/krs`, { headers: { 'Authorization': `Bearer ${token}` } });
      if (res.ok) { 
        const result = await res.json(); 
        const fetchedSubs = result.submissions || [];
        setSubmissions(fetchedSubs);
        
        if (selectedSub) {
          const freshSub = fetchedSubs.find(s => s.id === selectedSub.id);
          if (freshSub) setSelectedSub(freshSub);
        }
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleAction = async (status) => {
    if (!selectedSub) return;
    setProcessing(true);
    const token = localStorage.getItem('siakad_token');
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
    try {
      const res = await fetch(`${apiUrl}/siakad/dosen/krs/approve`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ submission_id: selectedSub.id, status, notes })
      });
      if (res.ok) {
        window.toast && window.toast(`KRS berhasil di-${status === 'approved' ? 'Setujui' : 'Tolak'}!`);
        setSelectedSub(null); 
        setNotes(''); 
        await fetchSubmissions();
      } else {
        const err = await res.json();
        window.toast && window.toast('Gagal: ' + (err.message || 'Error'));
      }
    } catch (err) { window.toast && window.toast('Error: ' + err.message); }
    finally { setProcessing(false); }
  };

  // Group submissions by student NIM to avoid multiple entries for the same student
  const groupedStudents = {};
  submissions.forEach(sub => {
    const nim = sub.mahasiswa?.nim || sub.mahasiswa?.nim_nip || 'unknown';
    if (!groupedStudents[nim]) {
      groupedStudents[nim] = [];
    }
    groupedStudents[nim].push(sub);
  });

  // Convert grouped students to list representation
  const studentList = Object.keys(groupedStudents).map(nim => {
    const subs = groupedStudents[nim];
    const sortedSubs = [...subs].sort((a, b) => {
      if (a.status === 'pending' && b.status !== 'pending') return -1;
      if (a.status !== 'pending' && b.status === 'pending') return 1;
      return b.id - a.id;
    });

    const activeSubmission = sortedSubs[0]; 
    const historySubmissions = sortedSubs.slice(1); 

    return {
      nim,
      mahasiswa: activeSubmission.mahasiswa,
      activeSubmission,
      historySubmissions,
      hasPending: subs.some(s => s.status === 'pending'),
    };
  });

  // Sort student list: Put students with pending requests at the top
  const sortedStudents = [...studentList].sort((a, b) => {
    if (a.hasPending && !b.hasPending) return -1;
    if (!a.hasPending && b.hasPending) return 1;
    return (a.mahasiswa?.name || '').localeCompare(b.mahasiswa?.name || '');
  });

  const pendingCount = submissions.filter(s => s.status === 'pending').length;

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '12px', color: 'var(--color-muted)' }}>
      <i className="ph ph-spinner ph-spin" style={{ fontSize: '2rem' }}></i> Memuat data KRS...
    </div>
  );

  return (
    <div className="fade-in" style={{ paddingBottom: '40px' }}>
      {/* Hero Header */}
      <div className="siakad-page-header">
        <div className="siakad-page-header-glow"></div>
        <div className="siakad-page-header-grid"></div>
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ flex: '1 1 300px' }}>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', margin: '0 0 8px 0', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: '600' }}>SIAKAD — DOSEN WALI</p>
            <h1 style={{ color: 'white', fontSize: '2.2rem', fontWeight: '900', margin: '0 0 8px 0', letterSpacing: '-0.03em' }}>Persetujuan KRS Mahasiswa</h1>
            <p style={{ color: 'rgba(255,255,255,0.6)', margin: 0 }}>Validasi rencana studi mahasiswa bimbingan Anda untuk semester ini.</p>
          </div>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', flex: '1 1 300px', justifyContent: 'center' }}>
            {[
              { label: 'Total Mahasiswa', value: sortedStudents.length, icon: 'ph-users', color: '#6366f1' },
              { label: 'Menunggu', value: pendingCount, icon: 'ph-clock', color: '#f59e0b' },
              { label: 'Disetujui', value: submissions.filter(s=>s.status==='approved').length, icon: 'ph-check-circle', color: '#10b981' },
            ].map((s, i) => (
              <div key={i} style={{ flex: '1 1 90px', background: 'var(--glass-bg)', borderRadius: '16px', padding: '16px 20px', textAlign: 'center', border: 'var(--glass-border)', boxShadow: 'var(--glass-shadow)' }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px' }}>
                  <div style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    background: 'var(--glass-bg)',
                    boxShadow: 'inset 2px 2px 5px var(--inset-shadow-dark), inset -2px -2px 5px var(--inset-shadow-light)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <i className={`ph ${s.icon}`} style={{ fontSize: '1.2rem', color: s.color }}></i>
                  </div>
                </div>
                <p style={{ color: 'var(--color-text)', fontWeight: '800', fontSize: '1.5rem', margin: '0 0 2px 0' }}>{s.value}</p>
                <p style={{ color: 'var(--color-muted)', fontSize: '0.65rem', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', alignItems: 'start' }}>
        {/* Left List */}
        <div className="stagger-1" style={{ padding: '24px 0 0 0', borderRadius: '24px', border: 'var(--glass-border)', background: 'var(--glass-bg)', boxShadow: 'var(--glass-shadow)' }}>
          <div style={{ padding: '0 24px 20px 24px', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ margin: 0, color: 'var(--color-text)', fontWeight: '800', fontSize: '1.2rem' }}>Bimbingan KRS</h3>
            {pendingCount > 0 && (
              <span className="siakad-badge" style={{ color: '#C41E3A', padding: '2px 8px', minWidth: '24px', justifyContent: 'center' }}>{pendingCount}</span>
            )}
          </div>
          <div style={{ padding: '12px 24px 6px 24px', borderBottom: '1px solid var(--color-border)' }}>
            <div style={{ position: 'relative', width: '100%' }}>
              <i className="ph ph-magnifying-glass" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-muted)', fontSize: '1.05rem' }}></i>
              <input 
                type="text" 
                className="siakad-input"
                placeholder="Cari nama, NIM, atau status..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ 
                  width: '100%', 
                  padding: '10px 12px 10px 46px', 
                  outline: 'none', 
                  fontSize: '0.9rem'
                }} 
              />
            </div>
          </div>
          <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '60vh', overflowY: 'auto' }}>
            {(() => {
              const filteredStudents = sortedStudents.filter(std => {
                const query = searchQuery.toLowerCase().trim();
                if (!query) return true;
                return (
                  std.mahasiswa?.name?.toLowerCase().includes(query) ||
                  std.nim?.toLowerCase().includes(query) ||
                  std.activeSubmission?.status?.toLowerCase().includes(query)
                );
              });

              if (filteredStudents.length === 0) {
                return (
                  <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--color-muted)' }}>
                    <i className="ph ph-magnifying-glass" style={{ fontSize: '2.5rem', display: 'block', marginBottom: '8px', opacity: 0.3 }}></i>
                    Mahasiswa tidak ditemukan.
                  </div>
                );
              }              return filteredStudents.map((std, i) => {
                const sub = std.activeSubmission;
                const st = STATUS_STYLES[sub.status] || STATUS_STYLES.pending;
                const isActive = selectedSub?.mahasiswa?.nim === std.nim;
                
                return (
                  <button key={std.nim} onClick={() => { setSelectedSub(sub); setNotes(sub.notes || ''); }}
                    className={isActive ? 'active' : ''}
                    style={{ padding: '14px 16px', textAlign: 'left', background: 'var(--glass-bg)', border: isActive ? '1.5px solid var(--apple-blue)' : 'var(--glass-border)', boxShadow: isActive ? 'inset 3px 3px 6px var(--inset-shadow-dark), inset -3px -3px 6px var(--inset-shadow-light)' : 'var(--glass-shadow)', borderRadius: '24px', cursor: 'pointer', transition: 'all 0.2s', width: '100%' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ 
                        width: '38px', 
                        height: '38px', 
                        borderRadius: '50%', 
                        background: 'rgba(0, 0, 0, 0.04)', 
                        boxShadow: 'inset 3px 3px 6px var(--inset-shadow-dark), inset -3px -3px 6px var(--inset-shadow-light)',
                        border: 'var(--inset-border)',
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        color: 'var(--apple-blue)', 
                        fontWeight: '800', 
                        flexShrink: 0 
                      }}>
                        {(std.mahasiswa?.name || '?').charAt(0)}
                      </div>
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <p style={{ margin: '0 0 2px 0', fontWeight: '700', color: 'var(--color-text)', fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{std.mahasiswa?.name || 'Mahasiswa'}</p>
                        <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--color-muted)' }}>NIM: {std.nim}</p>
                      </div>
                      <span className="siakad-badge-status" style={{ 
                        color: st.color, 
                        borderColor: st.border
                      }}>{st.label}</span>
                    </div>
                  </button>
                );
              });
            })()}
          </div>
        </div>
 
         {/* Right Detail */}
        <div>
          {selectedSub ? (
            <div className="stagger-2" style={{ padding: '24px 0 0 0', borderRadius: '24px', border: 'var(--glass-border)', background: 'var(--glass-bg)', boxShadow: 'var(--glass-shadow)', display: 'flex', flexDirection: 'column' }}>
              {/* Header */}
              <div style={{ padding: '0 24px 20px 24px', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <h2 style={{ margin: '0 0 4px 0', color: 'var(--color-text)', fontWeight: '800', fontSize: '1.2rem' }}>{selectedSub.mahasiswa?.name}</h2>
                  <p style={{ margin: 0, color: 'var(--color-muted)', fontSize: '0.85rem' }}>NIM: {selectedSub.mahasiswa?.nim || selectedSub.mahasiswa?.nim_nip} · Semester {selectedSub.semester}</p>
                </div>
                {(() => {
                  const st = STATUS_STYLES[selectedSub.status] || STATUS_STYLES.pending;
                  return <span className="siakad-badge-status" style={{ 
                    color: st.color, 
                    borderColor: st.border
                  }}>{st.label}</span>;
                })()}
              </div>
 
               <div style={{ padding: '28px' }}>
                {/* Course Table */}
                <h3 style={{ margin: '0 0 16px 0', fontWeight: '700', color: 'var(--color-text)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <i className="ph ph-books" style={{ color: '#6366f1' }}></i> Mata Kuliah yang Diambil
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
                  {(selectedSub.courses || []).map((c, i) => (
                    <div key={c.id || i} style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '14px 20px',
                      background: 'var(--liquid-bg)',
                      border: 'var(--inset-border)',
                      borderRadius: '16px',
                      boxShadow: 'inset 2px 2px 5px var(--inset-shadow-dark), inset -2px -2px 5px var(--inset-shadow-light)'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span className="siakad-badge" style={{ background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%) !important', color: 'white !important', padding: '2px 10px !important', fontSize: '0.75rem !important', fontWeight: '700 !important' }}>{c.code}</span>
                        <span style={{ fontWeight: '600', color: 'var(--color-text)' }}>{c.name}</span>
                      </div>
                      <span className="siakad-badge" style={{ background: 'var(--glass-bg)', color: '#10b981 !important', padding: '2px 10px !important', fontSize: '0.75rem !important', fontWeight: '700 !important', border: '1px solid rgba(16,185,129,0.15)', boxShadow: 'inset 1px 1px 3px rgba(0,0,0,0.1), 1px 1px 2px rgba(255,255,255,0.8)' }}>{c.sks} SKS</span>
                    </div>
                  ))}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '14px 20px',
                    marginTop: '4px',
                    background: 'var(--glass-bg)',
                    border: 'var(--glass-border)',
                    borderRadius: '16px',
                    boxShadow: 'var(--glass-shadow)'
                  }}>
                    <span style={{ fontWeight: '700', color: 'var(--color-text)' }}>Total SKS:</span>
                    <span className="siakad-badge" style={{ background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%) !important', color: 'white !important', padding: '4px 14px !important', fontWeight: '800 !important', fontSize: '0.9rem !important' }}>
                      {(selectedSub.courses || []).reduce((acc, c) => acc + (parseInt(c.sks) || 0), 0)} SKS
                    </span>
                  </div>
                </div>

                {/* History Log Section */}
                {(() => {
                  const studentNim = selectedSub.mahasiswa?.nim || selectedSub.mahasiswa?.nim_nip;
                  const record = studentList.find(s => s.nim === studentNim);
                  if (!record || !record.historySubmissions || record.historySubmissions.length === 0) return null;

                  return (
                    <div style={{ marginBottom: '24px' }}>
                      <h3 style={{ margin: '0 0 12px 0', fontWeight: '700', color: 'var(--color-text)', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.95rem' }}>
                        <i className="ph ph-clock-counter-clockwise" style={{ color: '#8b5cf6' }}></i> Riwayat Pengajuan Sebelumnya
                      </h3>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {record.historySubmissions.map((hist, k) => {
                          const hs = STATUS_STYLES[hist.status] || STATUS_STYLES.pending;
                          return (
                            <div key={k} style={{ padding: '12px 16px', background: 'var(--glass-bg)', border: 'var(--glass-border)', boxShadow: 'var(--glass-shadow)', borderRadius: '16px', fontSize: '0.85rem' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                                <span style={{ fontWeight: '700', color: 'var(--color-text)' }}>Pengajuan ID #{hist.id}</span>
                                <span className="siakad-badge" style={{ 
                                  background: `linear-gradient(135deg, ${hs.color} 0%, ${hs.color} 100%) !important`, 
                                  color: 'white !important', 
                                  padding: '2px 8px !important', 
                                  fontSize: '0.7rem !important', 
                                  fontWeight: '800 !important',
                                  minWidth: '80px !important'
                                }}>{hs.label}</span>
                              </div>
                              {hist.notes && (
                                <p style={{ margin: '4px 0 0 0', color: 'var(--color-muted)', fontStyle: 'italic' }}>
                                  Catatan: &ldquo;{hist.notes}&rdquo;
                                </p>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })()}
 
                 {/* Notes */}
                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', fontWeight: '700', color: 'var(--color-text)', fontSize: '0.9rem' }}>
                    <i className="ph ph-note-pencil" style={{ color: '#f59e0b' }}></i> Catatan Dosen Wali
                    {selectedSub.status === 'rejected' && <span style={{ fontWeight: '400', color: '#ef4444', fontSize: '0.8rem' }}>* Wajib diisi saat menolak</span>}
                  </label>
                  <textarea value={notes} onChange={e => setNotes(e.target.value)}
                    placeholder={selectedSub.status === 'pending' ? 'Berikan catatan revisi jika KRS akan ditolak...' : (notes || 'Tidak ada catatan.')}
                    rows="3" disabled={selectedSub.status !== 'pending'}
                    style={{ width: '100%', padding: '14px 20px', borderRadius: '24px', border: 'var(--inset-border)', background: 'var(--liquid-bg)', color: 'var(--color-text)', fontSize: '0.95rem', outline: 'none', resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box', boxShadow: 'inset 3px 3px 6px var(--inset-shadow-dark), inset -3px -3px 6px var(--inset-shadow-light)' }}></textarea>
                </div>
 
                 {/* Action Buttons */}
                 {selectedSub.status === 'pending' && (
                   <div style={{ display: 'flex', gap: '16px' }}>
                     <button 
                       onClick={() => handleAction('approved')} 
                       disabled={processing}
                       className="siakad-btn-success"
                       style={{ 
                         flex: 1, 
                         padding: '14px',
                         justifyContent: 'center'
                       }}
                     >
                       <i className="ph ph-check-circle" style={{ fontSize: '1.2rem' }}></i> Setujui KRS
                     </button>
                     <button 
                       onClick={() => handleAction('rejected')} 
                       disabled={processing || !notes.trim()}
                       className="siakad-btn-primary"
                       style={{ 
                         flex: 1, 
                         padding: '14px',
                         justifyContent: 'center',
                         background: (!notes.trim() || processing) ? 'var(--color-border) !important' : undefined, 
                         color: (!notes.trim() || processing) ? 'var(--color-muted) !important' : undefined,
                         boxShadow: (!notes.trim() || processing) ? 'none !important' : undefined
                       }}
                       title={!notes.trim() ? 'Isi catatan terlebih dahulu untuk menolak KRS' : ''}
                     >
                       <i className="ph ph-x-circle" style={{ fontSize: '1.2rem' }}></i>
                       {!notes.trim() ? 'Isi Catatan Dulu' : 'Tolak & Minta Revisi'}
                     </button>
                   </div>
                 )}
              </div>
            </div>
          ) : (
            <div className="siakad-card stagger-2" style={{ padding: '80px 40px', textAlign: 'center', color: 'var(--color-muted)' }}>
              <i className="ph ph-check-square-offset" style={{ fontSize: '5rem', display: 'block', marginBottom: '16px', opacity: 0.25 }}></i>
              <h3 style={{ margin: '0 0 8px 0', color: 'var(--color-text)' }}>Pilih Mahasiswa</h3>
              <p style={{ margin: 0 }}>Pilih mahasiswa dari daftar di samping untuk melihat detail KRS, riwayat pengajuan, dan melakukan validasi.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
