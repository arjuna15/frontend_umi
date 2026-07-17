'use client';
import { useState, useEffect } from 'react';
import CustomSelect from '../../components/CustomSelect';
import CustomDatePicker from '../../components/CustomDatePicker';
import ModalShell from '../../components/ModalShell';

export default function AdminKeuangan() {
  const [billings, setBillings] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [bulkForm, setBulkForm] = useState({
    description: '',
    amount: '',
    due_date: ''
  });

  const [formData, setFormData] = useState({
    id: null,
    user_id: '',
    description: '',
    amount: '',
    due_date: '',
    status: 'Belum Lunas'
  });
  const [searchQuery, setSearchQuery] = useState('');

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('siakad_token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
      
      const [billingRes, userRes] = await Promise.all([
        fetch(`${apiUrl}/siakad/admin/billings`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${apiUrl}/siakad/admin/users`, { headers: { Authorization: `Bearer ${token}` } })
      ]);
      
      if (!billingRes.ok || !userRes.ok) throw new Error('Failed to fetch data');
      
      const billingData = await billingRes.json();
      const userData = await userRes.json();
      
      setBillings(billingData);
      setUsers(userData.filter(u => u.role === 'mahasiswa'));
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openModal = (billing = null) => {
    if (billing) {
      setFormData({
        id: billing.id,
        user_id: billing.user_id,
        description: billing.description,
        amount: billing.amount,
        due_date: billing.due_date,
        status: billing.status
      });
      setIsEdit(true);
    } else {
      setFormData({
        id: null,
        user_id: '',
        description: '',
        amount: '',
        due_date: '',
        status: 'Belum Lunas'
      });
      setIsEdit(false);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const openBulkModal = () => {
    setBulkForm({
      description: '',
      amount: '',
      due_date: ''
    });
    setIsBulkModalOpen(true);
  };

  const closeBulkModal = () => setIsBulkModalOpen(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('siakad_token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
      let res;
      
      if (isEdit) {
        res = await fetch(`${apiUrl}/siakad/admin/billings/${formData.id}`, {
          method: 'PUT',
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        });
      } else {
        res = await fetch(`${apiUrl}/siakad/admin/billings`, {
          method: 'POST',
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        });
      }
      
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || 'Request failed');
      }
      
      closeModal();
      fetchData();
    } catch (error) {
      window.toast('Terjadi kesalahan: ' + error.message);
    }
  };

  const handleDelete = async (id) => {
    if (await window.toast.confirm('Yakin ingin menghapus tagihan ini?')) {
      try {
        const token = localStorage.getItem('siakad_token');
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
        
        const res = await fetch(`${apiUrl}/siakad/admin/billings/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (!res.ok) throw new Error('Request failed');
        
        fetchData();
      } catch (error) {
        window.toast('Gagal menghapus tagihan');
      }
    }
  };

  const handleBulkGenerate = async () => {
    if (!bulkForm.description || !bulkForm.amount || !bulkForm.due_date) {
      window.toast('Semua field harus diisi.');
      return;
    }
    try {
      const token = localStorage.getItem('siakad_token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
      const res = await fetch(`${apiUrl}/siakad/admin/billings/bulk-generate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          description: bulkForm.description,
          amount: parseFloat(bulkForm.amount),
          due_date: bulkForm.due_date
        })
      });
      const data = await res.json();
      if (res.ok) {
        window.toast(data.message);
        closeBulkModal();
        fetchData();
      } else {
        window.toast('Gagal: ' + (data.message || 'Error'));
      }
    } catch (err) {
      window.toast('Terjadi kesalahan: ' + err.message);
    }
  };

  const formatRupiah = (amount) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
  };

  return (
    <div className="fade-in" style={{ paddingBottom: '40px' }}>
      <div className="siakad-page-header">
        <div className="siakad-page-header-glow"></div>
        <div className="siakad-page-header-grid"></div>
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '20px' }}>
          <div style={{ flex: '1 1 300px' }}>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', margin: '0 0 8px 0', letterSpacing: '0.1em', textTransform: 'uppercase' }}>SIAKAD — ADMIN</p>
            <h1 style={{ color: 'white', fontSize: '2.2rem', fontWeight: '800', margin: '0 0 8px 0', letterSpacing: '-0.03em', display: 'flex', alignItems: 'center', gap: '12px' , flexWrap: 'wrap'}}>
              Manajemen Keuangan <i className="ph ph-wallet"></i>
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.6)', margin: 0 }}>Kelola seluruh tagihan dan pembayaran mahasiswa.</p>
          </div>
          <div style={{ display: 'flex', gap: '12px' , flexWrap: 'wrap'}}>
            <button 
              onClick={openBulkModal}
              style={{
                background: 'rgba(16, 185, 129, 0.15)', backdropFilter: 'none',
                color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.4)', padding: '12px 24px', borderRadius: '30px',
                fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
                transition: 'all 0.3s'
              , flexWrap: 'wrap'}}
              onMouseOver={(e) => e.currentTarget.style.background = 'rgba(16, 185, 129, 0.25)'}
              onMouseOut={(e) => e.currentTarget.style.background = 'rgba(16, 185, 129, 0.15)'}
            >
              <i className="ph ph-receipt"></i> Generate Tagihan Massal
            </button>
            <button 
              onClick={() => openModal()}
              className="siakad-btn-primary"
              style={{ padding: '12px 24px' }}
            >
              <i className="ph ph-plus-circle"></i> Tambah Tagihan
            </button>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', marginBottom: '24px' }}>
        <div className="siakad-card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' , flexWrap: 'wrap'}}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' , flexShrink: 0 }}>
            <i className="ph ph-coins"></i>
          </div>
          <div>
            <p style={{ margin: 0, color: 'var(--color-muted)', fontSize: '0.9rem' }}>Total Pemasukan (Lunas)</p>
            <h3 style={{ margin: 0, fontSize: '1.2rem' }}>{formatRupiah(billings.filter(b => b.status === 'Lunas').reduce((acc, b) => acc + parseFloat(b.amount || 0), 0))}</h3>
          </div>
        </div>
        <div className="siakad-card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' , flexWrap: 'wrap'}}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' , flexShrink: 0 }}>
            <i className="ph ph-warning-circle"></i>
          </div>
          <div>
            <p style={{ margin: 0, color: 'var(--color-muted)', fontSize: '0.9rem' }}>Total Piutang (Belum Lunas)</p>
            <h3 style={{ margin: 0, fontSize: '1.2rem' }}>{formatRupiah(billings.filter(b => b.status !== 'Lunas').reduce((acc, b) => acc + parseFloat(b.amount || 0), 0))}</h3>
          </div>
        </div>
      </div>

      <div className="siakad-card stagger-1" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', borderBottom: '1px solid var(--color-border)' }}>
          <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--color-text)', fontWeight: 'bold' }}>Daftar Tagihan Keuangan</h3>
          <div style={{ position: 'relative', width: '300px' }}>
            <i className="ph ph-magnifying-glass" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-muted)', fontSize: '1.1rem' }}></i>
            <input type="text" className="siakad-input" placeholder="Cari nama mahasiswa, deskripsi, status..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ width: '100%', paddingLeft: '46px', color: 'var(--color-text)', fontSize: '0.9rem' }} />
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--color-text)' }}>Memuat data keuangan...</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="siakad-table" style={{ width: '100%', minWidth: '800px', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr>
                  <th style={{ padding: '16px', fontWeight: '600' }}>MAHASISWA</th>
                  <th style={{ padding: '16px', fontWeight: '600' }}>DESKRIPSI TAGIHAN</th>
                  <th style={{ padding: '16px', fontWeight: '600' }}>NOMINAL</th>
                  <th style={{ padding: '16px', fontWeight: '600' }}>JATUH TEMPO</th>
                  <th style={{ padding: '16px', fontWeight: '600' }}>STATUS</th>
                  <th style={{ padding: '16px', fontWeight: '600' }}>AKSI</th>
                </tr>
              </thead>
              <tbody>
                {(() => {
                  const filtered = billings.filter(billing => {
                    const query = searchQuery.toLowerCase().trim();
                    if (!query) return true;
                    return (
                      billing.user?.name?.toLowerCase().includes(query) ||
                      billing.description?.toLowerCase().includes(query) ||
                      billing.status?.toLowerCase().includes(query) ||
                      String(billing.amount).includes(query)
                    );
                  });

                  if (filtered.length === 0) {
                    return (
                      <tr>
                        <td colSpan="6" style={{ textAlign: 'center', padding: '32px', color: 'var(--color-text)' }}>Tidak ada data tagihan.</td>
                      </tr>
                    );
                  }

                  return filtered.map((billing) => (
                    <tr key={billing.id}>
                      <td style={{ padding: '16px', fontWeight: '600', color: 'var(--color-text)' }}>{billing.user?.name || 'User Tidak Diketahui'}</td>
                      <td style={{ padding: '16px', color: 'var(--color-text)' }}>{billing.description}</td>
                      <td style={{ padding: '16px', color: 'var(--color-text)', fontWeight: '700' }}>{formatRupiah(billing.amount)}</td>
                      <td style={{ padding: '16px', color: 'var(--color-text)' }}>{billing.due_date}</td>
                      <td style={{ padding: '16px' }}>
                        <span className="siakad-badge" style={{
                          background: billing.status === 'Lunas' ? '#dcfce7' : '#fee2e2',
                          color: billing.status === 'Lunas' ? '#166534' : '#991b1b',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}>
                          {billing.status === 'Lunas' ? <i className="ph ph-check-circle"></i> : <i className="ph ph-clock-circle"></i>}
                          {billing.status}
                        </span>
                      </td>
                      <td style={{ padding: '16px' }}>
                        <div style={{ display: 'flex', gap: '8px' , flexWrap: 'wrap'}}>
                          <button 
                            onClick={() => openModal(billing)}
                            style={{
                              background: 'var(--glass-bg)', color: 'var(--color-text)', border: 'none', padding: '8px', 
                              borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s'
                            }}
                            title="Edit Tagihan"
                          ><i className="ph ph-pencil-simple" style={{ fontSize: '1.2rem' }}></i></button>
                          <button 
                            onClick={() => handleDelete(billing.id)}
                            style={{
                              background: 'var(--glass-bg)', color: '#ef4444', border: 'none', padding: '8px', 
                              borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s'
                            }}
                            title="Hapus Tagihan"
                          ><i className="ph ph-trash" style={{ fontSize: '1.2rem' }}></i></button>
                        </div>
                      </td>
                    </tr>
                  ));
                })()}
              </tbody>
            </table>
          </div>
        )}
      </div>      {isModalOpen && (
        <ModalShell
          title={isEdit ? 'Edit Tagihan' : 'Tambah Tagihan Baru'}
          icon={isEdit ? 'ph-pencil-simple-line' : 'ph-receipt'}
          onClose={closeModal}
          footer={
            <>
              <button
                type="button"
                onClick={closeModal}
                style={{
                  border: 'none',
                  color: 'var(--color-text)',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  transition: 'all 0.2s'
                }}
              >
                Batal
              </button>
              <button type="submit" form="single-billing-form" className="siakad-btn-primary" style={{ minWidth: '180px' }}>
                {isEdit ? 'Simpan Perubahan' : 'Buat Tagihan'}
              </button>
            </>
          }
        >
          <form id="single-billing-form" onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gap: '18px' }}>
              {!isEdit && (
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: 'var(--color-text)', marginBottom: '8px' }}>Pilih Mahasiswa</label>
                  <CustomSelect 
                    name="user_id"
                    value={formData.user_id} 
                    onChange={(val) => setFormData({...formData, user_id: val})}
                    placeholder="-- Pilih Mahasiswa --"
                    options={users.map(u => ({ value: u.id, label: `${u.name} (${u.npm || u.email})`, icon: 'ph ph-user' }))}
                  />
                </div>
              )}
              
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: 'var(--color-text)', marginBottom: '8px' }}>Deskripsi Tagihan</label>
                <input 
                  type="text" 
                  value={formData.description} 
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  required
                  placeholder="Contoh: UKT semester berjalan"
                  className="siakad-input"
                  style={{ width: '100%', color: 'var(--color-text)' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: 'var(--color-text)', marginBottom: '8px' }}>Nominal (Rp)</label>
                <input 
                  type="number" 
                  value={formData.amount} 
                  onChange={(e) => setFormData({...formData, amount: e.target.value})}
                  required
                  placeholder="4500000"
                  className="siakad-input"
                  style={{ width: '100%', color: 'var(--color-text)' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: 'var(--color-text)', marginBottom: '8px' }}>Jatuh Tempo</label>
                <CustomDatePicker 
                  value={formData.due_date} 
                  onChange={(val) => setFormData({...formData, due_date: val})}
                />
              </div>

              {isEdit && (
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: 'var(--color-text)', marginBottom: '8px' }}>Status Pembayaran</label>
                  <CustomSelect 
                    name="status"
                    value={formData.status} 
                    onChange={(val) => setFormData({...formData, status: val})}
                    options={[
                      { value: 'Belum Lunas', label: 'Belum Lunas', icon: 'ph ph-x-circle' },
                      { value: 'Lunas', label: 'Lunas', icon: 'ph ph-check-circle' }
                    ]}
                  />
                </div>
              )}
            </div>
          </form>
        </ModalShell>
      )}      {isBulkModalOpen && (
        <ModalShell
          title="Generate Tagihan Massal"
          icon="ph-receipt"
          onClose={closeBulkModal}
          footer={
            <>
              <button
                type="button"
                onClick={closeBulkModal}
                style={{
                  border: 'none',
                  color: 'var(--color-text)',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  transition: 'all 0.2s'
                }}
              >
                Batal
              </button>
              <button type="submit" form="bulk-billing-form" className="siakad-btn-primary" style={{ minWidth: '180px' }}>
                Simpan & Kirim
              </button>
            </>
          }
        >
          <form
            id="bulk-billing-form"
            onSubmit={(e) => {
              e.preventDefault();
              handleBulkGenerate();
            }}
          >
            <div style={{ display: 'grid', gap: '18px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: 'var(--color-text)', marginBottom: '8px' }}>Deskripsi Tagihan</label>
                <input
                  type="text"
                  autoFocus
                  value={bulkForm.description}
                  onChange={(e) => setBulkForm({ ...bulkForm, description: e.target.value })}
                  placeholder="Contoh: UKT semester berjalan"
                  className="siakad-input"
                  style={{ width: '100%', color: 'var(--color-text)' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: 'var(--color-text)', marginBottom: '8px' }}>Nominal (Rp)</label>
                <input
                  type="number"
                  value={bulkForm.amount}
                  onChange={(e) => setBulkForm({ ...bulkForm, amount: e.target.value })}
                  placeholder="4500000"
                  className="siakad-input"
                  style={{ width: '100%', color: 'var(--color-text)' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: 'var(--color-text)', marginBottom: '8px' }}>Jatuh Tempo</label>
                <CustomDatePicker
                  value={bulkForm.due_date}
                  onChange={(val) => setBulkForm({ ...bulkForm, due_date: val })}
                />
              </div>
            </div>
          </form>
        </ModalShell>
      )}
    </div>
  );
}
