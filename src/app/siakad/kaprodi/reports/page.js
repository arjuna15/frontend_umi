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
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ margin: '0 0 8px 0', color: 'var(--color-text)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          Laporan Akreditasi <i className="ph ph-file-pdf" style={{ color: '#ef4444' }}></i>
        </h2>
        <p style={{ margin: 0, color: 'var(--color-muted)' }}>Ekspor seluruh data akademik prodi untuk keperluan BAN-PT.</p>
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
