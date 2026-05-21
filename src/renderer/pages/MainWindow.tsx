import { CornerDownLeft, Settings, Sparkles, Paperclip, BookPlus, FolderCog, ChevronDown } from 'lucide-react';
import { IconButton } from '@/components/IconButton';
import { useState } from 'react';

const GLASS_LIGHT = 'rgba(75, 75, 75, 0.6)';
const GLASS_DARK = 'rgba(12, 12, 12, 0.95)';

export default function MainWindow() {

  const [message, setMessage] = useState('');

  const handleSubmit = () => {
    if (!message.trim()) return;
    window.api.postMessage(message);
    setMessage('');
  }

  return (
    <main className="h-screen w-screen">
      <div className="draggable-area flex flex-col rounded-2xl overflow-hidden">
        <div
          className="flex items-center gap-3 px-5 py-2.5 backdrop-blur-2xl"
          style={{ background: GLASS_LIGHT }}
        >
          <input  
            type="text"
            placeholder="Ask anything about your screen"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit(); }}
            className="flex-1 bg-transparent text-white/90 placeholder:text-white/70 text-[15px] focus:outline-none"
          />
          <button
            type="button"
            className="flex items-center justify-center rounded-lg bg-white/20 p-2.5 text-white/80 transition-colors hover:bg-white/30"
            aria-label="Submit"
            onClick={handleSubmit}
          >
            <CornerDownLeft className="size-4" />
          </button>
        </div>

        <div
          className="flex items-center px-5 py-2.5 backdrop-blur-2xl"
          style={{ background: GLASS_DARK }}
        >
          <div className="w-20">
            <IconButton icon={Settings} label="Settings" onClick={() => window.api.postHelloWorld()} />
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
      </div>
    </main>
  );
}
