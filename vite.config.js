import { fileURLToPath, URL } from 'node:url'
import { dirname, resolve } from 'node:path'
import { copyFileSync } from 'node:fs'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import VueDevTools from 'vite-plugin-vue-devtools'
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite'

// Plugin: copy dist/index.html → dist/404.html so GitHub Pages serves the SPA
// for any unmatched route (e.g. direct navigation to /office).
function githubPagesSpaFallback() {
  return {
    name: 'github-pages-spa-fallback',
    closeBundle() {
      copyFileSync('dist/index.html', 'dist/404.html')
    }
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    VueDevTools(),
    vueJsx(),
    VueI18nPlugin({
      include: resolve(dirname(fileURLToPath(import.meta.url)), 'src/locales/**')
    }),
    githubPagesSpaFallback()
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    sourcemap: true
  }
})
