declare module 'fathom'
export declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fathom: any
  }
}

declare module 'Desmos'
export declare global {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let Desmos: any
}
