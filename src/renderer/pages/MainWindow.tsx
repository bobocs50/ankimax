import { ArrowLeft, Square, CornerDownLeft, Settings, Sparkles, Paperclip, BookPlus, FolderCog, ChevronDown } from 'lucide-react';
import { IconButton } from '@/components/IconButton';
import { useState, useEffect, useRef } from 'react';

const GLASS_LIGHT = 'rgba(75, 75, 75, 0.6)';
const GLASS_DARK = 'rgba(12, 12, 12, 0.95)';

function ControlsBar({ borderTop = false }: { borderTop?: boolean }) {
  return (
    <div
      className={`flex items-center px-5 py-2.5 backdrop-blur-2xl ${borderTop ? 'border-t border-white/10' : ''}`}
      style={{ background: GLASS_DARK }}
    >
      <div className="w-20">
        <IconButton icon={Settings} label="Settings" />
      </div>

      <div className="flex flex-1 items-center justify-center gap-6">
        <IconButton icon={BookPlus} label="Create Flashcard" />
        <IconButton icon={Sparkles} label="Auto AI" />
        <IconButton icon={Paperclip} label="Context" />
        <div className="h-4 w-px bg-white/20" />
        <IconButton icon={FolderCog} label="Anki Deck" />
      </div>

      <div className="flex w-20 justify-end">
        <button
          type="button"
          className="flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[13px] text-white/60 transition-colors hover:bg-white/25"
          aria-label="History"
        >
          History
          <ChevronDown className="size-4" />
        </button>
      </div>
    </div>
  );
}

export default function MainWindow() {

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; text: string }[]>([]);
  const [expanded, setExpanded] = useState(false);
  const [waitingForResponse, setWaitingForResponse] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async () => {
    if (!message.trim() || waitingForResponse) return;

    // Add user message to chat, then clear input
    setMessages((prev) => [...prev, { role: 'user', text: message }]);
    setMessage('');
    setWaitingForResponse(true);

    // Expand window 
    if (!expanded) {
      setExpanded(true);
      window.api.expandWindow();
    }

    const words = (await window.api.postMessage(message)).split(' ');
    let i = 0;
    setMessages(prev => [...prev, { role: 'assistant', text: '' }]);
    const interval = setInterval(() => {
      i++;
      setMessages(prev => { const u = [...prev]; u[u.length - 1] = { role: 'assistant', text: words.slice(0, i).join(' ') }; return u; });
      if (i >= words.length) {
        clearInterval(interval);
        setWaitingForResponse(false);
      }
    }, 50);

    
  };

  // Back button — shrink window back to compact bar
  const handleCollapse = () => {
    setExpanded(false);
    window.api.collapseWindow();
  };

  return (
    <main className="h-screen w-screen">
      <div className={`draggable-area flex flex-col rounded-2xl overflow-hidden ${expanded ? 'h-full' : ''}`}>

        {/* Input bar */}
        <div className="flex items-center gap-3 px-5 py-2.5 backdrop-blur-2xl shrink-0" style={{ background: GLASS_LIGHT }}>
          {expanded && (
            <button type="button" aria-label="Back" onClick={handleCollapse}
              className="flex items-center justify-center rounded-lg p-2 text-white/70 transition-colors hover:bg-white/20 hover:text-white/90">
              <ArrowLeft className="size-4" />
            </button>
          )}
          <input
            type="text"
            placeholder={expanded ? 'Ask follow-up' : 'Ask anything about your screen'}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit(); }}
            readOnly={waitingForResponse}
            className={`flex-1 bg-transparent text-white/90 placeholder:text-white/70 text-[15px] focus:outline-none ${waitingForResponse ? 'opacity-50' : ''}`}
          />
          <button type="button" aria-label={expanded ? 'Stop' : 'Submit'} onClick={expanded ? undefined : handleSubmit}
            className="flex items-center justify-center rounded-lg bg-white/20 p-2.5 text-white/80 transition-colors hover:bg-white/30">
            {waitingForResponse ? <Square className="size-4" /> : <CornerDownLeft className="size-4" />}
          </button>
        </div>

        {/* Response area */}
        {expanded && (
          <div className="flex-1 overflow-y-auto px-5 py-4 backdrop-blur-2xl" style={{ background: GLASS_DARK }}>
            {messages.map((msg, i) => (
              <div key={i} className={`mb-4 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                {msg.role === 'user' ? (
                  <span className="inline-block rounded-2xl bg-white/10 px-4 py-2 text-[14px] text-white/70">{msg.text}</span>
                ) : (
                  <p className="text-[14px] leading-relaxed text-white/90">{msg.text}</p>
                )}
              </div>
            ))}
            {waitingForResponse && messages[messages.length - 1]?.role !== 'assistant' && (
              <div className="mb-4 text-left">
                <span className="inline-block size-3 rounded-full bg-white/50 animate-pulse" />
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        )}
        
         {/* Controls area */}
        <ControlsBar borderTop={expanded} />

      </div>
    </main>
  );
}
