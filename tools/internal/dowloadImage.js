import { createWriteStream } from 'fs';
import fetch, { Headers } from 'node-fetch';
import { fileURLToPath } from 'url';
import { resolve, dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

export async function downloadImage(setNumber, imgUrl) {
  const headers = new Headers();
  const api = process.env.REBRICKABLE_API;
  headers.set('Accept', 'application/json');
  headers.set('Authorization', `key ${api}`);

  const result = await fetch(imgUrl, {
    headers,
  });
  if (!result.ok) {
    console.log(imgUrl);
    throw Error(result.statusText);
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
