"use client";
import { useState } from 'react';

export default function JadwalKalenderPage() {
  const [activeTab, setActiveTab] = useState('jadwal'); // 'jadwal' or 'kalender'

  const schedule = [
    { day: 'Senin', time: '08:00 - 10:30', course: 'Algoritma & Pemrograman', room: 'Lab Komputer 1', dosen: 'Dr. Budi Santoso' },
    { day: 'Senin', time: '13:00 - 15:30', course: 'Kalkulus I', room: 'Ruang 102', dosen: 'Siti Aminah, M.Sc.' },
    { day: 'Selasa', time: '09:00 - 11:30', course: 'Fisika Dasar', room: 'Ruang 205', dosen: 'Agus Pratama, Ph.D.' },
    { day: 'Rabu', time: '10:00 - 12:30', course: 'Bahasa Inggris', room: 'Ruang 301', dosen: 'Diana Larasati, M.A.' },
    { day: 'Kamis', time: '08:00 - 10:30', course: 'Pengantar Sistem Informasi', room: 'Ruang 105', dosen: 'Hendra Wijaya, M.Kom.' },
    { day: 'Jumat', time: '13:30 - 16:00', course: 'Pendidikan Agama', room: 'Aula Utama', dosen: 'Ustadz Hasanuddin' },
  ];

  const calendarEvents = [
    { date: '1 - 15 Agustus 2026', event: 'Masa Pembayaran UKT Semester Ganjil', type: 'finance' },
    { date: '16 - 20 Agustus 2026', event: 'Pengisian KRS Online', type: 'academic' },
    { date: '21 - 25 Agustus 2026', event: 'Masa Perubahan KRS (PKRS)', type: 'academic' },
    { date: '1 September 2026', event: 'Awal Perkuliahan Semester Ganjil', type: 'academic' },
    { date: '18 - 29 Oktober 2026', event: 'Ujian Tengah Semester (UTS)', type: 'exam' },
    { date: '15 - 26 Desember 2026', event: 'Ujian Akhir Semester (UAS)', type: 'exam' },
  ];

  const getEventIcon = (type) => {
    switch(type) {
      case 'finance': return <i className="ph ph-wallet" style={{ color: '#f59e0b', fontSize: '1.2rem' }}></i>;
      case 'academic': return <i className="ph ph-books" style={{ color: '#3b82f6', fontSize: '1.2rem' }}></i>;
      case 'exam': return <i className="ph ph-exam" style={{ color: '#ef4444', fontSize: '1.2rem' }}></i>;
      default: return <i className="ph ph-calendar" style={{ color: 'var(--color-muted)', fontSize: '1.2rem' }}></i>;
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--color-text)', margin: '0 0 8px 0' }}>Jadwal & Kalender</h1>
          <p style={{ color: 'var(--color-muted)', margin: 0 }}>Lihat jadwal mingguan dan kalender akademik Anda.</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', borderBottom: '1px solid var(--color-border)', paddingBottom: '16px' }}>
        <button 
          onClick={() => setActiveTab('jadwal')}
          style={{ 
            background: activeTab === 'jadwal' ? '#4f46e5' : 'var(--glass-bg)', 
            color: activeTab === 'jadwal' ? 'white' : 'var(--color-text)', 
            border: activeTab === 'jadwal' ? 'none' : '1px solid var(--color-border)', 
            padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer',
            boxShadow: activeTab === 'jadwal' ? '0 4px 10px rgba(79,70,229,0.3)' : 'none',
            transition: 'all 0.2s'
          }}>
          <i className="ph ph-calendar-blank" style={{ marginRight: '8px' }}></i> Jadwal Kuliah Mingguan
        </button>
        <button 
          onClick={() => setActiveTab('kalender')}
          style={{ 
            background: activeTab === 'kalender' ? '#4f46e5' : 'var(--glass-bg)', 
            color: activeTab === 'kalender' ? 'white' : 'var(--color-text)', 
            border: activeTab === 'kalender' ? 'none' : '1px solid var(--color-border)', 
            padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer',
            boxShadow: activeTab === 'kalender' ? '0 4px 10px rgba(79,70,229,0.3)' : 'none',
            transition: 'all 0.2s'
          }}>
          <i className="ph ph-calendar-check" style={{ marginRight: '8px' }}></i> Kalender Akademik
        </button>
      </div>

      {activeTab === 'jadwal' && (
        <div style={{ background: 'var(--color-bg)', borderRadius: '16px', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
          <div className="overflow-x-auto">
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: 'var(--glass-bg)' }}>
                  <th style={{ padding: '16px', borderBottom: '2px solid var(--color-border)', color: 'var(--color-text)', fontWeight: 'bold' }}>Hari</th>
                  <th style={{ padding: '16px', borderBottom: '2px solid var(--color-border)', color: 'var(--color-text)', fontWeight: 'bold' }}>Jam</th>
                  <th style={{ padding: '16px', borderBottom: '2px solid var(--color-border)', color: 'var(--color-text)', fontWeight: 'bold' }}>Mata Kuliah</th>
                  <th style={{ padding: '16px', borderBottom: '2px solid var(--color-border)', color: 'var(--color-text)', fontWeight: 'bold' }}>Dosen</th>
                  <th style={{ padding: '16px', borderBottom: '2px solid var(--color-border)', color: 'var(--color-text)', fontWeight: 'bold' }}>Ruang</th>
                </tr>
              </thead>
              <tbody>
                {schedule.map((item, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: '16px', color: 'var(--color-text)', fontWeight: 'bold' }}>{item.day}</td>
                    <td style={{ padding: '16px', color: 'var(--color-muted)' }}>{item.time}</td>
                    <td style={{ padding: '16px', color: 'var(--color-text)' }}>{item.course}</td>
                    <td style={{ padding: '16px', color: 'var(--color-muted)' }}>{item.dosen}</td>
                    <td style={{ padding: '16px', color: 'var(--color-text)' }}>
                      <span style={{ background: 'var(--glass-bg)', padding: '4px 12px', borderRadius: '6px', fontSize: '0.85rem', border: '1px solid var(--color-border)' }}>
                        {item.room}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'kalender' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {calendarEvents.map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '16px', background: 'var(--color-bg)', padding: '20px', borderRadius: '16px', border: '1px solid var(--color-border)' }}>
              <div style={{ background: 'var(--glass-bg)', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {getEventIcon(item.type)}
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: '0 0 4px 0', fontSize: '1.1rem', color: 'var(--color-text)' }}>{item.event}</h3>
                <p style={{ margin: 0, color: 'var(--color-muted)', fontSize: '0.9rem' }}>{item.date}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
