"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import CustomSelect from '../../components/CustomSelect';
import CustomDatePicker from '../../components/CustomDatePicker';
import ModalShell from '../../components/ModalShell';
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
      const activePortal = localStorage.getItem('siakad_portal') || localStorage.getItem('siakad_role');
      const res = await fetch(`${apiUrl}/siakad/dashboard`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          ...(activePortal ? { 'X-SIAKAD-PORTAL': activePortal } : {})
        }
      });
      if (!res.ok) throw new Error('Failed to fetch');
      const result = await res.json();
      if (result.user.role !== 'dosen' && !(result.user.role === 'kaprodi' && activePortal === 'dosen')) return router.push('/siakad/login');
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
        <div className="siakad-page-header">
        <div className="siakad-page-header-glow"></div>
        <div className="siakad-page-header-grid"></div>
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
                <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#059669', fontWeight: '800' }}>{course.name}</h3>
                <span style={{ display: 'inline-block', marginTop: '6px', fontSize: '0.85rem', color: 'var(--color-text)', fontWeight: '600', padding: '4px 12px', background: 'var(--glass-bg)', borderRadius: '999px' }}>{course.code} • {course.sks} SKS</span>
              </div>
              <button onClick={() => { setSelectedCourseId(course.id); setShowSessionModal(true); }} style={{ zIndex: 1, flexShrink: 0, background: 'linear-gradient(135deg, #059669 0%, #047857 100%)', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '50px', fontSize: '0.9rem', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 8px 20px rgba(4, 120, 87, 0.3)', display: 'flex', alignItems: 'center', gap: '8px' , flexWrap: 'wrap'}}>
                <i className="ph ph-plus-circle" style={{ fontSize: '1.2rem' }}></i> Buka Sesi Baru
              </button>
            </div>

            <div style={{ padding: '32px' }}>
              {course.attendances && course.attendances.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' , flexWrap: 'wrap'}}>
                  {course.attendances.map((att, j) => (
                    <div key={j} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', padding: '20px', background: 'var(--glass-bg)', border: '1px solid rgba(229, 231, 235, 0.8)', borderRadius: '24px', boxShadow: '0 4px 10px rgba(0,0,0,0.02)' }}>
                      <div style={{ flex: '1 1 150px' }}>
                        <strong style={{ color: 'var(--color-text)', display: 'block', marginBottom: '8px', fontSize: '1.1rem', fontWeight: '800' }}>Pertemuan ke-{att.meeting_number}</strong>
                        <span style={{ fontSize: '0.9rem', color: 'var(--color-muted)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px' , flexWrap: 'wrap'}}>
                          <i className="ph ph-calendar-blank"></i> {att.date}
                        </span>
                      </div>
                      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' , flexWrap: 'wrap' }}>
                        <div className="siakad-badge" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '50px' }}>
                          {att.records?.filter(r => r.status === 'present').length || 0} Hadir
                        </div>
                        <div className="siakad-badge" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: '50px' }}>
                          {att.records?.filter(r => r.status === 'excused').length || 0} Izin
                        </div>
                        <div className="siakad-badge" style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '50px' }}>
                          {att.records?.filter(r => r.status === 'absent').length || 0} Alpa
                        </div>
                        <button onClick={() => { setSelectedAttendance(att); setSelectedCourseId(course.id); setSearchTerm(''); setShowDetailModal(true); }} style={{ background: 'var(--color-bg)', border: '1px solid #d1d5db', padding: '8px 18px', borderRadius: '50px', fontSize: '0.9rem', cursor: 'pointer', color: 'var(--color-text)', fontWeight: 'bold', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>Input & Detail</button>
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
        <ModalShell
          title="Buka Sesi Presensi"
          subtitle="Manajemen Presensi"
          icon="ph-calendar-check"
          iconBg="linear-gradient(135deg, #10b981 0%, #0f766e 100%)"
          onClose={() => setShowSessionModal(false)}
          maxWidth="560px"
        >
          <form onSubmit={handleCreateSession} style={{ display: 'flex', flexDirection: 'column', gap: '20px', flexWrap: 'wrap' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', color: 'var(--color-text)', marginBottom: '8px' }}>Pertemuan Ke-</label>
              <input type="number" required min="1" max="16" value={meetingNumber} onChange={e => setMeetingNumber(e.target.value)} style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '1rem' }} placeholder="Contoh: 1" />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', color: 'var(--color-text)', marginBottom: '8px' }}>Tanggal Pertemuan</label>
              <CustomDatePicker value={meetingDate} onChange={val => setMeetingDate(val)} />
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
            <div style={{ display: 'flex', gap: '12px', marginTop: '12px', flexWrap: 'wrap' }}>
              <button type="button" onClick={() => setShowSessionModal(false)} style={{ flex: 1, padding: '14px', borderRadius: '12px', background: 'var(--glass-bg)', color: 'var(--color-text)', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>Batal</button>
              <button type="submit" style={{ flex: 1, padding: '14px', borderRadius: '12px', background: '#10b981', color: 'white', fontWeight: 'bold', border: 'none', cursor: 'pointer', boxShadow: '0 4px 15px rgba(16,185,129,0.3)' }}>Buat Sesi</button>
            </div>
          </form>
        </ModalShell>
      )}

      {/* Input Detail Modal */}
      {showDetailModal && selectedAttendance && (
        <ModalShell
          title="Input Presensi"
          subtitle={`Pertemuan ke-${selectedAttendance.meeting_number} • ${selectedAttendance.date}`}
          icon="ph-calendar-check"
          iconBg="linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)"
          onClose={() => setShowDetailModal(false)}
          maxWidth="1100px"
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '20px' }}>
            <div style={{ fontSize: '0.95rem', color: 'var(--color-text)', fontWeight: '600' }}>
              Pilih status kehadiran untuk tiap mahasiswa.
            </div>
            <div style={{ position: 'relative' }}>
              <i className="ph ph-magnifying-glass" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-muted)' }}></i>
              <input 
                type="text" 
                placeholder="Cari mahasiswa..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ padding: '8px 10px 8px 46px', borderRadius: '50px', border: '1px solid var(--color-border)', background: 'var(--color-bg)', color: 'var(--color-text)', width: '220px', maxWidth: '100%', boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.15)' }}
              />
            </div>
          </div>

          <div style={{ overflowX: 'auto', maxHeight: '65vh', overflowY: 'auto', border: '1px solid var(--color-border)', borderRadius: '16px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: 'var(--glass-bg)' }}>
                  <th style={{ padding: '12px 16px', borderBottom: '2px solid #e2e8f0', color: 'var(--color-text)', fontSize: '0.85rem' }}>Mahasiswa</th>
                  <th style={{ padding: '12px 16px', borderBottom: '2px solid #e2e8f0', color: 'var(--color-text)', fontSize: '0.85rem', textAlign: 'center' }}>Status</th>
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
                          <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                            {status === 'present' ? (
                              <span style={{ background: '#059669', color: 'white', padding: '6px 14px', borderRadius: '50px', fontSize: '0.75rem', fontWeight: '800', boxShadow: '0 2px 6px rgba(5,150,105,0.3)' }}>Hadir</span>
                            ) : status === 'excused' ? (
                              <span style={{ background: '#f59e0b', color: 'white', padding: '6px 14px', borderRadius: '50px', fontSize: '0.75rem', fontWeight: '800', boxShadow: '0 2px 6px rgba(245,158,11,0.3)' }}>Izin</span>
                            ) : (
                              <span style={{ background: '#ef4444', color: 'white', padding: '6px 14px', borderRadius: '50px', fontSize: '0.75rem', fontWeight: '800', boxShadow: '0 2px 6px rgba(239,68,68,0.3)' }}>Alpa</span>
                            )}
                          </td>
                          <td style={{ padding: '12px 16px' }}>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '4px' , flexWrap: 'wrap'}}>
                              <div style={{ display: 'inline-flex', background: 'rgba(0,0,0,0.1)', borderRadius: '50px', padding: '4px', gap: '4px', border: '1px solid var(--color-border)' }}>
                                <button onClick={() => handleUpdateRecord(selectedAttendance.id, mhs.id, 'present')} 
                                  style={{ 
                                    background: status === 'present' ? '#059669' : 'transparent', 
                                    color: status === 'present' ? 'white' : 'var(--color-muted)', 
                                    border: 'none', padding: '6px 14px', borderRadius: '50px', fontSize: '0.8rem', fontWeight: 'bold', cursor: 'pointer', 
                                    boxShadow: status === 'present' ? '0 2px 6px rgba(5,150,105,0.3)' : 'none',
                                    transition: 'all 0.15s'
                                  }}>H</button>
                                <button onClick={() => handleUpdateRecord(selectedAttendance.id, mhs.id, 'excused')} 
                                  style={{ 
                                    background: status === 'excused' ? '#f59e0b' : 'transparent', 
                                    color: status === 'excused' ? 'white' : 'var(--color-muted)', 
                                    border: 'none', padding: '6px 14px', borderRadius: '50px', fontSize: '0.8rem', fontWeight: 'bold', cursor: 'pointer', 
                                    boxShadow: status === 'excused' ? '0 2px 6px rgba(245,158,11,0.3)' : 'none',
                                    transition: 'all 0.15s'
                                  }}>I</button>
                                <button onClick={() => handleUpdateRecord(selectedAttendance.id, mhs.id, 'absent')} 
                                  style={{ 
                                    background: status === 'absent' ? '#ef4444' : 'transparent', 
                                    color: status === 'absent' ? 'white' : 'var(--color-muted)', 
                                    border: 'none', padding: '6px 14px', borderRadius: '50px', fontSize: '0.8rem', fontWeight: 'bold', cursor: 'pointer', 
                                    boxShadow: status === 'absent' ? '0 2px 6px rgba(239,68,68,0.3)' : 'none',
                                    transition: 'all 0.15s'
                                  }}>A</button>
                              </div>
                            </div>
                          </td>
                        </tr>
                      );
                    });
                  })()}
                </tbody>
              </table>
            </div>
        </ModalShell>
      )}

    </div>
  );
}
