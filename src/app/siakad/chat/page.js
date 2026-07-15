"use client";
import { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import ModalShell from '../components/ModalShell';

export default function ChatPage() {
  const router = useRouter();
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');
  const [creatingRoom, setCreatingRoom] = useState(false);
  const [wsConnected, setWsConnected] = useState(false);
  const messagesEndRef = useRef(null);
  const wsRef = useRef(null);
  const [currentUserId, setCurrentUserId] = useState(null);

  const getApiUrl = () => {
    if (process.env.NEXT_PUBLIC_API_URL) {
      // If it's a relative path like /api, we should use host dynamically on client side
      if (process.env.NEXT_PUBLIC_API_URL.startsWith('/')) {
        if (typeof window !== 'undefined') {
          return `${window.location.protocol}//${window.location.host}${process.env.NEXT_PUBLIC_API_URL}`;
        }
      }
      return process.env.NEXT_PUBLIC_API_URL;
    }
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
        return `${window.location.protocol}//${window.location.host}/api`;
      }
    }
    return 'http://127.0.0.1:8000/api';
  };

  const apiUrl = getApiUrl();
  
  const getWsUrl = () => {
    if (typeof window === 'undefined') return 'ws://localhost:8080/app/chat';
    if (process.env.NEXT_PUBLIC_WS_URL) return process.env.NEXT_PUBLIC_WS_URL;
    try {
      // If the apiUrl is relative, resolve it to current host
      let absoluteApiUrl = apiUrl;
      if (apiUrl.startsWith('/')) {
        absoluteApiUrl = `${window.location.protocol}//${window.location.host}${apiUrl}`;
      }
      const url = new URL(absoluteApiUrl);
      const wsProto = url.protocol === 'https:' ? 'wss:' : 'ws:';
      
      // Laravel Reverb default port is 8080 (or 6001). Connect to hostname with port 8080
      return `${wsProto}//${url.hostname}:8080/app/chat`;
    } catch (e) {
      return 'ws://localhost:8080/app/chat';
    }
  };

  const wsUrl = getWsUrl();

  const getToken = () => localStorage.getItem('siakad_token');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const token = getToken();
    if (!token) { router.push('/siakad/login'); return; }
    try {
      const userStr = localStorage.getItem('siakad_user');
      if (userStr) { const u = JSON.parse(userStr); setCurrentUserId(u.id); }
    } catch(e) {}
    fetchRooms();
  }, [router]);

  // Smart Polling (Short Polling Pintar)
  useEffect(() => {
    const token = getToken();
    if (!token) return;

    let intervalId = null;
    let isTabVisible = true;
    let isTypingActive = true;

    // Monitor tab visibility to stop polling when user minimizes or leaves the page
    const handleVisibilityChange = () => {
      isTabVisible = !document.hidden;
      restartPolling();
    };

    const runPoll = async () => {
      if (!isTabVisible) return;
      
      // Update room list
      await fetchRooms();

      // Update messages if a room is active
      if (selectedRoomRef.current) {
        await fetchMessages(selectedRoomRef.current.id);
      }
    };

    const restartPolling = () => {
      if (intervalId) clearInterval(intervalId);
      if (!isTabVisible) return;

      setWsConnected(true); // Keep green active dot in UI
      const delay = isTypingActive ? 3000 : 10000;
      intervalId = setInterval(runPoll, delay);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    restartPolling();

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

  const selectedRoomRef = useRef(selectedRoom);
  useEffect(() => {
    selectedRoomRef.current = selectedRoom;
  }, [selectedRoom]);

  useEffect(() => {
    if (!searchQuery) { setFilteredRooms(Array.isArray(rooms) ? rooms : []); return; }
    setFilteredRooms((Array.isArray(rooms) ? rooms : []).filter(r => r.name?.toLowerCase().includes(searchQuery.toLowerCase())));
  }, [searchQuery, rooms]);

  const fetchRooms = async () => {
    try {
      const res = await fetch(`${apiUrl}/siakad/chat/rooms`, {
        headers: { 
          'Authorization': `Bearer ${getToken()}`,
          'Accept': 'application/json'
        }
      });
      if (!res.ok) throw new Error('Failed');
      const data = await res.json();
      setRooms(Array.isArray(data) ? data : (data.data || data.rooms || []));
    } catch(e) { console.error(e); } finally { setLoading(false); }
  };

  const fetchMessages = async (roomId) => {
    try {
      const res = await fetch(`${apiUrl}/siakad/chat/rooms/${roomId}`, {
        headers: { 
          'Authorization': `Bearer ${getToken()}`,
          'Accept': 'application/json'
        }
      });
      if (!res.ok) throw new Error('Failed');
      const data = await res.json();
      const msgArray = Array.isArray(data) ? data : (data.messages?.data || data.messages || data.data || []);
      setMessages(msgArray);
    } catch(e) { console.error(e); }
  };

  const selectRoom = (room) => {
    setSelectedRoom(room);
    fetchMessages(room.id);
    setRooms(prev => prev.map(r => r.id === room.id ? { ...r, unread_count: 0 } : r));
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedRoom) return;
    setSendingMessage(true);
    const content = newMessage.trim();
    setNewMessage('');

    try {
      const res = await fetch(`${apiUrl}/siakad/chat/rooms/${selectedRoom.id}/messages`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${getToken()}`,
          'Accept': 'application/json'
        },
        body: JSON.stringify({ content })
      });
      const data = await res.json();
      if (data.data || data.message) {
        const msg = data.data || data.message;
        setMessages(prev => [...prev, msg]);
      }
      
      // Instant refresh right after sending to prevent lag feeling
      fetchRooms();
    } catch(e) { console.error(e); setNewMessage(content); } finally { setSendingMessage(false); }
  };

  const createRoom = async () => {
    if (!newRoomName.trim()) return;
    setCreatingRoom(true);
    try {
      const res = await fetch(`${apiUrl}/siakad/chat/rooms`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${getToken()}`,
          'Accept': 'application/json'
        },
        body: JSON.stringify({ name: newRoomName.trim() })
      });
      if (res.ok) { fetchRooms(); setShowCreateRoom(false); setNewRoomName(''); }
    } catch(e) { console.error(e); } finally { setCreatingRoom(false); }
  };

  const handleKeyPress = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } };

  const formatTime = (dateStr) => {
    if (!dateStr) return '';
    try { return new Date(dateStr).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }); } catch(e) { return ''; }
  };

  if (loading) return (
    <div style={{ padding: '24px' }}>
      <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--color-text)', margin: '0 0 24px 0' }}>Memuat Chat...</h1>
      <div className="siakad-card" style={{ padding: '24px', height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <i className="ph ph-spinner" style={{ fontSize: '2rem', color: 'var(--color-muted)', animation: 'pwaSpin 1s linear infinite' }}></i>
      </div>
    </div>
  );

  return (
    <div className="fade-in">
      <div className="siakad-page-header">
        <div className="siakad-page-header-glow"></div>
        <div className="siakad-page-header-grid"></div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{ color: 'var(--color-muted)', fontSize: '0.85rem', margin: '0 0 8px 0', letterSpacing: '0.1em', textTransform: 'uppercase' }}>SIAKAD — KOMUNIKASI</p>
          <h1 style={{ fontSize: '2.2rem', fontWeight: '800', margin: '0 0 8px 0', letterSpacing: '-0.03em' }}>Chat Real-Time</h1>
          <p style={{ color: 'var(--color-muted)', margin: 0 }}>Komunikasi langsung antar civitas akademika secara real-time.</p>
        </div>
        <div style={{ position: 'absolute', top: '20px', right: '24px', zIndex: 2, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: wsConnected ? '#10b981' : '#ef4444', boxShadow: `0 0 8px ${wsConnected ? '#10b981' : '#ef4444'}` }}></div>
          <span style={{ color: wsConnected ? '#10b981' : '#ef4444', fontSize: '0.85rem', fontWeight: 'bold' }}>{wsConnected ? 'Terhubung' : 'Terputus'}</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: '0', height: 'calc(100vh - 280px)', minHeight: '500px' }}>
        {/* Left Panel - Room List */}
        <div className="siakad-card" style={{ borderRadius: '16px 0 0 16px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ padding: '16px', borderBottom: '1px solid var(--color-border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--color-text)', flex: 1 }}>Percakapan</h3>
              <button id="btn-create-room" onClick={() => setShowCreateRoom(true)} style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)', color: 'white', border: 'none', width: '36px', height: '36px', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>
                <i className="ph ph-plus"></i>
              </button>
            </div>
            <div style={{ position: 'relative' }}>
              <i className="ph ph-magnifying-glass" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-muted)', fontSize: '1rem' }}></i>
              <input id="input-search-rooms" type="text" placeholder="Cari percakapan..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={{ width: '100%', padding: '10px 12px 10px 46px', fontSize: '0.9rem', boxSizing: 'border-box', color: 'var(--color-text)' }} />
            </div>
          </div>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {filteredRooms.length === 0 ? (
              <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--color-muted)' }}>
                <i className="ph ph-chats" style={{ fontSize: '3rem', marginBottom: '12px', display: 'block', opacity: 0.5 }}></i>
                <p style={{ margin: 0 }}>Belum ada percakapan</p>
              </div>
            ) : filteredRooms.map(room => (
              <div key={room.id} id={`room-${room.id}`} onClick={() => selectRoom(room)} style={{ padding: '14px 16px', cursor: 'pointer', borderBottom: '1px solid var(--color-border)', background: selectedRoom?.id === room.id ? 'rgba(59, 130, 246, 0.1)' : 'transparent', borderLeft: selectedRoom?.id === room.id ? '3px solid #3b82f6' : '3px solid transparent', transition: 'all 0.2s ease', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '1.1rem', flexShrink: 0 }}>
                  {(room.name || 'R').charAt(0).toUpperCase()}
                </div>
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: '600', color: 'var(--color-text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{room.name || `Room ${room.id}`}</h4>
                    <span style={{ fontSize: '0.7rem', color: 'var(--color-muted)', flexShrink: 0 }}>{formatTime(room.last_message?.created_at)}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--color-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', flex: 1 }}>
                      {room.last_message ? `${room.last_message.user ? `${room.last_message.user}: ` : ''}${room.last_message.content}` : 'Belum ada pesan'}
                    </p>
                    {room.unread_count > 0 && (
                      <span style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', color: 'white', borderRadius: '10px', padding: '2px 8px', fontSize: '0.7rem', fontWeight: 'bold', flexShrink: 0 }}>{room.unread_count}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel - Messages */}
        <div className="siakad-card" style={{ borderRadius: '0 16px 16px 0', display: 'flex', flexDirection: 'column', overflow: 'hidden', borderLeft: '1px solid var(--color-border)' }}>
          {!selectedRoom ? (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--color-muted)' }}>
              <i className="ph ph-chat-circle-dots" style={{ fontSize: '5rem', marginBottom: '16px', opacity: 0.3 }}></i>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '1.2rem', fontWeight: '600' }}>Pilih Percakapan</h3>
              <p style={{ margin: 0, fontSize: '0.9rem' }}>Pilih room di panel kiri untuk memulai chat</p>
            </div>
          ) : (
            <>
              {/* Chat Header */}
              <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>
                  {(selectedRoom.name || 'R').charAt(0).toUpperCase()}
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: '700', color: 'var(--color-text)' }}>{selectedRoom.name || `Room ${selectedRoom.id}`}</h3>
                  <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--color-muted)' }}>{selectedRoom.members_count || 0} anggota</p>
                </div>
              </div>

              {/* Messages Area */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {messages.length === 0 ? (
                  <div style={{ textAlign: 'center', color: 'var(--color-muted)', padding: '40px 0' }}>
                    <p>Belum ada pesan di room ini.</p>
                  </div>
                ) : messages.map((msg, idx) => {
                  const isSent = msg.user_id === currentUserId || msg.is_mine;
                  return (
                    <div key={msg.id || idx} style={{ display: 'flex', justifyContent: isSent ? 'flex-end' : 'flex-start', marginBottom: '4px' }}>
                      <div style={{ maxWidth: '70%', padding: '10px 14px', borderRadius: isSent ? '16px 16px 4px 16px' : '16px 16px 16px 4px', background: isSent ? 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)' : 'var(--color-surface)', color: isSent ? 'white' : 'var(--color-text)', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                        {!isSent && <p style={{ margin: '0 0 4px 0', fontSize: '0.75rem', fontWeight: '700', color: '#3b82f6' }}>{msg.user_name || msg.sender_name || 'User'}</p>}
                        <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: '1.4', wordBreak: 'break-word' }}>{msg.content}</p>
                        <p style={{ margin: '4px 0 0 0', fontSize: '0.68rem', opacity: 0.7, textAlign: 'right' }}>{formatTime(msg.created_at)}</p>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div style={{ padding: '14px 20px', borderTop: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <input id="input-message" type="text" placeholder="Ketik pesan..." value={newMessage} onChange={e => setNewMessage(e.target.value)} onKeyDown={handleKeyPress} style={{ flex: 1, padding: '12px 16px', fontSize: '0.9rem', color: 'var(--color-text)' }} />
                <button id="btn-send-message" onClick={sendMessage} disabled={sendingMessage || !newMessage.trim()} style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)', color: 'white', border: 'none', width: '44px', height: '44px', borderRadius: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', opacity: (!newMessage.trim() || sendingMessage) ? 0.5 : 1, transition: 'opacity 0.2s ease' }}>
                  <i className={sendingMessage ? "ph ph-spinner" : "ph ph-paper-plane-tilt"} style={sendingMessage ? { animation: 'pwaSpin 1s linear infinite' } : {}}></i>
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Create Room Modal */}
      {showCreateRoom && (
        <ModalShell
          title="Buat Percakapan Baru"
          subtitle="Real-Time Chat"
          icon="ph-chat-circle-dots"
          onClose={() => setShowCreateRoom(false)}
          maxWidth="440px"
          footer={
            <>
              <button id="btn-cancel-room" onClick={() => setShowCreateRoom(false)} className="btn" style={{ padding: '10px 20px', border: 'none', color: 'var(--color-text)', cursor: 'pointer', fontWeight: '600', transition: 'all 0.2s' }}>Batal</button>
              <button id="btn-confirm-create-room" onClick={createRoom} disabled={creatingRoom || !newRoomName.trim()} className="siakad-btn-primary" style={{ padding: '10px 24px' }}>
                {creatingRoom ? 'Membuat...' : 'Buat Room'}
              </button>
            </>
          }
        >
          <div style={{ marginBottom: '8px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--color-muted)', fontWeight: '600' }}>Nama Ruang Obrolan</label>
            <input id="input-room-name" type="text" value={newRoomName} onChange={e => setNewRoomName(e.target.value)} placeholder="Masukkan nama room..." style={{ width: '100%', padding: '12px 16px', fontSize: '0.9rem', boxSizing: 'border-box', color: 'var(--color-text)' }} />
          </div>
        </ModalShell>
      )}
    </div>
  );
}
