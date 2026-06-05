import ReactMarkdown from 'react-markdown';
import { ArrowLeft, Square, CornerDownLeft, Copy, Check } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

const GLASS_LIGHT = 'rgba(75, 75, 75, 0.6)';
const GLASS_DARK = 'rgba(12, 12, 12, 0.95)';

function CodeBlock({ children, className }: { children?: React.ReactNode; className?: string }) {
  const [copied, setCopied] = useState(false);
  const code = String(children).replace(/\n$/, '');
  const isBlock = className?.startsWith('language-');

  if (!isBlock) return <code className={className}>{children}</code>;

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative">
      <button
        type="button"
        aria-label="Copy code"
        onClick={handleCopy}
        className="absolute right-2 top-2 rounded p-1 text-white/40 transition-colors hover:bg-white/10 hover:text-white/70"
      >
        {copied ? <Check className="size-3" /> : <Copy className="size-3" />}
      </button>
      <code className={className}>{children}</code>
    </div>
  );
}

interface ChatWindowProps {
  expanded: boolean;
  showBack?: boolean;
  onExpand: () => void;
  onCollapse: () => void;
  captureScreenEnabled: boolean;
}

export default function ChatWindow({ expanded, showBack, onExpand, onCollapse, captureScreenEnabled }: ChatWindowProps) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; text: string; screenViewed?: boolean }[]>([]);
  const [waitingForResponse, setWaitingForResponse] = useState(false);
  const [newMsgIndex, setNewMsgIndex] = useState<number | null>(null);
  const newUserMsgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (newMsgIndex === null || !newUserMsgRef.current) return;
    newUserMsgRef.current.scrollIntoView({ block: 'start', behavior: 'smooth' });
  }, [newMsgIndex]);

  useEffect(() => {
    if (!expanded) {
      setMessages([]);
      setNewMsgIndex(null);
    }
  }, [expanded]);

  const handleSubmit = async () => {
    if (!message.trim() || waitingForResponse) return;

    const captureScreen = captureScreenEnabled;
    const history = messages;

    setNewMsgIndex(messages.length);
    setMessages((prev) => [...prev, { role: 'user', text: message }]);
    setMessage('');
    setWaitingForResponse(true);

    if (!expanded) onExpand();

    const words = (await window.api.postMessage(message, captureScreen, history)).split(' ');
    let i = 0;
    setMessages(prev => [...prev, { role: 'assistant', text: '', screenViewed: captureScreen }]);
    const interval = setInterval(() => {
      i++;
      setMessages(prev => { const u = [...prev]; u[u.length - 1] = { ...u[u.length - 1], text: words.slice(0, i).join(' ') }; return u; });
      if (i >= words.length) {
        clearInterval(interval);
        setWaitingForResponse(false);
      }
    }, 50);
  };

  return (
    <>
      {/* Input bar */}
      <div className="flex items-center gap-3 px-5 py-2.5 backdrop-blur-2xl shrink-0" style={{ background: GLASS_LIGHT }}>
        {(expanded || showBack) && (
          <button type="button" aria-label="Back" onClick={onCollapse}
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
          className={`flex-1 bg-transparent text-white/90 placeholder:text-white/70 text-[15px] focus:outline-none ${waitingForResponse ? 'opacity-50' : ''}`}
          readOnly={waitingForResponse}
        />
        <button type="button" aria-label={expanded ? 'Stop' : 'Submit'} onClick={expanded ? undefined : handleSubmit}
          className="flex items-center justify-center rounded-lg bg-white/20 p-2.5 text-white/80 transition-colors hover:bg-white/30">
          {waitingForResponse ? <Square className="size-4" /> : <CornerDownLeft className="size-4" />}
        </button>
      </div>

      {/* Response area */}
      {expanded && (
        <div className="interactive flex-1 overflow-y-auto px-5 py-4 backdrop-blur-2xl" style={{ background: GLASS_DARK }}>
          {messages.map((msg, i) => (
            <div key={i} ref={msg.role === 'user' && i === newMsgIndex ? newUserMsgRef : null} className={`mb-4 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
              {msg.role === 'user' ? (
                <span className="inline-block rounded-2xl bg-white/10 px-4 py-2 text-[14px] text-white/70">{msg.text}</span>
              ) : (
                <div>
                  {msg.screenViewed && (
                    <p className="mb-1 text-[11px] text-white/35">Viewed Screen</p>
                  )}
                  <div className="prose prose-invert prose-sm max-w-none prose-p:my-1 prose-li:my-0 prose-headings:my-2 prose-headings:text-white/90 prose-p:text-white/90 prose-li:text-white/90 prose-strong:text-white prose-code:text-white/80">
                    <ReactMarkdown components={{ code: CodeBlock }}>{msg.text}</ReactMarkdown>
                  </div>
                </div>
              )}
            </div>
          ))}

          {waitingForResponse && messages[messages.length - 1]?.role !== 'assistant' && (
            <div className="mb-4 text-left">
              <span className="inline-block size-3 rounded-full bg-white/50 animate-pulse" />
            </div>
          )}

          <div className="h-[268px]" />
        </div>
      )}
    </>
  );
}
