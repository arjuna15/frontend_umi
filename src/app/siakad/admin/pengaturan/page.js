'use client';
import { useState } from 'react';

export default function AdminPengaturan() {
  const [krsOpen, setKrsOpen] = useState(true);
  const [semester, setSemester] = useState('Ganjil 2026/2027');

  const handleSave = () => {
    alert('Pengaturan sistem berhasil disimpan!');
  };

  return (
    <div className="fade-in" style={{ paddingBottom: '40px' }}>
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ margin: '0 0 8px 0', color: '#1f2937', display: 'flex', alignItems: 'center', gap: '10px' }}>
          Pengaturan Sistem & Akademik <i className="ph ph-gear" style={{ color: '#3b82f6' }}></i>
        </h2>
        <p style={{ margin: 0, color: '#6b7280' }}>Kelola periode akademik dan status operasional sistem SIAKAD.</p>
      </div>

      <div className="siakad-card stagger-1" style={{ maxWidth: '600px' }}>
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ fontSize: '1.1rem', color: '#374151', marginBottom: '16px', borderBottom: '1px solid #e5e7eb', paddingBottom: '8px' }}>
            Periode Akademik
          </h3>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#4b5563' }}>Tahun Ajaran Aktif</label>
            <select 
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              style={{ width: '100%', padding: '10px 16px', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none' }}
            >
              <option value="Ganjil 2026/2027">Ganjil 2026/2027</option>
              <option value="Genap 2026/2027">Genap 2026/2027</option>
              <option value="Ganjil 2027/2028">Ganjil 2027/2028</option>
            </select>
          </div>
        </div>

        <div style={{ marginBottom: '32px' }}>
          <h3 style={{ fontSize: '1.1rem', color: '#374151', marginBottom: '16px', borderBottom: '1px solid #e5e7eb', paddingBottom: '8px' }}>
            Kontrol Akses Mahasiswa
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
            <div>
              <div style={{ fontWeight: 600, color: '#1f2937' }}>Pengisian KRS Online</div>
              <div style={{ fontSize: '0.85rem', color: '#6b7280' }}>Buka atau tutup akses mahasiswa untuk mengajukan KRS.</div>
            </div>
            
            {/* Custom Toggle Switch */}
            <div 
              onClick={() => setKrsOpen(!krsOpen)}
              style={{
                width: '56px', height: '32px', borderRadius: '16px', 
                background: krsOpen ? '#10b981' : '#d1d5db',
                position: 'relative', cursor: 'pointer', transition: 'background 0.3s'
              }}
            >
              <div style={{
                width: '24px', height: '24px', background: 'white', borderRadius: '50%',
                position: 'absolute', top: '4px', left: krsOpen ? '28px' : '4px',
                transition: 'left 0.3s', boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
              }} />
            </div>
          </div>
        </div>

        <button 
          onClick={handleSave}
          style={{ 
            background: '#2563eb', color: 'white', border: 'none', padding: '12px 24px', 
            borderRadius: '8px', fontWeight: 600, cursor: 'pointer', width: '100%',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
          }}
        >
          <i className="ph ph-floppy-disk"></i> Simpan Pengaturan
        </button>
      </div>
    </div>
  );
}
