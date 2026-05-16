// Global type declarations
declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }

  namespace React {
    interface DragEvent extends Event {
      dataTransfer: DataTransfer;
      preventDefault(): void;
    }
  }
}

export {};
