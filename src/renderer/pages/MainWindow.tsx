import { Settings, Sparkles, Eye, BookPlus, ChevronDown } from 'lucide-react';
import { IconButton } from '@/components/IconButton';
import { useState, useEffect, useRef } from 'react';
import ChatWindow from './ChatWindow';
import FlashcardWindow from './FlashcardWindow';

const GLASS_DARK = 'rgba(12, 12, 12, 0.95)';

type ControlsBarProps = {
  borderTop?: boolean;
  captureScreenEnabled: boolean;
  onToggleCapture: () => void;
  autoAiEnabled: boolean;
  onToggleAutoAi: () => void;
  onOpenFlashcard: () => void;
  decks: string[];
  selectedDeck: string;
};

function ControlsBar({ borderTop = false, captureScreenEnabled, onToggleCapture, autoAiEnabled, onToggleAutoAi, onOpenFlashcard, decks, selectedDeck }: ControlsBarProps) {
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
        <IconButton icon={Eye} label="Capture Screen" active={captureScreenEnabled} onClick={onToggleCapture} />
      </div>

      {/* Deck selector */}
      <div className="flex w-20 justify-end">
        <button
          type="button"
          aria-label="Select Anki deck"
          onClick={() => window.api.showDeckMenu(decks, selectedDeck)}
          className="flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[13px] text-white/60 transition-colors hover:bg-white/25"
        >
          {selectedDeck}
          <ChevronDown className="size-4" />
        </button>
      </div>
    </div>
  );
}

export default function MainWindow() {
  const [activePanel, setActivePanel] = useState<'chat' | 'flashcard' | null>(null);
  const [captureScreenEnabled, setCaptureScreenEnabled] = useState(false);
  const [autoAiEnabled, setAutoAiEnabled] = useState(false);
  const [flashFront, setFlashFront] = useState('');
  const [flashBack, setFlashBack] = useState('');
  const [decks, setDecks] = useState<string[]>(['Default']);
  const [selectedDeck, setSelectedDeck] = useState('Default');

  useEffect(() => {
    window.api.getDecks()
      .then(fetched => { setDecks(fetched); setSelectedDeck(fetched[0]); })
      .catch(() => {});
    window.api.onDeckSelected(deck => setSelectedDeck(deck));
  }, []);

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

  const [generatingFlashcard, setGeneratingFlashcard] = useState(false);
  const generatingFlashcardRef = useRef(false);

  useEffect(() => {
    if (!autoAiEnabled) return;
    window.api.initClipboardBaseline();

    const intervalId = setInterval(async () => {
      if (generatingFlashcardRef.current) return;
      const changed = await window.api.checkClipboard();
      if (!changed) return;

      generatingFlashcardRef.current = true;
      setGeneratingFlashcard(true);
      window.api.expandWindow();
      setActivePanel('flashcard');
      const card = await window.api.generateCard();
      if (card) {
        setFlashFront(card.front);
        setFlashBack(card.back);
      }
      await window.api.initClipboardBaseline();
      generatingFlashcardRef.current = false;
      setGeneratingFlashcard(false);
    }, 500);
    return () => clearInterval(intervalId);
  }, [autoAiEnabled]);

  return (
    <main className="h-screen w-screen">
      <div className={`draggable-area flex flex-col rounded-2xl overflow-hidden w-full ${activePanel !== null ? 'h-full' : ''}`}>
        <ChatWindow
          expanded={activePanel === 'chat'}
          showBack={activePanel !== null}
          onExpand={handleOpenChat}
          onCollapse={handleCollapse}
          captureScreenEnabled={captureScreenEnabled}
        />
        <FlashcardWindow
          expanded={activePanel === 'flashcard'}
          front={flashFront}
          back={flashBack}
          onFrontChange={setFlashFront}
          onBackChange={setFlashBack}
          isLoading={generatingFlashcard}
          selectedDeck={selectedDeck}
        />
        {/* Controls area */}
        <ControlsBar
          borderTop={activePanel !== null}
          captureScreenEnabled={captureScreenEnabled}
          onToggleCapture={() => setCaptureScreenEnabled(v => !v)}
          autoAiEnabled={autoAiEnabled}
          onToggleAutoAi={() => setAutoAiEnabled(v => !v)}
          onOpenFlashcard={handleOpenFlashcard}
          decks={decks}
          selectedDeck={selectedDeck}
        />
      </div>
    </main>
  );
}
