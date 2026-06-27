"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DosenPresensiPage() {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Modal States
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [selectedAttendance, setSelectedAttendance] = useState(null);

  // Form States
  const [meetingNumber, setMeetingNumber] = useState('');
  const [meetingDate, setMeetingDate] = useState('');

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
          date: meetingDate
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
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#6b7280' }}>
      <i className="ph ph-spinner ph-spin" style={{ fontSize: '2rem', marginRight: '10px' }}></i> Memuat modul absensi...
    </div>
  );

  return (
    <div>
      <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: '800', color: '#0f172a', margin: '0 0 8px 0', letterSpacing: '-0.03em' }}>Presensi Mahasiswa 📅</h1>
          <p style={{ color: '#475569', margin: 0, fontSize: '1.05rem' }}>Buka sesi kehadiran dan pantau keaktifan mahasiswa Anda di kelas.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
        {data.jadwal.map((course, i) => (
          <div key={i} className={`siakad-card stagger-${(i % 5) + 1}`}>
            <div style={{ background: 'linear-gradient(90deg, rgba(236,253,245,0.8) 0%, rgba(255,255,255,0) 100%)', padding: '24px 32px', borderBottom: '1px solid rgba(209, 213, 219, 0.3)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', right: '-20px', top: '-20px', fontSize: '10rem', color: 'rgba(16, 185, 129, 0.03)', transform: 'rotate(15deg)', pointerEvents: 'none' }}>
                <i className="ph ph-calendar-check"></i>
              </div>
              <div style={{ zIndex: 1 }}>
                <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#064e3b', fontWeight: '800' }}>{course.name}</h3>
                <span style={{ display: 'inline-block', marginTop: '6px', fontSize: '0.85rem', color: '#047857', fontWeight: '600', padding: '4px 12px', background: 'rgba(5, 150, 105, 0.1)', borderRadius: '999px' }}>{course.code} • {course.sks} SKS</span>
              </div>
              <button onClick={() => { setSelectedCourseId(course.id); setShowSessionModal(true); }} style={{ zIndex: 1, background: '#10b981', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '12px', fontSize: '0.9rem', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <i className="ph ph-plus-circle" style={{ fontSize: '1.2rem' }}></i> Buka Sesi Baru
              </button>
            </div>

            <div style={{ padding: '32px' }}>
              {course.attendances && course.attendances.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {course.attendances.map((att, j) => (
                    <div key={j} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', background: 'rgba(255, 255, 255, 0.8)', border: '1px solid rgba(229, 231, 235, 0.8)', borderRadius: '16px', boxShadow: '0 4px 10px rgba(0,0,0,0.02)' }}>
                      <div>
                        <strong style={{ color: '#1f2937', display: 'block', marginBottom: '8px', fontSize: '1.1rem', fontWeight: '800' }}>Pertemuan ke-{att.meeting_number}</strong>
                        <span style={{ fontSize: '0.9rem', color: '#6b7280', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <i className="ph ph-calendar-blank"></i> {att.date}
                        </span>
                      </div>
                      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                        <div style={{ fontSize: '0.85rem', color: '#059669', background: '#d1fae5', padding: '6px 16px', borderRadius: '999px', fontWeight: 'bold' }}>
                          {att.records?.filter(r => r.status === 'present').length || 0} Hadir
                        </div>
                        <div style={{ fontSize: '0.85rem', color: '#dc2626', background: '#fee2e2', padding: '6px 16px', borderRadius: '999px', fontWeight: 'bold' }}>
                          {att.records?.filter(r => r.status === 'absent').length || 0} Alpa
                        </div>
                        <button onClick={() => { setSelectedAttendance(att); setSelectedCourseId(course.id); setShowDetailModal(true); }} style={{ background: 'white', border: '1px solid #d1d5db', padding: '8px 16px', borderRadius: '8px', fontSize: '0.9rem', cursor: 'pointer', color: '#374151', fontWeight: 'bold', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>Input & Detail</button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: '#9ca3af', fontSize: '0.95rem', margin: 0, fontStyle: 'italic', padding: '16px', background: 'rgba(243,244,246,0.5)', borderRadius: '12px', border: '1px dashed #d1d5db', textAlign: 'center' }}>Belum ada sesi absensi untuk kelas ini.</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Buat Sesi Modal */}
      {showSessionModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(8px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: 'white', width: '100%', maxWidth: '400px', borderRadius: '24px', padding: '32px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
            <h3 style={{ margin: '0 0 24px 0', fontSize: '1.4rem', fontWeight: '800', color: '#0f172a' }}>Buka Sesi Presensi</h3>
            <form onSubmit={handleCreateSession} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', color: '#475569', marginBottom: '8px' }}>Pertemuan Ke-</label>
                <input type="number" required min="1" max="16" value={meetingNumber} onChange={e => setMeetingNumber(e.target.value)} style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '1rem' }} placeholder="Contoh: 1" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', color: '#475569', marginBottom: '8px' }}>Tanggal Pertemuan</label>
                <input type="date" required value={meetingDate} onChange={e => setMeetingDate(e.target.value)} style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '1rem' }} />
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                <button type="button" onClick={() => setShowSessionModal(false)} style={{ flex: 1, padding: '14px', borderRadius: '12px', background: '#f1f5f9', color: '#475569', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>Batal</button>
                <button type="submit" style={{ flex: 1, padding: '14px', borderRadius: '12px', background: '#10b981', color: 'white', fontWeight: 'bold', border: 'none', cursor: 'pointer', boxShadow: '0 4px 15px rgba(16,185,129,0.3)' }}>Buat Sesi</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Input Detail Modal */}
      {showDetailModal && selectedAttendance && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(8px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: 'white', width: '100%', maxWidth: '600px', borderRadius: '24px', padding: '32px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div>
                <h3 style={{ margin: '0 0 4px 0', fontSize: '1.4rem', fontWeight: '800', color: '#0f172a' }}>Input Presensi</h3>
                <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>Pertemuan ke-{selectedAttendance.meeting_number} • {selectedAttendance.date}</p>
              </div>
              <button onClick={() => setShowDetailModal(false)} style={{ background: '#f1f5f9', border: 'none', width: '36px', height: '36px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                <i className="ph ph-x" style={{ fontSize: '1.2rem' }}></i>
              </button>
            </div>

            <div style={{ overflowY: 'auto', flex: 1, paddingRight: '8px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: '#f8fafc' }}>
                    <th style={{ padding: '12px 16px', borderBottom: '2px solid #e2e8f0', color: '#475569', fontSize: '0.85rem' }}>Mahasiswa</th>
                    <th style={{ padding: '12px 16px', borderBottom: '2px solid #e2e8f0', color: '#475569', fontSize: '0.85rem' }}>Status</th>
                    <th style={{ padding: '12px 16px', borderBottom: '2px solid #e2e8f0', color: '#475569', fontSize: '0.85rem', textAlign: 'right' }}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {(() => {
                    const course = data.jadwal.find(c => c.id === selectedCourseId);
                    if (!course || !course.grades) return <tr><td colSpan="3">Data tidak ditemukan.</td></tr>;
                    
                    return course.grades.map(grade => {
                      const mhs = grade.mahasiswa;
                      const record = selectedAttendance.records?.find(r => r.mahasiswa_id === mhs.id);
                      const status = record ? record.status : 'absent';
                      return (
                        <tr key={mhs.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td style={{ padding: '12px 16px' }}>
                            <div style={{ fontWeight: '700', color: '#1e293b' }}>{mhs.name}</div>
                            <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{mhs.nim_nip}</div>
                          </td>
                          <td style={{ padding: '12px 16px' }}>
                            {status === 'present' ? (
                              <span style={{ background: '#d1fae5', color: '#059669', padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 'bold' }}>Hadir</span>
                            ) : (
                              <span style={{ background: '#fee2e2', color: '#dc2626', padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 'bold' }}>Alpa</span>
                            )}
                          </td>
                          <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                            <div style={{ display: 'inline-flex', background: '#f1f5f9', borderRadius: '8px', padding: '4px' }}>
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
