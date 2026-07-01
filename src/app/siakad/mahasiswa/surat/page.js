"use client";
import { useState } from 'react';

export default function SuratAdministrasiPage() {
  const [requests, setRequests] = useState([
    { id: 1, type: 'Surat Keterangan Aktif Kuliah', date: '10 Mei 2026', status: 'Selesai', note: 'Sudah dapat diambil di BAAK' },
    { id: 2, type: 'Pengajuan Cuti Akademik', date: '28 Juni 2026', status: 'Diproses', note: 'Menunggu persetujuan Dekan' }
  ]);

  const handleAjukan = async () => {
    const formData = await window.toast.form('Ajukan Surat Baru', [
      { name: 'jenis', label: 'Jenis Surat / Layanan', type: 'text', placeholder: 'Contoh: Surat Keterangan Aktif Kuliah' },
      { name: 'alasan', label: 'Keperluan / Alasan', type: 'textarea' }
    ]);

    if(formData && formData.jenis) {
      setRequests([
        { id: Date.now(), type: formData.jenis, date: new Date().toLocaleDateString('id-ID', {day: 'numeric', month: 'long', year:'numeric'}), status: 'Pending', note: 'Menunggu verifikasi admin' },
        ...requests
      ]);
      window.toast('Pengajuan berhasil dikirim!');
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--color-text)', margin: '0 0 8px 0' }}>Surat & Administrasi</h1>
          <p style={{ color: 'var(--color-muted)', margin: 0 }}>Ajukan surat keterangan dan layanan administrasi akademik.</p>
        </div>
        <button onClick={handleAjukan} style={{ background: '#4f46e5', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 10px rgba(79,70,229,0.3)' }}>
          <i className="ph ph-plus" style={{ marginRight: '8px' }}></i> Ajukan Surat Baru
        </button>
      </div>

      <div style={{ background: 'var(--color-bg)', borderRadius: '16px', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
        <div className="overflow-x-auto">
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'var(--glass-bg)' }}>
                <th style={{ padding: '16px', borderBottom: '2px solid var(--color-border)', color: 'var(--color-text)', fontWeight: 'bold' }}>Tanggal</th>
                <th style={{ padding: '16px', borderBottom: '2px solid var(--color-border)', color: 'var(--color-text)', fontWeight: 'bold' }}>Jenis Pengajuan</th>
                <th style={{ padding: '16px', borderBottom: '2px solid var(--color-border)', color: 'var(--color-text)', fontWeight: 'bold' }}>Status</th>
                <th style={{ padding: '16px', borderBottom: '2px solid var(--color-border)', color: 'var(--color-text)', fontWeight: 'bold' }}>Catatan</th>
              </tr>
            </thead>
            <tbody>
              {requests.map(req => (
                <tr key={req.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={{ padding: '16px', color: 'var(--color-muted)' }}>{req.date}</td>
                  <td style={{ padding: '16px', color: 'var(--color-text)', fontWeight: 'bold' }}>{req.type}</td>
                  <td style={{ padding: '16px' }}>
                    <span style={{ 
                      padding: '4px 12px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 'bold',
                      background: req.status === 'Selesai' ? 'rgba(16, 185, 129, 0.1)' : req.status === 'Diproses' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                      color: req.status === 'Selesai' ? '#10b981' : req.status === 'Diproses' ? '#3b82f6' : '#f59e0b',
                    }}>
                      {req.status}
                    </span>
                  </td>
                  <td style={{ padding: '16px', color: 'var(--color-muted)' }}>{req.note}</td>
                </tr>
              ))}
              {requests.length === 0 && (
                <tr>
                  <td colSpan="4" style={{ padding: '32px', textAlign: 'center', color: 'var(--color-muted)' }}>Belum ada riwayat pengajuan.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
