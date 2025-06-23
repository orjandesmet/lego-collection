import { createWriteStream } from 'fs';
import fetch from 'node-fetch';
import { fileURLToPath } from 'url';
import { resolve, dirname } from 'path';
import { fileTypeFromBuffer } from 'file-type';

const __dirname = dirname(fileURLToPath(import.meta.url));

export async function downloadImage(setNumber, isMinifig, imgUrl) {
  const result = await fetch(imgUrl);
  if (!result.ok) {
    writeFileSync(
      resolve(__dirname, '..', '..', 'errors.txt'),
      `${setNumber} - ${imgUrl} - ${result.statusText}`
    );
    return;
  }

  // Read the response body as an ArrayBuffer and convert it to a Buffer
  const arrayBuffer = await result.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // Detect the file type using file-type
  const fileType = await fileTypeFromBuffer(buffer);
  const resolvedExtension = fileType ? fileType.ext : 'bin';

  const fileStream = createWriteStream(
    resolve(
      __dirname,
      '..',
      '..',
      'src',
      'content',
      isMinifig ? 'minifigs' : 'sets',
      'img',
      `${setNumber}.${resolvedExtension}`
    )
  );
  // Write the buffer to the file stream
  fileStream.write(buffer);
  fileStream.end();
  return `./img/${setNumber}.${resolvedExtension}`;
}
