# Roadmap

## MVP — Ship This First

One loop: capture → AI card → edit → push to Anki.

---

## Phase 1: HUD Foundation ✅

- [x] Electron main/preload/renderer boundaries
- [x] Typed preload bridge (`window.api`)
- [x] Frameless, transparent, always-on-top HUD
- [x] Input bar + toolbar layout
- [x] Screen capture toggle (Eye)
- [x] AI toggle (Sparkles)
- [x] Glass styling, drag region
- [x] Basic chat — question + screen → AI answer

---

## Phase 2: Stateless Chat

**Goal:** Simplify chat — no history, fresh context every time.

- [ ] Remove multi-turn history from `postMessage` IPC call
- [ ] Each chat open starts a new session (no `contents` array carried over)

---

## Phase 3: Flashcard Editor

**Goal:** Wire up FlashcardWindow so a user can actually edit a card.

- [ ] Front field (text input)
- [ ] Back field (text input)
- [ ] Screenshot thumbnail shown as reference
- [ ] AI fills Front & Back from screenshot (AI ON)
- [ ] Blank fields when AI OFF (manual mode)

---

## Card Generation Style — MUST HAVE

**Goal:** User defines how AI generates cards. Set once, applied to every AI card.

- [ ] User can define a custom card style template (e.g. Pareto method, short definition, example-based, color-coded, etc.)
- [ ] AI uses this template when generating Front and Back
- [ ] Template is set once and applies globally to all AI-generated cards
- [ ] This is core card generation behavior — not a buried settings option

---

## Phase 4: AnkiConnect

**Goal:** Push a card to Anki from inside the app.

- [ ] Check if Anki is running (ping AnkiConnect at `localhost:8765`)
- [ ] Fetch deck list from Anki
- [ ] Deck picker in FlashcardWindow footer
- [ ] "Add to Anki" button — POST card to selected deck
- [ ] Success: close editor, show brief confirmation
- [ ] Failure: show error, keep editor open

---

## Phase 5: Ship

- [ ] End-to-end test: capture → AI card → edit → push to Anki
- [ ] `npm run dist` builds and runs cleanly
- [ ] Hand off to first user

---

## After MVP — What Makes It Irreplaceable

Do none of this until the core loop is validated with real users.

**AI that learns from your edits**
- When user edits an AI-generated card, store the delta
- Use stored edits to improve future generations for that user
- Personalisation that compounds — not replicable by a generic tool

**What am I missing?**
- Input A: existing Anki deck via AnkiConnect → "you have no cards on clinical presentation"
- Input B: syllabus or topic list → "you haven't carded renal yet"
- Surface gaps as a suggestion, not a blocker


---

## Cut From MVP

Do these after validation, not before.

- **Chat history** — stateless is fine for v1
- **Image occlusion** — different card type, different editor, save for v1.1
- **Settings panel** — hardcode what you need
- **History panel** — not needed to validate the loop
- **Büroklammer staging area** — nice UX, not blocking
- **Hotkeys** — add after the loop works
- **Hardening & polish** — do after real users use it
