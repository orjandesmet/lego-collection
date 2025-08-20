import { defineConfig } from 'astro/config';

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

  vite: {
    plugins: [tailwindcss()],
  },
});
