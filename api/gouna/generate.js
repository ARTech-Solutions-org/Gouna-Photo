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
  'gemini-2.0-pro-exp', // Good at instruction following and images
  'gemini-2.0-flash-exp',
  'gemini-exp-1206',
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
    'el-harreef': 'el-harreef.jpg',
  };

  const posterFilename = posterFiles[movieId];
  let posterBase64 = '';
  
  if (posterFilename) {
    try {
      const posterPath = path.join(process.cwd(), 'public', 'posters', posterFilename);
      const posterBuffer = fs.readFileSync(posterPath);
      posterBase64 = posterBuffer.toString('base64');
    } catch (e) {
      console.warn('Could not read poster file:', posterFilename, e.message);
    }
  }

  const parts = [
    {
      inline_data: {
        mime_type: mimeType,
        data: cleanBase64,
      },
    }
  ];

  if (posterBase64) {
    parts.push({
      inline_data: {
        mime_type: 'image/jpeg',
        data: posterBase64,
      },
    });
  }

  parts.push({
    text: `IMPORTANT: Use the uploaded movie poster as the EXACT visual source.
First image is the user's photo. Second image is the reference movie poster.

TASK:
${aiPrompt}

STRICT PRESERVATION RULES:
- Do NOT redesign the poster.
- Do NOT recreate the poster.
- Do NOT change the composition, layout, colors, typography, Arabic text, English text, logos, credits, drawings, background, lighting, or any other element.
- Do NOT remove, rewrite, translate, sharpen, stylize, or regenerate any existing text.
- Do NOT modify the background elements, street lights, buildings, shadows, or poster artwork.
- Do NOT change the poster's dimensions or aspect ratio.
- Preserve the original vintage Egyptian movie-poster aesthetic exactly.

PERSON REPLACEMENT:
- Identify the real photographed person standing in the center/lower-middle of the poster.
- Remove ONLY that person.
- Insert the user's person (from the first image) in exactly the same location and approximately the same scale.
- Match the original person's pose, body orientation, camera angle, perspective, head position, arm positions, leg positions, and overall silhouette as closely as possible.
- The user's face and identity must remain recognizable and natural.
- Adapt the user's clothing/body to realistically fit the pose and visual context.
- Match the poster's lighting, shadows, contrast, color temperature, grain, and vintage print texture.
- Make the inserted person look as if they was originally photographed/printed as part of this exact poster.
- Add realistic contact shadows where the person's feet/body interact with the original scene.
- Keep the replacement person integrated into the original poster rather than looking digitally pasted on.

VERY IMPORTANT:
The final result must look like the ORIGINAL MOVIE POSTER with the hero replaced by the user's person.
Think of this as a professional image-editing / inpainting operation, NOT an image-generation task.

OUTPUT:
Return the same poster with ONLY the central person replaced.
Everything else must remain pixel-level consistent with the original wherever possible.`
  });

  // We ask Gemini to generate an image based on the reference photo and prompt
  const requestBody = JSON.stringify({
    contents: [
      {
        parts
      },
    ],
    generationConfig: {
      temperature: 0.2,
      response_mime_type: 'image/jpeg',
    },
  });

  let lastError = null;

  for (const model of CANDIDATE_MODELS) {
    try {
      console.log(`Attempting image generation with model: ${model}`);
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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

      const textPart = allParts.find((p) => p.text);
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
