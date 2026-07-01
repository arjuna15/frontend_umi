'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function KaprodiReports() {
  const [downloading, setDownloading] = useState(false);
  const [selectedStandard, setSelectedStandard] = useState('all');

  const handleDownload = () => {
    setDownloading(true);
    setTimeout(() => {
      // Simulate download CSV
      const csvContent = "data:text/csv;charset=utf-8,Mata Kuliah,Dosen,Total Mahasiswa,Rata-rata Nilai\nKalkulus Dasar,Budi Santoso,40,3.2\nAlgoritma,Siti Aminah,35,3.5";
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `Laporan_Akreditasi_BANPT_${selectedStandard}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setDownloading(false);
      window.toast?.(`Laporan ${selectedStandard} berhasil diunduh`);
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


      <div className="siakad-card stagger-1" style={{ padding: '40px', textAlign: 'center', width: '90%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto', margin: '0 auto' }}>
        <div style={{ width: '80px', height: '80px', background: 'var(--glass-bg)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto' , flexShrink: 0 }}>
          <i className="ph ph-file-xls" style={{ fontSize: '3rem', color: '#ef4444' }}></i>
        </div>
        
        <h3 style={{ margin: '0 0 10px 0', color: 'var(--color-text)' }}>Generate Laporan Komprehensif</h3>
        <p style={{ color: 'var(--color-muted)', marginBottom: '30px' }}>
          Laporan ini mencakup seluruh data yang dibutuhkan untuk instrumen akreditasi BAN-PT. Pilih standar yang ingin Anda unduh.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px', textAlign: 'left' }}>
          {[
            { id: 'all', title: 'Semua Standar (Lengkap)', desc: 'Ekspor seluruh data akademik' },
            { id: 'std2', title: 'Standar 2: Tata Pamong', desc: 'Sistem tata pamong, kepemimpinan' },
            { id: 'std3', title: 'Standar 3: Mahasiswa', desc: 'Profil mahasiswa dan lulusan' },
            { id: 'std4', title: 'Standar 4: SDM', desc: 'Profil dosen dan tenaga kependidikan' },
            { id: 'std5', title: 'Standar 5: Kurikulum', desc: 'Kurikulum, pembelajaran, dan suasana' }
          ].map(std => (
            <div 
              key={std.id}
              onClick={() => setSelectedStandard(std.id)}
              style={{
                padding: '16px', borderRadius: '12px', border: `2px solid ${selectedStandard === std.id ? '#3b82f6' : 'var(--color-border)'}`,
                background: selectedStandard === std.id ? 'rgba(59, 130, 246, 0.05)' : 'var(--color-bg)',
                cursor: 'pointer', transition: 'all 0.2s'
              }}
            >
              <h4 style={{ margin: '0 0 4px 0', color: selectedStandard === std.id ? '#3b82f6' : 'var(--color-text)' }}>{std.title}</h4>
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-muted)' }}>{std.desc}</p>
            </div>
          ))}
        </div>

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
