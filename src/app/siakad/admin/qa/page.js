'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ModalShell from '../../components/ModalShell';
import SkeletonLoader from '../../components/SkeletonLoader';
import CustomSelect from '../../components/CustomSelect';

export default function QualityAssurancePage() {
  const router = useRouter();
  const [docs, setDocs] = useState([]);
  const [iku, setIku] = useState([]);
  const [summary, setSummary] = useState({});
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [activeTab, setActiveTab] = useState('iku');
  const [form, setForm] = useState({ title: '', category: 'standar', academic_year: '2025/2026' });
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://backend.bikinwebdikitaaja.com/api';
  const getToken = () => localStorage.getItem('siakad_token');

  // SPME state (local sample data — no backend endpoint yet)
  const [spmeDocs, setSpmeDocs] = useState([
    { id: 1, nama: 'Borang Akreditasi Prodi Informatika', kategori: 'akreditasi_prodi', status: 'approved', tahun: 2025, tanggal_upload: '2025-06-10' },
    { id: 2, nama: 'Laporan Evaluasi Diri Institusi', kategori: 'akreditasi_institusi', status: 'submitted', tahun: 2025, tanggal_upload: '2025-05-22' },
    { id: 3, nama: 'Dokumen Sertifikasi ISO 21001', kategori: 'sertifikasi', status: 'draft', tahun: 2024, tanggal_upload: '2024-12-15' },
    { id: 4, nama: 'Borang Akreditasi Prodi Manajemen', kategori: 'akreditasi_prodi', status: 'submitted', tahun: 2025, tanggal_upload: '2025-07-01' },
    { id: 5, nama: 'Laporan Kinerja Institusi (LKI)', kategori: 'akreditasi_institusi', status: 'approved', tahun: 2024, tanggal_upload: '2024-11-30' },
  ]);
  const [showSpmeModal, setShowSpmeModal] = useState(false);
  const [spmeForm, setSpmeForm] = useState({ nama: '', kategori: 'akreditasi_prodi', status: 'draft', tahun: new Date().getFullYear().toString() });

  // Kuesioner state (local sample data)
  const [kuesionerCategory, setKuesionerCategory] = useState('akademik');
  const kuesionerData = {
    akademik: {
      label: 'Layanan Akademik',
      items: [
        { aspek: 'Kualitas pengajaran dosen', rating: 4.2, responden: 312 },
        { aspek: 'Ketersediaan bahan ajar', rating: 3.8, responden: 298 },
        { aspek: 'Kemudahan akses e-learning', rating: 4.0, responden: 305 },
        { aspek: 'Bimbingan akademik', rating: 3.6, responden: 275 },
        { aspek: 'Jadwal kuliah terstruktur', rating: 4.1, responden: 310 },
      ]
    },
    administrasi: {
      label: 'Layanan Administrasi',
      items: [
        { aspek: 'Kecepatan pelayanan TU', rating: 3.5, responden: 290 },
        { aspek: 'Keramahan petugas', rating: 4.0, responden: 285 },
        { aspek: 'Kemudahan pengurusan surat', rating: 3.7, responden: 260 },
        { aspek: 'Transparansi informasi biaya', rating: 3.3, responden: 270 },
        { aspek: 'Layanan keuangan online', rating: 3.9, responden: 280 },
      ]
    },
    sarana: {
      label: 'Sarana Prasarana',
      items: [
        { aspek: 'Kondisi ruang kelas', rating: 3.9, responden: 320 },
        { aspek: 'Ketersediaan WiFi', rating: 3.2, responden: 330 },
        { aspek: 'Kebersihan lingkungan', rating: 4.3, responden: 315 },
        { aspek: 'Fasilitas laboratorium', rating: 3.6, responden: 280 },
        { aspek: 'Tempat parkir', rating: 3.1, responden: 310 },
      ]
    },
    perpustakaan: {
      label: 'Perpustakaan',
      items: [
        { aspek: 'Koleksi buku terkini', rating: 3.7, responden: 200 },
        { aspek: 'Akses jurnal digital', rating: 4.1, responden: 185 },
        { aspek: 'Kenyamanan ruang baca', rating: 4.4, responden: 210 },
        { aspek: 'Jam operasional', rating: 3.5, responden: 190 },
        { aspek: 'Layanan peminjaman', rating: 3.9, responden: 195 },
      ]
    },
  };

  useEffect(() => { if (!getToken()) router.push('/siakad/login'); else fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [r1, r2] = await Promise.all([
        fetch(`${apiUrl}/siakad/qa/spmi`, { headers: { Authorization: `Bearer ${getToken()}`, Accept: 'application/json' } }),
        fetch(`${apiUrl}/siakad/qa/iku`, { headers: { Authorization: `Bearer ${getToken()}`, Accept: 'application/json' } })
      ]);
      const d1 = await r1.json(); const d2 = await r2.json();
      setDocs(d1.data || []); setIku(d2.data || []); setSummary(d2.summary || {});
    } catch(e) { console.error(e); } finally { setLoading(false); }
  };

  const uploadDoc = async () => {
    setSaving(true);
    try {
      const res = await fetch(`${apiUrl}/siakad/qa/spmi`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}`, Accept: 'application/json' }, body: JSON.stringify(form) });
      if (res.ok) { setMessage({ text: 'Dokumen SPMI berhasil ditambahkan!', type: 'success' }); setShowModal(false); fetchData(); }
      else { setMessage({ text: 'Gagal menambahkan dokumen.', type: 'error' }); }
    } catch(e) { setMessage({ text: 'Terjadi kesalahan.', type: 'error' }); } finally { setSaving(false); }
  };

  const addSpmeDoc = () => {
    const newDoc = {
      id: Date.now(),
      nama: spmeForm.nama,
      kategori: spmeForm.kategori,
      status: spmeForm.status,
      tahun: parseInt(spmeForm.tahun),
      tanggal_upload: new Date().toISOString().split('T')[0],
    };
    setSpmeDocs([newDoc, ...spmeDocs]);
    setShowSpmeModal(false);
    setSpmeForm({ nama: '', kategori: 'akreditasi_prodi', status: 'draft', tahun: new Date().getFullYear().toString() });
    setMessage({ text: 'Dokumen SPME berhasil ditambahkan!', type: 'success' });
  };

  const catColors = { standar: '#3b82f6', audit: '#8b5cf6', evaluasi: '#f59e0b', akreditasi: '#10b981' };
  const spmeKategoriColors = { akreditasi_prodi: '#3b82f6', akreditasi_institusi: '#8b5cf6', sertifikasi: '#f59e0b' };
  const spmeKategoriLabels = { akreditasi_prodi: 'Akreditasi Prodi', akreditasi_institusi: 'Akreditasi Institusi', sertifikasi: 'Sertifikasi' };
  const spmeStatusColors = { draft: '#6b7280', submitted: '#f59e0b', approved: '#10b981' };

  const getRatingColor = (val) => {
    if (val >= 4.0) return '#10b981';
    if (val >= 3.5) return '#3b82f6';
    if (val >= 3.0) return '#f59e0b';
    return '#ef4444';
  };

  if (loading) return (
    <div style={{ padding: '24px' }}>
      <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--color-text)', margin: '0 0 24px 0' }}>Memuat Penjaminan Mutu & IKU...</h1>
      <SkeletonLoader type="card" />
      <SkeletonLoader type="table" />
    </div>
  );

  return (
    <div className="fade-in">
      <div className="siakad-page-header">
        <div className="siakad-page-header-glow"></div>
        <div className="siakad-page-header-grid"></div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', margin: '0 0 8px 0', letterSpacing: '0.1em', textTransform: 'uppercase' }}>SIAKAD — PENJAMINAN MUTU</p>
          <h1 style={{ color: 'white', fontSize: '2.2rem', fontWeight: '800', margin: '0 0 8px 0', letterSpacing: '-0.03em' }}>Penjaminan Mutu & IKU</h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', margin: 0 }}>Kelola dokumen standar SPMI/SPME dan pantau status pemenuhan 8 Indikator Kinerja Utama Kampus.</p>
        </div>
      </div>

      <div style={{ padding: '24px' }}>
        {message && <div style={{ padding: '12px 20px', borderRadius: '12px', marginBottom: '16px', background: message.type === 'success' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', color: message.type === 'success' ? '#10b981' : '#ef4444', fontWeight: '600' }}>{message.text}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        {[{ label: 'Total Mahasiswa', val: summary.total_mahasiswa || 0, icon: 'ph-student', color: '#3b82f6' }, { label: 'Total Dosen', val: summary.total_dosen || 0, icon: 'ph-chalkboard-teacher', color: '#8b5cf6' }, { label: 'Total Alumni', val: summary.total_alumni || 0, icon: 'ph-users', color: '#10b981' }, { label: 'Dokumen SPMI', val: docs.length, icon: 'ph-files', color: '#f59e0b' }].map((s,i) => (
          <div key={i} className={`siakad-card stagger-${i+2}`} style={{ padding: '20px', textAlign: 'center' }}>
            <i className={`ph ${s.icon}`} style={{ fontSize: '1.5rem', color: s.color, marginBottom: '8px', display: 'block' }}></i>
            <p style={{ fontSize: '1.8rem', fontWeight: '800', color: s.color, margin: '0 0 4px 0' }}>{s.val}</p>
            <p style={{ fontSize: '0.75rem', color: 'var(--color-muted)', margin: 0, fontWeight: '600' }}>{s.label}</p>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {[{ key: 'iku', label: 'Dashboard IKU' }, { key: 'spmi', label: 'Dokumen SPMI' }, { key: 'spme', label: 'Dokumen SPME' }, { key: 'kuesioner', label: 'Kuesioner Layanan' }].map(t => (
          <button id={`qa-tab-${t.key}`} key={t.key} onClick={() => setActiveTab(t.key)} style={{
            padding: '10px 20px', borderRadius: '50px', border: activeTab === t.key ? '2px solid #3b82f6' : '1px solid var(--color-border)',
            background: activeTab === t.key ? 'rgba(59,130,246,0.15)' : 'transparent', color: activeTab === t.key ? '#3b82f6' : 'var(--color-muted)',
            fontWeight: '700', fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.2s'
          }}>{t.label}</button>
        ))}
      </div>

      {activeTab === 'iku' && (
        <div className="siakad-card stagger-3" style={{ padding: '24px' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--color-text)', margin: '0 0 24px 0' }}>8 Indikator Kinerja Utama (IKU)</h2>
          <div style={{ display: 'grid', gap: '16px' }}>
            {iku.map((item, i) => {
              const pct = Math.min((item.actual / item.target) * 100, 100);
              const color = pct >= 80 ? '#10b981' : pct >= 50 ? '#f59e0b' : '#ef4444';
              return (
                <div key={item.id} style={{ padding: '16px 20px', borderRadius: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--color-border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
                    <p style={{ color: 'var(--color-text)', fontWeight: '600', margin: 0, fontSize: '0.9rem', flex: 1 }}>
                      <span style={{ color: 'var(--color-muted)', marginRight: '8px', fontWeight: '800' }}>IKU {i + 1}</span>{item.name}
                    </p>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--color-muted)' }}>Target: <strong>{item.target}{item.unit}</strong></span>
                      <span style={{ fontSize: '1rem', fontWeight: '800', color }}>{item.actual}{item.unit}</span>
                    </div>
                  </div>
                  <div style={{ height: '10px', borderRadius: '10px', background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, borderRadius: '10px', background: `linear-gradient(90deg, ${color}, ${color}cc)`, transition: 'width 1s cubic-bezier(0.25,1,0.5,1)' }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === 'spmi' && (
        <div className="siakad-card stagger-3" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--color-text)', margin: 0 }}>Dokumen SPMI</h2>
            <button id="btn-add-spmi" onClick={() => setShowModal(true)} className="siakad-btn-primary" style={{ padding: '10px 20px' }}><i className="ph ph-plus"></i> Tambah Dokumen</button>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead><tr>{['Judul', 'Kategori', 'Tahun Akademik', 'Tanggal'].map(h => <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.78rem', fontWeight: '700', color: 'var(--color-muted)', borderBottom: '2px solid var(--color-border)', textTransform: 'uppercase' }}>{h}</th>)}</tr></thead>
              <tbody>
                {docs.length === 0 ? <tr><td colSpan={4} style={{ padding: '40px', textAlign: 'center', color: 'var(--color-muted)' }}>Belum ada dokumen SPMI.</td></tr> :
                docs.map(d => (
                  <tr key={d.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: '14px 16px', color: 'var(--color-text)', fontWeight: '600' }}>{d.title}</td>
                    <td style={{ padding: '14px 16px' }}><span style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '700', color: catColors[d.category] || '#3b82f6', background: `${catColors[d.category] || '#3b82f6'}18`, textTransform: 'capitalize' }}>{d.category}</span></td>
                    <td style={{ padding: '14px 16px', color: 'var(--color-muted)' }}>{d.academic_year}</td>
                    <td style={{ padding: '14px 16px', color: 'var(--color-muted)', fontSize: '0.85rem' }}>{new Date(d.created_at).toLocaleDateString('id-ID')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SPME Tab — External Quality Assurance Documents */}
      {activeTab === 'spme' && (
        <div className="siakad-card stagger-3" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--color-text)', margin: '0 0 4px 0' }}>Dokumen SPME</h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-muted)', margin: 0 }}>Sistem Penjaminan Mutu Eksternal — Dokumen akreditasi & sertifikasi</p>
            </div>
            <button id="btn-add-spme" onClick={() => setShowSpmeModal(true)} className="siakad-btn-primary" style={{ padding: '10px 20px' }}><i className="ph ph-plus"></i> Tambah Dokumen</button>
          </div>

          {/* SPME summary cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px', marginBottom: '20px' }}>
            {[
              { label: 'Total Dokumen', val: spmeDocs.length, color: '#3b82f6', icon: 'ph-files' },
              { label: 'Approved', val: spmeDocs.filter(d => d.status === 'approved').length, color: '#10b981', icon: 'ph-check-circle' },
              { label: 'Submitted', val: spmeDocs.filter(d => d.status === 'submitted').length, color: '#f59e0b', icon: 'ph-clock' },
              { label: 'Draft', val: spmeDocs.filter(d => d.status === 'draft').length, color: '#6b7280', icon: 'ph-pencil-simple' },
            ].map((s, i) => (
              <div key={i} style={{ padding: '16px', borderRadius: '16px', background: `${s.color}10`, border: `1px solid ${s.color}30`, textAlign: 'center' }}>
                <i className={`ph ${s.icon}`} style={{ fontSize: '1.2rem', color: s.color, marginBottom: '6px', display: 'block' }}></i>
                <p style={{ fontSize: '1.5rem', fontWeight: '800', color: s.color, margin: '0 0 2px 0' }}>{s.val}</p>
                <p style={{ fontSize: '0.72rem', color: 'var(--color-muted)', margin: 0, fontWeight: '600' }}>{s.label}</p>
              </div>
            ))}
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {['Nama Dokumen', 'Kategori', 'Status', 'Tahun', 'Tanggal Upload'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.78rem', fontWeight: '700', color: 'var(--color-muted)', borderBottom: '2px solid var(--color-border)', textTransform: 'uppercase' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {spmeDocs.length === 0 ? (
                  <tr><td colSpan={5} style={{ padding: '40px', textAlign: 'center', color: 'var(--color-muted)' }}>Belum ada dokumen SPME.</td></tr>
                ) : spmeDocs.map(d => (
                  <tr key={d.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: '14px 16px', color: 'var(--color-text)', fontWeight: '600' }}>{d.nama}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '700', color: spmeKategoriColors[d.kategori] || '#3b82f6', background: `${spmeKategoriColors[d.kategori] || '#3b82f6'}18` }}>
                        {spmeKategoriLabels[d.kategori] || d.kategori}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '700', color: spmeStatusColors[d.status] || '#6b7280', background: `${spmeStatusColors[d.status] || '#6b7280'}18`, textTransform: 'capitalize' }}>
                        {d.status}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px', color: 'var(--color-muted)' }}>{d.tahun}</td>
                    <td style={{ padding: '14px 16px', color: 'var(--color-muted)', fontSize: '0.85rem' }}>{new Date(d.tanggal_upload).toLocaleDateString('id-ID')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Kuesioner Layanan Mutu Tab */}
      {activeTab === 'kuesioner' && (
        <div className="siakad-card stagger-3" style={{ padding: '24px' }}>
          <div style={{ marginBottom: '20px' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--color-text)', margin: '0 0 4px 0' }}>Kuesioner Layanan Mutu</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-muted)', margin: 0 }}>Hasil survei kepuasan layanan berdasarkan kategori — skala 1 (Sangat Tidak Puas) s.d. 5 (Sangat Puas)</p>
          </div>

          {/* Category selector */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
            {[
              { key: 'akademik', label: 'Layanan Akademik', icon: 'ph-graduation-cap' },
              { key: 'administrasi', label: 'Layanan Administrasi', icon: 'ph-clipboard-text' },
              { key: 'sarana', label: 'Sarana Prasarana', icon: 'ph-buildings' },
              { key: 'perpustakaan', label: 'Perpustakaan', icon: 'ph-books' },
            ].map(c => (
              <button id={`kuesioner-cat-${c.key}`} key={c.key} onClick={() => setKuesionerCategory(c.key)} style={{
                padding: '8px 16px', borderRadius: '50px', border: kuesionerCategory === c.key ? '2px solid #8b5cf6' : '1px solid var(--color-border)',
                background: kuesionerCategory === c.key ? 'rgba(139,92,246,0.15)' : 'transparent', color: kuesionerCategory === c.key ? '#8b5cf6' : 'var(--color-muted)',
                fontWeight: '700', fontSize: '0.8rem', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '6px'
              }}>
                <i className={`ph ${c.icon}`} style={{ fontSize: '1rem' }}></i> {c.label}
              </button>
            ))}
          </div>

          {/* Overall average badge */}
          {(() => {
            const currentData = kuesionerData[kuesionerCategory];
            const avg = (currentData.items.reduce((a, b) => a + b.rating, 0) / currentData.items.length).toFixed(2);
            const totalResp = currentData.items.reduce((a, b) => a + b.responden, 0);
            return (
              <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
                <div style={{ padding: '16px 24px', borderRadius: '16px', background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.2)', flex: '1 1 200px' }}>
                  <p style={{ fontSize: '0.78rem', color: 'var(--color-muted)', margin: '0 0 4px 0', fontWeight: '600', textTransform: 'uppercase' }}>Rata-rata Kepuasan</p>
                  <p style={{ fontSize: '2rem', fontWeight: '800', color: getRatingColor(parseFloat(avg)), margin: 0 }}>{avg} <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--color-muted)' }}>/ 5.00</span></p>
                </div>
                <div style={{ padding: '16px 24px', borderRadius: '16px', background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)', flex: '1 1 200px' }}>
                  <p style={{ fontSize: '0.78rem', color: 'var(--color-muted)', margin: '0 0 4px 0', fontWeight: '600', textTransform: 'uppercase' }}>Total Responden</p>
                  <p style={{ fontSize: '2rem', fontWeight: '800', color: '#3b82f6', margin: 0 }}>{totalResp}</p>
                </div>
              </div>
            );
          })()}

          {/* Bar chart visualization */}
          <div style={{ display: 'grid', gap: '16px' }}>
            {kuesionerData[kuesionerCategory].items.map((item, i) => {
              const pct = (item.rating / 5) * 100;
              const color = getRatingColor(item.rating);
              return (
                <div key={i} style={{ padding: '16px 20px', borderRadius: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--color-border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
                    <p style={{ color: 'var(--color-text)', fontWeight: '600', margin: 0, fontSize: '0.9rem', flex: 1 }}>{item.aspek}</p>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.78rem', color: 'var(--color-muted)' }}>{item.responden} responden</span>
                      <span style={{ fontSize: '1.1rem', fontWeight: '800', color, minWidth: '40px', textAlign: 'right' }}>{item.rating.toFixed(1)}</span>
                    </div>
                  </div>
                  <div style={{ height: '10px', borderRadius: '10px', background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, borderRadius: '10px', background: `linear-gradient(90deg, ${color}, ${color}cc)`, transition: 'width 1s cubic-bezier(0.25,1,0.5,1)' }}></div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Rating legend */}
          <div style={{ display: 'flex', gap: '16px', marginTop: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
            {[
              { label: '≥ 4.0 Sangat Baik', color: '#10b981' },
              { label: '3.5–3.9 Baik', color: '#3b82f6' },
              { label: '3.0–3.4 Cukup', color: '#f59e0b' },
              { label: '< 3.0 Kurang', color: '#ef4444' },
            ].map((l, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--color-muted)' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: l.color }}></div>
                {l.label}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SPMI Upload Modal */}
      {showModal && (
        <ModalShell title="Tambah Dokumen SPMI" subtitle="Penjaminan Mutu" icon="ph-shield-check" onClose={() => setShowModal(false)}
          footer={<><button id="btn-cancel-spmi" onClick={() => setShowModal(false)} className="btn" style={{ padding: '10px 20px', border: 'none', color: 'var(--color-text)', cursor: 'pointer', fontWeight: '600' }}>Batal</button>
            <button id="btn-save-spmi" onClick={uploadDoc} disabled={saving} className="siakad-btn-primary" style={{ padding: '10px 24px' }}>{saving ? 'Menyimpan...' : 'Simpan'}</button></>}>
          <div style={{ marginBottom: '16px' }}><label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: 'var(--color-muted)', fontWeight: '600' }}>Judul Dokumen</label>
            <input id="spmi-title" className="siakad-input" value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="Contoh: Standar Pendidikan 2025" /></div>
          <div style={{ marginBottom: '16px' }}><label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: 'var(--color-muted)', fontWeight: '600' }}>Kategori</label>
            <CustomSelect
              value={form.category}
              onChange={val => setForm({...form, category: val})}
              options={[
                { value: 'standar', label: 'Standar' },
                { value: 'audit', label: 'Audit' },
                { value: 'evaluasi', label: 'Evaluasi' },
                { value: 'akreditasi', label: 'Akreditasi' }
              ]}
            /></div>
          <div style={{ marginBottom: '16px' }}><label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: 'var(--color-muted)', fontWeight: '600' }}>Tahun Akademik</label>
            <input id="spmi-year" className="siakad-input" value={form.academic_year} onChange={e => setForm({...form, academic_year: e.target.value})} placeholder="2025/2026" /></div>
        </ModalShell>
      )}

      {/* SPME Upload Modal */}
      {showSpmeModal && (
        <ModalShell title="Tambah Dokumen SPME" subtitle="Penjaminan Mutu Eksternal" icon="ph-globe" onClose={() => setShowSpmeModal(false)}
          footer={<><button id="btn-cancel-spme" onClick={() => setShowSpmeModal(false)} className="btn" style={{ padding: '10px 20px', border: 'none', color: 'var(--color-text)', cursor: 'pointer', fontWeight: '600' }}>Batal</button>
            <button id="btn-save-spme" onClick={addSpmeDoc} disabled={!spmeForm.nama} className="siakad-btn-primary" style={{ padding: '10px 24px', opacity: !spmeForm.nama ? 0.5 : 1 }}>Simpan</button></>}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: 'var(--color-muted)', fontWeight: '600' }}>Nama Dokumen</label>
            <input id="spme-nama" className="siakad-input" value={spmeForm.nama} onChange={e => setSpmeForm({...spmeForm, nama: e.target.value})} placeholder="Contoh: Borang Akreditasi Prodi Informatika" />
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: 'var(--color-muted)', fontWeight: '600' }}>Kategori</label>
            <CustomSelect
              value={spmeForm.kategori}
              onChange={val => setSpmeForm({...spmeForm, kategori: val})}
              options={[
                { value: 'akreditasi_prodi', label: 'Akreditasi Prodi' },
                { value: 'akreditasi_institusi', label: 'Akreditasi Institusi' },
                { value: 'sertifikasi', label: 'Sertifikasi' }
              ]}
            />
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: 'var(--color-muted)', fontWeight: '600' }}>Status</label>
            <CustomSelect
              value={spmeForm.status}
              onChange={val => setSpmeForm({...spmeForm, status: val})}
              options={[
                { value: 'draft', label: 'Draft' },
                { value: 'submitted', label: 'Submitted' },
                { value: 'approved', label: 'Approved' }
              ]}
            />
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: 'var(--color-muted)', fontWeight: '600' }}>Tahun</label>
            <input id="spme-tahun" className="siakad-input" type="number" value={spmeForm.tahun} onChange={e => setSpmeForm({...spmeForm, tahun: e.target.value})} placeholder="2025" />
          </div>
        </ModalShell>
      )}
      </div>
    </div>
  );
}
