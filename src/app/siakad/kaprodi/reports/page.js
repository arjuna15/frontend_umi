'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function KaprodiReports() {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = () => {
    setDownloading(true);
    setTimeout(() => {
      // Simulate download CSV
      const csvContent = "data:text/csv;charset=utf-8,Mata Kuliah,Dosen,Total Mahasiswa,Rata-rata Nilai\nKalkulus Dasar,Budi Santoso,40,3.2\nAlgoritma,Siti Aminah,35,3.5";
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "Laporan_Akreditasi_BANPT.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setDownloading(false);
    }, 1500);
  };

  return (
    <div className="fade-in" style={{ paddingBottom: '40px' }}>
      
      <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #4c0519 100%)', borderRadius: '24px', padding: '40px', marginBottom: '32px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(196,30,58,0.15)', filter: 'blur(40px)' }}></div>
        <div style={{ position: 'absolute', bottom: '-20px', left: '30%', width: '150px', height: '150px', borderRadius: '50%', background: 'rgba(99,102,241,0.1)', filter: 'blur(30px)' }}></div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', margin: '0 0 8px 0', letterSpacing: '0.1em', textTransform: 'uppercase' }}>SIAKAD — KAPRODI</p>
          <h1 style={{ color: 'white', fontSize: '2.2rem', fontWeight: '800', margin: '0 0 8px 0', letterSpacing: '-0.03em' }}>Laporan Akreditasi</h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', margin: 0 }}>Ekspor seluruh data akademik prodi untuk keperluan BAN-PT.</p>
        </div>
      </div>


      <div className="siakad-card stagger-1" style={{ padding: '40px', textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ width: '80px', height: '80px', background: 'var(--glass-bg)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto' }}>
          <i className="ph ph-file-xls" style={{ fontSize: '3rem', color: '#ef4444' }}></i>
        </div>
        
        <h3 style={{ margin: '0 0 10px 0', color: 'var(--color-text)' }}>Generate Laporan Komprehensif</h3>
        <p style={{ color: 'var(--color-muted)', marginBottom: '30px' }}>
          Laporan ini mencakup seluruh data nilai, aktivitas dosen, kehadiran mahasiswa, dan EDOM untuk semester berjalan. Laporan dikemas dalam format CSV/Excel.
        </p>

        <button 
          onClick={handleDownload}
          disabled={downloading}
          style={{
            background: downloading ? '#9ca3af' : '#ef4444',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '8px',
            fontSize: '1.1rem',
            fontWeight: 600,
            cursor: downloading ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            margin: '0 auto',
            transition: 'all 0.3s'
          }}
        >
          {downloading ? (
            <><i className="ph ph-spinner ph-spin"></i> Memproses Data...</>
          ) : (
            <><i className="ph ph-download-simple"></i> Download Laporan CSV</>
          )}
        </button>
      </div>
    </div>
  );
}
