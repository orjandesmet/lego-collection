import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

import robots from 'astro-robots';

import netlify from '@astrojs/netlify';

// https://astro.build/config
export default defineConfig({
  site: 'https://lego.orjan.be/',

  // Needed for robotsTxt
  integrations: [
    tailwind(),
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
});
