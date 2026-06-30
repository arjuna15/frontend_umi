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
      alert('Terjadi kesalahan: ' + error.message);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Yakin ingin menghapus tagihan ini?')) {
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
        alert('Gagal menghapus tagihan');
      }
    }
  };

  const formatRupiah = (amount) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--color-text)', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <i className="ph ph-wallet" style={{ color: 'var(--color-text)' }}></i> Manajemen Keuangan
          </h1>
          <p style={{ color: 'var(--color-text)', marginTop: '4px' }}>Kelola seluruh tagihan dan pembayaran mahasiswa.</p>
        </div>
        <button 
          onClick={() => openModal()}
          style={{
            background: 'linear-gradient(135deg, #0f172a 0%, #334155 100%)',
            color: 'white', border: 'none', padding: '12px 24px', borderRadius: '12px',
            fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
            boxShadow: '0 4px 15px rgba(15,23,42,0.2)', transition: 'all 0.3s'
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'none'}
        >
          <i className="ph ph-plus-circle"></i> Tambah Tagihan
        </button>
      </div>

      <div style={{
        background: 'var(--glass-bg)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(255,255,255,0.8)', borderRadius: '24px', padding: '24px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.03)'
      }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--color-text)' }}>Memuat data keuangan...</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', minWidth: '800px', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                  <th style={{ padding: '16px', color: 'var(--color-text)', fontSize: '0.85rem', fontWeight: '700' }}>MAHASISWA</th>
                  <th style={{ padding: '16px', color: 'var(--color-text)', fontSize: '0.85rem', fontWeight: '700' }}>DESKRIPSI TAGIHAN</th>
                  <th style={{ padding: '16px', color: 'var(--color-text)', fontSize: '0.85rem', fontWeight: '700' }}>NOMINAL</th>
                  <th style={{ padding: '16px', color: 'var(--color-text)', fontSize: '0.85rem', fontWeight: '700' }}>JATUH TEMPO</th>
                  <th style={{ padding: '16px', color: 'var(--color-text)', fontSize: '0.85rem', fontWeight: '700' }}>STATUS</th>
                  <th style={{ padding: '16px', color: 'var(--color-text)', fontSize: '0.85rem', fontWeight: '700' }}>AKSI</th>
                </tr>
              </thead>
              <tbody>
                {billings.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '32px', color: 'var(--color-text)' }}>Belum ada tagihan.</td>
                  </tr>
                ) : billings.map((billing) => (
                  <tr key={billing.id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.3s' }}>
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
                      <div style={{ display: 'flex', gap: '8px' }}>
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
                            background: 'var(--glass-bg)', color: 'var(--color-text)', border: 'none', padding: '8px', 
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
        <div style={{
          position: 'fixed', inset: 0, background: 'var(--glass-bg)', backdropFilter: 'blur(8px)',
          display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999, padding: '24px'
        }}>
          <div style={{
            background: 'var(--color-bg)', borderRadius: '24px', width: '100%', maxWidth: '500px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)', overflow: 'hidden',
            animation: 'fadeSlideUp 0.3s ease-out'
          }}>
            <div style={{ padding: '24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
                  style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #cbd5e1', outline: 'none' }}
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
                  style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #cbd5e1', outline: 'none' }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: 'var(--color-text)', marginBottom: '8px' }}>Jatuh Tempo</label>
                <input 
                  type="date" 
                  value={formData.due_date} 
                  onChange={(e) => setFormData({...formData, due_date: e.target.value})}
                  required
                  style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #cbd5e1', outline: 'none' }}
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
                width: '100%', background: '#0891b2', color: 'white', border: 'none', 
                padding: '14px', borderRadius: '12px', fontWeight: '800', fontSize: '1rem',
                cursor: 'pointer', boxShadow: '0 4px 15px rgba(8,145,178,0.3)', transition: 'all 0.3s'
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
