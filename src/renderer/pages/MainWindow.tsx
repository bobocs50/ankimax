import { Settings, Sparkles, Eye, Paperclip, BookPlus, FolderCog, ChevronDown } from 'lucide-react';
import { IconButton } from '@/components/IconButton';
import { useState } from 'react';
import ChatWindow from './ChatWindow';
import FlashcardWindow from './FlashcardWindow';

const GLASS_DARK = 'rgba(12, 12, 12, 0.95)';

function ControlsBar({ borderTop = false, captureEnabled, onToggleCapture, autoAiEnabled, onToggleAutoAi, onOpenFlashcard }: { borderTop?: boolean; captureEnabled: boolean; onToggleCapture: () => void; autoAiEnabled: boolean; onToggleAutoAi: () => void; onOpenFlashcard: () => void }) {
  return (
    <div
      className={`flex items-center px-5 py-2.5 backdrop-blur-2xl ${borderTop ? 'border-t border-white/10' : ''}`}
      style={{ background: GLASS_DARK }}
    >
      <div className="w-20">
        <IconButton icon={Settings} label="Settings" />
      </div>

      <div className="flex flex-1 items-center justify-center gap-6">
        <IconButton icon={BookPlus} label="Create Flashcard" onClick={onOpenFlashcard} />
        <IconButton icon={Sparkles} label="Auto AI" active={autoAiEnabled} onClick={onToggleAutoAi} />
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
  const [activePanel, setActivePanel] = useState<'chat' | 'flashcard' | null>(null);
  const [captureEnabled, setCaptureEnabled] = useState(false);
  const [autoAiEnabled, setAutoAiEnabled] = useState(false);

  const handleOpenChat = () => {
    setActivePanel('chat');
    window.api.expandWindow();
  };

  const handleOpenFlashcard = () => {
    setActivePanel('flashcard');
    window.api.expandWindow();
  };

  const handleCollapse = () => {
    setActivePanel(null);
    window.api.collapseWindow();
  };

  return (
    <main className="h-screen w-screen">
      <div className={`draggable-area flex flex-col rounded-2xl overflow-hidden w-full ${activePanel !== null ? 'h-full' : ''}`}>
        <ChatWindow
          expanded={activePanel === 'chat'}
          onExpand={handleOpenChat}
          onCollapse={handleCollapse}
          captureEnabled={captureEnabled}
        />
        <FlashcardWindow
          expanded={activePanel === 'flashcard'}
          onCollapse={handleCollapse}
        />
        {/* Controls area */}
        <ControlsBar borderTop={activePanel !== null} captureEnabled={captureEnabled} onToggleCapture={() => setCaptureEnabled(v => !v)} autoAiEnabled={autoAiEnabled} onToggleAutoAi={() => setAutoAiEnabled(v => !v)} onOpenFlashcard={handleOpenFlashcard} />
      </div>
    </main>
  );
}
