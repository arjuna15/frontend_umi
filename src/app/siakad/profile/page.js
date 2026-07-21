"use client";
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pribadi');
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('siakad_token');
      if (!token) return router.push('/siakad/login');

      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
        const res = await fetch(`${apiUrl}/siakad/dashboard`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const result = await res.json();
          setUser(result.user);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [router]);

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('siakad_token');
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
    const form = new FormData(e.target);
    const password = form.get('password');
    const confirm = form.get('confirm');
    const current_password = form.get('current_password');

    if (password !== confirm) {
      return window.toast('Password tidak sama!');
    }

    try {
      const res = await fetch(`${apiUrl}/siakad/profile/password`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ current_password, new_password: password })
      });

      if (res.ok) {
        window.toast('Password berhasil diperbarui!');
        e.target.reset();
      } else {
        const err = await res.json();
        window.toast('Gagal: ' + (err.message || 'Server Error'));
      }
    } catch (err) {
      window.toast('Error: ' + err.message);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('siakad_token');
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
    const form = new FormData(e.target);
    const body = Object.fromEntries(form.entries());

    try {
      const res = await fetch(`${apiUrl}/siakad/profile/update`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });
      if (res.ok) {
        const result = await res.json();
        setUser(result.user);
        window.toast('Profil berhasil diperbarui!');
      } else {
        const err = await res.json();
        window.toast('Gagal: ' + (err.message || 'Server Error'));
      }
    } catch (err) {
      window.toast('Error: ' + err.message);
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const token = localStorage.getItem('siakad_token');
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const res = await fetch(`${apiUrl}/siakad/profile/upload-avatar`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      
      if (res.ok) {
        const result = await res.json();
        setUser({ ...user, avatar_url: result.avatar_url });
        window.toast('Foto profil berhasil diperbarui!');
      } else {
        window.toast('Gagal mengunggah foto profil.');
      }
    } catch (err) {
      window.toast('Error: ' + err.message);
    }
  };
  const handlePreferenceToggle = async (key) => {
    const token = localStorage.getItem('siakad_token');
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
    
    // Calculate new values based on current state
    const newPrefs = {
      email_notifications: key === 'email_notifications' ? !user.email_notifications : !!user.email_notifications,
      public_visibility: key === 'public_visibility' ? !user.public_visibility : !!user.public_visibility
    };

    try {
      const res = await fetch(`${apiUrl}/siakad/profile/preferences`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newPrefs)
      });
      
      if (res.ok) {
        const result = await res.json();
        setUser({ 
          ...user, 
          email_notifications: result.user.email_notifications,
          public_visibility: result.user.public_visibility
        });
        window.toast('Preferensi berhasil disimpan!');
      } else {
        window.toast('Gagal menyimpan preferensi.');
      }
    } catch (err) {
      window.toast('Error: ' + err.message);
    }
  };

  if (loading || !user) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--color-muted)' }}>
      <i className="ph ph-spinner ph-spin" style={{ fontSize: '2rem', marginRight: '10px' }}></i> Memuat profil...
    </div>
  );

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', paddingBottom: '120px' }}>
      
            <div className="siakad-page-header">
        <div className="siakad-page-header-glow"></div>
        <div className="siakad-page-header-grid"></div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', margin: '0 0 8px 0', letterSpacing: '0.1em', textTransform: 'uppercase' }}>SIAKAD — PENGATURAN</p>
          <h1 style={{ color: 'white', fontSize: '2.2rem', fontWeight: '800', margin: '0 0 8px 0', letterSpacing: '-0.03em' }}>Profil Pengguna</h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', margin: 0 }}>Kelola data pribadi, keamanan, dan preferensi sistem Anda.</p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', '@media(minWidth: 768px)': { flexDirection: 'row' } }}>
        
        {/* Left Sidebar: Vertical Tabs */}
        <div style={{ flex: '0 0 250px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button 
            onClick={() => setActiveTab('pribadi')}
            className={activeTab === 'pribadi' ? 'siakad-btn-primary' : ''}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 24px', borderRadius: '50px', border: activeTab === 'pribadi' ? 'none' : 'var(--glass-border)', cursor: 'pointer', transition: 'all 0.2s', fontSize: '0.95rem', fontWeight: 'bold',
              background: activeTab === 'pribadi' ? 'linear-gradient(135deg, #C41E3A 0%, #9b1c2e 100%)' : 'var(--glass-bg)',
              color: activeTab === 'pribadi' ? 'white' : 'var(--color-text)',
              boxShadow: activeTab === 'pribadi' ? '0 4px 12px rgba(196,30,58,0.3)' : 'var(--glass-shadow)'
            }}
          >
            <i className="ph ph-identification-card" style={{ fontSize: '1.2rem' }}></i> Informasi Pribadi
          </button>
          
          <button 
            onClick={() => setActiveTab('keamanan')}
            className={activeTab === 'keamanan' ? 'siakad-btn-primary' : ''}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 24px', borderRadius: '50px', border: activeTab === 'keamanan' ? 'none' : 'var(--glass-border)', cursor: 'pointer', transition: 'all 0.2s', fontSize: '0.95rem', fontWeight: 'bold',
              background: activeTab === 'keamanan' ? 'linear-gradient(135deg, #C41E3A 0%, #9b1c2e 100%)' : 'var(--glass-bg)',
              color: activeTab === 'keamanan' ? 'white' : 'var(--color-text)',
              boxShadow: activeTab === 'keamanan' ? '0 4px 12px rgba(196,30,58,0.3)' : 'var(--glass-shadow)'
            }}
          >
            <i className="ph ph-shield-check" style={{ fontSize: '1.2rem' }}></i> Keamanan
          </button>
          
          <button 
            onClick={() => setActiveTab('preferensi')}
            className={activeTab === 'preferensi' ? 'siakad-btn-primary' : ''}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 24px', borderRadius: '50px', border: activeTab === 'preferensi' ? 'none' : 'var(--glass-border)', cursor: 'pointer', transition: 'all 0.2s', fontSize: '0.95rem', fontWeight: 'bold',
              background: activeTab === 'preferensi' ? 'linear-gradient(135deg, #C41E3A 0%, #9b1c2e 100%)' : 'var(--glass-bg)',
              color: activeTab === 'preferensi' ? 'white' : 'var(--color-text)',
              boxShadow: activeTab === 'preferensi' ? '0 4px 12px rgba(196,30,58,0.3)' : 'var(--glass-shadow)'
            }}
          >
            <i className="ph ph-sliders" style={{ fontSize: '1.2rem' }}></i> Preferensi Sistem
          </button>
        </div>

        {/* Right Content */}
        <div className="siakad-card profile-content-card" style={{ flex: 1, minHeight: '500px' }}>
          
          {/* Tab 1: Informasi Pribadi */}
          {activeTab === 'pribadi' && (
            <div className="fade-in">
              <h2 style={{ fontSize: '1.4rem', color: 'var(--color-text)', margin: '0 0 24px 0', paddingBottom: '16px', borderBottom: '1px solid var(--color-border)', fontWeight: '800' }}>Informasi Pribadi</h2>
              
              {/* Profile Overview (Horizontal on Desktop, Column on Mobile) */}
              <div className="profile-overview-card" style={{ background: 'var(--glass-bg)', border: 'var(--glass-border)', boxShadow: 'var(--glass-shadow)', padding: '24px', borderRadius: '24px', marginBottom: '24px' }}>
                <div style={{ position: 'relative', width: '90px', height: '90px', flexShrink: 0 }}>
                  {user.avatar_url ? (
                    <div style={{ width: '100%', height: '100%', borderRadius: '50%', padding: '3px', background: 'var(--glass-bg)', boxShadow: 'var(--glass-shadow)' }}>
                      <img src={user.avatar_url} alt="Profile" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                    </div>
                  ) : (
                    <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: 'linear-gradient(135deg, #C41E3A 0%, #9f1239 100%)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', boxShadow: 'var(--glass-shadow)' }}>
                      <i className="ph ph-user-circle"></i>
                    </div>
                  )}
                  <button 
                    onClick={() => fileInputRef.current.click()}
                    className="siakad-btn-primary"
                    style={{ position: 'absolute', bottom: -5, right: -5, width: '32px', height: '32px', borderRadius: '50%', padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, borderRadius: '50px !important' }}
                    title="Ganti Foto Profil"
                  >
                    <i className="ph ph-camera" style={{ fontSize: '1rem' }}></i>
                  </button>
                  <input type="file" ref={fileInputRef} onChange={handleAvatarUpload} accept="image/*" style={{ display: 'none' }} />
                </div>
                <div>
                  <h3 style={{ margin: '0 0 4px 0', fontSize: '1.3rem', color: 'var(--color-text)', fontWeight: '800' }}>{user.name}</h3>
                  <p style={{ margin: '0 0 12px 0', color: 'var(--color-muted)', fontSize: '0.9rem', fontWeight: '600' }}>NIM/NIP: {user.nim_nip}</p>
                  <div className="profile-badges" style={{ display: 'flex', gap: '8px' }}>
                    <span className="siakad-badge-status" style={{ color: '#047857', borderColor: 'rgba(4,120,87,0.3)', textTransform: 'uppercase' }}>
                      {user.role}
                    </span>
                    {user.prodi && (
                      <span className="siakad-badge-status" style={{ color: 'var(--color-text)', borderColor: 'var(--color-border)', textTransform: 'uppercase' }}>
                        {user.prodi}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Form Data Diri */}
              <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                  <div style={{ flex: '1 1 200px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--color-muted)', fontWeight: '700', textTransform: 'uppercase' }}>Email Address</label>
                    <input type="email" name="email" defaultValue={user.email} placeholder="contoh@kampus.ac.id" className="siakad-input" style={{ width: '100%' }} />
                  </div>
                  <div style={{ flex: '1 1 200px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--color-muted)', fontWeight: '700', textTransform: 'uppercase' }}>Nomor HP</label>
                    <input type="tel" name="phone" defaultValue={user.phone} placeholder="08xxxxxxxxxx" className="siakad-input" style={{ width: '100%' }} />
                  </div>
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--color-muted)', fontWeight: '700', textTransform: 'uppercase' }}>Alamat Domisili</label>
                  <textarea name="address" defaultValue={user.address} rows="3" placeholder="Masukkan alamat lengkap..." className="siakad-input" style={{ width: '100%', borderRadius: '20px', resize: 'vertical' }}></textarea>
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--color-muted)', fontWeight: '700', textTransform: 'uppercase' }}>Bio Singkat</label>
                  <textarea name="bio" defaultValue={user.bio} rows="2" placeholder="Tuliskan sedikit tentang diri Anda..." className="siakad-input" style={{ width: '100%', borderRadius: '20px', resize: 'vertical' }}></textarea>
                </div>

                <div style={{ marginTop: '8px', display: 'flex', justifyContent: 'flex-end' }}>
                  <button type="submit" className="siakad-btn-primary" style={{ padding: '14px 32px', borderRadius: '50px !important' }}>
                    Simpan Perubahan
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Tab 2: Keamanan */}
          {activeTab === 'keamanan' && (
            <div className="fade-in">
              <h2 style={{ fontSize: '1.4rem', color: 'var(--color-text)', margin: '0 0 24px 0', paddingBottom: '16px', borderBottom: '1px solid var(--color-border)', fontWeight: '800' }}>Keamanan Akun</h2>
              
              <div className="siakad-card" style={{ padding: '20px', borderRadius: '16px', marginBottom: '32px', display: 'flex', gap: '16px', alignItems: 'flex-start', border: 'rgba(185, 28, 28, 0.2)', background: 'var(--glass-bg)' }}>
                <i className="ph ph-info" style={{ fontSize: '1.5rem', color: '#b91c1c' }}></i>
                <p style={{ margin: 0, color: 'var(--color-muted)', fontSize: '0.9rem', lineHeight: '1.5', fontWeight: '600' }}>Pastikan Anda menggunakan kata sandi yang kuat dan tidak digunakan di situs lain. Kombinasikan huruf besar, huruf kecil, angka, dan simbol.</p>
              </div>
 
              <form onSubmit={handleUpdatePassword} style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '500px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--color-muted)', fontWeight: '700', textTransform: 'uppercase' }}>Password Saat Ini</label>
                  <input type="password" name="current_password" required placeholder="••••••••" className="siakad-input" style={{ width: '100%' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--color-muted)', fontWeight: '700', textTransform: 'uppercase' }}>Password Baru</label>
                  <input type="password" name="password" required minLength="6" placeholder="••••••••" className="siakad-input" style={{ width: '100%' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--color-muted)', fontWeight: '700', textTransform: 'uppercase' }}>Konfirmasi Password Baru</label>
                  <input type="password" name="confirm" required minLength="6" placeholder="••••••••" className="siakad-input" style={{ width: '100%' }} />
                </div>
                <div style={{ marginTop: '8px' }}>
                  <button type="submit" className="siakad-btn-primary" style={{ padding: '14px 32px', borderRadius: '50px !important' }}>
                    Perbarui Password
                  </button>
                </div>
              </form>
            </div>
          )}
 
          {/* Tab 3: Preferensi */}
          {activeTab === 'preferensi' && (
            <div className="fade-in">
              <h2 style={{ fontSize: '1.4rem', color: 'var(--color-text)', margin: '0 0 24px 0', paddingBottom: '16px', borderBottom: '1px solid var(--color-border)', fontWeight: '800' }}>Preferensi Sistem</h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                
                <div className="siakad-modal-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-border)', paddingBottom: '16px' }}>
                  <div>
                    <h4 style={{ margin: '0 0 6px 0', fontSize: '1rem', color: 'var(--color-text)', fontWeight: '800' }}>Notifikasi Email</h4>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-muted)', fontWeight: '600' }}>Terima pembaruan penting dan jadwal di email Anda.</p>
                  </div>
                  <div 
                    onClick={() => handlePreferenceToggle('email_notifications')}
                    style={{ 
                      width: '54px', 
                      height: '28px', 
                      borderRadius: '50px', 
                      background: 'var(--glass-bg)', 
                      boxShadow: 'inset 3px 3px 6px var(--inset-shadow-dark), inset -3px -3px 6px var(--inset-shadow-light)',
                      border: 'var(--inset-border)',
                      position: 'relative',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      flexShrink: 0
                    }}
                  >
                    <div style={{ 
                      width: '20px', 
                      height: '20px', 
                      borderRadius: '50%', 
                      background: user.email_notifications ? 'linear-gradient(135deg, #C41E3A, #9b1c2e)' : 'var(--color-muted)', 
                      boxShadow: user.email_notifications ? '0 2px 5px rgba(196,30,58,0.4)' : '0 2px 5px rgba(0,0,0,0.2)',
                      position: 'absolute',
                      top: '3px',
                      left: user.email_notifications ? '29px' : '4px',
                      transition: 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)'
                    }}></div>
                  </div>
                </div>
 
                <div className="siakad-modal-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ margin: '0 0 6px 0', fontSize: '1rem', color: 'var(--color-text)', fontWeight: '800' }}>Visibilitas Publik</h4>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-muted)', fontWeight: '600' }}>Izinkan pengguna lain melihat nomor HP dan email Anda.</p>
                  </div>
                  <div 
                    onClick={() => handlePreferenceToggle('public_visibility')}
                    style={{ 
                      width: '54px', 
                      height: '28px', 
                      borderRadius: '50px', 
                      background: 'var(--glass-bg)', 
                      boxShadow: 'inset 3px 3px 6px var(--inset-shadow-dark), inset -3px -3px 6px var(--inset-shadow-light)',
                      border: 'var(--inset-border)',
                      position: 'relative',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      flexShrink: 0
                    }}
                  >
                    <div style={{ 
                      width: '20px', 
                      height: '20px', 
                      borderRadius: '50%', 
                      background: user.public_visibility ? 'linear-gradient(135deg, #C41E3A, #9b1c2e)' : 'var(--color-muted)', 
                      boxShadow: user.public_visibility ? '0 2px 5px rgba(196,30,58,0.4)' : '0 2px 5px rgba(0,0,0,0.2)',
                      position: 'absolute',
                      top: '3px',
                      left: user.public_visibility ? '29px' : '4px',
                      transition: 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)'
                    }}></div>
                  </div>
                </div>
 
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
