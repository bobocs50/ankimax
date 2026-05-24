export {};

declare global {
  interface Window {
    api: {
      getVersion: () => Promise<string>;
      postMessage: (message: string) => Promise<string>;
      expandWindow: () => Promise<void>;
      collapseWindow: () => Promise<void>;
    };
  }
}
