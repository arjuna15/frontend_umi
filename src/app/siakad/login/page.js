"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function SiakadLogin() {
  const router = useRouter();
  const [nim, setNim] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
      const res = await fetch(`${apiUrl}/siakad/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nim_nip: nim, password })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Login gagal');
      }

      // Save token and role
      localStorage.setItem('siakad_token', data.token);
      localStorage.setItem('siakad_role', data.user.role);

      // Redirect based on role
      if (data.user.role === 'mahasiswa') {
        router.push('/siakad/mahasiswa');
      } else if (data.user.role === 'dosen') {
        router.push('/siakad/dosen');
      } else {
        router.push('/siakad/admin');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="portal-section" style={{ position: 'relative', minHeight: 'calc(100vh - 80px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ position: 'absolute', inset: 0, zIndex: -2 }}>
        <Image src="https://umiba.ac.id/wp-content/uploads/2026/05/rektor-UMIBA-2026.jpeg" alt="Background" fill style={{ objectFit: 'cover', filter: 'blur(5px) brightness(0.4)' }} unoptimized />
      </div>
      <div className="hero-overlay-red" style={{ position: 'absolute', inset: 0, zIndex: -1, opacity: 0.8 }}></div>

      <div className="glass-card" style={{ width: '100%', maxWidth: '400px', padding: '40px', borderRadius: '20px', background: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.2)', boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{ background: 'white', width: '60px', height: '60px', borderRadius: '50%', margin: '0 auto 15px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Image src="/icon.png" width={40} height={40} alt="Logo" />
          </div>
          <h2 style={{ color: 'white', fontSize: '1.5rem', fontWeight: 800, textTransform: 'uppercase' }}>Login SIAKAD</h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem' }}>Sistem Informasi Akademik UMIBA</p>
        </div>

        {error && <div style={{ background: '#ef4444', color: 'white', padding: '10px', borderRadius: '8px', marginBottom: '20px', fontSize: '0.9rem', textAlign: 'center' }}>{error}</div>}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ color: 'white', fontSize: '0.9rem', marginBottom: '8px', display: 'block' }}>NIM / NIP</label>
            <input type="text" required value={nim} onChange={e => setNim(e.target.value)} style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.1)', color: 'white', fontSize: '1rem', outline: 'none' }} placeholder="Masukkan NIM/NIP Anda" />
          </div>
          <div>
            <label style={{ color: 'white', fontSize: '0.9rem', marginBottom: '8px', display: 'block' }}>Password</label>
            <input type="password" required value={password} onChange={e => setPassword(e.target.value)} style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.1)', color: 'white', fontSize: '1rem', outline: 'none' }} placeholder="••••••••" />
          </div>
          <button type="submit" disabled={loading} style={{ width: '100%', padding: '14px', borderRadius: '8px', background: '#B91C1C', color: 'white', fontWeight: 'bold', fontSize: '1rem', cursor: loading ? 'not-allowed' : 'pointer', transition: 'background 0.3s', border: 'none', marginTop: '10px' }}>
            {loading ? 'Memproses...' : 'Masuk Sekarang'}
          </button>
        </form>
      </div>
    </section>
  );
}
