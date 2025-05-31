import { writeFileSync, readFileSync, createWriteStream, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import fetch, { Headers } from 'node-fetch';
import { setOutput } from '@actions/core';

const __dirname = dirname(fileURLToPath(import.meta.url));

import './update-themes.js';
// argv[2]: setNumber: string
// argv[3]: isWishlist: 'true' | 'false'
fetchFromRebrickable(process.argv[2], process.argv[3]);

/**
 * Fetches lego-set data from Rebrickable
 * @param {string} setNumber - the number of the set
 * @param {string} isWishlist - is this set on the wishlist
 * @returns {object}
 */
async function fetchFromRebrickable(setNumber, isWishlist) {
  const set = await getLegoSet(setNumber);
  set.wishlist = isWishlist === 'true';
  writeFileSync(
    resolve(
      __dirname,
      '..',
      'src',
      'content',
      setNumber.startsWith('71') ? 'minifigures' : 'sets',
      `${set.setNumber}.json`
    ),
    JSON.stringify(set, undefined, 2)
  );
  setOutput("setNumber", set.setNumber);
  setOutput("setName", set.name);
  setOutput("collection", setNumber.startsWith('71') ? 'minifigure' : 'set');
}

async function getLegoSet(setNumber) {
  if (!setNumber.includes('-')) {
    setNumber += '-1';
  }
  console.log(`Getting data from ${setNumber} from Rebrickable`);
  const set = await fetchLegoSet(`${setNumber}`);
  console.log(
    `Found ${setNumber.startsWith('71') ? 'minifigure' : 'set'} '${set.name}' on Rebrickable`
  );
  set.themes = getTheme(set.themeId);
  await downloadImage(set.setNumber, set.img);
  set.img = `./img/${set.setNumber}.jpg`;
  return set;
}

function getTheme(themeId) {
  const themeFilePath = resolve(
    __dirname,
    '..',
    'src',
    'content',
    'themes',
    `${themeId}.json`
  );
  if (!existsSync(themeFilePath)) {
    console.warn(`Theme file path ${themeFilePath} does not exist`);
  }
  const themeContent = readFileSync(themeFilePath);
  const theme = JSON.parse(themeContent);
  console.log(`Theme ${themeId} has parent theme ${theme.parentId}`);
  const parentTheme = theme.parentId ? getTheme(theme.parentId) : [];
  return [...parentTheme, `${theme.id}`];
}

async function fetchLegoSet(setNumber) {
  const headers = new Headers();
  const api = process.env.REBRICKABLE_API;
  headers.set('Accept', 'application/json');
  headers.set('Authorization', `key ${api}`);

  const result = await fetch(
    `https://rebrickable.com/api/v3/lego/sets/${setNumber}`,
    {
      headers,
    }
  );
  if (!result.ok) {
    throw Error(result.statusText);
  }
  const setInfo = mapToLegoSet(await result.json());
  return setInfo;
}

async function downloadImage(setNumber, imgUrl) {
  const result = await fetch(imgUrl);
  if (!result.ok) {
    writeFileSync(
      resolve(__dirname, '..', 'errors.txt'),
      `${setNumber} - ${imgUrl} - ${result.statusText}`
    );
    return;
  }
  const fileStream = createWriteStream(
    resolve(
      __dirname,
      '..',
      'src',
      'content',
      setNumber.startsWith('71') ? 'minifigures' : 'sets',
      'img',
      `${setNumber}.jpg`
    )
  );
  await new Promise((resolve, reject) => {
    result.body.pipe(fileStream);
    result.body.on('error', reject);
    fileStream.on('finish', resolve);
  });
}

function mapToLegoSet(dto) {
  return createLegoSet({
    source: 'rebrickable',
    setNumber: dto.set_num,
    img: dto.set_img_url,
    name: dto.name,
    year: dto.year,
    themeId: `${dto.theme_id}`,
    parts: dto.num_parts,
  });
}

function createLegoSet(partial = {}) {
  return {
    $schema: '../set-schema.json',
    source: 'rebrickable',
    setNumber: '',
    name: '',
    img: '',
    year: 0,
    themeId: 0,
    themes: [],
    parts: 1,
    wishlist: false,
    ...partial,
  };
}
