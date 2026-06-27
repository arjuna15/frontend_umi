'use client';
import { useState } from 'react';
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
        throw new Error(data.message || 'Kredensial tidak valid.');
      }

      localStorage.setItem('siakad_token', data.token);
      localStorage.setItem('siakad_role', data.user.role);

      if (data.user.role === 'mahasiswa') router.push('/siakad/mahasiswa');
      else if (data.user.role === 'dosen') router.push('/siakad/dosen');
      else if (data.user.role === 'kaprodi') router.push('/siakad/kaprodi');
      else router.push('/siakad/admin');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="neu-container">
      <style jsx global>{`
        body { margin: 0; padding: 0; background: #e8ecf1; font-family: 'Inter', sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; }
        
        .neu-container {
          width: 100%;
          padding: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .neu-card {
          width: 100%;
          max-width: 950px;
          height: 600px;
          background: #ffffff;
          border-radius: 40px;
          box-shadow: 20px 20px 60px #c5c9cd, -20px -20px 60px #ffffff;
          display: flex;
          overflow: hidden;
          position: relative;
        }

        /* LEFT SIDE - FORM */
        .neu-form-section {
          flex: 0 0 55%;
          padding: 60px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          position: relative;
          z-index: 10;
        }

        .neu-header {
          text-align: center;
          margin-bottom: 40px;
        }
        .neu-header h1 {
          font-size: 2.5rem;
          color: #1e293b;
          margin: 0 0 8px 0;
          font-weight: 800;
        }
        .neu-header p {
          color: #64748b;
          font-size: 1rem;
          margin: 0;
        }

        /* Neumorphic Input */
        .neu-input-group {
          position: relative;
          margin-bottom: 25px;
          width: 100%;
          max-width: 380px;
          margin-left: auto;
          margin-right: auto;
        }
        .neu-icon-box {
          position: absolute;
          left: 15px;
          top: 50%;
          transform: translateY(-50%);
          width: 40px;
          height: 40px;
          background: #ffffff;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 5px 5px 10px #e2e8f0, -5px -5px 10px #ffffff;
          color: #ef4444;
          font-size: 1.2rem;
          z-index: 5;
        }
        .neu-input {
          width: 100%;
          padding: 18px 20px 18px 70px;
          border: none;
          background: #f8fafc;
          border-radius: 20px;
          font-size: 1rem;
          color: #334155;
          outline: none;
          box-shadow: inset 5px 5px 10px #e2e8f0, inset -5px -5px 10px #ffffff;
          transition: all 0.3s ease;
        }
        .neu-input:focus {
          background: #ffffff;
          box-shadow: inset 2px 2px 5px #e2e8f0, inset -2px -2px 5px #ffffff;
        }
        .neu-input::placeholder {
          color: #94a3b8;
          font-weight: 500;
        }

        .neu-eye {
          position: absolute;
          right: 20px;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
          cursor: pointer;
          font-size: 1.2rem;
          transition: color 0.3s;
        }
        .neu-eye:hover { color: #ef4444; }

        .neu-options {
          display: flex;
          justify-content: space-between;
          max-width: 380px;
          margin: 0 auto 40px auto;
          font-size: 0.9rem;
          color: #64748b;
        }
        
        .neu-checkbox-wrapper {
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
        }
        .neu-checkbox {
          width: 22px;
          height: 22px;
          border-radius: 6px;
          background: #f8fafc;
          box-shadow: inset 3px 3px 6px #e2e8f0, inset -3px -3px 6px #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        input:checked + .neu-checkbox {
          background: #ef4444;
          box-shadow: inset 3px 3px 6px #b91c1c, inset -3px -3px 6px #f87171;
        }

        .neu-btn {
          display: block;
          width: 100%;
          max-width: 200px;
          margin: 0 auto;
          padding: 16px;
          border-radius: 30px;
          border: none;
          background: linear-gradient(135deg, #ef4444, #b91c1c);
          color: white;
          font-size: 1.05rem;
          font-weight: 700;
          cursor: pointer;
          box-shadow: 5px 5px 15px rgba(239, 68, 68, 0.4), -5px -5px 15px rgba(255, 255, 255, 0.8);
          transition: all 0.3s ease;
        }
        .neu-btn:hover {
          transform: translateY(-2px);
          box-shadow: 8px 8px 20px rgba(239, 68, 68, 0.5), -5px -5px 15px rgba(255, 255, 255, 0.8);
        }
        .neu-btn:active {
          transform: translateY(2px);
          box-shadow: inset 5px 5px 10px rgba(153, 27, 27, 0.5), inset -5px -5px 10px rgba(248, 113, 113, 0.5);
        }

        /* RIGHT SIDE - COLORED WAVE */
        .neu-color-section {
          flex: 0 0 45%;
          background: linear-gradient(135deg, #b91c1c 0%, #7f1d1d 100%);
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          color: white;
          text-align: center;
          padding: 40px;
        }

        /* The SVG Wave Separator */
        .neu-wave {
          position: absolute;
          left: -140px;
          top: 0;
          height: 100%;
          width: 150px;
          z-index: 5;
        }

        .neu-color-content {
          z-index: 10;
          position: relative;
        }
        .neu-color-content h2 {
          font-size: 2.5rem;
          font-weight: 800;
          margin: 0 0 16px 0;
          text-shadow: 2px 4px 10px rgba(0,0,0,0.3);
        }
        .neu-color-content p {
          font-size: 1.05rem;
          line-height: 1.6;
          opacity: 0.9;
          max-width: 280px;
          margin: 0 auto;
        }

        .error-alert {
          background: #fef2f2;
          border: 1px solid #f87171;
          color: #ef4444;
          padding: 12px;
          border-radius: 12px;
          margin: 0 auto 24px auto;
          max-width: 380px;
          font-size: 0.9rem;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        @media (max-width: 900px) {
          .neu-card { flex-direction: column; height: auto; }
          .neu-form-section { padding: 40px 20px; }
          .neu-color-section { padding: 60px 20px; border-radius: 0 0 40px 40px; }
          .neu-wave { display: none; }
        }
      `}</style>

      <div className="neu-card">
        
        <section className="neu-form-section">
          <div className="neu-header">
            <h1>Halo!</h1>
            <p>Masuk ke portal SIAKAD UMIBA</p>
          </div>

          {error && (
            <div className="error-alert">
              <i className="ph-warning-circle"></i> {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="neu-input-group">
              <div className="neu-icon-box">
                <i className="ph-envelope-simple"></i>
              </div>
              <input 
                type="text" 
                className="neu-input" 
                placeholder="NIM / NIP" 
                value={nim}
                onChange={e => setNim(e.target.value)}
                required
              />
            </div>

            <div className="neu-input-group">
              <div className="neu-icon-box">
                <i className="ph-lock-key"></i>
              </div>
              <input 
                type={showPassword ? "text" : "password"} 
                className="neu-input" 
                placeholder="Password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              <i 
                className={`neu-eye ${showPassword ? 'ph-eye-slash' : 'ph-eye'}`} 
                onClick={() => setShowPassword(!showPassword)}
              ></i>
            </div>

            <div className="neu-options">
              <label className="neu-checkbox-wrapper">
                <input type="checkbox" style={{ display: 'none' }} />
                <div className="neu-checkbox">
                  <i className="ph-check" style={{ color: 'white', fontSize: '14px', opacity: 0 }}></i>
                </div>
                Ingat saya
              </label>
              <a href="#" style={{ color: '#64748b', textDecoration: 'none' }}>Lupa password?</a>
            </div>

            <button type="submit" disabled={loading} className="neu-btn">
              {loading ? 'Validasi...' : 'MASUK'}
            </button>
          </form>
        </section>

        <section className="neu-color-section">
          {/* Custom SVG Wave for the edge */}
          <svg className="neu-wave" preserveAspectRatio="none" viewBox="0 0 100 100">
            <path d="M100,0 C30,30 30,70 100,100 L100,0 Z" fill="#b91c1c" style={{ transform: 'scaleX(2.5)', transformOrigin: 'right center' }} />
          </svg>

          <div className="neu-color-content">
            <Image src="/icon.png" width={80} height={80} alt="Logo" style={{ marginBottom: '20px', filter: 'drop-shadow(0px 10px 15px rgba(0,0,0,0.3))' }} />
            <h2>Selamat Datang!</h2>
            <p>Sistem Informasi Akademik Digital Universitas Bina Bangsa.</p>
          </div>
        </section>

      </div>
    </main>
  );
}
