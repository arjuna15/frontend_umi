"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import CustomSelect from '../../components/CustomSelect';
import ModalShell from '../../components/ModalShell';

export default function AdminUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedProdi, setSelectedProdi] = useState("");
  const [prodiOptions, setProdiOptions] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    id: '', name: '', nim_nip: '', role: '', prodi: '', password: ''
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [resetPasswordUser, setResetPasswordUser] = useState(null);
  const [resetPasswordValue, setResetPasswordValue] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const token = localStorage.getItem('siakad_token');
    if (!token) return router.push('/siakad/login');
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

    try {
      const [usersRes, prodiRes] = await Promise.all([
        fetch(`${apiUrl}/siakad/admin/users`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${apiUrl}/siakad/admin/prodis`, { headers: { 'Authorization': `Bearer ${token}` } })
      ]);

      if (usersRes.status === 401 || usersRes.status === 403 || prodiRes.status === 401 || prodiRes.status === 403) {
        localStorage.removeItem('siakad_token');
        localStorage.removeItem('siakad_role');
        localStorage.removeItem('siakad_user');
        router.push('/siakad/login');
        return;
      }

      if (!usersRes.ok) {
        const errorText = await usersRes.text().catch(() => '');
        throw new Error(`Failed to fetch users (${usersRes.status}) ${errorText}`.trim());
      }

      const data = await usersRes.json();
      const normalizedUsers = Array.isArray(data) ? data : [];
      setUsers(normalizedUsers);

      if (prodiRes.ok) {
        const prodis = await prodiRes.json();
        const mapped = Array.isArray(prodis)
          ? prodis.map((p) => ({ value: p.name, label: p.name }))
          : [];
        setProdiOptions(mapped.length > 0 ? mapped : Array.from(new Set((normalizedUsers || []).map((u) => u.prodi).filter(Boolean))).map((p) => ({ value: p, label: p })));
      } else {
        setProdiOptions(Array.from(new Set((normalizedUsers || []).map((u) => u.prodi).filter(Boolean))).map((p) => ({ value: p, label: p })));
      }
    } catch (err) {
      console.error(err);
      window.toast?.(err.message || 'Failed to fetch users');
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

  const handleResetPassword = (user) => {
    setResetPasswordUser(user);
    setResetPasswordValue('');
  };

  const submitResetPassword = async () => {
    if (!resetPasswordUser || !resetPasswordValue.trim()) return;
    const token = localStorage.getItem('siakad_token');
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
    try {
      const res = await fetch(`${apiUrl}/siakad/admin/users/${resetPasswordUser.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: resetPasswordUser.name,
          nim_nip: resetPasswordUser.nim_nip,
          role: resetPasswordUser.role,
          prodi: resetPasswordUser.prodi || '',
          password: resetPasswordValue
        })
      });
      if (res.ok) {
        window.toast && window.toast('Password berhasil diperbarui');
        setResetPasswordUser(null);
        fetchUsers();
      } else {
        const errorData = await res.json();
        window.toast && window.toast('Gagal mereset password: ' + (errorData.message || 'Error'));
      }
    } catch (err) {
      window.toast && window.toast('Error: ' + err.message);
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
      <div className="siakad-page-header">
        <div className="siakad-page-header-glow"></div>
        <div className="siakad-page-header-grid"></div>
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ flex: '1 1 300px' }}>
            <p style={{ color: 'var(--color-muted)', fontSize: '0.85rem', margin: '0 0 8px 0', letterSpacing: '0.1em', textTransform: 'uppercase' }}>SIAKAD — ADMIN</p>
            <h1 style={{ fontSize: '2.2rem', fontWeight: '800', margin: '0 0 8px 0', letterSpacing: '-0.03em' }}>Manajemen Pengguna</h1>
            <p style={{ margin: 0 }}>Kelola data admin, dosen, dan mahasiswa di sistem SIAKAD.</p>
          </div>
          <div>
            <button onClick={() => window.toast?.('Silakan pilih file CSV...')} className="siakad-btn-primary" style={{ padding: '12px 22px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
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
            <input name="name" className="siakad-input" required placeholder="Masukkan nama..." style={{ minWidth: 0, flex: '1 1 120px'}} />
          </div>
          <div style={{ flex: '1 1 150px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--color-muted)', fontWeight: '600' }}>NIM / NIP</label>
            <input name="nim_nip" className="siakad-input" required placeholder="Masukkan NIM/NIP..." style={{ minWidth: 0, flex: '1 1 120px'}} />
          </div>
          <div style={{ flex: '1 1 150px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--color-muted)', fontWeight: '600' }}>Password</label>
            <input type="password" name="password" className="siakad-input" required placeholder="Min. 6 karakter..." style={{ minWidth: 0, flex: '1 1 120px'}} />
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
              options={prodiOptions}
            />
          </div>
          <div style={{ flex: '0 0 auto' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'transparent', fontWeight: '600', userSelect: 'none' }}>&nbsp;</label>
            <button type="submit" className="siakad-btn-primary" style={{ padding: '12px 24px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', whiteSpace: 'nowrap' }}>
              <i className="ph ph-plus-circle"></i> Tambah
            </button>
          </div>
        </form>
      </div>

      <div className="siakad-card stagger-2" style={{ padding: '24px 0 0 0', overflow: 'hidden' }}>
        <div style={{ padding: '0 24px 16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', borderBottom: '1px solid var(--color-border)' }}>
          <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--color-text)', fontWeight: 'bold' }}>Daftar Pengguna</h3>
          <div style={{ position: 'relative', width: '300px' }}>
            <i className="ph ph-magnifying-glass" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-muted)', fontSize: '1.1rem' }}></i>
            <input 
              className="siakad-input"
              type="text" 
              placeholder="Cari nama, NIM/NIP, prodi..." 
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
                <th style={{ padding: '16px 24px', fontWeight: '600' }}>Nama</th>
                <th style={{ padding: '16px 24px', fontWeight: '600' }}>NIM / NIP</th>
                <th style={{ padding: '16px 24px', fontWeight: '600' }}>Role</th>
                <th style={{ padding: '16px 24px', fontWeight: '600', textAlign: 'right' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {(() => {
                const filteredUsers = users.filter(user => {
                  const query = searchQuery.toLowerCase().trim();
                  if (!query) return true;
                  return (
                    user.name?.toLowerCase().includes(query) ||
                    user.nim_nip?.toLowerCase().includes(query) ||
                    user.role?.toLowerCase().includes(query) ||
                    user.prodi?.toLowerCase().includes(query)
                  );
                });

                if (filteredUsers.length === 0) {
                  return (
                    <tr>
                      <td colSpan="4" style={{ padding: '24px', textAlign: 'center', color: 'var(--color-muted)' }}>Tidak ada data pengguna</td>
                    </tr>
                  );
                }

                return filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td style={{ padding: '16px 24px', color: 'var(--color-text)', fontWeight: '500' }}>{user.name}</td>
                    <td style={{ padding: '16px 24px', color: 'var(--color-muted)', fontSize: '0.95rem' }}>{user.nim_nip}</td>
                    <td style={{ padding: '16px 24px' }}>
                      <span style={{ 
                        padding: '6px 12px', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 'bold',
                        background: user.role === 'admin' ? '#fee2e2' : user.role === 'dosen' ? '#e0e7ff' : user.role === 'kaprodi' ? '#ccfbf1' : '#dcfce7',
                        color: user.role === 'admin' ? '#991b1b' : user.role === 'dosen' ? '#3730a3' : user.role === 'kaprodi' ? '#115e59' : '#166534',
                        display: 'inline-block',
                        width: '110px',
                        textAlign: 'center'
                      }}>
                        {user.role.toUpperCase()}
                      </span>
                    </td>
                    <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' , flexWrap: 'wrap'}}>
                        <button 
                          onClick={() => handleResetPassword(user)}
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
                ));
              })()}
            </tbody>
          </table>
        </div>
      </div>

      {isEditModalOpen && (
        <ModalShell
          title="Edit Pengguna"
          icon="ph-user-circle"
          onClose={() => setIsEditModalOpen(false)}
          footer={(
            <>
              <button type="button" onClick={() => setIsEditModalOpen(false)} style={{ padding: '12px 20px', border: 'none', cursor: 'pointer', color: 'var(--color-text)', fontWeight: 700, transition: 'all 0.2s' }}>Batal</button>
              <button type="button" onClick={handleUpdateUser} className="siakad-btn-primary" style={{ padding: '12px 20px', fontWeight: 700 }}>Simpan Perubahan</button>
            </>
          )}
        >
          <form id="user-edit-form" onSubmit={handleUpdateUser}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: 'var(--color-text)' }}>Nama Lengkap</label>
              <input className="siakad-input" value={editFormData.name} onChange={(e) => setEditFormData({...editFormData, name: e.target.value})} required style={{ width: '100%' }} />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: 'var(--color-text)' }}>NIM / NIP</label>
              <input className="siakad-input" value={editFormData.nim_nip} onChange={(e) => setEditFormData({...editFormData, nim_nip: e.target.value})} required style={{ width: '100%' }} />
            </div>
            <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' , flexWrap: 'wrap' }}>
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
                  options={prodiOptions}
                />
              </div>
            </div>
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: 'var(--color-text)' }}>Password Baru (Opsional)</label>
              <input className="siakad-input" type="password" value={editFormData.password} onChange={(e) => setEditFormData({...editFormData, password: e.target.value})} placeholder="Biarkan kosong jika tidak ingin mengubah..." style={{ width: '100%' }} />
            </div>
          </form>
        </ModalShell>
      )}

      {/* Custom Reset Password Modal */}
      {resetPasswordUser && (
        <ModalShell
          title="Reset Password Pengguna"
          onClose={() => setResetPasswordUser(null)}
          maxWidth="440px"
          footer={
            <>
              <button onClick={() => setResetPasswordUser(null)} style={{ padding: '12px 24px', border: 'none', color: 'var(--color-text)', cursor: 'pointer', fontWeight: 'bold', transition: 'all 0.2s' }}>Batal</button>
              <button onClick={submitResetPassword} disabled={!resetPasswordValue.trim()} className="siakad-btn-primary" style={{ padding: '12px 24px' }}>Simpan Password</button>
            </>
          }
        >
          <div style={{ marginBottom: '16px' }}>
            <p style={{ margin: '0 0 16px 0', fontSize: '0.9rem' }}>
              Masukkan password baru untuk pengguna <strong>{resetPasswordUser.name}</strong> ({resetPasswordUser.nim_nip}):
            </p>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: 'var(--color-text)' }}>Password Baru</label>
            <input 
              type="password" 
              className="siakad-input"
              value={resetPasswordValue} 
              onChange={(e) => setResetPasswordValue(e.target.value)} 
              placeholder="Masukkan password baru..." 
              required 
              style={{ width: '100%', color: 'var(--color-text)', fontSize: '0.9rem' }} 
            />
          </div>
        </ModalShell>
      )}
    </div>
  );
}
