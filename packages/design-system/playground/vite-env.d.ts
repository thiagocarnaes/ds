/// <reference types="vite/client" />

// Allows importing any file as raw text via ?raw suffix
declare module '*?raw' {
  const content: string
  export default content
}
