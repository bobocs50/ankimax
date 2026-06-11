import { ipcMain, desktopCapturer } from 'electron';
import { mainWindow } from '../main';
import dotenv from 'dotenv';
import { prompts } from '../prompts';

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
const model = process.env.GEMINI_MODEL;
const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

export function register() {
  // Sends a chat message to Gemini, optionally attaching a screenshot
  ipcMain.handle('message:post-message', async (_event, message: string, captureScreenEnabled: boolean, history: { role: string; text: string }[]) => {
    const currentParts: object[] = [{ text: message }];

    if (captureScreenEnabled) {
      mainWindow?.setContentProtection(true);
      const sources = await desktopCapturer.getSources({ types: ['screen'], thumbnailSize: { width: 1920, height: 1080 } });
      mainWindow?.setContentProtection(false);
      const thumbnail = sources[0].thumbnail;
      const png = thumbnail.toPNG();
      const base64 = png.toString('base64');
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
}
