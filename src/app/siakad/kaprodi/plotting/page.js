'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CustomSelect from '../../components/CustomSelect';
import ModalShell from '../../components/ModalShell';
import CustomTimePicker from '../../components/CustomTimePicker';

export default function KaprodiPlotting() {
  const router = useRouter();
  const [courses, setCourses] = useState([]);
  const [dosens, setDosens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [assigningId, setAssigningId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

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
      
      <div className="siakad-page-header">
        <div className="siakad-page-header-glow"></div>
        <div className="siakad-page-header-grid"></div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', margin: '0 0 8px 0', letterSpacing: '0.1em', textTransform: 'uppercase' }}>SIAKAD — KAPRODI</p>
          <h1 style={{ color: 'white', fontSize: '2.2rem', fontWeight: '800', margin: '0 0 8px 0', letterSpacing: '-0.03em' }}>Plotting Dosen, Waktu & Ruangan</h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', margin: 0 }}>Tugaskan dosen pengampu serta atur jadwal dan ruangan kelas secara dinamis.</p>
        </div>
      </div>


      <div className="siakad-card stagger-1" style={{ padding: '0px', overflow: 'hidden' }}>
        <div style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', borderBottom: '1px solid var(--color-border)' }}>
          <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--color-text)', fontWeight: 'bold' }}>Daftar Plotting Mata Kuliah</h3>
          <div style={{ position: 'relative', width: '300px' }}>
            <i className="ph ph-magnifying-glass" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-muted)', fontSize: '1.1rem' }}></i>
            <input type="text" className="siakad-input" placeholder="Cari mata kuliah, kode, dosen..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ width: '100%', paddingLeft: '46px', color: 'var(--color-text)', fontSize: '0.9rem' }} />
          </div>
        </div>

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
            {(() => {
              const filtered = courses.filter(course => {
                const query = searchQuery.toLowerCase().trim();
                if (!query) return true;
                return (
                  course.name?.toLowerCase().includes(query) ||
                  course.code?.toLowerCase().includes(query) ||
                  course.dosen?.name?.toLowerCase().includes(query) ||
                  course.ruang?.toLowerCase().includes(query)
                );
              });

              if (filtered.length === 0) {
                return (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: 'var(--color-muted)' }}>Tidak ada data plotting.</td>
                  </tr>
                );
              }

              return filtered.map(course => (
                <tr key={course.id}>
                  <td>
                    <div style={{ fontWeight: 600, color: 'var(--color-text)' }}>{course.name}</div>
                    <div style={{ color: 'var(--color-muted)', fontSize: '0.85rem', marginTop: '4px' }}>{course.code} • {course.sks} SKS</div>
                  </td>
                  <td>
                    {course.dosen ? (
                      <span style={{ fontWeight: 500, color: 'var(--color-text)' }}>{course.dosen.name}</span>
                    ) : (
                      <span className="siakad-badge" style={{ background: 'rgba(196, 30, 58, 0.15)', color: '#C41E3A' }}>Kosong</span>
                    )}
                  </td>
                  <td>
                    {course.hari && course.ruang ? (
                      <div>
                        <div style={{ fontWeight: 600, color: 'var(--color-text)', fontSize: '0.9rem' }}>
                          {course.hari}, {course.jamMulai} - {course.jamSelesai}
                        </div>
                        <div style={{ color: 'var(--color-muted)', fontSize: '0.85rem', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' , flexWrap: 'wrap'}}>
                          <i className="ph ph-map-pin" style={{ color: '#C41E3A' }}></i> {course.ruang}
                        </div>
                      </div>
                    ) : (
                      <span style={{ color: '#d97706', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px' , flexWrap: 'wrap'}}>
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
                    <button onClick={() => openScheduleModal(course)} style={{ background: 'linear-gradient(135deg, #C41E3A 0%, #9b1c2e 100%)', color: 'white', border: 'none', padding: '8px 18px', borderRadius: '50px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', margin: '0 auto' , flexWrap: 'wrap', boxShadow: '0 4px 12px rgba(196, 30, 58, 0.25)' }}>
                      <i className="ph ph-calendar-edit"></i> Atur Jadwal
                    </button>
                  </td>
                </tr>
                ));
              })()}
            </tbody>
          </table>
        </div>
      </div>

      {showScheduleModal && selectedCourse && (
        <ModalShell
          title={`Atur Jadwal Kelas`}
          icon="ph-calendar-plus"
          onClose={() => setShowScheduleModal(false)}
          footer={(
            <>
              <button type="button" onClick={() => setShowScheduleModal(false)} style={{ padding: '10px 20px', borderRadius: '50px', border: '1px solid var(--color-border)', background: 'transparent', color: 'var(--color-text)', cursor: 'pointer', fontWeight: 700 }}>Batal</button>
              <button type="submit" form="plotting-form" style={{ padding: '10px 24px', borderRadius: '50px', border: 'none', background: 'linear-gradient(135deg, #C41E3A 0%, #9b1c2e 100%)', color: 'white', cursor: 'pointer', fontWeight: 700, boxShadow: '0 4px 12px rgba(196, 30, 58, 0.25)' }}>Simpan Jadwal</button>
            </>
          )}
        >
          <div style={{ marginBottom: '24px', padding: '16px', background: 'var(--glass-bg)', borderRadius: '16px', borderLeft: '4px solid #C41E3A', border: '1px solid var(--color-border)' }}>
            <h4 style={{ margin: '0 0 4px 0', color: 'var(--color-text)' }}>{selectedCourse.name}</h4>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-muted)' }}>{selectedCourse.code} • {selectedCourse.sks} SKS</p>
          </div>

          <form id="plotting-form" onSubmit={handleSaveSchedule} style={{ display: 'flex', flexDirection: 'column', gap: '16px' , flexWrap: 'wrap'}}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--color-text)', fontWeight: '600' }}>Hari</label>
              <CustomSelect 
                value={scheduleForm.hari}
                onChange={val => setScheduleForm({...scheduleForm, hari: val})}
                options={['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'].map(d => ({ value: d, label: d }))}
                style={{ width: '100%' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', position: 'relative', zIndex: 20 }}>
              <div style={{ position: 'relative', zIndex: 21 }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--color-text)', fontWeight: '600' }}>Jam Mulai</label>
                <CustomTimePicker 
                  value={scheduleForm.jamMulai}
                  onChange={val => setScheduleForm({...scheduleForm, jamMulai: val})}
                />
              </div>
              <div style={{ position: 'relative', zIndex: 21 }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--color-text)', fontWeight: '600' }}>Jam Selesai</label>
                <CustomTimePicker 
                  value={scheduleForm.jamSelesai}
                  onChange={val => setScheduleForm({...scheduleForm, jamSelesai: val})}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--color-text)', fontWeight: '600' }}>Ruangan</label>
              <CustomSelect 
                value={scheduleForm.ruang}
                onChange={val => setScheduleForm({...scheduleForm, ruang: val})}
                options={['Lab Komputer A', 'Lab Komputer B', 'Ruang 401', 'Ruang 402', 'Ruang 405 (Aula)', 'Ruang Seminar 1'].map(r => ({ value: r, label: r }))}
                style={{ width: '100%' }}
              />
            </div>
          </form>
        </ModalShell>
      )}
    </div>
  );
}
