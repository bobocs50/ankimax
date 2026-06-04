import { useEffect, useRef } from 'react';

const GLASS_DARK = 'rgba(12, 12, 12, 0.95)';

function CardField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    ref.current.style.height = 'auto';
    ref.current.style.height = ref.current.scrollHeight + 'px';
  }, [value]);

  return (
    <div className="border-b border-white/10">
      <div className="flex items-center px-4 py-2 text-white/60">
        <span className="text-[13px]">{label}</span>
      </div>
      <textarea
        ref={ref}
        rows={1}
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full bg-transparent px-4 pb-3 text-[14px] text-white/90 placeholder:text-white/30 focus:outline-none overflow-hidden resize-none"
        style={{ minHeight: '2.5rem' }}
      />
    </div>
  );
}

interface FlashcardWindowProps {
  expanded: boolean;
  front: string;
  back: string;
  onFrontChange: (v: string) => void;
  onBackChange: (v: string) => void;
}

export default function FlashcardWindow({ expanded, front, back, onFrontChange, onBackChange }: FlashcardWindowProps) {
  if (!expanded) return null;

  return (
    <div className="interactive flex-1 overflow-y-auto backdrop-blur-2xl" style={{ background: GLASS_DARK }}>
      <CardField label="Front" value={front} onChange={onFrontChange} />
      <CardField label="Back" value={back} onChange={onBackChange} />
    </div>
  );
}
