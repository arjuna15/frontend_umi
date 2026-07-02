"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import CustomSelect from '../../components/CustomSelect';
export default function DosenPresensiPage() {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Modal States
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [selectedAttendance, setSelectedAttendance] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Form States
  const [meetingNumber, setMeetingNumber] = useState('');
  const [meetingDate, setMeetingDate] = useState('');
  const [meetingMode, setMeetingMode] = useState('Online');

  const fetchDashboard = async () => {
    const token = localStorage.getItem('siakad_token');
    if (!token) return router.push('/siakad/login');
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
      const res = await fetch(`${apiUrl}/siakad/dashboard`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to fetch');
      const result = await res.json();
      if (result.user.role !== 'dosen') return router.push('/siakad/login');
      setData(result);
    } catch (err) {
      router.push('/siakad/login');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, [router]);

  const handleCreateSession = async (e) => {
    e.preventDefault();
    if (!meetingNumber || !meetingDate || !selectedCourseId) return;

    const token = localStorage.getItem('siakad_token');
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
    
    try {
      const res = await fetch(`${apiUrl}/siakad/course/${selectedCourseId}/attendance`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          meeting_number: meetingNumber,
          date: meetingDate,
          mode: meetingMode
        })
      });
      if (res.ok) {
        setShowSessionModal(false);
        setMeetingNumber('');
        setMeetingDate('');
        fetchDashboard();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateRecord = async (attendanceId, mahasiswaId, status) => {
    const token = localStorage.getItem('siakad_token');
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
    
    try {
      const res = await fetch(`${apiUrl}/siakad/attendance/${attendanceId}/record`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          mahasiswa_id: mahasiswaId,
          status: status
        })
      });
      if (res.ok) {
        fetchDashboard();
        // Update local state for the modal view
        setSelectedAttendance(prev => {
          if (!prev) return prev;
          return {
            ...prev,
            records: prev.records.map(r => r.mahasiswa_id === mahasiswaId ? { ...r, status } : r)
          };
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading || !data) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--color-muted)' }}>
      <i className="ph ph-spinner ph-spin" style={{ fontSize: '2rem', marginRight: '10px' }}></i> Memuat modul absensi...
    </div>
  );

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #4c0519 100%)', borderRadius: '24px', padding: '40px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(196,30,58,0.15)', filter: 'blur(40px)' , flexShrink: 0 }}></div>
          <div style={{ position: 'absolute', bottom: '-20px', left: '30%', width: '150px', height: '150px', borderRadius: '50%', background: 'rgba(99,102,241,0.1)', filter: 'blur(30px)' , flexShrink: 0 }}></div>
          <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ flex: '1 1 100%' }}>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', margin: '0 0 8px 0', letterSpacing: '0.1em', textTransform: 'uppercase' }}>SIAKAD — DOSEN</p>
              <h1 style={{ fontSize: '2.2rem', fontWeight: '800', color: 'white', margin: '0 0 8px 0', letterSpacing: '-0.03em' }}>Presensi Mahasiswa</h1>
              <p style={{ color: 'rgba(255,255,255,0.6)', margin: 0, fontSize: '1.05rem' }}>Buka sesi kehadiran dan pantau keaktifan mahasiswa Anda di kelas.</p>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
        {data.jadwal.map((course, i) => (
          <div key={i} className={`siakad-card stagger-${(i % 5) + 1}`}>
            <div style={{ background: 'var(--glass-bg)', padding: '24px 32px', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', right: '-20px', top: '-20px', fontSize: '10rem', color: 'rgba(16, 185, 129, 0.03)', transform: 'rotate(15deg)', pointerEvents: 'none' }}>
                <i className="ph ph-calendar-check"></i>
              </div>
              <div style={{ zIndex: 1, flex: '1 1 200px' }}>
                <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#10b981', fontWeight: '800' }}>{course.name}</h3>
                <span style={{ display: 'inline-block', marginTop: '6px', fontSize: '0.85rem', color: 'var(--color-text)', fontWeight: '600', padding: '4px 12px', background: 'var(--glass-bg)', borderRadius: '999px' }}>{course.code} • {course.sks} SKS</span>
              </div>
              <button onClick={() => { setSelectedCourseId(course.id); setShowSessionModal(true); }} style={{ zIndex: 1, flexShrink: 0, background: '#10b981', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '12px', fontSize: '0.9rem', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <i className="ph ph-plus-circle" style={{ fontSize: '1.2rem' }}></i> Buka Sesi Baru
              </button>
            </div>

            <div style={{ padding: '32px' }}>
              {course.attendances && course.attendances.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {course.attendances.map((att, j) => (
                    <div key={j} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', padding: '20px', background: 'var(--glass-bg)', border: '1px solid rgba(229, 231, 235, 0.8)', borderRadius: '16px', boxShadow: '0 4px 10px rgba(0,0,0,0.02)' }}>
                      <div style={{ flex: '1 1 150px' }}>
                        <strong style={{ color: 'var(--color-text)', display: 'block', marginBottom: '8px', fontSize: '1.1rem', fontWeight: '800' }}>Pertemuan ke-{att.meeting_number}</strong>
                        <span style={{ fontSize: '0.9rem', color: 'var(--color-muted)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <i className="ph ph-calendar-blank"></i> {att.date}
                        </span>
                      </div>
                      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' , flexWrap: 'wrap' }}>
                        <div className="siakad-badge" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                          {att.records?.filter(r => r.status === 'present').length || 0} Hadir
                        </div>
                        <div className="siakad-badge" style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
                          {att.records?.filter(r => r.status === 'absent').length || 0} Alpa
                        </div>
                        <button onClick={() => { setSelectedAttendance(att); setSelectedCourseId(course.id); setSearchTerm(''); setShowDetailModal(true); }} style={{ background: 'var(--color-bg)', border: '1px solid #d1d5db', padding: '8px 16px', borderRadius: '8px', fontSize: '0.9rem', cursor: 'pointer', color: 'var(--color-text)', fontWeight: 'bold', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>Input & Detail</button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: 'var(--color-muted)', fontSize: '0.95rem', margin: 0, fontStyle: 'italic', padding: '16px', background: 'var(--glass-bg)', borderRadius: '12px', border: '1px dashed #d1d5db', textAlign: 'center' }}>Belum ada sesi absensi untuk kelas ini.</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Buat Sesi Modal */}
      {showSessionModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'var(--glass-bg)', backdropFilter: 'blur(8px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: 'var(--color-bg)', width: '100%', maxWidth: '400px', borderRadius: '24px', padding: '32px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
            <h3 style={{ margin: '0 0 24px 0', fontSize: '1.4rem', fontWeight: '800', color: 'var(--color-text)' }}>Buka Sesi Presensi</h3>
            <form onSubmit={handleCreateSession} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', color: 'var(--color-text)', marginBottom: '8px' }}>Pertemuan Ke-</label>
                <input type="number" required min="1" max="16" value={meetingNumber} onChange={e => setMeetingNumber(e.target.value)} style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '1rem' }} placeholder="Contoh: 1" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', color: 'var(--color-text)', marginBottom: '8px' }}>Tanggal Pertemuan</label>
                <input type="date" required value={meetingDate} onChange={e => setMeetingDate(e.target.value)} className="siakad-input" style={{ width: '100%' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', color: 'var(--color-text)', marginBottom: '8px' }}>Mode Kelas</label>
                <CustomSelect 
                  value={meetingMode} 
                  onChange={setMeetingMode}
                  options={[
                    { value: "Online", label: "Online" },
                    { value: "Bintaro", label: "Offline - Kampus Bintaro" },
                    { value: "Pasar Minggu", label: "Offline - Kampus Ps. Minggu" }
                  ]}
                  style={{ width: '100%', minWidth: 0, flex: '1 1 120px'}}
                />
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                <button type="button" onClick={() => setShowSessionModal(false)} style={{ flex: 1, padding: '14px', borderRadius: '12px', background: 'var(--glass-bg)', color: 'var(--color-text)', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>Batal</button>
                <button type="submit" style={{ flex: 1, padding: '14px', borderRadius: '12px', background: '#10b981', color: 'white', fontWeight: 'bold', border: 'none', cursor: 'pointer', boxShadow: '0 4px 15px rgba(16,185,129,0.3)' }}>Buat Sesi</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Input Detail Modal */}
      {showDetailModal && selectedAttendance && (
        <div style={{ position: 'fixed', inset: 0, background: 'var(--glass-bg)', backdropFilter: 'blur(8px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: 'var(--color-bg)', width: '100%', maxWidth: '600px', borderRadius: '24px', padding: '32px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h3 style={{ margin: '0 0 4px 0', fontSize: '1.4rem', fontWeight: '800', color: 'var(--color-text)' }}>Input Presensi</h3>
                <p style={{ margin: 0, color: 'var(--color-text)', fontSize: '0.9rem' }}>Pertemuan ke-{selectedAttendance.meeting_number} • {selectedAttendance.date}</p>
              </div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' , flexWrap: 'wrap' }}>
                <div style={{ position: 'relative' }}>
                  <i className="ph ph-magnifying-glass" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-muted)' }}></i>
                  <input 
                    type="text" 
                    placeholder="Cari mahasiswa..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ padding: '8px 10px 8px 36px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-bg)', color: 'var(--color-text)', width: '200px' }}
                  />
                </div>
                <button onClick={() => setShowDetailModal(false)} style={{ background: 'var(--glass-bg)', border: 'none', width: '36px', height: '36px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text)' , flexShrink: 0 }}>
                  <i className="ph ph-x" style={{ fontSize: '1.2rem' }}></i>
                </button>
              </div>
            </div>

            <div style={{ overflowY: 'auto', flex: 1, paddingRight: '8px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: 'var(--glass-bg)' }}>
                    <th style={{ padding: '12px 16px', borderBottom: '2px solid #e2e8f0', color: 'var(--color-text)', fontSize: '0.85rem' }}>Mahasiswa</th>
                    <th style={{ padding: '12px 16px', borderBottom: '2px solid #e2e8f0', color: 'var(--color-text)', fontSize: '0.85rem' }}>Status</th>
                    <th style={{ padding: '12px 16px', borderBottom: '2px solid #e2e8f0', color: 'var(--color-text)', fontSize: '0.85rem', textAlign: 'right' }}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {(() => {
                    const course = data.jadwal.find(c => c.id === selectedCourseId);
                    if (!course || !course.grades) return <tr><td colSpan="3">Data tidak ditemukan.</td></tr>;
                    
                    const filteredGrades = course.grades.filter(g => {
                      const query = searchTerm.toLowerCase();
                      const name = g.mahasiswa?.name?.toLowerCase() || '';
                      const nim = g.mahasiswa?.nim_nip?.toLowerCase() || g.mahasiswa?.nim?.toLowerCase() || '';
                      return name.includes(query) || nim.includes(query);
                    });

                    if (filteredGrades.length === 0) {
                      return <tr><td colSpan="3" style={{ textAlign: 'center', padding: '20px', color: 'var(--color-muted)' }}>Mahasiswa tidak ditemukan.</td></tr>;
                    }
                    
                    return filteredGrades.map(grade => {
                      const mhs = grade.mahasiswa;
                      const record = selectedAttendance.records?.find(r => r.mahasiswa_id === mhs.id);
                      const status = record ? record.status : 'absent';
                      return (
                        <tr key={mhs.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td style={{ padding: '12px 16px' }}>
                            <div style={{ fontWeight: '700', color: 'var(--color-text)' }}>{mhs.name}</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--color-text)' }}>{mhs.nim_nip}</div>
                          </td>
                          <td style={{ padding: '12px 16px' }}>
                            {status === 'present' ? (
                              <span style={{ background: 'var(--glass-bg)', color: 'var(--color-text)', padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 'bold' }}>Hadir</span>
                            ) : (
                              <span style={{ background: 'var(--glass-bg)', color: '#dc2626', padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 'bold' }}>Alpa</span>
                            )}
                          </td>
                          <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                            <div style={{ display: 'inline-flex', background: 'var(--glass-bg)', borderRadius: '8px', padding: '4px' }}>
                              <button onClick={() => handleUpdateRecord(selectedAttendance.id, mhs.id, 'present')} style={{ background: status === 'present' ? 'white' : 'transparent', color: status === 'present' ? '#059669' : '#94a3b8', border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 'bold', cursor: 'pointer', boxShadow: status === 'present' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none' }}>H</button>
                              <button onClick={() => handleUpdateRecord(selectedAttendance.id, mhs.id, 'absent')} style={{ background: status === 'absent' ? 'white' : 'transparent', color: status === 'absent' ? '#dc2626' : '#94a3b8', border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 'bold', cursor: 'pointer', boxShadow: status === 'absent' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none' }}>A</button>
                            </div>
                          </td>
                        </tr>
                      );
                    });
                  })()}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
