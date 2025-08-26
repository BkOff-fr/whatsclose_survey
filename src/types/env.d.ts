declare namespace NodeJS {
  interface ProcessEnv {
    // Application
    NEXT_PUBLIC_APP_NAME: string;
    NEXT_PUBLIC_APP_URL: string;
    
    // API
    NEXT_PUBLIC_API_URL?: string;
    API_KEY?: string;
    
    // Analytics
    NEXT_PUBLIC_GA_ID?: string;
    NEXT_PUBLIC_GTM_ID?: string;
    
    // Email Service
    EMAIL_SERVICE_API_KEY?: string;
    EMAIL_FROM?: string;
    EMAIL_TO?: string;
    
    // Database (si utilisé)
    DATABASE_URL?: string;
    
    // Auth (si utilisé)
    NEXTAUTH_URL?: string;
    NEXTAUTH_SECRET?: string;
    
    // Environment
    NODE_ENV: 'development' | 'production' | 'test';
    
    // Vercel
    VERCEL_URL?: string;
    VERCEL_ENV?: 'production' | 'preview' | 'development';
  }
}

// Extend Window interface for global variables
declare global {
  interface Window {
    gtag?: (
      command: 'config' | 'event' | 'js' | 'set',
      targetId: string,
      config?: any
    ) => void;
    dataLayer?: any[];
    // Three.js dev tools
    __THREE__?: any;
    // React DevTools
    __REACT_DEVTOOLS_GLOBAL_HOOK__?: any;
  }
}

// Module declarations for asset imports
declare module '*.svg' {
  const content: React.FC<React.SVGProps<SVGSVGElement>>;
  export default content;
}

declare module '*.glsl' {
  const content: string;
  export default content;
}

declare module '*.vert' {
  const content: string;
  export default content;
}

declare module '*.frag' {
  const content: string;
  export default content;
}

declare module '*.gltf' {
  const content: string;
  export default content;
}

declare module '*.glb' {
  const content: string;
  export default content;
}

declare module '*.hdr' {
  const content: string;
  export default content;
}

declare module '*.woff' {
  const content: string;
  export default content;
}

declare module '*.woff2' {
  const content: string;
  export default content;
}

// Export empty object to make this a module
export {};