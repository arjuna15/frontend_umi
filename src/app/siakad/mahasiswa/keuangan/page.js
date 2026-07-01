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
      <div style={{ 
        background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #4c0519 100%)',
        borderRadius: '24px', padding: '40px', marginBottom: '32px', position: 'relative', overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(196,30,58,0.15)', filter: 'blur(40px)' }}></div>
        <div style={{ position: 'absolute', bottom: '-20px', left: '30%', width: '150px', height: '150px', borderRadius: '50%', background: 'rgba(99,102,241,0.1)', filter: 'blur(30px)' }}></div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', margin: '0 0 8px 0', letterSpacing: '0.1em', textTransform: 'uppercase' }}>SIAKAD — MAHASISWA</p>
          <h1 style={{ color: 'white', fontSize: '2.2rem', fontWeight: '800', margin: '0 0 8px 0', letterSpacing: '-0.03em' }}>Tagihan & Keuangan</h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', margin: 0 }}>Cek status pembayaran SPP/UKT Anda di sini.</p>
        </div>
      </div>

      <div className="siakad-card" style={{ padding: '24px' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--color-text)', margin: '0 0 20px 0' }}>Daftar Tagihan Anda</h2>
        
        {data.billings && data.billings.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table className="siakad-table">
              <thead>
                <tr>
                  <th>Deskripsi Tagihan</th>
                  <th>Jatuh Tempo</th>
                  <th>Nominal (Rp)</th>
                  <th>Status</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {data.billings.map((bill, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: '500' }}>{bill.description}</td>
                    <td>{bill.due_date}</td>
                    <td style={{ fontWeight: 'bold' }}>{new Intl.NumberFormat('id-ID').format(bill.amount)}</td>
                    <td>
                      <span style={{
                        display: 'inline-block',
                        padding: '4px 12px',
                        borderRadius: '999px',
                        fontSize: '0.85rem',
                        fontWeight: 'bold',
                        background: bill.status === 'Lunas' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                        color: bill.status === 'Lunas' ? '#10b981' : '#ef4444'
                      }}>
                        {bill.status}
                      </span>
                    </td>
                    <td style={{ display: 'flex', gap: '8px' }}>
                      {bill.status !== 'Lunas' ? (
                        <button onClick={() => handlePay(bill.id)} style={{ padding: '6px 12px', background: '#0f172a', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
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
