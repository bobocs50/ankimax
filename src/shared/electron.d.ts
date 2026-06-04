export {};

declare global {
  interface Window {
    api: {
      getVersion: () => Promise<string>;
      postMessage: (message: string, captureEnabled: boolean, history: { role: 'user' | 'assistant'; text: string }[]) => Promise<string>;
      initClipboardBaseline: () => Promise<void>;
      getCards: () => Promise<{ front: string; back: string } | undefined>;
      expandWindow: () => Promise<void>;
      collapseWindow: () => Promise<void>;
    };
  }
}
