// El Gouna Film Festival Photo Booth — Types

export type Language = 'ar' | 'en';
export type Direction = 'rtl' | 'ltr';

export type WizardStep =
  | 'welcome'
  | 'poster-selection'
  | 'poster-confirm'
  | 'camera'
  | 'generating'
  | 'result'
  | 'edit'
  | 'qr';

export type FilterType = 'original' | 'warm' | 'bw' | 'cinematic' | 'bright';

export interface Movie {
  id: string;
  titleAr: string;
  titleEn: string;
  posterPath: string;
  category: string;
  aiPrompt: string;
  hidden?: boolean;
  generationConfig?: {
    style?: string;
    aspectRatio?: string;
  };
}

export interface Session {
  id: string;
  language: Language;
  selectedMovie: Movie | null;
  capturedPhoto: string | null;
  generatedImage: string | null;
  editedImage: string | null;
  appliedFilter: FilterType;
  imageUrl: string | null;
  qrUrl: string | null;
  createdAt: string;
  status: 'idle' | 'capturing' | 'generating' | 'complete' | 'error';
}

export interface CameraState {
  stream: MediaStream | null;
  error: string | null;
  ready: boolean;
  facingMode: 'user' | 'environment';
}

export interface GenerationResult {
  imageBase64: string;
  mimeType: string;
}
