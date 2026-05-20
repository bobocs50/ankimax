import type { LucideIcon } from 'lucide-react';

/**
 * A minimal icon button used throughout the HUD.
 * Handles the consistent hover state and sizing.
 */

interface IconButtonProps {
  icon: LucideIcon;
  label: string; // Used for accessibility (aria-label)
  onClick?: () => void;
}

export function IconButton({ icon: Icon, label, onClick }: IconButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-white/50 transition-colors hover:text-white/80"
      aria-label={label}
    >
      <Icon className="size-5" />
    </button>
  );
}
