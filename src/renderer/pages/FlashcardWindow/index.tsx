import { useEffect, useRef, useState } from 'react';
import { Bold, Italic, Underline, Strikethrough, List, ListOrdered } from 'lucide-react';

const GLASS_DARK = 'rgba(12, 12, 12, 0.95)';

const FORMAT_BUTTONS = [
  { icon: Bold,          label: 'Bold',          cmd: 'bold' },
  { icon: Italic,        label: 'Italic',         cmd: 'italic' },
  { icon: Underline,     label: 'Underline',      cmd: 'underline' },
  { icon: Strikethrough, label: 'Strikethrough',  cmd: 'strikeThrough' },
  null,
  { icon: List,          label: 'Bullet list',    cmd: 'insertUnorderedList' },
  { icon: ListOrdered,   label: 'Numbered list',  cmd: 'insertOrderedList' },
] as const;

const COLORS = [
  'rgb(255, 255, 255)',
  'rgb(248, 113, 113)',
  'rgb(251, 146, 60)',
  'rgb(250, 204, 21)',
  'rgb(74, 222, 128)',
  'rgb(96, 165, 250)',
  'rgb(192, 132, 252)',
];

function FormatToolbar() {
  const [state, setState] = useState({ formats: new Set<string>(), color: '' });

  const sync = () => {
    const formats = new Set<string>();
    for (const btn of FORMAT_BUTTONS) {
      if (btn && document.queryCommandState(btn.cmd)) formats.add(btn.cmd);
    }
    setState({ formats, color: document.queryCommandValue('foreColor') });
  };

  useEffect(() => {
    document.addEventListener('selectionchange', sync);
    return () => document.removeEventListener('selectionchange', sync);
  }, []);

  return (
    <div className="flex items-center px-2.5 py-1.5 gap-0.5 border-b border-white/10">

      {/* Format buttons */}
      {FORMAT_BUTTONS.map((btn, i) => {
        if (btn === null) return <div key={i} className="w-px h-4 bg-white/20 mx-1.5" />;
        const active = state.formats.has(btn.cmd);
        return (
          <button
            key={btn.label}
            type="button"
            aria-label={btn.label}
            onMouseDown={e => { e.preventDefault(); document.execCommand(btn.cmd); sync(); }}
            className={`flex items-center justify-center w-7 h-7 rounded transition-all duration-150 ${
              active ? 'text-white bg-white/15' : 'text-white/40 hover:text-white/80 hover:bg-white/10'
            }`}
          >
            <btn.icon size={14} strokeWidth={2} />
          </button>
        );
      })}

      {/* Color swatches */}
      <div className="w-px h-4 bg-white/20 mx-1.5" />
      {COLORS.map(color => {
        const active = color === state.color;
        return (
          <button
            key={color}
            type="button"
            aria-label={`Text color ${color}`}
            onMouseDown={e => { e.preventDefault(); document.execCommand('foreColor', false, color); sync(); }}
            className={`w-3.5 h-3.5 rounded-full mx-0.5 flex-shrink-0 transition-all duration-150 ${
              active ? 'ring-2 ring-white/80' : 'ring-1 ring-white/20 hover:ring-white/50'
            }`}
            style={{ background: color }}
          />
        );
      })}

    </div>
  );
}

function SkeletonBar({ width = 'w-full' }: { width?: string }) {
  return <div className={`h-2 rounded-full bg-white/[0.08] animate-pulse ${width}`} />;
}

interface CardFieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  isLoading: boolean;
  skeletonBars: number;
}

function CardField({ label, value, onChange, isLoading, skeletonBars }: CardFieldProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) ref.current.innerHTML = value;
  }, []);

  useEffect(() => {
    if (isLoading && ref.current) ref.current.innerHTML = '';
  }, [isLoading]);

  useEffect(() => {
    if (!ref.current || ref.current.innerHTML === value) return;
    ref.current.innerHTML = value;
  }, [value]);

  const handleInput = () => {
    if (!ref.current) return;
    onChange(ref.current.innerHTML);
  };

  return (
    <div className="border-b border-b-white/10 border-t border-t-transparent focus-within:border-b-white/20 focus-within:border-t-white/20 transition-colors duration-150">
      <div className="flex items-center px-4 pt-3 pb-2">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-white/35">{label}</span>
      </div>
      <div className={isLoading ? 'hidden' : ''}>
        <div
          ref={ref}
          contentEditable
          onInput={handleInput}
          className="w-full bg-transparent px-4 pb-4 text-[13.5px] leading-relaxed text-white/90 focus:outline-none [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5"
          style={{ minHeight: '2.25rem' }}
        />
      </div>
      {isLoading && (
        <div className="flex flex-col gap-2.5 px-4 pb-4">
          {Array.from({ length: skeletonBars }).map((_, i) => (
            <SkeletonBar key={i} width={i === skeletonBars - 1 && skeletonBars > 1 ? 'w-2/3' : 'w-full'} />
          ))}
        </div>
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

export default function FlashcardWindow({
  expanded,
  front,
  back,
  onFrontChange,
  onBackChange,
  isLoading = false,
}: FlashcardWindowProps) {
  if (!expanded) return null;

  return (
    <div className="interactive flex-1 overflow-y-auto backdrop-blur-2xl" style={{ background: GLASS_DARK }}>
      <FormatToolbar />
      <CardField label="Front" value={front} onChange={onFrontChange} isLoading={isLoading} skeletonBars={1} />
      <CardField label="Back" value={back} onChange={onBackChange} isLoading={isLoading} skeletonBars={3} />
    </div>
  );
}
