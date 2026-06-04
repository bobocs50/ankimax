import { ipcMain, BrowserWindow, desktopCapturer, clipboard, systemPreferences } from 'electron';
import { createHash } from 'crypto';
import dotenv from 'dotenv';
dotenv.config();

//Hashing clipboard content to detect changes without storing the actual image data in memory

let lastClipboardHash: string | null = null;

const getClipboardHash = (): string | null => {
  const image = clipboard.readImage();
  if (image.isEmpty()) return null;
  return createHash('md5').update(image.toPNG()).digest('hex');
};

//ipcMain handlers for communication with renderer process

ipcMain.handle('flashcard:init-clipboard-baseline', () => {
  lastClipboardHash = getClipboardHash();
  console.log('Clipboard baseline set:', lastClipboardHash ?? 'empty');
});

ipcMain.handle('flashcard:get-cards', () => {
  const hash = getClipboardHash();
  if (hash !== null && hash !== lastClipboardHash) {
    lastClipboardHash = hash;
    console.log('New clipboard image detected:', hash);
  }
});

//Handler for processing user messages and generating AI responses

ipcMain.handle('message:post-message', async (_event, message: string, captureEnabled: boolean, history: { role: string; text: string }[]) => {

  const apiKey = process.env.GEMINI_API_KEY;
  const model = process.env.GEMINI_MODEL;
  const systemPrompt = process.env.SYSTEM_PROMPT;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const currentParts: object[] = [{ text: message }];

  if (captureEnabled) {
    const sources = await desktopCapturer.getSources({ types: ['screen'], thumbnailSize: { width: 1920, height: 1080 } });
    const thumbnail = sources[0].thumbnail;
    const base64 = thumbnail.toDataURL().split(',')[1];
    currentParts.push({ inlineData: { mimeType: 'image/png', data: base64 } });
    console.log('Captured screen and added to message parts');
  }

  const contents = [
    ...history.map(m => ({ role: m.role === 'user' ? 'user' : 'model', parts: [{ text: m.text }] })),
    { role: 'user', parts: currentParts },
  ];

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: systemPrompt }] },
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