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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  // Generate random particles for background
  const particles = Array.from({ length: 30 }).map((_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    animationDuration: `${Math.random() * 20 + 10}s`,
    animationDelay: `${Math.random() * 5}s`,
    size: `${Math.random() * 4 + 2}px`
  }));

  return (
    <main className="aurora-container">
      <style jsx>{`
        .aurora-container {
          width: 100vw;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #060c18; /* Deep dark slate/navy */
          font-family: 'Plus Jakarta Sans', 'Inter', sans-serif;
          position: relative;
          overflow: hidden;
          padding: 20px;
        }

        /* Ambient Animated Blobs (Aurora Effect) */
        .aurora-blob {
          position: absolute;
          filter: blur(100px);
          opacity: 0.6;
          border-radius: 50%;
          animation: floatBlob 25s infinite alternate cubic-bezier(0.4, 0, 0.2, 1);
          pointer-events: none;
          z-index: 1;
        }
        .blob-1 {
          top: -20%; left: -10%; width: 70vw; height: 70vw;
          background: radial-gradient(circle, rgba(225, 29, 72, 0.4) 0%, rgba(225, 29, 72, 0) 60%);
          animation-delay: 0s;
        }
        .blob-2 {
          bottom: -30%; right: -20%; width: 80vw; height: 80vw;
          background: radial-gradient(circle, rgba(124, 58, 237, 0.4) 0%, rgba(124, 58, 237, 0) 60%);
          animation-delay: -5s;
        }
        .blob-3 {
          top: 40%; left: 40%; width: 50vw; height: 50vw;
          background: radial-gradient(circle, rgba(37, 99, 235, 0.3) 0%, rgba(37, 99, 235, 0) 60%);
          animation-delay: -10s;
        }

        @keyframes floatBlob {
          0% { transform: translate(0, 0) scale(1) rotate(0deg); }
          33% { transform: translate(5%, 15%) scale(1.1) rotate(45deg); }
          66% { transform: translate(-10%, -5%) scale(0.9) rotate(-15deg); }
          100% { transform: translate(15%, -10%) scale(1.05) rotate(25deg); }
        }

        /* Floating Particles */
        .particle {
          position: absolute;
          background: #ffffff;
          border-radius: 50%;
          box-shadow: 0 0 10px #ffffff, 0 0 20px #e11d48;
          opacity: 0.4;
          z-index: 2;
          animation: floatUp linear infinite;
        }

        @keyframes floatUp {
          0% { transform: translateY(0) scale(1); opacity: 0; }
          20% { opacity: 0.6; }
          80% { opacity: 0.4; }
          100% { transform: translateY(-100vh) scale(0.5); opacity: 0; }
        }

        .dark-glass-card {
          width: 100%;
          max-width: 1100px;
          min-height: 600px;
          background: rgba(15, 23, 42, 0.4);
          backdrop-filter: blur(40px);
          -webkit-backdrop-filter: blur(40px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 32px;
          box-shadow: 0 30px 80px rgba(0, 0, 0, 0.5), inset 0 0 0 1px rgba(255, 255, 255, 0.05);
          display: flex;
          position: relative;
          z-index: 10;
          overflow: hidden;
          animation: cardEntrance 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0;
          transform: translateY(30px);
        }

        @keyframes cardEntrance {
          to { opacity: 1; transform: translateY(0); }
        }

        /* LEFT SIDE - FORM */
        .aurora-form-section {
          flex: 1;
          padding: 60px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          position: relative;
          z-index: 10;
        }

        .aurora-header {
          text-align: center;
          margin-bottom: 40px;
        }
        .aurora-header h1 {
          font-size: 3rem;
          color: #ffffff;
          margin: 0 0 10px 0;
          font-weight: 900;
          letter-spacing: -0.05em;
          text-shadow: 0 2px 10px rgba(0,0,0,0.5);
        }
        .aurora-header p {
          color: #94a3b8;
          font-size: 1.1rem;
          margin: 0;
          font-weight: 500;
        }

        /* Inputs */
        .aurora-input-group {
          position: relative;
          margin-bottom: 24px;
          width: 100%;
          max-width: 400px;
          margin-left: auto;
          margin-right: auto;
        }
        .aurora-icon-box {
          position: absolute;
          left: 20px;
          top: 50%;
          transform: translateY(-50%);
          color: #64748b;
          font-size: 1.25rem;
          z-index: 5;
          transition: all 0.3s ease;
        }
        .aurora-input {
          width: 100%;
          padding: 18px 20px 18px 60px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(15, 23, 42, 0.6);
          border-radius: 16px;
          font-size: 1rem;
          color: #ffffff;
          outline: none;
          box-shadow: inset 0 2px 10px rgba(0,0,0,0.2);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          font-weight: 500;
        }
        .aurora-input:focus {
          background: rgba(15, 23, 42, 0.9);
          border-color: #e11d48;
          box-shadow: 0 0 0 4px rgba(225, 29, 72, 0.15), inset 0 2px 10px rgba(0,0,0,0.3);
        }
        .aurora-input:focus + .aurora-icon-box, 
        .aurora-input-group:focus-within .aurora-icon-box {
          color: #e11d48;
          transform: translateY(-50%) scale(1.1);
          text-shadow: 0 0 10px rgba(225, 29, 72, 0.5);
        }
        .aurora-input::placeholder {
          color: #64748b;
          font-weight: 500;
        }

        .aurora-eye {
          position: absolute;
          right: 20px;
          top: 50%;
          transform: translateY(-50%);
          color: #64748b;
          cursor: pointer;
          font-size: 1.2rem;
          transition: all 0.3s;
        }
        .aurora-eye:hover { 
          color: #e11d48; 
          text-shadow: 0 0 10px rgba(225, 29, 72, 0.5);
        }

        .aurora-options {
          display: flex;
          justify-content: space-between;
          max-width: 400px;
          margin: 0 auto 40px auto;
          font-size: 0.9rem;
          color: #94a3b8;
          font-weight: 500;
        }
        
        .aurora-checkbox-wrapper {
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
        }
        .aurora-checkbox {
          width: 20px;
          height: 20px;
          border-radius: 6px;
          background: rgba(15, 23, 42, 0.8);
          border: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }
        input:checked + .aurora-checkbox {
          background: #e11d48;
          border-color: #e11d48;
          box-shadow: 0 0 10px rgba(225, 29, 72, 0.5);
        }

        .aurora-btn {
          display: block;
          width: 100%;
          max-width: 400px;
          margin: 0 auto;
          padding: 18px;
          border-radius: 16px;
          border: none;
          background: linear-gradient(135deg, #f43f5e, #be123c);
          color: white;
          font-size: 1.1rem;
          font-weight: 800;
          cursor: pointer;
          box-shadow: 0 10px 30px -5px rgba(225, 29, 72, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.3);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }
        .aurora-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 15px 40px -5px rgba(225, 29, 72, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.4);
          background: linear-gradient(135deg, #fb7185, #e11d48);
        }
        .aurora-btn:active {
          transform: translateY(1px);
          box-shadow: 0 5px 15px -5px rgba(225, 29, 72, 0.5);
        }
        .aurora-btn:disabled {
          background: #475569;
          box-shadow: none;
          cursor: not-allowed;
          transform: none;
        }

        /* RIGHT SIDE - NEON PRESENTATION PANE */
        .aurora-visual-section {
          flex: 1;
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
          padding: 40px;
          background: linear-gradient(135deg, rgba(225, 29, 72, 0.1), rgba(124, 58, 237, 0.1));
          border-left: 1px solid rgba(255, 255, 255, 0.05);
          overflow: hidden;
        }

        /* Abstract Rings Effect */
        .neon-ring {
          position: absolute;
          border-radius: 50%;
          border: 1px solid rgba(255, 255, 255, 0.05);
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          pointer-events: none;
        }
        .neon-ring-1 { width: 300px; height: 300px; border-top-color: rgba(225, 29, 72, 0.4); animation: spin 10s linear infinite; }
        .neon-ring-2 { width: 450px; height: 450px; border-right-color: rgba(124, 58, 237, 0.4); animation: spin 15s linear infinite reverse; }
        .neon-ring-3 { width: 600px; height: 600px; border-bottom-color: rgba(37, 99, 235, 0.4); animation: spin 20s linear infinite; }

        @keyframes spin {
          100% { transform: translate(-50%, -50%) rotate(360deg); }
        }

        .aurora-visual-content {
          z-index: 10;
          position: relative;
          background: rgba(15, 23, 42, 0.5);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          padding: 50px 40px;
          border-radius: 32px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 30px 60px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.05);
          max-width: 400px;
        }
        
        .logo-container {
          display: inline-flex;
          justify-content: center;
          align-items: center;
          background: rgba(255, 255, 255, 0.03);
          padding: 24px;
          border-radius: 50%;
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 0 40px rgba(225, 29, 72, 0.3), inset 0 0 20px rgba(255, 255, 255, 0.05);
          margin-bottom: 30px;
          position: relative;
        }
        /* Glowing pulse behind logo */
        .logo-container::before {
          content: '';
          position: absolute;
          inset: -10px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(225, 29, 72, 0.4) 0%, transparent 70%);
          z-index: -1;
          animation: pulseGlow 3s infinite alternate;
        }

        @keyframes pulseGlow {
          0% { opacity: 0.5; transform: scale(0.9); }
          100% { opacity: 1; transform: scale(1.1); }
        }

        .aurora-visual-content h2 {
          font-size: 2.2rem;
          font-weight: 900;
          margin: 0 0 16px 0;
          color: #ffffff;
          letter-spacing: -0.02em;
        }
        .aurora-visual-content p {
          font-size: 1.1rem;
          line-height: 1.7;
          color: #94a3b8;
          margin: 0;
        }

        .error-alert {
          background: rgba(225, 29, 72, 0.1);
          border: 1px solid rgba(225, 29, 72, 0.5);
          color: #fda4af;
          padding: 14px 20px;
          border-radius: 16px;
          margin: 0 auto 24px auto;
          max-width: 400px;
          font-size: 0.95rem;
          display: flex;
          align-items: center;
          gap: 12px;
          font-weight: 600;
          animation: slideDown 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 10px 30px rgba(225, 29, 72, 0.15);
        }

        @media (max-width: 900px) {
          .dark-glass-card { flex-direction: column-reverse; min-height: auto; }
          .aurora-form-section { padding: 40px 20px; }
          .aurora-visual-section { padding: 60px 20px; border-left: none; border-bottom: 1px solid rgba(255, 255, 255, 0.05); }
        }

        @media (max-width: 480px) {
          .aurora-container { padding: 16px; }
          .dark-glass-card { border-radius: 24px; }
          .aurora-header h1 { font-size: 2.4rem; }
          .aurora-visual-content h2 { font-size: 1.8rem; }
          .aurora-visual-content { padding: 40px 20px; }
        }
      `}</style>

      {/* Ambient Background Blobs */}
      <div className="aurora-blob blob-1"></div>
      <div className="aurora-blob blob-2"></div>
      <div className="aurora-blob blob-3"></div>

      {/* Floating Particles */}
      {mounted && particles.map(p => (
        <div 
          key={p.id} 
          className="particle" 
          style={{ 
            left: p.left, 
            top: p.top, 
            width: p.size, 
            height: p.size, 
            animationDuration: p.animationDuration,
            animationDelay: p.animationDelay
          }}
        ></div>
      ))}

      <div className="dark-glass-card">
        
        {/* LEFT SIDE - FORM */}
        <section className="aurora-form-section">
          <div className="aurora-header">
            <h1>SIAKAD</h1>
            <p>Masukkan kredensial Anda untuk melanjutkan</p>
          </div>

          {error && (
            <div className="error-alert">
              <i className="ph ph-warning-circle" style={{ fontSize: '1.4rem', color: '#f43f5e' }}></i> {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="aurora-input-group">
              <i className="ph ph-envelope-simple aurora-icon-box"></i>
              <input
                type="text"
                className="aurora-input"
                placeholder="NIM / NIP / Username"
                value={nim}
                onChange={e => setNim(e.target.value)}
                required
              />
            </div>

            <div className="aurora-input-group">
              <i className="ph ph-lock-key aurora-icon-box"></i>
              <input
                type={showPassword ? "text" : "password"}
                className="aurora-input"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              <i
                className={`aurora-eye ${showPassword ? 'ph ph-eye-slash' : 'ph ph-eye'}`}
                onClick={() => setShowPassword(!showPassword)}
              ></i>
            </div>

            <div className="aurora-options">
              <label className="aurora-checkbox-wrapper">
                <input type="checkbox" style={{ display: 'none' }} />
                <div className="aurora-checkbox">
                  <i className="ph ph-check" style={{ color: 'white', fontSize: '14px', fontWeight: 'bold' }}></i>
                </div>
                Ingat saya
              </label>
              <a href="#" style={{ color: '#e11d48', fontWeight: '600', textDecoration: 'none', transition: 'color 0.2s', textShadow: '0 0 10px rgba(225,29,72,0.3)' }}>
                Lupa password?
              </a>
            </div>

            <button type="submit" disabled={loading} className="aurora-btn">
              {loading ? 'MEMVALIDASI...' : 'MASUK SEKARANG'}
            </button>
          </form>
        </section>

        {/* RIGHT SIDE - NEON PRESENTATION */}
        <section className="aurora-visual-section">
          {/* Decorative Rings */}
          <div className="neon-ring neon-ring-1"></div>
          <div className="neon-ring neon-ring-2"></div>
          <div className="neon-ring neon-ring-3"></div>

          <div className="aurora-visual-content">
            <div className="logo-container">
              <Image src="/icon.png" width={80} height={80} alt="Logo UMIBA" style={{ filter: 'drop-shadow(0px 10px 20px rgba(0,0,0,0.5))' }} />
            </div>
            <h2>SIAKAD UMIBA</h2>
            <p>Sistem Informasi Akademik Digital terdepan Universitas Bina Bangsa.</p>
          </div>
        </section>

      </div>
    </main>
  );
}
