import { defineConfig } from 'astro/config'
import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'

import tailwind from '@astrojs/tailwind'

// https://astro.build/config
export default defineConfig({
  site: 'https://workdone0.github.io',
  base: '/',
  integrations: [tailwind(), mdx(), sitemap()],
  markdown: {
    shikiConfig: {
      themes: {
        light: 'poimandres',
        dark: 'catppuccin-latte',
      },
    },
  },

})
