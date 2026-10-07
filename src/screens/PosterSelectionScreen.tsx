// El Gouna Film Festival Photo Booth — Poster Selection Screen

import { useState, useMemo } from 'react';
import { BoothButton } from '../components/BoothButton';
import { motion, AnimatePresence } from 'framer-motion';
import { useBooth } from '../context/BoothContext';
import { getMoviesByCategory } from '../data/movies';
import { translations } from '../i18n/translations';
import type { MovieCategory } from '../data/movies';
import type { Movie } from '../types';

const spring = { type: 'spring' as const, damping: 28, stiffness: 120 };

// Fake poster images until real ones are placed in /public/posters/
const POSTER_FALLBACK_COLORS = [
  '#2a1a0e', '#1a0e2a', '#0e2a1a', '#2a0e1a', '#1a2a0e', '#0e1a2a',
];

interface PosterCardProps {
  movie: Movie;
  selected: boolean;
  onSelect: (movie: Movie) => void;
  index: number;
}

function PosterCard({ movie, selected, onSelect, index }: PosterCardProps) {
  const { state } = useBooth();
  const isAr = state.session.language === 'ar';

  return (
    <motion.div
      className={`poster-card ${selected ? 'selected' : ''}`}
      onClick={() => onSelect(movie)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...spring, delay: index * 0.06 }}
      whileTap={{ scale: 0.96 }}
      data-testid={`poster-card-${movie.id}`}
    >
      {/* Poster Image */}
      <div style={{
        width: '100%',
        height: '100%',
        background: POSTER_FALLBACK_COLORS[index % POSTER_FALLBACK_COLORS.length],
        position: 'relative',
        overflow: 'hidden',
      }}>
        <img
          src={movie.posterPath}
          alt={isAr ? movie.titleAr : movie.titleEn}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          onError={(e) => {
            // Keep fallback color background, hide broken img
            (e.currentTarget as HTMLImageElement).style.opacity = '0';
          }}
        />

        {/* Cinematic vignette overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.5) 100%)',
        }} />

        {/* Film frame decorators */}
        <div style={{
          position: 'absolute', top: 6, left: 6, right: 6, bottom: 6,
          border: '1px solid rgba(201,162,39,0.1)',
          borderRadius: '1px',
          pointerEvents: 'none',
        }} />

        {/* Fallback title display when image fails */}
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          padding: '16px',
          opacity: 0.7,
        }}>
          <div style={{
            fontFamily: 'var(--font-arabic)',
            fontSize: '1.1rem',
            color: 'var(--c-gold)',
            textAlign: 'center',
            direction: 'rtl',
            textShadow: '0 1px 4px rgba(0,0,0,0.8)',
          }}>
            {movie.titleAr}
          </div>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: '0.7rem',
            color: 'rgba(201,162,39,0.6)',
            fontStyle: 'italic',
            marginTop: 6,
            textAlign: 'center',
          }}>
            {movie.titleEn}
          </div>
        </div>
      </div>

      {/* Title overlay */}
      <div className="poster-card-overlay">
        <div className="poster-card-title">{isAr ? movie.titleAr : movie.titleEn}</div>
        {isAr && <div className="poster-card-title-en">{movie.titleEn}</div>}
      </div>

      {/* Selected checkmark */}
      {selected && (
        <div className="poster-selected-badge">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M2 7L5.5 10.5L12 4" stroke="#0a0806" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      )}
    </motion.div>
  );
}

interface PosterSelectionProps {
  onBack: () => void;
  onConfirm: (movie: Movie) => void;
}

export function PosterSelectionScreen({ onBack, onConfirm }: PosterSelectionProps) {
  const { state, selectMovie } = useBooth();
  const { language, selectedMovie } = state.session;
  const tr = translations[language];
  const isAr = language === 'ar';

  const [activeCategory, setActiveCategory] = useState<MovieCategory>('all');
  const [pendingMovie, setPendingMovie] = useState<Movie | null>(selectedMovie);

  const filteredMovies = useMemo(
    () => getMoviesByCategory(activeCategory),
    [activeCategory]
  );

  const categories: MovieCategory[] = ['all', 'drama', 'comedy', 'action', 'romance'];

  const handleSelect = (movie: Movie) => {
    setPendingMovie(movie);
    selectMovie(movie);
  };

  const handleConfirm = () => {
    if (pendingMovie) {
      selectMovie(pendingMovie);
      onConfirm(pendingMovie);
    }
  };

  return (
    <div className="booth-screen" data-testid="screen-poster-selection" dir={isAr ? 'rtl' : 'ltr'}>
      {/* Background */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(180deg, #0a0806 0%, #1a1208 50%, #0a0806 100%)',
      }} />

      {/* Ambient glow */}
      <div className="ambient-glow" style={{
        width: '40%', height: '40%',
        background: 'radial-gradient(circle, #c9a227 0%, transparent 70%)',
        top: '0%', right: '-10%',
        opacity: 0.08,
      }} />

      {/* Corner decorations */}
      <div className="corner-decor tl" />
      <div className="corner-decor tr" />
      <div className="corner-decor bl" />
      <div className="corner-decor br" />

      {/* Content layout */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        padding: '40px 48px',
      }}>
        {/* Header */}
        <motion.div
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexShrink: 0 }}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={spring}
        >
          {/* Back button */}
          <BoothButton
            className="btn-cinematic btn-ghost"
            onClick={onBack}
            style={{ padding: '10px 20px', fontSize: '0.9rem', minWidth: 0 }}
            data-testid="btn-back"
          >
            {isAr ? '← رجوع' : '← Back'}
          </BoothButton>

          {/* Progress indicator */}
          <div className="progress-steps">
            <div className="progress-dot active" title={isAr ? 'اختيار الملصق' : 'Choose Poster'} />
            <div className="progress-line" />
            <div className="progress-dot" />
            <div className="progress-line" />
            <div className="progress-dot" />
            <div className="progress-line" />
            <div className="progress-dot" />
          </div>

          {/* El Gouna wordmark */}
          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: '0.7rem',
              letterSpacing: '0.2em',
              color: 'rgba(201,162,39,0.6)',
              textTransform: 'uppercase',
            }}>
              El Gouna FF
            </div>
          </div>
        </motion.div>

        {/* Title */}
        <motion.div
          style={{ textAlign: isAr ? 'right' : 'left', marginBottom: '20px', flexShrink: 0 }}
          initial={{ opacity: 0, x: isAr ? 20 : -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ ...spring, delay: 0.1 }}
        >
          <h1 style={{
            fontFamily: isAr ? 'var(--font-arabic)' : 'var(--font-display)',
            fontSize: 'clamp(1.5rem, 4vw, 2.8rem)',
            color: 'var(--c-cream)',
            fontWeight: isAr ? 700 : 600,
            lineHeight: 1.2,
          }}>
            {isAr ? 'اختر ملصقك' : 'Choose Your Poster'}
          </h1>
          <p style={{
            fontFamily: isAr ? 'var(--font-arabic)' : 'var(--font-body)',
            fontSize: '0.9rem',
            color: 'var(--c-cream-dim)',
            marginTop: '8px',
          }}>
            {isAr
              ? 'اختر من مجموعتنا من الأفلام المصرية الكلاسيكية'
              : 'Select from our collection of classic Egyptian films'}
          </p>
          <div className="gold-divider" style={{ marginTop: 14, marginLeft: isAr ? 'auto' : 0, marginRight: isAr ? 0 : 'auto' }} />
        </motion.div>

        {/* Category Tabs */}
        <motion.div
          className="category-tabs"
          style={{ marginBottom: '20px', flexShrink: 0 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {categories.map((cat) => {
            const labels = {
              all: isAr ? 'الكل' : 'All',
              drama: isAr ? 'دراما' : 'Drama',
              comedy: isAr ? 'كوميديا' : 'Comedy',
              action: isAr ? 'أكشن' : 'Action',
              romance: isAr ? 'رومانسي' : 'Romance',
            };
            return (
              <BoothButton
                key={cat}
                className={`category-tab ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
                data-testid={`tab-${cat}`}
              >
                {labels[cat]}
              </BoothButton>
            );
          })}
        </motion.div>

        {/* Poster Grid — scrollable */}
        <div className="scroll-area" style={{ flex: 1, paddingBottom: '20px' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '16px',
          }}>
            <AnimatePresence mode="popLayout">
              {filteredMovies.map((movie, i) => (
                <PosterCard
                  key={movie.id}
                  movie={movie}
                  selected={pendingMovie?.id === movie.id}
                  onSelect={handleSelect}
                  index={i}
                />
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Bottom CTA */}
        <AnimatePresence>
          {pendingMovie && (
            <motion.div
              style={{
                flexShrink: 0, paddingTop: '16px',
                display: 'flex', flexDirection: 'column', gap: '12px',
                borderTop: '1px solid rgba(201,162,39,0.15)',
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={spring}
            >
              <div style={{
                fontFamily: isAr ? 'var(--font-arabic)' : 'var(--font-body)',
                fontSize: '0.9rem',
                color: 'var(--c-cream-dim)',
                textAlign: 'center',
              }}>
                {isAr ? 'تم اختيار:' : 'Selected:'}{' '}
                <span style={{ color: 'var(--c-gold)' }}>
                  {isAr ? pendingMovie.titleAr : pendingMovie.titleEn}
                </span>
              </div>

              <BoothButton
                className={`btn-cinematic btn-primary ${isAr ? 'btn-arabic' : ''}`}
                onClick={handleConfirm}
                style={{ width: '100%', padding: '20px' }}
                data-testid="btn-confirm-poster"
              >
                {isAr ? 'تأكيد الاختيار ←' : 'Confirm Selection →'}
              </BoothButton>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
