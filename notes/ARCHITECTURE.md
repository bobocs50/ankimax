# Architecture

## Overview..

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

**Responsibilities:**
- Create and configure the Electron `BrowserWindow`
- Position the HUD near the top center of the primary display
- Choose the renderer source for development or production
- Register IPC handlers for privileged app capabilities

**Current window configuration:**
- Frameless
- Transparent
- Always on top
- Fixed-size HUD layout
- `contextIsolation: true` and `nodeIntegration: false`

**Current IPC handlers:**
- `app:get-version` - Returns app version
- `app:post-hello-world` - Test handler

---

### Preload Bridge

**Files:**
- `src/preload/preload.ts` - Bridge implementation
- `src/shared/electron.d.ts` - TypeScript declarations

The preload layer is the only renderer-facing bridge to Electron. It exposes a typed `window.api` object.

**Current exposed API:**
- `getVersion(): Promise<string>`
- `postHelloWorld(): void`

This layer should remain narrow. Each new desktop capability must be explicitly added here and mirrored in the shared TypeScript declaration.

---

### Renderer

**Files:**
- `src/renderer/pages/MainWindow.tsx` - Main HUD component
- `src/renderer/components/IconButton.tsx` - Reusable icon button
- `src/renderer/global.css` - Global styles including draggable regions

**Current renderer behavior:**
- Renders HUD-style command bar with two rows
- Top row: Search input + submit button
- Bottom row: Settings, Card, AI, divider, Attach, History
- Glass blur effect with dark/light variants
- Window draggable via CSS `-webkit-app-region`
- Interactive controls opt out of dragging

The renderer should stay focused on UI and orchestration. Anything that touches the OS, external apps, file system, screen capture, or API secrets belongs outside the renderer boundary.

---

## Current UI Layout

```
┌─────────────────────────────────────────────────────────────────┐
│  "Ask anything about your screen"                         [↵]  │  ← GLASS_LIGHT
├─────────────────────────────────────────────────────────────────┤
│  ⚙️      📖 Card   ✨ AI   │   📎 Attach          History ▾     │  ← GLASS_DARK
└─────────────────────────────────────────────────────────────────┘
```

**Glass colors:**
- `GLASS_LIGHT`: `rgba(75, 75, 75, 0.6)` - Search row
- `GLASS_DARK`: `rgba(12, 12, 12, 0.95)` - Toolbar row

---

## Security Model

The security posture is strict:

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

**Production:**
- Renderer loads from `dist/index.html`
- Electron runtime files from `dist-electron`

---

## Extension Pattern

When adding a new feature (screen capture, Anki export, etc.), follow this sequence:

1. Define the capability in the main process (`src/main/ipc.ts`)
2. Expose the smallest useful preload method (`src/preload/preload.ts`)
3. Add the matching `window.api` type (`src/shared/electron.d.ts`)
4. Call it from the renderer without importing Electron directly
5. Keep UI state and privileged execution separate

**Future capabilities to add:**
- `captureScreenRegion()` - Capture screenshot
- `getClipboardImage()` - Read image from clipboard
- `askAboutCapture(question, image)` - Send to LLM
- `generateFlashcard(image)` - Generate Front/Back
- `exportToAnki(card, deckId)` - Push to Anki
- `getAnkiDecks()` - Fetch available decks

---

## File Structure

```
src/
├── main/
│   ├── main.ts          # Window creation, app lifecycle
│   └── ipc.ts           # IPC handler registration
├── preload/
│   └── preload.ts       # contextBridge API exposure
├── renderer/
│   ├── pages/
│   │   └── MainWindow.tsx   # Main HUD component
│   ├── components/
│   │   └── IconButton.tsx   # Reusable button component
│   ├── routes/
│   │   └── index.tsx        # React Router setup
│   └── global.css           # Global styles
└── shared/
    └── electron.d.ts        # window.api type declarations
```

---

## Expected Growth Areas

Based on the roadmap, the architecture will expand:

1. **Card Editor Panel** - New component for flashcard editing
2. **Screenshot handling** - Clipboard reading, full desktop capture
3. **AI integration** - LLM API calls from main process
4. **Anki integration** - AnkiConnect API from main process
5. **Persistence** - Local storage for history and preferences

As these arrive, preserve the same split:
- Main process for native integration and sensitive operations
- Preload for explicit bridging
- Renderer for workflow, editing, and feedback
