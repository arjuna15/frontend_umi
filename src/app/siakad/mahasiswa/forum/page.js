"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function MahasiswaForumPage() {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

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
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--color-text)', margin: '0 0 8px 0' }}>Forum Diskusi Kelas 💬</h1>
          <p style={{ color: 'var(--color-muted)', margin: 0 }}>Berdiskusi dengan dosen dan teman sekelas Anda.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
        {data.krs.map((item, i) => {
          const course = item.course;
          if (!course) return null;
          return (
            <div key={i} style={{ 
              background: 'var(--glass-bg)', backdropFilter: 'blur(10px)',
              borderRadius: '16px', boxShadow: 'var(--glass-shadow)', 
              border: 'var(--glass-border)', overflow: 'hidden' 
            }}>
              <div style={{ background: 'linear-gradient(90deg, rgba(238,242,255,0.8) 0%, rgba(255,255,255,0) 100%)', padding: '20px 24px', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#3730a3', fontWeight: 'bold' }}>{course.name}</h3>
                  <span style={{ display: 'inline-block', marginTop: '4px', fontSize: '0.85rem', color: 'var(--color-text)' }}>{course.code}</span>
                </div>
                <button onClick={async () => {
                  const formData = await window.toast.form('Buat Topik Diskusi Baru', [
                    { name: 'title', label: 'Judul Topik', type: 'text', autoFocus: true },
                    { name: 'content', label: 'Isi Diskusi', type: 'textarea' }
                  ]);
                  if (!formData || !formData.title || !formData.content) return;
                  
                  const { title, content } = formData;
                  const token = localStorage.getItem('siakad_token');
                  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
                  try {
                    const res = await fetch(`${apiUrl}/siakad/forum/${course.id}`, {
                      method: 'POST',
                      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                      body: JSON.stringify({ title, content })
                    });
                    if (res.ok) window.location.reload();
                    else window.toast('Gagal membuat topik');
                  } catch (err) { window.toast('Error: ' + err.message); }
                }} style={{ background: '#4f46e5', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 10px rgba(79, 70, 229, 0.3)' }}>
                  <i className="ph ph-plus"></i> Buat Topik Baru
                </button>
              </div>
              
              <div style={{ padding: '24px' }}>
                {course.forums && course.forums.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {course.forums.map((forum, j) => (
                      <div key={j} style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                          <div style={{ width: '40px', height: '40px', background: 'rgba(99, 102, 241, 0.1)', color: '#4f46e5', border: '1px solid rgba(99, 102, 241, 0.3)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                            D
                          </div>
                          <div>
                            <strong style={{ display: 'block', color: 'var(--color-text)' }}>{forum.title}</strong>
                            <span style={{ fontSize: '0.75rem', color: 'var(--color-muted)' }}>Diposting oleh Dosen</span>
                          </div>
                        </div>
                        <p style={{ margin: '0 0 16px 0', color: 'var(--color-muted)', fontSize: '0.95rem', lineHeight: '1.5' }}>
                          {forum.content}
                        </p>
                        
                        {/* Replies */}
                        <div style={{ background: 'var(--color-bg)', borderRadius: '8px', padding: '16px', borderLeft: '4px solid #6366f1' }}>
                          <h4 style={{ fontSize: '0.85rem', color: 'var(--color-muted)', margin: '0 0 12px 0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Balasan ({forum.replies?.length || 0})</h4>
                          {forum.replies && forum.replies.map((reply, k) => (
                            <div key={k} style={{ marginBottom: k === forum.replies.length - 1 ? 0 : '12px', paddingBottom: k === forum.replies.length - 1 ? 0 : '12px', borderBottom: k === forum.replies.length - 1 ? 'none' : '1px solid #e5e7eb' }}>
                              <strong style={{ fontSize: '0.85rem', color: 'var(--color-text)', display: 'block' }}>
                                {reply.user_id === data.user.id ? 'Anda' : (reply.user_id === course.dosen_id ? 'Dosen' : 'Mahasiswa Lain')}
                              </strong>
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
                            <input name="content" type="text" placeholder="Tulis balasan..." style={{ flex: 1, padding: '8px 12px', borderRadius: '6px', border: '1px solid #d1d5db', outline: 'none', fontSize: '0.9rem' }} />
                            <button type="submit" style={{ background: '#4f46e5', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Kirim</button>
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
        })}
      </div>
    </div>
  );
}
