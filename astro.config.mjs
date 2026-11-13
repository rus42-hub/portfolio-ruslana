import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// three is loaded only when a 3D frame appears: list it here so the dev server prepares it at start
// instead of rebuilding it mid-page (which showed "504 Outdated Optimize Dep" and left only the poster).
const threeModules = ['three', 'three/addons/loaders/GLTFLoader.js', 'three/addons/loaders/DRACOLoader.js', 'three/addons/environments/RoomEnvironment.js', 'three/addons/postprocessing/EffectComposer.js', 'three/addons/postprocessing/RenderPass.js', 'three/addons/postprocessing/UnrealBloomPass.js', 'three/addons/postprocessing/OutputPass.js', 'three/addons/loaders/RGBELoader.js'];

export default defineConfig({
  site: process.env.SITE_URL || undefined,
  integrations: [sitemap()],
  server: { host: '127.0.0.1', port: 4330 },
  vite: {
    plugins: [tailwindcss()],
    server: { strictPort: true },
    optimizeDeps: { include: threeModules },
  },
});
