"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import CustomSelect from '../../components/CustomSelect';
import ModalShell from '../../components/ModalShell';

export default function AdminClassesPage() {
  const router = useRouter();
  const [courses, setCourses] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDosen, setSelectedDosen] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    id: '', code: '', name: '', sks: '', dosen_id: '', prasyarat: '', semester: 'Ganjil'
  });
  const [selectedSemester, setSelectedSemester] = useState("Ganjil");
  const [searchQuery, setSearchQuery] = useState('');

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
        window.toast('Course created successfully');
        e.target.reset();
        setSelectedDosen("");
        setSelectedSemester("Ganjil");
        fetchCourses();
      } else {
        window.toast('Failed to create course');
      }
    } catch (err) {
      window.toast('Error: ' + err.message);
    }
  };

  const handleDeleteCourse = async (id) => {
    if (!await window.toast.confirm('Are you sure you want to delete this course?')) return;
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
        window.toast('Failed to delete course');
      }
    } catch (err) {
      window.toast('Error: ' + err.message);
    }
  };

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyItems: 'center', height: '100%', color: 'var(--color-muted)' }}>
      <i className="ph ph-spinner ph-spin" style={{ fontSize: '2rem', marginRight: '10px' }}></i> Memuat data kelas...
    </div>
  );


  const handleOpenEditModal = (course) => {
    setEditFormData({
      id: course.id,
      code: course.code,
      name: course.name,
      sks: course.sks,
      dosen_id: course.dosen_id || '',
      prasyarat: course.prasyarat || '',
      semester: course.semester || 'Ganjil'
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
        window.toast('Gagal mengupdate mata kuliah: ' + (errorData.message || 'Error'));
      }
    } catch (err) {
      window.toast('Error: ' + err.message);
    }
  };

  return (
    <div className="fade-in">
      <div className="siakad-page-header">
        <div className="siakad-page-header-glow"></div>
        <div className="siakad-page-header-grid"></div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', margin: '0 0 8px 0', letterSpacing: '0.1em', textTransform: 'uppercase' }}>SIAKAD — ADMIN</p>
          <h1 style={{ color: 'white', fontSize: '2.2rem', fontWeight: '800', margin: '0 0 8px 0', letterSpacing: '-0.03em' }}>Manajemen Kelas & Mata Kuliah</h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', margin: 0 }}>Kelola daftar mata kuliah dan dosen pengampunya.</p>
        </div>
      </div>

      <div className="siakad-card stagger-1" style={{ marginBottom: '24px', padding: '24px', position: 'relative', zIndex: 50 }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--color-text)', margin: '0 0 20px 0' }}>Tambah Mata Kuliah Baru</h2>
        <form onSubmit={handleCreateCourse} style={{ display: 'flex', gap: '16px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 150px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--color-muted)', fontWeight: '600' }}>Kode Mata Kuliah</label>
            <input name="code" className="siakad-input" required placeholder="Contoh: CS101..." style={{ minWidth: 0, flex: '1 1 120px'}} />
          </div>
          <div style={{ flex: '1 1 150px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--color-muted)', fontWeight: '600' }}>Nama Mata Kuliah</label>
            <input name="name" className="siakad-input" required placeholder="Algoritma & Pemrograman..." style={{ minWidth: 0, flex: '1 1 120px'}} />
          </div>
          <div style={{ flex: '1 1 120px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--color-muted)', fontWeight: '600' }}>Jumlah SKS</label>
            <input type="number" name="sks" className="siakad-input" required min="1" max="6" placeholder="SKS..." style={{ minWidth: 0, flex: '1 1 120px'}} />
          </div>
          <div style={{ flex: '1 1 200px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--color-muted)', fontWeight: '600' }}>Dosen Pengampu</label>
            <CustomSelect
              name="dosen_id"
              value={selectedDosen}
              onChange={setSelectedDosen}
              options={[{value: '', label: 'Pilih Dosen...'}, ...users.map(u => ({ value: u.id, label: u.name, icon: 'ph ph-user' }))]}
            />
          </div>
          <div style={{ flex: '1 1 150px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--color-muted)', fontWeight: '600' }}>Semester</label>
            <CustomSelect
              name="semester"
              value={selectedSemester}
              onChange={setSelectedSemester}
              options={[{value: 'Ganjil', label: 'Ganjil'}, {value: 'Genap', label: 'Genap'}]}
            />
          </div>
          <div style={{ flex: '1 1 150px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--color-muted)', fontWeight: '600' }}>Prasyarat</label>
            <input name="prasyarat" className="siakad-input" placeholder="Kode MK (Opsional)..." style={{ minWidth: 0, flex: '1 1 120px'}} />
          </div>
          <div style={{ flex: '0 0 auto' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'transparent', fontWeight: '600', userSelect: 'none' }}>&nbsp;</label>
            <button type="submit" style={{ background: 'linear-gradient(180deg, rgba(200, 255, 220, 0.28) 0%, rgba(140, 255, 190, 0.10) 35%, transparent 42%), rgba(0, 140, 80, 0.55)', backdropFilter: 'blur(25px)', WebkitBackdropFilter: 'blur(25px)', border: '1px solid rgba(140, 255, 190, 0.40)', color: 'white', padding: '12px 24px', borderRadius: '50px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: 'inset 0 1px 0 rgba(180, 255, 220, 0.55), inset 0 -2px 8px rgba(0, 60, 30, 0.45), 0 8px 24px rgba(0, 140, 80, 0.25)', whiteSpace: 'nowrap' }}>
              <i className="ph ph-plus-circle"></i> Tambah
            </button>
          </div>
        </form>
      </div>

      <div className="siakad-card stagger-2" style={{ padding: '24px 0 0 0', overflow: 'hidden' }}>
        <div style={{ padding: '0 24px 16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', borderBottom: '1px solid var(--color-border)' }}>
          <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--color-text)', fontWeight: 'bold' }}>Daftar Mata Kuliah</h3>
          <div style={{ position: 'relative', width: '300px' }}>
            <i className="ph ph-magnifying-glass" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-muted)', fontSize: '1.1rem' }}></i>
            <input 
              type="text" 
              className="siakad-input"
              placeholder="Cari kode, nama, semester..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ 
                width: '100%', 
                paddingLeft: '46px',
                color: 'var(--color-text)',
                fontSize: '0.9rem'
              }} 
            />
          </div>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="siakad-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr>
                <th style={{ padding: '16px 24px', fontWeight: '600' }}>Kode</th>
                <th style={{ padding: '16px 24px', fontWeight: '600' }}>Nama Mata Kuliah</th>
                <th style={{ padding: '16px 24px', fontWeight: '600' }}>SKS</th>
                <th style={{ padding: '16px 24px', fontWeight: '600' }}>Semester</th>
                <th style={{ padding: '16px 24px', fontWeight: '600' }}>Prasyarat</th>
                <th style={{ padding: '16px 24px', fontWeight: '600', textAlign: 'right' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {(() => {
                const filteredCourses = courses.filter(course => {
                  const query = searchQuery.toLowerCase().trim();
                  if (!query) return true;
                  return (
                    course.code?.toLowerCase().includes(query) ||
                    course.name?.toLowerCase().includes(query) ||
                    course.semester?.toLowerCase().includes(query) ||
                    course.prasyarat?.toLowerCase().includes(query)
                  );
                });

                if (filteredCourses.length === 0) {
                  return (
                    <tr>
                      <td colSpan="6" style={{ padding: '24px', textAlign: 'center', color: 'var(--color-muted)' }}>Tidak ada data kelas/mata kuliah</td>
                    </tr>
                  );
                }

                return filteredCourses.map((course, idx) => (
                  <tr key={course.id}>
                    <td style={{ padding: '16px 24px', color: 'var(--color-text)', fontWeight: 'bold', fontSize: '0.95rem' }}>{course.code}</td>
                    <td style={{ padding: '16px 24px', color: 'var(--color-text)', fontWeight: '500' }}>{course.name}</td>
                    <td style={{ padding: '16px 24px', color: 'var(--color-muted)' }}>{course.sks} SKS</td>
                    <td style={{ padding: '16px 24px', color: 'var(--color-muted)' }}>{course.semester || 'Ganjil'}</td>
                    <td style={{ padding: '16px 24px', color: 'var(--color-muted)' }}>{course.prasyarat || '-'}</td>
                    <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' , flexWrap: 'wrap'}}>
                        <button 
                          onClick={() => handleOpenEditModal(course)}
                          style={{ background: 'var(--glass-bg)', color: 'var(--color-text)', border: 'none', padding: '6px 10px', borderRadius: '6px', cursor: 'pointer', transition: 'all 0.2s' }}
                          title="Edit Mata Kuliah"
                        ><i className="ph ph-pencil-simple" style={{ fontSize: '1rem' }}></i></button>
                        <button 
                          onClick={() => handleDeleteCourse(course.id)}
                          style={{ background: 'var(--glass-bg)', color: '#ef4444', border: 'none', padding: '6px 10px', borderRadius: '6px', cursor: 'pointer', transition: 'all 0.2s' }}
                          title="Hapus Mata Kuliah"
                        ><i className="ph ph-trash" style={{ fontSize: '1rem' }}></i></button>
                      </div>
                    </td>
                  </tr>
                ));
              })()}
            </tbody>
          </table>
        </div>
      </div>      {isEditModalOpen && (
        <ModalShell
          title="Edit Mata Kuliah"
          subtitle="Manajemen Kelas & Kurikulum"
          icon="ph-chalkboard"
          iconBg="linear-gradient(135deg, #10b981 0%, #059669 100%)"
          onClose={() => setIsEditModalOpen(false)}
          maxWidth="600px"
        >
          <form onSubmit={handleUpdateCourse}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: 'var(--color-text)' }}>Kode Mata Kuliah</label>
              <input value={editFormData.code} onChange={(e) => setEditFormData({...editFormData, code: e.target.value})} required className="siakad-input" style={{ width: '100%', color: 'var(--color-text)' }} />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: 'var(--color-text)' }}>Nama Mata Kuliah</label>
              <input value={editFormData.name} onChange={(e) => setEditFormData({...editFormData, name: e.target.value})} required className="siakad-input" style={{ width: '100%', color: 'var(--color-text)' }} />
            </div>
            <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' , flexWrap: 'wrap' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: 'var(--color-text)' }}>SKS</label>
                <input type="number" min="1" max="6" value={editFormData.sks} onChange={(e) => setEditFormData({...editFormData, sks: e.target.value})} required className="siakad-input" style={{ width: '100%', color: 'var(--color-text)' }} />
              </div>
              <div style={{ flex: 2 }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: 'var(--color-text)' }}>Dosen Pengampu</label>
                <CustomSelect
                  value={editFormData.dosen_id}
                  onChange={(val) => setEditFormData({...editFormData, dosen_id: val})}
                  options={[{value: '', label: 'Pilih Dosen...'}, ...users.map(u => ({ value: u.id, label: u.name, icon: 'ph ph-user' }))]}
                />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' , flexWrap: 'wrap' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: 'var(--color-text)' }}>Semester</label>
                <CustomSelect
                  value={editFormData.semester}
                  onChange={(val) => setEditFormData({...editFormData, semester: val})}
                  options={[{value: 'Ganjil', label: 'Ganjil'}, {value: 'Genap', label: 'Genap'}]}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: 'var(--color-text)' }}>Prasyarat</label>
                <input value={editFormData.prasyarat} onChange={(e) => setEditFormData({...editFormData, prasyarat: e.target.value})} placeholder="Opsional..." className="siakad-input" style={{ width: '100%', color: 'var(--color-text)' }} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '20px' }}>
              <button type="button" onClick={() => setIsEditModalOpen(false)} style={{ padding: '12px 24px', border: 'none', cursor: 'pointer', color: 'var(--color-text)', fontWeight: 'bold', transition: 'all 0.2s' }}>Batal</button>
              <button type="submit" className="siakad-btn-primary" style={{ padding: '12px 24px' }}>Simpan Perubahan</button>
            </div>
          </form>
        </ModalShell>
      )}
    </div>
  );
}
