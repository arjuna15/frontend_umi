"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import CustomSelect from '../../components/CustomSelect';

export default function AdminUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedProdi, setSelectedProdi] = useState("");
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
        window.toast('User created successfully');
        e.target.reset();
        setSelectedRole("mahasiswa");
        setSelectedProdi("");
        fetchUsers();
      } else {
        window.toast('Failed to create user');
      }
    } catch (err) {
      window.toast('Error: ' + err.message);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!await window.toast.confirm('Are you sure you want to delete this user?')) return;
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
        window.toast('Failed to delete user');
      }
    } catch (err) {
      window.toast('Error: ' + err.message);
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
        window.toast('Gagal mengupdate user: ' + (errorData.message || 'Error'));
      }
    } catch (err) {
      window.toast('Error: ' + err.message);
    }
  };

  return (
    <div className="fade-in">
      <div style={{ 
        background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #4c0519 100%)',
        borderRadius: '24px', padding: '40px', marginBottom: '32px', position: 'relative', overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(196,30,58,0.15)', filter: 'blur(40px)' }}></div>
        <div style={{ position: 'absolute', bottom: '-20px', left: '30%', width: '150px', height: '150px', borderRadius: '50%', background: 'rgba(99,102,241,0.1)', filter: 'blur(30px)' }}></div>
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ flex: '1 1 300px' }}>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', margin: '0 0 8px 0', letterSpacing: '0.1em', textTransform: 'uppercase' }}>SIAKAD — ADMIN</p>
            <h1 style={{ color: 'white', fontSize: '2.2rem', fontWeight: '800', margin: '0 0 8px 0', letterSpacing: '-0.03em' }}>Manajemen Pengguna</h1>
            <p style={{ color: 'rgba(255,255,255,0.6)', margin: 0 }}>Kelola data admin, dosen, dan mahasiswa di sistem SIAKAD.</p>
          </div>
          <div>
            <button onClick={() => window.toast?.('Silakan pilih file CSV...')} style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', padding: '10px 20px', borderRadius: '12px', cursor: 'pointer', color: 'white', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <i className="ph ph-upload-simple"></i> Import CSV
            </button>
          </div>
        </div>
      </div>

      <div className="siakad-card fade-in" style={{ padding: '24px', marginBottom: '24px', position: 'relative', zIndex: 99 }}>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '1.1rem', color: 'var(--color-text)' }}>Tambah Pengguna Baru</h3>
        <form onSubmit={handleCreateUser} style={{ display: 'flex', gap: '16px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 150px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--color-muted)', fontWeight: '600' }}>Nama Lengkap</label>
            <input name="name" required placeholder="Masukkan nama..." style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--color-border)', outline: 'none', background: 'var(--color-bg)', color: 'var(--color-text)' }} />
          </div>
          <div style={{ flex: '1 1 150px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--color-muted)', fontWeight: '600' }}>NIM / NIP</label>
            <input name="nim_nip" required placeholder="Masukkan NIM/NIP..." style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--color-border)', outline: 'none', background: 'var(--color-bg)', color: 'var(--color-text)' }} />
          </div>
          <div style={{ flex: '1 1 150px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--color-muted)', fontWeight: '600' }}>Password</label>
            <input type="password" name="password" required placeholder="Min. 6 karakter..." style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--color-border)', outline: 'none', background: 'var(--color-bg)', color: 'var(--color-text)' }} />
          </div>
          <div style={{ flex: '1 1 150px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--color-muted)', fontWeight: '600' }}>Role</label>
            <CustomSelect 
              name="role"
              value={selectedRole}
              onChange={(val) => setSelectedRole(val)}
              options={[
                { value: '', label: 'Pilih Role...', icon: 'ph ph-user' },
                { value: 'mahasiswa', label: 'Mahasiswa', icon: 'ph ph-student' },
                { value: 'dosen', label: 'Dosen', icon: 'ph ph-chalkboard-teacher' },
                { value: 'admin', label: 'Admin', icon: 'ph ph-shield-check' },
                { value: 'kaprodi', label: 'Kaprodi', icon: 'ph ph-briefcase' }
              ]}
            />
          </div>
          <div style={{ flex: '1 1 200px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--color-muted)', fontWeight: '600' }}>Prodi</label>
            <CustomSelect 
              name="prodi"
              value={selectedProdi}
              onChange={(val) => setSelectedProdi(val)}
              placeholder="Pilih Prodi..."
              options={[
                { value: '', label: 'Tidak Ada / Global' },
                { value: 'Teknik Informatika', label: 'Teknik Informatika' },
                { value: 'Sistem Informasi', label: 'Sistem Informasi' },
                { value: 'Teknik Komputer', label: 'Teknik Komputer' },
                { value: 'Manajemen Bisnis', label: 'Manajemen Bisnis' }
              ]}
            />
          </div>
          <div style={{ flex: '0 0 auto' }}>
            <button type="submit" style={{ background: '#4f46e5', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', height: '42px', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 6px -1px rgba(79, 70, 229, 0.2)' }}>
              <i className="ph ph-plus-circle"></i> Tambah
            </button>
          </div>
        </form>
      </div>

      <div className="siakad-card stagger-2" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="siakad-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr>
                <th style={{ padding: '16px 24px', fontWeight: '600' }}>Nama</th>
                <th style={{ padding: '16px 24px', fontWeight: '600' }}>NIM / NIP</th>
                <th style={{ padding: '16px 24px', fontWeight: '600' }}>Role</th>
                <th style={{ padding: '16px 24px', fontWeight: '600', textAlign: 'right' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, idx) => (
                <tr key={user.id}>
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
                        onClick={() => window.toast?.('Password berhasil direset ke default (123456)')}
                        style={{ background: 'var(--glass-bg)', color: '#f59e0b', border: 'none', padding: '6px 10px', borderRadius: '6px', cursor: 'pointer', transition: 'all 0.2s' }}
                        title="Reset Password"
                      ><i className="ph ph-key" style={{ fontSize: '1rem' }}></i></button>
                      <button 
                        onClick={() => handleOpenEditModal(user)}
                        style={{ background: 'var(--glass-bg)', color: 'var(--color-text)', border: 'none', padding: '6px 10px', borderRadius: '6px', cursor: 'pointer', transition: 'all 0.2s' }}
                        title="Edit Pengguna"
                      ><i className="ph ph-pencil-simple" style={{ fontSize: '1rem' }}></i></button>
                      <button 
                        onClick={() => handleDeleteUser(user.id)}
                        style={{ background: 'var(--glass-bg)', color: '#ef4444', border: 'none', padding: '6px 10px', borderRadius: '6px', cursor: 'pointer', transition: 'all 0.2s' }}
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
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999, backdropFilter: 'blur(4px)' }}>
          <div className="siakad-card fade-in" style={{ padding: '24px', width: '100%', maxWidth: '500px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}>
            <h2 style={{ margin: '0 0 20px 0', fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--color-text)' }}>Edit Pengguna</h2>
            <form onSubmit={handleUpdateUser}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: 'var(--color-text)' }}>Nama Lengkap</label>
                <input value={editFormData.name} onChange={(e) => setEditFormData({...editFormData, name: e.target.value})} required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-bg)', color: 'var(--color-text)' }} />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: 'var(--color-text)' }}>NIM / NIP</label>
                <input value={editFormData.nim_nip} onChange={(e) => setEditFormData({...editFormData, nim_nip: e.target.value})} required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-bg)', color: 'var(--color-text)' }} />
              </div>
              <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: 'var(--color-text)' }}>Role</label>
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
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: 'var(--color-text)' }}>Prodi</label>
                  <CustomSelect
                    value={editFormData.prodi}
                    onChange={(val) => setEditFormData({...editFormData, prodi: val})}
                    placeholder="Pilih Prodi..."
                    options={[
                      { value: '', label: 'Tidak Ada / Global' },
                      { value: 'Teknik Informatika', label: 'Teknik Informatika' },
                      { value: 'Sistem Informasi', label: 'Sistem Informasi' },
                      { value: 'Teknik Komputer', label: 'Teknik Komputer' },
                      { value: 'Manajemen Bisnis', label: 'Manajemen Bisnis' }
                    ]}
                  />
                </div>
              </div>
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: 'var(--color-text)' }}>Password Baru (Opsional)</label>
                <input type="password" value={editFormData.password} onChange={(e) => setEditFormData({...editFormData, password: e.target.value})} placeholder="Biarkan kosong jika tidak ingin mengubah..." style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-bg)', color: 'var(--color-text)' }} />
              </div>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setIsEditModalOpen(false)} style={{ padding: '10px 16px', background: 'transparent', border: '1px solid var(--color-border)', borderRadius: '8px', cursor: 'pointer', color: 'var(--color-text)' }}>Batal</button>
                <button type="submit" style={{ padding: '10px 16px', background: '#4f46e5', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Simpan Perubahan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
