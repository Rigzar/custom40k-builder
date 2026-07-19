import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    /**
     * PWA — installable on Android and iOS, and the army builder works offline.
     *
     * Offline works because every faction's data is compiled into the JS bundle, so once the
     * chunks are cached there is nothing left to fetch to build a list. Accounts, cloud saves and
     * campaigns still need the network — those hit /api and are deliberately NOT cached, so a
     * stale roster can never be served as if it were live.
     *
     * registerType 'prompt' (not 'autoUpdate'): the codex data ships inside the bundle, so a
     * silently-updating service worker could leave someone building a list against yesterday's
     * points without knowing. The app asks first — see PwaUpdatePrompt.tsx.
     */
    VitePWA({
      registerType: 'prompt',
      includeAssets: ['favicon.svg', 'apple-touch-icon.png', 'custom40k-logo.png'],
      manifest: {
        name: 'Custom40k Army Builder',
        short_name: 'Custom40k',
        description: 'Army list builder for Custom40k — a Warhammer 40,000 homebrew.',
        theme_color: '#18171a',
        background_color: '#18171a',
        display: 'standalone',
        orientation: 'any',
        start_url: '/',
        scope: '/',
        categories: ['games', 'utilities'],
        icons: [
          { src: '/pwa-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/pwa-512.png', sizes: '512x512', type: 'image/png' },
          { src: '/pwa-192-maskable.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
          { src: '/pwa-512-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        // The faction chunks are large and there are many of them — the default 2 MiB cap would
        // silently skip the biggest ones and break offline for exactly the factions that need it.
        maximumFileSizeToCacheInBytes: 8 * 1024 * 1024,
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
        // Never serve a cached API response: rosters, campaigns and admin settings must be live.
        navigateFallbackDenylist: [/^\/api\//],
        runtimeCaching: [
          {
            urlPattern: /^\/api\//,
            handler: 'NetworkOnly',
          },
        ],
      },
      devOptions: { enabled: false },
    }),
  ],
  build: {
    chunkSizeWarningLimit: 100000,
  },
})
