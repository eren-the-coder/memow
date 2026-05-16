declare module 'react/jsx-runtime' {
  export const Fragment: any;
  export const jsx: any;
  export const jsxs: any;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}
