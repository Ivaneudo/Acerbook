/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly PROD: boolean;
  readonly DEV: boolean;
  readonly VITE_ENABLE_CSV_IMPORT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}