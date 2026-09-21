export const IMAGE_UPLOAD_MESSAGES = {
  NO_FILE: 'Choose an image first.',
  INPUT_TOO_LARGE: 'The selected file exceeds 5 MiB. Choose a smaller image.',
  UNSUPPORTED_TYPE: 'Choose a non-animated JPG, PNG, WEBP or GIF image.',
  INVALID_IMAGE: 'This image could not be fully decoded. Export a new JPG, PNG, WEBP or GIF and try that file.',
  ANIMATED_IMAGE: 'Animation is not supported. Export a single, non-animated image.',
  IMAGE_DIMENSIONS: 'Use an image no larger than 8192 pixels on either side and 24 megapixels in total.',
  OUTPUT_TOO_LARGE: 'The safely processed image exceeds 5 MiB. Reduce its dimensions and try again.',
  STORAGE_CONFIG: 'Image storage is not configured correctly. Contact the site administrator; do not share any keys in this form.',
  STORAGE_AUTH: 'Image storage denied access. Contact the site administrator to check the configured project, server key and storage permissions.',
  STORAGE_UNAVAILABLE: 'Image storage is unavailable. Contact the site administrator before retrying.',
  STORAGE_REJECTED: 'Image storage rejected the file. Contact the site administrator to check the bucket upload limits.',
  UPLOAD_FAILED: 'The upload could not be confirmed. Contact the site administrator before retrying.',
} as const;

export type ImageUploadCode = keyof typeof IMAGE_UPLOAD_MESSAGES;
export type ImageUploadResult = { ok: true; url: string } | { ok: false; code: ImageUploadCode; message: string };

export class ImageUploadError extends Error {
  constructor(public readonly code: ImageUploadCode, public readonly processedBytes?: number) {
    super(IMAGE_UPLOAD_MESSAGES[code]);
  }
}

export function imageUploadFailure(code: ImageUploadCode, processedBytes?: number): ImageUploadResult {
  const size = code === 'OUTPUT_TOO_LARGE' && Number.isSafeInteger(processedBytes) && processedBytes! > 0
    ? ` Processed size: ${processedBytes} bytes; limit: 5242880 bytes.` : '';
  return { ok: false, code, message: IMAGE_UPLOAD_MESSAGES[code] + size };
}
