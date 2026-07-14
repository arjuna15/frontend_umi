"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function KeuanganPage() {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchDashboard = async () => {
    const token = localStorage.getItem('siakad_token');
    if (!token) return router.push('/siakad/login');

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
      const res = await fetch(`${apiUrl}/siakad/dashboard`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to fetch');
      const result = await res.json();
      if (result.user.role !== 'mahasiswa') return router.push('/siakad/login');
      setData(result);
    } catch (err) {
      router.push('/siakad/login');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, [router]);

  const handlePay = async (id) => {
    const token = localStorage.getItem('siakad_token');
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
    try {
      const res = await fetch(`${apiUrl}/siakad/billing/${id}/pay`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        window.toast('Pembayaran berhasil dikonfirmasi (Simulasi).');
        fetchDashboard();
      } else {
        window.toast('Gagal memproses pembayaran');
      }
    } catch (err) {
      console.error(err);
    }
  };


  if (loading || !data) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyItems: 'center', height: '100%', color: 'var(--color-muted)' }}>
      <i className="ph ph-spinner ph-spin" style={{ fontSize: '2rem', marginRight: '10px' }}></i> Memuat data keuangan...
    </div>
  );

  return (
    <div>
      <div className="siakad-page-header">
        <div className="siakad-page-header-glow"></div>
        <div className="siakad-page-header-grid"></div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', margin: '0 0 8px 0', letterSpacing: '0.1em', textTransform: 'uppercase' }}>SIAKAD — MAHASISWA</p>
          <h1 style={{ color: 'white', fontSize: '2.2rem', fontWeight: '800', margin: '0 0 8px 0', letterSpacing: '-0.03em' }}>Tagihan & Keuangan</h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', margin: 0 }}>Cek status pembayaran SPP/UKT Anda di sini.</p>
        </div>
      </div>

      <div className="siakad-card" style={{ padding: '0px', overflow: 'hidden' }}>
        <div style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', borderBottom: '1px solid var(--color-border)' }}>
          <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--color-text)', fontWeight: 'bold' }}>Daftar Tagihan Anda</h3>
          <div style={{ position: 'relative', width: '300px' }}>
            <i className="ph ph-magnifying-glass" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-muted)', fontSize: '1.1rem' }}></i>
            <input type="text" className="siakad-input" placeholder="Cari tagihan, status..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ width: '100%', paddingLeft: '38px', color: 'var(--color-text)', fontSize: '0.9rem' }} />
          </div>
        </div>
        
        {data.billings && data.billings.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table className="siakad-table" style={{ width: '100%', minWidth: '800px', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: 'var(--glass-bg)', color: 'var(--color-muted)', borderBottom: '1px solid var(--color-border)', textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '0.05em' }}>
                  <th style={{ padding: '16px' }}>Deskripsi Tagihan</th>
                  <th style={{ padding: '16px' }}>Jatuh Tempo</th>
                  <th style={{ padding: '16px' }}>Nominal (Rp)</th>
                  <th style={{ padding: '16px' }}>Status</th>
                  <th style={{ padding: '16px' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {(() => {
                  const filtered = data.billings.filter(bill => {
                    const query = searchQuery.toLowerCase().trim();
                    if (!query) return true;
                    return (
                      bill.description?.toLowerCase().includes(query) ||
                      bill.status?.toLowerCase().includes(query)
                    );
                  });

                  if (filtered.length === 0) {
                    return (
                      <tr>
                        <td colSpan="5" style={{ padding: '32px', textAlign: 'center', color: 'var(--color-muted)' }}>Tidak ada data tagihan yang sesuai.</td>
                      </tr>
                    );
                  }

                  return filtered.map((bill, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid var(--color-border)', transition: 'all 0.2s' }} onMouseEnter={(e)=>e.currentTarget.style.background='var(--glass-bg)'} onMouseLeave={(e)=>e.currentTarget.style.background='transparent'}>
                      <td style={{ padding: '16px', fontWeight: '500', color: 'var(--color-text)' }}>{bill.description}</td>
                      <td style={{ padding: '16px' }}>{bill.due_date}</td>
                      <td style={{ padding: '16px', fontWeight: 'bold', color: 'var(--color-text)' }}>{new Intl.NumberFormat('id-ID').format(bill.amount)}</td>
                      <td style={{ padding: '16px' }}>
                        <span className="siakad-badge" style={{
                          background: bill.status === 'Lunas' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                          color: bill.status === 'Lunas' ? '#10b981' : '#ef4444'
                        }}>
                          {bill.status}
                        </span>
                      </td>
                      <td style={{ padding: '16px' }}>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          {bill.status !== 'Lunas' ? (
                            <button onClick={() => handlePay(bill.id)} style={{ padding: '8px 14px', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '0 2px 6px rgba(16, 185, 129, 0.3)' }}>
                              <i className="ph ph-wallet"></i> Bayar
                            </button>
                          ) : (
                            <button onClick={() => window.print()} style={{ padding: '6px 12px', background: '#10b981', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <i className="ph ph-download-simple"></i> Bukti Bayar
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ));
                })()}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '64px 0' }}>
            <i className="ph ph-check-circle" style={{ fontSize: '4rem', color: '#10b981', marginBottom: '16px' }}></i>
            <h3 style={{ margin: '0 0 8px 0', color: 'var(--color-text)', fontSize: '1.2rem', fontWeight: 'bold' }}>Semua Lunas!</h3>
            <p style={{ margin: 0, color: 'var(--color-muted)' }}>Tidak ada tagihan yang harus dibayar saat ini. Terima kasih telah tepat waktu.</p>
          </div>
        )}
      </div>
    </div>
  );
}
