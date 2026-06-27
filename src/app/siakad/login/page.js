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
    <main className="glass-container">
      <style jsx>{`
        .glass-container {
          width: 100vw;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          background: #f1f5f9;
          font-family: 'Plus Jakarta Sans', 'Inter', sans-serif;
          position: relative;
          overflow: hidden;
        }

        /* Ambient Animated Blobs */
        .ambient-blob {
          position: absolute;
          filter: blur(80px);
          opacity: 0.7;
          border-radius: 50%;
          animation: floatBlob 20s infinite alternate cubic-bezier(0.4, 0, 0.2, 1);
          pointer-events: none;
        }
        .blob-1 {
          top: -10%; left: -5%; width: 50vw; height: 50vw;
          background: radial-gradient(circle, rgba(239, 68, 68, 0.5) 0%, rgba(239, 68, 68, 0) 70%);
          animation-delay: 0s;
        }
        .blob-2 {
          bottom: -20%; right: -10%; width: 60vw; height: 60vw;
          background: radial-gradient(circle, rgba(59, 130, 246, 0.4) 0%, rgba(59, 130, 246, 0) 70%);
          animation-delay: -5s;
        }
        .blob-3 {
          top: 30%; left: 30%; width: 40vw; height: 40vw;
          background: radial-gradient(circle, rgba(168, 85, 247, 0.3) 0%, rgba(168, 85, 247, 0) 70%);
          animation-delay: -10s;
        }

        @keyframes floatBlob {
          0% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(5%, 10%) scale(1.1); }
          100% { transform: translate(-5%, -5%) scale(0.9); }
        }

        .glass-card {
          width: 100%;
          max-width: 1100px;
          height: 600px;
          background: rgba(255, 255, 255, 0.4);
          backdrop-filter: blur(40px);
          -webkit-backdrop-filter: blur(40px);
          border: 1px solid rgba(255, 255, 255, 0.8);
          border-radius: 32px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1), inset 0 0 0 1px rgba(255, 255, 255, 0.5);
          display: flex;
          overflow: hidden;
          position: relative;
          z-index: 10;
        }

        /* LEFT SIDE - FORM */
        .glass-form-section {
          flex: 0 0 55%;
          padding: 60px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          position: relative;
          z-index: 10;
        }

        .glass-header {
          text-align: center;
          margin-bottom: 40px;
        }
        .glass-header h1 {
          font-size: 2.8rem;
          color: #0f172a;
          margin: 0 0 8px 0;
          font-weight: 800;
          letter-spacing: -0.05em;
        }
        .glass-header p {
          color: #475569;
          font-size: 1.05rem;
          margin: 0;
          font-weight: 500;
        }

        /* Inputs */
        .glass-input-group {
          position: relative;
          margin-bottom: 24px;
          width: 100%;
          max-width: 400px;
          margin-left: auto;
          margin-right: auto;
        }
        .glass-icon-box {
          position: absolute;
          left: 20px;
          top: 50%;
          transform: translateY(-50%);
          color: #64748b;
          font-size: 1.25rem;
          z-index: 5;
          transition: all 0.3s ease;
        }
        .glass-input {
          width: 100%;
          padding: 16px 20px 16px 56px;
          border: 2px solid transparent;
          background: rgba(255, 255, 255, 0.6);
          border-radius: 16px;
          font-size: 1rem;
          color: #1e293b;
          outline: none;
          box-shadow: inset 0 2px 4px rgba(0,0,0,0.02);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          font-weight: 500;
        }
        .glass-input:focus {
          background: rgba(255, 255, 255, 0.9);
          border-color: #3b82f6;
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
        }
        .glass-input:focus + .glass-icon-box, 
        .glass-input-group:focus-within .glass-icon-box {
          color: #3b82f6;
          transform: translateY(-50%) scale(1.1);
        }
        .glass-input::placeholder {
          color: #94a3b8;
          font-weight: 500;
        }

        .glass-eye {
          position: absolute;
          right: 20px;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
          cursor: pointer;
          font-size: 1.2rem;
          transition: color 0.3s;
        }
        .glass-eye:hover { color: #3b82f6; }

        .glass-options {
          display: flex;
          justify-content: space-between;
          max-width: 400px;
          margin: 0 auto 40px auto;
          font-size: 0.9rem;
          color: #475569;
          font-weight: 500;
        }
        
        .glass-checkbox-wrapper {
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
        }
        .glass-checkbox {
          width: 20px;
          height: 20px;
          border-radius: 6px;
          background: rgba(255, 255, 255, 0.8);
          border: 1px solid #cbd5e1;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }
        input:checked + .glass-checkbox {
          background: #3b82f6;
          border-color: #3b82f6;
        }

        .glass-btn {
          display: block;
          width: 100%;
          max-width: 400px;
          margin: 0 auto;
          padding: 18px;
          border-radius: 16px;
          border: none;
          background: linear-gradient(135deg, #ef4444, #dc2626);
          color: white;
          font-size: 1.1rem;
          font-weight: 700;
          cursor: pointer;
          box-shadow: 0 10px 20px -5px rgba(239, 68, 68, 0.4);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          letter-spacing: 0.05em;
        }
        .glass-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 15px 25px -5px rgba(239, 68, 68, 0.5);
          background: linear-gradient(135deg, #f87171, #ef4444);
        }
        .glass-btn:active {
          transform: translateY(1px);
          box-shadow: 0 5px 10px -5px rgba(239, 68, 68, 0.4);
        }

        /* RIGHT SIDE - COLOR PANE */
        .glass-color-section {
          flex: 0 0 45%;
          background: linear-gradient(135deg, rgba(239, 68, 68, 0.9), rgba(153, 27, 27, 0.9));
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
          padding: 40px;
          overflow: hidden;
        }

        /* Inner Glass Effect for Right Side */
        .glass-color-section::before {
          content: '';
          position: absolute;
          inset: 0;
          background: url('https://www.transparenttextures.com/patterns/cubes.png');
          opacity: 0.1;
        }

        .glass-color-content {
          z-index: 10;
          position: relative;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          padding: 40px 30px;
          border-radius: 24px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        }
        .glass-color-content h2 {
          font-size: 2.5rem;
          font-weight: 800;
          margin: 0 0 16px 0;
          color: #ffffff;
          letter-spacing: -0.03em;
        }
        .glass-color-content p {
          font-size: 1.1rem;
          line-height: 1.6;
          color: rgba(255, 255, 255, 0.9);
          max-width: 280px;
          margin: 0 auto;
        }

        .error-alert {
          background: rgba(254, 242, 242, 0.8);
          backdrop-filter: blur(8px);
          border: 1px solid #f87171;
          color: #ef4444;
          padding: 12px 16px;
          border-radius: 12px;
          margin: 0 auto 24px auto;
          max-width: 400px;
          font-size: 0.95rem;
          display: flex;
          align-items: center;
          gap: 10px;
          font-weight: 600;
          animation: slideDown 0.3s ease-out;
        }

        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 900px) {
          .glass-card { flex-direction: column; height: auto; }
          .glass-form-section { padding: 40px 20px; }
          .glass-color-section { padding: 40px 20px; }
          .glass-color-content { padding: 30px 20px; }
        }

        @media (max-width: 480px) {
          .glass-container { padding: 16px; }
          .glass-card { border-radius: 24px; }
          .glass-header h1 { font-size: 2.2rem; }
          .glass-color-content h2 { font-size: 1.8rem; }
        }
      `}</style>

      {/* Ambient Background */}
      <div className="ambient-blob blob-1"></div>
      <div className="ambient-blob blob-2"></div>
      <div className="ambient-blob blob-3"></div>

      <div className="glass-card">

        <section className="glass-form-section">
          <div className="glass-header">
            <h1>Halo!</h1>
            <p>Masuk ke portal SIAKAD UMIBA</p>
          </div>

          {error && (
            <div className="error-alert">
              <i className="ph ph-warning-circle" style={{ fontSize: '1.2rem' }}></i> {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="glass-input-group">
              <i className="ph ph-envelope-simple glass-icon-box"></i>
              <input
                type="text"
                className="glass-input"
                placeholder="NIM / NIP / Username"
                value={nim}
                onChange={e => setNim(e.target.value)}
                required
              />
            </div>

            <div className="glass-input-group">
              <i className="ph ph-lock-key glass-icon-box"></i>
              <input
                type={showPassword ? "text" : "password"}
                className="glass-input"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              <i
                className={`glass-eye ${showPassword ? 'ph ph-eye-slash' : 'ph ph-eye'}`}
                onClick={() => setShowPassword(!showPassword)}
              ></i>
            </div>

            <div className="glass-options">
              <label className="glass-checkbox-wrapper">
                <input type="checkbox" style={{ display: 'none' }} />
                <div className="glass-checkbox">
                  <i className="ph ph-check" style={{ color: 'white', fontSize: '14px', fontWeight: 'bold' }}></i>
                </div>
                Ingat saya
              </label>
              <a href="#" style={{ color: '#ef4444', fontWeight: '600', textDecoration: 'none', transition: 'color 0.2s' }}>
                Lupa password?
              </a>
            </div>

            <button type="submit" disabled={loading} className="glass-btn">
              {loading ? 'Validasi...' : 'MASUK'}
            </button>
          </form>
        </section>

        <section className="glass-color-section">
          <div className="glass-color-content">
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
              <div style={{ background: 'white', padding: '16px', borderRadius: '50%', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
                <Image src="/icon.png" width={70} height={70} alt="Logo" style={{ filter: 'drop-shadow(0px 4px 6px rgba(0,0,0,0.1))' }} />
              </div>
            </div>
            <h2>Selamat Datang!</h2>
            <p>Sistem Informasi Akademik Digital Universitas Bina Bangsa.</p>
          </div>
        </section>

      </div>
    </main>
  );
}
