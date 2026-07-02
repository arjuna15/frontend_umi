"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CustomSelect from '../../components/CustomSelect';

export default function KaprodiKalenderPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({ id: '', name: '', startDate: '', endDate: '', type: 'Akademik' });

  useEffect(() => {
    setTimeout(() => {
      setEvents([
        { id: 1, name: 'Masa Pengisian KRS', startDate: '2026-08-01', endDate: '2026-08-14', type: 'Akademik' },
        { id: 2, name: 'Batas Akhir Batal Tambah KRS', startDate: '2026-08-15', endDate: '2026-08-20', type: 'Akademik' },
        { id: 3, name: 'Ujian Tengah Semester (UTS)', startDate: '2026-10-10', endDate: '2026-10-24', type: 'Ujian' },
        { id: 4, name: 'Ujian Akhir Semester (UAS)', startDate: '2026-12-15', endDate: '2026-12-30', type: 'Ujian' },
        { id: 5, name: 'Batas Input Nilai Dosen', startDate: '2027-01-02', endDate: '2027-01-10', type: 'Dosen' },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    if (editFormData.id) {
      setEvents(events.map(ev => ev.id === editFormData.id ? editFormData : ev));
      window.toast?.('Jadwal berhasil diperbarui');
    } else {
      setEvents([...events, { ...editFormData, id: Date.now() }]);
      window.toast?.('Jadwal baru berhasil ditambahkan');
    }
    setIsEditModalOpen(false);
  };

  const handleDelete = (id) => {
    if(confirm('Yakin ingin menghapus jadwal ini?')) {
      setEvents(events.filter(ev => ev.id !== id));
      window.toast?.('Jadwal dihapus');
    }
  };

  const openAddModal = () => {
    setEditFormData({ id: '', name: '', startDate: '', endDate: '', type: 'Akademik' });
    setIsEditModalOpen(true);
  };

  const formatDate = (dateStr) => {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateStr).toLocaleDateString('id-ID', options);
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
              <h1 style={{ color: 'white', fontSize: '2.2rem', fontWeight: '800', margin: '0 0 8px 0', letterSpacing: '-0.03em' }}>Kalender Akademik</h1>
              <p style={{ color: 'rgba(255,255,255,0.6)', margin: 0 }}>Kelola jadwal kegiatan akademik untuk program studi Anda.</p>
            </div>
            <button onClick={openAddModal} style={{ background: '#3b82f6', color: 'white', padding: '12px 24px', borderRadius: '12px', border: 'none', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)' , flexWrap: 'wrap'}}>
              <i className="ph ph-calendar-plus" style={{ fontSize: '1.2rem' }}></i> Tambah Jadwal
            </button>
          </div>
        </div>
      </div>

      <div className="siakad-card" style={{ padding: '24px' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="siakad-table" style={{ width: '100%', minWidth: '800px', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'var(--glass-bg)', color: 'var(--color-muted)', borderBottom: '1px solid var(--color-border)', textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '0.05em' }}>
                <th style={{ padding: '16px' }}>Kegiatan Akademik</th>
                <th style={{ padding: '16px' }}>Tanggal Mulai</th>
                <th style={{ padding: '16px' }}>Tanggal Berakhir</th>
                <th style={{ padding: '16px' }}>Kategori</th>
                <th style={{ padding: '16px', textAlign: 'right' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {events.sort((a,b) => new Date(a.startDate) - new Date(b.startDate)).map((ev) => (
                <tr key={ev.id} style={{ borderBottom: '1px solid var(--color-border)', transition: 'all 0.2s' }} onMouseEnter={(e)=>e.currentTarget.style.background='var(--glass-bg)'} onMouseLeave={(e)=>e.currentTarget.style.background='transparent'}>
                  <td style={{ padding: '16px', fontWeight: 'bold', color: 'var(--color-text)' }}>{ev.name}</td>
                  <td style={{ padding: '16px', color: 'var(--color-text)' }}>{formatDate(ev.startDate)}</td>
                  <td style={{ padding: '16px', color: 'var(--color-text)' }}>{formatDate(ev.endDate)}</td>
                  <td style={{ padding: '16px' }}>
                    <span className="siakad-badge" style={{ 
                      background: ev.type === 'Ujian' ? 'rgba(239, 68, 68, 0.1)' : ev.type === 'Dosen' ? 'rgba(139, 92, 246, 0.1)' : 'rgba(59, 130, 246, 0.1)', 
                      color: ev.type === 'Ujian' ? '#ef4444' : ev.type === 'Dosen' ? '#8b5cf6' : '#3b82f6' 
                    }}>
                      {ev.type}
                    </span>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', flexWrap: 'nowrap' }}>
                      <button onClick={() => { setEditFormData(ev); setIsEditModalOpen(true); }} style={{ background: 'transparent', border: '1px solid var(--color-border)', color: '#3b82f6', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', flexShrink: 0 }}><i className="ph ph-pencil-simple"></i></button>
                      <button onClick={() => handleDelete(ev.id)} style={{ background: 'transparent', border: '1px solid var(--color-border)', color: '#ef4444', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', flexShrink: 0 }}><i className="ph ph-trash"></i></button>
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
              <h3 style={{ margin: 0, fontSize: '1.25rem' }}>{editFormData.id ? 'Edit Jadwal' : 'Tambah Jadwal'}</h3>
              <button onClick={() => setIsEditModalOpen(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--color-muted)', fontSize: '1.5rem' }}><i className="ph ph-x"></i></button>
            </div>
            <div style={{ padding: '24px' }}>
              <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' , flexWrap: 'wrap'}}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Nama Kegiatan</label>
                  <input type="text" required value={editFormData.name} onChange={e=>setEditFormData({...editFormData, name: e.target.value})} className="siakad-input" style={{ width: '100%' }} />
                </div>
                <div style={{ display: 'flex', gap: '16px' , flexWrap: 'wrap' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Mulai</label>
                    <input type="date" required value={editFormData.startDate} onChange={e=>setEditFormData({...editFormData, startDate: e.target.value})} className="siakad-input" style={{ width: '100%' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Berakhir</label>
                    <input type="date" required value={editFormData.endDate} onChange={e=>setEditFormData({...editFormData, endDate: e.target.value})} className="siakad-input" style={{ width: '100%' }} />
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Kategori</label>
                  <CustomSelect 
                    value={editFormData.type} 
                    onChange={val => setEditFormData({...editFormData, type: val})} 
                    options={[
                      { value: "Akademik", label: "Akademik Mahasiswa (KRS, dll)" },
                      { value: "Ujian", label: "Ujian (UTS/UAS)" },
                      { value: "Dosen", label: "Tenggat Waktu Dosen" }
                    ]}
                  />
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
