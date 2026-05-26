# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Study Notes

`notes/STUDY_NOTES.md` is the user's personal learning journal. Claude can read and write to it when the user explicitly asks.

## Build and Development Commands

```bash
npm run dev          # Start concurrent dev mode (Vite renderer + Electron TypeScript watch + app)
npm run build        # Build renderer and Electron TypeScript for production
npm run dist         # Build and package with electron-builder
```

Individual build steps:
- `npm run build:renderer` - Vite build for renderer
- `npm run build:electron` - TypeScript compile for Electron main/preload

There are no tests in this project.

## Environment Variables

Copy `.env.example` to `.env` (or create `.env`) with:

```
GEMINI_API_KEY=...
GEMINI_MODEL=gemini-2.0-flash
SYSTEM_PROMPT=...
```

The main process reads these via `dotenv` in `src/main/ipc.ts` before making Gemini API calls.

## Architecture

Ankimax is an Electron desktop app for capturing screen content and creating Anki flashcards. It uses the standard Electron process split with strict security boundaries.

### Process Boundaries

```
src/
├── main/           # Electron main process (Node.js)
├── preload/        # Bridge script exposing window.api
├── renderer/       # React app (browser context, no Node access)
└── shared/         # TypeScript types shared across processes
```

**Main process** (`src/main/`): Creates BrowserWindow, registers IPC handlers in `ipc.ts`. Compiled to `dist-electron/` via `tsconfig.electron.json`.

**Preload** (`src/preload/preload.ts`): Exposes a narrow API on `window.api` using contextBridge. This is the only bridge between renderer and Electron capabilities.

**Renderer** (`src/renderer/`): React + Tailwind app served by Vite. Uses `@/` path alias (maps to `src/renderer/`). No direct Node/Electron imports allowed.

**Shared types** (`src/shared/electron.d.ts`): Declares the `window.api` interface for type safety in the renderer.

### Adding New Desktop Capabilities

Follow the existing `getVersion` pattern:
1. Add IPC handler in `src/main/ipc.ts`
2. Expose method in `src/preload/preload.ts` via `contextBridge`
3. Add type to `src/shared/electron.d.ts`
4. Call from renderer via `window.api.methodName()`

### Security Model

- `contextIsolation: true` and `nodeIntegration: false`
- Renderer accesses main process only through explicit preload APIs
- Keep IPC surface minimal and explicit

### Two TypeScript Configs

- `tsconfig.json` - Renderer (ESNext modules, JSX, path aliases, no emit)
- `tsconfig.electron.json` - Main/preload (CommonJS, emits to `dist-electron/`)

### Window Characteristics

The app is a frameless, transparent, always-on-top floating HUD (680×125px) positioned at the top center of the primary display. It expands to 680×500 when the chat panel is open. This is a deliberate UX constraint — don't change it without reason.

### Planned Features (not yet built)

Several UI buttons in `MainWindow.tsx` are stubs for planned features: screen capture, flashcard generation, Anki export, persistent history, and a settings panel. The app currently only implements AI chat via Gemini.

### Development vs Production

- Dev: Renderer at `http://localhost:5173`, DevTools open
- Prod: Loads from `dist/index.html`, compiled Electron in `dist-electron/`

## General Philosophy

- Simple code that works. Don't over-engineer — prefer the straightforward solution over the clever one.

## React Code Style

**File structure order:** named constants → sub-components → main component (state/refs → effects → handlers → JSX)

**Constants:** Extract reused style values as named constants at the top — never inline magic strings or rgba values.

**Sub-components:** Extract distinct UI sections as functions in the same file. Only move to a separate file if used elsewhere.

**Styling:**
- Tailwind for everything. Use `style={}` only for values Tailwind can't express (e.g. rgba colors).
- Conditional classes via template literals: `` `base ${condition ? 'a' : 'b'}` ``
- Icon sizing: `size-4` not `w-4 h-4`

**JSX formatting:**
- Single-prop or short elements on one line: `<IconButton icon={Settings} label="Settings" />`
- Multi-prop elements spread across lines
- Short handlers inlined; longer ones named as `const handleX` above the JSX

**Buttons:** Always `type="button"` and `aria-label` on every button.

**Section comments:** Label distinct UI blocks: `{/* Input bar */}` `{/* Response area */}`

**Icons:** Use lucide-react. Import only what's used.
