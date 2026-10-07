// El Gouna Film Festival Photo Booth — Movie Data
// Each movie has an AI prompt describing how to place the user in the poster

import type { Movie } from '../types';

export const movies: Movie[] = [
  {
    id: 'emara-w-kebeba',
    titleAr: 'عمارة يعقوبيان',
    titleEn: 'The Yacoubian Building',
    posterPath: '/posters/yacoubian.jpg',
    category: 'drama',
    aiPrompt: `Place the subject as the central hero in an Egyptian classic cinema poster style.
The poster should have a dramatic, vintage film aesthetic with warm sepia and gold tones.
The subject should appear in period-appropriate attire (1940s-1950s Egyptian style).
Replace the main character in the Yacoubian Building movie poster style:
- Dramatic lighting from above
- Architectural Cairo cityscape in background
- Film grain overlay
- Classic Arabic movie poster typography frame
- Cinematic deep shadows and warm golden highlights
- The subject's face should be prominently featured as the lead actor/actress`,
    generationConfig: { style: 'cinematic', aspectRatio: '2:3' },
  },
  {
    id: 'bab-el-hadid',
    titleAr: 'باب الحديد',
    titleEn: 'Cairo Station',
    posterPath: '/posters/cairo-station.jpg',
    category: 'drama',
    aiPrompt: `Transform the subject into the hero of a vintage Egyptian black-and-white cinema poster in the style of Bab El Hadid (Cairo Station, 1958).
Style requirements:
- Classic black and white film noir aesthetic
- Cairo train station environment in background
- 1950s Egyptian character styling
- Dramatic shadow play and high contrast lighting
- Vintage film grain and scratches overlay
- The subject replaces the lead character with their natural face preserved
- Classic Arabic cinema title card styling around the frame`,
    generationConfig: { style: 'noir', aspectRatio: '2:3' },
  },
  {
    id: 'ismail-yassin',
    titleAr: 'إسماعيل يس في الجيش',
    titleEn: 'Ismail Yassin in the Army',
    posterPath: '/posters/ismail-yassin.jpg',
    category: 'comedy',
    aiPrompt: `Place the subject as the comedic lead in a classic Egyptian comedy film poster from the 1950s.
Style requirements:
- Bright, colorful vintage Egyptian poster aesthetic
- Military comedy setting with humor
- Exaggerated comedic expression preserved from subject
- Warm vintage color palette (yellows, reds, greens)
- Classic Arabic comedy poster typography
- Playful background elements of Egyptian military
- Film grain and vintage print texture overlay`,
    generationConfig: { style: 'vintage-comedy', aspectRatio: '2:3' },
  },
  {
    id: 'el-ardh',
    titleAr: 'الأرض',
    titleEn: 'The Land',
    posterPath: '/posters/el-ardh.jpg',
    category: 'drama',
    aiPrompt: `Transform the subject into the heroic lead of a dramatic Egyptian agrarian epic film poster in the style of Al-Ard (The Land).
Style requirements:
- Epic, sweeping Egyptian farmland panorama in background
- Warm golden-hour sunlight on the subject's face
- Strong, resolute heroic posture (replace from the subject's natural pose)
- Earth tones: ochres, browns, warm golds
- Classic Egyptian dramatic film poster composition
- The subject should appear as a determined Egyptian farmer/protagonist
- Vintage Arabic cinema poster typography framing`,
    generationConfig: { style: 'epic-drama', aspectRatio: '2:3' },
  },
  {
    id: 'el-wedad',
    titleAr: 'الوداع يا بونابرت',
    titleEn: 'Farewell Bonaparte',
    posterPath: '/posters/farewell-bonaparte.jpg',
    category: 'romance',
    aiPrompt: `Place the subject as the romantic lead in a lavish Egyptian historical romance film poster from the era of Napoleon's campaign in Egypt.
Style requirements:
- Grand historical epic aesthetic
- Egyptian pyramids and Nile river in soft focus background
- Period costume elements suggested around subject (Egyptian/French period)
- Dramatic romantic lighting with warm golden glow
- Rich color palette: deep blues, golds, creams
- Classic Egyptian cinema poster style with ornate typography frame
- Cinematic and theatrical composition`,
    generationConfig: { style: 'historical-romance', aspectRatio: '2:3' },
  },
  {
    id: 'khalli-balak',
    titleAr: 'خلي بالك من زوزو',
    titleEn: 'Watch Out for Zuzu',
    posterPath: '/posters/zuzu.jpg',
    category: 'comedy',
    aiPrompt: `Transform the subject into the lead of a vibrant, colorful classic Egyptian musical comedy poster from the 1970s.
Style requirements:
- Bright, cheerful color palette typical of 1970s Egyptian cinema
- Musical and dance aesthetic
- Joyful, expressive composition
- Warm vintage yellows and oranges
- Egyptian entertainment district setting (cafes, lights)
- Classic Arabic musical comedy poster typography
- The subject appears as the charming comedic lead
- Retro 70s grain and color treatment`,
    generationConfig: { style: 'musical-comedy', aspectRatio: '2:3' },
  },
  {
    id: 'el-harreef',
    titleAr: 'الحريف',
    titleEn: 'The Streetplayer',
    posterPath: '/posters/el-harreef.png',
    category: 'drama',
    aiPrompt: 'The poster is El Harreef (The Streetplayer, 1983). The person to replace is the man in the blue shirt standing in the center/lower-middle holding a ball with his foot.',
    generationConfig: { style: 'drama', aspectRatio: '2:3' },
  },
  {
    id: 'welad-el-eih',
    titleAr: 'ولاد الإيه',
    titleEn: 'Welad El-Eih',
    posterPath: '/posters/welad-el-eih.png',
    category: 'action',
    aiPrompt: 'The poster is Welad El-Eih. The person to replace is the man in the center (Ahmed Zaki) running shirtless with a towel around his waist. Match his skin tone, lighting, and pose exactly.',
    generationConfig: { style: 'action', aspectRatio: '2:3' },
  },
  {
    id: 'el-ayam',
    titleAr: 'الأيام',
    titleEn: 'The Days',
    posterPath: '/posters/el-ayam.png',
    category: 'drama',
    aiPrompt: 'The poster is Al-Ayam (The Days). The person to replace is the man in the center (Ahmed Zaki) wearing round dark glasses. Keep the glasses and match the yellow/green vintage lighting of the poster.',
    generationConfig: { style: 'drama', aspectRatio: '2:3' },
  },
  {
    id: 'the-godfather',
    titleAr: 'الأب الروحي',
    titleEn: 'The Godfather',
    posterPath: '/posters/the-godfather.png',
    category: 'drama',
    aiPrompt: 'The poster is The Godfather. The person to replace is the man in the center (Marlon Brando) in a tuxedo with a red rose.',
    generationConfig: { style: 'drama', aspectRatio: '2:3' },
  },
];

export const movieCategories = ['all', 'drama', 'comedy', 'action', 'romance'] as const;
export type MovieCategory = typeof movieCategories[number];

export function getMoviesByCategory(category: MovieCategory): Movie[] {
  if (category === 'all') return movies;
  return movies.filter(m => m.category === category);
}
