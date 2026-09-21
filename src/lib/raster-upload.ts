import sharp from 'sharp';
import { imageExtension, IMAGE_MAX_BYTES } from './image-validation';
import { ImageUploadError } from './image-upload-result';

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
      throw new ImageUploadError('ANIMATED_IMAGE');
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
  let extension: string;
  try { extension = imageExtension(bytes, mime); }
  catch { throw new ImageUploadError(bytes.length > IMAGE_MAX_BYTES ? 'INPUT_TOO_LARGE' : 'INVALID_IMAGE'); }
  if (!completeContainer(bytes, extension)) throw new ImageUploadError('INVALID_IMAGE');
  const format = extension === 'jpg' ? 'jpeg' : extension;
  const decoder = sharp(bytes, { failOn: 'warning', limitInputPixels: IMAGE_MAX_PIXELS, sequentialRead: true });
  try {
    const metadata = await decoder.metadata();
    const { width, height } = metadata;
    if (metadata.format !== format || !width || !height) throw new ImageUploadError('INVALID_IMAGE');
    if ((metadata.pages ?? 1) !== 1) throw new ImageUploadError('ANIMATED_IMAGE');
    if (width > IMAGE_MAX_DIMENSION || height > IMAGE_MAX_DIMENSION || width * height > IMAGE_MAX_PIXELS) throw new ImageUploadError('IMAGE_DIMENSIONS');
    const decoded = await decoder.rotate().toColourspace('srgb').raw().timeout({ seconds: 10 }).toBuffer({ resolveWithObject: true });
    if (decoded.info.width * decoded.info.height > IMAGE_MAX_PIXELS || decoded.data.length > IMAGE_MAX_PIXELS * 4) throw new ImageUploadError('IMAGE_DIMENSIONS');
    const raw = { width: decoded.info.width, height: decoded.info.height, channels: decoded.info.channels };
    let encoded = await sharp(decoded.data, { raw })
      .toFormat(format).timeout({ seconds: 10 }).toBuffer();
    if (encoded.length > IMAGE_MAX_BYTES && format === 'png' && metadata.isPalette) {
      // Raw decoding loses indexed PNG compression. Restore it only if EVERY decoded
      // colour and alpha byte survives; never accept a lossy quantization to meet the cap.
      const fullColourBytes = encoded.length;
      const palette = await sharp(decoded.data, { raw }).png({ palette: true, colours: 256, dither: 0 })
        .timeout({ seconds: 10 }).toBuffer();
      const verifier = sharp(palette, { failOn: 'warning', limitInputPixels: IMAGE_MAX_PIXELS }).toColourspace('srgb');
      try {
        const checked = await (raw.channels === 4 ? verifier.ensureAlpha() : verifier.removeAlpha())
          .raw().timeout({ seconds: 10 }).toBuffer({ resolveWithObject: true });
        if (checked.info.width !== raw.width || checked.info.height !== raw.height || checked.info.channels !== raw.channels || !checked.data.equals(decoded.data)) {
          throw new ImageUploadError('OUTPUT_TOO_LARGE', fullColourBytes);
        }
      } finally { verifier.destroy(); }
      encoded = palette;
    }
    if (encoded.length > IMAGE_MAX_BYTES) throw new ImageUploadError('OUTPUT_TOO_LARGE', encoded.length);
    return { bytes: encoded, extension, contentType: `image/${format}` };
  } catch (error) {
    if (error instanceof ImageUploadError) throw error;
    throw new ImageUploadError('INVALID_IMAGE');
  } finally {
    decoder.destroy();
  }
}
