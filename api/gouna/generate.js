// Vercel Serverless Function — /api/gouna/generate
// Uses Gemini Flash experimental models for image generation

export const config = {
  api: {
    bodyParser: { sizeLimit: '20mb' },
    maxDuration: 60,
  },
};

import fs from 'fs';
import path from 'path';

const CANDIDATE_MODELS = [
  'gemini-3-pro-image-preview',
  'gemini-3.1-flash-image-preview',
  'gemini-2.5-flash-image',
];

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    console.error('Gemini API key is not set in environment variables');
    return res.status(503).json({ error: 'Gemini API key is not configured on server.' });
  }

  const { imageBase64, mimeType = 'image/jpeg', aiPrompt, movieId } = req.body ?? {};

  if (!imageBase64 || !aiPrompt) {
    return res.status(400).json({ error: 'Missing image or prompt data.' });
  }

  const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');

  // Map movieId to the poster filename
  const posterFiles = {
    'emara-w-kebeba': 'yacoubian.jpg',
    'bab-el-hadid': 'cairo-station.jpg',
    'ismail-yassin': 'ismail-yassin.jpg',
    'el-ardh': 'el-ardh.jpg',
    'el-wedad': 'farewell-bonaparte.jpg',
    'khalli-balak': 'zuzu.jpg',
    'el-harreef': 'el-harreef.png',
    'welad-el-eih': 'welad-el-eih.png',
    'el-ayam': 'el-ayam.png',
    'the-godfather': 'the-godfather.png',
  };

  const posterFilename = posterFiles[movieId];
  let posterBase64 = '';
  let posterMime = 'image/jpeg';
  
  if (posterFilename) {
    try {
      const posterPath = path.join(process.cwd(), 'public', 'posters', posterFilename);
      const posterBuffer = fs.readFileSync(posterPath);
      posterBase64 = posterBuffer.toString('base64');
      posterMime = posterFilename.endsWith('.png') ? 'image/png' : 'image/jpeg';
    } catch (e) {
      console.warn('Could not read poster file:', posterFilename, e.message);
    }
  }

  const heroDescriptions = {
    'emara-w-kebeba': 'the main man looking forward',
    'bab-el-hadid': 'the man in the center',
    'ismail-yassin': 'the comedic man in military uniform',
    'el-ardh': 'the man in the center looking determined',
    'el-wedad': 'the main character in the center',
    'khalli-balak': 'the main dancing woman in the center',
    'el-harreef': 'the man in the blue shirt holding a ball with his foot',
    'welad-el-eih': 'the main man in the center of the poster running shirtless',
    'el-ayam': 'the man in the center wearing round dark glasses',
    'the-godfather': 'the man in the center wearing a tuxedo with a red rose',
  };
  const hero = heroDescriptions[movieId] || 'the main man in the center of the poster';

  const parts = [];

  if (posterBase64) {
    parts.push({ text: 'Image 1 (the poster to edit):' });
    parts.push({
      inline_data: {
        mime_type: posterMime,
        data: posterBase64,
      },
    });
  }

  parts.push({ text: 'Image 2 (the person to insert):' });
  parts.push({
    inline_data: {
      mime_type: mimeType,
      data: cleanBase64,
    },
  });

  parts.push({
    text: `Image 1 is a vintage movie poster. Image 2 is a photo of a real person.

Create the poster again with ${hero} replaced by the person from Image 2.
The new person's face must be clearly the face from Image 2 (same eyes, nose, mouth, jawline, skin tone, hair). The original actor's face must not appear anywhere.
Keep the original body pose, clothes, lighting, grain and color grading, so the person looks printed as part of the poster.
Keep the background, title, and all Arabic and English text unchanged.

Output the final poster as an image.`
  });

  // We ask Gemini to generate an image based on the reference photo and prompt
  const requestBody = JSON.stringify({
    contents: [
      {
        parts
      },
    ],
    generationConfig: {
      responseModalities: ["TEXT", "IMAGE"],
    },
  });

  let lastError = null;

  for (const model of CANDIDATE_MODELS) {
    try {
      console.log(`Attempting image generation with model: ${model}`);
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey,
        },
        body: requestBody,
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        const errorMsg = payload?.error?.message || `HTTP ${response.status}`;
        console.warn(`Model ${model} failed (${response.status}): ${errorMsg}`);
        lastError = `[${model}] ${errorMsg}`;
        continue;
      }

      const candidate = payload.candidates?.[0];
      if (candidate?.finishReason === 'SAFETY') {
        return res.status(502).json({ error: 'Image was blocked by AI safety filters. Please try another photo.' });
      }

      const allParts = candidate?.content?.parts ?? [];
      const imagePart = allParts.find(
        (p) => (p.inlineData && p.inlineData.data) || (p.inline_data && p.inline_data.data)
      );

      const textPart = allParts.find((p) => p.text);
      if (textPart?.text) {
        console.log(`Model ${model} returned text: ${textPart.text}`);
      }

      if (imagePart) {
        const data = imagePart.inlineData?.data || imagePart.inline_data?.data;
        const mime = imagePart.inlineData?.mimeType || imagePart.inline_data?.mime_type || 'image/jpeg';
        console.log(`Successfully generated image using model: ${model}`);
        return res.status(200).json({
          imageBase64: data,
          mimeType: mime,
          movieId,
        });
      }

      if (textPart?.text) {
        console.warn(`Model ${model} returned text instead of image.`);
        lastError = `Model returned text only: ${textPart.text.slice(0, 150)}`;
      } else {
        lastError = `Model ${model} returned no image data`;
      }
    } catch (err) {
      console.error(`Fetch exception for ${model}:`, err);
      lastError = err.message;
    }
  }

  console.error('All candidate Gemini models failed. Last error:', lastError);

  let userFriendlyError = lastError || 'Gemini returned no image.';
  if (lastError && (lastError.includes('limit: 0') || lastError.includes('quota') || lastError.includes('429'))) {
    userFriendlyError = 'Google AI Studio quota limit exceeded or zero quota available.';
  }

  return res.status(502).json({
    error: userFriendlyError,
    details: lastError,
  });
}
