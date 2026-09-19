import sharp from 'sharp';
import { imageExtension, IMAGE_MAX_BYTES } from './image-validation';

export const IMAGE_MAX_DIMENSION = 8192;
export const IMAGE_MAX_PIXELS = 24_000_000;

function completeContainer(bytes: Uint8Array, extension: string): boolean {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  if (extension === 'jpg') return bytes.length >= 4 && bytes.at(-2) === 255 && bytes.at(-1) === 217;
  if (extension === 'gif') return bytes.length >= 14 && bytes.at(-1) === 59;
  if (extension === 'webp') return bytes.length >= 20 && view.getUint32(4, true) + 8 === bytes.length;
  let offset = 8;
  while (offset + 12 <= bytes.length) {
    const length = view.getUint32(offset);
    const end = offset + 12 + length;
    if (end > bytes.length) return false;
    // Sharp's PNG metadata does not reliably expose APNG frame counts.
    const chunkType = view.getUint32(offset + 4);
    if (chunkType === 0x6163544c || chunkType === 0x6663544c || chunkType === 0x66644154) {
      throw new Error('Animated PNG images are not supported; choose a non-animated image');
    }
    if (bytes[offset + 4] === 73 && bytes[offset + 5] === 69 && bytes[offset + 6] === 78 && bytes[offset + 7] === 68) {
      return length === 0 && end === bytes.length;
    }
    offset = end;
  }
  return false;
}

/** Decode every accepted pixel before upload; re-encode without metadata or trailing payloads. */
export async function prepareRasterUpload(bytes: Uint8Array, mime: string) {
  const extension = imageExtension(bytes, mime);
  if (!completeContainer(bytes, extension)) throw new Error('Image is incomplete or contains trailing data');
  const format = extension === 'jpg' ? 'jpeg' : extension;
  const decoder = sharp(bytes, { failOn: 'warning', limitInputPixels: IMAGE_MAX_PIXELS, sequentialRead: true });
  try {
    const metadata = await decoder.metadata();
    const { width, height } = metadata;
    if (metadata.format !== format || !width || !height || width > IMAGE_MAX_DIMENSION || height > IMAGE_MAX_DIMENSION ||
        width * height > IMAGE_MAX_PIXELS || (metadata.pages ?? 1) !== 1) {
      throw new Error('Unsupported image dimensions or animation');
    }
    const decoded = await decoder.rotate().toColourspace('srgb').raw().timeout({ seconds: 10 }).toBuffer({ resolveWithObject: true });
    if (decoded.info.width * decoded.info.height > IMAGE_MAX_PIXELS || decoded.data.length > IMAGE_MAX_PIXELS * 4) throw new Error('Image pixel limit exceeded');
    const encoded = await sharp(decoded.data, { raw: { width: decoded.info.width, height: decoded.info.height, channels: decoded.info.channels } })
      .toFormat(format).timeout({ seconds: 10 }).toBuffer();
    if (encoded.length > IMAGE_MAX_BYTES) throw new Error('Encoded image exceeds size limit');
    return { bytes: encoded, extension, contentType: `image/${format}` };
  } catch {
    throw new Error('Choose a complete, non-animated JPG, PNG, WEBP or GIF up to 5 MB, 8192 pixels per side and 24 megapixels.');
  } finally {
    decoder.destroy();
  }
}
