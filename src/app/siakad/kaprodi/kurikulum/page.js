"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CustomSelect from '../../components/CustomSelect';
import ModalShell from '../../components/ModalShell';

export default function KaprodiKurikulumPage() {
  const router = useRouter();
  const [courses, setCourses] = useState([]);
  const [dosens, setDosens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [userProdi, setUserProdi] = useState('');
  const [editFormData, setEditFormData] = useState({ id: '', code: '', name: '', sks: '', semester: '1', type: 'Wajib', dosen_id: '' });
  const [activeTab, setActiveTab] = useState('kurikulum');

  // OBE sample data — CPL (Capaian Pembelajaran Lulusan)
  const cplData = [
    { code: 'CPL-1', description: 'Mampu menerapkan pemikiran logis, kritis, sistematis, dan inovatif dalam pengembangan ilmu pengetahuan dan teknologi' },
    { code: 'CPL-2', description: 'Mampu menunjukkan kinerja mandiri, bermutu, dan terukur sesuai standar kompetensi kerja' },
    { code: 'CPL-3', description: 'Mampu mengkaji implikasi pengembangan atau implementasi IPTEK sesuai keahliannya berdasarkan kaidah, tata cara, dan etika ilmiah' },
    { code: 'CPL-4', description: 'Mampu mengambil keputusan secara tepat berdasarkan analisis informasi dan data' },
    { code: 'CPL-5', description: 'Mampu merancang dan mengimplementasikan solusi berbasis teknologi informasi untuk menyelesaikan permasalahan' },
    { code: 'CPL-6', description: 'Mampu berkomunikasi efektif secara lisan dan tulisan dalam bahasa Indonesia dan Inggris' },
  ];

  // CPMK (Capaian Pembelajaran Mata Kuliah) mapped to CPLs
  const cpmkData = [
    { code: 'CPMK-1', description: 'Memahami konsep dasar pemrograman', cpl: ['CPL-1', 'CPL-5'] },
    { code: 'CPMK-2', description: 'Merancang algoritma penyelesaian masalah', cpl: ['CPL-1', 'CPL-4'] },
    { code: 'CPMK-3', description: 'Mengimplementasikan sistem basis data', cpl: ['CPL-3', 'CPL-5'] },
    { code: 'CPMK-4', description: 'Menyusun dokumentasi teknis proyek', cpl: ['CPL-2', 'CPL-6'] },
    { code: 'CPMK-5', description: 'Menganalisis kebutuhan pengguna sistem', cpl: ['CPL-4', 'CPL-5'] },
    { code: 'CPMK-6', description: 'Menerapkan metodologi pengembangan perangkat lunak', cpl: ['CPL-1', 'CPL-2', 'CPL-3'] },
  ];

  // Matrix mapping: courses x CPLs with strength values
  const matrixCourses = [
    { name: 'Pemrograman Dasar', code: 'IF101', mapping: { 'CPL-1': 'Tinggi', 'CPL-5': 'Tinggi', 'CPL-4': 'Sedang' } },
    { name: 'Struktur Data', code: 'IF102', mapping: { 'CPL-1': 'Tinggi', 'CPL-4': 'Tinggi', 'CPL-5': 'Sedang' } },
    { name: 'Basis Data', code: 'IF201', mapping: { 'CPL-3': 'Tinggi', 'CPL-5': 'Tinggi', 'CPL-1': 'Rendah' } },
    { name: 'Rekayasa Perangkat Lunak', code: 'IF301', mapping: { 'CPL-1': 'Sedang', 'CPL-2': 'Tinggi', 'CPL-3': 'Tinggi', 'CPL-5': 'Sedang' } },
    { name: 'Komunikasi Profesional', code: 'MK201', mapping: { 'CPL-6': 'Tinggi', 'CPL-2': 'Sedang' } },
    { name: 'Analisis Sistem Informasi', code: 'IF302', mapping: { 'CPL-4': 'Tinggi', 'CPL-5': 'Tinggi', 'CPL-3': 'Sedang' } },
    { name: 'Proyek Akhir', code: 'IF401', mapping: { 'CPL-1': 'Tinggi', 'CPL-2': 'Tinggi', 'CPL-3': 'Sedang', 'CPL-4': 'Tinggi', 'CPL-5': 'Tinggi', 'CPL-6': 'Sedang' } },
  ];

  const strengthColors = {
    Tinggi: { bg: 'rgba(16,185,129,0.2)', color: '#10b981', border: 'rgba(16,185,129,0.4)' },
    Sedang: { bg: 'rgba(245,158,11,0.2)', color: '#f59e0b', border: 'rgba(245,158,11,0.4)' },
    Rendah: { bg: 'rgba(249,115,22,0.2)', color: '#f97316', border: 'rgba(249,115,22,0.4)' },
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const token = localStorage.getItem('siakad_token');
    const userStr = localStorage.getItem('siakad_user');
    if (!token) return router.push('/siakad/login');

    let prodi = '';
    if (userStr) {
      const user = JSON.parse(userStr);
      prodi = user.prodi;
      setUserProdi(prodi);
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
    try {
      const res = await fetch(`${apiUrl}/siakad/kaprodi/courses`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setDosens(data.dosens || []);
        
        // Filter courses by Kaprodi's program study
        const allCourses = data.courses || [];
        const filtered = prodi && prodi !== 'Semua' 
          ? allCourses.filter(c => c.prodi === prodi)
          : allCourses;

        // Map backend semester_num back to frontend semester string
        const mapped = filtered.map(c => ({
          id: c.id,
          code: c.code,
          name: c.name,
          sks: c.sks,
          semester: (c.semester_num || 1).toString(),
          type: c.type || 'Wajib',
          dosen_id: c.dosen_id || '',
          dosen: c.dosen
        }));
        setCourses(mapped);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('siakad_token');
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

    const payload = {
      code: editFormData.code,
      name: editFormData.name,
      sks: parseInt(editFormData.sks),
      dosen_id: editFormData.dosen_id || (dosens[0]?.id || ''),
      semester_num: parseInt(editFormData.semester),
      type: editFormData.type,
      prodi: userProdi || '',
      semester: localStorage.getItem('siakad_semester') || ''
    };

    try {
      let res;
      if (editFormData.id) {
        res = await fetch(`${apiUrl}/siakad/admin/courses/${editFormData.id}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });
      } else {
        res = await fetch(`${apiUrl}/siakad/admin/courses`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });
      }

      if (res.ok) {
        window.toast?.(editFormData.id ? 'Mata kuliah berhasil diperbarui' : 'Mata kuliah berhasil ditambahkan ke kurikulum');
        setIsEditModalOpen(false);
        fetchData();
      } else {
        const errorData = await res.json();
        window.toast?.('Gagal menyimpan: ' + (errorData.message || 'Error'));
      }
    } catch (err) {
      window.toast?.('Terjadi kesalahan: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Yakin ingin menghapus mata kuliah dari kurikulum?')) {
      const token = localStorage.getItem('siakad_token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
      try {
        const res = await fetch(`${apiUrl}/siakad/admin/courses/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          window.toast?.('Mata kuliah dihapus');
          fetchData();
        } else {
          window.toast?.('Gagal menghapus');
        }
      } catch (err) {
        window.toast?.('Terjadi kesalahan: ' + err.message);
      }
    }
  };

  const openAddModal = () => {
    setEditFormData({ id: '', code: '', name: '', sks: '', semester: '1', type: 'Wajib', dosen_id: dosens[0]?.id || '' });
    setIsEditModalOpen(true);
  };

  if (loading) return <div style={{ padding: '20px' }}>Loading...</div>;

  return (
    <div className="fade-in" style={{ paddingBottom: '40px' }}>
      <div style={{ marginBottom: '32px' }}>
        <div className="siakad-page-header">
        <div className="siakad-page-header-glow"></div>
        <div className="siakad-page-header-grid"></div>
          <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ flex: '1 1 300px' }}>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', margin: '0 0 8px 0', letterSpacing: '0.1em', textTransform: 'uppercase' }}>SIAKAD — KAPRODI</p>
              <h1 style={{ color: 'white', fontSize: '2.2rem', fontWeight: '800', margin: '0 0 8px 0', letterSpacing: '-0.03em' }}>Manajemen Kurikulum</h1>
              <p style={{ color: 'rgba(255,255,255,0.6)', margin: 0 }}>Kelola struktur mata kuliah dan sebaran SKS per semester ({userProdi || 'Belum tersedia'}).</p>
            </div>
            {activeTab === 'kurikulum' && (
              <button id="btn-add-mk" onClick={openAddModal} style={{ background: 'linear-gradient(135deg, #C41E3A 0%, #9b1c2e 100%)', color: 'white', padding: '10px 24px', borderRadius: '50px', border: 'none', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 15px rgba(196, 30, 58, 0.3)' , flexWrap: 'wrap'}}>
                <i className="ph ph-plus-circle" style={{ fontSize: '1.2rem' }}></i> Tambah MK
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tab buttons */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap', alignItems: 'center' }}>
        {[{ key: 'kurikulum', label: 'Struktur Kurikulum', icon: 'ph-list-bullets' }, { key: 'obe', label: 'OBE & CPL Mapping', icon: 'ph-graph' }].map(t => (
          <button id={`kurikulum-tab-${t.key}`} key={t.key} onClick={() => setActiveTab(t.key)}
            className={activeTab === t.key ? 'active' : ''}
            style={{
              padding: '10px 20px', borderRadius: '50px',
              border: activeTab === t.key ? '2px solid #C41E3A' : 'var(--glass-border)',
              background: activeTab === t.key ? 'rgba(196,30,58,0.15)' : 'var(--glass-bg)',
              color: activeTab === t.key ? '#C41E3A' : 'var(--color-muted)',
              boxShadow: activeTab === t.key ? 'inset 2px 2px 5px var(--inset-shadow-dark), inset -2px -2px 5px var(--inset-shadow-light)' : 'var(--glass-shadow)',
              fontWeight: '700', fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '6px'
            }}>
            <i className={`ph ${t.icon}`} style={{ fontSize: '1rem' }}></i> {t.label}
          </button>
        ))}
      </div>

      {/* Kurikulum Tab */}
      {activeTab === 'kurikulum' && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '24px', alignItems: 'start' }}>
            <div className="siakad-card" style={{ padding: '24px', borderRadius: '24px', background: 'var(--glass-bg)', border: 'var(--glass-border)', boxShadow: 'var(--glass-shadow)' }}>
              <p style={{ margin: '0 0 8px 0', color: 'var(--color-muted)', fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Total Mata Kuliah</p>
              <h2 style={{ margin: 0, fontSize: '1.8rem', fontWeight: '800', color: 'var(--color-text)' }}>{courses.length}</h2>
            </div>
            <div className="siakad-card" style={{ padding: '24px', borderRadius: '24px', background: 'var(--glass-bg)', border: 'var(--glass-border)', boxShadow: 'var(--glass-shadow)' }}>
              <p style={{ margin: '0 0 8px 0', color: 'var(--color-muted)', fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Total SKS Kurikulum</p>
              <h2 style={{ margin: 0, fontSize: '1.8rem', fontWeight: '800', color: 'var(--color-text)' }}>{courses.reduce((acc, c) => acc + parseInt(c.sks), 0)} SKS</h2>
            </div>
          </div>

          <div className="siakad-card" style={{ padding: '24px', borderRadius: '24px', background: 'var(--glass-bg)', border: 'var(--glass-border)', boxShadow: 'var(--glass-shadow)' }}>
            <div style={{ overflowX: 'auto' }}>
              <table className="siakad-table" style={{ width: '100%', minWidth: '800px', borderCollapse: 'separate', borderSpacing: '0 12px', textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: 'var(--glass-bg)', color: 'var(--color-muted)', border: 'var(--glass-border)', boxShadow: 'var(--glass-shadow)', textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '0.05em' }}>
                    <th style={{ padding: '16px' }}>Semester</th>
                    <th style={{ padding: '16px' }}>Kode</th>
                    <th style={{ padding: '16px' }}>Mata Kuliah</th>
                    <th style={{ padding: '16px' }}>SKS</th>
                    <th style={{ padding: '16px' }}>Dosen Pengampu</th>
                    <th style={{ padding: '16px' }}>Sifat</th>
                    <th style={{ padding: '16px', textAlign: 'right' }}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {courses.sort((a,b) => parseInt(a.semester) - parseInt(b.semester)).map((c) => (
                    <tr key={c.id} style={{ borderBottom: '1px solid var(--color-border)', transition: 'all 0.2s' }} onMouseEnter={(e)=>e.currentTarget.style.background='var(--glass-bg)'} onMouseLeave={(e)=>e.currentTarget.style.background='transparent'}>
                      <td style={{ padding: '16px', fontWeight: 'bold' }}>Semester {c.semester}</td>
                      <td style={{ padding: '16px', color: 'var(--color-muted)' }}>{c.code}</td>
                      <td style={{ padding: '16px', fontWeight: 'bold', color: 'var(--color-text)' }}>{c.name}</td>
                      <td style={{ padding: '16px' }}>{c.sks} SKS</td>
                      <td style={{ padding: '16px', color: 'var(--color-muted)' }}>{c.dosen?.name || 'Belum diplot'}</td>
                      <td style={{ padding: '16px' }}>
                        <span className="siakad-badge" style={{ background: c.type === 'Wajib' ? 'rgba(196, 30, 58, 0.15)' : 'rgba(245, 158, 11, 0.15)', color: c.type === 'Wajib' ? '#C41E3A' : '#f59e0b', borderRadius: '50px', padding: '4px 12px' }}>{c.type}</span>
                      </td>
                      <td style={{ padding: '16px' }}>
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', flexWrap: 'nowrap', alignItems: 'center' }}>
                          <button id={`btn-edit-mk-${c.id}`} onClick={() => { setEditFormData(c); setIsEditModalOpen(true); }} style={{ background: 'var(--glass-bg)', border: 'var(--glass-border)', boxShadow: 'var(--glass-shadow)', color: '#3b82f6', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><i className="ph ph-pencil-simple"></i></button>
                          <button id={`btn-delete-mk-${c.id}`} onClick={() => handleDelete(c.id)} style={{ background: 'var(--glass-bg)', border: 'var(--glass-border)', boxShadow: 'var(--glass-shadow)', color: '#ef4444', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><i className="ph ph-trash"></i></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* OBE Tab — Outcome-Based Education Mapping */}
      {activeTab === 'obe' && (
        <div style={{ display: 'grid', gap: '24px', alignItems: 'start' }}>
          {/* CPL Section */}
          <div className="siakad-card" style={{ padding: '24px', borderRadius: '24px', background: 'var(--glass-bg)', border: 'var(--glass-border)', boxShadow: 'var(--glass-shadow)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--liquid-bg)', border: 'var(--inset-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: 'inset 2px 2px 4px var(--inset-shadow-dark), inset -2px -2px 4px var(--inset-shadow-light)', color: '#10b981' }}>
                <i className="ph ph-target" style={{ fontSize: '1.3rem' }}></i>
              </div>
              <div>
                <h2 style={{ fontSize: '1.15rem', fontWeight: 'bold', color: 'var(--color-text)', margin: 0 }}>Capaian Pembelajaran Lulusan (CPL)</h2>
                <p style={{ fontSize: '0.8rem', color: 'var(--color-muted)', margin: 0 }}>Program Learning Outcomes yang ditetapkan untuk prodi</p>
              </div>
            </div>
            <div style={{ display: 'grid', gap: '12px', alignItems: 'start' }}>
              {cplData.map((cpl, i) => (
                <div key={cpl.code} style={{ padding: '14px 18px', borderRadius: '14px', background: 'var(--glass-bg)', border: 'var(--glass-border)', boxShadow: 'var(--glass-shadow)', display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                  <span style={{ background: 'rgba(16,185,129,0.15)', color: '#10b981', padding: '4px 12px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: '800', whiteSpace: 'nowrap', marginTop: '2px' }}>{cpl.code}</span>
                  <p style={{ color: 'var(--color-text)', margin: 0, fontSize: '0.9rem', lineHeight: '1.5' }}>{cpl.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CPMK Section */}
          <div className="siakad-card" style={{ padding: '24px', borderRadius: '24px', background: 'var(--glass-bg)', border: 'var(--glass-border)', boxShadow: 'var(--glass-shadow)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--liquid-bg)', border: 'var(--inset-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: 'inset 2px 2px 4px var(--inset-shadow-dark), inset -2px -2px 4px var(--inset-shadow-light)', color: '#3b82f6' }}>
                <i className="ph ph-book-open" style={{ fontSize: '1.3rem' }}></i>
              </div>
              <div>
                <h2 style={{ fontSize: '1.15rem', fontWeight: 'bold', color: 'var(--color-text)', margin: 0 }}>Capaian Pembelajaran Mata Kuliah (CPMK)</h2>
                <p style={{ fontSize: '0.8rem', color: 'var(--color-muted)', margin: 0 }}>Course Learning Outcomes yang dipetakan ke CPL</p>
              </div>
            </div>
            <div style={{ display: 'grid', gap: '12px', alignItems: 'start' }}>
              {cpmkData.map((cpmk) => (
                <div key={cpmk.code} style={{ padding: '14px 18px', borderRadius: '14px', background: 'var(--glass-bg)', border: 'var(--glass-border)', boxShadow: 'var(--glass-shadow)' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', marginBottom: '8px', flexWrap: 'wrap' }}>
                    <span style={{ background: 'rgba(59,130,246,0.15)', color: '#3b82f6', padding: '4px 12px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: '800', whiteSpace: 'nowrap' }}>{cpmk.code}</span>
                    <p style={{ color: 'var(--color-text)', margin: 0, fontSize: '0.9rem', flex: 1 }}>{cpmk.description}</p>
                  </div>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginLeft: '0', alignItems: 'center' }}>
                    {cpmk.cpl.map(c => (
                      <span key={c} style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981', padding: '2px 10px', borderRadius: '12px', fontSize: '0.72rem', fontWeight: '700', border: '1px solid rgba(16,185,129,0.25)' }}>{c}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Matrix Visualization */}
          <div className="siakad-card" style={{ padding: '24px', borderRadius: '24px', background: 'var(--glass-bg)', border: 'var(--glass-border)', boxShadow: 'var(--glass-shadow)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--liquid-bg)', border: 'var(--inset-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: 'inset 2px 2px 4px var(--inset-shadow-dark), inset -2px -2px 4px var(--inset-shadow-light)', color: '#8b5cf6' }}>
                <i className="ph ph-grid-four" style={{ fontSize: '1.3rem' }}></i>
              </div>
              <div>
                <h2 style={{ fontSize: '1.15rem', fontWeight: 'bold', color: 'var(--color-text)', margin: 0 }}>Matriks CPL — Mata Kuliah</h2>
                <p style={{ fontSize: '0.8rem', color: 'var(--color-muted)', margin: 0 }}>Pemetaan kekuatan kontribusi setiap mata kuliah terhadap CPL</p>
              </div>
            </div>

            {/* Legend */}
            <div style={{ display: 'flex', gap: '16px', marginBottom: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
              {Object.entries(strengthColors).map(([label, styles]) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: 'var(--color-muted)' }}>
                  <div style={{ width: '20px', height: '20px', borderRadius: '6px', background: styles.bg, border: `1px solid ${styles.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: '0.6rem', fontWeight: '800', color: styles.color }}>{label[0]}</span>
                  </div>
                  {label}
                </div>
              ))}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: 'var(--color-muted)' }}>
                <div style={{ width: '20px', height: '20px', borderRadius: '6px', background: 'var(--liquid-bg)', border: 'var(--inset-border)', boxShadow: 'inset 1px 1px 2px var(--inset-shadow-dark)' }}></div>
                Tidak ada
              </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 12px', minWidth: '700px' }}>
                <thead>
                  <tr>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.78rem', fontWeight: '700', color: 'var(--color-muted)', borderBottom: '2px solid var(--color-border)', textTransform: 'uppercase', minWidth: '200px' }}>Mata Kuliah</th>
                    {cplData.map(cpl => (
                      <th key={cpl.code} style={{ padding: '12px 8px', textAlign: 'center', fontSize: '0.75rem', fontWeight: '800', color: '#10b981', borderBottom: '2px solid var(--color-border)', minWidth: '70px' }}>{cpl.code}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {matrixCourses.map((course, i) => (
                    <tr key={course.code} style={{ borderBottom: '1px solid var(--color-border)' }}>
                      <td style={{ padding: '12px 16px' }}>
                        <div>
                          <p style={{ color: 'var(--color-text)', fontWeight: '600', margin: 0, fontSize: '0.85rem' }}>{course.name}</p>
                          <p style={{ color: 'var(--color-muted)', margin: '2px 0 0 0', fontSize: '0.72rem' }}>{course.code}</p>
                        </div>
                      </td>
                      {cplData.map(cpl => {
                        const strength = course.mapping[cpl.code];
                        const style = strength ? strengthColors[strength] : null;
                        return (
                          <td key={cpl.code} style={{ padding: '8px', textAlign: 'center' }}>
                            {strength ? (
                              <div style={{
                                width: '42px', height: '42px', borderRadius: '10px', margin: '0 auto',
                                background: style.bg, border: `1px solid ${style.border}`,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                transition: 'transform 0.2s', cursor: 'default'
                              }} title={`${course.name} → ${cpl.code}: ${strength}`}>
                                <span style={{ fontSize: '0.7rem', fontWeight: '800', color: style.color }}>{strength[0]}</span>
                              </div>
                            ) : (
                              <div style={{
                                width: '42px', height: '42px', borderRadius: '10px', margin: '0 auto',
                                background: 'var(--liquid-bg)', border: 'var(--inset-border)', boxShadow: 'inset 2px 2px 4px var(--inset-shadow-dark), inset -2px -2px 4px var(--inset-shadow-light)'
                              }}></div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* CPL coverage summary */}
            <div style={{ marginTop: '20px', padding: '16px 20px', borderRadius: '16px', background: 'var(--liquid-bg)', border: 'var(--inset-border)', boxShadow: 'inset 2px 2px 5px var(--inset-shadow-dark), inset -2px -2px 5px var(--inset-shadow-light)' }}>
              <p style={{ fontSize: '0.82rem', fontWeight: '700', color: '#8b5cf6', margin: '0 0 12px 0' }}>Ringkasan Cakupan CPL</p>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
                {cplData.map(cpl => {
                  const count = matrixCourses.filter(c => c.mapping[cpl.code]).length;
                  const pct = Math.round((count / matrixCourses.length) * 100);
                  return (
                    <div key={cpl.code} style={{ flex: '1 1 100px', textAlign: 'center', padding: '10px', borderRadius: '12px', background: 'var(--glass-bg)', border: 'var(--glass-border)', boxShadow: 'var(--glass-shadow)' }}>
                      <p style={{ fontSize: '0.72rem', fontWeight: '800', color: '#10b981', margin: '0 0 4px 0' }}>{cpl.code}</p>
                      <p style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--color-text)', margin: '0 0 2px 0' }}>{count}</p>
                      <p style={{ fontSize: '0.68rem', color: 'var(--color-muted)', margin: 0 }}>{pct}% MK</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {isEditModalOpen && (
        <ModalShell
          title={editFormData.id ? 'Edit Mata Kuliah' : 'Tambah Mata Kuliah'}
          icon="ph-book-open"
          onClose={() => setIsEditModalOpen(false)}
          footer={(
            <>
              <button id="btn-cancel-mk" type="button" onClick={() => setIsEditModalOpen(false)} style={{ padding: '10px 20px', borderRadius: '50px', border: 'var(--glass-border)', background: 'var(--glass-bg)', color: 'var(--color-text)', cursor: 'pointer', fontWeight: 700, boxShadow: 'var(--glass-shadow)' }}>Batal</button>
              <button id="btn-save-mk" type="submit" form="kurikulum-form" style={{ padding: '10px 24px', borderRadius: '50px', border: 'none', background: 'linear-gradient(135deg, #C41E3A 0%, #9b1c2e 100%)', color: 'white', cursor: 'pointer', fontWeight: 700, boxShadow: '0 4px 12px rgba(196, 30, 58, 0.25)' }}>Simpan</button>
            </>
          )}
        >
          <form id="kurikulum-form" onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' , flexWrap: 'wrap'}}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Kode MK</label>
              <input id="mk-code" type="text" required value={editFormData.code} onChange={e=>setEditFormData({...editFormData, code: e.target.value})} className="siakad-input" style={{ width: '100%', boxShadow: 'inset 4px 4px 8px var(--inset-shadow-dark), inset -4px -4px 8px var(--inset-shadow-light)', background: 'var(--liquid-bg)', border: 'var(--inset-border)', color: 'var(--color-text)' }} placeholder="Contoh: IF101" />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Nama Mata Kuliah</label>
              <input id="mk-name" type="text" required value={editFormData.name} onChange={e=>setEditFormData({...editFormData, name: e.target.value})} className="siakad-input" style={{ width: '100%', boxShadow: 'inset 4px 4px 8px var(--inset-shadow-dark), inset -4px -4px 8px var(--inset-shadow-light)', background: 'var(--liquid-bg)', border: 'var(--inset-border)', color: 'var(--color-text)' }} placeholder="Contoh: Pemrograman Dasar" />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>SKS</label>
              <input id="mk-sks" type="number" required value={editFormData.sks} onChange={e=>setEditFormData({...editFormData, sks: e.target.value})} className="siakad-input" style={{ width: '100%', boxShadow: 'inset 4px 4px 8px var(--inset-shadow-dark), inset -4px -4px 8px var(--inset-shadow-light)', background: 'var(--liquid-bg)', border: 'var(--inset-border)', color: 'var(--color-text)' }} />
            </div>
          </form>
        </ModalShell>
      )}
    </div>
  );
}
