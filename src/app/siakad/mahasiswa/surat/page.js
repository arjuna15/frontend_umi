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
      <div style={{ 
        background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #4c0519 100%)',
        borderRadius: '24px', padding: '40px', marginBottom: '32px', position: 'relative', overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(196,30,58,0.15)', filter: 'blur(40px)' , flexShrink: 0 }}></div>
        <div style={{ position: 'absolute', bottom: '-20px', left: '30%', width: '150px', height: '150px', borderRadius: '50%', background: 'rgba(99,102,241,0.1)', filter: 'blur(30px)' , flexShrink: 0 }}></div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', margin: '0 0 8px 0', letterSpacing: '0.1em', textTransform: 'uppercase' }}>SIAKAD — MAHASISWA</p>
          <div className="siakad-modal-header">
            <div>
              <h1 style={{ color: 'white', fontSize: '2.2rem', fontWeight: '800', margin: '0 0 8px 0', letterSpacing: '-0.03em' }}>Surat & Administrasi</h1>
              <p style={{ color: 'rgba(255,255,255,0.6)', margin: 0 }}>Ajukan surat keterangan dan layanan administrasi akademik.</p>
            </div>
            <button onClick={handleAjukan} style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', padding: '10px 20px', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', backdropFilter: 'blur(10px)' }}>
              <i className="ph ph-plus" style={{ marginRight: '8px' }}></i> Ajukan Surat Baru
            </button>
          </div>
        </div>
      </div>

      <div className="siakad-card" style={{ overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="siakad-table">
            <thead>
              <tr>
                <th>Tanggal</th>
                <th>Jenis Pengajuan</th>
                <th>Status</th>
                <th>Catatan</th>
              </tr>
            </thead>
            <tbody>
              {requests.map(req => (
                <tr key={req.id}>
                  <td style={{ color: 'var(--color-muted)' }}>{req.date}</td>
                  <td style={{ fontWeight: 'bold' }}>{req.type}</td>
                  <td>
                    <span className="siakad-badge" style={{ 
                      background: req.status === 'Selesai' ? 'rgba(16, 185, 129, 0.1)' : req.status === 'Diproses' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                      color: req.status === 'Selesai' ? '#10b981' : req.status === 'Diproses' ? '#3b82f6' : '#f59e0b'
                    }}>
                      {req.status}
                    </span>
                  </td>
                  <td style={{ color: 'var(--color-muted)' }}>{req.note}</td>
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
