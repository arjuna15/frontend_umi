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
  const [showPortalModal, setShowPortalModal] = useState(false);
  const [pendingUser, setPendingUser] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`/api/siakad/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nim_nip: nim, password })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Kredensial tidak valid.');
      }

      localStorage.setItem('siakad_token', 'cookie_authenticated');
      localStorage.setItem('siakad_role', data.user.role);
      localStorage.setItem('siakad_user', JSON.stringify(data.user));

      const goToPortal = (portal) => {
        localStorage.setItem('siakad_portal', portal);
        setShowPortalModal(false);
        setPendingUser(null);
        if (portal === 'mahasiswa') router.push('/siakad/mahasiswa');
        else if (portal === 'dosen') router.push('/siakad/dosen');
        else if (portal === 'kaprodi') router.push('/siakad/kaprodi');
        else router.push('/siakad/admin');
      };

      if (data.user.role === 'kaprodi') {
        setPendingUser(data.user);
        setShowPortalModal(true);
        return;
      }

      goToPortal(data.user.role);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const choosePortal = (portal) => {
    localStorage.setItem('siakad_portal', portal);
    setShowPortalModal(false);
    setPendingUser(null);
    if (portal === 'dosen') router.push('/siakad/dosen');
    else router.push('/siakad/kaprodi');
  };

  // Generate random particles for background
  const particles = Array.from({ length: 30 }).map((_, i) => ({
    id: i,
    left: `${(i * 17) % 100}%`,
    top: `${(i * 29) % 100}%`,
    animationDuration: `${10 + (i % 12)}s`,
    animationDelay: `${(i % 5) * 0.6}s`,
    size: `${2 + (i % 4)}px`
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
          background: #f5f5f7; /* Apple style liquid background */
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Outfit', sans-serif;
          position: relative;
          overflow: hidden;
          padding: 20px;
          transition: background 0.5s ease;
        }

        /* Ambient Animated Blobs (Apple Fluid Effect) */
        .aurora-blob {
          position: absolute;
          filter: blur(120px);
          opacity: 0.65;
          border-radius: 50%;
          mix-blend-mode: multiply;
          animation: floatBlob 25s infinite alternate cubic-bezier(0.33, 1, 0.68, 1);
          pointer-events: none;
          z-index: 1;
        }
        .blob-1 {
          top: -20%; left: -5%; width: 65vw; height: 65vw;
          background: radial-gradient(circle, rgba(255, 59, 48, 0.4) 0%, rgba(255, 255, 255, 0) 70%);
          animation-delay: 0s;
        }
        .blob-2 {
          bottom: -25%; right: -5%; width: 75vw; height: 75vw;
          background: radial-gradient(circle, rgba(0, 113, 227, 0.35) 0%, rgba(255, 255, 255, 0) 70%);
          animation-delay: -6s;
        }
        .blob-3 {
          top: 35%; left: 30%; width: 45vw; height: 45vw;
          background: radial-gradient(circle, rgba(175, 82, 222, 0.25) 0%, rgba(255, 255, 255, 0) 70%);
          animation-delay: -12s;
        }

        @keyframes floatBlob {
          0% { transform: translate(0, 0) scale(1) rotate(0deg); }
          50% { transform: translate(6%, 10%) scale(1.1) rotate(120deg); }
          100% { transform: translate(-6%, -5%) scale(0.95) rotate(240deg); }
        }

        /* Floating Particles */
        .particle {
          position: absolute;
          background: #ffffff;
          border-radius: 50%;
          box-shadow: 0 0 10px rgba(255, 255, 255, 0.8);
          opacity: 0.15;
          z-index: 2;
          animation: floatUp linear infinite;
        }

        @keyframes floatUp {
          0% { transform: translateY(0) scale(1); opacity: 0; }
          20% { opacity: 0.4; }
          80% { opacity: 0.3; }
          100% { transform: translateY(-100vh) scale(0.5); opacity: 0; }
        }

        /* Apple Liquid Glass Card */
        .dark-glass-card {
          width: 100%;
          max-width: 1000px;
          min-height: 580px;
          background: rgba(255, 255, 255, 0.45);
          backdrop-filter: blur(40px) saturate(210%);
          -webkit-backdrop-filter: blur(40px) saturate(210%);
          border: 1px solid rgba(255, 255, 255, 0.6);
          border-radius: 28px;
          box-shadow: 0 12px 40px 0 rgba(31, 38, 135, 0.04), 
                      inset 0 1px 0 0 rgba(255, 255, 255, 0.6), 
                      inset 0 -1px 0 0 rgba(0, 0, 0, 0.02);
          display: flex;
          position: relative;
          z-index: 10;
          overflow: hidden;
          animation: cardEntrance 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0;
          transform: translateY(30px);
        }

        @keyframes cardEntrance {
          to { opacity: 1; transform: translateY(0); }
        }

        /* LEFT SIDE - FORM */
        .aurora-form-section {
          flex: 1.1;
          padding: 50px 60px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          position: relative;
          z-index: 10;
        }

        .aurora-header {
          text-align: center;
          margin-bottom: 36px;
        }
        .aurora-header h1 {
          font-size: 2.8rem;
          color: #1d1d1f;
          margin: 0 0 8px 0;
          font-weight: 800;
          letter-spacing: -0.04em;
        }
        .aurora-header p {
          color: #86868b;
          font-size: 1rem;
          margin: 0;
          font-weight: 500;
        }

        /* Inputs - Liquid Glass Style */
        .aurora-input-group {
          position: relative;
          margin-bottom: 20px;
          width: 100%;
          max-width: 380px;
          margin-left: auto;
          margin-right: auto;
        }
        .aurora-icon-box {
          position: absolute;
          left: 18px;
          top: 50%;
          transform: translateY(-50%);
          color: #86868b;
          font-size: 1.2rem;
          z-index: 5;
          transition: all 0.3s cubic-bezier(0.25, 1, 0.5, 1);
        }
        .aurora-input {
          width: 100%;
          padding: 16px 20px 16px 52px;
          border: 1px solid rgba(0, 0, 0, 0.08);
          background: rgba(255, 255, 255, 0.45);
          border-radius: 14px;
          font-size: 0.95rem;
          color: #1d1d1f;
          outline: none;
          box-shadow: inset 0 1px 2px rgba(0,0,0,0.01);
          transition: all 0.3s cubic-bezier(0.25, 1, 0.5, 1);
          font-weight: 500;
        }
        .aurora-input:focus {
          background: rgba(255, 255, 255, 0.8);
          border-color: #0071e3;
          box-shadow: 0 0 0 4px rgba(0, 113, 227, 0.15), inset 0 1px 2px rgba(0,0,0,0.02);
        }
        .aurora-input:focus + .aurora-icon-box, 
        .aurora-input-group:focus-within .aurora-icon-box {
          color: #0071e3;
          transform: translateY(-50%) scale(1.08);
        }
        .aurora-input::placeholder {
          color: #86868b;
          font-weight: 500;
        }

        .aurora-eye {
          position: absolute;
          right: 18px;
          top: 50%;
          transform: translateY(-50%);
          color: #86868b;
          cursor: pointer;
          font-size: 1.15rem;
          transition: all 0.3s;
        }
        .aurora-eye:hover { 
          color: #0071e3; 
        }

        .aurora-options {
          display: flex;
          justify-content: space-between;
          max-width: 380px;
          margin: 0 auto 32px auto;
          font-size: 0.88rem;
          color: #86868b;
          font-weight: 500;
        }
        
        .aurora-checkbox-wrapper {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
        }
        .aurora-checkbox {
          width: 18px;
          height: 18px;
          border-radius: 5px;
          background: rgba(255, 255, 255, 0.6);
          border: 1px solid rgba(0, 0, 0, 0.12);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }
        input:checked + .aurora-checkbox {
          background: #0071e3;
          border-color: #0071e3;
          box-shadow: 0 0 8px rgba(0, 113, 227, 0.3);
        }

        .aurora-btn {
          display: block;
          width: 100%;
          max-width: 380px;
          margin: 0 auto;
          padding: 16px;
          border-radius: 14px;
          border: none;
          background: linear-gradient(135deg, #0071e3, #1d1d1f);
          color: white;
          font-size: 1rem;
          font-weight: 700;
          cursor: pointer;
          box-shadow: 0 8px 24px rgba(0, 113, 227, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.3);
          transition: all 0.3s cubic-bezier(0.25, 1, 0.5, 1);
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }
        .aurora-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 32px rgba(0, 113, 227, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.4);
        }
        .aurora-btn:active {
          transform: translateY(1px);
          box-shadow: 0 4px 12px rgba(0, 113, 227, 0.2);
        }
        .aurora-btn:disabled {
          background: #86868b;
          box-shadow: none;
          cursor: not-allowed;
          transform: none;
        }

        /* RIGHT SIDE - NEON PRESENTATION PANE */
        .aurora-visual-section {
          flex: 0.9;
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
          padding: 40px;
          background: rgba(255, 255, 255, 0.2);
          border-left: 1px solid rgba(255, 255, 255, 0.4);
          overflow: hidden;
        }

        /* Abstract Rings Effect */
        .neon-ring {
          position: absolute;
          border-radius: 50%;
          border: 1px solid rgba(255, 255, 255, 0.15);
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          pointer-events: none;
        }
        .neon-ring-1 { width: 280px; height: 280px; border-top-color: rgba(255, 59, 48, 0.25); animation: spin 12s linear infinite; }
        .neon-ring-2 { width: 400px; height: 400px; border-right-color: rgba(0, 113, 227, 0.25); animation: spin 18s linear infinite reverse; }
        .neon-ring-3 { width: 520px; height: 520px; border-bottom-color: rgba(175, 82, 222, 0.2); animation: spin 24s linear infinite; }

        @keyframes spin {
          100% { transform: translate(-50%, -50%) rotate(360deg); }
        }

        .aurora-visual-content {
          z-index: 10;
          position: relative;
          background: rgba(255, 255, 255, 0.4);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          padding: 40px 32px;
          border-radius: 24px;
          border: 1px solid rgba(255, 255, 255, 0.5);
          box-shadow: 0 10px 30px rgba(0,0,0,0.02);
          max-width: 380px;
        }
        
        .logo-container {
          display: inline-flex;
          justify-content: center;
          align-items: center;
          margin-bottom: 24px;
          position: relative;
        }

        .aurora-visual-content h2 {
          font-size: 1.8rem;
          font-weight: 800;
          margin: 0 0 12px 0;
          color: #1d1d1f;
          letter-spacing: -0.02em;
        }
        .aurora-visual-content p {
          font-size: 0.98rem;
          line-height: 1.6;
          color: #86868b;
          margin: 0;
        }

        .error-alert {
          background: rgba(255, 59, 48, 0.1);
          border: 1px solid rgba(255, 59, 48, 0.3);
          color: #ff3b30;
          padding: 12px 18px;
          border-radius: 12px;
          margin: 0 auto 20px auto;
          max-width: 380px;
          font-size: 0.9rem;
          display: flex;
          align-items: center;
          gap: 10px;
          font-weight: 600;
          animation: slideDown 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @media (max-width: 900px) {
          .dark-glass-card { flex-direction: column-reverse; min-height: auto; margin-top: 24px; }
          .aurora-form-section { padding: 36px 20px; }
          .aurora-visual-section { padding: 48px 20px; border-left: none; border-bottom: 1px solid rgba(0, 0, 0, 0.05); }
        }

        @media (max-width: 480px) {
          .aurora-container { padding: 12px; }
          .dark-glass-card { border-radius: 20px; }
          .aurora-header h1 { font-size: 2.2rem; }
          .aurora-visual-content h2 { font-size: 1.6rem; }
          .aurora-visual-content { padding: 32px 16px; }
        }

        .siakad-login-modal-overlay {
          position: fixed;
          inset: 0;
          z-index: 60;
          background: rgba(2, 6, 23, 0.35);
          backdrop-filter: blur(20px) saturate(180%);
          -webkit-backdrop-filter: blur(20px) saturate(180%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
        }
        .siakad-login-modal {
          width: min(100%, 450px);
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(30px) saturate(190%);
          -webkit-backdrop-filter: blur(30px) saturate(190%);
          border: 1px solid rgba(255, 255, 255, 0.6);
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.05);
          border-radius: 24px;
          padding: 28px;
          color: #1d1d1f;
          text-align: center;
        }
        .siakad-login-modal-icon {
          width: 60px;
          height: 60px;
          border-radius: 16px;
          margin: 0 auto 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0, 113, 227, 0.1);
          border: 1px solid rgba(0, 113, 227, 0.2);
        }
        .siakad-login-modal h3 {
          margin: 0 0 8px 0;
          font-size: 1.35rem;
          font-weight: 800;
          letter-spacing: -0.02em;
        }
        .siakad-login-modal p {
          margin: 0 0 24px 0;
          color: #86868b;
          line-height: 1.5;
          font-size: 0.95rem;
        }
        .siakad-login-modal-actions {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
        }
        .siakad-login-modal-btn {
          border: none;
          border-radius: 12px;
          padding: 12px 16px;
          font-weight: 700;
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease;
        }
        .siakad-login-modal-btn:hover {
          transform: translateY(-1px);
        }
        .siakad-login-modal-btn.secondary {
          background: rgba(0, 0, 0, 0.05);
          color: #1d1d1f;
          border: 1px solid rgba(0, 0, 0, 0.08);
        }
        .siakad-login-modal-btn.primary {
          background: linear-gradient(135deg, #0071e3 0%, #30a3ff 100%);
          color: white;
          box-shadow: 0 10px 20px rgba(0, 113, 227, 0.2);
        }
        @media (max-width: 480px) {
          .siakad-login-modal {
            padding: 22px 18px;
          }
          .siakad-login-modal-actions {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      {/* Ambient Background Blobs */}
      <div className="aurora-blob blob-1"></div>
      <div className="aurora-blob blob-2"></div>
      <div className="aurora-blob blob-3"></div>

      {/* Floating Particles */}
      {particles.map(p => (
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
              <i className="ph ph-warning-circle" style={{ fontSize: '1.4rem', color: '#c41e3a' }}></i> {error}
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
              <a href="#" style={{ color: '#c41e3a', fontWeight: '600', textDecoration: 'none', transition: 'color 0.2s', textShadow: '0 0 10px rgba(225,29,72,0.3)' }}>
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
            <p>Sistem Informasi Akademik Digital terdepan Universitas Mitra Bangsa.</p>
          </div>
        </section>

      </div>

      {showPortalModal && (
        <div className="siakad-login-modal-overlay" onClick={() => choosePortal('kaprodi')}>
          <div className="siakad-login-modal" onClick={(e) => e.stopPropagation()}>
            <div className="siakad-login-modal-icon">
              <i className="ph ph-shuffle" style={{ fontSize: '2rem', color: '#7c3aed' }}></i>
            </div>
            <h3>Pilih Portal</h3>
            <p>
              Akun {pendingUser?.name || 'Anda'} terdeteksi sebagai kaprodi yang juga punya akses dosen.
              Pilih portal yang ingin dibuka sekarang.
            </p>
            <div className="siakad-login-modal-actions">
              <button type="button" className="siakad-login-modal-btn secondary" onClick={() => choosePortal('kaprodi')}>
                Masuk sebagai Kaprodi
              </button>
              <button type="button" className="siakad-login-modal-btn primary" onClick={() => choosePortal('dosen')}>
                Masuk sebagai Dosen
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
