'use client';
import { useState, useEffect } from 'react';
import CustomSelect from '../../components/CustomSelect';

export default function AdminPengaturan() {
  const [krsOpen, setKrsOpen] = useState(true);
  const [khsOpen, setKhsOpen] = useState(true);
  const [nilaiOpen, setNilaiOpen] = useState(true);
  const [semester, setSemester] = useState('Ganjil 2026/2027');

  const [coordBintaro, setCoordBintaro] = useState('-6.2758, 106.7405');
  const [coordPasarMinggu, setCoordPasarMinggu] = useState('-6.2842, 106.8442');
  
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  useEffect(() => {
    const savedKrs = localStorage.getItem('siakad_krs_open');
    const savedSemester = localStorage.getItem('siakad_semester');
    const savedBintaro = localStorage.getItem('siakad_coord_bintaro');
    const savedPasarMinggu = localStorage.getItem('siakad_coord_pasar_minggu');
    
    if (savedKrs !== null) {
      setKrsOpen(savedKrs === 'true');
    }
    if (savedSemester) {
      setSemester(savedSemester);
    }
    if (savedBintaro) {
      setCoordBintaro(savedBintaro);
    }
    if (savedPasarMinggu) {
      setCoordPasarMinggu(savedPasarMinggu);
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('siakad_krs_open', krsOpen);
    localStorage.setItem('siakad_khs_open', khsOpen);
    localStorage.setItem('siakad_nilai_open', nilaiOpen);
    localStorage.setItem('siakad_semester', semester);
    
    const bintaroVal = document.getElementById('coordBintaro').value;
    const pmVal = document.getElementById('coordPasarMinggu').value;
    
    localStorage.setItem('siakad_coord_bintaro', bintaroVal);
    localStorage.setItem('siakad_coord_pasar_minggu', pmVal);
    setCoordBintaro(bintaroVal);
    setCoordPasarMinggu(pmVal);

    setIsConfirmModalOpen(false);
    window.toast('Pengaturan sistem berhasil disimpan permanen!');
  };

  const semesterOptions = [
    { value: 'Ganjil 2026/2027', label: 'Ganjil 2026/2027', icon: 'ph ph-calendar' },
    { value: 'Genap 2026/2027', label: 'Genap 2026/2027', icon: 'ph ph-calendar' },
    { value: 'Ganjil 2027/2028', label: 'Ganjil 2027/2028', icon: 'ph ph-calendar' }
  ];

  return (
    <div className="fade-in" style={{ paddingBottom: '40px' }}>
      <div style={{ 
        background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #4c0519 100%)',
        borderRadius: '24px', padding: '40px', marginBottom: '32px', position: 'relative', overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(196,30,58,0.15)', filter: 'blur(40px)' , flexShrink: 0 }}></div>
        <div style={{ position: 'absolute', bottom: '-20px', left: '30%', width: '150px', height: '150px', borderRadius: '50%', background: 'rgba(99,102,241,0.1)', filter: 'blur(30px)' , flexShrink: 0 }}></div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', margin: '0 0 8px 0', letterSpacing: '0.1em', textTransform: 'uppercase' }}>SIAKAD — ADMIN</p>
          <h1 style={{ color: 'white', fontSize: '2.2rem', fontWeight: '800', margin: '0 0 8px 0', letterSpacing: '-0.03em', display: 'flex', alignItems: 'center', gap: '12px' }}>
            Pengaturan Sistem <i className="ph ph-gear-six"></i>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', margin: 0 }}>Kelola periode akademik dan status operasional sistem SIAKAD dengan aman.</p>
        </div>
      </div>

      <div className="siakad-card stagger-1" style={{ width: '90%', maxWidth: '650px', maxHeight: '90vh', overflowY: 'auto', padding: '32px' }}>
        
        {/* Section 1: Periode Akademik */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', borderBottom: '2px solid var(--color-border)', paddingBottom: '12px' }}>
            <div style={{ background: 'var(--glass-bg)', padding: '8px', borderRadius: '10px', color: 'var(--color-text)', display: 'flex' }}>
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

        {/* Section 2: Kontrol Sistem Akademik */}
        <div style={{ marginBottom: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', borderBottom: '2px solid var(--color-border)', paddingBottom: '12px' }}>
            <div style={{ background: 'var(--glass-bg)', padding: '8px', borderRadius: '10px', color: 'var(--color-text)', display: 'flex' }}>
              <i className="ph ph-sliders-horizontal" style={{ fontSize: '1.2rem' }}></i>
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--color-text)', margin: 0 }}>
              Kontrol Sistem Akademik
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ 
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
              padding: '20px', background: 'var(--glass-bg)', borderRadius: '16px', 
              border: '1px solid var(--color-border)', transition: 'all 0.2s'
            }}>
              <div>
                <div style={{ fontWeight: 700, color: 'var(--color-text)', fontSize: '1.05rem', marginBottom: '4px' }}>Pengisian KRS Online</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--color-muted)', lineHeight: '1.4' }}>Buka akses bagi mahasiswa untuk mulai memilih <br/>mata kuliah semester ini.</div>
              </div>
              
              <div onClick={() => setKrsOpen(!krsOpen)} style={{ width: '64px', height: '36px', borderRadius: '20px', background: krsOpen ? '#10b981' : '#e5e7eb', position: 'relative', cursor: 'pointer', transition: 'background 0.3s ease' }}>
                <div style={{ width: '28px', height: '28px', background: 'var(--color-bg)', borderRadius: '50%', position: 'absolute', top: '4px', left: krsOpen ? '32px' : '4px', transition: 'left 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)', boxShadow: '0 2px 5px rgba(0,0,0,0.2)' , flexShrink: 0 }} />
              </div>
            </div>

            <div style={{ 
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
              padding: '20px', background: 'var(--glass-bg)', borderRadius: '16px', 
              border: '1px solid var(--color-border)', transition: 'all 0.2s'
            }}>
              <div>
                <div style={{ fontWeight: 700, color: 'var(--color-text)', fontSize: '1.05rem', marginBottom: '4px' }}>Akses Cetak KHS</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--color-muted)', lineHeight: '1.4' }}>Izinkan mahasiswa melihat dan mencetak Kartu<br/>Hasil Studi (KHS).</div>
              </div>
              
              <div onClick={() => setKhsOpen(!khsOpen)} style={{ width: '64px', height: '36px', borderRadius: '20px', background: khsOpen ? '#10b981' : '#e5e7eb', position: 'relative', cursor: 'pointer', transition: 'background 0.3s ease' }}>
                <div style={{ width: '28px', height: '28px', background: 'var(--color-bg)', borderRadius: '50%', position: 'absolute', top: '4px', left: khsOpen ? '32px' : '4px', transition: 'left 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)', boxShadow: '0 2px 5px rgba(0,0,0,0.2)' , flexShrink: 0 }} />
              </div>
            </div>

            <div style={{ 
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
              padding: '20px', background: 'var(--glass-bg)', borderRadius: '16px', 
              border: '1px solid var(--color-border)', transition: 'all 0.2s'
            }}>
              <div>
                <div style={{ fontWeight: 700, color: 'var(--color-text)', fontSize: '1.05rem', marginBottom: '4px' }}>Input Nilai Dosen</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--color-muted)', lineHeight: '1.4' }}>Buka portal bagi dosen untuk memasukkan dan<br/>mengubah nilai mahasiswa.</div>
              </div>
              
              <div onClick={() => setNilaiOpen(!nilaiOpen)} style={{ width: '64px', height: '36px', borderRadius: '20px', background: nilaiOpen ? '#10b981' : '#e5e7eb', position: 'relative', cursor: 'pointer', transition: 'background 0.3s ease' }}>
                <div style={{ width: '28px', height: '28px', background: 'var(--color-bg)', borderRadius: '50%', position: 'absolute', top: '4px', left: nilaiOpen ? '32px' : '4px', transition: 'left 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)', boxShadow: '0 2px 5px rgba(0,0,0,0.2)' , flexShrink: 0 }} />
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Geofencing Kampus */}
        <div style={{ marginBottom: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', borderBottom: '2px solid var(--color-border)', paddingBottom: '12px' }}>
            <div style={{ background: 'var(--glass-bg)', padding: '8px', borderRadius: '10px', color: 'var(--color-text)', display: 'flex' }}>
              <i className="ph ph-map-pin" style={{ fontSize: '1.2rem' }}></i>
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--color-text)', margin: 0 }}>
              Lokasi Geofencing Kampus
            </h3>
          </div>
          
          <p style={{ fontSize: '0.9rem', color: 'var(--color-muted)', marginBottom: '16px' }}>Atur titik koordinat pusat kampus untuk validasi kehadiran offline (radius jarak aman: 20km untuk uji coba).</p>

          <div style={{ display: 'grid', gap: '16px', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: 'var(--color-text)', fontSize: '0.9rem' }}>Kampus Bintaro (Lat, Lng)</label>
              <input 
                type="text" 
                defaultValue={coordBintaro}
                key={`bintaro-${coordBintaro}`}
                id="coordBintaro"
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-bg)', color: 'var(--color-text)', fontSize: '0.95rem' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: 'var(--color-text)', fontSize: '0.9rem' }}>Kampus Ps. Minggu (Lat, Lng)</label>
              <input 
                type="text" 
                defaultValue={coordPasarMinggu}
                key={`pm-${coordPasarMinggu}`}
                id="coordPasarMinggu"
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-bg)', color: 'var(--color-text)', fontSize: '0.95rem' }}
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <button 
          onClick={() => setIsConfirmModalOpen(true)}
          style={{ 
            background: 'linear-gradient(135deg, #b91c1c 0%, #991b1b 100%)', 
            color: 'white', border: 'none', padding: '16px 24px', 
            borderRadius: '12px', fontWeight: 700, cursor: 'pointer', width: '100%',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
            fontSize: '1.05rem', boxShadow: '0 4px 15px rgba(185, 28, 28, 0.3)',
            transition: 'transform 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <i className="ph ph-floppy-disk" style={{ fontSize: '1.3rem' }}></i> Simpan Konfigurasi Sistem
        </button>
      </div>

      {isConfirmModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999 }}>
          <div className="siakad-card fade-in" style={{ padding: '32px', width: '90%', maxWidth: '400px', maxHeight: '90vh', overflowY: 'auto', textAlign: 'center' }}>
            <div style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', margin: '0 auto 20px auto' , flexShrink: 0 }}>
              <i className="ph ph-warning-circle"></i>
            </div>
            <h2 style={{ fontSize: '1.25rem', margin: '0 0 12px 0' }}>Konfirmasi Perubahan</h2>
            <p style={{ color: 'var(--color-muted)', fontSize: '0.9rem', marginBottom: '24px' }}>Apakah Anda yakin ingin menyimpan perubahan konfigurasi sistem ini? Perubahan akan langsung berdampak pada seluruh pengguna.</p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setIsConfirmModalOpen(false)} style={{ flex: 1, padding: '12px', background: 'transparent', border: '1px solid var(--color-border)', borderRadius: '12px', cursor: 'pointer', fontWeight: 600, color: 'var(--color-text)' }}>Batal</button>
              <button onClick={handleSave} style={{ flex: 1, padding: '12px', background: '#3b82f6', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 600, color: 'white' }}>Ya, Simpan</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
