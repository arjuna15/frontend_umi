"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CustomSelect from '../../components/CustomSelect';

export default function KaprodiDosenPage() {
  const router = useRouter();
  const [dosen, setDosen] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [userProdi, setUserProdi] = useState('');
  const [editFormData, setEditFormData] = useState({ id: '', name: '', nip: '', status: 'Aktif', jfa: 'Lektor' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const token = localStorage.getItem('siakad_token');
    const userStr = localStorage.getItem('siakad_user');
    if (!token) return router.push('/siakad/login');

    let prodi = '';
    if (userStr) {
      const user = JSON.parse(userStr);
      prodi = user.prodi;
      setUserProdi(prodi);
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
    try {
      const res = await fetch(`${apiUrl}/siakad/admin/users`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        
        // Filter by role === 'dosen' and prodi matching Kaprodi
        const filtered = data.filter(u => 
          u.role === 'dosen' && 
          (!prodi || prodi === 'Semua' || u.prodi === prodi)
        );

        const mapped = filtered.map(d => ({
          id: d.id,
          name: d.name,
          nip: d.nim_nip,
          status: d.status || 'Aktif',
          jfa: d.jfa || 'Asisten Ahli'
        }));

        setDosen(mapped);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('siakad_token');
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

    const payload = {
      name: editFormData.name,
      nim_nip: editFormData.nip,
      role: 'dosen',
      prodi: userProdi || 'Teknik Komputer',
      jfa: editFormData.jfa,
      status: editFormData.status
    };

    if (!editFormData.id) {
      payload.password = 'password123'; // Default password for new lecturer accounts
    }

    try {
      let res;
      if (editFormData.id) {
        res = await fetch(`${apiUrl}/siakad/admin/users/${editFormData.id}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });
      } else {
        res = await fetch(`${apiUrl}/siakad/admin/users`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });
      }

      if (res.ok) {
        window.toast?.(editFormData.id ? 'Data dosen berhasil diperbarui' : 'Dosen baru berhasil ditambahkan');
        setIsEditModalOpen(false);
        fetchData();
      } else {
        const errorData = await res.json();
        window.toast?.('Gagal menyimpan: ' + (errorData.message || 'Error'));
      }
    } catch (err) {
      window.toast?.('Terjadi kesalahan: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Yakin ingin menghapus dosen ini dari program studi?')) {
      const token = localStorage.getItem('siakad_token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
      try {
        const res = await fetch(`${apiUrl}/siakad/admin/users/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          window.toast?.('Dosen berhasil dihapus');
          fetchData();
        } else {
          window.toast?.('Gagal menghapus');
        }
      } catch (err) {
        window.toast?.('Terjadi kesalahan: ' + err.message);
      }
    }
  };

  const openAddModal = () => {
    setEditFormData({ id: '', name: '', nip: '', status: 'Aktif', jfa: 'Asisten Ahli' });
    setIsEditModalOpen(true);
  };

  if (loading) return <div style={{ padding: '20px' }}>Loading...</div>;

  return (
    <div className="fade-in" style={{ paddingBottom: '40px' }}>
      <div style={{ marginBottom: '32px' }}>
        <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #4c0519 100%)', borderRadius: '24px', padding: '40px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(196,30,58,0.15)', filter: 'blur(40px)' , flexShrink: 0 }}></div>
          <div style={{ position: 'absolute', bottom: '-20px', left: '30%', width: '150px', height: '150px', borderRadius: '50%', background: 'rgba(99,102,241,0.1)', filter: 'blur(30px)' , flexShrink: 0 }}></div>
          <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ flex: '1 1 300px' }}>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', margin: '0 0 8px 0', letterSpacing: '0.1em', textTransform: 'uppercase' }}>SIAKAD — KAPRODI</p>
              <h1 style={{ color: 'white', fontSize: '2.2rem', fontWeight: '800', margin: '0 0 8px 0', letterSpacing: '-0.03em' }}>Manajemen Dosen</h1>
              <p style={{ color: 'rgba(255,255,255,0.6)', margin: 0 }}>Kelola profil, jabatan, dan status keaktifan dosen di program studi {userProdi}.</p>
            </div>
            <button onClick={openAddModal} style={{ background: '#3b82f6', color: 'white', padding: '12px 24px', borderRadius: '12px', border: 'none', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)' , flexWrap: 'wrap'}}>
              <i className="ph ph-user-plus" style={{ fontSize: '1.2rem' }}></i> Tambah Dosen
            </button>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '24px' }}>
        <div className="siakad-card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' , flexWrap: 'wrap'}}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' , flexShrink: 0 }}>
            <i className="ph ph-users"></i>
          </div>
          <div>
            <p style={{ margin: 0, color: 'var(--color-muted)', fontSize: '0.9rem' }}>Total Dosen</p>
            <h3 style={{ margin: 0, fontSize: '1.5rem' }}>{dosen.length}</h3>
          </div>
        </div>
        <div className="siakad-card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' , flexWrap: 'wrap'}}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' , flexShrink: 0 }}>
            <i className="ph ph-user-check"></i>
          </div>
          <div>
            <p style={{ margin: 0, color: 'var(--color-muted)', fontSize: '0.9rem' }}>Dosen Aktif</p>
            <h3 style={{ margin: 0, fontSize: '1.5rem' }}>{dosen.filter(d => d.status === 'Aktif').length}</h3>
          </div>
        </div>
      </div>

      <div className="siakad-card" style={{ padding: '24px' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="siakad-table" style={{ width: '100%', minWidth: '800px', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'var(--glass-bg)', color: 'var(--color-muted)', borderBottom: '1px solid var(--color-border)', textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '0.05em' }}>
                <th style={{ padding: '16px' }}>Nama Lengkap</th>
                <th style={{ padding: '16px' }}>NIDN / NIP</th>
                <th style={{ padding: '16px' }}>JFA</th>
                <th style={{ padding: '16px' }}>Status</th>
                <th style={{ padding: '16px', textAlign: 'right' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {dosen.map((d) => (
                <tr key={d.id} style={{ borderBottom: '1px solid var(--color-border)', transition: 'all 0.2s' }} onMouseEnter={(e)=>e.currentTarget.style.background='var(--glass-bg)'} onMouseLeave={(e)=>e.currentTarget.style.background='transparent'}>
                  <td style={{ padding: '16px', fontWeight: 'bold', color: 'var(--color-text)' }}>{d.name}</td>
                  <td style={{ padding: '16px', color: 'var(--color-muted)' }}>{d.nip}</td>
                  <td style={{ padding: '16px' }}>{d.jfa}</td>
                  <td style={{ padding: '16px' }}>
                    <span className="siakad-badge" style={{
                      background: d.status === 'Aktif' ? 'rgba(16, 185, 129, 0.1)' : 
                                  d.status === 'Studi Lanjut' ? 'rgba(59, 130, 246, 0.1)' : 
                                  d.status === 'Cuti' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                      color: d.status === 'Aktif' ? '#10b981' : 
                             d.status === 'Studi Lanjut' ? '#3b82f6' : 
                             d.status === 'Cuti' ? '#f59e0b' : '#ef4444'
                    }}>{d.status}</span>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', flexWrap: 'nowrap' }}>
                      <button onClick={() => { setEditFormData(d); setIsEditModalOpen(true); }} style={{ background: 'transparent', border: '1px solid var(--color-border)', color: '#3b82f6', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', flexShrink: 0 }}><i className="ph ph-pencil-simple"></i></button>
                      <button onClick={() => handleDelete(d.id)} style={{ background: 'transparent', border: '1px solid var(--color-border)', color: '#ef4444', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', flexShrink: 0 }}><i className="ph ph-trash"></i></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isEditModalOpen && (
        <div className="siakad-modal-overlay">
          <div className="siakad-modal-content">
            <div style={{ padding: '24px', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' , flexWrap: 'wrap' }}>
              <h3 style={{ margin: 0, fontSize: '1.25rem' }}>{editFormData.id ? 'Edit Data Dosen' : 'Tambah Dosen Baru'}</h3>
              <button onClick={() => setIsEditModalOpen(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--color-muted)', fontSize: '1.5rem' }}><i className="ph ph-x"></i></button>
            </div>
            <div style={{ padding: '24px' }}>
              <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' , flexWrap: 'wrap'}}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Nama Lengkap & Gelar</label>
                  <input type="text" required value={editFormData.name} onChange={e=>setEditFormData({...editFormData, name: e.target.value})} className="siakad-input" style={{ width: '100%' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>NIDN / NIP</label>
                  <input type="text" required value={editFormData.nip} onChange={e=>setEditFormData({...editFormData, nip: e.target.value})} className="siakad-input" style={{ width: '100%' }} />
                </div>
                <div style={{ display: 'flex', gap: '16px' , flexWrap: 'wrap' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Jabatan Fungsional (JFA)</label>
                    <CustomSelect 
                      value={editFormData.jfa} 
                      onChange={val => setEditFormData({...editFormData, jfa: val})} 
                      options={[
                        { value: "Asisten Ahli", label: "Asisten Ahli" },
                        { value: "Lektor", label: "Lektor" },
                        { value: "Lektor Kepala", label: "Lektor Kepala" },
                        { value: "Guru Besar", label: "Guru Besar" }
                      ]}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Status Keaktifan</label>
                    <CustomSelect 
                      value={editFormData.status} 
                      onChange={val => setEditFormData({...editFormData, status: val})} 
                      options={[
                        { value: "Aktif", label: "Aktif" },
                        { value: "Cuti", label: "Cuti" },
                        { value: "Studi Lanjut", label: "Studi Lanjut" },
                        { value: "Nonaktif", label: "Nonaktif" }
                      ]}
                    />
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' , flexWrap: 'wrap' }}>
                  <button type="button" onClick={() => setIsEditModalOpen(false)} style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'transparent', color: 'var(--color-text)', cursor: 'pointer', fontWeight: 600 }}>Batal</button>
                  <button type="submit" style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', background: '#3b82f6', color: 'white', cursor: 'pointer', fontWeight: 600 }}>Simpan</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
