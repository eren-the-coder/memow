declare namespace React {
  function useState<T>(initialState: T | (() => T)): [T, (value: T | ((val: T) => T)) => void];
  function useEffect(effect: () => void | (() => void), deps?: any[]): void;
  function useCallback<T extends (...args: any[]) => any>(callback: T, deps: any[]): T;
  const Fragment: any;
  const StrictMode: any;
  const ReactNode: any;
  interface DragEvent extends Event {
    dataTransfer: DataTransfer;
    preventDefault(): void;
  }
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

declare module 'react' {
  export = React;
}
