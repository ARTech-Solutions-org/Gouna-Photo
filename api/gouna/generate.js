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

  if (!imageBase64) {
    return res.status(400).json({ error: 'Missing image data.' });
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

  const identityRules = `Use the person from Image 1 (the reference photo) as the main character. Preserve their facial identity, facial structure, skin tone, hairstyle, facial hair and glasses (if any) as accurately as possible, exactly as in the reference photo. Do not copy any cap, hat or earphones from the reference photo. The original actor's face must not appear anywhere.`;

  // برومت مخصوص لكل فيلم. ضيف باقي الأفلام بنفس الطريقة
  const moviePrompts = {
    'the-godfather': `Create a moody, cinematic portrait recreating the classic vintage mafia movie poster shown in Image 2.

Dress the person in a classic black tuxedo with a white dress shirt, black bow tie, and a red rose boutonniere on the left lapel. Pose them like a powerful mafia boss, seated confidently with one hand raised near the face, with a calm, intimidating and authoritative expression.

Use dramatic low-key cinematic lighting with warm amber and golden tones, deep shadows, strong contrast, subtle highlights on the face, and a dark almost-black background. Keep the soft glowing rectangular light panels behind on the left side and the leather chair edge on the right.

Give the image the look of a 1970s-1980s classic crime-film poster: warm brown/golden color grading, slightly faded vintage tones, realistic photographic texture, subtle film grain, cinematic shadows and an elegant old-Hollywood atmosphere.

Frame it as a medium close-up / upper-body portrait, centered and symmetrical, with the same portrait aspect ratio as Image 2.

At the bottom, keep the gold "The Godfather" title, the marionette-hand/string emblem and the small credits text exactly as in Image 2: same typeface, position and colors. Do not add any other graphic elements, logos, extra text or watermarks.`,

    'welad-el-eih': `Create a realistic vintage Egyptian movie poster photograph recreating the poster shown in Image 2.

Show the person running toward the camera with a bare chest, wearing a white cloth wrapped around the waist and holding it with one hand, with an intense, urgent expression. Keep the same pose, body position, camera angle and framing as in Image 2.

Use soft overcast daylight outdoors, natural skin tones, muted and slightly faded colors, visible film grain and the printed-paper texture of an old 1980s poster. Keep the red and white bus and the street crowd in the background exactly as in Image 2.

Keep the poster's title, the actor names and credits and all Arabic text exactly as in Image 2: same position, size and colors. Keep the same portrait aspect ratio as Image 2. Do not add any other graphic elements, logos, extra text or watermarks.`,

    'el-ayam': `Create a vintage Egyptian movie poster recreating the poster shown in Image 2.

The person is the head-and-shoulders portrait inside the large yellow circle: wearing a white collared shirt and round dark sunglasses like the original, looking toward the camera with a calm, confident expression. Keep the same head angle, size and position as in Image 2.

Use soft flat studio lighting with warm yellow-olive tones, slightly faded colors, light film grain and the printed-paper texture of an old poster. Keep the yellow circle, the olive-green background with the faint pharaonic relief figures, and the decorative ornaments exactly as in Image 2.

Keep the title "الأيام / THE DAYS" in dark ornate calligraphy, the actor names, the credits and all Arabic text exactly as in Image 2: same position, size and colors. Keep the same portrait aspect ratio as Image 2. Do not add any other graphic elements, logos, extra text or watermarks.`,

    'el-harreef': `Create a vintage Egyptian screen-print movie poster recreating the poster shown in Image 2.

Replace only the small full-body footballer in the middle: the person wears a dark blue sweater and grey trousers and is dribbling a football mid-step, with the same pose, body position and size as the original figure. Render the person with the same high-contrast graphic print treatment as the poster, using limited blue, black and white tones, while the face stays clearly recognizable.

Keep everything else exactly as in Image 2: the large black-and-white illustrated face in the background, the blue background, the row of street lamps, the white shapes, the title "الحريف / STREETPLAYER", the actor names, the credits and all Arabic and English text. Keep the aged folded-paper creases and print texture. Keep the same portrait aspect ratio as Image 2. Do not add any other graphic elements, logos, extra text or watermarks.`,
  };

  const defaultPrompt = `Recreate the vintage movie poster shown in Image 2, replacing ${hero} with the person from Image 1. Keep the same pose, clothing, composition, lighting, color grading, film grain and print texture as the original poster, but relight the person so they belong naturally in the scene. Keep the poster's title, credits and all text exactly as in Image 2. Do not add any other graphic elements, logos or watermarks.`;

  const finalPrompt = `${identityRules}

${moviePrompts[movieId] || defaultPrompt}

Output the final poster as an image.`;

  const parts = [];

  parts.push({ text: 'Image 1 (reference photo of the person):' });
  parts.push({
    inline_data: {
      mime_type: mimeType,
      data: cleanBase64,
    },
  });

  if (posterBase64) {
    parts.push({ text: 'Image 2 (the original movie poster):' });
    parts.push({
      inline_data: {
        mime_type: posterMime,
        data: posterBase64,
      },
    });
  }

  parts.push({ text: finalPrompt });

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
