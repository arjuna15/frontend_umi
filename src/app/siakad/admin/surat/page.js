'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CustomSelect from '../../components/CustomSelect';
import ModalShell from '../../components/ModalShell';

export default function AdminSuratPage() {
  const router = useRouter();
  const [letters, setLetters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [selectedLetter, setSelectedLetter] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ status: 'Pending', note: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const token = localStorage.getItem('siakad_token');
    if (!token) return router.push('/siakad/login');

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
    try {
      const res = await fetch(`${apiUrl}/siakad/admin/letters`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setLetters(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenEdit = (letter) => {
    setSelectedLetter(letter);
    setFormData({
      status: letter.status || 'Pending',
      note: letter.note || ''
    });
    setIsModalOpen(true);
  };

  const handleSaveStatus = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('siakad_token');
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

    try {
      const res = await fetch(`${apiUrl}/siakad/admin/letters/${selectedLetter.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        window.toast?.('Status surat berhasil diperbarui!');
        setIsModalOpen(false);
        fetchData();
      } else {
        window.toast?.('Gagal memperbarui status surat');
      }
    } catch (err) {
      console.error(err);
      window.toast?.('Terjadi kesalahan: ' + err.message);
    }
  };

  // Helper stats calculation
  const stats = letters.reduce((acc, curr) => {
    acc.total += 1;
    if (curr.status === 'Pending') acc.pending += 1;
    if (curr.status === 'Diproses') acc.processing += 1;
    if (curr.status === 'Selesai') acc.done += 1;
    return acc;
  }, { total: 0, pending: 0, processing: 0, done: 0 });

  if (loading) return <div style={{ padding: '20px', color: 'var(--color-text)' }}>Loading...</div>;

  return (
    <div className="fade-in" style={{ paddingBottom: '40px' }}>
      
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <div className="siakad-page-header">
          <div className="siakad-page-header-glow"></div>
          <div className="siakad-page-header-grid"></div>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', margin: '0 0 8px 0', letterSpacing: '0.1em', textTransform: 'uppercase' }}>SIAKAD — ADMIN</p>
            <h1 style={{ color: 'white', fontSize: '2.2rem', fontWeight: '800', margin: '0 0 8px 0', letterSpacing: '-0.03em' }}>Manajemen Pengajuan Surat</h1>
            <p style={{ color: 'rgba(255,255,255,0.6)', margin: 0 }}>Kelola dan proses pengajuan surat administrasi dari mahasiswa.</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        <div className="siakad-card stagger-1" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ borderRadius: '50%', boxShadow: 'inset 4px 4px 8px var(--inset-shadow-dark), inset -4px -4px 8px var(--inset-shadow-light)', background: 'var(--liquid-bg)', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
            <i className="ph ph-envelope"></i>
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--color-muted)' }}>Total Pengajuan</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 'bold', color: 'var(--color-text)' }}>{stats.total}</div>
          </div>
        </div>

        <div className="siakad-card stagger-2" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ borderRadius: '50%', boxShadow: 'inset 4px 4px 8px var(--inset-shadow-dark), inset -4px -4px 8px var(--inset-shadow-light)', background: 'var(--liquid-bg)', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
            <i className="ph ph-clock"></i>
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--color-muted)' }}>Menunggu</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 'bold', color: 'var(--color-text)' }}>{stats.pending}</div>
          </div>
        </div>

        <div className="siakad-card stagger-3" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ borderRadius: '50%', boxShadow: 'inset 4px 4px 8px var(--inset-shadow-dark), inset -4px -4px 8px var(--inset-shadow-light)', background: 'var(--liquid-bg)', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
            <i className="ph ph-spinner-gap"></i>
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--color-muted)' }}>Diproses</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 'bold', color: 'var(--color-text)' }}>{stats.processing}</div>
          </div>
        </div>

        <div className="siakad-card stagger-4" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ borderRadius: '50%', boxShadow: 'inset 4px 4px 8px var(--inset-shadow-dark), inset -4px -4px 8px var(--inset-shadow-light)', background: 'var(--liquid-bg)', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
            <i className="ph ph-check-circle"></i>
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--color-muted)' }}>Selesai</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 'bold', color: 'var(--color-text)' }}>{stats.done}</div>
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="siakad-card stagger-2" style={{ padding: '0px', overflow: 'hidden' }}>
        
        {/* Table Search Header */}
        <div style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', borderBottom: '1px solid var(--color-border)' }}>
          <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--color-text)', fontWeight: 'bold' }}>Daftar Pengajuan Surat</h3>
          <div style={{ position: 'relative', width: '300px' }}>
            <i className="ph ph-magnifying-glass" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-muted)', fontSize: '1.1rem' }}></i>
            <input 
              type="text" 
              className="siakad-input"
              placeholder="Cari nama, NIM, tipe surat..." 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)} 
              style={{ boxShadow: 'inset 4px 4px 8px var(--inset-shadow-dark), inset -4px -4px 8px var(--inset-shadow-light)', background: 'var(--liquid-bg)', border: 'var(--inset-border)', color: 'var(--color-text)', width: '100%', paddingLeft: '46px',  fontSize: '0.9rem' }} 
            />
          </div>
        </div>

        {/* Table Body */}
        <div style={{ overflowX: 'auto' }}>
          <table className="siakad-table" style={{ width: '100%', minWidth: '800px', borderCollapse: 'separate', borderSpacing: '0 12px', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'var(--glass-bg)', color: 'var(--color-muted)', borderBottom: '1px solid var(--color-border)', textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '0.05em' }}>
                <th style={{ padding: '16px' }}>Tanggal</th>
                <th style={{ padding: '16px' }}>Mahasiswa</th>
                <th style={{ padding: '16px' }}>Jenis Surat</th>
                <th style={{ padding: '16px' }}>Status</th>
                <th style={{ padding: '16px' }}>Catatan Admin</th>
                <th style={{ padding: '16px', textAlign: 'right' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {(() => {
                const filtered = letters.filter(l => {
                  const query = searchQuery.toLowerCase().trim();
                  if (!query) return true;
                  return (
                    l.type?.toLowerCase().includes(query) ||
                    l.status?.toLowerCase().includes(query) ||
                    l.note?.toLowerCase().includes(query) ||
                    l.mahasiswa?.name?.toLowerCase().includes(query) ||
                    l.mahasiswa?.nim_nip?.toLowerCase().includes(query)
                  );
                });

                if (filtered.length === 0) {
                  return (
                    <tr>
                      <td colSpan="6" style={{ padding: '32px', textAlign: 'center', color: 'var(--color-muted)' }}>Tidak ada data pengajuan surat.</td>
                    </tr>
                  );
                }

                return filtered.map((l) => (
                  <tr key={l.id} style={{ borderBottom: '1px solid var(--color-border)', transition: 'all 0.2s' }} onMouseEnter={(e)=>e.currentTarget.style.background='var(--glass-bg)'} onMouseLeave={(e)=>e.currentTarget.style.background='transparent'}>
                    <td style={{ padding: '16px', color: 'var(--color-muted)' }}>
                      {new Date(l.created_at || l.created_date || Date.now()).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td style={{ padding: '16px' }}>
                      <div style={{ fontWeight: 'bold', color: 'var(--color-text)' }}>{l.mahasiswa?.name || 'Mahasiswa'}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--color-muted)' }}>NIM: {l.mahasiswa?.nim_nip}</div>
                    </td>
                    <td style={{ padding: '16px', color: 'var(--color-text)', fontWeight: '500' }}>{l.type}</td>
                    <td style={{ padding: '16px' }}>
                      <span className="siakad-badge" style={{ 
                        color: l.status === 'Selesai' ? '#10b981' : l.status === 'Diproses' ? '#3b82f6' : '#f59e0b'
                      }}>{l.status}</span>
                    </td>
                    <td style={{ padding: '16px', color: 'var(--color-muted)', fontSize: '0.85rem' }}>
                      {l.note || <span style={{ fontStyle: 'italic' }}>Tidak ada catatan</span>}
                    </td>
                    <td style={{ padding: '16px', textAlign: 'right' }}>
                      <button 
                        onClick={() => handleOpenEdit(l)} 
                        style={{ background: 'transparent', border: '1px solid var(--color-border)', color: '#3b82f6', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'semibold' }}
                      >
                        Proses <i className="ph ph-arrow-square-out" style={{ marginLeft: '4px' }}></i>
                      </button>
                    </td>
                  </tr>
                ));
              })()}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Status Modal */}
      {isModalOpen && (
        <ModalShell
          title="Proses Pengajuan Surat"
          icon="ph-envelope-simple"
          onClose={() => setIsModalOpen(false)}
          footer={(
            <>
              <button type="button" onClick={() => setIsModalOpen(false)} style={{ padding: '12px 20px', border: 'none', color: 'var(--color-text)', cursor: 'pointer', fontWeight: 700, transition: 'all 0.2s' }}>Batal</button>
              <button type="submit" form="status-form" className="siakad-btn-primary" style={{ background: 'linear-gradient(135deg, #C41E3A 0%, #9b1c2e 100%)', color: 'white', border: 'none', boxShadow: '0 4px 12px rgba(196, 30, 58, 0.25)', padding: '12px 20px', fontWeight: 700 }}>Simpan Perubahan</button>
            </>
          )}
        >
          <form id="status-form" onSubmit={handleSaveStatus} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Mahasiswa</label>
              <input type="text" disabled value={`${selectedLetter?.mahasiswa?.name} (${selectedLetter?.mahasiswa?.nim_nip})`} className="siakad-input" style={{ boxShadow: 'inset 4px 4px 8px var(--inset-shadow-dark), inset -4px -4px 8px var(--inset-shadow-light)', background: 'var(--liquid-bg)', border: 'var(--inset-border)', color: 'var(--color-text)', width: '100%', opacity: 0.7, cursor: 'not-allowed' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Jenis Surat</label>
              <input type="text" disabled value={selectedLetter?.type} className="siakad-input" style={{ boxShadow: 'inset 4px 4px 8px var(--inset-shadow-dark), inset -4px -4px 8px var(--inset-shadow-light)', background: 'var(--liquid-bg)', border: 'var(--inset-border)', color: 'var(--color-text)', width: '100%', opacity: 0.7, cursor: 'not-allowed' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Ubah Status Surat</label>
              <CustomSelect 
                value={formData.status} 
                onChange={val => setFormData({...formData, status: val})} 
                options={[
                  { value: "Pending", label: "Pending (Menunggu)" },
                  { value: "Diproses", label: "Diproses" },
                  { value: "Selesai", label: "Selesai (Siap Diambil/Kirim)" }
                ]}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Catatan Admin / Keterangan</label>
              <textarea 
                value={formData.note} 
                onChange={e=>setFormData({...formData, note: e.target.value})} 
                className="siakad-input" 
                style={{ boxShadow: 'inset 4px 4px 8px var(--inset-shadow-dark), inset -4px -4px 8px var(--inset-shadow-light)', background: 'var(--liquid-bg)', border: 'var(--inset-border)', color: 'var(--color-text)', width: '100%', minHeight: '100px', resize: 'vertical' }} 
                placeholder="Masukkan keterangan (misal: 'Silakan ambil di loket' atau 'Ditolak karena berkas kurang')"
              />
            </div>
          </form>
        </ModalShell>
      )}
    </div>
  );
}
