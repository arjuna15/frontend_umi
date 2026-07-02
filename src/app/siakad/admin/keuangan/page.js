'use client';
import { useState, useEffect } from 'react';
import CustomSelect from '../../components/CustomSelect';

export default function AdminKeuangan() {
  const [billings, setBillings] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const [formData, setFormData] = useState({
    id: null,
    user_id: '',
    description: '',
    amount: '',
    due_date: '',
    status: 'Belum Lunas'
  });

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

  const formatRupiah = (amount) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
  };

  return (
    <div className="fade-in" style={{ paddingBottom: '40px' }}>
      <div style={{ 
        background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #4c0519 100%)',
        borderRadius: '24px', padding: '40px', marginBottom: '32px', position: 'relative', overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(196,30,58,0.15)', filter: 'blur(40px)' , flexShrink: 0 }}></div>
        <div style={{ position: 'absolute', bottom: '-20px', left: '30%', width: '150px', height: '150px', borderRadius: '50%', background: 'rgba(99,102,241,0.1)', filter: 'blur(30px)' , flexShrink: 0 }}></div>
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
              onClick={() => window.toast?.('Membuat tagihan massal untuk semua mahasiswa aktif...')}
              style={{
                background: 'rgba(16, 185, 129, 0.2)', backdropFilter: 'blur(10px)',
                color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '12px 24px', borderRadius: '12px',
                fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
                transition: 'all 0.3s'
              , flexWrap: 'wrap'}}
              onMouseOver={(e) => e.currentTarget.style.background = 'rgba(16, 185, 129, 0.3)'}
              onMouseOut={(e) => e.currentTarget.style.background = 'rgba(16, 185, 129, 0.2)'}
            >
              <i className="ph ph-receipt"></i> Generate Tagihan Massal
            </button>
            <button 
              onClick={() => openModal()}
              style={{
                background: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(10px)',
                color: 'white', border: '1px solid rgba(255,255,255,0.2)', padding: '12px 24px', borderRadius: '12px',
                fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
                transition: 'all 0.3s'
              , flexWrap: 'wrap'}}
              onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'}
              onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
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
                {billings.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '32px', color: 'var(--color-text)' }}>Belum ada tagihan.</td>
                  </tr>
                ) : billings.map((billing) => (
                  <tr key={billing.id}>
                    <td style={{ padding: '16px', fontWeight: '600', color: 'var(--color-text)' }}>{billing.user?.name || 'User Tidak Diketahui'}</td>
                    <td style={{ padding: '16px', color: 'var(--color-text)' }}>{billing.description}</td>
                    <td style={{ padding: '16px', color: 'var(--color-text)', fontWeight: '700' }}>{formatRupiah(billing.amount)}</td>
                    <td style={{ padding: '16px', color: 'var(--color-text)' }}>{billing.due_date}</td>
                    <td style={{ padding: '16px' }}>
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: '6px',
                        padding: '6px 12px', borderRadius: '99px', fontSize: '0.8rem', fontWeight: '700',
                        background: billing.status === 'Lunas' ? '#dcfce7' : '#fee2e2',
                        color: billing.status === 'Lunas' ? '#166534' : '#991b1b'
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
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="siakad-modal-overlay">
          <div className="siakad-modal-content">
            <div style={{ padding: '24px', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' , flexWrap: 'wrap' }}>
              <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '800', color: 'var(--color-text)' }}>
                {isEdit ? 'Edit Tagihan' : 'Tambah Tagihan Baru'}
              </h2>
              <button onClick={closeModal} style={{ background: 'transparent', border: 'none', color: 'var(--color-text)', cursor: 'pointer', fontSize: '1.2rem' }}>
                <i className="ph ph-x"></i>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
              {!isEdit && (
                <div style={{ marginBottom: '16px' }}>
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
              
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: 'var(--color-text)', marginBottom: '8px' }}>Deskripsi Tagihan</label>
                <input 
                  type="text" 
                  value={formData.description} 
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  required
                  placeholder="Contoh: UKT Semester Ganjil 2026/2027"
                  style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid var(--color-border)', outline: 'none', background: 'var(--color-bg)', color: 'var(--color-text)' }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: 'var(--color-text)', marginBottom: '8px' }}>Nominal (Rp)</label>
                <input 
                  type="number" 
                  value={formData.amount} 
                  onChange={(e) => setFormData({...formData, amount: e.target.value})}
                  required
                  placeholder="4500000"
                  style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid var(--color-border)', outline: 'none', background: 'var(--color-bg)', color: 'var(--color-text)' }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: 'var(--color-text)', marginBottom: '8px' }}>Jatuh Tempo</label>
                <input 
                  type="date" 
                  value={formData.due_date} 
                  onChange={(e) => setFormData({...formData, due_date: e.target.value})}
                  required
                  style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid var(--color-border)', outline: 'none', background: 'var(--color-bg)', color: 'var(--color-text)' }}
                />
              </div>

              {isEdit && (
                <div style={{ marginBottom: '24px' }}>
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

              <button type="submit" style={{
                width: '100%', background: '#0f172a', color: 'white', border: 'none', 
                padding: '14px', borderRadius: '12px', fontWeight: '800', fontSize: '1rem',
                cursor: 'pointer', transition: 'all 0.3s'
              }}>
                {isEdit ? 'Simpan Perubahan' : 'Buat Tagihan'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
