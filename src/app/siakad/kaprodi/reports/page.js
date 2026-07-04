"use client";
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function KaprodiReports() {
  const router = useRouter();
  const [downloading, setDownloading] = useState(false);
  const [selectedStandard, setSelectedStandard] = useState('all');
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGrades = async () => {
      const token = localStorage.getItem('siakad_token');
      if (!token) return router.push('/siakad/login');

      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
        const res = await fetch(`${apiUrl}/siakad/kaprodi/students/grades`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const result = await res.json();
          setGrades(Array.isArray(result) ? result : []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchGrades();
  }, [router]);

  const csvContent = useMemo(() => {
    const header = 'Mata Kuliah,Mahasiswa,NIM,SKS,Nilai Huruf,Nilai Akhir';
    if (grades.length === 0) return `${header}\n`;

    const rows = grades.map((item) => {
      const course = item.course?.name || '-';
      const mahasiswa = item.mahasiswa?.name || '-';
      const nim = item.mahasiswa?.nim_nip || '-';
      const sks = item.course?.sks ?? '-';
      const huruf = item.grade || '-';
      const akhir = item.score ?? '-';
      return [course, mahasiswa, nim, sks, huruf, akhir]
        .map((value) => `"${String(value).replace(/"/g, '""')}"`)
        .join(',');
    });

    return [header, ...rows].join('\n');
  }, [grades]);

  const handleDownload = () => {
    setDownloading(true);
    const encodedUri = encodeURI(`data:text/csv;charset=utf-8,${csvContent}`);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Laporan_Akreditasi_BANPT_${selectedStandard}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setDownloading(false);
    window.toast?.(`Laporan ${selectedStandard} berhasil diunduh`);
  };

  return (
    <div className="fade-in" style={{ paddingBottom: '40px' }}>
      <div className="siakad-page-header">
        <div className="siakad-page-header-glow"></div>
        <div className="siakad-page-header-grid"></div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', margin: '0 0 8px 0', letterSpacing: '0.1em', textTransform: 'uppercase' }}>SIAKAD — KAPRODI</p>
          <h1 style={{ color: 'white', fontSize: '2.2rem', fontWeight: '800', margin: '0 0 8px 0', letterSpacing: '-0.03em' }}>Laporan Akreditasi</h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', margin: 0 }}>Ekspor data akademik prodi yang diambil dari backend.</p>
        </div>
      </div>

      <div className="siakad-card stagger-1" style={{ padding: '40px', textAlign: 'center', margin: '0 auto' }}>
        <div style={{ width: '80px', height: '80px', background: 'var(--glass-bg)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto', flexShrink: 0 }}>
          <i className="ph ph-file-xls" style={{ fontSize: '3rem', color: '#ef4444' }}></i>
        </div>

        <h3 style={{ margin: '0 0 10px 0', color: 'var(--color-text)' }}>Generate Laporan Komprehensif</h3>
        <p style={{ color: 'var(--color-muted)', marginBottom: '30px' }}>
          Data laporan disusun dari nilai dan relasi mahasiswa yang tersedia di backend.
        </p>

        {loading ? (
          <p style={{ color: 'var(--color-muted)' }}>Memuat data laporan...</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px', textAlign: 'left' }}>
            {[
              { id: 'all', title: 'Semua Data', desc: 'Ekspor seluruh data akademik' },
              { id: 'std2', title: 'Standar 2: Tata Pamong', desc: 'Ringkasan tata pamong' },
              { id: 'std3', title: 'Standar 3: Mahasiswa', desc: 'Profil mahasiswa dan lulusan' },
              { id: 'std4', title: 'Standar 4: SDM', desc: 'Profil dosen dan tenaga kependidikan' },
              { id: 'std5', title: 'Standar 5: Kurikulum', desc: 'Kurikulum dan pembelajaran' }
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
        )}

        <button
          onClick={handleDownload}
          disabled={downloading || loading}
          style={{
            background: (downloading || loading) ? '#9ca3af' : '#ef4444',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '8px',
            fontSize: '1.1rem',
            fontWeight: 600,
            cursor: (downloading || loading) ? 'not-allowed' : 'pointer',
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
