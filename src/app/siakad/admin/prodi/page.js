"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CustomSelect from '../../components/CustomSelect';
import ModalShell from '../../components/ModalShell';

export default function AdminProdiPage() {
  const router = useRouter();
  const [prodis, setProdis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({ id: '', code: '', name: '', kaprodi: '', jenjang: 'S1' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const token = localStorage.getItem('siakad_token');
    if (!token) return router.push('/siakad/login');

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
    try {
      const res = await fetch(`${apiUrl}/siakad/admin/prodis`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setProdis(data);
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
      code: editFormData.code,
      name: editFormData.name,
      kaprodi: editFormData.kaprodi,
      jenjang: editFormData.jenjang
    };

    try {
      let res;
      if (editFormData.id) {
        res = await fetch(`${apiUrl}/siakad/admin/prodis/${editFormData.id}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });
      } else {
        res = await fetch(`${apiUrl}/siakad/admin/prodis`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });
      }

      if (res.ok) {
        window.toast?.(editFormData.id ? 'Prodi berhasil diperbarui' : 'Prodi berhasil ditambahkan');
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
    if (confirm('Yakin ingin menghapus prodi ini?')) {
      const token = localStorage.getItem('siakad_token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
      try {
        const res = await fetch(`${apiUrl}/siakad/admin/prodis/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          window.toast?.('Prodi berhasil dihapus');
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
    setEditFormData({ id: '', code: '', name: '', kaprodi: '', jenjang: 'S1' });
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
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', margin: '0 0 8px 0', letterSpacing: '0.1em', textTransform: 'uppercase' }}>SIAKAD — ADMIN</p>
              <h1 style={{ color: 'white', fontSize: '2.2rem', fontWeight: '800', margin: '0 0 8px 0', letterSpacing: '-0.03em' }}>Manajemen Program Studi</h1>
              <p style={{ color: 'rgba(255,255,255,0.6)', margin: 0 }}>Kelola daftar Program Studi dan Ketua Program Studi (Kaprodi).</p>
            </div>
            <button onClick={openAddModal} style={{ background: '#3b82f6', color: 'white', padding: '12px 24px', borderRadius: '12px', border: 'none', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)' , flexWrap: 'wrap'}}>
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
                <th style={{ padding: '16px' }}>Ketua Program Studi (Kaprodi)</th>
                <th style={{ padding: '16px' }}>Jenjang</th>
                <th style={{ padding: '16px', textAlign: 'right' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {prodis.map((p) => (
                <tr key={p.id} style={{ borderBottom: '1px solid var(--color-border)', transition: 'all 0.2s' }} onMouseEnter={(e)=>e.currentTarget.style.background='var(--glass-bg)'} onMouseLeave={(e)=>e.currentTarget.style.background='transparent'}>
                  <td style={{ padding: '16px', fontWeight: '600' }}>{p.code}</td>
                  <td style={{ padding: '16px', fontWeight: 'bold', color: 'var(--color-text)' }}>{p.name}</td>
                  <td style={{ padding: '16px', color: 'var(--color-muted)' }}>{p.kaprodi}</td>
                  <td style={{ padding: '16px' }}>
                    <span style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', padding: '4px 10px', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 'bold' }}>{p.jenjang}</span>
                  </td>
                  <td style={{ padding: '16px', textAlign: 'right' }}>
                    <button onClick={() => { setEditFormData(p); setIsEditModalOpen(true); }} style={{ background: 'transparent', border: '1px solid var(--color-border)', color: '#3b82f6', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', marginRight: '8px' }}><i className="ph ph-pencil-simple"></i></button>
                    <button onClick={() => handleDelete(p.id)} style={{ background: 'transparent', border: '1px solid var(--color-border)', color: '#ef4444', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' }}><i className="ph ph-trash"></i></button>
                  </td>
                </tr>
              ))}
              {prodis.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ padding: '32px', textAlign: 'center', color: 'var(--color-muted)' }}>Belum ada daftar program studi.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isEditModalOpen && (
        <ModalShell
          title={editFormData.id ? 'Edit Prodi' : 'Tambah Prodi'}
          icon="ph-buildings"
          onClose={() => setIsEditModalOpen(false)}
          footer={(
            <>
              <button type="button" onClick={() => setIsEditModalOpen(false)} style={{ padding: '12px 20px', borderRadius: '12px', border: '1px solid var(--color-border)', background: 'transparent', color: 'var(--color-text)', cursor: 'pointer', fontWeight: 700 }}>Batal</button>
              <button type="submit" form="prodi-form" style={{ padding: '12px 20px', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)', color: 'white', cursor: 'pointer', fontWeight: 700 }}>Simpan</button>
            </>
          )}
        >
          <form id="prodi-form" onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' , flexWrap: 'wrap'}}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Kode Prodi</label>
              <input type="text" required value={editFormData.code} onChange={e=>setEditFormData({...editFormData, code: e.target.value})} className="siakad-input" style={{ width: '100%' }} placeholder="Contoh: TK" />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Nama Prodi</label>
              <input type="text" required value={editFormData.name} onChange={e=>setEditFormData({...editFormData, name: e.target.value})} className="siakad-input" style={{ width: '100%' }} placeholder="Contoh: Teknik Komputer" />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Ketua Program Studi (Kaprodi)</label>
              <input type="text" required value={editFormData.kaprodi} onChange={e=>setEditFormData({...editFormData, kaprodi: e.target.value})} className="siakad-input" style={{ width: '100%' }} placeholder="Contoh: Nama kaprodi" />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Jenjang</label>
              <CustomSelect 
                value={editFormData.jenjang} 
                onChange={val => setEditFormData({...editFormData, jenjang: val})} 
                options={[
                  { value: "D3", label: "Diploma 3 (D3)" },
                  { value: "D4", label: "Diploma 4 (D4)" },
                  { value: "S1", label: "Sarjana (S1)" },
                  { value: "S2", label: "Magister (S2)" },
                  { value: "S3", label: "Doktor (S3)" }
                ]}
              />
            </div>
          </form>
        </ModalShell>
      )}
    </div>
  );
}
