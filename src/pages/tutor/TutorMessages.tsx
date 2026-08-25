import { useState } from 'react';
import { DashboardShell } from '@/components/Sidebar';
import { PageHeader } from '@/components/ui';
import { useChat } from '@/chat/ChatContext';
import { Search, Send, Phone, Video, MoreVertical, ArrowLeft, MessageCircle } from 'lucide-react';

export function TutorMessages() {
  const { threads, sendMessage, markRead } = useChat();
  const [activeId, setActiveId] = useState('');
  const [input, setInput] = useState('');

  const active = threads.find((t) => t.id === activeId);

  const openThread = (id: string) => {
    setActiveId(id);
    markRead(id);
  };

  const send = () => {
    if (!input.trim() || !activeId) return;
    sendMessage(activeId, input);
    setInput('');
  };

  return (
    <DashboardShell role="tutor">
      <PageHeader title="Messages" subtitle="Communicate with your students." />
      <div className="card overflow-hidden h-[calc(100vh-180px)] flex">
        <div className={`w-full sm:w-80 border-r border-slate-200 flex flex-col ${activeId ? 'hidden sm:flex' : 'flex'}`}>
          <div className="p-3 border-b border-slate-100">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input className="input pl-9 py-2 text-sm" placeholder="Search students..." />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {threads.length === 0 ? (
              <div className="p-8 text-center text-sm text-slate-400">
                <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                No conversations yet.
              </div>
            ) : (
              threads.map((t) => (
                <button
                  key={t.id}
                  onClick={() => openThread(t.id)}
                  className={`w-full flex items-center gap-3 p-3 text-left border-b border-slate-50 transition-colors ${activeId === t.id ? 'bg-brand-50' : 'hover:bg-slate-50'}`}
                >
                  <div className="relative shrink-0">
                    <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-full bg-slate-100" />
                    {t.online && <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-brand-500 border-2 border-white" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-slate-900 truncate">{t.name}</p>
                      <span className="text-xs text-slate-400 shrink-0">{t.lastTime}</span>
                    </div>
                    <p className="text-sm text-slate-500 truncate">{t.lastMessage}</p>
                  </div>
                  {t.unread > 0 && <span className="w-5 h-5 rounded-full bg-brand-600 text-white text-xs flex items-center justify-center shrink-0">{t.unread}</span>}
                </button>
              ))
            )}
          </div>
        </div>

        <div className={`flex-1 flex flex-col ${activeId ? 'flex' : 'hidden sm:flex'}`}>
          {active ? (
            <>
              <div className="flex items-center gap-3 p-4 border-b border-slate-100">
                <button onClick={() => setActiveId('')} className="sm:hidden text-slate-500"><ArrowLeft className="w-5 h-5" /></button>
                <div className="relative">
                  <img src={active.avatar} alt={active.name} className="w-10 h-10 rounded-full bg-slate-100" />
                  {active.online && <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-brand-500 border-2 border-white" />}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-slate-900">{active.name}</p>
                  <p className="text-xs text-slate-500">{active.online ? 'Online now' : 'Offline'}</p>
                </div>
                <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg"><Phone className="w-5 h-5" /></button>
                <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg"><Video className="w-5 h-5" /></button>
                <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg"><MoreVertical className="w-5 h-5" /></button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
                {active.messages.map((m) => (
                  <div key={m.id} className={`flex ${m.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm ${m.sender === 'me' ? 'bg-brand-600 text-white rounded-br-sm' : 'bg-white border border-slate-200 text-slate-700 rounded-bl-sm'}`}>
                      <p>{m.text}</p>
                      <p className={`text-xs mt-1 ${m.sender === 'me' ? 'text-brand-100' : 'text-slate-400'}`}>{m.time}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 border-t border-slate-100 flex gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && send()}
                  className="input flex-1"
                  placeholder="Type a message..."
                />
                <button onClick={send} className="btn-primary px-4"><Send className="w-4 h-4" /></button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-400">
              <div className="text-center">
                <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-40" />
                <p className="text-sm">Select a conversation to start chatting</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardShell>
  );
}
