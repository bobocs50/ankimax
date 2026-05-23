import { ipcMain, BrowserWindow } from 'electron';
import dotenv from 'dotenv';
dotenv.config();

ipcMain.handle('app:get-version', () => {
  return '0.1.0';
});

ipcMain.handle('message:post-message', async (_event, message: string) => {
  const apiKey = process.env.GEMINI_API_KEY;
  const model = process.env.GEMINI_MODEL ?? 'gemini-2.5-flash';


  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contents: [{ parts: [{ text: message }] }] }),
  });
  const data = await res.json() as { candidates: { content: { parts: { text: string }[] } }[] };
  console.log(data.candidates[0].content.parts[0].text);
});

ipcMain.handle('window:expand', (event) => {
  BrowserWindow.fromWebContents(event.sender)?.setSize(680, 500);
});

ipcMain.handle('window:collapse', (event) => {
  BrowserWindow.fromWebContents(event.sender)?.setSize(680, 125);
});