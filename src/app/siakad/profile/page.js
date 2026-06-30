"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

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
        body: JSON.stringify({ password })
      });

      if (res.ok) {
        alert('Password berhasil diperbarui!');
        e.target.reset();
      } else {
        alert('Gagal memperbarui password');
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
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--color-text)', margin: '0 0 8px 0' }}>Pengaturan Akun ⚙️</h1>
        <p style={{ color: 'var(--color-muted)', margin: 0 }}>Kelola profil dan ubah kata sandi Anda.</p>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', alignItems: 'flex-start' }}>
        <div style={{ flex: '1 1 250px', background: 'var(--color-bg)', padding: '32px', borderRadius: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', textAlign: 'center' }}>
          <div style={{ width: '120px', height: '120px', borderRadius: '50%', background: '#e0e7ff', color: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: '3rem' }}>
            <i className="ph ph-user-circle"></i>
          </div>
          <h2 style={{ margin: '0 0 8px', color: 'var(--color-text)', fontSize: '1.2rem' }}>{user.name}</h2>
          <p style={{ margin: '0 0 8px', color: 'var(--color-muted)', fontSize: '0.9rem' }}>NIM/NIP: {user.nim_nip}</p>
          <p style={{ margin: 0 }}>
            <span style={{ padding: '4px 12px', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 'bold', background: '#ecfdf5', color: '#059669', textTransform: 'capitalize' }}>
              {user.role}
            </span>
          </p>
        </div>

        <div style={{ flex: '2 1 350px', background: 'var(--color-bg)', padding: '32px', borderRadius: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
          <h3 style={{ margin: '0 0 24px', color: 'var(--color-text)' }}>Ubah Password</h3>
          <form onSubmit={handleUpdatePassword} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--color-muted)', fontWeight: '600' }}>Password Baru</label>
              <input type="password" name="password" required minLength="6" placeholder="Masukkan password baru..." style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--color-muted)', fontWeight: '600' }}>Konfirmasi Password Baru</label>
              <input type="password" name="confirm" required minLength="6" placeholder="Ulangi password baru..." style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none' }} />
            </div>
            <div style={{ marginTop: '8px' }}>
              <button type="submit" style={{ background: '#4f46e5', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 4px 6px -1px rgba(79, 70, 229, 0.2)' }}>
                Simpan Perubahan
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
