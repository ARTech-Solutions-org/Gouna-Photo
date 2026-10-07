// El Gouna Film Festival Photo Booth — Session Context

import React, { createContext, useContext, useCallback, useReducer } from 'react';
import type { Session, WizardStep, Movie, Language, FilterType } from '../types';

function generateSessionId(): string {
  return `gouna-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function createInitialSession(language: Language = 'ar'): Session {
  return {
    id: generateSessionId(),
    language,
    selectedMovie: null,
    capturedPhoto: null,
    generatedImage: null,
    editedImage: null,
    appliedFilter: 'original',
    imageUrl: null,
    qrUrl: null,
    createdAt: new Date().toISOString(),
    status: 'idle',
  };
}

// State
interface BoothState {
  session: Session;
  step: WizardStep;
  isGenerating: boolean;
  isUploading: boolean;
  generationError: string | null;
  uploadError: string | null;
  generationProgress: number;
}

// Actions
type BoothAction =
  | { type: 'SET_LANGUAGE'; language: Language }
  | { type: 'SELECT_MOVIE'; movie: Movie }
  | { type: 'SET_CAPTURED_PHOTO'; photo: string }
  | { type: 'SET_GENERATED_IMAGE'; image: string }
  | { type: 'SET_EDITED_IMAGE'; image: string }
  | { type: 'SET_FILTER'; filter: FilterType }
  | { type: 'SET_IMAGE_URL'; url: string }
  | { type: 'SET_QR_URL'; url: string }
  | { type: 'SET_STEP'; step: WizardStep }
  | { type: 'SET_GENERATING'; isGenerating: boolean }
  | { type: 'SET_UPLOADING'; isUploading: boolean }
  | { type: 'SET_GENERATION_ERROR'; error: string | null }
  | { type: 'SET_UPLOAD_ERROR'; error: string | null }
  | { type: 'SET_GENERATION_PROGRESS'; progress: number }
  | { type: 'RESET_SESSION' };

function boothReducer(state: BoothState, action: BoothAction): BoothState {
  switch (action.type) {
    case 'SET_LANGUAGE':
      return {
        ...state,
        session: { ...state.session, language: action.language },
      };
    case 'SELECT_MOVIE':
      return {
        ...state,
        session: { ...state.session, selectedMovie: action.movie },
      };
    case 'SET_CAPTURED_PHOTO':
      return {
        ...state,
        session: { ...state.session, capturedPhoto: action.photo, status: 'capturing' },
      };
    case 'SET_GENERATED_IMAGE':
      return {
        ...state,
        session: {
          ...state.session,
          generatedImage: action.image,
          editedImage: action.image,
          status: 'complete',
        },
      };
    case 'SET_EDITED_IMAGE':
      return {
        ...state,
        session: { ...state.session, editedImage: action.image },
      };
    case 'SET_FILTER':
      return {
        ...state,
        session: { ...state.session, appliedFilter: action.filter },
      };
    case 'SET_IMAGE_URL':
      return {
        ...state,
        session: { ...state.session, imageUrl: action.url },
      };
    case 'SET_QR_URL':
      return {
        ...state,
        session: { ...state.session, qrUrl: action.url },
      };
    case 'SET_STEP':
      return { ...state, step: action.step };
    case 'SET_GENERATING':
      return { ...state, isGenerating: action.isGenerating };
    case 'SET_UPLOADING':
      return { ...state, isUploading: action.isUploading };
    case 'SET_GENERATION_ERROR':
      return { ...state, generationError: action.error };
    case 'SET_UPLOAD_ERROR':
      return { ...state, uploadError: action.error };
    case 'SET_GENERATION_PROGRESS':
      return { ...state, generationProgress: action.progress };
    case 'RESET_SESSION':
      return {
        ...state,
        session: createInitialSession(state.session.language),
        step: 'welcome',
        isGenerating: false,
        isUploading: false,
        generationError: null,
        uploadError: null,
        generationProgress: 0,
      };
    default:
      return state;
  }
}

// Context
interface BoothContextValue {
  state: BoothState;
  dispatch: React.Dispatch<BoothAction>;
  // Convenience helpers
  setLanguage: (lang: Language) => void;
  selectMovie: (movie: Movie) => void;
  setCapturedPhoto: (photo: string) => void;
  setGeneratedImage: (image: string) => void;
  setEditedImage: (image: string) => void;
  setFilter: (filter: FilterType) => void;
  setStep: (step: WizardStep) => void;
  setQrUrl: (url: string) => void;
  setImageUrl: (url: string) => void;
  resetSession: () => void;
}

const BoothContext = createContext<BoothContextValue | null>(null);

export function BoothProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(boothReducer, {
    session: createInitialSession('ar'),
    step: 'welcome',
    isGenerating: false,
    isUploading: false,
    generationError: null,
    uploadError: null,
    generationProgress: 0,
  });

  const setLanguage = useCallback((lang: Language) => dispatch({ type: 'SET_LANGUAGE', language: lang }), []);
  const selectMovie = useCallback((movie: Movie) => dispatch({ type: 'SELECT_MOVIE', movie }), []);
  const setCapturedPhoto = useCallback((photo: string) => dispatch({ type: 'SET_CAPTURED_PHOTO', photo }), []);
  const setGeneratedImage = useCallback((image: string) => dispatch({ type: 'SET_GENERATED_IMAGE', image }), []);
  const setEditedImage = useCallback((image: string) => dispatch({ type: 'SET_EDITED_IMAGE', image }), []);
  const setFilter = useCallback((filter: FilterType) => dispatch({ type: 'SET_FILTER', filter }), []);
  const setStep = useCallback((step: WizardStep) => dispatch({ type: 'SET_STEP', step }), []);
  const setQrUrl = useCallback((url: string) => dispatch({ type: 'SET_QR_URL', url }), []);
  const setImageUrl = useCallback((url: string) => dispatch({ type: 'SET_IMAGE_URL', url }), []);
  const resetSession = useCallback(() => dispatch({ type: 'RESET_SESSION' }), []);

  return (
    <BoothContext.Provider
      value={{
        state,
        dispatch,
        setLanguage,
        selectMovie,
        setCapturedPhoto,
        setGeneratedImage,
        setEditedImage,
        setFilter,
        setStep,
        setQrUrl,
        setImageUrl,
        resetSession,
      }}
    >
      {children}
    </BoothContext.Provider>
  );
}

export function useBooth(): BoothContextValue {
  const ctx = useContext(BoothContext);
  if (!ctx) throw new Error('useBooth must be used within BoothProvider');
  return ctx;
}
