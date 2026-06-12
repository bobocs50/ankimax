# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Roadmap

`notes/ROADMAP.md` tracks MVP progress. If the user mentions the roadmap before a task, tick the relevant checkbox(es) after completing the work — without needing to be asked.

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

Copy `.env.example` to `.env` with:

```
GEMINI_API_KEY=...
GEMINI_MODEL=gemini-2.0-flash
SYSTEM_PROMPT=...
```

## Architecture

Ankimax is a frameless, always-on-top Electron HUD (680×125px, top center of screen) for capturing screen content and creating Anki flashcards. It expands to 680×500 when a panel is open.

### Process Boundaries

```
src/
├── main/               # Electron main process (Node.js)
│   ├── main.ts         # BrowserWindow creation, app lifecycle
│   ├── ipc.ts          # Orchestrator — imports and calls all register() functions
│   ├── ipc_routes/     # IPC handlers split by namespace
│   │   ├── flashcard.ts  # flashcard:* handlers + AnkiConnect + Gemini card generation
│   │   ├── message.ts    # message:* handlers + Gemini chat
│   │   └── window.ts     # window:* handlers (resize, native deck menu)
│   └── prompts.ts      # Gemini system prompts for chat and flashcard generation
├── preload/
│   └── preload.ts      # contextBridge — exposes window.api to renderer
├── renderer/           # React + Tailwind app (Vite, no Node access)
│   └── pages/
│       ├── MainWindow.tsx      # Root: panel state, deck state, AutoAI polling
│       ├── ChatWindow/         # Chat panel with simulated streaming
│       └── FlashcardWindow/    # Flashcard editor with rich text toolbar
└── shared/
    └── electron.d.ts   # window.api type declarations
```

### Current `window.api` surface

```ts
// App
getVersion(): Promise<string>

// Chat
postMessage(message, captureScreenEnabled, history): Promise<string>

// Flashcard / AnkiConnect
getDecks(): Promise<string[]>
sendAnki(card: { front, back, deckName }): Promise<void>
initClipboardBaseline(): Promise<void>
checkClipboard(): Promise<boolean>
generateCard(): Promise<{ front: string; back: string } | undefined>

// Window
expandWindow(): Promise<void>
collapseWindow(): Promise<void>
showDeckMenu(decks, selectedDeck): Promise<void>   // opens native OS context menu
onDeckSelected(cb): void                            // main→renderer push event
```

`onDeckSelected` is the only main→renderer push (`webContents.send` / `ipcRenderer.on`). All others are request/response (`ipcMain.handle` / `ipcRenderer.invoke`).

### Adding New Desktop Capabilities

1. Add handler in the appropriate `src/main/ipc_routes/*.ts` file (or create a new one and register it in `ipc.ts`)
2. Expose in `src/preload/preload.ts` via `contextBridge`
3. Add type to `src/shared/electron.d.ts`
4. Call from renderer via `window.api.methodName()`

IPC channel names follow `namespace:action` (e.g. `flashcard:get-decks`, `window:expand`).

Every `ipcMain.handle` must have a one-line comment above it. Short, no period.

### Gemini API

Raw `fetch`, no SDK. Chat uses multi-turn `contents` array with optional base64 PNG screenshot attached via `inlineData`. Flashcard generation uses `responseMimeType: 'application/json'` with a `responseSchema`. Both system prompts live in `src/main/prompts.ts`. Prompts and responses are in German.

### AnkiConnect

Anki must be running with the AnkiConnect plugin on `localhost:8765`. All calls are POST with `{ action, version: 6, params }`. Used actions: `deckNames`, `addNote`.

### Security Model

`contextIsolation: true`, `nodeIntegration: false`. Renderer touches Node/Electron only through explicit preload APIs.

### Two TypeScript Configs

- `tsconfig.json` — Renderer (ESNext, JSX, `@/` alias → `src/renderer/`, no emit)
- `tsconfig.electron.json` — Main/preload (CommonJS, emits to `dist-electron/`)

Run both to fully type-check: `npx tsc --noEmit -p tsconfig.json && npx tsc --noEmit -p tsconfig.electron.json`

### CSS Drag Region

- `.draggable-area` — draggable region (`-webkit-app-region: drag`)
- `.interactive` — opts out of drag (used on scrollable/clickable areas inside drag regions)
- `button`, `input`, `select`, `textarea` are automatically non-draggable

### Feature Status

Fully wired:
- **Auto AI** (Sparkles) — polls clipboard every 500ms; on new image, calls Gemini to generate a flashcard and opens FlashcardWindow
- **Capture Screen** (Eye) — attaches desktop screenshot to next chat message
- **Create Flashcard** (BookPlus) — opens FlashcardWindow with rich text editor
- **Deck selector** — native OS context menu populated from AnkiConnect; selected deck passed to `sendAnki`
- **Send to Anki** — posts front/back HTML + deckName to AnkiConnect `addNote`

Stubs (UI exists, no functionality):
- **Settings** — no panel
- **ChatWindow** response streaming — simulated client-side (words appended at 50ms intervals; full response already received)

### Installed but lightly used

`radix-ui`, `shadcn`, `clsx`, `tailwind-merge` are installed and configured but not yet used in components.

## General Philosophy

Simple code that works. Don't over-engineer — prefer the straightforward solution over the clever one.

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

**`IconButton` active prop:** When `active` is passed (boolean), the tooltip automatically shows `"Label On"` / `"Label Off"`. Omit `active` for stateless buttons to keep a plain label tooltip.
