'use client';
import { useState, useEffect } from 'react';
import CustomSelect from '../../components/CustomSelect';
import CustomDatePicker from '../../components/CustomDatePicker';
import ModalShell from '../../components/ModalShell';

export default function AdminPengaturan() {
  const [activeTab, setActiveTab] = useState('umum');
  const [krsOpen, setKrsOpen] = useState(true);
  const [khsOpen, setKhsOpen] = useState(true);
  const [nilaiOpen, setNilaiOpen] = useState(true);
  const [semester, setSemester] = useState('');

  const [coordBintaro, setCoordBintaro] = useState('-6.2758, 106.7405');
  const [coordPasarMinggu, setCoordPasarMinggu] = useState('-6.2842, 106.8442');
  
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Open API State
  const [apiTokens, setApiTokens] = useState([]);
  const [showApiModal, setShowApiModal] = useState(false);
  const [apiForm, setApiForm] = useState({ name: '', rate_limit: '1000', expires_at: '' });
  const [generatingToken, setGeneratingToken] = useState(false);

  // e-Sign State
  const [esignConfig, setEsignConfig] = useState({ provider: 'BSrE', api_key: '', secret_key: '', base_url: '' });
  const [esignStatus, setEsignStatus] = useState('disconnected'); // disconnected, testing, connected
  const [testingEsign, setTestingEsign] = useState(false);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
  const getToken = () => localStorage.getItem('siakad_token');

  useEffect(() => {
    fetchSettings();
    fetchApiTokens();
    fetchEsignConfig();
  }, []);

  const fetchSettings = async () => {
    const token = getToken();
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

  const fetchApiTokens = async () => {
    try {
      const res = await fetch(`${apiUrl}/siakad/api-tokens`, {
        headers: { 'Authorization': `Bearer ${getToken()}` }
      });
      if (res.ok) {
        const d = await res.json();
        setApiTokens(d.data || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchEsignConfig = async () => {
    try {
      const res = await fetch(`${apiUrl}/siakad/esign/config`, {
        headers: { 'Authorization': `Bearer ${getToken()}` }
      });
      if (res.ok) {
        const d = await res.json();
        if (d.data) setEsignConfig(d.data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSave = async () => {
    const token = getToken();
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

  const createApiToken = async () => {
    setGeneratingToken(true);
    try {
      const res = await fetch(`${apiUrl}/siakad/api-tokens`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify(apiForm)
      });
      if (res.ok) {
        window.toast?.('API Token berhasil digenerate!');
        setShowApiModal(false);
        setApiForm({ name: '', rate_limit: '1000', expires_at: '' });
        fetchApiTokens();
      }
    } catch (e) {
      window.toast?.('Gagal membuat API Token');
    } finally {
      setGeneratingToken(false);
    }
  };

  const deleteApiToken = async (id) => {
    if (!confirm('Hapus token ini? Aplikasi yang terhubung tidak akan bisa mengakses API lagi.')) return;
    try {
      const res = await fetch(`${apiUrl}/siakad/api-tokens/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${getToken()}` }
      });
      if (res.ok) {
        window.toast?.('Token berhasil dihapus.');
        fetchApiTokens();
      }
    } catch (e) {
      window.toast?.('Gagal menghapus token.');
    }
  };

  const toggleApiToken = async (id) => {
    try {
      const res = await fetch(`${apiUrl}/siakad/api-tokens/${id}/toggle`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${getToken()}` }
      });
      if (res.ok) {
        window.toast?.('Status token diperbarui.');
        fetchApiTokens();
      }
    } catch (e) {
      window.toast?.('Gagal mengubah status token.');
    }
  };

  const saveEsign = async () => {
    try {
      const res = await fetch(`${apiUrl}/siakad/esign/config`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify(esignConfig)
      });
      if (res.ok) {
        window.toast?.('Konfigurasi e-Sign disimpan.');
      }
    } catch (e) {
      window.toast?.('Gagal menyimpan konfigurasi.');
    }
  };

  const testEsign = async () => {
    setTestingEsign(true);
    setEsignStatus('testing');
    try {
      const res = await fetch(`${apiUrl}/siakad/esign/test`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify(esignConfig)
      });
      if (res.ok) {
        setEsignStatus('connected');
        window.toast?.('Koneksi penyedia e-Sign Berhasil!');
      } else {
        setEsignStatus('disconnected');
        window.toast?.('Koneksi Gagal. Periksa kredensial Anda.');
      }
    } catch (e) {
      setEsignStatus('disconnected');
    } finally {
      setTestingEsign(false);
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
          <h1 style={{ color: 'white', fontSize: '2.2rem', fontWeight: '800', margin: '0 0 8px 0', letterSpacing: '-0.03em', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            Pengaturan Sistem <i className="ph ph-gear-six"></i>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', margin: 0 }}>Kelola periode akademik, open API akses eksternal, dan integrasi tanda tangan digital e-Sign.</p>
        </div>
      </div>

      {/* Tabs Selector */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {[
          { key: 'umum', label: 'Pengaturan Umum', icon: 'ph-sliders-horizontal' },
          { key: 'api', label: 'Open API Management', icon: 'ph-key' },
          { key: 'esign', label: 'Integrasi e-Sign', icon: 'ph-signature' }
        ].map(t => (
          <button id={`settings-tab-${t.key}`} key={t.key} onClick={() => setActiveTab(t.key)} style={{
            padding: '10px 20px', borderRadius: '50px', border: activeTab === t.key ? '2px solid #3b82f6' : '1px solid var(--color-border)',
            background: activeTab === t.key ? 'rgba(59,130,246,0.15)' : 'transparent', color: activeTab === t.key ? '#3b82f6' : 'var(--color-muted)',
            fontWeight: '700', fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '8px'
          }}>
            <i className={`ph ${t.icon}`} style={{ fontSize: '1rem' }}></i> {t.label}
          </button>
        ))}
      </div>

      {activeTab === 'umum' && (
        <div className="siakad-card stagger-1" style={{ padding: '32px' }}>
          {/* Section 1: Periode Akademik */}
          <div style={{ marginBottom: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', borderBottom: '2px solid var(--color-border)', paddingBottom: '12px', flexWrap: 'wrap' }}>
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
                placeholder="-- Pilih Tahun Ajaran --"
                options={(() => {
                  const currentYear = new Date().getFullYear();
                  const opts = [];
                  for (let y = currentYear + 2; y >= currentYear - 3; y--) {
                    const nextYear = y + 1;
                    opts.push({ value: `Ganjil ${y}/${nextYear}`, label: `Ganjil ${y}/${nextYear}` });
                    opts.push({ value: `Genap ${y}/${nextYear}`, label: `Genap ${y}/${nextYear}` });
                  }
                  return opts;
                })()}
              />
              <p style={{ margin: '8px 0 0 0', fontSize: '0.8rem', color: 'var(--color-muted)' }}>Perubahan semester aktif akan berdampak pada seluruh modul sistem.</p>
            </div>
          </div>

          {/* Section 2: Kontrol Sistem Akademik */}
          <div style={{ marginBottom: '40px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', borderBottom: '2px solid var(--color-border)', paddingBottom: '12px', flexWrap: 'wrap' }}>
              <div style={{ background: 'var(--glass-bg)', padding: '8px', borderRadius: '10px', color: 'var(--color-text)', display: 'flex' }}>
                <i className="ph ph-sliders-horizontal" style={{ fontSize: '1.2rem' }}></i>
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--color-text)', margin: 0 }}>
                Kontrol Sistem Akademik
              </h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px', background: 'var(--glass-bg)', borderRadius: '16px', border: '1px solid var(--color-border)' }}>
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--color-text)', fontSize: '1.05rem', marginBottom: '4px' }}>Pengisian KRS Online</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--color-muted)', lineHeight: '1.4' }}>Buka akses bagi mahasiswa untuk mulai memilih mata kuliah semester ini.</div>
                </div>
                <div onClick={() => setKrsOpen(!krsOpen)} style={{ width: '64px', height: '36px', borderRadius: '20px', background: krsOpen ? '#10b981' : '#e5e7eb', position: 'relative', cursor: 'pointer', transition: 'background 0.3s ease' }}>
                  <div style={{ width: '28px', height: '28px', background: 'var(--color-bg)', borderRadius: '50%', position: 'absolute', top: '4px', left: krsOpen ? '32px' : '4px', transition: 'left 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }} />
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px', background: 'var(--glass-bg)', borderRadius: '16px', border: '1px solid var(--color-border)' }}>
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--color-text)', fontSize: '1.05rem', marginBottom: '4px' }}>Akses Cetak KHS</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--color-muted)', lineHeight: '1.4' }}>Izinkan mahasiswa melihat dan mencetak Kartu Hasil Studi (KHS).</div>
                </div>
                <div onClick={() => setKhsOpen(!khsOpen)} style={{ width: '64px', height: '36px', borderRadius: '20px', background: khsOpen ? '#10b981' : '#e5e7eb', position: 'relative', cursor: 'pointer', transition: 'background 0.3s ease' }}>
                  <div style={{ width: '28px', height: '28px', background: 'var(--color-bg)', borderRadius: '50%', position: 'absolute', top: '4px', left: khsOpen ? '32px' : '4px', transition: 'left 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }} />
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px', background: 'var(--glass-bg)', borderRadius: '16px', border: '1px solid var(--color-border)' }}>
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--color-text)', fontSize: '1.05rem', marginBottom: '4px' }}>Input Nilai Dosen</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--color-muted)', lineHeight: '1.4' }}>Buka portal bagi dosen untuk memasukkan dan mengubah nilai mahasiswa.</div>
                </div>
                <div onClick={() => setNilaiOpen(!nilaiOpen)} style={{ width: '64px', height: '36px', borderRadius: '20px', background: nilaiOpen ? '#10b981' : '#e5e7eb', position: 'relative', cursor: 'pointer', transition: 'background 0.3s ease' }}>
                  <div style={{ width: '28px', height: '28px', background: 'var(--color-bg)', borderRadius: '50%', position: 'absolute', top: '4px', left: nilaiOpen ? '32px' : '4px', transition: 'left 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Geofencing Kampus */}
          <div style={{ marginBottom: '40px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', borderBottom: '2px solid var(--color-border)', paddingBottom: '12px', flexWrap: 'wrap' }}>
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
                <input type="text" defaultValue={coordBintaro} key={`bintaro-${coordBintaro}`} id="coordBintaro" style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-bg)', color: 'var(--color-text)', fontSize: '0.95rem' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: 'var(--color-text)', fontSize: '0.9rem' }}>Kampus Ps. Minggu (Lat, Lng)</label>
                <input type="text" defaultValue={coordPasarMinggu} key={`pm-${coordPasarMinggu}`} id="coordPasarMinggu" style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-bg)', color: 'var(--color-text)', fontSize: '0.95rem' }} />
              </div>
            </div>
          </div>

          {/* Save Button */}
          <button onClick={() => setIsConfirmModalOpen(true)} style={{ background: 'linear-gradient(135deg, #b91c1c 0%, #991b1b 100%)', color: 'white', border: 'none', padding: '16px 24px', borderRadius: '12px', fontWeight: 700, cursor: 'pointer', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', fontSize: '1.05rem', boxShadow: '0 4px 15px rgba(185, 28, 28, 0.3)', transition: 'transform 0.2s' }} onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
            <i className="ph ph-floppy-disk" style={{ fontSize: '1.3rem' }}></i> Simpan Konfigurasi Sistem
          </button>
        </div>
      )}

      {/* Open API Tab */}
      {activeTab === 'api' && (
        <div className="siakad-card stagger-1" style={{ padding: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--color-text)', margin: '0 0 4px 0' }}>Open API Token Management</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-muted)', margin: 0 }}>Kelola token pihak ketiga untuk integrasi data SIAKAD dengan aman.</p>
            </div>
            <button id="btn-add-token" onClick={() => setShowApiModal(true)} className="siakad-btn-primary" style={{ padding: '10px 20px' }}>
              <i className="ph ph-plus"></i> Generate Token Baru
            </button>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--color-border)' }}>
                  {['Nama Aplikasi', 'API Token', 'Rate Limit', 'Status', 'Terakhir Digunakan', 'Aksi'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.8rem', fontWeight: '700', color: 'var(--color-muted)', textTransform: 'uppercase' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {apiTokens.length === 0 ? (
                  <tr><td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: 'var(--color-muted)' }}>Belum ada API Token aktif.</td></tr>
                ) : apiTokens.map(t => (
                  <tr key={t.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: '14px 16px', color: 'var(--color-text)', fontWeight: '600' }}>{t.name}</td>
                    <td style={{ padding: '14px 16px', fontFamily: 'monospace', color: 'var(--color-muted)', fontSize: '0.85rem' }}>{t.token ? `${t.token.slice(0, 10)}...[MASKED]` : '-'}</td>
                    <td style={{ padding: '14px 16px', color: 'var(--color-text)' }}>{t.rate_limit} req/jam</td>
                    <td style={{ padding: '14px 16px' }}>
                      <span onClick={() => toggleApiToken(t.id)} style={{ cursor: 'pointer', padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '700', color: t.is_active ? '#10b981' : '#ef4444', background: t.is_active ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)' }}>
                        {t.is_active ? 'Aktif' : 'Nonaktif'}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px', color: 'var(--color-muted)' }}>{t.last_used_at ? new Date(t.last_used_at).toLocaleString('id-ID') : '-'}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <button id={`btn-del-token-${t.id}`} onClick={() => deleteApiToken(t.id)} style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '1.1rem' }}><i className="ph ph-trash"></i></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* e-Sign Tab */}
      {activeTab === 'esign' && (
        <div className="siakad-card stagger-1" style={{ padding: '32px' }}>
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--color-text)', margin: '0 0 4px 0' }}>Integrasi Tanda Tangan Digital (e-Sign)</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-muted)', margin: 0 }}>Hubungkan sistem SIAKAD dengan penyedia tanda tangan elektronik tersertifikasi (e-Sign) untuk keabsahan KHS/Transkrip.</p>
          </div>

          <div style={{ display: 'grid', gap: '20px', maxWidth: '600px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: 'var(--color-muted)', fontSize: '0.9rem' }}>Penyedia Layanan (Provider)</label>
              <CustomSelect
                value={esignConfig.provider}
                onChange={(val) => setEsignConfig({ ...esignConfig, provider: val })}
                options={[
                  { value: 'BSrE', label: 'BSrE (Badan Siber dan Sandi Negara)' },
                  { value: 'Privy', label: 'PrivyID' },
                  { value: 'Digisign', label: 'Digisign' }
                ]}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: 'var(--color-text)', fontSize: '0.9rem' }}>Base URL Endpoint</label>
              <input type="text" value={esignConfig.base_url || ''} onChange={(e) => setEsignConfig({ ...esignConfig, base_url: e.target.value })} placeholder="https://api.esign.provider.id/v1" style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--color-border)', background: 'var(--color-bg)', color: 'var(--color-text)' }} />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: 'var(--color-text)', fontSize: '0.9rem' }}>API Key / Client ID</label>
              <input type="text" value={esignConfig.api_key || ''} onChange={(e) => setEsignConfig({ ...esignConfig, api_key: e.target.value })} placeholder="Masukkan API Key" style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--color-border)', background: 'var(--color-bg)', color: 'var(--color-text)' }} />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: 'var(--color-text)', fontSize: '0.9rem' }}>Secret Key</label>
              <input type="password" value={esignConfig.secret_key || ''} onChange={(e) => setEsignConfig({ ...esignConfig, secret_key: e.target.value })} placeholder="•••••••••••••••••••••••••••••" style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--color-border)', background: 'var(--color-bg)', color: 'var(--color-text)' }} />
            </div>

            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginTop: '10px' }}>
              <button id="btn-save-esign" onClick={saveEsign} className="siakad-btn-primary" style={{ padding: '12px 24px' }}>
                Simpan Konfigurasi
              </button>
              <button id="btn-test-esign" onClick={testEsign} disabled={testingEsign} style={{ padding: '12px 20px', background: 'transparent', border: '1px solid var(--color-border)', borderRadius: '30px', color: 'var(--color-text)', cursor: 'pointer', fontWeight: 'bold' }}>
                {testingEsign ? 'Menghubungkan...' : 'Test Connection'}
              </button>
              {esignStatus === 'connected' && <span style={{ color: '#10b981', fontWeight: 'bold', fontSize: '0.9rem' }}><i className="ph ph-check-circle"></i> Terhubung</span>}
              {esignStatus === 'disconnected' && <span style={{ color: '#ef4444', fontWeight: 'bold', fontSize: '0.9rem' }}><i className="ph ph-warning-circle"></i> Tidak Terhubung</span>}
            </div>
          </div>
        </div>
      )}

      {/* Confirm Modal */}
      {isConfirmModalOpen && (
        <div className="siakad-modal-overlay">
          <div className="siakad-modal-content">
            <div style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', margin: '0 auto 20px auto' }}>
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

      {/* Add API Token Modal */}
      {showApiModal && (
        <ModalShell title="Generate API Token Baru" subtitle="Akses Aplikasi Pihak Ketiga" icon="ph-key" onClose={() => setShowApiModal(false)} footer={
          <>
            <button id="btn-cancel-token" onClick={() => setShowApiModal(false)} style={{ padding: '10px 20px', border: 'none', background: 'transparent', color: 'var(--color-text)', cursor: 'pointer', fontWeight: '600' }}>Batal</button>
            <button id="btn-confirm-token" onClick={createApiToken} disabled={generatingToken} className="siakad-btn-primary" style={{ padding: '10px 24px' }}>
              {generatingToken ? 'Generating...' : 'Generate Token'}
            </button>
          </>
        }>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: 'var(--color-muted)', fontWeight: '600' }}>Nama Aplikasi / Client</label>
            <input type="text" value={apiForm.name} onChange={(e) => setApiForm({ ...apiForm, name: e.target.value })} placeholder="Contoh: Mobile App UMIBA, Web Portal Partner" style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--color-border)', background: 'var(--color-bg)', color: 'var(--color-text)' }} />
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: 'var(--color-muted)', fontWeight: '600' }}>Rate Limit (Requests per jam)</label>
            <input type="number" value={apiForm.rate_limit} onChange={(e) => setApiForm({ ...apiForm, rate_limit: e.target.value })} placeholder="1000" style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--color-border)', background: 'var(--color-bg)', color: 'var(--color-text)' }} />
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: 'var(--color-muted)', fontWeight: '600' }}>Masa Berlaku Hingga</label>
            <CustomDatePicker value={apiForm.expires_at} onChange={(val) => setApiForm({ ...apiForm, expires_at: val })} placeholder="Pilih tanggal kedaluwarsa..." />
          </div>
        </ModalShell>
      )}
    </div>
  );
}
