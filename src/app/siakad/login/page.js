'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function SiakadLogin() {
  const router = useRouter();
  const [nim, setNim] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
        throw new Error(data.message || 'Login gagal. Periksa kembali NIM/NIP dan Password Anda.');
      }

      // Save token and role
      localStorage.setItem('siakad_token', data.token);
      localStorage.setItem('siakad_role', data.user.role);

      // Redirect based on role
      if (data.user.role === 'mahasiswa') {
        router.push('/siakad/mahasiswa');
      } else if (data.user.role === 'dosen') {
        router.push('/siakad/dosen');
      } else if (data.user.role === 'kaprodi') {
        router.push('/siakad/kaprodi');
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
    <section style={{ 
      position: 'relative', 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      overflow: 'hidden',
      background: '#0f172a'
    }}>
      
      {/* Animated Background Elements */}
      <div style={{
        position: 'absolute', top: '-10%', left: '-10%', width: '50vw', height: '50vw',
        background: 'radial-gradient(circle, rgba(220,38,38,0.15) 0%, rgba(0,0,0,0) 70%)',
        borderRadius: '50%', filter: 'blur(60px)', animation: 'float 8s ease-in-out infinite'
      }}></div>
      
      <div style={{
        position: 'absolute', bottom: '-20%', right: '-10%', width: '60vw', height: '60vw',
        background: 'radial-gradient(circle, rgba(59,130,246,0.1) 0%, rgba(0,0,0,0) 70%)',
        borderRadius: '50%', filter: 'blur(80px)', animation: 'float 12s ease-in-out infinite reverse'
      }}></div>
      
      <div style={{ position: 'absolute', inset: 0, zIndex: 0, opacity: 0.3 }}>
        <Image src="https://umiba.ac.id/wp-content/uploads/2026/05/rektor-UMIBA-2026.jpeg" alt="Background" fill style={{ objectFit: 'cover', filter: 'grayscale(100%)' }} unoptimized />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(15,23,42,0.9) 0%, rgba(15,23,42,0.7) 100%)' }}></div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-30px) scale(1.05); }
        }
        .login-input-group {
          position: relative;
          margin-bottom: 24px;
        }
        .login-input {
          width: 100%;
          padding: 16px 16px 16px 48px;
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.05);
          color: white;
          font-size: 1rem;
          outline: none;
          transition: all 0.3s ease;
        }
        .login-input:focus {
          border-color: #ef4444;
          background: rgba(255,255,255,0.1);
          box-shadow: 0 0 0 4px rgba(239,68,68,0.1);
        }
        .login-input::placeholder {
          color: rgba(255,255,255,0.4);
        }
        .input-icon {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          color: rgba(255,255,255,0.5);
          font-size: 1.2rem;
          transition: color 0.3s ease;
        }
        .login-input:focus + .input-icon {
          color: #ef4444;
        }
        .login-btn {
          width: 100%;
          padding: 16px;
          border-radius: 12px;
          background: linear-gradient(135deg, #ef4444 0%, #b91c1c 100%);
          color: white;
          font-weight: 700;
          font-size: 1.1rem;
          letter-spacing: 0.5px;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(220,38,38,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }
        .login-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(220,38,38,0.4);
          background: linear-gradient(135deg, #f87171 0%, #dc2626 100%);
        }
        .login-btn:active {
          transform: translateY(1px);
        }
        .login-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }
      `}</style>

      <div className="fade-in" style={{ 
        width: '100%', maxWidth: '440px', padding: '48px', 
        borderRadius: '24px', 
        background: 'rgba(30, 41, 59, 0.6)', 
        backdropFilter: 'blur(20px)', 
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.1)', 
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
        zIndex: 10
      }}>
        
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ 
            background: 'white', width: '80px', height: '80px', 
            borderRadius: '24px', margin: '0 auto 24px', 
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
            transform: 'rotate(-5deg)',
            transition: 'transform 0.3s ease'
          }}
          onMouseEnter={e => e.currentTarget.style.transform = 'rotate(0deg) scale(1.05)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'rotate(-5deg) scale(1)'}
          >
            <Image src="/icon.png" width={55} height={55} alt="Logo" style={{ transform: 'rotate(5deg)' }} />
          </div>
          <h2 style={{ color: 'white', fontSize: '1.8rem', fontWeight: 800, letterSpacing: '1px', margin: '0 0 8px 0' }}>SIAKAD<span style={{color: '#ef4444'}}>.</span>UMIBA</h2>
          <p style={{ color: '#94a3b8', fontSize: '0.95rem', margin: 0 }}>Portal Akademik Digital Terpadu</p>
        </div>

        {error && (
          <div className="fade-in" style={{ 
            background: 'rgba(239, 68, 68, 0.1)', 
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#fca5a5', padding: '12px 16px', borderRadius: '12px', 
            marginBottom: '24px', fontSize: '0.9rem', display: 'flex', gap: '10px', alignItems: 'flex-start' 
          }}>
            <i className="ph-warning-circle" style={{ fontSize: '1.2rem', marginTop: '2px', color: '#ef4444' }}></i>
            <span style={{ lineHeight: 1.5 }}>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="login-input-group">
            <input 
              type="text" 
              required 
              value={nim} 
              onChange={e => setNim(e.target.value)} 
              className="login-input" 
              placeholder="NIM / NIP / Username" 
            />
            <i className="ph-user input-icon"></i>
          </div>
          
          <div className="login-input-group">
            <input 
              type={showPassword ? "text" : "password"}
              required 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              className="login-input" 
              placeholder="Password" 
              style={{ paddingRight: '48px' }}
            />
            <i className="ph-lock-key input-icon"></i>
            <i 
              className={showPassword ? "ph-eye-slash" : "ph-eye"} 
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)',
                color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: '1.2rem', transition: 'color 0.3s'
              }}
              onMouseEnter={e => e.currentTarget.style.color = 'white'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}
            ></i>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', padding: '0 4px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#94a3b8', fontSize: '0.9rem', cursor: 'pointer' }}>
              <input type="checkbox" style={{ accentColor: '#ef4444', width: '16px', height: '16px' }} />
              Ingat Saya
            </label>
            <a href="#" style={{ color: '#ef4444', fontSize: '0.9rem', textDecoration: 'none', transition: 'color 0.3s' }} onMouseEnter={e=>e.currentTarget.style.color='#f87171'} onMouseLeave={e=>e.currentTarget.style.color='#ef4444'}>Lupa Password?</a>
          </div>

          <button type="submit" disabled={loading} className="login-btn">
            {loading ? (
              <><i className="ph-spinner ph-spin"></i> Memvalidasi...</>
            ) : (
              <>Masuk ke Portal <i className="ph-arrow-right" style={{ fontWeight: 'bold' }}></i></>
            )}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '32px', color: '#64748b', fontSize: '0.85rem' }}>
          &copy; {new Date().getFullYear()} Universitas Bina Bangsa.<br/>All rights reserved.
        </div>
      </div>
    </section>
  );
}
