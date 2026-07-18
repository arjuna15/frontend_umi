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
    
    // Simpan status lama untuk rollback jika request gagal
    let oldStatus = null;
    setSelectedAttendance(prev => {
      if (!prev) return prev;
      const record = prev.records.find(r => r.mahasiswa_id === mahasiswaId);
      if (record) {
        oldStatus = record.status;
      }
      return {
        ...prev,
        records: prev.records.map(r => r.mahasiswa_id === mahasiswaId ? { ...r, status } : r)
      };
    });

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
        // Refresh dashboard data secara asynchronous di background
        fetchDashboard();
      } else {
        // Rollback ke status semula jika server merespon dengan error
        setSelectedAttendance(prev => {
          if (!prev || oldStatus === null) return prev;
          return {
            ...prev,
            records: prev.records.map(r => r.mahasiswa_id === mahasiswaId ? { ...r, status: oldStatus } : r)
          };
        });
        window.toast && window.toast('Gagal memperbarui status presensi di server');
      }
    } catch (err) {
      console.error(err);
      // Rollback jika terjadi kegagalan jaringan
      setSelectedAttendance(prev => {
        if (!prev || oldStatus === null) return prev;
        return {
          ...prev,
          records: prev.records.map(r => r.mahasiswa_id === mahasiswaId ? { ...r, status: oldStatus } : r)
        };
      });
      window.toast && window.toast('Terjadi kesalahan jaringan');
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
      </div>      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
        {data.jadwal.map((course, i) => (
          <div key={i} className={`stagger-${(i % 5) + 1}`} style={{ background: 'var(--glass-bg)', border: 'var(--glass-border)', boxShadow: 'var(--glass-shadow)', borderRadius: '24px', overflow: 'hidden' }}>
            <div style={{ background: 'var(--glass-bg)', padding: '24px 32px', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', right: '-20px', top: '-20px', fontSize: '10rem', color: 'rgba(16, 185, 129, 0.03)', transform: 'rotate(15deg)', pointerEvents: 'none' }}>
                <i className="ph ph-calendar-check"></i>
              </div>
              <div style={{ zIndex: 1, flex: '1 1 200px' }}>
                <h3 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--color-text)', fontWeight: '800' }}>{course.name}</h3>
                <span style={{ display: 'inline-block', marginTop: '6px', fontSize: '0.85rem', color: 'var(--color-text)', fontWeight: '600', padding: '4px 12px', background: 'var(--liquid-bg)', borderRadius: '999px', boxShadow: 'inset 1px 1px 3px var(--inset-shadow-dark)' }}>{course.code} • {course.sks} SKS</span>
              </div>
              <button onClick={() => { setSelectedCourseId(course.id); setShowSessionModal(true); }} style={{ zIndex: 1, flexShrink: 0, background: 'linear-gradient(135deg, #C41E3A 0%, #9b1c2e 100%)', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '50px', fontSize: '0.9rem', fontWeight: 'bold', cursor: 'pointer', boxShadow: 'var(--glass-shadow)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <i className="ph ph-plus-circle" style={{ fontSize: '1.2rem' }}></i> Buka Sesi Baru
              </button>
            </div>

            <div style={{ padding: '32px' }}>
              {course.attendances && course.attendances.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {course.attendances.map((att, j) => (
                    <div key={j} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', padding: '20px', background: 'var(--liquid-bg)', border: 'var(--inset-border)', borderRadius: '20px', boxShadow: 'inset 2px 2px 5px var(--inset-shadow-dark), inset -2px -2px 5px var(--inset-shadow-light)' }}>
                      <div style={{ flex: '1 1 150px' }}>
                        <strong style={{ color: 'var(--color-text)', display: 'block', marginBottom: '8px', fontSize: '1.1rem', fontWeight: '800' }}>Pertemuan ke-{att.meeting_number}</strong>
                        <span style={{ fontSize: '0.9rem', color: 'var(--color-muted)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <i className="ph ph-calendar-blank"></i> {att.date}
                        </span>
                      </div>
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                        <div className="siakad-badge-status" style={{ color: '#047857', borderColor: 'rgba(4,120,87,0.3)' }}>
                          {att.records?.filter(r => r.status === 'present').length || 0} Hadir
                        </div>
                        <div className="siakad-badge-status" style={{ color: '#d97706', borderColor: 'rgba(217,119,6,0.3)' }}>
                          {att.records?.filter(r => r.status === 'excused').length || 0} Izin
                        </div>
                        <div className="siakad-badge-status" style={{ color: '#b91c1c', borderColor: 'rgba(185,28,28,0.3)' }}>
                          {att.records?.filter(r => r.status === 'absent').length || 0} Alpa
                        </div>
                        <button onClick={() => { setSelectedAttendance(att); setSelectedCourseId(course.id); setSearchTerm(''); setShowDetailModal(true); }} style={{ background: 'var(--glass-bg)', border: 'var(--glass-border)', boxShadow: 'var(--glass-shadow)', padding: '8px 18px', borderRadius: '50px', fontSize: '0.9rem', cursor: 'pointer', color: 'var(--color-text)', fontWeight: 'bold' }}>Input & Detail</button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: 'var(--color-muted)', fontSize: '0.95rem', margin: 0, fontStyle: 'italic', padding: '16px', background: 'var(--liquid-bg)', borderRadius: '12px', border: 'var(--inset-border)', boxShadow: 'inset 2px 2px 5px var(--inset-shadow-dark), inset -2px -2px 5px var(--inset-shadow-light)', textAlign: 'center' }}>Belum ada sesi absensi untuk kelas ini.</p>
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
              <input type="number" required min="1" max="16" value={meetingNumber} onChange={e => setMeetingNumber(e.target.value)} style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: 'var(--inset-border)', background: 'var(--liquid-bg)', color: 'var(--color-text)', outline: 'none', fontSize: '1rem', boxShadow: 'inset 2px 2px 5px var(--inset-shadow-dark), inset -2px -2px 5px var(--inset-shadow-light)', boxSizing: 'border-box' }} placeholder="Contoh: 1" />
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
              <button type="button" onClick={() => setShowSessionModal(false)} style={{ flex: 1, padding: '14px', borderRadius: '50px', background: 'var(--glass-bg)', border: 'var(--glass-border)', boxShadow: 'var(--glass-shadow)', color: 'var(--color-text)', fontWeight: 'bold', cursor: 'pointer' }}>Batal</button>
              <button type="submit" style={{ flex: 1, padding: '14px', borderRadius: '50px', background: 'linear-gradient(135deg, #C41E3A 0%, #9b1c2e 100%)', color: 'white', fontWeight: 'bold', border: 'none', cursor: 'pointer', boxShadow: 'var(--glass-shadow)' }}>Buat Sesi</button>
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
                style={{ padding: '10px 10px 10px 46px', borderRadius: '50px', border: 'var(--inset-border)', background: 'var(--liquid-bg)', color: 'var(--color-text)', width: '220px', maxWidth: '100%', boxShadow: 'inset 3px 3px 6px var(--inset-shadow-dark), inset -3px -3px 6px var(--inset-shadow-light)', outline: 'none' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '60vh', overflowY: 'auto', padding: '4px' }}>
            {(() => {
              const course = data.jadwal.find(c => c.id === selectedCourseId);
              if (!course || !course.grades) return <div style={{ color: 'var(--color-muted)', textAlign: 'center', padding: '20px' }}>Data tidak ditemukan.</div>;
              
              const filteredGrades = course.grades.filter(g => {
                const query = searchTerm.toLowerCase();
                const name = g.mahasiswa?.name?.toLowerCase() || '';
                const nim = g.mahasiswa?.nim_nip?.toLowerCase() || g.mahasiswa?.nim?.toLowerCase() || '';
                return name.includes(query) || nim.includes(query);
              });

              if (filteredGrades.length === 0) {
                return <div style={{ textAlign: 'center', padding: '20px', color: 'var(--color-muted)' }}>Mahasiswa tidak ditemukan.</div>;
              }
              
              return filteredGrades.map(grade => {
                const mhs = grade.mahasiswa;
                const record = selectedAttendance.records?.find(r => r.mahasiswa_id === mhs.id);
                const status = record ? record.status : 'absent';
                return (
                  <div key={mhs.id} style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 20px',
                    background: 'var(--liquid-bg)',
                    border: 'var(--inset-border)',
                    borderRadius: '16px',
                    boxShadow: 'inset 2px 2px 5px var(--inset-shadow-dark), inset -2px -2px 5px var(--inset-shadow-light)',
                    gap: '12px',
                    flexWrap: 'wrap'
                  }}>
                    <div>
                      <div style={{ fontWeight: '700', color: 'var(--color-text)' }}>{mhs.name}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--color-muted)' }}>{mhs.nim_nip}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                      <div>
                        {status === 'present' ? (
                          <span className="siakad-badge-status" style={{ color: '#047857', borderColor: 'rgba(4,120,87,0.3)', width: '70px', display: 'inline-block', textAlign: 'center' }}>Hadir</span>
                        ) : status === 'excused' ? (
                          <span className="siakad-badge-status" style={{ color: '#d97706', borderColor: 'rgba(217,119,6,0.3)', width: '70px', display: 'inline-block', textAlign: 'center' }}>Izin</span>
                        ) : (
                          <span className="siakad-badge-status" style={{ color: '#b91c1c', borderColor: 'rgba(185,28,28,0.3)', width: '70px', display: 'inline-block', textAlign: 'center' }}>Alpa</span>
                        )}
                      </div>
                      <div style={{ display: 'inline-flex', background: 'var(--glass-bg)', borderRadius: '50px', padding: '4px', gap: '4px', border: 'var(--glass-border)', boxShadow: 'var(--glass-shadow)' }}>
                        <button onClick={() => handleUpdateRecord(selectedAttendance.id, mhs.id, 'present')} 
                          className={`siakad-attendance-btn ${status === 'present' ? 'active' : ''}`}
                          style={{ 
                            background: status === 'present' ? 'linear-gradient(135deg, #047857 0%, #065f46 100%)' : 'transparent', 
                            color: status === 'present' ? 'white' : 'var(--color-muted)', 
                            border: 'none', padding: '6px 0', width: '36px', borderRadius: '50px', fontSize: '0.8rem', fontWeight: 'bold', cursor: 'pointer', 
                            transition: 'all 0.15s',
                            textAlign: 'center'
                          }}>H</button>
                        <button onClick={() => handleUpdateRecord(selectedAttendance.id, mhs.id, 'excused')} 
                          className={`siakad-attendance-btn ${status === 'excused' ? 'active' : ''}`}
                          style={{ 
                            background: status === 'excused' ? 'linear-gradient(135deg, #d97706 0%, #b45309 100%)' : 'transparent', 
                            color: status === 'excused' ? 'white' : 'var(--color-muted)', 
                            border: 'none', padding: '6px 0', width: '36px', borderRadius: '50px', fontSize: '0.8rem', fontWeight: 'bold', cursor: 'pointer', 
                            transition: 'all 0.15s',
                            textAlign: 'center'
                          }}>I</button>
                        <button onClick={() => handleUpdateRecord(selectedAttendance.id, mhs.id, 'absent')} 
                          className={`siakad-attendance-btn ${status === 'absent' ? 'active' : ''}`}
                          style={{ 
                            background: status === 'absent' ? 'linear-gradient(135deg, #b91c1c 0%, #991b1b 100%)' : 'transparent', 
                            color: status === 'absent' ? 'white' : 'var(--color-muted)', 
                            border: 'none', padding: '6px 0', width: '36px', borderRadius: '50px', fontSize: '0.8rem', fontWeight: 'bold', cursor: 'pointer', 
                            transition: 'all 0.15s',
                            textAlign: 'center'
                          }}>A</button>
                      </div>
                    </div>
                  </div>
                );
              });
            })()}
          </div>
        </ModalShell>
      )}
    </div>
  );
}
