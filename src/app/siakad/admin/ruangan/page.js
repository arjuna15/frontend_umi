"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CustomSelect from '../../components/CustomSelect';
import ModalShell from '../../components/ModalShell';

export default function AdminRuanganPage() {
  const router = useRouter();
  const [ruangan, setRuangan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({ id: '', name: '', capacity: '', building: '', type: 'Teori', campus_location: 'bintaro' });
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const token = localStorage.getItem('siakad_token');
    if (!token) return router.push('/siakad/login');

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
    try {
      const res = await fetch(`${apiUrl}/siakad/admin/classrooms`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        const mapped = data.map(r => ({
          id: r.id,
          name: r.name,
          capacity: r.capacity,
          building: r.code,
          type: r.type || 'Teori',
          campus_location: r.campus_location || 'bintaro'
        }));
        setRuangan(mapped);
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
      code: editFormData.building,
      name: editFormData.name,
      capacity: parseInt(editFormData.capacity),
      type: editFormData.type,
      campus_location: editFormData.campus_location || 'bintaro'
    };

    try {
      let res;
      if (editFormData.id) {
        res = await fetch(`${apiUrl}/siakad/admin/classrooms/${editFormData.id}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });
      } else {
        res = await fetch(`${apiUrl}/siakad/admin/classrooms`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });
      }

      if (res.ok) {
        window.toast?.(editFormData.id ? 'Ruangan berhasil diperbarui' : 'Ruangan berhasil ditambahkan');
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
    if (confirm('Yakin ingin menghapus ruangan ini?')) {
      const token = localStorage.getItem('siakad_token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
      try {
        const res = await fetch(`${apiUrl}/siakad/admin/classrooms/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          window.toast?.('Ruangan berhasil dihapus');
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
    setEditFormData({ id: '', name: '', capacity: '', building: '', type: 'Teori', campus_location: 'bintaro' });
    setIsEditModalOpen(true);
  };

  if (loading) return <div style={{ padding: '20px' }}>Loading...</div>;

  return (
    <div className="fade-in" style={{ paddingBottom: '40px' }}>
      <div style={{ marginBottom: '32px' }}>
        <div className="siakad-page-header">
        <div className="siakad-page-header-glow"></div>
        <div className="siakad-page-header-grid"></div>
          <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ flex: '1 1 300px' }}>
              <p style={{ color: 'var(--color-muted)', fontSize: '0.85rem', margin: '0 0 8px 0', letterSpacing: '0.1em', textTransform: 'uppercase' }}>SIAKAD — ADMIN</p>
              <h1 style={{ fontSize: '2.2rem', fontWeight: '800', margin: '0 0 8px 0', letterSpacing: '-0.03em' }}>Manajemen Ruangan</h1>
              <p style={{ margin: 0 }}>Kelola daftar ruangan kelas dan laboratorium untuk perkuliahan.</p>
            </div>
            <button onClick={openAddModal} className="siakad-btn-primary" style={{ background: 'linear-gradient(135deg, #C41E3A 0%, #9b1c2e 100%)', color: 'white', border: 'none', boxShadow: '0 4px 12px rgba(196, 30, 58, 0.25)', padding: '12px 24px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <i className="ph ph-plus-circle" style={{ fontSize: '1.2rem' }}></i> Tambah Ruangan
            </button>
          </div>
        </div>
      </div>

      <div className="siakad-card" style={{ background: 'var(--glass-bg)', border: 'var(--glass-border)', boxShadow: 'var(--glass-shadow)', padding: '0px', overflow: 'hidden' }}>
        <div style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', borderBottom: '1px solid var(--color-border)' }}>
          <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--color-text)', fontWeight: 'bold' }}>Daftar Ruangan</h3>
          <div style={{ position: 'relative', width: '300px' }}>
            <i className="ph ph-magnifying-glass" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-muted)', fontSize: '1.1rem' }}></i>
            <input type="text" className="siakad-input" placeholder="Cari nama ruangan, kode, tipe..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ boxShadow: 'inset 4px 4px 8px var(--inset-shadow-dark), inset -4px -4px 8px var(--inset-shadow-light)', background: 'var(--liquid-bg)', border: 'var(--inset-border)', color: 'var(--color-text)', width: '100%', paddingLeft: '46px',  fontSize: '0.9rem' }} />
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="siakad-table" style={{ width: '100%', minWidth: '800px', borderCollapse: 'separate', borderSpacing: '0 12px', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'var(--glass-bg)', color: 'var(--color-muted)', borderBottom: '1px solid var(--color-border)', textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '0.05em' }}>
                <th style={{ padding: '16px' }}>Nama Ruangan</th>
                <th style={{ padding: '16px' }}>Kode / Gedung</th>
                <th style={{ padding: '16px' }}>Kapasitas</th>
                <th style={{ padding: '16px' }}>Tipe</th>
                <th style={{ padding: '16px' }}>Lokasi Kampus</th>
                <th style={{ padding: '16px', textAlign: 'right' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {(() => {
                const filtered = ruangan.filter(r => {
                  const query = searchQuery.toLowerCase().trim();
                  if (!query) return true;
                  return (
                    r.name?.toLowerCase().includes(query) ||
                    r.building?.toLowerCase().includes(query) ||
                    r.type?.toLowerCase().includes(query) ||
                    r.campus_location?.toLowerCase().includes(query)
                  );
                });

                if (filtered.length === 0) {
                  return (
                    <tr>
                      <td colSpan="6" style={{ padding: '32px', textAlign: 'center', color: 'var(--color-muted)' }}>Tidak ada data ruangan.</td>
                    </tr>
                  );
                }

                return filtered.map((r) => (
                  <tr key={r.id} style={{ borderBottom: '1px solid var(--color-border)', transition: 'all 0.2s' }} onMouseEnter={(e)=>e.currentTarget.style.background='var(--glass-bg)'} onMouseLeave={(e)=>e.currentTarget.style.background='transparent'}>
                    <td style={{ padding: '16px', fontWeight: 'bold', color: 'var(--color-text)' }}>{r.name}</td>
                    <td style={{ padding: '16px', color: 'var(--color-muted)' }}>{r.building}</td>
                    <td style={{ padding: '16px' }}>{r.capacity} Kursi</td>
                    <td style={{ padding: '16px' }}>
                      <span className="siakad-badge" style={{ 
                        color: r.type === 'Laboratorium' ? '#10b981' : '#8b5cf6',
                        width: '130px',
                        justifyContent: 'center'
                      }}>{r.type}</span>
                    </td>
                    <td style={{ padding: '16px', fontWeight: '600' }}>
                      <span className="siakad-badge" style={{ 
                        color: r.campus_location === 'pasar_minggu' ? '#ec4899' : '#3b82f6'
                      }}>{r.campus_location === 'pasar_minggu' ? 'Pasar Minggu' : 'Bintaro'}</span>
                    </td>
                    <td style={{ padding: '16px', textAlign: 'right' }}>
                      <button onClick={() => { setEditFormData(r); setIsEditModalOpen(true); }} style={{ background: 'var(--glass-bg)', border: 'var(--glass-border)', boxShadow: 'var(--glass-shadow)', color: '#3b82f6', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginRight: '8px' }}><i className="ph ph-pencil-simple"></i></button>
                      <button onClick={() => handleDelete(r.id)} style={{ background: 'var(--glass-bg)', border: 'var(--glass-border)', boxShadow: 'var(--glass-shadow)', color: '#ef4444', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><i className="ph ph-trash"></i></button>
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
          title={editFormData.id ? 'Edit Ruangan' : 'Tambah Ruangan'}
          icon="ph-door-open"
          onClose={() => setIsEditModalOpen(false)}
          footer={(
            <>
              <button type="button" onClick={() => setIsEditModalOpen(false)} style={{ padding: '12px 20px', border: 'none', color: 'var(--color-text)', cursor: 'pointer', fontWeight: 700, transition: 'all 0.2s' }}>Batal</button>
              <button type="submit" form="ruangan-form" className="siakad-btn-primary" style={{ background: 'linear-gradient(135deg, #C41E3A 0%, #9b1c2e 100%)', color: 'white', border: 'none', boxShadow: '0 4px 12px rgba(196, 30, 58, 0.25)', padding: '12px 20px', fontWeight: 700 }}>Simpan</button>
            </>
          )}
        >
          <form id="ruangan-form" onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' , flexWrap: 'wrap'}}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Nama Ruangan</label>
              <input type="text" required value={editFormData.name} onChange={e=>setEditFormData({...editFormData, name: e.target.value})} className="siakad-input" style={{ boxShadow: 'inset 4px 4px 8px var(--inset-shadow-dark), inset -4px -4px 8px var(--inset-shadow-light)', background: 'var(--liquid-bg)', border: 'var(--inset-border)', color: 'var(--color-text)', width: '100%' }} placeholder="Contoh: Ruang Kuliah 401" />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Kode / Gedung</label>
              <input type="text" required value={editFormData.building} onChange={e=>setEditFormData({...editFormData, building: e.target.value})} className="siakad-input" style={{ boxShadow: 'inset 4px 4px 8px var(--inset-shadow-dark), inset -4px -4px 8px var(--inset-shadow-light)', background: 'var(--liquid-bg)', border: 'var(--inset-border)', color: 'var(--color-text)', width: '100%' }} placeholder="Contoh: R-401" />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Kapasitas (Kursi)</label>
              <input type="number" required value={editFormData.capacity} onChange={e=>setEditFormData({...editFormData, capacity: e.target.value})} className="siakad-input" style={{ boxShadow: 'inset 4px 4px 8px var(--inset-shadow-dark), inset -4px -4px 8px var(--inset-shadow-light)', background: 'var(--liquid-bg)', border: 'var(--inset-border)', color: 'var(--color-text)', width: '100%' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Tipe Ruangan</label>
              <CustomSelect 
                value={editFormData.type} 
                onChange={val => setEditFormData({...editFormData, type: val})} 
                options={[
                  { value: "Kelas Teori", label: "Kelas Teori" },
                  { value: "Laboratorium", label: "Laboratorium" },
                  { value: "Aula", label: "Aula" },
                  { value: "Seminar", label: "Seminar" }
                ]}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Lokasi Kampus</label>
              <CustomSelect 
                value={editFormData.campus_location || 'bintaro'} 
                onChange={val => setEditFormData({...editFormData, campus_location: val})} 
                options={[
                  { value: "bintaro", label: "Bintaro" },
                  { value: "pasar_minggu", label: "Pasar Minggu" }
                ]}
              />
            </div>
          </form>
        </ModalShell>
      )}
    </div>
  );
}
