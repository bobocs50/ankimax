# Architecture

## Overview

Ankimax is an Electron desktop app with a strict three-layer split:

- **Main process** owns native windowing and privileged desktop capabilities
- **Preload bridge** exposes a narrow safe API to the renderer
- **Renderer** is a React UI that stays isolated from direct Electron access

The app is a compact HUD-style overlay that serves as the entry point for screen capture, question flow, flashcard drafting, and Anki export.

---

## Runtime Structure

### Main Process

**Files:**
- `src/main/main.ts` - Window creation and app lifecycle
- `src/main/ipc.ts` - IPC handler registration
- `src/main/prompts.ts` - Gemini system prompt strings

**Responsibilities:**
- Create and configure the Electron `BrowserWindow`
- Position the HUD near the top center of the primary display
- Choose the renderer source for development or production
- Register IPC handlers for privileged app capabilities
- Make Gemini API calls via raw `fetch` (no SDK)

**Current window configuration:**
- Frameless, transparent, always on top
- Default size: 680×125 (HUD bar)
- Expanded size: 680×500 (chat or flashcard panel open)
- `contextIsolation: true` and `nodeIntegration: false`

**Current IPC handlers:**

| Channel | Description |
|---|---|
| `app:get-version` | Returns app version |
| `message:post-message` | Sends chat message to Gemini, optionally attaches desktop screenshot |
| `flashcard:init-clipboard-baseline` | Sets current clipboard image as baseline for change detection |
| `flashcard:check-clipboard` | Returns true if a new image was copied since last check |
| `flashcard:generate-card` | Sends pending clipboard image to Gemini; returns `{ front, back }` |
| `flashcard:send-anki` | Logs the card (Anki integration pending) |
| `window:expand` | Resizes window to 680×500 |
| `window:collapse` | Resizes window back to 680×125 |

---

### Preload Bridge

**Files:**
- `src/preload/preload.ts` - Bridge implementation
- `src/shared/electron.d.ts` - TypeScript declarations

The preload layer is the only renderer-facing bridge to Electron. It exposes a typed `window.api` object.

**Current exposed API:**

```ts
getVersion(): Promise<string>
postMessage(message, captureScreenEnabled, history): Promise<string>
initClipboardBaseline(): Promise<void>
checkClipboard(): Promise<boolean>
generateCard(): Promise<{ front: string; back: string } | undefined>
sendAnki(card: { front: string; back: string }): Promise<void>
expandWindow(): Promise<void>
collapseWindow(): Promise<void>
```

This layer should remain narrow. Each new desktop capability must be explicitly added here and mirrored in the shared TypeScript declaration.

---

### Renderer

**Files:**
- `src/renderer/pages/MainWindow.tsx` - Root HUD component, panel routing, Auto AI loop
- `src/renderer/pages/ChatWindow/index.tsx` - Chat input bar and message thread
- `src/renderer/pages/FlashcardWindow/index.tsx` - Flashcard editor with rich-text formatting
- `src/renderer/components/IconButton.tsx` - Reusable icon button
- `src/renderer/global.css` - Global styles including draggable regions

**Panel routing:**
`MainWindow` owns an `activePanel` state (`'chat' | 'flashcard' | null`). Switching panels calls `window:expand` or `window:collapse` as needed. `ChatWindow` and `FlashcardWindow` render based on the `expanded` prop.

**Auto AI loop:**
When Auto AI is enabled, `MainWindow` initialises a clipboard baseline and polls every 500ms via `checkClipboard`. On a new image it triggers `generateCard`, opens the flashcard panel, and populates the editor with the result.

**FlashcardWindow:**
Rich-text editor using `contentEditable` divs. Formatting toolbar applies `document.execCommand` for bold/italic/underline/lists and text colour. "Add Card" sends the card via `window.api.sendAnki`.

**ChatWindow:**
Chat history maintained in component state; cleared on collapse. Sends full history array on each message. Response streaming is simulated client-side: words are appended at 50ms intervals. Supports markdown rendering via `react-markdown` with a copy-code button on fenced blocks.

The renderer should stay focused on UI and orchestration. Anything that touches the OS, external apps, file system, screen capture, or API secrets belongs outside the renderer boundary.

---

## Current UI Layout

```
┌──────────────────────────────────────────────────────────────────┐
│  [←]  "Ask anything about your screen"                    [↵]   │  ← GLASS_LIGHT
├──────────────────────────────────────────────────────────────────┤
│  [Chat panel or Flashcard editor — visible when expanded]        │  ← GLASS_DARK
├──────────────────────────────────────────────────────────────────┤
│  ⚙️   📖 Create Flashcard  ✨ Auto AI  👁 Capture  │  🗂 Deck  History ▾  │  ← GLASS_DARK
└──────────────────────────────────────────────────────────────────┘
```

**Glass colors:**
- `GLASS_LIGHT`: `rgba(75, 75, 75, 0.6)` - Input bar
- `GLASS_DARK`: `rgba(12, 12, 12, 0.95)` - Panels and toolbar

---

## Security Model

- `contextIsolation: true`
- `nodeIntegration: false`
- No direct Electron imports in the renderer
- Desktop capabilities exposed only through preload and IPC

**Practical rule:**
- If a feature needs the OS → goes through main and preload
- If a feature is just UI → stays in React
- If a feature needs both → keep the contract explicit and typed

---

## Development And Production

**Development:**
- Main process loads `http://localhost:5173`
- Renderer served by Vite
- DevTools opened automatically
- Screen capture permission prompt triggered at startup

**Production:**
- Renderer loads from `dist/index.html`
- Electron runtime files from `dist-electron`

---

## Wired vs Stub Features

**Fully wired:**
- **Chat** — `postMessage` sends message + history to Gemini; response word-streams in ChatWindow
- **Capture Screen** (Eye) — attaches desktop screenshot to next `postMessage` call
- **Auto AI** (Sparkles) — 500ms clipboard polling → `generateCard` → populates FlashcardWindow
- **Create Flashcard** (BookPlus) — opens FlashcardWindow; editor fully functional

**Stubs (UI exists, no action):**
- **Settings** — no panel
- **Anki Deck** (FolderCog) — no state or action
- **History** button — no panel
- **Send to Anki** — IPC handler registered but only logs to console; AnkiConnect not yet called

---

## Extension Pattern

When adding a new feature, follow this sequence:

1. Define the capability in the main process (`src/main/ipc.ts`)
2. Expose the smallest useful preload method (`src/preload/preload.ts`)
3. Add the matching `window.api` type (`src/shared/electron.d.ts`)
4. Call it from the renderer without importing Electron directly
5. Keep UI state and privileged execution separate

IPC channel names follow the `namespace:action` pattern (e.g. `app:get-version`, `window:expand`, `flashcard:generate-card`).

---

## File Structure

```
src/
├── main/
│   ├── main.ts          # Window creation, app lifecycle
│   ├── ipc.ts           # IPC handler registration + Gemini API calls
│   └── prompts.ts       # Gemini system prompt strings
├── preload/
│   └── preload.ts       # contextBridge API exposure
├── renderer/
│   ├── pages/
│   │   ├── MainWindow.tsx          # Root HUD: panel routing, Auto AI loop
│   │   ├── ChatWindow/index.tsx    # Chat input bar + message thread
│   │   └── FlashcardWindow/index.tsx # Rich-text flashcard editor
│   ├── components/
│   │   └── IconButton.tsx          # Reusable button component
│   ├── main.tsx                    # React entry point
│   └── global.css                  # Global styles + drag regions
└── shared/
    └── electron.d.ts    # window.api type declarations
```
