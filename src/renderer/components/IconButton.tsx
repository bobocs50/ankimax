import type { LucideIcon } from 'lucide-react';

interface IconButtonProps {
  icon: LucideIcon;
  label: string;
  onClick?: () => void;
  active?: boolean;
}

export function IconButton({ icon: Icon, label, onClick, active }: IconButtonProps) {
  const tooltip = active !== undefined ? `${label} ${active ? 'On' : 'Off'}` : label;
  return (
    <div className="relative group w-fit">
      <span className="pointer-events-none absolute inset-[-9px] rounded-xl bg-white/0 transition-colors group-hover:bg-white/20" />
      <button
        type="button"
        onClick={onClick}
        className={`relative flex items-center justify-center transition-colors hover:text-white/80 ${active ? 'text-white' : 'text-white/50'}`}
        aria-label={label}
      >
        <Icon className="size-5" />
      </button>
      <span className="pointer-events-none absolute bottom-full left-1/2 mb-4 -translate-x-1/2 whitespace-nowrap rounded-md bg-black px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100 after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:border-4 after:border-transparent after:border-t-black after:content-['']">
        {tooltip}
      </span>
    </div>
  );
}
