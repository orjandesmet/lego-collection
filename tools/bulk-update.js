import { readdirSync, readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { resolve, dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

const collection = 'sets';

const legoSetFiles = readdirSync(
  resolve(__dirname, '..', 'src', 'content', collection)
);
legoSetFiles
  .filter((file) => file.endsWith('.json'))
  .forEach(async (file) => {
    console.log('Going for file', file);
    const filePath = resolve(
      __dirname,
      '..',
      'src',
      'content',
      collection,
      file
    );
    const fileContent = readFileSync(filePath);
    const legoSet = JSON.parse(fileContent.toString('utf-8'));
    legoSet.themeId = `${legoSet.themeId}`;
    if (legoSet.themes?.length) {
      legoSet.themes = legoSet.themes.map((theme) => `${theme.themeId}`);
      writeFileSync(filePath, JSON.stringify(legoSet, undefined, 2));
    }
  });
