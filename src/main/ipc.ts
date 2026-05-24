import { ipcMain, BrowserWindow } from 'electron';
import dotenv from 'dotenv';
dotenv.config();

ipcMain.handle('app:get-version', () => {
  return '0.1.0';
});

ipcMain.handle('message:post-message', async (_event, message: string) => {
  const apiKey = process.env.GEMINI_API_KEY;
  const model = process.env.GEMINI_MODEL;
  const systemPrompt = process.env.SYSTEM_PROMPT;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const body = { systemInstruction: { parts: [{ text: systemPrompt }] }, contents: [{ parts: [{ text: message }] }] };

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const data = await res.json() as { candidates: { content: { parts: { text: string }[] } }[] };
  return data.candidates[0].content.parts[0].text;
});

ipcMain.handle('window:expand', (event) => {
  BrowserWindow.fromWebContents(event.sender)?.setSize(680, 500);
});

ipcMain.handle('window:collapse', (event) => {
  BrowserWindow.fromWebContents(event.sender)?.setSize(680, 125);
});