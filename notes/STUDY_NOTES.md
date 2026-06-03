# Study Notes (personal — not for Claude)

This file is for me to jot down things I'm learning while building this project. Not instructions or context for Claude.

---

## #1 — Window Management: main.ts vs ipc.ts

- `main.ts` owns the real window logic: creating the window, storing its reference, deciding when to open, close, or restore it
- `ipc.ts` only registers commands — it can call those window functions but should never hold the window reference itself
- `main.ts` = state owner, `ipc.ts` = bridge for actions triggered from shortcuts, menu items, or the renderer

**Example:**

```ts
// main.ts — owns the window
let win: BrowserWindow | null = null;

export function createWindow() {
  win = new BrowserWindow({ ... });
}

export function toggleWindow() {
  if (win?.isVisible()) win.hide();
  else win?.show();
}

// ipc.ts — just wires up the command
import { toggleWindow } from './main';

ipcMain.handle('toggle-window', () => toggleWindow());
```

---

## #2 — React Event Objects

An event object is what React automatically passes into your event handler. It contains info about what just happened (which key was pressed, what was typed, etc.).

Which type of event object you get depends on which listener you use:

| Listener | Event type | What you use |
|----------|-----------|--------------|
| `onChange` | `ChangeEvent` | `e.target.value` — the current text in the input |
| `onKeyDown` | `KeyboardEvent` | `e.key` — which key was pressed, e.g. `'Enter'` |
| `onClick` | `MouseEvent` | `e.clientX` — where the mouse clicked |

**Example — typing in a box and pressing Enter to send:**

```tsx
// 1. User types → onChange fires → e.target.value is the new text
const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setMessage(e.target.value);
};

// 2. User presses a key → onKeyDown fires → e.key tells you which key
const handleKeyDown = (e: React.KeyboardEvent) => {
  if (e.key === 'Enter') {
    sendMessage(); // only send when Enter is pressed
  }
};

<input onChange={handleChange} onKeyDown={handleKeyDown} />
```

Think of it like this: React calls your function and hands you a note (`e`) that says exactly what happened. The note looks different depending on what the user did.

---

## #3 — Scrolling to a Specific Element with useRef

When you want to scroll to a specific DOM element (e.g. scroll your new message to the top of the chat), you use a `ref`.

**The pieces:**

```ts
const newUserMsgRef = useRef<HTMLDivElement>(null); // starts empty
const [newMsgIndex, setNewMsgIndex] = useState<number | null>(null); // tracks which message is new
```

**On submit, save the index before adding the message:**

```ts
setNewMsgIndex(messages.length); // e.g. 3
setMessages(prev => [...prev, { role: 'user', text: message }]);
```

**In the list, attach the ref only to the new message:**

```tsx
<div
  key={i}
  ref={msg.role === 'user' && i === newMsgIndex ? newUserMsgRef : null}
>
```

The loop runs for every message (i = 0, 1, 2, 3...). Only when `i === newMsgIndex` (e.g. `3 === 3`) does the condition become true and the ref gets attached. All others get `null`.

**The effect scrolls it into view when the index changes:**

```ts
useEffect(() => {
  if (newMsgIndex === null || !newUserMsgRef.current) return;
  newUserMsgRef.current.scrollIntoView({ block: 'start', behavior: 'smooth' });
}, [newMsgIndex]);
```

- `block: 'start'` — aligns the element to the top of the scroll area
- `behavior: 'smooth'` — animates instead of jumping

**In short:** save the index → React attaches the ref to that one div → effect fires → scroll.

---

