import { Settings, Sparkles, Eye, Paperclip, BookPlus, FolderCog, ChevronDown } from 'lucide-react';
import { IconButton } from '@/components/IconButton';
import { useState } from 'react';
import ChatWindow from './ChatWindow';

const GLASS_DARK = 'rgba(12, 12, 12, 0.95)';

function ControlsBar({ borderTop = false, captureEnabled, onToggleCapture }: { borderTop?: boolean; captureEnabled: boolean; onToggleCapture: () => void }) {
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
        <IconButton icon={Eye} label="Capture Screen" active={captureEnabled} onClick={onToggleCapture} />
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
  const [expanded, setExpanded] = useState(false);
  const [captureEnabled, setCaptureEnabled] = useState(false);

  const handleExpand = () => {
    setExpanded(true);
    window.api.expandWindow();
  };

  const handleCollapse = () => {
    setExpanded(false);
    window.api.collapseWindow();
  };

  return (
    <main className="h-screen w-screen">
      <div className={`draggable-area flex flex-col rounded-2xl overflow-hidden w-full ${expanded ? 'h-full' : ''}`}>
        <ChatWindow
          expanded={expanded}
          onExpand={handleExpand}
          onCollapse={handleCollapse}
          captureEnabled={captureEnabled}
        />
        {/* Controls area */}
        <ControlsBar borderTop={expanded} captureEnabled={captureEnabled} onToggleCapture={() => setCaptureEnabled(v => !v)} />
      </div>
    </main>
  );
}
