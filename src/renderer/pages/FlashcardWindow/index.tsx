import { useEffect, useRef } from 'react';

const GLASS_DARK = 'rgba(12, 12, 12, 0.95)';

function SkeletonBar({ width = 'w-full' }: { width?: string }) {
  return <div className={`h-3 rounded-full bg-white/10 animate-pulse ${width}`} />;
}

function CardField({ label, value, onChange, isLoading, skeletonBars }: { label: string; value: string; onChange: (v: string) => void; isLoading: boolean; skeletonBars: number }) {
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
      {isLoading ? (
        <div className="flex flex-col gap-2 px-4 pb-4">
          {Array.from({ length: skeletonBars }).map((_, i) => (
            <SkeletonBar key={i} width={i === skeletonBars - 1 && skeletonBars > 1 ? 'w-2/3' : 'w-full'} />
          ))}
        </div>
      ) : (
        <textarea
          ref={ref}
          rows={1}
          value={value}
          onChange={e => onChange(e.target.value)}
          className="w-full bg-transparent px-4 pb-3 text-[14px] text-white/90 placeholder:text-white/30 focus:outline-none overflow-hidden resize-none"
          style={{ minHeight: '2.5rem' }}
        />
      )}
    </div>
  );
}

interface FlashcardWindowProps {
  expanded: boolean;
  front: string;
  back: string;
  onFrontChange: (v: string) => void;
  onBackChange: (v: string) => void;
  isLoading?: boolean;
}

export default function FlashcardWindow({ expanded, front, back, onFrontChange, onBackChange, isLoading = false }: FlashcardWindowProps) {
  if (!expanded) return null;

  return (
    <div className="interactive flex-1 overflow-y-auto backdrop-blur-2xl" style={{ background: GLASS_DARK }}>
      <CardField label="Front" value={front} onChange={onFrontChange} isLoading={isLoading} skeletonBars={1} />
      <CardField label="Back" value={back} onChange={onBackChange} isLoading={isLoading} skeletonBars={3} />
    </div>
  );
}
