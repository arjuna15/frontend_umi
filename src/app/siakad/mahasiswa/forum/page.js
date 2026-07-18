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
            <div style={{ position: 'relative', width: '300px' }}>
              <i className="ph ph-magnifying-glass" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-muted)', fontSize: '1rem' }}></i>
              <input 
                type="text" 
                placeholder="Cari mata kuliah atau topik..." 
                className="siakad-input"
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ 
                  width: '100%', 
                  paddingLeft: '46px', 
                  color: 'var(--color-text)',
                  fontSize: '0.85rem'
                }} 
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
              <div key={i} className="siakad-card" style={{ padding: '0', overflow: 'hidden' }}>
                <div style={{ background: 'var(--glass-bg)', padding: '20px 24px', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--color-text)', fontWeight: '800' }}>{course.name}</h3>
                    <span className="siakad-badge-status" style={{ display: 'inline-block', marginTop: '4px', fontSize: '0.8rem', color: 'var(--color-muted)', borderColor: 'var(--color-border)', background: 'transparent' }}>{course.code}</span>
                  </div>
                  <button onClick={() => { setActiveCourseId(course.id); setTopicForm({ title: '', content: '' }); setShowTopicModal(true); }} className="siakad-btn-primary" style={{ padding: '8px 20px', borderRadius: '50px !important' }}>
                    <i className="ph ph-plus"></i> Buat Topik Baru
                  </button>
                </div>
                
                <div style={{ padding: '24px' }}>
                  {course.forums && course.forums.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      {course.forums.map((forum, j) => (
                        <div key={j} className="siakad-card" style={{ background: 'var(--glass-bg)', borderRadius: '24px', padding: '20px 24px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                            <div style={{ 
                              width: '40px', 
                              height: '40px', 
                              borderRadius: '50%', 
                              background: 'rgba(0, 0, 0, 0.04)', 
                              boxShadow: 'inset 2px 2px 4px var(--inset-shadow-dark), inset -2px -2px 4px var(--inset-shadow-light)',
                              border: 'var(--inset-border)',
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'center', 
                              color: 'var(--apple-blue)', 
                              fontWeight: '800', 
                              flexShrink: 0 
                            }}>
                              M
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
                          <div style={{ background: 'var(--liquid-bg)', borderRadius: '16px', padding: '16px', border: 'var(--inset-border)', boxShadow: 'inset 2px 2px 5px var(--inset-shadow-dark), inset -2px -2px 5px var(--inset-shadow-light)', borderLeft: '4px solid var(--apple-blue)' }}>
                            <h4 style={{ fontSize: '0.85rem', color: 'var(--color-muted)', margin: '0 0 12px 0', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '800' }}>Balasan ({forum.replies?.length || 0})</h4>
                            {forum.replies && forum.replies.map((reply, k) => (
                              <div key={k} style={{ marginBottom: k === forum.replies.length - 1 ? 0 : '12px', paddingBottom: k === forum.replies.length - 1 ? 0 : '12px', borderBottom: k === forum.replies.length - 1 ? 'none' : '1px solid var(--color-border)' }}>
                                <div className="siakad-modal-header">
                                  <strong style={{ fontSize: '0.85rem', color: 'var(--color-text)', display: 'block' }}>
                                    {reply.user_id === data.user.id ? 'Anda' : (reply.user_id === course.dosen_id ? 'Dosen' : 'Mahasiswa Lain')}
                                  </strong>
                                  <span style={{ fontSize: '0.75rem', color: 'var(--color-muted)' }}>{new Date(reply.created_at).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}</span>
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
                              <input name="content" type="text" placeholder="Tulis balasan..." className="siakad-input" style={{ flex: 1, minWidth: 0 }} />
                              <button type="submit" className="siakad-btn-primary" style={{ padding: '8px 20px', borderRadius: '50px' }}>Kirim</button>
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
                <button type="button" onClick={() => setShowTopicModal(false)} style={{ padding: '12px 24px', borderRadius: '50px', border: 'var(--glass-border)', background: 'var(--glass-bg)', color: 'var(--color-text)', cursor: 'pointer', fontWeight: 700, boxShadow: 'var(--glass-shadow)' }}>Batal</button>
                <button type="submit" form="topic-form" className="siakad-btn-primary" style={{ padding: '12px 24px', borderRadius: '50px' }}>Simpan & Kirim</button>
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
