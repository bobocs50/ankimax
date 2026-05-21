# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Off-limits Files

`notes/STUDY_NOTES.md` is the user's personal learning journal. Do not read, reference, or use it as context for any task.

## Build and Development Commands

```bash
npm run dev          # Start concurrent dev mode (Vite renderer + Electron TypeScript watch + app)
npm run build        # Build renderer and Electron TypeScript for production
npm run dist         # Build and package with electron-builder
```

Individual build steps:
- `npm run build:renderer` - Vite build for renderer
- `npm run build:electron` - TypeScript compile for Electron main/preload

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

**Renderer** (`src/renderer/`): React + Tailwind app served by Vite. Uses `@/` path alias. No direct Node/Electron imports allowed.

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

### Development vs Production

- Dev: Renderer at `http://localhost:5173`, DevTools open
- Prod: Loads from `dist/index.html`, compiled Electron in `dist-electron/`
