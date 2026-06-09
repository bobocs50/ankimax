import { useEffect, useRef, useState } from 'react';
import { Bold, Italic, Underline, List, ListOrdered } from 'lucide-react';

const GLASS_DARK = 'rgba(12, 12, 12, 0.95)';

const FORMAT_BUTTONS = [
  { icon: Bold,        label: 'Bold',          cmd: 'bold' },
  { icon: Italic,      label: 'Italic',         cmd: 'italic' },
  { icon: Underline,   label: 'Underline',      cmd: 'underline' },
  null,
  { icon: List,        label: 'Bullet list',    cmd: 'insertUnorderedList' },
  { icon: ListOrdered, label: 'Numbered list',  cmd: 'insertOrderedList' },
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

const FIELD_CLASS = 'border-b border-b-white/10 border-t border-t-transparent focus-within:border-b-white/20 focus-within:border-t-white/20 transition-colors duration-150';
const LABEL_CLASS = 'text-[10px] font-semibold uppercase tracking-widest text-white/35';
const EDIT_CLASS = 'w-full bg-transparent px-4 pb-4 text-[13.5px] leading-relaxed text-white/90 focus:outline-none [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5';
const SKELETON_CLASS = 'h-2 rounded-full bg-white/[0.08] animate-pulse';

function FormatToolbar() {
  const [formats, setFormats] = useState(new Set<string>());
  const [currentColor, setCurrentColor] = useState('');
  const currentColorRef = useRef('');

  const sync = () => {
    const next = new Set<string>();
    for (const btn of FORMAT_BUTTONS) {
      if (btn && document.queryCommandState(btn.cmd)) next.add(btn.cmd);
    }
    setFormats(next);
  };

  useEffect(() => {
    const handleFocusIn = (e: FocusEvent) => {
      if ((e.target as HTMLElement).contentEditable === 'true' && currentColorRef.current) {
        document.execCommand('foreColor', false, currentColorRef.current);
      }
    };
    document.addEventListener('selectionchange', sync);
    document.addEventListener('focusin', handleFocusIn);
    return () => {
      document.removeEventListener('selectionchange', sync);
      document.removeEventListener('focusin', handleFocusIn);
    };
  }, []);

  return (
    <div className="flex items-center px-2.5 py-1.5 gap-0.5 border-b border-white/10">
      {FORMAT_BUTTONS.map((btn, i) => {
        if (btn === null) return <div key={i} className="w-px h-4 bg-white/20 mx-1.5" />;
        const active = formats.has(btn.cmd);
        return (
          <button
            key={btn.label}
            type="button"
            aria-label={btn.label}
            onMouseDown={e => { e.preventDefault(); document.execCommand(btn.cmd); sync(); }}
            className={`flex items-center justify-center w-7 h-7 rounded transition-all duration-150 ${active ? 'text-white bg-white/15' : 'text-white/40 hover:text-white/80 hover:bg-white/10'}`}
          >
            <btn.icon size={14} strokeWidth={2} />
          </button>
        );
      })}
      <div className="w-px h-4 bg-white/20 mx-1.5" />
      {COLORS.map(color => (
        <button
          key={color}
          type="button"
          aria-label={`Text color ${color}`}
          onMouseDown={e => {
            e.preventDefault();
            setCurrentColor(color);
            currentColorRef.current = color;
            document.execCommand('foreColor', false, color);
            sync();
          }}
          className={`w-3.5 h-3.5 rounded-full mx-0.5 flex-shrink-0 transition-all duration-150 ${color === currentColor ? 'ring-2 ring-white/80' : 'ring-1 ring-white/20 hover:ring-white/50'}`}
          style={{ background: color }}
        />
      ))}
    </div>
  );
}

export default function FlashcardWindow({
  expanded,
  front,
  back,
  onFrontChange,
  onBackChange,
  isLoading = false,
}: {
  expanded: boolean;
  front: string;
  back: string;
  onFrontChange: (v: string) => void;
  onBackChange: (v: string) => void;
  isLoading?: boolean;
}) {
  const frontRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    frontRef.current!.innerHTML = front;
    backRef.current!.innerHTML = back;
  }, []);

  useEffect(() => {
    if (isLoading) {
      frontRef.current!.innerHTML = '';
      backRef.current!.innerHTML = '';
    }
  }, [isLoading]);

  useEffect(() => {
    if (isLoading) return;
    if (frontRef.current!.innerHTML !== front) frontRef.current!.innerHTML = front;
  }, [front, isLoading]);

  useEffect(() => {
    if (isLoading) return;
    if (backRef.current!.innerHTML !== back) backRef.current!.innerHTML = back;
  }, [back, isLoading]);

  if (!expanded) return null;

  return (
    <div className="interactive flex-1 overflow-y-auto backdrop-blur-2xl" style={{ background: GLASS_DARK }}>

      <FormatToolbar />

      {/* Front */}
      <div className={FIELD_CLASS}>
        <div className="flex items-center px-4 pt-3 pb-2">
          <span className={LABEL_CLASS}>Front</span>
        </div>
        <div className={isLoading ? 'hidden' : ''}>
          <div ref={frontRef} contentEditable onInput={() => onFrontChange(frontRef.current!.innerHTML)} className={EDIT_CLASS} style={{ minHeight: '2.25rem' }} />
        </div>
        {isLoading && (
          <div className="flex flex-col gap-2.5 px-4 pb-4">
            <div className={`${SKELETON_CLASS} w-full`} />
          </div>
        )}
      </div>

      {/* Back */}
      <div className={FIELD_CLASS}>
        <div className="flex items-center px-4 pt-3 pb-2">
          <span className={LABEL_CLASS}>Back</span>
        </div>
        <div className={isLoading ? 'hidden' : ''}>
          <div ref={backRef} contentEditable onInput={() => onBackChange(backRef.current!.innerHTML)} className={EDIT_CLASS} style={{ minHeight: '2.25rem' }} />
        </div>
        {isLoading && (
          <div className="flex flex-col gap-2.5 px-4 pb-4">
            <div className={`${SKELETON_CLASS} w-full`} />
            <div className={`${SKELETON_CLASS} w-full`} />
            <div className={`${SKELETON_CLASS} w-2/3`} />
          </div>
        )}
      </div>

    </div>
  );
}
