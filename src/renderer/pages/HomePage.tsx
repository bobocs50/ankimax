import {
  CornerDownLeft,
  Settings,
  Image,
  Eye,
  LayoutGrid,
  AudioLines,
  ChevronDown
} from 'lucide-react';
import { IconButton } from '@/components/IconButton';

/*
 * Glass background colors for the two HUD rows.
 * Light for search (top), dark for toolbar (bottom).
 */
const GLASS_LIGHT = 'rgba(80, 70, 90, 0.85)';
const GLASS_DARK = 'rgba(35, 30, 45, 0.9)';

export default function HomePage() {
  return (
    <main className="h-screen w-screen">
      {/*
       * Main HUD container
       * - draggable-area: allows window dragging (defined in global.css)
       * - rounded-2xl + overflow-hidden: clips children to rounded shape
       */}
      <div className="draggable-area flex flex-col rounded-2xl overflow-hidden">
        {/* Search Row - lighter glass background */}
        <div
          className="flex items-center px-5 py-2.5 gap-3 backdrop-blur-2xl"
          style={{ background: GLASS_LIGHT }}
        >
          <input
            type="text"
            placeholder="Ask anything about your screen"
            className="flex-1 bg-transparent text-white/90 placeholder:text-white/70 text-[15px] focus:outline-none"
          />
          <button
            type="button"
            className="flex items-center justify-center rounded-lg bg-white/20 p-2.5 text-white/80 transition-colors hover:bg-white/30"
            aria-label="Submit"
          >
            <CornerDownLeft className="size-4" />
          </button>
        </div>

        {/* Toolbar Row - darker glass background */}
        <div
          className="flex items-center px-5 py-2.5 backdrop-blur-2xl"
          style={{ background: GLASS_DARK }}
        >
          {/* Left: Settings button */}
          <div className="w-20">
            <IconButton icon={Settings} label="Settings" />
          </div>

          {/* Center: Tool buttons */}
          <div className="flex-1 flex items-center justify-center gap-6">
            <IconButton icon={Image} label="Screenshot" />
            <IconButton icon={Eye} label="Vision" />
            <IconButton icon={LayoutGrid} label="Grid" />
            <IconButton icon={AudioLines} label="Audio" />
          </div>

          {/* Right: History dropdown */}
          <div className="w-20 flex justify-end">
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
      </div>
    </main>
  );
}
