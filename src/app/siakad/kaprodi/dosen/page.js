"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function KaprodiDosenPage() {
  const router = useRouter();
  const [dosen, setDosen] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({ id: '', name: '', nip: '', status: 'Aktif', jfa: 'Lektor' });

  useEffect(() => {
    // Simulated fetch
    setTimeout(() => {
      setDosen([
        { id: 1, name: 'Dr. Budi Santoso, S.Kom., M.Kom.', nip: '198001012005011001', status: 'Aktif', jfa: 'Lektor Kepala' },
        { id: 2, name: 'Ir. Siti Aminah, M.T.', nip: '198202022006022002', status: 'Aktif', jfa: 'Lektor' },
        { id: 3, name: 'Agus Wijaya, S.T., M.Cs.', nip: '198503032008031003', status: 'Studi Lanjut', jfa: 'Asisten Ahli' },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    if (editFormData.id) {
      setDosen(dosen.map(d => d.id === editFormData.id ? editFormData : d));
      window.toast?.('Data dosen berhasil diperbarui');
    } else {
      setDosen([...dosen, { ...editFormData, id: Date.now() }]);
      window.toast?.('Dosen baru berhasil ditambahkan');
    }
    setIsEditModalOpen(false);
  };

  const handleDelete = (id) => {
    if(confirm('Yakin ingin menghapus dosen ini dari program studi?')) {
      setDosen(dosen.filter(d => d.id !== id));
      window.toast?.('Dosen berhasil dihapus');
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
          <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(196,30,58,0.15)', filter: 'blur(40px)' }}></div>
          <div style={{ position: 'absolute', bottom: '-20px', left: '30%', width: '150px', height: '150px', borderRadius: '50%', background: 'rgba(99,102,241,0.1)', filter: 'blur(30px)' }}></div>
          <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ flex: '1 1 300px' }}>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', margin: '0 0 8px 0', letterSpacing: '0.1em', textTransform: 'uppercase' }}>SIAKAD — KAPRODI</p>
              <h1 style={{ color: 'white', fontSize: '2.2rem', fontWeight: '800', margin: '0 0 8px 0', letterSpacing: '-0.03em' }}>Manajemen Dosen</h1>
              <p style={{ color: 'rgba(255,255,255,0.6)', margin: 0 }}>Kelola profil, jabatan, dan status keaktifan dosen di program studi Anda.</p>
            </div>
            <button onClick={openAddModal} style={{ background: '#3b82f6', color: 'white', padding: '12px 24px', borderRadius: '12px', border: 'none', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)' }}>
              <i className="ph ph-user-plus" style={{ fontSize: '1.2rem' }}></i> Tambah Dosen
            </button>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '24px' }}>
        <div className="siakad-card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
            <i className="ph ph-users"></i>
          </div>
          <div>
            <p style={{ margin: 0, color: 'var(--color-muted)', fontSize: '0.9rem' }}>Total Dosen</p>
            <h3 style={{ margin: 0, fontSize: '1.5rem' }}>{dosen.length}</h3>
          </div>
        </div>
        <div className="siakad-card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
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
                  <td style={{ padding: '16px', fontWeight: 'bold', color: 'var(--color-text)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-muted)' }}>
                        <i className="ph ph-user"></i>
                      </div>
                      {d.name}
                    </div>
                  </td>
                  <td style={{ padding: '16px', color: 'var(--color-muted)' }}>{d.nip}</td>
                  <td style={{ padding: '16px' }}>{d.jfa}</td>
                  <td style={{ padding: '16px' }}>
                    <span style={{ 
                      background: d.status === 'Aktif' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)', 
                      color: d.status === 'Aktif' ? '#10b981' : '#f59e0b', 
                      padding: '4px 10px', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 'bold' 
                    }}>
                      {d.status}
                    </span>
                  </td>
                  <td style={{ padding: '16px', textAlign: 'right' }}>
                    <button onClick={() => { setEditFormData(d); setIsEditModalOpen(true); }} style={{ background: 'transparent', border: '1px solid var(--color-border)', color: '#3b82f6', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', marginRight: '8px' }}><i className="ph ph-pencil-simple"></i></button>
                    <button onClick={() => handleDelete(d.id)} style={{ background: 'transparent', border: '1px solid var(--color-border)', color: '#ef4444', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' }}><i className="ph ph-trash"></i></button>
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
              <h3 style={{ margin: 0, fontSize: '1.25rem' }}>{editFormData.id ? 'Edit Dosen' : 'Tambah Dosen'}</h3>
              <button onClick={() => setIsEditModalOpen(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--color-muted)', fontSize: '1.5rem' }}><i className="ph ph-x"></i></button>
            </div>
            <div style={{ padding: '24px' }}>
              <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
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
                    <select required value={editFormData.jfa} onChange={e=>setEditFormData({...editFormData, jfa: e.target.value})} className="siakad-input" style={{ width: '100%' }}>
                      <option value="Tenaga Pengajar">Tenaga Pengajar</option>
                      <option value="Asisten Ahli">Asisten Ahli</option>
                      <option value="Lektor">Lektor</option>
                      <option value="Lektor Kepala">Lektor Kepala</option>
                      <option value="Guru Besar">Guru Besar</option>
                    </select>
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Status Keaktifan</label>
                    <select required value={editFormData.status} onChange={e=>setEditFormData({...editFormData, status: e.target.value})} className="siakad-input" style={{ width: '100%' }}>
                      <option value="Aktif">Aktif</option>
                      <option value="Cuti">Cuti</option>
                      <option value="Studi Lanjut">Studi Lanjut</option>
                      <option value="Nonaktif">Nonaktif</option>
                    </select>
                  </div>
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
