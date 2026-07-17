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
    pending:  { label: 'Menunggu', bg: 'rgba(245,158,11,0.15)', color: '#f59e0b', border: 'rgba(245,158,11,0.3)' },
    approved: { label: 'Disetujui', bg: 'rgba(16,185,129,0.15)', color: '#10b981', border: 'rgba(16,185,129,0.3)' },
    rejected: { label: 'Ditolak', bg: 'rgba(239,68,68,0.15)', color: '#ef4444', border: 'rgba(239,68,68,0.3)' },
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
              <div key={i} style={{ flex: '1 1 90px', background: 'var(--glass-bg)', backdropFilter: 'none', borderRadius: '16px', padding: '16px 20px', textAlign: 'center', border: pendingCount > 0 && s.icon === 'ph-clock' ? '1px solid rgba(245,158,11,0.5)' : 'var(--glass-border)' }}>
                <i className={`ph ${s.icon}`} style={{ fontSize: '1.3rem', color: s.color, display: 'block', marginBottom: '4px' }}></i>
                <p style={{ color: 'white', fontWeight: '800', fontSize: '1.5rem', margin: '0 0 2px 0' }}>{s.value}</p>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.65rem', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', alignItems: 'start' }}>
        {/* Left List */}
        <div className="siakad-card stagger-1" style={{ padding: '24px 0 0 0', borderRadius: '24px', border: '1px solid var(--color-border)' }}>
          <div style={{ padding: '0 24px 20px 24px', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ margin: 0, color: 'var(--color-text)', fontWeight: '800', fontSize: '1.2rem' }}>Bimbingan KRS</h3>
            {pendingCount > 0 && (
              <span style={{ padding: '3px 10px', background: '#f59e0b', color: 'white', borderRadius: '999px', fontSize: '0.75rem', fontWeight: '800' }}>{pendingCount}</span>
            )}
          </div>
          <div style={{ padding: '12px 24px 6px 24px', borderBottom: '1px solid var(--color-border)' }}>
            <div style={{ position: 'relative', width: '100%' }}>
              <i className="ph ph-magnifying-glass" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-muted)', fontSize: '1.05rem' }}></i>
              <input 
                type="text" 
                placeholder="Cari nama, NIM, atau status..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ 
                  width: '100%', 
                  padding: '8px 12px 8px 46px', 
                  borderRadius: '50px', 
                  border: '1px solid var(--color-border)', 
                  outline: 'none', 
                  background: 'var(--color-bg)', 
                  color: 'var(--color-text)',
                  fontSize: '0.85rem',
                  boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.15)'
                }} 
              />
            </div>
          </div>
          <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '60vh', overflowY: 'auto' }}>
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
              }

              return filteredStudents.map((std, i) => {
                const sub = std.activeSubmission;
                const st = STATUS_STYLES[sub.status] || STATUS_STYLES.pending;
                const isActive = selectedSub?.mahasiswa?.nim === std.nim;
                
                return (
                  <button key={std.nim} onClick={() => { setSelectedSub(sub); setNotes(sub.notes || ''); }}
                    style={{ padding: '14px 16px', textAlign: 'left', background: isActive ? 'linear-gradient(135deg, rgba(196,30,58,0.1), rgba(99,102,241,0.1))' : 'var(--glass-bg)', border: `1px solid ${isActive ? 'rgba(196,30,58,0.4)' : 'var(--color-border)'}`, borderRadius: '24px', cursor: 'pointer', transition: 'all 0.2s', width: '100%' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'rgba(99,102,241,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6366f1', fontWeight: '800', flexShrink: 0 }}>
                        {(std.mahasiswa?.name || '?').charAt(0)}
                      </div>
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <p style={{ margin: '0 0 2px 0', fontWeight: '700', color: 'var(--color-text)', fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{std.mahasiswa?.name || 'Mahasiswa'}</p>
                        <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--color-muted)' }}>NIM: {std.nim}</p>
                      </div>
                      <span style={{ 
                        padding: '4px 10px', 
                        background: st.bg, 
                        color: st.color, 
                        border: `1px solid ${st.border}`, 
                        borderRadius: '50px', 
                        fontSize: '0.7rem', 
                        fontWeight: '700', 
                        whiteSpace: 'nowrap',
                        minWidth: '95px',
                        textAlign: 'center',
                        display: 'inline-block'
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
            <div className="siakad-card stagger-2" style={{ padding: '24px 0 0 0', borderRadius: '24px', border: '1px solid var(--color-border)', display: 'flex', flexDirection: 'column' }}>
              {/* Header */}
              <div style={{ padding: '0 24px 20px 24px', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <h2 style={{ margin: '0 0 4px 0', color: 'var(--color-text)', fontWeight: '800', fontSize: '1.2rem' }}>{selectedSub.mahasiswa?.name}</h2>
                  <p style={{ margin: 0, color: 'var(--color-muted)', fontSize: '0.85rem' }}>NIM: {selectedSub.mahasiswa?.nim || selectedSub.mahasiswa?.nim_nip} · Semester {selectedSub.semester}</p>
                </div>
                {(() => {
                  const st = STATUS_STYLES[selectedSub.status] || STATUS_STYLES.pending;
                  return <span style={{ 
                    padding: '8px 16px', 
                    background: st.bg, 
                    color: st.color, 
                    border: `1px solid ${st.border}`, 
                    borderRadius: '999px', 
                    fontWeight: '800', 
                    fontSize: '0.85rem',
                    minWidth: '100px',
                    textAlign: 'center'
                  }}>{st.label}</span>;
                })()}
              </div>

              <div style={{ padding: '28px' }}>
                {/* Course Table */}
                <h3 style={{ margin: '0 0 16px 0', fontWeight: '700', color: 'var(--color-text)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <i className="ph ph-books" style={{ color: '#6366f1' }}></i> Mata Kuliah yang Diambil
                </h3>
                <div style={{ borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--color-border)', marginBottom: '24px' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ background: 'rgba(0,0,0,0.04)', borderBottom: '1px solid var(--color-border)' }}>
                        {['Kode', 'Mata Kuliah', 'SKS'].map(h => (
                          <th key={h} style={{ padding: '12px 16px', fontWeight: '700', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-muted)' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {(selectedSub.courses || []).map((c, i) => (
                        <tr key={c.id || i} style={{ borderBottom: '1px solid var(--color-border)' }}>
                          <td style={{ padding: '12px 16px' }}><span style={{ padding: '4px 12px', background: 'rgba(99,102,241,0.1)', color: '#6366f1', borderRadius: '50px', fontSize: '0.8rem', fontWeight: '700' }}>{c.code}</span></td>
                          <td style={{ padding: '12px 16px', fontWeight: '600', color: 'var(--color-text)' }}>{c.name}</td>
                          <td style={{ padding: '12px 16px' }}><span style={{ display: 'inline-block', whiteSpace: 'nowrap', padding: '4px 12px', background: 'rgba(16,185,129,0.1)', color: '#10b981', borderRadius: '50px', fontSize: '0.8rem', fontWeight: '700' }}>{c.sks} SKS</span></td>
                        </tr>
                      ))}
                      <tr style={{ background: 'rgba(0,0,0,0.02)' }}>
                        <td colSpan="2" style={{ padding: '12px 16px', fontWeight: '700', color: 'var(--color-text)', textAlign: 'right' }}>Total SKS:</td>
                        <td style={{ padding: '12px 16px' }}>
                          <span style={{ padding: '6px 14px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: 'white', borderRadius: '50px', fontWeight: '800', fontSize: '1rem' }}>
                            {(selectedSub.courses || []).reduce((acc, c) => acc + (parseInt(c.sks) || 0), 0)} SKS
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
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
                            <div key={k} style={{ padding: '12px 16px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--color-border)', borderRadius: '16px', fontSize: '0.85rem' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                                <span style={{ fontWeight: '700', color: 'var(--color-text)' }}>Pengajuan ID #{hist.id}</span>
                                <span style={{ 
                                  padding: '2px 8px', 
                                  background: hs.bg, 
                                  color: hs.color, 
                                  border: `1px solid ${hs.border}`, 
                                  borderRadius: '50px', 
                                  fontSize: '0.7rem', 
                                  fontWeight: '700',
                                  minWidth: '80px',
                                  textAlign: 'center'
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
                    style={{ width: '100%', padding: '14px 20px', borderRadius: '24px', border: '1px solid var(--color-border)', background: selectedSub.status !== 'pending' ? 'var(--glass-bg)' : 'var(--color-bg)', color: 'var(--color-text)', fontSize: '0.95rem', outline: 'none', resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box' }}></textarea>
                </div>

                {/* Action Buttons */}
                {selectedSub.status === 'pending' && (
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button onClick={() => handleAction('approved')} disabled={processing}
                      style={{ flex: 1, padding: '14px', background: 'linear-gradient(135deg, #10b981, #059669)', color: 'white', borderRadius: '50px', border: 'none', cursor: processing ? 'not-allowed' : 'pointer', fontWeight: '800', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 8px 20px rgba(16,185,129,0.3)', transition: 'all 0.2s' }}>
                      <i className="ph ph-check-circle" style={{ fontSize: '1.2rem' }}></i> Setujui KRS
                    </button>
                    <button onClick={() => handleAction('rejected')} disabled={processing || !notes.trim()}
                      style={{ flex: 1, padding: '14px', background: (!notes.trim() || processing) ? 'var(--color-border)' : 'linear-gradient(135deg, #ef4444, #dc2626)', color: (!notes.trim() || processing) ? 'var(--color-muted)' : 'white', borderRadius: '50px', border: 'none', cursor: (!notes.trim() || processing) ? 'not-allowed' : 'pointer', fontWeight: '800', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: (!notes.trim() || processing) ? 'none' : '0 8px 20px rgba(239,68,68,0.3)', transition: 'all 0.2s' }}
                      title={!notes.trim() ? 'Isi catatan terlebih dahulu untuk menolak KRS' : ''}>
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
