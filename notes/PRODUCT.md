# Product

Ankimax is a desktop application built specifically for existing Anki users.

It is not a flashcard app and it is not a replacement for Anki.

Ankimax acts as a capture, understanding, and card-creation layer that sits on top of a student's normal study workflow and connects directly into Anki.

## The Problem

Students constantly encounter information they want to remember — lecture slides, diagrams, PDFs, videos, websites, textbooks, notes.

Turning those materials into high-quality Anki cards is slow, repetitive, and fragmented.

Current workflow:

Study Material → Screenshot → ChatGPT → Copy/Paste → Edit → Anki

Ankimax compresses this into:

Capture → Understand → Create Card → Review → Save to Anki

## The Application

A lightweight floating HUD overlay. Always on top, out of the way.

Ankimax starts from something the student is looking at right now — a lecture slide, a diagram, a definition, a problem. Not from a blank chat.

From a screenshot, the user picks one explicit action:

| Action | What happens |
|--------|-------------|
| **Ask** | Question + screenshot → AI answer. No card created. |
| **AI Card** | AI generates Front & Back from screenshot → draft opens for editing |
| **Manual Card** | Blank card editor opens with screenshot as reference |

If the user asks a question with no screenshot attached, the app auto-captures the full screen as context.

## AI Toggle

The AI toggle only affects card creation, not capture:

| AI State | Behavior |
|----------|----------|
| **AI OFF** | Manual card creation. User fills Front & Back themselves. |
| **AI ON** | Card button pre-fills Front & Back from the screenshot. |

The generated card is always a draft. The user reviews and edits before pushing to Anki.

## Philosophy

- The user chooses what to capture
- The user chooses what to keep
- AI supports understanding instead of replacing it
- Every card is reviewed before export
- One card at a time — no batch generation that bypasses review

## Positioning

Unlike PDF-to-Anki generators, Ankimax focuses on context preservation.

Unlike premade decks, Ankimax focuses on personal learning material.

Unlike generic AI flashcard tools, Ankimax focuses on structured card workflows, editing control, reusable presets, and direct Anki integration.

## Long-Term Vision

Become the fastest and most intelligent interface between information a student encounters and the Anki cards they ultimately study.

Later: advanced flashcard patterns (image occlusion, cloze), custom generation styles, richer study workflows — but only after the core loop is proven.

## The Real Problem

The current workflow problem — card creation is too slow — is real but small. It's worth $5-8/month, it's easily copied, and it disappears if Anki ships AI natively.

The big problem no tool addresses: **students don't know if they're studying the right things.**

They make cards on things they already half-understand. They miss the gaps they don't know exist. They create 500 cards and still fail the exam because the cards tested recognition, not understanding. Not Anki, not ChatGPT, not any competitor solves this.

### Three ways to own this problem

**1. Gap detection**
Ankimax reads your existing Anki deck before you make a new card. It tells you: "you have 12 cards on the mechanism but nothing on the clinical presentation." You're not just creating — you're covering.

**2. Card quality scoring before push**
Before a card hits Anki, Ankimax rates it: too vague, too surface-level, tests recognition not application. Students learn to make better cards. The tool teaches judgment, not just speed.

**3. Study material coverage map**
Upload a syllabus or topic list. Ankimax tracks what you've carded and what you haven't. A progress bar on your exam prep. "You've covered 68% of renal — here's what's missing."

---

## USPs

**1. Screenshot-native desktop HUD**
You're studying. You see something. You capture it without switching apps, without breaking focus. No competitor does this — Wisdolia is browser-only, AnkiBrain is inside Anki, everything else is web. The always-on-top overlay is physically unreplicable by a web tool.

**2. Your card style template = your learning voice**
You define once how cards are structured (Pareto, USMLE-style, example-based). Every card the AI generates speaks in your voice, not generic AI voice. This is personalization that compounds. No competitor has this.

**3. Augments Anki instead of replacing it**
RemNote, Knowt, Quizlet all ask students to abandon their Anki setup. Ankimax says: keep everything, just make card creation 10x faster. The existing user's 5,000-card deck, their add-ons, their review schedule — untouched. That trust is a moat.

## What to Protect

Feature creep kills simplicity. Image occlusion, batch generation, history panels — these don't make the loop faster. They make Ankimax look like every other tool. The irreplaceable version of Ankimax is the one where the 60-second screenshot-to-Anki loop is so smooth that students can't imagine doing it any other way.

The product is destined to fail only if card quality is mediocre and you delay charging. Both are controllable.
