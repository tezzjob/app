/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_ENDPOINT_URL: string; // ✅ Add all your Vite env variables here
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
