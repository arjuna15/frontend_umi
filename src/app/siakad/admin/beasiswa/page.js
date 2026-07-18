"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ModalShell from '../../components/ModalShell';
import CustomSelect from '../../components/CustomSelect';

export default function BeasiswaPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [activeTab, setActiveTab] = useState('penerima');
  
  const [studentScholarships, setStudentScholarships] = useState([]);
  const [scholarshipMasters, setScholarshipMasters] = useState([]);
  const [stats, setStats] = useState({ active: 0, revoked: 0, completed: 0, total: 0 });

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showMasterModal, setShowMasterModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);

  // Forms
  const [saving, setSaving] = useState(false);
  const [formAdd, setFormAdd] = useState({ nim: '', scholarship_id: '', start_semester: '', sk_number: '', notes: '' });
  const [formMaster, setFormMaster] = useState({ name: '', provider: '', discount_type: 'percentage', discount_value: '100' });
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [formStatus, setFormStatus] = useState({ status: 'revoked', end_semester: '', notes: '' });

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
  const getToken = () => localStorage.getItem('siakad_token');

  const fetchData = async () => {
    const token = getToken();
    if (!token) return router.push('/siakad/login');
    try {
      const [listRes, mastersRes, statsRes] = await Promise.all([
        fetch(`${apiUrl}/siakad/beasiswa`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${apiUrl}/siakad/beasiswa/masters`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${apiUrl}/siakad/beasiswa/stats`, { headers: { 'Authorization': `Bearer ${token}` } })
      ]);

      if (listRes.ok) {
        const d = await listRes.json();
        setStudentScholarships(d.data || []);
      }
      if (mastersRes.ok) {
        const d = await mastersRes.json();
        setScholarshipMasters(d.data || []);
      }
      if (statsRes.ok) {
        const d = await statsRes.json();
        setStats(d.stats || { active: 0, revoked: 0, completed: 0, total: 0 });
      }
    } catch (e) {
      console.error(e);
      setMessage({ text: 'Gagal memuat data beasiswa.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleAddStudent = async () => {
    if (!formAdd.nim || !formAdd.scholarship_id || !formAdd.start_semester) {
      setMessage({ text: 'NIM, Jenis Beasiswa, dan Semester Mulai wajib diisi.', type: 'error' });
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`${apiUrl}/siakad/beasiswa`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` },
        body: JSON.stringify(formAdd)
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.message || 'Failed');
      setMessage({ text: 'Mahasiswa penerima beasiswa berhasil didaftarkan!', type: 'success' });
      setShowAddModal(false);
      setFormAdd({ nim: '', scholarship_id: '', start_semester: '', sk_number: '', notes: '' });
      fetchData();
    } catch (e) {
      setMessage({ text: e.message || 'Gagal mendaftarkan beasiswa mahasiswa.', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleAddMaster = async () => {
    if (!formMaster.name || !formMaster.provider || !formMaster.discount_value) {
      setMessage({ text: 'Semua kolom master wajib diisi.', type: 'error' });
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`${apiUrl}/siakad/beasiswa/masters`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` },
        body: JSON.stringify(formMaster)
      });
      if (!res.ok) throw new Error('Failed');
      setMessage({ text: 'Master beasiswa berhasil ditambahkan!', type: 'success' });
      setShowMasterModal(false);
      setFormMaster({ name: '', provider: '', discount_type: 'percentage', discount_value: '100' });
      fetchData();
    } catch (e) {
      setMessage({ text: 'Gagal menambahkan master beasiswa.', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateStatus = async () => {
    if (!selectedStudent) return;
    setSaving(true);
    try {
      const res = await fetch(`${apiUrl}/siakad/beasiswa/${selectedStudent.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` },
        body: JSON.stringify(formStatus)
      });
      if (!res.ok) throw new Error('Failed');
      setMessage({ text: 'Status beasiswa mahasiswa berhasil diubah!', type: 'success' });
      setShowStatusModal(false);
      fetchData();
    } catch (e) {
      setMessage({ text: 'Gagal mengubah status beasiswa.', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const openStatusChange = (item) => {
    setSelectedStudent(item);
    setFormStatus({ status: item.status, end_semester: item.end_semester || '', notes: item.notes || '' });
    setShowStatusModal(true);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getStatusColor = (s) => {
    if (s === 'active') return '#10b981';
    if (s === 'revoked') return '#ef4444';
    return '#3b82f6';
  };

  const getStatusLabel = (s) => {
    if (s === 'active') return 'Aktif';
    if (s === 'revoked') return 'Dicabut';
    return 'Selesai';
  };

  if (loading) return (
    <div style={{ padding: '24px' }}>
      <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--color-text)', margin: '0 0 24px 0' }}>Memuat Manajemen Beasiswa...</h1>
      <div className="siakad-card" style={{ padding: '24px', height: '200px' }}></div>
    </div>
  );

  return (
    <div className="fade-in">
      <div className="siakad-page-header">
        <div className="siakad-page-header-glow"></div>
        <div className="siakad-page-header-grid"></div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', margin: '0 0 8px 0', letterSpacing: '0.1em', textTransform: 'uppercase' }}>SIAKAD — KEMAHASISWAAN</p>
          <h1 style={{ color: 'white', fontSize: '2.2rem', fontWeight: '800', margin: '0 0 8px 0', letterSpacing: '-0.03em' }}>Beasiswa & KIP Kuliah</h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', margin: 0 }}>Kelola pemberian subsidi UKT, penambahan KIP-K di tengah semester, pencabutan beasiswa, dan validasi SK.</p>
        </div>
      </div>

      {message.text && (
        <div style={{ padding: '16px 20px', borderRadius: '12px', marginBottom: '24px', background: message.type === 'success' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', border: `1px solid ${message.type === 'success' ? '#10b981' : '#ef4444'}`, color: message.type === 'success' ? '#10b981' : '#ef4444', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <i className={message.type === 'success' ? "ph-fill ph-check-circle" : "ph-fill ph-warning-circle"} style={{ fontSize: '1.4rem' }}></i>
          {message.text}
        </div>
      )}

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        {[
          { label: 'Total Penerima', value: stats.total, icon: 'ph ph-users', color: '#3b82f6', bg: 'rgba(59,130,246,0.1)' },
          { label: 'Beasiswa Aktif', value: stats.active, icon: 'ph ph-check-square', color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
          { label: 'Beasiswa Dicabut', value: stats.revoked, icon: 'ph ph-warning-circle', color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
          { label: 'Tuntas / Selesai', value: stats.completed, icon: 'ph ph-graduation-cap', color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)' },
        ].map((s, i) => (
          <div key={i} className="siakad-card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', boxShadow: 'inset 2px 2px 4px var(--inset-shadow-dark), inset -2px -2px 4px var(--inset-shadow-light)', background: 'var(--liquid-bg)', color: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
                <i className={s.icon}></i>
              </div>
              <span style={{ color: 'var(--color-muted)', fontSize: '0.85rem', fontWeight: '600' }}>{s.label}</span>
            </div>
            <p style={{ margin: 0, fontSize: '2rem', fontWeight: '800', color: 'var(--color-text)' }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Tab Switcher */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
        {[
          { key: 'penerima', label: 'Data Penerima Beasiswa', icon: 'ph ph-users-four' },
          { key: 'master', label: 'Kategori / Master Beasiswa', icon: 'ph ph-folder-open' }
        ].map(t => (
          <button type="button" id={`tab-${t.key}`} key={t.key} onClick={() => setActiveTab(t.key)} className={activeTab === t.key ? 'active' : ''} style={{
            background: activeTab === t.key ? 'var(--liquid-bg)' : 'var(--glass-bg)', color: activeTab === t.key ? 'var(--apple-red)' : 'var(--color-muted)', border: 'var(--glass-border)', boxShadow: activeTab === t.key ? 'inset 4px 4px 8px var(--inset-shadow-dark), inset -4px -4px 8px var(--inset-shadow-light)' : 'var(--glass-shadow)', padding: '10px 20px', borderRadius: '50px', outline: 'none',
            fontWeight: '700', fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '8px'
          }}><i className={t.icon}></i>{t.label}</button>
        ))}
      </div>

      {/* Penerima Beasiswa Tab */}
      {activeTab === 'penerima' && (
        <div className="siakad-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--color-text)', margin: 0 }}>Mahasiswa Penerima Beasiswa</h2>
            <button id="btn-add-penerima" onClick={() => setShowAddModal(true)} className="siakad-btn-primary" style={{ padding: '10px 20px' }}>
              <i className="ph ph-plus-circle"></i> Berikan Beasiswa
            </button>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {['Nama Mahasiswa', 'NIM', 'Nama Beasiswa', 'Potongan', 'Mulai Semester', 'Selesai/Dicabut', 'Status', 'Nomor SK', 'Aksi'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.8rem', fontWeight: '700', color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '2px solid var(--color-border)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {studentScholarships.length === 0 ? (
                  <tr><td colSpan={9} style={{ padding: '40px', textAlign: 'center', color: 'var(--color-muted)' }}>Belum ada mahasiswa penerima beasiswa terdaftar.</td></tr>
                ) : studentScholarships.map(s => (
                  <tr key={s.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: '14px 16px', color: 'var(--color-text)', fontWeight: '600' }}>{s.user?.name || '-'}</td>
                    <td style={{ padding: '14px 16px', color: 'var(--color-muted)' }}>{s.user?.nim || '-'}</td>
                    <td style={{ padding: '14px 16px', color: 'var(--color-text)' }}>{s.scholarship?.name || '-'}</td>
                    <td style={{ padding: '14px 16px', color: 'var(--color-muted)' }}>
                      {s.scholarship?.discount_type === 'percentage' ? `${s.scholarship?.discount_value}%` : `Rp ${parseFloat(s.scholarship?.discount_value).toLocaleString('id-ID')}`}
                    </td>
                    <td style={{ padding: '14px 16px', color: 'var(--color-text)' }}>{s.start_semester}</td>
                    <td style={{ padding: '14px 16px', color: 'var(--color-muted)' }}>{s.end_semester || 'Aktif'}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <span className="siakad-badge siakad-badge-sm" style={{ color: getStatusColor(s.status), textTransform: 'capitalize' }}>
                        {getStatusLabel(s.status)}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px', color: 'var(--color-muted)' }}>{s.sk_number || '-'}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <button id={`btn-update-status-${s.id}`} onClick={() => openStatusChange(s)} style={{ background: 'transparent', border: '1px solid var(--color-border)', borderRadius: '30px', padding: '6px 12px', color: 'var(--color-text)', fontWeight: '600', cursor: 'pointer', fontSize: '0.8rem' }}>
                        Ubah Status
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Master Beasiswa Tab */}
      {activeTab === 'master' && (
        <div className="siakad-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--color-text)', margin: 0 }}>Daftar Kategori / Master Beasiswa</h2>
            <button id="btn-add-master" onClick={() => setShowMasterModal(true)} className="siakad-btn-primary" style={{ padding: '10px 20px' }}>
              <i className="ph ph-plus"></i> Kategori Baru
            </button>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {['Nama Beasiswa', 'Penyedia', 'Jenis Potongan', 'Besaran Potongan', 'Deskripsi'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.8rem', fontWeight: '700', color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '2px solid var(--color-border)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {scholarshipMasters.map(m => (
                  <tr key={m.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: '14px 16px', color: 'var(--color-text)', fontWeight: '600' }}>{m.name}</td>
                    <td style={{ padding: '14px 16px', color: 'var(--color-muted)' }}>{m.provider}</td>
                    <td style={{ padding: '14px 16px', color: 'var(--color-text)' }}>{m.discount_type === 'percentage' ? 'Persentase' : 'Nominal Tetap'}</td>
                    <td style={{ padding: '14px 16px', color: 'var(--color-text)', fontWeight: '700' }}>
                      {m.discount_type === 'percentage' ? `${m.discount_value}%` : `Rp ${parseFloat(m.discount_value).toLocaleString('id-ID')}`}
                    </td>
                    <td style={{ padding: '14px 16px', color: 'var(--color-muted)', fontSize: '0.85rem' }}>{m.description || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Berikan Beasiswa */}
      {showAddModal && (
        <ModalShell title="Berikan Beasiswa Mahasiswa" subtitle="Daftarkan skema beasiswa baru ke NIM tertentu" icon="ph-user-plus" onClose={() => setShowAddModal(false)} footer={
          <>
            <button id="btn-cancel-add" onClick={() => setShowAddModal(false)} style={{ padding: '10px 20px', border: 'none', background: 'transparent', color: 'var(--color-text)', cursor: 'pointer', fontWeight: '600' }}>Batal</button>
            <button id="btn-confirm-add" onClick={handleAddStudent} disabled={saving} className="siakad-btn-primary" style={{ padding: '10px 24px' }}>
              {saving ? 'Menyimpan...' : 'Tambahkan'}
            </button>
          </>
        }>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: 'var(--color-muted)', fontWeight: '600' }}>NIM Mahasiswa</label>
            <input type="text" className="siakad-input" value={formAdd.nim} onChange={e => setFormAdd({ ...formAdd, nim: e.target.value })} placeholder="Masukkan NIM Mahasiswa" />
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: 'var(--color-muted)', fontWeight: '600' }}>Pilih Beasiswa / Kategori</label>
            <CustomSelect
              value={formAdd.scholarship_id}
              onChange={val => setFormAdd({ ...formAdd, scholarship_id: val })}
              placeholder="-- Pilih Beasiswa --"
              options={scholarshipMasters.map(m => ({ value: m.id.toString(), label: `${m.name} (${m.provider})` }))}
            />
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: 'var(--color-muted)', fontWeight: '600' }}>Mulai dari Semester</label>
            <input type="text" className="siakad-input" value={formAdd.start_semester} onChange={e => setFormAdd({ ...formAdd, start_semester: e.target.value })} placeholder="Contoh: Semester 3 (Ganjil 2026/2027)" />
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: 'var(--color-muted)', fontWeight: '600' }}>Nomor SK</label>
            <input type="text" className="siakad-input" value={formAdd.sk_number} onChange={e => setFormAdd({ ...formAdd, sk_number: e.target.value })} placeholder="Contoh: SK/123/KIP-K/2026" />
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: 'var(--color-muted)', fontWeight: '600' }}>Catatan</label>
            <textarea className="siakad-input" value={formAdd.notes} onChange={e => setFormAdd({ ...formAdd, notes: e.target.value })} placeholder="Tulis catatan jika diperlukan" rows={3} style={{ resize: 'vertical' }} />
          </div>
        </ModalShell>
      )}

      {/* Modal Kategori Baru */}
      {showMasterModal && (
        <ModalShell title="Tambah Kategori Beasiswa" subtitle="Buat jenis master beasiswa baru" icon="ph-folder" onClose={() => setShowMasterModal(false)} footer={
          <>
            <button id="btn-cancel-master" onClick={() => setShowMasterModal(false)} style={{ padding: '10px 20px', border: 'none', background: 'transparent', color: 'var(--color-text)', cursor: 'pointer', fontWeight: '600' }}>Batal</button>
            <button id="btn-confirm-master" onClick={handleAddMaster} disabled={saving} className="siakad-btn-primary" style={{ padding: '10px 24px' }}>
              {saving ? 'Menyimpan...' : 'Tambahkan'}
            </button>
          </>
        }>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: 'var(--color-muted)', fontWeight: '600' }}>Nama Beasiswa</label>
            <input type="text" className="siakad-input" value={formMaster.name} onChange={e => setFormMaster({ ...formMaster, name: e.target.value })} placeholder="Contoh: KIP Kuliah, Beasiswa Yayasan" />
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: 'var(--color-muted)', fontWeight: '600' }}>Pihak Penyedia</label>
            <input type="text" className="siakad-input" value={formMaster.provider} onChange={e => setFormMaster({ ...formMaster, provider: e.target.value })} placeholder="Contoh: Kemendikbud, Yayasan UMIBA" />
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: 'var(--color-muted)', fontWeight: '600' }}>Jenis Potongan</label>
            <CustomSelect
              value={formMaster.discount_type}
              onChange={val => setFormMaster({ ...formMaster, discount_type: val })}
              options={[
                { value: 'percentage', label: 'Persentase (Diskon %)' },
                { value: 'fixed', label: 'Nominal Tetap (Diskon Rp)' }
              ]}
            />
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: 'var(--color-muted)', fontWeight: '600' }}>Besaran Potongan (Value)</label>
            <input type="number" className="siakad-input" value={formMaster.discount_value} onChange={e => setFormMaster({ ...formMaster, discount_value: e.target.value })} placeholder="Contoh: 100 untuk KIP, atau 2500000" />
          </div>
        </ModalShell>
      )}

      {/* Modal Ubah Status Beasiswa (Pencabutan / Tuntas) */}
      {showStatusModal && selectedStudent && (
        <ModalShell title="Ubah Status Beasiswa" subtitle={`Atur beasiswa untuk ${selectedStudent.user?.name}`} icon="ph-user-switch" onClose={() => setShowStatusModal(false)} footer={
          <>
            <button id="btn-cancel-status" onClick={() => setShowStatusModal(false)} style={{ padding: '10px 20px', border: 'none', background: 'transparent', color: 'var(--color-text)', cursor: 'pointer', fontWeight: '600' }}>Batal</button>
            <button id="btn-confirm-status" onClick={handleUpdateStatus} disabled={saving} className="siakad-btn-primary" style={{ padding: '10px 24px' }}>
              {saving ? 'Memperbarui...' : 'Simpan Status'}
            </button>
          </>
        }>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: 'var(--color-muted)', fontWeight: '600' }}>Status Beasiswa</label>
            <CustomSelect
              value={formStatus.status}
              onChange={val => setFormStatus({ ...formStatus, status: val })}
              options={[
                { value: 'active', label: 'Aktif (KIP gratis kuliah)' },
                { value: 'revoked', label: 'Dicabut (Dibatalkan/Kembali to UKT normal)' },
                { value: 'completed', label: 'Selesai (Tuntas lulus kuliah)' }
              ]}
            />
          </div>
          {formStatus.status !== 'active' && (
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: 'var(--color-muted)', fontWeight: '600' }}>Semester Selesai / Dicabut</label>
              <input type="text" className="siakad-input" value={formStatus.end_semester} onChange={e => setFormStatus({ ...formStatus, end_semester: e.target.value })} placeholder="Contoh: Semester 4 (Genap 2026/2027)" />
            </div>
          )}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: 'var(--color-muted)', fontWeight: '600' }}>Catatan / Alasan Perubahan</label>
            <textarea className="siakad-input" value={formStatus.notes} onChange={e => setFormStatus({ ...formStatus, notes: e.target.value })} placeholder="Tulis alasan, contoh: IPK di bawah target/Telah lulus sidang skripsi" rows={3} style={{ resize: 'vertical' }} />
          </div>
        </ModalShell>
      )}
    </div>
  );
}
