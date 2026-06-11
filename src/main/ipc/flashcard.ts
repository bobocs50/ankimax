import { ipcMain, clipboard } from 'electron';
import { createHash } from 'crypto';
import dotenv from 'dotenv';
import { prompts } from '../prompts';

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
const model = process.env.GEMINI_MODEL;
const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

let lastClipboardHash: string | null = null;
let pendingCardBase64: string | null = null;

// Hashing clipboard content to detect changes without storing the actual image data in memory
const getClipboardHash = (): string | null => {
  const image = clipboard.readImage();
  if (image.isEmpty()) return null;
  return createHash('md5').update(image.toPNG()).digest('hex');
};

export function register() {
  // Sets the clipboard baseline so future checks can detect new images
  ipcMain.handle('flashcard:init-clipboard-baseline', () => {
    lastClipboardHash = getClipboardHash();
    console.log('AutoAI turned on + Clipboard baseline set:', lastClipboardHash ?? 'empty');
  });

  // Returns true if a new image was copied to the clipboard since last check
  ipcMain.handle('flashcard:check-clipboard', () => {
    const hash = getClipboardHash();
    if (hash === null || hash === lastClipboardHash) return false;
    lastClipboardHash = hash;
    const image = clipboard.readImage();
    pendingCardBase64 = image.toDataURL().split(',')[1];
    return true;
  });

  // Sends the pending clipboard image to Gemini and returns a flashcard
  ipcMain.handle('flashcard:generate-card', async () => {
    if (!pendingCardBase64) return undefined;
    const base64 = pendingCardBase64;
    pendingCardBase64 = null;

    const contents = [{ role: 'user', parts: [{ inlineData: { mimeType: 'image/png', data: base64 } }] }];
    console.log('Generating flashcard from captured clipboard image');

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: prompts.flashcard }] },
        contents,
        generationConfig: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: 'object',
            properties: {
              front: { type: 'string' },
              back: { type: 'array', items: { type: 'string' } },
            },
            required: ['front', 'back'],
          },
        },
      }),
    });

    const data = await res.json() as { candidates?: { content: { parts: { text: string }[] } }[]; error?: { message: string } };
    if (!res.ok || data.error) throw new Error(data.error?.message ?? `HTTP ${res.status}`);

    const raw = JSON.parse(data.candidates![0].content.parts[0].text) as { front: string; back: string[] | string };
    const bullets = Array.isArray(raw.back) && raw.back.length > 1
      ? raw.back
      : String(raw.back).split('•').filter(s => s.trim());
    const card = { front: raw.front, back: `<ul>${bullets.map(b => `<li>${b.trim()}</li>`).join('')}</ul>` };
    console.log('Generated flashcard:', card);
    return card;
  });

  // Logs the flashcard front/back to the console (Anki integration pending)
  ipcMain.handle('flashcard:send-anki', (_event, card: { front: string; back: string }) => {
    console.log('Send to Anki:', card);
  });
}
