// El Gouna Film Festival Photo Booth — Poster Confirm Screen


import { BoothButton } from '../components/BoothButton';
import { motion } from 'framer-motion';
import { useBooth } from '../context/BoothContext';

const spring = { type: 'spring' as const, damping: 28, stiffness: 120 };

interface PosterConfirmProps {
  onBack: () => void;
  onContinue: () => void;
}

export function PosterConfirmScreen({ onBack, onContinue }: PosterConfirmProps) {
  const { state } = useBooth();
  const { language, selectedMovie } = state.session;
  const isAr = language === 'ar';

  if (!selectedMovie) return null;

  return (
    <div className="booth-screen" data-testid="screen-poster-confirm" dir={isAr ? 'rtl' : 'ltr'}>
      {/* Background */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(180deg, #0a0806 0%, #1a1208 50%, #0a0806 100%)',
      }} />

      {/* Ambient glow */}
      <div className="ambient-glow" style={{
        width: '60%', height: '60%',
        background: 'radial-gradient(circle, #c9a227 0%, transparent 70%)',
        top: '20%', left: '50%', transform: 'translateX(-50%)',
        opacity: 0.06,
      }} />

      {/* Corner decorations */}
      <div className="corner-decor tl" />
      <div className="corner-decor tr" />
      <div className="corner-decor bl" />
      <div className="corner-decor br" />

      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'space-between',
        padding: '48px 56px',
      }}>
        {/* Header */}
        <motion.div
          style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={spring}
        >
          <BoothButton
            className="btn-cinematic btn-ghost"
            onClick={onBack}
            style={{ padding: '10px 20px', fontSize: '0.9rem' }}
          >
            {isAr ? '← رجوع' : '← Back'}
          </BoothButton>

          <div className="progress-steps">
            <div className="progress-dot done" />
            <div className="progress-line done" />
            <div className="progress-dot active" />
            <div className="progress-line" />
            <div className="progress-dot" />
            <div className="progress-line" />
            <div className="progress-dot" />
          </div>

          <div style={{ width: '80px' }} />
        </motion.div>

        {/* Title */}
        <motion.div
          style={{ textAlign: 'center' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring, delay: 0.1 }}
        >
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: '0.85rem',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: 'rgba(201,162,39,0.6)',
            marginBottom: '12px',
          }}>
            {isAr ? 'الملصق المختار' : 'Selected Poster'}
          </div>
          <h1 style={{
            fontFamily: isAr ? 'var(--font-arabic)' : 'var(--font-display)',
            fontSize: 'clamp(1.4rem, 3.5vw, 2.5rem)',
            color: 'var(--c-cream)',
            fontWeight: isAr ? 700 : 600,
            lineHeight: 1.3,
          }}>
            {isAr ? selectedMovie.titleAr : selectedMovie.titleEn}
          </h1>
          <div className="gold-divider" style={{ marginTop: 14 }} />
        </motion.div>

        {/* Poster Large Preview */}
        <motion.div
          style={{
            flex: 1, maxHeight: '55%', width: '70%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '20px 0',
          }}
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ ...spring, delay: 0.2 }}
        >
          <div style={{
            height: '100%',
            aspectRatio: '2 / 3',
            position: 'relative',
            borderRadius: '2px',
            overflow: 'hidden',
            boxShadow: '0 20px 80px rgba(0,0,0,0.8), 0 0 40px rgba(201,162,39,0.15)',
            border: '1px solid rgba(201,162,39,0.4)',
          }}>
            {/* Inner frame glow */}
            <div style={{
              position: 'absolute', inset: 0,
              boxShadow: 'inset 0 0 40px rgba(0,0,0,0.6)',
              zIndex: 1, pointerEvents: 'none',
            }} />

            <img
              src={selectedMovie.posterPath}
              alt={isAr ? selectedMovie.titleAr : selectedMovie.titleEn}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = 'none';
              }}
            />

            {/* Fallback poster visual */}
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(135deg, #2a1a0e, #1a0e2a)',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              padding: '24px',
            }}>
              <div style={{
                fontFamily: 'var(--font-arabic)',
                fontSize: '2rem',
                color: 'var(--c-gold)',
                textAlign: 'center',
                direction: 'rtl',
                textShadow: '0 2px 20px rgba(201,162,39,0.4)',
                lineHeight: 1.5,
              }}>
                {selectedMovie.titleAr}
              </div>
              <div className="gold-divider" style={{ marginTop: 16 }} />
              <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1rem',
                fontStyle: 'italic',
                color: 'rgba(201,162,39,0.6)',
                marginTop: 16,
              }}>
                {selectedMovie.titleEn}
              </div>
            </div>
          </div>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          style={{
            width: '100%', display: 'flex',
            flexDirection: 'column', gap: '14px',
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring, delay: 0.35 }}
        >
          <BoothButton
            className={`btn-cinematic btn-primary ${isAr ? 'btn-arabic' : ''}`}
            onClick={onContinue}
            style={{ width: '100%', padding: '22px' }}
            data-testid="btn-continue"
          >
            {isAr ? 'التقاط صورتي ✦' : '✦ Take My Photo'}
          </BoothButton>

          <BoothButton
            className={`btn-cinematic btn-ghost ${isAr ? 'btn-arabic' : ''}`}
            onClick={onBack}
            style={{ width: '100%', padding: '16px' }}
            data-testid="btn-change-poster"
          >
            {isAr ? 'تغيير الملصق' : 'Change Poster'}
          </BoothButton>
        </motion.div>
      </div>
    </div>
  );
}
