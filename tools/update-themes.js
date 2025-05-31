import { writeFileSync, readdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import fetch, { Headers } from 'node-fetch';

const __dirname = dirname(fileURLToPath(import.meta.url));

await fetchFromRebrickable();

async function fetchFromRebrickable() {
  const currentSize = readdirSync(
    resolve(__dirname, '..', 'src', 'content', 'themes')
  ).length;

  const themes = await fetchLegoThemes(currentSize);

  themes.forEach((theme) => {
    writeFileSync(
      resolve(
        __dirname,
        '..',
        'src',
        'content',
        'themes',
        `${theme.id}.json`
      ),
      JSON.stringify(theme, undefined, 2)
    );
  });
  console.log(`Added ${themes.length} theme(s)`);
}

async function fetchLegoThemes(currentSize) {
  const headers = new Headers();
  const api = process.env.REBRICKABLE_API;
  headers.set('Accept', 'application/json');
  headers.set('Authorization', `key ${api}`);

  const result = await fetch(
    `https://rebrickable.com/api/v3/lego/themes/?page=2&page_size=${currentSize}`,
    {
      headers,
    }
  );
  if (!result.ok) {
    if (result.status === 404) {
      console.warn('No themes to be added');
      return [];
    }
    console.error(result.status);
    throw Error(result.statusText);
  }
  const themes = mapToLegoThemes(await result.json());
  return themes;
}

function mapToLegoThemes(response) {
  return (response.results || []).map(mapToLegoTheme);
}

function mapToLegoTheme(rebrickableTheme) {
  return {
    $schema: '../theme-schema.json',
    source: 'rebrickable',
    id: `${rebrickableTheme.id}`,
    name: rebrickableTheme.name,
    parentId: rebrickableTheme.parent_id
      ? `${rebrickableTheme.parent_id}`
      : undefined,
  };
}
