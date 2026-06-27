"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminClassesPage() {
  const router = useRouter();
  const [courses, setCourses] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
    fetchUsers();
  }, []);

  const fetchCourses = async () => {
    const token = localStorage.getItem('siakad_token');
    if (!token) return router.push('/siakad/login');
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
    
    try {
      const res = await fetch(`${apiUrl}/siakad/admin/courses`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to fetch courses');
      const data = await res.json();
      setCourses(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    const token = localStorage.getItem('siakad_token');
    if (!token) return;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
    try {
      const res = await fetch(`${apiUrl}/siakad/admin/users`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUsers(data.filter(u => u.role === 'dosen'));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('siakad_token');
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
    const form = new FormData(e.target);
    const body = Object.fromEntries(form.entries());
    
    try {
      const res = await fetch(`${apiUrl}/siakad/admin/courses`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });
      if (res.ok) {
        alert('Course created successfully');
        e.target.reset();
        fetchCourses();
      } else {
        alert('Failed to create course');
      }
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  const handleDeleteCourse = async (id) => {
    if (!confirm('Are you sure you want to delete this course?')) return;
    const token = localStorage.getItem('siakad_token');
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
    
    try {
      const res = await fetch(`${apiUrl}/siakad/admin/courses/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        fetchCourses();
      } else {
        alert('Failed to delete course');
      }
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyItems: 'center', height: '100%', color: '#6b7280' }}>
      <i className="ph-spinner ph-spin" style={{ fontSize: '2rem', marginRight: '10px' }}></i> Memuat data kelas...
    </div>
  );

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    id: '', code: '', name: '', sks: '', dosen_id: ''
  });

  const handleOpenEditModal = (course) => {
    setEditFormData({
      id: course.id,
      code: course.code,
      name: course.name,
      sks: course.sks,
      dosen_id: course.dosen_id || ''
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateCourse = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('siakad_token');
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
    
    try {
      const res = await fetch(`${apiUrl}/siakad/admin/courses/${editFormData.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editFormData)
      });
      if (res.ok) {
        setIsEditModalOpen(false);
        fetchCourses();
      } else {
        const errorData = await res.json();
        alert('Gagal mengupdate mata kuliah: ' + (errorData.message || 'Error'));
      }
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#111827', margin: '0 0 8px 0' }}>Manajemen Kelas & Mata Kuliah</h1>
        <p style={{ color: '#6b7280', margin: 0 }}>Kelola daftar mata kuliah dan dosen pengampunya.</p>
      </div>

      <div className="siakad-card stagger-1" style={{ marginBottom: '24px', padding: '24px' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#1f2937', margin: '0 0 20px 0' }}>Tambah Mata Kuliah Baru</h2>
        <form onSubmit={handleCreateCourse} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr auto', gap: '16px', alignItems: 'end' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: '#4b5563', fontWeight: '600' }}>Kode Mata Kuliah</label>
            <input name="code" required placeholder="Contoh: CS101..." style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: '#4b5563', fontWeight: '600' }}>Nama Mata Kuliah</label>
            <input name="name" required placeholder="Algoritma & Pemrograman..." style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: '#4b5563', fontWeight: '600' }}>Jumlah SKS</label>
            <input type="number" name="sks" required min="1" max="6" placeholder="SKS..." style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: '#4b5563', fontWeight: '600' }}>Dosen Pengampu</label>
            <select name="dosen_id" required style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none', background: 'white' }}>
              <option value="">Pilih Dosen...</option>
              {users.map(u => (
                <option key={u.id} value={u.id}>{u.name}</option>
              ))}
            </select>
          </div>
          <div>
            <button type="submit" style={{ background: '#10b981', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', height: '42px', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 6px -1px rgba(16, 185, 129, 0.2)' }}>
              <i className="ph-plus-circle"></i> Tambah
            </button>
          </div>
        </form>
      </div>

      <div className="siakad-card stagger-2" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ background: 'rgba(249, 250, 251, 0.8)', borderBottom: '1px solid #e5e7eb' }}>
              <tr>
                <th style={{ padding: '16px 24px', fontWeight: '600', color: '#374151', fontSize: '0.9rem' }}>Kode</th>
                <th style={{ padding: '16px 24px', fontWeight: '600', color: '#374151', fontSize: '0.9rem' }}>Nama Mata Kuliah</th>
                <th style={{ padding: '16px 24px', fontWeight: '600', color: '#374151', fontSize: '0.9rem' }}>SKS</th>
                <th style={{ padding: '16px 24px', fontWeight: '600', color: '#374151', fontSize: '0.9rem', textAlign: 'right' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course, idx) => (
                <tr key={course.id} style={{ borderBottom: '1px solid #e5e7eb', background: idx % 2 === 0 ? 'white' : 'rgba(249, 250, 251, 0.3)' }}>
                  <td style={{ padding: '16px 24px', color: '#4f46e5', fontWeight: 'bold', fontSize: '0.95rem' }}>{course.code}</td>
                  <td style={{ padding: '16px 24px', color: '#111827', fontWeight: '500' }}>{course.name}</td>
                  <td style={{ padding: '16px 24px', color: '#4b5563' }}>{course.sks} SKS</td>
                  <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      <button 
                        onClick={() => handleOpenEditModal(course)}
                        style={{ background: '#eff6ff', color: '#1d4ed8', border: 'none', padding: '6px 10px', borderRadius: '6px', cursor: 'pointer', transition: 'all 0.2s' }}
                        title="Edit Mata Kuliah"
                      ><i className="ph-pencil-simple" style={{ fontSize: '1rem' }}></i></button>
                      <button 
                        onClick={() => handleDeleteCourse(course.id)}
                        style={{ background: '#fef2f2', color: '#b91c1c', border: 'none', padding: '6px 10px', borderRadius: '6px', cursor: 'pointer', transition: 'all 0.2s' }}
                        title="Hapus Mata Kuliah"
                      ><i className="ph-trash" style={{ fontSize: '1rem' }}></i></button>
                    </div>
                  </td>
                </tr>
              ))}
              {courses.length === 0 && (
                <tr>
                  <td colSpan="4" style={{ padding: '24px', textAlign: 'center', color: '#6b7280' }}>Tidak ada data kelas/mata kuliah</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isEditModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999 }}>
          <div style={{ background: 'white', padding: '24px', borderRadius: '16px', width: '100%', maxWidth: '500px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}>
            <h2 style={{ margin: '0 0 20px 0', fontSize: '1.25rem', fontWeight: 'bold' }}>Edit Mata Kuliah</h2>
            <form onSubmit={handleUpdateCourse}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Kode Mata Kuliah</label>
                <input value={editFormData.code} onChange={(e) => setEditFormData({...editFormData, code: e.target.value})} required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db' }} />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Nama Mata Kuliah</label>
                <input value={editFormData.name} onChange={(e) => setEditFormData({...editFormData, name: e.target.value})} required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db' }} />
              </div>
              <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>SKS</label>
                  <input type="number" min="1" max="6" value={editFormData.sks} onChange={(e) => setEditFormData({...editFormData, sks: e.target.value})} required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db' }} />
                </div>
                <div style={{ flex: 2 }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Dosen Pengampu</label>
                  <select value={editFormData.dosen_id} onChange={(e) => setEditFormData({...editFormData, dosen_id: e.target.value})} required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db' }}>
                    <option value="">Pilih Dosen...</option>
                    {users.map(u => (
                      <option key={u.id} value={u.id}>{u.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setIsEditModalOpen(false)} style={{ padding: '10px 16px', background: 'transparent', border: '1px solid #d1d5db', borderRadius: '8px', cursor: 'pointer' }}>Batal</button>
                <button type="submit" style={{ padding: '10px 16px', background: '#10b981', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Simpan Perubahan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
