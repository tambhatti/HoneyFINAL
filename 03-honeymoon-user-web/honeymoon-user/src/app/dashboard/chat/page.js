'use client';
import api from '../../../lib/api';
mport { useState, useEffect, useRef, useCallback } from 'react';
import { useUserAuth } from '../../../context/auth';
import UserService from '../../../lib/services/user.service';



function formatTime(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleTimeString('en-AE', { hour: '2-digit', minute: '2-digit' });
}

function Avatar({ name, avatar, size = 'md' }) {
  const sz = size === 'sm' ? 'w-8 h-8 text-xs' : 'w-10 h-10 text-sm';
  if (avatar) return <img src={avatar} alt={name} className={`${sz} rounded-full object-cover shrink-0`} />;
  const initials = (name || 'U').split(' ').map(w => w[0]).slice(0,2).join('').toUpperCase();
  return (
    <div className={`${sz} rounded-full bg-[#174a37] text-[#CFB383] font-semibold flex items-center justify-center shrink-0`}>
      {initials}
    </div>
  );
}

export default function ChatPage() {
  const { user, token } = useUserAuth();
  const [conversations, setConversations] = useState([]);
  const [activeConv,    setActiveConv]    = useState(null);
  const [messages,      setMessages]      = useState([]);
  const [newMsg,        setNewMsg]        = useState('');
  const [sending,       setSending]       = useState(false);
  const [loadingConvs,  setLoadingConvs]  = useState(true);
  const [loadingMsgs,   setLoadingMsgs]   = useState(false);
  const messagesEndRef = useRef(null);



  const loadConversations = useCallback(async () => {
    try {
      const d = await api.get('/chat/conversations');
      setConversations(d.data || []);
    } catch (e) { console.error('Load conversations error:', e); }
    finally { setLoadingConvs(false); }
  }, []);

  const loadMessages = useCallback(async (convId) => {
    setLoadingMsgs(true);
    try {
      const d = await api.getQ('/chat/conversations/' + convId + '/messages', { limit: 100 });
      setMessages(d.data || []);
    } catch (e) { console.error('Load messages error:', e); }
    finally { setLoadingMsgs(false); }
  }, []);

  useEffect(() => { loadConversations(); }, [loadConversations]);
  useEffect(() => { if (activeConv) loadMessages(activeConv.id); }, [activeConv, loadMessages]);
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const handleSend = async () => {
    if (!newMsg.trim() || !activeConv || sending) return;
    setSending(true);
    const optimistic = { id: `tmp-${Date.now()}`, body: newMsg.trim(), senderRole: 'user', createdAt: new Date().toISOString(), isRead: false };
    setMessages(prev => [...prev, optimistic]);
    setNewMsg('');
    try {
      const d = await api.post('/chat/conversations/' + activeConv.id + '/messages', { body: newMsg.trim() });
      if (d.message) {
        setMessages(prev => prev.map(m => m.id === optimistic.id ? d.message : m));
        setConversations(prev => prev.map(c => c.id === activeConv.id ? { ...c, lastMessage: d.message.body, lastMessageAt: d.message.createdAt } : c));
      }
    } catch (e) {
      setMessages(prev => prev.filter(m => m.id !== optimistic.id));
      setNewMsg(optimistic.body);
    } finally { setSending(false); }
  };

  const handleKeyDown = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } };

  return (
    <div className="h-[calc(100vh-70px)] flex overflow-hidden">
      {/* Sidebar */}
      <div className={`w-full sm:w-80 border-r border-[rgba(184,154,105,0.15)] flex flex-col shrink-0 ${activeConv ? 'hidden sm:flex' : 'flex'}`}>
        <div className="p-4 border-b border-[rgba(184,154,105,0.1)]">
          <h2 className="font-baskerville text-lg text-[#1a1a1a]">Messages</h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          {loadingConvs ? (
            <div className="p-6 text-center text-black/30 text-sm">Loading conversations…</div>
          ) : conversations.length === 0 ? (
            <div className="p-6 text-center text-black/30 text-sm">No conversations yet. Start by contacting a vendor.</div>
          ) : conversations.map(conv => {
            const other = conv.vendor;
            const unread = conv.userUnread || 0;
            return (
              <button key={conv.id} type="button" onClick={() => setActiveConv(conv)}
                className={`w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-[#faf8f4] transition-colors border-b border-[rgba(184,154,105,0.08)] ${activeConv?.id === conv.id ? 'bg-[#f5f0e8]' : ''}`}>
                <Avatar name={other?.companyName} avatar={other?.avatar} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-sm font-semibold text-[#1a1a1a] truncate">{other?.companyName || 'Vendor'}</span>
                    <span className="text-xs text-black/30 shrink-0">{formatTime(conv.lastMessageAt)}</span>
                  </div>
                  <p className="text-xs text-black/40 truncate mt-0.5">{conv.lastMessage || 'No messages yet'}</p>
                </div>
                {unread > 0 && (
                  <span className="w-5 h-5 rounded-full bg-[#174a37] text-white text-[10px] font-bold flex items-center justify-center shrink-0">{unread}</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Chat area */}
      {activeConv ? (
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <div className="px-4 py-3 border-b border-[rgba(184,154,105,0.15)] flex items-center gap-3 shrink-0">
            <button type="button" onClick={() => setActiveConv(null)} className="sm:hidden text-black/40 hover:text-black mr-1">←</button>
            <Avatar name={activeConv.vendor?.companyName} avatar={activeConv.vendor?.avatar} />
            <div>
              <p className="text-sm font-semibold text-[#1a1a1a]">{activeConv.vendor?.companyName}</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
            {loadingMsgs ? (
              <div className="text-center text-black/30 text-sm py-8">Loading messages…</div>
            ) : messages.length === 0 ? (
              <div className="text-center text-black/30 text-sm py-8">No messages yet. Say hello!</div>
            ) : messages.map(msg => {
              const isUser = msg.senderRole === 'user';
              return (
                <div key={msg.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'} gap-2`}>
                  {!isUser && <Avatar name={activeConv.vendor?.companyName} avatar={activeConv.vendor?.avatar} size="sm" />}
                  <div className={`max-w-[70%] rounded-2xl px-4 py-2.5 text-sm ${isUser ? 'bg-[#174a37] text-white rounded-br-sm' : 'bg-white text-[#1a1a1a] border border-[rgba(184,154,105,0.2)] rounded-bl-sm'}`}>
                    <p className="leading-relaxed">{msg.body}</p>
                    <p className={`text-[10px] mt-1 ${isUser ? 'text-white/50 text-right' : 'text-black/30'}`}>{formatTime(msg.createdAt)}</p>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-[rgba(184,154,105,0.15)] shrink-0">
            <div className="flex gap-2 items-end bg-white border border-[rgba(184,154,105,0.3)] rounded-2xl px-4 py-2">
              <textarea value={newMsg} onChange={e => setNewMsg(e.target.value)} onKeyDown={handleKeyDown}
                rows={1} placeholder="Type a message…"
                className="flex-1 bg-transparent text-sm text-[#1a1a1a] outline-none resize-none leading-6 max-h-28 placeholder-black/30" />
              <button type="button" onClick={handleSend} disabled={!newMsg.trim() || sending}
                className="w-9 h-9 bg-[#174a37] rounded-xl flex items-center justify-center text-white hover:bg-[#1a5c45] transition-colors disabled:opacity-40 shrink-0">
                {sending ? '…' : '↑'}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="hidden sm:flex flex-1 items-center justify-center text-center px-6">
          <div>
            <div className="text-5xl mb-4 opacity-20">💬</div>
            <p className="text-black/30 text-sm">Select a conversation to start chatting</p>
          </div>
        </div>
      )}
    </div>
  );
}
