"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function JadwalPage() {
  const router = useRouter();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ day: '', start_time: '', end_time: '', room: '' });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    const token = localStorage.getItem('siakad_token');
    if (!token) return router.push('/siakad/login');

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
      const res = await fetch(`${apiUrl}/siakad/dosen/roster`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const result = await res.json();
        setCourses(result.courses || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (course) => {
    setEditingId(course.id);
    setFormData({
      day: course.hari || '',
      start_time: course.jam_mulai || '',
      end_time: course.jam_selesai || '',
      room: course.ruangan || course.ruang || ''
    });
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({ day: '', start_time: '', end_time: '', room: '' });
  };

  const handleSave = async (courseId) => {
    const token = localStorage.getItem('siakad_token');
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

    try {
      const res = await fetch(`${apiUrl}/siakad/dosen/jadwal/update`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          course_id: courseId,
          ...formData
        })
      });

      if (res.ok) {
        window.toast('Jadwal berhasil diperbarui!');
        setEditingId(null);
        fetchCourses();
      } else {
        const err = await res.json();
        window.toast('Gagal: ' + (err.message || 'Server Error'));
      }
    } catch (err) {
      window.toast('Error: ' + err.message);
    }
  };

  if (loading) return <div style={{ padding: '40px', color: 'var(--color-text)' }}>Memuat jadwal...</div>;

  return (
    <div className="siakad-page">
      <div className="siakad-header-block mb-4">
        <h1 className="siakad-title">Pengaturan Jadwal Mengajar</h1>
        <p className="siakad-subtitle">Atur hari, jam, dan ruang untuk mata kuliah Anda.</p>
      </div>

      <div className="siakad-card p-0" style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'rgba(0,0,0,0.05)', borderBottom: '1px solid var(--color-border)' }}>
              <th style={{ padding: '16px 20px', fontWeight: '600' }}>Mata Kuliah</th>
              <th style={{ padding: '16px 20px', fontWeight: '600' }}>SKS</th>
              <th style={{ padding: '16px 20px', fontWeight: '600' }}>Hari</th>
              <th style={{ padding: '16px 20px', fontWeight: '600' }}>Jam</th>
              <th style={{ padding: '16px 20px', fontWeight: '600' }}>Ruang</th>
              <th style={{ padding: '16px 20px', fontWeight: '600', textAlign: 'center' }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {courses.length > 0 ? (
              courses.map(c => {
                const isEditing = editingId === c.id;
                return (
                  <tr key={c.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: '16px 20px' }}>
                      <div style={{ fontWeight: 'bold' }}>{c.name}</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--color-muted)' }}>{c.code}</div>
                    </td>
                    <td style={{ padding: '16px 20px' }}>{c.sks} SKS</td>
                    
                    {isEditing ? (
                      <>
                        <td style={{ padding: '16px 20px' }}>
                          <select 
                            value={formData.day} 
                            onChange={(e) => setFormData({...formData, day: e.target.value})}
                            style={{ padding: '8px', borderRadius: '4px', border: '1px solid var(--color-border)', background: 'var(--color-bg)', color: 'var(--color-text)' }}
                          >
                            <option value="">Pilih Hari</option>
                            <option value="Senin">Senin</option>
                            <option value="Selasa">Selasa</option>
                            <option value="Rabu">Rabu</option>
                            <option value="Kamis">Kamis</option>
                            <option value="Jumat">Jumat</option>
                            <option value="Sabtu">Sabtu</option>
                          </select>
                        </td>
                        <td style={{ padding: '16px 20px' }}>
                          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <input 
                              type="time" 
                              value={formData.start_time} 
                              onChange={(e) => setFormData({...formData, start_time: e.target.value})}
                              style={{ padding: '8px', borderRadius: '4px', border: '1px solid var(--color-border)', background: 'var(--color-bg)', color: 'var(--color-text)' }}
                            />
                            <span>-</span>
                            <input 
                              type="time" 
                              value={formData.end_time} 
                              onChange={(e) => setFormData({...formData, end_time: e.target.value})}
                              style={{ padding: '8px', borderRadius: '4px', border: '1px solid var(--color-border)', background: 'var(--color-bg)', color: 'var(--color-text)' }}
                            />
                          </div>
                        </td>
                        <td style={{ padding: '16px 20px' }}>
                          <input 
                            type="text" 
                            placeholder="Contoh: R.301"
                            value={formData.room} 
                            onChange={(e) => setFormData({...formData, room: e.target.value})}
                            style={{ padding: '8px', borderRadius: '4px', border: '1px solid var(--color-border)', background: 'var(--color-bg)', color: 'var(--color-text)', width: '100px' }}
                          />
                        </td>
                        <td style={{ padding: '16px 20px', textAlign: 'center' }}>
                          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                            <button onClick={() => handleSave(c.id)} style={{ padding: '8px 12px', background: '#10b981', color: 'white', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>Simpan</button>
                            <button onClick={handleCancel} style={{ padding: '8px 12px', background: 'var(--color-muted)', color: 'white', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>Batal</button>
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td style={{ padding: '16px 20px' }}>
                          {c.hari ? <span style={{ padding: '4px 8px', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', borderRadius: '4px', fontSize: '0.9rem', fontWeight: 'bold' }}>{c.hari}</span> : <span style={{ color: 'var(--color-muted)', fontStyle: 'italic' }}>Belum diatur</span>}
                        </td>
                        <td style={{ padding: '16px 20px' }}>
                          {(c.jam_mulai && c.jam_selesai) ? `${c.jam_mulai.substring(0,5)} - ${c.jam_selesai.substring(0,5)}` : <span style={{ color: 'var(--color-muted)', fontStyle: 'italic' }}>Belum diatur</span>}
                        </td>
                        <td style={{ padding: '16px 20px' }}>
                          {(c.ruang || c.ruangan) ? (c.ruang || c.ruangan) : <span style={{ color: 'var(--color-muted)', fontStyle: 'italic' }}>Belum ada ruang</span>}
                        </td>
                        <td style={{ padding: '16px 20px', textAlign: 'center' }}>
                          <button onClick={() => handleEdit(c)} style={{ padding: '6px 12px', background: 'var(--glass-bg)', color: 'var(--color-text)', border: '1px solid var(--color-border)', borderRadius: '6px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                            <i className="ph ph-pencil-simple"></i> Atur
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="6" style={{ padding: '40px', textAlign: 'center', color: 'var(--color-muted)' }}>Anda tidak memiliki kelas.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
