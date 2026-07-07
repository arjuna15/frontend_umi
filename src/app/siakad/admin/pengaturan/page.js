'use client';
import { useState, useEffect } from 'react';

export default function AdminPengaturan() {
  const [krsOpen, setKrsOpen] = useState(true);
  const [khsOpen, setKhsOpen] = useState(true);
  const [nilaiOpen, setNilaiOpen] = useState(true);
  const [semester, setSemester] = useState('');

  const [coordBintaro, setCoordBintaro] = useState('-6.2758, 106.7405');
  const [coordPasarMinggu, setCoordPasarMinggu] = useState('-6.2842, 106.8442');
  
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    const token = localStorage.getItem('siakad_token');
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
    try {
      const res = await fetch(`${apiUrl}/siakad/settings`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.siakad_krs_open !== undefined) setKrsOpen(data.siakad_krs_open === 'true');
        if (data.siakad_khs_open !== undefined) setKhsOpen(data.siakad_khs_open === 'true');
        if (data.siakad_nilai_open !== undefined) setNilaiOpen(data.siakad_nilai_open === 'true');
        if (data.siakad_semester) setSemester(data.siakad_semester);
        if (data.siakad_coord_bintaro) setCoordBintaro(data.siakad_coord_bintaro);
        if (data.siakad_coord_pasar_minggu) setCoordPasarMinggu(data.siakad_coord_pasar_minggu);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    const token = localStorage.getItem('siakad_token');
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
    const bintaroVal = document.getElementById('coordBintaro').value;
    const pmVal = document.getElementById('coordPasarMinggu').value;

    const payload = {
      settings: {
        siakad_krs_open: String(krsOpen),
        siakad_khs_open: String(khsOpen),
        siakad_nilai_open: String(nilaiOpen),
        siakad_semester: semester,
        siakad_coord_bintaro: bintaroVal,
        siakad_coord_pasar_minggu: pmVal
      }
    };

    try {
      const res = await fetch(`${apiUrl}/siakad/settings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        localStorage.setItem('siakad_krs_open', krsOpen);
        localStorage.setItem('siakad_khs_open', khsOpen);
        localStorage.setItem('siakad_nilai_open', nilaiOpen);
        localStorage.setItem('siakad_semester', semester);
        localStorage.setItem('siakad_coord_bintaro', bintaroVal);
        localStorage.setItem('siakad_coord_pasar_minggu', pmVal);
        
        setCoordBintaro(bintaroVal);
        setCoordPasarMinggu(pmVal);
        setIsConfirmModalOpen(false);
        window.toast?.('Pengaturan sistem berhasil disimpan di database global!');
      } else {
        window.toast?.('Gagal menyimpan pengaturan');
      }
    } catch (err) {
      console.error(err);
      window.toast?.('Terjadi kesalahan: ' + err.message);
    }
  };

  if (loading) return <div style={{ padding: '20px', color: 'var(--color-text)' }}>Loading...</div>;

  return (
    <div className="fade-in" style={{ paddingBottom: '40px' }}>
      <div className="siakad-page-header">
        <div className="siakad-page-header-glow"></div>
        <div className="siakad-page-header-grid"></div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', margin: '0 0 8px 0', letterSpacing: '0.1em', textTransform: 'uppercase' }}>SIAKAD — ADMIN</p>
          <h1 style={{ color: 'white', fontSize: '2.2rem', fontWeight: '800', margin: '0 0 8px 0', letterSpacing: '-0.03em', display: 'flex', alignItems: 'center', gap: '12px' , flexWrap: 'wrap'}}>
            Pengaturan Sistem <i className="ph ph-gear-six"></i>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', margin: 0 }}>Kelola periode akademik dan status operasional sistem SIAKAD dengan aman.</p>
        </div>
      </div>

      <div className="siakad-card stagger-1" style={{ padding: '32px' }}>
        
        {/* Section 1: Periode Akademik */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', borderBottom: '2px solid var(--color-border)', paddingBottom: '12px' , flexWrap: 'wrap'}}>
            <div style={{ background: 'var(--glass-bg)', padding: '8px', borderRadius: '10px', color: 'var(--color-text)', display: 'flex' }}>
              <i className="ph ph-calendar-blank" style={{ fontSize: '1.2rem' }}></i>
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--color-text)', margin: 0 }}>
              Periode Akademik
            </h3>
          </div>
          
          <div style={{ marginBottom: '16px', padding: '0 4px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: 'var(--color-muted)', fontSize: '0.95rem' }}>Tahun Ajaran Aktif</label>
            <select
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              style={{ width: '100%', padding: '12px 14px', borderRadius: '12px', border: '1px solid var(--color-border)', background: 'var(--color-bg)', color: 'var(--color-text)', outline: 'none', cursor: 'pointer' }}
            >
              <option value="">-- Pilih Tahun Ajaran --</option>
              {(() => {
                const currentYear = new Date().getFullYear();
                const options = [];
                // Buat opsi dinamis dari 2 tahun ke depan hingga 3 tahun ke belakang
                for (let y = currentYear + 2; y >= currentYear - 3; y--) {
                  const nextYear = y + 1;
                  options.push(
                    <option key={`ganjil-${y}`} value={`Ganjil ${y}/${nextYear}`}>
                      Ganjil {y}/{nextYear}
                    </option>
                  );
                  options.push(
                    <option key={`genap-${y}`} value={`Genap ${y}/${nextYear}`}>
                      Genap {y}/{nextYear}
                    </option>
                  );
                }
                return options;
              })()}
            </select>
            <p style={{ margin: '8px 0 0 0', fontSize: '0.8rem', color: 'var(--color-muted)' }}>Perubahan semester aktif akan berdampak pada seluruh modul sistem.</p>
          </div>
        </div>

        {/* Section 2: Kontrol Sistem Akademik */}
        <div style={{ marginBottom: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', borderBottom: '2px solid var(--color-border)', paddingBottom: '12px' , flexWrap: 'wrap'}}>
            <div style={{ background: 'var(--glass-bg)', padding: '8px', borderRadius: '10px', color: 'var(--color-text)', display: 'flex' }}>
              <i className="ph ph-sliders-horizontal" style={{ fontSize: '1.2rem' }}></i>
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--color-text)', margin: 0 }}>
              Kontrol Sistem Akademik
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' , flexWrap: 'wrap'}}>
            <div style={{ 
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
              padding: '20px', background: 'var(--glass-bg)', borderRadius: '16px', 
              border: '1px solid var(--color-border)', transition: 'all 0.2s'
            }}>
              <div>
                <div style={{ fontWeight: 700, color: 'var(--color-text)', fontSize: '1.05rem', marginBottom: '4px' }}>Pengisian KRS Online</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--color-muted)', lineHeight: '1.4' }}>Buka akses bagi mahasiswa untuk mulai memilih <br/>mata kuliah semester ini.</div>
              </div>
              
              <div onClick={() => setKrsOpen(!krsOpen)} style={{ width: '64px', height: '36px', borderRadius: '20px', background: krsOpen ? '#10b981' : '#e5e7eb', position: 'relative', cursor: 'pointer', transition: 'background 0.3s ease', flexShrink: 0 }}>
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
              
              <div onClick={() => setKhsOpen(!khsOpen)} style={{ width: '64px', height: '36px', borderRadius: '20px', background: khsOpen ? '#10b981' : '#e5e7eb', position: 'relative', cursor: 'pointer', transition: 'background 0.3s ease', flexShrink: 0 }}>
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
              
              <div onClick={() => setNilaiOpen(!nilaiOpen)} style={{ width: '64px', height: '36px', borderRadius: '20px', background: nilaiOpen ? '#10b981' : '#e5e7eb', position: 'relative', cursor: 'pointer', transition: 'background 0.3s ease', flexShrink: 0 }}>
                <div style={{ width: '28px', height: '28px', background: 'var(--color-bg)', borderRadius: '50%', position: 'absolute', top: '4px', left: nilaiOpen ? '32px' : '4px', transition: 'left 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)', boxShadow: '0 2px 5px rgba(0,0,0,0.2)' , flexShrink: 0 }} />
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Geofencing Kampus */}
        <div style={{ marginBottom: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', borderBottom: '2px solid var(--color-border)', paddingBottom: '12px' , flexWrap: 'wrap'}}>
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
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-bg)', color: 'var(--color-text)', fontSize: '0.95rem' , minWidth: 0, flex: '1 1 120px'}}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: 'var(--color-text)', fontSize: '0.9rem' }}>Kampus Ps. Minggu (Lat, Lng)</label>
              <input 
                type="text" 
                defaultValue={coordPasarMinggu}
                key={`pm-${coordPasarMinggu}`}
                id="coordPasarMinggu"
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-bg)', color: 'var(--color-text)', fontSize: '0.95rem' , minWidth: 0, flex: '1 1 120px'}}
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
          , flexWrap: 'wrap'}}
          onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <i className="ph ph-floppy-disk" style={{ fontSize: '1.3rem' }}></i> Simpan Konfigurasi Sistem
        </button>
      </div>

      {isConfirmModalOpen && (
        <div className="siakad-modal-overlay">
          <div className="siakad-modal-content">
            <div style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', margin: '0 auto 20px auto' , flexShrink: 0 }}>
              <i className="ph ph-warning-circle"></i>
            </div>
            <h2 style={{ fontSize: '1.25rem', margin: '0 0 12px 0' }}>Konfirmasi Perubahan</h2>
            <p style={{ color: 'var(--color-muted)', fontSize: '0.9rem', marginBottom: '24px' }}>Apakah Anda yakin ingin menyimpan perubahan konfigurasi sistem ini? Perubahan akan langsung berdampak pada seluruh pengguna.</p>
            <div style={{ display: 'flex', gap: '12px' , flexWrap: 'wrap'}}>
              <button onClick={() => setIsConfirmModalOpen(false)} style={{ flex: 1, padding: '12px', background: 'transparent', border: '1px solid var(--color-border)', borderRadius: '12px', cursor: 'pointer', fontWeight: 600, color: 'var(--color-text)' }}>Batal</button>
              <button onClick={handleSave} style={{ flex: 1, padding: '12px', background: '#3b82f6', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 600, color: 'white' }}>Ya, Simpan</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
