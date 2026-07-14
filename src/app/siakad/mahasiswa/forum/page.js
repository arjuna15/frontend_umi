"use client";
import { useEffect, useState } from 'react';
import ModalShell from '../../components/ModalShell';
import { useRouter } from 'next/navigation';

export default function MahasiswaForumPage() {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showTopicModal, setShowTopicModal] = useState(false);
  const [activeCourseId, setActiveCourseId] = useState(null);
  const [topicForm, setTopicForm] = useState({ title: '', content: '' });

  useEffect(() => {
    const fetchDashboard = async () => {
      const token = localStorage.getItem('siakad_token');
      if (!token) return router.push('/siakad/login');

      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
        const res = await fetch(`${apiUrl}/siakad/dashboard`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Failed to fetch');
        const result = await res.json();
        if (result.user.role !== 'mahasiswa') return router.push('/siakad/login');
        setData(result);
      } catch (err) {
        router.push('/siakad/login');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, [router]);

  if (loading || !data) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyItems: 'center', height: '100%', color: 'var(--color-muted)' }}>
      <i className="ph ph-spinner ph-spin" style={{ fontSize: '2rem', marginRight: '10px' }}></i> Memuat forum diskusi...
    </div>
  );

  return (
    <div>
      <div className="siakad-page-header">
        <div className="siakad-page-header-glow"></div>
        <div className="siakad-page-header-grid"></div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', margin: '0 0 8px 0', letterSpacing: '0.1em', textTransform: 'uppercase' }}>SIAKAD — MAHASISWA</p>
          <div className="siakad-modal-header">
            <div>
              <h1 style={{ color: 'white', fontSize: '2.2rem', fontWeight: '800', margin: '0 0 8px 0', letterSpacing: '-0.03em' }}>Forum Diskusi Kelas</h1>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(15, 23, 42, 0.65)', padding: '10px 20px', borderRadius: '50px', border: '1px solid rgba(255,255,255,0.12)', width: '300px', backdropFilter: 'blur(10px)' }}>
              <i className="ph ph-magnifying-glass" style={{ color: 'rgba(255,255,255,0.8)', marginRight: '8px' }}></i>
              <input 
                type="text" 
                placeholder="Cari mata kuliah atau topik..." 
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ border: 'none', outline: 'none', background: 'transparent', width: '100%', color: 'white' }}
              />
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
        {(() => {
          const filteredCourses = data.krs.filter(item => {
            const course = item.course;
            if (!course) return false;
            // Search by course name or forum title
            const term = search.toLowerCase();
            const matchName = course.name.toLowerCase().includes(term);
            const matchForum = course.forums?.some(f => f.title.toLowerCase().includes(term));
            return matchName || matchForum;
          });
          
          if (filteredCourses.length === 0) {
            return (
              <div style={{ textAlign: 'center', padding: '64px 0', background: 'var(--glass-bg)', borderRadius: '16px', border: '1px dashed var(--color-border)' }}>
                <i className="ph ph-magnifying-glass" style={{ fontSize: '3rem', color: 'var(--color-muted)', marginBottom: '16px' }}></i>
                <h3 style={{ margin: '0 0 8px 0', color: 'var(--color-text)' }}>Tidak ada forum yang cocok</h3>
                <p style={{ margin: 0, color: 'var(--color-muted)' }}>Coba kata kunci pencarian yang lain.</p>
              </div>
            );
          }

          return filteredCourses.map((item, i) => {
            const course = item.course;
            return (
              <div key={i} className="siakad-card" style={{ overflow: 'hidden' }}>
                <div style={{ background: 'var(--glass-bg)', padding: '20px 24px', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--color-text)', fontWeight: 'bold' }}>{course.name}</h3>
                  <span style={{ display: 'inline-block', marginTop: '4px', fontSize: '0.85rem', color: 'var(--color-muted)' }}>{course.code}</span>
                </div>
                <button onClick={() => { setActiveCourseId(course.id); setTopicForm({ title: '', content: '' }); setShowTopicModal(true); }} style={{ background: 'linear-gradient(135deg, #C41E3A 0%, #9b1c2e 100%)', color: 'white', border: 'none', padding: '8px 20px', borderRadius: '50px', fontSize: '0.85rem', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 12px rgba(196, 30, 58, 0.3)' }}>
                  <i className="ph ph-plus"></i> Buat Topik Baru
                </button>
              </div>
              
              <div style={{ padding: '24px' }}>
                {course.forums && course.forums.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {course.forums.map((forum, j) => (
                      <div key={j} style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                          <div style={{ width: '40px', height: '40px', background: 'rgba(15,23,42,0.1)', color: '#0f172a', border: '1px solid rgba(15,23,42,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' , flexShrink: 0 }}>
                            <i className="ph ph-user"></i>
                          </div>
                          <div>
                            <strong style={{ display: 'block', color: 'var(--color-text)' }}>{forum.title}</strong>
                            <span style={{ fontSize: '0.75rem', color: 'var(--color-muted)' }}>Diposting oleh Dosen • {new Date(forum.created_at).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}</span>
                          </div>
                        </div>
                        <p style={{ margin: '0 0 16px 0', color: 'var(--color-muted)', fontSize: '0.95rem', lineHeight: '1.5' }}>
                          {forum.content}
                        </p>
                        
                        {/* Replies */}
                        <div style={{ background: 'var(--color-bg)', borderRadius: '8px', padding: '16px', borderLeft: '4px solid #C41E3A' }}>
                          <h4 style={{ fontSize: '0.85rem', color: 'var(--color-muted)', margin: '0 0 12px 0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Balasan ({forum.replies?.length || 0})</h4>
                          {forum.replies && forum.replies.map((reply, k) => (
                            <div key={k} style={{ marginBottom: k === forum.replies.length - 1 ? 0 : '12px', paddingBottom: k === forum.replies.length - 1 ? 0 : '12px', borderBottom: k === forum.replies.length - 1 ? 'none' : '1px solid var(--color-border)' }}>
                              <div className="siakad-modal-header">
                                <strong style={{ fontSize: '0.85rem', color: 'var(--color-text)', display: 'block' }}>
                                  {reply.user_id === data.user.id ? 'Anda' : (reply.user_id === course.dosen_id ? 'Dosen' : 'Mahasiswa Lain')}
                                </strong>
                                <span style={{ fontSize: '0.7rem', color: 'var(--color-muted)' }}>{new Date(reply.created_at).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}</span>
                              </div>
                              <p style={{ margin: '4px 0 0 0', fontSize: '0.9rem', color: 'var(--color-muted)' }}>{reply.content}</p>
                            </div>
                          ))}
                          <form onSubmit={async (e) => {
                            e.preventDefault();
                            const content = e.target.content.value;
                            if (!content.trim()) return;
                            const token = localStorage.getItem('siakad_token');
                            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
                            try {
                              const res = await fetch(`${apiUrl}/siakad/forum/${forum.id}/reply`, {
                                method: 'POST',
                                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                                  body: JSON.stringify({ content })
                                });
                                if (res.ok) window.location.reload();
                                else window.toast('Gagal mengirim balasan');
                              } catch (err) { window.toast('Error: ' + err.message); }
                            }} style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
                              <input name="content" type="text" placeholder="Tulis balasan..." style={{ flex: 1, minWidth: 0, padding: '8px 16px', borderRadius: '50px', border: '1px solid var(--color-border)', outline: 'none', fontSize: '0.9rem', background: 'var(--color-bg)', color: 'var(--color-text)' }} />
                              <button type="submit" style={{ background: '#C41E3A', color: 'white', border: 'none', padding: '8px 20px', borderRadius: '50px', cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 2px 6px rgba(196, 30, 58, 0.3)' }}>Kirim</button>
                            </form>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p style={{ color: 'var(--color-muted)', fontSize: '0.9rem', margin: 0, fontStyle: 'italic', textAlign: 'center' }}>Belum ada topik diskusi dari dosen.</p>
                  )}
                </div>
              </div>
            );
            });
          })()}
        </div>
  
        {showTopicModal && (
          <ModalShell
            title="Buat Topik Diskusi Baru"
            icon="ph-pencil-simple-line"
            onClose={() => setShowTopicModal(false)}
            footer={(
              <>
                <button type="button" onClick={() => setShowTopicModal(false)} style={{ padding: '12px 24px', borderRadius: '50px', border: '1px solid var(--color-border)', background: 'transparent', color: 'var(--color-text)', cursor: 'pointer', fontWeight: 700 }}>Batal</button>
                <button type="submit" form="topic-form" style={{ padding: '12px 24px', borderRadius: '50px', border: 'none', background: 'linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)', color: 'white', cursor: 'pointer', fontWeight: 700 }}>Simpan & Kirim</button>
              </>
            )}
          >
          <form id="topic-form" onSubmit={async (e) => {
            e.preventDefault();
            if (!topicForm.title.trim() || !topicForm.content.trim()) return;
            const token = localStorage.getItem('siakad_token');
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
            try {
              const res = await fetch(`${apiUrl}/siakad/forum/${activeCourseId}`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: topicForm.title, content: topicForm.content })
              });
              if (res.ok) {
                setShowTopicModal(false);
                window.location.reload();
              } else {
                window.toast('Gagal membuat topik');
              }
            } catch (err) { window.toast('Error: ' + err.message); }
          }} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--color-text)', fontWeight: '600' }}>Judul Topik</label>
              <input
                type="text"
                autoFocus
                className="siakad-input"
                value={topicForm.title}
                onChange={(e) => setTopicForm({ ...topicForm, title: e.target.value })}
                placeholder="Judul topik diskusi"
                style={{ width: '100%' }}
                required
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--color-text)', fontWeight: '600' }}>Isi Diskusi</label>
              <textarea
                className="siakad-input"
                rows={5}
                value={topicForm.content}
                onChange={(e) => setTopicForm({ ...topicForm, content: e.target.value })}
                placeholder="Tulis pertanyaan atau topik diskusi"
                style={{ width: '100%', resize: 'vertical' }}
                required
              />
            </div>
          </form>
        </ModalShell>
      )}
    </div>
  );
}
