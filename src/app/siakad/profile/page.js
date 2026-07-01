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
      return alert('Password tidak sama!');
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
        alert('Password berhasil diperbarui!');
        e.target.reset();
      } else {
        const err = await res.json();
        alert('Gagal: ' + (err.message || 'Server Error'));
      }
    } catch (err) {
      alert('Error: ' + err.message);
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
        alert('Profil berhasil diperbarui!');
      } else {
        const err = await res.json();
        alert('Gagal: ' + (err.message || 'Server Error'));
      }
    } catch (err) {
      alert('Error: ' + err.message);
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
        alert('Foto profil berhasil diperbarui!');
      } else {
        alert('Gagal mengunggah foto profil.');
      }
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  if (loading || !user) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--color-muted)' }}>
      <i className="ph ph-spinner ph-spin" style={{ fontSize: '2rem', marginRight: '10px' }}></i> Memuat profil...
    </div>
  );

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--color-text)', margin: '0 0 8px 0' }}>Pengaturan Akun ⚙️</h1>
        <p style={{ color: 'var(--color-muted)', margin: 0 }}>Kelola profil, informasi akademik, dan preferensi Anda.</p>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', alignItems: 'flex-start' }}>
        
        {/* Left Sidebar: Profile Card */}
        <div className="siakad-card" style={{ flex: '1 1 250px', padding: '32px 24px', textAlign: 'center' }}>
          <div style={{ position: 'relative', width: '120px', height: '120px', margin: '0 auto 16px' }}>
            {user.avatar_url ? (
              <img src={user.avatar_url} alt="Profile" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover', border: '4px solid var(--glass-bg)', boxShadow: '0 8px 16px rgba(0,0,0,0.1)' }} />
            ) : (
              <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: 'linear-gradient(135deg, #4f46e5 0%, #ec4899 100%)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3.5rem', boxShadow: '0 8px 16px rgba(0,0,0,0.1)' }}>
                <i className="ph ph-user-circle"></i>
              </div>
            )}
            
            <button 
              onClick={() => fileInputRef.current.click()}
              style={{ position: 'absolute', bottom: 0, right: 0, width: '36px', height: '36px', borderRadius: '50%', background: '#4f46e5', color: 'white', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
              title="Ganti Foto Profil"
            >
              <i className="ph ph-camera" style={{ fontSize: '1.2rem' }}></i>
            </button>
            <input type="file" ref={fileInputRef} onChange={handleAvatarUpload} accept="image/*" style={{ display: 'none' }} />
          </div>
          
          <h2 style={{ margin: '0 0 4px', color: 'var(--color-text)', fontSize: '1.2rem' }}>{user.name}</h2>
          <p style={{ margin: '0 0 12px', color: 'var(--color-muted)', fontSize: '0.9rem' }}>{user.nim_nip}</p>
          <span style={{ padding: '4px 12px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 'bold', background: user.role === 'admin' ? '#fee2e2' : user.role === 'dosen' ? '#e0e7ff' : '#dcfce7', color: user.role === 'admin' ? '#991b1b' : user.role === 'dosen' ? '#3730a3' : '#166534', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            {user.role}
          </span>

          {user.prodi && (
            <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid var(--color-border)', textAlign: 'left' }}>
              <p style={{ margin: '0 0 8px', fontSize: '0.8rem', color: 'var(--color-muted)', fontWeight: 'bold', textTransform: 'uppercase' }}>Program Studi</p>
              <p style={{ margin: 0, color: 'var(--color-text)', fontWeight: '500' }}>{user.prodi}</p>
            </div>
          )}
        </div>

        {/* Right Content: Tabs & Forms */}
        <div className="siakad-card" style={{ flex: '2 1 450px', padding: 0, overflow: 'hidden' }}>
          
          {/* Tab Navigation */}
          <div style={{ display: 'flex', borderBottom: '1px solid var(--color-border)', background: 'var(--glass-bg)' }}>
            <button 
              onClick={() => setActiveTab('pribadi')}
              style={{ flex: 1, padding: '16px', background: 'none', border: 'none', borderBottom: activeTab === 'pribadi' ? '3px solid #4f46e5' : '3px solid transparent', color: activeTab === 'pribadi' ? '#4f46e5' : 'var(--color-muted)', fontWeight: activeTab === 'pribadi' ? 'bold' : '500', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              <i className="ph ph-identification-card"></i> Informasi Pribadi
            </button>
            <button 
              onClick={() => setActiveTab('keamanan')}
              style={{ flex: 1, padding: '16px', background: 'none', border: 'none', borderBottom: activeTab === 'keamanan' ? '3px solid #4f46e5' : '3px solid transparent', color: activeTab === 'keamanan' ? '#4f46e5' : 'var(--color-muted)', fontWeight: activeTab === 'keamanan' ? 'bold' : '500', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              <i className="ph ph-shield-check"></i> Keamanan
            </button>
            <button 
              onClick={() => setActiveTab('preferensi')}
              style={{ flex: 1, padding: '16px', background: 'none', border: 'none', borderBottom: activeTab === 'preferensi' ? '3px solid #4f46e5' : '3px solid transparent', color: activeTab === 'preferensi' ? '#4f46e5' : 'var(--color-muted)', fontWeight: activeTab === 'preferensi' ? 'bold' : '500', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              <i className="ph ph-sliders"></i> Preferensi
            </button>
          </div>

          <div style={{ padding: '32px' }}>
            
            {/* Tab 1: Informasi Pribadi */}
            {activeTab === 'pribadi' && (
              <div className="fade-in">
                <h3 style={{ margin: '0 0 24px', color: 'var(--color-text)' }}>Informasi Pribadi</h3>
                <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                    <div style={{ flex: '1 1 200px' }}>
                      <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--color-muted)', fontWeight: '600' }}>Email</label>
                      <input type="email" name="email" defaultValue={user.email} placeholder="contoh@kampus.ac.id" style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--color-border)', outline: 'none', background: 'var(--glass-bg)', color: 'var(--color-text)' }} />
                    </div>
                    <div style={{ flex: '1 1 200px' }}>
                      <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--color-muted)', fontWeight: '600' }}>Nomor HP</label>
                      <input type="tel" name="phone" defaultValue={user.phone} placeholder="08123456789" style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--color-border)', outline: 'none', background: 'var(--glass-bg)', color: 'var(--color-text)' }} />
                    </div>
                  </div>
                  
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--color-muted)', fontWeight: '600' }}>Alamat Lengkap</label>
                    <textarea name="address" defaultValue={user.address} rows="3" placeholder="Jl. Raya Kampus No. 1..." style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--color-border)', outline: 'none', background: 'var(--glass-bg)', color: 'var(--color-text)', resize: 'vertical' }}></textarea>
                  </div>
                  
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--color-muted)', fontWeight: '600' }}>Bio Singkat</label>
                    <textarea name="bio" defaultValue={user.bio} rows="2" placeholder="Tuliskan sedikit tentang diri Anda..." style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--color-border)', outline: 'none', background: 'var(--glass-bg)', color: 'var(--color-text)', resize: 'vertical' }}></textarea>
                  </div>

                  <div style={{ marginTop: '8px' }}>
                    <button type="submit" style={{ background: '#4f46e5', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 4px 6px -1px rgba(79, 70, 229, 0.2)', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                      <i className="ph ph-floppy-disk"></i> Simpan Profil
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Tab 2: Keamanan */}
            {activeTab === 'keamanan' && (
              <div className="fade-in">
                <h3 style={{ margin: '0 0 24px', color: 'var(--color-text)' }}>Ubah Kata Sandi</h3>
                <form onSubmit={handleUpdatePassword} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--color-muted)', fontWeight: '600' }}>Password Saat Ini</label>
                    <input type="password" name="current_password" required placeholder="Masukkan password lama..." style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--color-border)', outline: 'none', background: 'var(--glass-bg)', color: 'var(--color-text)' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--color-muted)', fontWeight: '600' }}>Password Baru</label>
                    <input type="password" name="password" required minLength="6" placeholder="Masukkan password baru..." style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--color-border)', outline: 'none', background: 'var(--glass-bg)', color: 'var(--color-text)' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--color-muted)', fontWeight: '600' }}>Konfirmasi Password Baru</label>
                    <input type="password" name="confirm" required minLength="6" placeholder="Ulangi password baru..." style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--color-border)', outline: 'none', background: 'var(--glass-bg)', color: 'var(--color-text)' }} />
                  </div>
                  <div style={{ marginTop: '8px' }}>
                    <button type="submit" style={{ background: '#4f46e5', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 4px 6px -1px rgba(79, 70, 229, 0.2)', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                      <i className="ph ph-lock-key"></i> Perbarui Password
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Tab 3: Preferensi */}
            {activeTab === 'preferensi' && (
              <div className="fade-in">
                <h3 style={{ margin: '0 0 24px', color: 'var(--color-text)' }}>Preferensi Sistem</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '20px', borderBottom: '1px solid var(--color-border)' }}>
                    <div>
                      <h4 style={{ margin: '0 0 4px', fontSize: '1rem', color: 'var(--color-text)' }}>Notifikasi Email</h4>
                      <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-muted)' }}>Terima email saat ada tugas atau jadwal baru.</p>
                    </div>
                    <label style={{ position: 'relative', display: 'inline-block', width: '44px', height: '24px' }}>
                      <input type="checkbox" defaultChecked style={{ opacity: 0, width: 0, height: 0 }} />
                      <span style={{ position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#4f46e5', transition: '.4s', borderRadius: '34px' }}>
                        <span style={{ position: 'absolute', content: '""', height: '18px', width: '18px', left: '3px', bottom: '3px', backgroundColor: 'white', transition: '.4s', borderRadius: '50%', transform: 'translateX(20px)' }}></span>
                      </span>
                    </label>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '20px', borderBottom: '1px solid var(--color-border)' }}>
                    <div>
                      <h4 style={{ margin: '0 0 4px', fontSize: '1rem', color: 'var(--color-text)' }}>Autentikasi 2 Langkah (2FA)</h4>
                      <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-muted)' }}>Tingkatkan keamanan akun Anda dengan OTP.</p>
                    </div>
                    <button style={{ background: 'var(--glass-bg)', color: '#4f46e5', border: '1px solid #4f46e5', padding: '6px 12px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
                      Aktifkan
                    </button>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h4 style={{ margin: '0 0 4px', fontSize: '1rem', color: 'var(--color-text)' }}>Sembunyikan Bio dari Publik</h4>
                      <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-muted)' }}>Bio hanya bisa dilihat oleh admin atau dosen wali.</p>
                    </div>
                    <label style={{ position: 'relative', display: 'inline-block', width: '44px', height: '24px' }}>
                      <input type="checkbox" style={{ opacity: 0, width: 0, height: 0 }} />
                      <span style={{ position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#ccc', transition: '.4s', borderRadius: '34px' }}>
                        <span style={{ position: 'absolute', content: '""', height: '18px', width: '18px', left: '3px', bottom: '3px', backgroundColor: 'white', transition: '.4s', borderRadius: '50%' }}></span>
                      </span>
                    </label>
                  </div>

                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
