'use client';
import { useState, useEffect } from 'react';
import CustomSelect from '../../components/CustomSelect';

export default function AdminPengaturan() {
  const [krsOpen, setKrsOpen] = useState(true);
  const [semester, setSemester] = useState('Ganjil 2026/2027');

  useEffect(() => {
    const savedKrs = localStorage.getItem('siakad_krs_open');
    const savedSemester = localStorage.getItem('siakad_semester');
    
    if (savedKrs !== null) {
      setKrsOpen(savedKrs === 'true');
    }
    if (savedSemester) {
      setSemester(savedSemester);
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('siakad_krs_open', krsOpen);
    localStorage.setItem('siakad_semester', semester);
    alert('Pengaturan sistem berhasil disimpan permanen!');
  };

  const semesterOptions = [
    { value: 'Ganjil 2026/2027', label: 'Ganjil 2026/2027', icon: 'ph ph-calendar' },
    { value: 'Genap 2026/2027', label: 'Genap 2026/2027', icon: 'ph ph-calendar' },
    { value: 'Ganjil 2027/2028', label: 'Ganjil 2027/2028', icon: 'ph ph-calendar' }
  ];

  return (
    <div className="fade-in" style={{ paddingBottom: '40px' }}>
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ margin: '0 0 8px 0', color: 'var(--color-text)', fontSize: '1.8rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '12px' }}>
          Pengaturan Sistem & Akademik <i className="ph ph-gear-six" style={{ color: '#b91c1c' }}></i>
        </h2>
        <p style={{ margin: 0, color: 'var(--color-muted)', fontSize: '1.05rem' }}>Kelola periode akademik dan status operasional sistem SIAKAD dengan aman.</p>
      </div>

      <div className="siakad-card stagger-1" style={{ 
        maxWidth: '650px', 
        background: 'var(--color-bg)', 
        borderRadius: '24px', 
        padding: '32px', 
        boxShadow: '0 10px 40px -10px rgba(0,0,0,0.08)',
        border: '1px solid rgba(255,255,255,0.6)'
      }}>
        
        {/* Section 1: Periode Akademik */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', borderBottom: '2px solid #f3f4f6', paddingBottom: '12px' }}>
            <div style={{ background: '#fef2f2', padding: '8px', borderRadius: '10px', color: '#b91c1c', display: 'flex' }}>
              <i className="ph ph-calendar-blank" style={{ fontSize: '1.2rem' }}></i>
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--color-text)', margin: 0 }}>
              Periode Akademik
            </h3>
          </div>
          
          <div style={{ marginBottom: '16px', padding: '0 4px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: 'var(--color-muted)', fontSize: '0.95rem' }}>Tahun Ajaran Aktif</label>
            <CustomSelect 
              value={semester}
              onChange={(val) => setSemester(val)}
              options={semesterOptions}
              placeholder="Pilih Semester Aktif"
            />
            <p style={{ margin: '8px 0 0 0', fontSize: '0.8rem', color: 'var(--color-muted)' }}>Perubahan semester aktif akan berdampak pada seluruh modul sistem.</p>
          </div>
        </div>

        {/* Section 2: Kontrol Akses Mahasiswa */}
        <div style={{ marginBottom: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', borderBottom: '2px solid #f3f4f6', paddingBottom: '12px' }}>
            <div style={{ background: '#fef2f2', padding: '8px', borderRadius: '10px', color: '#b91c1c', display: 'flex' }}>
              <i className="ph ph-shield-check" style={{ fontSize: '1.2rem' }}></i>
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--color-text)', margin: 0 }}>
              Kontrol Akses Mahasiswa
            </h3>
          </div>

          <div style={{ 
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
            padding: '20px', background: 'var(--color-bg)', borderRadius: '16px', 
            border: '1px solid #e5e7eb', transition: 'all 0.2s',
            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)'
          }}>
            <div>
              <div style={{ fontWeight: 700, color: 'var(--color-text)', fontSize: '1.05rem', marginBottom: '4px' }}>Pengisian KRS Online</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--color-muted)', lineHeight: '1.4' }}>Buka akses bagi mahasiswa untuk mulai memilih <br/>mata kuliah semester ini.</div>
            </div>
            
            {/* Premium Toggle Switch */}
            <div 
              onClick={() => setKrsOpen(!krsOpen)}
              style={{
                width: '64px', height: '36px', borderRadius: '20px', 
                background: krsOpen ? '#10b981' : '#e5e7eb',
                position: 'relative', cursor: 'pointer', transition: 'background 0.3s ease',
                boxShadow: krsOpen ? 'inset 0 2px 4px rgba(0,0,0,0.1)' : 'inset 0 2px 4px rgba(0,0,0,0.05)'
              }}
            >
              <div style={{
                width: '28px', height: '28px', background: 'var(--color-bg)', borderRadius: '50%',
                position: 'absolute', top: '4px', left: krsOpen ? '32px' : '4px',
                transition: 'left 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)', 
                boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
              }} />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <button 
          onClick={handleSave}
          style={{ 
            background: 'linear-gradient(135deg, #b91c1c 0%, #991b1b 100%)', 
            color: 'white', border: 'none', padding: '16px 24px', 
            borderRadius: '16px', fontWeight: 700, cursor: 'pointer', width: '100%',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
            fontSize: '1.05rem', boxShadow: '0 10px 20px -5px rgba(185, 28, 28, 0.4)',
            transition: 'transform 0.2s, box-shadow 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <i className="ph ph-floppy-disk" style={{ fontSize: '1.3rem' }}></i> Simpan Konfigurasi Sistem
        </button>
      </div>
    </div>
  );
}
