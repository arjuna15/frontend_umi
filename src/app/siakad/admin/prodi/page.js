"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminProdiPage() {
  const router = useRouter();
  const [prodis, setProdis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({ id: '', code: '', name: '', fakultas: '', akreditasi: '' });

  useEffect(() => {
    // Simulated fetch
    setTimeout(() => {
      setProdis([
        { id: 1, code: 'SI', name: 'Sistem Informasi', fakultas: 'Fakultas Ilmu Komputer', akreditasi: 'B' },
        { id: 2, code: 'TI', name: 'Teknik Informatika', fakultas: 'Fakultas Ilmu Komputer', akreditasi: 'B' },
        { id: 3, code: 'MN', name: 'Manajemen', fakultas: 'Fakultas Ekonomi dan Bisnis', akreditasi: 'A' },
        { id: 4, code: 'AK', name: 'Akuntansi', fakultas: 'Fakultas Ekonomi dan Bisnis', akreditasi: 'A' },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    if (editFormData.id) {
      setProdis(prodis.map(p => p.id === editFormData.id ? editFormData : p));
      window.toast?.('Prodi berhasil diperbarui');
    } else {
      setProdis([...prodis, { ...editFormData, id: Date.now() }]);
      window.toast?.('Prodi berhasil ditambahkan');
    }
    setIsEditModalOpen(false);
  };

  const handleDelete = (id) => {
    if(confirm('Yakin ingin menghapus prodi ini?')) {
      setProdis(prodis.filter(p => p.id !== id));
      window.toast?.('Prodi berhasil dihapus');
    }
  };

  const openAddModal = () => {
    setEditFormData({ id: '', code: '', name: '', fakultas: '', akreditasi: '' });
    setIsEditModalOpen(true);
  };

  if (loading) return <div style={{ padding: '20px' }}>Loading...</div>;

  return (
    <div className="fade-in" style={{ paddingBottom: '40px' }}>
      <div style={{ marginBottom: '32px' }}>
        <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #4c0519 100%)', borderRadius: '24px', padding: '40px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(196,30,58,0.15)', filter: 'blur(40px)' }}></div>
          <div style={{ position: 'absolute', bottom: '-20px', left: '30%', width: '150px', height: '150px', borderRadius: '50%', background: 'rgba(99,102,241,0.1)', filter: 'blur(30px)' }}></div>
          <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ flex: '1 1 300px' }}>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', margin: '0 0 8px 0', letterSpacing: '0.1em', textTransform: 'uppercase' }}>SIAKAD — ADMIN</p>
              <h1 style={{ color: 'white', fontSize: '2.2rem', fontWeight: '800', margin: '0 0 8px 0', letterSpacing: '-0.03em' }}>Manajemen Program Studi</h1>
              <p style={{ color: 'rgba(255,255,255,0.6)', margin: 0 }}>Kelola daftar Fakultas dan Program Studi di universitas.</p>
            </div>
            <button onClick={openAddModal} style={{ background: '#3b82f6', color: 'white', padding: '12px 24px', borderRadius: '12px', border: 'none', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)' }}>
              <i className="ph ph-plus-circle" style={{ fontSize: '1.2rem' }}></i> Tambah Prodi
            </button>
          </div>
        </div>
      </div>

      <div className="siakad-card" style={{ padding: '24px' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="siakad-table" style={{ width: '100%', minWidth: '800px', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'var(--glass-bg)', color: 'var(--color-muted)', borderBottom: '1px solid var(--color-border)', textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '0.05em' }}>
                <th style={{ padding: '16px' }}>Kode</th>
                <th style={{ padding: '16px' }}>Program Studi</th>
                <th style={{ padding: '16px' }}>Fakultas</th>
                <th style={{ padding: '16px' }}>Akreditasi</th>
                <th style={{ padding: '16px', textAlign: 'right' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {prodis.map((p) => (
                <tr key={p.id} style={{ borderBottom: '1px solid var(--color-border)', transition: 'all 0.2s' }} onMouseEnter={(e)=>e.currentTarget.style.background='var(--glass-bg)'} onMouseLeave={(e)=>e.currentTarget.style.background='transparent'}>
                  <td style={{ padding: '16px', fontWeight: '600' }}>{p.code}</td>
                  <td style={{ padding: '16px', fontWeight: 'bold', color: 'var(--color-text)' }}>{p.name}</td>
                  <td style={{ padding: '16px', color: 'var(--color-muted)' }}>{p.fakultas}</td>
                  <td style={{ padding: '16px' }}>
                    <span style={{ background: p.akreditasi === 'A' ? '#10b981' : '#f59e0b', color: 'white', padding: '4px 10px', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 'bold' }}>{p.akreditasi}</span>
                  </td>
                  <td style={{ padding: '16px', textAlign: 'right' }}>
                    <button onClick={() => { setEditFormData(p); setIsEditModalOpen(true); }} style={{ background: 'transparent', border: '1px solid var(--color-border)', color: '#3b82f6', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', marginRight: '8px' }}><i className="ph ph-pencil-simple"></i></button>
                    <button onClick={() => handleDelete(p.id)} style={{ background: 'transparent', border: '1px solid var(--color-border)', color: '#ef4444', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' }}><i className="ph ph-trash"></i></button>
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
              <h3 style={{ margin: 0, fontSize: '1.25rem' }}>{editFormData.id ? 'Edit Prodi' : 'Tambah Prodi'}</h3>
              <button onClick={() => setIsEditModalOpen(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--color-muted)', fontSize: '1.5rem' }}><i className="ph ph-x"></i></button>
            </div>
            <div style={{ padding: '24px' }}>
              <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Kode Prodi</label>
                  <input type="text" required value={editFormData.code} onChange={e=>setEditFormData({...editFormData, code: e.target.value})} className="siakad-input" style={{ width: '100%' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Nama Prodi</label>
                  <input type="text" required value={editFormData.name} onChange={e=>setEditFormData({...editFormData, name: e.target.value})} className="siakad-input" style={{ width: '100%' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Fakultas</label>
                  <input type="text" required value={editFormData.fakultas} onChange={e=>setEditFormData({...editFormData, fakultas: e.target.value})} className="siakad-input" style={{ width: '100%' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Akreditasi</label>
                  <select value={editFormData.akreditasi} onChange={e=>setEditFormData({...editFormData, akreditasi: e.target.value})} className="siakad-input" style={{ width: '100%' }}>
                    <option value="Unggul">Unggul</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="Baik Sekali">Baik Sekali</option>
                    <option value="Baik">Baik</option>
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
