import { ipcMain, BrowserWindow, desktopCapturer, clipboard } from 'electron';
import { createHash } from 'crypto';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { prompts } from './prompts';

const screenshotsDir = path.join(__dirname, '../../src/main/screenshots');
dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
const model = process.env.GEMINI_MODEL;
const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

// Hashing clipboard content to detect changes without storing the actual image data in memory

let lastClipboardHash: string | null = null;
let pendingCardBase64: string | null = null;

const getClipboardHash = (): string | null => {
  const image = clipboard.readImage();
  if (image.isEmpty()) return null;
  return createHash('md5').update(image.toPNG()).digest('hex');
};

// ipcMain handlers for communication with renderer process

ipcMain.handle('flashcard:init-clipboard-baseline', () => {
  lastClipboardHash = getClipboardHash();
  console.log('AutoAI turned on + Clipboard baseline set:', lastClipboardHash ?? 'empty');
});

ipcMain.handle('flashcard:check-clipboard', () => {
  const hash = getClipboardHash();
  if (hash === null || hash === lastClipboardHash) return false;
  lastClipboardHash = hash;
  const image = clipboard.readImage();
  pendingCardBase64 = image.toDataURL().split(',')[1];
  return true;
});

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
  const card = { front: raw.front, back: bullets.map(b => `• ${b.trim()}`).join('\n') };
  console.log('Generated flashcard:', card);
  return card;
});

// Handler for processing user messages and generating AI responses

ipcMain.handle('message:post-message', async (_event, message: string, captureScreenEnabled: boolean, history: { role: string; text: string }[]) => {

  const currentParts: object[] = [{ text: message }];

  if (captureScreenEnabled) {
    const sources = await desktopCapturer.getSources({ types: ['screen'], thumbnailSize: { width: 1920, height: 1080 } });
    const thumbnail = sources[0].thumbnail;
    const png = thumbnail.toPNG();
    const base64 = png.toString('base64');
    fs.mkdirSync(screenshotsDir, { recursive: true });
    fs.writeFileSync(path.join(screenshotsDir, `${Date.now()}.png`), png);
    console.log('Captured screen, saved to', screenshotsDir);
    currentParts.push({ inlineData: { mimeType: 'image/png', data: base64 } });
  }

  const contents = [
    ...history.map(m => ({ role: m.role === 'user' ? 'user' : 'model', parts: [{ text: m.text }] })),
    { role: 'user', parts: currentParts },
  ];

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: prompts.chat }] },
      contents,
    }),
  });

  const data = await res.json() as { candidates?: { content: { parts: { text: string }[] } }[]; error?: { message: string } };
  if (!res.ok || data.error) throw new Error(data.error?.message ?? `HTTP ${res.status}`);
  return data.candidates![0].content.parts[0].text;
});

// Handlers for window resizing based on user interactions in the renderer process

ipcMain.handle('window:expand', (event) => {
  BrowserWindow.fromWebContents(event.sender)?.setSize(680, 500);
});

ipcMain.handle('window:collapse', (event) => {
  BrowserWindow.fromWebContents(event.sender)?.setSize(680, 125);
});
