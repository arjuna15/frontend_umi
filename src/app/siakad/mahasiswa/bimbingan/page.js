"use client";
import { useState } from 'react';

export default function BimbinganAkademikPage() {
  const [message, setMessage] = useState('');
  
  const chatHistory = [
    { sender: 'dosen', text: 'KRS kamu ada yang bentrok ya di hari Senin. Tolong direvisi.', time: 'Kemarin, 14:30' },
    { sender: 'mahasiswa', text: 'Baik Pak, untuk penggantinya apakah saya bisa mengambil mata kuliah pilihan?', time: 'Kemarin, 14:45' },
    { sender: 'dosen', text: 'Bisa, asalkan total SKS tidak melebihi 24.', time: 'Hari ini, 08:00' },
  ];

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #4c0519 100%)', borderRadius: '24px', padding: '40px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(196,30,58,0.15)', filter: 'blur(40px)' }}></div>
          <div style={{ position: 'absolute', bottom: '-20px', left: '30%', width: '150px', height: '150px', borderRadius: '50%', background: 'rgba(99,102,241,0.1)', filter: 'blur(30px)' }}></div>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', margin: '0 0 8px 0', letterSpacing: '0.1em', textTransform: 'uppercase' }}>SIAKAD — MAHASISWA</p>
            <h1 style={{ color: 'white', fontSize: '2.2rem', fontWeight: '800', margin: '0 0 8px 0', letterSpacing: '-0.03em' }}>Bimbingan Akademik</h1>
            <p style={{ color: 'rgba(255,255,255,0.6)', margin: 0 }}>Konsultasi rencana studi dan akademik dengan Dosen Wali Anda.</p>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        
        {/* Info Dosen Wali */}
        <div style={{ background: 'var(--color-bg)', borderRadius: '16px', border: '1px solid var(--color-border)', padding: '24px' }}>
          <h3 style={{ margin: '0 0 16px 0', color: 'var(--color-text)', fontSize: '1.2rem', fontWeight: 'bold' }}>Profil Dosen Wali</h3>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#4f46e5', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 'bold' }}>
              SA
            </div>
            <div>
              <h4 style={{ margin: '0 0 4px 0', color: 'var(--color-text)', fontSize: '1.1rem' }}>Siti Aminah, M.Sc.</h4>
              <p style={{ margin: 0, color: 'var(--color-muted)', fontSize: '0.9rem' }}>NIDN. 0415088201</p>
            </div>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '12px', borderBottom: '1px solid var(--color-border)' }}>
              <span style={{ color: 'var(--color-muted)' }}>Status KRS</span>
              <span style={{ color: '#ef4444', fontWeight: 'bold' }}>Ditolak (Butuh Revisi)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '12px', borderBottom: '1px solid var(--color-border)' }}>
              <span style={{ color: 'var(--color-muted)' }}>Batas Persetujuan</span>
              <span style={{ color: 'var(--color-text)', fontWeight: 'bold' }}>25 Agustus 2026</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--color-muted)' }}>SKS Disetujui</span>
              <span style={{ color: 'var(--color-text)', fontWeight: 'bold' }}>0 / 24</span>
            </div>
          </div>
        </div>

        {/* Chat log */}
        <div style={{ background: 'var(--color-bg)', borderRadius: '16px', border: '1px solid var(--color-border)', display: 'flex', flexDirection: 'column', height: '500px' }}>
          <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--color-border)', background: 'var(--glass-bg)' }}>
            <h3 style={{ margin: 0, color: 'var(--color-text)', fontSize: '1.1rem', fontWeight: 'bold' }}>Ruang Konsultasi</h3>
          </div>
          
          <div style={{ flex: 1, padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {chatHistory.map((chat, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: chat.sender === 'mahasiswa' ? 'flex-end' : 'flex-start' }}>
                <div style={{ 
                  background: chat.sender === 'mahasiswa' ? '#4f46e5' : 'var(--glass-bg)',
                  color: chat.sender === 'mahasiswa' ? 'white' : 'var(--color-text)',
                  padding: '12px 16px', borderRadius: '12px', maxWidth: '80%',
                  border: chat.sender === 'mahasiswa' ? 'none' : '1px solid var(--color-border)'
                }}>
                  {chat.text}
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-muted)', marginTop: '4px' }}>{chat.time}</span>
              </div>
            ))}
          </div>
          
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              if(message.trim()) {
                 window.toast('Pesan berhasil dikirim!');
                 setMessage('');
              }
            }}
            style={{ padding: '16px', borderTop: '1px solid var(--color-border)', background: 'var(--glass-bg)', display: 'flex', gap: '12px' }}
          >
            <input 
              type="text" 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tulis pesan ke Dosen Wali..." 
              style={{ flex: 1, padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--color-border)', background: 'var(--color-bg)', color: 'var(--color-text)', outline: 'none' }}
            />
            <button type="submit" style={{ background: '#4f46e5', color: 'white', border: 'none', padding: '0 20px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 10px rgba(79,70,229,0.3)' }}>
              Kirim
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
