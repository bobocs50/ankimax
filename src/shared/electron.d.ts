export {};

declare global {
  interface Window {
    api: {
      getVersion: () => Promise<string>;
      postMessage: (message: string, captureScreenEnabled: boolean, history: { role: 'user' | 'assistant'; text: string }[]) => Promise<string>;
      initClipboardBaseline: () => Promise<void>;
      checkClipboard: () => Promise<boolean>;
      generateCard: () => Promise<{ front: string; back: string } | undefined>;
      sendAnki: (card: { front: string; back: string }) => Promise<void>;
      expandWindow: () => Promise<void>;
      collapseWindow: () => Promise<void>;
    };
  }
}
