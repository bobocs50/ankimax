import {
  ArrowLeft,
  Square,
  CornerDownLeft,
  Settings,
  Sparkles,
  Paperclip,
  BookPlus,
  FolderCog,
  ChevronDown,
} from 'lucide-react';
import { IconButton } from '@/components/IconButton';
import { useState } from 'react';

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
  const [expanded, setExpanded] = useState(false);

  const handleSubmit = () => {
    if (!message.trim()) return;
    window.api.postMessage(message);
    setMessage('');
    if (!expanded) {
      setExpanded(true);
      window.api.expandWindow();
    }
  };

  const handleCollapse = () => {
    setExpanded(false);
    window.api.collapseWindow();
  };

  return (
    <main className="h-screen w-screen">
      <div className={`draggable-area flex flex-col rounded-2xl overflow-hidden ${expanded ? 'h-full' : ''}`}>

        <div
          className="flex items-center gap-3 px-5 py-2.5 backdrop-blur-2xl shrink-0"
          style={{ background: GLASS_LIGHT }}
        >
          {expanded && (
            <button
              type="button"
              className="flex items-center justify-center rounded-lg p-2 text-white/70 transition-colors hover:bg-white/20 hover:text-white/90"
              aria-label="Back"
              onClick={handleCollapse}
            >
              <ArrowLeft className="size-4" />
            </button>
          )}

          <input
            type="text"
            placeholder={expanded ? 'Ask follow-up' : 'Ask anything about your screen'}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit(); }}
            className="flex-1 bg-transparent text-white/90 placeholder:text-white/70 text-[15px] focus:outline-none"
          />

          <button
            type="button"
            className="flex items-center justify-center rounded-lg bg-white/20 p-2.5 text-white/80 transition-colors hover:bg-white/30"
            aria-label={expanded ? 'Stop' : 'Submit'}
            onClick={expanded ? undefined : handleSubmit}
          >
            {expanded ? <Square className="size-4" /> : <CornerDownLeft className="size-4" />}
          </button>
        </div>

        {expanded && (
          <div
            className="flex-1 backdrop-blur-2xl"
            style={{ background: GLASS_DARK }}
          />
        )}

        <ControlsBar borderTop={expanded} />

      </div>
    </main>
  );
}
