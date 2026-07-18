"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CustomSelect from '../../components/CustomSelect';
import ModalShell from '../../components/ModalShell';


export default function KaprodiDosenPage() {
  const router = useRouter();
  const [dosen, setDosen] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [userProdi, setUserProdi] = useState('');
  const [prodiOptions, setProdiOptions] = useState([]);
  const [editFormData, setEditFormData] = useState({ id: '', name: '', nip: '', status: 'Aktif', jfa: 'Lektor', password: '' });
  const [searchQuery, setSearchQuery] = useState('');

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
      const [usersRes, prodiRes] = await Promise.all([
        fetch(`${apiUrl}/siakad/admin/users`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${apiUrl}/siakad/admin/prodis`, { headers: { 'Authorization': `Bearer ${token}` } })
      ]);
      if (usersRes.ok) {
        const data = await usersRes.json();
        
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
        if (prodiRes.ok) {
          const prodis = await prodiRes.json();
          const mappedProdi = Array.isArray(prodis) ? prodis.map((p) => ({ value: p.name, label: p.name })) : [];
          setProdiOptions(mappedProdi.length > 0 ? mappedProdi : Array.from(new Set((data || []).map((u) => u.prodi).filter(Boolean))).map((p) => ({ value: p, label: p })));
        } else {
          setProdiOptions(Array.from(new Set((data || []).map((u) => u.prodi).filter(Boolean))).map((p) => ({ value: p, label: p })) );
        }
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
      prodi: userProdi || '',
      jfa: editFormData.jfa,
      status: editFormData.status
    };

    if (!editFormData.id) {
      if (!editFormData.password.trim()) {
        window.toast?.('Password wajib diisi untuk dosen baru');
        return;
      }
      payload.password = editFormData.password.trim();
    } else if (editFormData.password.trim()) {
      payload.password = editFormData.password.trim();
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
    setEditFormData({ id: '', name: '', nip: '', status: 'Aktif', jfa: 'Asisten Ahli', password: '' });
    setIsEditModalOpen(true);
  };

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyItems: 'center', height: '100%', color: 'var(--color-muted)' }}>
      <i className="ph ph-spinner ph-spin" style={{ fontSize: '2rem', marginRight: '10px' }}></i> Memuat Data Dosen...
    </div>
  );

  return (
    <div className="fade-in" style={{ paddingBottom: '40px' }}>
      <div style={{ marginBottom: '32px' }}>
        <div className="siakad-page-header">
        <div className="siakad-page-header-glow"></div>
        <div className="siakad-page-header-grid"></div>
          <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ flex: '1 1 300px' }}>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', margin: '0 0 8px 0', letterSpacing: '0.1em', textTransform: 'uppercase' }}>SIAKAD — KAPRODI</p>
              <h1 style={{ color: 'white', fontSize: '2.2rem', fontWeight: '800', margin: '0 0 8px 0', letterSpacing: '-0.03em' }}>Manajemen Dosen</h1>
              <p style={{ color: 'rgba(255,255,255,0.6)', margin: 0 }}>Kelola profil, jabatan, dan status keaktifan dosen di program studi {userProdi || 'Belum tersedia'}.</p>
            </div>
            <button onClick={openAddModal} style={{ background: 'linear-gradient(135deg, #C41E3A 0%, #9b1c2e 100%)', color: 'white', padding: '10px 24px', borderRadius: '50px', border: 'none', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 15px rgba(196, 30, 58, 0.3)' , flexWrap: 'wrap'}}>
              <i className="ph ph-user-plus" style={{ fontSize: '1.2rem' }}></i> Tambah Dosen
            </button>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '24px', alignItems: 'start' }}>
        <div className="siakad-card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' , flexWrap: 'wrap', borderRadius: '24px', background: 'var(--glass-bg)', border: 'var(--glass-border)', boxShadow: 'var(--glass-shadow)' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'var(--liquid-bg)', border: 'var(--inset-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: 'inset 2px 2px 4px var(--inset-shadow-dark), inset -2px -2px 4px var(--inset-shadow-light)', color: '#C41E3A', fontSize: '1.5rem' }}>
            <i className="ph ph-users"></i>
          </div>
          <div>
            <p style={{ margin: 0, color: 'var(--color-muted)', fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Total Dosen</p>
            <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '800' }}>{dosen.length}</h3>
          </div>
        </div>
        <div className="siakad-card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' , flexWrap: 'wrap', borderRadius: '24px', background: 'var(--glass-bg)', border: 'var(--glass-border)', boxShadow: 'var(--glass-shadow)' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'var(--liquid-bg)', border: 'var(--inset-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: 'inset 2px 2px 4px var(--inset-shadow-dark), inset -2px -2px 4px var(--inset-shadow-light)', color: '#059669', fontSize: '1.5rem' }}>
            <i className="ph ph-user-check"></i>
          </div>
          <div>
            <p style={{ margin: 0, color: 'var(--color-muted)', fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Dosen Aktif</p>
            <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '800' }}>{dosen.filter(d => d.status === 'Aktif').length}</h3>
          </div>
        </div>
      </div>

      <div className="siakad-card stagger-1" style={{ padding: '24px 0 0 0', overflow: 'hidden', borderRadius: '24px', background: 'var(--glass-bg)', border: 'var(--glass-border)', boxShadow: 'var(--glass-shadow)' }}>
        <div style={{ padding: '0 24px 16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', borderBottom: '1px solid var(--color-border)' }}>
          <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--color-text)', fontWeight: 'bold' }}>Daftar Dosen</h3>
          <div style={{ position: 'relative', width: '300px' }}>
            <i className="ph ph-magnifying-glass" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-muted)', fontSize: '1.1rem', zIndex: 10 }}></i>
            <input 
              type="text" 
              placeholder="Cari nama, NIDN/NIP, JFA..." 
              className="siakad-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ 
                width: '100%', 
                paddingLeft: '46px', 
                color: 'var(--color-text)',
                fontSize: '0.9rem',
                boxShadow: 'inset 4px 4px 8px var(--inset-shadow-dark), inset -4px -4px 8px var(--inset-shadow-light)',
                background: 'var(--liquid-bg)',
                border: 'var(--inset-border)',
                borderRadius: '50px',
                outline: 'none'
              }} 
            />
          </div>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="siakad-table" style={{ width: '100%', minWidth: '800px', borderCollapse: 'separate', borderSpacing: '0 12px', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'var(--glass-bg)', color: 'var(--color-muted)', border: 'var(--glass-border)', boxShadow: 'var(--glass-shadow)', textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '0.05em' }}>
                <th style={{ padding: '16px' }}>Nama Lengkap</th>
                <th style={{ padding: '16px' }}>NIDN / NIP</th>
                <th style={{ padding: '16px' }}>JFA</th>
                <th style={{ padding: '16px' }}>Status</th>
                <th style={{ padding: '16px', textAlign: 'right' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {(() => {
                const filteredDosen = dosen.filter(d => {
                  const query = searchQuery.toLowerCase().trim();
                  if (!query) return true;
                  return (
                    d.name?.toLowerCase().includes(query) ||
                    d.nip?.toLowerCase().includes(query) ||
                    d.jfa?.toLowerCase().includes(query) ||
                    d.status?.toLowerCase().includes(query)
                  );
                });

                if (filteredDosen.length === 0) {
                  return (
                    <tr>
                      <td colSpan="5" style={{ padding: '24px', textAlign: 'center', color: 'var(--color-muted)' }}>Tidak ada data dosen</td>
                    </tr>
                  );
                }

                return filteredDosen.map((d) => (
                  <tr key={d.id} style={{ borderBottom: '1px solid var(--color-border)', transition: 'all 0.2s' }} onMouseEnter={(e)=>e.currentTarget.style.background='var(--glass-bg)'} onMouseLeave={(e)=>e.currentTarget.style.background='transparent'}>
                    <td style={{ padding: '16px', fontWeight: 'bold', color: 'var(--color-text)' }}>{d.name}</td>
                    <td style={{ padding: '16px', color: 'var(--color-muted)' }}>{d.nip}</td>
                    <td style={{ padding: '16px' }}>{d.jfa}</td>
                    <td style={{ padding: '16px' }}>
                      <span className="siakad-badge" style={{
                        background: d.status === 'Aktif' ? 'rgba(5, 150, 105, 0.15)' : 
                                    d.status === 'Studi Lanjut' ? 'rgba(196, 30, 58, 0.15)' : 
                                    d.status === 'Cuti' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                        color: d.status === 'Aktif' ? '#059669' : 
                               d.status === 'Studi Lanjut' ? '#C41E3A' : 
                               d.status === 'Cuti' ? '#f59e0b' : '#ef4444',
                        borderRadius: '50px', padding: '4px 12px'
                      }}>{d.status}</span>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', flexWrap: 'nowrap', alignItems: 'center' }}>
                        <button onClick={() => { setEditFormData(d); setIsEditModalOpen(true); }} style={{ background: 'var(--glass-bg)', border: 'var(--glass-border)', boxShadow: 'var(--glass-shadow)', color: '#3b82f6', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><i className="ph ph-pencil-simple"></i></button>
                        <button onClick={() => handleDelete(d.id)} style={{ background: 'var(--glass-bg)', border: 'var(--glass-border)', boxShadow: 'var(--glass-shadow)', color: '#ef4444', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><i className="ph ph-trash"></i></button>
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
          title={editFormData.id ? 'Edit Data Dosen' : 'Tambah Dosen Baru'}
          icon="ph-user-gear"
          onClose={() => setIsEditModalOpen(false)}
          footer={(
            <>
              <button type="button" onClick={() => setIsEditModalOpen(false)} style={{ padding: '10px 20px', borderRadius: '50px', border: 'var(--glass-border)', background: 'var(--glass-bg)', color: 'var(--color-text)', cursor: 'pointer', fontWeight: 700, boxShadow: 'var(--glass-shadow)' }}>Batal</button>
              <button type="submit" form="dosen-form" style={{ padding: '10px 24px', borderRadius: '50px', border: 'none', background: 'linear-gradient(135deg, #C41E3A 0%, #9b1c2e 100%)', color: 'white', cursor: 'pointer', fontWeight: 700, boxShadow: '0 4px 12px rgba(196, 30, 58, 0.25)' }}>Simpan</button>
            </>
          )}
        >
          <form id="dosen-form" onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' , flexWrap: 'wrap'}}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>NIP</label>
              <input type="text" required value={editFormData.nip} onChange={e=>setEditFormData({...editFormData, nip: e.target.value})} className="siakad-input" style={{ width: '100%', boxShadow: 'inset 4px 4px 8px var(--inset-shadow-dark), inset -4px -4px 8px var(--inset-shadow-light)', background: 'var(--liquid-bg)', border: 'var(--inset-border)', color: 'var(--color-text)' }} placeholder="Contoh: NIP dosen" />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Nama Dosen</label>
              <input type="text" required value={editFormData.name} onChange={e=>setEditFormData({...editFormData, name: e.target.value})} className="siakad-input" style={{ width: '100%', boxShadow: 'inset 4px 4px 8px var(--inset-shadow-dark), inset -4px -4px 8px var(--inset-shadow-light)', background: 'var(--liquid-bg)', border: 'var(--inset-border)', color: 'var(--color-text)' }} placeholder="Contoh: Nama dosen" />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Program Studi</label>
              <CustomSelect 
                value={editFormData.prodi}
                onChange={val => setEditFormData({...editFormData, prodi: val})}
                options={prodiOptions}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Password Awal / Baru</label>
              <input
                type="password"
                value={editFormData.password}
                onChange={e=>setEditFormData({...editFormData, password: e.target.value})}
                className="siakad-input"
                style={{ width: '100%', boxShadow: 'inset 4px 4px 8px var(--inset-shadow-dark), inset -4px -4px 8px var(--inset-shadow-light)', background: 'var(--liquid-bg)', border: 'var(--inset-border)', color: 'var(--color-text)' }}
                placeholder="Isi untuk akun baru atau perubahan password"
              />
            </div>
          </form>
        </ModalShell>
      )}
    </div>
  );
}
