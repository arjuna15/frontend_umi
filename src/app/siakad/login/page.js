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
  
  // Floating label states
  const [focusedNIM, setFocusedNIM] = useState(false);
  const [focusedPass, setFocusedPass] = useState(false);

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
        throw new Error(data.message || 'Kredensial tidak valid. Silakan periksa kembali.');
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
    <main className="premium-container">
      <style jsx global>{`
        body { margin: 0; padding: 0; overflow: hidden; background: #0f172a; font-family: 'Inter', sans-serif; }
        
        /* Animations */
        @keyframes floatSlow {
          0%, 100% { transform: translateY(0) rotate(0deg) scale(1); }
          50% { transform: translateY(-40px) rotate(5deg) scale(1.05); }
        }
        @keyframes blobBounce {
          0% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0, 0) scale(1); }
        }
        @keyframes gradientMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes revealRight {
          from { opacity: 0; transform: translateX(40px); }
          to { opacity: 1; transform: translateX(0); }
        }

        .premium-container {
          display: flex;
          height: 100vh;
          width: 100vw;
        }

        /* LEFT SIDE - BRANDING */
        .brand-section {
          flex: 1.2;
          background: linear-gradient(-45deg, #7f1d1d, #b91c1c, #991b1b, #450a0a);
          background-size: 400% 400%;
          animation: gradientMove 15s ease infinite;
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 80px;
          color: white;
        }

        .brand-blob-1 {
          position: absolute; top: -10%; left: -10%; width: 50vw; height: 50vw;
          background: radial-gradient(circle, rgba(239,68,68,0.4) 0%, rgba(0,0,0,0) 60%);
          animation: blobBounce 20s infinite alternate ease-in-out;
        }
        .brand-blob-2 {
          position: absolute; bottom: -20%; right: -10%; width: 60vw; height: 60vw;
          background: radial-gradient(circle, rgba(245,158,11,0.2) 0%, rgba(0,0,0,0) 60%);
          animation: blobBounce 25s infinite alternate ease-in-out reverse;
        }

        .brand-content {
          position: relative;
          z-index: 10;
          animation: slideInUp 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        
        .logo-glass {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 28px;
          padding: 20px;
          display: inline-flex;
          margin-bottom: 40px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.2);
          animation: floatSlow 8s infinite;
        }

        .hero-title {
          font-size: 4.5rem;
          font-weight: 900;
          line-height: 1.1;
          letter-spacing: -2px;
          margin: 0 0 20px 0;
          background: linear-gradient(135deg, #ffffff 0%, #fca5a5 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        
        .hero-subtitle {
          font-size: 1.3rem;
          line-height: 1.6;
          color: rgba(255, 255, 255, 0.8);
          max-width: 500px;
          font-weight: 300;
        }

        /* RIGHT SIDE - FORM */
        .form-section {
          flex: 1;
          background: #ffffff;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px;
          box-shadow: -20px 0 50px rgba(0,0,0,0.3);
          z-index: 20;
        }

        .form-wrapper {
          width: 100%;
          max-width: 420px;
          animation: revealRight 1s cubic-bezier(0.16, 1, 0.3, 1) forwards 0.2s;
          opacity: 0;
        }

        .form-header {
          margin-bottom: 40px;
        }
        .form-header h2 {
          font-size: 2.2rem;
          color: #0f172a;
          margin: 0 0 8px 0;
          font-weight: 800;
          letter-spacing: -1px;
        }
        .form-header p {
          color: #64748b;
          margin: 0;
          font-size: 1.05rem;
        }

        /* Floating Inputs */
        .input-group {
          position: relative;
          margin-bottom: 28px;
        }
        .input-control {
          width: 100%;
          padding: 16px 20px;
          border-radius: 16px;
          border: 2px solid #e2e8f0;
          background: #f8fafc;
          font-size: 1.05rem;
          color: #1e293b;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          outline: none;
        }
        .input-control:focus, .input-control:not(:placeholder-shown) {
          background: #ffffff;
          border-color: #ef4444;
          box-shadow: 0 10px 25px -5px rgba(239, 68, 68, 0.15);
        }
        
        .floating-label {
          position: absolute;
          left: 20px;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
          font-size: 1.05rem;
          pointer-events: none;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          background: transparent;
          padding: 0 4px;
        }
        .input-control:focus ~ .floating-label,
        .input-control:not(:placeholder-shown) ~ .floating-label {
          top: 0;
          transform: translateY(-50%) scale(0.85);
          color: #ef4444;
          background: #ffffff;
          font-weight: 600;
        }

        .input-icon-right {
          position: absolute;
          right: 20px;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
          font-size: 1.2rem;
          cursor: pointer;
          transition: color 0.3s;
        }
        .input-icon-right:hover {
          color: #ef4444;
        }

        /* Premium Button */
        .btn-submit {
          width: 100%;
          padding: 18px;
          border-radius: 16px;
          background: linear-gradient(135deg, #ef4444 0%, #991b1b 100%);
          color: white;
          font-size: 1.15rem;
          font-weight: 700;
          border: none;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 10px 30px -5px rgba(239, 68, 68, 0.4);
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 12px;
        }
        .btn-submit::before {
          content: '';
          position: absolute;
          top: 0; left: -100%; width: 100%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          transition: left 0.5s ease;
        }
        .btn-submit:hover {
          transform: translateY(-3px);
          box-shadow: 0 20px 40px -10px rgba(239, 68, 68, 0.6);
        }
        .btn-submit:hover::before {
          left: 100%;
        }
        .btn-submit:active {
          transform: translateY(1px);
        }

        /* Error Alert */
        .error-alert {
          background: #fef2f2;
          border-left: 4px solid #ef4444;
          color: #b91c1c;
          padding: 16px;
          border-radius: 12px;
          margin-bottom: 24px;
          display: flex;
          align-items: flex-start;
          gap: 12px;
          font-size: 0.95rem;
          animation: slideInUp 0.3s ease forwards;
        }

        /* Options row */
        .options-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 32px;
          font-size: 0.95rem;
        }
        .checkbox-container {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          color: #64748b;
        }
        .checkbox-custom {
          width: 20px;
          height: 20px;
          border: 2px solid #cbd5e1;
          border-radius: 6px;
          display: flex;
          justify-content: center;
          align-items: center;
          transition: all 0.2s;
        }
        input[type="checkbox"]:checked + .checkbox-custom {
          background: #ef4444;
          border-color: #ef4444;
        }
        
        @media (max-width: 900px) {
          .premium-container { flex-direction: column; }
          .brand-section { flex: none; padding: 40px 20px; text-align: center; justify-content: center; align-items: center; min-height: 40vh; }
          .hero-title { font-size: 3rem; }
          .form-section { border-radius: 40px 40px 0 0; margin-top: -40px; }
        }
      `}</style>

      {/* LEFT SECTION */}
      <section className="brand-section">
        <div className="brand-blob-1"></div>
        <div className="brand-blob-2"></div>
        
        <div className="brand-content">
          <div className="logo-glass">
            <Image src="/icon.png" width={60} height={60} alt="Logo UMIBA" />
          </div>
          <h1 className="hero-title">Sistem Akademik<br/>Masa Depan.</h1>
          <p className="hero-subtitle">
            Selamat datang di portal akademik digital Universitas Bina Bangsa. Dirancang dengan teknologi terkini untuk pengalaman belajar yang luar biasa.
          </p>
        </div>
      </section>

      {/* RIGHT SECTION */}
      <section className="form-section">
        <div className="form-wrapper">
          <div className="form-header">
            <h2>Masuk ke Akun Anda</h2>
            <p>Silakan masukkan kredensial untuk melanjutkan.</p>
          </div>

          {error && (
            <div className="error-alert">
              <i className="ph-warning-circle" style={{ fontSize: '1.2rem', marginTop: '2px' }}></i>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="input-group">
              <input
                type="text"
                id="nim"
                className="input-control"
                placeholder=" "
                value={nim}
                onChange={e => setNim(e.target.value)}
                onFocus={() => setFocusedNIM(true)}
                onBlur={() => setFocusedNIM(false)}
                required
              />
              <label htmlFor="nim" className="floating-label">NIM / NIP / Username</label>
            </div>

            <div className="input-group">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                className="input-control"
                placeholder=" "
                value={password}
                onChange={e => setPassword(e.target.value)}
                onFocus={() => setFocusedPass(true)}
                onBlur={() => setFocusedPass(false)}
                required
              />
              <label htmlFor="password" className="floating-label">Password</label>
              <i 
                className={`input-icon-right ${showPassword ? 'ph-eye-slash' : 'ph-eye'}`}
                onClick={() => setShowPassword(!showPassword)}
              ></i>
            </div>

            <div className="options-row">
              <label className="checkbox-container">
                <input type="checkbox" style={{ display: 'none' }} />
                <div className="checkbox-custom">
                  <i className="ph-check" style={{ color: 'white', fontSize: '12px', opacity: 0 }} />
                </div>
                <span>Ingat Saya</span>
              </label>
              <a href="#" style={{ color: '#ef4444', textDecoration: 'none', fontWeight: 600 }}>Lupa Password?</a>
            </div>

            <button type="submit" disabled={loading} className="btn-submit">
              {loading ? (
                <><i className="ph-spinner ph-spin"></i> Autentikasi...</>
              ) : (
                <>Lanjutkan <i className="ph-arrow-right"></i></>
              )}
            </button>
          </form>
          
          <div style={{ textAlign: 'center', marginTop: '40px', color: '#94a3b8', fontSize: '0.85rem' }}>
            &copy; {new Date().getFullYear()} Universitas Bina Bangsa.<br/>All rights reserved.
          </div>
        </div>
      </section>
    </main>
  );
}
