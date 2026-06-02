# Ankimax

A desktop capture and card-creation layer that sits on top of a student's existing Anki workflow.

Not a flashcard app. Not a replacement for Anki. A faster path from what you're looking at to a card in your deck.

---

## The Problem

Students constantly encounter information they want to remember — lecture slides, diagrams, PDFs, videos, websites, textbooks, notes. Turning those materials into high-quality Anki cards is slow, repetitive, and fragmented.

**Current workflow:**
```
Study Material → Screenshot → ChatGPT → Copy/Paste → Edit → Anki
```

**Ankimax:**
```
Capture → Understand → Create Card → Review → Save to Anki
```

---

## The Bigger Problem

The workflow problem — card creation is too slow — is real but small. It's worth $5–8/month, it's easily copied, and it disappears if Anki ships AI natively.

**The problem no tool addresses: students don't know if they're studying the right things.**

They make cards on things they already half-understand. They miss the gaps they don't know exist. They create 500 cards and still fail the exam because the cards tested recognition, not understanding. Not Anki, not ChatGPT, not any competitor solves this.

Three ways Ankimax owns this problem after the core loop is proven:

1. **Gap detection** — reads your existing deck and surfaces what's missing: "12 cards on mechanism, 0 on clinical presentation"
2. **AI that learns from your edits** — stores the delta between AI output and what you kept, improves every future card
3. **Coverage map** — tracks which topics you've carded against a syllabus, shows what's left

---

## How It Works

A lightweight floating HUD overlay. Always on top, out of the way. Starts from something the student is looking at right now — a lecture slide, a diagram, a definition — not from a blank chat.

From a screenshot, the user picks one action:

| Action | What happens |
|--------|-------------|
| **Ask** | Question + screenshot → AI answer. No card created. |
| **AI Card** | AI generates Front & Back from screenshot → draft opens for editing |
| **Manual Card** | Blank card editor opens with screenshot as reference |

If the user asks a question with no screenshot attached, the app auto-captures the full screen as context.

### AI Toggle

The AI toggle only affects card creation, not capture:

| AI State | Behavior |
|----------|----------|
| **AI ON** | Card button pre-fills Front & Back from the screenshot |
| **AI OFF** | Manual card creation — user fills Front & Back themselves |

The generated card is always a draft. The user reviews and edits before pushing to Anki.

---

## USPs

**1. Screenshot-native desktop HUD**
You're studying. You see something. You capture it without switching apps, without breaking focus. No competitor does this — Wisdolia is browser-only, AnkiBrain is inside Anki, everything else is web. The always-on-top overlay is physically unreplicable by a web tool.

**2. Your card style template = your learning voice**
You define once how cards are structured (Pareto, USMLE-style, example-based). Every card the AI generates speaks in your voice, not generic AI output. This personalization compounds — no competitor has it.

**3. Augments Anki instead of replacing it**
RemNote, Knowt, Quizlet all ask students to abandon their Anki setup. Ankimax says: keep everything, just make card creation 10x faster. The existing deck, the add-ons, the review schedule — untouched. That trust is a moat.

---

## What to Protect

**Speed of output.** The card must appear fast after the screenshot. If generation feels slow or the output needs heavy editing, users leave before they understand the value. Speed wins first impressions — this is a principle to protect from day one, not optimize later.

**The 60-second loop.** Screenshot → AI card → edit → Anki. If this loop takes longer than 60 seconds, something is wrong. Every design decision should be measured against it.

**Simplicity.** Image occlusion, batch generation, history panels — none of these make the loop faster. They make Ankimax look like every other tool. The irreplaceable version is the one where the core loop is so smooth students can't imagine doing it any other way.

**The product fails only if card quality is mediocre or you delay charging. Both are controllable.**

---

## Philosophy

- The user chooses what to capture
- The user chooses what to keep
- AI supports understanding instead of replacing it
- Every card is reviewed before export
- One card at a time — no batch generation that bypasses review

---

## Positioning

| Competitor | Their bet | Ankimax's edge |
|---|---|---|
| Turbo AI / Wisdolia | Replace the study workflow | Ankimax fits inside it |
| AnkiBrain | Inside Anki, limited capture | Ankimax starts from any screen |
| RemNote / Knowt | Replace Anki entirely | Ankimax augments the deck you already have |
| PDF-to-Anki tools | Batch generation | Ankimax preserves context, one card at a time |

---

## Long-Term Vision

Become the fastest and most intelligent interface between information a student encounters and the Anki cards they ultimately study.

After the core loop is proven: gap detection, AI that learns from edits, coverage mapping, advanced card patterns (image occlusion, cloze) — but only once real users have validated the foundation.
