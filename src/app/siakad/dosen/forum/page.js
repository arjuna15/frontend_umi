"use client";
import { useEffect, useState } from 'react';
import ModalShell from '../../components/ModalShell';
import { useRouter } from 'next/navigation';

export default function DosenForumPage() {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showTopicModal, setShowTopicModal] = useState(false);
  const [activeCourseId, setActiveCourseId] = useState(null);
  const [topicForm, setTopicForm] = useState({ title: '', content: '' });

  useEffect(() => {
    const fetchDashboard = async () => {
      const token = localStorage.getItem('siakad_token');
      if (!token) return router.push('/siakad/login');

      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
        const activePortal = localStorage.getItem('siakad_portal') || localStorage.getItem('siakad_role');
        const res = await fetch(`${apiUrl}/siakad/dashboard`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            ...(activePortal ? { 'X-SIAKAD-PORTAL': activePortal } : {})
          }
        });
        if (!res.ok) throw new Error('Failed to fetch');
        const result = await res.json();
        if (result.user.role !== 'dosen' && !(result.user.role === 'kaprodi' && activePortal === 'dosen')) return router.push('/siakad/login');
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
      <div style={{ marginBottom: '32px' }}>
        <div className="siakad-page-header">
        <div className="siakad-page-header-glow"></div>
        <div className="siakad-page-header-grid"></div>
          <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ flex: '1 1 100%' }}>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', margin: '0 0 8px 0', letterSpacing: '0.1em', textTransform: 'uppercase' }}>SIAKAD — DOSEN</p>
              <h1 style={{ fontSize: '2.2rem', fontWeight: '800', color: 'white', margin: '0 0 8px 0', letterSpacing: '-0.03em' }}>Forum Diskusi Kelas</h1>
              <p style={{ color: 'rgba(255,255,255,0.6)', margin: 0, fontSize: '1.05rem' }}>Berinteraksi dan jawab pertanyaan mahasiswa secara real-time.</p>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
        {data.jadwal.map((course, i) => (
          <div key={i} style={{ 
            background: 'var(--glass-bg)', backdropFilter: 'blur(10px)',
            borderRadius: '16px', boxShadow: 'var(--glass-shadow)', 
            border: 'var(--glass-border)', overflow: 'hidden' 
          }}>
            <div style={{ background: 'var(--glass-bg)', padding: '20px 24px', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--color-text)', fontWeight: 'bold' }}>{course.name}</h3>
                <span style={{ display: 'inline-block', marginTop: '4px', fontSize: '0.85rem', color: 'var(--color-muted)' }}>{course.code}</span>
              </div>
              <button onClick={() => {
                setActiveCourseId(course.id);
                setTopicForm({ title: '', content: '' });
                setShowTopicModal(true);
              }} style={{ background: '#f97316', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 10px rgba(249, 115, 22, 0.3)' }}>
                <i className="ph ph-plus"></i> Buat Topik Baru
              </button>
            </div>
            
            <div style={{ padding: '24px' }}>
              {course.forums && course.forums.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {course.forums.map((forum, j) => (
                    <div key={j} style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                        <div style={{ width: '40px', height: '40px', background: 'rgba(99, 102, 241, 0.1)', color: '#4f46e5', border: '1px solid rgba(99, 102, 241, 0.3)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' , flexShrink: 0 }}>
                          D
                        </div>
                        <div>
                          <strong style={{ display: 'block', color: 'var(--color-text)' }}>{forum.title}</strong>
                          <span style={{ fontSize: '0.75rem', color: 'var(--color-muted)' }}>Diposting oleh Anda (Dosen)</span>
                        </div>
                      </div>
                      <p style={{ margin: '0 0 16px 0', color: 'var(--color-muted)', fontSize: '0.95rem', lineHeight: '1.5' }}>
                        {forum.content}
                      </p>
                      
                      {/* Replies */}
                      <div style={{ background: 'var(--color-bg)', borderRadius: '8px', padding: '16px', borderLeft: '4px solid #f97316' }}>
                        <h4 style={{ fontSize: '0.85rem', color: 'var(--color-muted)', margin: '0 0 12px 0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Balasan ({forum.replies?.length || 0})</h4>
                        {forum.replies && forum.replies.map((reply, k) => (
                          <div key={k} style={{ marginBottom: k === forum.replies.length - 1 ? 0 : '12px', paddingBottom: k === forum.replies.length - 1 ? 0 : '12px', borderBottom: k === forum.replies.length - 1 ? 'none' : '1px solid #e5e7eb' }}>
                            <strong style={{ fontSize: '0.85rem', color: 'var(--color-text)', display: 'block' }}>{reply.user_id === data.user.id ? 'Anda' : 'Mahasiswa'}</strong>
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
                            <input name="content" type="text" placeholder="Tulis balasan..." style={{ flex: 1, minWidth: 0, padding: '8px 12px', borderRadius: '6px', border: '1px solid #d1d5db', outline: 'none', fontSize: '0.9rem' }} />
                            <button type="submit" style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Kirim</button>
                          </form>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: 'var(--color-muted)', fontSize: '0.9rem', margin: 0, fontStyle: 'italic', textAlign: 'center' }}>Belum ada topik diskusi di kelas ini.</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {showTopicModal && (
        <ModalShell
          title="Buat Topik Diskusi Baru"
          icon="ph-pencil-simple-line"
          onClose={() => setShowTopicModal(false)}
          footer={(
            <>
              <button
                type="button"
                onClick={() => setShowTopicModal(false)}
                style={{ padding: '12px 20px', borderRadius: '12px', border: '1px solid var(--color-border)', background: 'transparent', color: 'var(--color-text)', cursor: 'pointer', fontWeight: 700 }}
              >
                Batal
              </button>
              <button
                type="submit"
                form="dosen-topic-form"
                style={{ padding: '12px 20px', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)', color: 'white', cursor: 'pointer', fontWeight: 700 }}
              >
                Simpan & Kirim
              </button>
            </>
          )}
        >
          <form
            id="dosen-topic-form"
            onSubmit={async (e) => {
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
              } catch (err) {
                window.toast('Error: ' + err.message);
              }
            }}
            style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
          >
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
                value={topicForm.content}
                onChange={(e) => setTopicForm({ ...topicForm, content: e.target.value })}
                placeholder="Tulis isi diskusi di sini"
                rows={7}
                style={{ width: '100%', minHeight: '180px', resize: 'vertical' }}
                required
              />
            </div>
          </form>
        </ModalShell>
      )}
    </div>
  );
}
