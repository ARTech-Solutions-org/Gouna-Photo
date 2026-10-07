// El Gouna Film Festival Photo Booth — API Client

import type { GenerationResult } from '../types';

const API_BASE = '';

/**
 * Generate an AI image placing the user into the selected movie poster.
 */
export async function generateImage(
  photoBase64: string,
  movieId: string,
  aiPrompt: string,
  sessionId: string
): Promise<GenerationResult> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 90000); // 90s timeout

  try {
    const response = await fetch(`${API_BASE}/api/gouna/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        imageBase64: photoBase64,
        mimeType: 'image/jpeg',
        movieId,
        aiPrompt,
        sessionId,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `API error: ${response.status}`);
    }

    const data = await response.json();
    if (!data.imageBase64) {
      throw new Error('No image data in response');
    }

    return {
      imageBase64: data.imageBase64,
      mimeType: data.mimeType || 'image/jpeg',
    };
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Upload the final image to storage and get a public URL.
 * Returns the public image URL.
 */
export async function uploadImage(imageBase64: string): Promise<string> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 60000); // 60s timeout

  try {
    const response = await fetch(`${API_BASE}/api/gouna/upload`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({ imageBase64 }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Upload error: ${response.status}`);
    }

    const data = await response.json();
    if (!data.url) {
      throw new Error('No URL in upload response');
    }

    return data.url;
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Compress a canvas/image to JPEG with given quality and max dimension.
 */
export async function compressImage(
  dataUrl: string,
  maxDimension = 1024,
  quality = 0.85
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let { width, height } = img;

      if (width > maxDimension || height > maxDimension) {
        if (width > height) {
          height = Math.round((height * maxDimension) / width);
          width = maxDimension;
        } else {
          width = Math.round((width * maxDimension) / height);
          height = maxDimension;
        }
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
    img.onerror = reject;
    img.src = dataUrl;
  });
}
