"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminRuanganPage() {
  const router = useRouter();
  const [ruangan, setRuangan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({ id: '', name: '', capacity: '', building: '', type: 'Teori' });

  useEffect(() => {
    // Simulated fetch
    setTimeout(() => {
      setRuangan([
        { id: 1, name: 'Ruang A.101', capacity: 40, building: 'Gedung A', type: 'Teori' },
        { id: 2, name: 'Ruang A.102', capacity: 45, building: 'Gedung A', type: 'Teori' },
        { id: 3, name: 'Lab Komputer 1', capacity: 30, building: 'Gedung B', type: 'Praktikum' },
        { id: 4, name: 'Lab Komputer 2', capacity: 30, building: 'Gedung B', type: 'Praktikum' },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    if (editFormData.id) {
      setRuangan(ruangan.map(r => r.id === editFormData.id ? editFormData : r));
      window.toast?.('Ruangan berhasil diperbarui');
    } else {
      setRuangan([...ruangan, { ...editFormData, id: Date.now() }]);
      window.toast?.('Ruangan berhasil ditambahkan');
    }
    setIsEditModalOpen(false);
  };

  const handleDelete = (id) => {
    if(confirm('Yakin ingin menghapus ruangan ini?')) {
      setRuangan(ruangan.filter(r => r.id !== id));
      window.toast?.('Ruangan berhasil dihapus');
    }
  };

  const openAddModal = () => {
    setEditFormData({ id: '', name: '', capacity: '', building: '', type: 'Teori' });
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
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', margin: '0 0 8px 0', letterSpacing: '0.1em', textTransform: 'uppercase' }}>SIAKAD — ADMIN</p>
              <h1 style={{ color: 'white', fontSize: '2.2rem', fontWeight: '800', margin: '0 0 8px 0', letterSpacing: '-0.03em' }}>Manajemen Ruangan</h1>
              <p style={{ color: 'rgba(255,255,255,0.6)', margin: 0 }}>Kelola daftar ruangan kelas dan laboratorium untuk perkuliahan.</p>
            </div>
            <button onClick={openAddModal} style={{ background: '#3b82f6', color: 'white', padding: '12px 24px', borderRadius: '12px', border: 'none', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)' }}>
              <i className="ph ph-plus-circle" style={{ fontSize: '1.2rem' }}></i> Tambah Ruangan
            </button>
          </div>
        </div>
      </div>

      <div className="siakad-card" style={{ padding: '24px' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="siakad-table" style={{ width: '100%', minWidth: '800px', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'var(--glass-bg)', color: 'var(--color-muted)', borderBottom: '1px solid var(--color-border)', textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '0.05em' }}>
                <th style={{ padding: '16px' }}>Nama Ruangan</th>
                <th style={{ padding: '16px' }}>Gedung</th>
                <th style={{ padding: '16px' }}>Kapasitas</th>
                <th style={{ padding: '16px' }}>Tipe</th>
                <th style={{ padding: '16px', textAlign: 'right' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {ruangan.map((r) => (
                <tr key={r.id} style={{ borderBottom: '1px solid var(--color-border)', transition: 'all 0.2s' }} onMouseEnter={(e)=>e.currentTarget.style.background='var(--glass-bg)'} onMouseLeave={(e)=>e.currentTarget.style.background='transparent'}>
                  <td style={{ padding: '16px', fontWeight: 'bold', color: 'var(--color-text)' }}>{r.name}</td>
                  <td style={{ padding: '16px', color: 'var(--color-muted)' }}>{r.building}</td>
                  <td style={{ padding: '16px' }}>{r.capacity} Kursi</td>
                  <td style={{ padding: '16px' }}>
                    <span style={{ background: r.type === 'Teori' ? '#3b82f6' : '#8b5cf6', color: 'white', padding: '4px 10px', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 'bold' }}>{r.type}</span>
                  </td>
                  <td style={{ padding: '16px', textAlign: 'right' }}>
                    <button onClick={() => { setEditFormData(r); setIsEditModalOpen(true); }} style={{ background: 'transparent', border: '1px solid var(--color-border)', color: '#3b82f6', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', marginRight: '8px' }}><i className="ph ph-pencil-simple"></i></button>
                    <button onClick={() => handleDelete(r.id)} style={{ background: 'transparent', border: '1px solid var(--color-border)', color: '#ef4444', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' }}><i className="ph ph-trash"></i></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isEditModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div className="fade-in" style={{ background: 'var(--color-bg)', borderRadius: '24px', width: '100%', maxWidth: '500px', border: '1px solid var(--color-border)', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', overflow: 'hidden' }}>
            <div style={{ padding: '24px', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' , flexWrap: 'wrap' }}>
              <h3 style={{ margin: 0, fontSize: '1.25rem' }}>{editFormData.id ? 'Edit Ruangan' : 'Tambah Ruangan'}</h3>
              <button onClick={() => setIsEditModalOpen(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--color-muted)', fontSize: '1.5rem' }}><i className="ph ph-x"></i></button>
            </div>
            <div style={{ padding: '24px' }}>
              <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Nama Ruangan</label>
                  <input type="text" required value={editFormData.name} onChange={e=>setEditFormData({...editFormData, name: e.target.value})} className="siakad-input" style={{ width: '100%' }} placeholder="Contoh: Ruang A.101" />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Gedung</label>
                  <input type="text" required value={editFormData.building} onChange={e=>setEditFormData({...editFormData, building: e.target.value})} className="siakad-input" style={{ width: '100%' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Kapasitas (Kursi)</label>
                  <input type="number" required value={editFormData.capacity} onChange={e=>setEditFormData({...editFormData, capacity: e.target.value})} className="siakad-input" style={{ width: '100%' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Tipe Ruangan</label>
                  <select value={editFormData.type} onChange={e=>setEditFormData({...editFormData, type: e.target.value})} className="siakad-input" style={{ width: '100%' }}>
                    <option value="Teori">Kelas Teori</option>
                    <option value="Praktikum">Laboratorium / Praktikum</option>
                    <option value="Studio">Studio</option>
                  </select>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
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
