"use client";
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function DosenBimbinganPage() {
  const router = useRouter();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loadingChat, setLoadingChat] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [sending, setSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const chatEndRef = useRef(null);

  const fetchStudents = async () => {
    const token = localStorage.getItem('siakad_token');
    if (!token) return router.push('/siakad/login');

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
      const res = await fetch(`${apiUrl}/siakad/dosen/consultations`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const result = await res.json();
        setStudents(result.students || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /* eslint-disable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */
  useEffect(() => {
    fetchStudents();
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const selectStudent = async (student) => {
    setSelectedStudent(student);
    setLoadingChat(true);
    setMessages([]);
    
    const token = localStorage.getItem('siakad_token');
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
      const res = await fetch(`${apiUrl}/siakad/dosen/consultations/${student.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const result = await res.json();
        setMessages(result.messages || []);
        // Refresh student list to update unread counts
        fetchStudents();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingChat(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageText.trim() || !selectedStudent || sending) return;

    setSending(true);
    const token = localStorage.getItem('siakad_token');
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
    
    try {
      const res = await fetch(`${apiUrl}/siakad/dosen/consultations`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          mahasiswa_id: selectedStudent.id,
          message: messageText.trim()
        })
      });

      if (res.ok) {
        const result = await res.json();
        setMessages((prev) => [...prev, result.data]);
        setMessageText('');
        // Refresh student preview message
        fetchStudents();
      } else {
        const err = await res.json();
        window.toast && window.toast('Gagal: ' + (err.message || 'Error'));
      }
    } catch (err) {
      console.error(err);
      window.toast && window.toast('Error: ' + err.message);
    } finally {
      setSending(false);
    }
  };

  const filteredStudents = students.filter(s =>
    (s.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (s.nim || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '12px', color: 'var(--color-muted)' }}>
      <i className="ph ph-spinner ph-spin" style={{ fontSize: '2rem' }}></i> Memuat daftar bimbingan...
    </div>
  );

  return (
    <div className="fade-in" style={{ paddingBottom: '20px', height: 'calc(100vh - 120px)', display: 'flex', flexDirection: 'column' }}>
      
      {/* Header */}
      <div style={{ marginBottom: '24px', flexShrink: 0 }}>
        <div className="siakad-page-header">
          <div className="siakad-page-header-glow"></div>
          <div className="siakad-page-header-grid"></div>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', margin: '0 0 8px 0', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: '600' }}>SIAKAD — DOSEN WALI</p>
            <h1 style={{ color: 'white', fontSize: '2.2rem', fontWeight: '900', margin: '0 0 8px 0', letterSpacing: '-0.03em' }}>Bimbingan Akademik</h1>
            <p style={{ color: 'rgba(255,255,255,0.6)', margin: 0 }}>Konsultasi & bimbingan dengan mahasiswa perwalian Anda.</p>
          </div>
        </div>
      </div>

      {/* Main chat layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '350px 1fr', gap: '24px', flex: 1, minHeight: 0 }}>
        
        {/* Left Pane: Student List */}
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0, padding: 0, background: 'var(--glass-bg)', border: 'var(--glass-border)', boxShadow: 'var(--glass-shadow)', borderRadius: '24px' }}>
          
          {/* List Header & Search */}
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--color-border)', flexShrink: 0 }}>
            <h3 style={{ margin: '0 0 12px 0', color: 'var(--color-text)', fontSize: '1rem', fontWeight: 'bold' }}>Mahasiswa Bimbingan</h3>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                className="siakad-input"
                placeholder="Cari nama atau NIM..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px 10px 46px',
                  borderRadius: '50px',
                  border: 'var(--inset-border)',
                  background: 'var(--liquid-bg)',
                  color: 'var(--color-text)',
                  outline: 'none',
                  fontSize: '0.9rem',
                  boxShadow: 'inset 3px 3px 6px var(--inset-shadow-dark), inset -3px -3px 6px var(--inset-shadow-light)'
                }}
              />
              <i className="ph ph-magnifying-glass" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-muted)' }}></i>
            </div>
          </div>

          {/* Scrollable list */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '12px' }}>
            {filteredStudents.length > 0 ? filteredStudents.map((student) => {
              const isSelected = selectedStudent?.id === student.id;
              return (
                <div
                  key={student.id}
                  onClick={() => selectStudent(student)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '14px 16px',
                    borderRadius: '16px',
                    cursor: 'pointer',
                    background: 'var(--glass-bg)',
                    border: isSelected ? '1.5px solid var(--apple-blue)' : 'var(--glass-border)',
                    boxShadow: isSelected ? 'inset 3px 3px 6px var(--inset-shadow-dark), inset -3px -3px 6px var(--inset-shadow-light)' : 'var(--glass-shadow)',
                    transition: 'all 0.2s',
                    marginBottom: '10px'
                  }}
                >
                  {/* Initials avatar */}
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: 'var(--glass-bg)',
                    border: 'var(--glass-border)',
                    boxShadow: 'inset 2px 2px 5px var(--inset-shadow-dark), inset -2px -2px 5px var(--inset-shadow-light)',
                    color: isSelected ? 'var(--apple-blue)' : 'var(--color-text)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    fontSize: '0.95rem',
                    flexShrink: 0
                  }}>
                    {(student.name || '-').split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase()}
                  </div>

                  {/* Details */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '4px' }}>
                      <h4 style={{ margin: 0, color: 'var(--color-text)', fontSize: '0.9rem', fontWeight: 'bold', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {student.name}
                      </h4>
                      {student.unread_count > 0 && (
                        <span style={{
                          background: 'var(--apple-blue)',
                          color: 'white',
                          borderRadius: '999px',
                          padding: '2px 6px',
                          fontSize: '0.7rem',
                          fontWeight: '800',
                          flexShrink: 0
                        }}>
                          {student.unread_count}
                        </span>
                      )}
                    </div>
                    <p style={{ margin: '2px 0 0 0', color: 'var(--color-muted)', fontSize: '0.75rem' }}>NIM. {student.nim}</p>
                    {student.latest_message && (
                      <p style={{
                        margin: '6px 0 0 0',
                        color: 'var(--color-muted)',
                        fontSize: '0.8rem',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {student.latest_message}
                      </p>
                    )}
                  </div>
                </div>
              );
            }) : (
              <div style={{ padding: '24px', textAlign: 'center', color: 'var(--color-muted)' }}>
                <i className="ph ph-users-three" style={{ fontSize: '1.8rem', opacity: 0.5, marginBottom: '8px' }}></i>
                <p style={{ margin: 0, fontSize: '0.85rem' }}>Tidak ada mahasiswa bimbingan.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Pane: Chat Area */}
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0, padding: 0, background: 'var(--glass-bg)', border: 'var(--glass-border)', boxShadow: 'var(--glass-shadow)', borderRadius: '24px' }}>
          {selectedStudent ? (
            <>
              {/* Chat Header */}
              <div style={{
                padding: '16px 24px',
                borderBottom: '1px solid var(--color-border)',
                background: 'var(--glass-bg)',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                flexShrink: 0
              }}>
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  background: 'var(--glass-bg)',
                  border: 'var(--glass-border)',
                  boxShadow: 'inset 2px 2px 5px var(--inset-shadow-dark), inset -2px -2px 5px var(--inset-shadow-light)',
                  color: 'var(--apple-blue)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  fontSize: '1rem'
                }}>
                  {(selectedStudent.name || '-').split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase()}
                </div>
                <div>
                  <h3 style={{ margin: 0, color: 'var(--color-text)', fontSize: '1.05rem', fontWeight: 'bold' }}>{selectedStudent.name}</h3>
                  <p style={{ margin: 0, color: 'var(--color-muted)', fontSize: '0.8rem' }}>NIM. {selectedStudent.nim} • {selectedStudent.prodi}</p>
                </div>
              </div>

              {/* Chat Messages */}
              <div style={{ flex: 1, padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {loadingChat ? (
                  <div style={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center', color: 'var(--color-muted)', gap: '8px' }}>
                    <i className="ph ph-spinner ph-spin" style={{ fontSize: '1.5rem' }}></i> Memuat pesan...
                  </div>
                ) : messages.length > 0 ? (
                  messages.map((chat, i) => {
                    const isFromMe = chat.sender === 'dosen';
                    return (
                      <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: isFromMe ? 'flex-end' : 'flex-start' }}>
                        <div style={{
                          background: isFromMe ? 'linear-gradient(135deg, #C41E3A 0%, #9b1c2e 100%)' : 'var(--glass-bg)',
                          color: isFromMe ? 'white' : 'var(--color-text)',
                          padding: '12px 16px',
                          borderRadius: '12px',
                          maxWidth: '70%',
                          border: isFromMe ? 'none' : 'var(--glass-border)',
                          boxShadow: isFromMe ? 'var(--glass-shadow)' : 'inset 2px 2px 5px var(--inset-shadow-dark), inset -2px -2px 5px var(--inset-shadow-light)',
                          wordBreak: 'break-word'
                        }}>
                          {chat.text}
                        </div>
                        <span style={{ fontSize: '0.72rem', color: 'var(--color-muted)', marginTop: '4px' }}>{chat.time}</span>
                      </div>
                    );
                  })
                ) : (
                  <div style={{ display: 'flex', flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--color-muted)', gap: '8px' }}>
                    <i className="ph ph-chats" style={{ fontSize: '2rem', opacity: 0.5 }}></i>
                    <p style={{ margin: 0, fontWeight: '600', fontSize: '0.9rem' }}>Belum ada riwayat bimbingan.</p>
                    <p style={{ margin: 0, fontSize: '0.8rem' }}>Kirim pesan pembuka untuk memulai konsultasi akademik.</p>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSendMessage} style={{
                padding: '16px 24px',
                borderTop: '1px solid var(--color-border)',
                background: 'var(--glass-bg)',
                display: 'flex',
                gap: '12px',
                alignItems: 'center',
                flexShrink: 0
              }}>
                <input
                  type="text"
                  placeholder="Ketik pesan bimbingan..."
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  disabled={sending}
                  style={{
                    flex: 1,
                    padding: '12px 20px',
                    borderRadius: '50px',
                    border: 'var(--inset-border)',
                    background: 'var(--liquid-bg)',
                    color: 'var(--color-text)',
                    outline: 'none',
                    fontSize: '0.92rem',
                    boxShadow: 'inset 3px 3px 6px var(--inset-shadow-dark), inset -3px -3px 6px var(--inset-shadow-light)'
                  }}
                />
                <button
                  type="submit"
                  disabled={!messageText.trim() || sending}
                  style={{
                    padding: '12px 24px',
                    borderRadius: '50px',
                    background: 'linear-gradient(135deg, #C41E3A 0%, #9b1c2e 100%)',
                    color: 'white',
                    border: 'none',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: (!messageText.trim() || sending) ? 'none' : 'var(--glass-shadow)',
                    opacity: (!messageText.trim() || sending) ? 0.6 : 1,
                    transition: 'all 0.2s'
                  }}
                >
                  {sending ? (
                    <i className="ph ph-spinner ph-spin"></i>
                  ) : (
                    <>
                      Kirim <i className="ph ph-paper-plane-tilt"></i>
                    </>
                  )}
                </button>
              </form>
            </>
          ) : (
            <div style={{ display: 'flex', flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--color-muted)', gap: '16px', padding: '40px', textAlign: 'center' }}>
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: 'var(--glass-bg)',
                border: 'var(--glass-border)',
                boxShadow: 'inset 3px 3px 6px var(--inset-shadow-dark), inset -3px -3px 6px var(--inset-shadow-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--apple-blue)'
              }}>
                <i className="ph ph-chats-teardrop" style={{ fontSize: '3rem' }}></i>
              </div>
              <div>
                <h3 style={{ margin: '0 0 6px 0', color: 'var(--color-text)', fontSize: '1.2rem', fontWeight: 'bold' }}>Ruang Bimbingan Akademik</h3>
                <p style={{ margin: 0, fontSize: '0.9rem', maxWidth: '380px' }}>Pilih salah satu mahasiswa bimbingan di panel sebelah kiri untuk memantau konsultasi akademik atau membalas pesan mereka.</p>
              </div>
            </div>
          )}
        </div>

      </div>

      <style jsx global>{`
        .student-item-hover:hover {
          background: var(--glass-bg) !important;
        }
      `}</style>
    </div>
  );
}
