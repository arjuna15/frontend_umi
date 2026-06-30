"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import CustomSelect from '../../components/CustomSelect';

export default function AdminUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState("mahasiswa");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    id: '', name: '', nim_nip: '', role: '', prodi: '', password: ''
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const token = localStorage.getItem('siakad_token');
    if (!token) return router.push('/siakad/login');
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
    
    try {
      const res = await fetch(`${apiUrl}/siakad/admin/users`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to fetch users');
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('siakad_token');
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
    const form = new FormData(e.target);
    const body = Object.fromEntries(form.entries());
    
    try {
      const res = await fetch(`${apiUrl}/siakad/admin/users`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });
      if (res.ok) {
        alert('User created successfully');
        e.target.reset();
        fetchUsers();
      } else {
        alert('Failed to create user');
      }
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    const token = localStorage.getItem('siakad_token');
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
    
    try {
      const res = await fetch(`${apiUrl}/siakad/admin/users/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        fetchUsers();
      } else {
        alert('Failed to delete user');
      }
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyItems: 'center', height: '100%', color: 'var(--color-muted)' }}>
      <i className="ph ph-spinner ph-spin" style={{ fontSize: '2rem', marginRight: '10px' }}></i> Memuat data pengguna...
    </div>
  );


  const handleOpenEditModal = (user) => {
    setEditFormData({
      id: user.id,
      name: user.name,
      nim_nip: user.nim_nip,
      role: user.role,
      prodi: user.prodi || '',
      password: ''
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('siakad_token');
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
    
    try {
      const res = await fetch(`${apiUrl}/siakad/admin/users/${editFormData.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editFormData)
      });
      if (res.ok) {
        setIsEditModalOpen(false);
        fetchUsers();
      } else {
        const errorData = await res.json();
        alert('Gagal mengupdate user: ' + (errorData.message || 'Error'));
      }
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--color-text)', margin: '0 0 8px 0' }}>Manajemen Pengguna</h1>
        <p style={{ color: 'var(--color-muted)', margin: 0 }}>Kelola data admin, dosen, dan mahasiswa di sistem SIAKAD.</p>
      </div>

      <div className="siakad-card fade-in" style={{ padding: '24px', marginBottom: '24px', position: 'relative', zIndex: 50 }}>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '1.1rem' }}>Tambah Pengguna Baru</h3>
        <form onSubmit={handleCreateUser} style={{ display: 'flex', gap: '16px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 150px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--color-muted)', fontWeight: '600' }}>Nama Lengkap</label>
            <input name="name" required placeholder="Masukkan nama..." style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none' }} />
          </div>
          <div style={{ flex: '1 1 150px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--color-muted)', fontWeight: '600' }}>NIM / NIP</label>
            <input name="nim_nip" required placeholder="Masukkan NIM/NIP..." style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none' }} />
          </div>
          <div style={{ flex: '1 1 150px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--color-muted)', fontWeight: '600' }}>Password</label>
            <input type="password" name="password" required placeholder="Min. 6 karakter..." style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none' }} />
          </div>
          <div style={{ display: 'flex', gap: '8px', flex: '1 1 250px', flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 100px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--color-muted)', fontWeight: '600' }}>Role</label>
              <CustomSelect 
                name="role"
                value={selectedRole}
                onChange={(val) => setSelectedRole(val)}
                options={[
                  { value: 'mahasiswa', label: 'Mahasiswa', icon: 'ph ph-student' },
                  { value: 'dosen', label: 'Dosen', icon: 'ph ph-chalkboard-teacher' },
                  { value: 'admin', label: 'Admin', icon: 'ph ph-shield-check' },
                  { value: 'kaprodi', label: 'Kaprodi', icon: 'ph ph-briefcase' }
                ]}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--color-muted)', fontWeight: '600' }}>Prodi</label>
              <input name="prodi" placeholder="Prodi..." style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none' }} />
            </div>
          </div>
          <div>
            <button type="submit" style={{ background: '#4f46e5', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', height: '42px', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 6px -1px rgba(79, 70, 229, 0.2)' }}>
              <i className="ph ph-plus-circle"></i> Tambah
            </button>
          </div>
        </form>
      </div>

      <div className="siakad-card stagger-2" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ background: 'var(--glass-bg)', borderBottom: '1px solid #e5e7eb' }}>
              <tr>
                <th style={{ padding: '16px 24px', fontWeight: '600', color: 'var(--color-text)', fontSize: '0.9rem' }}>Nama</th>
                <th style={{ padding: '16px 24px', fontWeight: '600', color: 'var(--color-text)', fontSize: '0.9rem' }}>NIM / NIP</th>
                <th style={{ padding: '16px 24px', fontWeight: '600', color: 'var(--color-text)', fontSize: '0.9rem' }}>Role</th>
                <th style={{ padding: '16px 24px', fontWeight: '600', color: 'var(--color-text)', fontSize: '0.9rem', textAlign: 'right' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, idx) => (
                <tr key={user.id} style={{ borderBottom: '1px solid #e5e7eb', background: idx % 2 === 0 ? 'white' : 'rgba(249, 250, 251, 0.3)' }}>
                  <td style={{ padding: '16px 24px', color: 'var(--color-text)', fontWeight: '500' }}>{user.name}</td>
                  <td style={{ padding: '16px 24px', color: 'var(--color-muted)', fontSize: '0.95rem' }}>{user.nim_nip}</td>
                  <td style={{ padding: '16px 24px' }}>
                    <span style={{ 
                      padding: '4px 12px', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 'bold',
                      background: user.role === 'admin' ? '#fee2e2' : user.role === 'dosen' ? '#e0e7ff' : '#dcfce7',
                      color: user.role === 'admin' ? '#991b1b' : user.role === 'dosen' ? '#3730a3' : '#166534'
                    }}>
                      {user.role.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      <button 
                        onClick={() => handleOpenEditModal(user)}
                        style={{ background: 'var(--glass-bg)', color: 'var(--color-text)', border: 'none', padding: '6px 10px', borderRadius: '6px', cursor: 'pointer', transition: 'all 0.2s' }}
                        title="Edit Pengguna"
                      ><i className="ph ph-pencil-simple" style={{ fontSize: '1rem' }}></i></button>
                      <button 
                        onClick={() => handleDeleteUser(user.id)}
                        style={{ background: 'var(--glass-bg)', color: 'var(--color-text)', border: 'none', padding: '6px 10px', borderRadius: '6px', cursor: 'pointer', transition: 'all 0.2s' }}
                        title="Hapus Pengguna"
                      ><i className="ph ph-trash" style={{ fontSize: '1rem' }}></i></button>
                    </div>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan="4" style={{ padding: '24px', textAlign: 'center', color: 'var(--color-muted)' }}>Tidak ada data pengguna</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isEditModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'var(--glass-bg)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999 }}>
          <div style={{ background: 'var(--color-bg)', padding: '24px', borderRadius: '16px', width: '100%', maxWidth: '500px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}>
            <h2 style={{ margin: '0 0 20px 0', fontSize: '1.25rem', fontWeight: 'bold' }}>Edit Pengguna</h2>
            <form onSubmit={handleUpdateUser}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Nama Lengkap</label>
                <input value={editFormData.name} onChange={(e) => setEditFormData({...editFormData, name: e.target.value})} required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db' }} />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>NIM / NIP</label>
                <input value={editFormData.nim_nip} onChange={(e) => setEditFormData({...editFormData, nim_nip: e.target.value})} required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db' }} />
              </div>
              <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Role</label>
                  <CustomSelect
                    value={editFormData.role}
                    onChange={(val) => setEditFormData({...editFormData, role: val})}
                    options={[
                      { value: 'mahasiswa', label: 'Mahasiswa', icon: 'ph ph-student' },
                      { value: 'dosen', label: 'Dosen', icon: 'ph ph-chalkboard-teacher' },
                      { value: 'admin', label: 'Admin', icon: 'ph ph-shield-check' },
                      { value: 'kaprodi', label: 'Kaprodi', icon: 'ph ph-briefcase' }
                    ]}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Prodi</label>
                  <input value={editFormData.prodi} onChange={(e) => setEditFormData({...editFormData, prodi: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db' }} />
                </div>
              </div>
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Password Baru (Opsional)</label>
                <input type="password" value={editFormData.password} onChange={(e) => setEditFormData({...editFormData, password: e.target.value})} placeholder="Biarkan kosong jika tidak ingin mengubah..." style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db' }} />
              </div>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setIsEditModalOpen(false)} style={{ padding: '10px 16px', background: 'transparent', border: '1px solid #d1d5db', borderRadius: '8px', cursor: 'pointer' }}>Batal</button>
                <button type="submit" style={{ padding: '10px 16px', background: '#4f46e5', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Simpan Perubahan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
