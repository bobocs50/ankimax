import { ArrowLeft } from 'lucide-react';

const GLASS_DARK = 'rgba(12, 12, 12, 0.95)';

interface FlashcardWindowProps {
  expanded: boolean;
  onCollapse: () => void;
}

export default function FlashcardWindow({ expanded, onCollapse }: FlashcardWindowProps) {
  if (!expanded) return null;

  return (
    <div className="interactive flex-1 overflow-y-auto backdrop-blur-2xl flex flex-col" style={{ background: GLASS_DARK }}>
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-3 border-b border-white/10">
        <button type="button" aria-label="Back" onClick={onCollapse}
          className="flex items-center justify-center rounded-lg p-2 text-white/70 transition-colors hover:bg-white/20 hover:text-white/90">
          <ArrowLeft className="size-4" />
        </button>
        <span className="text-[15px] text-white/80">Create Flashcard</span>
      </div>

      {/* Blank content area */}
      <div className="flex-1" />
    </div>
  );
}
