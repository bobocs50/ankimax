import { useEffect, useState } from 'react';

export default function App() {
  const [version, setVersion] = useState<string>('...');

  useEffect(() => {
    void window.api.getVersion().then(setVersion);
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-slate-100">
      <section className="w-full max-w-2xl rounded-3xl border border-slate-800 bg-slate-900/80 p-10 shadow-2xl shadow-slate-950/50">
        <p className="text-sm uppercase tracking-[0.3em] text-cyan-400">
          Electron Scaffold
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight">
          React renderer, Node-backed main process.
        </h1>
        <p className="mt-4 text-base leading-7 text-slate-300">
          This project is wired up with Electron, Vite, React, Tailwind, and
          TypeScript. Replace this screen with your actual UI.
        </p>
        <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-950/80 px-4 py-3 text-sm text-slate-400">
          Main process bridge check: v{version}
        </div>
      </section>
    </main>
  );
}
