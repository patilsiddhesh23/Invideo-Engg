// Fallback JSX + module declarations to silence missing type errors when dependencies not yet installed.
// Remove once node_modules installed.

declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}

// Provide minimal react namespace so TS stops complaining pre-install.
declare module 'react' {
  export interface FC<P = {}> { (props: P & { children?: any }): any }
  export function useState<T>(init: T | (()=>T)): [T, (v: T)=>void];
  export function useEffect(cb: ()=>any, deps?: any[]): void;
  export function useRef<T>(v: T|null): { current: T|null };
  export const createElement: any;
}

declare module 'react-dom/client' {
  export const createRoot: any;
}
