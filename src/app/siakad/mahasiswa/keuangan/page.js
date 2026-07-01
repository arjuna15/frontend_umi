"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function KeuanganPage() {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

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
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--color-text)', margin: '0 0 8px 0' }}>Tagihan & Keuangan</h1>
        <p style={{ color: 'var(--color-muted)', margin: 0 }}>Cek status pembayaran SPP/UKT Anda di sini.</p>
      </div>

      <div style={{ background: 'var(--color-bg)', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', border: '1px solid #f3f4f6' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--color-text)', margin: '0 0 20px 0' }}>Daftar Tagihan Anda</h2>
        
        {data.billings && data.billings.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
              <thead>
                <tr style={{ background: 'var(--color-bg)', color: 'var(--color-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  <th style={{ padding: '16px', borderRadius: '8px 0 0 8px', fontWeight: '600' }}>Deskripsi Tagihan</th>
                  <th style={{ padding: '16px', fontWeight: '600' }}>Jatuh Tempo</th>
                  <th style={{ padding: '16px', fontWeight: '600' }}>Nominal (Rp)</th>
                  <th style={{ padding: '16px', fontWeight: '600' }}>Status</th>
                  <th style={{ padding: '16px', borderRadius: '0 8px 8px 0', fontWeight: '600' }}>Aksi</th>
                </tr>
              </thead>
              <tbody style={{ color: 'var(--color-text)', fontSize: '0.95rem' }}>
                {data.billings.map((bill, i) => (
                  <tr key={i} style={{ borderBottom: i === data.billings.length - 1 ? 'none' : '1px solid #f3f4f6' }}>
                    <td style={{ padding: '16px', fontWeight: '500' }}>{bill.description}</td>
                    <td style={{ padding: '16px' }}>{bill.due_date}</td>
                    <td style={{ padding: '16px', fontWeight: 'bold' }}>{new Intl.NumberFormat('id-ID').format(bill.amount)}</td>
                    <td style={{ padding: '16px' }}>
                      <span style={{
                        display: 'inline-block',
                        padding: '4px 12px',
                        borderRadius: '999px',
                        fontSize: '0.85rem',
                        fontWeight: 'bold',
                        background: bill.status === 'Lunas' ? '#ecfdf5' : '#fef2f2',
                        color: bill.status === 'Lunas' ? '#059669' : '#dc2626'
                      }}>
                        {bill.status}
                      </span>
                    </td>
                    <td style={{ padding: '16px', display: 'flex', gap: '8px' }}>
                      {bill.status !== 'Lunas' ? (
                        <button onClick={() => handlePay(bill.id)} style={{ padding: '6px 12px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <i className="ph ph-wallet"></i> Bayar
                        </button>
                      ) : (
                        <button onClick={() => window.print()} style={{ padding: '6px 12px', background: '#10b981', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <i className="ph ph-download-simple"></i> Bukti Bayar
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p style={{ color: 'var(--color-muted)', fontStyle: 'italic' }}>Tidak ada tagihan yang harus dibayar saat ini.</p>
        )}
      </div>
    </div>
  );
}
