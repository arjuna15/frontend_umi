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

  if (loading || !user) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--color-muted)' }}>
      <i className="ph ph-spinner ph-spin" style={{ fontSize: '2rem', marginRight: '10px' }}></i> Memuat profil...
    </div>
  );

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', paddingBottom: '120px' }}>
      
      {/* Page Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--color-text)', margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <i className="ph ph-user-gear" style={{ color: '#4f46e5' }}></i> Pengaturan Akun
        </h1>
        <p style={{ color: 'var(--color-muted)', margin: 0, fontSize: '1rem' }}>Kelola profil pribadi, keamanan akun, dan preferensi sistem Anda.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', '@media(minWidth: 768px)': { flexDirection: 'row' } }}>
        
        {/* Left Sidebar: Vertical Tabs */}
        <div style={{ flex: '0 0 250px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button 
            onClick={() => setActiveTab('pribadi')}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 20px', borderRadius: '12px', border: 'none', cursor: 'pointer', transition: 'all 0.3s', fontSize: '0.95rem', fontWeight: '600',
              background: activeTab === 'pribadi' ? '#4f46e5' : 'transparent',
              color: activeTab === 'pribadi' ? 'white' : 'var(--color-muted)'
            }}
          >
            <i className="ph ph-identification-card" style={{ fontSize: '1.2rem' }}></i> Informasi Pribadi
          </button>
          
          <button 
            onClick={() => setActiveTab('keamanan')}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 20px', borderRadius: '12px', border: 'none', cursor: 'pointer', transition: 'all 0.3s', fontSize: '0.95rem', fontWeight: '600',
              background: activeTab === 'keamanan' ? '#4f46e5' : 'transparent',
              color: activeTab === 'keamanan' ? 'white' : 'var(--color-muted)'
            }}
          >
            <i className="ph ph-shield-check" style={{ fontSize: '1.2rem' }}></i> Keamanan
          </button>
          
          <button 
            onClick={() => setActiveTab('preferensi')}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 20px', borderRadius: '12px', border: 'none', cursor: 'pointer', transition: 'all 0.3s', fontSize: '0.95rem', fontWeight: '600',
              background: activeTab === 'preferensi' ? '#4f46e5' : 'transparent',
              color: activeTab === 'preferensi' ? 'white' : 'var(--color-muted)'
            }}
          >
            <i className="ph ph-sliders" style={{ fontSize: '1.2rem' }}></i> Preferensi Sistem
          </button>
        </div>

        {/* Right Content */}
        <div className="siakad-card" style={{ flex: 1, padding: '40px', minHeight: '500px' }}>
          
          {/* Tab 1: Informasi Pribadi */}
          {activeTab === 'pribadi' && (
            <div className="fade-in">
              <h2 style={{ fontSize: '1.4rem', color: 'var(--color-text)', margin: '0 0 24px 0', paddingBottom: '16px', borderBottom: '1px solid var(--color-border)' }}>Informasi Pribadi</h2>
              
              {/* Profile Overview (Horizontal) */}
              <div className="profile-overview-card">
                <div style={{ position: 'relative', width: '90px', height: '90px', flexShrink: 0 }}>
                  {user.avatar_url ? (
                    <img src={user.avatar_url} alt="Profile" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--color-bg)', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: 'linear-gradient(135deg, #4f46e5 0%, #ec4899 100%)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
                      <i className="ph ph-user-circle"></i>
                    </div>
                  )}
                  <button 
                    onClick={() => fileInputRef.current.click()}
                    style={{ position: 'absolute', bottom: -5, right: -5, width: '32px', height: '32px', borderRadius: '50%', background: '#4f46e5', color: 'white', border: '3px solid var(--color-bg)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}
                    title="Ganti Foto Profil"
                  >
                    <i className="ph ph-camera" style={{ fontSize: '1rem' }}></i>
                  </button>
                  <input type="file" ref={fileInputRef} onChange={handleAvatarUpload} accept="image/*" style={{ display: 'none' }} />
                </div>
                <div>
                  <h3 style={{ margin: '0 0 4px 0', fontSize: '1.3rem', color: 'var(--color-text)' }}>{user.name}</h3>
                  <p style={{ margin: '0 0 12px 0', color: 'var(--color-muted)', fontSize: '0.9rem' }}>NIM/NIP: {user.nim_nip}</p>
                  <div className="profile-badges">
                    <span style={{ padding: '4px 12px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 'bold', background: user.role === 'admin' ? '#fee2e2' : user.role === 'dosen' ? '#e0e7ff' : '#dcfce7', color: user.role === 'admin' ? '#991b1b' : user.role === 'dosen' ? '#3730a3' : '#166534', textTransform: 'uppercase' }}>
                      {user.role}
                    </span>
                    {user.prodi && (
                      <span style={{ padding: '4px 12px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 'bold', background: 'var(--glass-bg)', color: 'var(--color-text)', border: '1px solid var(--color-border)', textTransform: 'uppercase' }}>
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
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--color-muted)', fontWeight: '600', textTransform: 'uppercase' }}>Email Address</label>
                    <input type="email" name="email" defaultValue={user.email} placeholder="contoh@kampus.ac.id" style={{ width: '100%', padding: '14px', borderRadius: '10px', border: '1px solid var(--color-border)', outline: 'none', background: 'transparent', color: 'var(--color-text)', transition: 'border 0.3s' }} onFocus={(e) => e.target.style.borderColor = '#4f46e5'} onBlur={(e) => e.target.style.borderColor = 'var(--color-border)'} />
                  </div>
                  <div style={{ flex: '1 1 200px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--color-muted)', fontWeight: '600', textTransform: 'uppercase' }}>Nomor HP</label>
                    <input type="tel" name="phone" defaultValue={user.phone} placeholder="08123456789" style={{ width: '100%', padding: '14px', borderRadius: '10px', border: '1px solid var(--color-border)', outline: 'none', background: 'transparent', color: 'var(--color-text)', transition: 'border 0.3s' }} onFocus={(e) => e.target.style.borderColor = '#4f46e5'} onBlur={(e) => e.target.style.borderColor = 'var(--color-border)'} />
                  </div>
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--color-muted)', fontWeight: '600', textTransform: 'uppercase' }}>Alamat Domisili</label>
                  <textarea name="address" defaultValue={user.address} rows="3" placeholder="Masukkan alamat lengkap..." style={{ width: '100%', padding: '14px', borderRadius: '10px', border: '1px solid var(--color-border)', outline: 'none', background: 'transparent', color: 'var(--color-text)', resize: 'vertical', transition: 'border 0.3s' }} onFocus={(e) => e.target.style.borderColor = '#4f46e5'} onBlur={(e) => e.target.style.borderColor = 'var(--color-border)'}></textarea>
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--color-muted)', fontWeight: '600', textTransform: 'uppercase' }}>Bio Singkat</label>
                  <textarea name="bio" defaultValue={user.bio} rows="2" placeholder="Tuliskan sedikit tentang diri Anda..." style={{ width: '100%', padding: '14px', borderRadius: '10px', border: '1px solid var(--color-border)', outline: 'none', background: 'transparent', color: 'var(--color-text)', resize: 'vertical', transition: 'border 0.3s' }} onFocus={(e) => e.target.style.borderColor = '#4f46e5'} onBlur={(e) => e.target.style.borderColor = 'var(--color-border)'}></textarea>
                </div>

                <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
                  <button type="submit" style={{ background: '#4f46e5', color: 'white', border: 'none', padding: '14px 28px', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)', display: 'inline-flex', alignItems: 'center', gap: '8px', transition: 'all 0.3s' }} onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'} onMouseLeave={(e) => e.target.style.transform = 'none'}>
                    Simpan Perubahan
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Tab 2: Keamanan */}
          {activeTab === 'keamanan' && (
            <div className="fade-in">
              <h2 style={{ fontSize: '1.4rem', color: 'var(--color-text)', margin: '0 0 24px 0', paddingBottom: '16px', borderBottom: '1px solid var(--color-border)' }}>Keamanan Akun</h2>
              
              <div style={{ background: 'var(--glass-bg)', border: '1px solid var(--color-border)', padding: '20px', borderRadius: '12px', marginBottom: '32px', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <i className="ph ph-info" style={{ fontSize: '1.5rem', color: '#4f46e5' }}></i>
                <p style={{ margin: 0, color: 'var(--color-muted)', fontSize: '0.9rem', lineHeight: '1.5' }}>Pastikan Anda menggunakan kata sandi yang kuat dan tidak digunakan di situs lain. Kombinasikan huruf besar, huruf kecil, angka, dan simbol.</p>
              </div>

              <form onSubmit={handleUpdatePassword} style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '500px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--color-muted)', fontWeight: '600', textTransform: 'uppercase' }}>Password Saat Ini</label>
                  <input type="password" name="current_password" required placeholder="••••••••" style={{ width: '100%', padding: '14px', borderRadius: '10px', border: '1px solid var(--color-border)', outline: 'none', background: 'transparent', color: 'var(--color-text)', transition: 'border 0.3s' }} onFocus={(e) => e.target.style.borderColor = '#4f46e5'} onBlur={(e) => e.target.style.borderColor = 'var(--color-border)'} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--color-muted)', fontWeight: '600', textTransform: 'uppercase' }}>Password Baru</label>
                  <input type="password" name="password" required minLength="6" placeholder="••••••••" style={{ width: '100%', padding: '14px', borderRadius: '10px', border: '1px solid var(--color-border)', outline: 'none', background: 'transparent', color: 'var(--color-text)', transition: 'border 0.3s' }} onFocus={(e) => e.target.style.borderColor = '#4f46e5'} onBlur={(e) => e.target.style.borderColor = 'var(--color-border)'} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--color-muted)', fontWeight: '600', textTransform: 'uppercase' }}>Konfirmasi Password Baru</label>
                  <input type="password" name="confirm" required minLength="6" placeholder="••••••••" style={{ width: '100%', padding: '14px', borderRadius: '10px', border: '1px solid var(--color-border)', outline: 'none', background: 'transparent', color: 'var(--color-text)', transition: 'border 0.3s' }} onFocus={(e) => e.target.style.borderColor = '#4f46e5'} onBlur={(e) => e.target.style.borderColor = 'var(--color-border)'} />
                </div>
                <div style={{ marginTop: '16px' }}>
                  <button type="submit" style={{ background: '#4f46e5', color: 'white', border: 'none', padding: '14px 28px', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)', display: 'inline-flex', alignItems: 'center', gap: '8px', transition: 'all 0.3s' }} onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'} onMouseLeave={(e) => e.target.style.transform = 'none'}>
                    Perbarui Password
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Tab 3: Preferensi */}
          {activeTab === 'preferensi' && (
            <div className="fade-in">
              <h2 style={{ fontSize: '1.4rem', color: 'var(--color-text)', margin: '0 0 24px 0', paddingBottom: '16px', borderBottom: '1px solid var(--color-border)' }}>Preferensi Sistem</h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '20px', borderBottom: '1px dashed var(--color-border)' }}>
                  <div>
                    <h4 style={{ margin: '0 0 6px 0', fontSize: '1rem', color: 'var(--color-text)' }}>Notifikasi Email</h4>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-muted)' }}>Terima pembaruan penting dan jadwal di email Anda.</p>
                  </div>
                  <label style={{ position: 'relative', display: 'inline-block', width: '50px', height: '26px' }}>
                    <input type="checkbox" defaultChecked style={{ opacity: 0, width: 0, height: 0 }} />
                    <span style={{ position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#4f46e5', transition: '.4s', borderRadius: '34px' }}>
                      <span style={{ position: 'absolute', content: '""', height: '20px', width: '20px', left: '3px', bottom: '3px', backgroundColor: 'white', transition: '.4s', borderRadius: '50%', transform: 'translateX(24px)', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}></span>
                    </span>
                  </label>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '20px', borderBottom: '1px dashed var(--color-border)' }}>
                  <div>
                    <h4 style={{ margin: '0 0 6px 0', fontSize: '1rem', color: 'var(--color-text)' }}>Visibilitas Publik</h4>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-muted)' }}>Izinkan pengguna lain melihat nomor HP dan email Anda.</p>
                  </div>
                  <label style={{ position: 'relative', display: 'inline-block', width: '50px', height: '26px' }}>
                    <input type="checkbox" style={{ opacity: 0, width: 0, height: 0 }} />
                    <span style={{ position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'var(--color-border)', transition: '.4s', borderRadius: '34px' }}>
                      <span style={{ position: 'absolute', content: '""', height: '20px', width: '20px', left: '3px', bottom: '3px', backgroundColor: 'white', transition: '.4s', borderRadius: '50%', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}></span>
                    </span>
                  </label>
                </div>

              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
