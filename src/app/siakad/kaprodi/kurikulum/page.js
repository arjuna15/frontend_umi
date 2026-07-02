"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CustomSelect from '../../components/CustomSelect';

export default function KaprodiKurikulumPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({ id: '', code: '', name: '', sks: '', semester: '1', type: 'Wajib' });

  useEffect(() => {
    setTimeout(() => {
      setCourses([
        { id: 1, code: 'COMP101', name: 'Algoritma & Pemrograman', sks: 3, semester: '1', type: 'Wajib' },
        { id: 2, code: 'COMP102', name: 'Struktur Data', sks: 3, semester: '2', type: 'Wajib' },
        { id: 3, code: 'COMP201', name: 'Basis Data', sks: 3, semester: '3', type: 'Wajib' },
        { id: 4, code: 'ELEC301', name: 'Kecerdasan Buatan', sks: 3, semester: '5', type: 'Pilihan' },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    if (editFormData.id) {
      setCourses(courses.map(c => c.id === editFormData.id ? editFormData : c));
      window.toast?.('Mata kuliah berhasil diperbarui');
    } else {
      setCourses([...courses, { ...editFormData, id: Date.now() }]);
      window.toast?.('Mata kuliah berhasil ditambahkan ke kurikulum');
    }
    setIsEditModalOpen(false);
  };

  const handleDelete = (id) => {
    if(confirm('Yakin ingin menghapus mata kuliah dari kurikulum?')) {
      setCourses(courses.filter(c => c.id !== id));
      window.toast?.('Mata kuliah dihapus');
    }
  };

  const openAddModal = () => {
    setEditFormData({ id: '', code: '', name: '', sks: '', semester: '1', type: 'Wajib' });
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
              <h1 style={{ color: 'white', fontSize: '2.2rem', fontWeight: '800', margin: '0 0 8px 0', letterSpacing: '-0.03em' }}>Manajemen Kurikulum</h1>
              <p style={{ color: 'rgba(255,255,255,0.6)', margin: 0 }}>Kelola struktur mata kuliah dan sebaran SKS per semester.</p>
            </div>
            <button onClick={openAddModal} style={{ background: '#3b82f6', color: 'white', padding: '12px 24px', borderRadius: '12px', border: 'none', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)' , flexWrap: 'wrap'}}>
              <i className="ph ph-plus-circle" style={{ fontSize: '1.2rem' }}></i> Tambah MK
            </button>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '24px' }}>
        <div className="siakad-card" style={{ padding: '24px', borderLeft: '4px solid #3b82f6' }}>
          <p style={{ margin: '0 0 8px 0', color: 'var(--color-muted)', fontSize: '0.9rem' }}>Total Mata Kuliah</p>
          <h2 style={{ margin: 0, fontSize: '1.8rem' }}>{courses.length}</h2>
        </div>
        <div className="siakad-card" style={{ padding: '24px', borderLeft: '4px solid #10b981' }}>
          <p style={{ margin: '0 0 8px 0', color: 'var(--color-muted)', fontSize: '0.9rem' }}>Total SKS Kurikulum</p>
          <h2 style={{ margin: 0, fontSize: '1.8rem' }}>{courses.reduce((acc, c) => acc + parseInt(c.sks), 0)} SKS</h2>
        </div>
      </div>

      <div className="siakad-card" style={{ padding: '24px' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="siakad-table" style={{ width: '100%', minWidth: '800px', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'var(--glass-bg)', color: 'var(--color-muted)', borderBottom: '1px solid var(--color-border)', textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '0.05em' }}>
                <th style={{ padding: '16px' }}>Semester</th>
                <th style={{ padding: '16px' }}>Kode</th>
                <th style={{ padding: '16px' }}>Mata Kuliah</th>
                <th style={{ padding: '16px' }}>SKS</th>
                <th style={{ padding: '16px' }}>Sifat</th>
                <th style={{ padding: '16px', textAlign: 'right' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {courses.sort((a,b) => a.semester - b.semester).map((c) => (
                <tr key={c.id} style={{ borderBottom: '1px solid var(--color-border)', transition: 'all 0.2s' }} onMouseEnter={(e)=>e.currentTarget.style.background='var(--glass-bg)'} onMouseLeave={(e)=>e.currentTarget.style.background='transparent'}>
                  <td style={{ padding: '16px', fontWeight: 'bold' }}>Semester {c.semester}</td>
                  <td style={{ padding: '16px', color: 'var(--color-muted)' }}>{c.code}</td>
                  <td style={{ padding: '16px', fontWeight: 'bold', color: 'var(--color-text)' }}>{c.name}</td>
                  <td style={{ padding: '16px' }}>{c.sks} SKS</td>
                  <td style={{ padding: '16px' }}>
                    <span className="siakad-badge" style={{ background: c.type === 'Wajib' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(245, 158, 11, 0.1)', color: c.type === 'Wajib' ? '#3b82f6' : '#f59e0b' }}>{c.type}</span>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', flexWrap: 'nowrap' }}>
                      <button onClick={() => { setEditFormData(c); setIsEditModalOpen(true); }} style={{ background: 'transparent', border: '1px solid var(--color-border)', color: '#3b82f6', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', flexShrink: 0 }}><i className="ph ph-pencil-simple"></i></button>
                      <button onClick={() => handleDelete(c.id)} style={{ background: 'transparent', border: '1px solid var(--color-border)', color: '#ef4444', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', flexShrink: 0 }}><i className="ph ph-trash"></i></button>
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
              <h3 style={{ margin: 0, fontSize: '1.25rem' }}>{editFormData.id ? 'Edit Mata Kuliah' : 'Tambah Mata Kuliah'}</h3>
              <button onClick={() => setIsEditModalOpen(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--color-muted)', fontSize: '1.5rem' }}><i className="ph ph-x"></i></button>
            </div>
            <div style={{ padding: '24px' }}>
              <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' , flexWrap: 'wrap'}}>
                <div style={{ display: 'flex', gap: '16px' , flexWrap: 'wrap' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Kode MK</label>
                    <input type="text" required value={editFormData.code} onChange={e=>setEditFormData({...editFormData, code: e.target.value})} className="siakad-input" style={{ width: '100%' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>SKS</label>
                    <input type="number" required min="1" max="6" value={editFormData.sks} onChange={e=>setEditFormData({...editFormData, sks: e.target.value})} className="siakad-input" style={{ width: '100%' }} />
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Nama Mata Kuliah</label>
                  <input type="text" required value={editFormData.name} onChange={e=>setEditFormData({...editFormData, name: e.target.value})} className="siakad-input" style={{ width: '100%' }} />
                </div>
                <div style={{ display: 'flex', gap: '16px' , flexWrap: 'wrap' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Semester Sebaran</label>
                    <CustomSelect 
                      value={editFormData.semester} 
                      onChange={val => setEditFormData({...editFormData, semester: val})} 
                      options={[1,2,3,4,5,6,7,8].map(s => ({ value: s.toString(), label: `Semester ${s}` }))}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Sifat</label>
                    <CustomSelect 
                      value={editFormData.type} 
                      onChange={val => setEditFormData({...editFormData, type: val})} 
                      options={[
                        { value: "Wajib", label: "Wajib" },
                        { value: "Pilihan", label: "Pilihan" }
                      ]}
                    />
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' , flexWrap: 'wrap'}}>
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
