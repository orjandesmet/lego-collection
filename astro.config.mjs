import { defineConfig, fontProviders } from 'astro/config';

import robots from 'astro-robots';

import netlify from '@astrojs/netlify';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://lego.orjan.be/',

  // Needed for robotsTxt
  integrations: [
    robots({
      sitemap: false,
      policy: [
        {
          userAgent: '*',
          // The next line enables or disables the crawling on the `robots.txt` level
          disallow: ['/'],
        },
      ],
    }),
  ],

  output: 'static',
  adapter: netlify(),
  fonts: [
    {
      provider: fontProviders.google(),
      name: 'Chivo',
      cssVariable: '--font-sans',
      weights: [400, 600, 700],
      fallbacks: ['Avenir Next', 'Trebuchet MS', 'sans-serif'],
      styles: ['normal'],
    },
    {
      provider: fontProviders.google(),
      name: 'Sora',
      cssVariable: '--font-heading',
      weights: [500, 700, 800],
      fallbacks: ['Franklin Gothic Medium', 'Trebuchet MS', 'sans-serif'],
      styles: ['normal'],
    },
  ],

  vite: {
    plugins: [tailwindcss()],
  },
});
