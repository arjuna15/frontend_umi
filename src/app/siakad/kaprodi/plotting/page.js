'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CustomSelect from '../../components/CustomSelect';

export default function KaprodiPlotting() {
  const router = useRouter();
  const [courses, setCourses] = useState([]);
  const [dosens, setDosens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [assigningId, setAssigningId] = useState(null);

  // Jadwal Modal States
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [scheduleForm, setScheduleForm] = useState({ hari: 'Senin', jamMulai: '08:00', jamSelesai: '10:30', ruang: 'Ruang 401' });

  useEffect(() => {
    fetchData();
  }, [router]);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('siakad_token');
      if (!token) {
        router.push('/siakad/login');
        return;
      }
      
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
      const res = await fetch(`${apiUrl}/siakad/kaprodi/courses`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        const data = await res.json();
        // Add mock schedule data if not provided by backend
        const mappedCourses = data.courses.map(c => ({
          ...c,
          hari: c.hari || '',
          jamMulai: c.jamMulai || '',
          jamSelesai: c.jamSelesai || '',
          ruang: c.ruang || ''
        }));
        setCourses(mappedCourses);
        setDosens(data.dosens);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async (courseId, dosenId) => {
    if (!dosenId) return;
    setAssigningId(courseId);
    try {
      const token = localStorage.getItem('siakad_token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
      const res = await fetch(`${apiUrl}/siakad/kaprodi/courses/${courseId}/plot`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ dosen_id: dosenId })
      });
      if (res.ok) {
        window.toast('Dosen berhasil di-assign ke mata kuliah ini!');
        fetchData();
      } else {
        window.toast('Gagal assign dosen');
      }
    } catch (err) {
      window.toast('Error: ' + err.message);
    } finally {
      setAssigningId(null);
    }
  };

  const handleSaveSchedule = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('siakad_token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
      const res = await fetch(`${apiUrl}/siakad/kaprodi/courses/${selectedCourse.id}/schedule`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          hari: scheduleForm.hari,
          jamMulai: scheduleForm.jamMulai,
          jamSelesai: scheduleForm.jamSelesai,
          ruang: scheduleForm.ruang
        })
      });
      if (res.ok) {
        window.toast('Jadwal dan Ruangan berhasil disimpan permanen ke database!');
        fetchData();
      } else {
        const errData = await res.json();
        window.toast('Gagal simpan jadwal: ' + JSON.stringify(errData));
      }
    } catch (err) {
      window.toast('Error: ' + err.message);
    } finally {
      setShowScheduleModal(false);
    }
  };

  const openScheduleModal = (course) => {
    setSelectedCourse(course);
    setScheduleForm({
      hari: course.hari || 'Senin',
      jamMulai: course.jamMulai || '08:00',
      jamSelesai: course.jamSelesai || '10:30',
      ruang: course.ruang || 'Lab Komputer A'
    });
    setShowScheduleModal(true);
  };

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyItems: 'center', height: '100%', color: 'var(--color-muted)' }}>
      <i className="ph ph-spinner ph-spin" style={{ fontSize: '2rem', marginRight: '10px' }}></i> Memuat Data Kelas...
    </div>
  );

  return (
    <div className="fade-in" style={{ paddingBottom: '40px' }}>
      
      <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #4c0519 100%)', borderRadius: '24px', padding: '40px', marginBottom: '32px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(196,30,58,0.15)', filter: 'blur(40px)' }}></div>
        <div style={{ position: 'absolute', bottom: '-20px', left: '30%', width: '150px', height: '150px', borderRadius: '50%', background: 'rgba(99,102,241,0.1)', filter: 'blur(30px)' }}></div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', margin: '0 0 8px 0', letterSpacing: '0.1em', textTransform: 'uppercase' }}>SIAKAD — KAPRODI</p>
          <h1 style={{ color: 'white', fontSize: '2.2rem', fontWeight: '800', margin: '0 0 8px 0', letterSpacing: '-0.03em' }}>Plotting Dosen, Waktu & Ruangan</h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', margin: 0 }}>Tugaskan dosen pengampu serta atur jadwal dan ruangan kelas secara dinamis.</p>
        </div>
      </div>


      <div className="siakad-card stagger-1" style={{ overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="siakad-table" style={{ minWidth: '1000px' }}>
          <thead>
            <tr>
              <th>Mata Kuliah</th>
              <th>Dosen Pengampu</th>
              <th>Jadwal & Ruangan</th>
              <th style={{ width: '220px' }}>Ganti/Assign Dosen</th>
              <th style={{ width: '150px', textAlign: 'center' }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {courses.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '40px' }}>Belum ada kelas aktif.</td>
              </tr>
            ) : (
              courses.map(course => (
                <tr key={course.id}>
                  <td>
                    <div style={{ fontWeight: 600, color: 'var(--color-text)' }}>{course.name}</div>
                    <div style={{ color: 'var(--color-muted)', fontSize: '0.85rem', marginTop: '4px' }}>{course.code} • {course.sks} SKS</div>
                  </td>
                  <td>
                    {course.dosen ? (
                      <span style={{ fontWeight: 500, color: 'var(--color-text)' }}>{course.dosen.name}</span>
                    ) : (
                      <span className="siakad-badge" style={{ background: '#fee2e2', color: '#b91c1c' }}>Kosong</span>
                    )}
                  </td>
                  <td>
                    {course.hari && course.ruang ? (
                      <div>
                        <div style={{ fontWeight: 600, color: 'var(--color-text)', fontSize: '0.9rem' }}>
                          {course.hari}, {course.jamMulai} - {course.jamSelesai}
                        </div>
                        <div style={{ color: 'var(--color-muted)', fontSize: '0.85rem', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <i className="ph ph-map-pin" style={{ color: '#8b5cf6' }}></i> {course.ruang}
                        </div>
                      </div>
                    ) : (
                      <span style={{ color: '#d97706', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <i className="ph ph-warning-circle"></i> Belum Dijadwalkan
                      </span>
                    )}
                  </td>
                  <td>
                    <CustomSelect
                      disabled={assigningId === course.id}
                      onChange={(val) => handleAssign(course.id, val)}
                      placeholder={assigningId === course.id ? 'Menyimpan...' : 'Pilih Dosen...'}
                      options={dosens.map(dosen => ({ value: dosen.id, label: dosen.name, icon: 'ph ph-user' }))}
                      style={{ minWidth: '180px' }}
                    />
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <button onClick={() => openScheduleModal(course)} style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', margin: '0 auto' }}>
                      <i className="ph ph-calendar-edit"></i> Atur Jadwal
                    </button>
                  </td>
                </tr>
              ))
            )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Atur Jadwal */}
      {showScheduleModal && selectedCourse && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
          <div className="fade-in" style={{ background: 'var(--color-bg)', padding: '32px', borderRadius: '16px', width: '100%', maxWidth: '500px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)', border: '1px solid var(--color-border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ margin: 0, color: 'var(--color-text)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <i className="ph ph-calendar-plus" style={{ color: '#8b5cf6' }}></i> Atur Jadwal Kelas
              </h3>
              <button onClick={() => setShowScheduleModal(false)} style={{ background: 'transparent', border: 'none', color: 'var(--color-muted)', cursor: 'pointer', fontSize: '1.5rem' }}>
                <i className="ph ph-x"></i>
              </button>
            </div>

            <div style={{ marginBottom: '24px', padding: '16px', background: 'var(--glass-bg)', borderRadius: '12px', borderLeft: '4px solid #10b981' }}>
              <h4 style={{ margin: '0 0 4px 0', color: 'var(--color-text)' }}>{selectedCourse.name}</h4>
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-muted)' }}>{selectedCourse.code} • {selectedCourse.sks} SKS</p>
            </div>

            <form onSubmit={handleSaveSchedule} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--color-text)', fontWeight: '600' }}>Hari</label>
                <select 
                  className="siakad-input" 
                  value={scheduleForm.hari}
                  onChange={e => setScheduleForm({...scheduleForm, hari: e.target.value})}
                  style={{ width: '100%', background: 'var(--glass-bg)', color: 'var(--color-text)' }}
                >
                  <option value="Senin">Senin</option>
                  <option value="Selasa">Selasa</option>
                  <option value="Rabu">Rabu</option>
                  <option value="Kamis">Kamis</option>
                  <option value="Jumat">Jumat</option>
                  <option value="Sabtu">Sabtu</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--color-text)', fontWeight: '600' }}>Jam Mulai</label>
                  <input 
                    type="time" 
                    className="siakad-input" 
                    value={scheduleForm.jamMulai}
                    onChange={e => setScheduleForm({...scheduleForm, jamMulai: e.target.value})}
                    style={{ width: '100%', background: 'var(--glass-bg)', color: 'var(--color-text)' }}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--color-text)', fontWeight: '600' }}>Jam Selesai</label>
                  <input 
                    type="time" 
                    className="siakad-input" 
                    value={scheduleForm.jamSelesai}
                    onChange={e => setScheduleForm({...scheduleForm, jamSelesai: e.target.value})}
                    style={{ width: '100%', background: 'var(--glass-bg)', color: 'var(--color-text)' }}
                    required
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--color-text)', fontWeight: '600' }}>Ruangan</label>
                <select 
                  className="siakad-input" 
                  value={scheduleForm.ruang}
                  onChange={e => setScheduleForm({...scheduleForm, ruang: e.target.value})}
                  style={{ width: '100%', background: 'var(--glass-bg)', color: 'var(--color-text)' }}
                >
                  <option value="Lab Komputer A">Lab Komputer A</option>
                  <option value="Lab Komputer B">Lab Komputer B</option>
                  <option value="Ruang 401">Ruang 401</option>
                  <option value="Ruang 402">Ruang 402</option>
                  <option value="Ruang 405 (Aula)">Ruang 405 (Aula)</option>
                  <option value="Ruang Seminar 1">Ruang Seminar 1</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '16px' }}>
                <button type="button" onClick={() => setShowScheduleModal(false)} style={{ background: 'transparent', border: '1px solid var(--color-muted)', padding: '10px 20px', borderRadius: '8px', color: 'var(--color-text)', cursor: 'pointer', fontWeight: 'bold' }}>
                  Batal
                </button>
                <button type="submit" style={{ background: '#8b5cf6', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 15px rgba(139, 92, 246, 0.3)' }}>
                  Simpan Jadwal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
